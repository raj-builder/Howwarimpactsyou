/**
 * Read/write/merge user refinements from localStorage.
 * Safe to call on server (returns empty if window is undefined).
 */

import type { UserRefinements, CategoryImpactRefinement, FxRefinement } from '@/types/user-refinements'
import { EMPTY_REFINEMENTS } from '@/types/user-refinements'

const STORAGE_KEY = 'hiyu_refinements_v1'

export function loadRefinements(): UserRefinements {
  if (typeof window === 'undefined') return EMPTY_REFINEMENTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_REFINEMENTS
    const parsed = JSON.parse(raw)
    if (parsed.version !== 1) return EMPTY_REFINEMENTS
    return parsed as UserRefinements
  } catch {
    return EMPTY_REFINEMENTS
  }
}

export function saveRefinements(r: UserRefinements): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...r, lastUpdated: new Date().toISOString() }))
}

export function clearRefinements(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

/** Find a user-supplied impact % for a country/category/war. Returns null if none. */
export function findImpactRefinement(
  r: UserRefinements,
  country: string,
  categoryId: string,
  warId: string,
): CategoryImpactRefinement | null {
  return r.categoryImpacts.find(
    (x) => x.country === country && x.categoryId === categoryId && x.warId === warId
  ) ?? null
}

/** Find user-supplied FX rate for a country/war. Returns null if none. */
export function findFxRefinement(
  r: UserRefinements,
  country: string,
  warId: string,
): FxRefinement | null {
  return r.fxRates.find((x) => x.country === country && x.warId === warId) ?? null
}

/** All user-added country names. Caller merges with COUNTRIES list. */
export function getUserCountryNames(r: UserRefinements): string[] {
  return r.newCountries.map((c) => c.country)
}

/** Export refinements as a downloadable JSON blob. */
export function exportRefinementsJSON(r: UserRefinements): string {
  return JSON.stringify(r, null, 2)
}
