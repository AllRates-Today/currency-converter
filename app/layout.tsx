import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Currency Converter — Live Mid-Market Exchange Rates | AllRatesToday',
  description:
    'Free live currency converter for 160+ currencies. Works keyless on official ECB reference rates; real-time mid-market rates with an API key from a server route. Built with @allratestoday/sdk.',
  keywords: [
    'currency converter',
    'exchange rate api',
    'live currency rates',
    'real-time exchange rates',
    'mid-market rates',
    'free currency api',
    '@allratestoday/sdk',
  ],
  metadataBase: new URL('https://allratestoday.com'),
  openGraph: {
    title: 'Live Currency Converter — @allratestoday/sdk',
    description: 'Live mid-market exchange rates for 160+ currencies.',
    type: 'website',
    siteName: 'AllRatesToday Currency Converter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live Currency Converter — @allratestoday/sdk',
    description: 'Live mid-market exchange rates for 160+ currencies.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
