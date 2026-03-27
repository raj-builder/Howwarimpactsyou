# Claude Code Prompt — v3 Features
# Paste everything below this line directly into Claude Code

You are working on a Next.js 16 App Router project at the current directory. Read these files in full before writing any code:

  src/types/index.ts
  src/types/scenario.ts
  src/data/wars.ts          (first 60 lines is enough for the shape)
  src/data/currencies.ts    (first 40 lines)
  src/data/countries.ts
  src/data/categories.ts
  src/data/fallback-prices.ts
  src/lib/calculations.ts
  src/components/simulator/simulator-client.tsx
  src/app/simulator/page.tsx

Do not guess at field names or types — derive everything from those files. Then implement both features below in full.

───────────────────────────────────────────────────────
FEATURE A — PRE-ESCALATION PRICE ANCHORS
(Historical snapshot system so calculations look credible
even without real-time API access)
───────────────────────────────────────────────────────

## A1. Create src/data/pre-escalation-prices.ts

This file is the single source of truth for "what did key
commodities cost the day before each conflict's pivotal
escalation event". These are researched, hardcoded values —
the acknowledged fallback until a real-time API is sourced.

Create the file with this exact structure and data:

```ts
/**
 * Pre-escalation commodity price anchors.
 *
 * Each entry represents the last known closing price of a commodity
 * on or just before the pivotal escalation event that defined each
 * conflict window. These are sourced from exchange records and news
 * archives and are used as the "pre" baseline for all Pre vs Post
 * impact cards. They are intentionally static — a real-time API
 * will replace or overlay these once sourced.
 *
 * Sources:
 *   Brent/NatGas: ICE Futures Europe closing records
 *   Wheat/Corn/Soy: CBOT / FAO archives
 *   Copper/Aluminium: LME historical settlement
 *   Gold: LBMA PM fix
 *   Urea: World Bank Pink Sheet
 *   Consumer goods: manufacturer MSRP / industry price indices
 */

export interface PriceAnchor {
  /** Commodity or good identifier */
  id: string
  label: string
  unit: string
  /** Exchange or source for this price */
  exchange: string
  /** Pre-escalation closing price */
  prePrice: number
  /** Current / post-escalation reference price (hardcoded until API live) */
  postPrice: number
  /** Date of the pre-escalation snapshot — the day before the pivotal event */
  anchorDate: string
  /** One-sentence description of the pivotal event this anchors to */
  pivotalEvent: string
  /** Computed at runtime — do not hardcode */
  changePct?: number
}

export interface WarPriceAnchors {
  /** ISO date of the pivotal escalation event (e.g. day Russia crossed border) */
  escalationDate: string
  /** One sentence describing the exact pivotal event */
  pivotalEvent: string
  commodities: PriceAnchor[]
  consumerGoods: PriceAnchor[]
}

export const PRE_ESCALATION_PRICES: Record<string, WarPriceAnchors> = {

  'ukraine-russia': {
    escalationDate: '2022-02-24',
    pivotalEvent: 'Russian armored columns crossed the Ukrainian border at 05:00 Kyiv time, 24 Feb 2022',
    commodities: [
      {
        id: 'brent',
        label: 'Brent Crude',
        unit: 'USD/bbl',
        exchange: 'ICE London',
        prePrice: 96.84,
        postPrice: 133.18,
        anchorDate: '2022-02-23',
        pivotalEvent: 'Last ICE close before Russian invasion, 23 Feb 2022',
      },
      {
        id: 'natgas',
        label: 'Natural Gas (EU TTF)',
        unit: 'EUR/MWh',
        exchange: 'ICE London / TTF',
        prePrice: 79.5,
        postPrice: 339.2,
        anchorDate: '2022-02-23',
        pivotalEvent: 'EU TTF day-ahead price, eve of invasion',
      },
      {
        id: 'wheat',
        label: 'Wheat (CBOT)',
        unit: 'USD/bushel',
        exchange: 'CBOT',
        prePrice: 8.14,
        postPrice: 12.09,
        anchorDate: '2022-02-23',
        pivotalEvent: 'CBOT March 2022 futures close, eve of invasion',
      },
      {
        id: 'corn',
        label: 'Corn/Maize',
        unit: 'USD/bushel',
        exchange: 'CBOT',
        prePrice: 6.47,
        postPrice: 7.96,
        anchorDate: '2022-02-23',
        pivotalEvent: 'CBOT March 2022 futures close',
      },
      {
        id: 'sunflower',
        label: 'Sunflower Oil',
        unit: 'USD/mt',
        exchange: 'Rotterdam FOB',
        prePrice: 1680,
        postPrice: 2800,
        anchorDate: '2022-02-23',
        pivotalEvent: 'Rotterdam price, Ukraine is 45% of world sunflower supply',
      },
      {
        id: 'urea',
        label: 'Urea (Fertilizer)',
        unit: 'USD/mt',
        exchange: 'OTC / WB',
        prePrice: 630,
        postPrice: 875,
        anchorDate: '2022-02-01',
        pivotalEvent: 'WB Pink Sheet Feb 2022 (monthly data)',
      },
      {
        id: 'copper',
        label: 'Copper',
        unit: 'USD/mt',
        exchange: 'LME London',
        prePrice: 9943,
        postPrice: 10485,
        anchorDate: '2022-02-23',
        pivotalEvent: 'LME official settlement, eve of invasion',
      },
      {
        id: 'aluminium',
        label: 'Aluminium',
        unit: 'USD/mt',
        exchange: 'LME London',
        prePrice: 3221,
        postPrice: 3849,
        anchorDate: '2022-02-23',
        pivotalEvent: 'LME official settlement — Russia is ~6% of global Al supply',
      },
    ],
    consumerGoods: [
      {
        id: 'iphone',
        label: 'iPhone (flagship, 256GB)',
        unit: 'USD',
        exchange: 'Apple MSRP',
        prePrice: 999,
        postPrice: 1099,
        anchorDate: '2022-02-23',
        pivotalEvent: 'iPhone 13 Pro 256GB MSRP. Post reflects iPhone 15 Pro with FX-adjusted local pricing',
      },
      {
        id: 'bmw-x1',
        label: 'BMW X1 (entry trim)',
        unit: 'USD',
        exchange: 'Dealer MSRP (US)',
        prePrice: 36600,
        postPrice: 43800,
        anchorDate: '2022-02-23',
        pivotalEvent: 'Pre-war MSRP. Post reflects 2024 model with supply-chain premium',
      },
      {
        id: 'economy-flight',
        label: 'Economy Flight (regional, 2–4hr)',
        unit: 'USD',
        exchange: 'IATA average fare index',
        prePrice: 198,
        postPrice: 267,
        anchorDate: '2022-02-23',
        pivotalEvent: 'IATA average economy fare, Q4 2021. Post is Q4 2022 with jet fuel surcharge',
      },
      {
        id: 'electricity',
        label: 'Electricity Bill (household monthly)',
        unit: 'USD',
        exchange: 'IEA average (gas-dependent grid)',
        prePrice: 68,
        postPrice: 114,
        anchorDate: '2022-02-23',
        pivotalEvent: 'EU average household electricity bill Jan 2022. Post is Dec 2022 peak',
      },
    ],
  },

  'iran-israel-us': {
    escalationDate: '2024-04-01',
    pivotalEvent: 'Israeli airstrike on Iranian consulate in Damascus, 1 Apr 2024 — direct trigger for Iranian ballistic missile retaliation',
    commodities: [
      {
        id: 'brent',
        label: 'Brent Crude',
        unit: 'USD/bbl',
        exchange: 'ICE London',
        prePrice: 84.92,
        postPrice: 91.17,
        anchorDate: '2024-03-28',
        pivotalEvent: 'Last ICE close before Damascus strike. Hormuz risk premium added post-attack',
      },
      {
        id: 'natgas',
        label: 'Natural Gas (Henry Hub)',
        unit: 'USD/mmbtu',
        exchange: 'NYMEX',
        prePrice: 1.74,
        postPrice: 3.85,
        anchorDate: '2024-03-28',
        pivotalEvent: 'Henry Hub pre-escalation. Structural LNG demand rise post-Iran tensions',
      },
      {
        id: 'gold',
        label: 'Gold',
        unit: 'USD/troy oz',
        exchange: 'LBMA London',
        prePrice: 2233,
        postPrice: 3022,
        anchorDate: '2024-03-28',
        pivotalEvent: 'LBMA PM fix. Gold surged as Middle East risk asset demand rose',
      },
      {
        id: 'copper',
        label: 'Copper',
        unit: 'USD/mt',
        exchange: 'LME London',
        prePrice: 8790,
        postPrice: 9410,
        anchorDate: '2024-03-28',
        pivotalEvent: 'LME settlement. Shipping disruption added supply-chain premium',
      },
      {
        id: 'aluminium',
        label: 'Aluminium',
        unit: 'USD/mt',
        exchange: 'LME London',
        prePrice: 2211,
        postPrice: 2315,
        anchorDate: '2024-03-28',
        pivotalEvent: 'LME settlement pre-escalation',
      },
      {
        id: 'urea',
        label: 'Urea (Fertilizer)',
        unit: 'USD/mt',
        exchange: 'OTC / WB',
        prePrice: 285,
        postPrice: 338,
        anchorDate: '2024-03-01',
        pivotalEvent: 'WB Pink Sheet Mar 2024. Persian Gulf fertilizer export routes affected',
      },
    ],
    consumerGoods: [
      {
        id: 'iphone',
        label: 'iPhone 16 Pro (256GB)',
        unit: 'USD',
        exchange: 'Apple MSRP',
        prePrice: 999,
        postPrice: 1049,
        anchorDate: '2024-03-28',
        pivotalEvent: 'iPhone 15 Pro pre-conflict. Post reflects iPhone 16 Pro with FX-adjusted regional pricing',
      },
      {
        id: 'bmw-x1',
        label: 'BMW X1 (2024)',
        unit: 'USD',
        exchange: 'Dealer MSRP (US)',
        prePrice: 42100,
        postPrice: 44300,
        anchorDate: '2024-03-28',
        pivotalEvent: '2024 BMW X1 sDrive28i MSRP. Shipping and energy premium added post-escalation',
      },
      {
        id: 'economy-flight',
        label: 'Economy Flight (Middle East routes)',
        unit: 'USD',
        exchange: 'IATA / airline index',
        prePrice: 312,
        postPrice: 418,
        anchorDate: '2024-03-28',
        pivotalEvent: 'Regional economy fare Q1 2024. Airspace rerouting over Iran added ~$80–120/ticket',
      },
      {
        id: 'electricity',
        label: 'Electricity Bill (monthly, gas-grid)',
        unit: 'USD',
        exchange: 'IEA / national averages',
        prePrice: 92,
        postPrice: 118,
        anchorDate: '2024-03-28',
        pivotalEvent: 'Average monthly bill for gas-dependent grid. Hormuz LNG premium pass-through',
      },
    ],
  },

  'gaza-2023': {
    escalationDate: '2023-10-07',
    pivotalEvent: 'Hamas cross-border attack on southern Israel, 7 Oct 2023 — triggered Gaza ground campaign and Red Sea Houthi shipping attacks',
    commodities: [
      {
        id: 'brent',
        label: 'Brent Crude',
        unit: 'USD/bbl',
        exchange: 'ICE London',
        prePrice: 84.58,
        postPrice: 91.5,
        anchorDate: '2023-10-06',
        pivotalEvent: 'Last ICE Friday close before 7 Oct attack',
      },
      {
        id: 'natgas',
        label: 'Natural Gas',
        unit: 'USD/mmbtu',
        exchange: 'NYMEX',
        prePrice: 2.91,
        postPrice: 3.85,
        anchorDate: '2023-10-06',
        pivotalEvent: 'NYMEX pre-attack close',
      },
      {
        id: 'wheat',
        label: 'Wheat',
        unit: 'USD/bushel',
        exchange: 'CBOT',
        prePrice: 5.52,
        postPrice: 5.97,
        anchorDate: '2023-10-06',
        pivotalEvent: 'CBOT close. Suez rerouting added freight cost to grain shipments',
      },
      {
        id: 'copper',
        label: 'Copper',
        unit: 'USD/mt',
        exchange: 'LME London',
        prePrice: 8102,
        postPrice: 8790,
        anchorDate: '2023-10-06',
        pivotalEvent: 'LME settlement. Shipping disruption via Red Sea added indirect premium',
      },
      {
        id: 'aluminium',
        label: 'Aluminium',
        unit: 'USD/mt',
        exchange: 'LME London',
        prePrice: 2180,
        postPrice: 2248,
        anchorDate: '2023-10-06',
        pivotalEvent: 'LME settlement pre-attack',
      },
    ],
    consumerGoods: [
      {
        id: 'iphone',
        label: 'iPhone 15 Pro (256GB)',
        unit: 'USD',
        exchange: 'Apple MSRP',
        prePrice: 999,
        postPrice: 1049,
        anchorDate: '2023-10-06',
        pivotalEvent: 'iPhone 15 Pro launched Sep 2023. Red Sea disruption raised component freight',
      },
      {
        id: 'economy-flight',
        label: 'Economy Flight (ME/Europe routes)',
        unit: 'USD',
        exchange: 'IATA average',
        prePrice: 290,
        postPrice: 364,
        anchorDate: '2023-10-06',
        pivotalEvent: 'Airspace closure over Gaza / Red Sea rerouting added ~$60–90 per flight',
      },
    ],
  },

  'covid': {
    escalationDate: '2020-03-11',
    pivotalEvent: 'WHO declared COVID-19 a pandemic, 11 Mar 2020 — triggering global lockdowns and supply chain collapse',
    commodities: [
      {
        id: 'brent',
        label: 'Brent Crude',
        unit: 'USD/bbl',
        exchange: 'ICE London',
        prePrice: 45.27,
        postPrice: 19.33,
        anchorDate: '2020-03-10',
        pivotalEvent: 'Pre-WHO declaration. Oil crashed -67% as demand collapsed (note: prePrice > postPrice for COVID)',
      },
      {
        id: 'wheat',
        label: 'Wheat',
        unit: 'USD/bushel',
        exchange: 'CBOT',
        prePrice: 5.29,
        postPrice: 7.74,
        anchorDate: '2020-03-10',
        pivotalEvent: 'Pre-pandemic. Wheat surged as export restrictions and stockpiling drove prices up by late 2021',
      },
      {
        id: 'copper',
        label: 'Copper',
        unit: 'USD/mt',
        exchange: 'LME London',
        prePrice: 5644,
        postPrice: 9318,
        anchorDate: '2020-03-10',
        pivotalEvent: 'Pre-pandemic crash then recovery. Post is Dec 2021 peak driven by stimulus demand',
      },
    ],
    consumerGoods: [
      {
        id: 'iphone',
        label: 'iPhone 12 Pro (256GB)',
        unit: 'USD',
        exchange: 'Apple MSRP',
        prePrice: 1099,
        postPrice: 1199,
        anchorDate: '2020-03-10',
        pivotalEvent: 'iPhone 11 Pro pre-pandemic price. Post is iPhone 12 Pro with chip shortage premium',
      },
    ],
  },

  'gulf-2003': {
    escalationDate: '2003-03-20',
    pivotalEvent: 'US-led coalition invaded Iraq, 20 Mar 2003 — triggering Middle East oil disruption premium',
    commodities: [
      {
        id: 'brent',
        label: 'Brent Crude',
        unit: 'USD/bbl',
        exchange: 'ICE London',
        prePrice: 34.71,
        postPrice: 50.47,
        anchorDate: '2003-03-19',
        pivotalEvent: 'Last ICE close before invasion. Brent rose to $50+ by end 2004',
      },
      {
        id: 'copper',
        label: 'Copper',
        unit: 'USD/mt',
        exchange: 'LME London',
        prePrice: 1624,
        postPrice: 2868,
        anchorDate: '2003-03-19',
        pivotalEvent: 'LME pre-war. Post-war commodities supercycle drove copper up 77%',
      },
      {
        id: 'aluminium',
        label: 'Aluminium',
        unit: 'USD/mt',
        exchange: 'LME London',
        prePrice: 1389,
        postPrice: 1794,
        anchorDate: '2003-03-19',
        pivotalEvent: 'LME pre-war settlement',
      },
    ],
    consumerGoods: [],
  },
}

/**
 * Utility: compute changePct for all anchors at runtime.
 * Call once on import to hydrate the changePct field.
 */
export function hydrateChangePct(anchors: WarPriceAnchors): WarPriceAnchors {
  const hydrate = (items: PriceAnchor[]) =>
    items.map((a) => ({
      ...a,
      changePct:
        a.prePrice > 0
          ? Math.round(((a.postPrice - a.prePrice) / a.prePrice) * 1000) / 10
          : null,
    }))
  return {
    ...anchors,
    commodities: hydrate(anchors.commodities),
    consumerGoods: hydrate(anchors.consumerGoods),
  }
}

/** Get anchors for a war with changePct computed. */
export function getWarAnchors(warId: string): WarPriceAnchors | null {
  const raw = PRE_ESCALATION_PRICES[warId]
  if (!raw) return null
  return hydrateChangePct(raw)
}
```

