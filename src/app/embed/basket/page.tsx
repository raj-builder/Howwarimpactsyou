import { WARS } from '@/data/wars'
import { CATEGORY_MAP } from '@/data/categories'
import { COUNTRY_MAP } from '@/data/countries'
import { roundValue } from '@/lib/calculations'
import type { WarId, CategoryId } from '@/types'
import { LAG_MULTIPLIERS, LAG_LABELS } from '@/types/scenario'
import type { LagPeriod } from '@/types/scenario'

export default async function EmbedBasket({
  searchParams,
}: {
  searchParams: Promise<{ war?: string; country?: string; pt?: string; lag?: string }>
}) {
  const { war: warParam, country: countryParam, pt: ptParam, lag: lagParam } = await searchParams
  const warId = (warParam ?? 'ukraine-russia') as WarId
  const passthrough = Math.max(0, Math.min(100, Number(ptParam) || 100))
  const lag: LagPeriod = (lagParam && lagParam in LAG_MULTIPLIERS) ? lagParam as LagPeriod : 'immediate'
  const lagMultiplier = LAG_MULTIPLIERS[lag]

  const warData = WARS[warId]

  if (!warData) {
    return (
      <div className="p-4 text-sm text-red-600">
        Invalid war parameter.
      </div>
    )
  }

  const basketRanking = warData.rankings.basket
  const targetCountry = countryParam
    ? [...basketRanking.top5, ...basketRanking.bot5].find(
        (r) => r.c.toLowerCase() === countryParam.toLowerCase()
      )
    : basketRanking.top5[0]

  const basketCat = CATEGORY_MAP['basket']
  const countryData = targetCountry ? COUNTRY_MAP[targetCountry.c] : null

  // Gather per-category impacts with lag and passthrough applied
  const categoryBreakdown = (
    ['bread', 'dairy', 'eggs', 'rice', 'oil', 'vegetables', 'meat', 'detergent', 'fuel'] as const
  ).map((catId: CategoryId) => {
    const cat = CATEGORY_MAP[catId]
    const ranking = warData.rankings[catId]
    const entry = [...ranking.top5, ...ranking.bot5].find(
      (r) => r.c === targetCountry?.c
    )
    const rawImpact = entry?.p ?? null
    const adjustedImpact = rawImpact !== null
      ? roundValue(rawImpact * (passthrough / 100) * lagMultiplier, 'display')
      : null
    return {
      id: catId,
      icon: cat.icon,
      label: cat.label,
      impact: adjustedImpact,
    }
  })

  // Adjusted basket total
  const basketTotal = targetCountry
    ? roundValue(targetCountry.p * (passthrough / 100) * lagMultiplier, 'display')
    : null

  return (
    <div className="max-w-[420px] mx-auto p-4">
      <div className="border border-[#e0dbd4] rounded-lg bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#3a2216] px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.65rem] text-white/50 uppercase tracking-widest font-sans mb-1">
                {basketCat.icon} Household Basket Impact
              </p>
              <h2 className="text-white text-[0.88rem] font-serif font-normal leading-tight">
                {warData.name}
              </h2>
            </div>
            {targetCountry && (
              <div className="text-right">
                <p className="text-2xl leading-none">{targetCountry.f}</p>
                <p className="text-white/70 text-[0.72rem] font-sans mt-0.5">
                  {targetCountry.c}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Assumption chips */}
        <div className="px-4 py-2 border-b border-[#e0dbd4] flex flex-wrap gap-2">
          <span className="font-sans text-[0.6rem] bg-[#f2efe9] text-[#666] px-1.5 py-0.5 rounded">
            {passthrough}% pass-through
          </span>
          <span className="font-sans text-[0.6rem] bg-[#f2efe9] text-[#666] px-1.5 py-0.5 rounded">
            {LAG_LABELS[lag]} lag ({lagMultiplier}x)
          </span>
          {countryData && (
            <span className={`font-sans text-[0.6rem] px-1.5 py-0.5 rounded ${
              countryData.coverage === 'full' ? 'bg-[#d4edda] text-[#155724]' :
              countryData.coverage === 'partial' ? 'bg-[#fff3cd] text-[#856404]' :
              'bg-[#cce5ff] text-[#004085]'
            }`}>
              {countryData.coverage} coverage
            </span>
          )}
        </div>

        {/* Basket total */}
        {basketTotal !== null && (
          <div className="px-4 py-3 border-b border-[#e0dbd4] flex items-baseline justify-between">
            <span className="font-sans text-[0.82rem] text-[#444]">
              Basket impact estimate
            </span>
            <span className="font-sans text-[1.2rem] font-bold text-[#c74a2f]">
              +{basketTotal}%
            </span>
          </div>
        )}

        {/* Category breakdown */}
        <div className="px-4 py-3 space-y-2">
          {categoryBreakdown.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              <span className="text-sm w-5">{cat.icon}</span>
              <span className="font-sans text-[0.72rem] text-[#444] flex-1 truncate">
                {cat.label}
              </span>
              {cat.impact !== null ? (
                <>
                  <div className="w-24 bg-[#f2efe9] rounded-full h-1.5">
                    <div
                      className="bg-[#c74a2f] h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(cat.impact * 2, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="font-sans text-[0.68rem] font-semibold text-[#1a1a1a] w-12 text-right">
                    +{cat.impact}%
                  </span>
                </>
              ) : (
                <span className="font-sans text-[0.68rem] text-[#999] w-12 text-right">
                  n/a
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-[#e0dbd4] px-4 py-2 flex items-center justify-between">
          <a
            href={`https://howwarimpactsyou.com/basket?war=${warId}&country=${targetCountry?.c ?? ''}&pt=${passthrough}&lag=${lag}`}
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
