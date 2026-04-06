/**
 * Fuel security calculation functions.
 *
 * All functions are pure (no side effects), deterministic for the same inputs,
 * and documented with their formula source. Each function that produces a
 * number shown in the UI has a corresponding test in
 * src/lib/__tests__/fuel-calculations.test.ts.
 */

import type {
  CountryFuelProfile,
  FuelSecurityResult,
  FuelAlertLevel,
  FuelScoreFactor,
  RouteRiskResult,
} from '@/types/fuel-security'

/* ── Named constants (CLAUDE.md §2: no magic numbers) ────────── */

/**
 * Maximum points for each factor in the vulnerability score.
 * Reserve days is weighted highest (35%) because it is the most
 * immediate constraint on whether a country can fuel flights.
 * Sum: 35 + 25 + 25 + 15 = 100
 */
const RESERVE_MAX_POINTS = 35
const IMPORT_DEPENDENCY_MAX_POINTS = 25
const HORMUZ_EXPOSURE_MAX_POINTS = 25
const REFINING_MAX_POINTS = 15

/**
 * IEA recommends 90-day minimum reserves. Countries below 30 days
 * are considered critically vulnerable. Above 180 days provides
 * substantial buffer even under extended disruption.
 */
const RESERVE_CRITICAL_DAYS = 30
const RESERVE_SAFE_DAYS = 180

/**
 * Alert level thresholds on the composite 0-100 vulnerability score.
 * Derived from analysis of IEA emergency response tiers.
 */
const ALERT_CRITICAL_THRESHOLD = 70
const ALERT_HIGH_THRESHOLD = 50
const ALERT_MODERATE_THRESHOLD = 30

/* ── Reserve Days Score ─────────────────────────────────────── */

/**
 * Compute reserve-days contribution to vulnerability score.
 *
 * Formula: Linear interpolation between RESERVE_SAFE_DAYS (0 points)
 * and RESERVE_CRITICAL_DAYS (max points). Below critical → max.
 * Above safe → 0.
 *
 * Source: IEA recommends 90-day minimum for member states.
 * Countries below 30 days face immediate supply risk.
 *
 * @param reserveDays - Strategic petroleum reserve in days of consumption
 * @returns Points from 0 to RESERVE_MAX_POINTS
 */
export function computeReserveScore(reserveDays: number): number {
  if (reserveDays <= RESERVE_CRITICAL_DAYS) return RESERVE_MAX_POINTS
  if (reserveDays >= RESERVE_SAFE_DAYS) return 0
  const range = RESERVE_SAFE_DAYS - RESERVE_CRITICAL_DAYS
  return RESERVE_MAX_POINTS * (RESERVE_SAFE_DAYS - reserveDays) / range
}

/**
 * Compute import-dependency contribution to vulnerability score.
 *
 * Formula: (importDependencyPct / 100) * IMPORT_DEPENDENCY_MAX_POINTS
 * A country that imports 100% of its oil gets full points.
 *
 * Source: EIA, IEA import dependency data.
 *
 * @param importDependencyPct - Percentage of oil that is imported (0-100)
 * @returns Points from 0 to IMPORT_DEPENDENCY_MAX_POINTS
 */
export function computeImportDependencyScore(importDependencyPct: number): number {
  return (Math.min(Math.max(importDependencyPct, 0), 100) / 100) * IMPORT_DEPENDENCY_MAX_POINTS
}

/**
 * Compute Hormuz-exposure contribution to vulnerability score.
 *
 * Formula: (hormuzExposurePct / 100) * HORMUZ_EXPOSURE_MAX_POINTS
 * A country whose entire oil supply transits Hormuz gets full points.
 *
 * Source: Zero Carbon Analytics Hormuz dependency index.
 *
 * @param hormuzExposurePct - Percentage of imports transiting Hormuz (0-100)
 * @returns Points from 0 to HORMUZ_EXPOSURE_MAX_POINTS
 */
export function computeHormuzExposureScore(hormuzExposurePct: number): number {
  return (Math.min(Math.max(hormuzExposurePct, 0), 100) / 100) * HORMUZ_EXPOSURE_MAX_POINTS
}

/**
 * Compute refining-capacity contribution to vulnerability score.
 *
 * Formula: Inverse of refining capacity as percentage of consumption.
 * Countries that refine less than 100% of their consumption domestically
 * are more vulnerable because they depend on imported refined products.
 * Capped at 100 — capacity above 100% (e.g. Singapore at 200%) scores 0.
 *
 * Source: BP Statistical Review.
 *
 * @param refiningCapacityPct - Domestic refining capacity as % of consumption
 * @returns Points from 0 to REFINING_MAX_POINTS
 */
export function computeRefiningScore(refiningCapacityPct: number): number {
  const capped = Math.min(Math.max(refiningCapacityPct, 0), 100)
  return ((100 - capped) / 100) * REFINING_MAX_POINTS
}

