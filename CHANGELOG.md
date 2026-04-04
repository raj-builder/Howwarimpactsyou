## [2026-04-05] — Footer cleanup, version bump to v2.0

### What changed
- Footer links updated: Methodology → How It Works, Data Sources → Give Feedback
- Version tag updated from "v1.0 Beta" to "v2.0"
- About page links updated to point to /how-it-works instead of /methodology and /data-sources

### Why
Footer had stale links to pre-merge pages. Beta tag no longer appropriate after 65 countries, 6 wars, EIA data integration, and belligerent rankings.

### Data & calculation notes
None.

### Upgrade notes for the next engineer or AI session
None.

### Credits & third-party use
None.

---

## [2026-04-05] — UI restructure, belligerent rankings, feedback, SerpAPI cache

### What changed
- Renamed "Simulator" → "Regional Impact", "Country Simulator" → "Country Impact"
- All "Open Simulator" CTAs now point to /country-simulator as the main tool
- Merged Methodology + Data Sources + Learn into single `/how-it-works` page with assumptions upfront
- New `/feedback` page: form (name, email, X/LinkedIn, message, source URL) stored in Vercel KV
- 8 belligerent countries (USA, Iran, Israel, Saudi Arabia, UAE, Kuwait, Qatar, Bahrain) with full Hormuz 2026 rankings across all 10 categories
- Belligerent insight cards: replaced misleading "Gains/Costs" with actual basket impact % + plain-language explanations
- Belligerent countries moved from dark war card to standalone clickable rows below
- 4 category-specific impact cards (Cereal, Fuel, Oil, Dairy) on simulator showing top 3 countries each
- Homepage "Most impacted by Hormuz" section with top 5 countries + CTA
- SerpAPI server-side file cache with 48h TTL (~9 calls until Apr 22 vs unlimited before)
- EIA bulk data pull script for 164 countries (`scripts/eia-bulk-pull.ts`)
- Oil consumption data updated from EIA 2024 actuals for 14 fuel-alert countries
- 65 countries total (added USA, Iran, Israel, Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Australia, New Zealand)
- FX dates updated from Mar 2026 → Apr 2026 across all 30 currency entries
- `.env.example` created with EIA_API_KEY placeholder

### Why
Users needed to see impact data for directly involved countries (previously showing +0%). The simulator page had too many nav tabs. Community feedback mechanism was missing. SerpAPI was burning through 250/month quota without server-side caching.

### Data & calculation notes
- Belligerent rankings calibrated against existing data: Iran (32.6% basket) matches Egypt as war-impacted economy. USA (6.8%) matches Brazil as food self-sufficient. Gulf states (12-16%) reflect 90% food import dependency offset by fuel subsidies and USD pegs.
- SerpAPI cache: file-based in /tmp, 48h TTL. ~9 calls until Apr 22 renewal.
- EIA data: 164 countries, petroleum consumption in TBPD + QBTU, dry natural gas in BCF. ProductId=5 for petroleum (consumption only), productId=26 for natural gas (all activities).

### Upgrade notes for the next engineer or AI session
- Flight Fuel Alert page built locally (12 files) but NOT deployed — needs UX redesign before launch
- Partial/experimental countries (Peru, Chile, etc.) show +0% — need deep research for Hormuz 2026 rankings
- EIA API key optional (`EIA_API_KEY` in `.env.local`) — app works without it
- SerpAPI cache file at `/tmp/prices-cache.json` — persists across Vercel warm invocations

### Credits & third-party use
- U.S. Energy Information Administration (EIA) — oil consumption data (public domain)
- GDELT Project — news monitoring API (free, commercial OK)
- Vercel KV — feedback form storage

---

## [2026-04-04] — Flight Fuel Alert feature + weekly news digest

