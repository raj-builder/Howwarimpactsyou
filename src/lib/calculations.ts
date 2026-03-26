import { WARS } from '@/data/wars'
import { COUNTRY_MAP } from '@/data/countries'
import { CATEGORY_MAP } from '@/data/categories'
import type { WarId, CategoryId, RankingEntry, CoverageStatus } from '@/types'
import type {
  ScenarioState,
  ScenarioResult,
  ScenarioIdentity,
  LagPeriod,
  FactorContribution,
  ProvenanceMetadata,
  ReliabilityStatus,
  PrecisionMode,
  BasketItemResult,
  BasketResult,
  ValidationError,
} from '@/types/scenario'
import { LAG_MULTIPLIERS } from '@/types/scenario'

/* ── Provenance ──────────────────────────────────────────────── */

const BASE_PROVENANCE: Omit<ProvenanceMetadata, 'snapshotDate' | 'dataAsOf'> = {
  modelVersion: '1.0.0',
  factorWindow: 'Varies by conflict',
  sourceVersion: 'wars.ts@fc1ec55',
}

/**
 * Build provenance metadata.
 * Pass the SerpAPI `fetched_at` ISO timestamp to get a real data date.
 * If omitted, falls back to a static placeholder.
 */
export function getProvenance(serpApiFetchedAt?: string | null): ProvenanceMetadata {
  if (serpApiFetchedAt) {
    const d = new Date(serpApiFetchedAt)
    const dataAsOf =
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' · ' +
      d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    return {
      ...BASE_PROVENANCE,
      snapshotDate: serpApiFetchedAt,
      dataAsOf,
    }
  }
  return {
    ...BASE_PROVENANCE,
    snapshotDate: new Date().toISOString(),
    dataAsOf: 'Loading...',
  }
}

/* ── Scenario Identity ───────────────────────────────────────── */

export function buildScenarioId(state: {
  war: WarId
  category: CategoryId
  country: string
  passthrough: number
  lag: LagPeriod
}): ScenarioIdentity {
  return `${state.war}:${state.category}:${state.country}:${state.passthrough}:${state.lag}`
}

export function parseScenarioId(id: ScenarioIdentity): ScenarioState | null {
  const parts = id.split(':')
  if (parts.length !== 5) return null
  const war = parts[0] as WarId
  const category = parts[1] as CategoryId
  const country = parts[2]
  const passthrough = Number(parts[3])
  const lag = parts[4] as LagPeriod
  if (!WARS[war] || isNaN(passthrough) || !LAG_MULTIPLIERS[lag]) return null
  return { war, category, country, passthrough, lag, provenance: getProvenance() }
}

/* ── Rounding ────────────────────────────────────────────────── */

export function roundValue(value: number, mode: PrecisionMode = 'display'): number {
  if (mode === 'audit') return Math.round(value * 1000) / 1000
  return Math.round(value * 10) / 10
}

export function withinTolerance(
  a: number,
  b: number,
  tolerancePp: number = 0.15,
): boolean {
  return Math.abs(a - b) <= tolerancePp
}

/* ── Country Lookup ──────────────────────────────────────────── */

export function findCountryEntry(
  war: WarId,
  category: CategoryId,
  country: string,
): RankingEntry | null {
  const warData = WARS[war]
  if (!warData) return null
  const ranking = warData.rankings[category]
  if (!ranking) return null
  return (
    ranking.top5.find((e) => e.c === country) ??
    ranking.bot5.find((e) => e.c === country) ??
    null
  )
}

/* ── Reliability ─────────────────────────────────────────────── */

const STRUCTURAL_MISSES = new Set(['Türkiye', 'Nigeria', 'Pakistan'])

export function getReliability(
  country: string,
  coverage: CoverageStatus,
): ReliabilityStatus {
  if (coverage === 'experimental') return 'experimental'
  if (STRUCTURAL_MISSES.has(country)) return 'indicative'
  if (coverage === 'full') return 'validated'
  return 'indicative'
}

export function isStructuralMiss(country: string): boolean {
  return STRUCTURAL_MISSES.has(country)
}

/* ── Factor Breakdown ────────────────────────────────────────── */

/**
 * Per-war, per-category factor share weights.
 * sharePct values must sum to 100 for each entry.
 * absolutePct is computed dynamically from the headline figure.
 */
type FactorTemplate = Omit<FactorContribution, 'absolutePct'>

const FACTOR_TEMPLATES: Partial<
  Record<WarId, Partial<Record<CategoryId, FactorTemplate[]>>>
