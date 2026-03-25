import type { CoverageStatus } from '@/types'

const BADGE_STYLES: Record<CoverageStatus, string> = {
  full: 'bg-green-light text-green',
  partial: 'bg-amber-light text-amber',
  experimental: 'bg-blue-light text-blue',
  unavailable: 'bg-bg-alt text-ink-muted',
}

const BADGE_LABELS: Record<CoverageStatus, string> = {
  full: 'Full',
  partial: 'Partial',
  experimental: 'Experimental',
  unavailable: 'Unavailable',
}

export function CoverageBadge({ status }: { status: CoverageStatus }) {
  return (
    <span
      className={`inline-block font-sans text-[0.67rem] font-semibold px-2 py-0.5 rounded tracking-[0.04em] uppercase ${BADGE_STYLES[status]}`}
    >
      {BADGE_LABELS[status]}
    </span>
  )
}
