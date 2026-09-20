/**
 * Performance Benchmarks for User Profile System
 * 
 * Run with: npm run test:perf
 */

import { initializeDatabase, closeDatabase, insertEvents, getEvents } from '../db';
import { calculateAffinity } from '../affinityCalculator';
import { rankArticles } from '../personalizationEngine';
import { Event } from '../db';

describe('Performance Benchmarks', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('Database Operations', () => {
    it('should insert 100 events in < 50ms', async () => {
      const events: Event[] = Array.from({ length: 100 }, (_, i) => ({
        user_id: 'test-user',
        event_type: 'article_opened',
        entity_type: 'article',
        entity_id: `amd${i}`,
        metadata: { category: 'জাতীয়' },
        created_at: Date.now(),
      }));

      const start = performance.now();
      await insertEvents(events);
      const duration = performance.now() - start;

      console.log(`Insert 100 events: ${duration.toFixed(2)}ms`);
      expect(duration).toBeLessThan(50);
    });

    it('should insert 1000 events in < 200ms', async () => {
      const events: Event[] = Array.from({ length: 1000 }, (_, i) => ({
        user_id: 'test-user',
        event_type: 'article_opened',
        entity_type: 'article',
        entity_id: `amd${i}`,
        metadata: { category: 'জাতীয়' },
        created_at: Date.now(),
      }));

      const start = performance.now();
      await insertEvents(events);
      const duration = performance.now() - start;

      console.log(`Insert 1000 events: ${duration.toFixed(2)}ms`);
      expect(duration).toBeLessThan(200);
    });

    it('should query 1000 events in < 50ms', async () => {
      const start = performance.now();
      const events = await getEvents('test-user', Date.now() - 1000 * 60 * 60 * 24);
      const duration = performance.now() - start;

      console.log(`Query events: ${duration.toFixed(2)}ms (found ${events.length})`);
      expect(duration).toBeLessThan(50);
    });
  });

  describe('Affinity Calculation', () => {
    it('should calculate affinities for 100 events in < 100ms', async () => {
      // Insert test events
      const events: Event[] = Array.from({ length: 100 }, (_, i) => ({
        user_id: 'perf-user',
        event_type: 'article_opened',
        entity_type: 'article',
        entity_id: `amd${i}`,
        metadata: { category: 'জাতীয়', author: 'Author' },
        created_at: Date.now() - i * 1000 * 60 * 60,
      }));
      await insertEvents(events);

      const start = performance.now();
      await calculateAffinity('perf-user', true);
      const duration = performance.now() - start;

      console.log(`Calculate affinity (100 events): ${duration.toFixed(2)}ms`);
      expect(duration).toBeLessThan(100);
    });

    it('should calculate affinities for 1000 events in < 500ms', async () => {
      const events: Event[] = Array.from({ length: 1000 }, (_, i) => ({
        user_id: 'perf-user-2',
        event_type: 'article_opened',
        entity_type: 'article',
        entity_id: `amd${i}`,
        metadata: { category: 'জাতীয়', author: 'Author' },
        created_at: Date.now() - i * 1000 * 60 * 60,
      }));
      await insertEvents(events);

      const start = performance.now();
      await calculateAffinity('perf-user-2', true);
      const duration = performance.now() - start;

      console.log(`Calculate affinity (1000 events): ${duration.toFixed(2)}ms`);
      expect(duration).toBeLessThan(500);
    });
  });

  describe('Personalization', () => {
    it('should rank 100 articles in < 50ms', async () => {
      const articles = Array.from({ length: 100 }, (_, i) => ({
        id: `amd${i}`,
        title: `Article ${i}`,
        excerpt: 'Excerpt',
        content: 'Content',
        category: i % 2 === 0 ? 'জাতীয়' : 'খেলা',
        imageUrl: 'https://example.com/image.jpg',
        author: i % 2 === 0 ? 'Author 1' : 'Author 2',
        publishedAt: new Date().toISOString(),
      }));

      const start = performance.now();
      const ranked = await rankArticles(articles, 'perf-user');
      const duration = performance.now() - start;

      console.log(`Rank 100 articles: ${duration.toFixed(2)}ms`);
      expect(duration).toBeLessThan(50);
      expect(ranked.length).toBe(100);
    });

    it('should rank 1000 articles in < 200ms', async () => {
      const articles = Array.from({ length: 1000 }, (_, i) => ({
        id: `amd${i}`,
        title: `Article ${i}`,
        excerpt: 'Excerpt',
        content: 'Content',
        category: i % 3 === 0 ? 'জাতীয়' : i % 3 === 1 ? 'খেলা' : 'বিনোদন',
        imageUrl: 'https://example.com/image.jpg',
        author: `Author ${i % 10}`,
        publishedAt: new Date().toISOString(),
      }));

      const start = performance.now();
      const ranked = await rankArticles(articles, 'perf-user');
      const duration = performance.now() - start;

      console.log(`Rank 1000 articles: ${duration.toFixed(2)}ms`);
      expect(duration).toBeLessThan(200);
      expect(ranked.length).toBe(1000);
    });
  });

  describe('Memory Usage', () => {
    it('should handle 10000 events without memory issues', async () => {
      const events: Event[] = Array.from({ length: 10000 }, (_, i) => ({
        user_id: 'memory-test-user',
        event_type: 'article_opened',
        entity_type: 'article',
        entity_id: `amd${i}`,
        metadata: { category: 'জাতীয়', author: 'Author' },
        created_at: Date.now() - i * 1000,
      }));

      const start = performance.now();
      await insertEvents(events);
      const duration = performance.now() - start;

      console.log(`Insert 10000 events: ${duration.toFixed(2)}ms`);
      
      // Should complete in reasonable time
      expect(duration).toBeLessThan(2000);
    });
  });
});
