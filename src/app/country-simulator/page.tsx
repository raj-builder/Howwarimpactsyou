import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CountrySimulatorClient } from '@/components/country-simulator/country-simulator-client'

export const metadata: Metadata = {
  title: 'Individual Country Simulator',
  description:
    'Deep-dive into how conflict shocks affect a single country across all consumer categories. Toggle items, adjust assumptions, and see the full breakdown.',
  alternates: { canonical: 'https://howwarimpactsyou.com/country-simulator' },
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
