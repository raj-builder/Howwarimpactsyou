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
import { getWarAnchors } from '@/data/pre-escalation-prices'

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

/* ══════════════════════════════════════════════════════════════
   COMPREHENSIVE QA — verify every surface's numbers
   ══════════════════════════════════════════════════════════════ */

describe('QA: homepage card numbers match computeScenario', () => {
  // These match the EXAMPLE_CARDS in src/app/page.tsx
  const HOMEPAGE_CARDS = [
    { war: 'ukraine-russia' as const, category: 'bread' as const, country: 'Philippines', pt: 100, lag: 'immediate' as LagPeriod, expectedCeiling: 18.4 },
    { war: 'ukraine-russia' as const, category: 'oil' as const, country: 'Egypt', pt: 100, lag: 'immediate' as LagPeriod, expectedCeiling: 52.1 },
    { war: 'ukraine-russia' as const, category: 'fuel' as const, country: 'Brazil', pt: 100, lag: 'immediate' as LagPeriod, expectedCeiling: 11.2 },
    { war: 'ukraine-russia' as const, category: 'vegetables' as const, country: 'India', pt: 100, lag: 'immediate' as LagPeriod, expectedCeiling: 9.7 },
  ]

  for (const card of HOMEPAGE_CARDS) {
    it(`${card.country}/${card.category} at ${card.pt}%/${card.lag} = ${card.expectedCeiling}%`, () => {
      const result = computeScenario(makeState({
        war: card.war, category: card.category, country: card.country,
        passthrough: card.pt, lag: card.lag,
      }))!
      expect(result).not.toBeNull()
      // At 100% passthrough + immediate lag, lagAdjustedCeiling should equal raw ceiling
      expect(result.lagAdjustedCeiling).toBe(card.expectedCeiling)
      expect(result.ceiling).toBe(card.expectedCeiling)
    })
  }
})

describe('QA: all wars top-1 country ceilings match wars.ts', () => {
  // Verify the #1 ranked country ceiling for each war's bread category
  const TOP_CEILINGS: { war: string; country: string; ceiling: number }[] = [
    { war: 'ukraine-russia', country: 'Egypt', ceiling: 41.3 },
    { war: 'iran-israel-us', country: 'Egypt', ceiling: 22.8 },
    { war: 'gaza-2023', country: 'Egypt', ceiling: 18.4 },
  ]

  for (const tc of TOP_CEILINGS) {
    it(`${tc.war} bread #1 = ${tc.country} at ${tc.ceiling}%`, () => {
      const entry = findCountryEntry(tc.war as any, 'bread', tc.country)
      expect(entry).not.toBeNull()
      expect(entry!.p).toBe(tc.ceiling)
    })
  }
})

describe('QA: full calculation chain accuracy', () => {
  it('Egypt/Oil/Ukraine-Russia at 75%/6m produces correct chain', () => {
    const result = computeScenario(makeState({
      war: 'ukraine-russia', category: 'oil', country: 'Egypt',
      passthrough: 75, lag: '6m',
    }))!
    expect(result).not.toBeNull()

    // Manual calculation:
    // ceiling = 52.1 (from wars.ts)
    // adjustedCeiling = 52.1 * 0.75 = 39.075 → 39.1
    // lagAdjustedCeiling = 39.1 * 0.88 = 34.408 → 34.4
    // rangeLow = 34.4 * 0.55 = 18.92 → 18.9
    // rangeHigh = 34.4 * 0.75 = 25.8
    // realized = 34.4 * 0.65 = 22.36 → 22.4
    // modelGap = 34.4 - 22.4 = 12.0
    expect(result.ceiling).toBe(52.1)
    expect(result.adjustedCeiling).toBe(39.1)
    expect(result.lagAdjustedCeiling).toBe(34.4)
    expect(result.rangeLow).toBe(18.9)
    expect(result.rangeHigh).toBe(25.8)
    expect(result.realized).toBe(22.4)
    expect(result.modelGap).toBe(12.0)
  })

  it('zero passthrough produces zero across the board', () => {
    const result = computeScenario(makeState({ passthrough: 0 }))!
    expect(result.adjustedCeiling).toBe(0)
    expect(result.lagAdjustedCeiling).toBe(0)
    expect(result.rangeLow).toBe(0)
    expect(result.rangeHigh).toBe(0)
    expect(result.realized).toBe(0)
    expect(result.modelGap).toBe(0)
  })

  it('25% passthrough with 12m lag produces correct small numbers', () => {
    const result = computeScenario(makeState({
      country: 'Philippines', category: 'bread',
      passthrough: 25, lag: '12m',
    }))!
    // ceiling = 18.4
    // adjustedCeiling = 18.4 * 0.25 = 4.6
    // lagAdjustedCeiling = 4.6 * 0.75 = 3.45 → 3.5 (display rounding)
    expect(result.ceiling).toBe(18.4)
    expect(result.adjustedCeiling).toBe(4.6)
    expect(result.lagAdjustedCeiling).toBe(3.5)
  })
})

