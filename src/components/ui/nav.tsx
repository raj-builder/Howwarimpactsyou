'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useT } from '@/lib/use-t'

const NAV_KEYS: { href: string; key: string }[] = [
  { href: '/', key: 'nav.home' },
  { href: '/simulator', key: 'nav.simulator' },
  { href: '/basket', key: 'nav.basket' },
  { href: '/methodology', key: 'nav.methodology' },
  { href: '/countries', key: 'nav.countries' },
  { href: '/data-sources', key: 'nav.dataSources' },
  { href: '/learn', key: 'nav.learn' },
]

export function Nav() {
  const pathname = usePathname()
  const t = useT()

  return (
    <nav className="bg-bg-card border-b border-border sticky top-0 z-50 px-4 md:px-8">
      <div className="max-w-[1140px] mx-auto flex items-center justify-between h-14">
        <Link
          href="/"
          className="font-sans text-[0.9rem] font-bold tracking-tight text-ink no-underline shrink-0"
        >
          howwar<span className="text-accent">impacts</span>you
        </Link>

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

        <Link
          href="/simulator"
          className="bg-accent text-white font-sans text-[0.78rem] font-semibold px-4 py-2 rounded-md no-underline tracking-wide hover:bg-[#b03e27] transition-colors shrink-0"
        >
          {t('nav.openSimulator')} &rarr;
        </Link>
      </div>
    </nav>
  )
}
