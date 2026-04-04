import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const SERP_API_KEY = process.env.SERP_API_KEY || ''
const SERP_BASE = 'https://serpapi.com/search.json'
const WB_API_BASE = 'https://api.worldbank.org/v2/en/indicator'

/**
 * Cache TTL in milliseconds.
 * 48 hours = 172_800_000ms. This limits SerpAPI to ~1 call per 2 days.
 * With 18 days until Apr 22 that's ~9 calls max (well under the 30 budget).
 * On weekends the cache stays warm from Friday's fetch.
 */
const CACHE_TTL_MS = 48 * 60 * 60 * 1000

/**
 * File-based cache path. Uses /tmp for serverless compatibility.
 * On Vercel, /tmp persists within a single function invocation warm period.
 * Locally, it persists across dev server restarts.
 */
const CACHE_FILE = path.join('/tmp', 'prices-cache.json')

const FALLBACK = {
  brent: { price: 107.81, pct: null, label: 'Crude Oil', unit: 'USD/bbl', exchange: 'NYMEX', asOf: '27 Mar 2026' },
  natgas: { price: 3.05, pct: null, label: 'Natural Gas', unit: 'USD/mmbtu', exchange: 'NYMEX', asOf: '27 Mar 2026' },
  gold: { price: 4434, pct: null, label: 'Gold', unit: 'USD/oz', exchange: 'COMEX', asOf: '27 Mar 2026' },
  copper: { price: 5.50, pct: null, label: 'Copper', unit: 'USD/lb', exchange: 'COMEX', asOf: '27 Mar 2026' },
  alum: { price: 1.50, pct: null, label: 'Aluminium', unit: 'USD/lb', exchange: 'COMEX', asOf: '27 Mar 2026' },
  urea: { price: 674, pct: null, label: 'Urea (Fert.)', unit: 'USD/mt', exchange: 'OTC·WB', asOf: 'Mar 2026' },
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

/* ── Cache helpers ────────────────────────────────────────────── */

interface CachedResponse {
  data: Record<string, unknown>
  cachedAt: number
}

async function readCache(): Promise<CachedResponse | null> {
  try {
    const raw = await fs.readFile(CACHE_FILE, 'utf-8')
    const parsed: CachedResponse = JSON.parse(raw)
    return parsed
  } catch {
    return null
  }
}

async function writeCache(data: Record<string, unknown>): Promise<void> {
  try {
    const payload: CachedResponse = { data, cachedAt: Date.now() }
    await fs.writeFile(CACHE_FILE, JSON.stringify(payload), 'utf-8')
    console.log(`[prices] Cache written at ${new Date().toISOString()}`)
  } catch (e) {
    console.warn('[prices] Failed to write cache:', (e as Error).message)
  }
}

function isCacheFresh(cached: CachedResponse): boolean {
  const age = Date.now() - cached.cachedAt
  return age < CACHE_TTL_MS
}

/* ── Main handler ─────────────────────────────────────────────── */

export async function GET() {
  // Check file cache first — serve cached data if fresh
  const cached = await readCache()
  if (cached && isCacheFresh(cached)) {
    const ageHrs = Math.round((Date.now() - cached.cachedAt) / 3_600_000)
    console.log(`[prices] Serving from cache (${ageHrs}h old, TTL ${CACHE_TTL_MS / 3_600_000}h)`)
    return NextResponse.json(
      {
        ...cached.data,
        meta: {
          ...(cached.data.meta as Record<string, unknown>),
          served_from: 'cache',
          cache_age_hrs: ageHrs,
          next_refresh_hrs: Math.max(0, Math.round((CACHE_TTL_MS - (Date.now() - cached.cachedAt)) / 3_600_000)),
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

  // Cache miss or stale — fetch fresh data
  console.log(`[prices] Cache miss — fetching fresh data from SerpAPI + WorldBank`)

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
    console.warn('[prices] Fetch errors:', errors.join(' | '))
  }

  const responseData = {
    fetched_at: fetchedAt,
    serp_api_ok: serpOk,
    commodities,
    meta: {
      source: serpOk ? 'SerpAPI / Google Finance' : 'Hardcoded fallback (approx. London close)',
      urea_source: ureaPrice ? 'World Bank' : 'Fallback',
      cache_ttl_hrs: CACHE_TTL_MS / 3_600_000,
      served_from: 'fresh',
      errors: errors.length > 0 ? errors : undefined,
    },
  }

  // Write to cache (don't await — fire and forget)
  writeCache(responseData)

  return NextResponse.json(responseData, {
    headers: {
      'Cache-Control': 's-maxage=86400, stale-while-revalidate=7200',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
