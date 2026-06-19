'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { TradeEntry } from '@/types/journal';

interface JournalContextType {
  trades: TradeEntry[];
  addTrade: (trade: Omit<TradeEntry, 'id' | 'createdAt'>) => void;
  removeTrade: (id: string) => void;
  updateTrade: (id: string, updates: Partial<TradeEntry>) => void;
  getTotalTrades: () => number;
  getWinRate: () => number;
  getTotalProfit: () => number;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [trades, setTrades] = useState<TradeEntry[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tradingJournal');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTrades(parsed);
      } catch (error) {
        console.error('Error loading trades:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('tradingJournal', JSON.stringify(trades));
  }, [trades]);

  const addTrade = (trade: Omit<TradeEntry, 'id' | 'createdAt'>) => {
    const newTrade: TradeEntry = {
      ...trade,
      id: 'trade-' + Date.now(),
      createdAt: new Date(),
    };
    setTrades([...trades, newTrade]);
  };

  const removeTrade = (id: string) => {
    setTrades(trades.filter(t => t.id !== id));
  };

  const updateTrade = (id: string, updates: Partial<TradeEntry>) => {
    setTrades(trades.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const getTotalTrades = () => trades.length;

  const getWinRate = () => {
    if (trades.length === 0) return 0;
    const wins = trades.filter(t => t.result === 'win').length;
    return (wins / trades.length) * 100;
  };

  const getTotalProfit = () => {
    return trades.reduce((sum, t) => sum + (t.profit || 0), 0);
  };

  return (
    <JournalContext.Provider
      value={{
        trades,
        addTrade,
        removeTrade,
        updateTrade,
        getTotalTrades,
        getWinRate,
        getTotalProfit,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within JournalProvider');
  }
  return context;
}