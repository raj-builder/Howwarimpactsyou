# howwarimpactsyou.com

**Macro-to-Consumer Price Impact Simulator**

Live at: [howwarimpactsyou.com](https://howwarimpactsyou.com)

Translates upstream commodity and currency shocks (oil, war, grain prices, FX) into estimated downstream consumer price impacts — transparently, with every assumption visible.

---

## Architecture

```
index.html              ← Entire frontend (single file, inline CSS + JS, no build step)
api/
  prices.js             ← Vercel serverless function (commodity price proxy)
vercel.json             ← Vercel deployment config (functions, rewrites)
cron/
  fetch_prices.js       ← Legacy daily price fetcher (Node 18+, not currently active)
  prices_cache.json     ← Cached prices from cron
  prices_log.jsonl      ← Historical price log
```

### Single-file frontend

The entire app is a single HTML file with inline `<style>` and `<script>` blocks. No framework, no build step, no dependencies except Chart.js (loaded via CDN). This is intentional — it keeps deployment trivial and the codebase easy to audit.

### Pages (SPA routing)

| Page | Description |
|------|-------------|
| **Home** | Hero, example impact cards (4 scenarios), mission strip |
| **Simulator** | War-first navigation, country rankings, purchasing power erosion, detail drilldown |
| **Basket View** | Multi-category household basket impact calculator |
| **Methodology** | Formula (v1.0), 6 methodology cards, assumptions |
| **Validation** | Model ceiling vs realized inflation comparison |
| **Data Sources** | Coverage map, source cards for each data provider |

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

**API budget:** SerpAPI allows 250 calls/month. Strategy: 4 calls per cache miss (1 markets + 3 individual quotes), cached 24h at Vercel edge = ~120 calls/month.

### Conflict Impact Data (static)

| Data | Source | Storage |
|------|--------|---------|
| War commodity shocks | Historical price data (World Bank, IMF) | `WAR_DATA` JS object |
| Country rankings (top5/bottom5) | Scenario model coefficients | `WAR_DATA.rankings` per war × category |
| Currency depreciation | IMF IFS, central bank records | `CURRENCY_DATA` JS object |
| Impact reasons | Trade statistics (UN Comtrade, national stats) | `COUNTRY_REASONS` JS object |
| Validation data | National CPI series (PSA, CAPMAS, MoSPI, IBGE, etc.) | HTML table |

### 5 Conflict Scenarios

| ID | Name | Period | Key Shocks |
|----|------|--------|------------|
| `ukraine-russia` | Russia–Ukraine War | Feb 2022 – Present | Wheat +38%, Gas +220%, Fertilizer +65% |
| `iran-israel-us` | Iran–Israel–US Conflict | Apr 2024 – Present | Brent +18%, Shipping +45% |
| `gaza-2023` | Gaza War / Red Sea Crisis | Oct 2023 – Present | Shipping +340%, Brent +12% |
| `covid` | COVID-19 Supply Shock | Jan 2020 – Dec 2021 | Oil –40% then +90%, Grains +25% |
| `gulf-2003` | Iraq War / Gulf Oil Shock | Mar 2003 – Dec 2004 | Brent +45%, Metals +28% |

### 10 Consumer Categories

Bread & Cereals, Milk & Dairy, Eggs, Rice, Cooking Oil, Vegetables, Meat & Chicken, Detergent, Household Fuel, Household Basics Basket

### 10 Core Countries (full/partial coverage)

Philippines, Egypt, India, Brazil, Nigeria, Pakistan, Indonesia, Türkiye, Ukraine, Morocco

Plus 20 additional countries in the comparison dropdown (limited data).

---

## Serverless Function: `/api/prices`

**File:** `api/prices.js`

**Flow:**
1. Try SerpAPI `google_finance_markets` endpoint → extracts Gold + Crude Oil from `markets.futures` array
2. Try SerpAPI `google_finance` for Natural Gas (`NGW00:NYMEX`), Copper (`HGW00:COMEX`), Aluminium (`ALIW00:COMEX`) — 3 calls in parallel
3. Try World Bank API for Urea (`PUREA` indicator)
4. For any failed commodity → serve hardcoded fallback price
5. Return unified JSON with all 6 commodities (always populated)

**Caching:** `s-maxage=86400, stale-while-revalidate=7200` (24h fresh, 2h stale)

**Environment Variables (Vercel dashboard):**

| Variable | Description |
|----------|-------------|
| `SERP_API_KEY` | SerpAPI key (250 calls/month) |
| `OIL_PRICE_API_KEY` | OilPriceAPI key (legacy, not currently used) |

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

**This is a scenario ceiling, not a forecast.** The 100% pass-through assumption is an upper bound that rarely occurs in practice.

---

## Simulator UI Flow

```
User selects:
  1. Conflict (left panel, 5 wars)
  2. Consumer category (dropdown, 10 options)
  3. Country to compare (right panel dropdown, 30 countries)
  4. Pass-through rate (chips, single-select)
  5. Lag horizon (chips, single-select)

Right panel shows:
  → War overview card (commodity shock pills)
  → Purchasing power erosion (historical FX depreciation for selected country)
  → Top 5 most impacted countries (with reason text)
  → Selected country pinned row (if not in top/bottom 5)
  → Country detail drilldown (big numbers + waterfall on click)
  → Top 5 least impacted countries (with reason text)
```

---

## Running Locally

```bash
# Just open in browser — no server needed for the frontend
open index.html

# To test the API function locally, use Vercel CLI
npm i -g vercel
vercel dev
# Then visit http://localhost:3000/api/prices
```

---

## Deploying

1. Push to `main` branch on GitHub
2. Vercel auto-deploys (connected via GitHub integration)
3. Environment variables must be set in Vercel dashboard (not in repo)
4. Domain: `howwarimpactsyou.com` (configured in Vercel project settings)

---

## Known Limitations (v1)

- **Static impact data:** Rankings and impact percentages are hardcoded scenario estimates, not dynamically calculated from live commodity prices
- **Currency data is historical:** Purchasing power erosion shows FX rates during the conflict window, not current rates
- **Urea lag:** World Bank data is 4–6 weeks behind spot prices
- **Model structural failures:** Systematically underestimates in currency-crisis countries (NGN, PKR, TRY) where parallel FX rates diverge from official rates
- **No city-level granularity:** National-level only; local pricing depends on competition, logistics, and regulation
- **No policy interventions modeled:** Subsidies, price controls, export bans are not captured

---

## Improvement Roadmap

### v1.1 (Near-term)
- [ ] Dynamic impact calculation from live commodity prices instead of static data
- [ ] Live FX rates via SerpAPI currency pairs
- [ ] More granular reason text per country × category (not just per country)
- [ ] Email gate integration with actual backend (currently client-side only)

### v1.2 (Medium-term)
- [ ] Time-series trend charts per country (model ceiling vs realized CPI over time)
- [ ] Basket view integration with war selector
- [ ] PDF/image export of impact reports
- [ ] SEO meta tags and Open Graph for social sharing

### v2.0 (Future)
- [ ] Real coefficient database (not hardcoded) with admin interface
- [ ] User accounts and saved scenarios
- [ ] API for programmatic access
- [ ] Additional conflict scenarios (e.g., South China Sea, Taiwan Strait)
- [ ] Sub-national data for large countries (India states, Nigeria regions)
- [ ] Multi-language support

---

## Changelog

### 2025-03-24 — v1.0 Launch
- Initial prototype with 5 wars, 10 categories, 10 core countries
- SerpAPI integration for live commodity prices (Crude Oil, Natural Gas, Gold, Copper, Aluminium)
- World Bank integration for Urea
- War-first simulator navigation with top 5 / bottom 5 country rankings
- Purchasing power erosion section with historical FX data
- Country comparison dropdown (30 countries, 10 with full data)
- Mobile-responsive design (3 breakpoints: 1024px, 768px, 420px)
- Example impact cards with war attribution and plain-English explainers
- Single-select pass-through and lag horizon chips
- Simulation gate (email collection after 2 free views)
- SerpAPI attribution in all footers

---

*Scenario estimator only. Not a price forecast, not financial advice. All estimates assume 100% upstream cost pass-through.*
