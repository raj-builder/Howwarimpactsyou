import { NextResponse } from 'next/server'

const SERP_API_KEY = process.env.SERP_API_KEY || ''
const SERP_BASE = 'https://serpapi.com/search.json'
const WB_API_BASE = 'https://api.worldbank.org/v2/en/indicator'

const FALLBACK = {
  brent: { price: 91.5, pct: null, label: 'Crude Oil', unit: 'USD/bbl', exchange: 'NYMEX', asOf: '24 Mar 2025' },
  natgas: { price: 3.85, pct: null, label: 'Natural Gas', unit: 'USD/mmbtu', exchange: 'NYMEX', asOf: '24 Mar 2025' },
  gold: { price: 4448, pct: null, label: 'Gold', unit: 'USD/oz', exchange: 'COMEX', asOf: '24 Mar 2025' },
  copper: { price: 5.42, pct: null, label: 'Copper', unit: 'USD/lb', exchange: 'COMEX', asOf: '24 Mar 2025' },
  alum: { price: 1.18, pct: null, label: 'Aluminium', unit: 'USD/lb', exchange: 'COMEX', asOf: '24 Mar 2025' },
  urea: { price: 310.5, pct: null, label: 'Urea (Fert.)', unit: 'USD/mt', exchange: 'OTC·WB', asOf: 'Feb 2025' },
} as const

function pct(current: number | null, previous: number | null): number | null {
  if (!previous || previous === 0 || current == null) return null
  return parseFloat(((current - previous) / previous * 100).toFixed(2))
}

function makeCommodity(
  id: string,
  price: number | null,
  pctVal: number | null,
  source: string,
  fb: (typeof FALLBACK)[keyof typeof FALLBACK]
) {
  return {
    id,
    label: fb.label,
    unit: fb.unit,
    exchange: fb.exchange,
    price: price ?? fb.price,
    prev_24h: null,
    prev_month: null,
    pct_24h: pctVal != null ? parseFloat(Number(pctVal).toFixed(2)) : null,
    pct_month: null,
    source: price != null ? source : 'fallback',
    source_ts: new Date().toISOString(),
    period: price != null ? 'realtime' : fb.asOf,
    status: price != null ? 'ok' : 'fallback',
  }
}

async function fetchSerpMarkets() {
  const url = `${SERP_BASE}?engine=google_finance_markets&trend=most-active&api_key=${SERP_API_KEY}`
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) throw new Error(`SerpAPI markets ${res.status} ${res.statusText}`)
  const json = await res.json()
  if (json.error) throw new Error(`SerpAPI error: ${json.error}`)
  return json?.markets?.futures || []
}

async function fetchSerpQuote(ticker: string) {
  const url = `${SERP_BASE}?engine=google_finance&q=${ticker}&api_key=${SERP_API_KEY}`
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) throw new Error(`SerpAPI ${ticker} ${res.status}`)
  const json = await res.json()
  if (json.error) throw new Error(`SerpAPI error: ${json.error}`)
  const graph = json?.graph || []
  const last = graph.length > 0 ? graph[graph.length - 1] : null
  return { price: last?.price ?? null }
}

