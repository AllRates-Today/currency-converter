# @allratestoday/sdk — Live Demo

A minimal Next.js currency converter that showcases [`@allratestoday/sdk`](https://www.npmjs.com/package/@allratestoday/sdk), the real-time exchange rates SDK for 160+ currencies.

**Live demo:** https://sdk-demo.allratestoday.com (once deployed)

## What this shows

- Browser usage of `@allratestoday/sdk` — zero dependencies, zero bundler config
- Live mid-market rates sourced from Reuters/Refinitiv
- 30 of the 160+ supported currencies in a clean picker
- Instant re-fetch on currency swap, debounced numeric input

The full SDK source is at [allratestoday/exchange-rates-api](https://github.com/allratestoday/exchange-rates-api).

## Code

```ts
import { AllRatesToday } from '@allratestoday/sdk';

const client = new AllRatesToday();
const result = await client.convert('USD', 'EUR', 100);
console.log(result.to.amount); // → 92.14
```

That's it. No API key required for light usage. For higher limits, sign up at [allratestoday.com](https://allratestoday.com) and pass `new AllRatesToday({ apiKey: '...' })`.

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`.

## Build static site

```bash
npm run build
```

Outputs to `./out/` as static HTML/JS/CSS, ready to deploy to any static host (Cloudflare Pages, Netlify, Vercel, S3, GitHub Pages, etc.).

## Deploy to Cloudflare Pages

This repo includes a GitHub Actions workflow that auto-deploys to Cloudflare Pages on every push to `main`. See [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

To enable:

1. In Cloudflare dashboard: **Workers & Pages → Create → Pages → Direct Upload** (or connect to this GitHub repo)
2. Set project name: `sdk-demo`
3. Add these secrets to the GitHub repo (**Settings → Secrets and variables → Actions**):
   - `CLOUDFLARE_API_TOKEN` — [create one here](https://dash.cloudflare.com/profile/api-tokens) with the *Pages: Edit* template
   - `CLOUDFLARE_ACCOUNT_ID` — from the right sidebar of any Cloudflare page

On the next `git push`, the workflow builds `npm run build` and uploads `./out/` to Cloudflare Pages.

## License

MIT
