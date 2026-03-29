import Link from 'next/link'
import type { Metadata } from 'next'
import { getMessages } from '@/lib/use-t'

export const metadata: Metadata = {
  title: 'Press Kit',
  description:
    'Press kit for howwarimpactsyou.com: site summary, key statistics, methodology overview, citation guidelines, and media contact.',
}

const STATS = [
  { value: '5', label: 'War & shock scenarios' },
  { value: '10', label: 'Consumer categories' },
  { value: '12+', label: 'Countries covered' },
  { value: 'v1.0', label: 'Model version' },
]

export default function PressPage() {
  const m = getMessages()
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a1a] via-[#2d2420] to-[#3a2216] text-white py-16 px-8 md:py-20">
        <div className="max-w-[820px] mx-auto">
          <nav className="font-sans text-[0.75rem] text-white/40 mb-6">
            <Link
              href="/"
              className="text-white/40 no-underline hover:text-white/70 transition-colors"
            >
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/70">Press Kit</span>
          </nav>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-[1.2] mb-4 tracking-tight font-serif">
            {m.press.title}
          </h1>
          <p className="text-[1.05rem] text-white/65 max-w-[600px] leading-relaxed font-serif">
            {m.press.subtitle}
          </p>
        </div>
      </section>

      <div className="container-page py-14">
        {/* Summary */}
        <section className="mb-14">
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-3">
            About the project
          </h2>
          <div className="bg-bg-card border border-border rounded-[10px] p-6 md:p-8 shadow-card max-w-[780px]">
            <p className="font-sans text-[0.88rem] text-ink-soft leading-relaxed">
              howwarimpactsyou.com is a free, open-methodology simulator that
              translates upstream macro shocks &mdash; wars, oil price spikes,
              currency devaluations, and trade disruptions &mdash; into
              estimated consumer price impacts for everyday goods like bread,
              cooking oil, fuel, and dairy across 12+ countries. It is designed
              for journalists, researchers, policymakers, and citizens who want
              to understand how geopolitical events affect the cost of living.
            </p>
          </div>
        </section>

        {/* Key statistics */}
        <section className="mb-14">
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-3">
            Key statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-bg-card border border-border rounded-[10px] p-5 shadow-card text-center"
              >
                <p className="font-serif text-[1.8rem] font-normal text-accent leading-none mb-2">
                  {stat.value}
                </p>
                <p className="font-sans text-[0.78rem] text-ink-soft">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology summary */}
        <section className="mb-14">
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-3">
            Methodology
          </h2>
          <div className="bg-bg-card border border-border rounded-[10px] p-6 md:p-8 shadow-card max-w-[780px]">
            <h3 className="font-serif text-[1.3rem] font-normal text-ink mb-4 leading-tight">
              How the model works
            </h3>
            <p className="font-sans text-[0.88rem] text-ink-soft leading-relaxed mb-4">
              The model estimates consumer price impacts by combining commodity
              exposure coefficients, currency depreciation effects, and
              country-specific import dependency ratios. It applies a scenario
              ceiling of 100% pass-through, meaning estimates represent the
              maximum plausible impact before government subsidies, supply
              substitution, or market adjustments reduce the actual price
              change.
            </p>
            <p className="font-sans text-[0.88rem] text-ink-soft leading-relaxed mb-4">
              Validation is performed against realized CPI data from national
              statistics agencies. Known limitations and failure modes are
              documented transparently.
            </p>
            <Link
              href="/methodology"
              className="font-sans text-[0.85rem] text-accent no-underline hover:underline"
            >
              Read the full methodology &rarr;
            </Link>
          </div>
        </section>

        {/* How to cite */}
        <section className="mb-14">
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-3">
            How to cite
          </h2>
          <div className="bg-bg-card border border-border rounded-[10px] p-6 md:p-8 shadow-card max-w-[780px]">
            <p className="font-sans text-[0.84rem] text-ink-soft leading-relaxed mb-4">
              When referencing data or estimates from this tool, please use the
              following citation format:
            </p>
            <div className="bg-bg-alt border border-border rounded-md p-4">
              <p className="font-mono text-[0.8rem] text-ink leading-relaxed">
                howwarimpactsyou.com. &ldquo;[Scenario Name] &mdash; [Category]
                Impact Estimates.&rdquo; Accessed [Date].
                https://howwarimpactsyou.com/impact/[war]/[category]
              </p>
            </div>
            <p className="font-sans text-[0.78rem] text-ink-muted mt-3">
              Example: howwarimpactsyou.com. &ldquo;Russia&ndash;Ukraine War
              &mdash; Bread &amp; Cereals Impact Estimates.&rdquo; Accessed 25
              Mar 2026. https://howwarimpactsyou.com/impact/ukraine-russia/bread
            </p>
          </div>
        </section>

        {/* Media contact */}
        <section className="mb-14">
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-3">
            Media inquiries
          </h2>
          <div className="bg-bg-card border border-border rounded-[10px] p-6 md:p-8 shadow-card max-w-[780px]">
            <p className="font-sans text-[0.88rem] text-ink-soft leading-relaxed mb-4">
              For press inquiries, interviews, or data requests, please reach
              out via the contact page.
            </p>
            <Link
              href="/contact"
              className="font-sans text-[0.85rem] text-accent no-underline hover:underline"
            >
              Contact us &rarr;
            </Link>
          </div>
        </section>

        {/* Screenshots note */}
        <p className="font-sans text-[0.78rem] text-ink-muted mt-8">
          Screenshots may be captured directly from the live site for editorial use with attribution.
        </p>
      </div>
    </>
  )
}
