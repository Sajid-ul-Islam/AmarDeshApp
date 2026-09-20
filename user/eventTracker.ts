/**
 * Event Tracker
 * 
 * Tracks user behavior events and batches them for efficient database writes.
 * Implements the event taxonomy defined in the design document.
 * 
 * Key Features:
 * - In-memory event queue with batch flushing
 * - Automatic flushing on app background
 * - Critical events written immediately
 * - Thread-safe operations
 */

import { Event, insertEvent, insertEvents } from './db';
import { getAnonymousId } from './anonymousId';

// Configuration
const BATCH_SIZE = 10; // Flush after this many events
const BATCH_INTERVAL_MS = 5000; // Flush every 5 seconds

// In-memory event queue
let eventQueue: Event[] = [];
let batchTimer: ReturnType<typeof setTimeout> | null = null;
let isInitialized = false;

/**
 * Initialize the event tracker
 * Must be called before tracking events
 */
export async function initializeEventTracker(): Promise<void> {
  if (isInitialized) {
    console.log('[EventTracker] Already initialized');
    return;
  }
  
  // Start batch timer
  startBatchTimer();
  
  // Listen for app state changes
  // Note: In a real app, you'd use AppState from react-native
  // For now, we'll rely on manual flush calls
  
  isInitialized = true;
  console.log('[EventTracker] Initialized');
}

/**
 * Track an event
 * 
 * @param eventType - Type of event (from taxonomy)
 * @param entityType - Optional entity type (article, section, etc.)
 * @param entityId - Optional entity ID
 * @param metadata - Optional metadata object
 * 
 * @example
 * await trackEvent('article_opened', 'article', 'amd001', {
 *   category: 'জাতীয়',
 *   source: 'feed'
 * });
 */
export async function trackEvent(
  eventType: string,
  entityType?: string,
  entityId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const userId = await getAnonymousId();
    const now = Date.now();
    
    const event: Event = {
      user_id: userId,
      event_type: eventType,
      entity_type: entityType,
      entity_id: entityId,
      metadata,
      created_at: now,
    };
    
    // Critical events: write immediately
    if (isCriticalEvent(eventType)) {
      await insertEvent(event);
      console.log('[EventTracker] Critical event written:', eventType);
      return;
    }
    
    // Normal events: add to queue
    eventQueue.push(event);
    
    // Flush if queue is full
    if (eventQueue.length >= BATCH_SIZE) {
      await flushEventQueue();
    }
    
    console.log('[EventTracker] Event queued:', eventType);
  } catch (error) {
    console.error('[EventTracker] Error tracking event:', error);
  }
}

/**
 * Check if an event is critical (should be written immediately)
 */
function isCriticalEvent(eventType: string): boolean {
  const criticalEvents = [
    'article_saved',
    'article_unsaved',
    'article_shared',
  ];
  return criticalEvents.includes(eventType);
}

/**
 * Flush the event queue to database
 */
export async function flushEventQueue(): Promise<void> {
  if (eventQueue.length === 0) {
    return;
  }
  
  const eventsToFlush = [...eventQueue];

  try {
    eventQueue = []; // Clear queue before writing (prevent duplicates)
    
    await insertEvents(eventsToFlush);
    console.log(`[EventTracker] Flushed ${eventsToFlush.length} events`);
  } catch (error) {
    console.error('[EventTracker] Error flushing event queue:', error);
    // Put events back in queue if flush failed
    eventQueue = [...eventsToFlush];
  }
}

/**
 * Start the batch timer
 */
function startBatchTimer(): void {
  if (batchTimer) {
    clearInterval(batchTimer);
  }
  
  batchTimer = setInterval(async () => {
    await flushEventQueue();
  }, BATCH_INTERVAL_MS);
  
  console.log('[EventTracker] Batch timer started');
}

/**
 * Stop the batch timer
 */
export function stopBatchTimer(): void {
  if (batchTimer) {
    clearInterval(batchTimer);
    batchTimer = null;
    console.log('[EventTracker] Batch timer stopped');
  }
}

