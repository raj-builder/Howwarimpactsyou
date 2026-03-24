/**
 * /api/prices.js  — Vercel Serverless Function
 * ─────────────────────────────────────────────────────────────────────────
 * Server-side proxy for commodity price data. Browser calls /api/prices.
 *
 * SOURCES:
 *   SerpAPI (Google Finance) → Crude Oil, Natural Gas, Gold, Copper, Aluminium
 *   World Bank API            → Urea (not available on Google Finance)
 *
 * SerpAPI budget: 250 calls/month. Strategy:
 *   - 1 call to google_finance_markets → Gold + Crude Oil (from futures array)
 *   - 3 individual calls → Natural Gas, Copper, Aluminium
 *   - Total: 4 SerpAPI calls per invocation
 *   - Cache: 24h at Vercel edge → ~4 calls/day max → ~120/month
 *
 * Cache: 24-hour Vercel Edge Cache (s-maxage=86400)
 * ─────────────────────────────────────────────────────────────────────────
 */

const SERP_API_KEY = process.env.SERP_API_KEY || '';
const SERP_BASE    = 'https://serpapi.com/search.json';
const WB_API_BASE  = 'https://api.worldbank.org/v2/en/indicator';

function pct(current, previous) {
  if (!previous || previous === 0 || current == null) return null;
  return parseFloat(((current - previous) / previous * 100).toFixed(2));
}

// ── Fetch SerpAPI Google Finance Markets (returns Gold + Crude Oil) ──────
async function fetchSerpMarkets() {
  const url = `${SERP_BASE}?engine=google_finance_markets&trend=most-active&api_key=${SERP_API_KEY}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error(`SerpAPI markets ${res.status}`);
  const json = await res.json();
  const futures = json?.markets?.futures || [];
  const result = {};

  for (const item of futures) {
    const ticker = item.stock;
    if (ticker === 'GCW00:COMEX') {
      result.gold = {
        price: item.price,
        pct:   item.price_movement?.percentage ?? null,
        movement: item.price_movement?.movement ?? null,
      };
    }
    if (ticker === 'CLW00:NYMEX') {
      result.crude = {
        price: item.price,
        pct:   item.price_movement?.percentage ?? null,
        movement: item.price_movement?.movement ?? null,
      };
    }
  }
  return result;
}

// ── Fetch individual commodity from SerpAPI Google Finance ───────────────
async function fetchSerpCommodity(ticker) {
  const url = `${SERP_BASE}?engine=google_finance&q=${ticker}&api_key=${SERP_API_KEY}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error(`SerpAPI ${ticker} ${res.status}`);
  const json = await res.json();

  // Price from the last graph data point
  const graph = json?.graph || [];
  const lastPoint = graph.length > 0 ? graph[graph.length - 1] : null;
  const price = lastPoint?.price ?? null;
  const date  = lastPoint?.date ?? null;

  // Also check markets.futures for Gold/Crude (bonus data from same call)
  const futures = json?.markets?.futures || [];
  const bonus = {};
  for (const item of futures) {
    if (item.stock === 'GCW00:COMEX') {
      bonus.gold = { price: item.price, pct: item.price_movement?.percentage ?? null, movement: item.price_movement?.movement ?? null };
    }
    if (item.stock === 'CLW00:NYMEX') {
      bonus.crude = { price: item.price, pct: item.price_movement?.percentage ?? null, movement: item.price_movement?.movement ?? null };
    }
  }

  // Summary if available (some tickers have it)
  const summary = json?.summary;

  return { price, date, summary, bonus };
}

// ── Fetch World Bank (Urea only) ────────────────────────────────────────
async function fetchWorldBank(indicator) {
  const url = `${WB_API_BASE}/${indicator}?format=json&per_page=4&mrv=4`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`WorldBank ${res.status}`);
  const json = await res.json();
  const rows = json?.[1]?.filter(r => r.value !== null);
  if (!rows || rows.length < 2) throw new Error('Insufficient WB data');
  return {
    price:      parseFloat(rows[0].value),
    prev_month: parseFloat(rows[1].value),
    period:     rows[0].date,
  };
}

