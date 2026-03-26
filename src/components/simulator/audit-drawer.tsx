'use client'

import { useState } from 'react'
import type { ScenarioResult } from '@/types/scenario'
import { LAG_LABELS } from '@/types/scenario'
import type { LagPeriod } from '@/types/scenario'

interface AuditDrawerProps {
  result: ScenarioResult
  passthrough: number
  lag: LagPeriod
}

export function AuditDrawer({ result, passthrough, lag }: AuditDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="font-sans text-[0.68rem] text-ink-muted hover:text-accent transition-colors cursor-pointer underline decoration-dotted underline-offset-2 mt-3"
      >
        Show audit trace
      </button>
    )
  }

  return (
    <div className="mt-3 bg-bg-alt border border-border rounded-lg p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-sans text-[0.78rem] font-bold text-ink tracking-wide">
          Calculation Audit Trace
        </h4>
        <button
          onClick={() => setIsOpen(false)}
          className="font-sans text-[0.72rem] text-ink-muted hover:text-accent cursor-pointer"
        >
          Hide
        </button>
      </div>

      {/* Formula chain */}
      <div className="space-y-2 font-mono text-[0.7rem] text-ink-soft">
        <div className="flex items-center gap-2">
          <span className="text-ink-muted w-36 shrink-0">Raw ceiling:</span>
          <span className="text-ink font-semibold">{result.ceiling}%</span>
          <span className="text-ink-muted text-[0.62rem]">(from rankings data)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-ink-muted w-36 shrink-0">x Pass-through:</span>
          <span className="text-ink font-semibold">{passthrough / 100}</span>
          <span className="text-ink-muted text-[0.62rem]">({passthrough}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-ink-muted w-36 shrink-0">= Adjusted ceiling:</span>
          <span className="text-ink font-semibold">{result.adjustedCeiling}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-ink-muted w-36 shrink-0">x Lag multiplier:</span>
          <span className="text-ink font-semibold">{result.lagMultiplier}</span>
          <span className="text-ink-muted text-[0.62rem]">({LAG_LABELS[lag]})</span>
        </div>
        <div className="flex items-center gap-2 border-t border-border pt-2">
          <span className="text-ink-muted w-36 shrink-0">= Lag-adj. ceiling:</span>
          <span className="text-accent font-bold">{result.lagAdjustedCeiling}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-ink-muted w-36 shrink-0">Range low (x0.55):</span>
          <span className="text-ink font-semibold">{result.rangeLow}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-ink-muted w-36 shrink-0">Range high (x0.75):</span>
          <span className="text-ink font-semibold">{result.rangeHigh}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-ink-muted w-36 shrink-0">Realized est. (x0.65):</span>
          <span className="text-ink font-semibold">{result.realized}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-ink-muted w-36 shrink-0">Model gap:</span>
          <span className="text-ink font-semibold">{result.modelGap}pp</span>
        </div>
      </div>

      {/* Factor decomposition */}
      <div className="mt-4 border-t border-border pt-3">
        <h5 className="font-sans text-[0.72rem] font-bold text-ink-muted mb-2">
          Factor Decomposition
        </h5>
        <table className="w-full font-mono text-[0.68rem]">
          <thead>
            <tr className="text-ink-muted text-left">
              <th className="pb-1 font-medium">Factor</th>
              <th className="pb-1 font-medium text-right">Share</th>
              <th className="pb-1 font-medium text-right">Contribution</th>
            </tr>
          </thead>
          <tbody>
            {result.factors.map((f) => (
              <tr key={f.label} className="text-ink-soft">
                <td className="py-0.5">{f.label}</td>
                <td className="py-0.5 text-right">{f.sharePct}%</td>
                <td className="py-0.5 text-right font-semibold text-ink">
                  +{f.absolutePct}%
                </td>
              </tr>
            ))}
            <tr className="border-t border-border text-ink font-semibold">
              <td className="pt-1">Total</td>
              <td className="pt-1 text-right">
                {result.factors.reduce((s, f) => s + f.sharePct, 0)}%
              </td>
              <td className="pt-1 text-right">
                +{result.factors.reduce((s, f) => s + f.absolutePct, 0)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Provenance */}
      <div className="mt-4 border-t border-border pt-3">
        <h5 className="font-sans text-[0.72rem] font-bold text-ink-muted mb-2">
          Provenance
        </h5>
        <div className="grid grid-cols-2 gap-1 font-sans text-[0.68rem] text-ink-muted">
          <span>Model version:</span>
          <span className="text-ink">{result.provenance.modelVersion}</span>
          <span>Snapshot date:</span>
          <span className="text-ink">{result.provenance.snapshotDate}</span>
          <span>Data as of:</span>
          <span className="text-ink">{result.provenance.dataAsOf}</span>
          <span>Source version:</span>
          <span className="text-ink">{result.provenance.sourceVersion}</span>
          <span>Coverage:</span>
          <span className="text-ink capitalize">{result.coverage}</span>
          <span>Reliability:</span>
          <span className="text-ink capitalize">{result.reliability}</span>
          <span>Scenario ID:</span>
          <span className="text-ink font-mono text-[0.62rem] break-all">
            {result.scenarioId}
          </span>
        </div>
      </div>
    </div>
  )
}