describe('QA: basket reconciliation across countries', () => {
  const COUNTRIES_TO_TEST = ['Philippines', 'Egypt', 'India', 'Brazil']

  for (const country of COUNTRIES_TO_TEST) {
    it(`${country} basket weighted avg reconciles from individual items`, () => {
      const enabled = new Set(['bread', 'oil', 'fuel', 'dairy', 'rice', 'vegetables'] as const)
      const result = computeBasket(
        { war: 'ukraine-russia', country, passthrough: 100, lag: 'immediate', provenance: getProvenance() },
        enabled as Set<any>,
      )!
      if (!result) return // Skip countries with no ranking data

      const enabledItems = result.items.filter(i => i.enabled)
      const totalWeight = enabledItems.reduce((s, i) => s + i.cpiWeight, 0)

      // Recompute weighted average from full precision
      const recomputed = enabledItems.reduce(
        (s, i) => s + (i.cpiWeight / totalWeight) * i.lagAdjustedImpact,
        0,
      )
      const recomputedRounded = roundValue(recomputed, 'display')

      // Must match within 0.2pp (rounding tolerance)
      expect(withinTolerance(recomputedRounded, result.weightedAverage, 0.2)).toBe(true)
    })

    it(`${country} basket CPI contribution reconciles`, () => {
      const enabled = new Set(['bread', 'oil', 'fuel', 'dairy', 'rice', 'vegetables'] as const)
      const result = computeBasket(
        { war: 'ukraine-russia', country, passthrough: 100, lag: 'immediate', provenance: getProvenance() },
        enabled as Set<any>,
      )!
      if (!result) return

      const enabledItems = result.items.filter(i => i.enabled)
      const recomputed = enabledItems.reduce(
        (s, i) => s + (i.cpiWeight / 100) * i.lagAdjustedImpact,
        0,
      )
      const recomputedRounded = roundValue(recomputed, 'display')

      expect(withinTolerance(recomputedRounded, result.cpiContribution, 0.2)).toBe(true)
    })
  }
})

describe('QA: user refinement override', () => {
  it('user-supplied impact replaces static ceiling', () => {
    const refinements = {
      version: 1 as const,
      commodities: [],
      categoryImpacts: [{
        country: 'Philippines',
        categoryId: 'bread',
        warId: 'ukraine-russia',
        impactPct: 25.0,
        updatedAt: new Date().toISOString(),
        source: 'user' as const,
      }],
      fxRates: [],
      newCountries: [],
      lastUpdated: new Date().toISOString(),
    }

    const result = computeScenario(makeState(), 'display', refinements)!
    expect(result).not.toBeNull()
    // Should use 25.0 instead of 18.4
    expect(result.ceiling).toBe(25.0)
    expect(result.lagAdjustedCeiling).toBe(25.0) // 100% pt, immediate lag
    expect(result.userRefined).toBe(true)
  })

  it('without refinement, userRefined is false', () => {
    const result = computeScenario(makeState())!
    expect(result.userRefined).toBe(false)
  })

  it('refinement for different country does not affect original', () => {
    const refinements = {
      version: 1 as const,
      commodities: [],
      categoryImpacts: [{
        country: 'Egypt',
        categoryId: 'bread',
        warId: 'ukraine-russia',
        impactPct: 99.0,
        updatedAt: new Date().toISOString(),
        source: 'user' as const,
      }],
      fxRates: [],
      newCountries: [],
      lastUpdated: new Date().toISOString(),
    }

    // Philippines should still use static data
    const result = computeScenario(makeState({ country: 'Philippines' }), 'display', refinements)!
    expect(result.ceiling).toBe(18.4)
    expect(result.userRefined).toBe(false)
  })
})

describe('QA: pre-escalation price anchors', () => {
  it('changePct is computed correctly for ukraine-russia brent', () => {
    // prePrice: 96.84, postPrice: 133.18
    // changePct = ((133.18 - 96.84) / 96.84) * 100 = 37.5%
    const anchors = getWarAnchors('ukraine-russia')
    expect(anchors).not.toBeNull()
    const brent = anchors.commodities.find((c: any) => c.id === 'brent')
    expect(brent).not.toBeUndefined()
    expect(brent.changePct).toBeCloseTo(37.5, 0)
  })

  it('all changePct values are consistent with pre/post prices', () => {
    for (const warId of ['ukraine-russia', 'iran-israel-us', 'gaza-2023']) {
      const anchors = getWarAnchors(warId)
      if (!anchors) continue
      for (const item of [...anchors.commodities, ...anchors.consumerGoods]) {
        if (item.changePct !== undefined && item.prePrice > 0) {
          const expected = Math.round(((item.postPrice - item.prePrice) / item.prePrice) * 1000) / 10
          expect(item.changePct).toBeCloseTo(expected, 1)
        }
      }
    }
  })
})
