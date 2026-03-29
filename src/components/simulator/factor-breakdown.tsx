'use client'

import { useT } from '@/lib/use-t'
import type { FactorContribution } from '@/types/scenario'

interface FactorBreakdownProps {
  factors: FactorContribution[]
  lagAdjustedCeiling: number
}

export function FactorBreakdown({ factors, lagAdjustedCeiling }: FactorBreakdownProps) {
  const t = useT()

  return (
    <div className="mb-6">
      <h4 className="font-sans text-[0.78rem] font-bold text-ink mb-3 tracking-wide">
        {t('simulator.factorBreakdown')}
      </h4>
      <div className="space-y-2">
        {factors.map((f) => (
          <div key={f.label} className="flex items-center gap-3">
            <span className="font-sans text-[0.72rem] text-ink-muted w-24 shrink-0">
              {f.label}
            </span>
            <div className="flex-1 h-5 bg-bg-alt rounded-sm overflow-hidden">
              <div
                className={`h-full ${f.color} rounded-sm transition-all`}
                style={{
                  width: `${
                    lagAdjustedCeiling > 0
                      ? (f.absolutePct / lagAdjustedCeiling) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <span className="font-sans text-[0.72rem] font-semibold text-ink w-16 text-right">
              +{f.absolutePct}%
            </span>
            <span className="font-sans text-[0.62rem] text-ink-muted w-10 text-right">
              {f.sharePct}%
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-1.5 font-sans text-[0.68rem] text-ink-muted border-t border-border pt-1.5">
        <span className="w-24 shrink-0" />
        <span className="flex-1" />
        <span className="font-semibold text-ink w-16 text-right">
          ={lagAdjustedCeiling}%
        </span>
        <span className="w-10 text-right">100%</span>
      </div>
    </div>
  )
}