> = {
  'ukraine-russia': {
    bread: [
      { label: 'Wheat', sharePct: 52, color: 'bg-amber' },
      { label: 'FX', sharePct: 18, color: 'bg-blue' },
      { label: 'Energy', sharePct: 17, color: 'bg-accent' },
      { label: 'Fertilizer', sharePct: 8, color: 'bg-green' },
      { label: 'Transport', sharePct: 5, color: 'bg-ink-muted' },
    ],
    dairy: [
      { label: 'Feed costs', sharePct: 38, color: 'bg-amber' },
      { label: 'FX', sharePct: 24, color: 'bg-blue' },
      { label: 'Energy', sharePct: 20, color: 'bg-accent' },
      { label: 'Fertilizer', sharePct: 12, color: 'bg-green' },
      { label: 'Transport', sharePct: 6, color: 'bg-ink-muted' },
    ],
    eggs: [
      { label: 'Feed costs', sharePct: 45, color: 'bg-amber' },
      { label: 'Energy', sharePct: 22, color: 'bg-accent' },
      { label: 'FX', sharePct: 18, color: 'bg-blue' },
      { label: 'Fertilizer', sharePct: 10, color: 'bg-green' },
      { label: 'Transport', sharePct: 5, color: 'bg-ink-muted' },
    ],
    rice: [
      { label: 'Fertilizer', sharePct: 32, color: 'bg-green' },
      { label: 'Energy', sharePct: 28, color: 'bg-accent' },
      { label: 'FX', sharePct: 22, color: 'bg-blue' },
      { label: 'Commodity', sharePct: 13, color: 'bg-amber' },
      { label: 'Transport', sharePct: 5, color: 'bg-ink-muted' },
    ],
    oil: [
      { label: 'Oilseed', sharePct: 55, color: 'bg-amber' },
      { label: 'FX', sharePct: 20, color: 'bg-blue' },
      { label: 'Energy', sharePct: 15, color: 'bg-accent' },
      { label: 'Transport', sharePct: 7, color: 'bg-ink-muted' },
      { label: 'Other', sharePct: 3, color: 'bg-ink-muted' },
    ],
    vegetables: [
      { label: 'Fertilizer', sharePct: 35, color: 'bg-green' },
      { label: 'Energy', sharePct: 25, color: 'bg-accent' },
      { label: 'FX', sharePct: 20, color: 'bg-blue' },
      { label: 'Transport', sharePct: 15, color: 'bg-ink-muted' },
      { label: 'Other', sharePct: 5, color: 'bg-ink-muted' },
    ],
    meat: [
      { label: 'Feed costs', sharePct: 40, color: 'bg-amber' },
      { label: 'Energy', sharePct: 22, color: 'bg-accent' },
      { label: 'FX', sharePct: 20, color: 'bg-blue' },
      { label: 'Fertilizer', sharePct: 12, color: 'bg-green' },
      { label: 'Transport', sharePct: 6, color: 'bg-ink-muted' },
    ],
    detergent: [
      { label: 'Petrochemicals', sharePct: 45, color: 'bg-accent' },
      { label: 'FX', sharePct: 22, color: 'bg-blue' },
      { label: 'Energy', sharePct: 18, color: 'bg-amber' },
      { label: 'Transport', sharePct: 10, color: 'bg-ink-muted' },
      { label: 'Other', sharePct: 5, color: 'bg-ink-muted' },
    ],
    fuel: [
      { label: 'Crude Oil', sharePct: 58, color: 'bg-accent' },
      { label: 'FX', sharePct: 18, color: 'bg-blue' },
      { label: 'Refining', sharePct: 14, color: 'bg-amber' },
      { label: 'Transport', sharePct: 7, color: 'bg-ink-muted' },
      { label: 'Other', sharePct: 3, color: 'bg-ink-muted' },
    ],
  },
}

const DEFAULT_FACTOR_TEMPLATES: FactorTemplate[] = [
  { label: 'Commodity', sharePct: 42, color: 'bg-amber' },
  { label: 'FX', sharePct: 22, color: 'bg-blue' },
  { label: 'Energy', sharePct: 21, color: 'bg-accent' },
  { label: 'Fertilizer', sharePct: 10, color: 'bg-green' },
  { label: 'Other', sharePct: 5, color: 'bg-ink-muted' },
]