// ── Main handler ───────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  // Cache at Vercel edge for 24 hours
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=7200');

  const commodities = {};
  const fetchedAt = new Date().toISOString();
  let serpOk = false;

  // ── SerpAPI: Fetch all commodities ──────────────────────────────────
  try {
    // Call 1: Markets endpoint → Gold + Crude Oil
    const marketsData = await fetchSerpMarkets();

    // Calls 2-4: Individual commodities
    const [natgasData, copperData, alumData] = await Promise.all([
      fetchSerpCommodity('NGW00:NYMEX').catch(e => ({ price: null, error: e.message })),
      fetchSerpCommodity('HGW00:COMEX').catch(e => ({ price: null, error: e.message })),
      fetchSerpCommodity('ALIW00:COMEX').catch(e => ({ price: null, error: e.message })),
    ]);

    // Use bonus Gold/Crude from individual calls as fallback
    const goldData  = marketsData.gold  || natgasData?.bonus?.gold  || copperData?.bonus?.gold  || {};
    const crudeData = marketsData.crude || natgasData?.bonus?.crude || copperData?.bonus?.crude || {};

    // Crude Oil
    if (crudeData.price) {
      commodities.brent = {
        id: 'brent', label: 'Crude Oil', unit: 'USD/bbl', exchange: 'NYMEX',
        price: crudeData.price,
        prev_24h: null, prev_month: null,
        pct_24h: crudeData.pct ? parseFloat(crudeData.pct.toFixed(2)) : null,
        pct_month: null,
        source: 'serpapi', source_ts: fetchedAt, period: 'realtime', status: 'ok',
      };
      serpOk = true;
    }

    // Natural Gas
    if (natgasData.price) {
      commodities.natgas = {
        id: 'natgas', label: 'Natural Gas', unit: 'USD/mmbtu', exchange: 'NYMEX',
        price: natgasData.price,
        prev_24h: null, prev_month: null,
        pct_24h: null, pct_month: null,
        source: 'serpapi', source_ts: fetchedAt, period: 'realtime', status: 'ok',
      };
      serpOk = true;
    }

    // Gold
    if (goldData.price) {
      commodities.gold = {
        id: 'gold', label: 'Gold', unit: 'USD/oz', exchange: 'COMEX',
        price: goldData.price,
        prev_24h: null, prev_month: null,
        pct_24h: goldData.pct ? parseFloat(goldData.pct.toFixed(2)) : null,
        pct_month: null,
        source: 'serpapi', source_ts: fetchedAt, period: 'realtime', status: 'ok',
      };
      serpOk = true;
    }

    // Copper (COMEX quotes in USD/lb, convert to USD/mt: 1 mt = 2204.62 lb)
    if (copperData.price) {
      commodities.copper = {
        id: 'copper', label: 'Copper', unit: 'USD/lb', exchange: 'COMEX',
        price: copperData.price,
        prev_24h: null, prev_month: null,
        pct_24h: null, pct_month: null,
        source: 'serpapi', source_ts: fetchedAt, period: 'realtime', status: 'ok',
      };
      serpOk = true;
    }

    // Aluminium
    if (alumData.price) {
      commodities.alum = {
        id: 'alum', label: 'Aluminium', unit: 'USD/lb', exchange: 'COMEX',
        price: alumData.price,
        prev_24h: null, prev_month: null,
        pct_24h: null, pct_month: null,
        source: 'serpapi', source_ts: fetchedAt, period: 'realtime', status: 'ok',
      };
      serpOk = true;
    }
  } catch (err) {
    console.error('SerpAPI error:', err.message);
  }

  // ── World Bank: Urea ───────────────────────────────────────────────
  try {
    const ureaData = await fetchWorldBank('PUREA');
    commodities.urea = {
      id: 'urea', label: 'Urea (Fert.)', unit: 'USD/mt', exchange: 'OTC·WB',
      price: ureaData.price,
      prev_24h: null, prev_month: ureaData.prev_month,
      pct_24h: null,
      pct_month: pct(ureaData.price, ureaData.prev_month),
      source: 'worldbank', source_ts: fetchedAt,
      period: ureaData.period, status: 'ok',
    };
  } catch (err) {
    commodities.urea = {
      id: 'urea', label: 'Urea (Fert.)', unit: 'USD/mt', exchange: 'OTC·WB',
      price: null, prev_24h: null, prev_month: null,
      pct_24h: null, pct_month: null,
      source: 'worldbank', status: 'error', error: err.message,
    };
  }

  res.status(200).json({
    fetched_at: fetchedAt,
    serp_api_ok: serpOk,
    commodities,
    meta: {
      commodity_source: serpOk ? 'SerpAPI / Google Finance (near-realtime)' : 'Fallback',
      urea_source: 'World Bank (monthly close)',
      cache_ttl_hrs: 24,
    },
  });
}
