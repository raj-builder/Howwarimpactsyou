# Project Memory

_Last updated: 2026-03-27 07:30 UTC_
_Project: howwarimpactsyou.com_

---

## 1. What we are building

A consumer-facing web tool that models price impact ceilings from conflict-related macro shocks. Users select a conflict, country, product category, pass-through rate, and lag period to see how upstream commodity price shocks could flow through to everyday consumer prices. The platform covers 5 wars, 10 product categories, and 20 countries. Built on Next.js 16 + React 19 + Tailwind, deployed on Vercel. Data comes from SerpAPI (commodity prices), World Bank (fertilizer), and pre-computed impact rankings. The repo is public at github.com/raj-builder/Howwarimpactsyou.

---

## 2. Decisions log

### 2026-03-27 — Remove Claude co-authorship from commits
**Decision:** Force-pushed to rewrite 3 commits, removing all `Co-Authored-By: Claude` trailers.
**Why:** User preference — all commits should show only The Builder as author.
**Alternatives considered:** Leaving existing commits as-is (rejected by user).
**Impact:** History rewritten for commits `f166d15`, `e4c3cef`, `c49464f`. New SHAs: `0fc3ec5`, `1dcc0fd`, `2308fef`.

### 2026-03-27 — 3-layer caching for SerpAPI quota protection
**Decision:** Added module-level cache, sessionStorage (24h TTL), and existing Vercel CDN cache (s-maxage=86400) to the prices freshness hook.
**Why:** SerpAPI free tier has 250 calls/month. Without client-side caching, every component mount would hit `/api/prices`.
**Alternatives considered:** Using Vercel KV as a server-side cache (overkill for this use case). Using `localStorage` instead of `sessionStorage` (sessionStorage is more appropriate since price data changes daily).
**Impact:** Max 1 SerpAPI call per 24 hours regardless of traffic volume.

### 2026-03-27 — Use real SerpAPI fetched_at for provenance timestamp
**Decision:** Created `usePricesFreshness` hook that fetches `/api/prices` and extracts the `fetched_at` ISO timestamp. `getProvenance()` now accepts an optional `serpApiFetchedAt` parameter.
**Why:** The "Data as of" field was hardcoded to "Mar 25, 2025" — not the real date when commodity data was last pulled.
**Alternatives considered:** Using today's date dynamically (rejected — doesn't reflect actual data freshness). Keeping static date (rejected by user).
**Impact:** Assumption strip now shows actual SerpAPI fetch date+time (e.g., "Mar 26, 2026 · 3:14 PM").

### 2026-03-27 — Scenario builder refactoring (14 tickets SB-001–SB-014)
**Decision:** Centralized all calculation logic into `src/lib/calculations.ts`, removed Math.random(), applied lag multipliers, connected basket to scenario state, added provenance/coverage/reliability metadata.
**Why:** Multiple numerical inconsistencies: non-deterministic realized estimates, lag stored but never applied, basket disconnected from scenario, hardcoded waterfall factors, incomplete share links.
**Alternatives considered:** Patching individual components separately (rejected — root cause was duplicated calculation logic across files).
**Impact:** 7 new files, 12 modified files, 37 unit tests. All calculations now flow through one deterministic pipeline. Build passes (81 pages). Tests pass (37/37).

### 2026-03-27 — Made repository public
**Decision:** Changed GitHub repo visibility from private to public.
**Why:** No secrets in code (all in env vars), data APIs documented as CC BY 4.0.
**Alternatives considered:** None.
**Impact:** Source code visible at github.com/raj-builder/Howwarimpactsyou.

---

## 3. Build tracker

