'use client'

import { useState, useMemo } from 'react'
import { useT } from '@/lib/use-t'
import { FUEL_SECURITY_PROFILES, FUEL_PROFILE_MAP } from '@/data/fuel-security'
import { FLIGHT_ROUTES, AIRLINE_IMPACTS } from '@/data/flight-routes'
import { computeFuelSecurity, rankByVulnerability } from '@/lib/fuel-calculations'
import type { WarId } from '@/types'
import type { FuelSecurityResult, FlightRoute, AirlineImpact } from '@/types/fuel-security'
import { FuelAlertHero } from './fuel-alert-hero'
import { CountryFuelCard } from './country-fuel-card'
import { AlertBadge } from './alert-badge'
import { WeeklyFuelDigest } from './weekly-fuel-digest'
import { RouteChecker } from './route-checker'

type SortBy = 'vulnerability' | 'reserves' | 'name'

/* ── Alert level display config ──────────────────────────────── */

const ALERT_LEVEL_STYLES: Record<string, { bg: string; text: string }> = {
  critical: { bg: 'bg-accent-light', text: 'text-accent' },
  high:     { bg: 'bg-[#fef3cd]', text: 'text-amber' },
  moderate: { bg: 'bg-[#d6eaf8]', text: 'text-blue' },
  low:      { bg: 'bg-[#d5f5e3]', text: 'text-green' },
}

const ALERT_LEVELS = ['critical', 'high', 'moderate', 'low'] as const

