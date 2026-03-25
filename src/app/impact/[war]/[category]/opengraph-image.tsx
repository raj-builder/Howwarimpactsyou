import { ImageResponse } from 'next/og'
import { WARS } from '@/data/wars'
import { CATEGORY_MAP } from '@/data/categories'
import type { WarId, CategoryId } from '@/types'

export const runtime = 'edge'
export const alt = 'War Impact Scenario'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ war: string; category: string }>
}) {
  const { war, category } = await params
  const warData = WARS[war as WarId]
  const catData = CATEGORY_MAP[category]

  if (!warData || !catData) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#1a1a1a',
            color: '#fff',
            fontSize: 40,
            fontFamily: 'sans-serif',
          }}
        >
          Scenario Not Found
        </div>
      ),
      { ...size }
    )
  }

  const ranking = warData.rankings[category as CategoryId]
  const top = ranking.top5[0]

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 70px',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2420 50%, #3a2216 100%)',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        }}
      >
        {/* Top: branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              display: 'flex',
            }}
          >
            <span style={{ color: '#ffffff' }}>howwar</span>
            <span style={{ color: '#c84b31' }}>impacts</span>
            <span style={{ color: '#ffffff' }}>you</span>
          </div>
          <div
            style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.5)',
              display: 'flex',
            }}
          >
            {warData.dates}
          </div>
        </div>

        {/* Middle: headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color: '#e07b54',
              display: 'flex',
            }}
          >
            Impact Scenario
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            How {warData.name} Affects {catData.label} Prices
          </div>
        </div>

        {/* Bottom: key stat + shocks */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          {/* Stat */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
            <div
              style={{
                fontSize: 72,
                fontWeight: 300,
                color: '#c84b31',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                display: 'flex',
              }}
            >
              +{top.p}%
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  color: 'rgba(255,255,255,0.85)',
                  display: 'flex',
                }}
              >
                {top.f} {top.c}
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.5)',
                  display: 'flex',
                }}
              >
                maximum estimated ceiling
              </div>
            </div>
          </div>

          {/* Shock pills */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              maxWidth: '400px',
            }}
          >
            {warData.shocks.slice(0, 3).map((s) => (
              <div
                key={s.factor}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                {s.factor}{' '}
                <span style={{ color: '#e07b54', fontWeight: 600 }}>
                  {s.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
