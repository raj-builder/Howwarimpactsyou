'use client'

import { useState, useMemo } from 'react'

/* ---------- types ---------- */
interface BasketItem {
  id: string
  label: string
  icon: string
  weight: number     // CPI weight as a percentage (0-100)
  impactPct: number  // price impact percentage
  enabled: boolean
}

/* ---------- initial data: Philippines, Russia-Ukraine ---------- */
const INITIAL_ITEMS: BasketItem[] = [
  { id: 'bread', label: 'Bread & Cereals', icon: '\uD83C\uDF5E', weight: 25, impactPct: 18.4, enabled: true },
  { id: 'oil', label: 'Cooking Oil', icon: '\uD83E\uDED2', weight: 15, impactPct: 31.2, enabled: true },
  { id: 'fuel', label: 'Household Fuel', icon: '\u26FD', weight: 20, impactPct: 22.7, enabled: true },
  { id: 'dairy', label: 'Milk & Dairy', icon: '\uD83E\uDD5B', weight: 15, impactPct: 14.2, enabled: true },
  { id: 'rice', label: 'Rice', icon: '\uD83C\uDF5A', weight: 10, impactPct: 13.8, enabled: true },
  { id: 'vegetables', label: 'Vegetables', icon: '\uD83E\uDD6C', weight: 15, impactPct: 15.6, enabled: true },
]

/* ---------- component ---------- */
export function BasketClient() {
  const [items, setItems] = useState<BasketItem[]>(INITIAL_ITEMS)

  /* toggle an item on/off */
  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    )
  }

  /* weighted basket total */
  const basketTotal = useMemo(() => {
    const enabledItems = items.filter((i) => i.enabled)
    if (enabledItems.length === 0) return 0
    const totalWeight = enabledItems.reduce((s, i) => s + i.weight, 0)
    const weightedSum = enabledItems.reduce(
      (s, i) => s + (i.weight / totalWeight) * i.impactPct,
      0,
    )
    return +weightedSum.toFixed(1)
  }, [items])

  /* max impact for bar scaling */
  const maxImpact = useMemo(
    () => Math.max(...items.map((i) => i.impactPct)),
    [items],
  )

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

      {/* Context badge */}
      <div className="inline-flex items-center gap-2 bg-bg-alt border border-border rounded-lg px-4 py-2 mb-6 font-sans text-[0.75rem] text-ink-muted">
        <span className="text-base">{'\uD83C\uDDF5\uD83C\uDDED'}</span>
        <span>
          Philippines &middot; Russia-Ukraine War &middot;{' '}
          <strong className="text-ink">100% pass-through</strong>
        </span>
      </div>

      {/* 2-col layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6 items-start">
        {/* ====== LEFT: Item List ====== */}
        <div className="space-y-2 order-2 md:order-1">
          {items.map((item) => (
            <div
              key={item.id}
              className={`border rounded-[10px] px-4 py-3.5 transition-all ${
                item.enabled
                  ? 'border-border bg-bg-card shadow-card'
                  : 'border-border/50 bg-bg-alt opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Toggle */}
                <button
                  onClick={() => toggleItem(item.id)}
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
                    CPI weight: {item.weight}%
                  </div>
                </div>

                {/* Impact */}
                <div className="text-right shrink-0">
                  <div className="font-sans text-[1.05rem] font-bold text-accent">
                    +{item.impactPct}%
                  </div>
                </div>
              </div>

              {/* Bar */}
              {item.enabled && (
                <div className="mt-2.5 ml-12">
                  <div className="h-2 bg-bg-alt rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm bg-gradient-to-r from-accent-warm to-accent transition-all"
                      style={{
                        width: `${(item.impactPct / maxImpact) * 100}%`,
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

          {/* Big number */}
          <div className="text-center mb-5">
            <div className="text-[2.4rem] font-light text-accent tracking-tight">
              +{basketTotal}%
            </div>
            <div className="font-sans text-[0.72rem] text-ink-muted">
              weighted average price impact
            </div>
          </div>

          {/* Mini bar chart */}
          <div className="space-y-2 mb-5">
            {items
              .filter((i) => i.enabled)
              .map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="font-sans text-[0.68rem] text-ink-muted w-20 truncate shrink-0">
                    {item.icon} {item.label.split(' ')[0]}
                  </span>
                  <div className="flex-1 h-4 bg-bg-alt rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm bg-gradient-to-r from-accent-warm to-accent transition-all"
                      style={{
                        width: `${(item.impactPct / maxImpact) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-sans text-[0.68rem] font-semibold text-ink w-10 text-right shrink-0">
                    +{item.impactPct}%
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
                    key={item.id}
                    className="font-sans text-[0.65rem] font-semibold bg-bg-alt text-ink-soft px-2 py-0.5 rounded"
                  >
                    {item.icon} {item.weight}%
                  </span>
                ))}
            </div>
            <p className="font-sans text-[0.68rem] text-ink-muted mt-2">
              Total active weight:{' '}
              <strong className="text-ink">
                {items.filter((i) => i.enabled).reduce((s, i) => s + i.weight, 0)}%
              </strong>
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-light border border-[#e8c97a] rounded-lg px-3 py-2.5 mt-4">
            <p className="font-sans text-[0.68rem] text-[#7a4f10] leading-relaxed">
              <strong className="text-[#5a3408]">Note:</strong> Basket weights are
              approximate CPI sub-index shares for the Philippines. Impact figures
              assume 100% pass-through under the Russia-Ukraine scenario. Actual
              shelf prices will differ.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
