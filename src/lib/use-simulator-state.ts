'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useCallback, useEffect } from 'react'
import type { WarId, CategoryId } from '@/types'

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
  const [lag, setLag] = useState(searchParams.get('lag') || '6m')

  // Sync to URL on change
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams()
    params.set('war', war)
    params.set('category', category)
    if (country) params.set('country', country)
    if (passthrough !== 100) params.set('pt', String(passthrough))
    if (lag !== '6m') params.set('lag', lag)
    router.replace(`/simulator?${params.toString()}`, { scroll: false })
  }, [war, category, country, passthrough, lag, router])

  useEffect(() => {
    updateUrl()
  }, [updateUrl])

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
  }
}
