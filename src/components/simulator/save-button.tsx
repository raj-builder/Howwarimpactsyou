'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  isScenarioSaved,
  saveScenario,
  removeSavedScenario,
  getSavedScenarios,
} from '@/lib/saved-scenarios'
import { analytics } from '@/lib/analytics'

interface SaveButtonProps {
  war: string
  category: string
  country: string
  passthrough?: number
  lag?: string
}

export function SaveButton({
  war,
  category,
  country,
  passthrough = 0.6,
  lag = '3-6 months',
}: SaveButtonProps) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(isScenarioSaved(war, category, country))
  }, [war, category, country])

  const toggle = useCallback(() => {
    if (saved) {
      // Find and remove the matching scenario
      const scenarios = getSavedScenarios()
      const match = scenarios.find(
        (s) => s.war === war && s.category === category && s.country === country
      )
      if (match) {
        removeSavedScenario(match.id)
      }
      setSaved(false)
    } else {
      saveScenario({ war, category, country, passthrough, lag })
      analytics.saveScenario(war, category)
      setSaved(true)
    }
  }, [saved, war, category, country, passthrough, lag])

  return (
    <button
      onClick={toggle}
      title={saved ? 'Remove from saved scenarios' : 'Save this scenario'}
      className="inline-flex items-center gap-1.5 font-sans text-[0.8rem] font-semibold px-3 py-1.5 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40"
      style={{
        borderColor: saved ? 'var(--color-accent)' : 'var(--color-border)',
        color: saved ? 'var(--color-accent)' : 'var(--color-ink-soft)',
        backgroundColor: saved ? 'rgba(195,64,35,0.08)' : 'transparent',
      }}
    >
      {/* Bookmark icon */}
      <svg
        width="14"
        height="18"
        viewBox="0 0 14 18"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      >
        <path d="M1 3C1 1.89543 1.89543 1 3 1H11C12.1046 1 13 1.89543 13 3V17L7 13L1 17V3Z" />
      </svg>
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}
