'use client'

import Link from 'next/link'

interface Preset {
  label: string
  flag: string
  impact: string
  war: string
  category: string
  country: string
}

const PRESETS: Preset[] = [
  {
    label: 'Bread in Egypt',
    flag: '\u{1F1EA}\u{1F1EC}',
    impact: '+41.3%',
    war: 'ukraine-russia',
    category: 'bread',
    country: 'Egypt',
  },
  {
    label: 'Fuel in Philippines',
    flag: '\u{1F1F5}\u{1F1ED}',
    impact: '+15.3%',
    war: 'iran-israel-us',
    category: 'fuel',
    country: 'Philippines',
  },
  {
    label: 'COVID food basket in India',
    flag: '\u{1F1EE}\u{1F1F3}',
    impact: '+6.9%',
    war: 'covid',
    category: 'basket',
    country: 'India',
  },
]

export function PresetCards() {
  return (
    <div className="mb-6">
      <p className="font-sans text-[0.72rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-2">
        Quick Scenarios
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PRESETS.map((preset) => (
          <Link
            key={preset.label}
            href={`/simulator?war=${preset.war}&category=${preset.category}&country=${preset.country}`}
            className="group border border-border rounded-lg px-4 py-3 bg-bg-card hover:border-accent transition-all flex items-center gap-3"
          >
            <span className="text-2xl shrink-0">{preset.flag}</span>
            <div className="flex-1 min-w-0">
              <div className="font-sans text-[0.82rem] font-semibold text-ink group-hover:text-accent transition-colors">
                {preset.label}
              </div>
            </div>
            <span className="font-sans text-[0.85rem] font-bold text-accent shrink-0">
              {preset.impact}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
