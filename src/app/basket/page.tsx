import type { Metadata } from 'next'
import { BasketClient } from '@/components/basket/basket-client'

export const metadata: Metadata = {
  title: 'Household Basics Basket',
  description:
    'See how a weighted basket of everyday goods is affected by conflict-driven price shocks.',
  alternates: { canonical: 'https://howwarimpactsyou.com/basket' },
}

export default function BasketPage() {
  return <BasketClient />
}
