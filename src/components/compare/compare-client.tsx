'use client'

import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useMemo, useCallback, useEffect, Suspense } from 'react'
import { WARS, WAR_LIST } from '@/data/wars'
import { CATEGORIES } from '@/data/categories'
import { COUNTRY_MAP } from '@/data/countries'
import { roundValue } from '@/lib/calculations'
import { analytics } from '@/lib/analytics'
import { useT } from '@/lib/use-t'
import type { WarId, CategoryId, RankingEntry, CoverageStatus } from '@/types'
import { LAG_MULTIPLIERS, LAG_LABELS } from '@/types/scenario'
import type { LagPeriod } from '@/types/scenario'

type SortKey = 'country' | 'left' | 'right' | 'delta'
type SortDir = 'asc' | 'desc'

const PASS_OPTIONS = [100, 75, 50, 25] as const
const LAG_OPTIONS: LagPeriod[] = ['immediate', '3m', '6m', '12m']

interface ComparisonRow {
  flag: string
  country: string
  coverage: CoverageStatus
  leftPct: number | null
  rightPct: number | null
  delta: number | null
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

  // Parse URL params
  const leftParam = searchParams.get('left')
  const rightParam = searchParams.get('right')
  const leftParts = leftParam?.split(':') ?? []
  const rightParts = rightParam?.split(':') ?? []

  const [leftWar, setLeftWar] = useState<WarId>((leftParts[0] as WarId) || 'ukraine-russia')
  const [leftCat, setLeftCat] = useState<CategoryId>((leftParts[1] as CategoryId) || 'bread')
  const [leftPt, setLeftPt] = useState(Number(searchParams.get('lpt')) || 100)
  const [leftLag, setLeftLag] = useState<LagPeriod>((searchParams.get('llag') as LagPeriod) || '6m')
  const [rightWar, setRightWar] = useState<WarId>((rightParts[0] as WarId) || 'gaza-2023')
  const [rightCat, setRightCat] = useState<CategoryId>((rightParts[1] as CategoryId) || 'bread')
  const [rightPt, setRightPt] = useState(Number(searchParams.get('rpt')) || 100)
  const [rightLag, setRightLag] = useState<LagPeriod>((searchParams.get('rlag') as LagPeriod) || '6m')
  const [sortKey, setSortKey] = useState<SortKey>('delta')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [mobileView, setMobileView] = useState<'left' | 'right'>('left')

  const t = useT()
  useEffect(() => { analytics.compareView() }, [])

  const updateUrl = useCallback(
    (lw: WarId, lc: CategoryId, lp: number, ll: LagPeriod, rw: WarId, rc: CategoryId, rp: number, rl: LagPeriod) => {
      const params = new URLSearchParams()
      params.set('left', `${lw}:${lc}`)
      params.set('right', `${rw}:${rc}`)
      params.set('lpt', String(lp))
      params.set('llag', ll)
      params.set('rpt', String(rp))
      params.set('rlag', rl)
      router.replace(`/compare?${params.toString()}`, { scroll: false })
    },
    [router]
  )

  const sync = useCallback(() => {
    updateUrl(leftWar, leftCat, leftPt, leftLag, rightWar, rightCat, rightPt, rightLag)
  }, [updateUrl, leftWar, leftCat, leftPt, leftLag, rightWar, rightCat, rightPt, rightLag])

  useEffect(() => { sync() }, [sync])

  // Build comparison rows with lag and passthrough applied
  const rows = useMemo<ComparisonRow[]>(() => {
    const leftRanking = WARS[leftWar]?.rankings[leftCat]
    const rightRanking = WARS[rightWar]?.rankings[rightCat]
    if (!leftRanking || !rightRanking) return []

    const leftEntries = [...leftRanking.top5, ...leftRanking.bot5]
    const rightEntries = [...rightRanking.top5, ...rightRanking.bot5]
    const leftMap = getAllCountries(leftEntries)
    const rightMap = getAllCountries(rightEntries)

    const leftMult = LAG_MULTIPLIERS[leftLag] * (leftPt / 100)
    const rightMult = LAG_MULTIPLIERS[rightLag] * (rightPt / 100)

    const allCountries = new Set([...leftMap.keys(), ...rightMap.keys()])
    const result: ComparisonRow[] = []

    for (const country of allCountries) {
      const left = leftMap.get(country)
      const right = rightMap.get(country)
      const leftPct = left ? roundValue(left.pct * leftMult, 'display') : null
      const rightPct = right ? roundValue(right.pct * rightMult, 'display') : null
      const delta = leftPct !== null && rightPct !== null ? roundValue(rightPct - leftPct, 'display') : null
      const coverage = COUNTRY_MAP[country]?.coverage ?? 'unavailable'

      result.push({ flag: left?.flag ?? right?.flag ?? '', country, coverage, leftPct, rightPct, delta })
    }
    return result
  }, [leftWar, leftCat, leftPt, leftLag, rightWar, rightCat, rightPt, rightLag])

