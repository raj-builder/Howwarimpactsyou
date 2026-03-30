import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'
import { WARS } from '@/data/wars'
import { COUNTRIES } from '@/data/countries'
import type { WarId, CategoryId } from '@/types'

export const runtime = 'edge'

const SIZE = { width: 1200, height: 630 }

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const warId = (searchParams.get('war') as WarId) || 'hormuz-2026'
  const countryName = searchParams.get('country') || ''
  const categoryId = (searchParams.get('category') as CategoryId) || 'basket'

  const warData = WARS[warId]
  const countryData = COUNTRIES.find((c) => c.id === countryName)

  let impactPct = 0
  if (warData) {
    const ranking = warData.rankings[categoryId] ?? warData.rankings['basket']
    const entry = ranking?.top5.find((e) => e.c === countryName) ?? ranking?.bot5.find((e) => e.c === countryName)
    impactPct = entry?.p ?? 0
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2420 50%, #3a2216 100%)',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        }}
      >
        {/* Top: branding */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', display: 'flex' }}>
            <span style={{ color: '#ffffff' }}>howwar</span>
            <span style={{ color: '#c84b31' }}>impacts</span>
            <span style={{ color: '#ffffff' }}>you</span>
          </div>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', display: 'flex' }}>
            howwarimpactsyou.com
          </div>
        </div>

        {/* Middle: country + impact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#e07b54', display: 'flex' }}>
            {warData?.name ?? 'Conflict Scenario'}
          </div>
          {countryName ? (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
              <div style={{ fontSize: 86, fontWeight: 300, color: '#c84b31', letterSpacing: '-0.03em', lineHeight: 1, display: 'flex' }}>
                +{impactPct}%
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>{countryData?.flag ?? ''}</span>
                  <span>{countryName}</span>
                </div>
                <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', display: 'flex' }}>
                  household basics price ceiling
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 44, fontWeight: 400, lineHeight: 1.2, letterSpacing: '-0.02em', display: 'flex', flexWrap: 'wrap' }}>
              How war affects what you pay
            </div>
          )}
        </div>

        {/* Bottom: shocks + disclaimer */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '500px' }}>
            {(warData?.shocks ?? []).slice(0, 3).map((s) => (
              <div
                key={s.factor}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.75)',
                }}
              >
                {s.factor} <span style={{ color: '#e07b54', fontWeight: 600 }}>{s.val}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'right', maxWidth: '320px', display: 'flex' }}>
            Scenario ceiling at 100% pass-through. Not a price forecast.
          </div>
        </div>
      </div>
    ),
    { ...SIZE },
  )
}
