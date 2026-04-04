import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SimulatorClient } from '@/components/simulator/simulator-client'

export const metadata: Metadata = {
  title: 'Regional Impact Overview',
  description:
    'See how conflicts affect consumer prices in 12+ countries across 10 categories.',
  alternates: { canonical: 'https://howwarimpactsyou.com/simulator' },
}

export default function SimulatorPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-14 text-center text-ink-muted font-sans text-[0.9rem]">
          Loading simulator...
        </div>
      }
    >
      <SimulatorClient />
    </Suspense>
  )
}