export function FlightAlertsClient() {
  const t = useT()
  const [sortBy, setSortBy] = useState<SortBy>('vulnerability')

  const warId: WarId = 'hormuz-2026'

  /* ── Compute all fuel security results ────────────────────── */
  const allResults = useMemo(() => {
    return FUEL_SECURITY_PROFILES.map((p) => computeFuelSecurity(p))
  }, [])

  /* ── Sort results ─────────────────────────────────────────── */
  const sortedResults = useMemo(() => {
    if (sortBy === 'vulnerability') return rankByVulnerability(allResults)
    if (sortBy === 'reserves') {
      return [...allResults].sort((a, b) => {
        const pa = FUEL_PROFILE_MAP[a.countryId]
        const pb = FUEL_PROFILE_MAP[b.countryId]
        return (pa?.strategicReserveDays ?? 0) - (pb?.strategicReserveDays ?? 0)
      })
    }
    // name
    return [...allResults].sort((a, b) => a.countryId.localeCompare(b.countryId))
  }, [allResults, sortBy])

  /* ── Split into most / least impacted ───────────────────────── */
  /** Vulnerability score threshold: countries at or below this are "least impacted" */
  const LEAST_IMPACTED_THRESHOLD = 30
  const { mostImpacted, leastImpacted } = useMemo(() => {
    const most: FuelSecurityResult[] = []
    const least: FuelSecurityResult[] = []
    for (const r of sortedResults) {
      if (r.vulnerabilityScore > LEAST_IMPACTED_THRESHOLD) {
        most.push(r)
      } else {
        least.push(r)
      }
    }
    return { mostImpacted: most, leastImpacted: least }
  }, [sortedResults])

  /* ── Summary counts by alert level ────────────────────────── */
  const alertCounts = useMemo(() => {
    const counts: Record<string, number> = { critical: 0, high: 0, moderate: 0, low: 0 }
    for (const r of allResults) {
      counts[r.alertLevel] = (counts[r.alertLevel] ?? 0) + 1
    }
    return counts
  }, [allResults])

  /* ── Flight routes + airlines for this war ────────────────── */
  const routes: FlightRoute[] = FLIGHT_ROUTES[warId] ?? []
  const airlines: AirlineImpact[] = AIRLINE_IMPACTS[warId] ?? []

  return (
    <div className="max-w-[1140px] mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* ── Section 1: Hero ──────────────────────────────────── */}
      <FuelAlertHero results={allResults} routes={routes} />

      {/* ── Section 2: Route Checker ─────────────────────────── */}
      <div className="mt-10 mb-10">
        <RouteChecker allResults={allResults} warId={warId} />
      </div>

      {/* ── Section 4: Country Vulnerability ─────────────────── */}
      <section className="mb-10">
        <h2 className="font-serif text-[1.2rem] font-bold text-ink mb-1">
          {t('flightAlerts.countriesSection')}
        </h2>
        <p className="text-[0.78rem] text-ink-muted font-sans mb-4">
          {t('flightAlerts.countriesSectionSubtitle')}
        </p>

        {/* Summary bar */}
        <div
          className="flex flex-wrap gap-2 mb-4"
          role="status"
          aria-label={t('flightAlerts.summaryBarLabel')}
        >
          {ALERT_LEVELS.map((level) => {
            const count = alertCounts[level] ?? 0
            if (count === 0) return null
            const style = ALERT_LEVEL_STYLES[level]
            const levelKey = `flightAlerts.alert${level.charAt(0).toUpperCase() + level.slice(1)}` as const
            return (
              <span
                key={level}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[0.72rem] font-bold font-sans ${style.bg} ${style.text}`}
              >
                {count} {t(levelKey)}
              </span>
            )
          })}
        </div>

        {/* Sort control */}
        <div className="flex mb-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="bg-bg-card border border-border rounded-md px-3 py-2 text-[0.8rem] font-sans text-ink focus:outline-2 focus:outline-accent"
            aria-label={t('flightAlerts.sortByVulnerability')}
          >
            <option value="vulnerability">{t('flightAlerts.sortByVulnerability')}</option>
            <option value="reserves">{t('flightAlerts.sortByReserves')}</option>
            <option value="name">{t('flightAlerts.sortByName')}</option>
          </select>
        </div>

        {/* Most impacted cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mostImpacted.map((result, i) => {
            const profile = FUEL_PROFILE_MAP[result.countryId]
            if (!profile) return null
            return (
              <div key={result.countryId} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <CountryFuelCard
                  result={result}
                  profile={profile}
                  selected={false}
                  onClick={() => {}}
                />
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Section 4b: Least Impacted ───────────────────────── */}
      {leastImpacted.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-[1.2rem] font-bold text-ink mb-1">
            {t('flightAlerts.leastImpacted')}
          </h2>
          <p className="text-[0.78rem] text-ink-muted font-sans mb-4">
            {t('flightAlerts.leastImpactedSubtitle')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {leastImpacted.map((result, i) => {
              const profile = FUEL_PROFILE_MAP[result.countryId]
              if (!profile) return null
              return (
                <div key={result.countryId} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <CountryFuelCard
                    result={result}
                    profile={profile}
                    selected={false}
                    onClick={() => {}}
                  />
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Section 5: Flight Routes ─────────────────────────── */}
      <section className="mb-10">
        <h2 className="font-serif text-[1.2rem] font-bold text-ink mb-1">
          {t('flightAlerts.flightRoutes')}
        </h2>
        <p className="text-[0.78rem] text-ink-muted font-sans mb-4">
          {t('flightAlerts.flightRoutesSubtitle', { war: 'Hormuz 2026' })}
        </p>

        {routes.length === 0 ? (
          <p className="text-[0.8rem] text-ink-muted font-sans italic">
            {t('flightAlerts.noDataForWar')}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {routes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        )}
      </section>

      {/* ── Section 6: Airline Impacts ───────────────────────── */}
      <section className="mb-10">
        <h2 className="font-serif text-[1.2rem] font-bold text-ink mb-1">
          {t('flightAlerts.airlineImpacts')}
        </h2>
        <p className="text-[0.78rem] text-ink-muted font-sans mb-4">
          {t('flightAlerts.airlineImpactsSubtitle')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {airlines.map((a, i) => (
            <div
              key={i}
              className="bg-bg-card border border-border rounded-[var(--radius-card)] p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg" aria-hidden="true">{a.flag}</span>
                  <span className="font-sans text-[0.85rem] font-semibold text-ink">{a.airline}</span>
                </div>
                <AlertBadge level={a.alertLevel} />
              </div>
              <p className="text-[0.78rem] text-ink-soft font-sans leading-relaxed">{a.impact}</p>
              <a
                href={a.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[0.65rem] text-blue font-sans mt-1.5 hover:underline"
              >
                {t('flightAlerts.source')}: {new URL(a.sourceUrl).hostname}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 7: Weekly Digest ────────────────────────── */}
      <div className="mb-10">
        <WeeklyFuelDigest />
      </div>

      {/* ── Section 8: Attribution ───────────────────────────── */}
      <footer className="pt-4 border-t border-border">
        <p className="text-[0.68rem] text-ink-muted font-sans text-center">
          {t('flightAlerts.dataAttribution')}
        </p>
      </footer>
    </div>
  )
}

/* ── Route Card ────────────────────────────────────────────── */

const STATUS_STYLES: Record<string, { bg: string; text: string; key: string }> = {
  operating: { bg: 'bg-[#d5f5e3]', text: 'text-green', key: 'flightAlerts.statusOperating' },
  suspended: { bg: 'bg-accent-light', text: 'text-accent', key: 'flightAlerts.statusSuspended' },
  rerouted:  { bg: 'bg-[#fef3cd]', text: 'text-amber', key: 'flightAlerts.statusRerouted' },
  reduced:   { bg: 'bg-[#d6eaf8]', text: 'text-blue', key: 'flightAlerts.statusReduced' },
}

function RouteCard({ route }: { route: FlightRoute }) {
  const t = useT()
  const style = STATUS_STYLES[route.status] ?? STATUS_STYLES.operating

  return (
    <div className="bg-bg-card border border-border rounded-[var(--radius-card)] p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-[0.9rem] font-bold text-ink tracking-wide">
          {route.routeCode}
        </span>
        <span className={`inline-flex px-2 py-0.5 rounded-md text-[0.65rem] font-bold ${style.bg} ${style.text}`}>
          {t(style.key)}
        </span>
      </div>
      <p className="text-[0.78rem] text-ink-soft font-sans mb-1">
        {route.label} ({route.airline})
      </p>
      {route.status !== 'suspended' && route.prePrice > 0 && (
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[0.75rem] text-ink-muted font-sans line-through">
            {route.currency} {route.prePrice.toLocaleString()}
          </span>
          <span className="text-[0.85rem] font-bold text-ink font-sans">
            {route.currency} {route.postPrice.toLocaleString()}
          </span>
          <span className="text-[0.72rem] font-bold text-accent font-sans">
            +{route.changePct}%
          </span>
        </div>
      )}
      <p className="text-[0.72rem] text-ink-muted font-sans">{route.note}</p>
      <div className="flex items-center justify-between mt-2">
        {route.passesHighRiskZone && (
          <span className="inline-flex items-center gap-1 text-[0.65rem] text-accent font-sans font-semibold">
            <span aria-hidden="true">&#9888;</span>
            {t('flightAlerts.highRiskZone')}
          </span>
        )}
        <a
          href={route.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.65rem] text-blue font-sans hover:underline ml-auto"
        >
          {t('flightAlerts.source')}: {new URL(route.sourceUrl).hostname}
        </a>
      </div>
    </div>
  )
}
