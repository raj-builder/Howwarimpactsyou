# howwarimpactsyou.com

**Macro-to-Consumer Price Impact Simulator + Flight Fuel Risk Checker**

Live at: [howwarimpactsyou.com](https://howwarimpactsyou.com)

Translates upstream commodity and currency shocks (oil, war, grain prices, FX) into estimated downstream consumer price impacts — transparently, with every assumption visible. Now includes a Flight Fuel Alert tool that models how the Strait of Hormuz crisis affects aviation fuel, flight routes, and airline operations across 26 countries.

---

## What Changed in v3.0 (2026-04-06) — Flight Fuel Alert

### New feature: `/flight-alerts`

A complete flight fuel risk assessment tool built from scratch:

- **Route Risk Checker** — select origin, destination, and optional layover country. See combined fuel risk scores with 50/30/20 weighting (origin/layover/destination), or 70/30 without layover.
- **Time horizon** — project risk forward 0-6 months as reserves deplete under ongoing disruption.
- **Ceasefire scenario** — toggle between ongoing crisis and ceasefire with normalcy slider (0-100%).
- **Return trip risk** — assumes 7-day trip; return scores are different because fuel is loaded at the destination and reserves have depleted during the stay.
- **Stranding risk** — assesses whether destination country reserves can support return fueling.
- **26 country fuel profiles** — vulnerability scoring from 4 factors: reserve days (35 pts), import dependency (25 pts), Hormuz exposure (25 pts), refining capacity (15 pts).
- **20 airline impact summaries** — from disrupted (Emirates, Air NZ) to unaffected (Delta, Lufthansa).
- **10 verified flight routes** — with pre/post prices, status, and source URLs.
- **30-day news digest** — GDELT news aggregation + EIA fuel prices (12h ISR cache).
- **128 unit tests** — covering all calculation functions, real country profiles, edge cases.

### Data sources (new)

| Source | Data | Licence |
|--------|------|---------|
| U.S. Energy Information Administration (EIA) | Oil consumption (164 countries), Brent + jet fuel prices | Public domain (US Gov) |
| International Energy Agency (IEA) | Import dependency, country energy reviews | Cited per country |
| JOGMEC | Japanese strategic reserve data | Public reports |
| BP Statistical Review | Refining capacity by country | Annual publication |
| Zero Carbon Analytics | Hormuz exposure indices | Research reports |
| GDELT Project | 30-day fuel crisis news aggregation | Public domain |
| IATA / airline press offices | Flight route data, surcharge announcements | Press releases |
| SafeFly (safefly.aero) | Aviation impact summaries | Cited per entry |

### Other v3.0 changes

- **65 → 68 countries** — added Canada, Ireland, Norway to country database
- **Hormuz 2026 scenario** — default war with 8 belligerent country rankings
- **Navigation** — Flight Fuel Alert added as primary nav link
- **EIA API integration** — oil consumption data for 164 countries pulled via `api.eia.gov/v2/international`
- **SerpAPI server-side cache** — 48h TTL file cache, limits to ~9 calls per billing cycle

### Design choices

**Next.js 16 App Router** was chosen because:
- Native Vercel deployment (the existing host) — zero config change
- Server Components for static pages (methodology, validation, about) — no JS shipped for pages that don't need interactivity
- `generateStaticParams` for the 50 scenario pages — built at deploy, served from CDN
- `ImageResponse` API for OG image generation — no external service needed
- Route Handlers replace the existing Vercel serverless functions with the same API surface

**Tailwind CSS v4** replaced the 1,114 lines of inline CSS. Every CSS custom property from the original `:root` block was mapped to Tailwind theme tokens (`--color-accent: #c84b31`, `--color-ink: #1a1a1a`, etc.). The visual identity is preserved; the implementation is maintainable.

**TypeScript** was added because the original codebase had three large inline data objects (`WAR_DATA`, `CURRENCY_DATA`, `COUNTRY_REASONS`) with no type safety. A typo in a country name or a missing ranking entry would silently produce wrong output. The typed data modules catch these at build time.

**Data extraction** moved the hardcoded war/currency/country data from inline `<script>` blocks into importable TypeScript modules under `src/data/`. This means the same data powers the simulator, the scenario landing pages, the public API, the OG images, and the markdown text endpoints — one source of truth instead of copy-paste.

### What the 20 tickets delivered

| # | Ticket | What it does | Why it matters |
|---|--------|-------------|----------------|
| FR-001 | Dedicated routes | 20+ server-rendered pages with unique title/meta/canonical | Each page is independently indexable. Google sees 81 URLs instead of 1. |
| FR-002 | Soft gate | Email collection after 5 explorations, on save/share actions | Users see value before being asked for anything. The old 2-view hard gate was suppressing activation. |
| FR-003 | Freshness bar | Model version, data timestamp, cache age on every scenario | Users can see exactly how current the data is. Trust signal for a data tool. |
| FR-004 | Mobile-first simulator | Responsive layout, URL state sync, country grouped by coverage | The old dense desktop layout was unusable on mobile. Touch targets are now 44px+. |
| FR-005 | Remove "Design Preview" | Replaced with "v1.0 Beta" language | "Design Preview" on a public site signals the tool isn't trustworthy. |
| FR-006 | Trust pages | /about, /changelog, /contact | Users and journalists need to know who built this and how to reach them. |
| FR-007 | Unified coverage status | Single `countries.ts` source, shared `CoverageBadge` component | The simulator and data sources page were showing inconsistent coverage labels. |
| FR-008 | 50 scenario pages | /impact/[war]/[category] with SSG | Long-tail SEO. "how ukraine war affects bread prices" now has a dedicated landing page. |
| FR-009 | Realistic range view | Shows ceiling + typical 55-75% realized range | Ceiling-only numbers were being misread as predictions. The range makes the uncertainty visible. |
| FR-010 | Onboarding presets | 3 clickable presets at top of simulator | First-time visitors don't have to figure out the controls. One click to a complete scenario. |
| FR-011 | Shareable deep links + OG | Copy link, Web Share API, OG image per scenario | Every scenario state has a stable URL. Sharing on social media shows a branded card. |
| FR-012 | Learning hub | 5 articles at /learn/[slug] | Top-of-funnel educational content targeting "what is pass-through" type queries. |
| FR-013 | Dataset downloads + API | /api/data/wars, /api/data/rankings, /api/data/countries | Data value was locked in the UI. Researchers and developers can now access it programmatically. |
| FR-014 | Compare mode | /compare with sortable side-by-side table | Desktop users wanted to compare scenarios. "How does Ukraine war bread impact differ from COVID?" |
| FR-015 | Saved scenarios | localStorage bookmarks at /saved | Session-based UX meant every visit started from scratch. |
| FR-016 | AI-friendly views | /llms.txt, /impact/[war]/[category]/text markdown | LLMs and agents work better with structured text than with complex HTML. |
| FR-017 | Embeddable widgets | /embed/impact-card, /embed/basket, embed.js | Publishers can embed a scenario card without building anything. |
| FR-018 | i18n foundation | en/ar/tl message files, config | The subject matter is global. Arabic and Tagalog cover Egypt/Morocco and Philippines — the most-impacted countries. |
| FR-019 | Press kit | /press with citation format, key stats | Journalists need copy-paste-ready summaries and a way to cite the data. |
| FR-020 | Analytics framework | Event tracking for all major interactions | Without measurement, there's no way to know if any of this is working. |

---

## Architecture

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home
│   ├── simulator/page.tsx        # Simulator (client interactive)
│   ├── basket/page.tsx           # Basket view
│   ├── methodology/page.tsx      # Methodology (static)
│   ├── validation/page.tsx       # Validation (static)
│   ├── data-sources/page.tsx     # Data sources + coverage map
│   ├── about/page.tsx            # About + editorial standards
│   ├── changelog/page.tsx        # Version history
│   ├── contact/page.tsx          # Contact
│   ├── compare/page.tsx          # Side-by-side compare
│   ├── saved/page.tsx            # Saved scenarios
│   ├── data/page.tsx             # Dataset downloads
│   ├── learn/page.tsx            # Learning hub index
│   ├── learn/[slug]/page.tsx     # Individual articles (5)
│   ├── press/page.tsx            # Press kit
│   ├── impact/[war]/[category]/
│   │   ├── page.tsx              # Scenario landing pages (50)
│   │   ├── opengraph-image.tsx   # OG image generation
│   │   └── text/route.ts        # Markdown text endpoint
│   ├── embed/
│   │   ├── layout.tsx            # Minimal embed layout (no nav/footer)
│   │   ├── impact-card/page.tsx  # Embeddable impact card
│   │   └── basket/page.tsx       # Embeddable basket widget
│   ├── api/
│   │   ├── prices/route.ts       # Live commodity prices
│   │   ├── signup/route.ts       # Email collection → Vercel KV
│   │   ├── signups/route.ts      # Admin signup viewer
│   │   ├── data/wars/route.ts    # Public API: war data
│   │   ├── data/rankings/route.ts # Public API: flattened rankings
│   │   └── data/countries/route.ts # Public API: country list
│   ├── sitemap.ts                # Dynamic sitemap (71 URLs)
│   └── robots.ts                 # robots.txt
├── components/
│   ├── ui/                       # Nav, footer, freshness bar, badges
│   ├── simulator/                # Simulator client, presets, gate, share, save
│   ├── country-simulator/        # Country simulator client
│   ├── flight-alerts/            # Flight fuel alert components
│   │   ├── flight-alerts-client.tsx  # Main page orchestrator
│   │   ├── route-checker.tsx     # Route risk checker (origin/dest/layover/time/scenario)
│   │   ├── fuel-alert-hero.tsx   # Punchy hero with stats + CTA
│   │   ├── country-fuel-card.tsx # Country vulnerability card
│   │   ├── weekly-fuel-digest.tsx # 30-day news + price digest
│   │   ├── alert-badge.tsx       # Critical/High/Moderate/Low badge
│   │   └── vulnerability-bar.tsx # 0-100 score progress bar
│   ├── compare/                  # Compare client
│   └── saved/                    # Saved scenarios client
├── data/                         # Typed data modules
│   ├── wars.ts                   # 6 wars × 10 categories × 65 countries
│   ├── currencies.ts             # FX depreciation per war × country
│   ├── reasons.ts                # Impact explanations per war × country
│   ├── categories.ts             # 10 consumer categories
│   ├── countries.ts              # 68 countries with coverage status + flags
│   ├── fallback-prices.ts        # Commodity price fallbacks
│   ├── fuel-security.ts          # 26 country fuel profiles (EIA, IEA sourced)
│   └── flight-routes.ts          # 10 routes + 20 airlines (hormuz-2026)
├── types/
│   ├── index.ts                  # War, Country, Category, Commodity types
│   ├── scenario.ts               # ScenarioState, ScenarioResult, BasketResult, LagPeriod
│   └── fuel-security.ts          # FuelSecurityResult, RouteRiskResult, FlightRoute, etc.
├── lib/                          # Hooks and utilities
│   ├── calculations.ts           # Price impact calculation engine
│   ├── fuel-calculations.ts      # Fuel vulnerability scoring (9 pure functions)
│   ├── feed-fetchers.ts          # GDELT news + EIA price fetchers
│   ├── use-simulator-state.ts    # URL ↔ state sync hook
│   ├── saved-scenarios.ts        # localStorage save/load (with migration)
│   ├── analytics.ts              # Event tracking wrapper
│   └── __tests__/
│       └── fuel-calculations.test.ts  # 128 unit tests (Vitest)
├── content/articles.ts           # 5 learning hub articles
└── i18n/                         # Localization foundation
    ├── config.ts
    └── messages/{en,ar,tl}.json

legacy/
└── index.html                    # Archived original (preserved, not served)

public/
├── llms.txt                      # AI/LLM site description
└── embed.js                      # Widget loader script
```

### Build output

98 pages total:
- 17 static pages (home, simulator, country-simulator, flight-alerts, how-it-works, feedback, etc.)
- 60 SSG scenario pages (6 wars × 10 categories)
- 5 SSG article pages
- 15 dynamic routes (API endpoints, OG images, embeds, text endpoints)
- sitemap.xml + robots.txt

---

## Data Sources

### Commodity Prices (live)

| Commodity | Source | Ticker | Update Frequency |
|-----------|--------|--------|-----------------|
| Crude Oil | SerpAPI / Google Finance | `CLW00:NYMEX` | Near-realtime (cached 24h) |
| Natural Gas | SerpAPI / Google Finance | `NGW00:NYMEX` | Near-realtime (cached 24h) |
| Gold | SerpAPI / Google Finance | `GCW00:COMEX` | Near-realtime (cached 24h) |
| Copper | SerpAPI / Google Finance | `HGW00:COMEX` | Near-realtime (cached 24h) |
| Aluminium | SerpAPI / Google Finance | `ALIW00:COMEX` | Near-realtime (cached 24h) |
| Urea | World Bank API | `PUREA` | Monthly |

**Fallback:** If all APIs fail, hardcoded approximate London/NYMEX closing prices (Mar 2025 benchmark) are served. The price strip always shows data.

### Conflict Impact Data (static, typed)

All impact data lives in `src/data/` as TypeScript modules:

| Module | Contents | Source |
|--------|----------|--------|
| `wars.ts` | 6 wars × 10 categories × 65 countries (rankings + shocks) | Scenario model coefficients |
| `currencies.ts` | FX depreciation per war × country | IMF IFS, central bank records |
| `reasons.ts` | Plain-English impact explanations | Trade statistics, UN Comtrade |
| `countries.ts` | 68 countries with coverage status | Model coverage assessment |
| `categories.ts` | 10 consumer categories with metadata | CPI basket composition |

### 5 Conflict Scenarios

| ID | Name | Period | Key Shocks |
|----|------|--------|------------|
| `hormuz-2026` | **Strait of Hormuz Crisis** | Feb 2026 – Present | **Brent +54%**, Shipping +150%, Urea +49% |
| `ukraine-russia` | Russia–Ukraine War | Feb 2022 – Present | Wheat +38%, Gas +220%, Fertilizer +65% |
| `iran-israel-us` | Iran–Israel–US Conflict | Apr 2024 – Present | Brent +18%, Shipping +45% |
| `gaza-2023` | Gaza War / Red Sea Crisis | Oct 2023 – Present | Shipping +340%, Brent +12% |
| `covid` | COVID-19 Supply Shock | Jan 2020 – Dec 2021 | Oil –40% then +90%, Grains +25% |
| `gulf-2003` | Iraq War / Gulf Oil Shock | Mar 2003 – Dec 2004 | Brent +45%, Metals +28% |

### Public API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/prices` | GET | Live commodity prices (6 commodities) |
| `/api/data/wars` | GET | All war impact data (JSON, CC BY 4.0) |
| `/api/data/rankings` | GET | Flattened impact rankings |
| `/api/data/countries` | GET | Country list with coverage status |
| `/impact/{war}/{category}/text` | GET | Plain text scenario summary (markdown) |
| `/api/fuel-digest` | GET | 30-day fuel news (GDELT) + prices (EIA), 12h ISR cache |
| `/api/feedback` | POST | User feedback submission → Vercel KV |

---

## Impact Model (v1.0)

```
EstimatedImpactCeiling =
  PassThrough × Σ(
    FactorChange[i] ×
    ExposureCoefficient[category, factor] ×
    FXImportAdjustment[country, factor] ×
    LagAdjustment[profile]
  )
```

**Parameters:**
- **PassThrough:** 100% (ceiling, default), 75%, 50%, 25%
- **LagAdjustment:** Immediate (1.0), 3 months (0.95), 6 months (0.88), 12 months (0.75)
- **Factors:** Energy, Grains, Fertilizers, FX, Metals

**This is a scenario ceiling, not a forecast.** The 100% pass-through assumption is an upper bound. Historically, realized inflation has been 55–75% of the model ceiling, which is now shown alongside the ceiling in the realistic range view.

---

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# Visit http://localhost:3000

# Production build
npm run build
npm start

# API functions work locally via Next.js dev server
# Set SERP_API_KEY in .env.local for live prices
```

---

## Deploying

1. Push to `main` branch on GitHub
2. Vercel auto-deploys (connected via GitHub integration)
3. Environment variables must be set in Vercel dashboard (not in repo)
4. Domain: `howwarimpactsyou.com` (configured in Vercel project settings)

**Environment Variables (Vercel dashboard):**

| Variable | Description |
|----------|-------------|
| `SERP_API_KEY` | SerpAPI key (250 calls/month) |
| `KV_REST_API_URL` | Vercel KV URL (email signups) |
| `KV_REST_API_TOKEN` | Vercel KV token |
| `ADMIN_SECRET` | Password for /api/signups endpoint |
| `EIA_API_KEY` | EIA Open Data API key (free, for fuel prices + consumption) |

---

## Known Limitations

- **Static impact data:** Rankings are pre-computed scenario estimates, not dynamically calculated from live commodity prices
- **Currency data is historical:** FX rates are from the conflict window, not current
- **Urea lag:** World Bank data is 4–6 weeks behind spot prices
- **Model structural failures:** Systematically underestimates in currency-crisis countries (NGN, PKR, TRY) where parallel FX rates diverge from official rates
- **No city-level granularity:** National-level only
- **No policy interventions modeled:** Subsidies, price controls, export bans are not captured
- **i18n is foundation only:** Arabic and Tagalog message files exist but are not yet wired into the routing layer

---

## Changelog

### 2026-04-06 — v3.0 (Flight Fuel Alert)

Full flight fuel risk assessment feature — see "What Changed in v3.0" above for details.

- `/flight-alerts` page with route risk checker, 26 country profiles, 20 airlines, 10 routes
- Route checker: origin/destination/layover, 0-6 month time horizon, ceasefire + normalcy slider, return trip with 7-day stay assumption, stranding risk
- Combined risk formula: origin 50% + layover 30% + destination 20% (or 70/30 without layover)
- 128 unit tests (was 37), including 16 QA stress tests for real country profiles
- EIA API integration for oil consumption data (164 countries)
- SerpAPI server-side file cache (48h TTL)
- GDELT 30-day news digest with EIA fuel prices

### 2026-04-05 — v2.7 (Belligerent rankings, UI restructure)

- Deep-researched consumer price impact rankings for 8 belligerent countries (USA, Iran, Israel, Saudi Arabia, UAE, Kuwait, Qatar, Bahrain) across all 10 categories
- Replaced "Gains/Costs" labels with actual basket impact % + insight text
- Renamed Simulator → Regional Impact, Country Simulator → Country Impact
- Merged Methodology + Data Sources + Learn into `/how-it-works`
- New `/feedback` page with form → Vercel KV
- Simulator shows 4 category-specific impact cards
- Homepage "Most impacted by Hormuz" top-5 section
- Footer cleanup, version bump to v2.0 → v2.7
- FX dates updated to Apr 2026
- 65 countries total (was 57)

### 2026-04-04 — v2.6 (Flight Fuel Alert prototype + EIA data)

- Built prototype `/flight-alerts` page (local only, not deployed)
- 14-country fuel vulnerability scoring (4-factor: reserves 35pts, import dependency 25pts, Hormuz exposure 25pts, refining capacity 15pts)
- 10 flight route impact cards with source article URLs
- 8 airline impact summaries
- Weekly news digest via GDELT + EIA APIs (12h cache)
- SerpAPI server-side file cache with 48h TTL
- EIA bulk data pull for 164 countries — oil consumption from EIA instead of manual estimates
- Added Australia + New Zealand to countries list
- 38 new unit tests (98 total at the time)

### 2026-03-30 — v2.5 (55 countries, Hormuz scenario, OG fix, regional rankings)

- Expanded countries from 24 to 55 (all with Hormuz basket rankings)
- Added `hormuz-2026` war scenario: Brent $70→$107.81 (+54%), shipping +150%, urea +49%
- OG image fixed: moved from file-convention to `/api/og` API route for proper searchParams
- Rankings redesigned: "Most Impacted (top 5)" + "Impact by Region" (7 collapsible groups)
- Wikipedia source URLs added to all 6 war cards
- Learn articles rewritten with citations from IMF, World Bank, ECB, FAO, EIA, Dallas Fed
- Updated FX rates and fallback commodity prices to Mar 2026

### 2026-03-29 — v2.4 (Mobile nav, a11y, homepage, UI polish)

- Full UI audit (P0-P3) applied across all pages
- Mobile hamburger drawer navigation
- Toggle accessibility (role=switch, 44x24px touch targets)
- Homepage hero card hierarchy redesigned
- Collapsible sidebar sections, timeline visual, footer semantic nav

### 2026-03-28 — v2.3 (Simulator declutter, Country Simulator)

- Simplified simulator from 2-column 19-section to single-column dashboard
- Country Simulator at `/country-simulator` with detail panel
- Default conflict changed to Iran-Israel-US
- "So What" summary card, methodology merged

### 2026-03-27 — v2.2 (Pre-escalation anchors, user refinements, i18n, surface fixes)

- **Pre-escalation price anchors:** Researched Before/After commodity prices for all 5 wars (Brent, NatGas, Wheat, Copper, Gold, consumer goods). New WarEscalationCard replaces old war selector buttons
- **User data refinement panel:** 3-tab panel (Commodity Prices, Category Impacts, FX Rates) with localStorage persistence, "Add New Country" flow, export/clear. User overrides flow through `computeScenario`/`computeBasket` with "User data" badge
- **i18n infrastructure:** Zero-dependency `useT()` hook, ~200 translation keys in `en.json`/`ar.json`/`tl.json`. 19 components + homepage wired to translation keys
- **Compare page:** Per-scenario pass-through and lag controls, coverage badges per country row, URL-serialized assumptions
- **Saved scenarios page:** Fixed passthrough display bug, added coverage/reliability badges, full simulator links
- **Embed endpoints:** Accept `pt` and `lag` query params, show assumption chips and coverage badges
- **Share toolbar:** Encodes `mv` (modelVersion) and `sd` (snapshotDate) in shared URLs
- **Homepage cards:** Fixed lag params to `immediate` to match displayed ceiling numbers
- **SerpAPI caching:** 3-layer cache (module + sessionStorage + Vercel CDN), max 1 call per 24h
- **Real provenance timestamps:** Data-as-of shows actual SerpAPI `fetched_at` date+time
- **Fallback prices:** Updated with post-escalation reference values and provenance notes
- **Gitignore:** MEMORY.md, CLAUDE.md, COS-Report files excluded from public repo

### 2026-03-26 — v2.1 (Scenario Builder Refactoring)

Centralized all calculation logic, fixed numerical inconsistencies, and made every result auditable and reproducible. Addresses 14 scenario builder tickets (SB-001 through SB-014):

- **Centralized calculation engine:** Created `src/lib/calculations.ts` as single source of truth for all math — no inline calculations in components
- **Removed Math.random():** Realized estimate is now deterministic (0.65 × ceiling) instead of random 0.55–0.75
- **Lag multipliers applied:** Lag (Immediate 1.0, 3m 0.95, 6m 0.88, 12m 0.75) now actually affects all computed values
- **Fixed basket math:** Basket page now computes dynamically from rankings data via `computeBasket()`, connected to URL scenario state
- **Dual basket metrics:** Shows both weighted average price impact (%) and CPI basket contribution (pp)
- **Canonical scenario types:** `ScenarioState`, `ScenarioResult`, `BasketResult`, `LagPeriod`, `ProvenanceMetadata`
- **Provenance metadata:** Model version, snapshot date, data-as-of shown in assumption strip
- **Coverage + reliability badges:** Coverage tier and reliability status (validated/indicative/experimental) displayed on all result surfaces
- **Structural miss warnings:** Türkiye, Nigeria, Pakistan show validation warning banners
- **Factor contribution breakdown:** Factors now sum exactly to the lag-adjusted ceiling with rounding residual correction
- **Deterministic share links:** All URL params always serialized (no elision of defaults)
- **Impossible-state guards:** `validateScenarioState()` blocks rendering when state is invalid
- **Audit drawer:** Full calculation trace with formula chain, factor decomposition, provenance
- **SaveButton defaults fixed:** passthrough changed from 0.6 to 100, lag from '3-6 months' to '6m'
- **localStorage migration:** Old saved scenarios with decimal passthrough auto-converted
- **Unit tests:** 37 Vitest tests covering calculations, rounding, lag, basket reconciliation, identity round-trip, validation guards
- **Homepage hrefs completed:** Example cards now include lag and passthrough params

### 2026-03-25 — v2.0 (Next.js Migration)

Full architectural migration from vanilla HTML to Next.js 16 App Router. Implements all 20 feature tickets (FR-001 through FR-020):

- Migrated from single `index.html` to 81-page Next.js application
- Added Tailwind CSS v4 with preserved design tokens from original CSS
- Extracted all inline data into typed TypeScript modules
- Added 50 statically generated scenario landing pages with OG images
- Added 5 learning hub articles
- Added public data API (JSON, CC BY 4.0)
- Added compare mode, saved scenarios, share toolbar
- Added soft gate (replaces hard 2-view gate)
- Added realistic range view alongside ceiling estimates
- Added onboarding presets for first-time visitors
- Added trust pages (about, changelog, contact, press)
- Added sitemap.xml, robots.txt, JSON-LD structured data
- Added AI-friendly text endpoints and llms.txt
- Added embeddable widgets with loader script
- Added i18n foundation (en/ar/tl)
- Added analytics event tracking framework

### 2026-03-24 — v1.0 Launch
- Initial prototype with 5 wars, 10 categories, 10 core countries
- SerpAPI integration for live commodity prices
- World Bank integration for Urea
- War-first simulator with country rankings and purchasing power erosion
- Mobile-responsive design (3 breakpoints)
- Simulation gate (email collection after 2 free views)

---

*Scenario estimator only. Not a price forecast, not financial advice. All estimates assume stated pass-through assumptions.*
