#!/usr/bin/env node
/**
 * test_api_key.js
 * Quick smoke-test: verifies OilPriceAPI key is active and
 * confirms which commodities are reachable.
 *
 * Usage:  node test_api_key.js
 */

import { exit } from 'process';

const OIL_PRICE_API_KEY = 'ok_432c3fffa2fb48fbb6137311c22a983d';

const ENERGY_CODES = [
  { code: 'BRENT_CRUDE_USD',  label: 'Brent Crude' },
  { code: 'NATURAL_GAS_USD',  label: 'Natural Gas' },
  { code: 'WTI_USD',          label: 'WTI Crude (bonus)' },
];

// Test if OilPriceAPI has metals — it usually doesn't on free tier
// but we check anyway so the README can be updated if it ever does
const METALS_CODES = [
  { code: 'GOLD_USD',       label: 'Gold' },
  { code: 'COPPER_USD',     label: 'Copper' },
  { code: 'ALUMINIUM_USD',  label: 'Aluminium' },
  { code: 'ALUMINUM_USD',   label: 'Aluminum (alt spelling)' },
];

async function testCode(code, label) {
  const url = `https://api.oilpriceapi.com/v1/prices/latest?by_code=${code}`;
  try {
    const res = await fetch(url, {
      headers: { 'Authorization': `Token ${OIL_PRICE_API_KEY}` },
      signal: AbortSignal.timeout(8000),
    });
    const body = await res.json().catch(() => null);
    if (res.ok && body?.data?.price) {
      return { ok: true, price: body.data.price, currency: body.data.currency };
    }
    return { ok: false, status: res.status, error: body?.error || body?.message || 'unknown error' };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function main() {
  console.log('\n══════════════════════════════════════════════');
  console.log(' OilPriceAPI Key Test');
  console.log(` Key: ${OIL_PRICE_API_KEY.slice(0, 8)}…`);
  console.log('══════════════════════════════════════════════\n');

  console.log('── Energy commodities (expected: ✓) ──────────');
  for (const { code, label } of ENERGY_CODES) {
    const r = await testCode(code, label);
    if (r.ok) {
      console.log(`  ✓  ${label.padEnd(22)} → ${r.price} ${r.currency}`);
    } else {
      console.log(`  ✗  ${label.padEnd(22)} → HTTP ${r.status || '?'}: ${r.error}`);
    }
  }

  console.log('\n── Metals (testing coverage — may not be in plan) ──');
  for (const { code, label } of METALS_CODES) {
    const r = await testCode(code, label);
    if (r.ok) {
      console.log(`  ✓  ${label.padEnd(22)} → ${r.price} ${r.currency}  ← BONUS: available!`);
    } else {
      console.log(`  ✗  ${label.padEnd(22)} → ${r.error} (use WorldBank instead)`);
    }
  }

  console.log('\n── WorldBank fallback check (Copper, Aluminium, Gold, Urea) ──');
  const WB_CHECKS = [
    { indicator: 'PCOPP',  label: 'Copper (LME)' },
    { indicator: 'PALUM',  label: 'Aluminium (LME)' },
    { indicator: 'PGOLD',  label: 'Gold (LBMA)' },
    { indicator: 'PUREA',  label: 'Urea (OTC)' },
  ];
  for (const { indicator, label } of WB_CHECKS) {
    try {
      const url = `https://api.worldbank.org/v2/en/indicator/${indicator}?format=json&per_page=2&mrv=2`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      const json = await res.json();
      const rows = json?.[1]?.filter(r => r.value !== null);
      if (rows?.length > 0) {
        console.log(`  ✓  ${label.padEnd(22)} → ${rows[0].value} USD  (period: ${rows[0].date})`);
      } else {
        console.log(`  ✗  ${label.padEnd(22)} → No data`);
      }
    } catch (e) {
      console.log(`  ✗  ${label.padEnd(22)} → ${e.message}`);
    }
  }

  console.log('\n══════════════════════════════════════════════\n');
}

main().catch(e => { console.error(e); exit(1); });
