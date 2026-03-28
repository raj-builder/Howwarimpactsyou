'use client'

import { useMemo } from 'react'
import { WARS } from '@/data/wars'
import { findCountryEntry } from '@/lib/calculations'
import { useT } from '@/lib/use-t'
import type { WarId, CategoryId } from '@/types'

interface PresetCardsProps {
  onSelect: (war: WarId, category: CategoryId, country: string) => void
  activeWar?: WarId
  activeCategory?: CategoryId
  activeCountry?: string
}

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

export function PresetCards({ onSelect, activeWar, activeCategory, activeCountry }: PresetCardsProps) {
  const t = useT()

  const presetsWithImpact = useMemo(() => {
    return PRESETS.map((preset) => {
      const entry = findCountryEntry(preset.war, preset.category, preset.country)
      return { ...preset, impact: entry?.p ?? 0 }
    })
  }, [])

  return (
    <div className="mb-5">
      <p className="font-sans text-[0.72rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-1.5">
        {t('presets.title')}
      </p>
      <p className="font-sans text-[0.68rem] text-ink-muted mb-2.5">
        {t('presets.subtitle')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {presetsWithImpact.map((preset) => {
          const isActive =
            activeWar === preset.war &&
            activeCategory === preset.category &&
            activeCountry === preset.country
          return (
            <button
              key={preset.labelKey}
              onClick={() => onSelect(preset.war, preset.category, preset.country)}
              className={`group text-left border rounded-lg px-4 py-3 transition-all cursor-pointer ${
                isActive
                  ? 'border-accent bg-accent-light shadow-sm'
                  : 'border-border bg-bg-card hover:border-accent hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl shrink-0" aria-hidden="true">{preset.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-sans text-[0.8rem] font-semibold text-ink group-hover:text-accent transition-colors">
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
            </button>
          )
        })}
      </div>
    </div>
  )
}