/**
 * Derive alert level from composite vulnerability score.
 *
 * CRITICAL: score >= 70 (reserves < 30d AND high import dependency)
 * HIGH:     score >= 50
 * MODERATE: score >= 30
 * LOW:      score < 30
 *
 * @param score - Composite vulnerability score (0-100)
 * @returns Alert level string
 */
export function computeFuelAlertLevel(score: number): FuelAlertLevel {
  if (score >= ALERT_CRITICAL_THRESHOLD) return 'critical'
  if (score >= ALERT_HIGH_THRESHOLD) return 'high'
  if (score >= ALERT_MODERATE_THRESHOLD) return 'moderate'
  return 'low'
}

/**
 * Estimate days until fuel reserves are depleted under a full
 * Hormuz disruption scenario.
 *
 * Formula:
 *   effectiveDisruptionShare = (hormuzExposurePct / 100) * (importDependencyPct / 100)
 *   depletionDays = strategicReserveDays / effectiveDisruptionShare
 *
 * Interpretation: Reserves are consumed at a rate proportional to
 * how much of the country's oil supply was disrupted. If 53% of
 * imports transit Hormuz and 90% is imported, then 47.7% of total
 * supply is cut. Reserves must cover that gap.
 *
 * Edge case: If effectiveDisruptionShare is 0 (no Hormuz dependency
 * or no imports), returns Infinity — the country is not affected.
 *
 * @param profile - Country fuel security profile
 * @returns Estimated days until depletion (may be Infinity)
 */
export function estimateDepletionDays(profile: CountryFuelProfile): number {
  const effectiveDisruptionShare =
    (profile.hormuzExposurePct / 100) * (profile.importDependencyPct / 100)
  if (effectiveDisruptionShare === 0) return Infinity
  return profile.strategicReserveDays / effectiveDisruptionShare
}

/**
 * Compute the overall fuel security vulnerability result for a country.
 *
 * Aggregates all four factor scores into a composite 0-100 score,
 * derives an alert level from thresholds, and estimates depletion days.
 *
 * @param profile - The country's fuel security profile data
 * @returns FuelSecurityResult with alert level, score, and factor breakdown
 */
export function computeFuelSecurity(profile: CountryFuelProfile): FuelSecurityResult {
  const reservePoints = computeReserveScore(profile.strategicReserveDays)
  const importPoints = computeImportDependencyScore(profile.importDependencyPct)
  const hormuzPoints = computeHormuzExposureScore(profile.hormuzExposurePct)
  const refiningPoints = computeRefiningScore(profile.refiningCapacityPct)

  const vulnerabilityScore = Math.round(
    (reservePoints + importPoints + hormuzPoints + refiningPoints) * 10
  ) / 10

  const factors: FuelScoreFactor[] = [
    {
      label: 'Reserve days',
      points: Math.round(reservePoints * 10) / 10,
      maxPoints: RESERVE_MAX_POINTS,
      description: `${profile.strategicReserveDays} days of strategic reserves (IEA recommends 90+)`,
    },
    {
      label: 'Import dependency',
      points: Math.round(importPoints * 10) / 10,
      maxPoints: IMPORT_DEPENDENCY_MAX_POINTS,
      description: `${profile.importDependencyPct}% of oil is imported`,
    },
    {
      label: 'Hormuz exposure',
      points: Math.round(hormuzPoints * 10) / 10,
      maxPoints: HORMUZ_EXPOSURE_MAX_POINTS,
      description: `${profile.hormuzExposurePct}% of imports transit the Strait of Hormuz`,
    },
    {
      label: 'Refining capacity',
      points: Math.round(refiningPoints * 10) / 10,
      maxPoints: REFINING_MAX_POINTS,
      description: `Domestic refining covers ${profile.refiningCapacityPct}% of consumption`,
    },
  ]

  return {
    countryId: profile.countryId,
    alertLevel: computeFuelAlertLevel(vulnerabilityScore),
    vulnerabilityScore,
    estimatedDepletionDays: Math.round(estimateDepletionDays(profile)),
    factors,
  }
}

/**
 * Compute flight route impact percentage.
 *
 * Formula: (postPrice - prePrice) / prePrice * 100
 *
 * @param prePrice - Pre-crisis ticket price
 * @param postPrice - Post-crisis ticket price
 * @returns Percentage change (positive = more expensive)
 */
export function computeFlightImpactPct(prePrice: number, postPrice: number): number {
  if (prePrice === 0) return 0
  return Math.round(((postPrice - prePrice) / prePrice) * 1000) / 10
}

/**
 * Sort countries by vulnerability score descending (most vulnerable first).
 *
 * @param results - Array of FuelSecurityResult objects
 * @returns New array sorted by vulnerabilityScore descending
 */
export function rankByVulnerability(results: FuelSecurityResult[]): FuelSecurityResult[] {
  return [...results].sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore)
}

/* ── Route Risk Assessment ──────────────────────────────────── */

