'use client';

import { useEffect, useMemo, useState } from 'react';
import { AllRatesToday } from '@allratestoday/sdk';

// Small curated list of popular currencies. The SDK supports 160+; this list
// keeps the dropdown readable for a demo.
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

  const client = useMemo(() => new AllRatesToday(), []);
  const numericAmount = parseFloat(amount) || 0;
  const converted = rate !== null ? numericAmount * rate : null;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    client
      .convert(from, to, 1)
      .then((result) => {
        if (cancelled) return;
        setRate(result.rate);
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
  }, [client, from, to]);

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
            {CURRENCIES.map((c) => (
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
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="loading">Fetching live rate…</p>}

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
          <p className="result-source">Mid-market rate · via AllRatesToday</p>
        </div>
      )}
    </div>
  );
}
