'use client';

import { useEffect, useState } from 'react';

import type { MarketData, StockData } from '@/types/market';

import { IndexCard } from './index-card';
import { Watchlist } from './watchlist';
import { StockDetail } from './stock-detail';
import { StockRow } from './stock-row';
import { ComparisonTool } from './comparison-tool';
import { TechnicalIndicators } from './technical-indicators';
import { NewsFeed } from './news-feed';

import {
  WatchlistProvider,
  useWatchlist,
} from '@/lib/watchlist-context';

function MarketDashboardContent() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);

  useWatchlist();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/market');
        const data = await response.json();
        setMarketData(data);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  const bgColor =
    isDarkMode
      ? 'bg-gray-900 text-white'
      : 'bg-white text-black';

  if (loading) {
    return (
      <div className={`${bgColor} h-screen flex items-center justify-center`}>
        <p className="text-2xl">Loading Market Data...</p>
      </div>
    );
  }

  if (!marketData) {
    return (
      <div className={`${bgColor} h-screen flex items-center justify-center`}>
        <p className="text-2xl text-red-500">
          Error loading market data
        </p>
      </div>
    );
  }

  if (selectedStock) {
    return (
      <div className={`${bgColor} min-h-screen p-4`}>
        <StockDetail
          stock={selectedStock}
          isDarkMode={isDarkMode}
          onClose={() => setSelectedStock(null)}
        />

        <div className="mt-8">
          <TechnicalIndicators
            stock={selectedStock}
            isDarkMode={isDarkMode}
          />
        </div>

        <div className="mt-8">
          <NewsFeed
            isDarkMode={isDarkMode}
            relatedStocks={[selectedStock.symbol]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`${bgColor} min-h-screen p-4`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">
          🇮🇳 Indian Financial Terminal
        </h1>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      {/* Market Status */}
      <div
        className={`mb-6 p-4 rounded ${
          isDarkMode
            ? 'bg-gray-800'
            : 'bg-gray-100'
        }`}
      >
        <p className="text-lg font-semibold">
          📊 NSE Trading Hours: 9:15 AM - 3:30 PM IST (Asia/Kolkata)
        </p>
      </div>

      {/* Watchlist */}
      <section className="mb-8">
        <Watchlist
          isDarkMode={isDarkMode}
          onStockClick={setSelectedStock}
        />
      </section>

      {/* Indices */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          📈 Market Indices
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketData.indices.map((index) => (
            <IndexCard
              key={index.id}
              index={index}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </section>

      {/* Top Gainers */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-green-500">
          🚀 Top Gainers
        </h2>

        <div
          className={`rounded overflow-x-auto ${
            isDarkMode
              ? 'bg-gray-800'
              : 'bg-gray-50'
          }`}
        >
          <table className="w-full">
            <thead
              className={
                isDarkMode
                  ? 'bg-gray-700'
                  : 'bg-gray-200'
              }
            >
              <tr>
                <th className="px-4 py-2 text-left">Symbol</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-right">Open</th>
                <th className="px-4 py-2 text-right">High</th>
                <th className="px-4 py-2 text-right">Low</th>
                <th className="px-4 py-2 text-right">Change</th>
                <th className="px-4 py-2 text-right">Volume</th>
              </tr>
            </thead>

            <tbody>
              {marketData.topGainers.map((stock) => (
                <StockRow
                  key={stock.id}
                  stock={stock}
                  isDarkMode={isDarkMode}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top Losers */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-red-500">
          📉 Top Losers
        </h2>

        <div
          className={`rounded overflow-x-auto ${
            isDarkMode
              ? 'bg-gray-800'
              : 'bg-gray-50'
          }`}
        >
          <table className="w-full">
            <thead
              className={
                isDarkMode
                  ? 'bg-gray-700'
                  : 'bg-gray-200'
              }
            >
              <tr>
                <th className="px-4 py-2 text-left">Symbol</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-right">Open</th>
                <th className="px-4 py-2 text-right">High</th>
                <th className="px-4 py-2 text-right">Low</th>
                <th className="px-4 py-2 text-right">Change</th>
                <th className="px-4 py-2 text-right">Volume</th>
              </tr>
            </thead>

            <tbody>
              {marketData.topLosers.map((stock) => (
                <StockRow
                  key={stock.id}
                  stock={stock}
                  isDarkMode={isDarkMode}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Most Active */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-500">
          🔥 Most Active
        </h2>

        <div
          className={`rounded overflow-x-auto ${
            isDarkMode
              ? 'bg-gray-800'
              : 'bg-gray-50'
          }`}
        >
          <table className="w-full">
            <thead
              className={
                isDarkMode
                  ? 'bg-gray-700'
                  : 'bg-gray-200'
              }
            >
              <tr>
                <th className="px-4 py-2 text-left">Symbol</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-right">Open</th>
                <th className="px-4 py-2 text-right">High</th>
                <th className="px-4 py-2 text-right">Low</th>
                <th className="px-4 py-2 text-right">Change</th>
                <th className="px-4 py-2 text-right">Volume</th>
              </tr>
            </thead>

            <tbody>
              {marketData.mostActive.map((stock) => (
                <StockRow
                  key={stock.id}
                  stock={stock}
                  isDarkMode={isDarkMode}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Comparison Tool */}
      <section className="mb-8">
        <ComparisonTool isDarkMode={isDarkMode} />
      </section>

      {/* News Feed */}
      <section className="mb-8">
        <NewsFeed isDarkMode={isDarkMode} />
      </section>
    </div>
  );
}

export function MarketDashboard() {
  return (
    <WatchlistProvider>
      <MarketDashboardContent />
    </WatchlistProvider>
  );
}