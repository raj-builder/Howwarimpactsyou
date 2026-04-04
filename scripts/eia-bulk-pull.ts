/**
 * EIA Bulk Data Pull — One-time script to fetch energy data for all
 * fuel-alert countries and generate updated fuel-security profiles.
 *
 * Usage:
 *   EIA_API_KEY=your_key npx tsx scripts/eia-bulk-pull.ts
 *
 * What it fetches per country (2019-2024, annual):
 *   - Petroleum consumption (TBPD — thousand barrels per day)
 *   - Petroleum production (TBPD)
 *   - Petroleum imports (TBPD)
 *   - Petroleum exports (TBPD)
 *   - Natural gas consumption (BCF — billion cubic feet)
 *   - Total energy consumption (QBTU — quadrillion BTU)
 *
 * What it computes:
 *   - Daily oil consumption (bpd) = consumption TBPD * 1000
 *   - Import dependency % = (imports - exports) / consumption * 100
 *   - Oil share of total energy % = petroleum QBTU / total energy QBTU * 100
 *   - Net imports (bpd)
 *   - 5-year consumption trend
 *
 * Output: prints a formatted table + generates JSON that can be
 * copy-pasted into src/data/fuel-security.ts
 */

const API_KEY = process.env.EIA_API_KEY
if (!API_KEY) {
  console.error('ERROR: Set EIA_API_KEY environment variable')
  console.error('  Get a free key at: https://www.eia.gov/opendata/register.php')
  console.error('  Then run: EIA_API_KEY=your_key npx tsx scripts/eia-bulk-pull.ts')
  process.exit(1)
}

const BASE = 'https://api.eia.gov/v2/international/data/'

/**
 * EIA country codes — all UN member states + territories with energy data.
 * ~200 entries. EIA uses ISO 3166-1 alpha-3 codes.
 * Source: EIA International Energy Statistics country list.
 */
