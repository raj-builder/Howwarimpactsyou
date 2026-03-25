import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datasets & API',
  description:
    'Download war-impact datasets and access public JSON APIs. CC BY 4.0 licensed data on commodity shocks, currency depreciation, and consumer price impact rankings.',
}

const DATASETS = [
  {
    title: 'War Impact Rankings',
    description:
      'Estimated consumer-price impact percentages for 10 categories across 5 war/shock scenarios and 10 core countries. Includes top-5 and bottom-5 ranked countries per category.',
    version: '1.0',
    cadence: 'Updated with each new scenario release',
    format: 'JSON',
    license: 'CC BY 4.0',
    endpoint: '/api/data/rankings',
    fields: [
      { name: 'war', desc: 'War/shock scenario identifier (e.g. ukraine-russia)' },
      { name: 'warName', desc: 'Human-readable scenario name' },
      { name: 'category', desc: 'Consumer category identifier (e.g. bread, fuel)' },
      { name: 'categoryLabel', desc: 'Human-readable category name' },
      { name: 'country', desc: 'Country name' },
      { name: 'flag', desc: 'Country flag emoji' },
      { name: 'impactPct', desc: 'Estimated consumer-price impact as a percentage' },
      { name: 'rank', desc: 'Whether entry is in top5 (most impacted) or bot5 (least impacted)' },
    ],
  },
  {
    title: 'War & Shock Scenarios',
    description:
      'Full scenario data including war metadata, date ranges, upstream commodity shocks, and complete country-level rankings for all 10 consumer categories.',
    version: '1.0',
    cadence: 'Updated with each new scenario release',
    format: 'JSON',
    license: 'CC BY 4.0',
    endpoint: '/api/data/wars',
    fields: [
      { name: 'name', desc: 'Human-readable war/shock name' },
      { name: 'dates', desc: 'Conflict date range' },
      { name: 'live', desc: 'Whether the conflict is ongoing' },
      { name: 'shocks', desc: 'Array of upstream commodity shocks (factor + magnitude)' },
      { name: 'rankings', desc: 'Nested rankings keyed by category, each with top5 and bot5 arrays' },
    ],
  },
  {
    title: 'Country Coverage',
    description:
      'List of all tracked countries with coverage status (full, partial, or experimental) and flag emoji identifiers.',
    version: '1.0',
    cadence: 'Updated when new countries are added',
    format: 'JSON',
    license: 'CC BY 4.0',
    endpoint: '/api/data/countries',
    fields: [
      { name: 'id', desc: 'Country identifier (matches country name)' },
      { name: 'name', desc: 'Country display name' },
      { name: 'flag', desc: 'Country flag emoji' },
      { name: 'coverage', desc: 'Coverage tier: full, partial, or experimental' },
    ],
  },
]

export default function DataPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a1a] via-[#2d2420] to-[#3a2216] text-white py-16 px-8 md:py-20">
        <div className="max-w-[820px] mx-auto">
          <nav className="font-sans text-[0.75rem] text-white/40 mb-6">
            <Link href="/" className="text-white/40 no-underline hover:text-white/70 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/70">Datasets & API</span>
          </nav>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-[1.2] mb-4 tracking-tight font-serif">
            Datasets & API
          </h1>
          <p className="text-[1.05rem] text-white/65 max-w-[600px] leading-relaxed font-serif">
            All impact data is freely available under CC BY 4.0. Download JSON datasets
            or query the public API endpoints directly.
          </p>
        </div>
      </section>

      <div className="container-page py-14">
        {/* Dataset cards */}
        <section className="mb-14">
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-3">
            Available datasets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {DATASETS.map((ds) => (
              <article
                key={ds.endpoint}
                className="bg-bg-card border border-border rounded-[10px] p-6 shadow-card flex flex-col"
              >
                <h3 className="font-sans text-[0.95rem] font-bold text-ink mb-2">
                  {ds.title}
                </h3>
                <p className="font-sans text-[0.84rem] text-ink-soft leading-relaxed mb-4 flex-1">
                  {ds.description}
                </p>
                <div className="space-y-2 text-[0.78rem] font-sans text-ink-muted mb-4">
                  <div className="flex justify-between">
                    <span>Version</span>
                    <span className="font-semibold text-ink">{ds.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format</span>
                    <span className="font-semibold text-ink">{ds.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>License</span>
                    <span className="font-semibold text-ink">{ds.license}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updates</span>
                    <span className="font-semibold text-ink text-right max-w-[160px]">
                      {ds.cadence}
                    </span>
                  </div>
                </div>
                <div className="bg-[#1a1a1a] rounded-md px-3 py-2 text-[0.74rem] font-mono text-white/60 mb-4 break-all">
                  GET {ds.endpoint}
                </div>
                <a
                  href={ds.endpoint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent text-white font-sans text-[0.8rem] font-semibold px-4 py-2 rounded-md no-underline tracking-wide hover:bg-[#b03e27] transition-colors text-center"
                >
                  Download JSON
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* Data dictionary */}
        <section className="mb-14">
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-3">
            Data dictionary
          </h2>
          {DATASETS.map((ds) => (
            <div
              key={ds.endpoint}
              className="bg-bg-card border border-border rounded-[10px] p-6 md:p-8 shadow-card max-w-[780px] mb-5"
            >
              <h3 className="font-serif text-[1.1rem] font-normal text-ink mb-4 leading-tight">
                {ds.title}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[0.84rem] font-sans">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-2 font-semibold text-ink pr-6">Field</th>
                      <th className="pb-2 font-semibold text-ink">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ds.fields.map((field) => (
                      <tr key={field.name} className="border-b border-border/50">
                        <td className="py-2 pr-6 font-mono text-[0.8rem] text-accent whitespace-nowrap">
                          {field.name}
                        </td>
                        <td className="py-2 text-ink-soft">{field.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>

        {/* Usage notes */}
        <section>
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-3">
            Usage notes
          </h2>
          <div className="bg-bg-card border border-border rounded-[10px] p-6 md:p-8 shadow-card max-w-[780px]">
            <div className="space-y-4 font-sans text-[0.88rem] text-ink-soft leading-relaxed">
              <p>
                All endpoints return JSON with CORS headers enabled. Responses are
                cached for 24 hours at the CDN edge. No authentication is required.
              </p>
              <p>
                Data is licensed under{' '}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent no-underline hover:underline"
                >
                  Creative Commons Attribution 4.0 International (CC BY 4.0)
                </a>
                . You are free to share and adapt the data for any purpose, including
                commercially, as long as you give appropriate credit.
              </p>
              <p>
                Please cite as:{' '}
                <span className="font-mono text-[0.82rem] text-ink">
                  howwarimpactsyou.com, War Impact Dataset v1.0, 2025.
                </span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
