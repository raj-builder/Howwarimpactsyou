import { WARS, WAR_LIST } from '@/data/wars'
import { CATEGORIES, CATEGORY_MAP } from '@/data/categories'
import { COUNTRY_REASONS } from '@/data/reasons'
import type { WarId, CategoryId } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ShareToolbar } from '@/components/simulator/share-toolbar'

/* ------------------------------------------------------------------ */
/*  Static params: 5 wars x 10 categories = 50 pages                  */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  const params: { war: string; category: string }[] = []
  for (const w of WAR_LIST) {
    for (const c of CATEGORIES) {
      params.push({ war: w.id, category: c.id })
    }
  }
  return params
}

/* ------------------------------------------------------------------ */
/*  Dynamic metadata                                                   */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ war: string; category: string }>
}): Promise<Metadata> {
  const { war, category } = await params
  const warData = WARS[war as WarId]
  const catData = CATEGORY_MAP[category]
  if (!warData || !catData) return { title: 'Not Found' }

  const ranking = warData.rankings[category as CategoryId]
  const top = ranking?.top5[0]

  return {
    title: `How ${warData.name} Affects ${catData.label} Prices`,
    description: `${catData.label} prices could rise up to +${top?.p}% in ${top?.c} due to ${warData.name}. See impact rankings for 10 countries.`,
    alternates: {
      canonical: `https://howwarimpactsyou.com/impact/${war}/${category}`,
    },
  }
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function ScenarioPage({
  params,
}: {
  params: Promise<{ war: string; category: string }>
}) {
  const { war, category } = await params
  const warData = WARS[war as WarId]
  const catData = CATEGORY_MAP[category]

  if (!warData || !catData) notFound()

  const ranking = warData.rankings[category as CategoryId]
  const top = ranking.top5[0]
  const reasons = COUNTRY_REASONS[war as WarId] ?? {}

  // Related: same war, different categories (pick 4)
  const relatedSameWar = CATEGORIES.filter((c) => c.id !== category).slice(0, 4)

  // Related: same category, different wars (pick 4)
  const relatedSameCategory = WAR_LIST.filter((w) => w.id !== war).slice(0, 4)

  // JSON-LD: Article + FAQPage (invisible to users, consumed by AI search engines)
  const top5Text = ranking.top5.map((r) => `${r.f} ${r.c} (+${r.p}%)`).join(', ')
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: `How ${warData.name} Affects ${catData.label} Prices`,
        description: `${catData.label} prices could rise up to +${top.p}% in ${top.c} due to ${warData.name}.`,
        url: `https://howwarimpactsyou.com/impact/${war}/${category}`,
        datePublished: '2026-03-25',
        dateModified: '2026-04-06',
        publisher: { '@type': 'Organization', name: 'howwarimpactsyou.com', url: 'https://howwarimpactsyou.com' },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `https://howwarimpactsyou.com/impact/${war}/${category}` },
        author: { '@type': 'Person', name: 'Raj Karan', url: 'https://www.linkedin.com/in/raj-k-5b005535/' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `How does ${warData.name} affect ${catData.label.toLowerCase()} prices?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Under the ${warData.name} scenario, ${catData.label.toLowerCase()} prices could rise up to +${top.p}% in ${top.c}. The top 5 most affected countries are: ${top5Text}. This estimate assumes 100% pass-through (scenario ceiling). Actual impact depends on subsidies, supply substitution, and government intervention.`,
            },
          },
          {
            '@type': 'Question',
            name: `Which countries are most affected by ${warData.name} for ${catData.label.toLowerCase()}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The most affected countries for ${catData.label.toLowerCase()} under ${warData.name} are: ${top5Text}. Rankings are based on exposure coefficients, import dependency, and currency depreciation.`,
            },
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://howwarimpactsyou.com' },
          { '@type': 'ListItem', position: 2, name: warData.name, item: `https://howwarimpactsyou.com/impact/${war}/bread` },
          { '@type': 'ListItem', position: 3, name: catData.label, item: `https://howwarimpactsyou.com/impact/${war}/${category}` },
        ],
      },
    ],
  }

  return (
    <>
      {/* Structured data — invisible, for search engines only */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a1a] via-[#2d2420] to-[#3a2216] text-white py-16 px-8 md:py-20">
        <div className="max-w-[820px] mx-auto">
          {/* Breadcrumb */}
          <nav className="font-sans text-[0.75rem] text-white/40 mb-6">
            <Link
              href="/"
              className="text-white/40 no-underline hover:text-white/70 transition-colors"
            >
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/50">Impact</span>
            <span className="mx-2">/</span>
            <Link
              href={`/impact/${war}/${CATEGORIES[0].id}`}
              className="text-white/50 no-underline hover:text-white/70 transition-colors"
            >
              {warData.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/70">{catData.label}</span>
          </nav>

          <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-normal leading-[1.2] mb-4 tracking-tight font-serif">
            How{' '}
            <span className="text-accent-warm">{warData.name}</span> Affects{' '}
            <span className="text-accent-warm">{catData.label}</span> Prices
          </h1>

          <p className="text-[1.05rem] text-white/65 max-w-[620px] leading-relaxed font-serif mb-6">
            {catData.icon} {catData.label} prices could rise up to{' '}
            <strong className="text-white">+{top.p}%</strong> in{' '}
            <strong className="text-white">
              {top.f} {top.c}
            </strong>{' '}
            under a full pass-through scenario driven by {warData.name} (
            {warData.dates}).
          </p>

          {/* Share toolbar */}
          <div className="mb-2">
            <ShareToolbar />
          </div>
        </div>
      </section>

      {/* Disclaimer strip */}
      <div className="bg-amber-light border-b border-[#e8c97a] py-3 px-8 text-center">
        <p className="font-sans text-[0.78rem] text-[#7a4f10] max-w-[900px] mx-auto">
          <strong className="text-[#5a3408]">Scenario ceiling only.</strong> All
          figures show an upper-bound assuming 100% pass-through. Actual retail
          prices depend on competition, subsidies, logistics, and market
          structure.
        </p>
      </div>

      <div className="container-page py-14">
        {/* Commodity shocks */}
        <section className="mb-12">
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-3">
            Commodity shocks driving this scenario
          </h2>
          <div className="flex flex-wrap gap-2">
            {warData.shocks.map((s) => (
              <span
                key={s.factor}
                className="inline-flex items-center gap-1.5 bg-[#1a1a1a] text-white font-sans text-[0.78rem] px-3 py-1.5 rounded-full"
              >
                {s.factor}{' '}
                <span className="text-accent-warm font-semibold">
                  {s.val}
                </span>
              </span>
            ))}
          </div>
        </section>

        {/* Rankings */}
        <div className="grid md:grid-cols-2 gap-10 mb-14">
          {/* Top 5 most affected */}
          <section>
            <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-4">
              Top 5 most affected countries
            </h2>
            <div className="space-y-3">
              {ranking.top5.map((entry, i) => (
                <div
                  key={entry.c}
                  className="bg-bg-card border border-border rounded-[10px] p-4 shadow-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[0.72rem] font-bold text-ink-muted w-5">
                        #{i + 1}
                      </span>
                      <span className="text-xl">{entry.f}</span>
                      <span className="font-sans text-[0.88rem] font-bold text-ink">
                        {entry.c}
                      </span>
                    </div>
                    <span className="text-[1.5rem] font-light text-accent tracking-tight">
                      +{entry.p}%
                    </span>
                  </div>
                  {/* Impact bar */}
                  <div className="h-[5px] bg-bg-alt rounded-sm overflow-hidden mb-2">
                    <div
                      className="h-full rounded-sm bg-gradient-to-r from-accent-warm to-accent"
                      style={{
                        width: `${Math.min((entry.p / (ranking.top5[0].p || 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  {/* Reason text */}
                  {reasons[entry.c] && (
                    <p className="font-sans text-[0.75rem] text-ink-soft leading-relaxed">
                      {reasons[entry.c]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Bottom 5 least affected */}
          <section>
            <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-green mb-4">
              Bottom 5 least affected countries
            </h2>
            <div className="space-y-3">
              {ranking.bot5.map((entry, i) => (
                <div
                  key={entry.c}
                  className="bg-bg-card border border-border rounded-[10px] p-4 shadow-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[0.72rem] font-bold text-ink-muted w-5">
                        #{i + 6}
                      </span>
                      <span className="text-xl">{entry.f}</span>
                      <span className="font-sans text-[0.88rem] font-bold text-ink">
                        {entry.c}
                      </span>
                    </div>
                    <span className="text-[1.5rem] font-light text-green tracking-tight">
                      +{entry.p}%
                    </span>
                  </div>
                  {/* Impact bar */}
                  <div className="h-[5px] bg-bg-alt rounded-sm overflow-hidden mb-2">
                    <div
                      className="h-full rounded-sm bg-gradient-to-r from-green-light to-green"
                      style={{
                        width: `${Math.min((entry.p / (ranking.top5[0].p || 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  {reasons[entry.c] && (
                    <p className="font-sans text-[0.75rem] text-ink-soft leading-relaxed">
                      {reasons[entry.c]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Caveats */}
        <section className="bg-amber-light border border-[#e8c97a] rounded-[10px] p-6 mb-14">
          <h3 className="font-sans text-[0.9rem] font-bold text-[#7a4f10] mb-2">
            Important caveats
          </h3>
          <ul className="font-sans text-[0.82rem] text-[#6a4410] leading-relaxed space-y-1.5 list-disc list-inside">
            <li>
              All figures assume 100% pass-through of upstream cost changes. In
              practice, realized impacts are typically 55-75% of the ceiling.
            </li>
            <li>
              Government subsidies, price controls, and strategic reserves can
              significantly reduce actual consumer impacts.
            </li>
            <li>
              Rankings reflect structural vulnerability (import dependence, FX
              exposure) rather than real-time prices.
            </li>
            <li>
              Within-country variation (urban vs rural, coastal vs inland) is not
              captured at this resolution.
            </li>
          </ul>
        </section>

        {/* CTA: Explore in simulator */}
        <section className="text-center mb-14">
          <Link
            href={`/country-simulator?war=${war}&category=${category}`}
            className="inline-block bg-accent text-white font-sans text-[0.9rem] font-semibold px-8 py-3.5 rounded-lg no-underline tracking-wide hover:bg-[#b03e27] transition-colors"
          >
            Explore in Simulator &rarr;
          </Link>
        </section>

        {/* Related scenarios */}
        <section className="mb-14">
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-4">
            Related scenarios
          </h2>

          {/* Same war, different categories */}
          <h3 className="font-sans text-[0.82rem] font-semibold text-ink mb-3">
            More from {warData.name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {relatedSameWar.map((c) => {
              const r = warData.rankings[c.id]
              const topEntry = r.top5[0]
              return (
                <Link
                  key={c.id}
                  href={`/impact/${war}/${c.id}`}
                  className="bg-bg-card border border-border rounded-[10px] p-4 shadow-card hover:shadow-lg hover:border-accent-warm transition-all no-underline block"
                >
                  <span className="text-lg block mb-1">{c.icon}</span>
                  <span className="font-sans text-[0.8rem] font-bold text-ink block mb-0.5">
                    {c.label}
                  </span>
                  <span className="font-sans text-[0.72rem] text-ink-muted block">
                    Up to +{topEntry.p}% in {topEntry.c}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Same category, different wars */}
          <h3 className="font-sans text-[0.82rem] font-semibold text-ink mb-3">
            {catData.label} in other conflicts
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {relatedSameCategory.map((w) => {
              const otherWar = WARS[w.id]
              const r = otherWar.rankings[category as CategoryId]
              const topEntry = r.top5[0]
              return (
                <Link
                  key={w.id}
                  href={`/impact/${w.id}/${category}`}
                  className="bg-bg-card border border-border rounded-[10px] p-4 shadow-card hover:shadow-lg hover:border-accent-warm transition-all no-underline block"
                >
                  <span className="font-sans text-[0.67rem] font-bold tracking-[0.04em] uppercase text-ink-muted block mb-1">
                    {w.dates}
                  </span>
                  <span className="font-sans text-[0.8rem] font-bold text-ink block mb-0.5">
                    {w.name}
                  </span>
                  <span className="font-sans text-[0.72rem] text-ink-muted block">
                    Up to +{topEntry.p}% in {topEntry.c}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </>
  )
}
