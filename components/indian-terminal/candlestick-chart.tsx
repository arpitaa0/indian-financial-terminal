'use client';

import { useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { StockData } from '@/types/market';

interface CandlestickChartProps {
  stock: StockData;
  isDarkMode: boolean;
}

interface CandleData {
  time: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

function generateCandleData(stock: StockData): CandleData[] {
  const data: CandleData[] = [];
  let price = stock.openPrice;

  for (let i = 0; i < 12; i++) {
    const open = price;

    const volatility =
      ((stock.highPrice - stock.lowPrice) / stock.openPrice) * 0.05;

    const close =
      open * (1 + (Math.random() - 0.5) * volatility * 2);

    const high =
      Math.max(open, close) * (1 + Math.random() * 0.02);

    const low =
      Math.min(open, close) * (1 - Math.random() * 0.02);

    data.push({
      time: `Day ${i + 1}`,
      open: Number(open.toFixed(2)),
      close: Number(close.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      volume: Number(stock.volume || 0) / 12,
    });

    price = close;
  }

  return data;
}

export function CandlestickChart({
  stock,
  isDarkMode,
}: CandlestickChartProps) {

  const data = useMemo(
    () => generateCandleData(stock),
    [
      stock.symbol,
      stock.openPrice,
      stock.highPrice,
      stock.lowPrice,
    ]
  );

  const gridColor = isDarkMode ? '#333' : '#e5e7eb';
  const textColor = isDarkMode ? '#fff' : '#000';

  return (
    <div
      className={`p-6 rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <h3 className="text-xl font-bold mb-4">
        Candlestick View (Last 12 Days)
      </h3>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridColor}
          />

          <XAxis
            dataKey="time"
            stroke={textColor}
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
                : '#fff',
              border: `1px solid ${
                isDarkMode ? '#666' : '#ddd'
              }`,
              borderRadius: '8px',
            }}
            formatter={(value) =>
              `₹${Number(value).toFixed(2)}`
            }
          />

          {/* High */}
          <Line
            type="monotone"
            dataKey="high"
            stroke="#22c55e"
            dot={false}
            strokeWidth={2}
          />

          {/* Low */}
          <Line
            type="monotone"
            dataKey="low"
            stroke="#ef4444"
            dot={false}
            strokeWidth={2}
          />

          {/* Close */}
          <Bar
            dataKey="close"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}