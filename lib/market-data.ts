/**
 * Market Data API Service
 * Fetches data from Alpha Vantage for Indian stocks
 */

import type { StockData, IndexData } from '@/types/market';
import { INDIAN_STOCKS, INDIAN_INDICES } from './indian-market-config';

// ============== FETCH STOCK DATA ==============
export async function fetchStockData(symbol: string): Promise<StockData | null> {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
      console.error('ALPHA_VANTAGE_API_KEY not set');
      return generateFallbackStockData(symbol);
    }

    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    );

    const data = await response.json();
    const quote = data['Global Quote'];

    if (!quote || Object.keys(quote).length === 0) {
      return generateFallbackStockData(symbol);
    }

    const price = parseFloat(quote['05. price']) || 0;
    const change = parseFloat(quote['09. change']) || 0;
    const pctChange = parseFloat(quote['10. change percent']) || 0;

    const stockInfo = INDIAN_STOCKS.find(s => s.symbol === symbol);

    return {
      id: symbol,
      symbol: symbol,
      name: stockInfo?.name || symbol,
      sector: stockInfo?.sector || 'Unknown',
      exchange: 'NSE',
      currentPrice: price,
      change: change,
      pctChange: pctChange,
      openPrice: parseFloat(quote['02. open']) || 0,
      highPrice: parseFloat(quote['03. high']) || 0,
      lowPrice: parseFloat(quote['04. low']) || 0,
      volume: parseInt(quote['06. volume']) || 0,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return generateFallbackStockData(symbol);
  }
}

// ============== FETCH MULTIPLE STOCKS ==============
export async function fetchMultipleStocks(symbols: string[]): Promise<StockData[]> {
  const stocks: StockData[] = [];

  for (const symbol of symbols) {
    const stock = await fetchStockData(symbol);
    if (stock) {
      stocks.push(stock);
    }
    // Delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return stocks;
}

// ============== FETCH INDEX DATA ==============
export async function fetchIndexData(symbol: string): Promise<IndexData | null> {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) return generateFallbackIndexData(symbol);

    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    );

    const data = await response.json();
    const quote = data['Global Quote'];

    if (!quote || Object.keys(quote).length === 0) {
      return generateFallbackIndexData(symbol);
    }

    const value = parseFloat(quote['05. price']) || 0;
    const change = parseFloat(quote['09. change']) || 0;
    const pctChange = parseFloat(quote['10. change percent']) || 0;

    const indexInfo = Object.values(INDIAN_INDICES).find(idx => idx.symbol === symbol);

    return {
      id: symbol,
      symbol: symbol,
      name: indexInfo?.name || symbol,
      exchange: indexInfo?.exchange || 'NSE',
      value: value,
      change: change,
      pctChange: pctChange,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error('Error fetching index data:', error);
    return generateFallbackIndexData(symbol);
  }
}

// ============== FALLBACK DATA (For testing without API) ==============
export function generateFallbackStockData(symbol: string): StockData {
  const basePrice = Math.random() * 4000 + 200;
  const change = (Math.random() - 0.5) * 100;
  const pctChange = (change / basePrice) * 100;

  const stockInfo = INDIAN_STOCKS.find(s => s.symbol === symbol);

  return {
    id: symbol,
    symbol: symbol,
    name: stockInfo?.name || symbol,
    sector: stockInfo?.sector || 'Unknown',
    exchange: 'NSE',
    currentPrice: Number(basePrice.toFixed(2)),
    change: Number(change.toFixed(2)),
    pctChange: Number(pctChange.toFixed(2)),
    openPrice: Number((basePrice - Math.random() * 50).toFixed(2)),
    highPrice: Number((basePrice + Math.random() * 50).toFixed(2)),
    lowPrice: Number((basePrice - Math.random() * 100).toFixed(2)),
    volume: Math.floor(Math.random() * 10000000),
    lastUpdated: new Date(),
  };
}

export function generateFallbackIndexData(symbol: string): IndexData {
  const value = Math.random() * 10000 + 50000;
  const change = (Math.random() - 0.5) * 500;
  const pctChange = (change / value) * 100;

  const indexInfo = Object.values(INDIAN_INDICES).find(idx => idx.symbol === symbol);

  return {
    id: symbol,
    symbol: symbol,
    name: indexInfo?.name || symbol,
    exchange: indexInfo?.exchange || 'NSE',
    value: Number(value.toFixed(2)),
    change: Number(change.toFixed(2)),
    pctChange: Number(pctChange.toFixed(2)),
    lastUpdated: new Date(),
  };
}

// ============== FETCH ALL MARKET DATA ==============
export async function fetchCompleteMarketData() {
  try {
    // Fetch indices
    const nifty = await fetchIndexData('^NSEI');
    const sensex = await fetchIndexData('^BSESN');
    const niftyBank = await fetchIndexData('^NSEBANK');

    const indices = [nifty, sensex, niftyBank].filter(Boolean) as IndexData[];

    // Fetch stocks
    const symbols = INDIAN_STOCKS.map(s => s.symbol);
    const stocks = await fetchMultipleStocks(symbols);

    // Sort for top gainers and losers
    const sortedByChange = [...stocks].sort((a, b) => b.pctChange - a.pctChange);
    const topGainers = sortedByChange.slice(0, 5);
    const topLosers = sortedByChange.slice(-5).reverse();

    // Sort by volume for most active
    const sortedByVolume = [...stocks].sort((a, b) => b.volume - a.volume);
    const mostActive = sortedByVolume.slice(0, 5);

    return {
      indices,
      topGainers,
      topLosers,
      mostActive,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error('Error fetching complete market data:', error);
    return {
      indices: [],
      topGainers: [],
      topLosers: [],
      mostActive: [],
      lastUpdated: new Date(),
    };
  }
}