const COUNTRIES: Record<string, string> = {
  // Asia Pacific
  AUS: 'Australia', NZL: 'New Zealand', JPN: 'Japan', KOR: 'South Korea',
  CHN: 'China', TWN: 'Taiwan', HKG: 'Hong Kong',
  // Southeast Asia
  IDN: 'Indonesia', PHL: 'Philippines', THA: 'Thailand', VNM: 'Vietnam',
  MYS: 'Malaysia', SGP: 'Singapore', MMR: 'Myanmar', KHM: 'Cambodia',
  LAO: 'Laos', BRN: 'Brunei',
  // South Asia
  IND: 'India', PAK: 'Pakistan', BGD: 'Bangladesh', LKA: 'Sri Lanka',
  NPL: 'Nepal', AFG: 'Afghanistan',
  // Middle East & North Africa
  SAU: 'Saudi Arabia', ARE: 'UAE', IRN: 'Iran', IRQ: 'Iraq',
  KWT: 'Kuwait', QAT: 'Qatar', BHR: 'Bahrain', OMN: 'Oman',
  YEM: 'Yemen', JOR: 'Jordan', LBN: 'Lebanon', SYR: 'Syria',
  ISR: 'Israel', PSE: 'Palestine', EGY: 'Egypt', LBY: 'Libya',
  TUN: 'Tunisia', DZA: 'Algeria', MAR: 'Morocco',
  // Sub-Saharan Africa
  NGA: 'Nigeria', ZAF: 'South Africa', KEN: 'Kenya', GHA: 'Ghana',
  TZA: 'Tanzania', UGA: 'Uganda', ETH: 'Ethiopia', SEN: 'Senegal',
  SDN: 'Sudan', MOZ: 'Mozambique', AGO: 'Angola', CMR: 'Cameroon',
  CIV: "Cote d'Ivoire", COD: 'DR Congo', COG: 'Congo', GAB: 'Gabon',
  GNQ: 'Equatorial Guinea', TCD: 'Chad', NER: 'Niger', MLI: 'Mali',
  BFA: 'Burkina Faso', MWI: 'Malawi', ZMB: 'Zambia', ZWE: 'Zimbabwe',
  BWA: 'Botswana', NAM: 'Namibia', MDG: 'Madagascar', RWA: 'Rwanda',
  SOM: 'Somalia', SSD: 'South Sudan', ERI: 'Eritrea', BEN: 'Benin',
  TGO: 'Togo', SLE: 'Sierra Leone', LBR: 'Liberia', MRT: 'Mauritania',
  GIN: 'Guinea', GMB: 'Gambia', GNB: 'Guinea-Bissau', CPV: 'Cape Verde',
  SWZ: 'Eswatini', LSO: 'Lesotho', DJI: 'Djibouti', COM: 'Comoros',
  MUS: 'Mauritius', SYC: 'Seychelles',
  // Europe
  DEU: 'Germany', GBR: 'United Kingdom', FRA: 'France', ITA: 'Italy',
  ESP: 'Spain', POL: 'Poland', NLD: 'Netherlands', BEL: 'Belgium',
  SWE: 'Sweden', NOR: 'Norway', DNK: 'Denmark', FIN: 'Finland',
  AUT: 'Austria', CHE: 'Switzerland', IRL: 'Ireland', PRT: 'Portugal',
  GRC: 'Greece', CZE: 'Czech Republic', ROU: 'Romania', HUN: 'Hungary',
  BGR: 'Bulgaria', HRV: 'Croatia', SVK: 'Slovakia', SVN: 'Slovenia',
  LTU: 'Lithuania', LVA: 'Latvia', EST: 'Estonia', CYP: 'Cyprus',
  MLT: 'Malta', LUX: 'Luxembourg', ISL: 'Iceland',
  SRB: 'Serbia', BIH: 'Bosnia', ALB: 'Albania', MKD: 'North Macedonia',
  MNE: 'Montenegro', UKR: 'Ukraine', BLR: 'Belarus', MDA: 'Moldova',
  GEO: 'Georgia', ARM: 'Armenia', AZE: 'Azerbaijan',
  RUS: 'Russia', TUR: 'Turkiye',
  // Americas
  USA: 'United States', CAN: 'Canada', MEX: 'Mexico',
  BRA: 'Brazil', ARG: 'Argentina', COL: 'Colombia', CHL: 'Chile',
  PER: 'Peru', VEN: 'Venezuela', ECU: 'Ecuador', BOL: 'Bolivia',
  PRY: 'Paraguay', URY: 'Uruguay', GUY: 'Guyana', SUR: 'Suriname',
  CUB: 'Cuba', DOM: 'Dominican Republic', HTI: 'Haiti', JAM: 'Jamaica',
  TTO: 'Trinidad and Tobago', PAN: 'Panama', CRI: 'Costa Rica',
  GTM: 'Guatemala', HND: 'Honduras', SLV: 'El Salvador', NIC: 'Nicaragua',
  // Central Asia
  KAZ: 'Kazakhstan', UZB: 'Uzbekistan', TKM: 'Turkmenistan',
  KGZ: 'Kyrgyzstan', TJK: 'Tajikistan', MNG: 'Mongolia',
}

/**
 * Products and activities to fetch.
 * productId 5 = Petroleum and other liquids
 * productId 4 = Natural gas
 * productId 44 = Total energy (primary)
 *
 * activityId 1 = Production
 * activityId 2 = Consumption
 * activityId 3 = Imports
 * activityId 4 = Exports
 */
interface FetchSpec {
  productId: string
  activityId: string
  unit: string
  label: string
}

/**
 * NOTE on product IDs:
 * - productId 5 = "Petroleum and other liquids" — only has consumption (activityId 2)
 * - productId 26 = "Dry natural gas" — has ALL activities (1=production, 2=consumption,
 *   3=imports, 4=exports) with full BCF data. This is what the EIA website shows.
 *
 * Petroleum production/imports/exports are NOT in the international endpoint.
 * Import dependency for oil must come from IEA/national reports.
 */
