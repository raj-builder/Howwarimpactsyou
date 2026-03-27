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