/**
 * Weights for route risk calculation.
 *
 * Without layover: origin 70%, destination 30%.
 * With layover: origin 50%, layover 30%, destination 20%.
 *
 * Origin is weighted highest because aircraft fuel at departure.
 * Layover is a secondary fueling point (refuel stop or connecting flight).
 * Destination matters for return trip fuel availability.
 *
 * Source: Industry convention — airlines fuel at origin where possible;
 * layover airports are common refueling points on long-haul routes;
 * destination fuel matters for return leg and diversions.
 */
const ROUTE_RISK_ORIGIN_WEIGHT = 0.70
const ROUTE_RISK_ORIGIN_WEIGHT_WITH_LAYOVER = 0.50
const ROUTE_RISK_LAYOVER_WEIGHT = 0.30
const ROUTE_RISK_DEST_WEIGHT_WITH_LAYOVER = 0.20

/**
 * Surcharge range boundaries by risk tier.
 * Derived from observed data across our 10 pre-researched routes:
 *   - Operating routes: 38-71% surcharge (median ~50%)
 *   - Rerouted routes: 58-167% surcharge (median ~65%)
 *   - Reduced routes: 45-58% surcharge
 *   - Suspended routes: N/A (flights cancelled)
 *
 * Tiers map composite risk score → estimated surcharge percentage range.
 */
const SURCHARGE_TIERS: { minScore: number; lowPct: number; highPct: number }[] = [
  { minScore: 70, lowPct: 60, highPct: 150 },  // critical
  { minScore: 50, lowPct: 35, highPct: 80 },   // high
  { minScore: 30, lowPct: 15, highPct: 45 },   // moderate
  { minScore: 0,  lowPct: 5,  highPct: 20 },   // low
]

/**
 * Estimate fuel surcharge range based on route risk score.
 *
 * Formula: Lookup into SURCHARGE_TIERS — first tier whose minScore
 * is <= the route risk score determines the range.
 *
 * Source: Empirical ranges from our 10 pre-researched routes
 * (38-167% observed, bucketed into 4 tiers).
 *
 * @param routeRiskScore - Composite route risk score (0-100)
 * @returns Low and high surcharge estimates as percentages
 */
export function estimateSurchargeRange(routeRiskScore: number): { lowPct: number; highPct: number } {
  for (const tier of SURCHARGE_TIERS) {
    if (routeRiskScore >= tier.minScore) {
      return { lowPct: tier.lowPct, highPct: tier.highPct }
    }
  }
  return { lowPct: 5, highPct: 20 }
}

/**
 * Compute fuel risk for a route from origin country to destination country,
 * optionally via a layover country.
 *
 * Formula (no layover):
 *   score = originScore × 0.70 + destScore × 0.30
 *
 * Formula (with layover):
 *   score = originScore × 0.50 + layoverScore × 0.30 + destScore × 0.20
 *
 * If only some profiles are available, uses what's available with
 * reduced confidence.
 *
 * The confidence is upgraded to 'verified' by the caller if an exact
 * route match is found in the pre-researched data.
 *
 * @param originResult - FuelSecurityResult for origin country (or null)
 * @param destResult - FuelSecurityResult for destination country (or null)
 * @param layoverResult - FuelSecurityResult for layover country (or null, optional)
 * @returns RouteRiskResult with score, alert level, confidence, and surcharge range
 */
export function computeRouteRisk(
  originResult: FuelSecurityResult | null,
  destResult: FuelSecurityResult | null,
  layoverResult?: FuelSecurityResult | null,
): RouteRiskResult {
  let score: number
  let confidence: RouteRiskResult['confidence']
  let originScore: number | undefined
  let destinationScore: number | undefined
  let layoverScore: number | undefined

  const hasLayover = layoverResult != null

  if (originResult && destResult) {
    originScore = originResult.vulnerabilityScore
    destinationScore = destResult.vulnerabilityScore

    if (hasLayover) {
      layoverScore = layoverResult.vulnerabilityScore
      score = Math.round(
        (originScore * ROUTE_RISK_ORIGIN_WEIGHT_WITH_LAYOVER +
          layoverScore * ROUTE_RISK_LAYOVER_WEIGHT +
          destinationScore * ROUTE_RISK_DEST_WEIGHT_WITH_LAYOVER) * 10
      ) / 10
    } else {
      score = Math.round(
        (originScore * ROUTE_RISK_ORIGIN_WEIGHT +
          destinationScore * (1 - ROUTE_RISK_ORIGIN_WEIGHT)) * 10
      ) / 10
    }
    confidence = 'indicative'
  } else if (originResult) {
    originScore = originResult.vulnerabilityScore
    score = originScore
    confidence = 'limited'
  } else if (destResult) {
    destinationScore = destResult.vulnerabilityScore
    score = destinationScore
    confidence = 'limited'
  } else {
    score = 0
    confidence = 'limited'
  }

  return {
    score,
    alertLevel: computeFuelAlertLevel(score),
    confidence,
    surchargeRange: estimateSurchargeRange(score),
    originScore,
    destinationScore,
  }
}
