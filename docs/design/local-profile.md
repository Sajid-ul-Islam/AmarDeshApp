# Local Anonymous User Profile & Behavior Tracking System

**Status:** Design Document  
**Date:** 2026-09-20  
**Version:** 1.0.0

---

## Overview

This document describes the design for a local-first anonymous user profile system that tracks user behavior, builds affinity scores for content personalization, and prepares for future authentication migration—all without requiring sign-up.

### Core Principles

1. **Local-First**: All data stays on device until user explicitly authenticates
2. **Anonymous by Default**: No PII collected, just behavioral signals
3. **Privacy-Respecting**: Transparent about what's tracked, easy to delete
4. **Migration-Ready**: Schema designed to support future auth integration
5. **Performance-Optimized**: Efficient queries for real-time personalization

---

## 1. Data Model

### 1.1 Database Schema (SQLite)

```sql
-- Events table: Raw behavioral events
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,              -- Anonymous UUID
  event_type TEXT NOT NULL,           -- e.g., 'article_opened', 'article_saved'
  entity_type TEXT,                   -- e.g., 'article', 'section', 'author', 'search'
  entity_id TEXT,                     -- ID of the entity (article_id, author_name, etc.)
  metadata TEXT,                      -- JSON blob for extra fields
  created_at INTEGER NOT NULL,        -- Epoch milliseconds
  synced_at INTEGER                   -- NULL until auth is added
);

-- Indexes for performance
CREATE INDEX idx_events_user_time ON events(user_id, created_at DESC);
CREATE INDEX idx_events_entity ON events(entity_type, entity_id);
CREATE INDEX idx_events_type ON events(event_type, created_at DESC);

-- Article state table: Aggregated article-level metrics
CREATE TABLE IF NOT EXISTS article_state (
  article_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  first_opened_at INTEGER,            -- First time article was opened
  last_opened_at INTEGER,             -- Most recent open time
  open_count INTEGER DEFAULT 0,       -- How many times opened
  max_scroll_depth REAL DEFAULT 0,    -- 0.0 to 1.0 (percentage of article read)
  total_dwell_ms INTEGER DEFAULT 0,   -- Total time spent reading (milliseconds)
  saved INTEGER DEFAULT 0,            -- 1 if bookmarked, 0 otherwise
  shared INTEGER DEFAULT 0,           -- 1 if shared, 0 otherwise
  updated_at INTEGER NOT NULL         -- Last update timestamp
);

CREATE INDEX idx_article_state_user ON article_state(user_id);
CREATE INDEX idx_article_state_saved ON article_state(saved, updated_at DESC);

-- Affinity table: Computed affinity scores
CREATE TABLE IF NOT EXISTS affinity (
  entity_type TEXT NOT NULL,          -- 'topic', 'author', 'section'
  entity_id TEXT NOT NULL,            -- Topic name, author name, section name
  score REAL NOT NULL DEFAULT 0,      -- Affinity score (0.0 to 1.0)
  last_updated INTEGER NOT NULL,      -- Last computation time
  PRIMARY KEY (entity_type, entity_id)
);

CREATE INDEX idx_affinity_score ON affinity(score DESC);
CREATE INDEX idx_affinity_type ON affinity(entity_type, score DESC);

-- User metadata table: Anonymous user profile
CREATE TABLE IF NOT EXISTS user_metadata (
  user_id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,        -- When anonymous ID was generated
  last_active_at INTEGER NOT NULL,    -- Last activity timestamp
  total_articles_read INTEGER DEFAULT 0,
  total_time_spent_ms INTEGER DEFAULT 0,
  reading_streak_days INTEGER DEFAULT 0,
  last_reading_date TEXT,             -- YYYY-MM-DD format
  preferences TEXT                    -- JSON blob for user preferences
);
```

### 1.2 Data Flow

```
User Action
    ↓
Event Tracker (in-memory queue)
    ↓
Batch Write to SQLite (every 5s or 10 events)
    ↓
Affinity Calculator (runs on app background/foreground)
    ↓
Personalization Engine (reads affinity scores)
    ↓
UI Rendering (personalized content)
```

