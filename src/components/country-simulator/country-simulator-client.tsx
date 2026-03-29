'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { WARS, WAR_LIST } from '@/data/wars'
import { CATEGORIES, CATEGORY_MAP } from '@/data/categories'
import { COUNTRIES, COUNTRY_MAP } from '@/data/countries'
import { CURRENCIES } from '@/data/currencies'
import {
  computeBasket,
  computeScenario,
  getProvenance,
  isStructuralMiss,
  validateScenarioState,
} from '@/lib/calculations'
import { usePricesFreshness } from '@/lib/use-prices-freshness'
import { ShareToolbar } from '@/components/simulator/share-toolbar'
import { ImpactDisplay } from '@/components/simulator/impact-display'
import { StatCard } from '@/components/simulator/stat-card'
import { FactorBreakdown } from '@/components/simulator/factor-breakdown'
import { PurchasingPower } from '@/components/simulator/purchasing-power'
import { useT } from '@/lib/use-t'
import type { WarId, CategoryId } from '@/types'
import type { LagPeriod } from '@/types/scenario'
import { LAG_MULTIPLIERS, LAG_LABELS } from '@/types/scenario'

/* ---------- constants ---------- */
const PASS_OPTIONS = [100, 75, 50, 25] as const
const LAG_OPTIONS: { label: string; value: LagPeriod }[] = [
  { label: 'Immediate', value: 'immediate' },
  { label: '3m', value: '3m' },
  { label: '6m', value: '6m' },
  { label: '12m', value: '12m' },
]

function parseLag(raw: string | null): LagPeriod {
  if (raw && raw in LAG_MULTIPLIERS) return raw as LagPeriod
  return '6m'
}

