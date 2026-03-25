import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'Version history and release notes for howwarimpactsyou.com. Track every change to the model, data sources, and interface.',
}

const VERSIONS = [
  {
    version: 'v1.0',
    date: 'March 2025',
    title: 'Initial release',
    changes: [
      '5 war/shock scenarios: Russia-Ukraine, Iran-Israel-US, Gaza 2023, COVID-19, Gulf War 2003',
      '10 consumer categories: bread, dairy, eggs, rice, cooking oil, vegetables, meat, detergent, fuel, and full basket',
      '10 core countries with full coverage: Philippines, Egypt, India, Brazil, Nigeria, Pakistan, Indonesia, T\u00fcrkiye, Ukraine, Morocco',
      '6 partial-coverage countries: Bangladesh, Kenya, Sri Lanka, Ghana, South Africa, Mexico',
      '4 experimental countries: Argentina, Ethiopia, Vietnam, Thailand',
      'Validation against realized CPI data for 7 country-category pairs',
      'Commodity price feeds from World Bank Pink Sheet and SerpAPI / Google Finance',
      'Methodology documentation with full formula transparency',
      'Known failure mode documentation for T\u00fcrkiye, Nigeria, and Pakistan',
    ],
  },
]

export default function ChangelogPage() {
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
            <span className="text-white/70">Changelog</span>
          </nav>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-[1.2] mb-4 tracking-tight font-serif">
            Changelog
          </h1>
          <p className="text-[1.05rem] text-white/65 max-w-[600px] leading-relaxed font-serif">
            Every change to the model, data sources, and interface is documented
            here. Transparency is not just about the formula &mdash; it includes
            how the tool evolves over time.
          </p>
        </div>
      </section>

      <div className="container-page py-14">
        <div className="max-w-[780px]">
          {VERSIONS.map((entry) => (
            <article
              key={entry.version}
              className="bg-bg-card border border-border rounded-[10px] p-6 md:p-8 shadow-card mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="font-sans text-[0.75rem] font-bold text-white bg-accent px-2.5 py-1 rounded">
                  {entry.version}
                </span>
                <span className="font-sans text-[0.84rem] text-ink-muted">
                  {entry.date}
                </span>
              </div>
              <h2 className="font-serif text-[1.3rem] font-normal text-ink mb-4 leading-tight">
                {entry.title}
              </h2>
              <ul className="space-y-2">
                {entry.changes.map((change, i) => (
                  <li
                    key={i}
                    className="font-sans text-[0.84rem] text-ink-soft leading-relaxed flex gap-2.5"
                  >
                    <span className="text-accent mt-0.5 shrink-0">&bull;</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </>
  )
}
