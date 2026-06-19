'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { StockData } from '@/types/market';

interface PriceChartProps {
  stock: StockData;
  isDarkMode: boolean;
}

function generateChartData(stock: StockData) {
  const data = [];
  let price = stock.openPrice;

  for (let i = 0; i < 24; i++) {
    // 15-minute intervals starting at 09:15
    const totalMinutes = 15 + i * 15;
    const hour = 9 + Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;

    const volatility =
      ((stock.highPrice - stock.lowPrice) / stock.openPrice) * 0.1;

    const movement = (Math.random() - 0.5) * 2 * volatility;

    price = price * (1 + movement);

    price = Math.max(
      stock.lowPrice,
      Math.min(stock.highPrice, price)
    );

    data.push({
      time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(
        2,
        '0'
      )}`,
      price: Number(price.toFixed(2)),
    });
  }

  return data;
}

export function PriceChart({
  stock,
  isDarkMode,
}: PriceChartProps) {

  const data = useMemo(
    () => generateChartData(stock),
    [
      stock.symbol,
      stock.openPrice,
      stock.highPrice,
      stock.lowPrice,
    ]
  );

  const isPositive = stock.change >= 0;

  const gridColor = isDarkMode ? '#333' : '#e5e7eb';
  const textColor = isDarkMode ? '#fff' : '#000';
  const lineColor = isPositive ? '#10b981' : '#ef4444';

  return (
    <div
      className={`p-6 rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold">
          {stock.name} ({stock.symbol})
        </h3>

        <p
          className={`text-sm ${
            isDarkMode
              ? 'text-gray-400'
              : 'text-gray-600'
          }`}
        >
          Price Range: ₹
          {Number(stock.lowPrice).toFixed(2)} - ₹
          {Number(stock.highPrice).toFixed(2)}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id="priceGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={lineColor}
                stopOpacity={0.6}
              />
              <stop
                offset="95%"
                stopColor={lineColor}
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridColor}
          />

          <XAxis
            dataKey="time"
            stroke={textColor}
            interval={3}
          />

          <YAxis
            stroke={textColor}
            domain={[
              (dataMin: number) => dataMin * 0.98,
              (dataMax: number) => dataMax * 1.02,
            ]}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode
                ? '#1f2937'
                : '#ffffff',
              border: `1px solid ${
                isDarkMode ? '#4b5563' : '#d1d5db'
              }`,
              borderRadius: '8px',
            }}
            formatter={(value) => [
              `₹${Number(value).toFixed(2)}`,
              'Price',
            ]}
          />

          <Area
            type="monotone"
            dataKey="price"
            stroke={lineColor}
            fill="url(#priceGradient)"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div
          className={`p-3 rounded ${
            isDarkMode
              ? 'bg-gray-700'
              : 'bg-gray-100'
          }`}
        >
          <p className="text-sm text-gray-500">
            Current Price
          </p>

          <p className="text-2xl font-bold">
            ₹{Number(stock.currentPrice).toFixed(2)}
          </p>
        </div>

        <div
          className={`p-3 rounded ${
            isDarkMode
              ? 'bg-gray-700'
              : 'bg-gray-100'
          }`}
        >
          <p className="text-sm text-gray-500">
            Change
          </p>

          <p
            className={`text-2xl font-bold ${
              isPositive
                ? 'text-green-500'
                : 'text-red-500'
            }`}
          >
            {isPositive ? '+' : ''}
            {Number(stock.pctChange).toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}