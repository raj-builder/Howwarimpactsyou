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
  const hydrate = (items: PriceAnchor[]): PriceAnchor[] =>
    items.map((a) => ({
      ...a,
      changePct:
        a.prePrice > 0
          ? Math.round(((a.postPrice - a.prePrice) / a.prePrice) * 1000) / 10
          : undefined,
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