function computeFactors(
  war: WarId,
  category: CategoryId,
  headline: number,
  mode: PrecisionMode,
): FactorContribution[] {
  const templates =
    FACTOR_TEMPLATES[war]?.[category] ?? DEFAULT_FACTOR_TEMPLATES

  const factors = templates.map((t) => ({
    ...t,
    absolutePct: roundValue((t.sharePct / 100) * headline, mode),
  }))

  // Ensure factor absolutePct values sum to headline.
  // Assign any rounding residual to the largest factor.
  const factorSum = factors.reduce((s, f) => s + f.absolutePct, 0)
  const residual = roundValue(headline - factorSum, mode)
  if (residual !== 0 && factors.length > 0) {
    const largest = factors.reduce((a, b) =>
      a.absolutePct >= b.absolutePct ? a : b,
    )
    largest.absolutePct = roundValue(largest.absolutePct + residual, mode)
  }

  return factors
}

/* ── Core Scenario Calculation ───────────────────────────────── */

export function computeScenario(
  state: ScenarioState,
  mode: PrecisionMode = 'display',
): ScenarioResult | null {
  const entry = findCountryEntry(state.war, state.category, state.country)
  if (!entry) return null

  const countryData = COUNTRY_MAP[state.country]
  const coverage: CoverageStatus = countryData?.coverage ?? 'unavailable'
  const reliability = getReliability(state.country, coverage)

  const ceiling = entry.p
  const adjustedCeiling = roundValue(ceiling * (state.passthrough / 100), mode)
  const lagMultiplier = LAG_MULTIPLIERS[state.lag]
  const lagAdjustedCeiling = roundValue(adjustedCeiling * lagMultiplier, mode)
  const rangeLow = roundValue(lagAdjustedCeiling * 0.55, mode)
  const rangeHigh = roundValue(lagAdjustedCeiling * 0.75, mode)
  const realized = roundValue(lagAdjustedCeiling * 0.65, mode)
  const modelGap = roundValue(lagAdjustedCeiling - realized, mode)

  const factors = computeFactors(state.war, state.category, lagAdjustedCeiling, mode)
  const provenance = state.provenance ?? getProvenance()

  return {
    scenarioId: buildScenarioId(state),
    ceiling,
    adjustedCeiling,
    lagMultiplier,
    lagAdjustedCeiling,
    rangeLow,
    rangeHigh,
    realized,
    modelGap,
    factors,
    coverage,
    reliability,
    provenance,
  }
}

/* ── Basket Calculation ──────────────────────────────────────── */

/**
 * CPI sub-index weights by country (approximate, % of household CPI basket).
 * "basket" and individual categories should sum to roughly the food+energy
 * share of CPI for that country.
 */
const CPI_WEIGHTS: Record<string, Partial<Record<CategoryId, number>>> = {
  Philippines: {
    bread: 25, dairy: 15, eggs: 5, rice: 10,
    oil: 15, vegetables: 15, meat: 8, detergent: 2, fuel: 5,
  },
  Egypt: {
    bread: 28, dairy: 12, eggs: 6, rice: 8,
    oil: 18, vegetables: 12, meat: 8, detergent: 2, fuel: 6,
  },
  India: {
    bread: 18, dairy: 14, eggs: 4, rice: 15,
    oil: 12, vegetables: 18, meat: 6, detergent: 3, fuel: 10,
  },
  Brazil: {
    bread: 15, dairy: 12, eggs: 5, rice: 10,
    oil: 10, vegetables: 12, meat: 14, detergent: 3, fuel: 19,
  },
  Nigeria: {
    bread: 20, dairy: 8, eggs: 4, rice: 14,
    oil: 16, vegetables: 18, meat: 10, detergent: 2, fuel: 8,
  },
  Pakistan: {
    bread: 24, dairy: 18, eggs: 4, rice: 12,
    oil: 14, vegetables: 14, meat: 8, detergent: 2, fuel: 4,
  },
  Indonesia: {
    bread: 16, dairy: 10, eggs: 6, rice: 18,
    oil: 14, vegetables: 16, meat: 8, detergent: 3, fuel: 9,
  },
  'Türkiye': {
    bread: 22, dairy: 14, eggs: 5, rice: 6,
    oil: 12, vegetables: 16, meat: 12, detergent: 3, fuel: 10,
  },
  Ukraine: {
    bread: 24, dairy: 14, eggs: 6, rice: 4,
    oil: 12, vegetables: 14, meat: 10, detergent: 3, fuel: 13,
  },
  Morocco: {
    bread: 26, dairy: 12, eggs: 5, rice: 6,
    oil: 16, vegetables: 15, meat: 8, detergent: 2, fuel: 10,
  },
}

