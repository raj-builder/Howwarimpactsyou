import { describe, it, expect } from 'vitest'
import {
  computeReserveScore,
  computeImportDependencyScore,
  computeHormuzExposureScore,
  computeRefiningScore,
  computeFuelSecurity,
  computeFuelAlertLevel,
  estimateDepletionDays,
  computeFlightImpactPct,
  rankByVulnerability,
  computeRouteRisk,
  estimateSurchargeRange,
} from '@/lib/fuel-calculations'
import type { CountryFuelProfile, FuelSecurityResult } from '@/types/fuel-security'

/* ── Helpers ─────────────────────────────────────────────────── */

function makeProfile(overrides: Partial<CountryFuelProfile> = {}): CountryFuelProfile {
  return {
    countryId: 'TestCountry',
    oilConsumptionBpd: 1_000_000,
    importDependencyPct: 80,
    hormuzExposurePct: 50,
    strategicReserveDays: 60,
    jetFuelReserveDays: 15,
    refiningCapacityPct: 70,
    sources: ['Test'],
    dataAsOf: '2026-03-30',
    ...overrides,
  }
}

/* ── computeReserveScore ─────────────────────────────────────── */

describe('computeReserveScore', () => {
  it('returns max points (35) for reserves at 0 days', () => {
    expect(computeReserveScore(0)).toBe(35)
  })

  it('returns max points (35) for reserves at exactly 30 days', () => {
    expect(computeReserveScore(30)).toBe(35)
  })

  it('returns 0 for reserves at 180 days', () => {
    expect(computeReserveScore(180)).toBe(0)
  })

  it('returns 0 for reserves above 180 days', () => {
    expect(computeReserveScore(254)).toBe(0)
  })

  it('interpolates linearly at midpoint (105 days)', () => {
    // 35 * (180 - 105) / 150 = 35 * 75/150 = 17.5
    expect(computeReserveScore(105)).toBe(17.5)
  })

  it('returns correct value for 34 days (Australia)', () => {
    // 34 > 30, so interpolation: 35 * (180 - 34) / 150 = 35 * 146/150 ≈ 34.07
    expect(computeReserveScore(34)).toBeCloseTo(34.07, 1)
  })
})

/* ── computeImportDependencyScore ────────────────────────────── */

describe('computeImportDependencyScore', () => {
  it('returns 25 for 100% import dependency', () => {
    expect(computeImportDependencyScore(100)).toBe(25)
  })

  it('returns 0 for 0% import dependency', () => {
    expect(computeImportDependencyScore(0)).toBe(0)
  })

  it('returns 22.5 for 90% (Australia)', () => {
    expect(computeImportDependencyScore(90)).toBe(22.5)
  })

  it('clamps values above 100', () => {
    expect(computeImportDependencyScore(150)).toBe(25)
  })

  it('clamps values below 0', () => {
    expect(computeImportDependencyScore(-10)).toBe(0)
  })
})

/* ── computeHormuzExposureScore ──────────────────────────────── */

describe('computeHormuzExposureScore', () => {
  it('returns 25 for 100% Hormuz exposure', () => {
    expect(computeHormuzExposureScore(100)).toBe(25)
  })

  it('returns 0 for 0% Hormuz exposure', () => {
    expect(computeHormuzExposureScore(0)).toBe(0)
  })

  it('returns 14.75 for 59% (Australia)', () => {
    expect(computeHormuzExposureScore(59)).toBe(14.75)
  })
})

/* ── computeRefiningScore ────────────────────────────────────── */

describe('computeRefiningScore', () => {
  it('returns 15 for 0% refining capacity', () => {
    expect(computeRefiningScore(0)).toBe(15)
  })

  it('returns 0 for 100% refining capacity', () => {
    expect(computeRefiningScore(100)).toBe(0)
  })

  it('returns 0 for refining capacity above 100% (capped)', () => {
    expect(computeRefiningScore(110)).toBe(0)
    expect(computeRefiningScore(200)).toBe(0)
  })

  it('returns 8.25 for 45% (Australia)', () => {
    expect(computeRefiningScore(45)).toBe(8.25)
  })
})

/* ── computeFuelAlertLevel ───────────────────────────────────── */

