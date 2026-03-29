import Link from 'next/link'
import type { Metadata } from 'next'
import { getMessages } from '@/lib/use-t'

export const metadata: Metadata = {
  title: 'About',
  description:
    'About howwarimpactsyou.com: mission, editorial standards, and the team behind the macro-to-consumer price impact simulator.',
}

export default function AboutPage() {
  const m = getMessages()
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
            <span className="text-white/70">About</span>
          </nav>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-[1.2] mb-4 tracking-tight font-serif">
            {m.about.title}
          </h1>
          <p className="text-[1.05rem] text-white/65 max-w-[600px] leading-relaxed font-serif">
            {m.about.subtitle}
          </p>
        </div>
      </section>

      <div className="container-page py-14">
        {/* Mission */}
        <section className="mb-14">
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-3">
            Mission
          </h2>
          <div className="bg-bg-card border border-border rounded-[10px] p-6 md:p-8 shadow-card max-w-[780px]">
            <h3 className="font-serif text-[1.3rem] font-normal text-ink mb-4 leading-tight">
              Connecting macro shocks to consumer reality
            </h3>
            <p className="font-sans text-[0.88rem] text-ink-soft leading-relaxed mb-4">
              When oil prices spike, currencies crash, or wars disrupt supply
              chains, the headlines focus on commodities markets and geopolitics.
              But for billions of people, the real question is simpler: will my
              groceries cost more next month?
            </p>
            <p className="font-sans text-[0.88rem] text-ink-soft leading-relaxed mb-4">
              This tool bridges that gap. It takes upstream macro shocks &mdash;
              commodity price changes, currency depreciation, trade disruptions
              &mdash; and estimates how they could flow through to consumer
              categories like bread, cooking oil, fuel, and dairy in specific
              countries.
            </p>
            <p className="font-sans text-[0.88rem] text-ink-soft leading-relaxed">
              The goal is not to predict shelf prices with precision. It is to
              make the transmission mechanism visible, so that journalists,
              researchers, policymakers, and curious citizens can understand
              their exposure to global economic shocks.
            </p>
          </div>
        </section>

        {/* Editorial standards */}
        <section className="mb-14">
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-3">
            Editorial standards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <article className="bg-bg-card border border-border rounded-[10px] p-6 shadow-card">
              <h3 className="font-sans text-[0.95rem] font-bold text-ink mb-2">
                Transparency
              </h3>
              <p className="font-sans text-[0.84rem] text-ink-soft leading-relaxed">
                Every assumption is documented. The model formula, exposure
                coefficients, lag profiles, and FX adjustments are all published
                on the{' '}
                <Link href="/methodology" className="text-accent no-underline hover:underline">
                  methodology page
                </Link>
                . If we change an assumption, it appears in the{' '}
                <Link href="/changelog" className="text-accent no-underline hover:underline">
                  changelog
                </Link>
                .
              </p>
            </article>

            <article className="bg-bg-card border border-border rounded-[10px] p-6 shadow-card">
              <h3 className="font-sans text-[0.95rem] font-bold text-ink mb-2">
                Methodology first
              </h3>
              <p className="font-sans text-[0.84rem] text-ink-soft leading-relaxed">
                We publish the methodology and validation data alongside the
                tool itself. The model is validated against realized CPI data
                from national statistics agencies. Known failure modes are
                documented on the{' '}
                <Link href="/validation" className="text-accent no-underline hover:underline">
                  validation page
                </Link>
                .
              </p>
            </article>

            <article className="bg-bg-card border border-border rounded-[10px] p-6 shadow-card">
              <h3 className="font-sans text-[0.95rem] font-bold text-ink mb-2">
                Data sourcing
              </h3>
              <p className="font-sans text-[0.84rem] text-ink-soft leading-relaxed">
                All macro data comes from authoritative public sources: the
                World Bank, IMF, FAO, and EIA. Validation data comes from
                national CPI offices and UN Comtrade. No proprietary or
                paywalled data is used. Full details on the{' '}
                <Link href="/data-sources" className="text-accent no-underline hover:underline">
                  data sources page
                </Link>
                .
              </p>
            </article>
          </div>
        </section>

        {/* Crediting and timeline */}
        <section>
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-3">
            Project timeline
          </h2>
          <div className="bg-bg-card border border-border rounded-[10px] p-6 md:p-8 shadow-card max-w-[780px]">
            <div className="relative pl-6 border-l-2 border-accent/20 space-y-8">
              <div className="relative">
                <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-accent border-2 border-bg-card" />
                <div className="font-sans text-[0.72rem] font-bold text-accent uppercase tracking-wide mb-1">
                  Mar 2025
                </div>
                <div className="font-sans text-[0.88rem] font-semibold text-ink mb-0.5">
                  v1.0 Launch
                </div>
                <p className="font-sans text-[0.84rem] text-ink-soft leading-relaxed">
                  Initial release with 5 war/shock scenarios, 10 consumer
                  categories, 10 core countries, and validation against
                  realized CPI data.
                </p>
              </div>
              <div className="relative">
                <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-accent-warm border-2 border-bg-card" />
                <div className="font-sans text-[0.72rem] font-bold text-accent-warm uppercase tracking-wide mb-1">
                  Ongoing
                </div>
                <div className="font-sans text-[0.88rem] font-semibold text-ink mb-0.5">
                  Data updates
                </div>
                <p className="font-sans text-[0.84rem] text-ink-soft leading-relaxed">
                  Commodity prices and exchange rates are refreshed regularly
                  from World Bank, IMF, and EIA feeds. Validation data is
                  updated as national CPI agencies publish new figures.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
