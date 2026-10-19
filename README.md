# Currency Converter — `currency-converter`

A ready-to-run Next.js 14 currency converter app, built as the reference example for the [`@allratestoday/sdk`](https://www.npmjs.com/package/@allratestoday/sdk) npm package. Clone it, run it, or lift the single converter component into your own React app.

This repo is an **example application**, not a published package — `package.json` is marked `private`, so there is nothing to `npm install` from here. Install the SDK instead.

[![Powered by AllRatesToday](https://img.shields.io/badge/Powered%20by-AllRatesToday-orange.svg)](https://allratestoday.com)
[![npm @allratestoday/sdk](https://img.shields.io/npm/v/@allratestoday/sdk?label=%40allratestoday%2Fsdk&color=cb3837)](https://www.npmjs.com/package/@allratestoday/sdk)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🚀 Features

- ⚛️ **Next.js 14 App Router + TypeScript** — `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- 🔁 **One self-contained client component** — `components/Converter.tsx` holds the whole converter: amount input, two currency pickers, a swap button, loading and error states
- 💱 **Two rate sources** — keyless by default (official ECB reference rates from the open, CORS-enabled `/api/open/central-bank/ecb` table, every pair computed via EUR); with a key, real-time mid-market rates via `@allratestoday/sdk` from a server route (the keyed API sends no CORS headers, see below)
- 🗂️ **30 currencies in the picker** — a curated subset with flag emojis; keyless mode shows the 25 of them on the ECB table, and the SDK itself covers 160+
- 🧾 **`Intl.NumberFormat` output** — 2 decimals normally, 6 decimals for sub-1 rates
- 🖥️ **No backend** — the fetch happens in the browser, so `next build` produces a static site
- 🔑 **Runs without an API key** — the SDK requires a key, so with none set the demo reads the open ECB table directly; setting `NEXT_PUBLIC_ALLRATES_API_KEY` switches to the SDK path, which a browser blocks (no CORS on the keyed API) — move it to a server route for a keyed deployment

## 📦 Installation

```bash
git clone https://github.com/AllRates-Today/currency-converter.git
cd currency-converter
npm install
```

## 🏁 Quick start

```bash
npm run dev
```

Then open `http://localhost:3000`.

Other scripts defined in `package.json`:

| Script | What it does |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Static export (`output: 'export'` in `next.config.js`) |
| `npm run start` | Serve a production build |
| `npm run lint` | `next lint` |

`next.config.js` sets `output: 'export'`, `trailingSlash: true` and unoptimized images, so `npm run build` emits a fully static site you can host anywhere — Cloudflare Pages, Netlify, Vercel, GitHub Pages, S3.

## 📚 The integration, in full

This is the rate-fetching logic from `components/Converter.tsx`, simplified:

```tsx
'use client';
import { AllRatesToday } from '@allratestoday/sdk';

const API_KEY = process.env.NEXT_PUBLIC_ALLRATES_API_KEY;

// Keyless: one request for the whole ECB table, { rate_date, rates: [{ base: 'EUR', quote, value }] }
async function fetchEcbTable() {
  const data = await (await fetch('https://allratestoday.com/api/open/central-bank/ecb')).json();
  const perEur = { EUR: 1 };
  for (const r of data.rates) perEur[r.quote] = r.value;
  return { date: data.rate_date, perEur };
}

const client = useMemo(() => (API_KEY ? new AllRatesToday({ apiKey: API_KEY }) : null), []);
const ecbTable = useMemo(() => (API_KEY ? null : fetchEcbTable()), []);

useEffect(() => {
  const getRate = client
    ? client.convert(from, to, 1).then((r) => r.rate)           // real-time mid-market
    : ecbTable.then((t) => t.perEur[to] / t.perEur[from]);     // ECB, cross via EUR
  getRate.then(setRate).catch((err) => setError(err.message));
}, [client, ecbTable, from, to]);
```

In keyless mode the ECB table is fetched once per page load and every pair is computed from it (USD→GBP = EUR→GBP ÷ EUR→USD); the result line shows the ECB `rate_date` and marks cross rates. The open endpoint is free to use with a visible attribution link, which the result line carries.

The component fetches the rate for **1 unit** and multiplies locally, so typing in the amount box does not trigger a new request — only changing a currency does. Requests are cancel-guarded with a `cancelled` flag in the effect cleanup.

## 🔑 Get your API key

The demo runs keyless on ECB reference rates (~30 currencies, updated each ECB business day). For real-time mid-market rates across 160+ currencies you need a key; `@allratestoday/sdk` 1.4+ rejects calls without one (`API key is required`).

```ts
const client = new AllRatesToday({ apiKey: process.env.ALLRATES_API_KEY });
```

Free key: [allratestoday.com/register](https://allratestoday.com/register) (300 requests total, no card). Send it as `Authorization: Bearer <key>`, which the SDK does for you.

> The keyed `/api/v1` endpoints are meant to be called from a server: they do not send CORS headers, so a browser blocks them, and anything in a client component (including a `NEXT_PUBLIC_` key) ships to the browser anyway. In this static export, setting `NEXT_PUBLIC_ALLRATES_API_KEY` switches the component to the SDK path, but for a working keyed deployment move the `convert()` call into a server route and have the component fetch that route. [`nextjs-currency-starter`](https://github.com/AllRates-Today/nextjs-currency-starter) does exactly that.

## 💡 Reusing this in your own project

**Copy the component.** `components/Converter.tsx` depends only on React and `@allratestoday/sdk` (the keyless path needs only `fetch`) — no state library, no CSS framework, no props. Drop it in and add the class names it uses (`card`, `field`, `row`, `result`, …) or restyle it; the markup carries `aria-label`s for both selects and the swap button.

```bash
npm install @allratestoday/sdk
```

**Or skip React entirely.** The keyless ECB table works from plain browser JavaScript:

```html
<script type="module">
  const { rates } = await (await fetch('https://allratestoday.com/api/open/central-bank/ecb')).json();
  const perEur = Object.fromEntries(rates.map((r) => [r.quote, r.value]));
  const usdToGbp = perEur.GBP / perEur.USD; // cross via EUR
  document.getElementById('rate').textContent = usdToGbp.toFixed(4);
</script>
```

## 🗺️ Currencies covered

The dropdown ships with these 30, each with a flag emoji (see the `CURRENCIES` array in `components/Converter.tsx`). Edit that array to add or remove entries — nothing else is coupled to it. In keyless mode the picker is filtered to the codes on the live ECB table, so `AED`, `SAR`, `VND`, `NGN` and `EGP` appear only with a key.

🇺🇸 `USD` · 🇪🇺 `EUR` · 🇬🇧 `GBP` · 🇯🇵 `JPY` · 🇨🇭 `CHF` · 🇨🇦 `CAD` · 🇦🇺 `AUD` · 🇳🇿 `NZD` · 🇨🇳 `CNY` · 🇮🇳 `INR` · 🇸🇬 `SGD` · 🇭🇰 `HKD` · 🇰🇷 `KRW` · 🇲🇽 `MXN` · 🇧🇷 `BRL` · 🇿🇦 `ZAR` · 🇸🇪 `SEK` · 🇳🇴 `NOK` · 🇩🇰 `DKK` · 🇵🇱 `PLN` · 🇹🇷 `TRY` · 🇦🇪 `AED` · 🇸🇦 `SAR` · 🇹🇭 `THB` · 🇮🇩 `IDR` · 🇲🇾 `MYR` · 🇵🇭 `PHP` · 🇻🇳 `VND` · 🇳🇬 `NGN` · 🇪🇬 `EGP`

## 🛡️ Error handling

A rejected `convert()` call (or a failed ECB fetch, or a pair missing from the ECB table) is caught in the effect and rendered in a `role="alert"` block above the result, with the loading state cleared. The message shown is the error's own `Error.message`, falling back to `Failed to fetch rate` for non-`Error` throws. Nothing is retried automatically — changing a currency re-runs the effect.

## 🔗 Links

- **SDK on npm:** [@allratestoday/sdk](https://www.npmjs.com/package/@allratestoday/sdk)
- **Website:** [allratestoday.com](https://allratestoday.com)
- **API docs:** [allratestoday.com/docs](https://allratestoday.com/docs)
- **Free API key:** [allratestoday.com/register](https://allratestoday.com/register)
- **Status:** [allratestoday.com/status](https://allratestoday.com/status)
- **Support:** [allratestoday.com/contact](https://allratestoday.com/contact)
- **AI agents:** Claude Code plugin `/plugin marketplace add AllRates-Today/claude-code-plugin` · hosted MCP endpoint `https://allratestoday.com/api/mcp` (keyless)
- **New in Oct 2026:** agents can self-issue a trial key — `POST https://allratestoday.com/api/agent/keys` (JSON) → 100 calls / 7 days — and read the keyless [Daily Reference Rate](https://allratestoday.com/reference-rate/) (16:00 London fix) at `https://allratestoday.com/api/open/reference-rate`
- **Dashboard:** [allratestoday.com/profile](https://allratestoday.com/profile)
- **GitHub:** [github.com/AllRates-Today/currency-converter](https://github.com/AllRates-Today/currency-converter)


## 📜 License

MIT — see [LICENSE](LICENSE).