---

## 2. Event Taxonomy

### 2.1 Core Events

| Event Type | Entity Type | When Tracked | Metadata Fields |
|------------|-------------|--------------|-----------------|
| `app_opened` | - | App launched | `{ source: 'cold_start' \| 'warm_start' }` |
| `app_backgrounded` | - | App goes to background | `{ session_duration_ms: number }` |
| `article_opened` | `article` | Article detail screen opened | `{ article_id, category, author, source: 'feed' \| 'search' \| 'notification' \| 'deep_link' }` |
| `article_scrolled` | `article` | User scrolls article (throttled) | `{ article_id, scroll_depth: 0.0-1.0 }` |
| `article_closed` | `article` | User leaves article screen | `{ article_id, dwell_time_ms, max_scroll_depth }` |
| `article_saved` | `article` | User bookmarks article | `{ article_id, category, author }` |
| `article_unsaved` | `article` | User removes bookmark | `{ article_id }` |
| `article_shared` | `article` | User shares article | `{ article_id, platform: 'whatsapp' \| 'facebook' \| ... }` |
| `search_performed` | `search` | User performs search | `{ query, result_count }` |
| `search_result_clicked` | `article` | User clicks search result | `{ article_id, query, position }` |
| `category_viewed` | `section` | User views category feed | `{ category, source: 'tab' \| 'deep_link' }` |
| `notification_tapped` | `article` | User taps notification | `{ article_id, notification_type }` |
| `tts_started` | `article` | User starts TTS | `{ article_id }` |
| `tts_stopped` | `article` | User stops TTS | `{ article_id, listened_duration_ms }` |

### 2.2 Event Metadata Schema

All events include:
```typescript
interface Event {
  id?: number;                    // Auto-generated
  user_id: string;                // Anonymous UUID
  event_type: string;             // From taxonomy above
  entity_type?: string;           // Optional entity type
  entity_id?: string;             // Optional entity ID
  metadata?: Record<string, any>; // Flexible metadata
  created_at: number;             // Epoch ms
  synced_at?: number;             // NULL until auth
}
```

### 2.3 Event Batching Strategy

To minimize database writes:
- **In-memory queue**: Events stored in memory array
- **Batch write**: Flush to SQLite every 5 seconds OR when queue reaches 10 events
- **App background**: Flush immediately when app backgrounds
- **Critical events**: `article_saved`, `article_shared` write immediately (no batching)

---

## 3. Affinity Scoring Algorithm

### 3.1 Scoring Formula

Affinity score represents how much a user likes a topic/author/section on a scale of 0.0 to 1.0.

**Base Formula:**
```
affinity_score = raw_score * recency_decay * engagement_multiplier
```

Where:
- `raw_score`: Count of positive interactions
- `recency_decay`: Time-based decay factor (0.0 to 1.0)
- `engagement_multiplier`: Weight based on interaction type

### 3.2 Engagement Weights

Different actions have different weights:

| Action | Weight | Rationale |
|--------|--------|-----------|
| Article opened | 1.0 | Basic interest signal |
| Article read > 80% | 2.0 | High engagement |
| Article saved | 3.0 | Strong interest |
| Article shared | 4.0 | Very strong interest |
| TTS listened > 50% | 2.5 | Audio engagement |
| Search result clicked | 1.5 | Active discovery |

### 3.3 Recency Decay Function

Exponential decay with half-life of 7 days:

```typescript
function calculateRecencyDecay(timestamp: number): number {
  const now = Date.now();
  const ageInDays = (now - timestamp) / (1000 * 60 * 60 * 24);
  const halfLife = 7; // days
  return Math.pow(0.5, ageInDays / halfLife);
}
```

**Decay Examples:**
- 1 day old: 0.906
- 7 days old: 0.500
- 14 days old: 0.250
- 30 days old: 0.067

### 3.4 Affinity Calculation Algorithm

