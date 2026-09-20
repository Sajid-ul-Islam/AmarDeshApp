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

import { create } from 'zustand';
import { getAnonymousId, deleteAnonymousId, hasAnonymousId } from './anonymousId';
import { initializeDatabase, closeDatabase, getDatabaseStats } from './db';
import { 
  initializeEventTracker, 
  cleanupEventTracker, 
  flushEventQueue,
  trackAppOpened,
  trackAppBackgrounded,
} from './eventTracker';
import { calculateAffinity, getTopAffinities, resetRecalculationTimer } from './affinityCalculator';
import { 
  rankArticles, 
  generateForYouFeed, 
  getRecommendations,
  getUserInterests,
} from './personalizationEngine';
import { Article } from '../data/mockData';

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
      
      // 4. Track app opened
      await trackAppOpened('cold_start');
      
      // 5. Calculate initial affinities (if needed)
      await calculateAffinity(userId);
      
      set({
        userId,
        isInitialized: true,
        isInitializing: false,
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
      
      // Import database functions
      const { deleteAllUserData, deleteAllAffinities } = await import('./db');
      
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
   * Toggle tracking on/off
   */
  toggleTracking: (enabled: boolean) => {
    set({ trackingEnabled: enabled });
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
      // Import tracking functions
      const { trackEvent: track } = await import('./eventTracker');
      await track(eventType, entityType, entityId, metadata);
    } catch (error) {
      console.error('[UserStore] Error tracking event:', error);
    }
  },
}));

/**
 * Hook to access user store with auto-initialization
 */
export function useUser() {
  const store = useUserStore();
  
  // Auto-initialize on first use
  if (!store.isInitialized && !store.isInitializing) {
    store.initialize();
  }
  
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