## A2. Update src/data/fallback-prices.ts

Replace the current static prices with the current post-escalation
prices sourced from the ukraine-russia and iran-israel-us entries
above (most recent conflict = most current prices). Add an
`asOfNote` field explaining provenance:

```ts
export const FALLBACK_PRICES: Record<
  string,
  { price: number; label: string; unit: string; exchange: string; asOf: string; asOfNote: string }
> = {
  brent:  { price: 91.17,  label: 'Brent Crude',    unit: 'USD/bbl',   exchange: 'ICE London',  asOf: '28 Mar 2024', asOfNote: 'Last known close before Iran-Israel escalation. Hardcoded pending live API.' },
  natgas: { price: 3.85,   label: 'Natural Gas',     unit: 'USD/mmbtu', exchange: 'NYMEX',       asOf: '24 Mar 2025', asOfNote: 'NYMEX benchmark. Hardcoded pending live API.' },
  gold:   { price: 3022,   label: 'Gold',            unit: 'USD/troy oz',exchange: 'LBMA London', asOf: '28 Mar 2024', asOfNote: 'LBMA PM fix near Iran-Israel escalation. Hardcoded.' },
  copper: { price: 9410,   label: 'Copper',          unit: 'USD/mt',    exchange: 'LME London',  asOf: '28 Mar 2024', asOfNote: 'LME settlement. Hardcoded pending live API.' },
  alum:   { price: 2315,   label: 'Aluminium',       unit: 'USD/mt',    exchange: 'LME London',  asOf: '28 Mar 2024', asOfNote: 'LME settlement. Hardcoded pending live API.' },
  urea:   { price: 338,    label: 'Urea (Fert.)',    unit: 'USD/mt',    exchange: 'OTC·WB',      asOf: 'Mar 2024',    asOfNote: 'World Bank Pink Sheet. Updated monthly when WB publishes.' },
}
```

