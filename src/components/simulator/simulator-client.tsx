'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { WARS, WAR_LIST } from '@/data/wars'
import { CATEGORIES, CATEGORY_MAP } from '@/data/categories'
import { COUNTRIES, COUNTRY_MAP } from '@/data/countries'
import { CURRENCIES } from '@/data/currencies'
import { COUNTRY_REASONS } from '@/data/reasons'
import { useSimulatorState } from '@/lib/use-simulator-state'
import {
  computeScenario,
  roundValue,
  isStructuralMiss,
  validateScenarioState,
  getProvenance,
} from '@/lib/calculations'
import { ImpactDisplay } from '@/components/simulator/impact-display'
import { CoverageBadge } from '@/components/ui/coverage-badge'
import { ReliabilityBadge } from '@/components/ui/reliability-badge'
import { SoftGate, incrementExplorationCount } from '@/components/simulator/soft-gate'
import { WarEscalationCard } from '@/components/simulator/war-escalation-card'
import { WarSummaryCard } from '@/components/simulator/war-summary-card'
import { RefinementPanel } from '@/components/simulator/refinement-panel'
import { PresetCards } from '@/components/simulator/preset-cards'
import { PRE_ESCALATION_PRICES } from '@/data/pre-escalation-prices'
import { usePricesFreshness } from '@/lib/use-prices-freshness'
import { loadRefinements, saveRefinements } from '@/lib/user-refinements'
import { useT } from '@/lib/use-t'
import type { UserRefinements } from '@/types/user-refinements'
import type { WarId, CategoryId, RankingEntry, CoverageStatus } from '@/types'
import type { LagPeriod, ScenarioResult } from '@/types/scenario'
import { LAG_MULTIPLIERS, LAG_LABELS } from '@/types/scenario'

/* ---------- constants ---------- */
const PASS_OPTIONS = [100, 75, 50, 25] as const
/** Fallback escalation priority order (highest-tension first) */
const WAR_ESCALATION_ORDER: WarId[] = [
  'iran-israel-us', 'ukraine-russia', 'gaza-2023', 'covid', 'gulf-2003',
]
const LAG_OPTIONS: { label: string; value: LagPeriod }[] = [
  { label: 'Immediate', value: 'immediate' },
  { label: '3m', value: '3m' },
  { label: '6m', value: '6m' },
  { label: '12m', value: '12m' },
]

