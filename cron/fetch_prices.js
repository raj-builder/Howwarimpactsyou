#!/usr/bin/env node
/**
 * fetch_prices.js
 * ──────────────────────────────────────────────────────────────────────────
 * Daily commodity price fetcher for howwarimpactsyou.com
 *
 * Runs once per day via cron. Pulls closing prices and writes a single
 * cached JSON file that the frontend reads. Never hits the API more than
 * once per day regardless of how many users visit the site.
 *
 * SOURCES:
 *   ① OilPriceAPI  (api key: ok_432c3fffa2fb48fbb6137311c22a983d)
 *      → Brent Crude, Natural Gas
 *      → ~2 calls/day = ~60/month  (free tier: 1,000/month ✓)
 *
 *   ② World Bank Commodity Markets API  (no auth, CORS-safe)
 *      → Copper (LME), Aluminium (LME), Gold, Urea
 *      → ~4 calls/day = ~120/month (completely free, unlimited ✓)
 *
 * TOTAL API CALLS PER DAY: 6
 * TOTAL PER MONTH: ~180  →  well within both free tiers
 *
 * OUTPUT:  ./prices_cache.json   (read by the frontend)
 *          ./prices_log.jsonl    (append-only daily log for history)
 *
 * USAGE:
 *   node fetch_prices.js              # run manually
 *   (see crontab entry in README)
 *
 * REQUIRES:  Node.js 18+  (uses built-in fetch)
 * ──────────────────────────────────────────────────────────────────────────
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── CONFIG ────────────────────────────────────────────────────────────────

const OIL_PRICE_API_KEY = 'ok_432c3fffa2fb48fbb6137311c22a983d';
const OIL_PRICE_API_BASE = 'https://api.oilpriceapi.com/v1';

const CACHE_FILE = path.join(__dirname, 'prices_cache.json');
const LOG_FILE   = path.join(__dirname, 'prices_log.jsonl');

// How many hours must pass before we allow a re-fetch (safety guard)
const MIN_FETCH_INTERVAL_HOURS = 23;

// ── COMMODITY DEFINITIONS ─────────────────────────────────────────────────

/**
 * OilPriceAPI commodities
 * Free tier covers energy: Brent + Natural Gas confirmed working
 * Docs: https://docs.oilpriceapi.com/api-reference/commodities/all-commodities
 */
const OIL_PRICE_API_COMMODITIES = [
  {
    id:    'brent_crude',
    code:  'BRENT_CRUDE_USD',
    label: 'Brent Crude',
    unit:  'USD/bbl',
    exchange: 'ICE London',
    sim_factor: 'energy',   // maps to simulator factor type
  },
  {
    id:    'natural_gas',
    code:  'NATURAL_GAS_USD',
    label: 'Natural Gas',
    unit:  'USD/mmbtu',
    exchange: 'ICE London',
    sim_factor: 'energy',
  },
];

/**
 * World Bank Commodity Markets API commodities
 * Free, no auth, CORS-safe. LME-sourced for metals.
 * Docs: https://api.worldbank.org/v2/en/indicator/{CODE}?format=json
 *
 * NOTE: WB data is monthly (last close of each month), typically
 * 4-8 weeks behind spot. This is the best freely available
 * LME/gold benchmark — acceptable for our scenario estimator.
 */
const WORLD_BANK_COMMODITIES = [
  {
    id:         'copper',
    indicator:  'PCOPP',
    label:      'Copper',
    unit:       'USD/mt',
    exchange:   'LME London',
    sim_factor: 'metals',
  },
  {
    id:         'aluminium',
    indicator:  'PALUM',
    label:      'Aluminium',
    unit:       'USD/mt',
    exchange:   'LME London',
    sim_factor: 'metals',
  },
  {
    id:         'gold',
    indicator:  'PGOLD',
    label:      'Gold',
    unit:       'USD/troy oz',
    exchange:   'LBMA London',
    sim_factor: 'metals',
  },
  {
    id:         'urea',
    indicator:  'PUREA',
    label:      'Urea (Fertilizer)',
    unit:       'USD/mt',
    exchange:   'OTC / WB benchmark',
    sim_factor: 'fertilizers',
  },
];

