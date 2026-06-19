'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { PriceAlert } from '@/types/alerts';

interface AlertsContextType {
  alerts: PriceAlert[];
  addAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  removeAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  triggeredAlerts: PriceAlert[];
  clearTriggeredAlert: (id: string) => void;
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [triggeredAlerts, setTriggeredAlerts] = useState<PriceAlert[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('priceAlerts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAlerts(parsed);
      } catch (error) {
        console.error('Error loading alerts:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('priceAlerts', JSON.stringify(alerts));
  }, [alerts]);

  const addAlert = (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: 'alert-' + Date.now(),
      createdAt: new Date(),
    };
    setAlerts([...alerts, newAlert]);

    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Price Alert Set`, {
        body: `Alert set for ${alert.symbol} at ₹${alert.targetPrice}`,
        icon: '📊',
      });
    }
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const toggleAlert = (id: string) => {
    setAlerts(
      alerts.map(a =>
        a.id === id
          ? { ...a, isActive: !a.isActive }
          : a
      )
    );
  };

  const clearTriggeredAlert = (id: string) => {
    setTriggeredAlerts(triggeredAlerts.filter(a => a.id !== id));
  };

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        addAlert,
        removeAlert,
        toggleAlert,
        triggeredAlerts,
        clearTriggeredAlert,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error('useAlerts must be used within AlertsProvider');
  }
  return context;
}