'use client'

import { useMemo } from 'react'
import { getWarAnchors } from '@/data/pre-escalation-prices'
import { useT } from '@/lib/use-t'

interface ConsumerGoodsProps {
  warId: string
}

function formatPrice(price: number, unit: string): string {
  if (unit === 'USD' || unit.startsWith('USD')) {
    if (price >= 10000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    if (price >= 100) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
  }
  return price.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

export function ConsumerGoods({ warId }: ConsumerGoodsProps) {
  const t = useT()
  const anchors = useMemo(() => getWarAnchors(warId), [warId])

  if (!anchors || anchors.consumerGoods.length === 0) return null

  return (
    <div className="mt-6">
      <h3 className="text-[1rem] font-serif font-normal tracking-tight text-ink mb-3">
        Consumer goods reference
      </h3>
      <p className="font-sans text-[0.72rem] text-ink-muted mb-3">
        How global prices of common products shifted during this conflict.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {anchors.consumerGoods.map((item) => {
          const changePct = item.changePct ?? Math.round(((item.postPrice - item.prePrice) / item.prePrice) * 1000) / 10
          const isUp = changePct > 0
          return (
            <div
              key={item.id}
              className="border border-border bg-bg-card rounded-lg px-4 py-3 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="font-sans text-[0.82rem] font-semibold text-ink truncate">
                  {item.label}
                </div>
                <div className="font-sans text-[0.65rem] text-ink-muted">
                  {formatPrice(item.prePrice, item.unit)} &rarr; {formatPrice(item.postPrice, item.unit)}
                </div>
              </div>
              <span className={`font-sans text-[0.9rem] font-bold shrink-0 ${isUp ? 'text-accent' : 'text-green'}`}>
                {isUp ? '+' : ''}{changePct}%
              </span>
            </div>
          )
        })}
      </div>
      <p className="font-sans text-[0.62rem] text-ink-muted mt-2">
        Reference MSRP prices only. Not affected by pass-through or lag settings. Not included in basket calculations.
      </p>
    </div>
  )
}