```typescript
async function calculateAffinity(userId: string): Promise<void> {
  // 1. Get all article events from last 90 days
  const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
  const events = await db.getEvents(userId, ninetyDaysAgo);
  
  // 2. Group by entity (topic, author, section)
  const entityScores = new Map<string, {
    type: string;
    id: string;
    rawScore: number;
    lastInteraction: number;
  }>();
  
  for (const event of events) {
    if (!event.entity_type || !event.entity_id) continue;
    
    const key = `${event.entity_type}:${event.entity_id}`;
    const existing = entityScores.get(key) || {
      type: event.entity_type,
      id: event.entity_id,
      rawScore: 0,
      lastInteraction: 0,
    };
    
    // Add engagement weight
    const weight = getEngagementWeight(event.event_type, event.metadata);
    existing.rawScore += weight;
    existing.lastInteraction = Math.max(existing.lastInteraction, event.created_at);
    
    entityScores.set(key, existing);
  }
  
  // 3. Calculate final scores with decay
  const affinityUpdates = [];
  for (const [key, data] of entityScores) {
    const recencyDecay = calculateRecencyDecay(data.lastInteraction);
    const finalScore = Math.min(1.0, data.rawScore * recencyDecay / 10); // Normalize to 0-1
    
    affinityUpdates.push({
      entity_type: data.type,
      entity_id: data.id,
      score: finalScore,
      last_updated: Date.now(),
    });
  }
  
  // 4. Batch upsert to affinity table
  await db.upsertAffinity(affinityUpdates);
}
```

### 3.5 When to Recalculate

- **On app foreground**: If last calculation was > 1 hour ago
- **After 10 new events**: Trigger recalculation
- **Manual trigger**: User refreshes feed
- **Background task**: Daily recalculation (if app used that day)

### 3.6 Entity Extraction

**Topics**: Extracted from article categories and tags
```typescript
function extractTopics(article: Article): string[] {
  return [article.category]; // Can extend to include tags/keywords
}
```

**Authors**: Direct from article metadata
```typescript
function extractAuthors(article: Article): string[] {
  return [article.author];
}
```

**Sections**: Mapped from navigation
```typescript
function extractSections(article: Article): string[] {
  // Map categories to broader sections
  const sectionMap = {
    'জাতীয়': 'national',
    'রাজনীতি': 'politics',
    'খেলা': 'sports',
    // ... etc
  };
  return [sectionMap[article.category] || 'general'];
}
```

---

## 4. Personalization Engine

### 4.1 Content Ranking

When displaying articles (feed, search results, recommendations):

```typescript
async function rankArticles(articles: Article[], userId: string): Promise<Article[]> {
  // 1. Get user's top affinities
  const topTopics = await db.getTopAffinities(userId, 'topic', 10);
  const topAuthors = await db.getTopAffinities(userId, 'author', 10);
  
  // 2. Score each article
  const scored = articles.map(article => {
    let score = 0;
    
    // Topic affinity
    const topicMatch = topTopics.find(t => t.entity_id === article.category);
    if (topicMatch) {
      score += topicMatch.score * 0.5; // 50% weight
    }
    
    // Author affinity
    const authorMatch = topAuthors.find(a => a.entity_id === article.author);
    if (authorMatch) {
      score += authorMatch.score * 0.3; // 30% weight
    }
    
    // Recency (newer = better)
    const ageInHours = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
    const recencyScore = Math.max(0, 1 - (ageInHours / 168)); // 7-day window
    score += recencyScore * 0.2; // 20% weight
    
    return { article, score };
  });
  
  // 3. Sort by score descending
  scored.sort((a, b) => b.score - a.score);
  
  // 4. Return ranked articles
  return scored.map(s => s.article);
}
```

### 4.2 "For You" Feed

Dedicated personalized feed showing:
1. **Top 30%** articles matching user's top affinities
2. **Breaking news** from followed topics (always included)
3. **Diversity injection**: 10% random articles to prevent filter bubble
4. **Fresh content**: Prioritize articles from last 24 hours

### 4.3 Recommendations

"Recommended for you" section based on:
- High affinity topics user hasn't explored recently
- Authors user follows but hasn't read lately
- Related articles to recently read content

