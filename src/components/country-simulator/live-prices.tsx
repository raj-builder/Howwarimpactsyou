'use client'

import { usePricesFreshness } from '@/lib/use-prices-freshness'
import { useT } from '@/lib/use-t'

/**
 * Displays the latest commodity prices from SerpAPI/fallback data.
 * Shows data freshness and source information.
 */
export function LivePrices() {
  const t = useT()
  const freshness = usePricesFreshness()

  const prices = freshness.prices

  if (!prices) return null

  const items = [
    { key: 'brent', label: 'Crude Oil', icon: '⛽' },
    { key: 'natgas', label: 'Natural Gas', icon: '🔥' },
    { key: 'gold', label: 'Gold', icon: '🥇' },
    { key: 'urea', label: 'Urea', icon: '🌱' },
  ]

  return (
    <div className="mt-6 border-t border-border pt-5">
      <h3 className="text-[0.9rem] font-serif font-normal tracking-tight text-ink mb-1">
        Live commodity prices
      </h3>
      <p className="font-sans text-[0.68rem] text-ink-muted mb-3">
        Latest values used in calculations.{' '}
        {freshness.fetchedAt && (
          <span className="text-green font-semibold">
            Updated: {new Date(freshness.fetchedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        )}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => {
          const p = prices[item.key as keyof typeof prices]
          if (!p) return null
          return (
            <div key={item.key} className="bg-bg-alt rounded-md px-3 py-2">
              <div className="font-sans text-[0.68rem] text-ink-muted">{item.icon} {item.label}</div>
              <div className="font-sans text-[0.9rem] font-bold text-ink">
                {typeof p.price === 'number' ? `$${p.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}` : '—'}
              </div>
              <div className="font-sans text-[0.58rem] text-ink-muted">{p.unit} · {p.exchange}</div>
            </div>
          )
        })}
      </div>
      <p className="font-sans text-[0.6rem] text-ink-muted mt-2">
        Source: SerpAPI / Google Finance, World Bank. Refreshes daily.
      </p>
    </div>
  )
}
