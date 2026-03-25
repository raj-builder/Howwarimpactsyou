import { NextResponse } from 'next/server'
import { WARS } from '@/data/wars'
import { CATEGORIES } from '@/data/categories'
import type { WarId, CategoryId } from '@/types'

interface FlatRanking {
  war: WarId
  warName: string
  category: CategoryId
  categoryLabel: string
  country: string
  flag: string
  impactPct: number
  rank: 'top5' | 'bot5'
}

export async function GET() {
  const rows: FlatRanking[] = []

  for (const [warId, war] of Object.entries(WARS) as [WarId, (typeof WARS)[WarId]][]) {
    for (const cat of CATEGORIES) {
      const ranking = war.rankings[cat.id]
      if (!ranking) continue

      for (const entry of ranking.top5) {
        rows.push({
          war: warId,
          warName: war.name,
          category: cat.id,
          categoryLabel: cat.label,
          country: entry.c,
          flag: entry.f,
          impactPct: entry.p,
          rank: 'top5',
        })
      }

      for (const entry of ranking.bot5) {
        rows.push({
          war: warId,
          warName: war.name,
          category: cat.id,
          categoryLabel: cat.label,
          country: entry.c,
          flag: entry.f,
          impactPct: entry.p,
          rank: 'bot5',
        })
      }
    }
  }

  return NextResponse.json(
    {
      version: '1.0',
      updated: '2025-03-25',
      license: 'CC BY 4.0',
      count: rows.length,
      data: rows,
    },
    {
      headers: {
        'Cache-Control': 's-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    }
  )
}
