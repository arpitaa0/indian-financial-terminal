'use client';

import { useState, useEffect } from 'react';
import { fetchMultipleStocks } from '@/lib/market-data';
import { INDIAN_STOCKS } from '@/lib/indian-market-config';
import { formatIndianCurrency } from '@/lib/indian-market-config';
import type { StockData } from '@/types/market';

interface StockScreenerProps {
  isDarkMode: boolean;
}

interface ScreenerFilter {
  minPrice: number;
  maxPrice: number;
  minChange: number;
  maxChange: number;
  minVolume: number;
  sector: string;
  sortBy: 'price' | 'change' | 'volume';
}

export function StockScreener({ isDarkMode }: StockScreenerProps) {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ScreenerFilter>({
    minPrice: 0,
    maxPrice: 10000,
    minChange: -100,
    maxChange: 100,
    minVolume: 0,
    sector: '',
    sortBy: 'price',
  });

  useEffect(() => {
    const loadStocks = async () => {
      const symbols = INDIAN_STOCKS.map(s => s.symbol);
      const data = await fetchMultipleStocks(symbols);
      setStocks(data);
      setLoading(false);
    };

    loadStocks();
  }, []);

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';

  // Filter stocks
  let filteredStocks = stocks.filter(stock => {
    if (stock.currentPrice < filters.minPrice || stock.currentPrice > filters.maxPrice) return false;
    if (stock.pctChange < filters.minChange || stock.pctChange > filters.maxChange) return false;
    if (stock.volume < filters.minVolume) return false;
    if (filters.sector && stock.sector !== filters.sector) return false;
    return true;
  });

  // Sort stocks
  if (filters.sortBy === 'price') {
    filteredStocks.sort((a, b) => b.currentPrice - a.currentPrice);
  } else if (filters.sortBy === 'change') {
    filteredStocks.sort((a, b) => b.pctChange - a.pctChange);
  } else if (filters.sortBy === 'volume') {
    filteredStocks.sort((a, b) => b.volume - a.volume);
  }

  const sectors = Array.from(new Set(INDIAN_STOCKS.map(s => s.sector)));

  return (
    <div className={`${bgColor} ${textColor} p-6 rounded-lg`}>
      <h2 className="text-2xl font-bold mb-6">🔍 Stock Screener</h2>

      {/* Filters */}
      <div className={`mb-6 p-4 rounded border ${borderColor}`}>
        <h3 className="text-lg font-bold mb-4">Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1">Min Price (₹)</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={e =>
                setFilters({
                  ...filters,
                  minPrice: parseFloat(e.target.value) || 0,
                })
              }
              className={`w-full px-3 py-2 rounded ${inputBg} text-black text-sm`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Max Price (₹)</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={e =>
                setFilters({
                  ...filters,
                  maxPrice: parseFloat(e.target.value) || 10000,
                })
              }
              className={`w-full px-3 py-2 rounded ${inputBg} text-black text-sm`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Min Change %</label>
            <input
              type="number"
              value={filters.minChange}
              onChange={e =>
                setFilters({
                  ...filters,
                  minChange: parseFloat(e.target.value) || -100,
                })
              }
              className={`w-full px-3 py-2 rounded ${inputBg} text-black text-sm`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Max Change %</label>
            <input
              type="number"
              value={filters.maxChange}
              onChange={e =>
                setFilters({
                  ...filters,
                  maxChange: parseFloat(e.target.value) || 100,
                })
              }
              className={`w-full px-3 py-2 rounded ${inputBg} text-black text-sm`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Sector</label>
            <select
              value={filters.sector}
              onChange={e => setFilters({ ...filters, sector: e.target.value })}
              className={`w-full px-3 py-2 rounded ${inputBg} text-black text-sm`}
            >
              <option value="">All Sectors</option>
              {sectors.map(sector => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={e =>
                setFilters({
                  ...filters,
                  sortBy: e.target.value as 'price' | 'change' | 'volume',
                })
              }
              className={`w-full px-3 py-2 rounded ${inputBg} text-black text-sm`}
            >
              <option value="price">Price</option>
              <option value="change">Change %</option>
              <option value="volume">Volume</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            setFilters({
              minPrice: 0,
              maxPrice: 10000,
              minChange: -100,
              maxChange: 100,
              minVolume: 0,
              sector: '',
              sortBy: 'price',
            });
          }}
          className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white font-bold text-sm"
        >
          Reset Filters
        </button>
      </div>

      {/* Results */}
      <div>
        <p className="mb-4 font-semibold">
          Found {filteredStocks.length} stocks matching your criteria
        </p>

        {loading ? (
          <div className="text-center py-8">
            <p>Loading stocks...</p>
          </div>
        ) : filteredStocks.length === 0 ? (
          <div
            className={`text-center py-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded`}
          >
            <p className="text-gray-500">No stocks match your criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}>
                <tr>
                  <th className="px-4 py-2 text-left">Symbol</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Sector</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-right">Change %</th>
                  <th className="px-4 py-2 text-right">Volume</th>
                  <th className="px-4 py-2 text-right">52W High</th>
                  <th className="px-4 py-2 text-right">52W Low</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map(stock => {
                  const isPositive = stock.change >= 0;
                  return (
                    <tr
                      key={stock.id}
                      className={`border-t ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      } cursor-pointer`}
                    >
                      <td className="px-4 py-2 font-bold">{stock.symbol}</td>
                      <td className="px-4 py-2">{stock.name}</td>
                      <td className="px-4 py-2 text-sm">{stock.sector}</td>
                      <td className="px-4 py-2 text-right">
                        {formatIndianCurrency(stock.currentPrice)}
                      </td>
                      <td
                        className={`px-4 py-2 text-right font-bold ${
                          isPositive ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {isPositive ? '▲' : '▼'} {Math.abs(stock.pctChange).toFixed(2)}%
                      </td>
                      <td className="px-4 py-2 text-right">
                        {(stock.volume / 1000000).toFixed(2)}M
                      </td>
                      <td className="px-4 py-2 text-right">
                        {formatIndianCurrency(stock.highPrice)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {formatIndianCurrency(stock.lowPrice)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}