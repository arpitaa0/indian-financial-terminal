/**
 * Indian Market Configuration
 */

// ============== INDIAN INDICES ==============
export const INDIAN_INDICES = {
  NIFTY_50: {
    id: 'nifty50',
    symbol: '^NSEI',
    name: 'Nifty 50',
    exchange: 'NSE',
  },
  SENSEX: {
    id: 'sensex',
    symbol: '^BSESN',
    name: 'BSE Sensex',
    exchange: 'BSE',
  },
  NIFTY_BANK: {
    id: 'nifty_bank',
    symbol: '^NSEBANK',
    name: 'Nifty Bank',
    exchange: 'NSE',
  },
};

// ============== INDIAN STOCKS ==============
export const INDIAN_STOCKS = [
  { symbol: 'RELIANCE.NSE', name: 'Reliance Industries', sector: 'Energy' },
  { symbol: 'TCS.NSE', name: 'Tata Consultancy Services', sector: 'IT' },
  { symbol: 'INFY.NSE', name: 'Infosys Limited', sector: 'IT' },
  { symbol: 'HDFCBANK.NSE', name: 'HDFC Bank', sector: 'Banking' },
  { symbol: 'ICICIBANK.NSE', name: 'ICICI Bank', sector: 'Banking' },
  { symbol: 'SBIN.NSE', name: 'State Bank of India', sector: 'Banking' },
  { symbol: 'HDFC.NSE', name: 'HDFC', sector: 'Banking' },
  { symbol: 'ASIANPAINT.NSE', name: 'Asian Paints', sector: 'Paints' },
  { symbol: 'BAJAJFINSV.NSE', name: 'Bajaj Finserv', sector: 'Finance' },
  { symbol: 'LT.NSE', name: 'Larsen & Toubro', sector: 'Construction' },
];

// ============== MARKET HOURS ==============
export const MARKET_HOURS = {
  timezone: 'Asia/Kolkata',
  timezoneName: 'IST',
  marketOpen: '09:15',
  marketClose: '15:30',
  tradingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
};

// ============== CURRENCY ==============
export const INDIAN_CURRENCY = {
  symbol: '₹',
  code: 'INR',
};

// Format currency function
export function formatIndianCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(value);
}

// ============== NEWS SOURCES ==============
export const NEWS_SOURCES = [
  'Moneycontrol',
  'Economic Times',
  'Livemint',
  'CNBC-TV18',
  'Business Today',
];