import { WARS } from '@/data/wars'
import { CATEGORY_MAP } from '@/data/categories'
import type { WarId, CategoryId } from '@/types'

export default async function EmbedImpactCard({
  searchParams,
}: {
  searchParams: Promise<{ war?: string; category?: string }>
}) {
  const { war: warParam, category: catParam } = await searchParams
  const warId = (warParam ?? 'ukraine-russia') as WarId
  const catId = (catParam ?? 'bread') as CategoryId

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
              <p className="font-sans text-[0.7rem] text-[#777]">
                Most impacted country
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="font-sans text-[1.3rem] font-bold text-[#c74a2f]">
                +{topCountry.p}%
              </p>
              <p className="font-sans text-[0.65rem] text-[#777]">
                price impact
              </p>
            </div>
          </div>

          {/* Top 3 mini bar chart */}
          <div className="space-y-1.5 mt-3">
            {ranking.top5.slice(0, 3).map((r) => (
              <div key={r.c} className="flex items-center gap-2">
                <span className="text-xs w-5">{r.f}</span>
                <span className="font-sans text-[0.72rem] text-[#444] w-20 truncate">
                  {r.c}
                </span>
                <div className="flex-1 bg-[#f2efe9] rounded-full h-2">
                  <div
                    className="bg-[#c74a2f] h-2 rounded-full"
                    style={{
                      width: `${Math.min((r.p / (ranking.top5[0]?.p || 1)) * 100, 100)}%`,
                    }}
                  />
                </div>
                <span className="font-sans text-[0.68rem] font-semibold text-[#1a1a1a] w-12 text-right">
                  +{r.p}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e0dbd4] px-4 py-2 flex items-center justify-between">
          <a
            href={`https://howwarimpactsyou.com/impact/${warId}/${catId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[0.65rem] text-[#c74a2f] no-underline hover:underline"
          >
            howwarimpactsyou.com
          </a>
          <span className="font-sans text-[0.6rem] text-[#999]">
            v1.0 Beta
          </span>
        </div>
      </div>
    </div>
  )
}
