import type { ReliabilityStatus } from '@/types/scenario'
import { t } from '@/lib/use-t'

const STYLES: Record<ReliabilityStatus, string> = {
  validated: 'bg-green-light text-green',
  indicative: 'bg-amber-light text-amber',
  experimental: 'bg-blue-light text-blue',
}

const LABEL_KEYS: Record<ReliabilityStatus, string> = {
  validated: 'badges.validated',
  indicative: 'badges.indicative',
  experimental: 'badges.experimental',
}

const DESC_KEYS: Record<ReliabilityStatus, string> = {
  validated: 'badges.validatedDesc',
  indicative: 'badges.indicativeDesc',
  experimental: 'badges.experimentalDesc',
}

export function ReliabilityBadge({
  status,
  showTooltip = false,
}: {
  status: ReliabilityStatus
  showTooltip?: boolean
}) {
  return (
    <span className="inline-flex items-center gap-1" title={showTooltip ? t(DESC_KEYS[status]) : undefined}>
      <span
        className={`inline-block font-sans text-[0.67rem] font-semibold px-2 py-0.5 rounded tracking-[0.04em] uppercase ${STYLES[status]}`}
      >
        {t(LABEL_KEYS[status])}
      </span>
    </span>
  )
}
