import Link from 'next/link'
import type { Metadata } from 'next'
import { getMessages } from '@/lib/use-t'

export const metadata: Metadata = {
  title: 'howwarimpactsyou.com — Macro-to-Consumer Price Impact Simulator',
  description:
    'See how wars, oil shocks, and currency moves affect the price of bread, fuel, and everyday goods in 12+ countries. Free, transparent, open-methodology simulator.',
  alternates: { canonical: 'https://howwarimpactsyou.com' },
}

const HERO_CARD = {
  flag: '🇪🇬',
  war: 'Iran–Israel–US Conflict',
  title: 'Egypt · Household Fuel',
  drivers: 'Brent +18% · Shipping +45% · EGP –38%',
  impact: '+28.4%',
  barWidth: 88,
  explainer:
    'Fuel prices could rise up to 28.4% as Strait of Hormuz tensions drive crude oil and shipping costs higher, amplified by a depreciating Egyptian Pound.',
  badges: [
    { label: 'Full Coverage', color: 'green' },
    { label: 'Very High Pressure', color: 'red' },
  ],
  href: '/country-simulator?war=iran-israel-us&category=fuel&country=Egypt',
}

const SECONDARY_CARDS = [
  {
    flag: '🇵🇰',
    title: 'Pakistan · Bread',
    impact: '+18.4%',
    drivers: 'Brent +18% · PKR –22%',
    href: '/country-simulator?war=iran-israel-us&category=bread&country=Pakistan',
  },
  {
    flag: '🇵🇭',
    title: 'Philippines · Fuel',
    impact: '+15.3%',
    drivers: 'Brent +18% · PHP –10%',
    href: '/country-simulator?war=iran-israel-us&category=fuel&country=Philippines',
  },
  {
    flag: '🇮🇳',
    title: 'India · Cooking Oil',
    impact: '+7.8%',
    drivers: 'Shipping +45% · INR –4%',
    href: '/country-simulator?war=iran-israel-us&category=oil&country=India',
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
      <section className="bg-gradient-to-br from-[#1a1a1a] via-[#2d2420] to-[#3a2216] text-white py-16 px-8 md:py-20">
        <div className="max-w-[960px] mx-auto">
          <p className="font-sans text-[0.72rem] font-bold tracking-[0.14em] uppercase text-accent-warm mb-4">
            {m.home.eyebrow}
          </p>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-[1.2] mb-4 tracking-tight font-serif">
            {m.home.headline}
          </h1>
          <p className="text-[1.05rem] text-white/70 max-w-[580px] mb-8 leading-relaxed font-serif">
            {m.home.subtitle}
          </p>
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
              {m.methodology.title}
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer strip */}
      <div className="bg-amber-light border-b border-[#e8c97a] py-3 px-8 text-center">
        <p className="font-sans text-[0.78rem] text-[#7a4f10] max-w-[900px] mx-auto">
          <strong className="text-[#5a3408]">{m.home.scenarioOnly}.</strong>{' '}
          {m.home.disclaimer}
        </p>
      </div>

      {/* Impact examples — hierarchy: 1 hero card + 3 compact rows */}
      <section className="container-page py-14">
        <p className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-2">
          {m.home.examplesTitle}
        </p>
        <h2 className="text-[clamp(1.4rem,2.5vw,1.9rem)] font-normal tracking-tight mb-2 text-ink font-serif">
          {m.home.examplesSubtitle}
        </h2>
        <p className="font-sans text-[0.82rem] text-ink-muted mb-8 max-w-[580px]">
          {m.home.ceilingNote}
        </p>

        {/* Hero card — Egypt fuel, the most dramatic impact */}
        <Link
          href={HERO_CARD.href}
          className="block bg-gradient-to-br from-[#1a1a1a] via-[#2d2420] to-[#3a2216] text-white rounded-[10px] p-6 md:p-8 mb-6 no-underline hover:shadow-lg transition-shadow group"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <span className="inline-block font-sans text-[0.65rem] font-bold tracking-[0.04em] uppercase bg-accent text-white px-2 py-0.5 rounded mb-3">
                {HERO_CARD.war}
              </span>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{HERO_CARD.flag}</span>
                <span className="font-sans text-[1rem] font-bold">{HERO_CARD.title}</span>
              </div>
              <p className="font-sans text-[0.82rem] text-white/60 mb-3 leading-relaxed max-w-[480px]">
                {HERO_CARD.explainer}
              </p>
              <div className="font-sans text-[0.75rem] text-white/40 tracking-wide">
                {HERO_CARD.drivers}
              </div>
            </div>
            <div className="text-center md:text-right shrink-0">
              <div className="text-[3.2rem] md:text-[4rem] font-light text-accent-warm tracking-tight leading-none">
                {HERO_CARD.impact}
              </div>
              <div className="font-sans text-[0.72rem] text-white/50 mt-1">
                {m.common.priceCeiling}
              </div>
              <div className="flex gap-1.5 mt-3 justify-center md:justify-end">
                {HERO_CARD.badges.map((badge) => (
                  <span
                    key={badge.label}
                    className={`font-sans text-[0.62rem] font-semibold px-2 py-0.5 rounded tracking-[0.04em] uppercase ${BADGE_STYLES[badge.color]}`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="h-[4px] bg-white/10 rounded-sm overflow-hidden mt-5">
            <div
              className="h-full rounded-sm bg-gradient-to-r from-accent-warm to-accent"
              style={{ width: `${HERO_CARD.barWidth}%` }}
            />
          </div>
          <div className="mt-3 font-sans text-[0.72rem] text-accent-warm font-semibold group-hover:text-white transition-colors">
            {m.simulator.exploreCountry} &rarr;
          </div>
        </Link>

        {/* Secondary impact rows */}
        <div className="space-y-2 mb-10">
          {SECONDARY_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="flex items-center gap-4 border border-border bg-bg-card rounded-lg px-5 py-4 no-underline hover:border-accent-warm hover:shadow-sm transition-all group"
            >
              <span className="text-xl shrink-0">{card.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="font-sans text-[0.88rem] font-semibold text-ink group-hover:text-accent transition-colors">
                  {card.title}
                </div>
                <div className="font-sans text-[0.72rem] text-ink-muted">
                  {card.drivers}
                </div>
              </div>
              <span className="font-sans text-[1.1rem] font-bold text-accent shrink-0">
                {card.impact}
              </span>
              <span className="text-ink-muted group-hover:text-accent transition-colors shrink-0" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works — 3-step strip */}
      <section className="bg-bg-card border-y border-border py-14 px-8">
        <div className="max-w-[960px] mx-auto">
          <h2 className="text-[1.1rem] font-serif font-normal tracking-tight text-ink mb-8 text-center">
            {m.home.tagline}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-accent-light text-accent font-sans text-[1rem] font-bold flex items-center justify-center mx-auto mb-3">
                1
              </div>
              <h3 className="font-sans text-[0.88rem] font-semibold text-ink mb-1">
                {m.simulator.conflict}
              </h3>
              <p className="font-sans text-[0.78rem] text-ink-muted leading-relaxed">
                {m.home.examplesSubtitle}
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-accent-light text-accent font-sans text-[1rem] font-bold flex items-center justify-center mx-auto mb-3">
                2
              </div>
              <h3 className="font-sans text-[0.88rem] font-semibold text-ink mb-1">
                {m.simulator.country}
              </h3>
              <p className="font-sans text-[0.78rem] text-ink-muted leading-relaxed">
                {m.home.statsCountries}: 20+ {m.home.statsCategories.toLowerCase()}: 10
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-accent-light text-accent font-sans text-[1rem] font-bold flex items-center justify-center mx-auto mb-3">
                3
              </div>
              <h3 className="font-sans text-[0.88rem] font-semibold text-ink mb-1">
                {m.impact.ceiling}
              </h3>
              <p className="font-sans text-[0.78rem] text-ink-muted leading-relaxed">
                {m.home.ceilingNote}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
