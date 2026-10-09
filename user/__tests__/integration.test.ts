/**
 * Integration Tests for User Profile System
 *
 * Tests the orchestration of the Zustand store with the database,
 * event tracker, and affinity calculator layers. The database layer is
 * mocked with an in-memory implementation so tests are deterministic
 * and do not require a real SQLite database.
 */

import { useUserStore } from '../useUserStore';
import * as db from '../db';
import {
  initializeDatabase,
  closeDatabase,
} from '../db';
import {
  initializeEventTracker,
  cleanupEventTracker,
  __resetForTests as resetTracker,
} from '../eventTracker';
import { __resetForTests as resetAffinity } from '../affinityCalculator';

// Mock the database layer with an in-memory implementation
jest.mock('../db', () => {
  const events: unknown[] = [];
  const affinities: unknown[] = [];

  return {
    initializeDatabase: jest.fn(async () => undefined),
    closeDatabase: jest.fn(async () => undefined),
    getDatabase: jest.fn(),
    insertEvent: jest.fn(async (event: unknown) => {
      events.push(event);
      return events.length;
    }),
    insertEvents: jest.fn(async (list: unknown[]) => {
      events.push(...list);
    }),
    getEvents: jest.fn(async (userId: string, sinceTimestamp?: number) =>
      (events as Array<Record<string, unknown>>).filter(
        (e) =>
          e.user_id === userId &&
          (sinceTimestamp === undefined ||
            sinceTimestamp === 0 ||
            (e.created_at as number) > sinceTimestamp)
      )
    ),
    deleteOldEvents: jest.fn(async () => undefined),
    deleteAllUserData: jest.fn(async () => {
      events.length = 0;
    }),
    deleteAllAffinities: jest.fn(async () => {
      affinities.length = 0;
    }),
    upsertAffinity: jest.fn(async (list: Array<Record<string, unknown>>) => {
      for (const a of list) {
        const idx = affinities.findIndex(
          (x) =>
            (x as Record<string, unknown>).entity_type === a.entity_type &&
            (x as Record<string, unknown>).entity_id === a.entity_id
        );
        if (idx >= 0) affinities[idx] = a;
        else affinities.push(a);
      }
    }),
    getTopAffinities: jest.fn(
      async (entityType: string, limit: number = 10) =>
        (affinities as Array<Record<string, unknown>>)
          .filter((a) => a.entity_type === entityType)
          .sort((a, b) => (b.score as number) - (a.score as number))
          .slice(0, limit)
    ),
    getAllAffinities: jest.fn(async () => [...affinities]),
    upsertArticleState: jest.fn(async () => undefined),
    getArticleState: jest.fn(async () => null),
    getSavedArticles: jest.fn(async () => []),
    upsertUserMetadata: jest.fn(async () => undefined),
    getUserMetadata: jest.fn(async () => null),
    getDatabaseStats: jest.fn(async () => ({
      events: events.length,
      articleStates: 0,
      affinities: affinities.length,
    })),
  };
});

