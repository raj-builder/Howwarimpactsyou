import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Validation',
  description:
    'How the howwarimpactsyou.com model compares to realized CPI data: validation table, accuracy metrics, and known failure modes.',
}

interface ValidationRow {
  country: string
  flag: string
  category: string
  modelCeiling: number
  realized: number
  status: 'over' | 'under'
}

const VALIDATION_DATA: ValidationRow[] = [
  { country: 'PHL', flag: '\u{1F1F5}\u{1F1ED}', category: 'Bread', modelCeiling: 18.4, realized: 12.1, status: 'over' },
  { country: 'EGY', flag: '\u{1F1EA}\u{1F1EC}', category: 'Oil', modelCeiling: 52.1, realized: 47.8, status: 'over' },
  { country: 'IND', flag: '\u{1F1EE}\u{1F1F3}', category: 'Veg', modelCeiling: 9.7, realized: 8.1, status: 'over' },
  { country: 'BRA', flag: '\u{1F1E7}\u{1F1F7}', category: 'Fuel', modelCeiling: 11.2, realized: 6.4, status: 'over' },
  { country: 'TUR', flag: '\u{1F1F9}\u{1F1F7}', category: 'Bread', modelCeiling: 24.1, realized: 68.2, status: 'under' },
  { country: 'NGA', flag: '\u{1F1F3}\u{1F1EC}', category: 'Oil', modelCeiling: 38.6, realized: 44.1, status: 'under' },
  { country: 'PAK', flag: '\u{1F1F5}\u{1F1F0}', category: 'Dairy', modelCeiling: 19.3, realized: 31.8, status: 'under' },
]

