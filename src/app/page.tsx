import Link from 'next/link'
import type { Metadata } from 'next'
import { getMessages } from '@/lib/use-t'

export const metadata: Metadata = {
  title: 'howwarimpactsyou.com — Macro-to-Consumer Price Impact Simulator',
  description:
    'See how wars, oil shocks, and currency moves affect the price of bread, fuel, and everyday goods in 12+ countries. Free, transparent, open-methodology simulator.',
  alternates: { canonical: 'https://howwarimpactsyou.com' },
}

const EXAMPLE_CARDS = [
  {
    flag: '🇵🇭',
    war: 'Russia–Ukraine War',
    title: 'Philippines · Bread & Cereals',
    drivers: 'Wheat +38% · Peso –12% · Oil +22%',
    impact: '+18.4%',
    barWidth: 74,
    explainer:
      'Bread prices could rise up to 18.4% if all upstream wheat, fuel, and currency costs pass through to consumers. Ceiling at 100% pass-through, immediate lag.',
    badges: [
      { label: 'Full Coverage', color: 'green' },
      { label: 'High Confidence', color: 'blue' },
      { label: 'Validated', color: 'amber' },
    ],
    href: '/simulator?war=ukraine-russia&category=bread&country=Philippines&pt=100&lag=immediate',
  },
  {
    flag: '🇪🇬',
    war: 'Russia–Ukraine War',
    title: 'Egypt · Cooking Oil',
    drivers: 'Soybean +44% · Sunflower +61% · EGP –35%',
    impact: '+52.1%',
    barWidth: 92,
    explainer:
      'Cooking oil prices could surge up to 52.1% driven by soybean and sunflower cost spikes combined with a sharp currency devaluation. Ceiling at 100% pass-through, immediate lag.',
    badges: [
      { label: 'Full Coverage', color: 'green' },
      { label: 'Very High Pressure', color: 'red' },
    ],
    href: '/simulator?war=ukraine-russia&category=oil&country=Egypt&pt=100&lag=immediate',
  },
  {
    flag: '🇧🇷',
    war: 'Russia–Ukraine War',
    title: 'Brazil · Household Fuel',
    drivers: 'Crude Oil +30% · BRL –8% · Refinery margin +15%',
    impact: '+11.2%',
    barWidth: 45,
    explainer:
      'Household fuel costs could rise up to 11.2% from crude oil price spikes and currency weakness flowing through refinery margins. Immediate impact.',
    badges: [
      { label: 'Partial Coverage', color: 'amber' },
      { label: 'Medium Confidence', color: 'blue' },
    ],
    href: '/simulator?war=ukraine-russia&category=fuel&country=Brazil&pt=100&lag=immediate',
  },
  {
    flag: '🇮🇳',
    war: 'Russia–Ukraine War',
    title: 'India · Vegetables',
    drivers: 'Fertilizer +28% · Diesel +18% · INR –4%',
    impact: '+9.7%',
    barWidth: 39,
    explainer:
      'Vegetable prices could increase up to 9.7% as fertilizer and diesel cost surges raise farming and transport expenses. Ceiling at 100% pass-through, immediate lag.',
    badges: [
      { label: 'Full Coverage', color: 'green' },
      { label: 'Validated', color: 'green' },
    ],
    href: '/simulator?war=ukraine-russia&category=vegetables&country=India&pt=100&lag=immediate',
  },
]

const BADGE_STYLES: Record<string, string> = {
  green: 'bg-green-light text-green',
  amber: 'bg-amber-light text-amber',
  blue: 'bg-blue-light text-blue',
  red: 'bg-accent-light text-accent',
}

