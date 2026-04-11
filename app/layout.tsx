import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Currency Converter — Powered by @allratestoday/sdk',
  description:
    'Live mid-market currency conversion for 160+ currencies. Built with @allratestoday/sdk — the zero-dependency exchange rates SDK for Node.js and the browser.',
  metadataBase: new URL('https://sdk-demo.allratestoday.com'),
  openGraph: {
    title: 'Currency Converter — @allratestoday/sdk demo',
    description: 'Live mid-market exchange rates for 160+ currencies.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Currency Converter — @allratestoday/sdk demo',
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
