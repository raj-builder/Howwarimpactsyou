import type { Country } from '@/types'

export const COUNTRIES: Country[] = [
  // Full coverage (10 core countries)
  { id: 'Philippines', name: 'Philippines', flag: '🇵🇭', coverage: 'full' },
  { id: 'Egypt', name: 'Egypt', flag: '🇪🇬', coverage: 'full' },
  { id: 'India', name: 'India', flag: '🇮🇳', coverage: 'full' },
  { id: 'Brazil', name: 'Brazil', flag: '🇧🇷', coverage: 'full' },
  { id: 'Nigeria', name: 'Nigeria', flag: '🇳🇬', coverage: 'full' },
  { id: 'Pakistan', name: 'Pakistan', flag: '🇵🇰', coverage: 'full' },
  { id: 'Indonesia', name: 'Indonesia', flag: '🇮🇩', coverage: 'full' },
  { id: 'Türkiye', name: 'Türkiye', flag: '🇹🇷', coverage: 'full' },
  { id: 'Ukraine', name: 'Ukraine', flag: '🇺🇦', coverage: 'full' },
  { id: 'Morocco', name: 'Morocco', flag: '🇲🇦', coverage: 'full' },
  // Partial coverage
  { id: 'Bangladesh', name: 'Bangladesh', flag: '🇧🇩', coverage: 'partial' },
  { id: 'Kenya', name: 'Kenya', flag: '🇰🇪', coverage: 'partial' },
  { id: 'Sri Lanka', name: 'Sri Lanka', flag: '🇱🇰', coverage: 'partial' },
  { id: 'Ghana', name: 'Ghana', flag: '🇬🇭', coverage: 'partial' },
  { id: 'South Africa', name: 'South Africa', flag: '🇿🇦', coverage: 'partial' },
  { id: 'Mexico', name: 'Mexico', flag: '🇲🇽', coverage: 'partial' },
  // Experimental
  { id: 'Argentina', name: 'Argentina', flag: '🇦🇷', coverage: 'experimental' },
  { id: 'Ethiopia', name: 'Ethiopia', flag: '🇪🇹', coverage: 'experimental' },
  { id: 'Vietnam', name: 'Vietnam', flag: '🇻🇳', coverage: 'experimental' },
  { id: 'Thailand', name: 'Thailand', flag: '🇹🇭', coverage: 'experimental' },
]

export const COUNTRY_MAP = Object.fromEntries(
  COUNTRIES.map((c) => [c.id, c])
) as Record<string, Country>

export const FLAG_MAP: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.id, c.flag])
)
