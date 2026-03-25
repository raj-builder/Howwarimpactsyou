import type { Metadata } from 'next'
import { CompareClient } from '@/components/compare/compare-client'

export const metadata: Metadata = {
  title: 'Compare Scenarios',
  description:
    'Compare consumer-price impact across two war/shock scenarios side by side. See which countries are hit hardest and how impact differs by category.',
}

export default function ComparePage() {
  return <CompareClient />
}
