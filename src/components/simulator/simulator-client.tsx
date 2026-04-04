'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { WARS } from '@/data/wars'
import { COUNTRY_MAP } from '@/data/countries'
import { COUNTRY_REASONS } from '@/data/reasons'
import { BELLIGERENT_COUNTRIES } from '@/data/belligerent-countries'
import { roundValue, getProvenance, findCountryEntry } from '@/lib/calculations'
import { SoftGate } from '@/components/simulator/soft-gate'
import { WarEscalationCard } from '@/components/simulator/war-escalation-card'
import { WarSummaryCard } from '@/components/simulator/war-summary-card'
import { PresetCards } from '@/components/simulator/preset-cards'
import { PRE_ESCALATION_PRICES } from '@/data/pre-escalation-prices'
import { usePricesFreshness } from '@/lib/use-prices-freshness'
import { useT } from '@/lib/use-t'
import type { WarId, RankingEntry, CoverageStatus, Region, CategoryId } from '@/types'

/** Categories to show as separate impact cards on the simulator */
const CATEGORY_HIGHLIGHTS: { id: CategoryId; label: string; icon: string }[] = [
  { id: 'bread', label: 'Cereal & Bread', icon: '🍞' },
  { id: 'fuel', label: 'Household Fuel', icon: '⛽' },
  { id: 'oil', label: 'Cooking Oil', icon: '🫒' },
  { id: 'dairy', label: 'Dairy', icon: '🥛' },
]

/** Short insight per belligerent explaining their consumer price vulnerability */
const BELLIGERENT_INSIGHT_MAP: Record<string, string> = {
  'United States': 'Net energy exporter. Food self-sufficient. Fuel at pump still rises with global crude.',
  'Iran': 'War zone. Refineries targeted, fuel imports cut. 70% of rice imported via blocked Gulf.',
  'Israel': '100% oil importer (Med route, not Hormuz). Food from EU. Shekel depreciation amplifies.',
  'Saudi Arabia': 'Fuel subsidized by decree. But 90% of food imported — bread, rice, meat all up.',
  'UAE': 'Jebel Ali port shutdown. 90% food imported. Fuel subsidized. Logistics hub destroyed.',
  'Kuwait': 'Cheapest fuel in world (subsidized). But 90% food imported via disrupted routes.',
  'Qatar': 'LNG hub targeted. 90% food imported. Sovereign wealth absorbs some cost.',
  'Bahrain': 'Smallest Gulf economy. Weakest fiscal buffer. Closest to Iran — highest physical risk.',
  'Lebanon': 'Pre-existing economic crisis. 85% food imported. Currency already collapsed.',
  'Russia': 'Oil exporter. Food self-sufficient. Sanctions limit but domestic market insulated.',
  'Ukraine': 'Active war zone. Agricultural exporter but infrastructure damaged.',
}

/** Escalation priority order (highest-tension first) */
const WAR_ESCALATION_ORDER: WarId[] = [
  'hormuz-2026', 'iran-israel-us', 'ukraine-russia', 'gaza-2023', 'covid', 'gulf-2003',
]

const REGION_ORDER: Region[] = [
  'Middle East & North Africa',
  'South Asia',
  'Sub-Saharan Africa',
  'Southeast Asia',
  'East Asia',
  'Europe',
  'Americas',
]

