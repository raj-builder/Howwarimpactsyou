/**
 * /api/fuel-digest — Weekly fuel news + price digest.
 *
 * Fetches from GDELT (7-day news) and EIA (7-day prices), deduplicates,
 * and returns a cached JSON response. ISR revalidate = 43200 (12 hours).
 *
 * CLAUDE.md §6.1: 2 external calls per 12h rebuild (4/day max).
 * CLAUDE.md §6.2: Response includes fetchedAt for freshness display.
 * CLAUDE.md §8: EIA_API_KEY read from env, never exposed to client.
 */

import { NextResponse } from 'next/server'
import { fetchGdeltArticles, fetchEIAPrices } from '@/lib/feed-fetchers'
import type { FuelDigestResponse } from '@/types/fuel-security'

/** ISR cache: revalidate every 12 hours */
export const revalidate = 43200

/** GDELT search query for fuel crisis + aviation news */
/** GDELT requires OR terms to be wrapped in parentheses */
const GDELT_QUERY =
  '("fuel crisis" OR "jet fuel" OR "airline cancel" OR "Strait of Hormuz" OR "oil shortage" OR "fuel ration")'

/** EIA series to fetch: Brent crude + US Gulf Coast jet fuel */
const EIA_SERIES = ['RBRTE', 'RJET-NUS']

/** Rolling window in days — extended to 30 for better coverage when GDELT rate-limits */
const DIGEST_DAYS = 30

export async function GET() {
  const [articles, prices] = await Promise.all([
    fetchGdeltArticles(GDELT_QUERY, DIGEST_DAYS, 15),
    fetchEIAPrices(EIA_SERIES, DIGEST_DAYS),
  ])

  // Deduplicate articles by title similarity (exact match after lowercase + trim)
  const seen = new Set<string>()
  const uniqueArticles = articles.filter((a) => {
    const key = a.title.toLowerCase().trim()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  const response: FuelDigestResponse = {
    articles: uniqueArticles.slice(0, 10),
    prices,
    fetchedAt: new Date().toISOString(),
  }

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=86400',
    },
  })
}
