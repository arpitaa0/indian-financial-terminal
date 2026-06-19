export interface TradeEntry {
  id: string;
  symbol: string;
  tradeType: 'buy' | 'sell'; // Buy or Sell
  quantity: number;
  price: number;
  totalAmount: number;
  date: Date;
  reason: string; // Why did you make this trade?
  result: 'win' | 'loss' | 'breakeven' | 'pending';
  profit?: number; // Profit/Loss on this trade
  profitPercent?: number;
  notes?: string;
  createdAt: Date;
}