### What changed
- New `/flight-alerts` page showing per-country fuel security profiles with alert levels (CRITICAL/HIGH/MODERATE/LOW)
- 14 country fuel security profiles: Australia, Indonesia, Pakistan, Bangladesh, Sri Lanka, Philippines, India, Thailand, Japan, South Korea, China, Taiwan, Singapore, New Zealand
- Vulnerability scoring algorithm: 4-factor composite score (reserve days 35pts, import dependency 25pts, Hormuz exposure 25pts, refining capacity 15pts)
- Depletion estimate formula: reserves adjusted by Hormuz-dependent import share
- 10 flight route impact cards with pre/post prices, status badges (operating/suspended/rerouted/reduced), and high-risk zone warnings
- 8 airline impact summaries (Qantas, Korean Air, Air NZ, Emirates, Air India, Cathay Pacific, Ryanair, Vietnam Airlines)
- Weekly fuel digest: 7-day news (GDELT) + 7-day price sparkline (EIA), fetched server-side 2x/day with 12h ISR cache
- Added Australia and New Zealand to the country list (new 'Asia Pacific' region)
- 38 new unit tests for fuel calculation functions (98 total project tests)
- 40+ new i18n keys in `flightAlerts.*` namespace
- Navigation updated with Flight Fuel Alert link

### Why
Users need to understand how the Hormuz oil crisis affects their ability to fly. Countries like Australia (34-day reserves) and Indonesia (22-day reserves) face critical fuel shortages that directly impact airline operations, route availability, and ticket prices. The feature surfaces this beyond simulation with a curated 7-day news digest of fuel price moves and rationing headlines.

### Data & calculation notes
- Vulnerability score: composite 0-100 from 4 factors (reserves 35pts max, import dependency 25pts, Hormuz exposure 25pts, refining capacity 15pts)
- Reserve score: linear interpolation — <30 days = 35pts (max), >180 days = 0pts
- Alert thresholds: CRITICAL >= 70, HIGH >= 50, MODERATE >= 30, LOW < 30
- Depletion formula: strategicReserveDays / (hormuzExposurePct/100 * importDependencyPct/100)
- Example: Australia = 34 / (0.59 * 0.90) = ~64 days
- All calculation functions in src/lib/fuel-calculations.ts with docstrings and 38 unit tests

### Upgrade notes for the next engineer or AI session
- New Region value 'Asia Pacific' added to `src/types/index.ts`
- Australia and New Zealand added to `src/data/countries.ts`
- New data files: `src/data/fuel-security.ts`, `src/data/flight-routes.ts`
- New calculation module: `src/lib/fuel-calculations.ts`
- New API route: `/api/fuel-digest` (requires optional `EIA_API_KEY` env var for price data)
- `.env.example` created with `EIA_API_KEY` placeholder
- Weekly digest works without EIA key (falls back gracefully)

### Credits & third-party use
- EIA International Energy Statistics — oil consumption, production (Public domain, US Gov)
- EIA Open Data API — Brent crude + jet fuel spot prices (Public domain, free key)
- IEA Energy Security — import dependency, reserve requirements (CC BY 4.0)
- Zero Carbon Analytics — Hormuz vulnerability scores (CC BY-NC)
- JOGMEC — Japan strategic reserve data (Japanese government, public)
- IATA — jet fuel pricing, surcharge data (attribution required)
- GDELT Project DOC 2.0 API — news articles (free, commercial OK, no key)
- Airline press releases — route status, fare changes (fair use / factual reporting)

---

## [2026-03-30] — Phase C: 55 countries, FX updates, live prices, model optimization

### What changed
- **55 countries** — expanded from 24 to 55 countries. Added Japan, South Korea, Taiwan, China, Thailand, Vietnam, Malaysia, Singapore, Germany, UK, France, Italy, Spain, Poland, Greece, Mexico, Colombia, Peru, Chile, Iraq, Lebanon, Jordan, Yemen, Tunisia, Nepal, Afghanistan, Myanmar, Cambodia, Tanzania, Uganda, Mozambique, Sudan, Senegal, Algeria, Libya, Somalia, Venezuela
- **All 55 countries have basket rankings** for Hormuz 2026 scenario with researched impact percentages based on energy import dependency, trade exposure, and FX vulnerability
- **FX window dates updated** — ukraine-russia extended to Mar 2026 (EGP –71%, TRY –69%), iran-israel-us updated to Mar 2026 (EGP –42%, TRY –27%)
- **Fallback commodity prices updated** — Brent $107.81, gold $4434, urea $674, aluminium $1.50/lb (all March 2026 actuals)
- **Live commodity prices component** — new `LivePrices` component in country simulator shows current SerpAPI values with freshness date
- **usePricesFreshness hook** extended to expose actual price data (not just metadata)

