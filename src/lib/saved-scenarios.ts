import type { LagPeriod } from '@/types/scenario'

export interface SavedScenario {
  id: string
  war: string
  category: string
  country: string
  passthrough: number   // 0–100 integer
  lag: LagPeriod
  savedAt: string
  snapshotDate?: string
  modelVersion?: string
}

const STORAGE_KEY = 'hwiy_saved_scenarios'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Migrate saved scenarios from older formats:
 * - passthrough stored as decimal (0.6) → convert to integer (60)
 * - lag stored as freeform string ('3-6 months') → coerce to LagPeriod
 */
function migrateScenario(s: Record<string, unknown>): SavedScenario {
  let pt = Number(s.passthrough ?? 100)
  // If passthrough is a decimal < 1, it was stored as a fraction
  if (pt > 0 && pt < 1) {
    pt = Math.round(pt * 100)
  }
  // Clamp to valid range
  pt = Math.max(0, Math.min(100, pt))

  let lag: LagPeriod = '6m'
  const rawLag = String(s.lag ?? '6m')
  if (rawLag === 'immediate' || rawLag === '3m' || rawLag === '6m' || rawLag === '12m') {
    lag = rawLag
  }
  // Attempt to map freeform lag strings
  else if (rawLag.includes('3') && rawLag.includes('6')) lag = '6m'
  else if (rawLag.includes('12') || rawLag.includes('year')) lag = '12m'
  else if (rawLag.includes('3')) lag = '3m'
  else if (rawLag.toLowerCase().includes('imm')) lag = 'immediate'

  return {
    id: String(s.id ?? generateId()),
    war: String(s.war ?? ''),
    category: String(s.category ?? ''),
    country: String(s.country ?? ''),
    passthrough: pt,
    lag,
    savedAt: String(s.savedAt ?? new Date().toISOString()),
    snapshotDate: s.snapshotDate ? String(s.snapshotDate) : undefined,
    modelVersion: s.modelVersion ? String(s.modelVersion) : undefined,
  }
}

export function getSavedScenarios(): SavedScenario[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Record<string, unknown>[]
    return parsed.map(migrateScenario)
  } catch {
    return []
  }
}

export function saveScenario(
  s: Omit<SavedScenario, 'id' | 'savedAt'>,
): void {
  const scenarios = getSavedScenarios()
  const newScenario: SavedScenario = {
    ...s,
    id: generateId(),
    savedAt: new Date().toISOString(),
  }
  scenarios.unshift(newScenario)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios))
}

export function removeSavedScenario(id: string): void {
  const scenarios = getSavedScenarios().filter((s) => s.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios))
}

export function isScenarioSaved(
  war: string,
  category: string,
  country: string,
): boolean {
  return getSavedScenarios().some(
    (s) => s.war === war && s.category === category && s.country === country,
  )
}
