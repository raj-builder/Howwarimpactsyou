import type { Country } from '@/types'

export const COUNTRIES: Country[] = [
  // Full coverage (10 core countries)
  { id: 'Philippines', name: 'Philippines', flag: '🇵🇭', coverage: 'full', region: 'Southeast Asia' },
  { id: 'Egypt', name: 'Egypt', flag: '🇪🇬', coverage: 'full', region: 'Middle East & North Africa' },
  { id: 'India', name: 'India', flag: '🇮🇳', coverage: 'full', region: 'South Asia' },
  { id: 'Brazil', name: 'Brazil', flag: '🇧🇷', coverage: 'full', region: 'Americas' },
  { id: 'Nigeria', name: 'Nigeria', flag: '🇳🇬', coverage: 'full', region: 'Sub-Saharan Africa' },
  { id: 'Pakistan', name: 'Pakistan', flag: '🇵🇰', coverage: 'full', region: 'South Asia' },
  { id: 'Indonesia', name: 'Indonesia', flag: '🇮🇩', coverage: 'full', region: 'Southeast Asia' },
  { id: 'Türkiye', name: 'Türkiye', flag: '🇹🇷', coverage: 'full', region: 'Middle East & North Africa' },
  { id: 'Ukraine', name: 'Ukraine', flag: '🇺🇦', coverage: 'full', region: 'Europe' },
  { id: 'Morocco', name: 'Morocco', flag: '🇲🇦', coverage: 'full', region: 'Middle East & North Africa' },

  // East Asia
  { id: 'Japan', name: 'Japan', flag: '🇯🇵', coverage: 'partial', region: 'East Asia' },
  { id: 'South Korea', name: 'South Korea', flag: '🇰🇷', coverage: 'partial', region: 'East Asia' },
  { id: 'Taiwan', name: 'Taiwan', flag: '🇹🇼', coverage: 'partial', region: 'East Asia' },
  { id: 'China', name: 'China', flag: '🇨🇳', coverage: 'partial', region: 'East Asia' },

  // Southeast Asia
  { id: 'Thailand', name: 'Thailand', flag: '🇹🇭', coverage: 'partial', region: 'Southeast Asia' },
  { id: 'Vietnam', name: 'Vietnam', flag: '🇻🇳', coverage: 'partial', region: 'Southeast Asia' },
  { id: 'Malaysia', name: 'Malaysia', flag: '🇲🇾', coverage: 'partial', region: 'Southeast Asia' },
  { id: 'Singapore', name: 'Singapore', flag: '🇸🇬', coverage: 'partial', region: 'Southeast Asia' },
  { id: 'Myanmar', name: 'Myanmar', flag: '🇲🇲', coverage: 'partial', region: 'Southeast Asia' },
  { id: 'Cambodia', name: 'Cambodia', flag: '🇰🇭', coverage: 'partial', region: 'Southeast Asia' },

  // South Asia
  { id: 'Bangladesh', name: 'Bangladesh', flag: '🇧🇩', coverage: 'partial', region: 'South Asia' },
  { id: 'Sri Lanka', name: 'Sri Lanka', flag: '🇱🇰', coverage: 'partial', region: 'South Asia' },
  { id: 'Nepal', name: 'Nepal', flag: '🇳🇵', coverage: 'partial', region: 'South Asia' },
  { id: 'Afghanistan', name: 'Afghanistan', flag: '🇦🇫', coverage: 'partial', region: 'South Asia' },

  // Middle East & North Africa
  { id: 'Iraq', name: 'Iraq', flag: '🇮🇶', coverage: 'partial', region: 'Middle East & North Africa' },
  { id: 'Lebanon', name: 'Lebanon', flag: '🇱🇧', coverage: 'partial', region: 'Middle East & North Africa' },
  { id: 'Jordan', name: 'Jordan', flag: '🇯🇴', coverage: 'partial', region: 'Middle East & North Africa' },
  { id: 'Yemen', name: 'Yemen', flag: '🇾🇪', coverage: 'partial', region: 'Middle East & North Africa' },
  { id: 'Tunisia', name: 'Tunisia', flag: '🇹🇳', coverage: 'partial', region: 'Middle East & North Africa' },

  // Sub-Saharan Africa
  { id: 'Kenya', name: 'Kenya', flag: '🇰🇪', coverage: 'partial', region: 'Sub-Saharan Africa' },
  { id: 'South Africa', name: 'South Africa', flag: '🇿🇦', coverage: 'partial', region: 'Sub-Saharan Africa' },
  { id: 'Ghana', name: 'Ghana', flag: '🇬🇭', coverage: 'partial', region: 'Sub-Saharan Africa' },
  { id: 'Tanzania', name: 'Tanzania', flag: '🇹🇿', coverage: 'partial', region: 'Sub-Saharan Africa' },
  { id: 'Uganda', name: 'Uganda', flag: '🇺🇬', coverage: 'partial', region: 'Sub-Saharan Africa' },
  { id: 'Mozambique', name: 'Mozambique', flag: '🇲🇿', coverage: 'partial', region: 'Sub-Saharan Africa' },
  { id: 'Sudan', name: 'Sudan', flag: '🇸🇩', coverage: 'partial', region: 'Sub-Saharan Africa' },
  { id: 'Senegal', name: 'Senegal', flag: '🇸🇳', coverage: 'partial', region: 'Sub-Saharan Africa' },
  { id: 'Ethiopia', name: 'Ethiopia', flag: '🇪🇹', coverage: 'partial', region: 'Sub-Saharan Africa' },

  // Europe
  { id: 'Germany', name: 'Germany', flag: '🇩🇪', coverage: 'partial', region: 'Europe' },
  { id: 'United Kingdom', name: 'United Kingdom', flag: '🇬🇧', coverage: 'partial', region: 'Europe' },
  { id: 'France', name: 'France', flag: '🇫🇷', coverage: 'partial', region: 'Europe' },
  { id: 'Italy', name: 'Italy', flag: '🇮🇹', coverage: 'partial', region: 'Europe' },
  { id: 'Spain', name: 'Spain', flag: '🇪🇸', coverage: 'partial', region: 'Europe' },
  { id: 'Poland', name: 'Poland', flag: '🇵🇱', coverage: 'partial', region: 'Europe' },
  { id: 'Greece', name: 'Greece', flag: '🇬🇷', coverage: 'partial', region: 'Europe' },

  // Middle East — belligerent / directly involved
  { id: 'Iran', name: 'Iran', flag: '🇮🇷', coverage: 'partial', region: 'Middle East & North Africa' },
  { id: 'Israel', name: 'Israel', flag: '🇮🇱', coverage: 'partial', region: 'Middle East & North Africa' },
  { id: 'Saudi Arabia', name: 'Saudi Arabia', flag: '🇸🇦', coverage: 'partial', region: 'Middle East & North Africa' },
  { id: 'UAE', name: 'UAE', flag: '🇦🇪', coverage: 'partial', region: 'Middle East & North Africa' },
  { id: 'Kuwait', name: 'Kuwait', flag: '🇰🇼', coverage: 'partial', region: 'Middle East & North Africa' },
  { id: 'Qatar', name: 'Qatar', flag: '🇶🇦', coverage: 'partial', region: 'Middle East & North Africa' },
  { id: 'Bahrain', name: 'Bahrain', flag: '🇧🇭', coverage: 'partial', region: 'Middle East & North Africa' },

  // Americas
  { id: 'United States', name: 'United States', flag: '🇺🇸', coverage: 'partial', region: 'Americas' },
  { id: 'Mexico', name: 'Mexico', flag: '🇲🇽', coverage: 'partial', region: 'Americas' },
  { id: 'Colombia', name: 'Colombia', flag: '🇨🇴', coverage: 'partial', region: 'Americas' },
  { id: 'Peru', name: 'Peru', flag: '🇵🇪', coverage: 'partial', region: 'Americas' },
  { id: 'Chile', name: 'Chile', flag: '🇨🇱', coverage: 'partial', region: 'Americas' },

  // Asia Pacific
  { id: 'Australia', name: 'Australia', flag: '🇦🇺', coverage: 'partial', region: 'Asia Pacific' },
  { id: 'New Zealand', name: 'New Zealand', flag: '🇳🇿', coverage: 'partial', region: 'Asia Pacific' },

  // Experimental
  { id: 'Argentina', name: 'Argentina', flag: '🇦🇷', coverage: 'experimental', region: 'Americas' },
  { id: 'Algeria', name: 'Algeria', flag: '🇩🇿', coverage: 'experimental', region: 'Middle East & North Africa' },
  { id: 'Libya', name: 'Libya', flag: '🇱🇾', coverage: 'experimental', region: 'Middle East & North Africa' },
  { id: 'Somalia', name: 'Somalia', flag: '🇸🇴', coverage: 'experimental', region: 'Sub-Saharan Africa' },
  { id: 'Venezuela', name: 'Venezuela', flag: '🇻🇪', coverage: 'experimental', region: 'Americas' },
]

export const COUNTRY_MAP = Object.fromEntries(
  COUNTRIES.map((c) => [c.id, c])
) as Record<string, Country>

export const FLAG_MAP: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.id, c.flag])
)
