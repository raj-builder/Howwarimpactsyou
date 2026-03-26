import type { WarId, CategoryId, CoverageStatus } from './index'

/* ── Lag ─────────────────────────────────────────────────────── */

export type LagPeriod = 'immediate' | '3m' | '6m' | '12m'

/** Fraction of ceiling impact that materializes at each lag */
export const LAG_MULTIPLIERS: Record<LagPeriod, number> = {
  immediate: 1.0,
  '3m': 0.95,
  '6m': 0.88,
  '12m': 0.75,
} as const

export const LAG_LABELS: Record<LagPeriod, string> = {
  immediate: 'Immediate',
  '3m': '3 months',
  '6m': '6 months',
  '12m': '12 months',
} as const

/* ── Reliability ─────────────────────────────────────────────── */

export type ReliabilityStatus = 'validated' | 'indicative' | 'experimental'

/* ── Precision ───────────────────────────────────────────────── */

export type PrecisionMode = 'display' | 'audit'

/* ── Provenance ──────────────────────────────────────────────── */

export interface ProvenanceMetadata {
  modelVersion: string   // e.g. "1.0.0"
  snapshotDate: string   // ISO date, e.g. "2025-01-15"
  dataAsOf: string       // human-readable, e.g. "Jan 15, 2025"
  factorWindow: string   // e.g. "Feb 2022 – Jan 2023"
  sourceVersion: string  // e.g. "wars.ts@fc1ec55"
}

/* ── Scenario State ──────────────────────────────────────────── */

export interface ScenarioState {
  war: WarId
  category: CategoryId
  country: string         // country id, e.g. "Philippines"
  passthrough: number     // 0–100 integer
  lag: LagPeriod
  provenance: ProvenanceMetadata
}

/** Deterministic identity string: war:category:country:pt:lag */
export type ScenarioIdentity = string

/* ── Factor Contribution ─────────────────────────────────────── */

export interface FactorContribution {
  label: string
  absolutePct: number     // contribution to headline in pp
  sharePct: number        // share of headline (sums to ~100)
  color: string           // Tailwind color class
}

/* ── Scenario Result ─────────────────────────────────────────── */

export interface ScenarioResult {
  scenarioId: ScenarioIdentity
  ceiling: number              // raw from rankings data
  adjustedCeiling: number      // ceiling × (passthrough / 100)
  lagMultiplier: number        // from LAG_MULTIPLIERS
  lagAdjustedCeiling: number   // adjustedCeiling × lagMultiplier
  rangeLow: number             // lagAdjustedCeiling × 0.55
  rangeHigh: number            // lagAdjustedCeiling × 0.75
  realized: number             // lagAdjustedCeiling × 0.65 (deterministic)
  modelGap: number             // lagAdjustedCeiling − realized
  factors: FactorContribution[]
  coverage: CoverageStatus
  reliability: ReliabilityStatus
  provenance: ProvenanceMetadata
}

/* ── Basket ───────────────────────────────────────────────────── */

export interface BasketItemResult {
  categoryId: CategoryId
  label: string
  icon: string
  cpiWeight: number            // 0–100
  ceiling: number              // raw from rankings
  lagAdjustedImpact: number    // after passthrough and lag
  weightedContribution: number // (cpiWeight / totalActiveWeight) × lagAdjustedImpact
  cpiContribution: number      // (cpiWeight / 100) × lagAdjustedImpact (pp)
  enabled: boolean
}

export interface BasketResult {
  items: BasketItemResult[]
  weightedAverage: number      // weighted average on enabled items
  cpiContribution: number      // sum of cpi contributions (pp of CPI)
  scenarioId: ScenarioIdentity
  provenance: ProvenanceMetadata
}

/* ── Validation ──────────────────────────────────────────────── */

export interface ValidationError {
  field: string
  message: string
}
