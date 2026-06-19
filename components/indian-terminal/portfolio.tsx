'use client';

import { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import { formatIndianCurrency } from '@/lib/indian-market-config';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import type { PortfolioStock } from '@/types/portfolio';

interface PortfolioProps {
  isDarkMode: boolean;
}

export function Portfolio({ isDarkMode }: PortfolioProps) {
  const {
    portfolios,
    activePortfolio,
    createPortfolio,
    deletePortfolio,
    setActivePortfolio,
    removeStock,
  } = usePortfolio();

  const [showAddStock, setShowAddStock] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [showNewPortfolio, setShowNewPortfolio] = useState(false);

  const [newStock, setNewStock] = useState({
    symbol: '',
    name: '',
    quantity: 0,
    buyPrice: 0,
    currentPrice: 0,
    buyDate: new Date().toISOString().split('T')[0],
    sector: '',
  });

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const inputBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  const handleAddStock = () => {
    if (!activePortfolio || !newStock.symbol) return;

    const stock: PortfolioStock = {
      ...newStock,
      quantity: Number(newStock.quantity),
      buyPrice: Number(newStock.buyPrice),
      currentPrice: Number(newStock.currentPrice),
      totalCost: Number(newStock.quantity) * Number(newStock.buyPrice),
      currentValue: Number(newStock.quantity) * Number(newStock.currentPrice),
      gainLoss:
        Number(newStock.quantity) * Number(newStock.currentPrice) -
        Number(newStock.quantity) * Number(newStock.buyPrice),
      gainLossPercent:
        ((Number(newStock.currentPrice) - Number(newStock.buyPrice)) / Number(newStock.buyPrice)) *
        100,
      buyDate: new Date(newStock.buyDate),
    };

    // @ts-ignore
    activePortfolio.addStock?.(stock);

    setNewStock({
      symbol: '',
      name: '',
      quantity: 0,
      buyPrice: 0,
      currentPrice: 0,
      buyDate: new Date().toISOString().split('T')[0],
      sector: '',
    });
    setShowAddStock(false);
  };

  const handleCreatePortfolio = () => {
    if (newPortfolioName.trim()) {
      createPortfolio(newPortfolioName);
      setNewPortfolioName('');
      setShowNewPortfolio(false);
    }
  };

  if (!activePortfolio) {
    return (
      <div className={`${bgColor} ${textColor} p-6 rounded-lg`}>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className={`${bgColor} ${textColor} p-6 rounded-lg`}>
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-4">💼 Portfolio Management</h2>

        {/* Portfolio Selector */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {portfolios.map(portfolio => (
            <button
              key={portfolio.id}
              onClick={() => setActivePortfolio(portfolio.id)}
              className={`px-4 py-2 rounded whitespace-nowrap font-semibold ${
                activePortfolio.id === portfolio.id
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {portfolio.name}
              {activePortfolio.id === portfolio.id && portfolios.length > 1 && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    deletePortfolio(portfolio.id);
                  }}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              )}
            </button>
          ))}
          <button
            onClick={() => setShowNewPortfolio(true)}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            + New
          </button>
        </div>

        {/* Create New Portfolio Modal */}
        {showNewPortfolio && (
          <div className={`mb-4 p-4 rounded border-2 ${borderColor}`}>
            <input
              type="text"
              placeholder="Portfolio name"
              value={newPortfolioName}
              onChange={e => setNewPortfolioName(e.target.value)}
              className={`w-full px-3 py-2 rounded ${inputBg} text-black mb-2`}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreatePortfolio}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
              >
                Create
              </button>
              <button
                onClick={() => setShowNewPortfolio(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <p className="text-sm text-gray-500">Total Investment</p>
          <p className="text-2xl font-bold">{formatIndianCurrency(activePortfolio.totalInvestment)}</p>
        </div>
        <div className={`p-4 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <p className="text-sm text-gray-500">Current Value</p>
          <p className="text-2xl font-bold">{formatIndianCurrency(activePortfolio.totalCurrentValue)}</p>
        </div>
        <div className={`p-4 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <p className="text-sm text-gray-500">Gain/Loss</p>
          <p
            className={`text-2xl font-bold ${
              activePortfolio.totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {formatIndianCurrency(activePortfolio.totalGainLoss)}
          </p>
        </div>
        <div className={`p-4 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <p className="text-sm text-gray-500">Return %</p>
          <p
            className={`text-2xl font-bold ${
              activePortfolio.totalGainLossPercent >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {activePortfolio.totalGainLossPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Add Stock Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddStock(!showAddStock)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold flex items-center gap-2"
        >
          <Plus size={20} /> Add Stock
        </button>
      </div>

      {/* Add Stock Form */}
      {showAddStock && (
        <div className={`mb-6 p-4 rounded border-2 ${borderColor}`}>
          <h3 className="text-lg font-bold mb-4">Add New Stock</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            <input
              type="text"
              placeholder="Symbol (e.g., TCS.NSE)"
              value={newStock.symbol}
              onChange={e => setNewStock({ ...newStock, symbol: e.target.value.toUpperCase() })}
              className={`px-3 py-2 rounded ${inputBg} text-black`}
            />
            <input
              type="text"
              placeholder="Company Name"
              value={newStock.name}
              onChange={e => setNewStock({ ...newStock, name: e.target.value })}
              className={`px-3 py-2 rounded ${inputBg} text-black`}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newStock.quantity || ''}
              onChange={e => setNewStock({ ...newStock, quantity: parseFloat(e.target.value) })}
              className={`px-3 py-2 rounded ${inputBg} text-black`}
            />
            <input
              type="number"
              placeholder="Buy Price (₹)"
              value={newStock.buyPrice || ''}
              onChange={e => setNewStock({ ...newStock, buyPrice: parseFloat(e.target.value) })}
              className={`px-3 py-2 rounded ${inputBg} text-black`}
            />
            <input
              type="number"
              placeholder="Current Price (₹)"
              value={newStock.currentPrice || ''}
              onChange={e => setNewStock({ ...newStock, currentPrice: parseFloat(e.target.value) })}
              className={`px-3 py-2 rounded ${inputBg} text-black`}
            />
            <input
              type="date"
              value={newStock.buyDate}
              onChange={e => setNewStock({ ...newStock, buyDate: e.target.value })}
              className={`px-3 py-2 rounded ${inputBg} text-black`}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddStock}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold"
            >
              Add to Portfolio
            </button>
            <button
              onClick={() => setShowAddStock(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stocks Table */}
      {activePortfolio.stocks.length === 0 ? (
        <div className={`text-center py-8 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded`}>
          <p className="text-gray-500">No stocks in your portfolio yet</p>
        </div>
      ) : (
        <div className={`rounded overflow-x-auto`}>
          <table className="w-full">
            <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}>
              <tr>
                <th className="px-4 py-2 text-left">Symbol</th>
                <th className="px-4 py-2 text-right">Qty</th>
                <th className="px-4 py-2 text-right">Buy Price</th>
                <th className="px-4 py-2 text-right">Current Price</th>
                <th className="px-4 py-2 text-right">Total Cost</th>
                <th className="px-4 py-2 text-right">Current Value</th>
                <th className="px-4 py-2 text-right">Gain/Loss</th>
                <th className="px-4 py-2 text-right">%</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {activePortfolio.stocks.map(stock => {
                const isPositive = stock.gainLoss >= 0;
                return (
                  <tr
                    key={stock.symbol}
                    className={`border-t ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  >
                    <td className="px-4 py-2 font-bold">{stock.symbol}</td>
                    <td className="px-4 py-2 text-right">{stock.quantity}</td>
                    <td className="px-4 py-2 text-right">{formatIndianCurrency(stock.buyPrice)}</td>
                    <td className="px-4 py-2 text-right">{formatIndianCurrency(stock.currentPrice)}</td>
                    <td className="px-4 py-2 text-right">{formatIndianCurrency(stock.totalCost)}</td>
                    <td className="px-4 py-2 text-right">{formatIndianCurrency(stock.currentValue)}</td>
                    <td
                      className={`px-4 py-2 text-right font-bold ${
                        isPositive ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {isPositive ? '+' : ''}{formatIndianCurrency(stock.gainLoss)}
                    </td>
                    <td
                      className={`px-4 py-2 text-right font-bold ${
                        isPositive ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {isPositive ? '▲' : '▼'} {Math.abs(stock.gainLossPercent).toFixed(2)}%
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => removeStock(stock.symbol)}
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