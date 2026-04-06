'use client'

import { useEffect, useState } from 'react'
import { useT } from '@/lib/use-t'
import type { FuelDigestResponse } from '@/types/fuel-security'

export function WeeklyFuelDigest() {
  const t = useT()
  const [digest, setDigest] = useState<FuelDigestResponse | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/fuel-digest')
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`)
        return res.json()
      })
      .then((data: FuelDigestResponse) => {
        if (!cancelled) setDigest(data)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => { cancelled = true }
  }, [])

  if (error || (!digest && error)) {
    return (
      <div className="bg-bg-card border border-border rounded-[var(--radius-card)] p-5">
        <h3 className="font-sans text-[0.85rem] font-semibold text-ink mb-2">
          {t('flightAlerts.weeklyDigest')}
        </h3>
        <p className="text-[0.78rem] text-ink-muted font-sans">
          {t('flightAlerts.digestUnavailable')}
        </p>
      </div>
    )
  }

  if (!digest) {
    return (
      <div className="bg-bg-card border border-border rounded-[var(--radius-card)] p-5 animate-pulse">
        <div className="h-4 w-40 bg-border rounded mb-3" />
        <div className="h-3 w-full bg-border rounded mb-2" />
        <div className="h-3 w-3/4 bg-border rounded" />
      </div>
    )
  }

  const fetchedDate = new Date(digest.fetchedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="bg-bg-card border border-border rounded-[var(--radius-card)] p-5">
      <h3 className="font-sans text-[0.78rem] font-semibold text-ink-muted uppercase tracking-wider mb-3">
        {t('flightAlerts.weeklyDigest')}
      </h3>

      {/* News articles */}
      {digest.articles.length > 0 ? (
        <ul className="space-y-2 mb-3">
          {digest.articles.map((article, i) => {
            const daysAgo = Math.max(
              0,
              Math.round(
                (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
              )
            )
            return (
              <li key={i} className="flex items-start gap-2">
                <TagDot tag={article.tag} />
                <div className="min-w-0 flex-1">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[0.8rem] text-ink font-medium hover:text-accent transition-colors no-underline line-clamp-2"
                  >
                    {article.title}
                  </a>
                  <div className="flex gap-2 mt-0.5 text-[0.68rem] text-ink-muted font-sans">
                    <span>{article.source}</span>
                    <span>{t('flightAlerts.daysAgo', { days: String(daysAgo) })}</span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-[0.78rem] text-ink-muted font-sans mb-3 italic">
          {t('flightAlerts.newsUnavailable')}
        </p>
      )}

      {/* Attribution */}
      <div className="pt-3 border-t border-border flex items-center justify-between">
        <span className="text-[0.65rem] text-ink-muted font-sans">
          {t('flightAlerts.newsAttribution')}
        </span>
        <span className="text-[0.65rem] text-ink-muted font-sans">
          {t('flightAlerts.digestAsOf', { date: fetchedDate })}
        </span>
      </div>
    </div>
  )
}

const TAG_COLORS: Record<string, string> = {
  'fuel-price': 'bg-accent',
  rationing: 'bg-amber',
  aviation: 'bg-blue',
  hormuz: 'bg-accent-warm',
  general: 'bg-ink-muted',
}

function TagDot({ tag }: { tag: string }) {
  return (
    <span
      className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${TAG_COLORS[tag] ?? 'bg-ink-muted'}`}
      aria-hidden="true"
    />
  )
}
