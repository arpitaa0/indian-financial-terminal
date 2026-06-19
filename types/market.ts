/**
 * Market Data Types
 */

export interface StockData {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  exchange: string;
  currentPrice: number;
  change: number;
  pctChange: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  lastUpdated: Date;
}

export interface IndexData {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  value: number;
  change: number;
  pctChange: number;
  lastUpdated: Date;
}

export interface MarketData {
  indices: IndexData[];
  topGainers: StockData[];
  topLosers: StockData[];
  mostActive: StockData[];
  lastUpdated: Date;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: Date;
  category: string;
  relatedStocks?: string[];
}