'use client';

import { useState } from 'react';
import { formatIndianCurrency } from '@/lib/indian-market-config';

interface EconomicEvent {
  id: string;
  date: Date;
  time: string;
  country: string;
  event: string;
  importance: 'low' | 'medium' | 'high';
  forecast: string;
  previous: string;
  actual?: string;
  impact: 'positive' | 'negative' | 'neutral' | 'pending';
}

const SAMPLE_EVENTS: EconomicEvent[] = [
  {
    id: '1',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    time: '10:00 AM',
    country: '🇮🇳 India',
    event: 'GDP Growth Rate',
    importance: 'high',
    forecast: '5.8%',
    previous: '5.4%',
    impact: 'pending',
  },
  {
    id: '2',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: '02:00 PM',
    country: '🇮🇳 India',
    event: 'Inflation Rate (CPI)',
    importance: 'high',
    forecast: '5.1%',
    previous: '5.5%',
    impact: 'pending',
  },
  {
    id: '3',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    time: '11:30 AM',
    country: '🇮🇳 India',
    event: 'Industrial Production',
    importance: 'medium',
    forecast: '2.1%',
    previous: '1.8%',
    impact: 'pending',
  },
  {
    id: '4',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    time: '03:30 PM',
    country: '🇮🇳 India',
    event: 'Unemployment Rate',
    importance: 'medium',
    forecast: '3.2%',
    previous: '3.5%',
    impact: 'pending',
  },
  {
    id: '5',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    time: '09:00 AM',
    country: '🇮🇳 India',
    event: 'Foreign Exchange Reserves',
    importance: 'low',
    forecast: '$610B',
    previous: '$605B',
    impact: 'pending',
  },
  {
    id: '6',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    time: '02:00 PM',
    country: '🇮🇳 India',
    event: 'RBI Interest Rate Decision',
    importance: 'high',
    forecast: '6.5%',
    previous: '6.5%',
    actual: '6.5%',
    impact: 'neutral',
  },
];

interface EconomicCalendarProps {
  isDarkMode: boolean;
}

export function EconomicCalendar({ isDarkMode }: EconomicCalendarProps) {
  const [filterImportance, setFilterImportance] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterCountry, setFilterCountry] = useState('all');

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';

  // Filter events
  let filteredEvents = SAMPLE_EVENTS;

  if (filterImportance !== 'all') {
    filteredEvents = filteredEvents.filter(e => e.importance === filterImportance);
  }

  if (filterCountry !== 'all') {
    filteredEvents = filteredEvents.filter(e => e.country === filterCountry);
  }

  // Sort by date
  filteredEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800';
      case 'medium':
        return isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
      case 'low':
        return isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800';
      default:
        return '';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return '🟢 Positive';
      case 'negative':
        return '🔴 Negative';
      case 'neutral':
        return '⚪ Neutral';
      default:
        return '⏳ Pending';
    }
  };

  return (
    <div className={`${bgColor} ${textColor} p-6 rounded-lg`}>
      <h2 className="text-2xl font-bold mb-6">📅 Economic Calendar</h2>

      {/* Filters */}
      <div className="mb-6 flex gap-3 flex-wrap">
        <div>
          <label className="block text-sm font-semibold mb-2">Importance</label>
          <div className="flex gap-2">
            {(['all', 'high', 'medium', 'low'] as const).map(level => (
              <button
                key={level}
                onClick={() => setFilterImportance(level)}
                className={`px-3 py-1 rounded font-semibold text-sm ${
                  filterImportance === level
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Country</label>
          <select
            value={filterCountry}
            onChange={e => setFilterCountry(e.target.value)}
            className={`px-3 py-1 rounded font-semibold text-sm ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'
            }`}
          >
            <option value="all">All Countries</option>
            <option value="🇮🇳 India">India</option>
          </select>
        </div>
      </div>

      {/* Events Timeline */}
      <div className="space-y-3">
        {filteredEvents.map((event, idx) => {
          const isUpcoming = event.date > new Date();
          const daysDiff = Math.ceil(
            (event.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <div
              key={event.id}
              className={`p-4 rounded border-l-4 border-blue-500 ${
                isDarkMode
                  ? `${isUpcoming ? 'bg-gray-750' : 'bg-gray-700'}`
                  : `${isUpcoming ? 'bg-blue-50' : 'bg-gray-100'}`
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    {event.date.toLocaleDateString('en-IN')} at {event.time}
                    {isUpcoming && daysDiff >= 0 && (
                      <span className="ml-2 px-2 py-1 bg-yellow-600 text-white text-xs rounded">
                        {daysDiff === 0 ? 'Today' : `in ${daysDiff} days`}
                      </span>
                    )}
                  </p>
                  <h3 className="text-lg font-bold mt-1">{event.event}</h3>
                  <p className="text-sm text-gray-500">{event.country}</p>
                </div>

                <div className="text-right">
                  <span className={`px-3 py-1 rounded text-xs font-bold ${getImportanceColor(event.importance)}`}>
                    {event.importance.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 my-3 p-3 bg-gray-700 rounded">
                <div>
                  <p className="text-xs text-gray-400">Forecast</p>
                  <p className="font-bold text-green-400">{event.forecast}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Previous</p>
                  <p className="font-bold text-blue-400">{event.previous}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Actual</p>
                  <p className="font-bold">{event.actual || '-'}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Impact: {getImpactColor(event.impact)}</p>
                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm font-bold">
                  Add to Watchlist
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className={`text-center py-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded`}>
          <p className="text-gray-500">No events match your filters</p>
        </div>
      )}
    </div>
  );
}