export default function ValidationPage() {
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
            <span className="text-white/70">Validation</span>
          </nav>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-[1.2] mb-4 tracking-tight font-serif">
            Model validation
          </h1>
          <p className="text-[1.05rem] text-white/65 max-w-[600px] leading-relaxed font-serif">
            Comparing model ceiling estimates against realized CPI data to
            understand where the model performs well and where it falls short.
          </p>
        </div>
      </section>

      <div className="container-page py-14">
        {/* Success callout */}
        <section className="bg-green-light border border-[#b5d9c5] rounded-[10px] p-6 grid grid-cols-[auto_1fr] gap-4 items-start mb-10">
          <span className="text-2xl" aria-hidden="true">&#9989;</span>
          <div>
            <h3 className="font-sans text-[0.9rem] font-bold text-green mb-1.5">
              Model performs well where FX is stable
            </h3>
            <p className="font-sans text-[0.82rem] text-[#1e5a38] leading-relaxed">
              In countries with relatively stable exchange rates and functioning
              commodity markets, the model ceiling consistently exceeds realized
              prices by 20-50%, which is the expected behavior for a 100%
              pass-through upper bound. The model correctly identifies the
              direction and approximate magnitude of consumer price impacts.
            </p>
          </div>
        </section>

        {/* Validation table */}
        <section className="mb-14">
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-4">
            Validation data
          </h2>
          <div className="bg-bg-card border border-border rounded-[10px] shadow-card overflow-x-auto">
            <table className="w-full border-collapse font-sans text-[0.84rem]">
              <thead>
                <tr className="border-b border-border bg-bg-alt">
                  <th className="text-left px-5 py-3 font-semibold text-ink-muted text-[0.75rem] tracking-wide uppercase">
                    Country
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-ink-muted text-[0.75rem] tracking-wide uppercase">
                    Category
                  </th>
                  <th className="text-right px-5 py-3 font-semibold text-ink-muted text-[0.75rem] tracking-wide uppercase">
                    Model Ceiling
                  </th>
                  <th className="text-right px-5 py-3 font-semibold text-ink-muted text-[0.75rem] tracking-wide uppercase">
                    Realized
                  </th>
                  <th className="text-right px-5 py-3 font-semibold text-ink-muted text-[0.75rem] tracking-wide uppercase">
                    Gap
                  </th>
                  <th className="text-center px-5 py-3 font-semibold text-ink-muted text-[0.75rem] tracking-wide uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {VALIDATION_DATA.map((row) => {
                  const gap = row.modelCeiling - row.realized
                  const gapStr =
                    gap >= 0
                      ? `+${gap.toFixed(1)}pp`
                      : `${gap.toFixed(1)}pp`
                  return (
                    <tr
                      key={`${row.country}-${row.category}`}
                      className="border-b border-border last:border-b-0 hover:bg-bg-alt/50 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-ink font-medium">
                        <span className="mr-2">{row.flag}</span>
                        {row.country}
                      </td>
                      <td className="px-5 py-3.5 text-ink-soft">
                        {row.category}
                      </td>
                      <td className="px-5 py-3.5 text-right text-ink font-medium tabular-nums">
                        {row.modelCeiling.toFixed(1)}%
                      </td>
                      <td className="px-5 py-3.5 text-right text-ink font-medium tabular-nums">
                        {row.realized.toFixed(1)}%
                      </td>
                      <td
                        className={`px-5 py-3.5 text-right font-medium tabular-nums ${
                          row.status === 'over' ? 'text-green' : 'text-accent'
                        }`}
                      >
                        {gapStr}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-block font-sans text-[0.7rem] font-semibold px-2.5 py-0.5 rounded tracking-[0.04em] uppercase ${
                            row.status === 'over'
                              ? 'bg-green-light text-green'
                              : 'bg-accent-light text-accent'
                          }`}
                        >
                          {row.status === 'over'
                            ? 'Ceiling held'
                            : 'Undershot'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="font-sans text-[0.78rem] text-ink-muted mt-3 leading-relaxed">
            &ldquo;Ceiling held&rdquo; means the model ceiling exceeded the
            realized price change, as expected. &ldquo;Undershot&rdquo; means
            the realized price change exceeded the model ceiling, indicating the
            model failed to capture all cost drivers.
          </p>
          <p className="font-sans text-[0.72rem] text-ink-muted mt-2 leading-relaxed bg-bg-alt border border-border rounded-lg px-3 py-2">
            <strong className="text-ink">Validation context:</strong> Model
            ceilings shown above are computed at 100% pass-through with
            immediate lag (1.0x multiplier). In the simulator, selecting a
            different lag period (e.g., 12-month at 0.75x) will reduce the
            ceiling proportionally.
          </p>
        </section>

        {/* Known failure modes */}
        <section className="bg-amber-light border border-[#e8c97a] rounded-[10px] p-6 grid grid-cols-[auto_1fr] gap-4 items-start">
          <span className="text-2xl" aria-hidden="true">
            &#9888;&#65039;
          </span>
          <div>
            <h3 className="font-sans text-[0.9rem] font-bold text-amber mb-1.5">
              Known failure modes
            </h3>
            <p className="font-sans text-[0.82rem] text-[#7a4f10] leading-relaxed mb-3">
              The model systematically underestimates impacts in three countries
              due to structural issues not captured by the commodity-pass-through
              framework:
            </p>
            <ul className="font-sans text-[0.82rem] text-[#7a4f10] leading-relaxed list-none space-y-2">
              <li>
                <strong>T&uuml;rkiye:</strong> Parallel exchange rates and
                persistent monetary policy divergence cause realized inflation to
                far exceed commodity-driven estimates. The official rate
                understates true import costs.
              </li>
              <li>
                <strong>Nigeria:</strong> Multiple exchange rate windows and a
                large informal market mean the model&apos;s FX adjustment based on
                the official rate misses the true cost of dollar-denominated
                imports.
              </li>
              <li>
                <strong>Pakistan:</strong> Circular debt in the energy sector,
                subsidy removal shocks, and administrative price adjustments
                create price dynamics that are not well-modeled by upstream
                commodity costs alone.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  )
}
