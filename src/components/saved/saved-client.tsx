'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { getSavedScenarios, removeSavedScenario } from '@/lib/saved-scenarios'
import type { SavedScenario } from '@/lib/saved-scenarios'
import { WARS } from '@/data/wars'
import { CATEGORY_MAP } from '@/data/categories'
import { COUNTRY_MAP } from '@/data/countries'
import { CoverageBadge } from '@/components/ui/coverage-badge'
import { ReliabilityBadge } from '@/components/ui/reliability-badge'
import { getReliability } from '@/lib/calculations'
import type { WarId, CategoryId } from '@/types'
import { LAG_LABELS } from '@/types/scenario'
import type { LagPeriod } from '@/types/scenario'

export function SavedClient() {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setScenarios(getSavedScenarios())
    setLoaded(true)
  }, [])

  const handleRemove = useCallback((id: string) => {
    removeSavedScenario(id)
    setScenarios(getSavedScenarios())
  }, [])

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return iso
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a1a] via-[#2d2420] to-[#3a2216] text-white py-16 px-8 md:py-20">
        <div className="max-w-[820px] mx-auto">
          <nav className="font-sans text-[0.75rem] text-white/40 mb-6">
            <Link
              href="/"
              className="text-white/40 no-underline hover:text-white/70 transition-colors"
            >
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/70">Saved Scenarios</span>
          </nav>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-[1.2] mb-4 tracking-tight font-serif">
            Saved Scenarios
          </h1>
          <p className="text-[1.05rem] text-white/65 max-w-[600px] leading-relaxed font-serif">
            Scenarios you have bookmarked for quick access. Data is stored
            locally in your browser.
          </p>
        </div>
      </section>

      <div className="container-page py-14">
        {!loaded ? (
          <p className="font-sans text-[0.88rem] text-ink-muted">Loading...</p>
        ) : scenarios.length === 0 ? (
          /* Empty state */
          <div className="bg-bg-card border border-border rounded-[10px] p-8 shadow-card max-w-[600px] mx-auto text-center">
            <div className="text-4xl mb-4">
              <svg
                width="32"
                height="42"
                viewBox="0 0 14 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinejoin="round"
                className="mx-auto text-ink-muted"
              >
                <path d="M1 3C1 1.89543 1.89543 1 3 1H11C12.1046 1 13 1.89543 13 3V17L7 13L1 17V3Z" />
              </svg>
            </div>
            <h2 className="font-serif text-[1.2rem] font-normal text-ink mb-2">
              No saved scenarios yet
            </h2>
            <p className="font-sans text-[0.88rem] text-ink-soft leading-relaxed mb-6">
              Use the simulator to explore war-impact scenarios and save the
              ones you want to revisit later.
            </p>
            <Link
              href="/simulator"
              className="inline-block bg-accent text-white font-sans text-[0.8rem] font-semibold px-5 py-2.5 rounded-md no-underline tracking-wide hover:bg-[#b03e27] transition-colors"
            >
              Open Simulator
            </Link>
          </div>
        ) : (
          /* Scenario list */
          <div className="space-y-4 max-w-[780px]">
            {scenarios.map((s) => {
              const war = WARS[s.war as WarId]
              const cat = CATEGORY_MAP[s.category as CategoryId]
              const warName = war?.name ?? s.war
              const catLabel = cat?.label ?? s.category
              const catIcon = cat?.icon ?? ''
              const countryData = COUNTRY_MAP[s.country]
              const coverage = countryData?.coverage ?? 'unavailable'
              const reliability = getReliability(s.country, coverage)
              const lagLabel = LAG_LABELS[s.lag as LagPeriod] ?? s.lag

              // Build simulator link with full scenario params
              const simulatorHref = `/simulator?war=${encodeURIComponent(s.war)}&category=${encodeURIComponent(s.category)}&country=${encodeURIComponent(s.country)}&pt=${s.passthrough}&lag=${s.lag}`

              return (
                <article
                  key={s.id}
                  className="bg-bg-card border border-border rounded-[10px] p-5 shadow-card flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-sans text-[0.92rem] font-bold text-ink truncate">
                        {catIcon} {catLabel}
                      </h3>
                      <CoverageBadge status={coverage} />
                      <ReliabilityBadge status={reliability} />
                    </div>
                    <p className="font-sans text-[0.82rem] text-ink-soft truncate">
                      {countryData?.flag ?? ''} {s.country} &mdash; {warName}
                    </p>
                    <p className="font-sans text-[0.74rem] text-ink-muted mt-1">
                      Saved {formatDate(s.savedAt)} &middot; {s.passthrough}% pass-through &middot; {lagLabel} lag
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link
                      href={simulatorHref}
                      className="font-sans text-[0.78rem] font-semibold px-3 py-1.5 rounded-md bg-accent text-white no-underline hover:bg-[#b03e27] transition-colors"
                    >
                      Open in Simulator
                    </Link>
                    <button
                      onClick={() => handleRemove(s.id)}
                      className="font-sans text-[0.78rem] font-semibold px-3 py-1.5 rounded-md border border-border text-ink-soft hover:text-red-500 hover:border-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
