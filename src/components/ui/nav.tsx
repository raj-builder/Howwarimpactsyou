'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useT } from '@/lib/use-t'

const NAV_KEYS: { href: string; key: string }[] = [
  { href: '/', key: 'nav.home' },
  { href: '/simulator', key: 'nav.simulator' },
  { href: '/country-simulator', key: 'nav.countrySimulator' },
  { href: '/how-it-works', key: 'nav.howItWorks' },
  { href: '/feedback', key: 'nav.feedback' },
]

const SECONDARY_KEYS: { href: string; key: string }[] = [
  { href: '/about', key: 'nav.about' },
  { href: '/press', key: 'nav.press' },
  { href: '/changelog', key: 'nav.changelog' },
  { href: '/contact', key: 'nav.contact' },
]

export function Nav() {
  const pathname = usePathname()
  const t = useT()
  const [mobileOpen, setMobileOpen] = useState(false)

  /* Close drawer on route change */
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  /* Prevent body scroll when drawer is open */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <nav className="bg-bg-card border-b border-border sticky top-0 z-50 px-4 md:px-8">
        <div className="max-w-[1140px] mx-auto flex items-center justify-between h-14">
          <Link
            href="/"
            className="font-sans text-[0.9rem] font-bold tracking-tight text-ink no-underline shrink-0"
          >
            howwar<span className="text-accent">impacts</span>you
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex gap-5 list-none">
            {NAV_KEYS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`font-sans text-[0.8rem] no-underline tracking-wide transition-colors whitespace-nowrap ${
                    pathname === link.href
                      ? 'text-ink font-semibold'
                      : 'text-ink-soft hover:text-accent'
                  }`}
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="/country-simulator"
              className="bg-accent text-white font-sans text-[0.78rem] font-semibold px-4 py-2 rounded-md no-underline tracking-wide hover:bg-[#b03e27] transition-colors shrink-0 hidden sm:inline-flex"
            >
              {t('nav.openSimulator')} &rarr;
            </Link>

            {/* Hamburger button — visible below lg */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-md hover:bg-bg-alt transition-colors cursor-pointer"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <span className={`block w-5 h-[2px] bg-ink transition-all ${mobileOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
              <span className={`block w-5 h-[2px] bg-ink mt-[4px] transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-[2px] bg-ink mt-[4px] transition-all ${mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-14 right-0 bottom-0 w-[280px] bg-bg-card border-l border-border z-50 transform transition-transform lg:hidden overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Navigation menu"
      >
        <div className="p-5">
          {/* Primary links */}
          <ul className="list-none space-y-1 mb-6">
            {NAV_KEYS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block font-sans text-[0.9rem] no-underline py-2.5 px-3 rounded-lg transition-colors ${
                    pathname === link.href
                      ? 'text-accent font-semibold bg-accent-light'
                      : 'text-ink hover:bg-bg-alt'
                  }`}
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="border-t border-border mb-4" />

          {/* Secondary links */}
          <ul className="list-none space-y-1 mb-6">
            {SECONDARY_KEYS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block font-sans text-[0.82rem] no-underline py-2 px-3 rounded-lg transition-colors ${
                    pathname === link.href
                      ? 'text-accent font-semibold bg-accent-light'
                      : 'text-ink-soft hover:text-ink hover:bg-bg-alt'
                  }`}
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="/country-simulator"
            className="block w-full text-center bg-accent text-white font-sans text-[0.85rem] font-semibold px-4 py-3 rounded-lg no-underline hover:bg-[#b03e27] transition-colors"
          >
            {t('nav.openSimulator')} &rarr;
          </Link>
        </div>
      </div>
    </>
  )
}
