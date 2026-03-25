import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Nav } from '@/components/ui/nav'
import { Footer } from '@/components/ui/footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'howwarimpactsyou.com — Macro-to-Consumer Price Impact Simulator',
    template: '%s | howwarimpactsyou.com',
  },
  description:
    'See how wars, oil shocks, and currency moves affect the price of bread, fuel, and everyday goods in 12+ countries. Free, transparent, open-methodology simulator.',
  metadataBase: new URL('https://howwarimpactsyou.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'howwarimpactsyou.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