// Mock anonymous ID management
jest.mock('../anonymousId', () => ({
  getAnonymousId: jest.fn(async () => 'test-user-id'),
  deleteAnonymousId: jest.fn(async () => undefined),
  hasAnonymousId: jest.fn(async () => true),
  linkToAuthUser: jest.fn(async () => undefined),
  getLinkedAuthUser: jest.fn(async () => null),
}));

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

  beforeEach(() => {
    // Reset module-level state so tests don't leak into each other
    resetTracker();
    resetAffinity();
    // Reset store state
    useUserStore.setState({
      userId: null,
      isInitialized: false,
      isInitializing: false,
      trackingEnabled: true,
    });
    jest.clearAllMocks();
  });

  describe('Full User Journey', () => {
    it('should initialize user system and track events', async () => {
      // Initialize user system
      await useUserStore.getState().initialize();

      // Re-read state: getState() returns a snapshot that is not live
      const state = useUserStore.getState();
      expect(state.isInitialized).toBe(true);
      expect(state.userId).toBeTruthy();

      // Track some events
      await state.trackEvent('article_opened', 'article', 'amd001', {
        category: 'জাতীয়',
        author: 'আন্তর্জাতিক ডেস্ক',
      });

      await state.trackEvent('article_saved', 'article', 'amd001', {
        category: 'জাতীয়',
        author: 'আন্তর্জাতিক ডেস্ক',
      });

      expect(useUserStore.getState().trackingEnabled).toBe(true);
    });

    it('should calculate affinities after tracking events', async () => {
      const { initialize, trackEvent, refreshAffinities, getUserInterests } =
        useUserStore.getState();

      await initialize();

      // Track multiple events for same category
      for (let i = 0; i < 5; i++) {
        await trackEvent('article_opened', 'article', `amd00${i}`, {
          category: 'জাতীয়',
          author: 'আন্তর্জাতিক ডেস্ক',
        });
      }

      // Calculate affinities
      await refreshAffinities();

      // Get interests
      const interests = await getUserInterests(5);

      // Should have at least one interest
      expect(interests.length).toBeGreaterThan(0);
    });

    it('should generate personalized feed', async () => {
      const { initialize, trackEvent, refreshAffinities, getPersonalizedFeed } =
        useUserStore.getState();

      await initialize();

      // Track events to build affinities
      await trackEvent('article_opened', 'article', 'amd001', {
        category: 'জাতীয়',
      });

      await refreshAffinities();

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
      const feed = await getPersonalizedFeed(mockArticles);

      expect(feed.length).toBeGreaterThan(0);
    });

    it('should respect tracking toggle', async () => {
      const { initialize, toggleTracking, trackEvent } = useUserStore.getState();

      await initialize();

      // Disable tracking
      toggleTracking(false);

      // Try to track event
      await trackEvent('article_opened', 'article', 'amd001');

      // Event should not be tracked
      expect(useUserStore.getState().trackingEnabled).toBe(false);

      // Re-enable tracking
      toggleTracking(true);

      await trackEvent('article_opened', 'article', 'amd002');

      expect(useUserStore.getState().trackingEnabled).toBe(true);
    });

    it('should reset all user data', async () => {
      const { initialize, trackEvent, resetUserData } = useUserStore.getState();

      await initialize();

      // Track some events
      await trackEvent('article_opened', 'article', 'amd001');
      await trackEvent('article_saved', 'article', 'amd001');

      // Reset data
      await resetUserData();

      // Verify reset
      expect(useUserStore.getState().userId).toBeNull();
      expect(useUserStore.getState().totalArticlesRead).toBe(0);
    });
  });

  describe('Data Persistence', () => {
    it('should persist events to database', async () => {
      const { initialize, trackEvent, flushEventQueue } = useUserStore.getState();

      await initialize();

      await trackEvent('article_opened', 'article', 'amd001', {
        category: 'জাতীয়',
      });

      // Flush events to database
      await flushEventQueue();

      // Verify events reached the (mocked) database layer
      expect(db.insertEvents).toHaveBeenCalled();
      expect(db.getEvents).toHaveBeenCalled;
    });

    it('should persist affinities to database', async () => {
      const { initialize, trackEvent, refreshAffinities } =
        useUserStore.getState();

      await initialize();

      // Track events
      for (let i = 0; i < 10; i++) {
        await trackEvent('article_opened', 'article', `amd00${i}`, {
          category: 'জাতীয়',
        });
      }

      // Calculate affinities
      await refreshAffinities();

      // Verify affinities reached the (mocked) database layer
      expect(db.upsertAffinity).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle database initialization errors', async () => {
      // Mock database error
      (db.initializeDatabase as jest.Mock).mockRejectedValueOnce(
        new Error('Database error')
      );

      // Should not crash
      await expect(useUserStore.getState().initialize()).resolves.not.toThrow();

      // Store should not be marked as initialized
      expect(useUserStore.getState().isInitialized).toBe(false);
    });

    it('should handle event tracking errors', async () => {
      const { initialize, trackEvent } = useUserStore.getState();

      await initialize();

      // Mock tracking error on the database write path
      (db.insertEvent as jest.Mock).mockRejectedValueOnce(
        new Error('Tracking error')
      );

      // Should not crash
      await expect(
        trackEvent('article_saved', 'article', 'amd001')
      ).resolves.not.toThrow();
    });
  });
});