## A3. Create WarEscalationCard component

Create src/components/simulator/war-escalation-card.tsx.

This replaces the shock badge chips on the simulator. It shows large
side-by-side cards: Pre-Escalation | Post-Escalation.

The component receives:
  warId: string
  warName: string
  escalationDate: string
  pivotalEvent: string
  selectedCountry: string | null
  currencyCode: string | null   (from CURRENCIES[warId][country]?.code)
  fxDepPct: number | null       (from CURRENCIES[warId][country]?.depPct)
  isSelected: boolean
  onClick: () => void

Logic:
1. Call `getWarAnchors(warId)` to get the price data
2. Pick the top 4 commodities by absolute changePct (descending)
   and the top 2 consumer goods entries (if any exist for this war)
3. Render a card with:
   - Header row: war name + escalation score badge + "LIVE" badge if live
     + pivotal event date and one-sentence description
   - Two-column grid below:
     LEFT: "Before [escalationDate]" column — prePrice with unit
     RIGHT: "After" column — postPrice + changePct badge (green if
            changePct < 0 meaning price dropped, red if positive)
   - If selectedCountry is set, add a third row beneath the commodity
     prices: "Your currency ([code]): [preRate] → [postRate] = [depPct]%"
     Use CURRENCIES data for this. Pull it from props, don't import
     CURRENCIES inside this component.
   - Footer: "Prices as of [anchorDate] · Hardcoded benchmark · Live API pending"
     in muted text