  const sortedRows = useMemo(() => {
    const sorted = [...rows]
    sorted.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'country': cmp = a.country.localeCompare(b.country); break
        case 'left': cmp = (a.leftPct ?? 0) - (b.leftPct ?? 0); break
        case 'right': cmp = (a.rightPct ?? 0) - (b.rightPct ?? 0); break
        case 'delta': cmp = (a.delta ?? 0) - (b.delta ?? 0); break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return sorted
  }, [rows, sortKey, sortDir])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
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
            <Link href="/" className="text-white/40 no-underline hover:text-white/70 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white/70">Compare</span>
          </nav>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-[1.2] mb-4 tracking-tight font-serif">
            {t('compare.title')}
          </h1>
          <p className="text-[1.05rem] text-white/65 max-w-[600px] leading-relaxed font-serif">
            {t('compare.subtitle')}
          </p>
        </div>
      </section>

      <div className="container-page py-14">
        {/* Scenario selectors */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left scenario */}
            <ScenarioSelector
              label="Scenario A (Left)"
              war={leftWar} onWarChange={setLeftWar}
              cat={leftCat} onCatChange={setLeftCat}
              pt={leftPt} onPtChange={setLeftPt}
              lag={leftLag} onLagChange={setLeftLag}
            />
            {/* Right scenario */}
            <ScenarioSelector
              label="Scenario B (Right)"
              war={rightWar} onWarChange={setRightWar}
              cat={rightCat} onCatChange={setRightCat}
              pt={rightPt} onPtChange={setRightPt}
              lag={rightLag} onLagChange={setRightLag}
            />
          </div>
        </section>

        {/* Assumption strip */}
        <div className="bg-bg-alt border border-border rounded-lg px-4 py-2.5 mb-5 flex flex-wrap gap-x-5 gap-y-1 font-sans text-[0.72rem] text-ink-muted">
          <span>A: <strong className="text-ink">{leftPt}% PT · {LAG_LABELS[leftLag]} lag</strong></span>
          <span>B: <strong className="text-ink">{rightPt}% PT · {LAG_LABELS[rightLag]} lag</strong></span>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden mb-4 flex gap-2">
          <button
            onClick={() => setMobileView('left')}
            className={`flex-1 font-sans text-[0.82rem] font-semibold px-4 py-2 rounded-md transition-colors ${
              mobileView === 'left' ? 'bg-accent text-white' : 'bg-bg-card border border-border text-ink-soft'
            }`}
          >Scenario A</button>
          <button
            onClick={() => setMobileView('right')}
            className={`flex-1 font-sans text-[0.82rem] font-semibold px-4 py-2 rounded-md transition-colors ${
              mobileView === 'right' ? 'bg-accent text-white' : 'bg-bg-card border border-border text-ink-soft'
            }`}
          >Scenario B</button>
        </div>

