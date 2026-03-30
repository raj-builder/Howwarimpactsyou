'use client'

import { useMemo } from 'react'
import { getWarAnchors } from '@/data/pre-escalation-prices'
import { useT } from '@/lib/use-t'
import type { PriceAnchor } from '@/data/pre-escalation-prices'

interface WarEscalationCardProps {
  warId: string
  warName: string
  warDates: string
  live: boolean
  escalationDate: string
  pivotalEvent: string
  selectedCountry: string | null
  currencyCode: string | null
  currencyName: string | null
  fxPreRate: number | null
  fxPostRate: number | null
  fxDepPct: number | null
  isSelected: boolean
  onClick: () => void
  /** Use compact padding when rendered in the left sidebar */
  compact?: boolean
  /** Render as a narrower horizontal card for the war strip */
  horizontal?: boolean
  /** Wikipedia or source URL for this conflict */
  sourceUrl?: string
}

function ChangeBadge({ pct }: { pct: number | null | undefined }) {
  if (pct == null) return null
  const isNegative = pct < 0
  return (
    <span
      className={`inline-block font-sans text-[0.65rem] font-bold px-1.5 py-0.5 rounded ${
        isNegative
          ? 'bg-green-light text-green'
          : 'bg-accent-light text-accent'
      }`}
    >
      {pct > 0 ? '+' : ''}{pct}%
    </span>
  )
}

function formatPrice(price: number, unit: string): string {
  if (unit === 'USD' || unit.startsWith('USD')) {
    if (price >= 10000) return price.toLocaleString('en-US', { maximumFractionDigits: 0 })
    if (price >= 100) return price.toLocaleString('en-US', { maximumFractionDigits: 0 })
    return price.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  if (unit.includes('EUR')) return price.toLocaleString('en-US', { maximumFractionDigits: 1 })
  return price.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

export function WarEscalationCard({
  warId,
  warName,
  warDates,
  live,
  escalationDate,
  pivotalEvent,
  selectedCountry,
  currencyCode,
  currencyName,
  fxPreRate,
  fxPostRate,
  fxDepPct,
  isSelected,
  onClick,
  compact,
  horizontal,
  sourceUrl,
}: WarEscalationCardProps) {
  const t = useT()
  const anchors = useMemo(() => getWarAnchors(warId), [warId])

  const topCommodities = useMemo(() => {
    if (!anchors) return []
    return [...anchors.commodities]
      .sort((a, b) => Math.abs(b.changePct ?? 0) - Math.abs(a.changePct ?? 0))
      .slice(0, 4)
  }, [anchors])

  const topConsumerGoods = useMemo(() => {
    if (!anchors) return []
    return anchors.consumerGoods.slice(0, 2)
  }, [anchors])

  if (!anchors) return null

  const allItems = [...topCommodities, ...topConsumerGoods]

  return (
    <button
      onClick={onClick}
      className={`text-left rounded-[10px] transition-all cursor-pointer ${
        horizontal ? 'w-[220px]' : 'w-full'
      } ${
        isSelected
          ? 'ring-2 ring-accent shadow-md'
          : 'hover:shadow-md'
      }`}
    >
      <div className={`bg-gradient-to-br from-[#1a1a1a] via-[#2d2420] to-[#3a2216] text-white rounded-[10px] ${compact ? 'p-3' : 'p-4 md:p-5'} ${horizontal ? 'min-h-[160px] flex flex-col' : ''}`}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-sans text-[0.9rem] font-bold">{warName}</span>
          {live && (
            <span className="inline-flex items-center gap-1 font-sans text-[0.58rem] font-bold uppercase tracking-[0.06em] bg-accent text-white px-1.5 py-0.5 rounded">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Live
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-sans text-[0.68rem] text-white/50">{warDates}</p>
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-sans text-[0.58rem] text-accent-warm/70 hover:text-accent-warm no-underline transition-colors"
            >
              Source
            </a>
          )}
        </div>
        {!horizontal && (
          <p className="font-sans text-[0.68rem] text-white/40 mb-3 leading-snug">
            {pivotalEvent}
          </p>
        )}

        {/* Pre vs Post grid — skip in horizontal mode */}
        {isSelected && !horizontal && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 gap-y-1.5 items-center mb-3">
              {/* Header row */}
              <span className="font-sans text-[0.6rem] font-bold text-white/30 uppercase tracking-wider">
                {t('escalation.commodity')}
              </span>
              <span className="font-sans text-[0.6rem] font-bold text-white/30 uppercase tracking-wider text-right">
                {t('escalation.before')}
              </span>
              <span className="font-sans text-[0.6rem] font-bold text-white/30 uppercase tracking-wider text-right">
                {t('escalation.after')}
              </span>
              <span className="font-sans text-[0.6rem] font-bold text-white/30 uppercase tracking-wider text-right">
                {t('escalation.change')}
              </span>

              {allItems.map((item: PriceAnchor) => (
                <div key={item.id} className="contents">
                  <div>
                    <span className="font-sans text-[0.72rem] text-white/80">{item.label}</span>
                    <span className="font-sans text-[0.58rem] text-white/30 ml-1">{item.unit}</span>
                  </div>
                  <span className="font-sans text-[0.72rem] text-white/50 text-right tabular-nums">
                    {formatPrice(item.prePrice, item.unit)}
                  </span>
                  <span className="font-sans text-[0.72rem] text-white font-semibold text-right tabular-nums">
                    {formatPrice(item.postPrice, item.unit)}
                  </span>
                  <div className="text-right">
                    <ChangeBadge pct={item.changePct} />
                  </div>
                </div>
              ))}
            </div>

            {/* FX row if country selected */}
            {selectedCountry && currencyCode && fxPreRate != null && fxPostRate != null && (
              <div className="border-t border-white/10 pt-2 mt-1 mb-2">
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 items-center">
                  <div>
                    <span className="font-sans text-[0.72rem] text-white/80">
                      {currencyName ?? currencyCode}
                    </span>
                    <span className="font-sans text-[0.58rem] text-white/30 ml-1">
                      {currencyCode}/USD
                    </span>
                  </div>
                  <span className="font-sans text-[0.72rem] text-white/50 text-right tabular-nums">
                    {fxPreRate}
                  </span>
                  <span className="font-sans text-[0.72rem] text-white font-semibold text-right tabular-nums">
                    {fxPostRate}
                  </span>
                  <div className="text-right">
                    <ChangeBadge pct={fxDepPct} />
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <p className="font-sans text-[0.7rem] text-white/70 mt-2">
              {t('soWhat.provenanceNote', {
                date: anchors.commodities[0]?.anchorDate ?? escalationDate,
                source: t('escalation.hardcodedNote'),
              })}
            </p>
          </div>
        )}

        {/* Collapsed preview — show top shocks as chips (always in horizontal mode) */}
        {(!isSelected || horizontal) && (
          <div className={`flex flex-wrap gap-1.5 ${horizontal ? 'mt-auto' : ''}`}>
            {topCommodities.slice(0, 3).map((item) => (
              <span
                key={item.id}
                className="font-sans text-[0.62rem] bg-white/10 text-white/70 px-2 py-0.5 rounded-md"
              >
                {item.label}{' '}
                <strong className="text-accent-warm">
                  {(item.changePct ?? 0) > 0 ? '+' : ''}{item.changePct}%
                </strong>
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  )
}