Styling: use existing Tailwind classes. The card should be visually
larger and more prominent than the current chip/badge row. Selected
state: add a ring-2 ring-accent border. Hover state: shadow-md.

## A4. Update the simulator to use WarEscalationCard

In src/components/simulator/simulator-client.tsx (or wherever the
war selector is rendered — check the file first):

- Find where WARS is iterated to render war options
- Replace that section with the new WarEscalationCard components
  sorted by escalationScore descending (escalationScore is added
  in the previous Claude Code prompt — check if it exists in wars.ts
  first; if not, use this inline fallback order:
  'iran-israel-us' > 'ukraine-russia' > 'gaza-2023' > 'covid' > 'gulf-2003')
- Pass the relevant currency data as props (look up
  CURRENCIES[warId][selectedCountry] and pass code + depPct)

───────────────────────────────────────────────────────
FEATURE B — USER DATA REFINEMENT PANEL
(Let users add their own values to improve calculations,
including new countries with no existing data)
───────────────────────────────────────────────────────

## B1. Create src/types/user-refinements.ts

```ts
/**
 * User-supplied data refinements.
 * Stored in localStorage under key 'hiyu_refinements_v1'.
 * These overlay or extend the static data in src/data/ without
 * modifying it. The calculation engine reads these at runtime.
 */

export type RefinementSource = 'user' | 'community'  // community reserved for later

export interface CommodityRefinement {
  /** Commodity id matching fallback-prices.ts keys */
  commodityId: string
  /** User-supplied current price */
  currentPrice: number
  /** Optional: user-supplied pre-escalation price for a specific war */
  prePrice?: number
  /** Which war this pre-price applies to */
  warId?: string
  note?: string
  updatedAt: string   // ISO
  source: RefinementSource
}

export interface CategoryImpactRefinement {
  /** Country name (existing) or new country name */
  country: string
  /** Category id */
  categoryId: string
  /** War id */
  warId: string
  /** User-estimated impact % (e.g. 12.5 means +12.5%) */
  impactPct: number
  note?: string
  updatedAt: string
  source: RefinementSource
}

export interface FxRefinement {
  country: string
  warId: string
  /** User-supplied pre-war exchange rate (local currency per 1 USD) */
  preRate: number
  /** User-supplied current / post-war exchange rate */
  postRate: number
  currencyCode: string
  currencyName: string
  note?: string
  updatedAt: string
  source: RefinementSource
}

export interface NewCountryRefinement {
  /** User-defined country name */
  country: string
  /** Flag emoji */
  flag: string
  /** Coverage level the user claims */
  coverage: 'user-supplied'
  /** User-defined median monthly salary in USD */
  medianMonthlySalaryUSD?: number
  note?: string
  createdAt: string
  source: RefinementSource
}

export interface UserRefinements {
  version: 1
  commodities: CommodityRefinement[]
  categoryImpacts: CategoryImpactRefinement[]
  fxRates: FxRefinement[]
  newCountries: NewCountryRefinement[]
  lastUpdated: string
}

export const EMPTY_REFINEMENTS: UserRefinements = {
  version: 1,
  commodities: [],
  categoryImpacts: [],
  fxRates: [],
  newCountries: [],
  lastUpdated: new Date().toISOString(),
}
```

