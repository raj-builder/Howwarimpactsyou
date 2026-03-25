import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white/50 py-10 px-8 mt-16">
      <div className="max-w-[1140px] mx-auto flex justify-between items-center flex-wrap gap-4">
        <div className="font-sans text-[0.85rem] font-bold text-white/70">
          howwar<span className="text-accent-warm">impacts</span>you
          <span className="ml-2 text-[0.7rem] text-white/30 font-normal">v1.0 Beta</span>
        </div>
        <div className="font-sans text-[0.73rem] leading-relaxed max-w-[520px] text-white/40">
          This tool estimates a scenario ceiling under stated assumptions. It is not a price forecast,
          financial advice, or official statistic. All figures are model outputs, not observed prices.
          Use at your own discretion.
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto mt-6 flex flex-wrap gap-6 text-[0.72rem] font-sans text-white/35 border-t border-white/8 pt-4">
        <Link href="/about" className="hover:text-white/60 no-underline text-white/35">About</Link>
        <Link href="/methodology" className="hover:text-white/60 no-underline text-white/35">Methodology</Link>
        <Link href="/data-sources" className="hover:text-white/60 no-underline text-white/35">Data Sources</Link>
        <Link href="/changelog" className="hover:text-white/60 no-underline text-white/35">Changelog</Link>
        <Link href="/contact" className="hover:text-white/60 no-underline text-white/35">Contact</Link>
      </div>

      <div className="max-w-[1140px] mx-auto font-sans text-[0.67rem] leading-relaxed text-white/30 mt-3 text-center border-t border-white/8 pt-3">
        Macro data: World Bank, IMF, FAO, EIA &middot; Validation: National CPI offices,
        UN Comtrade &middot; Prices: SerpAPI / Google Finance &amp; World Bank
      </div>
    </footer>
  )
}
