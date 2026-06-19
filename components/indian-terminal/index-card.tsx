import type { IndexData } from '@/types/market';
import { formatIndianCurrency } from '@/lib/indian-market-config';

interface IndexCardProps {
  index: IndexData;
  isDarkMode: boolean;
}

export function IndexCard({ index, isDarkMode }: IndexCardProps) {
  const isPositive = index.change >= 0;
  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <div
      className={`${bgColor} ${textColor} p-4 rounded border-l-4 ${
        isPositive ? 'border-green-500' : 'border-red-500'
      }`}
    >
      <h3 className="font-bold text-lg">{index.name}</h3>
      <p className="text-2xl font-bold">{formatIndianCurrency(index.value)}</p>
      <p className={`text-sm ${changeColor}`}>
        {isPositive ? '▲' : '▼'} {Math.abs(index.change).toFixed(2)} (
        {index.pctChange.toFixed(2)}%)
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Updated: {new Date(index.lastUpdated).toLocaleTimeString('en-IN')}
      </p>
    </div>
  );
}