## B2. Create src/lib/user-refinements.ts

```ts
/**
 * Read/write/merge user refinements from localStorage.
 * Safe to call on server (returns empty if window is undefined).
 */

import type { UserRefinements, CategoryImpactRefinement, FxRefinement } from '@/types/user-refinements'
import { EMPTY_REFINEMENTS } from '@/types/user-refinements'

const STORAGE_KEY = 'hiyu_refinements_v1'

export function loadRefinements(): UserRefinements {
  if (typeof window === 'undefined') return EMPTY_REFINEMENTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_REFINEMENTS
    const parsed = JSON.parse(raw)
    if (parsed.version !== 1) return EMPTY_REFINEMENTS
    return parsed as UserRefinements
  } catch {
    return EMPTY_REFINEMENTS
  }
}

export function saveRefinements(r: UserRefinements): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...r, lastUpdated: new Date().toISOString() }))
}

export function clearRefinements(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

/** Find a user-supplied impact % for a country/category/war. Returns null if none. */
export function findImpactRefinement(
  r: UserRefinements,
  country: string,
  categoryId: string,
  warId: string,
): CategoryImpactRefinement | null {
  return r.categoryImpacts.find(
    (x) => x.country === country && x.categoryId === categoryId && x.warId === warId
  ) ?? null
}

/** Find user-supplied FX rate for a country/war. Returns null if none. */
export function findFxRefinement(
  r: UserRefinements,
  country: string,
  warId: string,
): FxRefinement | null {
  return r.fxRates.find((x) => x.country === country && x.warId === warId) ?? null
}

/** All countries available: built-in list + user-added ones. */
export function getAllCountries(r: UserRefinements): string[] {
  const userAdded = r.newCountries.map((c) => c.country)
  return [...userAdded]  // caller merges with COUNTRIES list
}
```

