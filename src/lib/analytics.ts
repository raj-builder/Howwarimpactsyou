'use client'

import { track } from '@vercel/analytics'

export function trackEvent(name: string, props?: Record<string, string | number>) {
  try {
    track(name, props)
  } catch {
    // silently fail if analytics not available
  }
}

// Pre-defined event helpers
export const analytics = {
  simulatorView: (war: string, category: string, country: string) =>
    trackEvent('simulator_view', { war, category, country }),
  scenarioPageView: (war: string, category: string) =>
    trackEvent('scenario_page_view', { war, category }),
  gateShown: () => trackEvent('gate_shown'),
  gateDismissed: () => trackEvent('gate_dismissed'),
  gateConverted: () => trackEvent('gate_converted'),
  shareClick: (method: string) => trackEvent('share_click', { method }),
  saveScenario: (war: string, category: string) =>
    trackEvent('save_scenario', { war, category }),
  compareView: () => trackEvent('compare_view'),
  presetClick: (presetId: string) => trackEvent('preset_click', { preset_id: presetId }),
  ctaClick: (location: string, label: string) =>
    trackEvent('cta_click', { location, label }),
}
