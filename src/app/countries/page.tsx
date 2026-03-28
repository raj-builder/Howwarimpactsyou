import Link from 'next/link'
import type { Metadata } from 'next'
import { getMessages } from '@/lib/use-t'

export const metadata: Metadata = {
  title: 'Countries Involved in Conflicts',
  description:
    'Key data and economic profiles of countries directly involved in the wars tracked by howwarimpactsyou.com — USA, Israel, Iran, Russia, Ukraine, and more.',
}

/**
 * Countries directly involved in the conflicts modeled by the simulator.
 * These are NOT the same as the 20 "recipient" countries in the rankings —
 * these are the belligerent nations whose actions drive the commodity shocks.
 *
 * Data sources:
 * - GDP: World Bank (2023 est.)
 * - Oil production: EIA / OPEC (2023)
 * - Gas production: IEA (2023)
 * - Key exports: UN Comtrade
 */
const BELLIGERENT_COUNTRIES = [
  {
    name: 'United States',
    flag: '🇺🇸',
    role: 'Military actor, sanctions enforcer, global reserve currency issuer',
    wars: ['iran-israel-us', 'gulf-2003'],
    gdpBn: 25460,
    oilMbpd: 12.9,
    gasBcm: 1035,
    keyExports: 'Petroleum products, LNG, wheat, corn, soybeans',
    impact: 'US sanctions on Iran directly restrict ~2.5 Mbpd of oil exports. US dollar strength amplifies commodity costs for import-dependent economies.',
  },
  {
    name: 'Israel',
    flag: '🇮🇱',
    role: 'Direct combatant, regional military operations',
    wars: ['iran-israel-us', 'gaza-2023'],
    gdpBn: 525,
    oilMbpd: 0,
    gasBcm: 22,
    keyExports: 'Technology, diamonds, pharmaceuticals, natural gas (Leviathan)',
    impact: 'Israeli military operations in Gaza and against Iranian proxies disrupt Red Sea shipping routes, adding 10-15 days to Asia-Europe freight.',
  },
  {
    name: 'Iran',
    flag: '🇮🇷',
    role: 'OPEC member, Strait of Hormuz gatekeeper, regional proxy sponsor',
    wars: ['iran-israel-us'],
    gdpBn: 401,
    oilMbpd: 3.2,
    gasBcm: 259,
    keyExports: 'Crude oil, natural gas, petrochemicals',
    impact: 'Iran controls the Strait of Hormuz (21% of global oil trade). Escalation threats alone cause shipping insurance premiums to spike, adding $1-3/bbl to crude.',
  },
  {
    name: 'Russia',
    flag: '🇷🇺',
    role: 'Major oil/gas exporter, grain exporter, direct combatant',
    wars: ['ukraine-russia'],
    gdpBn: 1862,
    oilMbpd: 10.8,
    gasBcm: 638,
    keyExports: 'Crude oil, natural gas, wheat, fertilizer, metals',
    impact: 'Russia produces ~12% of global oil and ~17% of global gas. Sanctions rerouted energy flows, raised European gas prices 300%+, and disrupted Black Sea grain exports.',
  },
  {
    name: 'Ukraine',
    flag: '🇺🇦',
    role: 'Major grain exporter, direct combatant, transit corridor',
    wars: ['ukraine-russia'],
    gdpBn: 160,
    oilMbpd: 0,
    gasBcm: 18,
    keyExports: 'Wheat, corn, sunflower oil, steel',
    impact: 'Ukraine produces ~10% of global wheat exports and ~50% of global sunflower oil. Black Sea port blockades in 2022 caused global grain prices to spike 40%+.',
  },
  {
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    role: 'OPEC+ swing producer, regional power',
    wars: ['iran-israel-us'],
    gdpBn: 1069,
    oilMbpd: 10.4,
    gasBcm: 117,
    keyExports: 'Crude oil, refined petroleum, petrochemicals',
    impact: 'Saudi production decisions directly set global oil price floors. OPEC+ cuts in response to conflict uncertainty amplify price shocks on consuming nations.',
  },
]

