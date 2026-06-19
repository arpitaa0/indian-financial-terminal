'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import type { StockData } from '@/types/market';
import { formatIndianCurrency } from '@/lib/indian-market-config';
import { X } from 'lucide-react';

interface StockComparisonProps {
  stocks: StockData[];
  isDarkMode: boolean;
  onClose: () => void;
}

export function StockComparison({
  stocks,
  isDarkMode,
  onClose,
}: StockComparisonProps) {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const gridColor = isDarkMode ? '#333' : '#e0e0e0';

  const comparisonData = stocks.map((stock) => ({
    symbol: stock.symbol,
    price: Number(stock.currentPrice),
    change: Number(stock.pctChange),
    volume: Number(stock.volume) / 1000000,
  }));

  const metrics = [
    {
      name: 'Price',
      getValue: (s: StockData) =>
        formatIndianCurrency(Number(s.currentPrice)),
    },
    {
      name: 'Change %',
      getValue: (s: StockData) =>
        `${Number(s.pctChange).toFixed(2)}%`,
      isPositive: (s: StockData) =>
        Number(s.change) >= 0,
    },
    {
      name: 'Open Price',
      getValue: (s: StockData) =>
        formatIndianCurrency(Number(s.openPrice)),
    },
    {
      name: 'High',
      getValue: (s: StockData) =>
        formatIndianCurrency(Number(s.highPrice)),
    },
    {
      name: 'Low',
      getValue: (s: StockData) =>
        formatIndianCurrency(Number(s.lowPrice)),
    },
    {
      name: 'Volume (M)',
      getValue: (s: StockData) =>
        (Number(s.volume) / 1000000).toFixed(2),
    },
  ];

  return (
    <div className={`${bgColor} ${textColor} min-h-screen p-6`}>
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            📊 Stock Comparison:{' '}
            {stocks.map((s) => s.symbol).join(' vs ')}
          </h1>

          <button
            onClick={onClose}
            className="p-2 bg-red-600 rounded hover:bg-red-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Price Chart */}
        <div
          className={`mb-8 p-6 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}
        >
          <h2 className="text-xl font-bold mb-4">
            💰 Price Comparison
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
              />

              <XAxis
                dataKey="symbol"
                stroke={textColor}
              />

              <YAxis stroke={textColor} />

              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode
                    ? '#1f2937'
                    : '#fff',
                  border: `1px solid ${
                    isDarkMode ? '#666' : '#ddd'
                  }`,
                }}
                formatter={(value) =>
                  formatIndianCurrency(Number(value))
                }
              />

              <Bar
                dataKey="price"
                fill="#3b82f6"
                name="Current Price"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Chart */}
        <div
          className={`mb-8 p-6 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}
        >
          <h2 className="text-xl font-bold mb-4">
            📈 Performance (% Change)
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
              />

              <XAxis
                dataKey="symbol"
                stroke={textColor}
              />

              <YAxis stroke={textColor} />

              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode
                    ? '#1f2937'
                    : '#fff',
                  border: `1px solid ${
                    isDarkMode ? '#666' : '#ddd'
                  }`,
                }}
                formatter={(value) =>
                  `${Number(value).toFixed(2)}%`
                }
              />

              <Bar
                dataKey="change"
                fill="#10b981"
                name="% Change"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Volume Chart */}
        <div
          className={`mb-8 p-6 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}
        >
          <h2 className="text-xl font-bold mb-4">
            📊 Volume Comparison (Millions)
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
              />

              <XAxis
                dataKey="symbol"
                stroke={textColor}
              />

              <YAxis stroke={textColor} />

              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode
                    ? '#1f2937'
                    : '#fff',
                  border: `1px solid ${
                    isDarkMode ? '#666' : '#ddd'
                  }`,
                }}
                formatter={(value) =>
                  `${Number(value).toFixed(2)}M`
                }
              />

              <Bar
                dataKey="volume"
                fill="#f59e0b"
                name="Volume"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Metrics Table */}
        <div
          className={`rounded-lg overflow-hidden ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
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
                <th className="px-4 py-2 text-left">
                  Metric
                </th>

                {stocks.map((stock) => (
                  <th
                    key={stock.id}
                    className="px-4 py-2 text-right"
                  >
                    {stock.symbol}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {metrics.map((metric, idx) => (
                <tr
                  key={metric.name}
                  className={`border-t ${
                    idx % 2 === 0
                      ? isDarkMode
                        ? 'bg-gray-700'
                        : 'bg-gray-100'
                      : ''
                  }`}
                >
                  <td className="px-4 py-3 font-semibold">
                    {metric.name}
                  </td>

                  {stocks.map((stock) => {
                    const value =
                      metric.getValue(stock);

                    const color =
                      metric.isPositive &&
                      metric.isPositive(stock)
                        ? 'text-green-500'
                        : metric.isPositive
                        ? 'text-red-500'
                        : '';

                    return (
                      <td
                        key={stock.id}
                        className={`px-4 py-3 text-right font-semibold ${color}`}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}