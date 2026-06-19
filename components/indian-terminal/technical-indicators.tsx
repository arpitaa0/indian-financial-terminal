'use client';

import type { StockData } from '@/types/market';
import { formatIndianCurrency } from '@/lib/indian-market-config';

interface TechnicalIndicatorsProps {
  stock: StockData;
  isDarkMode: boolean;
}

interface Indicator {
  name: string;
  value: number | string;
  status: 'bullish' | 'bearish' | 'neutral';
  description: string;
}

// Calculate technical indicators
function calculateIndicators(stock: StockData): Indicator[] {
  // RSI (Relative Strength Index) - Mock calculation
  const rsi = 50 + Math.random() * 50; // 50-100 range

  // MACD (Moving Average Convergence Divergence)
  const macd = Math.random() - 0.5; // Positive or negative

  // Moving Averages
  const ma50 = stock.currentPrice * (1 + (Math.random() - 0.5) * 0.02);
  const ma200 = stock.currentPrice * (1 + (Math.random() - 0.5) * 0.05);

  // Bollinger Bands
  const bbUpper = stock.highPrice;
  const bbLower = stock.lowPrice;

  // Support and Resistance
  const support = stock.lowPrice;
  const resistance = stock.highPrice;

  // Calculate statuses
  const rsiStatus = rsi > 70 ? 'bearish' : rsi < 30 ? 'bullish' : 'neutral';
  const macdStatus = macd > 0 ? 'bullish' : 'bearish';
  const maStatus = stock.currentPrice > ma50 ? 'bullish' : 'bearish';

  return [
    {
      name: 'RSI (14)',
      value: rsi.toFixed(2),
      status: rsiStatus,
      description:
        rsi > 70
          ? 'Overbought - Consider selling'
          : rsi < 30
          ? 'Oversold - Consider buying'
          : 'Neutral - No clear signal',
    },
    {
      name: 'MACD',
      value: macd.toFixed(3),
      status: macdStatus,
      description: macdStatus === 'bullish' ? 'Bullish crossover' : 'Bearish crossover',
    },
    {
      name: 'MA 50',
      value: formatIndianCurrency(ma50),
      status: maStatus,
      description:
        stock.currentPrice > ma50
          ? 'Price above MA50 - Bullish'
          : 'Price below MA50 - Bearish',
    },
    {
      name: 'MA 200',
      value: formatIndianCurrency(ma200),
      status: stock.currentPrice > ma200 ? 'bullish' : 'bearish',
      description:
        stock.currentPrice > ma200
          ? 'Price above MA200 - Long-term bullish'
          : 'Price below MA200 - Long-term bearish',
    },
    {
      name: 'Bollinger Bands Upper',
      value: formatIndianCurrency(bbUpper),
      status: stock.currentPrice > bbUpper ? 'bearish' : 'neutral',
      description: 'Upper band of volatility channel',
    },
    {
      name: 'Bollinger Bands Lower',
      value: formatIndianCurrency(bbLower),
      status: stock.currentPrice < bbLower ? 'bullish' : 'neutral',
      description: 'Lower band of volatility channel',
    },
    {
      name: 'Support',
      value: formatIndianCurrency(support),
      status: 'neutral',
      description: 'Key support level',
    },
    {
      name: 'Resistance',
      value: formatIndianCurrency(resistance),
      status: 'neutral',
      description: 'Key resistance level',
    },
  ];
}

export function TechnicalIndicators({ stock, isDarkMode }: TechnicalIndicatorsProps) {
  const indicators = calculateIndicators(stock);

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'bullish':
        return 'bg-green-900 text-green-300 border-green-700';
      case 'bearish':
        return 'bg-red-900 text-red-300 border-red-700';
      default:
        return `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`;
    }
  };

  return (
    <div className={`${bgColor} ${textColor} p-6 rounded-lg`}>
      <h2 className="text-2xl font-bold mb-6">📊 Technical Indicators</h2>

      {/* Summary Signal */}
      <div className={`mb-6 p-4 rounded border-2 border-yellow-500 bg-yellow-900 text-yellow-200`}>
        <p className="font-bold text-lg">Overall Signal</p>
        <p className="text-sm mt-1">
          Based on multiple indicators, the stock shows mixed signals. Always use multiple indicators
          for better decision-making.
        </p>
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {indicators.map(indicator => (
          <div
            key={indicator.name}
            className={`p-4 rounded border ${borderColor} ${
              isDarkMode ? 'bg-gray-750' : 'bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-sm">{indicator.name}</h3>
              <span
                className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(indicator.status)}`}
              >
                {indicator.status.toUpperCase()}
              </span>
            </div>

            <p className="text-2xl font-bold mb-2">{indicator.value}</p>
            <p className="text-xs text-gray-500">{indicator.description}</p>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className={`mt-6 p-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <p className="text-xs text-gray-500">
          ⚠️ Disclaimer: These are calculated technical indicators based on simulated data. Always
          conduct your own research and consult with financial advisors before making investment
          decisions.
        </p>
      </div>
    </div>
  );
}