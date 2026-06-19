'use client';

import type { StockData } from '@/types/market';
import { formatIndianCurrency } from '@/lib/indian-market-config';
import { useWatchlist } from '@/lib/watchlist-context';

interface StockRowProps {
  stock: StockData;
  isDarkMode: boolean;
}

export function StockRow({ stock, isDarkMode }: StockRowProps) {
  const { addToWatchlist, isInWatchlist } = useWatchlist();

  const isPositive = stock.change >= 0;
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const bgHover = isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';

  const alreadyAdded = isInWatchlist(stock.symbol);

  return (
    <tr className={`${bgHover} cursor-pointer`}>
      <td className={`${textColor} px-4 py-2 font-bold`}>
        {stock.symbol}
      </td>

      <td className={`${textColor} px-4 py-2`}>
        {stock.name}
      </td>

      <td className={`${textColor} px-4 py-2`}>
        {formatIndianCurrency(stock.currentPrice)}
      </td>

      <td className={`${textColor} px-4 py-2`}>
        {stock.openPrice.toFixed(2)}
      </td>

      <td className={`${textColor} px-4 py-2`}>
        {stock.highPrice.toFixed(2)}
      </td>

      <td className={`${textColor} px-4 py-2`}>
        {stock.lowPrice.toFixed(2)}
      </td>

      <td className={`${changeColor} px-4 py-2 font-bold`}>
        {isPositive ? '+' : ''}
        {stock.change.toFixed(2)}
        {' '}
        ({stock.pctChange.toFixed(2)}%)
      </td>

      <td className={`${textColor} px-4 py-2 text-sm`}>
        {(stock.volume / 1000000).toFixed(1)}M
      </td>

      <td className="px-4 py-2">
        <button
          disabled={alreadyAdded}
          onClick={() =>
            addToWatchlist({
              symbol: stock.symbol,
              name: stock.name,
              addedAt: new Date(),
            })
          }
          className={`px-3 py-1 rounded text-white text-sm ${
            alreadyAdded
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {alreadyAdded ? 'Added' : '+ Watchlist'}
        </button>
      </td>
    </tr>
  );
}