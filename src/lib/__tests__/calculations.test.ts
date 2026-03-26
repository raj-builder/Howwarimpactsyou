import { describe, it, expect } from 'vitest'
import {
  computeScenario,
  computeBasket,
  buildScenarioId,
  parseScenarioId,
  roundValue,
  withinTolerance,
  findCountryEntry,
  getReliability,
  isStructuralMiss,
  validateScenarioState,
  isScenarioComplete,
  getProvenance,
} from '@/lib/calculations'
import { LAG_MULTIPLIERS } from '@/types/scenario'
import type { LagPeriod, ScenarioState } from '@/types/scenario'

/* ── Helpers ─────────────────────────────────────────────────── */

function makeState(overrides: Partial<ScenarioState> = {}): ScenarioState {
  return {
    war: 'ukraine-russia',
    category: 'bread',
    country: 'Philippines',
    passthrough: 100,
    lag: 'immediate',
    provenance: getProvenance(),
    ...overrides,
  }
}

/* ── computeScenario ─────────────────────────────────────────── */

describe('computeScenario', () => {
  it('returns correct values for Philippines/Bread/Ukraine-Russia at 100%/immediate', () => {
    const result = computeScenario(makeState())!
    expect(result).not.toBeNull()
    expect(result.ceiling).toBe(18.4)
    expect(result.adjustedCeiling).toBe(18.4)
    expect(result.lagMultiplier).toBe(1.0)
    expect(result.lagAdjustedCeiling).toBe(18.4)
    expect(result.rangeLow).toBe(10.1) // 18.4 * 0.55 = 10.12 -> 10.1
    expect(result.rangeHigh).toBe(13.8) // 18.4 * 0.75 = 13.8
    expect(result.realized).toBe(12.0) // 18.4 * 0.65 = 11.96 -> 12.0
  })

  it('applies lag multiplier correctly for 12m', () => {
    const result = computeScenario(makeState({ lag: '12m' }))!
    expect(result.lagMultiplier).toBe(0.75)
    // 18.4 * 1.0 * 0.75 = 13.8
    expect(result.lagAdjustedCeiling).toBe(13.8)
  })

  it('applies lag multiplier correctly for 6m', () => {
    const result = computeScenario(makeState({ lag: '6m' }))!
    expect(result.lagMultiplier).toBe(0.88)
    // 18.4 * 0.88 = 16.192 -> 16.2
    expect(result.lagAdjustedCeiling).toBe(16.2)
  })

  it('applies passthrough correctly', () => {
    const result = computeScenario(makeState({ passthrough: 50 }))!
    // 18.4 * 0.5 = 9.2
    expect(result.adjustedCeiling).toBe(9.2)
    expect(result.lagAdjustedCeiling).toBe(9.2) // immediate lag = 1.0
  })

  it('applies both passthrough and lag', () => {
    const result = computeScenario(makeState({ passthrough: 75, lag: '6m' }))!
    // 18.4 * 0.75 = 13.8 -> adjustedCeiling
    expect(result.adjustedCeiling).toBe(13.8)
    // 13.8 * 0.88 = 12.144 -> 12.1
    expect(result.lagAdjustedCeiling).toBe(12.1)
  })

  it('returns null for unknown country', () => {
    const result = computeScenario(makeState({ country: 'Narnia' }))
    expect(result).toBeNull()
  })

  it('returns correct coverage and reliability for full-coverage validated country', () => {
    const result = computeScenario(makeState({ country: 'Philippines' }))!
    expect(result.coverage).toBe('full')
    expect(result.reliability).toBe('validated')
  })

  it('returns indicative reliability for structural miss countries', () => {
    const resultTR = computeScenario(makeState({ country: 'Türkiye' }))!
    expect(resultTR.coverage).toBe('full')
    expect(resultTR.reliability).toBe('indicative')

    const resultNG = computeScenario(makeState({ country: 'Nigeria' }))!
    expect(resultNG.reliability).toBe('indicative')

    const resultPK = computeScenario(makeState({ country: 'Pakistan' }))!
    expect(resultPK.reliability).toBe('indicative')
  })
})

/* ── Determinism ─────────────────────────────────────────────── */

describe('determinism', () => {
  it('produces identical results across 100 calls', () => {
    const state = makeState({ lag: '6m' })
    const first = computeScenario(state)!
    for (let i = 0; i < 100; i++) {
      const r = computeScenario(state)!
      expect(r.lagAdjustedCeiling).toBe(first.lagAdjustedCeiling)
      expect(r.realized).toBe(first.realized)
      expect(r.rangeLow).toBe(first.rangeLow)
      expect(r.rangeHigh).toBe(first.rangeHigh)
    }
  })
})

