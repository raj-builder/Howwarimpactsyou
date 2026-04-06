import type { CountryFuelProfile } from '@/types/fuel-security'

/**
 * Per-country fuel security profiles.
 *
 * Data sources:
 * - Oil consumption: U.S. Energy Information Administration (EIA) International
 *   Energy Statistics, 2024 annual data. Source: U.S. Energy Information
 *   Administration. Public domain (U.S. Government).
 *   Pulled via api.eia.gov/v2/international on 2026-04-04.
 *   Raw data: scripts/eia-energy-data.json
 * - Import dependency: IEA Energy Security (2024), Zero Carbon Analytics
 * - Hormuz exposure: Zero Carbon Analytics, IEA Strait of Hormuz report
 * - Strategic reserves: IEA member country reports, national press, JOGMEC
 * - Jet fuel reserves: IATA, national aviation authority data where available
 * - Refining capacity: BP Statistical Review 2024
 *
 * Data as of: 2026-04-04
 */
export const FUEL_SECURITY_PROFILES: CountryFuelProfile[] = [
  {
    countryId: 'Australia',
    oilConsumptionBpd: 1_145_393, // EIA AUS 2024
    importDependencyPct: 90,
    hormuzExposurePct: 59,
    strategicReserveDays: 34,
    jetFuelReserveDays: 29,
    refiningCapacityPct: 45,
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEEFA Australia Oil Demand 2024',
      'Macquarie Lighthouse — Australia 36-day petrol supply',
      'Australian Aviation — jet fuel reserves',
    ],
    dataAsOf: '2026-04-04',
  },
  {
    countryId: 'Indonesia',
    oilConsumptionBpd: 1_626_878, // EIA IDN 2024
    importDependencyPct: 48,
    hormuzExposurePct: 25,
    strategicReserveDays: 22,
    jetFuelReserveDays: 29,
    refiningCapacityPct: 50,
    sources: [
      'U.S. Energy Information Administration (2024)',
      'Windonesia — Indonesia energy vulnerabilities',
      'Middle East Monitor — Hormuz crisis Indonesia',
    ],
    dataAsOf: '2026-04-04',
  },
  {
    countryId: 'Pakistan',
    oilConsumptionBpd: 479_218, // EIA PAK 2024
    importDependencyPct: 85,
    hormuzExposurePct: 40,
    strategicReserveDays: 20,
    jetFuelReserveDays: null,
    refiningCapacityPct: 30,
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEA — Pakistan energy profile',
      'CNBC — Hormuz closure impact',
    ],
    dataAsOf: '2026-04-04',
  },
  {
    countryId: 'Bangladesh',
    oilConsumptionBpd: 287_859, // EIA BGD 2024
    importDependencyPct: 95,
    hormuzExposurePct: 60,
    strategicReserveDays: 10,
    jetFuelReserveDays: null,
    refiningCapacityPct: 15,
    sources: [
      'U.S. Energy Information Administration (2024)',
      'Christian Science Monitor — Asia energy shortages',
    ],
    dataAsOf: '2026-04-04',
  },
  {
    countryId: 'Sri Lanka',
    oilConsumptionBpd: 91_962, // EIA LKA 2024
    importDependencyPct: 100,
    hormuzExposurePct: 65,
    strategicReserveDays: 30,
    jetFuelReserveDays: null,
    refiningCapacityPct: 0,
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEA — Sri Lanka energy profile',
    ],
    dataAsOf: '2026-04-04',
  },
  {
    countryId: 'Philippines',
    oilConsumptionBpd: 473_464, // EIA PHL 2024
    importDependencyPct: 97,
    hormuzExposurePct: 95,
    strategicReserveDays: 52,
    jetFuelReserveDays: null,
    refiningCapacityPct: 25,
    sources: [
      'U.S. Energy Information Administration (2024)',
      'Zero Carbon Analytics — Asian countries most at risk',
      'IEA — Philippines oil statistics',
    ],
    dataAsOf: '2026-04-04',
  },
  {
    countryId: 'India',
    oilConsumptionBpd: 5_598_890, // EIA IND 2024
    importDependencyPct: 87,
    hormuzExposurePct: 53,
    strategicReserveDays: 75,
    jetFuelReserveDays: null,
    refiningCapacityPct: 80,
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEA — India energy security',
      'Zero Carbon Analytics — Hormuz risk score 4.9',
    ],
    dataAsOf: '2026-04-04',
  },
  {
    countryId: 'Thailand',
    oilConsumptionBpd: 1_372_480, // EIA THA 2024
    importDependencyPct: 70,
    hormuzExposurePct: 50,
    strategicReserveDays: 63,
    jetFuelReserveDays: null,
    refiningCapacityPct: 65,
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEA — Thailand energy review',
    ],
    dataAsOf: '2026-04-04',
  },
  {
    countryId: 'Japan',
    oilConsumptionBpd: 3_140_328, // EIA JPN 2024
    importDependencyPct: 97,
    hormuzExposurePct: 92,
    strategicReserveDays: 254,
    jetFuelReserveDays: 45,
    refiningCapacityPct: 110,
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEA — Japan country review 2024',
      'JOGMEC — strategic reserve report',
      'Energy Tracker Asia — Japan most at risk',
    ],
    dataAsOf: '2026-04-04',
  },
  {
    countryId: 'South Korea',
    oilConsumptionBpd: 2_514_544, // EIA KOR 2024
    importDependencyPct: 97,
    hormuzExposurePct: 68,
    strategicReserveDays: 208,
    jetFuelReserveDays: null,
    refiningCapacityPct: 100,
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEA — South Korea country review',
      'CEIC Data — South Korea oil consumption',
    ],
    dataAsOf: '2026-04-04',
  },
  {
    countryId: 'China',
    oilConsumptionBpd: 16_370_536, // EIA CHN 2024
    importDependencyPct: 74,
    hormuzExposurePct: 40,
    strategicReserveDays: 200,
    jetFuelReserveDays: null,
    refiningCapacityPct: 95,
    sources: [
      'U.S. Energy Information Administration (2024)',
      'Andaman Partners — China strategic fuel imports',
      'Visual Capitalist — oil trade through Hormuz',
    ],
    dataAsOf: '2026-04-04',
  },
  {
    countryId: 'Taiwan',
    oilConsumptionBpd: 871_491, // EIA TWN 2024
    importDependencyPct: 98,
    hormuzExposurePct: 70,
    strategicReserveDays: 90,
    jetFuelReserveDays: null,
    refiningCapacityPct: 85,
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEA — Taiwan energy statistics',
    ],
    dataAsOf: '2026-04-04',
  },
  {
    countryId: 'Singapore',
    oilConsumptionBpd: 1_482_170, // EIA SGP 2024
    importDependencyPct: 100,
    hormuzExposurePct: 55,
    strategicReserveDays: 90,
    jetFuelReserveDays: null,
    refiningCapacityPct: 200,
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEA — Singapore as refining hub',
    ],
    dataAsOf: '2026-04-04',
  },
  {
    countryId: 'New Zealand',
    oilConsumptionBpd: 159_238, // EIA NZL 2024
    importDependencyPct: 90,
    hormuzExposurePct: 45,
    strategicReserveDays: 28,
    jetFuelReserveDays: null,
    refiningCapacityPct: 0,
    sources: [
      'U.S. Energy Information Administration (2024)',
      'Air New Zealand — 1,100 flights cancelled',
      'NZ Ministry of Business — fuel security report',
    ],
    dataAsOf: '2026-04-04',
  },
  /* ── Destination-only profiles ──────────────────────────────── */
  /* These countries appear as destinations in flight routes but are
     not origin-side fuel-vulnerable. Profiles allow the route checker
     to compute both ends. Data is partial / best-effort. */
  {
    countryId: 'UAE',
    oilConsumptionBpd: 1_063_000, // EIA ARE 2024
    importDependencyPct: 0, // Net exporter
    hormuzExposurePct: 100, // Located on the Strait
    strategicReserveDays: 90, // ADNOC strategic storage (est.)
    jetFuelReserveDays: null,
    refiningCapacityPct: 120, // Major refining hub (Ruwais, Jebel Ali)
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEA — UAE country profile',
      'ADNOC strategic storage estimates',
    ],
    dataAsOf: '2026-04-06',
  },
  {
    countryId: 'United Kingdom',
    oilConsumptionBpd: 1_295_000, // EIA GBR 2024
    importDependencyPct: 38, // North Sea + Norway pipeline
    hormuzExposurePct: 5, // Very low — mostly North Sea / Atlantic
    strategicReserveDays: 60, // BEIS mandatory stock obligation
    jetFuelReserveDays: null,
    refiningCapacityPct: 75, // 6 active refineries
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEA — United Kingdom 2024 review',
      'UK DESNZ — oil stock obligations',
    ],
    dataAsOf: '2026-04-06',
  },
  {
    countryId: 'Ireland',
    oilConsumptionBpd: 148_000, // EIA IRL 2024
    importDependencyPct: 100, // No domestic production
    hormuzExposurePct: 3, // Nearly zero — Atlantic / North Sea supply
    strategicReserveDays: 90, // NORA 90-day obligation (IEA member)
    jetFuelReserveDays: null,
    refiningCapacityPct: 0, // Whitegate closed 2001
    sources: [
      'U.S. Energy Information Administration (2024)',
      'NORA — National Oil Reserves Agency',
      'IEA — Ireland 2024 review',
    ],
    dataAsOf: '2026-04-06',
  },
  {
    countryId: 'Egypt',
    oilConsumptionBpd: 676_000, // EIA EGY 2024
    importDependencyPct: 30, // Partial domestic production
    hormuzExposurePct: 15, // Low — most supply from domestic + Libya
    strategicReserveDays: 45, // EGPC strategic reserves (est.)
    jetFuelReserveDays: null,
    refiningCapacityPct: 60, // MIDOR + other refineries
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEA — Egypt energy profile',
    ],
    dataAsOf: '2026-04-06',
  },
  {
    countryId: 'Vietnam',
    oilConsumptionBpd: 547_000, // EIA VNM 2024
    importDependencyPct: 60, // Domestic production declining
    hormuzExposurePct: 20, // Most imports from regional (Malaysia, Korea)
    strategicReserveDays: 35, // Limited strategic reserves
    jetFuelReserveDays: null,
    refiningCapacityPct: 40, // Nghi Son + Dung Quat
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEA — Vietnam energy profile',
    ],
    dataAsOf: '2026-04-06',
  },
  /* ── Least-impacted profiles ───────────────────────────────── */
  /* These countries have minimal Hormuz exposure due to geography,
     domestic production, or diversified supply chains. Included so
     users can compare and see that not everyone is equally affected. */
  {
    countryId: 'United States',
    oilConsumptionBpd: 20_280_000, // EIA USA 2024
    importDependencyPct: 25, // Net exporter since 2020 (shale revolution)
    hormuzExposurePct: 3, // Negligible — domestic + Atlantic/LatAm supply
    strategicReserveDays: 400, // SPR ~372M barrels
    jetFuelReserveDays: null,
    refiningCapacityPct: 110, // World's largest refining capacity
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEA — USA country review 2024',
      'DOE — Strategic Petroleum Reserve status',
    ],
    dataAsOf: '2026-04-06',
  },
  {
    countryId: 'Canada',
    oilConsumptionBpd: 2_350_000, // EIA CAN 2024
    importDependencyPct: 0, // Net exporter (oil sands)
    hormuzExposurePct: 0, // Zero — domestic + US supply
    strategicReserveDays: 90, // IEA 90-day obligation
    jetFuelReserveDays: null,
    refiningCapacityPct: 95, // Multiple refineries
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEA — Canada 2024 review',
    ],
    dataAsOf: '2026-04-06',
  },
  {
    countryId: 'Germany',
    oilConsumptionBpd: 2_055_000, // EIA DEU 2024
    importDependencyPct: 95, // Almost no domestic production
    hormuzExposurePct: 5, // Mostly Russia pipeline (pre-2022), now North Sea/Norway
    strategicReserveDays: 120, // EBV (Erdölbevorratungsverband) strategic stocks
    jetFuelReserveDays: null,
    refiningCapacityPct: 100, // Major refining hub
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEA — Germany 2024 review',
    ],
    dataAsOf: '2026-04-06',
  },
  {
    countryId: 'France',
    oilConsumptionBpd: 1_460_000, // EIA FRA 2024
    importDependencyPct: 98, // Minimal domestic production
    hormuzExposurePct: 8, // Mostly North/West Africa, North Sea
    strategicReserveDays: 90, // SAGESS strategic stocks
    jetFuelReserveDays: null,
    refiningCapacityPct: 70, // 6 active refineries
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEA — France 2024 review',
    ],
    dataAsOf: '2026-04-06',
  },
  {
    countryId: 'Brazil',
    oilConsumptionBpd: 3_100_000, // EIA BRA 2024
    importDependencyPct: 5, // Nearly self-sufficient (pre-salt)
    hormuzExposurePct: 0, // Zero — domestic + Atlantic supply
    strategicReserveDays: 60, // Petrobras operational stocks
    jetFuelReserveDays: null,
    refiningCapacityPct: 85, // Petrobras refineries
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEA — Brazil 2024 review',
    ],
    dataAsOf: '2026-04-06',
  },
  {
    countryId: 'Mexico',
    oilConsumptionBpd: 1_740_000, // EIA MEX 2024
    importDependencyPct: 15, // Major producer (Pemex), imports refined products
    hormuzExposurePct: 0, // Zero — domestic + US supply
    strategicReserveDays: 45, // Limited strategic reserves
    jetFuelReserveDays: null,
    refiningCapacityPct: 55, // Pemex refineries (aging infrastructure)
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEA — Mexico energy profile',
    ],
    dataAsOf: '2026-04-06',
  },
  {
    countryId: 'Norway',
    oilConsumptionBpd: 220_000, // EIA NOR 2024
    importDependencyPct: 0, // Major exporter (North Sea)
    hormuzExposurePct: 0, // Zero — domestic production
    strategicReserveDays: 90, // IEA member obligation
    jetFuelReserveDays: null,
    refiningCapacityPct: 150, // Mongstad + Slagentangen
    sources: [
      'U.S. Energy Information Administration (2024)',
      'IEA — Norway 2024 review',
    ],
    dataAsOf: '2026-04-06',
  },
]

/** O(1) lookup by countryId */
export const FUEL_PROFILE_MAP: Record<string, CountryFuelProfile> = Object.fromEntries(
  FUEL_SECURITY_PROFILES.map((p) => [p.countryId, p])
)
