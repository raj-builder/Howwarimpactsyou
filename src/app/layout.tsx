import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Nav } from '@/components/ui/nav'
import { Footer } from '@/components/ui/footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'howwarimpactsyou.com — How War Impacts You',
    template: '%s | howwarimpactsyou.com',
  },
  description:
    'See how wars, oil shocks, and currency moves affect the price of bread, fuel, and everyday goods in 68 countries. Free simulator + flight fuel risk checker. Open methodology.',
  metadataBase: new URL('https://howwarimpactsyou.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'howwarimpactsyou.com',
  },
}

/* Invisible structured data for AI search engines and Google — not rendered in UI */
const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://howwarimpactsyou.com/#organization',
      name: 'howwarimpactsyou.com',
      url: 'https://howwarimpactsyou.com',
      description: 'Macro-to-consumer price impact simulator and flight fuel risk checker covering 68 countries and 6 conflict scenarios.',
      sameAs: [
        'https://github.com/raj-builder/Howwarimpactsyou',
        'https://www.linkedin.com/in/raj-k-5b005535/',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://howwarimpactsyou.com/#website',
      url: 'https://howwarimpactsyou.com',
      name: 'howwarimpactsyou.com',
      publisher: { '@id': 'https://howwarimpactsyou.com/#organization' },
    },
    {
      '@type': 'WebApplication',
      name: 'How War Impacts You — Price Impact Simulator',
      url: 'https://howwarimpactsyou.com/country-simulator',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Free tool that estimates how wars and oil shocks affect consumer prices in 68 countries across 10 product categories.',
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        <Nav />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
