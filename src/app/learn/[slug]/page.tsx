import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ARTICLES, ARTICLE_MAP, ARTICLE_SLUGS } from '@/content/articles'
import { WARS } from '@/data/wars'
import { CATEGORY_MAP } from '@/data/categories'
import type { WarId } from '@/types'
import { ShareToolbar } from '@/components/simulator/share-toolbar'

/* ------------------------------------------------------------------ */
/*  Static params: 5 articles                                          */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return ARTICLE_SLUGS.map((slug) => ({ slug }))
}

/* ------------------------------------------------------------------ */
/*  Dynamic metadata                                                   */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = ARTICLE_MAP[slug]
  if (!article) return { title: 'Not Found' }

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `https://howwarimpactsyou.com/learn/${slug}`,
    },
  }
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = ARTICLE_MAP[slug]

  if (!article) notFound()

  // Split content into paragraphs
  const paragraphs = article.content
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean)

  // Other articles for "keep reading"
  const otherArticles = ARTICLES.filter((a) => a.slug !== slug).slice(0, 3)

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: `https://howwarimpactsyou.com/learn/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'howwarimpactsyou.com',
      url: 'https://howwarimpactsyou.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://howwarimpactsyou.com/learn/${slug}`,
    },
  }

  return (
    <>
      {/* JSON-LD */}
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
            <Link
              href="/learn"
              className="text-white/50 no-underline hover:text-white/70 transition-colors"
            >
              Learn
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/70">{article.title}</span>
          </nav>

          <p className="font-sans text-[0.72rem] font-bold tracking-[0.14em] uppercase text-accent-warm mb-4">
            Learning Hub
          </p>
          <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-normal leading-[1.2] mb-4 tracking-tight font-serif">
            {article.title}
          </h1>
          <p className="text-[1.05rem] text-white/65 max-w-[620px] leading-relaxed font-serif mb-6">
            {article.description}
          </p>

          {/* Share toolbar */}
          <ShareToolbar />
        </div>
      </section>

      {/* Article body */}
      <div className="container-page py-14">
        <article className="max-w-[720px] mx-auto">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="font-serif text-[1.02rem] text-ink leading-[1.75] mb-6"
            >
              {para}
            </p>
          ))}
        </article>

        {/* Related scenarios */}
        {article.relatedScenarios.length > 0 && (
          <section className="max-w-[720px] mx-auto mt-10 mb-14">
            <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-4">
              Related scenarios
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {article.relatedScenarios.map((rs) => {
                const warData = WARS[rs.war as WarId]
                const catData = CATEGORY_MAP[rs.category]
                if (!warData || !catData) return null
                const ranking =
                  warData.rankings[
                    rs.category as keyof typeof warData.rankings
                  ]
                const top = ranking.top5[0]
                return (
                  <Link
                    key={`${rs.war}-${rs.category}`}
                    href={`/impact/${rs.war}/${rs.category}`}
                    className="bg-bg-card border border-border rounded-[10px] p-4 shadow-card hover:shadow-lg hover:border-accent-warm transition-all no-underline block"
                  >
                    <span className="font-sans text-[0.67rem] font-bold tracking-[0.04em] uppercase text-ink-muted block mb-1">
                      {warData.name}
                    </span>
                    <span className="font-sans text-[0.82rem] font-bold text-ink block mb-0.5">
                      {catData.icon} {catData.label}
                    </span>
                    <span className="font-sans text-[0.72rem] text-ink-muted block">
                      Up to +{top.p}% in {top.c}
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Keep reading */}
        <section className="max-w-[720px] mx-auto border-t border-border pt-10">
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-4">
            Keep reading
          </h2>
          <div className="space-y-4">
            {otherArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/learn/${a.slug}`}
                className="block bg-bg-card border border-border rounded-[10px] p-5 shadow-card hover:shadow-lg hover:border-accent-warm transition-all no-underline group"
              >
                <h3 className="font-sans text-[0.9rem] font-bold text-ink mb-1 group-hover:text-accent transition-colors">
                  {a.title}
                </h3>
                <p className="font-sans text-[0.78rem] text-ink-soft leading-relaxed">
                  {a.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            href="/country-simulator"
            className="inline-block bg-accent text-white font-sans text-[0.9rem] font-semibold px-8 py-3.5 rounded-lg no-underline tracking-wide hover:bg-[#b03e27] transition-colors"
          >
            Open Simulator &rarr;
          </Link>
        </div>
      </div>
    </>
  )
}
