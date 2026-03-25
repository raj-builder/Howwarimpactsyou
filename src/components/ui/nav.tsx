'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/simulator', label: 'Simulator' },
  { href: '/basket', label: 'Basket' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/validation', label: 'Validation' },
  { href: '/data-sources', label: 'Data Sources' },
  { href: '/learn', label: 'Learn' },
]

export function Nav() {
  const pathname = usePathname()

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
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`font-sans text-[0.8rem] no-underline tracking-wide transition-colors whitespace-nowrap ${
                  pathname === link.href
                    ? 'text-ink font-semibold'
                    : 'text-ink-soft hover:text-accent'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/simulator"
          className="bg-accent text-white font-sans text-[0.78rem] font-semibold px-4 py-2 rounded-md no-underline tracking-wide hover:bg-[#b03e27] transition-colors shrink-0"
        >
          Open Simulator →
        </Link>
      </div>
    </nav>
  )
}
