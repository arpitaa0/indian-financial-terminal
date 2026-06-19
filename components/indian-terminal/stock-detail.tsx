'use client';

import { useState } from 'react';
import type { StockData } from '@/types/market';
import { PriceChart } from './price-chart';
import { CandlestickChart } from './candlestick-chart';
import { formatIndianCurrency } from '@/lib/indian-market-config';

interface StockDetailProps {
  stock: StockData;
  isDarkMode: boolean;
  onClose: () => void;
}

type ChartType = 'area' | 'candlestick';

export function StockDetail({ stock, isDarkMode, onClose }: StockDetailProps) {
  const [chartType, setChartType] = useState<ChartType>('area');

  const isPositive = stock.change >= 0;
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';

  return (
    <div className={`${bgColor} ${textColor} p-6 rounded-lg max-w-6xl mx-auto`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{stock.name}</h1>
          <p className="text-gray-500">{stock.symbol} • {stock.sector}</p>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white"
        >
          ✕ Close
        </button>
      </div>

      {/* Price Info */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div>
          <p className="text-sm text-gray-500">Current Price</p>
          <p className="text-2xl font-bold">{formatIndianCurrency(stock.currentPrice)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Change</p>
          <p className={`text-2xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.pctChange.toFixed(2)}%)
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Volume</p>
          <p className="text-2xl font-bold">{(stock.volume / 1000000).toFixed(2)}M</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Updated</p>
          <p className="text-sm">{new Date(stock.lastUpdated).toLocaleTimeString('en-IN')}</p>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setChartType('area')}
          className={`px-4 py-2 rounded ${
            chartType === 'area'
              ? 'bg-blue-600 text-white'
              : isDarkMode
              ? 'bg-gray-800 text-white hover:bg-gray-700'
              : 'bg-gray-200 text-black hover:bg-gray-300'
          }`}
        >
          Area Chart
        </button>
        <button
          onClick={() => setChartType('candlestick')}
          className={`px-4 py-2 rounded ${
            chartType === 'candlestick'
              ? 'bg-blue-600 text-white'
              : isDarkMode
              ? 'bg-gray-800 text-white hover:bg-gray-700'
              : 'bg-gray-200 text-black hover:bg-gray-300'
          }`}
        >
          Candlestick
        </button>
      </div>

      {/* Charts */}
      {chartType === 'area' && <PriceChart stock={stock} isDarkMode={isDarkMode} />}
      {chartType === 'candlestick' && <CandlestickChart stock={stock} isDarkMode={isDarkMode} />}

      {/* Stock Statistics */}
      <div className={`mt-6 p-4 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <h3 className="text-lg font-bold mb-4">📊 Stock Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Open</p>
            <p className="font-bold">{formatIndianCurrency(stock.openPrice)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">High</p>
            <p className="font-bold text-green-500">{formatIndianCurrency(stock.highPrice)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Low</p>
            <p className="font-bold text-red-500">{formatIndianCurrency(stock.lowPrice)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Exchange</p>
            <p className="font-bold">{stock.exchange}</p>
          </div>
        </div>
      </div>
    </div>
  );
}