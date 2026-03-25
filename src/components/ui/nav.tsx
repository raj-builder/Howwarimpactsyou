'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/simulator', label: 'Simulator' },
  { href: '/basket', label: 'Basket View' },
  { href: '/compare', label: 'Compare' },
  { href: '/saved', label: 'Saved' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/validation', label: 'Validation' },
  { href: '/data-sources', label: 'Data Sources' },
  { href: '/learn', label: 'Learn' },
  { href: '/press', label: 'Press' },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="bg-bg-card border-b border-border sticky top-0 z-100 px-8">
      <div className="max-w-[1140px] mx-auto flex items-center justify-between h-14">
        <Link
          href="/"
          className="font-sans text-[0.9rem] font-bold tracking-tight text-ink no-underline"
        >
          howwar<span className="text-accent">impacts</span>you
        </Link>

        <ul className="hidden md:flex gap-7 list-none">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`font-sans text-[0.82rem] no-underline tracking-wide transition-colors ${
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
          className="bg-accent text-white font-sans text-[0.8rem] font-semibold px-4 py-2 rounded-md no-underline tracking-wide hover:bg-[#b03e27] transition-colors"
        >
          Open Simulator &rarr;
        </Link>
      </div>
    </nav>
  )
}
