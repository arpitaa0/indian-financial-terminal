'use client';

import { useState, useEffect } from 'react';
import { fetchStockData } from '@/lib/market-data';
import { INDIAN_STOCKS } from '@/lib/indian-market-config';
import type { StockData } from '@/types/market';
import { StockComparison } from './stock-comparison';

interface ComparisonToolProps {
  isDarkMode: boolean;
}

export function ComparisonTool({ isDarkMode }: ComparisonToolProps) {
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [comparisonStocks, setComparisonStocks] = useState<StockData[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSymbolToggle = (symbol: string) => {
    setSelectedSymbols(prev => {
      if (prev.includes(symbol)) {
        return prev.filter(s => s !== symbol);
      } else if (prev.length < 5) {
        return [...prev, symbol];
      }
      return prev;
    });
  };

  const handleCompare = async () => {
    if (selectedSymbols.length < 2) {
      alert('Please select at least 2 stocks to compare');
      return;
    }

    setLoading(true);
    const stocks: StockData[] = [];

    for (const symbol of selectedSymbols) {
      const stock = await fetchStockData(symbol);
      if (stock) {
        stocks.push(stock);
      }
    }

    setComparisonStocks(stocks);
    setShowComparison(true);
    setLoading(false);
  };

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';

  if (showComparison && comparisonStocks.length > 0) {
    return (
      <StockComparison
        stocks={comparisonStocks}
        isDarkMode={isDarkMode}
        onClose={() => {
          setShowComparison(false);
          setSelectedSymbols([]);
        }}
      />
    );
  }

  return (
    <div className={`${bgColor} ${textColor} p-6 rounded-lg border ${borderColor}`}>
      <h2 className="text-2xl font-bold mb-4">⚖️ Compare Stocks</h2>
      <p className="text-sm text-gray-500 mb-4">Select 2-5 stocks to compare (max 5)</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {INDIAN_STOCKS.map(stock => (
          <label
            key={stock.symbol}
            className={`p-3 rounded border-2 cursor-pointer transition ${
              selectedSymbols.includes(stock.symbol)
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                : borderColor
            }`}
          >
            <input
              type="checkbox"
              checked={selectedSymbols.includes(stock.symbol)}
              onChange={() => handleSymbolToggle(stock.symbol)}
              className="mr-2"
            />
            <span className="font-semibold">{stock.symbol}</span>
            <p className="text-xs text-gray-500">{stock.name}</p>
          </label>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCompare}
          disabled={selectedSymbols.length < 2 || loading}
          className={`px-6 py-2 rounded font-bold ${
            selectedSymbols.length < 2 || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {loading ? 'Loading...' : `Compare (${selectedSymbols.length})`}
        </button>
        {selectedSymbols.length > 0 && (
          <button
            onClick={() => setSelectedSymbols([])}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white font-bold"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}