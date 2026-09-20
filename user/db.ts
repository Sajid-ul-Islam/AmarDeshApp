/**
 * Database Layer for User Profile System
 * 
 * Handles all SQLite operations for:
 * - Events (behavioral tracking)
 * - Article state (reading metrics)
 * - Affinity scores (personalization)
 * - User metadata (profile data)
 * 
 * Key Features:
 * - Automatic schema creation and migration
 * - Batch operations for performance
 * - Type-safe queries
 * - Error handling and recovery
 */

import * as SQLite from 'expo-sqlite';

// Database name
const DB_NAME = 'amar_desh_user_profile.db';

// Singleton database instance
let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Get or create database instance
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
    console.log('[Database] Opened database:', DB_NAME);
  }
  return dbInstance;
}

/**
 * Initialize database schema
 * Creates all tables and indexes if they don't exist
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const db = await getDatabase();
    
    // Create events table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        entity_type TEXT,
        entity_id TEXT,
        metadata TEXT,
        created_at INTEGER NOT NULL,
        synced_at INTEGER
      );
    `);
    
    // Create article_state table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS article_state (
        article_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        first_opened_at INTEGER,
        last_opened_at INTEGER,
        open_count INTEGER DEFAULT 0,
        max_scroll_depth REAL DEFAULT 0,
        total_dwell_ms INTEGER DEFAULT 0,
        saved INTEGER DEFAULT 0,
        shared INTEGER DEFAULT 0,
        updated_at INTEGER NOT NULL
      );
    `);
    
    // Create affinity table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS affinity (
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        score REAL NOT NULL DEFAULT 0,
        last_updated INTEGER NOT NULL,
        PRIMARY KEY (entity_type, entity_id)
      );
    `);
    
    // Create user_metadata table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_metadata (
        user_id TEXT PRIMARY KEY,
        created_at INTEGER NOT NULL,
        last_active_at INTEGER NOT NULL,
        total_articles_read INTEGER DEFAULT 0,
        total_time_spent_ms INTEGER DEFAULT 0,
        reading_streak_days INTEGER DEFAULT 0,
        last_reading_date TEXT,
        preferences TEXT
      );
    `);
    
    // Create indexes for performance
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_events_user_time 
      ON events(user_id, created_at DESC);
    `);
    
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_events_entity 
      ON events(entity_type, entity_id);
    `);
    
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_events_type 
      ON events(event_type, created_at DESC);
    `);
    
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_article_state_user 
      ON article_state(user_id);
    `);
    
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_affinity_score 
      ON affinity(score DESC);
    `);
    
    console.log('[Database] Schema initialized successfully');
  } catch (error) {
    console.error('[Database] Error initializing schema:', error);
    throw error;
  }
}

// ============================================================================
// EVENT OPERATIONS
// ============================================================================

export interface Event {
  id?: number;
  user_id: string;
  event_type: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: Record<string, any>;
  created_at: number;
  synced_at?: number;
}

/**
 * Insert a single event
 */
export async function insertEvent(event: Event): Promise<number> {
  try {
    const db = await getDatabase();
    const result = await db.runAsync(
      `INSERT INTO events (user_id, event_type, entity_type, entity_id, metadata, created_at, synced_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        event.user_id,
        event.event_type,
        event.entity_type || null,
        event.entity_id || null,
        event.metadata ? JSON.stringify(event.metadata) : null,
        event.created_at,
        event.synced_at || null,
      ]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('[Database] Error inserting event:', error);
    throw error;
  }
}

/**
 * Insert multiple events in a batch (for performance)
 */
export async function insertEvents(events: Event[]): Promise<void> {
  try {
    const db = await getDatabase();
    
    await db.withTransactionAsync(async () => {
      for (const event of events) {
        await db.runAsync(
          `INSERT INTO events (user_id, event_type, entity_type, entity_id, metadata, created_at, synced_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            event.user_id,
            event.event_type,
            event.entity_type || null,
            event.entity_id || null,
            event.metadata ? JSON.stringify(event.metadata) : null,
            event.created_at,
            event.synced_at || null,
          ]
        );
      }
    });
    
    console.log(`[Database] Inserted ${events.length} events in batch`);
  } catch (error) {
    console.error('[Database] Error inserting events batch:', error);
    throw error;
  }
}

/**
 * Get events for a user since a specific timestamp
 */