/* ---------- component ---------- */
export function SimulatorClient() {
  const {
    war: warId,
    setWar: setWarId,
    category: categoryId,
    setCategory: setCategoryId,
    country,
    setCountry,
    passthrough: passThrough,
    setPassthrough: setPassThrough,
    lag,
    setLag,
  } = useSimulatorState()

  const t = useT()

  /* --- user refinements (localStorage-backed) --- */
  const [refinements, setRefinements] = useState<UserRefinements>(() => loadRefinements())
  const handleRefinementsChange = useCallback((r: UserRefinements) => {
    setRefinements(r)
    saveRefinements(r)
  }, [])

  const [showResults, setShowResults] = useState(
    !!(warId || categoryId),
  )
  const [expandedCountry, setExpandedCountry] = useState<string | null>(
    country && COUNTRY_MAP[country] ? country : null,
  )

  /* --- derived data --- */
  const war = WARS[warId] ?? WARS['iran-israel-us']
  const ranking = war.rankings[categoryId] ?? war.rankings['bread']
  const categoryLabel =
    CATEGORY_MAP[categoryId]?.label ?? categoryId

  const currencyData = useMemo(() => {
    const warCurrencies = CURRENCIES[warId]
    if (!warCurrencies || !expandedCountry) return null
    return warCurrencies[expandedCountry] ?? null
  }, [warId, expandedCountry])

  const countryReason = useMemo(() => {
    const warReasons = COUNTRY_REASONS[warId]
    if (!warReasons) return null
    return warReasons
  }, [warId])

  /* --- currency data for escalation cards (based on selected country) --- */
  const warCurrencyForCards = useCallback(
    (wId: WarId) => {
      if (!country) return null
      const warCurrencies = CURRENCIES[wId]
      if (!warCurrencies) return null
      return warCurrencies[country] ?? null
    },
    [country],
  )

  /* --- live data freshness from SerpAPI --- */
  const freshness = usePricesFreshness()

  /* --- centralized scenario result (replaces Math.random inline calc) --- */
  const result: ScenarioResult | null = useMemo(() => {
    if (!expandedCountry) return null
    return computeScenario({
      war: warId,
      category: categoryId,
      country: expandedCountry,
      passthrough: passThrough,
      lag,
      provenance: getProvenance(freshness.fetchedAt),
    }, 'display', refinements)
  }, [warId, categoryId, expandedCountry, passThrough, lag, freshness.fetchedAt, refinements])

  /* --- validation guard --- */
  const validationErrors = useMemo(() => {
    if (!expandedCountry) return []
    return validateScenarioState({
      war: warId,
      category: categoryId,
      country: expandedCountry,
      passthrough: passThrough,
      lag,
      provenance: getProvenance(freshness.fetchedAt),
    })
  }, [warId, categoryId, expandedCountry, passThrough, lag, freshness.fetchedAt])

  /* --- provenance --- */
  const provenance = useMemo(() => getProvenance(freshness.fetchedAt), [freshness.fetchedAt])

  /* --- handlers --- */
  const handleUpdate = useCallback(() => {
    setShowResults(true)
    setExpandedCountry(country || null)
    incrementExplorationCount()
  }, [country])

  const handleRowClick = useCallback(
    (countryName: string) => {
      if (expandedCountry === countryName) {
        setExpandedCountry(null)
      } else {
        setExpandedCountry(countryName)
        setCountry(countryName)
      }
    },
    [expandedCountry, setCountry],
  )

  const handlePresetSelect = useCallback(
    (w: WarId, cat: CategoryId, c: string) => {
      setWarId(w)
      setCategoryId(cat)
      setCountry(c)
      setExpandedCountry(c)
      setShowResults(true)
      incrementExplorationCount()
    },
    [setWarId, setCategoryId, setCountry],
  )

  /* --- scroll country detail into view on selection --- */
  const countryDetailRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (expandedCountry && countryDetailRef.current) {
      countryDetailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [expandedCountry])

  /* --- grouped countries for dropdown (includes user-added) --- */
  const groupedCountries = useMemo(() => {
    const full = COUNTRIES.filter((c) => c.coverage === 'full')
    const partial = COUNTRIES.filter((c) => c.coverage === 'partial')
    const experimental = COUNTRIES.filter((c) => c.coverage === 'experimental')
    const userAdded = refinements.newCountries.map((c) => ({
      id: c.country,
      name: c.country,
      flag: c.flag,
      coverage: 'experimental' as const,
    }))
    return { full, partial, experimental, userAdded }
  }, [refinements.newCountries])

  /* --- lag multiplier for display --- */
  const lagMultiplier = LAG_MULTIPLIERS[lag]

  return (
    <div className="container-page py-8">
      {/* Page header */}
      <div className="mb-6">
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

      {/* 2-col layout */}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 items-start">
        {/* ====== LEFT PANEL ====== */}
        <aside className="bg-bg-card border border-border rounded-[10px] p-5 shadow-card md:sticky md:top-[72px] order-1">
          <h2 className="font-sans text-[0.82rem] font-bold text-ink mb-4 tracking-wide">
            {t('simulator.controls')}
          </h2>

          {/* War selector — escalation cards */}
          <fieldset className="mb-5">
            <legend className="font-sans text-[0.72rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-2">
              {t('simulator.conflict')}
            </legend>
            <div className="flex flex-col gap-2">
              {WAR_ESCALATION_ORDER.map((wId) => {
                const w = WARS[wId]
                if (!w) return null
                const anchors = PRE_ESCALATION_PRICES[wId]
                const currForCard = warCurrencyForCards(wId)
                return (
                  <WarEscalationCard
                    key={wId}
                    warId={wId}
                    warName={w.name}
                    warDates={w.dates}
                    live={w.live}
                    escalationDate={anchors?.escalationDate ?? ''}
                    pivotalEvent={anchors?.pivotalEvent ?? ''}
                    selectedCountry={country || null}
                    currencyCode={currForCard?.code ?? null}
                    currencyName={currForCard?.name ?? null}
                    fxPreRate={currForCard?.preRate ?? null}
                    fxPostRate={currForCard?.postRate ?? null}
                    fxDepPct={currForCard?.depPct ?? null}
                    isSelected={warId === wId}
                    onClick={() => setWarId(wId)}
                    compact
                  />
                )
              })}
            </div>
          </fieldset>

          {/* Category dropdown */}
          <fieldset className="mb-4">
            <legend className="font-sans text-[0.72rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-1.5">
              {t('simulator.category')}
            </legend>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as CategoryId)}
              className="w-full border border-border rounded-lg px-3 py-2 font-sans text-[0.82rem] text-ink bg-bg-card focus:outline-none focus:border-accent"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </fieldset>

          {/* Country dropdown */}
          <fieldset className="mb-4">
            <legend className="font-sans text-[0.72rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-1.5">
              {t('simulator.country')}
            </legend>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 font-sans text-[0.82rem] text-ink bg-bg-card focus:outline-none focus:border-accent"
            >
              <option value="">{t('simulator.allCountries')}</option>
              <optgroup label="Full coverage">
                {groupedCountries.full.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Partial coverage">
                {groupedCountries.partial.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Experimental">
                {groupedCountries.experimental.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </optgroup>
              {groupedCountries.userAdded.length > 0 && (
                <optgroup label="User-added">
                  {groupedCountries.userAdded.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.flag} {c.name} (user)
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </fieldset>

          {/* Pass-through chips */}
          <fieldset className="mb-4">
            <legend className="font-sans text-[0.72rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-1.5">
              {t('simulator.passthrough')}
            </legend>
            <div className="flex gap-2">
              {PASS_OPTIONS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPassThrough(p)}
                  className={`flex-1 font-sans text-[0.75rem] font-semibold py-1.5 rounded-md border transition-all cursor-pointer ${
                    passThrough === p
                      ? 'border-accent bg-accent text-white'
                      : 'border-border bg-bg-card text-ink-soft hover:border-accent-warm'
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </fieldset>

          {/* Lag chips */}
          <fieldset className="mb-5">
            <legend className="font-sans text-[0.72rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-1.5">
              {t('simulator.lagPeriod')}
            </legend>
            <div className="flex gap-2">
              {LAG_OPTIONS.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLag(l.value)}
                  className={`flex-1 font-sans text-[0.72rem] font-semibold py-1.5 rounded-md border transition-all cursor-pointer ${
                    lag === l.value
                      ? 'border-accent bg-accent text-white'
                      : 'border-border bg-bg-card text-ink-soft hover:border-accent-warm'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Update button */}
          <button
            onClick={handleUpdate}
            className="w-full bg-accent text-white font-sans text-[0.85rem] font-semibold py-2.5 rounded-lg hover:bg-[#b03e27] transition-colors cursor-pointer"
          >
            {t('simulator.updateView')}
          </button>

          {/* Refinement panel */}
          <RefinementPanel
            refinements={refinements}
            onRefinementsChange={handleRefinementsChange}
          />
        </aside>

        {/* ====== RIGHT PANEL ====== */}
        <section className="order-2 min-w-0">
          {!showResults ? (
            <div className="bg-bg-card border border-border rounded-[10px] p-10 text-center">
              <p className="font-sans text-[0.9rem] text-ink-muted">
                {t('simulator.selectPrompt')}
              </p>
            </div>
          ) : (
            <div className="animate-fade-in">
              {/* 1. "So What" summary card — personal insight + share */}
              <WarSummaryCard
                warId={warId}
                warName={war.name}
                warDates={war.dates}
                live={war.live}
                categoryId={categoryId}
                categoryLabel={categoryLabel}
                country={expandedCountry}
                countryFlag={expandedCountry ? COUNTRY_MAP[expandedCountry]?.flag ?? null : null}
                passthrough={passThrough}
                lag={lag}
                lagMultiplier={lagMultiplier}
                lagAdjustedCeiling={result?.lagAdjustedCeiling ?? null}
                provenance={provenance}
                serpApiFetchedAt={freshness.fetchedAt}
              />

              {/* 2. Country detail panel — promoted to top when selected */}
              {expandedCountry && validationErrors.length > 0 && (
                <div className="bg-accent-light border border-accent/30 rounded-lg px-4 py-3 mb-4">
                  <p className="font-sans text-[0.78rem] text-accent font-semibold mb-1">
                    {t('simulator.cannotCompute')}
                  </p>
                  <ul className="font-sans text-[0.72rem] text-accent/80 list-disc pl-4 space-y-0.5">
                    {validationErrors.map((e) => (
                      <li key={e.field}>{e.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {expandedCountry && result && validationErrors.length === 0 && (
                <div ref={countryDetailRef} className="bg-bg-card border border-border rounded-[10px] p-5 mb-5 animate-fade-in">
                  {/* Header with coverage + reliability badges */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {COUNTRY_MAP[expandedCountry]?.flag ?? ''}
                      </span>
                      <div>
                        <h3 className="font-sans text-[0.95rem] font-bold text-ink">
                          {expandedCountry}
                        </h3>
                        <p className="font-sans text-[0.72rem] text-ink-muted">
                          {categoryLabel}
                        </p>
                      </div>
                      <div className="flex gap-1.5 ml-2">
                        <CoverageBadge status={result.coverage} />
                        <ReliabilityBadge status={result.reliability} showTooltip />
                        {result.userRefined && (
                          <span className="inline-block font-sans text-[0.62rem] font-bold bg-blue-light text-blue px-1.5 py-0.5 rounded tracking-[0.04em]">
                            {t('badges.userData')}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedCountry(null)}
                      className="font-sans text-[0.8rem] text-ink-muted hover:text-accent transition-colors cursor-pointer"
                      aria-label={t('simulator.close')}
                    >
                      {t('simulator.close')}
                    </button>
                  </div>

                  {/* Structural miss warning */}
                  {isStructuralMiss(expandedCountry) && (
                    <div className="bg-amber-light border border-[#e8c97a] rounded-lg px-3 py-2.5 mb-4">
                      <p className="font-sans text-[0.72rem] text-[#7a4f10] leading-relaxed">
                        <strong className="text-[#5a3408]">{t('simulator.validationNote')}</strong>{' '}
                        {t('simulator.validationWarning', { country: expandedCountry })}{' '}
                        <a href="/methodology#validation" className="underline text-[#5a3408]">
                          {t('simulator.seeValidation')}
                        </a>{' '}
                        {t('simulator.forDetails')}
                      </p>
                    </div>
                  )}

                  {/* Impact range display */}
                  <div className="mb-6">
                    <ImpactDisplay
                      lagAdjustedCeiling={result.lagAdjustedCeiling}
                      rangeLow={result.rangeLow}
                      rangeHigh={result.rangeHigh}
                      lag={lag}
                      lagMultiplier={result.lagMultiplier}
                    />
                  </div>

                  {/* 5 big-number cards */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                    <StatCard
                      label={t('simulator.impactCeiling')}
                      value={`+${result.lagAdjustedCeiling}%`}
                      accent
                    />
                    <StatCard
                      label={t('simulator.realizedEst')}
                      value={`+${result.realized}%`}
                    />
                    <StatCard
                      label={t('simulator.modelGap')}
                      value={`${result.modelGap}pp`}
                    />
                    <StatCard
                      label={t('simulator.passThroughLabel')}
                      value={`${passThrough}%`}
                    />
                    <StatCard
                      label={t('simulator.lagMultiplier')}
                      value={`${result.lagMultiplier}x`}
                    />
                  </div>

                  {/* Factor contribution breakdown */}
                  <div className="mb-6">
                    <h4 className="font-sans text-[0.78rem] font-bold text-ink mb-3 tracking-wide">
                      {t('simulator.factorBreakdown')}
                    </h4>
                    <div className="space-y-2">
                      {result.factors.map((f) => (
                        <div key={f.label} className="flex items-center gap-3">
                          <span className="font-sans text-[0.72rem] text-ink-muted w-24 shrink-0">
                            {f.label}
                          </span>
                          <div className="flex-1 h-5 bg-bg-alt rounded-sm overflow-hidden">
                            <div
                              className={`h-full ${f.color} rounded-sm transition-all`}
                              style={{
                                width: `${
                                  result.lagAdjustedCeiling > 0
                                    ? (f.absolutePct / result.lagAdjustedCeiling) * 100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                          <span className="font-sans text-[0.72rem] font-semibold text-ink w-16 text-right">
                            +{f.absolutePct}%
                          </span>
                          <span className="font-sans text-[0.62rem] text-ink-muted w-10 text-right">
                            {f.sharePct}%
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 font-sans text-[0.68rem] text-ink-muted border-t border-border pt-1.5">
                      <span className="w-24 shrink-0" />
                      <span className="flex-1" />
                      <span className="font-semibold text-ink w-16 text-right">
                        ={result.lagAdjustedCeiling}%
                      </span>
                      <span className="w-10 text-right">100%</span>
                    </div>
                  </div>

                  {/* Purchasing power erosion */}
                  {currencyData && (
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
                            currencyData.depPct < 0
                              ? 'bg-accent'
                              : 'bg-green'
                          }`}
                          style={{
                            width: `${Math.min(Math.abs(currencyData.depPct), 100)}%`,
                          }}
                        />
                      </div>
                      <p className="font-sans text-[0.72rem] text-ink-muted leading-relaxed">
                        {currencyData.depPct < 0
                          ? t('simulator.depreciated', { currency: currencyData.name, pct: String(Math.abs(currencyData.depPct)), window: currencyData.window })
                          : currencyData.depPct > 0
                            ? t('simulator.appreciated', { currency: currencyData.name, pct: String(currencyData.depPct), window: currencyData.window })
                            : t('simulator.stable', { currency: currencyData.name, window: currencyData.window })}
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
                  )}
                </div>
              )}

              {/* 3. Quick scenarios */}
              <PresetCards
                onSelect={handlePresetSelect}
                activeWar={warId}
                activeCategory={categoryId}
                activeCountry={expandedCountry ?? undefined}
              />

              {/* 4. Assumption strip with provenance */}
              <div className="bg-bg-alt border border-border rounded-lg px-4 py-2.5 mb-5 flex flex-wrap gap-x-5 gap-y-1 font-sans text-[0.72rem] text-ink-muted">
                <span>
                  {t('simulator.category')}: <strong className="text-ink">{categoryLabel}</strong>
                </span>
                <span>
                  {t('simulator.passthrough')}: <strong className="text-ink">{passThrough}%</strong>
                </span>
                <span>
                  {t('simulator.lagPeriod')}: <strong className="text-ink">{LAG_LABELS[lag]}</strong>
                  {lagMultiplier < 1 && (
                    <span className="text-ink-muted"> ({lagMultiplier}x)</span>
                  )}
                </span>
                <span>
                  Model: <strong className="text-ink">v{provenance.modelVersion}</strong>
                </span>
                <span>
                  Data as of: <strong className="text-ink">{provenance.dataAsOf}</strong>
                </span>
              </div>

              {/* 4. Rankings */}
              <RankingSection
                title={t('simulator.topImpacted')}
                entries={ranking.top5}
                startRank={1}
                reasons={countryReason}
                expandedCountry={expandedCountry}
                onRowClick={handleRowClick}
                passThrough={passThrough}
                lag={lag}
              />

              <RankingSection
                title={t('simulator.bottomImpacted')}
                entries={ranking.bot5}
                startRank={6}
                reasons={countryReason}
                expandedCountry={expandedCountry}
                onRowClick={handleRowClick}
                passThrough={passThrough}
                lag={lag}
              />

              {/* Ranking methodology note */}
              <div className="font-sans text-[0.68rem] text-ink-muted mt-1 mb-5 px-1">
                {t('simulator.rankingNote', { pt: String(passThrough), lag: LAG_LABELS[lag] })}
              </div>

              {/* Soft gate banner */}
              <SoftGate war={warId} category={categoryId} />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

/* ---------- sub-components ---------- */

function RankingSection({
  title,
  entries,
  startRank,
  reasons,
  expandedCountry,
  onRowClick,
  passThrough,
  lag,
}: {
  title: string
  entries: RankingEntry[]
  startRank: number
  reasons: Record<string, string> | null
  expandedCountry: string | null
  onRowClick: (c: string) => void
  passThrough: number
  lag: LagPeriod
}) {
  const lagMultiplier = LAG_MULTIPLIERS[lag]

  return (
    <div className="mb-5">
      <h3 className="font-sans text-[0.78rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-2">
        {title}
      </h3>
      <div className="space-y-1.5">
        {entries.map((entry, i) => {
          const rank = startRank + i
          const isExpanded = expandedCountry === entry.c
          // Apply both passthrough AND lag multiplier
          const adjustedPct = roundValue(
            entry.p * (passThrough / 100) * lagMultiplier,
            'display',
          )
          const maxPct = 55
          const barWidth = Math.min((adjustedPct / maxPct) * 100, 100)

          // Get coverage for inline badge
          const countryData = COUNTRY_MAP[entry.c]
          const coverage: CoverageStatus = countryData?.coverage ?? 'unavailable'

          return (
            <div key={entry.c}>
              <button
                onClick={() => onRowClick(entry.c)}
                className={`w-full text-left border rounded-lg px-4 py-3 transition-all cursor-pointer flex items-center gap-3 ${
                  isExpanded
                    ? 'border-accent bg-accent-light'
                    : 'border-border bg-bg-card hover:border-accent-warm'
                }`}
              >
                {/* Rank */}
                <span className="font-sans text-[0.75rem] font-bold text-ink-muted w-5 text-center shrink-0">
                  {rank}
                </span>
                {/* Flag */}
                <span className="text-lg shrink-0">{entry.f}</span>
                {/* Name + reason + coverage */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans text-[0.82rem] font-semibold text-ink">
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
                    <div className="font-sans text-[0.68rem] text-ink-muted leading-snug mt-0.5 truncate">
                      {reasons[entry.c]}
                    </div>
                  )}
                </div>
                {/* Impact bar + pct */}
                <div className="flex items-center gap-2 shrink-0 w-32">
                  <div className="flex-1 h-2 bg-bg-alt rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm bg-gradient-to-r from-accent-warm to-accent transition-all"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="font-sans text-[0.78rem] font-bold text-accent w-12 text-right">
                    +{adjustedPct}%
                  </span>
                </div>
              </button>
              {/* Inline ImpactDisplay when expanded */}
              {isExpanded && (
                <div className="ml-8 mr-4 mt-1 mb-2 animate-fade-in">
                  <ImpactDisplay
                    lagAdjustedCeiling={adjustedPct}
                    rangeLow={roundValue(adjustedPct * 0.55, 'display')}
                    rangeHigh={roundValue(adjustedPct * 0.75, 'display')}
                    lag={lag}
                    lagMultiplier={lagMultiplier}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="bg-bg-alt border border-border rounded-lg p-3 text-center">
      <div
        className={`text-[1.3rem] font-light tracking-tight ${
          accent ? 'text-accent' : 'text-ink'
        }`}
      >
        {value}
      </div>
      <div className="font-sans text-[0.65rem] text-ink-muted mt-0.5 uppercase tracking-[0.04em]">
        {label}
      </div>
    </div>
  )
}
