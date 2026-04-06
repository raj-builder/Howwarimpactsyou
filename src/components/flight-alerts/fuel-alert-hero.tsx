'use client'

import { useT } from '@/lib/use-t'
import type { FuelSecurityResult, FlightRoute } from '@/types/fuel-security'

interface FuelAlertHeroProps {
  results: FuelSecurityResult[]
  routes: FlightRoute[]
}

export function FuelAlertHero({ results, routes }: FuelAlertHeroProps) {
  const t = useT()

  const criticalCount = results.filter((r) => r.alertLevel === 'critical').length
  const disruptedRoutes = routes.filter(
    (r) => r.status === 'suspended' || r.status === 'rerouted' || r.status === 'reduced'
  ).length
  /* Only show avg depletion for critical+high countries (meaningful Hormuz exposure) */
  const atRiskResults = results.filter(
    (r) => (r.alertLevel === 'critical' || r.alertLevel === 'high') && isFinite(r.estimatedDepletionDays)
  )
  const avgReserves =
    atRiskResults.length > 0
      ? Math.round(
          atRiskResults.reduce((sum, r) => sum + r.estimatedDepletionDays, 0) / atRiskResults.length
        )
      : 0

  const handleScrollToChecker = () => {
    const el = document.getElementById('route-checker')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="rounded-[var(--radius-card)] bg-gradient-to-br from-[#1a1a1a] via-[#2d2420] to-[#3a2216] p-6 md:p-8 text-white">
      {/* Eyebrow + LIVE badge */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[0.72rem] font-sans font-semibold tracking-widest text-white/60 uppercase">
          {t('flightAlerts.eyebrow')}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/20 text-[0.68rem] font-bold text-accent-warm tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
          {t('flightAlerts.liveBadge')}
        </span>
      </div>

      {/* Punchy headline */}
      <h1 className="font-serif text-[1.8rem] md:text-[2.4rem] leading-tight font-bold mb-2">
        {t('flightAlerts.heroHeadline')}
      </h1>
      <p className="text-[0.85rem] text-white/70 font-sans mb-6 max-w-2xl">
        {t('flightAlerts.heroSubtitleNew')}
      </p>

      {/* Dominant stat */}
      <div className="mb-5">
        <div className="text-[2.8rem] md:text-[3.6rem] font-bold font-sans text-white leading-none">
          {disruptedRoutes}
        </div>
        <div className="text-[0.85rem] text-white/60 font-sans mt-1">
          {t('flightAlerts.heroDisruptedRoutes', { count: String(disruptedRoutes) })}
        </div>
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <HeroStat
          value={String(criticalCount)}
          label={t('flightAlerts.heroCountriesCritical', { count: String(criticalCount) })}
        />
        <HeroStat
          value={`${avgReserves}d`}
          label={t('flightAlerts.heroAvgReserves', { days: String(avgReserves) })}
        />
        <HeroStat
          value={String(routes.length)}
          label={t('flightAlerts.heroFlightsSuspended', { count: String(routes.length) })}
        />
      </div>

      {/* CTA */}
      <button
        onClick={handleScrollToChecker}
        className="bg-accent text-white font-sans text-[0.85rem] font-semibold px-5 py-2.5 rounded-md hover:bg-[#b03e27] transition-colors cursor-pointer"
      >
        {t('flightAlerts.checkYourRoute')} &darr;
      </button>
    </div>
  )
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white/5 rounded-lg px-4 py-3">
      <div className="text-[1.3rem] md:text-[1.5rem] font-bold font-sans text-white">{value}</div>
      <div className="text-[0.68rem] text-white/60 font-sans mt-0.5">{label}</div>
    </div>
  )
}
