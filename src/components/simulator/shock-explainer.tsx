'use client'

import { useState } from 'react'
import type { Shock } from '@/types'

interface ShockExplainerProps {
  warName: string
  dates: string
  shocks: Shock[]
}

export function ShockExplainer({
  warName,
  dates,
  shocks,
}: ShockExplainerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="font-sans text-[0.65rem] text-white/50 hover:text-white/80 transition-colors cursor-pointer underline decoration-dotted underline-offset-2"
      >
        {isOpen ? 'Hide shock details' : 'How are these shocks measured?'}
      </button>
      {isOpen && (
        <div className="mt-2 bg-white/10 rounded-lg px-3 py-2.5 animate-fade-in">
          <p className="font-sans text-[0.72rem] text-white/70 leading-relaxed mb-2">
            Factor shocks for the <strong className="text-white/90">{warName}</strong> scenario
            ({dates}) represent the peak-to-trough or baseline-to-peak price movement
            observed in major international benchmarks during the conflict window.
          </p>
          <div className="space-y-1.5">
            {shocks.map((s) => (
              <div
                key={s.factor}
                className="flex items-center gap-2 font-sans text-[0.68rem]"
              >
                <span className="text-white/60 w-32 shrink-0">{s.factor}</span>
                <span className="text-accent-warm font-semibold">{s.val}</span>
              </div>
            ))}
          </div>
          <p className="font-sans text-[0.65rem] text-white/40 mt-2 leading-relaxed">
            These are point-in-time measurements, not forecasts. The model uses
            these as input shocks and applies country-specific exposure
            coefficients, FX adjustments, and lag profiles to estimate consumer
            price ceilings.
          </p>
        </div>
      )}
    </div>
  )
}