### Why
Phase C of the 11-ticket plan. Countries were expanded to cover Hormuz-dependent economies (Japan 93% oil via Hormuz, South Korea 68%, Taiwan/China). FX rates were stale (ending at 2023 dates for a live war). Fallback prices were from March 2025. Live prices display helps users trust the data.

### Data & calculation notes
- Hormuz 2026 basket rankings: impact percentages derived from energy import dependency (EIA, IEA), trade exposure (UN Comtrade), FX vulnerability (central bank data)
- Japan 8.2% basket impact reflects diversified economy + strong reserves despite 93% oil Hormuz dependency
- Egypt 32.4% basket reflects cumulative EGP depreciation (–71% since 2022) + energy import costs
- FX rates from Trading Economics, Xe.com, central bank data (March 2026)

### Upgrade notes for the next engineer or AI session
- `usePricesFreshness` now returns `prices` field with commodity data
- `LivePrices` component added to country simulator left column
- Countries list is in `src/data/countries.ts` (55 entries)
- Rankings for new countries only exist in `hormuz-2026.basket` — other war/category combos will return 0%
- T9 (article rewrites with citations) still deferred

### Credits & third-party use
- Country risk rankings: Zero Carbon Analytics (Hormuz vulnerability scores), CNBC, Visual Capitalist
- FX rates: Trading Economics, Xe.com, central bank websites
- Commodity prices: EIA, Fortune, COMEX, LME, World Bank

---

## [2026-03-30] — Strait of Hormuz 2026 scenario (deep research)

### What changed
- **New war scenario: Strait of Hormuz Escalation** (`hormuz-2026`) — Feb 2026 to Present, based on the US-Israeli strikes on Iran (28 Feb 2026) and the effective closure of the Strait of Hormuz to commercial shipping
- **Researched commodity prices:** Brent Crude ($70→$107.81, +54%), shipping containers ($2000→$5000, +150%), urea ($452→$674, +49%), Natural Gas EU TTF (+21%), aluminium ($3031→$3300, +9%), gold ($4680→$4434, –5%)
- **Researched FX rates:** 10 countries with Feb 1 vs Mar 27 2026 exchange rates. Key moves: Egypt EGP –10%, Türkiye TRY –17%, India INR –4%, Philippines PHP –4%
- **Rankings for all 10 categories** — basket top impact: Egypt +32.4%, Pakistan +27.1%, Nigeria +23.6%. Fuel top impact: Egypt +48.2%, Pakistan +41.6%
- **Consumer goods:** iPhone, economy flights, electricity bill price comparisons for the Hormuz scenario
- **Default war changed** from iran-israel-us to hormuz-2026 across simulator, country simulator, and useSimulatorState
- **Country reasons** added for all 10 countries explaining why they are affected by the Hormuz closure

### Why
The Strait of Hormuz escalation (starting Feb 28, 2026) is the most acute current geopolitical event affecting global commodity prices. Brent crude surged 54% in under 2 months. Container shipping rates jumped 150%. This is now the most relevant default scenario for users.

### Data & calculation notes
- Pre-condition date: Feb 1, 2026. Post-condition: Mar 27, 2026
- Brent $70→$107.81 (EIA, Fortune, Trading Economics)
- EU TTF gas ~$46→$55.7 EUR/MWh (EIA STEO)
- Urea $452→$674/mt (DTN, World Bank)
- Container freight SCFI ~$2000→$5000/TEU (Maersk, CNBC, SCFI)
- Gold $4680→$4434/oz (goldprice.org, CBS News)
- Aluminium $3031→$3300/mt (LME, Trading Economics)
- FX rates from Trading Economics, Xe, exchange-rates.org, central bank data

