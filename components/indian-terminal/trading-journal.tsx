'use client';

import { useState } from 'react';
import { useJournal } from '@/lib/journal-context';
import { INDIAN_STOCKS } from '@/lib/indian-market-config';
import { formatIndianCurrency } from '@/lib/indian-market-config';
import { Trash2 } from 'lucide-react';

interface TradingJournalProps {
  isDarkMode: boolean;
}

export function TradingJournal({ isDarkMode }: TradingJournalProps) {
  const { trades, addTrade, removeTrade, getTotalTrades, getWinRate, getTotalProfit } = useJournal();
  const [showAddTrade, setShowAddTrade] = useState(false);
  const [newTrade, setNewTrade] = useState({
    symbol: '',
    tradeType: 'buy' as 'buy' | 'sell',
    quantity: 0,
    price: 0,
    reason: '',
    result: 'pending' as 'win' | 'loss' | 'breakeven' | 'pending',
    profit: 0,
    profitPercent: 0,
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';

  const handleAddTrade = () => {
    if (!newTrade.symbol || newTrade.quantity <= 0 || newTrade.price <= 0) {
      alert('Please fill all required fields');
      return;
    }

    const totalAmount = newTrade.quantity * newTrade.price;

    addTrade({
      symbol: newTrade.symbol,
      tradeType: newTrade.tradeType,
      quantity: newTrade.quantity,
      price: newTrade.price,
      totalAmount: totalAmount,
      date: new Date(newTrade.date),
      reason: newTrade.reason,
      result: newTrade.result,
      profit: newTrade.profit,
      profitPercent: newTrade.profitPercent,
      notes: newTrade.notes,
    });

    setNewTrade({
      symbol: '',
      tradeType: 'buy',
      quantity: 0,
      price: 0,
      reason: '',
      result: 'pending',
      profit: 0,
      profitPercent: 0,
      notes: '',
      date: new Date().toISOString().split('T')[0],
    });
    setShowAddTrade(false);
  };

  const sortedTrades = [...trades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className={`${bgColor} ${textColor} p-6 rounded-lg`}>
      <h2 className="text-2xl font-bold mb-4">📔 Trading Journal</h2>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-sm text-gray-500">Total Trades</p>
          <p className="text-2xl font-bold">{getTotalTrades()}</p>
        </div>
        <div className={`p-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-sm text-gray-500">Win Rate</p>
          <p className="text-2xl font-bold text-green-500">{getWinRate().toFixed(1)}%</p>
        </div>
        <div className={`p-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-sm text-gray-500">Total Profit/Loss</p>
          <p className={`text-2xl font-bold ${getTotalProfit() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatIndianCurrency(getTotalProfit())}
          </p>
        </div>
        <div className={`p-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-sm text-gray-500">Avg Trade</p>
          <p className="text-2xl font-bold">
            {getTotalTrades() > 0 ? formatIndianCurrency(getTotalProfit() / getTotalTrades()) : '₹0'}
          </p>
        </div>
      </div>

      {/* Add Trade Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddTrade(!showAddTrade)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold"
        >
          + Log Trade
        </button>
      </div>

      {/* Add Trade Form */}
      {showAddTrade && (
        <div className={`mb-6 p-4 rounded border-2 ${borderColor}`}>
          <h3 className="text-lg font-bold mb-4">Log New Trade</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Stock</label>
              <select
                value={newTrade.symbol}
                onChange={e => setNewTrade({ ...newTrade, symbol: e.target.value })}
                className={`w-full px-3 py-2 rounded ${inputBg} text-black`}
              >
                <option value="">Select Stock</option>
                {INDIAN_STOCKS.map(stock => (
                  <option key={stock.symbol} value={stock.symbol}>
                    {stock.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Trade Type</label>
              <select
                value={newTrade.tradeType}
                onChange={e =>
                  setNewTrade({ ...newTrade, tradeType: e.target.value as 'buy' | 'sell' })
                }
                className={`w-full px-3 py-2 rounded ${inputBg} text-black`}
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>

            <input
              type="number"
              placeholder="Quantity"
              value={newTrade.quantity || ''}
              onChange={e => setNewTrade({ ...newTrade, quantity: parseFloat(e.target.value) })}
              className={`px-3 py-2 rounded ${inputBg} text-black`}
            />

            <input
              type="number"
              placeholder="Price per unit (₹)"
              value={newTrade.price || ''}
              onChange={e => setNewTrade({ ...newTrade, price: parseFloat(e.target.value) })}
              className={`px-3 py-2 rounded ${inputBg} text-black`}
            />

            <div>
              <label className="block text-sm font-semibold mb-2">Result</label>
              <select
                value={newTrade.result}
                onChange={e =>
                  setNewTrade({
                    ...newTrade,
                    result: e.target.value as 'win' | 'loss' | 'breakeven' | 'pending',
                  })
                }
                className={`w-full px-3 py-2 rounded ${inputBg} text-black`}
              >
                <option value="pending">Pending</option>
                <option value="win">Win 📈</option>
                <option value="loss">Loss 📉</option>
                <option value="breakeven">Breakeven ➡️</option>
              </select>
            </div>

            <input
              type="date"
              value={newTrade.date}
              onChange={e => setNewTrade({ ...newTrade, date: e.target.value })}
              className={`px-3 py-2 rounded ${inputBg} text-black`}
            />

            <input
              type="text"
              placeholder="Why did you trade?"
              value={newTrade.reason}
              onChange={e => setNewTrade({ ...newTrade, reason: e.target.value })}
              className={`px-3 py-2 rounded ${inputBg} text-black md:col-span-2`}
            />

            <input
              type="number"
              placeholder="Profit/Loss (₹)"
              value={newTrade.profit || ''}
              onChange={e => setNewTrade({ ...newTrade, profit: parseFloat(e.target.value) })}
              className={`px-3 py-2 rounded ${inputBg} text-black`}
            />

            <input
              type="number"
              placeholder="Profit % "
              value={newTrade.profitPercent || ''}
              onChange={e => setNewTrade({ ...newTrade, profitPercent: parseFloat(e.target.value) })}
              className={`px-3 py-2 rounded ${inputBg} text-black`}
            />

            <textarea
              placeholder="Additional notes..."
              value={newTrade.notes}
              onChange={e => setNewTrade({ ...newTrade, notes: e.target.value })}
              className={`px-3 py-2 rounded ${inputBg} text-black md:col-span-2`}
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddTrade}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold"
            >
              Log Trade
            </button>
            <button
              onClick={() => setShowAddTrade(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Trades List */}
      {sortedTrades.length === 0 ? (
        <div className={`text-center py-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded`}>
          <p className="text-gray-500">No trades logged yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}>
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Symbol</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-right">Qty</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-left">Reason</th>
                <th className="px-4 py-2 text-left">Result</th>
                <th className="px-4 py-2 text-right">Profit/Loss</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedTrades.map(trade => {
                const resultColor =
                  trade.result === 'win'
                    ? 'text-green-500'
                    : trade.result === 'loss'
                    ? 'text-red-500'
                    : trade.result === 'pending'
                    ? 'text-yellow-500'
                    : 'text-gray-500';

                const resultEmoji =
                  trade.result === 'win'
                    ? '✅ Win'
                    : trade.result === 'loss'
                    ? '❌ Loss'
                    : trade.result === 'pending'
                    ? '⏳ Pending'
                    : '➡️ Breakeven';

                return (
                  <tr key={trade.id} className={`border-t ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <td className="px-4 py-2 text-sm">
                      {new Date(trade.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-2 font-bold">{trade.symbol}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs font-bold ${
                          trade.tradeType === 'buy' ? 'bg-green-600' : 'bg-red-600'
                        }`}
                      >
                        {trade.tradeType.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right">{trade.quantity}</td>
                    <td className="px-4 py-2 text-right">{formatIndianCurrency(trade.price)}</td>
                    <td className="px-4 py-2 text-sm">{trade.reason}</td>
                    <td className={`px-4 py-2 font-bold ${resultColor}`}>{resultEmoji}</td>
                    <td className={`px-4 py-2 text-right font-bold ${resultColor}`}>
                      {trade.profit ? formatIndianCurrency(trade.profit) : '-'}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => removeTrade(trade.id)}
                        className="text-red-500 hover:text-red-700"
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