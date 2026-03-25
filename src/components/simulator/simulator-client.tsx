'use client'

import { useState, useCallback, useMemo } from 'react'
import { WARS, WAR_LIST } from '@/data/wars'
import { CATEGORIES, CATEGORY_MAP } from '@/data/categories'
import { COUNTRIES, COUNTRY_MAP } from '@/data/countries'
import { CURRENCIES } from '@/data/currencies'
import { COUNTRY_REASONS } from '@/data/reasons'
import { useSimulatorState } from '@/lib/use-simulator-state'
import { ImpactDisplay } from '@/components/simulator/impact-display'
import { SoftGate, incrementExplorationCount } from '@/components/simulator/soft-gate'
import type { WarId, CategoryId, RankingEntry } from '@/types'

/* ---------- constants ---------- */
const PASS_OPTIONS = [100, 75, 50, 25] as const
const LAG_OPTIONS = [
  { label: 'Immediate', value: 'immediate' },
  { label: '3m', value: '3m' },
  { label: '6m', value: '6m' },
  { label: '12m', value: '12m' },
] as const

const WATERFALL_FACTORS = [
  { label: 'Grains', pct: 42, color: 'bg-amber' },
  { label: 'FX', pct: 22, color: 'bg-blue' },
  { label: 'Energy', pct: 21, color: 'bg-accent' },
  { label: 'Fertilizer', pct: 10, color: 'bg-green' },
  { label: 'Metals', pct: 5, color: 'bg-ink-muted' },
]

/* ---------- helper: find a country entry in rankings ---------- */
function findCountryImpact(
  entries: RankingEntry[],
  country: string,
): RankingEntry | undefined {
  return entries.find((e) => e.c === country)
}