const DEFAULT_CPI_WEIGHTS: Partial<Record<CategoryId, number>> = {
  bread: 20, dairy: 12, eggs: 5, rice: 10,
  oil: 14, vegetables: 14, meat: 9, detergent: 3, fuel: 13,
}

/** The 9 individual categories that make up a basket (excludes "basket" itself). */
const BASKET_CATEGORIES: CategoryId[] = [
  'bread', 'dairy', 'eggs', 'rice', 'oil', 'vegetables', 'meat', 'detergent', 'fuel',
]

export function computeBasket(
  state: Omit<ScenarioState, 'category'>,
  enabledCategories: Set<CategoryId>,
  mode: PrecisionMode = 'display',
): BasketResult | null {
  if (!state.country) return null

  const weights = CPI_WEIGHTS[state.country] ?? DEFAULT_CPI_WEIGHTS
  const lagMultiplier = LAG_MULTIPLIERS[state.lag]

  const items: BasketItemResult[] = []

  for (const catId of BASKET_CATEGORIES) {
    const entry = findCountryEntry(state.war, catId, state.country)
    const cat = CATEGORY_MAP[catId]
    const cpiWeight = weights[catId] ?? 0
    const ceiling = entry?.p ?? 0
    const lagAdjustedImpact = roundValue(
      ceiling * (state.passthrough / 100) * lagMultiplier,
      mode,
    )
    const enabled = enabledCategories.has(catId)

    items.push({
      categoryId: catId,
      label: cat?.label ?? catId,
      icon: cat?.icon ?? '',
      cpiWeight,
      ceiling,
      lagAdjustedImpact,
      weightedContribution: 0, // computed below
      cpiContribution: roundValue((cpiWeight / 100) * lagAdjustedImpact, mode),
      enabled,
    })
  }

  // Compute weighted average on enabled items
  const enabledItems = items.filter((i) => i.enabled)
  const totalActiveWeight = enabledItems.reduce((s, i) => s + i.cpiWeight, 0)

  for (const item of enabledItems) {
    item.weightedContribution =
      totalActiveWeight > 0
        ? roundValue(
            (item.cpiWeight / totalActiveWeight) * item.lagAdjustedImpact,
            mode,
          )
        : 0
  }

  // Compute weighted average from full precision to avoid rounding-then-summing drift
  const weightedAverage = roundValue(
    enabledItems.reduce(
      (s, i) =>
        s +
        (totalActiveWeight > 0
          ? (i.cpiWeight / totalActiveWeight) * i.lagAdjustedImpact
          : 0),
      0,
    ),
    mode,
  )

  const cpiContribution = roundValue(
    enabledItems.reduce(
      (s, i) => s + (i.cpiWeight / 100) * i.lagAdjustedImpact,
      0,
    ),
    mode,
  )

  const scenarioState: ScenarioState = {
    ...state,
    category: 'basket' as CategoryId,
    provenance: state.provenance ?? getProvenance(),
  }

  return {
    items,
    weightedAverage,
    cpiContribution,
    scenarioId: buildScenarioId(scenarioState),
    provenance: scenarioState.provenance,
  }
}

/* ── Validation Guards ───────────────────────────────────────── */

export function validateScenarioState(
  state: Partial<ScenarioState>,
): ValidationError[] {
  const errors: ValidationError[] = []

  if (!state.war || !WARS[state.war]) {
    errors.push({ field: 'war', message: `Unknown conflict: ${state.war ?? 'none'}` })
  }
  if (!state.category || !CATEGORY_MAP[state.category]) {
    errors.push({
      field: 'category',
      message: `Unknown category: ${state.category ?? 'none'}`,
    })
  }
  if (state.country && !COUNTRY_MAP[state.country]) {
    errors.push({
      field: 'country',
      message: `Unknown country: ${state.country}`,
    })
  }
  if (
    state.passthrough !== undefined &&
    (state.passthrough < 0 || state.passthrough > 100)
  ) {
    errors.push({
      field: 'passthrough',
      message: `Pass-through out of range: ${state.passthrough}`,
    })
  }
  if (state.lag && !(state.lag in LAG_MULTIPLIERS)) {
    errors.push({ field: 'lag', message: `Unknown lag period: ${state.lag}` })
  }

  return errors
}

export function isScenarioComplete(
  state: Partial<ScenarioState>,
): state is ScenarioState {
  return (
    validateScenarioState(state).length === 0 &&
    !!state.war &&
    !!state.category &&
    !!state.country &&
    state.passthrough !== undefined &&
    !!state.lag
  )
}
