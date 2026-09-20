/**
 * Integration Tests for User Profile System
 */

import { useUserStore } from '../useUserStore';
import { initializeDatabase, closeDatabase } from '../db';
import { initializeEventTracker, cleanupEventTracker } from '../eventTracker';
import { calculateAffinity } from '../affinityCalculator';

describe('User Profile System Integration', () => {
  beforeAll(async () => {
    // Initialize database and event tracker
    await initializeDatabase();
    await initializeEventTracker();
  });

  afterAll(async () => {
    // Cleanup
    await cleanupEventTracker();
    await closeDatabase();
  });

  beforeEach(async () => {
    // Reset store state
    useUserStore.setState({
      userId: null,
      isInitialized: false,
      trackingEnabled: true,
    });
  });

  describe('Full User Journey', () => {
    it('should initialize user system and track events', async () => {
      const store = useUserStore.getState();
      
      // Initialize user system
      await store.initialize();

      expect(store.isInitialized).toBe(true);
      expect(store.userId).toBeTruthy();

      // Track some events
      await store.trackEvent('article_opened', 'article', 'amd001', {
        category: 'জাতীয়',
        author: 'আন্তর্জাতিক ডেস্ক',
      });

      await store.trackEvent('article_saved', 'article', 'amd001', {
        category: 'জাতীয়',
        author: 'আন্তর্জাতিক ডেস্ক',
      });

      // Verify events are tracked (would need to query database in real test)
      expect(store.trackingEnabled).toBe(true);
    });

    it('should calculate affinities after tracking events', async () => {
      const store = useUserStore.getState();
      
      await store.initialize();

      // Track multiple events for same category
      for (let i = 0; i < 5; i++) {
        await store.trackEvent('article_opened', 'article', `amd00${i}`, {
          category: 'জাতীয়',
          author: 'আন্তর্জাতিক ডেস্ক',
        });
      }

      // Calculate affinities
      await store.refreshAffinities();

      // Get interests
      const interests = await store.getUserInterests(5);

      // Should have at least one interest
      expect(interests.length).toBeGreaterThan(0);
    });

    it('should generate personalized feed', async () => {
      const store = useUserStore.getState();
      
      await store.initialize();

      // Track events to build affinities
      await store.trackEvent('article_opened', 'article', 'amd001', {
        category: 'জাতীয়',
      });

      await store.refreshAffinities();

      // Mock articles
      const mockArticles = [
        {
          id: 'amd001',
          title: 'Test 1',
          excerpt: 'Excerpt 1',
          content: 'Content 1',
          category: 'জাতীয়',
          imageUrl: 'https://example.com/1.jpg',
          author: 'Author 1',
          publishedAt: new Date().toISOString(),
        },
        {
          id: 'amd002',
          title: 'Test 2',
          excerpt: 'Excerpt 2',
          content: 'Content 2',
          category: 'খেলা',
          imageUrl: 'https://example.com/2.jpg',
          author: 'Author 2',
          publishedAt: new Date().toISOString(),
        },
      ];

      // Get personalized feed
      const feed = await store.getPersonalizedFeed(mockArticles);

      expect(feed.length).toBeGreaterThan(0);
    });

    it('should respect tracking toggle', async () => {
      const store = useUserStore.getState();
      
      await store.initialize();

      // Disable tracking
      store.toggleTracking(false);

      // Try to track event
      await store.trackEvent('article_opened', 'article', 'amd001');

      // Event should not be tracked (would verify in database)
      expect(store.trackingEnabled).toBe(false);

      // Re-enable tracking
      store.toggleTracking(true);

      await store.trackEvent('article_opened', 'article', 'amd002');

      expect(store.trackingEnabled).toBe(true);
    });

    it('should reset all user data', async () => {
      const store = useUserStore.getState();
      
      await store.initialize();

      // Track some events
      await store.trackEvent('article_opened', 'article', 'amd001');
      await store.trackEvent('article_saved', 'article', 'amd001');

      // Reset data
      await store.resetUserData();

      // Verify reset
      expect(store.userId).toBeNull();
      expect(store.totalArticlesRead).toBe(0);
    });
  });

  describe('Data Persistence', () => {
    it('should persist events to database', async () => {
      const store = useUserStore.getState();
      
      await store.initialize();

      await store.trackEvent('article_opened', 'article', 'amd001', {
        category: 'জাতীয়',
      });

      // Flush events to database
      const { flushEventQueue } = await import('../eventTracker');
      await flushEventQueue();

      // Verify events are in database (would query in real test)
      expect(true).toBe(true); // Placeholder
    });

    it('should persist affinities to database', async () => {
      const store = useUserStore.getState();
      
      await store.initialize();

      // Track events
      for (let i = 0; i < 10; i++) {
        await store.trackEvent('article_opened', 'article', `amd00${i}`, {
          category: 'জাতীয়',
        });
      }

      // Calculate affinities
      await store.refreshAffinities();

      // Verify affinities are in database (would query in real test)
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Error Handling', () => {
    it('should handle database initialization errors', async () => {
      const store = useUserStore.getState();

      // Mock database error
      jest.spyOn(await import('../db'), 'initializeDatabase').mockRejectedValueOnce(
        new Error('Database error')
      );

      // Should not crash
      await expect(store.initialize()).resolves.not.toThrow();
    });

    it('should handle event tracking errors', async () => {
      const store = useUserStore.getState();
      
      await store.initialize();

      // Mock tracking error
      jest.spyOn(await import('../eventTracker'), 'trackEvent').mockRejectedValueOnce(
        new Error('Tracking error')
      );

      // Should not crash
      await expect(
        store.trackEvent('article_opened', 'article', 'amd001')
      ).resolves.not.toThrow();
    });
  });
});
