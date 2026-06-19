import { NextRequest, NextResponse } from 'next/server';

const SAMPLE_NEWS = [
  {
    id: '1',
    title: 'TCS Q3 Results Beat Expectations with Strong Revenue Growth',
    summary:
      'Tata Consultancy Services reported Q3 earnings of ₹12,800 Cr, beating analyst expectations',
    source: 'Moneycontrol',
    url: 'https://www.moneycontrol.com',
    category: 'Earnings',
    relatedStocks: ['TCS.NSE'],
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    imageUrl: 'https://via.placeholder.com/300x200',
    sentiment: 'positive',
  },
  {
    id: '2',
    title: 'Reliance Industries to Expand Oil Refining Capacity',
    summary: 'Reliance announces investment of ₹50,000 Cr for new refinery project',
    source: 'Economic Times',
    url: 'https://economictimes.indiatimes.com',
    category: 'Corporate',
    relatedStocks: ['RELIANCE.NSE'],
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    imageUrl: 'https://via.placeholder.com/300x200',
    sentiment: 'positive',
  },
  {
    id: '3',
    title: 'RBI Keeps Repo Rate Unchanged at 6.5%',
    summary: 'Reserve Bank of India maintains status quo on monetary policy',
    source: 'Livemint',
    url: 'https://www.livemint.com',
    category: 'Policy',
    relatedStocks: ['SBIN.NSE', 'HDFCBANK.NSE', 'ICICIBANK.NSE'],
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    imageUrl: 'https://via.placeholder.com/300x200',
    sentiment: 'neutral',
  },
  {
    id: '4',
    title: 'Infosys Faces Margin Pressure Due to Rising Costs',
    summary: 'IT major Infosys warns of potential margin compression in coming quarters',
    source: 'Business Today',
    url: 'https://www.businesstoday.in',
    category: 'Corporate',
    relatedStocks: ['INFY.NSE'],
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    imageUrl: 'https://via.placeholder.com/300x200',
    sentiment: 'negative',
  },
  {
    id: '5',
    title: 'HDFC Bank Q3 Profit Grows 15% YoY',
    summary: 'HDFC Bank reports strong profit growth driven by loan portfolio expansion',
    source: 'CNBC-TV18',
    url: 'https://www.cnbctv18.com',
    category: 'Earnings',
    relatedStocks: ['HDFCBANK.NSE'],
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    imageUrl: 'https://via.placeholder.com/300x200',
    sentiment: 'positive',
  },
  {
    id: '6',
    title: 'Asian Paints to Launch Premium Paint Range',
    summary: 'Asian Paints announces launch of new premium paint collection targeting luxury segment',
    source: 'Moneycontrol',
    url: 'https://www.moneycontrol.com',
    category: 'Product Launch',
    relatedStocks: ['ASIANPAINT.NSE'],
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    imageUrl: 'https://via.placeholder.com/300x200',
    sentiment: 'positive',
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const category = searchParams.get('category');

    let filteredNews = SAMPLE_NEWS;

    // Filter by stock symbol
    if (symbol) {
      filteredNews = filteredNews.filter(news =>
        news.relatedStocks.includes(symbol)
      );
    }

    // Filter by category
    if (category) {
      filteredNews = filteredNews.filter(
        news => news.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Sort by date (newest first)
    filteredNews.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return NextResponse.json({
      news: filteredNews,
      count: filteredNews.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}