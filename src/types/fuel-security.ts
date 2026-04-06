import type { WarId } from './index'

/* ── Alert Level ──────────────────────────────────────────────── */

/**
 * Four-tier alert system for fuel security.
 * Derived algorithmically from reserve days, import dependency,
 * and Hormuz exposure. See computeFuelAlertLevel() in fuel-calculations.ts.
 */
export type FuelAlertLevel = 'critical' | 'high' | 'moderate' | 'low'

/* ── Country Fuel Security Profile ────────────────────────────── */

/**
 * Raw, researched data about a country's fuel security posture.
 * Each field is sourced from EIA, IEA, or national reports.
 * This is the input to the vulnerability scoring function.
 */
export interface CountryFuelProfile {
  /** Country ID matching COUNTRIES[].id in countries.ts */
  countryId: string
  /** Daily oil consumption in barrels per day (b/d). Source: EIA 2024. */
  oilConsumptionBpd: number
  /** Percentage of oil that is imported (0-100). Source: IEA. */
  importDependencyPct: number
  /** Percentage of imports that transit the Strait of Hormuz (0-100). Source: Zero Carbon Analytics, IEA. */
  hormuzExposurePct: number
  /** Strategic Petroleum Reserve in days of consumption. Source: IEA member reports, national data. */
  strategicReserveDays: number
  /** Estimated jet-fuel-specific reserve in days (subset of SPR). Null if unknown. */
  jetFuelReserveDays: number | null
  /** Domestic refining capacity as % of consumption. Source: BP Statistical Review 2024. */
  refiningCapacityPct: number
  /** Data source citations displayed in UI attribution. */
  sources: string[]
  /** ISO date when this data was last verified. */
  dataAsOf: string
}

/* ── Fuel Security Score Result ───────────────────────────────── */

/**
 * Computed output from the vulnerability scoring algorithm.
 * Produced by computeFuelSecurity() in fuel-calculations.ts.
 */
export interface FuelSecurityResult {
  countryId: string
  alertLevel: FuelAlertLevel
  /** Composite score 0-100 where 100 = most vulnerable. */
  vulnerabilityScore: number
  /** Estimated days until reserves are depleted under full Hormuz disruption. */
  estimatedDepletionDays: number
  /** Breakdown of how each factor contributed to the score. */
  factors: FuelScoreFactor[]
}

export interface FuelScoreFactor {
  label: string
  /** Contribution to the composite score. All factors sum to vulnerabilityScore. */
  points: number
  /** Maximum possible points for this factor. */
  maxPoints: number
  /** Plain-language explanation of what this factor measures. */
  description: string
}

/* ── Flight Route ─────────────────────────────────────────────── */

/**
 * A specific airline route impacted by the fuel crisis.
 * Keyed by WarId in the FLIGHT_ROUTES record.
 */
export interface FlightRoute {
  id: string
  /** IATA codes: e.g. "DEL-DXB" */
  routeCode: string
  /** Human-readable label: e.g. "Delhi to Dubai" */
  label: string
  originCountryId: string
  destinationCountryId: string
  /** Airline operating this route */
  airline: string
  /** Pre-crisis price in local currency */
  prePrice: number
  /** Current/post-crisis price in local currency */
  postPrice: number
  /** ISO currency code */
  currency: string
  /** Percentage price change */
  changePct: number
  /** Current operational status */
  status: 'operating' | 'suspended' | 'rerouted' | 'reduced'
  /** Short note explaining the impact, with source */
  note: string
  /** Whether the route passes through or refuels in a high-risk fuel zone */
  passesHighRiskZone: boolean
  /** URL to the source article for this data point */
  sourceUrl: string
}

/* ── Airline Impact ───────────────────────────────────────────── */

/**
 * Summary of how a specific airline is affected by the fuel crisis.
 */
export interface AirlineImpact {
  airline: string
  /** Country where the airline is headquartered */
  baseCountryId: string
  flag: string
  /** Plain-language summary of impact */
  impact: string
  /** Alert level for this airline's fuel situation */
  alertLevel: FuelAlertLevel
  /** Source URL for this claim */
  sourceUrl: string
}

/* ── Data container types ─────────────────────────────────────── */

export type FlightRoutesMap = Partial<Record<WarId, FlightRoute[]>>
export type AirlineImpactsMap = Partial<Record<WarId, AirlineImpact[]>>

/* ── Route Risk Assessment ───────────────────────────────────── */

/**
 * Confidence level for a route risk assessment.
 * - verified: Exact route match found in pre-researched data
 * - indicative: Computed from origin + destination country profiles
 * - limited: One or both countries lack a fuel profile
 */
export type RouteRiskConfidence = 'verified' | 'indicative' | 'limited'

/**
 * Result of assessing fuel risk for an origin → destination route.
 * Produced by computeRouteRisk() in fuel-calculations.ts.
 */
export interface RouteRiskResult {
  /** Composite risk score 0-100 (higher = riskier) */
  score: number
  alertLevel: FuelAlertLevel
  confidence: RouteRiskConfidence
  /** Estimated fuel surcharge range as percentage of base fare */
  surchargeRange: { lowPct: number; highPct: number }
  /** If an exact pre-researched route was found, it is attached here */
  matchedRoute?: FlightRoute
  /** Origin country vulnerability score (if profile available) */
  originScore?: number
  /** Destination country vulnerability score (if profile available) */
  destinationScore?: number
}

/* ── Weekly Digest types ──────────────────────────────────────── */

/** A news article from GDELT, used in the 7-day fuel digest. */
export interface NewsArticle {
  title: string
  url: string
  source: string
  /** ISO date string */
  publishedAt: string
  /** Relevance tag derived from keyword matching */
  tag: 'fuel-price' | 'rationing' | 'aviation' | 'hormuz' | 'general'
}

/** A single price data point from the EIA Open Data API. */
export interface FuelPriceTick {
  /** EIA series ID, e.g. 'RBRTE_D' (Brent) or 'RJET_NUS_D' (jet fuel) */
  series: string
  label: string
  /** Price in dollars per barrel */
  value: number
  /** ISO date of the price observation */
  period: string
  unit: string
}

/** Response shape from /api/fuel-digest */
export interface FuelDigestResponse {
  articles: NewsArticle[]
  prices: FuelPriceTick[]
  /** ISO timestamp of when this data was fetched server-side */
  fetchedAt: string
}
