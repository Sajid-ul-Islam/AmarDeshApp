import { useState, useEffect, useCallback } from 'react';
import { Article } from '../types';
import { fetchArticlesWithCache, fetchLatestArticles, cacheArticles } from '../services/rssService';
import { articles as mockArticles } from '../data/mockData';

interface UseArticlesReturn {
  articles: Article[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  isLiveData: boolean;
}

export function useArticles(category?: string): UseArticlesReturn {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveData, setIsLiveData] = useState(false);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to fetch live data from RSS feed
      let liveArticles: Article[] = [];
      
      if (category && category !== 'সর্বশেষ') {
        // For specific categories, fetch all and filter
        const allArticles = await fetchLatestArticles();
        liveArticles = allArticles.filter((a) => a.category === category);
      } else {
        // For home/latest, use cached or fresh data
        liveArticles = await fetchArticlesWithCache();
      }

      if (liveArticles.length > 0) {
        setArticles(liveArticles);
        setIsLiveData(true);
        setLoading(false);
        return;
      }

      // If live data fails, use mock data as fallback
      console.warn('Using mock data as fallback');
      const fallback = category && category !== 'সর্বশেষ'
        ? mockArticles.filter((a) => a.category === category)
        : mockArticles;
      
      setArticles(fallback);
      setIsLiveData(false);
    } catch (err) {
      console.error('Error in useArticles:', err);
      setError('সংবাদ লোড করতে সমস্যা হয়েছে');
      // Use mock data as ultimate fallback
      const fallback = category && category !== 'সর্বশেষ'
        ? mockArticles.filter((a) => a.category === category)
        : mockArticles;
      setArticles(fallback);
      setIsLiveData(false);
    } finally {
      setLoading(false);
    }
  }, [category]);

  const refresh = useCallback(async () => {
    // Clear cache and fetch fresh
    localStorage.removeItem('amardesh_articles_cache');
    await fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { articles, loading, error, refresh, isLiveData };
}