export default function HomePage() {
  const m = getMessages()
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a1a] via-[#2d2420] to-[#3a2216] text-white py-20 px-8 md:py-24">
        <div className="max-w-[820px] mx-auto">
          <p className="font-sans text-[0.72rem] font-bold tracking-[0.14em] uppercase text-accent-warm mb-5">
            {m.home.eyebrow}
          </p>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-[1.2] mb-5 tracking-tight font-serif">
            How could <span className="text-accent-warm">oil, war, and currency</span>
            <br />
            affect what you pay?
          </h1>
          <p className="text-[1.1rem] text-white/70 max-w-[620px] mb-8 leading-relaxed font-serif">
            {m.home.subtitle}
          </p>
          <div className="inline-block bg-accent/20 border border-accent/35 rounded-md px-4 py-2.5 font-sans text-[0.79rem] text-white/80 mb-10 max-w-[600px]">
            <strong className="text-accent-warm">Important:</strong> This tool
            estimates a scenario ceiling under 100% pass-through. It is not a price
            forecast, not a shelf-price tracker, and does not claim direct causation.
          </div>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/simulator"
              className="bg-accent text-white font-sans text-[0.9rem] font-semibold px-7 py-3 rounded-lg no-underline tracking-wide hover:bg-[#b03e27] transition-colors"
            >
              {m.nav.openSimulator} &rarr;
            </Link>
            <Link
              href="/methodology"
              className="bg-transparent text-white/80 font-sans text-[0.9rem] px-7 py-3 rounded-lg border border-white/25 no-underline hover:border-white/50 hover:text-white transition-colors"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer strip */}
      <div className="bg-amber-light border-b border-[#e8c97a] py-3 px-8 text-center">
        <p className="font-sans text-[0.78rem] text-[#7a4f10] max-w-[900px] mx-auto">
          <strong className="text-[#5a3408]">Scenario estimator only.</strong> All
          outputs show an upper-bound ceiling assuming 100% pass-through of upstream
          costs. Actual retail prices depend on competition, policy, logistics, and
          market structure. This is not financial advice.
        </p>
      </div>

      {/* Example impact cards */}
      <section className="container-page py-14">
        <p className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-2">
          {m.home.examplesTitle}
        </p>
        <h2 className="text-[clamp(1.4rem,2.5vw,1.9rem)] font-normal tracking-tight mb-3 text-ink font-serif">
          {m.home.examplesSubtitle}
        </h2>
        <p className="font-sans text-[0.88rem] text-ink-soft max-w-[640px] leading-relaxed">
          Each card below shows a sample scenario. Click any card to open the full
          simulator with that selection pre-loaded.
        </p>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5 mt-8">
          {EXAMPLE_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="bg-bg-card border border-border rounded-[10px] p-5 shadow-card hover:shadow-lg hover:border-accent-warm transition-all no-underline block"
            >
              <span className="text-2xl mb-2 block">{card.flag}</span>
              <span className="inline-block font-sans text-[0.67rem] font-bold tracking-[0.04em] uppercase bg-[#1a1a1a] text-accent-warm px-2 py-0.5 rounded mb-2">
                {card.war}
              </span>
              <div className="font-sans font-bold text-[0.88rem] text-ink mb-1">
                {card.title}
              </div>
              <div className="font-sans text-[0.75rem] text-ink-muted mb-3.5 tracking-wide">
                {card.drivers}
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[1.9rem] font-light text-accent tracking-tight">
                  {card.impact}
                </span>
                <span className="font-sans text-[0.73rem] text-ink-muted leading-tight">
                  maximum estimated
                  <br />
                  price increase
                </span>
              </div>
              <p className="font-sans text-[0.74rem] text-ink-soft leading-relaxed mb-2.5">
                {card.explainer}
              </p>
              <div className="h-[5px] bg-bg-alt rounded-sm overflow-hidden mb-3">
                <div
                  className="h-full rounded-sm bg-gradient-to-r from-accent-warm to-accent"
                  style={{ width: `${card.barWidth}%` }}
                />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {card.badges.map((badge) => (
                  <span
                    key={badge.label}
                    className={`font-sans text-[0.67rem] font-semibold px-2 py-0.5 rounded tracking-[0.04em] uppercase ${BADGE_STYLES[badge.color]}`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* How to read */}
        <div className="bg-blue-light border border-[#ccdff0] rounded-[10px] p-6 grid grid-cols-[auto_1fr] gap-4 items-start mt-12">
          <span className="text-3xl">📖</span>
          <div>
            <h3 className="font-sans text-[0.9rem] font-bold text-blue mb-1.5">
              How to read these numbers
            </h3>
            <p className="font-sans text-[0.82rem] text-[#2a4a6a] leading-relaxed">
              Each figure is a <strong>scenario ceiling</strong> — the maximum
              estimated price impact if 100% of upstream cost changes flow through to
              consumers. In practice, governments subsidize, retailers absorb margins,
              and supply chains adjust. The realized impact is typically 55–75% of the
              ceiling.
            </p>
          </div>
        </div>
      </section>

      {/* Mission section */}
      <section className="bg-bg-card border-y border-border py-14 px-8">
        <div className="max-w-[820px] mx-auto text-center">
          <h2 className="text-[clamp(1.4rem,2.5vw,1.9rem)] font-normal tracking-tight mb-4 font-serif">
            {m.home.tagline}
          </h2>
          <p className="font-sans text-[0.88rem] text-ink-soft leading-relaxed mb-8 max-w-[600px] mx-auto">
            Most people hear about oil spikes or currency crashes but can&apos;t connect
            those to what they pay at the store. This tool builds that bridge,
            transparently, with every assumption visible.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: '12+', label: m.home.statsCountries },
              { num: '10', label: m.home.statsCategories },
              { num: '6', label: m.home.statsFactors },
              { num: '100%', label: m.home.statsTransparency },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-[2rem] font-light text-accent tracking-tight">
                  {stat.num}
                </div>
                <div className="font-sans text-[0.78rem] text-ink-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
