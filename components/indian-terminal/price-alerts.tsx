'use client';

import { useState } from 'react';
import { useAlerts } from '@/lib/alerts-context';
import { INDIAN_STOCKS } from '@/lib/indian-market-config';
import { formatIndianCurrency } from '@/lib/indian-market-config';
import { Bell, Trash2, } from 'lucide-react';

interface PriceAlertsProps {
  isDarkMode: boolean;
}

export function PriceAlerts({ isDarkMode }: PriceAlertsProps) {
  const { alerts, addAlert, removeAlert, toggleAlert } = useAlerts();
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    name: '',
    alertType: 'above' as 'above' | 'below',
    targetPrice: 0,
  });

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';

  const handleAddAlert = () => {
    if (!newAlert.symbol || newAlert.targetPrice <= 0) {
      alert('Please fill all fields');
      return;
    }

    addAlert({
      symbol: newAlert.symbol,
      name: newAlert.name,
      alertType: newAlert.alertType,
      targetPrice: newAlert.targetPrice,
      isActive: true,
    });

    setNewAlert({
      symbol: '',
      name: '',
      alertType: 'above',
      targetPrice: 0,
    });
    setShowAddAlert(false);
  };

  const activeAlerts = alerts.filter(a => a.isActive);
  const inactiveAlerts = alerts.filter(a => !a.isActive);

  return (
    <div className={`${bgColor} ${textColor} p-6 rounded-lg`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell size={28} /> Price Alerts
        </h2>
        <button
          onClick={() => setShowAddAlert(!showAddAlert)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold"
        >
          + Add Alert
        </button>
      </div>

      {/* Add Alert Form */}
      {showAddAlert && (
        <div className={`mb-6 p-4 rounded border-2 ${borderColor}`}>
          <h3 className="text-lg font-bold mb-4">Create New Alert</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Stock Symbol</label>
              <select
                value={newAlert.symbol}
                onChange={e => {
                  const selected = INDIAN_STOCKS.find(s => s.symbol === e.target.value);
                  setNewAlert({
                    ...newAlert,
                    symbol: e.target.value,
                    name: selected?.name || '',
                  });
                }}
                className={`w-full px-3 py-2 rounded ${inputBg} text-black`}
              >
                <option value="">Select Stock</option>
                {INDIAN_STOCKS.map(stock => (
                  <option key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Alert Type</label>
              <select
                value={newAlert.alertType}
                onChange={e =>
                  setNewAlert({
                    ...newAlert,
                    alertType: e.target.value as 'above' | 'below',
                  })
                }
                className={`w-full px-3 py-2 rounded ${inputBg} text-black`}
              >
                <option value="above">Price goes above</option>
                <option value="below">Price goes below</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Target Price (₹)</label>
              <input
                type="number"
                placeholder="Enter price"
                value={newAlert.targetPrice || ''}
                onChange={e => setNewAlert({ ...newAlert, targetPrice: parseFloat(e.target.value) })}
                className={`w-full px-3 py-2 rounded ${inputBg} text-black`}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddAlert}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold"
            >
              Set Alert
            </button>
            <button
              onClick={() => setShowAddAlert(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-green-500">🟢 Active Alerts ({activeAlerts.length})</h3>
          <div className="space-y-2">
            {activeAlerts.map(alert => (
              <div
                key={alert.id}
                className={`p-3 rounded border-l-4 border-green-500 flex justify-between items-center ${
                  isDarkMode ? 'bg-gray-750' : 'bg-green-50'
                }`}
              >
                <div>
                  <p className="font-bold">{alert.symbol}</p>
                  <p className="text-sm text-gray-500">
                    Alert when price goes {alert.alertType} {formatIndianCurrency(alert.targetPrice)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white"
                    title="Pause alert"
                  >
                    ⏸️
                  </button>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded text-white"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inactive Alerts */}
      {inactiveAlerts.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-3 text-gray-500">⏸️ Inactive Alerts ({inactiveAlerts.length})</h3>
          <div className="space-y-2">
            {inactiveAlerts.map(alert => (
              <div
                key={alert.id}
                className={`p-3 rounded border-l-4 border-gray-500 flex justify-between items-center ${
                  isDarkMode ? 'bg-gray-750' : 'bg-gray-50'
                }`}
              >
                <div>
                  <p className="font-bold text-gray-500">{alert.symbol}</p>
                  <p className="text-sm text-gray-500">
                    Alert when price goes {alert.alertType} {formatIndianCurrency(alert.targetPrice)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className="p-2 bg-green-600 hover:bg-green-700 rounded text-white"
                    title="Resume alert"
                  >
                    ▶️
                  </button>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded text-white"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {alerts.length === 0 && (
        <div className={`text-center py-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded`}>
          <p className="text-gray-500">No alerts yet. Create one to get started!</p>
        </div>
      )}
    </div>
  );
}