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

/**
 * Fetches /api/prices once and extracts the `fetched_at` timestamp.
 * This is the real date+time when commodity data was last pulled from SerpAPI.
 */
export function usePricesFreshness(): PricesFreshness {
  const [state, setState] = useState<PricesFreshness>({
    fetchedAt: null,
    dataAsOf: null,
    serpApiOk: false,
    source: '',
    loading: true,
  })

  useEffect(() => {
    let cancelled = false

    fetch('/api/prices')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        const fetchedAt: string = data.fetched_at ?? null
        let dataAsOf: string | null = null

        if (fetchedAt) {
          const d = new Date(fetchedAt)
          dataAsOf = d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }) + ' · ' + d.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })
        }

        setState({
          fetchedAt,
          dataAsOf,
          serpApiOk: data.serp_api_ok ?? false,
          source: data.meta?.source ?? '',
          loading: false,
        })
      })
      .catch(() => {
        if (cancelled) return
        setState((prev) => ({ ...prev, loading: false }))
      })

    return () => { cancelled = true }
  }, [])

  return state
}
