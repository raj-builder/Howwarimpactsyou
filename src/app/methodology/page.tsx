import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Methodology',
  description:
    'How the howwarimpactsyou.com model works: formula, assumptions, pass-through ceiling, FX adjustments, lag profiles, and known limitations.',
}

const METHOD_CARDS = [
  {
    num: '01',
    title: '100% pass-through ceiling',
    body: 'Every estimate assumes that 100% of upstream cost changes flow through to the consumer. This is deliberately an upper bound. In reality, governments subsidize, retailers absorb margins, and supply chains adapt. The ceiling tells you the worst-case scenario, not the most likely one.',
  },
  {
    num: '02',
    title: 'Direct vs indirect exposure',
    body: 'Each consumer category (bread, fuel, cooking oil, etc.) is mapped to a set of upstream factors (wheat price, crude oil, fertilizer, freight). The exposure coefficient for each category-factor pair reflects how much of the final product cost is attributable to that input. These coefficients are derived from USDA cost-of-production surveys and FAO food balance sheets.',
  },
  {
    num: '03',
    title: 'FX and import adjustment',
    body: 'For import-dependent countries, currency depreciation amplifies the local-currency cost of dollar-denominated commodities. The FX adjustment multiplies the commodity price change by the degree of depreciation. Countries that are net exporters of a commodity receive a dampened or zero adjustment for that factor.',
  },
  {
    num: '04',
    title: 'Lag profiles',
    body: 'Price shocks do not hit consumers instantly. The model supports four lag profiles: Immediate (fuel, forex-sensitive goods), 3-month (perishables, short supply chains), 6-month (processed foods, regional supply chains), and 12-month (staples with strategic reserves, long-term contracts). Each profile weights the factor change over the appropriate time horizon.',
  },
  {
    num: '05',
    title: 'Country-level resolution',
    body: 'The model operates at the country level, not the city or province level. Within-country variation (urban vs rural, coastal vs inland) can be significant but is not captured. We chose country-level resolution because the macro inputs (exchange rates, import dependency ratios, commodity prices) are most reliably available at that granularity.',
  },
  {
    num: '06',
    title: 'Known limitations',
    body: 'The model does not account for government price controls, subsidy programs, speculative hoarding, supply chain disruptions beyond commodity costs, or local market competition dynamics. It underestimates impacts in countries with structural currency crises (e.g., T\u00fcrkiye, Nigeria) where parallel exchange rates diverge from official rates.',
  },
]

export default function MethodologyPage() {
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
            <span className="text-white/70">Methodology</span>
          </nav>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-[1.2] mb-4 tracking-tight font-serif">
            How the model works
          </h1>
          <p className="text-[1.05rem] text-white/65 max-w-[600px] leading-relaxed font-serif">
            Full transparency on every assumption, coefficient, and limitation.
            If you can see the wiring, you can judge the output.
          </p>
        </div>
      </section>

      <div className="container-page py-14">
        {/* Formula box */}
        <section className="mb-14">
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-3">
            Core formula
          </h2>
          <div className="bg-[#1a1a1a] rounded-[10px] p-6 md:p-8 overflow-x-auto">
            <pre className="font-mono text-[0.82rem] md:text-[0.9rem] text-white/85 leading-relaxed whitespace-pre-wrap break-words">
{`EstimatedImpactCeiling =
  PassThrough
  × Σ( FactorChange[i]
       × ExposureCoefficient[cat, factor]
       × FXImportAdjustment[country, factor]
       × LagAdjustment[profile] )`}
            </pre>
          </div>
          <p className="font-sans text-[0.82rem] text-ink-soft mt-4 leading-relaxed max-w-[700px]">
            Where <strong>PassThrough = 1.0</strong> (100% ceiling),{' '}
            <strong>FactorChange</strong> is the observed or assumed percentage
            change in an upstream commodity or macro factor,{' '}
            <strong>ExposureCoefficient</strong> maps each consumer category to
            its upstream drivers, <strong>FXImportAdjustment</strong> amplifies
            for currency depreciation and import dependency, and{' '}
            <strong>LagAdjustment</strong> weights the shock over the appropriate
            time horizon.
          </p>
        </section>

        {/* Method cards grid */}
        <section className="mb-14">
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-6">
            Model components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {METHOD_CARDS.map((card) => (
              <article
                key={card.num}
                className="bg-bg-card border border-border rounded-[10px] p-6 shadow-card"
              >
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-sans text-[0.7rem] font-bold text-accent-warm bg-accent-light px-2 py-0.5 rounded">
                    {card.num}
                  </span>
                  <h3 className="font-sans text-[0.95rem] font-bold text-ink">
                    {card.title}
                  </h3>
                </div>
                <p className="font-sans text-[0.84rem] text-ink-soft leading-relaxed">
                  {card.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Warning callout */}
        <section className="bg-amber-light border border-[#e8c97a] rounded-[10px] p-6 grid grid-cols-[auto_1fr] gap-4 items-start">
          <span className="text-2xl" aria-hidden="true">
            &#9888;&#65039;
          </span>
          <div>
            <h3 className="font-sans text-[0.9rem] font-bold text-amber mb-1.5">
              This is a scenario tool, not a forecast
            </h3>
            <p className="font-sans text-[0.82rem] text-[#7a4f10] leading-relaxed">
              All figures represent a theoretical ceiling under the stated
              assumptions. They are not predictions of future retail prices.
              Actual consumer impact depends on government policy, market
              competition, supply chain resilience, and retailer pricing
              strategies, none of which are modeled here. Use these estimates
              as a starting point for understanding exposure, not as
              actionable financial guidance.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