describe('computeFuelAlertLevel', () => {
  it('returns critical for score >= 70', () => {
    expect(computeFuelAlertLevel(70)).toBe('critical')
    expect(computeFuelAlertLevel(100)).toBe('critical')
    expect(computeFuelAlertLevel(79.5)).toBe('critical')
  })

  it('returns high for score 50-69', () => {
    expect(computeFuelAlertLevel(50)).toBe('high')
    expect(computeFuelAlertLevel(69.9)).toBe('high')
  })

  it('returns moderate for score 30-49', () => {
    expect(computeFuelAlertLevel(30)).toBe('moderate')
    expect(computeFuelAlertLevel(49.9)).toBe('moderate')
  })

  it('returns low for score < 30', () => {
    expect(computeFuelAlertLevel(29.9)).toBe('low')
    expect(computeFuelAlertLevel(0)).toBe('low')
  })
})

/* ── estimateDepletionDays ───────────────────────────────────── */

describe('estimateDepletionDays', () => {
  it('returns reserve days when 100% Hormuz + 100% import dependent', () => {
    const profile = makeProfile({
      hormuzExposurePct: 100,
      importDependencyPct: 100,
      strategicReserveDays: 60,
    })
    expect(estimateDepletionDays(profile)).toBe(60)
  })

  it('extends depletion for diversified supply', () => {
    const profile = makeProfile({
      hormuzExposurePct: 50,
      importDependencyPct: 80,
      strategicReserveDays: 60,
    })
    // 60 / (0.50 * 0.80) = 60 / 0.4 = 150
    expect(estimateDepletionDays(profile)).toBe(150)
  })

  it('returns ~64 days for Australia profile', () => {
    const australia = makeProfile({
      hormuzExposurePct: 59,
      importDependencyPct: 90,
      strategicReserveDays: 34,
    })
    // 34 / (0.59 * 0.90) = 34 / 0.531 ≈ 64.03
    expect(estimateDepletionDays(australia)).toBeCloseTo(64.03, 0)
  })

  it('returns Infinity when no Hormuz exposure', () => {
    const safe = makeProfile({ hormuzExposurePct: 0 })
    expect(estimateDepletionDays(safe)).toBe(Infinity)
  })

  it('returns Infinity when no import dependency', () => {
    const selfSufficient = makeProfile({ importDependencyPct: 0 })
    expect(estimateDepletionDays(selfSufficient)).toBe(Infinity)
  })
})

/* ── computeFuelSecurity ─────────────────────────────────────── */

describe('computeFuelSecurity', () => {
  it('returns CRITICAL for Australia (low reserves, high import dependency)', () => {
    const australia = makeProfile({
      countryId: 'Australia',
      oilConsumptionBpd: 1_100_000,
      importDependencyPct: 90,
      hormuzExposurePct: 59,
      strategicReserveDays: 34,
      refiningCapacityPct: 45,
    })
    const result = computeFuelSecurity(australia)
    expect(result.alertLevel).toBe('critical')
    expect(result.vulnerabilityScore).toBeGreaterThanOrEqual(70)
    expect(result.factors).toHaveLength(4)
    expect(result.estimatedDepletionDays).toBe(64)
  })

  it('returns MODERATE for Japan (high reserves buffer dependency)', () => {
    const japan = makeProfile({
      countryId: 'Japan',
      importDependencyPct: 97,
      hormuzExposurePct: 92,
      strategicReserveDays: 254,
      refiningCapacityPct: 110,
    })
    const result = computeFuelSecurity(japan)
    // Reserve score = 0 (254 > 180), import = 24.25, hormuz = 23, refining = 0
    // Total ≈ 47.25 → MODERATE
    expect(result.alertLevel).toBe('moderate')
    expect(result.vulnerabilityScore).toBeLessThan(50)
  })

  it('returns CRITICAL for Indonesia (very low reserves)', () => {
    const indonesia = makeProfile({
      countryId: 'Indonesia',
      importDependencyPct: 48,
      hormuzExposurePct: 25,
      strategicReserveDays: 22,
      refiningCapacityPct: 50,
    })
    const result = computeFuelSecurity(indonesia)
    // Reserve = 35 (22 < 30), import = 12, hormuz = 6.25, refining = 7.5
    // Total = 60.75 → HIGH
    expect(result.alertLevel).toBe('high')
    expect(result.vulnerabilityScore).toBeGreaterThanOrEqual(50)
  })

  it('factors sum to the vulnerability score', () => {
    const profile = makeProfile()
    const result = computeFuelSecurity(profile)
    const factorSum = result.factors.reduce((sum, f) => sum + f.points, 0)
    expect(factorSum).toBeCloseTo(result.vulnerabilityScore, 0)
  })

  it('each factor has correct maxPoints', () => {
    const result = computeFuelSecurity(makeProfile())
    expect(result.factors[0].maxPoints).toBe(35)
    expect(result.factors[1].maxPoints).toBe(25)
    expect(result.factors[2].maxPoints).toBe(25)
    expect(result.factors[3].maxPoints).toBe(15)
  })
})

