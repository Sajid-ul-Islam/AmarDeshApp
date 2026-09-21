/**
 * User Store
 * 
 * Zustand store for managing user profile state.
 * Integrates all user-related functionality:
 * - Anonymous ID management
 * - Database initialization
 * - Event tracking
 * - Affinity calculation
 * - Personalization
 * 
 * Key Features:
 * - Centralized user state
 * - Automatic initialization
 * - Privacy controls
 * - Easy access to user data
 */

import { useEffect } from 'react';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAnonymousId, deleteAnonymousId, hasAnonymousId } from './anonymousId';
import {
  initializeDatabase,
  closeDatabase,
  getDatabaseStats,
  getUserMetadata,
  deleteAllUserData,
  deleteAllAffinities,
  deleteOldEvents,
} from './db';
import { 
  initializeEventTracker, 
  cleanupEventTracker, 
  flushEventQueue,
  trackEvent as trackEventDefault,
  trackAppOpened,
} from './eventTracker';
import { calculateAffinity, resetRecalculationTimer } from './affinityCalculator';
import { 
  rankArticles, 
  generateForYouFeed, 
  getRecommendations,
  getUserInterests,
} from './personalizationEngine';
import { Article } from '../data/mockData';

// Persisted privacy preference: opt-out must survive app restarts.
const TRACKING_ENABLED_KEY = '@amar_desh_tracking_enabled';

/**
 * Recompute lifetime reading stats from the user metadata table.
 * Shared by initialize() and refreshStats() so UI surfaces (privacy
 * screen, reading streak) stay up to date after events flush.
 */
async function computeStats(userId: string): Promise<{
  totalArticlesRead: number;
  totalTimeSpentMs: number;
  readingStreakDays: number;
}> {
  const metadata = await getUserMetadata(userId);

  return {
    totalArticlesRead: metadata?.total_articles_read ?? 0,
    totalTimeSpentMs: metadata?.total_time_spent_ms ?? 0,
    readingStreakDays: metadata?.reading_streak_days ?? 0,
  };
}

interface UserState {
  // User identity
  userId: string | null;
  isAuthenticated: boolean;
  
  // Initialization
  isInitialized: boolean;
  isInitializing: boolean;
  
  // Privacy
  trackingEnabled: boolean;
  
  // Stats
  totalArticlesRead: number;
  totalTimeSpentMs: number;
  readingStreakDays: number;
  
  // Actions
  initialize: () => Promise<void>;
  cleanup: () => Promise<void>;
  resetUserData: () => Promise<void>;
  toggleTracking: (enabled: boolean) => void;
  refreshAffinities: () => Promise<void>;
  
  // Personalization
  getPersonalizedFeed: (articles: Article[]) => Promise<Article[]>;
  getRecommendations: (articles: Article[], excludeIds?: string[]) => Promise<Article[]>;
  getUserInterests: (limit?: number) => Promise<Array<{ type: string; id: string; score: number }>>;
  
  // Tracking
  flushEventQueue: () => Promise<void>;
  refreshStats: () => Promise<void>;
  trackEvent: (eventType: string, entityType?: string, entityId?: string, metadata?: Record<string, any>) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  // Initial state
  userId: null,
  isAuthenticated: false,
  isInitialized: false,
  isInitializing: false,
  trackingEnabled: true,
  totalArticlesRead: 0,
  totalTimeSpentMs: 0,
  readingStreakDays: 0,
  
  /**
   * Initialize the user system
   * Must be called on app startup
   */
  initialize: async () => {
    const state = get();
    
    if (state.isInitialized || state.isInitializing) {
      console.log('[UserStore] Already initialized or initializing');
      return;
    }
    
    set({ isInitializing: true });
    
    try {
      console.log('[UserStore] Initializing user system');
      
      // 1. Initialize database
      await initializeDatabase();
      console.log('[UserStore] Database initialized');
      
      // 2. Get or create anonymous ID
      const userId = await getAnonymousId();
      console.log('[UserStore] Anonymous ID:', userId);
      
      // 3. Initialize event tracker
      await initializeEventTracker();
      console.log('[UserStore] Event tracker initialized');
      
      // 4. Load persisted tracking preference (privacy opt-out survives restarts)
      try {
        const storedTracking = await AsyncStorage.getItem(TRACKING_ENABLED_KEY);
        if (storedTracking !== null) {
          set({ trackingEnabled: JSON.parse(storedTracking) === true });
        }
      } catch (prefError) {
        console.error('[UserStore] Error loading tracking preference:', prefError);
      }

      // 5. Track app opened
      await trackAppOpened('cold_start');
      
      // 6. Purge events older than 90 days (design doc: data retention)
      // Runs non-blocking-safe: failures here must not block init
      try {
        const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
        await deleteOldEvents(ninetyDaysAgo);
      } catch (cleanupError) {
        console.error('[UserStore] Old event cleanup failed:', cleanupError);
      }
      
      // 7. Calculate initial affinities (if needed)
      await calculateAffinity(userId);
      
      // 8. Load lifetime stats so UI shows real values
      const stats = await computeStats(userId);
      
      set({
        userId,
        isInitialized: true,
        isInitializing: false,
        ...stats,
      });
      
      console.log('[UserStore] Initialization complete');
    } catch (error) {
      console.error('[UserStore] Error initializing:', error);
      set({ isInitializing: false });
    }
  },
  
