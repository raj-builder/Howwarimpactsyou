/**
 * Server-side fetch functions for the weekly fuel digest.
 *
 * These functions call external APIs (GDELT, EIA) and return typed results.
 * They are only used inside the /api/fuel-digest route handler — never
 * called from client components.
 *
 * CLAUDE.md §2: Each function logs start time, source, record count, duration.
 * CLAUDE.md §6: Called at most 2x per 12h (via ISR revalidate = 43200).
 */

import type { NewsArticle, FuelPriceTick } from '@/types/fuel-security'

/* ── GDELT DOC 2.0 API ──────────────────────────────────────── */

/** GDELT article shape (subset of their response) */
interface GdeltArticle {
  url: string
  title: string
  seendate: string
  domain: string
  language: string
  sourcecountry: string
}

interface GdeltResponse {
  articles?: GdeltArticle[]
}

/**
 * Fetch news articles from the GDELT DOC 2.0 API.
 *
 * GDELT monitors global news in 100+ languages and updates every 15 min.
 * Free, no API key required, commercial use allowed.
 *
 * @param query - Boolean search query (e.g. '"fuel ration" OR "jet fuel price"')
 * @param days - Timespan in days (default 7)
 * @param maxRecords - Max articles to return (default 15, GDELT max is 250)
 * @returns Array of NewsArticle objects
 */
export async function fetchGdeltArticles(
  query: string,
  days: number = 7,
  maxRecords: number = 15
): Promise<NewsArticle[]> {
  const start = Date.now()
  const timespan = `${days * 24 * 60}min`

  const params = new URLSearchParams({
    query,
    mode: 'ArtList',
    maxrecords: String(maxRecords),
    format: 'json',
    timespan,
    sort: 'DateDesc',
  })

  const url = `https://api.gdeltproject.org/api/v2/doc/doc?${params}`

  try {
    const res = await fetch(url, { next: { revalidate: 43200 } })
    if (!res.ok) {
      console.error(`[feed-fetchers] GDELT fetch failed: ${res.status} ${res.statusText}`)
      return []
    }

    const data: GdeltResponse = await res.json()
    const articles = (data.articles ?? []).map((a): NewsArticle => ({
      title: a.title,
      url: a.url,
      source: a.domain,
      publishedAt: parseGdeltDate(a.seendate),
      tag: classifyArticle(a.title),
    }))

    const duration = Date.now() - start
    console.log(
      `[feed-fetchers] GDELT: fetched ${articles.length} articles in ${duration}ms, query="${query}", timespan=${days}d`
    )

    return articles
  } catch (err) {
    const duration = Date.now() - start
    console.error(`[feed-fetchers] GDELT error after ${duration}ms:`, err)
    return []
  }
}

/**
 * Parse GDELT's date format (YYYYMMDDHHmmSS) into ISO string.
 */
function parseGdeltDate(seendate: string): string {
  if (!seendate || seendate.length < 8) return new Date().toISOString()
  const y = seendate.slice(0, 4)
  const m = seendate.slice(4, 6)
  const d = seendate.slice(6, 8)
  const h = seendate.slice(8, 10) || '00'
  const min = seendate.slice(10, 12) || '00'
  return new Date(`${y}-${m}-${d}T${h}:${min}:00Z`).toISOString()
}

/**
 * Classify an article by its headline into a relevance tag.
 */
function classifyArticle(title: string): NewsArticle['tag'] {
  const lower = title.toLowerCase()
  if (lower.includes('ration') || lower.includes('shortage') || lower.includes('reserve'))
    return 'rationing'
  if (lower.includes('hormuz') || lower.includes('strait'))
    return 'hormuz'
  if (lower.includes('airline') || lower.includes('flight') || lower.includes('aviation'))
    return 'aviation'
  if (lower.includes('oil price') || lower.includes('crude') || lower.includes('jet fuel') || lower.includes('brent'))
    return 'fuel-price'
  return 'general'
}

/* ── EIA Open Data API ───────────────────────────────────────── */

/** EIA response structure (v2 API) */
interface EiaResponse {
  response?: {
    data?: Array<{
      period: string
      'series-description'?: string
      value: number
      units?: string
    }>
  }
}

/** Series label mapping */
const EIA_SERIES_LABELS: Record<string, string> = {
  RBRTE: 'Brent Crude (Europe FOB)',
  'RJET-NUS': 'Jet Fuel (US Gulf Coast)',
}

/**
 * Fetch daily spot prices from the EIA Open Data API (v2).
 *
 * Free API, requires a key (free registration at eia.gov).
 * Public domain (US government data).
 *
 * @param seriesIds - Array of EIA series IDs to fetch
 * @param days - Number of daily observations to request (default 7)
 * @returns Array of FuelPriceTick objects
 */
export async function fetchEIAPrices(
  seriesIds: string[] = ['RBRTE', 'RJET-NUS'],
  days: number = 7
): Promise<FuelPriceTick[]> {
  const apiKey = process.env.EIA_API_KEY
  if (!apiKey) {
    console.warn('[feed-fetchers] EIA_API_KEY not set — skipping price fetch')
    return []
  }

  const start = Date.now()
  const allTicks: FuelPriceTick[] = []

  for (const seriesId of seriesIds) {
    try {
      const params = new URLSearchParams({
        api_key: apiKey,
        frequency: 'daily',
        'data[]': 'value',
        'sort[0][column]': 'period',
        'sort[0][direction]': 'desc',
        length: String(days),
      })
      params.append('facets[series][]', seriesId)

      const url = `https://api.eia.gov/v2/petroleum/pri/spt/data/?${params}`
      const res = await fetch(url, { next: { revalidate: 43200 } })

      if (!res.ok) {
        console.error(`[feed-fetchers] EIA fetch failed for ${seriesId}: ${res.status}`)
        continue
      }

      const data: EiaResponse = await res.json()
      const rows = data.response?.data ?? []

      for (const row of rows) {
        allTicks.push({
          series: seriesId,
          label: EIA_SERIES_LABELS[seriesId] ?? seriesId,
          value: row.value,
          period: row.period,
          unit: row.units ?? 'Dollars per Barrel',
        })
      }
    } catch (err) {
      console.error(`[feed-fetchers] EIA error for ${seriesId}:`, err)
    }
  }

  const duration = Date.now() - start
  console.log(
    `[feed-fetchers] EIA: fetched ${allTicks.length} price ticks in ${duration}ms, series=[${seriesIds.join(',')}]`
  )

  return allTicks
}
