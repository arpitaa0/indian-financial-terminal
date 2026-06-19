export interface PriceAlert {
  id: string;
  symbol: string;
  name: string;
  alertType: 'above' | 'below'; // Alert when price goes above or below
  targetPrice: number;
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}