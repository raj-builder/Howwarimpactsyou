'use client'

import { useState } from 'react'
import { useT } from '@/lib/use-t'
import type { LagPeriod } from '@/types/scenario'
import { LAG_LABELS } from '@/types/scenario'

interface ImpactDisplayProps {
  /** Lag-adjusted ceiling (already includes passthrough and lag) */
  lagAdjustedCeiling: number
  /** Pre-computed range low */
  rangeLow: number
  /** Pre-computed range high */
  rangeHigh: number
  /** Lag period for tooltip context */
  lag?: LagPeriod
  /** Lag multiplier value for tooltip context */
  lagMultiplier?: number
}

export function ImpactDisplay({
  lagAdjustedCeiling,
  rangeLow,
  rangeHigh,
  lag,
  lagMultiplier,
}: ImpactDisplayProps) {
  const t = useT()
  const [showTooltip, setShowTooltip] = useState(false)

  // Normalize bar widths: ceiling is 100% of the bar
  const rangeLowPct =
    lagAdjustedCeiling > 0 ? (rangeLow / lagAdjustedCeiling) * 100 : 0
  const rangeHighPct =
    lagAdjustedCeiling > 0 ? (rangeHigh / lagAdjustedCeiling) * 100 : 0

  return (
    <div className="mt-2">
      {/* Numbers */}
      <div className="flex items-baseline gap-4 mb-1.5">
        <div>
          <span className="font-sans text-[0.65rem] text-ink-muted uppercase tracking-[0.04em]">
            {t('impact.ceiling')}
          </span>
          <span className="font-sans text-[0.82rem] font-bold text-accent ml-1.5">
            +{lagAdjustedCeiling}%
          </span>
        </div>
        <div>
          <span className="font-sans text-[0.65rem] text-ink-muted uppercase tracking-[0.04em]">
            {t('impact.typicalRange')}
          </span>
          <span className="font-sans text-[0.82rem] font-semibold text-ink ml-1.5">
            +{rangeLow}% &ndash; {rangeHigh}%
          </span>
        </div>
      </div>

      {/* Visual bar */}
      <div className="relative h-4 bg-bg-alt rounded-sm overflow-hidden">
        {/* Full bar = ceiling */}
        <div
          className="absolute inset-y-0 left-0 bg-accent/15 rounded-sm"
          style={{ width: '100%' }}
        />
        {/* Shaded typical range */}
        <div
          className="absolute inset-y-0 bg-gradient-to-r from-accent-warm to-accent rounded-sm transition-all"
          style={{
            left: `${rangeLowPct}%`,
            width: `${rangeHighPct - rangeLowPct}%`,
          }}
        />
        {/* Range labels on bar */}
        <div
          className="absolute top-0 h-full flex items-center"
          style={{ left: `${rangeLowPct}%` }}
        >
          <span className="font-sans text-[0.58rem] font-semibold text-white ml-1">
            {rangeLow}%
          </span>
        </div>
        <div
          className="absolute top-0 h-full flex items-center"
          style={{ left: `${rangeHighPct}%` }}
        >
          <span className="font-sans text-[0.58rem] font-semibold text-ink-muted ml-1">
            {rangeHigh}%
          </span>
        </div>
      </div>

      {/* Explanation toggle */}
      <div className="mt-1.5 relative">
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="font-sans text-[0.65rem] text-ink-muted hover:text-accent transition-colors cursor-pointer underline decoration-dotted underline-offset-2"
        >
          {t('impact.howCalculated')}
        </button>
        {showTooltip && (
          <div className="mt-1 bg-bg-card border border-border rounded-lg px-3 py-2 shadow-card animate-fade-in">
            <p className="font-sans text-[0.72rem] text-ink-soft leading-relaxed">
              The <strong className="text-ink">ceiling</strong> assumes full
              pass-through of upstream commodity shocks to consumer prices
              {lag && lagMultiplier !== undefined && lagMultiplier < 1 && (
                <>, adjusted for a <strong className="text-ink">
                  {LAG_LABELS[lag]}
                </strong> lag (multiplier: {lagMultiplier}x)</>
              )}.
              Historically, realized inflation has been{' '}
              <strong className="text-ink">55&ndash;75%</strong> of the ceiling
              due to government subsidies, price controls, currency hedging, and
              supply chain buffers. The typical range reflects this adjustment.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