### Upgrade notes for the next engineer or AI session
- New WarId `'hormuz-2026'` added to `src/types/index.ts`
- War entry with full rankings in `src/data/wars.ts`
- Pre-escalation prices in `src/data/pre-escalation-prices.ts`
- FX data in `src/data/currencies.ts`
- Country reasons in `src/data/reasons.ts`
- WAR_ESCALATION_ORDER updated (hormuz-2026 is first)
- Default war changed in simulator, country-simulator, and useSimulatorState
- Phase C remaining: T5 (50+ countries), T7 (FX window update for all wars), T9 (articles), T11 (model optimization)

### Credits & third-party use
- Commodity prices: EIA Short-Term Energy Outlook (March 2026), Fortune, Trading Economics, COMEX, ICE London, LME, World Bank Pink Sheet, DTN fertilizer report
- FX rates: Trading Economics, Xe.com, exchange-rates.org, central bank websites (CBE, BSP, RBI)
- Shipping data: Maersk emergency freight notice, CNBC, Shanghai Containerized Freight Index
- Conflict timeline: Wikipedia (2026 Strait of Hormuz crisis)

---

## [2026-03-30] — Phase A+B: war card sizing, consumer goods, OG image, changelog fix

### What changed
- **War card sizing** — horizontal strip cards now have `min-h-[160px]` with chips pushed to bottom via `mt-auto`, ensuring consistent heights across all 5 conflict cards
- **WarSummaryCard no-country state** — replaced empty "Select a country" prompt with the top impacted country name/percentage from rankings data, plus a "Explore impact" CTA with downward arrow
- **Consumer goods in Country Simulator** — new `ConsumerGoods` component shows iPhone, BMW X1, flight, electricity price changes below the basket category toggles. Data from existing `consumerGoods` arrays in `pre-escalation-prices.ts`
- **Changelog year fix** — all version dates corrected from "March 2025" to "March 2026"
- **OG image for Country Simulator** — new `opengraph-image.tsx` generates 1200x630 social share cards with dark gradient background, country flag + name, impact percentage, war name, shock chips, and disclaimer. Automatically used when sharing `/country-simulator` URLs on social media

### Why
Phase A+B of the 11-ticket plan. These are the tickets that don't require deep research — code-only fixes for UI consistency, missing features, and social sharing.

### Data & calculation notes
None. Consumer goods prices are reference-only (not included in basket calculations).

### Upgrade notes for the next engineer or AI session
- `ConsumerGoods` component imported in `country-simulator-client.tsx`
- `FactorBreakdown` component has `hideTitle` prop (added in previous session)
- OG image route at `/country-simulator/opengraph-image.tsx` accepts `war`, `country`, `category` search params
- Phase C tickets (Hormuz 2026, 50+ countries, FX dates, articles, model optimization) still need deep research prompts

### Credits & third-party use
None.

---

## [2026-03-29] — UI polish: mobile nav, accessibility, homepage hierarchy, page fixes

### What changed
- **Mobile navigation** — hamburger menu with slide-out drawer on screens below lg breakpoint. Primary nav links + secondary links (About, Press, Changelog, Contact) + CTA button. Closes on route change, prevents body scroll when open.
- **Toggle accessibility** — country simulator toggles now use `role="switch"` + `aria-checked`. Touch target increased from 36x20px to 44x24px.
- **War strip scroll indicator** — gradient fade on right edge signals horizontal scrollability.
- **Controls bar responsive** — country simulator controls grid now uses `md:grid-cols-3` intermediate breakpoint instead of jumping from 1 to 5 columns.
- **Homepage redesign** — hero card (Egypt +28.4%) promoted to full-width dark card with large impact number. Remaining 3 examples as compact rows. Duplicate disclaimer removed from hero. Mission section replaced with 3-step "How it works" strip.
- **Contact page** — added GitHub Issues link and email address as actual contact mechanisms.
- **Press page** — removed placeholder "Screenshots & assets" section.
- **Country Simulator sidebar** — factor breakdown and purchasing power sections now collapsible via `<details>` with triangle indicators.
- **About timeline** — added vertical line with dot markers for visual timeline progression.
- **Footer** — version label opacity increased from 30% to 50% for readability. Footer links wrapped in semantic `<nav>`.