---

## 5. Migration Path to Real Auth

### 5.1 Current State (Anonymous)

```
user_id: "anon-uuid-1234"
All data local
No sync
```

### 5.2 Future State (Authenticated)

```
user_id: "auth-uuid-5678"
Data synced to backend
Cross-device support
```

### 5.3 Migration Strategy

**Phase 1: Add Auth System**
- Implement authentication (Firebase Auth, Auth0, etc.)
- Add `auth_user_id` column to `user_metadata` table
- Keep `user_id` (anonymous) for backward compatibility

**Phase 2: Data Migration**
```typescript
async function migrateToAuth(anonymousUserId: string, authUserId: string) {
  // 1. Update user_metadata
  await db.updateUserMetadata(anonymousUserId, {
    auth_user_id: authUserId,
  });
  
  // 2. Sync local data to backend
  const events = await db.getEvents(anonymousUserId);
  await backend.syncEvents(authUserId, events);
  
  const articleStates = await db.getArticleStates(anonymousUserId);
  await backend.syncArticleStates(authUserId, articleStates);
  
  const affinities = await db.getAffinities(anonymousUserId);
  await backend.syncAffinities(authUserId, affinities);
  
  // 3. Mark as synced
  await db.markAsSynced(anonymousUserId);
}
```

**Phase 3: Dual Mode**
- App works in both anonymous and authenticated modes
- Anonymous: Local-only, no sync
- Authenticated: Sync to backend, cross-device

**Phase 4: Optional Cleanup**
- Provide "Delete my data" option
- Clear local data after successful sync
- Keep only essential cache

### 5.4 Schema Changes for Auth

```sql
-- Add to user_metadata
ALTER TABLE user_metadata ADD COLUMN auth_user_id TEXT;
ALTER TABLE user_metadata ADD COLUMN is_anonymous INTEGER DEFAULT 1;

-- Add to events
ALTER TABLE events ADD COLUMN auth_user_id TEXT;

-- Index for sync
CREATE INDEX idx_events_sync ON events(synced_at);
```

---

## 6. Privacy Considerations

### 6.1 Data Collection Policy

**What We Track:**
- ✅ Behavioral signals (what you read, search, save)
- ✅ Engagement metrics (time spent, scroll depth)
- ✅ Content preferences (topics, authors)
- ❌ NO personal information (name, email, phone)
- ❌ NO device identifiers (IDFA, ADID)
- ❌ NO location data
- ❌ NO contacts or social graph

### 6.2 Data Storage

**Local Storage:**
- All data stored in SQLite database on device
- Encrypted at rest (iOS Keychain, Android Keystore for anonymous ID)
- No automatic sync to any server

**Anonymous ID:**
- UUID v4 generated on first launch
- Stored in SecureStore (encrypted)
- Persists across app reinstalls (until user clears app data)
- Cannot be linked to real identity

### 6.3 User Controls

**Transparency:**
- Settings screen shows what's being tracked
- Clear explanation of affinity system
- Option to view affinity scores

**Control:**
- "Pause tracking" toggle (stops collecting events)
- "Delete my data" button (clears all local data)
- "Reset affinities" button (clears affinity scores only)
- Export data option (JSON export of all tracked data)

**Opt-Out:**
- Users can disable tracking entirely
- App still works without tracking (no personalization)
- No penalty for opting out

### 6.4 Privacy-First Design

**Minimal Data:**
- Only track what's needed for personalization
- No excessive metadata collection
- Aggregate when possible

**Local-First:**
- All processing happens on device
- No cloud analytics by default
- User controls when/if to sync

**Transparent:**
- Open about what's tracked
- Easy to understand affinity scores
- Clear privacy policy

### 6.5 GDPR/Compliance

**Data Subject Rights:**
- **Right to access**: Export all tracked data
- **Right to deletion**: Delete all local data
- **Right to portability**: Export in standard format
- **Right to object**: Disable tracking

