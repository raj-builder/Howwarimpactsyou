import type { Metadata } from 'next'
import Link from 'next/link'
import { FeedbackClient } from '@/components/feedback/feedback-client'

export const metadata: Metadata = {
  title: 'Give Feedback — Help improve the data',
  description:
    'Submit corrections, better data sources, or real-world price observations to improve the accuracy of howwarimpactsyou.com.',
}

/** Manual entries of incorporated feedbacks — add to this list as real feedback is processed */
const INCORPORATED = [
  {
    name: 'Community',
    date: '2026-03-30',
    summary: 'Algeria flag was showing Azerbaijan (AZ instead of DZ) — fixed in v1.3',
  },
  {
    name: 'Community',
    date: '2026-04-04',
    summary: 'Oil consumption data updated from EIA 2024 actuals for 14 fuel-alert countries — Bangladesh was 130% off from manual estimate',
  },
]

export default function FeedbackPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a1a] via-[#2d2420] to-[#3a2216] text-white py-16 px-8 md:py-20">
        <div className="max-w-[820px] mx-auto">
          <nav className="font-sans text-[0.75rem] text-white/40 mb-6">
            <Link href="/" className="text-white/40 no-underline hover:text-white/70 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/70">Give Feedback</span>
          </nav>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-[1.2] mb-4 tracking-tight font-serif">
            Give Feedback
          </h1>
          <p className="text-[1.05rem] text-white/65 max-w-[600px] leading-relaxed font-serif">
            Help us improve the model. Submit corrections, better data sources, or real-world price observations. Every submission is reviewed.
          </p>
        </div>
      </section>

      <div className="container-page py-14">
        {/* Form */}
        <FeedbackClient />

        {/* Incorporated feedbacks */}
        <section className="mt-14">
          <h2 className="font-sans text-[0.72rem] font-bold tracking-[0.13em] uppercase text-accent mb-4">
            Feedback incorporated so far
          </h2>
          <div className="space-y-3">
            {INCORPORATED.map((item, i) => (
              <div key={i} className="bg-bg-card border border-border rounded-[10px] p-4 flex items-start gap-3">
                <span className="text-green text-lg mt-0.5" aria-hidden="true">&#10003;</span>
                <div>
                  <p className="font-sans text-[0.85rem] text-ink font-medium">{item.summary}</p>
                  <p className="font-sans text-[0.72rem] text-ink-muted mt-1">
                    {item.name} &middot; {item.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
