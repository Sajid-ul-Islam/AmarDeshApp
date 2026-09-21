/**
 * Shared Live Article Store
 *
 * Single source of truth for live news from dailyamardesh.com:
 * - ONE in-flight fetch shared across screens (no duplicate RSS requests)
 * - Stable article IDs (same article = same id across launches)
 * - Every successful fetch is cached to AsyncStorage so search, bookmarks,
 *   and article detail keep working offline / after relaunch
 * - Subscribers (React hooks) re-render when fresh data arrives
 *
 * The static mock list stays as a last-resort fallback in the UI layer
 * when both the network and the cache are unavailable (e.g. first launch
 * in airplane mode).
 */

import { Article } from '../data/mockData';
import {
  fetchRSSFeed,
  cacheRSSFeed,
  getCachedRSSFeed,
} from './rssService';

type Listener = (articles: Article[]) => void;

let articles: Article[] = [];
let loadPromise: Promise<Article[]> | null = null;
const listeners = new Set<Listener>();

function notify(): void {
  for (const listener of listeners) {
    try {
      listener(articles);
    } catch (error) {
      console.error('[ArticleStore] Listener error:', error);
    }
  }
}

/**
 * Load live articles (network first, cache fallback).
 * Concurrent callers share the same in-flight promise; a forced refresh
 * always starts a new network request.
 */
export function loadArticles(forceRefresh = false): Promise<Article[]> {
  if (!forceRefresh && loadPromise) {
    return loadPromise;
  }

  const promise = (async () => {
    try {
      const fresh = await fetchRSSFeed();
      if (fresh.length > 0) {
        articles = fresh;
        // Persist for offline use & cold-start rendering
        await cacheRSSFeed(fresh);
        notify();
        return articles;
      }
    } catch (error) {
      console.error('[ArticleStore] Network fetch failed:', error);
    }

    // Network empty/failed → serve cache (if any)
    try {
      const cached = await getCachedRSSFeed();
      if (cached.length > 0) {
        articles = cached;
        notify();
      }
    } catch (error) {
      console.error('[ArticleStore] Cache read failed:', error);
    }

    return articles;
  })();

  loadPromise = promise;
  return promise;
}

/**
 * Warm the store on app start (call once from the root layout).
 * Fire-and-forget: screens use getArticles()/subscribeToArticles().
 */
export function warmArticleStore(): void {
  loadArticles().catch(() => {
    /* errors already logged inside loadArticles */
  });
}

/** Synchronously read the current article list. */
export function getArticles(): Article[] {
  return articles;
}

/**
 * Subscribe to article updates.
 * Returns an unsubscribe function (matches useSyncExternalStore).
 */
export function subscribeToArticles(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Look up a single article by id (live + cache; excludes mock data). */
export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}

/** Test-only: reset in-memory state. */
export function __resetArticleStoreForTests(): void {
  articles = [];
  loadPromise = null;
  listeners.clear();
}