### Why
Full UI audit identified P0 (mobile nav missing, toggle accessibility), P1 (scroll indicator, homepage hierarchy, mobile controls), P2 (contact mechanism, press placeholder, sidebar density), and P3 (timeline visual, footer readability) issues. All resolved.

### Data & calculation notes
None.

### Upgrade notes for the next engineer or AI session
- Nav component now uses `useState` for mobile drawer state
- FactorBreakdown component has new optional `hideTitle` prop
- Homepage example cards restructured: 1 HERO_CARD + 3 SECONDARY_CARDS (was 4 equal EXAMPLE_CARDS)
- All homepage card links now point to `/country-simulator` instead of `/simulator`

### Credits & third-party use
None.

---

## [2026-03-29] — Declutter: simulator dashboard, Country Simulator, page consolidation

### What changed
- **Simulator simplified to single-column dashboard** — removed 2-column sidebar layout with 7 control sections. Now shows: horizontal war strip → So What card → side-by-side rankings (top 5 / bottom 5) → quick scenarios → belligerent countries
- **Rankings use "basket" (household basics) category** by default at 100% passthrough / immediate lag — no category selector on this page
- **Clicking a country in rankings navigates to Country Simulator** — replaced inline expansion with Link-based navigation to `/country-simulator?war={warId}&country={countryName}`
- **Basket page renamed to "Country Simulator"** at `/country-simulator` — enriched with single-category detail panel (ImpactDisplay, StatCards, FactorBreakdown, PurchasingPower) above the existing basket summary
- **Countries page absorbed into simulator** — belligerent country cards (USA, Israel, Iran, Russia, Ukraine, Saudi Arabia) now render as a section within the simulator page; `/countries` redirects to `/simulator`
- **Navigation updated** — "Basket" tab → "Country Simulator"; "Countries" tab removed
- **Extracted reusable components** — StatCard, FactorBreakdown, PurchasingPower moved from inline functions in simulator-client to standalone files
- **Horizontal war card variant** — new `horizontal` prop on WarEscalationCard for the scrollable war strip (220px width, no commodity table, always shows shock chips)
- **PresetCards switched to Link navigation** — no longer uses callback; navigates directly to `/country-simulator`
- **Stagger reveal animations** — ranking rows and belligerent cards fade in with staggered delays; respects prefers-reduced-motion
- **Visual polish** — generous negative space (py-12, mb-10), serif section titles, larger ranking impact text, right-arrow navigation indicator on ranking rows

### Why
The simulator page was too cluttered with 12 right-panel sections and 7 left-panel control sections, requiring extensive scrolling. The basket page already had a cleaner toggling interface that works better for detailed single-country analysis. This restructure separates overview (simulator) from deep-dive (country simulator), matching user mental models. The standalone countries page didn't add value as a separate tab — integrating it into the simulator provides context alongside the rankings.

### Data & calculation notes
None. All calculations unchanged. Rankings on the simulator now always use 'basket' category at 100%/immediate (overview numbers). The Country Simulator runs the full computation pipeline with user-adjustable parameters.

### Upgrade notes for the next engineer or AI session
- `/basket` now redirects to `/country-simulator` — update any external links
- `/countries` now redirects to `/simulator` — update any external links
- `PresetCards` no longer accepts `onSelect`/`activeWar`/`activeCategory`/`activeCountry` props — uses Link navigation
- `simulator-client.tsx` reduced from ~798 lines to ~243 lines
- New components: `stat-card.tsx`, `factor-breakdown.tsx`, `purchasing-power.tsx`, `belligerent-countries.tsx`
- New data file: `src/data/belligerent-countries.ts`
- New route: `src/app/country-simulator/page.tsx` with `CountrySimulatorClient`
- Compare page and saved scenarios page still need updates (see MEMORY.md open questions)

