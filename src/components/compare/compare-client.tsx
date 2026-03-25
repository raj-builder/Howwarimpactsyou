'use client'

import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useMemo, useCallback, useEffect, Suspense } from 'react'
import { WARS, WAR_LIST } from '@/data/wars'
import { CATEGORIES } from '@/data/categories'
import { analytics } from '@/lib/analytics'
import type { WarId, CategoryId, RankingEntry } from '@/types'

type SortKey = 'country' | 'left' | 'right' | 'delta'
type SortDir = 'asc' | 'desc'

interface ComparisonRow {
  flag: string
  country: string
  leftPct: number | null
  rightPct: number | null
  delta: number | null
}

function parseScenario(val: string | null): { war: WarId; category: CategoryId } | null {
  if (!val) return null
  const parts = val.split(':')
  if (parts.length !== 2) return null
  const war = parts[0] as WarId
  const category = parts[1] as CategoryId
  if (!WARS[war]) return null
  if (!CATEGORIES.find((c) => c.id === category)) return null
  return { war, category }
}

function getAllCountries(entries: RankingEntry[]): Map<string, { flag: string; pct: number }> {
  const map = new Map<string, { flag: string; pct: number }>()
  for (const e of entries) {
    map.set(e.c, { flag: e.f, pct: e.p })
  }
  return map
}

function CompareInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const leftParam = searchParams.get('left')
  const rightParam = searchParams.get('right')

  const leftScenario = parseScenario(leftParam)
  const rightScenario = parseScenario(rightParam)

  const [leftWar, setLeftWar] = useState<WarId>(leftScenario?.war ?? 'ukraine-russia')
  const [leftCat, setLeftCat] = useState<CategoryId>(leftScenario?.category ?? 'bread')
  const [rightWar, setRightWar] = useState<WarId>(rightScenario?.war ?? 'gaza-2023')
  const [rightCat, setRightCat] = useState<CategoryId>(rightScenario?.category ?? 'bread')
  const [sortKey, setSortKey] = useState<SortKey>('delta')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [mobileView, setMobileView] = useState<'left' | 'right'>('left')

  useEffect(() => {
    analytics.compareView()
  }, [])

  // Update URL when selections change
  const updateUrl = useCallback(
    (lw: WarId, lc: CategoryId, rw: WarId, rc: CategoryId) => {
      const params = new URLSearchParams()
      params.set('left', `${lw}:${lc}`)
      params.set('right', `${rw}:${rc}`)
      router.replace(`/compare?${params.toString()}`, { scroll: false })
    },
    [router]
  )

  const handleLeftWar = (v: WarId) => {
    setLeftWar(v)
    updateUrl(v, leftCat, rightWar, rightCat)
  }
  const handleLeftCat = (v: CategoryId) => {
    setLeftCat(v)
    updateUrl(leftWar, v, rightWar, rightCat)
  }
  const handleRightWar = (v: WarId) => {
    setRightWar(v)
    updateUrl(leftWar, leftCat, v, rightCat)
  }
  const handleRightCat = (v: CategoryId) => {
    setRightCat(v)
    updateUrl(leftWar, leftCat, rightWar, v)
  }

  // Build comparison rows
  const rows = useMemo<ComparisonRow[]>(() => {
    const leftRanking = WARS[leftWar]?.rankings[leftCat]
    const rightRanking = WARS[rightWar]?.rankings[rightCat]
    if (!leftRanking || !rightRanking) return []

    const leftEntries = [...leftRanking.top5, ...leftRanking.bot5]
    const rightEntries = [...rightRanking.top5, ...rightRanking.bot5]

    const leftMap = getAllCountries(leftEntries)
    const rightMap = getAllCountries(rightEntries)

    // Union of all countries
    const allCountries = new Set([...leftMap.keys(), ...rightMap.keys()])
    const result: ComparisonRow[] = []

    for (const country of allCountries) {
      const left = leftMap.get(country)
      const right = rightMap.get(country)
      const leftPct = left?.pct ?? null
      const rightPct = right?.pct ?? null
      const delta =
        leftPct !== null && rightPct !== null ? rightPct - leftPct : null

      result.push({
        flag: left?.flag ?? right?.flag ?? '',
        country,
        leftPct,
        rightPct,
        delta,
      })
    }

    return result
  }, [leftWar, leftCat, rightWar, rightCat])

  // Sort rows
  const sortedRows = useMemo(() => {
    const sorted = [...rows]
    sorted.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'country':
          cmp = a.country.localeCompare(b.country)
          break
        case 'left':
          cmp = (a.leftPct ?? 0) - (b.leftPct ?? 0)
          break
        case 'right':
          cmp = (a.rightPct ?? 0) - (b.rightPct ?? 0)
          break
        case 'delta':
          cmp = (a.delta ?? 0) - (b.delta ?? 0)
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return sorted
  }, [rows, sortKey, sortDir])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortDir === 'asc' ? ' \u2191' : ' \u2193') : ''

  const leftWarName = WARS[leftWar]?.name ?? leftWar
  const rightWarName = WARS[rightWar]?.name ?? rightWar
  const leftCatLabel = CATEGORIES.find((c) => c.id === leftCat)?.label ?? leftCat
  const rightCatLabel = CATEGORIES.find((c) => c.id === rightCat)?.label ?? rightCat

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a1a] via-[#2d2420] to-[#3a2216] text-white py-16 px-8 md:py-20">
        <div className="max-w-[1140px] mx-auto">
          <nav className="font-sans text-[0.75rem] text-white/40 mb-6">
            <Link
              href="/"
              className="text-white/40 no-underline hover:text-white/70 transition-colors"
            >
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/70">Compare</span>
          </nav>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-[1.2] mb-4 tracking-tight font-serif">
            Compare Scenarios
          </h1>
          <p className="text-[1.05rem] text-white/65 max-w-[600px] leading-relaxed font-serif">
            Select two war/shock scenarios and a consumer category for each,
            then compare country-level impact side by side.
          </p>
        </div>
      </section>

      <div className="container-page py-14">
        {/* Scenario selectors */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left scenario */}
            <div className="bg-bg-card border border-border rounded-[10px] p-6 shadow-card">
              <h3 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-3">
                Scenario A (Left)
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="font-sans text-[0.78rem] text-ink-muted block mb-1">
                    War / Shock
                  </label>
                  <select
                    value={leftWar}
                    onChange={(e) => handleLeftWar(e.target.value as WarId)}
                    className="w-full bg-bg-card border border-border rounded-md px-3 py-2 font-sans text-[0.85rem] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    {WAR_LIST.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[0.78rem] text-ink-muted block mb-1">
                    Category
                  </label>
                  <select
                    value={leftCat}
                    onChange={(e) => handleLeftCat(e.target.value as CategoryId)}
                    className="w-full bg-bg-card border border-border rounded-md px-3 py-2 font-sans text-[0.85rem] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Right scenario */}
            <div className="bg-bg-card border border-border rounded-[10px] p-6 shadow-card">
              <h3 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-3">
                Scenario B (Right)
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="font-sans text-[0.78rem] text-ink-muted block mb-1">
                    War / Shock
                  </label>
                  <select
                    value={rightWar}
                    onChange={(e) => handleRightWar(e.target.value as WarId)}
                    className="w-full bg-bg-card border border-border rounded-md px-3 py-2 font-sans text-[0.85rem] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    {WAR_LIST.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[0.78rem] text-ink-muted block mb-1">
                    Category
                  </label>
                  <select
                    value={rightCat}
                    onChange={(e) => handleRightCat(e.target.value as CategoryId)}
                    className="w-full bg-bg-card border border-border rounded-md px-3 py-2 font-sans text-[0.85rem] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile toggle */}
        <div className="md:hidden mb-4 flex gap-2">
          <button
            onClick={() => setMobileView('left')}
            className={`flex-1 font-sans text-[0.82rem] font-semibold px-4 py-2 rounded-md transition-colors ${
              mobileView === 'left'
                ? 'bg-accent text-white'
                : 'bg-bg-card border border-border text-ink-soft'
            }`}
          >
            Scenario A
          </button>
          <button
            onClick={() => setMobileView('right')}
            className={`flex-1 font-sans text-[0.82rem] font-semibold px-4 py-2 rounded-md transition-colors ${
              mobileView === 'right'
                ? 'bg-accent text-white'
                : 'bg-bg-card border border-border text-ink-soft'
            }`}
          >
            Scenario B
          </button>
        </div>

        {/* Comparison table */}
        <section>
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-3">
            Country-level comparison
          </h2>
          <div className="bg-bg-card border border-border rounded-[10px] shadow-card overflow-x-auto">
            <table className="w-full text-left text-[0.84rem] font-sans">
              <thead>
                <tr className="border-b border-border">
                  <th
                    className="px-4 py-3 font-semibold text-ink cursor-pointer hover:text-accent transition-colors select-none"
                    onClick={() => handleSort('country')}
                  >
                    Country{sortIndicator('country')}
                  </th>
                  <th
                    className={`px-4 py-3 font-semibold text-ink cursor-pointer hover:text-accent transition-colors text-right select-none ${
                      mobileView === 'right' ? 'hidden md:table-cell' : ''
                    }`}
                    onClick={() => handleSort('left')}
                  >
                    <span className="block text-[0.7rem] text-ink-muted font-normal truncate max-w-[180px]">
                      {leftWarName}
                    </span>
                    <span className="text-[0.72rem] text-ink-muted font-normal">
                      {leftCatLabel}
                    </span>
                    {sortIndicator('left')}
                  </th>
                  <th
                    className={`px-4 py-3 font-semibold text-ink cursor-pointer hover:text-accent transition-colors text-right select-none ${
                      mobileView === 'left' ? 'hidden md:table-cell' : ''
                    }`}
                    onClick={() => handleSort('right')}
                  >
                    <span className="block text-[0.7rem] text-ink-muted font-normal truncate max-w-[180px]">
                      {rightWarName}
                    </span>
                    <span className="text-[0.72rem] text-ink-muted font-normal">
                      {rightCatLabel}
                    </span>
                    {sortIndicator('right')}
                  </th>
                  <th
                    className="px-4 py-3 font-semibold text-ink cursor-pointer hover:text-accent transition-colors text-right hidden md:table-cell select-none"
                    onClick={() => handleSort('delta')}
                  >
                    Delta{sortIndicator('delta')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row) => {
                  const deltaColor =
                    row.delta === null
                      ? 'text-ink-muted'
                      : row.delta > 0
                        ? 'text-red-500'
                        : row.delta < 0
                          ? 'text-green-500'
                          : 'text-ink-muted'
                  const deltaStr =
                    row.delta === null
                      ? '\u2014'
                      : row.delta > 0
                        ? `+${row.delta.toFixed(1)}%`
                        : `${row.delta.toFixed(1)}%`

                  return (
                    <tr
                      key={row.country}
                      className="border-b border-border/50 hover:bg-border/20 transition-colors"
                    >
                      <td className="px-4 py-3 text-ink whitespace-nowrap">
                        <span className="mr-2">{row.flag}</span>
                        {row.country}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-mono text-[0.82rem] text-ink ${
                          mobileView === 'right' ? 'hidden md:table-cell' : ''
                        }`}
                      >
                        {row.leftPct !== null ? `${row.leftPct.toFixed(1)}%` : '\u2014'}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-mono text-[0.82rem] text-ink ${
                          mobileView === 'left' ? 'hidden md:table-cell' : ''
                        }`}
                      >
                        {row.rightPct !== null
                          ? `${row.rightPct.toFixed(1)}%`
                          : '\u2014'}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-mono text-[0.82rem] font-semibold hidden md:table-cell ${deltaColor}`}
                      >
                        {deltaStr}
                      </td>
                    </tr>
                  )
                })}
                {sortedRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-ink-muted"
                    >
                      No data available for the selected scenarios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}

export function CompareClient() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-14 text-center text-ink-muted font-sans">
          Loading compare view...
        </div>
      }
    >
      <CompareInner />
    </Suspense>
  )
}
