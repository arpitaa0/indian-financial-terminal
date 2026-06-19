'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Portfolio, PortfolioStock } from '@/types/portfolio';

interface PortfolioContextType {
  portfolios: Portfolio[];
  activePortfolio: Portfolio | null;
  createPortfolio: (name: string) => void;
  deletePortfolio: (id: string) => void;
  setActivePortfolio: (id: string) => void;
  addStock: (stock: PortfolioStock) => void;
  removeStock: (symbol: string) => void;
  updateStock: (symbol: string, updates: Partial<PortfolioStock>) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [activePortfolioId, setActivePortfolioId] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('portfolios');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPortfolios(parsed);
        if (parsed.length > 0) {
          setActivePortfolioId(parsed[0].id);
        }
      } catch (error) {
        console.error('Error loading portfolios:', error);
      }
    } else {
      // Create default portfolio
      const defaultPortfolio: Portfolio = {
        id: 'default-' + Date.now(),
        name: 'My Portfolio',
        stocks: [],
        totalInvestment: 0,
        totalCurrentValue: 0,
        totalGainLoss: 0,
        totalGainLossPercent: 0,
        createdAt: new Date(),
        lastUpdated: new Date(),
      };
      setPortfolios([defaultPortfolio]);
      setActivePortfolioId(defaultPortfolio.id);
    }
  }, []);

  // Save to localStorage whenever portfolios change
  useEffect(() => {
    if (portfolios.length > 0) {
      localStorage.setItem('portfolios', JSON.stringify(portfolios));
    }
  }, [portfolios]);

  const activePortfolio = portfolios.find(p => p.id === activePortfolioId) || null;

  const calculatePortfolioTotals = (stocks: PortfolioStock[]) => {
    const totalInvestment = stocks.reduce((sum, s) => sum + s.totalCost, 0);
    const totalCurrentValue = stocks.reduce((sum, s) => sum + s.currentValue, 0);
    const totalGainLoss = totalCurrentValue - totalInvestment;
    const totalGainLossPercent = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

    return {
      totalInvestment,
      totalCurrentValue,
      totalGainLoss,
      totalGainLossPercent,
    };
  };

  const createPortfolio = (name: string) => {
    const newPortfolio: Portfolio = {
      id: 'portfolio-' + Date.now(),
      name,
      stocks: [],
      totalInvestment: 0,
      totalCurrentValue: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };
    setPortfolios([...portfolios, newPortfolio]);
    setActivePortfolioId(newPortfolio.id);
  };

  const deletePortfolio = (id: string) => {
    const filtered = portfolios.filter(p => p.id !== id);
    setPortfolios(filtered);
    if (activePortfolioId === id && filtered.length > 0) {
      setActivePortfolioId(filtered[0].id);
    }
  };

  const setActivePortfolioFn = (id: string) => {
    if (portfolios.find(p => p.id === id)) {
      setActivePortfolioId(id);
    }
  };

  const addStock = (stock: PortfolioStock) => {
    if (!activePortfolio) return;

    const updatedStocks = [...activePortfolio.stocks, stock];
    const totals = calculatePortfolioTotals(updatedStocks);

    setPortfolios(
      portfolios.map(p =>
        p.id === activePortfolioId
          ? {
              ...p,
              stocks: updatedStocks,
              ...totals,
              lastUpdated: new Date(),
            }
          : p
      )
    );
  };

  const removeStock = (symbol: string) => {
    if (!activePortfolio) return;

    const updatedStocks = activePortfolio.stocks.filter(s => s.symbol !== symbol);
    const totals = calculatePortfolioTotals(updatedStocks);

    setPortfolios(
      portfolios.map(p =>
        p.id === activePortfolioId
          ? {
              ...p,
              stocks: updatedStocks,
              ...totals,
              lastUpdated: new Date(),
            }
          : p
      )
    );
  };

  const updateStock = (symbol: string, updates: Partial<PortfolioStock>) => {
    if (!activePortfolio) return;

    const updatedStocks = activePortfolio.stocks.map(s => {
      if (s.symbol === symbol) {
        const updated = { ...s, ...updates };
        // Recalculate values
        updated.totalCost = updated.quantity * updated.buyPrice;
        updated.currentValue = updated.quantity * updated.currentPrice;
        updated.gainLoss = updated.currentValue - updated.totalCost;
        updated.gainLossPercent = (updated.gainLoss / updated.totalCost) * 100;
        return updated;
      }
      return s;
    });

    const totals = calculatePortfolioTotals(updatedStocks);

    setPortfolios(
      portfolios.map(p =>
        p.id === activePortfolioId
          ? {
              ...p,
              stocks: updatedStocks,
              ...totals,
              lastUpdated: new Date(),
            }
          : p
      )
    );
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolios,
        activePortfolio,
        createPortfolio,
        deletePortfolio,
        setActivePortfolio: setActivePortfolioFn,
        addStock,
        removeStock,
        updateStock,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return context;
}