/* ---------- component ---------- */
export function SimulatorClient() {
  /* --- use the URL-synced state hook --- */
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

  const [showResults, setShowResults] = useState(
    !!(warId || categoryId),
  )
  const [expandedCountry, setExpandedCountry] = useState<string | null>(
    country && COUNTRY_MAP[country] ? country : null,
  )

  /* --- derived data --- */
  const war = WARS[warId] ?? WARS['ukraine-russia']
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

  /* --- grouped countries for dropdown --- */
  const groupedCountries = useMemo(() => {
    const full = COUNTRIES.filter((c) => c.coverage === 'full')
    const partial = COUNTRIES.filter((c) => c.coverage === 'partial')
    const experimental = COUNTRIES.filter((c) => c.coverage === 'experimental')
    return { full, partial, experimental }
  }, [])

  /* --- find impact for expanded country --- */
  const expandedEntry = useMemo(() => {
    if (!expandedCountry) return null
    const top = findCountryImpact(ranking.top5, expandedCountry)
    if (top) return top
    return findCountryImpact(ranking.bot5, expandedCountry) ?? null
  }, [expandedCountry, ranking])

  const ceilingPct = expandedEntry ? expandedEntry.p : 0
  const realizedPct = expandedEntry
    ? +(ceilingPct * (passThrough / 100) * (0.55 + Math.random() * 0.2)).toFixed(1)
    : 0
  const modelGap = expandedEntry ? +(ceilingPct - realizedPct).toFixed(1) : 0

  return (
    <div className="container-page py-8">
      {/* Page header */}
      <div className="mb-6">
        <p className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-1">
          Interactive Tool
        </p>
        <h1 className="text-[clamp(1.6rem,3vw,2.2rem)] font-normal tracking-tight text-ink font-serif">
          War Impact Simulator
        </h1>
        <p className="font-sans text-[0.85rem] text-ink-soft mt-1 max-w-[600px] leading-relaxed">
          Choose a conflict, category, and country to see how macro shocks could affect consumer prices.
        </p>
      </div>

      {/* 2-col layout */}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 items-start">
        {/* ====== LEFT PANEL ====== */}
        <aside className="bg-bg-card border border-border rounded-[10px] p-5 shadow-card md:sticky md:top-[72px] order-1">
          <h2 className="font-sans text-[0.82rem] font-bold text-ink mb-4 tracking-wide">
            Scenario Controls
          </h2>

          {/* War selector */}
          <fieldset className="mb-5">
            <legend className="font-sans text-[0.72rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-2">
              Conflict
            </legend>
            <div className="flex flex-col gap-2">
              {WAR_LIST.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setWarId(w.id)}
                  className={`text-left border rounded-lg p-3 transition-all cursor-pointer ${
                    warId === w.id
                      ? 'border-accent bg-accent-light shadow-sm'
                      : 'border-border bg-bg-card hover:border-accent-warm'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-[0.82rem] font-semibold text-ink">
                      {w.name}
                    </span>
                    {w.live && (
                      <span className="inline-flex items-center gap-1 font-sans text-[0.62rem] font-bold uppercase tracking-[0.06em] bg-accent text-white px-1.5 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        Live
                      </span>
                    )}
                  </div>
                  <div className="font-sans text-[0.7rem] text-ink-muted mt-0.5">
                    {w.dates}
                  </div>
                  {warId === w.id && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {WARS[w.id].shocks.slice(0, 3).map((s) => (
                        <span
                          key={s.factor}
                          className="font-sans text-[0.62rem] bg-bg-alt text-ink-soft px-1.5 py-0.5 rounded"
                        >
                          {s.factor} {s.val}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Category dropdown */}
          <fieldset className="mb-4">
            <legend className="font-sans text-[0.72rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-1.5">
              Category
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
              Country
            </legend>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 font-sans text-[0.82rem] text-ink bg-bg-card focus:outline-none focus:border-accent"
            >
              <option value="">All countries</option>
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
            </select>
          </fieldset>

          {/* Pass-through chips */}
          <fieldset className="mb-4">
            <legend className="font-sans text-[0.72rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-1.5">
              Pass-through
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
              Lag period
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
            Update View
          </button>
        </aside>

        {/* ====== RIGHT PANEL ====== */}
        <section className="order-2 min-w-0">
          {!showResults ? (
            <div className="bg-bg-card border border-border rounded-[10px] p-10 text-center">
              <p className="font-sans text-[0.9rem] text-ink-muted">
                Select a scenario and click <strong>Update View</strong> to see results.
              </p>
            </div>
          ) : (
            <div className="animate-fade-in">
              {/* War overview card */}
              <div className="bg-gradient-to-br from-[#1a1a1a] via-[#2d2420] to-[#3a2216] text-white rounded-[10px] p-5 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-sans text-[1rem] font-bold">{war.name}</h2>
                  {war.live && (
                    <span className="inline-flex items-center gap-1 font-sans text-[0.62rem] font-bold uppercase tracking-[0.06em] bg-accent text-white px-1.5 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
                <p className="font-sans text-[0.75rem] text-white/60 mb-3">
                  {war.dates}
                </p>
                <div className="flex flex-wrap gap-2">
                  {war.shocks.map((s) => (
                    <span
                      key={s.factor}
                      className="font-sans text-[0.7rem] bg-white/10 text-white/80 px-2 py-1 rounded-md"
                    >
                      {s.factor} <strong className="text-accent-warm">{s.val}</strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Assumption strip */}
              <div className="bg-bg-alt border border-border rounded-lg px-4 py-2.5 mb-5 flex flex-wrap gap-x-5 gap-y-1 font-sans text-[0.72rem] text-ink-muted">
                <span>
                  Category: <strong className="text-ink">{categoryLabel}</strong>
                </span>
                <span>
                  Pass-through: <strong className="text-ink">{passThrough}%</strong>
                </span>
                <span>
                  Lag: <strong className="text-ink">{lag}</strong>
                </span>
                <span>
                  Data: <strong className="text-ink">Static model v1</strong>
                </span>
              </div>

              {/* Rankings */}
              <RankingSection
                title="Top 5 Most Impacted"
                entries={ranking.top5}
                startRank={1}
                reasons={countryReason}
                expandedCountry={expandedCountry}
                onRowClick={handleRowClick}
                passThrough={passThrough}
              />

              <RankingSection
                title="Bottom 5 Least Impacted"
                entries={ranking.bot5}
                startRank={6}
                reasons={countryReason}
                expandedCountry={expandedCountry}
                onRowClick={handleRowClick}
                passThrough={passThrough}
              />

              {/* Country detail panel */}
              {expandedCountry && expandedEntry && (
                <div className="bg-bg-card border border-border rounded-[10px] p-5 mt-5 animate-fade-in">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{expandedEntry.f}</span>
                      <div>
                        <h3 className="font-sans text-[0.95rem] font-bold text-ink">
                          {expandedCountry}
                        </h3>
                        <p className="font-sans text-[0.72rem] text-ink-muted">
                          {categoryLabel}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedCountry(null)}
                      className="font-sans text-[0.8rem] text-ink-muted hover:text-accent transition-colors cursor-pointer"
                      aria-label="Close detail"
                    >
                      Close
                    </button>
                  </div>

                  {/* Impact range display */}
                  <div className="mb-6">
                    <ImpactDisplay
                      ceiling={ceilingPct}
                      passthrough={passThrough}
                    />
                  </div>

                  {/* 4 big-number cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <StatCard
                      label="Impact Ceiling"
                      value={`+${ceilingPct}%`}
                      accent
                    />
                    <StatCard
                      label="Realized Est."
                      value={`+${realizedPct}%`}
                    />
                    <StatCard
                      label="Model Gap"
                      value={`${modelGap}pp`}
                    />
                    <StatCard
                      label="Implied Pass-Through"
                      value={`${passThrough}%`}
                    />
                  </div>

                  {/* Waterfall breakdown */}
                  <div className="mb-6">
                    <h4 className="font-sans text-[0.78rem] font-bold text-ink mb-3 tracking-wide">
                      Factor Breakdown (Model Weights)
                    </h4>
                    <div className="space-y-2">
                      {WATERFALL_FACTORS.map((f) => (
                        <div key={f.label} className="flex items-center gap-3">
                          <span className="font-sans text-[0.72rem] text-ink-muted w-20 shrink-0">
                            {f.label}
                          </span>
                          <div className="flex-1 h-5 bg-bg-alt rounded-sm overflow-hidden">
                            <div
                              className={`h-full ${f.color} rounded-sm transition-all`}
                              style={{ width: `${f.pct}%` }}
                            />
                          </div>
                          <span className="font-sans text-[0.72rem] font-semibold text-ink w-10 text-right">
                            {f.pct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Purchasing power erosion */}
                  {currencyData && (
                    <div className="bg-bg-alt border border-border rounded-lg p-4">
                      <h4 className="font-sans text-[0.78rem] font-bold text-ink mb-3 tracking-wide">
                        Purchasing Power Erosion
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
                          ? `The ${currencyData.name} depreciated ${Math.abs(currencyData.depPct)}% against USD during ${currencyData.window}, making imports more expensive and amplifying upstream commodity price shocks.`
                          : currencyData.depPct > 0
                            ? `The ${currencyData.name} appreciated ${currencyData.depPct}% against USD during ${currencyData.window}, partially offsetting upstream commodity price shocks.`
                            : `The ${currencyData.name} remained stable against USD during ${currencyData.window}.`}
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
}: {
  title: string
  entries: RankingEntry[]
  startRank: number
  reasons: Record<string, string> | null
  expandedCountry: string | null
  onRowClick: (c: string) => void
  passThrough: number
}) {
  return (
    <div className="mb-5">
      <h3 className="font-sans text-[0.78rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-2">
        {title}
      </h3>
      <div className="space-y-1.5">
        {entries.map((entry, i) => {
          const rank = startRank + i
          const isExpanded = expandedCountry === entry.c
          const adjustedPct = +(entry.p * (passThrough / 100)).toFixed(1)
          const maxPct = 55 // scale bar to ~55% max
          const barWidth = Math.min((adjustedPct / maxPct) * 100, 100)

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
                {/* Name + reason */}
                <div className="flex-1 min-w-0">
                  <div className="font-sans text-[0.82rem] font-semibold text-ink">
                    {entry.c}
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
                    ceiling={entry.p}
                    passthrough={passThrough}
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
