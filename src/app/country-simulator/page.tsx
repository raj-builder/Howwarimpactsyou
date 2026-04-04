import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CountrySimulatorClient } from '@/components/country-simulator/country-simulator-client'
import { WARS } from '@/data/wars'
import { COUNTRIES } from '@/data/countries'
import type { WarId, CategoryId } from '@/types'

const BASE_URL = 'https://howwarimpactsyou.com'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ war?: string; country?: string; category?: string }>
}): Promise<Metadata> {
  const params = await searchParams
  const warId = (params.war as WarId) || 'hormuz-2026'
  const country = params.country || ''
  const categoryId = (params.category as CategoryId) || 'basket'

  const warData = WARS[warId]
  const countryData = COUNTRIES.find((c) => c.id === country)

  let title = 'Country Impact Simulator'
  let description = 'Deep-dive into how conflict shocks affect a single country across all consumer categories.'

  if (country && warData) {
    const ranking = warData.rankings[categoryId] ?? warData.rankings['basket']
    const entry = ranking?.top5.find((e) => e.c === country) ?? ranking?.bot5.find((e) => e.c === country)
    const impact = entry?.p ?? 0
    title = `${country} \u2014 +${impact}% impact | ${warData.name}`
    description = `${countryData?.flag ?? ''} ${country}: up to +${impact}% price ceiling on household basics under the ${warData.name} scenario.`
  }

  const ogUrl = new URL('/api/og', BASE_URL)
  if (params.war) ogUrl.searchParams.set('war', params.war)
  if (params.country) ogUrl.searchParams.set('country', params.country)
  if (params.category) ogUrl.searchParams.set('category', params.category)

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/country-simulator` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/country-simulator`,
      images: [{ url: ogUrl.toString(), width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogUrl.toString()],
    },
  }
}

export default function CountrySimulatorPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-14 text-center text-ink-muted font-sans text-[0.9rem]">
          Loading simulator...
        </div>
      }
    >
      <CountrySimulatorClient />
    </Suspense>
  )
}
