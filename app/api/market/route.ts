import { fetchCompleteMarketData } from '@/lib/market-data';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const marketData = await fetchCompleteMarketData();
    return NextResponse.json(marketData);
  } catch (error) {
    console.error('Error in market API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}