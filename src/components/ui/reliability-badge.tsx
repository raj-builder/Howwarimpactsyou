import type { ReliabilityStatus } from '@/types/scenario'

const STYLES: Record<ReliabilityStatus, string> = {
  validated: 'bg-green-light text-green',
  indicative: 'bg-amber-light text-amber',
  experimental: 'bg-blue-light text-blue',
}

const LABELS: Record<ReliabilityStatus, string> = {
  validated: 'Validated',
  indicative: 'Indicative',
  experimental: 'Experimental',
}

const DESCRIPTIONS: Record<ReliabilityStatus, string> = {
  validated:
    'Model ceiling has historically exceeded realized CPI changes in this market.',
  indicative:
    'Model may underestimate due to structural factors not fully captured.',
  experimental:
    'Limited validation data available. Treat estimates with caution.',
}

export function ReliabilityBadge({
  status,
  showTooltip = false,
}: {
  status: ReliabilityStatus
  showTooltip?: boolean
}) {
  return (
    <span className="inline-flex items-center gap-1" title={showTooltip ? DESCRIPTIONS[status] : undefined}>
      <span
        className={`inline-block font-sans text-[0.67rem] font-semibold px-2 py-0.5 rounded tracking-[0.04em] uppercase ${STYLES[status]}`}
      >
        {LABELS[status]}
      </span>
    </span>
  )
}
