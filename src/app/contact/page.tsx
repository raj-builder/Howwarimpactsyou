import Link from 'next/link'
import type { Metadata } from 'next'
import { getMessages } from '@/lib/use-t'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with the howwarimpactsyou.com team: data corrections, methodology feedback, and partnership inquiries.',
}

export default function ContactPage() {
  const m = getMessages()
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
            <span className="text-white/70">Contact</span>
          </nav>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-normal leading-[1.2] mb-4 tracking-tight font-serif">
            {m.contact.title}
          </h1>
          <p className="text-[1.05rem] text-white/65 max-w-[600px] leading-relaxed font-serif">
            {m.contact.subtitle}
          </p>
        </div>
      </section>

      <div className="container-page py-14">
        <div className="max-w-[680px]">
          <section className="bg-bg-card border border-border rounded-[10px] p-6 md:p-8 shadow-card mb-8">
            <h2 className="font-serif text-[1.3rem] font-normal text-ink mb-4 leading-tight">
              Get in touch
            </h2>
            <p className="font-sans text-[0.88rem] text-ink-soft leading-relaxed mb-6">
              This project is built on transparency and community feedback. If
              you spot an error in the data, have a question about the
              methodology, or want to collaborate, we would like to hear from
              you.
            </p>

            <div className="space-y-5">
              <div className="bg-bg-alt border border-border rounded-lg p-5">
                <h3 className="font-sans text-[0.9rem] font-bold text-ink mb-1.5">
                  Data corrections
                </h3>
                <p className="font-sans text-[0.84rem] text-ink-soft leading-relaxed">
                  If you believe a commodity price, exchange rate, or exposure
                  coefficient is incorrect, please reach out with the specific
                  data point, the source you are referencing, and the corrected
                  value. We take data accuracy seriously and will investigate
                  every report.
                </p>
              </div>

              <div className="bg-bg-alt border border-border rounded-lg p-5">
                <h3 className="font-sans text-[0.9rem] font-bold text-ink mb-1.5">
                  Methodology feedback
                </h3>
                <p className="font-sans text-[0.84rem] text-ink-soft leading-relaxed">
                  If you have suggestions for improving the model &mdash; new
                  factor types, better lag profiles, alternative exposure
                  coefficients &mdash; we welcome detailed feedback. Academic
                  citations and empirical evidence are especially helpful.
                </p>
              </div>

              <div className="bg-bg-alt border border-border rounded-lg p-5">
                <h3 className="font-sans text-[0.9rem] font-bold text-ink mb-1.5">
                  Partnership inquiries
                </h3>
                <p className="font-sans text-[0.84rem] text-ink-soft leading-relaxed">
                  Interested in using this tool for journalism, research, or
                  policy analysis? We are open to collaborations that advance the
                  goal of making macro-economic impacts more accessible and
                  understandable.
                </p>
              </div>
            </div>
          </section>

          <div className="bg-bg-alt border border-border rounded-lg p-4 mt-6">
            <p className="font-sans text-[0.82rem] text-ink leading-relaxed mb-3">
              <strong>Reach us directly:</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://github.com/raj-builder/Howwarimpactsyou/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-sans text-[0.82rem] text-accent no-underline hover:underline"
              >
                GitHub Issues &rarr;
              </a>
              <a
                href="mailto:the.builder.mode.on@gmail.com"
                className="inline-flex items-center gap-2 font-sans text-[0.82rem] text-accent no-underline hover:underline"
              >
                Email &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