**Consent:**
- First launch: Show privacy notice
- Explain what's tracked and why
- Require explicit consent to enable tracking
- Default to "opt-in" (not opt-out)

---

## 7. Performance Considerations

### 7.1 Database Optimization

**Indexes:**
- Primary keys on all tables
- Composite indexes for common queries
- Covering indexes for read-heavy operations

**Batching:**
- Event writes batched (5s or 10 events)
- Affinity updates batched
- Avoid N+1 queries

**Cleanup:**
- Delete events older than 90 days
- Vacuum database weekly
- Limit article_state to last 500 articles

### 7.2 Memory Management

**In-Memory Queue:**
- Max 100 events in memory
- Flush when threshold reached
- Prevent memory leaks

**Affinity Cache:**
- Keep top 100 affinities in memory
- Lazy load rest from database
- Invalidate on recalculation

### 7.3 Background Processing

**Affinity Calculation:**
- Run on app foreground (if stale)
- Run on app background (if time permits)
- Use `InteractionManager.runAfterInteractions` to avoid UI jank

**Database Maintenance:**
- Run cleanup tasks on app background
- Use `BackgroundFetch` for daily maintenance
- Respect battery optimization settings

---

## 8. Testing Strategy

### 8.1 Unit Tests

**Event Tracker:**
- Test event creation
- Test batching logic
- Test metadata validation

**Affinity Calculator:**
- Test scoring formula
- Test decay function
- Test edge cases (no events, old events)

**Database Layer:**
- Test CRUD operations
- Test indexes and queries
- Test migration scripts

### 8.2 Integration Tests

**End-to-End Flow:**
- User opens app → events tracked → affinities calculated → UI personalized
- User saves article → event recorded → affinity updated
- User searches → event tracked → results personalized

**Migration Tests:**
- Anonymous → Authenticated migration
- Data sync to backend
- Cross-device consistency

### 8.3 Performance Tests

**Load Testing:**
- 1000 events in database
- Complex affinity queries
- Real-time personalization

**Memory Tests:**
- Long-running app (24+ hours)
- Many events accumulated
- No memory leaks

---

## 9. Implementation Plan

### Phase 1: Foundation (Week 1)

**Tasks:**
1. Install dependencies (`expo-sqlite`, `expo-secure-store`, `uuid`)
2. Create database schema
3. Implement `anonymousId.ts`
4. Implement `db.ts` (database layer)
5. Basic unit tests

**Deliverables:**
- Working database with schema
- Anonymous ID generation
- Basic CRUD operations

### Phase 2: Event Tracking (Week 2)

**Tasks:**
1. Implement `eventTracker.ts`
2. Add tracking to article screens
3. Add tracking to search
4. Add tracking to bookmarks
5. Integration tests

**Deliverables:**
- Events being tracked
- Database populated with events
- Batching working correctly

### Phase 3: Affinity System (Week 3)

**Tasks:**
1. Implement `affinityCalculator.ts`
2. Implement scoring algorithm
3. Add recalculation triggers
4. Performance optimization
5. Unit + integration tests

**Deliverables:**
- Affinity scores calculated
- Scores update in real-time
- Performance benchmarks met

### Phase 4: Personalization (Week 4)

**Tasks:**
1. Implement `personalizationEngine.ts`
2. Add "For You" feed
3. Add recommendations
4. UI integration
5. User testing

**Deliverables:**
- Personalized feed working
- Recommendations displayed
- User feedback collected

### Phase 5: Privacy & Polish (Week 5)

**Tasks:**
1. Privacy settings UI
2. Data export functionality
3. Delete data functionality
4. Documentation
5. Final testing

**Deliverables:**
- Privacy controls working
- Documentation complete
- Ready for production

---

## 10. Success Metrics

### 10.1 Technical Metrics

- **Event tracking accuracy**: > 99% of user actions tracked
- **Affinity calculation time**: < 100ms for 1000 events
- **Database query time**: < 50ms for personalization queries
- **Memory usage**: < 50MB for event queue

### 10.2 Product Metrics

