import type { Metadata } from 'next'
import { Suspense } from 'react'
import { FlightAlertsClient } from '@/components/flight-alerts/flight-alerts-client'
import { getMessages } from '@/lib/use-t'

const BASE_URL = 'https://howwarimpactsyou.com'

export const metadata: Metadata = {
  title: 'Flight Fuel Alert — Will your flight be affected?',
  description:
    'See which countries face fuel shortages from the oil crisis, how flights are impacted, and how many days of reserves remain.',
  alternates: { canonical: `${BASE_URL}/flight-alerts` },
  openGraph: {
    title: 'Flight Fuel Alert — Will your flight be affected?',
    description:
      'See which countries face fuel shortages from the oil crisis, how flights are impacted, and how many days of reserves remain.',
    url: `${BASE_URL}/flight-alerts`,
    siteName: 'How War Impacts You',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flight Fuel Alert — Will your flight be affected?',
    description:
      'See which countries face fuel shortages from the oil crisis, how flights are impacted, and how many days of reserves remain.',
  },
}

export default function FlightAlertsPage() {
  const m = getMessages()

  return (
    <Suspense
      fallback={
        <div className="max-w-[1140px] mx-auto px-4 md:px-8 py-14 text-center text-ink-muted font-sans text-[0.9rem]">
          {m.flightAlerts.loading}
        </div>
      }
    >
      <FlightAlertsClient />
    </Suspense>
  )
}
