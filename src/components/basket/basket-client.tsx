'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { WARS } from '@/data/wars'
import { COUNTRIES } from '@/data/countries'
import { computeBasket, getProvenance } from '@/lib/calculations'
import type { WarId, CategoryId } from '@/types'
import type { LagPeriod } from '@/types/scenario'
import { LAG_MULTIPLIERS, LAG_LABELS } from '@/types/scenario'

/* ---------- component ---------- */
export function BasketClient() {
  const searchParams = useSearchParams()

  /* --- read scenario params from URL --- */
  const warId = (searchParams.get('war') as WarId) || 'ukraine-russia'
  const country = searchParams.get('country') || 'Philippines'
  const passthrough = Number(searchParams.get('pt')) || 100
  const lagRaw = searchParams.get('lag') || '6m'
  const lag: LagPeriod = lagRaw in LAG_MULTIPLIERS ? (lagRaw as LagPeriod) : '6m'

  /* --- enabled categories toggle state --- */
  const [enabledSet, setEnabledSet] = useState<Set<CategoryId>>(
    new Set<CategoryId>([
      'bread', 'oil', 'fuel', 'dairy', 'rice', 'vegetables',
    ]),
  )

  const toggleItem = (catId: CategoryId) => {
    setEnabledSet((prev) => {
      const next = new Set(prev)
      if (next.has(catId)) {
        next.delete(catId)
      } else {
        next.add(catId)
      }
      return next
    })
  }

  /* --- compute basket from centralized engine --- */
  const basketResult = useMemo(() => {
    return computeBasket(
      {
        war: warId,
        country,
        passthrough,
        lag,
        provenance: getProvenance(),
      },
      enabledSet,
    )
  }, [warId, country, passthrough, lag, enabledSet])

  /* --- UI data --- */
  const war = WARS[warId]
  const items = basketResult?.items ?? []
  const maxImpact = Math.max(...items.map((i) => i.lagAdjustedImpact), 1)

  return (
    <div className="container-page py-8">
      {/* Page header */}
      <div className="mb-6">
        <p className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-1">
          Basket View
        </p>
        <h1 className="text-[clamp(1.6rem,3vw,2.2rem)] font-normal tracking-tight text-ink font-serif">
          Household Basics Basket
        </h1>
        <p className="font-sans text-[0.85rem] text-ink-soft mt-1 max-w-[600px] leading-relaxed">
          A weighted basket showing how conflict shocks combine across everyday goods.
          Toggle items on or off to see how the overall basket impact changes.
        </p>
      </div>

      {/* Context badge — dynamic, not hardcoded */}
      <div className="inline-flex items-center gap-2 bg-bg-alt border border-border rounded-lg px-4 py-2 mb-6 font-sans text-[0.75rem] text-ink-muted">
        <span className="text-base">
          {COUNTRIES.find((c) => c.id === country)?.flag ?? ''}
        </span>
        <span>
          {country} &middot; {war?.name ?? warId} &middot;{' '}
          <strong className="text-ink">{passthrough}% pass-through</strong>
          &middot; <strong className="text-ink">{LAG_LABELS[lag]} lag</strong>
        </span>
      </div>

      {/* 2-col layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6 items-start">
        {/* ====== LEFT: Item List ====== */}
        <div className="space-y-2 order-2 md:order-1">
          {items.map((item) => (
            <div
              key={item.categoryId}
              className={`border rounded-[10px] px-4 py-3.5 transition-all ${
                item.enabled
                  ? 'border-border bg-bg-card shadow-card'
                  : 'border-border/50 bg-bg-alt opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Toggle */}
                <button
                  onClick={() => toggleItem(item.categoryId)}
                  className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer shrink-0 ${
                    item.enabled ? 'bg-accent' : 'bg-border'
                  }`}
                  aria-label={`Toggle ${item.label}`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      item.enabled ? 'left-[18px]' : 'left-0.5'
                    }`}
                  />
                </button>

                {/* Icon */}
                <span className="text-xl shrink-0">{item.icon}</span>

                {/* Label + weight */}
                <div className="flex-1 min-w-0">
                  <div className="font-sans text-[0.85rem] font-semibold text-ink">
                    {item.label}
                  </div>
                  <div className="font-sans text-[0.68rem] text-ink-muted">
                    CPI weight: {item.cpiWeight}%
                  </div>
                </div>

                {/* Impact */}
                <div className="text-right shrink-0">
                  <div className="font-sans text-[1.05rem] font-bold text-accent">
                    +{item.lagAdjustedImpact}%
                  </div>
                  {item.ceiling !== item.lagAdjustedImpact && (
                    <div className="font-sans text-[0.62rem] text-ink-muted">
                      ceiling: {item.ceiling}%
                    </div>
                  )}
                </div>
              </div>

              {/* Bar */}
              {item.enabled && (
                <div className="mt-2.5 ml-12">
                  <div className="h-2 bg-bg-alt rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm bg-gradient-to-r from-accent-warm to-accent transition-all"
                      style={{
                        width: `${(item.lagAdjustedImpact / maxImpact) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ====== RIGHT: Basket Summary ====== */}
        <aside className="bg-bg-card border border-border rounded-[10px] p-5 shadow-card md:sticky md:top-[72px] order-1 md:order-2">
          <h2 className="font-sans text-[0.82rem] font-bold text-ink mb-4 tracking-wide">
            Basket Total
          </h2>

          {/* Weighted Average — big number */}
          <div className="text-center mb-3">
            <div className="text-[2.4rem] font-light text-accent tracking-tight">
              +{basketResult?.weightedAverage ?? 0}%
            </div>
            <div className="font-sans text-[0.72rem] text-ink-muted">
              weighted average price impact
            </div>
          </div>

          {/* CPI Contribution — second metric */}
          <div className="text-center mb-5 bg-bg-alt rounded-lg px-3 py-2">
            <div className="text-[1.4rem] font-light text-ink tracking-tight">
              +{basketResult?.cpiContribution ?? 0}pp
            </div>
            <div className="font-sans text-[0.68rem] text-ink-muted">
              estimated CPI basket contribution
            </div>
          </div>

          {/* Formula tooltips */}
          <div className="bg-blue-light border border-[#ccdff0] rounded-lg px-3 py-2 mb-5">
            <p className="font-sans text-[0.65rem] text-[#2a4a6a] leading-relaxed">
              <strong>Weighted average</strong> = sum of (item weight / total active
              weight) x item impact across enabled items.
            </p>
            <p className="font-sans text-[0.65rem] text-[#2a4a6a] leading-relaxed mt-1">
              <strong>CPI contribution</strong> = sum of (item CPI weight / 100) x
              item impact. Measures percentage-point effect on headline CPI.
            </p>
          </div>

          {/* Mini bar chart */}
          <div className="space-y-2 mb-5">
            {items
              .filter((i) => i.enabled)
              .map((item) => (
                <div key={item.categoryId} className="flex items-center gap-2">
                  <span className="font-sans text-[0.68rem] text-ink-muted w-20 truncate shrink-0">
                    {item.icon} {item.label.split(' ')[0]}
                  </span>
                  <div className="flex-1 h-4 bg-bg-alt rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm bg-gradient-to-r from-accent-warm to-accent transition-all"
                      style={{
                        width: `${(item.lagAdjustedImpact / maxImpact) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-sans text-[0.68rem] font-semibold text-ink w-10 text-right shrink-0">
                    +{item.lagAdjustedImpact}%
                  </span>
                </div>
              ))}
          </div>

          {/* Weight breakdown */}
          <div className="border-t border-border pt-4">
            <h3 className="font-sans text-[0.72rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-2">
              Active Weights
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {items
                .filter((i) => i.enabled)
                .map((item) => (
                  <span
                    key={item.categoryId}
                    className="font-sans text-[0.65rem] font-semibold bg-bg-alt text-ink-soft px-2 py-0.5 rounded"
                  >
                    {item.icon} {item.cpiWeight}%
                  </span>
                ))}
            </div>
            <p className="font-sans text-[0.68rem] text-ink-muted mt-2">
              Total active weight:{' '}
              <strong className="text-ink">
                {items.filter((i) => i.enabled).reduce((s, i) => s + i.cpiWeight, 0)}%
              </strong>
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-light border border-[#e8c97a] rounded-lg px-3 py-2.5 mt-4">
            <p className="font-sans text-[0.68rem] text-[#7a4f10] leading-relaxed">
              <strong className="text-[#5a3408]">Note:</strong> Basket weights are
              approximate CPI sub-index shares for {country}. Impact figures
              assume {passthrough}% pass-through under the {war?.name ?? warId} scenario
              with {LAG_LABELS[lag]} lag ({LAG_MULTIPLIERS[lag]}x multiplier).
              Actual shelf prices will differ.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
