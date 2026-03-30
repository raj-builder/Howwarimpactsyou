import type { Country } from '@/types'

export const COUNTRIES: Country[] = [
  // Full coverage (10 core countries — complete rankings + FX data for all wars)
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

  // Partial coverage — Hormuz-dependent & major economies
  // East Asia (highest Hormuz dependency)
  { id: 'Japan', name: 'Japan', flag: '🇯🇵', coverage: 'partial' },
  { id: 'South Korea', name: 'South Korea', flag: '🇰🇷', coverage: 'partial' },
  { id: 'Taiwan', name: 'Taiwan', flag: '🇹🇼', coverage: 'partial' },
  { id: 'China', name: 'China', flag: '🇨🇳', coverage: 'partial' },

  // Southeast Asia
  { id: 'Thailand', name: 'Thailand', flag: '🇹🇭', coverage: 'partial' },
  { id: 'Vietnam', name: 'Vietnam', flag: '🇻🇳', coverage: 'partial' },
  { id: 'Malaysia', name: 'Malaysia', flag: '🇲🇾', coverage: 'partial' },
  { id: 'Singapore', name: 'Singapore', flag: '🇸🇬', coverage: 'partial' },
  { id: 'Myanmar', name: 'Myanmar', flag: '🇲🇲', coverage: 'partial' },
  { id: 'Cambodia', name: 'Cambodia', flag: '🇰🇭', coverage: 'partial' },

  // South Asia
  { id: 'Bangladesh', name: 'Bangladesh', flag: '🇧🇩', coverage: 'partial' },
  { id: 'Sri Lanka', name: 'Sri Lanka', flag: '🇱🇰', coverage: 'partial' },
  { id: 'Nepal', name: 'Nepal', flag: '🇳🇵', coverage: 'partial' },
  { id: 'Afghanistan', name: 'Afghanistan', flag: '🇦🇫', coverage: 'partial' },

  // Middle East & Gulf (directly affected)
  { id: 'Iraq', name: 'Iraq', flag: '🇮🇶', coverage: 'partial' },
  { id: 'Lebanon', name: 'Lebanon', flag: '🇱🇧', coverage: 'partial' },
  { id: 'Jordan', name: 'Jordan', flag: '🇯🇴', coverage: 'partial' },
  { id: 'Yemen', name: 'Yemen', flag: '🇾🇪', coverage: 'partial' },
  { id: 'Tunisia', name: 'Tunisia', flag: '🇹🇳', coverage: 'partial' },

  // Africa
  { id: 'Kenya', name: 'Kenya', flag: '🇰🇪', coverage: 'partial' },
  { id: 'South Africa', name: 'South Africa', flag: '🇿🇦', coverage: 'partial' },
  { id: 'Ghana', name: 'Ghana', flag: '🇬🇭', coverage: 'partial' },
  { id: 'Tanzania', name: 'Tanzania', flag: '🇹🇿', coverage: 'partial' },
  { id: 'Uganda', name: 'Uganda', flag: '🇺🇬', coverage: 'partial' },
  { id: 'Mozambique', name: 'Mozambique', flag: '🇲🇿', coverage: 'partial' },
  { id: 'Sudan', name: 'Sudan', flag: '🇸🇩', coverage: 'partial' },
  { id: 'Senegal', name: 'Senegal', flag: '🇸🇳', coverage: 'partial' },
  { id: 'Ethiopia', name: 'Ethiopia', flag: '🇪🇹', coverage: 'partial' },

  // Europe (energy import dependent)
  { id: 'Germany', name: 'Germany', flag: '🇩🇪', coverage: 'partial' },
  { id: 'United Kingdom', name: 'United Kingdom', flag: '🇬🇧', coverage: 'partial' },
  { id: 'France', name: 'France', flag: '🇫🇷', coverage: 'partial' },
  { id: 'Italy', name: 'Italy', flag: '🇮🇹', coverage: 'partial' },
  { id: 'Spain', name: 'Spain', flag: '🇪🇸', coverage: 'partial' },
  { id: 'Poland', name: 'Poland', flag: '🇵🇱', coverage: 'partial' },
  { id: 'Greece', name: 'Greece', flag: '🇬🇷', coverage: 'partial' },

  // Americas
  { id: 'Mexico', name: 'Mexico', flag: '🇲🇽', coverage: 'partial' },
  { id: 'Colombia', name: 'Colombia', flag: '🇨🇴', coverage: 'partial' },
  { id: 'Peru', name: 'Peru', flag: '🇵🇪', coverage: 'partial' },
  { id: 'Chile', name: 'Chile', flag: '🇨🇱', coverage: 'partial' },

  // Experimental
  { id: 'Argentina', name: 'Argentina', flag: '🇦🇷', coverage: 'experimental' },
  { id: 'Algeria', name: 'Algeria', flag: '🇩🇿', coverage: 'experimental' },
  { id: 'Libya', name: 'Libya', flag: '🇱🇾', coverage: 'experimental' },
  { id: 'Somalia', name: 'Somalia', flag: '🇸🇴', coverage: 'experimental' },
  { id: 'Venezuela', name: 'Venezuela', flag: '🇻🇪', coverage: 'experimental' },
]

export const COUNTRY_MAP = Object.fromEntries(
  COUNTRIES.map((c) => [c.id, c])
) as Record<string, Country>

export const FLAG_MAP: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.id, c.flag])
)
