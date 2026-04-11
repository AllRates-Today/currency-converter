# Currency Converter — `@allratestoday/sdk` Reference Example

A complete, copy-paste-ready Next.js currency converter built with [`@allratestoday/sdk`](https://www.npmjs.com/package/@allratestoday/sdk). Use this as a starting point for adding live exchange rates to your own website or app.

## What's inside

- **Next.js 14 App Router** with TypeScript
- **`@allratestoday/sdk`** for real-time mid-market rates (Reuters/Refinitiv data, 160+ currencies)
- **Client component** (`components/Converter.tsx`) showing the idiomatic `useEffect` + `new AllRatesToday()` pattern
- **30 popular currencies** in a clean picker with flag emojis (the SDK itself supports 160+)
- **Zero backend code** — runs entirely in the browser, so you can drop it into any static host
- **No API key required** for light usage; swap to `new AllRatesToday({ apiKey: '...' })` when you need higher limits

## Quickstart

```bash
git clone https://github.com/allratestoday/currency-converter.git
cd currency-converter
npm install
npm run dev
```

Opens at `http://localhost:3000`.

## The SDK in 4 lines

```ts
import { AllRatesToday } from '@allratestoday/sdk';

const client = new AllRatesToday();
const result = await client.convert('USD', 'EUR', 100);
console.log(result.result); // → 92.14
```

That's the whole integration. See `components/Converter.tsx` for how it's wired into React state.

## How to adapt this for your project

### 1. Just copy the Converter component

`components/Converter.tsx` is self-contained — drop it into any React/Next.js app. Only dependencies are `@allratestoday/sdk` and React.

```bash
npm install @allratestoday/sdk
```

Then import `Converter` wherever you want to show it.

### 2. Use the SDK directly (no React)

Plain HTML + ES modules:

```html
<script type="module">
  import { AllRatesToday } from 'https://esm.sh/@allratestoday/sdk';
  const client = new AllRatesToday();
  const { result } = await client.convert('USD', 'EUR', 100);
  document.getElementById('amount').textContent = result.toFixed(2);
</script>
```

### 3. Use it server-side (Next.js API route, Express, etc.)

```ts
// app/api/rate/route.ts
import { AllRatesToday } from '@allratestoday/sdk';

const client = new AllRatesToday({ apiKey: process.env.ALLRATES_API_KEY });

export async function GET() {
  const data = await client.latest({ base: 'USD', symbols: ['EUR', 'GBP', 'JPY'] });
  return Response.json(data);
}
```

## SDK methods used here

| Method | Purpose |
|---|---|
| `client.convert(from, to, amount)` | Convert a specific amount between two currencies |
| `client.latest({ base, symbols })` | Batch fetch the latest rates for a base currency (not shown in this demo, but useful for dashboards) |
| `client.forDate({ base, symbols, date })` | Historical rates for a specific date |

Full API reference: https://www.npmjs.com/package/@allratestoday/sdk

## Production build

```bash
npm run build
```

Outputs a fully static site to `./out/` — deployable to any static host (Cloudflare Pages, Netlify, Vercel, GitHub Pages, S3, etc.).

## Links

- **SDK on npm:** https://www.npmjs.com/package/@allratestoday/sdk
- **SDK source:** https://github.com/allratestoday/exchange-rates-api
- **API docs:** https://allratestoday.com/docs
- **Get a free API key:** https://allratestoday.com/register

## License

MIT — use, fork, remix, ship.