/* ── Factor Contributions ────────────────────────────────────── */

describe('factor contributions', () => {
  it('factors sum to headline within tolerance', () => {
    const result = computeScenario(makeState())!
    const factorSum = result.factors.reduce((s, f) => s + f.absolutePct, 0)
    expect(withinTolerance(factorSum, result.lagAdjustedCeiling, 0.15)).toBe(true)
  })

  it('factor sharePct values sum to 100', () => {
    const result = computeScenario(makeState())!
    const shareSum = result.factors.reduce((s, f) => s + f.sharePct, 0)
    expect(shareSum).toBe(100)
  })
})

/* ── Basket Calculation ──────────────────────────────────────── */

describe('computeBasket', () => {
  it('returns valid basket result for Philippines', () => {
    const enabled = new Set(['bread', 'oil', 'fuel', 'dairy', 'rice', 'vegetables'] as const)
    const result = computeBasket(
      { war: 'ukraine-russia', country: 'Philippines', passthrough: 100, lag: 'immediate', provenance: getProvenance() },
      enabled as Set<any>,
    )!
    expect(result).not.toBeNull()
    expect(result.items.length).toBe(9) // All 9 categories present
    expect(result.weightedAverage).toBeGreaterThan(0)
    expect(result.cpiContribution).toBeGreaterThan(0)
  })

  it('weighted contributions sum to weighted average', () => {
    const enabled = new Set(['bread', 'oil', 'fuel', 'dairy', 'rice', 'vegetables'] as const)
    const result = computeBasket(
      { war: 'ukraine-russia', country: 'Philippines', passthrough: 100, lag: 'immediate', provenance: getProvenance() },
      enabled as Set<any>,
    )!
    const enabledItems = result.items.filter((i) => i.enabled)
    const totalActiveWeight = enabledItems.reduce((s, i) => s + i.cpiWeight, 0)
    const recomputedAvg = enabledItems.reduce(
      (s, i) => s + (i.cpiWeight / totalActiveWeight) * i.lagAdjustedImpact,
      0,
    )
    expect(withinTolerance(
      roundValue(recomputedAvg, 'display'),
      result.weightedAverage,
      0.2,
    )).toBe(true)
  })

  it('returns null when country is empty', () => {
    const enabled = new Set(['bread'] as const)
    const result = computeBasket(
      { war: 'ukraine-russia', country: '', passthrough: 100, lag: 'immediate', provenance: getProvenance() },
      enabled as Set<any>,
    )
    expect(result).toBeNull()
  })

  it('applies lag multiplier to basket items', () => {
    const enabled = new Set(['bread'] as const)
    const immediate = computeBasket(
      { war: 'ukraine-russia', country: 'Philippines', passthrough: 100, lag: 'immediate', provenance: getProvenance() },
      enabled as Set<any>,
    )!
    const lag12m = computeBasket(
      { war: 'ukraine-russia', country: 'Philippines', passthrough: 100, lag: '12m', provenance: getProvenance() },
      enabled as Set<any>,
    )!
    // 12m basket values should be 0.75x of immediate
    const breadImm = immediate.items.find((i) => i.categoryId === 'bread')!
    const bread12m = lag12m.items.find((i) => i.categoryId === 'bread')!
    expect(bread12m.lagAdjustedImpact).toBeLessThan(breadImm.lagAdjustedImpact)
  })
})

/* ── Scenario Identity ───────────────────────────────────────── */

describe('scenario identity', () => {
  it('builds a canonical identity string', () => {
    const id = buildScenarioId({
      war: 'ukraine-russia',
      category: 'bread',
      country: 'Philippines',
      passthrough: 100,
      lag: 'immediate',
    })
    expect(id).toBe('ukraine-russia:bread:Philippines:100:immediate')
  })

  it('round-trips through parse', () => {
    const original = makeState({ lag: '6m', passthrough: 75 })
    const id = buildScenarioId(original)
    const parsed = parseScenarioId(id)!
    expect(parsed).not.toBeNull()
    expect(parsed.war).toBe(original.war)
    expect(parsed.category).toBe(original.category)
    expect(parsed.country).toBe(original.country)
    expect(parsed.passthrough).toBe(original.passthrough)
    expect(parsed.lag).toBe(original.lag)
  })

  it('returns null for invalid identity string', () => {
    expect(parseScenarioId('invalid')).toBeNull()
    expect(parseScenarioId('a:b:c')).toBeNull()
  })
})

/* ── Rounding ────────────────────────────────────────────────── */

