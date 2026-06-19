/**
 * Portfolio Types
 */

export interface PortfolioStock {
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number; // Price at which stock was bought
  currentPrice: number;
  totalCost: number; // Quantity * BuyPrice
  currentValue: number; // Quantity * CurrentPrice
  gainLoss: number; // CurrentValue - TotalCost
  gainLossPercent: number;
  buyDate: Date;
  sector: string;
}

export interface Portfolio {
  id: string;
  name: string;
  stocks: PortfolioStock[];
  totalInvestment: number;
  totalCurrentValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  createdAt: Date;
  lastUpdated: Date;
}