/**
 * User Profile System
 * 
 * Local-first anonymous user profile and behavior tracking system.
 * 
 * Main Components:
 * - anonymousId: Anonymous UUID generation and secure storage
 * - db: SQLite database layer for events, articles, affinities
 * - eventTracker: Behavioral event tracking with batching
 * - affinityCalculator: Affinity scoring with recency decay
 * - personalizationEngine: Content ranking and recommendations
 * - useUserStore: Zustand store for user state management
 * 
 * Usage:
 * ```typescript
 * import { useUser } from './user';
 * 
 * function App() {
 *   const user = useUser();
 *   
 *   // User system auto-initializes on first use
 *   // Track events
 *   user.trackEvent('article_opened', 'article', 'amd001', { category: 'জাতীয়' });
 *   
 *   // Get personalized content
 *   const feed = await user.getPersonalizedFeed(articles);
 * }
 * ```
 */

// Main store
export { useUserStore, useUser, useUserReady, useUserId } from './useUserStore';

// Anonymous ID management
export { 
  getAnonymousId, 
  deleteAnonymousId, 
  hasAnonymousId,
  linkToAuthUser,
  getLinkedAuthUser,
} from './anonymousId';

// Database layer
export {
  initializeDatabase,
  getDatabase,
  closeDatabase,
  insertEvent,
  insertEvents,
  getEvents,
  deleteOldEvents,
  upsertArticleState,
  getArticleState,
  getSavedArticles,
  upsertAffinity,
  getTopAffinities,
  getAllAffinities,
  deleteAllAffinities,
  upsertUserMetadata,
  getUserMetadata,
  deleteAllUserData,
  getDatabaseStats,
} from './db';

export type { Event, ArticleState, Affinity, UserMetadata } from './db';

// Event tracking
export {
  initializeEventTracker,
  trackEvent,
  flushEventQueue,
  cleanupEventTracker,
  getQueueSize,
  trackAppOpened,
  trackAppBackgrounded,
  trackArticleOpened,
  trackArticleScrolled,
  trackArticleClosed,
  trackArticleSaved,
  trackArticleUnsaved,
  trackArticleShared,
  trackSearchPerformed,
  trackSearchResultClicked,
  trackCategoryViewed,
  trackNotificationTapped,
  trackTTSStarted,
  trackTTSStopped,
} from './eventTracker';

// Affinity calculation
export {
  calculateAffinity,
  getTopAffinities as getTopAffinityScores,
  shouldRecalculate,
  resetRecalculationTimer,
  getCalculationStats,
} from './affinityCalculator';

// Personalization
export {
  rankArticles,
  generateForYouFeed,
  getRecommendations,
  getPersonalizedSearchResults,
  getUserInterests,
  articleMatchesInterests,
  getPersonalizationStats,
} from './personalizationEngine';

// Article state aggregation
export {
  recordArticleOpen,
  recordArticleClose,
  setArticleSaved,
  setArticleShared,
} from './articleState';