## B3. Update src/lib/calculations.ts

Modify `computeScenario` and `computeBasket` to accept an optional
`refinements: UserRefinements` parameter (default: EMPTY_REFINEMENTS).

In `computeScenario`:
- After finding `entry` via `findCountryEntry`, check
  `findImpactRefinement(refinements, state.country, state.category, state.war)`.
  If a refinement exists, use its `impactPct` as the `ceiling` value
  instead of `entry.p`. Log a console note so it's auditable.
- Add a `userRefined: boolean` flag to `ScenarioResult` in
  src/types/scenario.ts. Set it to true when a refinement overrides
  the static value. Display a small "User data" badge wherever
  `userRefined` is true.

In `computeBasket`:
- Pass refinements through. For each category, check for a refinement
  and use it if found.

The signature change:
```ts
export function computeScenario(
  state: ScenarioState,
  mode: PrecisionMode = 'display',
  refinements: UserRefinements = EMPTY_REFINEMENTS,
): ScenarioResult | null
```

## B4. Update src/types/scenario.ts

Add `userRefined?: boolean` to `ScenarioResult`.

## B5. Create src/components/simulator/refinement-panel.tsx

This is a slide-out drawer (or collapsible section) in the simulator.
Trigger: a small "✏ Refine data" button below the simulator controls,
visible but unobtrusive. It opens a panel with three tabs:

