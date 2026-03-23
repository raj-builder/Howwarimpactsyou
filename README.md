# howwarimpactsyou.com

**Macro-to-Consumer Price Impact Simulator**

Translates upstream commodity and currency shocks (oil, war, grain prices, FX) into estimated downstream consumer price impacts — transparently, with every assumption visible.

## What's in here

```
howwarimpactsyou.html   ← the entire frontend (single file, no build step)
cron/
  fetch_prices.js        ← daily commodity price fetcher (Node 18+)
  test_api_key.js        ← smoke test for API key
  package.json
  README.md              ← cron setup instructions
vercel.json              ← Vercel static deploy config
.gitignore
```

## Running locally

Just open `howwarimpactsyou.html` in your browser. No server needed.

## Deploying

Connect this repo to [Vercel](https://vercel.com) — it will auto-detect the static file and deploy in ~10 seconds.

## Daily price fetch

See `cron/README.md` for full setup instructions.

**Sources:** OilPriceAPI (Brent, Natural Gas) · World Bank Commodity API (Copper, Aluminium, Gold, Urea via LME/LBMA benchmarks)

---

*V1 prototype — scenario estimator only. Not a price forecast or financial advice.*