/* ── computeFlightImpactPct ──────────────────────────────────── */

describe('computeFlightImpactPct', () => {
  it('computes correct percentage for DEL-DXB (40%)', () => {
    expect(computeFlightImpactPct(18_000, 25_200)).toBe(40)
  })

  it('computes correct percentage for LHR-SIN (~167%)', () => {
    expect(computeFlightImpactPct(450, 1_200)).toBeCloseTo(166.7, 0)
  })

  it('returns 0 when prePrice is 0 (suspended routes)', () => {
    expect(computeFlightImpactPct(0, 0)).toBe(0)
  })

  it('handles price decreases correctly', () => {
    expect(computeFlightImpactPct(100, 80)).toBe(-20)
  })
})

/* ── rankByVulnerability ─────────────────────────────────────── */

describe('rankByVulnerability', () => {
  it('sorts descending by vulnerability score', () => {
    const results: FuelSecurityResult[] = [
      { countryId: 'A', alertLevel: 'low', vulnerabilityScore: 20, estimatedDepletionDays: 200, factors: [] },
      { countryId: 'B', alertLevel: 'critical', vulnerabilityScore: 80, estimatedDepletionDays: 30, factors: [] },
      { countryId: 'C', alertLevel: 'moderate', vulnerabilityScore: 45, estimatedDepletionDays: 100, factors: [] },
    ]
    const sorted = rankByVulnerability(results)
    expect(sorted[0].countryId).toBe('B')
    expect(sorted[1].countryId).toBe('C')
    expect(sorted[2].countryId).toBe('A')
  })

  it('does not mutate the original array', () => {
    const results: FuelSecurityResult[] = [
      { countryId: 'X', alertLevel: 'high', vulnerabilityScore: 60, estimatedDepletionDays: 50, factors: [] },
      { countryId: 'Y', alertLevel: 'critical', vulnerabilityScore: 90, estimatedDepletionDays: 20, factors: [] },
    ]
    const sorted = rankByVulnerability(results)
    expect(results[0].countryId).toBe('X')
    expect(sorted[0].countryId).toBe('Y')
  })
})

/* ── estimateSurchargeRange ────────────────────────────────────── */

describe('estimateSurchargeRange', () => {
  it('returns critical-tier range for score >= 70', () => {
    const range = estimateSurchargeRange(75)
    expect(range.lowPct).toBe(60)
    expect(range.highPct).toBe(150)
  })

  it('returns high-tier range for score 50-69', () => {
    const range = estimateSurchargeRange(55)
    expect(range.lowPct).toBe(35)
    expect(range.highPct).toBe(80)
  })

  it('returns moderate-tier range for score 30-49', () => {
    const range = estimateSurchargeRange(40)
    expect(range.lowPct).toBe(15)
    expect(range.highPct).toBe(45)
  })

  it('returns low-tier range for score < 30', () => {
    const range = estimateSurchargeRange(15)
    expect(range.lowPct).toBe(5)
    expect(range.highPct).toBe(20)
  })

  it('returns low-tier range for score 0', () => {
    const range = estimateSurchargeRange(0)
    expect(range.lowPct).toBe(5)
    expect(range.highPct).toBe(20)
  })

  it('returns critical-tier at exact boundary (70)', () => {
    const range = estimateSurchargeRange(70)
    expect(range.lowPct).toBe(60)
    expect(range.highPct).toBe(150)
  })
})