  /**
   * Cleanup on app close
   */
  cleanup: async () => {
    try {
      console.log('[UserStore] Cleaning up');
      
      // Flush remaining events
      await flushEventQueue();
      
      // Cleanup event tracker
      await cleanupEventTracker();
      
      // Close database
      await closeDatabase();
      
      console.log('[UserStore] Cleanup complete');
    } catch (error) {
      console.error('[UserStore] Error during cleanup:', error);
    }
  },
  
  /**
   * Reset all user data (privacy feature)
   */
  resetUserData: async () => {
    try {
      console.log('[UserStore] Resetting user data');
      
      const { userId } = get();
      if (!userId) return;
      
      // Delete all data
      await deleteAllUserData(userId);
      await deleteAllAffinities();
      
      // Delete anonymous ID
      await deleteAnonymousId();
      
      // Reset state
      set({
        userId: null,
        totalArticlesRead: 0,
        totalTimeSpentMs: 0,
        readingStreakDays: 0,
      });
      
      console.log('[UserStore] User data reset complete');
    } catch (error) {
      console.error('[UserStore] Error resetting user data:', error);
    }
  },
  
  /**
   * Toggle tracking on/off (persisted across restarts)
   */
  toggleTracking: (enabled: boolean) => {
    set({ trackingEnabled: enabled });
    // Persist immediately so the opt-out survives app restarts
    AsyncStorage.setItem(TRACKING_ENABLED_KEY, JSON.stringify(enabled)).catch(
      (error) => console.error('[UserStore] Error persisting tracking preference:', error)
    );
    console.log('[UserStore] Tracking', enabled ? 'enabled' : 'disabled');
  },
  
  /**
   * Refresh affinity scores
   */
  refreshAffinities: async () => {
    const { userId } = get();
    if (!userId) return;
    
    try {
      console.log('[UserStore] Refreshing affinities');
      // Persist queued events first so the calculation sees recent activity
      await flushEventQueue();
      resetRecalculationTimer();
      await calculateAffinity(userId, true);
      console.log('[UserStore] Affinities refreshed');
    } catch (error) {
      console.error('[UserStore] Error refreshing affinities:', error);
    }
  },
  
  /**
   * Get personalized feed
   */
  getPersonalizedFeed: async (articles: Article[]) => {
    const { userId } = get();
    if (!userId) return articles;
    
    try {
      return await generateForYouFeed(articles, userId);
    } catch (error) {
      console.error('[UserStore] Error generating feed:', error);
      return articles;
    }
  },
  
  /**
   * Get recommendations
   */
  getRecommendations: async (articles: Article[], excludeIds: string[] = []) => {
    const { userId } = get();
    if (!userId) return [];
    
    try {
      return await getRecommendations(articles, userId, excludeIds, 5);
    } catch (error) {
      console.error('[UserStore] Error getting recommendations:', error);
      return [];
    }
  },
  
  /**
   * Get user interests
   */
  getUserInterests: async (limit: number = 10) => {
    const { userId } = get();
    if (!userId) return [];
    
    try {
      return await getUserInterests(userId, limit);
    } catch (error) {
      console.error('[UserStore] Error getting interests:', error);
      return [];
    }
  },
  
  /**
   * Flush the event queue to the database, then refresh stats so UI
   * reflects newly persisted reading activity.
   */
  flushEventQueue: async () => {
    try {
      await flushEventQueue();
      await get().refreshStats();
    } catch (error) {
      console.error('[UserStore] Error flushing event queue:', error);
    }
  },

  /**
   * Reload reading stats from the database into store state.
   */
  refreshStats: async () => {
    const { userId } = get();
    if (!userId) return;
    
    try {
      const stats = await computeStats(userId);
      set(stats);
    } catch (error) {
      console.error('[UserStore] Error refreshing stats:', error);
    }
  },
  
  /**
   * Track an event (wrapper for event tracker)
   */
  trackEvent: async (
    eventType: string,
    entityType?: string,
    entityId?: string,
    metadata?: Record<string, any>
  ) => {
    const { trackingEnabled } = get();
    
    if (!trackingEnabled) {
      console.log('[UserStore] Tracking disabled, skipping event:', eventType);
      return;
    }
    
    try {
      await trackEventDefault(eventType, entityType, entityId, metadata);
    } catch (error) {
      console.error('[UserStore] Error tracking event:', error);
    }
  },
}));

/**
 * Hook to access user store with auto-initialization.
 *
 * Initialization runs in an effect (not during render — side effects in
 * render are unsafe with React 18+ concurrent features and re-render loops).
 */
export function useUser() {
  const store = useUserStore();
  const initialize = useUserStore((state) => state.initialize);
  const isInitialized = useUserStore((state) => state.isInitialized);
  const isInitializing = useUserStore((state) => state.isInitializing);

  // Auto-initialize on first use
  useEffect(() => {
    if (!isInitialized && !isInitializing) {
      initialize();
    }
  }, [isInitialized, isInitializing, initialize]);
  
  return store;
}

/**
 * Hook to check if user system is ready
 */
export function useUserReady(): boolean {
  const { isInitialized } = useUserStore();
  return isInitialized;
}

/**
 * Hook to get user ID
 */
export function useUserId(): string | null {
  const { userId } = useUserStore();
  return userId;
}