### Credits & third-party use
None new. Belligerent countries data (GDP, oil, gas) already attributed to World Bank, EIA/OPEC, IEA in previous changelog entry.

---

## [2026-03-28] — Simulator UI overhaul, basket controls, page restructure

### What changed
- **Default war changed to Iran–Israel–US** — simulator and basket page now default to the Iran-Israel-US conflict (Strait of Hormuz focus) instead of Russia-Ukraine
- **"So What" summary card** replaces duplicate war escalation card at top of right panel; shows personal impact hero number, 3-category mini insights (bread/fuel/oil), basket weighted average, and integrated ShareToolbar
- **Country detail promoted to top** — clicking a country in rankings now shows the detail panel directly below the summary card instead of buried after rankings; auto-scrolls into view
- **War card alignment** — left-panel war cards use compact padding to align properly within the controls aside
- **Price provenance readability** — footer text in war cards changed from 9px/25% opacity (~1.25:1 contrast) to 11px/70% opacity (~5.8:1 contrast, WCAG AA compliant)
- **Quick scenarios redesigned** — moved from above the grid into the right panel; uses callback-based navigation instead of Link page reloads; computes impact dynamically from rankings data; shows clear "Try this scenario" CTA
- **ShareToolbar activated** — the existing but unused ShareToolbar component is now rendered in the So What card (dark variant) and basket page summary
- **Basket page interactive controls** — added war selector, country dropdown (grouped full/partial/experimental), pass-through chips, lag chips; all sync to URL for shareable state
- **Methodology & Validation merged** — single page at /methodology with validation section accessible via #validation anchor; /validation route redirects
- **Countries Involved page** — new /countries page showing belligerent nations (USA, Israel, Iran, Russia, Ukraine, Saudi Arabia) with GDP, oil/gas production, key exports, and conflict impact descriptions
- **Homepage examples updated** — all 4 example cards now feature Iran-Israel-US conflict scenarios (Egypt fuel, Pakistan bread, Philippines fuel, India cooking oil)
- **Navigation updated** — Validation tab replaced with Countries tab; methodology tab points to merged page
- **i18n improvements** — new translation keys for soWhat.*, presets.*, basket.selectCountry, basket.selectWar, nav.countries; purchasing power text now uses i18n interpolation instead of hardcoded template literals

### Why
The simulator's right panel was duplicating data the user already saw on the left (same war card shown twice). The user needed a clear personal "So What" — not raw commodity numbers but a direct statement like "Your bread could cost 18.4% more." Combined with repositioning quick scenarios and promoting country detail to the top, this reduces scroll and puts actionable insights first. The Iran-Israel-US default reflects the current most relevant geopolitical flashpoint (Hormuz). The basket page had zero interactive controls. The methodology and validation pages were unnecessarily split.

### Data & calculation notes
None. No calculation logic changed. All numbers still flow through `computeScenario()` and `computeBasket()` in `src/lib/calculations.ts`. The WarSummaryCard's mini insights and basket average are computed from the same centralized functions.

### Upgrade notes for the next engineer or AI session
- The old `/validation` page now redirects to `/methodology#validation` — update any external links
- `PresetCards` component API changed: now requires `onSelect` callback prop instead of rendering `<Link>` elements
- `WarEscalationCard` has new optional `compact` prop for left-panel use
- `ShareToolbar` has new optional `variant` prop ('light' | 'dark')
- Countries page data (GDP, oil production) is hardcoded — will need periodic updates from World Bank/EIA sources
- Open items remain: i18n for all hardcoded strings in methodology/validation/countries pages, accessibility audit, compare page, saved scenarios page

### Credits & third-party use
- Countries page economic data: World Bank (GDP, 2023), EIA/OPEC (oil production), IEA (gas production), UN Comtrade (export categories). All public domain / CC BY 4.0.