const SPECS: FetchSpec[] = [
  { productId: '5', activityId: '2', unit: 'TBPD', label: 'petroleum_consumption_tbpd' },
  { productId: '5', activityId: '2', unit: 'QBTU', label: 'petroleum_consumption_qbtu' },
  { productId: '26', activityId: '2', unit: 'BCF', label: 'natgas_consumption_bcf' },
]

interface EiaRow {
  period: string
  productId: string
  activityId: string
  countryRegionId: string
  countryRegionName: string
  value: string | number
  unit: string
  unitName: string
}

interface EiaResponse {
  response?: {
    total?: string
    data?: EiaRow[]
  }
}

async function fetchEIA(
  countryCode: string,
  spec: FetchSpec,
  startYear: string = '2024',
  endYear: string = '2025'
): Promise<EiaRow[]> {
  const params = new URLSearchParams({
    api_key: API_KEY!,
    frequency: 'annual',
    'data[0]': 'value',
    start: startYear,
    end: endYear,
    'sort[0][column]': 'period',
    'sort[0][direction]': 'desc',
    length: '10',
  })
  params.append('facets[countryRegionId][]', countryCode)
  params.append('facets[productId][]', spec.productId)
  params.append('facets[activityId][]', spec.activityId)
  params.append('facets[unit][]', spec.unit)

  const url = `${BASE}?${params}`
  const res = await fetch(url)
  if (!res.ok) {
    console.warn(`  WARN: ${countryCode} ${spec.label} — HTTP ${res.status}`)
    return []
  }
  const json: EiaResponse = await res.json()
  return json.response?.data ?? []
}

function getLatestValue(rows: EiaRow[]): number | null {
  if (rows.length === 0) return null
  const val = rows[0].value
  return typeof val === 'number' ? val : parseFloat(val)
}

function getAllValues(rows: EiaRow[]): { year: string; value: number }[] {
  return rows
    .map((r) => ({
      year: r.period,
      value: typeof r.value === 'number' ? r.value : parseFloat(r.value as string),
    }))
    .filter((r) => !isNaN(r.value))
    .sort((a, b) => parseInt(b.year) - parseInt(a.year))
}

// ── Main ──────────────────────────────────────────────────────

interface CountryResult {
  countryId: string
  eiaCode: string
  consumptionTbpd: number | null
  consumptionBpd: number | null
  petroleumQbtu: number | null
  natgasBcf: number | null
  consumptionHistory: { year: string; value: number }[]
}

