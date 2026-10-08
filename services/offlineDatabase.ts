/**
 * Offline SQLite Database & LRU Cache Manager
 *
 * Persists articles, full-text parsed paragraphs, and offline editions
 * with an automatic 7-day LRU cache eviction policy.
 */

import * as SQLite from 'expo-sqlite';
import { Article } from '../data/mockData';

const DB_NAME = 'amar_desh_offline.db';
let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getOfflineDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbInstance;
}

export async function initOfflineDatabase(): Promise<void> {
  const db = await getOfflineDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS cached_articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT,
      category TEXT,
      imageUrl TEXT,
      author TEXT,
      publishedAt TEXT,
      isBreaking INTEGER DEFAULT 0,
      cachedAt INTEGER NOT NULL,
      full_paragraphs TEXT,
      caption TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_cached_category ON cached_articles(category);
    CREATE INDEX IF NOT EXISTS idx_cached_at ON cached_articles(cachedAt);
  `);

  // Run 7-day LRU cache eviction on initialization
  await evictOldCachedArticles(7);
}

/**
 * Save single or batch of articles with current timestamp
 */
export async function saveArticlesToOfflineDb(
  articles: Article[],
  paragraphsMap?: Record<string, string[]>
): Promise<void> {
  const db = await getOfflineDb();
  const now = Date.now();

  for (const a of articles) {
    const parasJson = paragraphsMap?.[a.id]
      ? JSON.stringify(paragraphsMap[a.id])
      : null;

    await db.runAsync(
      `INSERT OR REPLACE INTO cached_articles (
        id, title, excerpt, content, category, imageUrl, author, publishedAt, isBreaking, cachedAt, full_paragraphs
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        a.id,
        a.title,
        a.excerpt,
        a.content,
        a.category,
        a.imageUrl,
        a.author,
        a.publishedAt,
        a.isBreaking ? 1 : 0,
        now,
        parasJson,
      ]
    );
  }
}

interface CachedArticleRow {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
  isBreaking?: number | boolean;
  isVideo?: number | boolean;
  sourceUrl?: string;
  cachedAt?: number;
}

/**
 * Get all cached articles by category
 */
export async function getCachedArticlesByCategory(category?: string): Promise<Article[]> {
  const db = await getOfflineDb();
  let rows: CachedArticleRow[];

  if (category && category !== 'all' && category !== 'সর্বশেষ') {
    rows = await db.getAllAsync<CachedArticleRow>(
      `SELECT * FROM cached_articles WHERE category = ? ORDER BY cachedAt DESC`,
      [category]
    );
  } else {
    rows = await db.getAllAsync<CachedArticleRow>(
      `SELECT * FROM cached_articles ORDER BY cachedAt DESC LIMIT 100`
    );
  }

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    excerpt: r.excerpt,
    content: r.content,
    category: r.category,
    imageUrl: r.imageUrl,
    author: r.author,
    publishedAt: r.publishedAt,
    isBreaking: Boolean(r.isBreaking),
  }));
}

/**
 * Search cached articles by keyword
 */
export async function searchCachedArticles(query: string): Promise<Article[]> {
  if (!query || query.trim().length === 0) return [];
  const db = await getOfflineDb();
  const wildcard = `%${query.trim()}%`;

  const rows = await db.getAllAsync<CachedArticleRow>(
    `SELECT * FROM cached_articles 
     WHERE title LIKE ? OR excerpt LIKE ? OR content LIKE ?
     ORDER BY cachedAt DESC LIMIT 50`,
    [wildcard, wildcard, wildcard]
  );

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    excerpt: r.excerpt,
    content: r.content,
    category: r.category,
    imageUrl: r.imageUrl,
    author: r.author,
    publishedAt: r.publishedAt,
    isBreaking: Boolean(r.isBreaking),
  }));
}

/**
 * 7-Day LRU eviction: Delete articles older than `maxDays` days
 */
export async function evictOldCachedArticles(maxDays = 7): Promise<number> {
  const db = await getOfflineDb();
  const cutoffTime = Date.now() - maxDays * 24 * 60 * 60 * 1000;

  const result = await db.runAsync(
    `DELETE FROM cached_articles WHERE cachedAt < ?`,
    [cutoffTime]
  );

  return result.changes;
}

/**
 * Get total cached article count and database size
 */
export async function getOfflineArticleCount(): Promise<number> {
  const db = await getOfflineDb();
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM cached_articles`
  );
  return result?.count || 0;
}

/**
 * Clear all cached articles from offline database
 */
export async function clearAllCachedArticles(): Promise<number> {
  const db = await getOfflineDb();
  const result = await db.runAsync(`DELETE FROM cached_articles`);
  return result.changes;
}
