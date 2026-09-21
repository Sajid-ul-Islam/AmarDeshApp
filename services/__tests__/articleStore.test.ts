/**
 * Unit Tests for the Shared Article Store
 *
 * The store is the single source of truth for live news. These tests mock
 * the RSS service and verify:
 * - fetch deduplication (one in-flight request shared across callers)
 * - network-first, cache-fallback behavior
 * - caching every successful fetch for offline use
 * - subscriber notification and synchronous reads
 */

import { Article } from '../../data/mockData';

jest.mock('../../services/rssService', () => ({
  fetchRSSFeed: jest.fn(),
  cacheRSSFeed: jest.fn(async () => undefined),
  getCachedRSSFeed: jest.fn(async () => []),
}));

import {
  loadArticles,
  getArticles,
  subscribeToArticles,
  getArticleById,
  warmArticleStore,
  __resetArticleStoreForTests,
} from '../../services/articleStore';
import {
  fetchRSSFeed,
  cacheRSSFeed,
  getCachedRSSFeed,
} from '../../services/rssService';

const mockFetchRSSFeed = fetchRSSFeed as jest.Mock;
const mockCacheRSSFeed = cacheRSSFeed as jest.Mock;
const mockGetCachedRSSFeed = getCachedRSSFeed as jest.Mock;

const makeArticle = (id: string, title = `Article ${id}`): Article => ({
  id,
  title,
  excerpt: 'excerpt',
  content: 'content',
  category: 'জাতীয়',
  imageUrl: 'https://example.com/img.jpg',
  author: 'লেখক',
  publishedAt: new Date().toISOString(),
});

beforeEach(() => {
  __resetArticleStoreForTests();
  jest.clearAllMocks();
  mockGetCachedRSSFeed.mockResolvedValue([]);
});

describe('articleStore', () => {
  describe('loadArticles', () => {
    it('returns network articles and caches them', async () => {
      const fresh = [makeArticle('rss-a1')];
      mockFetchRSSFeed.mockResolvedValue(fresh);

      const result = await loadArticles();

      expect(result).toEqual(fresh);
      expect(getArticles()).toEqual(fresh);
      expect(mockCacheRSSFeed).toHaveBeenCalledWith(fresh);
    });

    it('deduplicates concurrent calls into one network request', async () => {
      mockFetchRSSFeed.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve([makeArticle('rss-a1')]), 10))
      );

      const [a, b, c] = await Promise.all([
        loadArticles(),
        loadArticles(),
        loadArticles(),
      ]);

      expect(mockFetchRSSFeed).toHaveBeenCalledTimes(1);
      expect(a).toEqual(b);
      expect(b).toEqual(c);
    });

    it('falls back to cache when the network returns nothing', async () => {
      const cached = [makeArticle('rss-cached')];
      mockFetchRSSFeed.mockResolvedValue([]);
      mockGetCachedRSSFeed.mockResolvedValue(cached);

      const result = await loadArticles();

      expect(result).toEqual(cached);
      expect(getArticles()).toEqual(cached);
      // Nothing fresh → nothing new to cache
      expect(mockCacheRSSFeed).not.toHaveBeenCalled();
    });

    it('falls back to cache when the network throws', async () => {
      const cached = [makeArticle('rss-cached')];
      mockFetchRSSFeed.mockRejectedValue(new Error('offline'));
      mockGetCachedRSSFeed.mockResolvedValue(cached);

      const result = await loadArticles();

      expect(result).toEqual(cached);
    });

    it('returns empty (not mock data) when both network and cache fail', async () => {
      mockFetchRSSFeed.mockResolvedValue([]);
      mockGetCachedRSSFeed.mockResolvedValue([]);

      const result = await loadArticles();

      expect(result).toEqual([]);
      expect(getArticles()).toEqual([]);
    });

    it('serves the in-memory list without refetching on subsequent calls', async () => {
      mockFetchRSSFeed.mockResolvedValue([makeArticle('rss-a1')]);

      await loadArticles();
      await loadArticles();
      await loadArticles();

      expect(mockFetchRSSFeed).toHaveBeenCalledTimes(1);
    });

    it('forces a network refresh when forceRefresh is true', async () => {
      mockFetchRSSFeed.mockResolvedValue([makeArticle('rss-a1')]);

      await loadArticles();
      await loadArticles(true);

      expect(mockFetchRSSFeed).toHaveBeenCalledTimes(2);
    });
  });

  describe('subscriptions', () => {
    it('notifies subscribers when fresh articles arrive', async () => {
      const fresh = [makeArticle('rss-a1'), makeArticle('rss-a2')];
      mockFetchRSSFeed.mockResolvedValue(fresh);

      const listener = jest.fn();
      const unsubscribe = subscribeToArticles(listener);

      await loadArticles();

      expect(listener).toHaveBeenCalledWith(fresh);

      unsubscribe();
    });

    it('stops notifying after unsubscribe', async () => {
      mockFetchRSSFeed.mockResolvedValue([makeArticle('rss-a1')]);

      const listener = jest.fn();
      const unsubscribe = subscribeToArticles(listener);
      unsubscribe();

      await loadArticles();

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('getArticleById', () => {
    it('finds articles after load', async () => {
      const fresh = [makeArticle('rss-x1', 'A real headline')];
      mockFetchRSSFeed.mockResolvedValue(fresh);
      await loadArticles();

      expect(getArticleById('rss-x1')?.title).toBe('A real headline');
      expect(getArticleById('missing')).toBeUndefined();
    });

    it('returns undefined before any load', () => {
      expect(getArticleById('rss-x1')).toBeUndefined();
    });
  });

  describe('warmArticleStore', () => {
    it('kicks off a load without throwing', async () => {
      mockFetchRSSFeed.mockResolvedValue([makeArticle('rss-a1')]);

      expect(() => warmArticleStore()).not.toThrow();

      // Allow the fire-and-forget promise to settle
      await new Promise((resolve) => setImmediate(resolve));
      expect(getArticles()).toHaveLength(1);
    });
  });
});