| Area | Status | Notes |
|------|--------|-------|
| Scenario simulator | ✅ Done | 5 wars × 10 categories × 20 countries, lag/passthrough/provenance |
| Centralized calculations | ✅ Done | `src/lib/calculations.ts` — single source of truth for all math |
| Canonical types | ✅ Done | `src/types/scenario.ts` — ScenarioState, ScenarioResult, BasketResult, LagPeriod |
| Basket view | ✅ Done | Dynamic from rankings via `computeBasket()`, dual metrics (weighted avg + CPI pp) |
| Coverage badges | ✅ Done | `CoverageBadge` — full/partial/experimental/unavailable |
| Reliability badges | ✅ Done | `ReliabilityBadge` — validated/indicative/experimental |
| Structural miss warnings | ✅ Done | Türkiye, Nigeria, Pakistan show amber warning with link to /validation |
| Factor contribution breakdown | ✅ Done | Per-war/category factor templates, absolutePct sums to headline |
| Audit drawer | ✅ Done | Full formula trace, factor decomposition, provenance metadata |
| Shock explainer | ✅ Done | Toggleable panel explaining shock measurement windows |
| Provenance / data-as-of | ✅ Done | Real SerpAPI `fetched_at` via `usePricesFreshness` hook |
| SerpAPI caching | ✅ Done | 3-layer: module cache + sessionStorage (24h) + Vercel CDN (24h) |
| Deterministic share links | ✅ Done | All URL params (`war`, `category`, `country`, `pt`, `lag`) always serialized |
| Impossible-state guards | ✅ Done | `validateScenarioState()` blocks rendering when state is invalid |
| Saved scenarios migration | ✅ Done | Old decimal passthrough (0.6) auto-converted to integer (60) |
| Unit tests | ✅ Done | 37 Vitest tests — determinism, rounding, lag, basket reconciliation, identity round-trip |
| Validation page | ✅ Done | 7 rows, lag context annotation, known failure modes documented |
| SEO landing pages | ✅ Done | 50 dynamic pages: `/impact/[war]/[category]` |
| Commodity price feeds | ✅ Done | SerpAPI (Gold, Crude, NatGas, Copper, Aluminium) + World Bank (Urea) |
| Soft gate (signup) | ✅ Done | Email/phone after 5 explorations, stored in Vercel KV |
| Embed widgets | ✅ Done | `/embed/basket`, `/embed/impact-card` |
| Homepage example cards | ✅ Done | 4 cards with complete `lag`/`pt` params in hrefs |
| SaveButton defaults | ✅ Done | Fixed from passthrough=0.6/lag='3-6 months' to 100/'6m' |
| Compare page | 📋 Planned | Needs lag/pt params per scenario, coverage badges per country row |
| Saved scenarios page | 📋 Planned | Passthrough display fix (`Math.round(s.passthrough * 100)` breaks for integers), needs badges |
| i18n / translation files | 📋 Planned | CLAUDE.md §3.1 requires all UI strings in translation files — not yet implemented |
| Accessibility audit | 📋 Planned | CLAUDE.md §3.3 requires axe/Lighthouse on every new screen — not yet run |
| Share toolbar update | 📋 Planned | Should include `mv` (modelVersion) and `sd` (snapshotDate) in URL |

---

## 4. Preferences & conventions

**Commit author:** The Builder <the.builder.mode.on@gmail.com>
**Co-authorship:** No Claude or AI co-author lines in commits
**Changelog:** Every commit must update CHANGELOG.md (see CLAUDE.md §4)
**Repo visibility:** Public on GitHub
**SerpAPI budget:** Free tier, 250 calls/month — max 1 call per 24 hours enforced by 3-layer cache
**Secrets:** Never in code — API keys live in Vercel env vars only
**Data traceability:** Every number shown in UI must trace to a named backend function (CLAUDE.md §5)
**Rounding policy:** Display mode = 1 decimal place; Audit mode = 3 decimal places
**Realized estimate:** Deterministic at 0.65 × lagAdjustedCeiling (no randomness)
**Typical range:** 55%–75% of lagAdjustedCeiling
**Lag multipliers:** Immediate=1.0, 3m=0.95, 6m=0.88, 12m=0.75
**Structural miss countries:** Türkiye, Nigeria, Pakistan — model underestimates, show indicative reliability
**Test framework:** Vitest (`npm test` / `npm run test:watch`)

---

## 5. Open questions & blockers

- [ ] Compare page (`compare-client.tsx`) not yet updated with lag/pt params and coverage badges — _added 2026-03-27_
- [ ] Saved scenarios page (`saved-client.tsx`) passthrough display still broken for old integer data — _added 2026-03-27_
- [ ] Homepage example card impact numbers may not exactly match `computeScenario()` output at their stated lag values — _added 2026-03-27_
- [ ] i18n not yet implemented — CLAUDE.md §3.1 requires all UI strings in translation files — _added 2026-03-27_
- [ ] No accessibility audit has been run — CLAUDE.md §3.3 requires axe/Lighthouse on every new screen — _added 2026-03-27_
- [ ] Share toolbar does not yet include model version or snapshot date in URL params — _added 2026-03-27_
- [ ] Embed endpoints (`/embed/basket`, `/embed/impact-card`) not yet updated to accept lag/pt params — _added 2026-03-27_
