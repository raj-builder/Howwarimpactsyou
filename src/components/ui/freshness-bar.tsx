export function FreshnessBar({
  modelVersion = 'v1.0',
  dataAsOf,
  cacheAge,
  caveat,
}: {
  modelVersion?: string
  dataAsOf?: string
  cacheAge?: string
  caveat?: string
}) {
  return (
    <div className="bg-bg-alt border border-border rounded-[10px] px-4 py-2.5 flex flex-wrap gap-4 items-center mb-5 font-sans text-[0.72rem]">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
        <span className="font-bold text-ink-soft uppercase tracking-wider">Model {modelVersion}</span>
      </div>
      {dataAsOf && (
        <div className="text-ink-muted">
          Data as of: <span className="font-semibold text-ink-soft">{dataAsOf}</span>
        </div>
      )}
      {cacheAge && (
        <div className="text-ink-muted">
          Cache: <span className="font-semibold text-ink-soft">{cacheAge}</span>
        </div>
      )}
      {caveat && (
        <div className="text-amber font-semibold">
          {caveat}
        </div>
      )}
    </div>
  )
}
