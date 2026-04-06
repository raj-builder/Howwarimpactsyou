import Link from 'next/link'
import type { Metadata } from 'next'
import { getMessages } from '@/lib/use-t'

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'Version history and release notes for howwarimpactsyou.com. Track every change to the model, data sources, and interface.',
}

const VERSIONS = [
  {
    version: 'v3.0',
    date: 'April 2026',
    title: 'Flight Fuel Alert — full feature launch',
    changes: [
      'New /flight-alerts page: route risk checker with origin, destination, optional layover country',
      'Combined risk formula: origin 50% + layover 30% + dest 20% (or 70/30 without layover)',
      'Time horizon: project risk forward 0-6 months as reserves deplete under ongoing disruption',
      'Ceasefire scenario with normalcy slider (0%, 25%, 50%, 75%, 100%)',
      'Return trip risk: assumes 7-day stay, fuel loaded at destination, reserves depleted by trip duration',
      'Stranding risk assessment by destination country name',
      '26 country fuel profiles from EIA, IEA, JOGMEC, BP data (14 Asia-Pacific + 5 destination + 7 least-impacted)',
      '20 airline impact summaries (8 disrupted + 12 global carriers including no-impact LOW carriers)',
      '10 verified flight routes with pre/post prices, status, and source URLs',
      '30-day GDELT news digest + EIA Brent/jet fuel prices (12h ISR cache)',
      'Country cards show depletion estimate or "Minimal Hormuz dependency" for safe countries',
      'Hero: "Is your flight at risk?" with disrupted routes stat + CTA',
      'Summary bar with CRITICAL/HIGH/MODERATE/LOW counts',
      'Most impacted vs least impacted country sections',
      '128 unit tests including 16 QA stress tests for real country profiles',
      'Added Canada, Ireland, Norway to country database (68 total)',
      'Flight Fuel Alert added to primary navigation',
    ],
  },
  {
    version: 'v2.7',
    date: 'April 2026',
    title: 'Belligerent rankings, UI restructure, feedback',
    changes: [
      'Deep-researched consumer price impact rankings for 8 belligerent countries across all 10 categories',
      'Replaced misleading Gains/Costs labels with actual basket impact % + insight text',
      'Renamed Simulator → Regional Impact, Country Simulator → Country Impact',
      'Merged Methodology + Data Sources + Learn into /how-it-works',
      'New /feedback page with form → Vercel KV',
      'Simulator shows 4 category-specific impact cards (Cereal, Fuel, Oil, Dairy)',
      'Homepage "Most impacted by Hormuz" top-5 section with CTA',
      'FX dates updated to Apr 2026, footer version bump',
      '65 countries total (was 57)',
    ],
  },
  {
    version: 'v2.5',
    date: 'March 2026',
    title: '55 countries, Hormuz scenario, OG fix, regional rankings',
    changes: [
      'Expanded countries from 24 to 55 (all with Hormuz basket rankings)',
      'Added hormuz-2026 war scenario: Brent $70→$107.81 (+54%), shipping +150%, urea +49%',
      'OG image fixed: moved from file-convention to /api/og API route',
      'Rankings redesigned: Most Impacted (top 5) + Impact by Region (7 collapsible groups)',
      'Wikipedia source URLs added to all 6 war cards',
      'Learn articles rewritten with citations from IMF, World Bank, ECB, FAO, EIA, Dallas Fed',
      'Mobile hamburger navigation, toggle accessibility (role=switch, 44px touch targets)',
      'Homepage hero card hierarchy redesigned, collapsible sidebar sections',
    ],
  },
  {
    version: 'v2.2',
    date: 'March 2026',
    title: 'Pre-escalation anchors, user refinements, i18n, surface fixes',
    changes: [
      'Pre-escalation price anchors: researched Before/After commodity prices for all 5 wars with war-escalation cards replacing the old war selector',
      'User data refinement panel: 3-tab panel (Commodity Prices, Category Impacts, FX Rates) with localStorage persistence and Add New Country flow',
      'User-supplied impact overrides flow through computeScenario/computeBasket with "User data" badge',
      'i18n infrastructure: zero-dependency useT() hook with ~200 translation keys in en.json, ar.json, tl.json',
      'All interactive components + homepage wired to translation keys (19 components)',
      'Compare page: per-scenario pass-through and lag controls, coverage badges per country row',
      'Saved scenarios page: fixed passthrough display, added coverage/reliability badges, full simulator links',
      'Embed endpoints: accept pt and lag query params, show assumption chips and coverage badges',
      'Share toolbar: encodes model version and snapshot date in shared URLs',
      'Homepage example cards: fixed lag params to match displayed ceiling numbers',
      'SerpAPI 3-layer caching: module cache + sessionStorage + Vercel CDN (max 1 call per 24h)',
      'Real SerpAPI fetched_at timestamp for provenance data-as-of display',
      'Fallback prices updated with post-escalation reference values and provenance notes',
      'MEMORY.md, CLAUDE.md, COS-Report files gitignored from public repo',
    ],
  },
  {
    version: 'v2.1',
    date: 'March 2026',
    title: 'Scenario Builder Refactoring',
    changes: [
      'Centralized all calculation logic into a shared engine \u2014 no more inline math in components',
      'Removed Math.random() from realized estimates \u2014 all results are now deterministic and reproducible',
      'Lag multipliers (1.0, 0.95, 0.88, 0.75) now actually applied to all calculations',
      'Basket page connected to URL scenario state \u2014 no more hardcoded Philippines/Russia-Ukraine data',
      'Two distinct basket metrics: weighted average price impact (%) and CPI basket contribution (pp)',
      'Coverage and reliability badges shown on all result surfaces',
      'Structural miss warnings for T\u00fcrkiye, Nigeria, and Pakistan with link to validation page',
      'Factor contribution breakdown that sums exactly to the lag-adjusted ceiling',
      'Provenance metadata (model version, snapshot date, data-as-of) in assumption strip',
      'Full audit trace drawer with formula chain, factor decomposition, and provenance',
      'Deterministic share links \u2014 all URL params always serialized',
      'Impossible-state guards block rendering when inputs are invalid',
      'Fixed SaveButton defaults (passthrough 0.6 \u2192 100, lag "3-6 months" \u2192 "6m")',
      'Added 37 unit tests covering all calculation logic (Vitest)',
    ],
  },
  {
    version: 'v1.0',
    date: 'March 2026',
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
            <span className="text-white/70">Changelog</span>
          </nav>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-[1.2] mb-4 tracking-tight font-serif">
            {m.changelog.title}
          </h1>
          <p className="text-[1.05rem] text-white/65 max-w-[600px] leading-relaxed font-serif">
            {m.changelog.subtitle}
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
