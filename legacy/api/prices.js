/**
 * /api/prices.js  — Vercel Serverless Function
 * ─────────────────────────────────────────────────────────────────────────
 * Server-side proxy for commodity price data. Browser calls /api/prices.
 *
 * Strategy:
 *   1. Try SerpAPI google_finance for each commodity (4 calls total)
 *   2. Try World Bank for Urea (1 call)
 *   3. If any API fails → serve hardcoded "last known close" prices
 *
 * The hardcoded fallback represents approximate London/NYMEX closing
 * prices and is updated periodically. This ensures the price strip
 * ALWAYS shows data, even when APIs are down or quota is exhausted.
 *
 * Cache: 24h at Vercel edge (s-maxage=86400) to minimise API calls.
 * SerpAPI budget: 250 calls/month → 4 calls × ~30 cache misses = ~120.
 * ─────────────────────────────────────────────────────────────────────────
 */

const SERP_API_KEY = process.env.SERP_API_KEY || '';
const SERP_BASE    = 'https://serpapi.com/search.json';
const WB_API_BASE  = 'https://api.worldbank.org/v2/en/indicator';

// ── Hardcoded fallback: approximate closing prices (updated Mar 2025) ────
// These are served when all API calls fail. They are NOT live prices.
const FALLBACK = {
  brent:  { price: 91.5,  pct: null, label: 'Crude Oil',     unit: 'USD/bbl',  exchange: 'NYMEX',  asOf: '24 Mar 2025' },
  natgas: { price: 3.85,  pct: null, label: 'Natural Gas',   unit: 'USD/mmbtu',exchange: 'NYMEX',  asOf: '24 Mar 2025' },
  gold:   { price: 4448,  pct: null, label: 'Gold',          unit: 'USD/oz',   exchange: 'COMEX',  asOf: '24 Mar 2025' },
  copper: { price: 5.42,  pct: null, label: 'Copper',        unit: 'USD/lb',   exchange: 'COMEX',  asOf: '24 Mar 2025' },
  alum:   { price: 1.18,  pct: null, label: 'Aluminium',     unit: 'USD/lb',   exchange: 'COMEX',  asOf: '24 Mar 2025' },
  urea:   { price: 310.5, pct: null, label: 'Urea (Fert.)',  unit: 'USD/mt',   exchange: 'OTC·WB', asOf: 'Feb 2025' },
};

function pct(current, previous) {
  if (!previous || previous === 0 || current == null) return null;
  return parseFloat(((current - previous) / previous * 100).toFixed(2));
}

function makeCommodity(id, price, pctVal, source, fb) {
  return {
    id,
    label:      fb.label,
    unit:       fb.unit,
    exchange:   fb.exchange,
    price:      price ?? fb.price,
    prev_24h:   null,
    prev_month: null,
    pct_24h:    pctVal != null ? parseFloat(Number(pctVal).toFixed(2)) : null,
    pct_month:  null,
    source:     price != null ? source : 'fallback',
    source_ts:  new Date().toISOString(),
    period:     price != null ? 'realtime' : fb.asOf,
    status:     price != null ? 'ok' : 'fallback',
  };
}