TAB 1 — "Commodity Prices"
  For each commodity in FALLBACK_PRICES, show:
  - Name + current hardcoded price + exchange + asOf date
  - An input field for the user to enter a current price
  - A "clear" ×  button to remove the override
  - A note: "Override the hardcoded price with what you know today"
  - Show "⚠ Hardcoded — live API pending" label on each row

TAB 2 — "Category Impacts"
  Three dropdowns at top: Country (with "+ Add new country" option),
  Category, War.
  Below: a single number input labeled "Estimated price impact (%)"
  and a text field for "Source / note (optional)".
  Submit button: "Save refinement".
  Below the form: a list of all saved category refinements with a
  delete button on each.

  When user selects "+ Add new country" in the Country dropdown:
  Show additional fields: Country name, Flag emoji, Currency code,
  Currency name, Pre-war rate (local per USD), Current rate,
  Optional: median monthly salary in USD.
  Submit button: "Add country".
  After adding, the new country appears in the country dropdown in
  the main simulator with a "User-added" badge.

TAB 3 — "FX Rates"
  Dropdown: Country, War.
  Two inputs: Pre-war rate, Current rate.
  Currency code + name inputs (auto-filled from CURRENCIES if country
  is known).
  Note field.
  Submit: "Save FX refinement".
  List of saved FX refinements with delete.

State: all reads/writes go through `loadRefinements()` /
`saveRefinements()`. The panel is a client component. It should call
a callback prop `onRefinementsChange(r: UserRefinements)` whenever
anything is saved so the parent simulator re-renders with the new data.

UX details:
- The panel should NOT feel like an admin tool. Copy should say:
  "You know your market better than our model does. Add what you know
  and we'll use it in the calculation — clearly labelled."
- Each saved refinement shows a "🔵 User data" tag in the simulator
  results wherever it's being used.
- A "Export my data" button that downloads the refinements as JSON.
- A "Clear all my data" button with a confirmation step.
- No sign-in required. No server call. Pure localStorage.

## B6. Wire refinement-panel into the simulator

In src/components/simulator/simulator-client.tsx:

1. Import `loadRefinements`, `saveRefinements` from '@/lib/user-refinements'
2. Add state: `const [refinements, setRefinements] = useState(() => loadRefinements())`
3. Add an `onRefinementsChange` handler that calls `setRefinements` and `saveRefinements`
4. Pass `refinements` to `computeScenario` and `computeBasket` calls
5. Render `<RefinementPanel refinements={refinements} onRefinementsChange={onRefinementsChange} />`
   below the existing simulator controls
6. In the country dropdown, merge `COUNTRIES` with `refinements.newCountries`
   and mark user-added ones with a "(user)" suffix in the option label

───────────────────────────────────────────────────────
FINAL STEPS
───────────────────────────────────────────────────────

1. Run: npm run build
   Fix all TypeScript errors. No `any`. No ts-ignore.

2. Run: npm run dev
   Open /simulator and verify:
   - War cards show Pre/Post price columns with anchor dates
   - The "✏ Refine data" button opens the panel
   - Adding a category impact refinement changes the simulator result
     and shows a "User data" badge
   - Adding a new country makes it selectable in the main dropdown

3. Run: npx vitest run
   All 37 existing tests must still pass.
   If any break due to the new `refinements` parameter, update the
   test calls to pass `EMPTY_REFINEMENTS` as the third argument —
   do not change the test expectations.

4. Commit with message:
   "feat: pre-escalation price anchors + user data refinement panel"
