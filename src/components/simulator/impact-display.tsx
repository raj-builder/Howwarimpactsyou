'use client'

import { useState } from 'react'

interface ImpactDisplayProps {
  /** The ceiling impact percentage (e.g. 18.4) */
  ceiling: number
  /** Pass-through percentage (0-100) */
  passthrough: number
}

export function ImpactDisplay({ ceiling, passthrough }: ImpactDisplayProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const adjustedCeiling = +(ceiling * (passthrough / 100)).toFixed(1)
  const rangeLow = +(adjustedCeiling * 0.55).toFixed(1)
  const rangeHigh = +(adjustedCeiling * 0.75).toFixed(1)

  // Normalize bar widths: ceiling is 100% of the bar
  const rangeLowPct = adjustedCeiling > 0 ? (rangeLow / adjustedCeiling) * 100 : 0
  const rangeHighPct = adjustedCeiling > 0 ? (rangeHigh / adjustedCeiling) * 100 : 0

  return (
    <div className="mt-2">
      {/* Numbers */}
      <div className="flex items-baseline gap-4 mb-1.5">
        <div>
          <span className="font-sans text-[0.65rem] text-ink-muted uppercase tracking-[0.04em]">
            Ceiling
          </span>
          <span className="font-sans text-[0.82rem] font-bold text-accent ml-1.5">
            +{adjustedCeiling}%
          </span>
        </div>
        <div>
          <span className="font-sans text-[0.65rem] text-ink-muted uppercase tracking-[0.04em]">
            Typical range
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
          How is this calculated?
        </button>
        {showTooltip && (
          <div className="mt-1 bg-bg-card border border-border rounded-lg px-3 py-2 shadow-card animate-fade-in">
            <p className="font-sans text-[0.72rem] text-ink-soft leading-relaxed">
              The <strong className="text-ink">ceiling</strong> assumes 100%
              pass-through of upstream commodity shocks to consumer prices.
              Historically, realized inflation has been{' '}
              <strong className="text-ink">55&ndash;75%</strong> of the ceiling due
              to government subsidies, price controls, currency hedging, and supply
              chain buffers. The typical range reflects this adjustment.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