async function fetchWorldBank(indicator: string) {
  const url = `${WB_API_BASE}/${indicator}?format=json&per_page=4&mrv=4`
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) throw new Error(`WorldBank ${res.status}`)
  const json = await res.json()
  const rows = json?.[1]?.filter((r: { value: number | null }) => r.value !== null)
  if (!rows || rows.length < 2) throw new Error('Insufficient WB data')
  return { price: parseFloat(rows[0].value), prev: parseFloat(rows[1].value), period: rows[0].date }
}

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const commodities: Record<string, any> = {}
  const fetchedAt = new Date().toISOString()
  let serpOk = false
  const errors: string[] = []

  // Step 1: SerpAPI Markets -> Gold + Crude Oil
  let goldPrice: number | null = null,
    goldPct: number | null = null,
    crudePrice: number | null = null,
    crudePct: number | null = null

  try {
    if (!SERP_API_KEY) throw new Error('SERP_API_KEY not configured')
    const futures = await fetchSerpMarkets()
    for (const item of futures) {
      if (item.stock === 'GCW00:COMEX') {
        goldPrice = item.price
        goldPct = item.price_movement?.percentage ?? null
      }
      if (item.stock === 'CLW00:NYMEX') {
        crudePrice = item.price
        crudePct = item.price_movement?.percentage ?? null
      }
    }
    if (goldPrice || crudePrice) serpOk = true
  } catch (e) {
    errors.push('markets: ' + (e as Error).message)
  }

  // Step 2: SerpAPI Individual -> Natural Gas, Copper, Aluminium
  let natgasPrice: number | null = null,
    copperPrice: number | null = null,
    alumPrice: number | null = null

  try {
    if (!SERP_API_KEY) throw new Error('SERP_API_KEY not configured')
    const [ng, cu, al] = await Promise.all([
      fetchSerpQuote('NGW00:NYMEX').catch((e) => { errors.push('natgas: ' + e.message); return { price: null } }),
      fetchSerpQuote('HGW00:COMEX').catch((e) => { errors.push('copper: ' + e.message); return { price: null } }),
      fetchSerpQuote('ALIW00:COMEX').catch((e) => { errors.push('alum: ' + e.message); return { price: null } }),
    ])
    natgasPrice = ng.price
    copperPrice = cu.price
    alumPrice = al.price
    if (natgasPrice || copperPrice || alumPrice) serpOk = true
  } catch (e) {
    errors.push('quotes: ' + (e as Error).message)
  }

  // Step 3: World Bank -> Urea
  let ureaPrice: number | null = null,
    ureaPrev: number | null = null

  try {
    const wb = await fetchWorldBank('PUREA')
    ureaPrice = wb.price
    ureaPrev = wb.prev
  } catch (e) {
    errors.push('urea: ' + (e as Error).message)
  }

  // Assemble response
  commodities.brent = makeCommodity('brent', crudePrice, crudePct, 'serpapi', FALLBACK.brent)
  commodities.natgas = makeCommodity('natgas', natgasPrice, null, 'serpapi', FALLBACK.natgas)
  commodities.gold = makeCommodity('gold', goldPrice, goldPct, 'serpapi', FALLBACK.gold)
  commodities.copper = makeCommodity('copper', copperPrice, null, 'serpapi', FALLBACK.copper)
  commodities.alum = makeCommodity('alum', alumPrice, null, 'serpapi', FALLBACK.alum)

  if (ureaPrice != null) {
    commodities.urea = {
      id: 'urea',
      label: 'Urea (Fert.)',
      unit: 'USD/mt',
      exchange: 'OTC·WB',
      price: ureaPrice,
      prev_24h: null,
      prev_month: ureaPrev,
      pct_24h: null,
      pct_month: pct(ureaPrice, ureaPrev),
      source: 'worldbank',
      source_ts: fetchedAt,
      period: 'realtime',
      status: 'ok',
    }
  } else {
    commodities.urea = makeCommodity('urea', null, null, 'worldbank', FALLBACK.urea)
  }

  if (errors.length > 0) {
    console.warn('Price fetch errors:', errors.join(' | '))
  }

  return NextResponse.json(
    {
      fetched_at: fetchedAt,
      serp_api_ok: serpOk,
      commodities,
      meta: {
        source: serpOk ? 'SerpAPI / Google Finance' : 'Hardcoded fallback (approx. London close)',
        urea_source: ureaPrice ? 'World Bank' : 'Fallback',
        cache_ttl_hrs: 24,
        errors: errors.length > 0 ? errors : undefined,
      },
    },
    {
      headers: {
        'Cache-Control': 's-maxage=86400, stale-while-revalidate=7200',
        'Access-Control-Allow-Origin': '*',
      },
    }
  )
}
