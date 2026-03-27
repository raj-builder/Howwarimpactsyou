export const FALLBACK_PRICES: Record<
  string,
  { price: number; label: string; unit: string; exchange: string; asOf: string; asOfNote: string }
> = {
  brent:  { price: 91.17,  label: 'Brent Crude',    unit: 'USD/bbl',   exchange: 'ICE London',  asOf: '28 Mar 2024', asOfNote: 'Last known close before Iran-Israel escalation. Hardcoded pending live API.' },
  natgas: { price: 3.85,   label: 'Natural Gas',     unit: 'USD/mmbtu', exchange: 'NYMEX',       asOf: '24 Mar 2025', asOfNote: 'NYMEX benchmark. Hardcoded pending live API.' },
  gold:   { price: 3022,   label: 'Gold',            unit: 'USD/troy oz',exchange: 'LBMA London', asOf: '28 Mar 2024', asOfNote: 'LBMA PM fix near Iran-Israel escalation. Hardcoded.' },
  copper: { price: 9410,   label: 'Copper',          unit: 'USD/mt',    exchange: 'LME London',  asOf: '28 Mar 2024', asOfNote: 'LME settlement. Hardcoded pending live API.' },
  alum:   { price: 2315,   label: 'Aluminium',       unit: 'USD/mt',    exchange: 'LME London',  asOf: '28 Mar 2024', asOfNote: 'LME settlement. Hardcoded pending live API.' },
  urea:   { price: 338,    label: 'Urea (Fert.)',    unit: 'USD/mt',    exchange: 'OTC·WB',      asOf: 'Mar 2024',    asOfNote: 'World Bank Pink Sheet. Updated monthly when WB publishes.' },
}
