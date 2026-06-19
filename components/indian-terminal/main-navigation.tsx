'use client';

import { useState } from 'react';
import { MarketDashboard } from './market-dashboard';
import { Portfolio } from './portfolio';
import { PriceAlerts } from './price-alerts';
import { TradingJournal } from './trading-journal';
import { StockScreener } from './stock-screener';
import { EconomicCalendar } from './economic-calendar';

type Page = 'dashboard' | 'portfolio' | 'alerts' | 'journal' | 'screener' | 'calendar';

export function MainNavigation() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';

  return (
    <div className={`${bgColor} ${textColor} min-h-screen`}>
      {/* Navigation Bar */}
      <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">🇮🇳 Indian Financial Terminal</h1>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 flex-wrap">
            {[
              { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
              { id: 'portfolio', label: '💼 Portfolio', icon: '💼' },
              { id: 'alerts', label: '🔔 Alerts', icon: '🔔' },
              { id: 'journal', label: '📔 Journal', icon: '📔' },
              { id: 'screener', label: '🔍 Screener', icon: '🔍' },
              { id: 'calendar', label: '📅 Calendar', icon: '📅' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentPage(tab.id as Page)}
                className={`px-4 py-2 rounded font-semibold whitespace-nowrap transition ${
                  currentPage === tab.id
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {currentPage === 'dashboard' && <MarketDashboard />}
        {currentPage === 'portfolio' && <Portfolio isDarkMode={isDarkMode} />}
        {currentPage === 'alerts' && <PriceAlerts isDarkMode={isDarkMode} />}
        {currentPage === 'journal' && <TradingJournal isDarkMode={isDarkMode} />}
        {currentPage === 'screener' && <StockScreener isDarkMode={isDarkMode} />}
        {currentPage === 'calendar' && <EconomicCalendar isDarkMode={isDarkMode} />}
      </div>
    </div>
  );
}