/**
 * Country-specific consumer goods prices — local currency, sourced from
 * local retailers, official press releases, and government tariff data.
 *
 * Fallback: if a country is not listed, the component uses global MSRP
 * from pre-escalation-prices.ts.
 */

export interface ConsumerGoodLocal {
  id: string
  label: string
  prePrice: number
  postPrice: number
  currency: string
  note: string
}

export const LOCAL_CONSUMER_GOODS: Record<string, Record<string, ConsumerGoodLocal[]>> = {
  'hormuz-2026': {
    'India': [
      { id: 'iphone', label: 'iPhone 16 Pro 256GB', prePrice: 119900, postPrice: 123900, currency: 'INR', note: 'Apple India MSRP + tariff adjustment' },
      { id: 'bmw-x1', label: 'BMW X1 sDrive18i', prePrice: 4950000, postPrice: 5049000, currency: 'INR', note: 'BMW India +2% from Apr 2026 (press.bmwgroup.com)' },
      { id: 'electricity', label: 'Monthly electricity (200 kWh)', prePrice: 1600, postPrice: 1840, currency: 'INR', note: 'Avg residential tariff + fuel surcharge' },
      { id: 'flight', label: 'Economy DEL\u2192DXB', prePrice: 18000, postPrice: 25200, currency: 'INR', note: 'Air India +$50\u201385 surcharge (CNBC)' },
    ],
    'Egypt': [
      { id: 'iphone', label: 'iPhone 16 Pro 256GB', prePrice: 62000, postPrice: 67000, currency: 'EGP', note: 'Orange Egypt + EGP depreciation' },
      { id: 'electricity', label: 'Monthly electricity (200 kWh)', prePrice: 420, postPrice: 530, currency: 'EGP', note: 'IMF reform tariff + fuel cost pass-through' },
      { id: 'flight', label: 'Economy CAI\u2192DXB', prePrice: 8500, postPrice: 14200, currency: 'EGP', note: 'Rerouting + fuel surcharge + EGP depreciation' },
    ],
    'Pakistan': [
      { id: 'iphone', label: 'iPhone 16 Pro 256GB', prePrice: 355000, postPrice: 367000, currency: 'PKR', note: 'Priceoye.pk market price' },
      { id: 'electricity', label: 'Monthly electricity (200 kWh)', prePrice: 6400, postPrice: 7450, currency: 'PKR', note: 'NEPRA FCA Rs1.63/kWh (Energy Update)' },
      { id: 'flight', label: 'Economy ISB\u2192DXB', prePrice: 42000, postPrice: 58000, currency: 'PKR', note: 'PIA fuel surcharge + rerouting' },
    ],
    'Philippines': [
      { id: 'iphone', label: 'iPhone 16 Pro 256GB', prePrice: 76990, postPrice: 76990, currency: 'PHP', note: 'Apple PH MSRP unchanged' },
      { id: 'electricity', label: 'Monthly electricity (200 kWh)', prePrice: 2634, postPrice: 2763, currency: 'PHP', note: 'Meralco +P0.64/kWh March (Philstar)' },
      { id: 'flight', label: 'Economy MNL\u2192DXB', prePrice: 22000, postPrice: 33000, currency: 'PHP', note: 'DOE: LNG tripled P12\u2192P25, fuel surcharge' },
    ],
    'Japan': [
      { id: 'iphone', label: 'iPhone 16 Pro 256GB', prePrice: 159800, postPrice: 164800, currency: 'JPY', note: 'Apple Japan price adjustment' },
      { id: 'electricity', label: 'Monthly electricity (300 kWh)', prePrice: 9200, postPrice: 10600, currency: 'JPY', note: '93% oil via Hormuz, LNG price spike (IEA)' },
      { id: 'flight', label: 'Economy NRT\u2192DXB', prePrice: 85000, postPrice: 142000, currency: 'JPY', note: 'ANA fuel surcharge + rerouting (67% increase)' },
    ],
    'Nigeria': [
      { id: 'electricity', label: 'Monthly electricity (200 kWh)', prePrice: 12000, postPrice: 16800, currency: 'NGN', note: 'Band A tariff increase + diesel generation costs' },
      { id: 'flight', label: 'Economy LOS\u2192DXB', prePrice: 520000, postPrice: 780000, currency: 'NGN', note: 'Ethiopian Airlines rerouting + fuel surcharge' },
    ],
    'T\u00FCrkiye': [
      { id: 'iphone', label: 'iPhone 16 Pro 256GB', prePrice: 74999, postPrice: 79999, currency: 'TRY', note: 'Apple T\u00FCrkiye + TRY depreciation' },
      { id: 'electricity', label: 'Monthly electricity (200 kWh)', prePrice: 1400, postPrice: 1680, currency: 'TRY', note: 'EPDK tariff adjustment + natural gas costs' },
    ],
    'South Korea': [
      { id: 'iphone', label: 'iPhone 16 Pro 256GB', prePrice: 1550000, postPrice: 1590000, currency: 'KRW', note: 'Apple Korea + component cost increase' },
      { id: 'electricity', label: 'Monthly electricity (300 kWh)', prePrice: 52000, postPrice: 60000, currency: 'KRW', note: '68% crude via Hormuz, KEPCO surcharge' },
    ],
    'Germany': [
      { id: 'electricity', label: 'Monthly electricity (250 kWh)', prePrice: 95, postPrice: 108, currency: 'EUR', note: 'EU TTF gas +21%, grid surcharge increase' },
      { id: 'flight', label: 'Economy FRA\u2192SIN', prePrice: 650, postPrice: 980, currency: 'EUR', note: 'Lufthansa fuel surcharge + rerouting (Euronews)' },
    ],
    'United Kingdom': [
      { id: 'electricity', label: 'Monthly electricity (250 kWh)', prePrice: 82, postPrice: 98, currency: 'GBP', note: 'Ofgem price cap + gas wholesale increase' },
      { id: 'flight', label: 'Economy LHR\u2192SIN', prePrice: 450, postPrice: 1200, currency: 'GBP', note: 'Economy fares nearly tripled (Euronews)' },
    ],
  },

  'iran-israel-us': {
    'India': [
      { id: 'iphone', label: 'iPhone 16 Pro 256GB', prePrice: 119900, postPrice: 119900, currency: 'INR', note: 'Apple India MSRP stable during Apr 2024 period' },
      { id: 'electricity', label: 'Monthly electricity (200 kWh)', prePrice: 1440, postPrice: 1600, currency: 'INR', note: 'DisCom tariff revision + subsidy delays' },
    ],
    'Egypt': [
      { id: 'electricity', label: 'Monthly electricity (200 kWh)', prePrice: 280, postPrice: 420, currency: 'EGP', note: 'IMF-mandated tariff increase phase + EGP float' },
    ],
  },

  'ukraine-russia': {
    'India': [
      { id: 'iphone', label: 'iPhone 13 Pro 256GB', prePrice: 109900, postPrice: 119900, currency: 'INR', note: 'iPhone 13\u219216 cycle + INR depreciation' },
      { id: 'electricity', label: 'Monthly electricity (200 kWh)', prePrice: 1200, postPrice: 1600, currency: 'INR', note: 'Coal shortage + DisCom tariff hikes over 4 years' },
    ],
    'Egypt': [
      { id: 'electricity', label: 'Monthly electricity (200 kWh)', prePrice: 120, postPrice: 420, currency: 'EGP', note: 'EGP 15.7\u219253.5 + IMF tariff reform (250% increase)' },
    ],
    'Pakistan': [
      { id: 'electricity', label: 'Monthly electricity (200 kWh)', prePrice: 3200, postPrice: 7450, currency: 'PKR', note: 'Circular debt + IMF conditionality + fuel costs' },
    ],
  },
}

/** Currency symbols for formatting */
export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '\u20B9',
  EGP: 'EGP\u00A0',
  PKR: 'PKR\u00A0',
  PHP: '\u20B1',
  JPY: '\u00A5',
  NGN: '\u20A6',
  TRY: '\u20BA',
  KRW: '\u20A9',
  EUR: '\u20AC',
  GBP: '\u00A3',
  USD: '$',
}
