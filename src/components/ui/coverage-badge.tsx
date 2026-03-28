import type { CoverageStatus } from '@/types'
import { t } from '@/lib/use-t'

const BADGE_STYLES: Record<CoverageStatus, string> = {
  full: 'bg-green-light text-green',
  partial: 'bg-amber-light text-amber',
  experimental: 'bg-blue-light text-blue',
  unavailable: 'bg-bg-alt text-ink-muted',
}

const BADGE_KEYS: Record<CoverageStatus, string> = {
  full: 'badges.full',
  partial: 'badges.partial',
  experimental: 'badges.experimental',
  unavailable: 'badges.unavailable',
}

export function CoverageBadge({ status }: { status: CoverageStatus }) {
  return (
    <span
      className={`inline-block font-sans text-[0.67rem] font-semibold px-2 py-0.5 rounded tracking-[0.04em] uppercase ${BADGE_STYLES[status]}`}
    >
      {t(BADGE_KEYS[status])}
    </span>
  )
}
