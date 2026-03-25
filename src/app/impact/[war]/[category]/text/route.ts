import { NextResponse } from 'next/server'
import { WARS } from '@/data/wars'
import { CATEGORY_MAP } from '@/data/categories'
import { COUNTRY_REASONS } from '@/data/reasons'
import type { WarId, CategoryId } from '@/types'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ war: string; category: string }> }
) {
  const { war, category } = await params

  const warData = WARS[war as WarId]
  const catData = CATEGORY_MAP[category as CategoryId]

  if (!warData || !catData) {
    return new NextResponse('# Not Found\n\nInvalid war or category ID.', {
      status: 404,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    })
  }

  const ranking = warData.rankings[category as CategoryId]
  const reasons = COUNTRY_REASONS[war as WarId] ?? {}

  const shocksText = warData.shocks
    .map((s) => `- ${s.factor}: ${s.val}`)
    .join('\n')

  const top5Text = ranking.top5
    .map((r, i) => {
      const reason = reasons[r.c] ? ` — ${reasons[r.c]}` : ''
      return `${i + 1}. ${r.f} ${r.c}: +${r.p}%${reason}`
    })
    .join('\n')

  const bot5Text = ranking.bot5
    .map((r, i) => {
      const reason = reasons[r.c] ? ` — ${reasons[r.c]}` : ''
      return `${i + 1}. ${r.f} ${r.c}: +${r.p}%${reason}`
    })
    .join('\n')

  const text = `# ${warData.name} — ${catData.label}

## Scenario
- **Conflict:** ${warData.name}
- **Period:** ${warData.dates}
- **Status:** ${warData.live ? 'Ongoing' : 'Historical'}
- **Category:** ${catData.icon} ${catData.label}

## Macro Shocks
${shocksText}

## Most Impacted Countries (${catData.label})
${top5Text}

## Least Impacted Countries (${catData.label})
${bot5Text}

## Caveats
- Estimates assume 100% pass-through (scenario ceiling). Actual impact depends on subsidies, supply substitution, and government intervention.
- FX depreciation is a major amplifier for import-dependent countries.
- Model version: v1.0. See methodology at https://howwarimpactsyou.com/methodology

## Source
https://howwarimpactsyou.com/impact/${war}/${category}
Data license: CC BY 4.0
`

  return new NextResponse(text, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
