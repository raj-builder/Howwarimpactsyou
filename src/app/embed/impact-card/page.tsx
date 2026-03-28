import { WARS } from '@/data/wars'
import { CATEGORY_MAP } from '@/data/categories'
import { COUNTRY_MAP } from '@/data/countries'
import { roundValue } from '@/lib/calculations'
import type { WarId, CategoryId } from '@/types'
import { LAG_MULTIPLIERS, LAG_LABELS } from '@/types/scenario'
import type { LagPeriod } from '@/types/scenario'

export default async function EmbedImpactCard({
  searchParams,
}: {
  searchParams: Promise<{ war?: string; category?: string; pt?: string; lag?: string }>
}) {
  const { war: warParam, category: catParam, pt: ptParam, lag: lagParam } = await searchParams
  const warId = (warParam ?? 'ukraine-russia') as WarId
  const catId = (catParam ?? 'bread') as CategoryId
  const passthrough = Math.max(0, Math.min(100, Number(ptParam) || 100))
  const lag: LagPeriod = (lagParam && lagParam in LAG_MULTIPLIERS) ? lagParam as LagPeriod : 'immediate'
  const lagMultiplier = LAG_MULTIPLIERS[lag]

  const warData = WARS[warId]
  const catData = CATEGORY_MAP[catId]

  if (!warData || !catData) {
    return (
      <div className="p-4 text-sm text-red-600">
        Invalid war or category parameter.
      </div>
    )
  }

  const ranking = warData.rankings[catId]
  const topCountry = ranking.top5[0]
  const topCountryData = topCountry ? COUNTRY_MAP[topCountry.c] : null

  return (
    <div className="max-w-[380px] mx-auto p-4">
      <div className="border border-[#e0dbd4] rounded-lg bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#3a2216] px-4 py-3">
          <p className="text-[0.65rem] text-white/50 uppercase tracking-widest font-sans mb-1">
            Impact Estimate
          </p>
          <h2 className="text-white text-[0.95rem] font-serif font-normal leading-tight">
            {warData.name}
          </h2>
        </div>

        {/* Assumption chips */}
        <div className="px-4 py-2 border-b border-[#e0dbd4] flex flex-wrap gap-1.5">
          <span className="font-sans text-[0.6rem] bg-[#f2efe9] text-[#666] px-1.5 py-0.5 rounded">
            {passthrough}% pass-through
          </span>
          <span className="font-sans text-[0.6rem] bg-[#f2efe9] text-[#666] px-1.5 py-0.5 rounded">
            {LAG_LABELS[lag]} lag
          </span>
        </div>

        {/* Body */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{catData.icon}</span>
            <span className="font-sans text-[0.82rem] font-semibold text-[#1a1a1a]">
              {catData.label}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl">{topCountry.f}</span>
            <div>
              <p className="font-sans text-[0.82rem] font-semibold text-[#1a1a1a]">
                {topCountry.c}
              </p>
              <div className="flex items-center gap-1">
                <p className="font-sans text-[0.7rem] text-[#777]">
                  Most impacted
                </p>
                {topCountryData && (
                  <span className={`font-sans text-[0.55rem] font-semibold px-1 py-0.5 rounded ${
                    topCountryData.coverage === 'full' ? 'bg-[#d4edda] text-[#155724]' :
                    topCountryData.coverage === 'partial' ? 'bg-[#fff3cd] text-[#856404]' :
                    'bg-[#cce5ff] text-[#004085]'
                  }`}>
                    {topCountryData.coverage}
                  </span>
                )}
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="font-sans text-[1.3rem] font-bold text-[#c74a2f]">
                +{roundValue(topCountry.p * (passthrough / 100) * lagMultiplier, 'display')}%
              </p>
              <p className="font-sans text-[0.65rem] text-[#777]">
                price ceiling
              </p>
            </div>
          </div>

          {/* Top 3 mini bar chart */}
          <div className="space-y-1.5 mt-3">
            {ranking.top5.slice(0, 3).map((r) => {
              const adjusted = roundValue(r.p * (passthrough / 100) * lagMultiplier, 'display')
              const maxAdjusted = roundValue(ranking.top5[0].p * (passthrough / 100) * lagMultiplier, 'display')
              return (
                <div key={r.c} className="flex items-center gap-2">
                  <span className="text-xs w-5">{r.f}</span>
                  <span className="font-sans text-[0.72rem] text-[#444] w-20 truncate">
                    {r.c}
                  </span>
                  <div className="flex-1 bg-[#f2efe9] rounded-full h-2">
                    <div
                      className="bg-[#c74a2f] h-2 rounded-full"
                      style={{
                        width: `${Math.min((adjusted / (maxAdjusted || 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="font-sans text-[0.68rem] font-semibold text-[#1a1a1a] w-12 text-right">
                    +{adjusted}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e0dbd4] px-4 py-2 flex items-center justify-between">
          <a
            href={`https://howwarimpactsyou.com/simulator?war=${warId}&category=${catId}&pt=${passthrough}&lag=${lag}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[0.65rem] text-[#c74a2f] no-underline hover:underline"
          >
            howwarimpactsyou.com
          </a>
          <span className="font-sans text-[0.6rem] text-[#999]">
            v1.0 · Model v1.0.0
          </span>
        </div>
      </div>
    </div>
  )
}