export async function getEvents(
  userId: string,
  sinceTimestamp?: number
): Promise<Event[]> {
  try {
    const db = await getDatabase();
    
    let query = 'SELECT * FROM events WHERE user_id = ?';
    const params: any[] = [userId];
    
    if (sinceTimestamp) {
      query += ' AND created_at > ?';
      params.push(sinceTimestamp);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const rows = await db.getAllAsync<Event>(query, params);
    
    // Parse metadata JSON
    return rows.map(row => ({
      ...row,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
    }));
  } catch (error) {
    console.error('[Database] Error getting events:', error);
    throw error;
  }
}

/**
 * Delete old events (cleanup)
 */
export async function deleteOldEvents(olderThan: number): Promise<void> {
  try {
    const db = await getDatabase();
    await db.runAsync(
      'DELETE FROM events WHERE created_at < ?',
      [olderThan]
    );
    console.log('[Database] Deleted old events');
  } catch (error) {
    console.error('[Database] Error deleting old events:', error);
    throw error;
  }
}

// ============================================================================
// ARTICLE STATE OPERATIONS
// ============================================================================

export interface ArticleState {
  article_id: string;
  user_id: string;
  first_opened_at?: number;
  last_opened_at?: number;
  open_count: number;
  max_scroll_depth: number;
  total_dwell_ms: number;
  saved: number;
  shared: number;
  updated_at: number;
}

/**
 * Upsert article state (create or update)
 */
export async function upsertArticleState(state: ArticleState): Promise<void> {
  try {
    const db = await getDatabase();
    
    await db.runAsync(
      `INSERT INTO article_state 
       (article_id, user_id, first_opened_at, last_opened_at, open_count, 
        max_scroll_depth, total_dwell_ms, saved, shared, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(article_id) DO UPDATE SET
         last_opened_at = excluded.last_opened_at,
         open_count = excluded.open_count,
         max_scroll_depth = MAX(article_state.max_scroll_depth, excluded.max_scroll_depth),
         total_dwell_ms = excluded.total_dwell_ms,
         saved = excluded.saved,
         shared = excluded.shared,
         updated_at = excluded.updated_at`,
      [
        state.article_id,
        state.user_id,
        state.first_opened_at,
        state.last_opened_at,
        state.open_count,
        state.max_scroll_depth,
        state.total_dwell_ms,
        state.saved,
        state.shared,
        state.updated_at,
      ]
    );
  } catch (error) {
    console.error('[Database] Error upserting article state:', error);
    throw error;
  }
}

/**
 * Get article state for a specific article
 */
export async function getArticleState(
  articleId: string,
  userId: string
): Promise<ArticleState | null> {
  try {
    const db = await getDatabase();
    const row = await db.getFirstAsync<ArticleState>(
      'SELECT * FROM article_state WHERE article_id = ? AND user_id = ?',
      [articleId, userId]
    );
    return row || null;
  } catch (error) {
    console.error('[Database] Error getting article state:', error);
    throw error;
  }
}

/**
 * Get all saved (bookmarked) articles for a user
 */
export async function getSavedArticles(userId: string): Promise<ArticleState[]> {
  try {
    const db = await getDatabase();
    const rows = await db.getAllAsync<ArticleState>(
      'SELECT * FROM article_state WHERE user_id = ? AND saved = 1 ORDER BY last_opened_at DESC',
      [userId]
    );
    return rows;
  } catch (error) {
    console.error('[Database] Error getting saved articles:', error);
    throw error;
  }
}

// ============================================================================
// AFFINITY OPERATIONS
// ============================================================================

export interface Affinity {
  entity_type: string;
  entity_id: string;
  score: number;
  last_updated: number;
}

/**
 * Upsert affinity scores (batch operation)
 */
export async function upsertAffinity(affinities: Affinity[]): Promise<void> {
  try {
    const db = await getDatabase();
    
    await db.withTransactionAsync(async () => {
      for (const affinity of affinities) {
        await db.runAsync(
          `INSERT INTO affinity (entity_type, entity_id, score, last_updated)
           VALUES (?, ?, ?, ?)
           ON CONFLICT(entity_type, entity_id) DO UPDATE SET
             score = excluded.score,
             last_updated = excluded.last_updated`,
          [
            affinity.entity_type,
            affinity.entity_id,
            affinity.score,
            affinity.last_updated,
          ]
        );
      }
    });
    
    console.log(`[Database] Upserted ${affinities.length} affinity scores`);
  } catch (error) {
    console.error('[Database] Error upserting affinity:', error);
    throw error;
  }
}

/**
 * Get top affinities for a user by entity type
 */
export async function getTopAffinities(
  entityType: string,
  limit: number = 10
): Promise<Affinity[]> {
  try {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Affinity>(
      `SELECT * FROM affinity 
       WHERE entity_type = ? 
       ORDER BY score DESC 
       LIMIT ?`,
      [entityType, limit]
    );
    return rows;
  } catch (error) {
    console.error('[Database] Error getting top affinities:', error);
    throw error;
  }
}

/**
 * Get all affinities
 */
export async function getAllAffinities(): Promise<Affinity[]> {
  try {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Affinity>(
      'SELECT * FROM affinity ORDER BY score DESC'
    );
    return rows;
  } catch (error) {
    console.error('[Database] Error getting all affinities:', error);
    throw error;
  }
}

/**
 * Delete all affinities (for reset)
 */
export async function deleteAllAffinities(): Promise<void> {
  try {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM affinity');
    console.log('[Database] Deleted all affinities');
  } catch (error) {
    console.error('[Database] Error deleting affinities:', error);
    throw error;
  }
}

// ============================================================================
// USER METADATA OPERATIONS
// ============================================================================

export interface UserMetadata {
  user_id: string;
  created_at: number;
  last_active_at: number;
  total_articles_read: number;
  total_time_spent_ms: number;
  reading_streak_days: number;
  last_reading_date?: string;
  preferences?: Record<string, any>;
}

/**
 * Upsert user metadata
 */
export async function upsertUserMetadata(metadata: UserMetadata): Promise<void> {
  try {
    const db = await getDatabase();
    
    await db.runAsync(
      `INSERT INTO user_metadata 
       (user_id, created_at, last_active_at, total_articles_read, 
        total_time_spent_ms, reading_streak_days, last_reading_date, preferences)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         last_active_at = excluded.last_active_at,
         total_articles_read = excluded.total_articles_read,
         total_time_spent_ms = excluded.total_time_spent_ms,
         reading_streak_days = excluded.reading_streak_days,
         last_reading_date = excluded.last_reading_date,
         preferences = excluded.preferences`,
      [
        metadata.user_id,
        metadata.created_at,
        metadata.last_active_at,
        metadata.total_articles_read,
        metadata.total_time_spent_ms,
        metadata.reading_streak_days,
        metadata.last_reading_date || null,
        metadata.preferences ? JSON.stringify(metadata.preferences) : null,
      ]
    );
  } catch (error) {
    console.error('[Database] Error upserting user metadata:', error);
    throw error;
  }
}

/**
 * Get user metadata
 */
export async function getUserMetadata(userId: string): Promise<UserMetadata | null> {
  try {
    const db = await getDatabase();
    const row = await db.getFirstAsync<UserMetadata>(
      'SELECT * FROM user_metadata WHERE user_id = ?',
      [userId]
    );
    
    if (row && row.preferences) {
      row.preferences = JSON.parse(row.preferences);
    }
    
    return row || null;
  } catch (error) {
    console.error('[Database] Error getting user metadata:', error);
    throw error;
  }
}

// ============================================================================
// CLEANUP OPERATIONS
// ============================================================================

/**
 * Delete all data for a user (privacy/reset)
 */
export async function deleteAllUserData(userId: string): Promise<void> {
  try {
    const db = await getDatabase();
    
    await db.withTransactionAsync(async () => {
      await db.runAsync('DELETE FROM events WHERE user_id = ?', [userId]);
      await db.runAsync('DELETE FROM article_state WHERE user_id = ?', [userId]);
      await db.runAsync('DELETE FROM user_metadata WHERE user_id = ?', [userId]);
    });
    
    console.log('[Database] Deleted all data for user:', userId);
  } catch (error) {
    console.error('[Database] Error deleting user data:', error);
    throw error;
  }
}

/**
 * Get database statistics (for debugging/monitoring)
 */
export async function getDatabaseStats(): Promise<{
  events: number;
  articleStates: number;
  affinities: number;
}> {
  try {
    const db = await getDatabase();
    
    const events = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM events'
    );
    
    const articleStates = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM article_state'
    );
    
    const affinities = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM affinity'
    );
    
    return {
      events: events?.count || 0,
      articleStates: articleStates?.count || 0,
      affinities: affinities?.count || 0,
    };
  } catch (error) {
    console.error('[Database] Error getting stats:', error);
    throw error;
  }
}

/**
 * Close database connection (for cleanup)
 */
export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
    console.log('[Database] Closed database connection');
  }
}
