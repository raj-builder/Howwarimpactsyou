export const FALLBACK_PRICES: Record<
  string,
  { price: number; label: string; unit: string; exchange: string; asOf: string }
> = {
  brent: { price: 91.5, label: 'Crude Oil', unit: 'USD/bbl', exchange: 'NYMEX', asOf: '24 Mar 2025' },
  natgas: { price: 3.85, label: 'Natural Gas', unit: 'USD/mmbtu', exchange: 'NYMEX', asOf: '24 Mar 2025' },
  gold: { price: 4448, label: 'Gold', unit: 'USD/oz', exchange: 'COMEX', asOf: '24 Mar 2025' },
  copper: { price: 5.42, label: 'Copper', unit: 'USD/lb', exchange: 'COMEX', asOf: '24 Mar 2025' },
  alum: { price: 1.18, label: 'Aluminium', unit: 'USD/lb', exchange: 'COMEX', asOf: '24 Mar 2025' },
  urea: { price: 310.5, label: 'Urea (Fert.)', unit: 'USD/mt', exchange: 'OTC·WB', asOf: 'Feb 2025' },
}