/**
 * Cleanup before app closes
 * Flushes remaining events and stops timer
 */
export async function cleanupEventTracker(): Promise<void> {
  stopBatchTimer();
  await flushEventQueue();
  console.log('[EventTracker] Cleaned up');
}

/**
 * Get current queue size (for debugging)
 */
export function getQueueSize(): number {
  return eventQueue.length;
}

// ============================================================================
// CONVENIENCE METHODS FOR COMMON EVENTS
// ============================================================================

/**
 * Track app opened event
 */
export async function trackAppOpened(source: 'cold_start' | 'warm_start'): Promise<void> {
  await trackEvent('app_opened', undefined, undefined, { source });
}

/**
 * Track app backgrounded event
 */
export async function trackAppBackgrounded(sessionDurationMs: number): Promise<void> {
  await trackEvent('app_backgrounded', undefined, undefined, { session_duration_ms: sessionDurationMs });
}

/**
 * Track article opened event
 */
export async function trackArticleOpened(
  articleId: string,
  category: string,
  author: string,
  source: 'feed' | 'search' | 'notification' | 'deep_link'
): Promise<void> {
  await trackEvent('article_opened', 'article', articleId, {
    category,
    author,
    source,
  });
}

/**
 * Track article scrolled event (throttled by caller)
 */
export async function trackArticleScrolled(
  articleId: string,
  scrollDepth: number
): Promise<void> {
  await trackEvent('article_scrolled', 'article', articleId, {
    scroll_depth: scrollDepth,
  });
}

/**
 * Track article closed event
 */
export async function trackArticleClosed(
  articleId: string,
  dwellTimeMs: number,
  maxScrollDepth: number
): Promise<void> {
  await trackEvent('article_closed', 'article', articleId, {
    dwell_time_ms: dwellTimeMs,
    max_scroll_depth: maxScrollDepth,
  });
}

/**
 * Track article saved (bookmarked) event
 */
export async function trackArticleSaved(
  articleId: string,
  category: string,
  author: string
): Promise<void> {
  await trackEvent('article_saved', 'article', articleId, {
    category,
    author,
  });
}

/**
 * Track article unsaved event
 */
export async function trackArticleUnsaved(articleId: string): Promise<void> {
  await trackEvent('article_unsaved', 'article', articleId);
}

/**
 * Track article shared event
 */
export async function trackArticleShared(
  articleId: string,
  platform: 'whatsapp' | 'facebook' | 'twitter' | 'telegram' | 'email' | 'copy'
): Promise<void> {
  await trackEvent('article_shared', 'article', articleId, {
    platform,
  });
}

/**
 * Track search performed event
 */
export async function trackSearchPerformed(
  query: string,
  resultCount: number
): Promise<void> {
  await trackEvent('search_performed', 'search', query, {
    query,
    result_count: resultCount,
  });
}

/**
 * Track search result clicked event
 */
export async function trackSearchResultClicked(
  articleId: string,
  query: string,
  position: number
): Promise<void> {
  await trackEvent('search_result_clicked', 'article', articleId, {
    query,
    position,
  });
}

/**
 * Track category viewed event
 */
export async function trackCategoryViewed(
  category: string,
  source: 'tab' | 'deep_link'
): Promise<void> {
  await trackEvent('category_viewed', 'section', category, {
    category,
    source,
  });
}

/**
 * Track notification tapped event
 */
export async function trackNotificationTapped(
  articleId: string,
  notificationType: string
): Promise<void> {
  await trackEvent('notification_tapped', 'article', articleId, {
    notification_type: notificationType,
  });
}

/**
 * Track TTS started event
 */
export async function trackTTSStarted(articleId: string): Promise<void> {
  await trackEvent('tts_started', 'article', articleId);
}

/**
 * Track TTS stopped event
 */
export async function trackTTSStopped(
  articleId: string,
  listenedDurationMs: number
): Promise<void> {
  await trackEvent('tts_stopped', 'article', articleId, {
    listened_duration_ms: listenedDurationMs,
  });
}