        {/* Comparison table */}
        <section>
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-3">
            {t('compare.countryComparison')}
          </h2>
          <div className="bg-bg-card border border-border rounded-[10px] shadow-card overflow-x-auto">
            <table className="w-full text-left text-[0.84rem] font-sans">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 font-semibold text-ink cursor-pointer hover:text-accent transition-colors select-none" onClick={() => handleSort('country')}>
                    Country{sortIndicator('country')}
                  </th>
                  <th className={`px-4 py-3 font-semibold text-ink cursor-pointer hover:text-accent transition-colors text-right select-none ${mobileView === 'right' ? 'hidden md:table-cell' : ''}`} onClick={() => handleSort('left')}>
                    <span className="block text-[0.7rem] text-ink-muted font-normal truncate max-w-[180px]">{leftWarName}</span>
                    <span className="text-[0.72rem] text-ink-muted font-normal">{leftCatLabel}</span>
                    {sortIndicator('left')}
                  </th>
                  <th className={`px-4 py-3 font-semibold text-ink cursor-pointer hover:text-accent transition-colors text-right select-none ${mobileView === 'left' ? 'hidden md:table-cell' : ''}`} onClick={() => handleSort('right')}>
                    <span className="block text-[0.7rem] text-ink-muted font-normal truncate max-w-[180px]">{rightWarName}</span>
                    <span className="text-[0.72rem] text-ink-muted font-normal">{rightCatLabel}</span>
                    {sortIndicator('right')}
                  </th>
                  <th className="px-4 py-3 font-semibold text-ink cursor-pointer hover:text-accent transition-colors text-right hidden md:table-cell select-none" onClick={() => handleSort('delta')}>
                    {t('compare.delta')}{sortIndicator('delta')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row) => {
                  const deltaColor = row.delta === null ? 'text-ink-muted' : row.delta > 0 ? 'text-red-500' : row.delta < 0 ? 'text-green-500' : 'text-ink-muted'
                  const deltaStr = row.delta === null ? '\u2014' : row.delta > 0 ? `+${row.delta}%` : `${row.delta}%`

                  return (
                    <tr key={row.country} className="border-b border-border/50 hover:bg-border/20 transition-colors">
                      <td className="px-4 py-3 text-ink whitespace-nowrap">
                        <span className="mr-2">{row.flag}</span>
                        {row.country}
                        {row.coverage !== 'full' && (
                          <span className={`ml-1.5 font-sans text-[0.55rem] font-semibold px-1 py-0.5 rounded ${
                            row.coverage === 'partial' ? 'bg-amber-light text-amber' :
                            row.coverage === 'experimental' ? 'bg-blue-light text-blue' :
                            'bg-bg-alt text-ink-muted'
                          }`}>{row.coverage}</span>
                        )}
                      </td>
                      <td className={`px-4 py-3 text-right font-mono text-[0.82rem] text-ink ${mobileView === 'right' ? 'hidden md:table-cell' : ''}`}>
                        {row.leftPct !== null ? `+${row.leftPct}%` : '\u2014'}
                      </td>
                      <td className={`px-4 py-3 text-right font-mono text-[0.82rem] text-ink ${mobileView === 'left' ? 'hidden md:table-cell' : ''}`}>
                        {row.rightPct !== null ? `+${row.rightPct}%` : '\u2014'}
                      </td>
                      <td className={`px-4 py-3 text-right font-mono text-[0.82rem] font-semibold hidden md:table-cell ${deltaColor}`}>
                        {deltaStr}
                      </td>
                    </tr>
                  )
                })}
                {sortedRows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-ink-muted">
                      {t('compare.noData')}
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

/* ── Scenario selector sub-component ─────────────────────────── */

function ScenarioSelector({
  label,
  war, onWarChange,
  cat, onCatChange,
  pt, onPtChange,
  lag, onLagChange,
}: {
  label: string
  war: WarId; onWarChange: (v: WarId) => void
  cat: CategoryId; onCatChange: (v: CategoryId) => void
  pt: number; onPtChange: (v: number) => void
  lag: LagPeriod; onLagChange: (v: LagPeriod) => void
}) {
  return (
    <div className="bg-bg-card border border-border rounded-[10px] p-6 shadow-card">
      <h3 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-3">
        {label}
      </h3>
      <div className="space-y-3">
        <div>
          <label className="font-sans text-[0.78rem] text-ink-muted block mb-1">War / Shock</label>
          <select
            value={war}
            onChange={(e) => onWarChange(e.target.value as WarId)}
            className="w-full bg-bg-card border border-border rounded-md px-3 py-2 font-sans text-[0.85rem] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            {WAR_LIST.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-sans text-[0.78rem] text-ink-muted block mb-1">Category</label>
          <select
            value={cat}
            onChange={(e) => onCatChange(e.target.value as CategoryId)}
            className="w-full bg-bg-card border border-border rounded-md px-3 py-2 font-sans text-[0.85rem] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-sans text-[0.78rem] text-ink-muted block mb-1">Pass-through</label>
          <div className="flex gap-1.5">
            {PASS_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => onPtChange(p)}
                className={`flex-1 font-sans text-[0.72rem] font-semibold py-1.5 rounded-md border transition-all cursor-pointer ${
                  pt === p ? 'border-accent bg-accent text-white' : 'border-border bg-bg-card text-ink-soft hover:border-accent-warm'
                }`}
              >{p}%</button>
            ))}
          </div>
        </div>
        <div>
          <label className="font-sans text-[0.78rem] text-ink-muted block mb-1">Lag</label>
          <div className="flex gap-1.5">
            {LAG_OPTIONS.map((l) => (
              <button
                key={l}
                onClick={() => onLagChange(l)}
                className={`flex-1 font-sans text-[0.68rem] font-semibold py-1.5 rounded-md border transition-all cursor-pointer ${
                  lag === l ? 'border-accent bg-accent text-white' : 'border-border bg-bg-card text-ink-soft hover:border-accent-warm'
                }`}
              >{LAG_LABELS[l]}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
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
