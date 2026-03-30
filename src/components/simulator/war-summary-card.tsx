'use client'

import { useMemo } from 'react'
import { WARS } from '@/data/wars'
import { findCountryEntry, computeBasket, getProvenance } from '@/lib/calculations'
import { ShareToolbar } from '@/components/simulator/share-toolbar'
import { getWarAnchors } from '@/data/pre-escalation-prices'
import { BELLIGERENT_COUNTRIES } from '@/data/belligerent-countries'
import { useT } from '@/lib/use-t'
import type { WarId, CategoryId } from '@/types'
import type { LagPeriod, ProvenanceMetadata, BasketResult } from '@/types/scenario'
import { LAG_MULTIPLIERS, LAG_LABELS } from '@/types/scenario'

interface WarSummaryCardProps {
  warId: WarId
  warName: string
  warDates: string
  live: boolean
  categoryId: CategoryId
  categoryLabel: string
  country: string | null
  countryFlag: string | null
  passthrough: number
  lag: LagPeriod
  lagMultiplier: number
  /** Main scenario result ceiling for the selected category + country */
  lagAdjustedCeiling: number | null
  /** Provenance metadata */
  provenance: ProvenanceMetadata
  /** SerpAPI fetched_at for basket computation */
  serpApiFetchedAt?: string | null
}

/**
 * "So What" summary card — replaces the duplicate war escalation card
 * at the top of the right panel. Shows personal impact insight + share.
 */
