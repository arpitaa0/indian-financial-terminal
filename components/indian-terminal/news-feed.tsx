'use client';

import { useEffect, useState } from 'react';
import { formatIndianCurrency } from '@/lib/indian-market-config';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  relatedStocks: string[];
  publishedAt: Date;
  imageUrl: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

interface NewsFeedProps {
  isDarkMode: boolean;
  relatedStocks?: string[];
  category?: string;
}

export function NewsFeed({ isDarkMode, relatedStocks, category }: NewsFeedProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        let url = '/api/news';
        const params = new URLSearchParams();

        if (relatedStocks && relatedStocks.length > 0) {
          params.append('symbol', relatedStocks[0]);
        }

        if (category) {
          params.append('category', category);
        }

        if (params.toString()) {
          url += '?' + params.toString();
        }

        const response = await fetch(url);
        const data = await response.json();

        // Convert date strings to Date objects
        const newsWithDates = data.news.map((item: any) => ({
          ...item,
          publishedAt: new Date(item.publishedAt),
        }));

        setNews(newsWithDates);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    // Refresh every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [relatedStocks, category]);

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';

  // Filter news by sentiment
  const filteredNews =
    activeTab === 'all'
      ? news
      : news.filter(item => item.sentiment === activeTab);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getSentimentBg = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return isDarkMode ? 'bg-green-900' : 'bg-green-100';
      case 'negative':
        return isDarkMode ? 'bg-red-900' : 'bg-red-100';
      default:
        return isDarkMode ? 'bg-gray-700' : 'bg-gray-100';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className={`${bgColor} ${textColor} p-6 rounded-lg`}>
      <h2 className="text-2xl font-bold mb-4">📰 Market News</h2>

      {/* Sentiment Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['all', 'positive', 'negative', 'neutral'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded whitespace-nowrap font-semibold transition ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {tab === 'all'
              ? '📊 All'
              : tab === 'positive'
              ? '📈 Positive'
              : tab === 'negative'
              ? '📉 Negative'
              : '➡️ Neutral'}
          </button>
        ))}
      </div>

      {/* News List */}
      {loading ? (
        <div className="text-center py-8">
          <p>Loading news...</p>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No news found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNews.map(item => (
            <div
              key={item.id}
              className={`p-4 rounded border-l-4 border-blue-500 hover:shadow-lg transition cursor-pointer ${
                getSentimentBg(item.sentiment)
              }`}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  {item.sentiment === 'positive' ? (
                    <TrendingUp className="text-green-500" size={24} />
                  ) : item.sentiment === 'negative' ? (
                    <TrendingDown className="text-red-500" size={24} />
                  ) : (
                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg flex-1">{item.title}</h3>
                    <span className="text-xs text-gray-500 ml-2">{formatTime(item.publishedAt)}</span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.summary}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded">
                        {item.source}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      {item.relatedStocks.map(stock => (
                        <span
                          key={stock}
                          className="text-xs font-bold bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          {stock}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}