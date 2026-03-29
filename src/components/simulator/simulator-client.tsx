'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { WARS } from '@/data/wars'
import { COUNTRY_MAP } from '@/data/countries'
import { COUNTRY_REASONS } from '@/data/reasons'
import { roundValue, getProvenance } from '@/lib/calculations'
import { SoftGate } from '@/components/simulator/soft-gate'
import { WarEscalationCard } from '@/components/simulator/war-escalation-card'
import { WarSummaryCard } from '@/components/simulator/war-summary-card'
import { PresetCards } from '@/components/simulator/preset-cards'
import { BelligerentCountries } from '@/components/simulator/belligerent-countries'
import { PRE_ESCALATION_PRICES } from '@/data/pre-escalation-prices'
import { usePricesFreshness } from '@/lib/use-prices-freshness'
import { useT } from '@/lib/use-t'
import type { WarId, RankingEntry, CoverageStatus } from '@/types'

/** Escalation priority order (highest-tension first) */
const WAR_ESCALATION_ORDER: WarId[] = [
  'iran-israel-us', 'ukraine-russia', 'gaza-2023', 'covid', 'gulf-2003',
]

/* ---------- component ---------- */
export function SimulatorClient() {
  const searchParams = useSearchParams()
  const t = useT()

  /* --- only war selection state on this page --- */
  const [warId, setWarId] = useState<WarId>(
    (searchParams.get('war') as WarId) || 'iran-israel-us',
  )

  /* Rankings always use 'basket' category at 100% passthrough / immediate lag */
  const categoryId = 'basket' as const

  const war = WARS[warId] ?? WARS['iran-israel-us']
  const ranking = war.rankings[categoryId] ?? war.rankings['bread']

  const countryReason = useMemo(() => {
    const warReasons = COUNTRY_REASONS[warId]
    return warReasons ?? null
  }, [warId])

  const freshness = usePricesFreshness()
  const provenance = useMemo(() => getProvenance(freshness.fetchedAt), [freshness.fetchedAt])

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
              />
            </div>
          )
        })}
        </div>
        {/* Scroll fade indicator */}
        <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-bg to-transparent pointer-events-none" aria-hidden="true" />
      </div>

      {/* WarSummaryCard — full width, overview mode (no country) */}
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

      {/* Rankings — side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <RankingSection
          title={t('simulator.topImpacted')}
          entries={ranking.top5}
          startRank={1}
          reasons={countryReason}
          warId={warId}
        />
        <RankingSection
          title={t('simulator.bottomImpacted')}
          entries={ranking.bot5}
          startRank={6}
          reasons={countryReason}
          warId={warId}
        />
      </div>

      {/* Quick Scenarios */}
      <PresetCards />

      {/* Belligerent Countries */}
      <BelligerentCountries warId={warId} />

      {/* Provenance + SoftGate */}
      <div className="mt-10 bg-bg-alt border border-border rounded-lg px-4 py-2.5 mb-5 flex flex-wrap gap-x-5 gap-y-1 font-sans text-[0.72rem] text-ink-muted">
        <span>
          Model: <strong className="text-ink">v{provenance.modelVersion}</strong>
        </span>
        <span>
          Data as of: <strong className="text-ink">{provenance.dataAsOf}</strong>
        </span>
        <span>
          {t('simulator.rankingNote', { pt: '100', lag: 'Immediate' })}
        </span>
      </div>

      <SoftGate war={warId} category={categoryId} />
    </div>
  )
}

/* ---------- sub-components ---------- */

function RankingSection({
  title,
  entries,
  startRank,
  reasons,
  warId,
}: {
  title: string
  entries: RankingEntry[]
  startRank: number
  reasons: Record<string, string> | null
  warId: WarId
}) {
  const t = useT()

  return (
    <div>
      <h3 className="text-[1.1rem] font-serif font-normal tracking-tight text-ink mb-4">
        {title}
      </h3>
      <div className="space-y-2 stagger-fade-in">
        {entries.map((entry, i) => {
          const rank = startRank + i
          const adjustedPct = roundValue(entry.p, 'display')
          const maxPct = 55
          const barWidth = Math.min((adjustedPct / maxPct) * 100, 100)
          const countryData = COUNTRY_MAP[entry.c]
          const coverage: CoverageStatus = countryData?.coverage ?? 'unavailable'

          return (
            <Link
              key={entry.c}
              href={`/country-simulator?war=${warId}&country=${entry.c}`}
              className="no-underline block w-full text-left border rounded-lg px-4 py-4 transition-all border-border bg-bg-card hover:border-accent-warm hover:shadow-sm group"
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <span className="font-sans text-[0.78rem] font-bold text-ink-muted w-5 text-center shrink-0">
                  {rank}
                </span>
                {/* Flag */}
                <span className="text-xl shrink-0">{entry.f}</span>
                {/* Name + reason */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans text-[0.88rem] font-semibold text-ink group-hover:text-accent transition-colors">
                      {entry.c}
                    </span>
                    {coverage !== 'full' && (
                      <span className={`font-sans text-[0.58rem] font-semibold px-1.5 py-0.5 rounded tracking-[0.04em] uppercase ${
                        coverage === 'partial'
                          ? 'bg-amber-light text-amber'
                          : 'bg-blue-light text-blue'
                      }`}>
                        {coverage}
                      </span>
                    )}
                  </div>
                  {reasons?.[entry.c] && (
                    <div className="font-sans text-[0.7rem] text-ink-muted leading-snug mt-0.5 truncate">
                      {reasons[entry.c]}
                    </div>
                  )}
                </div>
                {/* Impact bar + pct + arrow */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-20 h-2 bg-bg-alt rounded-sm overflow-hidden hidden sm:block">
                    <div
                      className="h-full rounded-sm bg-gradient-to-r from-accent-warm to-accent transition-all"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="font-sans text-[1rem] font-bold text-accent w-14 text-right">
                    +{adjustedPct}%
                  </span>
                  <span className="text-ink-muted group-hover:text-accent transition-colors" aria-hidden="true">
                    &rarr;
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
