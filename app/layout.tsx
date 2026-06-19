import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { PortfolioProvider } from '@/lib/portfolio-context';
import { AlertsProvider } from '@/lib/alerts-context';
import { JournalProvider } from '@/lib/journal-context';
import { WatchlistProvider } from '@/lib/watchlist-context';
import './globals.css';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Indian Financial Terminal',
  description: 'Complete Indian stock market trading terminal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable}`}>
        <PortfolioProvider>
          <AlertsProvider>
            <JournalProvider>
              <WatchlistProvider>
                {children}
              </WatchlistProvider>
            </JournalProvider>
          </AlertsProvider>
        </PortfolioProvider>
      </body>
    </html>
  );
}