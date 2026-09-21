/**
 * Article State Aggregation
 *
 * Maintains the `article_state` table — per-article reading metrics that
 * complement the raw event stream (design doc §1.1):
 * - open_count: how many times the article was opened
 * - total_dwell_ms: cumulative reading time
 * - max_scroll_depth: deepest read fraction (0.0–1.0)
 * - saved / shared flags
 *
 * Aggregates are computed incrementally from the previous state row so the
 * table can serve "saved articles" and history queries without scanning
 * events.
 */

import {
  ArticleState,
  getArticleState,
  upsertArticleState,
} from './db';
import { getAnonymousId } from './anonymousId';

/**
 * Record an article open.
 * Increments open_count, stamps first/last opened timestamps.
 */
export async function recordArticleOpen(articleId: string): Promise<void> {
  try {
    const userId = await getAnonymousId();
    const now = Date.now();
    const existing = await getArticleState(articleId, userId);

    const state: ArticleState = {
      article_id: articleId,
      user_id: userId,
      first_opened_at: existing?.first_opened_at ?? now,
      last_opened_at: now,
      open_count: (existing?.open_count ?? 0) + 1,
      max_scroll_depth: existing?.max_scroll_depth ?? 0,
      total_dwell_ms: existing?.total_dwell_ms ?? 0,
      saved: existing?.saved ?? 0,
      shared: existing?.shared ?? 0,
      updated_at: now,
    };

    await upsertArticleState(state);
  } catch (error) {
    console.error('[ArticleState] Error recording article open:', error);
  }
}

/**
 * Record a completed article session (screen closed).
 * Adds dwell time and raises max_scroll_depth if the user read further.
 */
export async function recordArticleClose(
  articleId: string,
  dwellTimeMs: number,
  maxScrollDepth: number
): Promise<void> {
  try {
    const userId = await getAnonymousId();
    const now = Date.now();
    const existing = await getArticleState(articleId, userId);
    if (!existing) return; // open was never recorded; nothing to aggregate

    const state: ArticleState = {
      ...existing,
      last_opened_at: now,
      max_scroll_depth: Math.max(existing.max_scroll_depth, maxScrollDepth),
      total_dwell_ms: existing.total_dwell_ms + dwellTimeMs,
      updated_at: now,
    };

    await upsertArticleState(state);
  } catch (error) {
    console.error('[ArticleState] Error recording article close:', error);
  }
}

/**
 * Set the saved (bookmark) flag for an article.
 */
export async function setArticleSaved(
  articleId: string,
  saved: boolean
): Promise<void> {
  try {
    const userId = await getAnonymousId();
    const now = Date.now();
    const existing = await getArticleState(articleId, userId);

    const state: ArticleState = {
      article_id: articleId,
      user_id: userId,
      first_opened_at: existing?.first_opened_at ?? now,
      last_opened_at: existing?.last_opened_at ?? now,
      open_count: existing?.open_count ?? 0,
      max_scroll_depth: existing?.max_scroll_depth ?? 0,
      total_dwell_ms: existing?.total_dwell_ms ?? 0,
      saved: saved ? 1 : 0,
      shared: existing?.shared ?? 0,
      updated_at: now,
    };

    await upsertArticleState(state);
  } catch (error) {
    console.error('[ArticleState] Error setting saved flag:', error);
  }
}

/**
 * Mark an article as shared.
 */
export async function setArticleShared(articleId: string): Promise<void> {
  try {
    const userId = await getAnonymousId();
    const now = Date.now();
    const existing = await getArticleState(articleId, userId);
    if (!existing) return; // sharing without opening — nothing to update

    const state: ArticleState = {
      ...existing,
      shared: 1,
      updated_at: now,
    };

    await upsertArticleState(state);
  } catch (error) {
    console.error('[ArticleState] Error setting shared flag:', error);
  }
}
