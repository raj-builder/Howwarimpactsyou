export interface SavedScenario {
  id: string
  war: string
  category: string
  country: string
  passthrough: number
  lag: string
  savedAt: string
}

const STORAGE_KEY = 'hwiy_saved_scenarios'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function getSavedScenarios(): SavedScenario[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SavedScenario[]
  } catch {
    return []
  }
}

export function saveScenario(s: Omit<SavedScenario, 'id' | 'savedAt'>): void {
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

export function isScenarioSaved(war: string, category: string, country: string): boolean {
  return getSavedScenarios().some(
    (s) => s.war === war && s.category === category && s.country === country
  )
}
