'use client'

import { useState, useEffect } from 'react'

interface PricesFreshness {
  /** ISO timestamp of last SerpAPI fetch */
  fetchedAt: string | null
  /** Human-readable "Data as of" string, e.g. "Mar 26, 2026 · 3:14 PM" */
  dataAsOf: string | null
  /** Whether the SerpAPI call succeeded */
  serpApiOk: boolean
  /** Data source label */
  source: string
  /** Whether the hook is still loading */
  loading: boolean
}

const CACHE_KEY = 'hwiy_prices_freshness'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours — matches server cache

/** Module-level cache so multiple components share one fetch per session. */
let moduleCache: PricesFreshness | null = null
let fetchPromise: Promise<PricesFreshness> | null = null

function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  return (
    d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) +
    ' · ' +
    d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  )
}

function readSessionCache(): PricesFreshness | null {
  if (typeof sessionStorage === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PricesFreshness & { cachedAt: number }
    // Expire after 24h
    if (Date.now() - parsed.cachedAt > CACHE_TTL_MS) {
      sessionStorage.removeItem(CACHE_KEY)
      return null
    }
    return {
      fetchedAt: parsed.fetchedAt,
      dataAsOf: parsed.dataAsOf,
      serpApiOk: parsed.serpApiOk,
      source: parsed.source,
      loading: false,
    }
  } catch {
    return null
  }
}

function writeSessionCache(data: PricesFreshness): void {
  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ ...data, cachedAt: Date.now() }),
    )
  } catch {
    // sessionStorage full or unavailable — ignore
  }
}

/**
 * Fetches /api/prices once per session and extracts the `fetched_at` timestamp.
 *
 * Caching strategy (to protect the SerpAPI free tier):
 * 1. Module-level cache — shared across all component instances in one page load
 * 2. sessionStorage cache (24h TTL) — survives client-side navigations
 * 3. Server-side Vercel CDN cache (s-maxage=86400) — prevents SerpAPI calls
 *
 * Net result: SerpAPI is called at most once per 24 hours regardless of traffic.
 */
export function usePricesFreshness(): PricesFreshness {
  const [state, setState] = useState<PricesFreshness>(() => {
    // Check module cache first (instant, no I/O)
    if (moduleCache) return moduleCache
    // Check sessionStorage (survives navigations)
    const cached = readSessionCache()
    if (cached) {
      moduleCache = cached
      return cached
    }
    return {
      fetchedAt: null,
      dataAsOf: null,
      serpApiOk: false,
      source: '',
      loading: true,
    }
  })

  useEffect(() => {
    // Already resolved from cache
    if (moduleCache) {
      setState(moduleCache)
      return
    }

    // Deduplicate: if a fetch is already in flight, reuse it
    if (!fetchPromise) {
      fetchPromise = fetch('/api/prices')
        .then((res) => res.json())
        .then((data): PricesFreshness => {
          const fetchedAt: string | null = data.fetched_at ?? null
          const result: PricesFreshness = {
            fetchedAt,
            dataAsOf: fetchedAt ? formatTimestamp(fetchedAt) : null,
            serpApiOk: data.serp_api_ok ?? false,
            source: data.meta?.source ?? '',
            loading: false,
          }
          moduleCache = result
          writeSessionCache(result)
          return result
        })
        .catch((): PricesFreshness => {
          const fallback: PricesFreshness = {
            fetchedAt: null,
            dataAsOf: null,
            serpApiOk: false,
            source: '',
            loading: false,
          }
          moduleCache = fallback
          return fallback
        })
    }

    let cancelled = false
    fetchPromise.then((result) => {
      if (!cancelled) setState(result)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
