# howwarimpactsyou.com — Daily Commodity Price Cron

## What this does

Fetches closing prices for 6 commodities once per day and writes a
`prices_cache.json` file that the frontend HTML reads. This keeps API usage
well inside free tiers while all users share a single daily snapshot.

---

## Commodities fetched

| Commodity     | Source          | Exchange        | Unit       | Why              |
|---------------|-----------------|-----------------|------------|------------------|
| Brent Crude   | OilPriceAPI     | ICE London      | USD/bbl    | Core energy input |
| Natural Gas   | OilPriceAPI     | ICE London      | USD/mmbtu  | Core energy input |
| Copper        | World Bank API  | LME London      | USD/mt     | Industrial metals |
| Aluminium     | World Bank API  | LME London      | USD/mt     | Packaging/metals  |
| Gold          | World Bank API  | LBMA London     | USD/troy oz| FX hedge signal   |
| Urea          | World Bank API  | OTC / WB bench  | USD/mt     | Fertilizer input  |

---

## API usage budget

| API            | Key                                  | Calls/day | Calls/month | Free limit      |
|----------------|--------------------------------------|-----------|-------------|-----------------|
| OilPriceAPI    | `ok_432c3fffa2fb48fbb6137311c22a983d`| 2         | ~60         | 1,000/month ✓  |
| World Bank     | None (no auth)                       | 4         | ~120        | Unlimited ✓    |

**Total OilPriceAPI consumption: ~60/1,000 per month (6% of free tier)**

---

## Files

```
cron/
  fetch_prices.js      ← main daily script
  test_api_key.js      ← smoke-test: run this first to verify key + coverage
  package.json
  README.md            ← this file
  prices_cache.json    ← written by fetch_prices.js, read by frontend (gitignore data)
  prices_log.jsonl     ← append-only daily log (gitignore or commit for history)
```

---

## Setup

### 1. Verify Node version

```bash
node --version   # must be 18+
```

### 2. Test the API key first

```bash
node test_api_key.js
```

You should see:
```
✓  Brent Crude           → 79.4 USD
✓  Natural Gas           → 2.98 USD
✓  Copper (LME)          → 9312.0 USD  (period: 2025-01)
✓  Aluminium (LME)       → 2248.0 USD  (period: 2025-01)
✓  Gold (LBMA)           → 2650.0 USD  (period: 2025-01)
✓  Urea (OTC)            → 310.5 USD   (period: 2025-01)
```

If OilPriceAPI lines show HTTP 401, the key is invalid or expired.
Check: https://app.oilpriceapi.com/dashboard

### 3. Run manually to create first cache

```bash
node fetch_prices.js
```

This creates `prices_cache.json`.

### 4. Add to crontab

Open crontab:
```bash
crontab -e
```

Add this line (runs every day at 07:00 London time = 06:00 UTC in summer, 07:00 UTC in winter):

```cron
# howwarimpactsyou.com — daily commodity prices (London market open ~8am)
0 7 * * * cd /path/to/your/project/cron && /usr/bin/node fetch_prices.js >> /var/log/howwar_prices.log 2>&1
```

**Replace `/path/to/your/project/cron`** with the actual path on your server.

To find the node path:
```bash
which node
```

#### Alternative: if deploying on Vercel / Netlify

Use their cron/scheduled functions instead of a system crontab:

**Vercel** (`vercel.json`):
```json
{
  "crons": [
    {
      "path": "/api/fetch-prices",
      "schedule": "0 7 * * *"
    }
  ]
}
```

**Netlify** (`netlify.toml`):
```toml
[[plugins]]
  package = "@netlify/plugin-functions-scheduled"

[functions."fetch-prices"]
  schedule = "0 7 * * *"
```

---

## Output format: prices_cache.json

```json
{
  "fetched_at": "2025-03-23T07:00:04.123Z",
  "fetch_ok": true,
  "errors": null,
  "commodities": {
    "brent_crude": {
      "id": "brent_crude",
      "label": "Brent Crude",
      "unit": "USD/bbl",
      "exchange": "ICE London",
      "sim_factor": "energy",
      "price": 79.4,
      "prev_price": 76.1,
      "pct_change": 4.34,
      "currency": "USD",
      "source": "oilpriceapi",
      "source_ts": "2025-03-22T17:00:00Z",
      "fetched_at": "2025-03-23T07:00:04Z",
      "status": "ok"
    },
    "natural_gas": { "..." },
    "copper":      { "...", "period": "2025-01", "source": "worldbank" },
    "aluminium":   { "..." },
    "gold":        { "..." },
    "urea":        { "..." }
  },
  "meta": {
    "sources": ["oilpriceapi.com", "api.worldbank.org"],
    "note": "OilPriceAPI: daily close (energy). WorldBank: monthly benchmark (metals/fertilizer).",
    "version": "1.0"
  }
}
```

**`status` field values:**
- `"ok"` — fresh fetch succeeded
- `"stale"` — fetch failed, using last known price from previous cache

---

## Stale data handling

If the fetch fails for any commodity, the script:
1. Logs the error
2. Carries forward the last known price from the existing cache with `"status": "stale"`
3. Exits with code `1` (so you can alert on failures)
4. Never writes an empty/broken cache

The frontend should display a "⚠ Prices as of [date]" notice when `status === "stale"`.

---

## Adding more commodities later

**To add more OilPriceAPI commodities** (energy only):
- Add an entry to `OIL_PRICE_API_COMMODITIES` in `fetch_prices.js`
- Each one costs 1 call/day (~30/month)
- Check remaining budget: current 60/1000 → 940 headroom

**To add more World Bank commodities** (metals, food, fertilizer):
- Add an entry to `WORLD_BANK_COMMODITIES`
- Zero cost, unlimited
- Available indicators: `PWHEAMT` (wheat), `PMAIZE` (corn), `PSOYB` (soybeans), `PPHOSPH` (DAP fertilizer)

---

## Monitoring

Check if the cron ran today:
```bash
tail -5 prices_log.jsonl | python3 -m json.tool
```

Check current cached prices:
```bash
cat prices_cache.json | python3 -m json.tool
```

Check cron system log (Linux):
```bash
grep howwar /var/log/cron.log
# or
journalctl -u cron --since today
```

---

## Known limitations

- **OilPriceAPI**: Brent and Natural Gas are daily/live prices. Metals are NOT available on the free tier — confirmed by testing (see `test_api_key.js`).
- **World Bank**: Monthly benchmark prices only. Copper/Aluminium/Gold will lag spot by 4-8 weeks. Acceptable for a scenario estimator; not for a trading app.
- **Urea**: No exchange-traded API exists. World Bank OTC benchmark is the industry standard for free data.
- **Gold on WB**: Uses `PGOLD` (USD/troy oz, LBMA London fix). Available but is a monthly average, not a daily close.
