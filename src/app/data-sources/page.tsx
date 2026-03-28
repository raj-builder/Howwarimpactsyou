import Link from 'next/link'
import type { Metadata } from 'next'
import { COUNTRIES } from '@/data/countries'
import { getMessages } from '@/lib/use-t'

export const metadata: Metadata = {
  title: 'Data Sources',
  description:
    'Data sources powering howwarimpactsyou.com: World Bank, IMF, FAO, EIA, national CPI offices, and UN Comtrade. Coverage status for all supported countries.',
}

const COVERAGE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  full: { bg: 'bg-green-light', text: 'text-green', label: 'Full' },
  partial: { bg: 'bg-amber-light', text: 'text-amber', label: 'Partial' },
  experimental: { bg: 'bg-blue-light', text: 'text-blue', label: 'Experimental' },
}

const DATA_SOURCES = [
  {
    title: 'World Bank',
    type: 'Macro factors',
    typeBg: 'bg-blue-light',
    typeText: 'text-blue',
    description:
      'Global commodity price indices (Pink Sheet), exchange rate data, GDP deflators, and import dependency ratios. Primary source for wheat, rice, maize, soybean, and palm oil price series.',
    cadence: 'Monthly, with a 1-month lag',
  },
  {
    title: 'International Monetary Fund (IMF)',
    type: 'Macro factors',
    typeBg: 'bg-blue-light',
    typeText: 'text-blue',
    description:
      'World Economic Outlook data for GDP growth, inflation baselines, and current account balances. Exchange rate data from the International Financial Statistics (IFS) database.',
    cadence: 'Quarterly, with semi-annual WEO updates',
  },
  {
    title: 'Food and Agriculture Organization (FAO)',
    type: 'Macro factors',
    typeBg: 'bg-blue-light',
    typeText: 'text-blue',
    description:
      'Food balance sheets for country-level production and import dependency. FAOSTAT trade matrices for bilateral commodity flows. Food Price Index for global benchmarking.',
    cadence: 'Annual (balance sheets), monthly (price index)',
  },
  {
    title: 'U.S. Energy Information Administration (EIA)',
    type: 'Macro factors',
    typeBg: 'bg-blue-light',
    typeText: 'text-blue',
    description:
      'Brent crude oil spot prices, natural gas benchmarks, and refined petroleum product prices. Used for fuel, transport, and fertilizer cost estimation.',
    cadence: 'Weekly spot prices, monthly averages',
  },
  {
    title: 'National CPI Offices',
    type: 'Validation',
    typeBg: 'bg-green-light',
    typeText: 'text-green',
    description:
      'Consumer price index data from national statistics agencies (PSA Philippines, CAPMAS Egypt, MOSPI India, IBGE Brazil, NBS Nigeria, PBS Pakistan, BPS Indonesia, TURKSTAT, SSSU Ukraine, HCP Morocco). Used exclusively for validation, not as model inputs.',
    cadence: 'Monthly, with 2-4 week publication lag',
  },
  {
    title: 'UN Comtrade',
    type: 'Validation',
    typeBg: 'bg-green-light',
    typeText: 'text-green',
    description:
      'Bilateral trade data at the HS-6 commodity level for cross-checking import dependency ratios and trade flow assumptions. Used to validate that the model correctly identifies which countries are net importers of specific commodities.',
    cadence: 'Annual, with 6-12 month lag',
  },
]

export default function DataSourcesPage() {
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
            <span className="text-white/70">Data Sources</span>
          </nav>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-[1.2] mb-4 tracking-tight font-serif">
            {m.dataSources.title}
          </h1>
          <p className="text-[1.05rem] text-white/65 max-w-[600px] leading-relaxed font-serif">
            {m.dataSources.subtitle}
          </p>
        </div>
      </section>

      <div className="container-page py-14">
        {/* Coverage grid */}
        <section className="mb-14">
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-2">
            Country coverage
          </h2>
          <p className="font-sans text-[0.88rem] text-ink-soft max-w-[640px] leading-relaxed mb-6">
            Coverage status indicates the completeness of macro factor data,
            exposure coefficients, and validation data for each country.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {COUNTRIES.map((country) => {
              const style = COVERAGE_STYLES[country.coverage]
              return (
                <div
                  key={country.id}
                  className={`${style.bg} border border-border rounded-lg px-4 py-3 flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{country.flag}</span>
                    <span className="font-sans text-[0.84rem] font-medium text-ink">
                      {country.name}
                    </span>
                  </div>
                  <span
                    className={`font-sans text-[0.67rem] font-semibold tracking-[0.04em] uppercase ${style.text}`}
                  >
                    {style.label}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Source cards */}
        <section>
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-6">
            Source details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DATA_SOURCES.map((source) => (
              <article
                key={source.title}
                className="bg-bg-card border border-border rounded-[10px] p-6 shadow-card"
              >
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-sans text-[0.95rem] font-bold text-ink">
                    {source.title}
                  </h3>
                  <span
                    className={`font-sans text-[0.67rem] font-semibold px-2 py-0.5 rounded tracking-[0.04em] uppercase ${source.typeBg} ${source.typeText}`}
                  >
                    {source.type}
                  </span>
                </div>
                <p className="font-sans text-[0.84rem] text-ink-soft leading-relaxed mb-3">
                  {source.description}
                </p>
                <div className="font-sans text-[0.78rem] text-ink-muted">
                  <strong className="text-ink-soft">Update cadence:</strong>{' '}
                  {source.cadence}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
