export interface Shock {
  factor: string
  val: string
}

export interface RankingEntry {
  f: string  // flag emoji
  c: string  // country name
  p: number  // impact percentage
}

export interface CategoryRanking {
  top5: RankingEntry[]
  bot5: RankingEntry[]
}

export type CategoryId =
  | 'bread'
  | 'dairy'
  | 'eggs'
  | 'rice'
  | 'oil'
  | 'vegetables'
  | 'meat'
  | 'detergent'
  | 'fuel'
  | 'basket'

export type WarId =
  | 'ukraine-russia'
  | 'iran-israel-us'
  | 'gaza-2023'
  | 'covid'
  | 'gulf-2003'

export interface War {
  name: string
  dates: string
  live: boolean
  shocks: Shock[]
  rankings: Record<CategoryId, CategoryRanking>
}

export interface CurrencyEntry {
  name: string
  code: string
  preRate: number
  postRate: number
  depPct: number
  window: string
}

export type CoverageStatus = 'full' | 'partial' | 'experimental' | 'unavailable'

export interface Country {
  id: string
  name: string
  flag: string
  coverage: CoverageStatus
}

export interface Category {
  id: CategoryId
  label: string
  icon: string
}

export interface Commodity {
  id: string
  label: string
  unit: string
  exchange: string
  price: number
  prev_24h: number | null
  prev_month: number | null
  pct_24h: number | null
  pct_month: number | null
  source: string
  source_ts: string
  period: string
  status: string
}

export interface PricesResponse {
  fetched_at: string
  serp_api_ok: boolean
  commodities: Record<string, Commodity>
  meta: {
    source: string
    urea_source: string
    cache_ttl_hrs: number
    errors?: string[]
  }
}
