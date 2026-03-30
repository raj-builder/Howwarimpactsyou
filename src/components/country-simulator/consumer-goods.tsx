'use client'

import { useMemo } from 'react'
import { getWarAnchors } from '@/data/pre-escalation-prices'
import { LOCAL_CONSUMER_GOODS, CURRENCY_SYMBOLS } from '@/data/consumer-goods-local'

interface ConsumerGoodsProps {
  warId: string
  country?: string
}

function formatLocal(price: number, currency: string): string {
  const sym = CURRENCY_SYMBOLS[currency] ?? currency + '\u00A0'
  if (price >= 100000) return `${sym}${(price / 100000).toFixed(1)}L`
  if (price >= 10000) return `${sym}${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  if (price >= 100) return `${sym}${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  return `${sym}${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}

function formatUsd(price: number): string {
  if (price >= 10000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}

export function ConsumerGoods({ warId, country }: ConsumerGoodsProps) {
  const anchors = useMemo(() => getWarAnchors(warId), [warId])

  /* Try country-specific local prices first */
  const localGoods = country ? LOCAL_CONSUMER_GOODS[warId]?.[country] ?? null : null
  const hasLocal = localGoods && localGoods.length > 0

  /* Fall back to global MSRP */
  const globalGoods = anchors?.consumerGoods ?? []

  if (!hasLocal && globalGoods.length === 0) return null

  return (
    <div className="mt-6">
      <h3 className="text-[1rem] font-serif font-normal tracking-tight text-ink mb-1">
        Consumer goods reference
        {hasLocal && country && (
          <span className="font-sans text-[0.72rem] text-ink-muted font-normal ml-2">
            in {country}
          </span>
        )}
      </h3>
      <p className="font-sans text-[0.72rem] text-ink-muted mb-3">
        {hasLocal
          ? 'Local prices showing how everyday costs shifted during this conflict.'
          : 'How global prices of common products shifted during this conflict.'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {hasLocal
          ? localGoods.map((item) => {
              const changePct = Math.round(((item.postPrice - item.prePrice) / item.prePrice) * 1000) / 10
              const isUp = changePct > 0
              return (
                <div key={item.id} className="border border-border bg-bg-card rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-[0.82rem] font-semibold text-ink truncate">
                        {item.label}
                      </div>
                      <div className="font-sans text-[0.68rem] text-ink-muted">
                        {formatLocal(item.prePrice, item.currency)} &rarr; {formatLocal(item.postPrice, item.currency)}
                      </div>
                    </div>
                    <span className={`font-sans text-[0.9rem] font-bold shrink-0 ${isUp ? 'text-accent' : changePct === 0 ? 'text-ink-muted' : 'text-green'}`}>
                      {isUp ? '+' : ''}{changePct}%
                    </span>
                  </div>
                  <div className="font-sans text-[0.58rem] text-ink-muted leading-snug">
                    {item.note}
                  </div>
                </div>
              )
            })
          : globalGoods.map((item) => {
              const changePct = item.changePct ?? Math.round(((item.postPrice - item.prePrice) / item.prePrice) * 1000) / 10
              const isUp = changePct > 0
              return (
                <div key={item.id} className="border border-border bg-bg-card rounded-lg px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-sans text-[0.82rem] font-semibold text-ink truncate">
                      {item.label}
                    </div>
                    <div className="font-sans text-[0.65rem] text-ink-muted">
                      {formatUsd(item.prePrice)} &rarr; {formatUsd(item.postPrice)}
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
        {hasLocal
          ? 'Local reference prices. Not affected by pass-through or lag settings. Not included in basket calculations.'
          : 'Global reference MSRP. Not affected by pass-through or lag settings. Not included in basket calculations.'}
      </p>
    </div>
  )
}
