'use client'

import { useState, useMemo } from 'react'
import { useT } from '@/lib/use-t'
import { FUEL_SECURITY_PROFILES, FUEL_PROFILE_MAP } from '@/data/fuel-security'
import { FLIGHT_ROUTES } from '@/data/flight-routes'
import { COUNTRY_MAP } from '@/data/countries'
import { computeFuelSecurity, computeRouteRisk } from '@/lib/fuel-calculations'
import type { WarId } from '@/types'
import type { FuelSecurityResult, FlightRoute, RouteRiskResult, CountryFuelProfile } from '@/types/fuel-security'
import { AlertBadge } from './alert-badge'

/* ── Named constants ─────────────────────────────────────────── */

/** Days per month for time-horizon projection. */
const DAYS_PER_MONTH = 30

/**
 * Assumed trip duration in days. Return trip calculations add this
 * many days of additional reserve depletion since the traveler is
 * at the destination while reserves continue to be consumed.
 */
const TRIP_DURATION_DAYS = 7

/** Normalcy slider options (percentage of supply chain recovery). */
const NORMALCY_OPTIONS = [0, 25, 50, 75, 100] as const

const STATUS_STYLES: Record<string, { bg: string; text: string; key: string }> = {
  operating: { bg: 'bg-[#d5f5e3]', text: 'text-green', key: 'flightAlerts.statusOperating' },
  suspended: { bg: 'bg-accent-light', text: 'text-accent', key: 'flightAlerts.statusSuspended' },
  rerouted:  { bg: 'bg-[#fef3cd]', text: 'text-amber', key: 'flightAlerts.statusRerouted' },
  reduced:   { bg: 'bg-[#d6eaf8]', text: 'text-blue', key: 'flightAlerts.statusReduced' },
}

const CONFIDENCE_STYLES: Record<string, { bg: string; text: string; key: string; explainerKey: string }> = {
  verified:   { bg: 'bg-[#d5f5e3]', text: 'text-green', key: 'flightAlerts.verifiedRoute', explainerKey: 'flightAlerts.verifiedExplainer' },
  indicative: { bg: 'bg-[#fef3cd]', text: 'text-amber', key: 'flightAlerts.indicativeEstimate', explainerKey: 'flightAlerts.indicativeExplainer' },
  limited:    { bg: 'bg-[#d6eaf8]', text: 'text-blue', key: 'flightAlerts.limitedData', explainerKey: 'flightAlerts.limitedExplainer' },
}

const STRANDING_HIGH_DAYS = 45
const STRANDING_MODERATE_DAYS = 90
const TIME_OPTIONS = [0, 1, 2, 3, 4, 5, 6] as const

interface RouteCheckerProps {
  allResults: FuelSecurityResult[]
  warId: WarId
}

