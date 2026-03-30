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

function buildShareUrl(modelVersion?: string, snapshotDate?: string): string {
  if (typeof window === 'undefined') return ''
  const url = new URL(window.location.href)
  if (modelVersion) url.searchParams.set('mv', modelVersion)
  if (snapshotDate) url.searchParams.set('sd', snapshotDate)
  return url.toString()
}

function getShareText(): string {
  return `${document.title}\n\nSee how war affects your daily costs — scenario ceiling at 100% pass-through.`
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
      await navigator.share({
        title: document.title,
        text: getShareText(),
        url: getUrl(),
      })
    } catch {
      // User cancelled or share failed silently
    }
  }, [getUrl])

  const handleX = useCallback(() => {
    const url = getUrl()
    const text = getShareText()
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }, [getUrl])

  const handleWhatsApp = useCallback(() => {
    const url = getUrl()
    const text = `${getShareText()}\n${url}`
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }, [getUrl])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const btnClass = variant === 'dark'
    ? 'inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.75rem] font-medium rounded-md border border-white/20 bg-white/10 text-white/70 hover:text-white hover:border-white/40 transition-colors cursor-pointer'
    : 'inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.75rem] font-medium rounded-md border border-border bg-bg-card text-ink-soft hover:text-ink hover:border-ink-muted transition-colors cursor-pointer'

  return (
    <div className="flex items-center gap-2 font-sans flex-wrap">
      {/* Copy link */}
      <button onClick={handleCopy} className={btnClass} aria-label="Copy link to clipboard">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
        {copied ? t('share.copied') : t('share.copyLink')}
      </button>

      {/* X / Twitter */}
      <button onClick={handleX} className={btnClass} aria-label="Share on X">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        X
      </button>

      {/* WhatsApp */}
      <button onClick={handleWhatsApp} className={btnClass} aria-label="Share on WhatsApp">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        WhatsApp
      </button>

      {/* Native share (if available) */}
      {canShare && (
        <button onClick={handleShare} className={btnClass} aria-label="Share this page">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <button onClick={handlePrint} className={btnClass} aria-label="Print this page">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        {t('share.print')}
      </button>
    </div>
  )
}
