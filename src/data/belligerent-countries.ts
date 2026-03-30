/**
 * Countries directly involved in the conflicts modeled by the simulator.
 * These are NOT the same as the 20 "recipient" countries in the rankings —
 * these are the belligerent nations whose actions drive the commodity shocks.
 *
 * Data sources:
 * - GDP: World Bank (2023 est.)
 * - Oil production: EIA / OPEC (2023)
 * - Gas production: IEA (2023)
 * - Key exports: UN Comtrade
 */

export interface BelligerentCountry {
  name: string
  flag: string
  role: string
  wars: string[]
  gdpBn: number
  oilMbpd: number
  gasBcm: number
  keyExports: string
  impact: string
  /** Per-war impact direction: positive (benefits), negative (suffers), or neutral */
  warImpact?: Record<string, 'positive' | 'negative' | 'neutral'>
}

export const BELLIGERENT_COUNTRIES: BelligerentCountry[] = [
  {
    name: 'United States',
    flag: '🇺🇸',
    role: 'Attacker, net energy exporter, gains from oil spike',
    wars: ['hormuz-2026', 'iran-israel-us', 'gulf-2003'],
    warImpact: { 'hormuz-2026': 'positive', 'iran-israel-us': 'positive', 'gulf-2003': 'positive' },
    gdpBn: 25460,
    oilMbpd: 12.9,
    gasBcm: 1035,
    keyExports: 'Petroleum products, LNG, wheat, corn, soybeans',
    impact: 'US sanctions on Iran directly restrict ~2.5 Mbpd of oil exports. US dollar strength amplifies commodity costs for import-dependent economies.',
  },
  {
    name: 'Israel',
    flag: '🇮🇱',
    role: 'Co-attacker, military + economic costs',
    wars: ['hormuz-2026', 'iran-israel-us', 'gaza-2023'],
    warImpact: { 'hormuz-2026': 'negative', 'iran-israel-us': 'negative', 'gaza-2023': 'negative' },
    gdpBn: 525,
    oilMbpd: 0,
    gasBcm: 22,
    keyExports: 'Technology, diamonds, pharmaceuticals, natural gas (Leviathan)',
    impact: 'Israeli military operations in Gaza and against Iranian proxies disrupt Red Sea shipping routes, adding 10-15 days to Asia-Europe freight.',
  },
  {
    name: 'Iran',
    flag: '🇮🇷',
    role: 'Defending, Hormuz gatekeeper, infrastructure hit',
    wars: ['hormuz-2026', 'iran-israel-us'],
    warImpact: { 'hormuz-2026': 'negative', 'iran-israel-us': 'negative' },
    gdpBn: 401,
    oilMbpd: 3.2,
    gasBcm: 259,
    keyExports: 'Crude oil, natural gas, petrochemicals',
    impact: 'Iran controls the Strait of Hormuz (21% of global oil trade). Escalation threats alone cause shipping insurance premiums to spike, adding $1-3/bbl to crude.',
  },
  {
    name: 'Russia',
    flag: '🇷🇺',
    role: 'Major oil/gas exporter, grain exporter, direct combatant',
    wars: ['ukraine-russia'],
    warImpact: { 'ukraine-russia': 'negative' },
    gdpBn: 1862,
    oilMbpd: 10.8,
    gasBcm: 638,
    keyExports: 'Crude oil, natural gas, wheat, fertilizer, metals',
    impact: 'Russia produces ~12% of global oil and ~17% of global gas. Sanctions rerouted energy flows, raised European gas prices 300%+, and disrupted Black Sea grain exports.',
  },
  {
    name: 'Ukraine',
    flag: '🇺🇦',
    role: 'Major grain exporter, direct combatant, transit corridor',
    wars: ['ukraine-russia'],
    warImpact: { 'ukraine-russia': 'negative' },
    gdpBn: 160,
    oilMbpd: 0,
    gasBcm: 18,
    keyExports: 'Wheat, corn, sunflower oil, steel',
    impact: 'Ukraine produces ~10% of global wheat exports and ~50% of global sunflower oil. Black Sea port blockades in 2022 caused global grain prices to spike 40%+.',
  },
  {
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    role: 'Oil exports blocked, infrastructure at risk',
    wars: ['hormuz-2026', 'iran-israel-us'],
    warImpact: { 'hormuz-2026': 'negative', 'iran-israel-us': 'neutral' },
    gdpBn: 1069,
    oilMbpd: 10.4,
    gasBcm: 117,
    keyExports: 'Crude oil, refined petroleum, petrochemicals',
    impact: 'Saudi production decisions directly set global oil price floors. OPEC+ cuts in response to conflict uncertainty amplify price shocks on consuming nations.',
  },
  {
    name: 'UAE',
    flag: '🇦🇪',
    role: 'US military base host, Gulf shipping hub, oil exporter',
    wars: ['hormuz-2026', 'iran-israel-us'],
    warImpact: { 'hormuz-2026': 'negative', 'iran-israel-us': 'negative' },
    gdpBn: 507,
    oilMbpd: 3.2,
    gasBcm: 56,
    keyExports: 'Crude oil, refined petroleum, aluminium, re-exports',
    impact: 'Al Dhafra Air Base hosts US forces targeted by Iranian missiles. Jebel Ali port (world\'s 9th largest) effectively shut. 147 container ships stranded in Persian Gulf.',
  },
  {
    name: 'Kuwait',
    flag: '🇰🇼',
    role: 'US military base host, oil exporter, Gulf state',
    wars: ['hormuz-2026', 'iran-israel-us'],
    warImpact: { 'hormuz-2026': 'negative', 'iran-israel-us': 'negative' },
    gdpBn: 184,
    oilMbpd: 2.7,
    gasBcm: 18,
    keyExports: 'Crude oil, refined petroleum, petrochemicals',
    impact: 'Camp Arifjan and Ali Al Salem Air Base targeted. Oil exports through Hormuz completely halted. Economy 90%+ dependent on oil revenue.',
  },
  {
    name: 'Qatar',
    flag: '🇶🇦',
    role: 'World\'s largest LNG exporter, US military base host',
    wars: ['hormuz-2026', 'iran-israel-us'],
    warImpact: { 'hormuz-2026': 'negative', 'iran-israel-us': 'negative' },
    gdpBn: 236,
    oilMbpd: 1.8,
    gasBcm: 177,
    keyExports: 'LNG, crude oil, petrochemicals, helium',
    impact: 'Ras Laffan LNG terminal hit by Iranian drone strikes. Al Udeid Air Base (largest US base in Middle East) is primary staging point. LNG exports halted.',
  },
  {
    name: 'Bahrain',
    flag: '🇧🇭',
    role: 'US 5th Fleet headquarters, banking hub',
    wars: ['hormuz-2026', 'iran-israel-us'],
    warImpact: { 'hormuz-2026': 'negative', 'iran-israel-us': 'negative' },
    gdpBn: 44,
    oilMbpd: 0.2,
    gasBcm: 18,
    keyExports: 'Refined petroleum, aluminium, financial services',
    impact: 'Hosts US Naval Forces Central Command (5th Fleet). Stena Imperative struck at port. Closest Gulf state to Iran — within missile range.',
  },
  {
    name: 'Lebanon',
    flag: '🇱🇧',
    role: 'Hezbollah base, Iranian proxy conflict zone',
    wars: ['hormuz-2026', 'iran-israel-us', 'gaza-2023'],
    warImpact: { 'hormuz-2026': 'negative', 'iran-israel-us': 'negative', 'gaza-2023': 'negative' },
    gdpBn: 22,
    oilMbpd: 0,
    gasBcm: 0,
    keyExports: 'Gold, jewellery, food products',
    impact: 'Hezbollah rocket attacks on Israel triggered Israeli counter-strikes. Already in economic collapse (GDP dropped 60% since 2019). Fuel and food imports disrupted.',
  },
]
