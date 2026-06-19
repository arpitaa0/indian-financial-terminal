'use client';

import { useEffect, useState } from 'react';
import { useWatchlist } from '@/lib/watchlist-context';
import { fetchStockData } from '@/lib/market-data';
import { formatIndianCurrency } from '@/lib/indian-market-config';
import type { StockData } from '@/types/market';
import { Trash2 } from 'lucide-react';

interface WatchlistProps {
  isDarkMode: boolean;
  onStockClick: (stock: StockData) => void;
}

export function Watchlist({ isDarkMode, onStockClick }: WatchlistProps) {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (watchlist.length === 0) {
      setStocks([]);
      return;
    }

    const loadWatchlistStocks = async () => {
      setLoading(true);
      const data: StockData[] = [];

      for (const item of watchlist) {
        try {
          const stock = await fetchStockData(item.symbol);
          if (stock) {
            data.push(stock);
          }
        } catch (error) {
          console.error(`Error fetching ${item.symbol}:`, error);
        }
      }

      setStocks(data);
      setLoading(false);
    };

    loadWatchlistStocks();
    // Refresh every 30 seconds
    const interval = setInterval(loadWatchlistStocks, 30000);
    return () => clearInterval(interval);
  }, [watchlist]);

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';

  if (watchlist.length === 0) {
    return (
      <div className={`${bgColor} ${textColor} p-6 rounded-lg border ${borderColor} text-center`}>
        <p className="text-lg font-semibold">📌 Your Watchlist is Empty</p>
        <p className="text-sm text-gray-500 mt-2">Add stocks to your watchlist to track them here</p>
      </div>
    );
  }

  return (
    <div className={`${bgColor} ${textColor} rounded-lg overflow-hidden border ${borderColor}`}>
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">📌 My Watchlist</h2>
        <p className="text-sm text-gray-500">{watchlist.length} stocks</p>
      </div>

      {loading ? (
        <div className="p-4 text-center">
          <p>Loading watchlist data...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}>
              <tr>
                <th className="px-4 py-2 text-left">Symbol</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-right">Change</th>
                <th className="px-4 py-2 text-right">Change %</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map(stock => {
                const isPositive = stock.change >= 0;
                return (
                  <tr
                    key={stock.id}
                    className={`hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} cursor-pointer border-t ${borderColor}`}
                    onClick={() => onStockClick(stock)}
                  >
                    <td className="px-4 py-2 font-bold">{stock.symbol}</td>
                    <td className="px-4 py-2">{stock.name}</td>
                    <td className="px-4 py-2 text-right">{formatIndianCurrency(stock.currentPrice)}</td>
                    <td className={`px-4 py-2 text-right ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{stock.change.toFixed(2)}
                    </td>
                    <td className={`px-4 py-2 text-right font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {isPositive ? '▲' : '▼'} {Math.abs(stock.pctChange).toFixed(2)}%
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWatchlist(stock.symbol);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove from watchlist"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}