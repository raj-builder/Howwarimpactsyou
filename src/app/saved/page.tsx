import type { Metadata } from 'next'
import { SavedClient } from '@/components/saved/saved-client'

export const metadata: Metadata = {
  title: 'Saved Scenarios',
  description:
    'View and manage your saved war-impact scenarios. Quickly return to scenarios you have bookmarked for future reference.',
}

export default function SavedPage() {
  return <SavedClient />
}
