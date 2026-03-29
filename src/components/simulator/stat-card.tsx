'use client'

export function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="bg-bg-alt border border-border rounded-lg p-3 text-center">
      <div
        className={`text-[1.3rem] font-light tracking-tight ${
          accent ? 'text-accent' : 'text-ink'
        }`}
      >
        {value}
      </div>
      <div className="font-sans text-[0.65rem] text-ink-muted mt-0.5 uppercase tracking-[0.04em]">
        {label}
      </div>
    </div>
  )
}