/* ---------- component ---------- */
export function CountrySimulatorClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const t = useT()

  /* --- interactive state (initialized from URL) --- */
  const [warId, setWarId] = useState<WarId>(
    (searchParams.get('war') as WarId) || 'iran-israel-us',
  )
  const [country, setCountry] = useState(
    searchParams.get('country') || 'Philippines',
  )
  const [categoryId, setCategoryId] = useState<CategoryId>(
    (searchParams.get('category') as CategoryId) || 'bread',
  )
  const [passthrough, setPassthrough] = useState(
    Number(searchParams.get('pt')) || 100,
  )
  const [lag, setLag] = useState<LagPeriod>(
    parseLag(searchParams.get('lag')),
  )

  /* --- URL sync --- */
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams()
    params.set('war', warId)
    params.set('country', country)
    params.set('category', categoryId)
    params.set('pt', String(passthrough))
    params.set('lag', lag)
    router.replace(`/country-simulator?${params.toString()}`, { scroll: false })
  }, [warId, country, categoryId, passthrough, lag, router])

  useEffect(() => {
    updateUrl()
  }, [updateUrl])

  /* --- enabled categories toggle state --- */
  const [enabledSet, setEnabledSet] = useState<Set<CategoryId>>(
    new Set<CategoryId>([
      'bread', 'oil', 'fuel', 'dairy', 'rice', 'vegetables',
    ]),
  )

  const toggleItem = (catId: CategoryId) => {
    setEnabledSet((prev) => {
      const next = new Set(prev)
      if (next.has(catId)) {
        next.delete(catId)
      } else {
        next.add(catId)
      }
      return next
    })
  }

  /* --- live data freshness from SerpAPI --- */
  const freshness = usePricesFreshness()
  const provenance = useMemo(() => getProvenance(freshness.fetchedAt), [freshness.fetchedAt])

  /* --- compute basket from centralized engine --- */
  const basketResult = useMemo(() => {
    return computeBasket(
      { war: warId, country, passthrough, lag, provenance },
      enabledSet,
    )
  }, [warId, country, passthrough, lag, enabledSet, provenance])

  /* --- compute single-category scenario for detail panel --- */
  const scenarioResult = useMemo(() => {
    if (!country) return null
    const errors = validateScenarioState({
      war: warId, category: categoryId, country, passthrough, lag, provenance,
    })
    if (errors.length > 0) return null
    return computeScenario(
      { war: warId, category: categoryId, country, passthrough, lag, provenance },
      'display',
    )
  }, [warId, categoryId, country, passthrough, lag, provenance])

  /* --- currency data for purchasing power --- */
  const currencyData = useMemo(() => {
    const warCurrencies = CURRENCIES[warId]
    if (!warCurrencies || !country) return null
    return warCurrencies[country] ?? null
  }, [warId, country])

  /* --- UI data --- */
  const war = WARS[warId]
  const items = basketResult?.items ?? []
  const maxImpact = Math.max(...items.map((i) => i.lagAdjustedImpact), 1)
  const categoryLabel = CATEGORY_MAP[categoryId]?.label ?? categoryId
  const lagMultiplier = LAG_MULTIPLIERS[lag]

  /* --- grouped countries for dropdown --- */
  const groupedCountries = useMemo(() => {
    const full = COUNTRIES.filter((c) => c.coverage === 'full')
    const partial = COUNTRIES.filter((c) => c.coverage === 'partial')
    const experimental = COUNTRIES.filter((c) => c.coverage === 'experimental')
    return { full, partial, experimental }
  }, [])

  return (
    <div className="container-page py-12">
      {/* Page header */}
      <div className="mb-8">
        <p className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-1">
          {t('countrySimulator.eyebrow')}
        </p>
        <h1 className="text-[clamp(1.6rem,3vw,2.2rem)] font-normal tracking-tight text-ink font-serif">
          {t('countrySimulator.title')}
        </h1>
        <p className="font-sans text-[0.85rem] text-ink-soft mt-1 max-w-[600px] leading-relaxed">
          {t('countrySimulator.subtitle')}
        </p>
      </div>

      {/* Controls bar */}
      <div className="bg-bg-card border border-border rounded-[10px] p-4 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* War selector */}
        <fieldset>
          <legend className="font-sans text-[0.72rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-1.5">
            {t('basket.selectWar')}
          </legend>
          <select
            value={warId}
            onChange={(e) => setWarId(e.target.value as WarId)}
            className="w-full border border-border rounded-lg px-3 py-2 font-sans text-[0.82rem] text-ink bg-bg-card focus:outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
          >
            {WAR_LIST.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </fieldset>

        {/* Country selector */}
        <fieldset>
          <legend className="font-sans text-[0.72rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-1.5">
            {t('basket.selectCountry')}
          </legend>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2 font-sans text-[0.82rem] text-ink bg-bg-card focus:outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
          >
            <optgroup label={t('simulator.fullCoverage')}>
              {groupedCountries.full.map((c) => (
                <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
              ))}
            </optgroup>
            <optgroup label={t('simulator.partialCoverage')}>
              {groupedCountries.partial.map((c) => (
                <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
              ))}
            </optgroup>
            <optgroup label={t('simulator.experimental')}>
              {groupedCountries.experimental.map((c) => (
                <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
              ))}
            </optgroup>
          </select>
        </fieldset>

        {/* Category selector */}
        <fieldset>
          <legend className="font-sans text-[0.72rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-1.5">
            {t('countrySimulator.selectCategory')}
          </legend>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value as CategoryId)}
            className="w-full border border-border rounded-lg px-3 py-2 font-sans text-[0.82rem] text-ink bg-bg-card focus:outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
            ))}
          </select>
        </fieldset>

        {/* Pass-through chips */}
        <fieldset>
          <legend className="font-sans text-[0.72rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-1.5">
            {t('simulator.passthrough')}
          </legend>
          <div className="flex gap-1.5">
            {PASS_OPTIONS.map((val) => (
              <button
                key={val}
                onClick={() => setPassthrough(val)}
                className={`flex-1 font-sans text-[0.75rem] font-semibold rounded-md py-1.5 transition-colors cursor-pointer ${
                  passthrough === val
                    ? 'bg-accent text-white'
                    : 'bg-bg-alt text-ink-muted hover:text-ink'
                }`}
              >
                {val}%
              </button>
            ))}
          </div>
        </fieldset>

        {/* Lag chips */}
        <fieldset>
          <legend className="font-sans text-[0.72rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-1.5">
            {t('simulator.lagPeriod')}
          </legend>
          <div className="flex gap-1.5">
            {LAG_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLag(opt.value)}
                className={`flex-1 font-sans text-[0.75rem] font-semibold rounded-md py-1.5 transition-colors cursor-pointer ${
                  lag === opt.value
                    ? 'bg-accent text-white'
                    : 'bg-bg-alt text-ink-muted hover:text-ink'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {/* 2-col layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-8 items-start">
        {/* ====== LEFT: Item List ====== */}
        <div className="space-y-2 order-2 md:order-1">
          {items.map((item) => (
            <div
              key={item.categoryId}
              className={`border rounded-[10px] px-4 py-3.5 transition-all ${
                item.enabled
                  ? 'border-border bg-bg-card shadow-card'
                  : 'border-border/50 bg-bg-alt opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleItem(item.categoryId)}
                  className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer shrink-0 ${
                    item.enabled ? 'bg-accent' : 'bg-border'
                  }`}
                  aria-label={`Toggle ${item.label}`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      item.enabled ? 'left-[18px]' : 'left-0.5'
                    }`}
                  />
                </button>
                <span className="text-xl shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-sans text-[0.85rem] font-semibold text-ink">
                    {item.label}
                  </div>
                  <div className="font-sans text-[0.68rem] text-ink-muted">
                    {t('basket.cpiWeight', { pct: String(item.cpiWeight) })}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-sans text-[1.05rem] font-bold text-accent">
                    +{item.lagAdjustedImpact}%
                  </div>
                  {item.ceiling !== item.lagAdjustedImpact && (
                    <div className="font-sans text-[0.62rem] text-ink-muted">
                      {t('basket.ceilingLabel', { pct: String(item.ceiling) })}
                    </div>
                  )}
                </div>
              </div>
              {item.enabled && (
                <div className="mt-2.5 ml-12">
                  <div className="h-2 bg-bg-alt rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm bg-gradient-to-r from-accent-warm to-accent transition-all"
                      style={{ width: `${(item.lagAdjustedImpact / maxImpact) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ====== RIGHT: Detail + Basket Summary ====== */}
        <aside className="bg-bg-card border border-border rounded-[10px] p-5 shadow-card md:sticky md:top-[72px] order-1 md:order-2 space-y-5">
          {/* --- Category detail panel --- */}
          {scenarioResult && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{COUNTRY_MAP[country]?.flag ?? ''}</span>
                <div>
                  <h3 className="font-sans text-[0.88rem] font-bold text-ink">{country}</h3>
                  <p className="font-sans text-[0.68rem] text-ink-muted">{categoryLabel}</p>
                </div>
              </div>

              {/* Structural miss warning */}
              {isStructuralMiss(country) && (
                <div className="bg-amber-light border border-[#e8c97a] rounded-lg px-3 py-2 mb-4">
                  <p className="font-sans text-[0.68rem] text-[#7a4f10] leading-relaxed">
                    <strong className="text-[#5a3408]">{t('simulator.validationNote')}</strong>{' '}
                    {t('simulator.validationWarning', { country })}
                  </p>
                </div>
              )}

              <ImpactDisplay
                lagAdjustedCeiling={scenarioResult.lagAdjustedCeiling}
                rangeLow={scenarioResult.rangeLow}
                rangeHigh={scenarioResult.rangeHigh}
                lag={lag}
                lagMultiplier={scenarioResult.lagMultiplier}
              />

              <div className="grid grid-cols-2 gap-2 my-4">
                <StatCard label={t('simulator.impactCeiling')} value={`+${scenarioResult.lagAdjustedCeiling}%`} accent />
                <StatCard label={t('simulator.realizedEst')} value={`+${scenarioResult.realized}%`} />
                <StatCard label={t('simulator.modelGap')} value={`${scenarioResult.modelGap}pp`} />
                <StatCard label={t('simulator.lagMultiplier')} value={`${lagMultiplier}x`} />
              </div>

              <FactorBreakdown
                factors={scenarioResult.factors}
                lagAdjustedCeiling={scenarioResult.lagAdjustedCeiling}
              />

              {currencyData && <PurchasingPower currencyData={currencyData} />}

              <div className="border-t border-border my-5" />
            </div>
          )}

          {/* --- Basket summary --- */}
          <h2 className="font-sans text-[0.82rem] font-bold text-ink tracking-wide">
            {t('countrySimulator.basketOverview')}
          </h2>

          <div className="text-center mb-3">
            <div className="text-[2.4rem] font-light text-accent tracking-tight">
              +{basketResult?.weightedAverage ?? 0}%
            </div>
            <div className="font-sans text-[0.72rem] text-ink-muted">
              {t('basket.weightedAvg')}
            </div>
          </div>

          <div className="text-center mb-5 bg-bg-alt rounded-lg px-3 py-2">
            <div className="text-[1.4rem] font-light text-ink tracking-tight">
              +{basketResult?.cpiContribution ?? 0}pp
            </div>
            <div className="font-sans text-[0.68rem] text-ink-muted">
              {t('basket.cpiContribution')}
            </div>
          </div>

          {/* Mini bar chart */}
          <div className="space-y-2 mb-5">
            {items.filter((i) => i.enabled).map((item) => (
              <div key={item.categoryId} className="flex items-center gap-2">
                <span className="font-sans text-[0.68rem] text-ink-muted w-20 truncate shrink-0">
                  {item.icon} {item.label.split(' ')[0]}
                </span>
                <div className="flex-1 h-4 bg-bg-alt rounded-sm overflow-hidden">
                  <div
                    className="h-full rounded-sm bg-gradient-to-r from-accent-warm to-accent transition-all"
                    style={{ width: `${(item.lagAdjustedImpact / maxImpact) * 100}%` }}
                  />
                </div>
                <span className="font-sans text-[0.68rem] font-semibold text-ink w-10 text-right shrink-0">
                  +{item.lagAdjustedImpact}%
                </span>
              </div>
            ))}
          </div>

          <ShareToolbar modelVersion={provenance.modelVersion} snapshotDate={provenance.snapshotDate} />

          {/* Disclaimer */}
          <div className="bg-amber-light border border-[#e8c97a] rounded-lg px-3 py-2.5 mt-4">
            <p className="font-sans text-[0.68rem] text-[#7a4f10] leading-relaxed">
              <strong className="text-[#5a3408]">{t('basket.disclaimerNote')}</strong>{' '}
              {t('basket.disclaimerText', {
                country,
                pt: String(passthrough),
                war: war?.name ?? warId,
                lag: LAG_LABELS[lag],
                mult: String(LAG_MULTIPLIERS[lag]),
              })}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