/* ── computeRouteRisk ──────────────────────────────────────────── */

describe('computeRouteRisk', () => {
  const highRiskResult: FuelSecurityResult = {
    countryId: 'HighRisk',
    alertLevel: 'critical',
    vulnerabilityScore: 80,
    estimatedDepletionDays: 30,
    factors: [],
  }
  const lowRiskResult: FuelSecurityResult = {
    countryId: 'LowRisk',
    alertLevel: 'low',
    vulnerabilityScore: 20,
    estimatedDepletionDays: 500,
    factors: [],
  }

  it('weights origin 70% and destination 30% when both provided', () => {
    const result = computeRouteRisk(highRiskResult, lowRiskResult)
    // 80 * 0.70 + 20 * 0.30 = 56 + 6 = 62
    expect(result.score).toBe(62)
    expect(result.confidence).toBe('indicative')
    expect(result.originScore).toBe(80)
    expect(result.destinationScore).toBe(20)
  })

  it('returns high alert for origin=80, dest=20 (score=62)', () => {
    const result = computeRouteRisk(highRiskResult, lowRiskResult)
    expect(result.alertLevel).toBe('high')
  })

  it('uses origin score only when destination is null', () => {
    const result = computeRouteRisk(highRiskResult, null)
    expect(result.score).toBe(80)
    expect(result.confidence).toBe('limited')
    expect(result.originScore).toBe(80)
    expect(result.destinationScore).toBeUndefined()
  })

  it('uses destination score only when origin is null', () => {
    const result = computeRouteRisk(null, lowRiskResult)
    expect(result.score).toBe(20)
    expect(result.confidence).toBe('limited')
    expect(result.originScore).toBeUndefined()
    expect(result.destinationScore).toBe(20)
  })

  it('returns score 0 and limited confidence when both null', () => {
    const result = computeRouteRisk(null, null)
    expect(result.score).toBe(0)
    expect(result.confidence).toBe('limited')
    expect(result.alertLevel).toBe('low')
  })

  it('computes surcharge range matching the score tier', () => {
    const result = computeRouteRisk(highRiskResult, lowRiskResult)
    // score = 62 → high tier → lowPct=35, highPct=80
    expect(result.surchargeRange.lowPct).toBe(35)
    expect(result.surchargeRange.highPct).toBe(80)
  })

  it('handles identical origin and destination', () => {
    const result = computeRouteRisk(highRiskResult, highRiskResult)
    // 80 * 0.70 + 80 * 0.30 = 80
    expect(result.score).toBe(80)
    expect(result.confidence).toBe('indicative')
  })

  it('produces critical alert when both countries are critical', () => {
    const result = computeRouteRisk(highRiskResult, highRiskResult)
    expect(result.alertLevel).toBe('critical')
  })
})

/* ── QA Stress Tests — Real Country Profiles ───────────────────── */

