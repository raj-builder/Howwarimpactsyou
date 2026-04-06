'use client'

import { useT } from '@/lib/use-t'
import type { FuelAlertLevel } from '@/types/fuel-security'

const ALERT_STYLES: Record<FuelAlertLevel, { bg: string; text: string; key: string }> = {
  critical: { bg: 'bg-accent-light', text: 'text-accent', key: 'flightAlerts.alertCritical' },
  high:     { bg: 'bg-[#fef3cd]', text: 'text-amber', key: 'flightAlerts.alertHigh' },
  moderate: { bg: 'bg-[#d6eaf8]', text: 'text-blue', key: 'flightAlerts.alertModerate' },
  low:      { bg: 'bg-[#d5f5e3]', text: 'text-green', key: 'flightAlerts.alertLow' },
}

interface AlertBadgeProps {
  level: FuelAlertLevel
}

export function AlertBadge({ level }: AlertBadgeProps) {
  const t = useT()
  const style = ALERT_STYLES[level]

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[0.7rem] font-bold tracking-wider ${style.bg} ${style.text}`}
      role="status"
      aria-label={t(style.key)}
    >
      {t(style.key)}
    </span>
  )
}