export function RouteChecker({ allResults, warId }: RouteCheckerProps) {
  const t = useT()
  const [originId, setOriginId] = useState<string>('')
  const [destId, setDestId] = useState<string>('')
  const [layoverId, setLayoverId] = useState<string>('')
  const [monthsAhead, setMonthsAhead] = useState<number>(0)
  const [scenario, setScenario] = useState<'war' | 'ceasefire'>('war')
  const [normalcyPct, setNormalcyPct] = useState<number>(50)

  const resultsMap = useMemo(() => {
    const map: Record<string, FuelSecurityResult> = {}
    for (const r of allResults) { map[r.countryId] = r }
    return map
  }, [allResults])

  const countryOptions = useMemo(() =>
    FUEL_SECURITY_PROFILES.map((p) => p.countryId).sort((a, b) => a.localeCompare(b))
  , [])

  const routes: FlightRoute[] = FLIGHT_ROUTES[warId] ?? []
  const matchedRoute = useMemo(() => {
    if (!originId || !destId) return null
    return routes.find((r) => r.originCountryId === originId && r.destinationCountryId === destId) ?? null
  }, [originId, destId, routes])

  /** Get country name for display */
  function countryName(id: string): string {
    return COUNTRY_MAP[id]?.name ?? id
  }

  /**
   * Compute FuelSecurityResult for a country adjusted for time + scenario.
   * @param extraDays - additional days of depletion beyond monthsAhead (e.g. trip duration)
   */
  function getResultForCountry(countryId: string, extraDays: number = 0): FuelSecurityResult | null {
    if (!countryId) return null
    const profile = FUEL_PROFILE_MAP[countryId]
    if (!profile) return null

    let adj: CountryFuelProfile = profile
    const totalDaysForward = monthsAhead * DAYS_PER_MONTH + extraDays

    if (totalDaysForward > 0) {
      const disruption = (profile.hormuzExposurePct / 100) * (profile.importDependencyPct / 100)
      const consumed = disruption * totalDaysForward
      adj = { ...adj, strategicReserveDays: Math.max(0, Math.round(profile.strategicReserveDays - consumed)) }
    }

    if (scenario === 'ceasefire') {
      const recoveryFactor = 1 - (normalcyPct / 100)
      adj = { ...adj, hormuzExposurePct: Math.round(adj.hormuzExposurePct * recoveryFactor) }
    }

    if (adj !== profile) return computeFuelSecurity(adj)
    return resultsMap[countryId] ?? computeFuelSecurity(profile)
  }

  /* ── Outbound risk ─────────────────────────────────────────── */
  const outboundRisk: RouteRiskResult | null = useMemo(() => {
    if (!originId && !destId) return null
    const risk = computeRouteRisk(getResultForCountry(originId), getResultForCountry(destId))
    if (matchedRoute && monthsAhead === 0 && scenario === 'war') {
      return { ...risk, confidence: 'verified' as const, matchedRoute }
    }
    return risk
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originId, destId, resultsMap, matchedRoute, monthsAhead, scenario, normalcyPct])

  const layoverResult: FuelSecurityResult | null = useMemo(() => {
    if (!layoverId) return null
    return getResultForCountry(layoverId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoverId, monthsAhead, scenario, normalcyPct, resultsMap])

  /* ── Return risk (dest→origin, +7 days depletion for trip stay) ── */
  const returnRisk: RouteRiskResult | null = useMemo(() => {
    if (!originId || !destId) return null
    return computeRouteRisk(
      getResultForCountry(destId, TRIP_DURATION_DAYS),
      getResultForCountry(originId, TRIP_DURATION_DAYS)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originId, destId, resultsMap, monthsAhead, scenario, normalcyPct])

  const returnLayoverResult: FuelSecurityResult | null = useMemo(() => {
    if (!layoverId) return null
    return getResultForCountry(layoverId, TRIP_DURATION_DAYS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoverId, monthsAhead, scenario, normalcyPct, resultsMap])

  /* ── Stranding risk ────────────────────────────────────────── */
  const strandingRisk = useMemo(() => {
    if (!destId) return null
    const destResult = getResultForCountry(destId, TRIP_DURATION_DAYS)
    if (!destResult) return null
    const d = destResult.estimatedDepletionDays
    if (!isFinite(d)) return 'low' as const
    if (d <= STRANDING_HIGH_DAYS) return 'high' as const
    if (d <= STRANDING_MODERATE_DAYS) return 'moderate' as const
    return 'low' as const
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destId, monthsAhead, scenario, normalcyPct, resultsMap])

  const hasSelection = originId || destId
  const destName = destId ? countryName(destId) : ''

  return (
    <section id="route-checker" className="scroll-mt-20">
      <h2 className="font-serif text-[1.2rem] font-bold text-ink mb-1">
        {t('flightAlerts.routeCheckerTitle')}
      </h2>
      <p className="text-[0.78rem] text-ink-muted font-sans mb-4">
        {t('flightAlerts.routeCheckerSubtitle')}
      </p>

      {/* ── Origin / Destination ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <CountrySelect id="route-origin" label={t('flightAlerts.selectOrigin')} value={originId} onChange={setOriginId} options={countryOptions} placeholder={t('flightAlerts.selectACountry')} />
        <div className="flex items-end pb-2.5 text-ink-muted text-[1rem] font-sans font-bold hidden sm:flex">&rarr;</div>
        <CountrySelect id="route-dest" label={t('flightAlerts.selectDestination')} value={destId} onChange={setDestId} options={countryOptions} placeholder={t('flightAlerts.selectACountry')} />
      </div>

      {/* ── Layover ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <CountrySelect id="route-layover" label={t('flightAlerts.layoverLabel')} value={layoverId} onChange={setLayoverId} options={countryOptions} placeholder={t('flightAlerts.selectACountry')} />
        <div className="flex-1" />
      </div>

      {/* ── Time horizon ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <div className="flex-1">
          <label className="block text-[0.72rem] font-sans font-semibold text-ink-soft mb-1 uppercase tracking-wider">{t('flightAlerts.timeHorizon')}</label>
          <div className="flex flex-wrap gap-1.5">
            {TIME_OPTIONS.map((m) => (
              <button key={m} onClick={() => setMonthsAhead(m)} className={`px-3 py-2 rounded-[10px] text-[0.8rem] font-sans font-semibold border transition-colors cursor-pointer ${monthsAhead === m ? 'bg-accent text-white border-accent' : 'bg-bg-card text-ink border-border hover:border-accent/40'}`}>
                {m === 0 ? t('flightAlerts.timeNow') : t('flightAlerts.timeMonths', { months: String(m) })}
              </button>
            ))}
          </div>
        </div>

        {/* Scenario */}
        <div className="sm:w-[200px]">
          <label className="block text-[0.72rem] font-sans font-semibold text-ink-soft mb-1 uppercase tracking-wider">{t('flightAlerts.scenarioLabel')}</label>
          <div className="flex gap-1.5">
            <button onClick={() => setScenario('war')} className={`flex-1 px-3 py-2 rounded-[10px] text-[0.8rem] font-sans font-semibold border transition-colors cursor-pointer ${scenario === 'war' ? 'bg-accent text-white border-accent' : 'bg-bg-card text-ink border-border hover:border-accent/40'}`}>{t('flightAlerts.scenarioWar')}</button>
            <button onClick={() => setScenario('ceasefire')} className={`flex-1 px-3 py-2 rounded-[10px] text-[0.8rem] font-sans font-semibold border transition-colors cursor-pointer ${scenario === 'ceasefire' ? 'bg-[#d5f5e3] text-green border-green/30' : 'bg-bg-card text-ink border-border hover:border-green/40'}`}>{t('flightAlerts.scenarioCeasefire')}</button>
          </div>
        </div>
      </div>

      {/* ── Normalcy slider (ceasefire only) ───────────────────── */}
      {scenario === 'ceasefire' && (
        <div className="mb-3">
          <label className="block text-[0.72rem] font-sans font-semibold text-ink-soft mb-1 uppercase tracking-wider">{t('flightAlerts.normalcyLabel')}</label>
          <div className="flex flex-wrap gap-1.5">
            {NORMALCY_OPTIONS.map((pct) => (
              <button key={pct} onClick={() => setNormalcyPct(pct)} className={`px-3 py-2 rounded-[10px] text-[0.8rem] font-sans font-semibold border transition-colors cursor-pointer ${normalcyPct === pct ? 'bg-[#d5f5e3] text-green border-green/30' : 'bg-bg-card text-ink border-border hover:border-green/40'}`}>
                {t('flightAlerts.normalcyPct', { pct: String(pct) })}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Notes ──────────────────────────────────────────────── */}
      {monthsAhead > 0 && hasSelection && (
        <p className="text-[0.72rem] text-amber font-sans mb-3 bg-[#fef3cd] rounded-md px-3 py-2">
          {t('flightAlerts.timeFutureNote', { days: String(monthsAhead * DAYS_PER_MONTH) })}
        </p>
      )}
      {scenario === 'ceasefire' && hasSelection && (
        <p className="text-[0.72rem] text-green font-sans mb-3 bg-[#d5f5e3] rounded-md px-3 py-2">
          {t('flightAlerts.ceasefireNote', { pct: String(normalcyPct) })}
        </p>
      )}

      {/* ── Outbound Result ────────────────────────────────────── */}
      {outboundRisk && hasSelection && (
        <div className="bg-bg-card border border-border rounded-[var(--radius-card)] p-5 animate-fade-in mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-sans text-[0.9rem] font-bold text-ink">{t('flightAlerts.outboundTrip')}</h3>
              {(() => {
                const conf = CONFIDENCE_STYLES[outboundRisk.confidence]
                return <span className={`inline-flex px-2 py-0.5 rounded-md text-[0.65rem] font-bold ${conf.bg} ${conf.text}`}>{t(conf.key)}</span>
              })()}
            </div>
            <AlertBadge level={outboundRisk.alertLevel} />
          </div>

          {outboundRisk.matchedRoute && <VerifiedRouteDetail route={outboundRisk.matchedRoute} />}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {outboundRisk.originScore !== undefined && <ScorePill label={t('flightAlerts.originRisk')} score={outboundRisk.originScore} country={originId} />}
            {outboundRisk.destinationScore !== undefined && <ScorePill label={t('flightAlerts.destinationRisk')} score={outboundRisk.destinationScore} country={destId} />}
            <ScorePill label={t('flightAlerts.combinedRiskScore')} score={outboundRisk.score} highlight />
          </div>
          {layoverResult && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <ScorePill label={t('flightAlerts.layoverRisk')} score={layoverResult.vulnerabilityScore} country={layoverId} />
            </div>
          )}
          <p className="text-[0.72rem] text-ink-muted font-sans">{t(CONFIDENCE_STYLES[outboundRisk.confidence].explainerKey)}</p>
        </div>
      )}

      {/* ── Return Trip ────────────────────────────────────────── */}
      {returnRisk && originId && destId && (
        <div className="bg-bg-card border border-border rounded-[var(--radius-card)] p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-sans text-[0.9rem] font-bold text-ink">{t('flightAlerts.returnTrip')}</h3>
            <AlertBadge level={returnRisk.alertLevel} />
          </div>

          <p className="text-[0.72rem] text-ink-muted font-sans mb-3">
            {t('flightAlerts.returnTripNote', { country: destName })}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {returnRisk.originScore !== undefined && <ScorePill label={t('flightAlerts.originRisk')} score={returnRisk.originScore} country={destId} />}
            {returnRisk.destinationScore !== undefined && <ScorePill label={t('flightAlerts.destinationRisk')} score={returnRisk.destinationScore} country={originId} />}
            <ScorePill label={t('flightAlerts.combinedRiskScore')} score={returnRisk.score} highlight />
          </div>

          {/* Layover on return */}
          {returnLayoverResult && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <ScorePill label={t('flightAlerts.layoverRisk')} score={returnLayoverResult.vulnerabilityScore} country={layoverId} />
            </div>
          )}

          {/* Stranding risk with country name */}
          {strandingRisk && (
            <div className={`rounded-lg px-4 py-3 ${strandingRisk === 'high' ? 'bg-accent-light' : strandingRisk === 'moderate' ? 'bg-[#fef3cd]' : 'bg-[#d5f5e3]'}`}>
              <div className="text-[0.72rem] font-sans font-semibold text-ink-soft uppercase tracking-wider mb-1">
                {t('flightAlerts.strandingRisk', { country: destName })}
              </div>
              <div className={`text-[0.82rem] font-semibold font-sans ${strandingRisk === 'high' ? 'text-accent' : strandingRisk === 'moderate' ? 'text-amber' : 'text-green'}`}>
                {t(`flightAlerts.stranding${strandingRisk.charAt(0).toUpperCase() + strandingRisk.slice(1)}` as 'flightAlerts.strandingHigh', { country: destName })}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

/* ── Sub-components ──────────────────────────────────────────── */

function CountrySelect({ id, label, value, onChange, options, placeholder }: {
  id: string; label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder: string
}) {
  return (
    <div className="flex-1">
      <label htmlFor={id} className="block text-[0.72rem] font-sans font-semibold text-ink-soft mb-1 uppercase tracking-wider">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-bg-card border border-border rounded-[10px] px-3 py-2.5 text-[0.85rem] font-sans text-ink focus:outline-2 focus:outline-accent">
        <option value="">{placeholder}</option>
        {options.map((cid) => {
          const c = COUNTRY_MAP[cid]
          return <option key={cid} value={cid}>{c?.flag ?? ''} {c?.name ?? cid}</option>
        })}
      </select>
    </div>
  )
}

function ScorePill({ label, score, country, highlight }: { label: string; score: number; country?: string; highlight?: boolean }) {
  const c = country ? COUNTRY_MAP[country] : null
  return (
    <div className={`rounded-lg px-4 py-3 ${highlight ? 'bg-bg-alt border border-border' : 'bg-bg-alt'}`}>
      <div className="text-[0.68rem] font-sans text-ink-muted uppercase tracking-wider mb-0.5">{label}</div>
      <div className="flex items-baseline gap-1.5">
        {c && <span className="text-[0.85rem]" aria-hidden="true">{c.flag}</span>}
        <span className={`text-[1.2rem] font-bold font-sans ${highlight ? 'text-accent' : 'text-ink'}`}>{score}</span>
        <span className="text-[0.72rem] text-ink-muted font-sans">/ 100</span>
      </div>
    </div>
  )
}

function VerifiedRouteDetail({ route }: { route: FlightRoute }) {
  const t = useT()
  const style = STATUS_STYLES[route.status] ?? STATUS_STYLES.operating
  return (
    <div className="border border-border rounded-lg p-4 mb-4 bg-bg-alt">
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-[0.9rem] font-bold text-ink tracking-wide">{route.routeCode}</span>
        <span className={`inline-flex px-2 py-0.5 rounded-md text-[0.65rem] font-bold ${style.bg} ${style.text}`}>{t(style.key)}</span>
      </div>
      <p className="text-[0.78rem] text-ink-soft font-sans mb-1">{route.label} ({route.airline})</p>
      {route.status !== 'suspended' && route.prePrice > 0 && (
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[0.75rem] text-ink-muted font-sans line-through">{route.currency} {route.prePrice.toLocaleString()}</span>
          <span className="text-[0.85rem] font-bold text-ink font-sans">{route.currency} {route.postPrice.toLocaleString()}</span>
          <span className="text-[0.72rem] font-bold text-accent font-sans">+{route.changePct}%</span>
        </div>
      )}
      <p className="text-[0.72rem] text-ink-muted font-sans">{route.note}</p>
      <div className="flex items-center justify-between mt-2">
        {route.passesHighRiskZone && (
          <span className="inline-flex items-center gap-1 text-[0.65rem] text-accent font-sans font-semibold">
            <span aria-hidden="true">&#9888;</span> {t('flightAlerts.highRiskZone')}
          </span>
        )}
        <a href={route.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[0.65rem] text-blue font-sans hover:underline ml-auto">
          {t('flightAlerts.source')}: {new URL(route.sourceUrl).hostname}
        </a>
      </div>
    </div>
  )
}
