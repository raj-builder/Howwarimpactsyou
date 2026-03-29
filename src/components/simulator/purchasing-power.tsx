'use client'

import { useT } from '@/lib/use-t'
import type { CurrencyEntry } from '@/types'

interface PurchasingPowerProps {
  currencyData: CurrencyEntry
}

export function PurchasingPower({ currencyData }: PurchasingPowerProps) {
  const t = useT()

  return (
    <div className="bg-bg-alt border border-border rounded-lg p-4">
      <h4 className="font-sans text-[0.78rem] font-bold text-ink mb-3 tracking-wide">
        {t('simulator.purchasingPower')}
      </h4>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-[1.5rem] font-light text-accent tracking-tight">
          {currencyData.depPct > 0 ? '+' : ''}
          {currencyData.depPct}%
        </span>
        <span className="font-sans text-[0.75rem] text-ink-muted">
          {currencyData.name} ({currencyData.code})
        </span>
      </div>
      <div className="h-2 bg-bg-card rounded-sm overflow-hidden mb-2">
        <div
          className={`h-full rounded-sm transition-all ${
            currencyData.depPct < 0 ? 'bg-accent' : 'bg-green'
          }`}
          style={{
            width: `${Math.min(Math.abs(currencyData.depPct), 100)}%`,
          }}
        />
      </div>
      <p className="font-sans text-[0.72rem] text-ink-muted leading-relaxed">
        {currencyData.depPct < 0
          ? t('simulator.depreciated', {
              currency: currencyData.name,
              pct: String(Math.abs(currencyData.depPct)),
              window: currencyData.window,
            })
          : currencyData.depPct > 0
            ? t('simulator.appreciated', {
                currency: currencyData.name,
                pct: String(currencyData.depPct),
                window: currencyData.window,
              })
            : t('simulator.stable', {
                currency: currencyData.name,
                window: currencyData.window,
              })}
      </p>
      <div className="flex gap-4 mt-2 font-sans text-[0.68rem] text-ink-muted">
        <span>
          Pre: {currencyData.preRate} {currencyData.code}/USD
        </span>
        <span>
          Post: {currencyData.postRate} {currencyData.code}/USD
        </span>
        <span>{currencyData.window}</span>
      </div>
    </div>
  )
}