// ── HELPERS ───────────────────────────────────────────────────────────────

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${msg}`);
}

function readCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    }
  } catch (e) {
    log(`WARN: Could not read cache: ${e.message}`);
  }
  return null;
}

function isTooSoon(cache) {
  if (!cache?.fetched_at) return false;
  const lastFetch = new Date(cache.fetched_at);
  const hoursSince = (Date.now() - lastFetch.getTime()) / 3_600_000;
  return hoursSince < MIN_FETCH_INTERVAL_HOURS;
}

function writeCache(data) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function appendLog(entry) {
  fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n', 'utf8');
}

function pctChange(current, previous) {
  if (!previous || previous === 0) return null;
  return parseFloat(((current - previous) / previous * 100).toFixed(2));
}

// ── FETCHERS ──────────────────────────────────────────────────────────────

/**
 * Fetch one commodity from OilPriceAPI
 * Returns { price, currency, created_at } or throws
 */
async function fetchOilPriceAPI(commodity) {
  const url = `${OIL_PRICE_API_BASE}/prices/latest?by_code=${commodity.code}`;
  log(`  → OilPriceAPI: GET ${commodity.label} (${commodity.code})`);

  const res = await fetch(url, {
    headers: {
      'Authorization': `Token ${OIL_PRICE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
  }

  const json = await res.json();
  // OilPriceAPI response shape: { data: { price, formatted, currency, type, created_at } }
  const d = json?.data;
  if (!d?.price) throw new Error(`Unexpected response shape: ${JSON.stringify(json).slice(0, 200)}`);

  return {
    price:      parseFloat(d.price),
    currency:   d.currency || 'USD',
    created_at: d.created_at || new Date().toISOString(),
    raw:        d,
  };
}

/**
 * Fetch one commodity from World Bank Commodity Markets API
 * Returns last 2 data points so we can compute month-on-month change
 */
async function fetchWorldBank(commodity) {
  const url = `https://api.worldbank.org/v2/en/indicator/${commodity.indicator}?format=json&per_page=3&mrv=3`;
  log(`  → WorldBank: GET ${commodity.label} (${commodity.indicator})`);

  const res = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();
  // WB response: [metadata, dataArray]
  const rows = json?.[1]?.filter(r => r.value !== null);
  if (!rows || rows.length === 0) throw new Error('No data returned');

  const latest = rows[0];
  const prev   = rows[1] || null;

  return {
    price:      parseFloat(latest.value),
    prev_price: prev ? parseFloat(prev.value) : null,
    period:     latest.date,   // e.g. "2025-01"
    currency:   'USD',
    created_at: new Date().toISOString(),
  };
}

// ── MAIN ──────────────────────────────────────────────────────────────────

