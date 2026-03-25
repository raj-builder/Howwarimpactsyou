# howwarimpactsyou.com

**Macro-to-Consumer Price Impact Simulator**

Live at: [howwarimpactsyou.com](https://howwarimpactsyou.com)

Translates upstream commodity and currency shocks (oil, war, grain prices, FX) into estimated downstream consumer price impacts — transparently, with every assumption visible.

---

## What Changed in v2.0

This release is a full architectural migration from a single vanilla HTML file to a Next.js 16 App Router application. The original site was a 2,860-line `index.html` with inline CSS and JavaScript. That approach was fast to ship but couldn't support indexable routes, server-side rendering, OG images, or any of the 20 feature requests that had accumulated.

### Why migrate at all

The original single-file design meant:
- **One URL for everything.** Search engines saw one page. Users couldn't bookmark or share a specific scenario. Every war, country, and category lived behind client-side `showPage()` toggles with no URL representation.
- **No server rendering.** The entire page was JS-dependent. Crawlers that don't execute JavaScript saw nothing.
- **No build step means no optimization.** No tree-shaking, no code splitting, no image optimization, no static generation.
- **Scaling was impossible.** Adding scenario landing pages, a learning hub, a compare mode, or an API meant rewriting the architecture anyway.

The migration preserves every data point, every design token, and every color from the original while enabling everything that was blocked.

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
│   ├── basket/                   # Basket client
│   ├── compare/                  # Compare client
│   └── saved/                    # Saved scenarios client
├── data/                         # Typed data modules (extracted from legacy HTML)
│   ├── wars.ts                   # 5 wars × 10 categories × 10 countries
│   ├── currencies.ts             # FX depreciation per war × country
│   ├── reasons.ts                # Impact explanations per war × country
│   ├── categories.ts             # 10 consumer categories
│   ├── countries.ts              # 20 countries with coverage status
│   └── fallback-prices.ts       # Commodity price fallbacks
├── types/index.ts                # War, Country, Category, Commodity types
├── lib/                          # Hooks and utilities
│   ├── use-simulator-state.ts    # URL ↔ state sync hook
│   ├── saved-scenarios.ts        # localStorage save/load
│   └── analytics.ts              # Event tracking wrapper
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

81 pages total:
- 16 static pages (home, simulator, basket, methodology, etc.)
- 50 SSG scenario pages (5 wars × 10 categories)
- 5 SSG article pages
- 9 dynamic routes (API endpoints, OG images, embeds, text endpoints)
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
| `wars.ts` | 5 wars × 10 categories × 10 countries (rankings + shocks) | Scenario model coefficients |
| `currencies.ts` | FX depreciation per war × country | IMF IFS, central bank records |
| `reasons.ts` | Plain-English impact explanations | Trade statistics, UN Comtrade |
| `countries.ts` | 20 countries with coverage status | Model coverage assessment |
| `categories.ts` | 10 consumer categories with metadata | CPI basket composition |

### 5 Conflict Scenarios

| ID | Name | Period | Key Shocks |
|----|------|--------|------------|
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

### 2025-03-25 — v2.0 (Next.js Migration)

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

### 2025-03-24 — v1.0 Launch
- Initial prototype with 5 wars, 10 categories, 10 core countries
- SerpAPI integration for live commodity prices
- World Bank integration for Urea
- War-first simulator with country rankings and purchasing power erosion
- Mobile-responsive design (3 breakpoints)
- Simulation gate (email collection after 2 free views)

---

*Scenario estimator only. Not a price forecast, not financial advice. All estimates assume stated pass-through assumptions.*