- **Personalized feed engagement**: > 30% increase in session duration
- **Article discovery**: > 20% increase in articles read per session
- **User retention**: > 10% increase in 7-day retention
- **Feature adoption**: > 50% of users enable tracking

### 10.3 Privacy Metrics

- **Transparency**: 100% of users see privacy notice
- **Control**: > 80% of users understand what's tracked
- **Trust**: > 90% of users opt-in to tracking
- **Compliance**: 100% GDPR compliant

---

## 11. Risks & Mitigations

### Risk 1: Performance Impact

**Risk**: Event tracking slows down app
**Mitigation**: 
- Batch writes to database
- Use background threads for calculation
- Profile and optimize queries

### Risk 2: Privacy Concerns

**Risk**: Users don't trust tracking
**Mitigation**:
- Transparent privacy policy
- Easy opt-out
- Local-only by default
- Clear data deletion

### Risk 3: Data Loss

**Risk**: User clears app data, loses profile
**Mitigation**:
- Warn before clearing data
- Offer export before deletion
- Future: Cloud sync with auth

### Risk 4: Filter Bubble

**Risk**: Personalization too narrow
**Mitigation**:
- Inject 10% random content
- Diversity algorithm
- User can reset affinities

---

## 12. Future Enhancements

### 12.1 Advanced Features

- **Collaborative filtering**: "Users who read this also read..."
- **Content-based filtering**: Recommend similar articles
- **Temporal patterns**: "You usually read sports in the evening"
- **Mood detection**: Infer mood from reading patterns

### 12.2 Cross-Device Sync

- **Cloud backup**: Optional sync to cloud
- **Multi-device**: Seamless experience across devices
- **Conflict resolution**: Merge data from multiple devices

### 12.3 AI Enhancements

- **Semantic search**: Understand intent, not just keywords
- **Summarization**: AI-generated article summaries
- **Content generation**: Personalized newsletters

---

## 13. Conclusion

This local-first anonymous user profile system provides a privacy-respecting way to personalize the news reading experience. By tracking behavioral signals locally and computing affinity scores on-device, we can deliver relevant content without compromising user privacy.

The system is designed to be:
- **Privacy-first**: All data stays local until explicit auth
- **Performance-optimized**: Efficient queries and batching
- **Migration-ready**: Schema supports future auth integration
- **User-controlled**: Transparent and easy to manage

With this foundation, we can deliver a personalized experience that respects user privacy while preparing for future growth and authentication.

---

## Appendix A: Example Queries

### Get Top Affinities

```sql
SELECT entity_type, entity_id, score
FROM affinity
WHERE entity_type = 'topic'
ORDER BY score DESC
LIMIT 10;
```

### Get Recent Events

```sql
SELECT *
FROM events
WHERE user_id = ?
  AND created_at > ?
ORDER BY created_at DESC
LIMIT 100;
```

### Get Article State

```sql
SELECT *
FROM article_state
WHERE article_id = ?
  AND user_id = ?;
```

### Get Saved Articles

```sql
SELECT article_id, last_opened_at
FROM article_state
WHERE user_id = ?
  AND saved = 1
ORDER BY last_opened_at DESC;
```

---

## Appendix B: Event Examples

### Article Opened

```json
{
  "event_type": "article_opened",
  "entity_type": "article",
  "entity_id": "amd001",
  "metadata": {
    "category": "জাতীয়",
    "author": "আন্তর্জাতিক ডেস্ক",
    "source": "feed"
  },
  "created_at": 1729584000000
}
```

### Article Saved

```json
{
  "event_type": "article_saved",
  "entity_type": "article",
  "entity_id": "amd002",
  "metadata": {
    "category": "রাজনীতি",
    "author": "রাজনৈতিক প্রতিবেদক"
  },
  "created_at": 1729584100000
}
```

### Search Performed

```json
{
  "event_type": "search_performed",
  "entity_type": "search",
  "entity_id": "নির্বাচন",
  "metadata": {
    "query": "নির্বাচন",
    "result_count": 15
  },
  "created_at": 1729584200000
}
```

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-09-20  
**Next Review:** After Phase 1 implementation
