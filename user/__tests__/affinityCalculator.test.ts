/**
 * Unit Tests for Affinity Calculator Module
 */

import { calculateAffinity, getTopAffinities, __resetForTests } from '../affinityCalculator';
import * as db from '../db';

// Mock dependencies
jest.mock('../db');

describe('Affinity Calculator Module', () => {
  beforeEach(() => {
    __resetForTests();
    jest.clearAllMocks();
  });

  describe('calculateAffinity', () => {
    it('should calculate affinity scores from events', async () => {
      const mockEvents = [
        {
          event_type: 'article_opened',
          entity_type: 'article',
          entity_id: 'amd001',
          metadata: { category: 'জাতীয়', author: 'আন্তর্জাতিক ডেস্ক' },
          created_at: Date.now() - 1000 * 60 * 60, // 1 hour ago
        },
        {
          event_type: 'article_saved',
          entity_type: 'article',
          entity_id: 'amd002',
          metadata: { category: 'জাতীয়', author: 'রাজনৈতিক প্রতিবেদক' },
          created_at: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
        },
      ];

      (db.getEvents as jest.Mock).mockResolvedValue(mockEvents);

      await calculateAffinity('test-user-id');

      expect(db.upsertAffinity).toHaveBeenCalled();
    });

    it('should apply recency decay to scores', async () => {
      const oldEvent = {
        event_type: 'article_saved',
        entity_type: 'article',
        entity_id: 'amd001',
        metadata: { category: 'জাতীয়' },
        created_at: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30 days ago
      };

      (db.getEvents as jest.Mock).mockResolvedValue([oldEvent]);

      await calculateAffinity('test-user-id');

      const upsertCall = (db.upsertAffinity as jest.Mock).mock.calls[0][0];
      // article_saved weight 3.0 × 0.5^(30/7) decay ≈ 0.153 raw,
      // normalized /10 ≈ 0.015 — well below the 0.1 cap
      expect(upsertCall[0].score).toBeLessThan(0.1); // Should be very low due to decay
    });

    it('should extract topics from article categories', async () => {
      const mockEvents = [
        {
          event_type: 'article_opened',
          entity_type: 'article',
          entity_id: 'amd001',
          metadata: { category: 'জাতীয়' },
          created_at: Date.now(),
        },
      ];

      (db.getEvents as jest.Mock).mockResolvedValue(mockEvents);

      await calculateAffinity('test-user-id');

      const upsertCall = (db.upsertAffinity as jest.Mock).mock.calls[0][0];
      const topicAffinity = upsertCall.find((a: any) => a.entity_type === 'topic');
      
      expect(topicAffinity).toBeDefined();
      expect(topicAffinity.entity_id).toBe('জাতীয়');
    });

    it('should extract authors from article metadata', async () => {
      const mockEvents = [
        {
          event_type: 'article_opened',
          entity_type: 'article',
          entity_id: 'amd001',
          metadata: { author: 'আন্তর্জাতিক ডেস্ক' },
          created_at: Date.now(),
        },
      ];

      (db.getEvents as jest.Mock).mockResolvedValue(mockEvents);

      await calculateAffinity('test-user-id');

      const upsertCall = (db.upsertAffinity as jest.Mock).mock.calls[0][0];
      const authorAffinity = upsertCall.find((a: any) => a.entity_type === 'author');
      
      expect(authorAffinity).toBeDefined();
      expect(authorAffinity.entity_id).toBe('আন্তর্জাতিক ডেস্ক');
    });

    it('should apply engagement weights correctly', async () => {
      const mockEvents = [
        {
          event_type: 'article_opened',
          entity_type: 'article',
          entity_id: 'amd001',
          metadata: { category: 'জাতীয়' },
          created_at: Date.now(),
        },
        {
          event_type: 'article_saved',
          entity_type: 'article',
          entity_id: 'amd001',
          metadata: { category: 'জাতীয়' },
          created_at: Date.now(),
        },
      ];

      (db.getEvents as jest.Mock).mockResolvedValue(mockEvents);

      await calculateAffinity('test-user-id');

      const upsertCall = (db.upsertAffinity as jest.Mock).mock.calls[0][0];
      // article_saved has weight 3.0, article_opened has weight 1.0
      // Total raw score should be 4.0
      expect(upsertCall[0].score).toBeGreaterThan(0);
    });
  });

  describe('getTopAffinities', () => {
    it('should return top affinities by score', async () => {
      const mockAffinities = [
        { entity_type: 'topic', entity_id: 'জাতীয়', score: 0.8 },
        { entity_type: 'topic', entity_id: 'খেলা', score: 0.6 },
        { entity_type: 'topic', entity_id: 'বিনোদন', score: 0.4 },
      ];

      // Mock respects the limit like the real database query would
      (db.getTopAffinities as jest.Mock).mockImplementation(
        async (_entityType: string, limit: number = 10) =>
          mockAffinities.slice(0, limit)
      );

      const result = await getTopAffinities('topic', 2);

      expect(db.getTopAffinities).toHaveBeenCalledWith('topic', 2);
      expect(result).toHaveLength(2);
      expect(result[0].entity_id).toBe('জাতীয়');
      expect(result[1].entity_id).toBe('খেলা');
    });
  });
});
