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
- 💱 **Live rates via `@allratestoday/sdk`** — mid-market rates with no retail spread
- 🗂️ **30 currencies in the picker** — a curated subset with flag emojis; the SDK itself covers far more
- 🧾 **`Intl.NumberFormat` output** — 2 decimals normally, 6 decimals for sub-1 rates
- 🖥️ **No backend** — the fetch happens in the browser, so `next build` produces a static site
- 🔑 **Runs without an API key** — the demo calls `new AllRatesToday()` with no arguments; add a key when you want higher limits

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

This is the entire rate-fetching logic from `components/Converter.tsx`:

```tsx
'use client';
import { useEffect, useMemo, useState } from 'react';
import { AllRatesToday } from '@allratestoday/sdk';

const client = useMemo(() => new AllRatesToday(), []);

useEffect(() => {
  client
    .convert(from, to, 1)
    .then((result) => setRate(result.rate))
    .catch((err) => setError(err.message));
}, [client, from, to]);
```

The component fetches the rate for **1 unit** and multiplies locally, so typing in the amount box does not trigger a new request — only changing a currency does. Requests are cancel-guarded with a `cancelled` flag in the effect cleanup.

## 🔑 Get your API key

The demo runs keyless. To raise your limits, pass a key when constructing the client:

```ts
const client = new AllRatesToday({ apiKey: process.env.NEXT_PUBLIC_ALLRATES_API_KEY });
```

Free key: [allratestoday.com/register](https://allratestoday.com/register)

> Anything in a client component ships to the browser. If you need to keep a key private, move the call into a server route and have the component fetch that route instead.

## 💡 Reusing this in your own project

**Copy the component.** `components/Converter.tsx` depends only on React and `@allratestoday/sdk` — no state library, no CSS framework, no props. Drop it in and add the class names it uses (`card`, `field`, `row`, `result`, …) or restyle it; the markup carries `aria-label`s for both selects and the swap button.

```bash
npm install @allratestoday/sdk
```

**Or skip React entirely.** The SDK works as a plain ES module in the browser:

```html
<script type="module">
  import { AllRatesToday } from 'https://esm.sh/@allratestoday/sdk';
  const client = new AllRatesToday();
  const { rate } = await client.convert('USD', 'EUR', 1);
  document.getElementById('rate').textContent = rate.toFixed(4);
</script>
```

## 🗺️ Currencies covered

The dropdown ships with these 30, each with a flag emoji (see the `CURRENCIES` array in `components/Converter.tsx`). Edit that array to add or remove entries — nothing else is coupled to it.

🇺🇸 `USD` · 🇪🇺 `EUR` · 🇬🇧 `GBP` · 🇯🇵 `JPY` · 🇨🇭 `CHF` · 🇨🇦 `CAD` · 🇦🇺 `AUD` · 🇳🇿 `NZD` · 🇨🇳 `CNY` · 🇮🇳 `INR` · 🇸🇬 `SGD` · 🇭🇰 `HKD` · 🇰🇷 `KRW` · 🇲🇽 `MXN` · 🇧🇷 `BRL` · 🇿🇦 `ZAR` · 🇸🇪 `SEK` · 🇳🇴 `NOK` · 🇩🇰 `DKK` · 🇵🇱 `PLN` · 🇹🇷 `TRY` · 🇦🇪 `AED` · 🇸🇦 `SAR` · 🇹🇭 `THB` · 🇮🇩 `IDR` · 🇲🇾 `MYR` · 🇵🇭 `PHP` · 🇻🇳 `VND` · 🇳🇬 `NGN` · 🇪🇬 `EGP`

## 🛡️ Error handling

A rejected `convert()` call is caught in the effect and rendered in a `role="alert"` block above the result, with the loading state cleared. The message shown is the SDK's own `Error.message`, falling back to `Failed to fetch rate` for non-`Error` throws. Nothing is retried automatically — changing a currency re-runs the effect.

## 🔗 Links

- **SDK on npm:** [@allratestoday/sdk](https://www.npmjs.com/package/@allratestoday/sdk)
- **Website:** [allratestoday.com](https://allratestoday.com)
- **API docs:** [allratestoday.com/docs](https://allratestoday.com/docs)
- **Free API key:** [allratestoday.com/register](https://allratestoday.com/register)
- **Status:** [allratestoday.com/status](https://allratestoday.com/status)
- **Support:** [allratestoday.com/contact](https://allratestoday.com/contact)

## 📜 License

MIT — see [LICENSE](LICENSE).
