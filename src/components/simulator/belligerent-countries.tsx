'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { BELLIGERENT_COUNTRIES } from '@/data/belligerent-countries'
import { useT } from '@/lib/use-t'

const WAR_LABELS: Record<string, string> = {
  'iran-israel-us': 'Iran\u2013Israel\u2013US',
  'ukraine-russia': 'Russia\u2013Ukraine',
  'gaza-2023': 'Gaza / Red Sea',
  'gulf-2003': 'Gulf War 2003',
  'covid': 'COVID-19',
}

interface BelligerentCountriesProps {
  warId: string
}

export function BelligerentCountries({ warId }: BelligerentCountriesProps) {
  const t = useT()

  /* Sort: countries involved in the selected war first */
  const sorted = useMemo(() => {
    return [...BELLIGERENT_COUNTRIES].sort((a, b) => {
      const aMatch = a.wars.includes(warId) ? 0 : 1
      const bMatch = b.wars.includes(warId) ? 0 : 1
      return aMatch - bMatch
    })
  }, [warId])

  return (
    <section className="mt-16" id="belligerents">
      <h2 className="text-[1.1rem] font-serif font-normal tracking-tight text-ink mb-1">
        {t('simulator.belligerentsTitle')}
      </h2>
      <p className="font-sans text-[0.78rem] text-ink-muted mb-6 max-w-[600px]">
        {t('simulator.belligerentsSubtitle')}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-fade-in">
        {sorted.map((country) => {
          const isRelevant = country.wars.includes(warId)
          return (
            <article
              key={country.name}
              className={`bg-bg-card border rounded-[10px] p-5 shadow-card transition-opacity ${
                isRelevant ? 'border-border opacity-100' : 'border-border/50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-2xl">{country.flag}</span>
                <div>
                  <h3 className="font-sans text-[0.9rem] font-bold text-ink">{country.name}</h3>
                  <p className="font-sans text-[0.65rem] text-ink-muted leading-snug">{country.role}</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-bg-alt rounded-md px-2 py-1.5 text-center">
                  <div className="font-sans text-[0.85rem] font-bold text-ink">
                    ${(country.gdpBn / 1000).toFixed(1)}T
                  </div>
                  <div className="font-sans text-[0.55rem] text-ink-muted">GDP</div>
                </div>
                <div className="bg-bg-alt rounded-md px-2 py-1.5 text-center">
                  <div className="font-sans text-[0.85rem] font-bold text-ink">{country.oilMbpd}</div>
                  <div className="font-sans text-[0.55rem] text-ink-muted">Oil Mb/d</div>
                </div>
                <div className="bg-bg-alt rounded-md px-2 py-1.5 text-center">
                  <div className="font-sans text-[0.85rem] font-bold text-ink">{country.gasBcm}</div>
                  <div className="font-sans text-[0.55rem] text-ink-muted">Gas Bcm</div>
                </div>
              </div>

              <p className="font-sans text-[0.75rem] text-ink-soft leading-relaxed mb-3">
                {country.impact}
              </p>

              {/* Conflict tags */}
              <div className="flex flex-wrap gap-1.5">
                {country.wars.map((wId) => (
                  <Link
                    key={wId}
                    href={`/country-simulator?war=${wId}`}
                    className="font-sans text-[0.6rem] font-semibold bg-[#1a1a1a] text-accent-warm px-2 py-0.5 rounded no-underline hover:bg-[#2d2420] transition-colors"
                  >
                    {WAR_LABELS[wId] ?? wId}
                  </Link>
                ))}
              </div>
            </article>
          )
        })}
      </div>

      <p className="font-sans text-[0.68rem] text-ink-muted mt-4">
        {t('simulator.dataSources')}
      </p>
    </section>
  )
}
