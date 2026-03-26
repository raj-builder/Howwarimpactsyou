import type { Metadata } from 'next'
import { Suspense } from 'react'
import { BasketClient } from '@/components/basket/basket-client'

export const metadata: Metadata = {
  title: 'Household Basics Basket',
  description:
    'See how a weighted basket of everyday goods is affected by conflict-driven price shocks.',
  alternates: { canonical: 'https://howwarimpactsyou.com/basket' },
}

export default function BasketPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-14 text-center text-ink-muted font-sans text-[0.9rem]">
          Loading basket...
        </div>
      }
    >
      <BasketClient />
    </Suspense>
  )
}
