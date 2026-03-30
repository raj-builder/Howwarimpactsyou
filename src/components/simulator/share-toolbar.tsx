'use client'

import { useCallback, useEffect, useState } from 'react'
import { useT } from '@/lib/use-t'

interface ShareToolbarProps {
  /** Model version to encode in shared URL (e.g. "1.0.0") */
  modelVersion?: string
  /** Snapshot date ISO string to encode in shared URL */
  snapshotDate?: string
  /** Visual variant: 'light' for default bg, 'dark' for dark gradient bg */
  variant?: 'light' | 'dark'
}

/**
 * Build a share URL that includes model version and snapshot date
 * alongside the existing URL params (war, category, country, pt, lag).
 */
function buildShareUrl(modelVersion?: string, snapshotDate?: string): string {
  if (typeof window === 'undefined') return ''
  const url = new URL(window.location.href)
  if (modelVersion) url.searchParams.set('mv', modelVersion)
  if (snapshotDate) url.searchParams.set('sd', snapshotDate)
  return url.toString()
}

export function ShareToolbar({ modelVersion, snapshotDate, variant = 'light' }: ShareToolbarProps) {
  const t = useT()
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  const getUrl = useCallback(
    () => buildShareUrl(modelVersion, snapshotDate),
    [modelVersion, snapshotDate],
  )

  const handleCopy = useCallback(async () => {
    const url = getUrl()
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [getUrl])

  const handleShare = useCallback(async () => {
    try {
      const title = document.title
      const url = getUrl()
      await navigator.share({
        title,
        text: `${title}\n\nSee how war affects your daily costs — scenario ceiling at 100% pass-through.\n\n`,
        url,
      })
    } catch {
      // User cancelled or share failed silently
    }
  }, [getUrl])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const btnClass = variant === 'dark'
    ? 'inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.75rem] font-medium rounded-md border border-white/20 bg-white/10 text-white/70 hover:text-white hover:border-white/40 transition-colors cursor-pointer'
    : 'inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.75rem] font-medium rounded-md border border-border bg-bg-card text-ink-soft hover:text-ink hover:border-ink-muted transition-colors cursor-pointer'

  return (
    <div className="flex items-center gap-2 font-sans">
      {/* Copy link */}
      <button
        onClick={handleCopy}
        className={btnClass}
        aria-label="Copy link to clipboard"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
        {copied ? t('share.copied') : t('share.copyLink')}
      </button>

      {/* Native share */}
      {canShare && (
        <button
          onClick={handleShare}
          className={btnClass}
          aria-label="Share this page"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          {t('share.share')}
        </button>
      )}

      {/* Print */}
      <button
        onClick={handlePrint}
        className={btnClass}
        aria-label="Print this page"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        {t('share.print')}
      </button>
    </div>
  )
}