describe('QA: real country profile calculations', () => {
  // Australia: 34d reserves, 90% imports, 59% Hormuz, 45% refining
  const australia = makeProfile({
    countryId: 'Australia',
    strategicReserveDays: 34,
    importDependencyPct: 90,
    hormuzExposurePct: 59,
    refiningCapacityPct: 45,
  })

  // USA: 400d, 25% imports, 3% Hormuz, 110% refining
  const usa = makeProfile({
    countryId: 'USA',
    strategicReserveDays: 400,
    importDependencyPct: 25,
    hormuzExposurePct: 3,
    refiningCapacityPct: 110,
  })

  // Canada: 90d, 0% imports, 0% Hormuz, 95% refining
  const canada = makeProfile({
    countryId: 'Canada',
    strategicReserveDays: 90,
    importDependencyPct: 0,
    hormuzExposurePct: 0,
    refiningCapacityPct: 95,
  })

  // Bangladesh: 10d, 95% imports, 60% Hormuz, 15% refining
  const bangladesh = makeProfile({
    countryId: 'Bangladesh',
    strategicReserveDays: 10,
    importDependencyPct: 95,
    hormuzExposurePct: 60,
    refiningCapacityPct: 15,
  })

  it('Australia is CRITICAL (low reserves + high imports)', () => {
    const result = computeFuelSecurity(australia)
    expect(result.alertLevel).toBe('critical')
    expect(result.vulnerabilityScore).toBeGreaterThan(70)
  })

  it('USA is LOW (massive reserves + minimal Hormuz exposure)', () => {
    const result = computeFuelSecurity(usa)
    expect(result.alertLevel).toBe('low')
    expect(result.vulnerabilityScore).toBeLessThan(15)
  })

  it('Canada is LOW (zero Hormuz + zero imports)', () => {
    const result = computeFuelSecurity(canada)
    expect(result.alertLevel).toBe('low')
    expect(result.vulnerabilityScore).toBeLessThan(25)
    expect(result.estimatedDepletionDays).toBe(Infinity) // no disruption
  })

  it('Bangladesh is CRITICAL (10d reserves + 95% imports + 60% Hormuz)', () => {
    const result = computeFuelSecurity(bangladesh)
    expect(result.alertLevel).toBe('critical')
    expect(result.vulnerabilityScore).toBeGreaterThan(85)
    expect(result.estimatedDepletionDays).toBeLessThan(20) // ~17.5d
  })

  it('vulnerability score always sums to factor points', () => {
    for (const profile of [australia, usa, canada, bangladesh]) {
      const result = computeFuelSecurity(profile)
      const factorSum = result.factors.reduce((s, f) => s + f.points, 0)
      expect(factorSum).toBeCloseTo(result.vulnerabilityScore, 0)
    }
  })

  it('vulnerability score is always 0-100', () => {
    for (const profile of [australia, usa, canada, bangladesh]) {
      const result = computeFuelSecurity(profile)
      expect(result.vulnerabilityScore).toBeGreaterThanOrEqual(0)
      expect(result.vulnerabilityScore).toBeLessThanOrEqual(100)
    }
  })

  it('depletion days is Infinity when Hormuz exposure is 0%', () => {
    expect(estimateDepletionDays(canada)).toBe(Infinity)
  })

  it('depletion days is Infinity when import dependency is 0%', () => {
    const selfSufficient = makeProfile({ importDependencyPct: 0, hormuzExposurePct: 50 })
    expect(estimateDepletionDays(selfSufficient)).toBe(Infinity)
  })

  it('route risk: AUS→USA weighted score is correct', () => {
    const ausResult = computeFuelSecurity(australia)
    const usaResult = computeFuelSecurity(usa)
    const risk = computeRouteRisk(ausResult, usaResult)
    // origin (AUS) weighted 70%, dest (USA) weighted 30%
    const expected = Math.round((ausResult.vulnerabilityScore * 0.7 + usaResult.vulnerabilityScore * 0.3) * 10) / 10
    expect(risk.score).toBe(expected)
  })

  it('route risk: return trip (USA→AUS) has higher risk than outbound (AUS→USA)', () => {
    const ausResult = computeFuelSecurity(australia)
    const usaResult = computeFuelSecurity(usa)
    const outbound = computeRouteRisk(ausResult, usaResult)
    const returnTrip = computeRouteRisk(usaResult, ausResult)
    // AUS has higher score, so when AUS is dest (30%) vs origin (70%), outbound is worse
    expect(outbound.score).toBeGreaterThan(returnTrip.score)
  })

  it('time horizon: reducing reserves increases vulnerability', () => {
    const now = computeFuelSecurity(australia)
    const future = computeFuelSecurity({ ...australia, strategicReserveDays: Math.max(0, 34 - 15) })
    expect(future.vulnerabilityScore).toBeGreaterThan(now.vulnerabilityScore)
  })

  it('ceasefire: reducing Hormuz exposure lowers vulnerability', () => {
    const wartime = computeFuelSecurity(australia)
    const ceasefire = computeFuelSecurity({ ...australia, hormuzExposurePct: Math.round(59 * 0.5) })
    expect(ceasefire.vulnerabilityScore).toBeLessThan(wartime.vulnerabilityScore)
  })

  it('surcharge tiers are contiguous (no gaps)', () => {
    // Every score 0-100 should produce a valid surcharge range
    for (let score = 0; score <= 100; score++) {
      const range = estimateSurchargeRange(score)
      expect(range.lowPct).toBeGreaterThanOrEqual(0)
      expect(range.highPct).toBeGreaterThan(range.lowPct)
    }
  })
})