export function WarSummaryCard({
  warId,
  warName,
  warDates,
  live,
  categoryId,
  categoryLabel,
  country,
  countryFlag,
  passthrough,
  lag,
  lagMultiplier,
  lagAdjustedCeiling,
  provenance,
  serpApiFetchedAt,
}: WarSummaryCardProps) {
  const t = useT()
  const anchors = useMemo(() => getWarAnchors(warId), [warId])

  /* Cross-category mini insights: bread, fuel, oil for the selected country */
  const miniInsights = useMemo(() => {
    if (!country) return []
    const categories: { id: CategoryId; labelKey: string; icon: string }[] = [
      { id: 'bread', labelKey: 'Bread & Cereals', icon: '🍞' },
      { id: 'fuel', labelKey: 'Household Fuel', icon: '⛽' },
      { id: 'oil', labelKey: 'Cooking Oil', icon: '🫗' },
    ]
    return categories.map((cat) => {
      const entry = findCountryEntry(warId, cat.id, country)
      const rawPct = entry?.p ?? 0
      const adjusted = Math.round(rawPct * (passthrough / 100) * lagMultiplier * 10) / 10
      return { ...cat, pct: adjusted, found: !!entry }
    }).filter((item) => item.found)
  }, [warId, country, passthrough, lagMultiplier])

  /* Basket weighted average for the "grocery bill" headline */
  const basketAvg = useMemo(() => {
    if (!country) return null
    const allCats = new Set<CategoryId>([
      'bread', 'dairy', 'eggs', 'rice', 'oil', 'vegetables', 'meat', 'detergent', 'fuel',
    ])
    const result = computeBasket(
      { war: warId, country, passthrough, lag, provenance: getProvenance(serpApiFetchedAt) },
      allCats,
    )
    return result?.weightedAverage ?? null
  }, [warId, country, passthrough, lag, serpApiFetchedAt])

  /* Top commodity shocks for overview state (no country selected) */
  const topShocks = useMemo(() => {
    const war = WARS[warId]
    if (!war) return []
    return war.shocks.slice(0, 3)
  }, [warId])

  /* Top impacted country for overview state */
  const topCountry = useMemo(() => {
    const war = WARS[warId]
    if (!war) return null
    const basketRanking = war.rankings['basket'] ?? war.rankings['bread']
    if (!basketRanking?.top5?.[0]) return null
    return basketRanking.top5[0]
  }, [warId])

  const escalationDate = anchors?.escalationDate ?? ''

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] via-[#2d2420] to-[#3a2216] text-white rounded-[10px] p-5 md:p-6 mb-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <h2 className="font-sans text-[0.88rem] font-bold">{warName}</h2>
        {live && (
          <span className="inline-flex items-center gap-1 font-sans text-[0.58rem] font-bold uppercase tracking-[0.06em] bg-accent text-white px-1.5 py-0.5 rounded">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" aria-hidden="true" />
            {t('badges.live')}
          </span>
        )}
      </div>
      <p className="font-sans text-[0.68rem] text-white/50 mb-4">{warDates}</p>

      {country && lagAdjustedCeiling != null ? (
        <>
          {/* Hero impact number */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-[2.4rem] font-light text-accent-warm tracking-tight">
                +{lagAdjustedCeiling}%
              </span>
              <span className="font-sans text-[0.82rem] text-white/70">
                {t('common.priceCeiling')}
              </span>
            </div>
            <p className="font-sans text-[0.78rem] text-white/60 mt-0.5">
              {countryFlag && <span className="mr-1.5">{countryFlag}</span>}
              {t('soWhat.categoryImpact', { category: categoryLabel, country })}
            </p>
          </div>

          {/* Mini insight cards: 3 key categories */}
          {miniInsights.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {miniInsights.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/10 rounded-lg px-3 py-2.5 text-center"
                >
                  <span className="block text-lg mb-0.5" aria-hidden="true">{item.icon}</span>
                  <span className="block font-sans text-[1.1rem] font-bold text-accent-warm">
                    +{item.pct}%
                  </span>
                  <span className="block font-sans text-[0.6rem] text-white/50 mt-0.5">
                    {item.labelKey}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Plain-language insight */}
          {basketAvg != null && (
            <p className="font-sans text-[0.82rem] text-white/75 leading-relaxed mb-4">
              {t('soWhat.basketImpact', { pct: String(basketAvg) })}
            </p>
          )}

          {/* Share toolbar */}
          <ShareToolbar
            modelVersion={provenance.modelVersion}
            snapshotDate={provenance.snapshotDate}
            variant="dark"
          />
        </>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: impact + shocks + CTA */}
          <div className="flex-1">
            {topCountry && (
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[2rem] font-light text-accent-warm tracking-tight">
                    +{topCountry.p}%
                  </span>
                  <span className="font-sans text-[0.82rem] text-white/60">
                    {topCountry.f} {topCountry.c}
                  </span>
                </div>
                <p className="font-sans text-[0.72rem] text-white/40">
                  {t('soWhat.topShocks')}
                </p>
              </div>
            )}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {topShocks.map((shock) => (
                <span
                  key={shock.factor}
                  className="font-sans text-[0.65rem] bg-white/10 text-white/70 px-2.5 py-1 rounded-md"
                >
                  {shock.factor}{' '}
                  <strong className="text-accent-warm">{shock.val}</strong>
                </span>
              ))}
            </div>
            <p className="font-sans text-[0.78rem] text-accent-warm font-semibold">
              {t('simulator.exploreCountry')} &darr;
            </p>
          </div>

          {/* Right: belligerent countries */}
          {(() => {
            const involved = BELLIGERENT_COUNTRIES.filter((b) => b.wars.includes(warId))
            if (involved.length === 0) return null
            return (
              <div className="md:flex-1 md:border-l md:border-white/10 md:pl-8">
                <p className="font-sans text-[0.72rem] text-white/40 uppercase tracking-wider mb-3">
                  Directly involved
                </p>
                <div className="space-y-3">
                  {involved.map((b) => {
                    const dir = b.warImpact?.[warId] ?? 'neutral'
                    return (
                      <div key={b.name} className="flex items-center gap-3">
                        <span className="text-2xl shrink-0">{b.flag}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-sans text-[0.92rem] text-white/90 font-semibold">{b.name}</div>
                          <div className="font-sans text-[0.72rem] text-white/45">{b.role.split(',')[0]}</div>
                        </div>
                        <span className={`font-sans text-[0.78rem] font-bold shrink-0 ${
                          dir === 'positive' ? 'text-green' : dir === 'negative' ? 'text-accent' : 'text-white/40'
                        }`}>
                          {dir === 'positive' ? '▲ Gains' : dir === 'negative' ? '▼ Costs' : '— Neutral'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Provenance footer */}
      <p className="font-sans text-[0.7rem] text-white/70 mt-3">
        {t('soWhat.provenanceNote', {
          date: anchors?.commodities[0]?.anchorDate ?? escalationDate,
          source: t('escalation.hardcodedNote'),
        })}
      </p>
    </div>
  )
}
