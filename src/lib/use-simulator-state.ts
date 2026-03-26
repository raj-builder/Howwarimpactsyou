'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useCallback, useEffect, useMemo } from 'react'
import type { WarId, CategoryId } from '@/types'
import type { LagPeriod, ScenarioState } from '@/types/scenario'
import { LAG_MULTIPLIERS } from '@/types/scenario'
import { buildScenarioId, getProvenance } from '@/lib/calculations'

/** Validate and coerce a lag string to LagPeriod, defaulting to '6m'. */
function parseLag(raw: string | null): LagPeriod {
  if (raw && raw in LAG_MULTIPLIERS) return raw as LagPeriod
  return '6m'
}

export function useSimulatorState() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [war, setWar] = useState<WarId>(
    (searchParams.get('war') as WarId) || 'ukraine-russia',
  )
  const [category, setCategory] = useState<CategoryId>(
    (searchParams.get('category') as CategoryId) || 'bread',
  )
  const [country, setCountry] = useState(
    searchParams.get('country') || '',
  )
  const [passthrough, setPassthrough] = useState(
    Number(searchParams.get('pt')) || 100,
  )
  const [lag, setLag] = useState<LagPeriod>(
    parseLag(searchParams.get('lag')),
  )

  // Always serialize ALL params — no elision of defaults.
  // This ensures share links are fully deterministic.
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams()
    params.set('war', war)
    params.set('category', category)
    if (country) params.set('country', country)
    params.set('pt', String(passthrough))
    params.set('lag', lag)
    router.replace(`/simulator?${params.toString()}`, { scroll: false })
  }, [war, category, country, passthrough, lag, router])

  useEffect(() => {
    updateUrl()
  }, [updateUrl])

  // Expose a full ScenarioState for calculation consumers
  const scenarioState: ScenarioState | null = useMemo(() => {
    if (!country) return null
    return {
      war,
      category,
      country,
      passthrough,
      lag,
      provenance: getProvenance(),
    }
  }, [war, category, country, passthrough, lag])

  const scenarioId = useMemo(() => {
    if (!country) return null
    return buildScenarioId({ war, category, country, passthrough, lag })
  }, [war, category, country, passthrough, lag])

  return {
    war,
    setWar,
    category,
    setCategory,
    country,
    setCountry,
    passthrough,
    setPassthrough,
    lag,
    setLag,
    scenarioState,
    scenarioId,
  }
}