async function main() {
  const countryCount = Object.keys(COUNTRIES).length
  const estCalls = countryCount * SPECS.length
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('  EIA International Energy Data — Global Bulk Pull')
  console.log(`  Countries: ${countryCount} (all UN member states + territories)`)
  console.log('  Period: 2024-2025 (latest available as baseline)')
  console.log('  Products: Petroleum consumption (TBPD + QBTU), Natural Gas consumption (BCF)')
  console.log(`  Estimated API calls: ${estCalls} (rate-limited at 200ms/call)`)
  console.log(`  Estimated time: ~${Math.round(estCalls * 0.2 / 60)} minutes`)
  console.log('═══════════════════════════════════════════════════════════════\n')

  const results: CountryResult[] = []
  let totalCalls = 0

  for (const [code, name] of Object.entries(COUNTRIES)) {
    process.stdout.write(`Fetching ${name} (${code})... `)

    const data: Record<string, EiaRow[]> = {}
    for (const spec of SPECS) {
      data[spec.label] = await fetchEIA(code, spec)
      totalCalls++
      // Tiny delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 200))
    }

    const consumption = getLatestValue(data.petroleum_consumption_tbpd)
    const petroleumQbtu = getLatestValue(data.petroleum_consumption_qbtu)
    const natgasBcf = getLatestValue(data.natgas_consumption_bcf)

    const result: CountryResult = {
      countryId: name,
      eiaCode: code,
      consumptionTbpd: consumption,
      consumptionBpd: consumption != null ? Math.round(consumption * 1000) : null,
      petroleumQbtu,
      natgasBcf,
      consumptionHistory: getAllValues(data.petroleum_consumption_tbpd),
    }

    results.push(result)
    const oilQbtu = petroleumQbtu != null ? `${petroleumQbtu.toFixed(2)} QBTU` : '—'
    const gas = natgasBcf != null ? `${natgasBcf.toFixed(0)} BCF gas` : '—'
    console.log(`✓ (${consumption?.toFixed(0) ?? '—'} TBPD oil, ${oilQbtu}, ${gas})`)
  }

  // ── Summary Table ──────────────────────────────────────────
  console.log('\n')
  console.log('═══════════════════════════════════════════════════════════════════════════════════════')
  console.log('  RESULTS — Latest Year (2024 or most recent available)')
  console.log('═══════════════════════════════════════════════════════════════════════════════════════')
  console.log(
    padR('Country', 20),
    padR('Oil (bpd)', 14),
    padR('Oil QBTU', 10),
    padR('Gas BCF', 10),
    padR('Year', 6),
  )
  console.log('─'.repeat(62))

  for (const r of results) {
    if (r.consumptionBpd == null) continue
    console.log(
      padR(r.countryId, 20),
      padR(fmt(r.consumptionBpd), 14),
      padR(r.petroleumQbtu?.toFixed(2) ?? '—', 10),
      padR(r.natgasBcf?.toFixed(0) ?? '—', 10),
      padR(r.consumptionHistory[0]?.year ?? '—', 6),
    )
  }

  // ── 5-Year Trend ──────────────────────────────────────────
  console.log('\n')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('  5-YEAR PETROLEUM CONSUMPTION TREND (TBPD)')
  console.log('═══════════════════════════════════════════════════════════════')

  for (const r of results) {
    const history = r.consumptionHistory.slice(0, 6)
    if (history.length === 0) continue
    const trend = history
      .map((h) => `${h.year}: ${h.value.toFixed(0)}`)
      .join('  →  ')
    console.log(`  ${padR(r.countryId, 15)} ${trend}`)
  }

  // ── JSON Output for fuel-security.ts ──────────────────────
  console.log('\n')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('  JSON (copy into fuel-security.ts oilConsumptionBpd / importDependencyPct)')
  console.log('═══════════════════════════════════════════════════════════════')

  for (const r of results) {
    if (r.consumptionBpd == null) continue
    const year = r.consumptionHistory[0]?.year ?? '?'
    console.log(`  // ${r.countryId} (EIA ${r.eiaCode}, ${year})`)
    console.log(`  oilConsumptionBpd: ${r.consumptionBpd.toLocaleString().replace(/,/g, '_')},`)
    console.log('')
  }

  // ── Save to JSON file ──────────────────────────────────────
  const outputPath = 'scripts/eia-energy-data.json'
  const output = {
    generatedAt: new Date().toISOString(),
    source: 'EIA International Energy Statistics (api.eia.gov/v2/international)',
    licence: 'Public domain (U.S. Government)',
    period: '2024-2025 (latest available)',
    totalCountries: results.length,
    totalApiCalls: totalCalls,
    countries: results
      .filter((r) => r.consumptionBpd != null)
      .map((r) => ({
        countryId: r.countryId,
        eiaCode: r.eiaCode,
        latestYear: r.consumptionHistory[0]?.year ?? null,
        oilConsumptionBpd: r.consumptionBpd,
        petroleumQbtu: r.petroleumQbtu != null ? Math.round(r.petroleumQbtu * 100) / 100 : null,
        natgasBcf: r.natgasBcf != null ? Math.round(r.natgasBcf) : null,
      })),
  }

  const { writeFileSync } = await import('fs')
  writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8')
  console.log(`\nSaved to ${outputPath}`)

  console.log(`Total EIA API calls: ${totalCalls}`)
  console.log('Done.')
}

function padR(s: string, n: number): string {
  return s.padEnd(n)
}

function fmt(n: number | null): string {
  if (n == null) return '—'
  return n.toLocaleString()
}

main().catch(console.error)