async function main() {
  log('═══════════════════════════════════════════════════');
  log('howwarimpactsyou.com — Daily Commodity Price Fetch');
  log('═══════════════════════════════════════════════════');

  // ── Guard: don't fetch more than once per 23h ──
  const existingCache = readCache();
  if (isTooSoon(existingCache)) {
    const lastFetch = new Date(existingCache.fetched_at);
    log(`SKIP: Last fetch was ${lastFetch.toISOString()} — less than ${MIN_FETCH_INTERVAL_HOURS}h ago.`);
    log('      Cache is fresh. Exiting without hitting APIs.');
    process.exit(0);
  }

  const results   = {};
  const errors    = {};
  let   anyFailed = false;

  // ── 1. OilPriceAPI: Brent + Natural Gas ───────────────────────────────
  log('\n[1/2] Fetching from OilPriceAPI (energy)…');
  for (const commodity of OIL_PRICE_API_COMMODITIES) {
    try {
      const data = await fetchOilPriceAPI(commodity);
      // Carry forward previous price from cache for pct change
      const prevPrice = existingCache?.commodities?.[commodity.id]?.price ?? null;
      results[commodity.id] = {
        id:          commodity.id,
        label:       commodity.label,
        unit:        commodity.unit,
        exchange:    commodity.exchange,
        sim_factor:  commodity.sim_factor,
        price:       data.price,
        prev_price:  prevPrice,
        pct_change:  pctChange(data.price, prevPrice),
        currency:    data.currency,
        source:      'oilpriceapi',
        source_ts:   data.created_at,
        fetched_at:  new Date().toISOString(),
        status:      'ok',
      };
      log(`     ✓ ${commodity.label}: ${data.price} ${commodity.unit}`);
    } catch (err) {
      anyFailed = true;
      errors[commodity.id] = err.message;
      log(`     ✗ ${commodity.label}: FAILED — ${err.message}`);
      // Keep last known price from cache if available
      if (existingCache?.commodities?.[commodity.id]) {
        results[commodity.id] = {
          ...existingCache.commodities[commodity.id],
          status: 'stale',
          stale_reason: err.message,
        };
        log(`       Using stale cache for ${commodity.label}`);
      }
    }
  }

  // ── 2. World Bank: Copper, Aluminium, Gold, Urea ──────────────────────
  log('\n[2/2] Fetching from World Bank Commodity API (metals + fertilizer)…');
  for (const commodity of WORLD_BANK_COMMODITIES) {
    try {
      const data = await fetchWorldBank(commodity);
      results[commodity.id] = {
        id:          commodity.id,
        label:       commodity.label,
        unit:        commodity.unit,
        exchange:    commodity.exchange,
        sim_factor:  commodity.sim_factor,
        price:       data.price,
        prev_price:  data.prev_price,
        pct_change:  pctChange(data.price, data.prev_price),
        currency:    data.currency,
        period:      data.period,
        source:      'worldbank',
        source_ts:   data.created_at,
        fetched_at:  new Date().toISOString(),
        status:      'ok',
      };
      log(`     ✓ ${commodity.label}: ${data.price} ${commodity.unit}  (period: ${data.period})`);
    } catch (err) {
      anyFailed = true;
      errors[commodity.id] = err.message;
      log(`     ✗ ${commodity.label}: FAILED — ${err.message}`);
      if (existingCache?.commodities?.[commodity.id]) {
        results[commodity.id] = {
          ...existingCache.commodities[commodity.id],
          status: 'stale',
          stale_reason: err.message,
        };
        log(`       Using stale cache for ${commodity.label}`);
      }
    }
  }

  // ── Write cache ────────────────────────────────────────────────────────
  const cache = {
    fetched_at:  new Date().toISOString(),
    fetch_ok:    !anyFailed,
    errors:      Object.keys(errors).length > 0 ? errors : null,
    commodities: results,
    meta: {
      sources: ['oilpriceapi.com', 'api.worldbank.org'],
      note:    'OilPriceAPI: monthly close (energy). WorldBank: monthly benchmark (metals/fertilizer).',
      version: '1.0',
    },
  };

  writeCache(cache);
  log(`\n✓ Cache written → ${CACHE_FILE}`);

  // ── Append to daily log ───────────────────────────────────────────────
  appendLog({
    date:        new Date().toISOString().slice(0, 10),
    fetched_at:  cache.fetched_at,
    fetch_ok:    cache.fetch_ok,
    prices:      Object.fromEntries(
      Object.entries(results).map(([k, v]) => [k, { price: v.price, pct_change: v.pct_change, status: v.status }])
    ),
    errors: cache.errors,
  });
  log(`✓ Log appended  → ${LOG_FILE}`);

  // ── Summary ───────────────────────────────────────────────────────────
  log('\n─── Price Summary ──────────────────────────────────');
  for (const [id, c] of Object.entries(results)) {
    const chg = c.pct_change !== null ? ` (${c.pct_change > 0 ? '+' : ''}${c.pct_change}% mom)` : '';
    const stale = c.status === 'stale' ? '  [STALE]' : '';
    log(`  ${c.label.padEnd(22)} ${String(c.price).padStart(10)} ${c.unit}${chg}${stale}`);
  }

  if (anyFailed) {
    log('\n⚠ Some fetches failed. Stale cache used where available.');
    log('  Check errors above. If OilPriceAPI fails, verify key is active at:');
    log('  https://app.oilpriceapi.com/dashboard');
  } else {
    log('\n✓ All commodities fetched successfully.');
  }

  log('\nAPI usage this run:');
  log(`  OilPriceAPI calls: ${OIL_PRICE_API_COMMODITIES.length}  (≈${OIL_PRICE_API_COMMODITIES.length * 30}/month at daily cron)`);
  log(`  WorldBank calls:   ${WORLD_BANK_COMMODITIES.length}  (free, unlimited)`);
  log(`  Total OilPriceAPI budget used: ~${OIL_PRICE_API_COMMODITIES.length * 30}/1000 per month`);
  log('═══════════════════════════════════════════════════\n');

  process.exit(anyFailed ? 1 : 0);
}

main().catch(err => {
  log(`FATAL: ${err.message}`);
  console.error(err);
  process.exit(1);
});
