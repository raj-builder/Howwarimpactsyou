import type { Metadata } from 'next'
import Link from 'next/link'
import { ARTICLES } from '@/content/articles'
import { getMessages } from '@/lib/use-t'

export const metadata: Metadata = {
  title: 'Learn',
  description:
    'Understanding how wars, commodity shocks, and currency depreciation affect consumer prices. Articles and explainers from howwarimpactsyou.com.',
  alternates: { canonical: 'https://howwarimpactsyou.com/learn' },
}

export default function LearnPage() {
  const m = getMessages()
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a1a] via-[#2d2420] to-[#3a2216] text-white py-16 px-8 md:py-20">
        <div className="max-w-[820px] mx-auto">
          <nav className="font-sans text-[0.75rem] text-white/40 mb-6">
            <Link
              href="/"
              className="text-white/40 no-underline hover:text-white/70 transition-colors"
            >
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/70">Learn</span>
          </nav>
          <p className="font-sans text-[0.72rem] font-bold tracking-[0.14em] uppercase text-accent-warm mb-4">
            {m.learn.title}
          </p>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-[1.2] mb-4 tracking-tight font-serif">
            {m.learn.subtitle}
          </h1>
          <p className="text-[1.05rem] text-white/65 max-w-[600px] leading-relaxed font-serif">
            Deep dives into the economics behind our model. Learn how commodity
            shocks, currency depreciation, and pass-through mechanics translate
            into the numbers you see in the simulator.
          </p>
        </div>
      </section>

      {/* Article grid */}
      <div className="container-page py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/learn/${article.slug}`}
              className="bg-bg-card border border-border rounded-[10px] p-6 shadow-card hover:shadow-lg hover:border-accent-warm transition-all no-underline block group"
            >
              <h2 className="font-sans text-[0.95rem] font-bold text-ink mb-2 group-hover:text-accent transition-colors">
                {article.title}
              </h2>
              <p className="font-sans text-[0.82rem] text-ink-soft leading-relaxed mb-4">
                {article.description}
              </p>
              <span className="font-sans text-[0.78rem] font-semibold text-accent">
                Read article &rarr;
              </span>
            </Link>
          ))}
        </div>

        {/* Back to simulator CTA */}
        <div className="text-center mt-14">
          <Link
            href="/simulator"
            className="inline-block bg-accent text-white font-sans text-[0.9rem] font-semibold px-8 py-3.5 rounded-lg no-underline tracking-wide hover:bg-[#b03e27] transition-colors"
          >
            Open Simulator &rarr;
          </Link>
        </div>
      </div>
    </>
  )
}
