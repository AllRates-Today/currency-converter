'use client';

import { useEffect, useMemo, useState } from 'react';
import { AllRatesToday } from '@allratestoday/sdk';

// With NEXT_PUBLIC_ALLRATES_API_KEY set, rates come from @allratestoday/sdk
// (real-time mid-market, 160+ currencies). Without it, the demo uses the
// keyless, CORS-open ECB table and computes every pair via EUR.
// Anything NEXT_PUBLIC_ ships to the browser, so treat that key as public.
const API_KEY = process.env.NEXT_PUBLIC_ALLRATES_API_KEY;
const OPEN_ECB_URL = 'https://allratestoday.com/api/open/central-bank/ecb';

type EcbTable = { date: string; perEur: Record<string, number> };

/** Fetch the open ECB table once: units of each currency per 1 EUR (EUR = 1). */
async function fetchEcbTable(): Promise<EcbTable> {
  const res = await fetch(OPEN_ECB_URL);
  if (!res.ok) throw new Error(`ECB endpoint responded ${res.status}`);
  const data: { rate_date?: string; rates?: { base: string; quote: string; value: number }[] } =
    await res.json();
  const perEur: Record<string, number> = { EUR: 1 };
  for (const r of data.rates ?? []) {
    if (r.base === 'EUR' && r.value > 0) perEur[r.quote] = r.value;
  }
  return { date: data.rate_date ?? '', perEur };
}

// Small curated list of popular currencies. The SDK supports 160+; this list
// keeps the dropdown readable for a demo. Keyless mode shows only the codes
// on the ECB table.
const CURRENCIES: Array<{ code: string; name: string; flag: string }> = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰' },
  { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
  { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽' },
  { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
  { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
  { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone', flag: '🇩🇰' },
  { code: 'PLN', name: 'Polish Zloty', flag: '🇵🇱' },
  { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
  { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩' },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
  { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭' },
  { code: 'VND', name: 'Vietnamese Dong', flag: '🇻🇳' },
  { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬' },
  { code: 'EGP', name: 'Egyptian Pound', flag: '🇪🇬' },
];

export default function Converter() {
  const [amount, setAmount] = useState<string>('100');
  const [from, setFrom] = useState<string>('USD');
  const [to, setTo] = useState<string>('EUR');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [ecb, setEcb] = useState<EcbTable | null>(null);

  const client = useMemo(() => (API_KEY ? new AllRatesToday({ apiKey: API_KEY }) : null), []);
  const ecbTable = useMemo(() => (API_KEY ? null : fetchEcbTable()), []);
  const currencies = useMemo(
    () => (ecb ? CURRENCIES.filter((c) => c.code in ecb.perEur) : CURRENCIES),
    [ecb],
  );
  const numericAmount = parseFloat(amount) || 0;
  const converted = rate !== null ? numericAmount * rate : null;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const getRate: Promise<number> = client
      ? client.convert(from, to, 1).then((result) => result.rate)
      : ecbTable!.then((table) => {
          if (!cancelled) setEcb(table);
          const f = table.perEur[from];
          const t = table.perEur[to];
          if (f === undefined || t === undefined) {
            throw new Error(`${from}/${to} is not on the ECB table. Add an API key for 160+ currencies.`);
          }
          return t / f;
        });

    getRate
      .then((value) => {
        if (cancelled) return;
        setRate(value);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch rate');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [client, ecbTable, from, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const formatMoney = (value: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);

  return (
    <div className="card">
      <div className="field">
        <label htmlFor="amount">Amount</label>
        <div className="row">
          <input
            id="amount"
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="any"
          />
        </div>
      </div>

      <div className="field">
        <label>From → To</label>
        <div className="row">
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            aria-label="From currency"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} — {c.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="swap"
            onClick={swap}
            aria-label="Swap currencies"
            title="Swap"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </button>

          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            aria-label="To currency"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="loading">{client ? 'Fetching live rate…' : 'Fetching ECB rate…'}</p>}

      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && converted !== null && rate !== null && (
        <div className="result">
          <p className="result-amount">
            {formatMoney(converted)} {to}
          </p>
          <p className="result-rate">
            1 {from} = {formatMoney(rate)} {to}
          </p>
          <p className="result-source">
            {client ? (
              'Mid-market rate · via AllRatesToday'
            ) : (
              <>
                ECB reference rate{ecb?.date ? ` for ${ecb.date}` : ''}
                {from !== 'EUR' && to !== 'EUR' ? ' (cross via EUR)' : ''} ·{' '}
                <a href="https://allratestoday.com/central-bank-rates-api/ecb/">via AllRatesToday</a>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
