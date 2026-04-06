'use client'

import { useT } from '@/lib/use-t'
import { AlertBadge } from './alert-badge'
import { VulnerabilityBar } from './vulnerability-bar'
import type { FuelSecurityResult } from '@/types/fuel-security'
import type { CountryFuelProfile } from '@/types/fuel-security'
import { COUNTRY_MAP } from '@/data/countries'

interface CountryFuelCardProps {
  result: FuelSecurityResult
  profile: CountryFuelProfile
  onClick?: () => void
  selected?: boolean
}

export function CountryFuelCard({ result, profile, onClick, selected }: CountryFuelCardProps) {
  const t = useT()
  const country = COUNTRY_MAP[result.countryId]
  const flag = country?.flag ?? ''
  const name = country?.name ?? result.countryId

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-start bg-bg-card border rounded-[var(--radius-card)] p-4 transition-all hover:shadow-md hover:border-accent/30 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
        selected ? 'ring-2 ring-accent shadow-md border-accent/40' : 'border-border'
      }`}
      aria-pressed={selected}
    >
      {/* Header: flag + name + badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">{flag}</span>
          <span className="font-sans text-[0.9rem] font-semibold text-ink">{name}</span>
        </div>
        <AlertBadge level={result.alertLevel} />
      </div>

      {/* 4 stat pills */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <StatPill label={t('flightAlerts.reserveDays')} value={`${profile.strategicReserveDays}d`} />
        <StatPill label={t('flightAlerts.importDependency')} value={`${profile.importDependencyPct}%`} />
        <StatPill label={t('flightAlerts.hormuzExposure')} value={`${profile.hormuzExposurePct}%`} />
        <StatPill label={t('flightAlerts.refiningCapacity')} value={`${profile.refiningCapacityPct}%`} />
      </div>

      {/* Vulnerability bar */}
      <VulnerabilityBar score={result.vulnerabilityScore} />

      {/* Depletion estimate */}
      <p className="mt-2 text-[0.72rem] text-ink-muted font-sans leading-snug">
        {isFinite(result.estimatedDepletionDays)
          ? t('flightAlerts.estimatedDepletion', { days: String(result.estimatedDepletionDays) })
          : t('flightAlerts.notHormuzExposed')
        }
      </p>
    </button>
  )
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center bg-bg-alt rounded-md px-2 py-1.5">
      <span className="text-[0.68rem] text-ink-muted font-sans">{label}</span>
      <span className="text-[0.82rem] font-bold text-ink font-sans">{value}</span>
    </div>
  )
}