describe('rounding', () => {
  it('display mode rounds to 1 decimal', () => {
    expect(roundValue(12.34, 'display')).toBe(12.3)
    expect(roundValue(12.35, 'display')).toBe(12.4)
    expect(roundValue(12.05, 'display')).toBe(12.1)
  })

  it('audit mode rounds to 3 decimals', () => {
    expect(roundValue(12.3456, 'audit')).toBe(12.346)
    expect(roundValue(12.3454, 'audit')).toBe(12.345)
  })

  it('withinTolerance works correctly', () => {
    expect(withinTolerance(10.0, 10.1, 0.15)).toBe(true)
    expect(withinTolerance(10.0, 10.2, 0.15)).toBe(false)
    expect(withinTolerance(10.0, 10.0, 0.15)).toBe(true)
  })
})

/* ── Validation Guards ───────────────────────────────────────── */

describe('validation', () => {
  it('returns no errors for valid state', () => {
    const errors = validateScenarioState(makeState())
    expect(errors).toHaveLength(0)
  })

  it('returns error for unknown war', () => {
    const errors = validateScenarioState({ ...makeState(), war: 'fake-war' as any })
    expect(errors.some((e) => e.field === 'war')).toBe(true)
  })

  it('returns error for out-of-range passthrough', () => {
    const errors = validateScenarioState({ ...makeState(), passthrough: 150 })
    expect(errors.some((e) => e.field === 'passthrough')).toBe(true)
  })

  it('returns error for unknown country', () => {
    const errors = validateScenarioState({ ...makeState(), country: 'Narnia' })
    expect(errors.some((e) => e.field === 'country')).toBe(true)
  })

  it('isScenarioComplete returns true for complete state', () => {
    expect(isScenarioComplete(makeState())).toBe(true)
  })

  it('isScenarioComplete returns false for incomplete state', () => {
    expect(isScenarioComplete({ war: 'ukraine-russia' })).toBe(false)
  })
})

/* ── Lag Multipliers ─────────────────────────────────────────── */

describe('lag multipliers', () => {
  it('has correct values for all periods', () => {
    expect(LAG_MULTIPLIERS.immediate).toBe(1.0)
    expect(LAG_MULTIPLIERS['3m']).toBe(0.95)
    expect(LAG_MULTIPLIERS['6m']).toBe(0.88)
    expect(LAG_MULTIPLIERS['12m']).toBe(0.75)
  })

  it('each lag period produces different ceiling', () => {
    const lags: LagPeriod[] = ['immediate', '3m', '6m', '12m']
    const ceilings = lags.map((lag) => {
      const r = computeScenario(makeState({ lag }))!
      return r.lagAdjustedCeiling
    })
    // Each subsequent lag should produce a lower ceiling
    for (let i = 1; i < ceilings.length; i++) {
      expect(ceilings[i]).toBeLessThan(ceilings[i - 1])
    }
  })
})

/* ── Reliability ─────────────────────────────────────────────── */

describe('reliability', () => {
  it('returns validated for full-coverage non-miss countries', () => {
    expect(getReliability('Philippines', 'full')).toBe('validated')
    expect(getReliability('Egypt', 'full')).toBe('validated')
  })

  it('returns indicative for structural miss countries', () => {
    expect(getReliability('Türkiye', 'full')).toBe('indicative')
    expect(getReliability('Nigeria', 'full')).toBe('indicative')
    expect(getReliability('Pakistan', 'full')).toBe('indicative')
  })

  it('returns experimental for experimental coverage', () => {
    expect(getReliability('Argentina', 'experimental')).toBe('experimental')
  })

  it('returns indicative for partial coverage', () => {
    expect(getReliability('Bangladesh', 'partial')).toBe('indicative')
  })

  it('isStructuralMiss identifies correct countries', () => {
    expect(isStructuralMiss('Türkiye')).toBe(true)
    expect(isStructuralMiss('Nigeria')).toBe(true)
    expect(isStructuralMiss('Pakistan')).toBe(true)
    expect(isStructuralMiss('Philippines')).toBe(false)
  })
})

/* ── Country Lookup ──────────────────────────────────────────── */

describe('findCountryEntry', () => {
  it('finds a top5 country', () => {
    const entry = findCountryEntry('ukraine-russia', 'bread', 'Egypt')
    expect(entry).not.toBeNull()
    expect(entry!.p).toBe(41.3)
  })

  it('finds a bot5 country', () => {
    const entry = findCountryEntry('ukraine-russia', 'bread', 'Brazil')
    expect(entry).not.toBeNull()
    expect(entry!.p).toBe(6.1)
  })

  it('returns null for unlisted country', () => {
    const entry = findCountryEntry('ukraine-russia', 'bread', 'Narnia')
    expect(entry).toBeNull()
  })
})