export default function CountriesPage() {
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
            <span className="text-white/70">{m.nav.countries}</span>
          </nav>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-[1.2] mb-4 tracking-tight font-serif">
            Countries involved in conflicts
          </h1>
          <p className="text-[1.05rem] text-white/65 max-w-[600px] leading-relaxed font-serif">
            Key economic profiles of nations directly involved in the wars modeled by this tool. These countries drive the commodity shocks that affect consumer prices worldwide.
          </p>
        </div>
      </section>

      <div className="container-page py-14">
        {/* Explainer */}
        <div className="bg-blue-light border border-[#ccdff0] rounded-[10px] p-6 grid grid-cols-[auto_1fr] gap-4 items-start mb-10">
          <span className="text-2xl" aria-hidden="true">&#x1F30D;</span>
          <div>
            <h3 className="font-sans text-[0.9rem] font-bold text-blue mb-1.5">
              Why these countries matter
            </h3>
            <p className="font-sans text-[0.82rem] text-[#2a4a6a] leading-relaxed">
              The simulator models how wars affect consumer prices in 20+ recipient countries. But the shocks originate from the belligerent nations below — their oil production, grain exports, shipping routes, and currency policies set the upstream conditions that flow through to your grocery bill.
            </p>
          </div>
        </div>

        {/* Country cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {BELLIGERENT_COUNTRIES.map((country) => (
            <article
              key={country.name}
              className="bg-bg-card border border-border rounded-[10px] p-6 shadow-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{country.flag}</span>
                <div>
                  <h3 className="font-sans text-[1rem] font-bold text-ink">{country.name}</h3>
                  <p className="font-sans text-[0.72rem] text-ink-muted">{country.role}</p>
                </div>
              </div>

              {/* Key stats grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-bg-alt rounded-lg px-3 py-2 text-center">
                  <div className="font-sans text-[1rem] font-bold text-ink">${(country.gdpBn / 1000).toFixed(1)}T</div>
                  <div className="font-sans text-[0.6rem] text-ink-muted">GDP</div>
                </div>
                <div className="bg-bg-alt rounded-lg px-3 py-2 text-center">
                  <div className="font-sans text-[1rem] font-bold text-ink">{country.oilMbpd}</div>
                  <div className="font-sans text-[0.6rem] text-ink-muted">Oil Mb/d</div>
                </div>
                <div className="bg-bg-alt rounded-lg px-3 py-2 text-center">
                  <div className="font-sans text-[1rem] font-bold text-ink">{country.gasBcm}</div>
                  <div className="font-sans text-[0.6rem] text-ink-muted">Gas Bcm/yr</div>
                </div>
              </div>

              <div className="mb-3">
                <p className="font-sans text-[0.72rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-1">
                  Key exports
                </p>
                <p className="font-sans text-[0.82rem] text-ink-soft leading-relaxed">
                  {country.keyExports}
                </p>
              </div>

              <div className="mb-3">
                <p className="font-sans text-[0.72rem] font-bold text-ink-muted uppercase tracking-[0.06em] mb-1">
                  Impact on global prices
                </p>
                <p className="font-sans text-[0.82rem] text-ink-soft leading-relaxed">
                  {country.impact}
                </p>
              </div>

              {/* Conflict tags */}
              <div className="flex flex-wrap gap-1.5">
                {country.wars.map((warId) => (
                  <Link
                    key={warId}
                    href={`/simulator?war=${warId}`}
                    className="font-sans text-[0.65rem] font-semibold bg-[#1a1a1a] text-accent-warm px-2 py-0.5 rounded no-underline hover:bg-[#2d2420] transition-colors"
                  >
                    {warId === 'iran-israel-us' ? 'Iran–Israel–US'
                      : warId === 'ukraine-russia' ? 'Russia–Ukraine'
                      : warId === 'gaza-2023' ? 'Gaza / Red Sea'
                      : warId === 'gulf-2003' ? 'Gulf War 2003'
                      : warId}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Data sources */}
        <div className="bg-bg-alt border border-border rounded-lg px-4 py-3 mt-10">
          <p className="font-sans text-[0.72rem] text-ink-muted leading-relaxed">
            <strong className="text-ink">Data sources:</strong> GDP figures from World Bank (2023 estimates). Oil production from EIA/OPEC. Gas production from IEA. Export data from UN Comtrade. All figures are approximate and intended to provide context, not precision.
          </p>
        </div>
      </div>
    </>
  )
}