// ── SerpAPI: Google Finance Markets (Gold + Crude Oil) ───────────────────
async function fetchSerpMarkets() {
  const url = `${SERP_BASE}?engine=google_finance_markets&trend=most-active&api_key=${SERP_API_KEY}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`SerpAPI markets ${res.status} ${res.statusText}`);
  const json = await res.json();
  if (json.error) throw new Error(`SerpAPI error: ${json.error}`);
  return json?.markets?.futures || [];
}

// ── SerpAPI: Individual commodity (Natural Gas, Copper, Aluminium) ───────
async function fetchSerpQuote(ticker) {
  const url = `${SERP_BASE}?engine=google_finance&q=${ticker}&api_key=${SERP_API_KEY}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`SerpAPI ${ticker} ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(`SerpAPI error: ${json.error}`);
  const graph = json?.graph || [];
  const last = graph.length > 0 ? graph[graph.length - 1] : null;
  return { price: last?.price ?? null };
}

// ── World Bank: Urea ────────────────────────────────────────────────────
async function fetchWorldBank(indicator) {
  const url = `${WB_API_BASE}/${indicator}?format=json&per_page=4&mrv=4`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`WorldBank ${res.status}`);
  const json = await res.json();
  const rows = json?.[1]?.filter(r => r.value !== null);
  if (!rows || rows.length < 2) throw new Error('Insufficient WB data');
  return { price: parseFloat(rows[0].value), prev: parseFloat(rows[1].value), period: rows[0].date };
}

// ── Main handler ────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  // Cache 24 hours, serve stale for 2 more hours while revalidating
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=7200');

  const commodities = {};
  const fetchedAt = new Date().toISOString();
  let serpOk = false;
  const errors = [];

  // ── Step 1: SerpAPI Markets → Gold + Crude Oil ────────────────────────
  let goldPrice = null, goldPct = null, crudePrice = null, crudePct = null;
  try {
    if (!SERP_API_KEY) throw new Error('SERP_API_KEY not configured');
    const futures = await fetchSerpMarkets();
    for (const item of futures) {
      if (item.stock === 'GCW00:COMEX') {
        goldPrice = item.price;
        goldPct = item.price_movement?.percentage ?? null;
      }
      if (item.stock === 'CLW00:NYMEX') {
        crudePrice = item.price;
        crudePct = item.price_movement?.percentage ?? null;
      }
    }
    if (goldPrice || crudePrice) serpOk = true;
  } catch (e) {
    errors.push('markets: ' + e.message);
  }

  // ── Step 2: SerpAPI Individual → Natural Gas, Copper, Aluminium ───────
  let natgasPrice = null, copperPrice = null, alumPrice = null;
  try {
    if (!SERP_API_KEY) throw new Error('SERP_API_KEY not configured');
    const [ng, cu, al] = await Promise.all([
      fetchSerpQuote('NGW00:NYMEX').catch(e => { errors.push('natgas: ' + e.message); return {}; }),
      fetchSerpQuote('HGW00:COMEX').catch(e => { errors.push('copper: ' + e.message); return {}; }),
      fetchSerpQuote('ALIW00:COMEX').catch(e => { errors.push('alum: ' + e.message); return {}; }),
    ]);
    natgasPrice = ng.price;
    copperPrice = cu.price;
    alumPrice = al.price;
    if (natgasPrice || copperPrice || alumPrice) serpOk = true;
  } catch (e) {
    errors.push('quotes: ' + e.message);
  }

  // ── Step 3: World Bank → Urea ─────────────────────────────────────────
  let ureaPrice = null, ureaPrev = null;
  try {
    const wb = await fetchWorldBank('PUREA');
    ureaPrice = wb.price;
    ureaPrev = wb.prev;
  } catch (e) {
    errors.push('urea: ' + e.message);
  }

  // ── Assemble response (always returns prices — fallback if needed) ────
  commodities.brent  = makeCommodity('brent',  crudePrice,  crudePct,  'serpapi', FALLBACK.brent);
  commodities.natgas = makeCommodity('natgas', natgasPrice, null,       'serpapi', FALLBACK.natgas);
  commodities.gold   = makeCommodity('gold',   goldPrice,   goldPct,   'serpapi', FALLBACK.gold);
  commodities.copper = makeCommodity('copper', copperPrice, null,       'serpapi', FALLBACK.copper);
  commodities.alum   = makeCommodity('alum',   alumPrice,   null,       'serpapi', FALLBACK.alum);

  // Urea: live or fallback
  if (ureaPrice != null) {
    commodities.urea = {
      id: 'urea', label: 'Urea (Fert.)', unit: 'USD/mt', exchange: 'OTC·WB',
      price: ureaPrice, prev_24h: null, prev_month: ureaPrev,
      pct_24h: null, pct_month: pct(ureaPrice, ureaPrev),
      source: 'worldbank', source_ts: fetchedAt, period: 'realtime', status: 'ok',
    };
  } else {
    commodities.urea = makeCommodity('urea', null, null, 'worldbank', FALLBACK.urea);
  }

  if (errors.length > 0) {
    console.warn('Price fetch errors:', errors.join(' | '));
  }

  res.status(200).json({
    fetched_at: fetchedAt,
    serp_api_ok: serpOk,
    commodities,
    meta: {
      source: serpOk ? 'SerpAPI / Google Finance' : 'Hardcoded fallback (approx. London close)',
      urea_source: ureaPrice ? 'World Bank' : 'Fallback',
      cache_ttl_hrs: 24,
      errors: errors.length > 0 ? errors : undefined,
    },
  });
}