/* ---------- component ---------- */
export function SimulatorClient() {
  const searchParams = useSearchParams()
  const t = useT()

  const [warId, setWarId] = useState<WarId>(
    (searchParams.get('war') as WarId) || 'hormuz-2026',
  )

  const categoryId = 'basket' as const

  const war = WARS[warId] ?? WARS['hormuz-2026']
  const ranking = war.rankings[categoryId] ?? war.rankings['bread']

  const countryReason = useMemo(() => {
    const warReasons = COUNTRY_REASONS[warId]
    return warReasons ?? null
  }, [warId])

  const freshness = usePricesFreshness()
  const provenance = useMemo(() => getProvenance(freshness.fetchedAt), [freshness.fetchedAt])

  /* Merge top5 + bot5 into one sorted array, then group by region */
  const allEntries = useMemo(() => {
    const merged = [...ranking.top5, ...ranking.bot5]
    return merged.sort((a, b) => b.p - a.p)
  }, [ranking])

  const globalTop5 = allEntries.slice(0, 5)

  const regionalGroups = useMemo(() => {
    const groups: Record<string, { entries: (RankingEntry & { globalRank: number })[]; avgImpact: number }> = {}
    allEntries.forEach((entry, idx) => {
      const countryData = COUNTRY_MAP[entry.c]
      const region = countryData?.region ?? 'Other'
      if (!groups[region]) groups[region] = { entries: [], avgImpact: 0 }
      groups[region].entries.push({ ...entry, globalRank: idx + 1 })
    })
    for (const region of Object.keys(groups)) {
      const g = groups[region]
      g.avgImpact = Math.round((g.entries.reduce((s, e) => s + e.p, 0) / g.entries.length) * 10) / 10
    }
    return groups
  }, [allEntries])

  const sortedRegions = REGION_ORDER.filter((r) => regionalGroups[r])

  return (
    <div className="container-page py-12">
      {/* Page header */}
      <div className="mb-10">
        <p className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-1">
          {t('simulator.eyebrow')}
        </p>
        <h1 className="text-[clamp(1.6rem,3vw,2.2rem)] font-normal tracking-tight text-ink font-serif">
          {t('simulator.title')}
        </h1>
        <p className="font-sans text-[0.85rem] text-ink-soft mt-1 max-w-[600px] leading-relaxed">
          {t('simulator.subtitle')}
        </p>
      </div>

      {/* War selection — horizontal scrollable strip */}
      <div className="relative mb-10">
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2" style={{ scrollSnapType: 'x mandatory' }}>
        {WAR_ESCALATION_ORDER.map((wId) => {
          const w = WARS[wId]
          if (!w) return null
          const anchors = PRE_ESCALATION_PRICES[wId]
          return (
            <div key={wId} className="shrink-0" style={{ scrollSnapAlign: 'start' }}>
              <WarEscalationCard
                warId={wId}
                warName={w.name}
                warDates={w.dates}
                live={w.live}
                escalationDate={anchors?.escalationDate ?? ''}
                pivotalEvent={anchors?.pivotalEvent ?? ''}
                selectedCountry={null}
                currencyCode={null}
                currencyName={null}
                fxPreRate={null}
                fxPostRate={null}
                fxDepPct={null}
                isSelected={warId === wId}
                onClick={() => setWarId(wId)}
                compact
                horizontal
                sourceUrl={w.sourceUrl}
              />
            </div>
          )
        })}
        </div>
        <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-bg to-transparent pointer-events-none" aria-hidden="true" />
      </div>

      {/* WarSummaryCard */}
      <WarSummaryCard
        warId={warId}
        warName={war.name}
        warDates={war.dates}
        live={war.live}
        categoryId={categoryId}
        categoryLabel="Household Basics"
        country={null}
        countryFlag={null}
        passthrough={100}
        lag="immediate"
        lagMultiplier={1}
        lagAdjustedCeiling={null}
        provenance={provenance}
        serpApiFetchedAt={freshness.fetchedAt}
      />

      {/* Directly involved countries — standalone rows below war card */}
      {(() => {
        const involved = BELLIGERENT_COUNTRIES.filter((b) => b.wars.includes(warId))
        if (involved.length === 0) return null
        const withImpact = involved.map((b) => {
          const entry = findCountryEntry(warId, 'basket', b.name)
          return { ...b, basketPct: entry?.p ?? 0 }
        }).sort((a, b) => b.basketPct - a.basketPct)

        return (
          <div className="mb-10 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-[1.1rem] font-serif font-normal tracking-tight text-ink">
                Directly involved — {war.name}
              </h2>
              {war.live && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-[0.65rem] font-bold text-accent tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
                  LIVE
                </span>
              )}
            </div>
            <div className="space-y-2 stagger-fade-in">
              {withImpact.map((b) => {
                const insight = BELLIGERENT_INSIGHT_MAP[b.name] ?? b.role.split(',')[0]
                return (
                  <Link
                    key={b.name}
                    href={`/country-simulator?war=${warId}&country=${encodeURIComponent(b.name)}&pt=100&lag=immediate`}
                    className="flex items-center gap-4 border border-border bg-bg-card rounded-lg px-5 py-4 no-underline hover:border-accent-warm hover:shadow-sm transition-all group"
                  >
                    <span className="text-xl shrink-0">{b.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-[0.88rem] font-semibold text-ink group-hover:text-accent transition-colors">{b.name}</div>
                      <div className="font-sans text-[0.7rem] text-ink-muted leading-snug mt-0.5">{insight}</div>
                    </div>
                    <span className={`font-sans text-[1rem] font-bold shrink-0 ${
                      b.basketPct > 20 ? 'text-accent' : b.basketPct > 10 ? 'text-accent-warm' : 'text-ink-muted'
                    }`}>
                      {b.basketPct > 0 ? `+${b.basketPct}%` : '—'}
                    </span>
                    <span className="text-ink-muted group-hover:text-accent transition-colors shrink-0" aria-hidden="true">&rarr;</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })()}

      {/* Category-specific impact views */}
      <div className="mb-10">
        <h2 className="text-[1.1rem] font-serif font-normal tracking-tight text-ink mb-4">
          Most impacted countries by category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORY_HIGHLIGHTS.map((cat) => {
            const catRanking = war.rankings[cat.id]
            if (!catRanking) return null
            const top3 = catRanking.top5.slice(0, 3)
            return (
              <div key={cat.id} className="bg-bg-card border border-border rounded-[10px] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg" aria-hidden="true">{cat.icon}</span>
                  <h3 className="font-sans text-[0.88rem] font-bold text-ink">{cat.label}</h3>
                </div>
                <div className="space-y-1.5">
                  {top3.map((entry, i) => (
                    <Link
                      key={entry.c}
                      href={`/country-simulator?war=${warId}&country=${entry.c}&category=${cat.id}`}
                      className="no-underline flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-bg-alt transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-[0.68rem] font-bold text-ink-muted w-4">{i + 1}</span>
                        <span className="text-sm">{entry.f}</span>
                        <span className="font-sans text-[0.8rem] text-ink">{entry.c}</span>
                      </div>
                      <span className="font-sans text-[0.85rem] font-bold text-accent">+{roundValue(entry.p, 'display')}%</span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Regional breakdown */}
      <div className="mb-10">
        <h2 className="text-[1.1rem] font-serif font-normal tracking-tight text-ink mb-4">
          Impact by region
        </h2>
        <div className="space-y-3">
          {sortedRegions.map((region) => {
            const group = regionalGroups[region]
            if (!group) return null
            return (
              <details key={region} className="group border border-border rounded-[10px] bg-bg-card overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-3.5 cursor-pointer list-none hover:bg-bg-alt transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-ink-muted group-open:rotate-90 transition-transform text-[0.7rem]">&#9654;</span>
                    <span className="font-sans text-[0.9rem] font-semibold text-ink">{region}</span>
                    <span className="font-sans text-[0.68rem] text-ink-muted">
                      {group.entries.length} countries
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-[0.72rem] text-ink-muted">avg</span>
                    <span className="font-sans text-[0.9rem] font-bold text-accent">+{group.avgImpact}%</span>
                  </div>
                </summary>
                <div className="px-3 pb-3 space-y-1.5">
                  {group.entries.map((entry) => (
                    <CountryRow key={entry.c} entry={entry} rank={entry.globalRank} warId={warId} reasons={countryReason} maxPct={allEntries[0]?.p ?? 55} />
                  ))}
                </div>
              </details>
            )
          })}
        </div>
      </div>

      {/* Quick Scenarios */}
      <PresetCards />

      {/* Provenance + SoftGate */}
      <div className="mt-10 bg-bg-alt border border-border rounded-lg px-4 py-2.5 mb-5 flex flex-wrap gap-x-5 gap-y-1 font-sans text-[0.72rem] text-ink-muted">
        <span>Model: <strong className="text-ink">v{provenance.modelVersion}</strong></span>
        <span>Data as of: <strong className="text-ink">{provenance.dataAsOf}</strong></span>
        <span>{t('simulator.rankingNote', { pt: '100', lag: 'Immediate' })}</span>
      </div>

      <SoftGate war={warId} category={categoryId} />
    </div>
  )
}

/* ---------- sub-components ---------- */

function CountryRow({
  entry,
  rank,
  warId,
  reasons,
  maxPct,
}: {
  entry: RankingEntry
  rank: number
  warId: WarId
  reasons: Record<string, string> | null
  maxPct: number
}) {
  const adjustedPct = roundValue(entry.p, 'display')
  const barWidth = Math.min((adjustedPct / maxPct) * 100, 100)
  const countryData = COUNTRY_MAP[entry.c]
  const coverage: CoverageStatus = countryData?.coverage ?? 'unavailable'

  return (
    <Link
      href={`/country-simulator?war=${warId}&country=${entry.c}`}
      className="no-underline block w-full text-left border rounded-lg px-4 py-3.5 transition-all border-border bg-bg-card hover:border-accent-warm hover:shadow-sm group"
    >
      <div className="flex items-center gap-3">
        <span className="font-sans text-[0.72rem] font-bold text-ink-muted w-5 text-center shrink-0">{rank}</span>
        <span className="text-xl shrink-0">{entry.f}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-sans text-[0.85rem] font-semibold text-ink group-hover:text-accent transition-colors">{entry.c}</span>
            {coverage !== 'full' && (
              <span className={`font-sans text-[0.55rem] font-semibold px-1.5 py-0.5 rounded tracking-[0.04em] uppercase ${
                coverage === 'partial' ? 'bg-amber-light text-amber' : 'bg-blue-light text-blue'
              }`}>{coverage}</span>
            )}
          </div>
          {reasons?.[entry.c] && (
            <div className="font-sans text-[0.68rem] text-ink-muted leading-snug mt-0.5 truncate">{reasons[entry.c]}</div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-16 h-2 bg-bg-alt rounded-sm overflow-hidden hidden sm:block">
            <div className="h-full rounded-sm bg-gradient-to-r from-accent-warm to-accent transition-all" style={{ width: `${barWidth}%` }} />
          </div>
          <span className="font-sans text-[0.95rem] font-bold text-accent w-14 text-right">+{adjustedPct}%</span>
          <span className="text-ink-muted group-hover:text-accent transition-colors" aria-hidden="true">&rarr;</span>
        </div>
      </div>
    </Link>
  )
}
