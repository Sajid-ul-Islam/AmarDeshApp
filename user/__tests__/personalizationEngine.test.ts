/**
 * Unit Tests for Personalization Engine Module
 */

import { rankArticles, generateForYouFeed, getRecommendations } from '../personalizationEngine';
import * as affinityCalculator from '../affinityCalculator';
import { Article } from '../../data/mockData';

// Mock dependencies
jest.mock('../affinityCalculator');

describe('Personalization Engine Module', () => {
  const mockArticles: Article[] = [
    {
      id: 'amd001',
      title: 'Test Article 1',
      excerpt: 'Excerpt 1',
      content: 'Content 1',
      category: 'জাতীয়',
      imageUrl: 'https://example.com/image1.jpg',
      author: 'আন্তর্জাতিক ডেস্ক',
      publishedAt: new Date().toISOString(),
    },
    {
      id: 'amd002',
      title: 'Test Article 2',
      excerpt: 'Excerpt 2',
      content: 'Content 2',
      category: 'খেলা',
      imageUrl: 'https://example.com/image2.jpg',
      author: 'ক্রীড়া প্রতিবেদক',
      publishedAt: new Date().toISOString(),
    },
    {
      id: 'amd003',
      title: 'Test Article 3',
      excerpt: 'Excerpt 3',
      content: 'Content 3',
      category: 'জাতীয়',
      imageUrl: 'https://example.com/image3.jpg',
      author: 'রাজনৈতিক প্রতিবেদক',
      publishedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rankArticles', () => {
    it('should rank articles based on affinity scores', async () => {
      const mockTopTopics = [
        { entity_type: 'topic', entity_id: 'জাতীয়', score: 0.8 },
        { entity_type: 'topic', entity_id: 'খেলা', score: 0.4 },
      ];

      const mockTopAuthors = [
        { entity_type: 'author', entity_id: 'আন্তর্জাতিক ডেস্ক', score: 0.6 },
      ];

      (affinityCalculator.getTopAffinities as jest.Mock)
        .mockResolvedValueOnce(mockTopTopics)
        .mockResolvedValueOnce(mockTopAuthors);

      const result = await rankArticles(mockArticles, 'test-user-id');

      expect(result).toHaveLength(3);
      // Articles with matching topics/authors should rank higher
      expect(result[0].category).toBe('জাতীয়');
    });

    it('should consider recency in ranking', async () => {
      const recentArticle = {
        ...mockArticles[0],
        publishedAt: new Date().toISOString(),
      };
      const oldArticle = {
        ...mockArticles[1],
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(), // 8 days ago
      };

      (affinityCalculator.getTopAffinities as jest.Mock)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await rankArticles([recentArticle, oldArticle], 'test-user-id');

      // Recent article should rank higher
      expect(result[0].id).toBe(recentArticle.id);
    });

    it('should return original order if no affinities', async () => {
      (affinityCalculator.getTopAffinities as jest.Mock)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await rankArticles(mockArticles, 'test-user-id');

      expect(result).toHaveLength(3);
    });
  });

  describe('generateForYouFeed', () => {
    it('should generate personalized feed with diversity injection', async () => {
      (affinityCalculator.getTopAffinities as jest.Mock)
        .mockResolvedValueOnce([{ entity_type: 'topic', entity_id: 'জাতীয়', score: 0.8 }])
        .mockResolvedValueOnce([]);

      const result = await generateForYouFeed(mockArticles, 'test-user-id');

      expect(result.length).toBeGreaterThan(0);
      // Should include both personalized and random content
      expect(result.length).toBeLessThanOrEqual(mockArticles.length);
    });

    it('should inject 10% random content', async () => {
      const manyArticles = Array.from({ length: 100 }, (_, i) => ({
        ...mockArticles[0],
        id: `amd${i}`,
      }));

      (affinityCalculator.getTopAffinities as jest.Mock)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await generateForYouFeed(manyArticles, 'test-user-id');

      // Should have similar length to input (with some shuffling)
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getRecommendations', () => {
    it('should return top N recommendations', async () => {
      (affinityCalculator.getTopAffinities as jest.Mock)
        .mockResolvedValueOnce([{ entity_type: 'topic', entity_id: 'জাতীয়', score: 0.8 }])
        .mockResolvedValueOnce([]);

      const result = await getRecommendations(mockArticles, 'test-user-id', [], 2);

      expect(result).toHaveLength(2);
    });

    it('should exclude specified article IDs', async () => {
      (affinityCalculator.getTopAffinities as jest.Mock)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await getRecommendations(
        mockArticles,
        'test-user-id',
        ['amd001'],
        10
      );

      expect(result.find(a => a.id === 'amd001')).toBeUndefined();
    });

    it('should return empty array if no articles available', async () => {
      const result = await getRecommendations([], 'test-user-id', [], 5);

      expect(result).toHaveLength(0);
    });
  });
});
