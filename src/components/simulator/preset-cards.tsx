'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { WARS } from '@/data/wars'
import { findCountryEntry } from '@/lib/calculations'
import { useT } from '@/lib/use-t'
import type { WarId, CategoryId } from '@/types'

interface Preset {
  labelKey: string
  icon: string
  flag: string
  war: WarId
  category: CategoryId
  country: string
}

const PRESETS: Preset[] = [
  {
    labelKey: 'presets.breadEgypt',
    icon: '🍞',
    flag: '🇪🇬',
    war: 'ukraine-russia',
    category: 'bread',
    country: 'Egypt',
  },
  {
    labelKey: 'presets.fuelPhilippines',
    icon: '⛽',
    flag: '🇵🇭',
    war: 'iran-israel-us',
    category: 'fuel',
    country: 'Philippines',
  },
  {
    labelKey: 'presets.covidIndia',
    icon: '🛒',
    flag: '🇮🇳',
    war: 'covid',
    category: 'basket',
    country: 'India',
  },
]

export function PresetCards() {
  const t = useT()

  const presetsWithImpact = useMemo(() => {
    return PRESETS.map((preset) => {
      const entry = findCountryEntry(preset.war, preset.category, preset.country)
      return { ...preset, impact: entry?.p ?? 0 }
    })
  }, [])

  return (
    <div className="mb-10">
      <h2 className="text-[1.1rem] font-serif font-normal tracking-tight text-ink mb-1">
        {t('presets.title')}
      </h2>
      <p className="font-sans text-[0.78rem] text-ink-muted mb-4">
        {t('presets.subtitle')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {presetsWithImpact.map((preset) => (
          <Link
            key={preset.labelKey}
            href={`/country-simulator?war=${preset.war}&category=${preset.category}&country=${preset.country}`}
            className="no-underline group border border-border rounded-lg px-4 py-3.5 bg-bg-card hover:border-accent hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl shrink-0" aria-hidden="true">{preset.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="font-sans text-[0.82rem] font-semibold text-ink group-hover:text-accent transition-colors">
                  {t(preset.labelKey)}
                </div>
                <div className="font-sans text-[0.65rem] text-ink-muted mt-0.5">
                  {preset.icon} {WARS[preset.war]?.name ?? preset.war}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-sans text-[1rem] font-bold text-accent">
                  +{preset.impact}%
                </span>
                <div className="font-sans text-[0.58rem] text-ink-muted">
                  {t('common.priceCeiling')}
                </div>
              </div>
            </div>
            <div className="mt-2 font-sans text-[0.65rem] text-accent font-semibold">
              {t('presets.tryThis')} &rarr;
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
