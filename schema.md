# Data Schemas & Model Specifications - Daily Amar Desh Mobile App
**ডেটা স্কিমা ও অবজেক্ট মডেল নির্দেশিকা - দৈনিক আমার দেশ**

---

| Attribute | Details |
| :--- | :--- |
| **Document Version** | 1.0.0 (Production Schema) |
| **System Name** | Daily Amar Desh Data Model System |
| **Primary Format** | TypeScript Interfaces, SQLite DDL & JSON Schemas |
| **Status** | Production Synchronized |
| **Last Synchronized** | October 2026 |

---

## 1. Core Article & Editorial Schemas

### 1.1 `Article` Interface
The primary entity representing a fully enriched journalistic article across feeds, reading screens, bookmarks, and offline cache.

```typescript
export interface Article {
  /** Unique deterministic identifier (e.g. 'amd-20261007-001' or RSS guid hash) */
  id: string;

  /** Primary headline set in Noto Serif Bengali */
  title: string;

  /** Optional secondary kicker or sub-deck */
  subtitle?: string;

  /** Cleaned, sanitized HTML / markdown narrative text */
  content: string;

  /** Optional short abstract or editorial lead paragraph */
  summary?: string;

  /** Primary editorial category (e.g. 'জাতীয়', 'রাজনীতি', 'অর্থনীতি') */
  category: string;

  /** Category slug used for routing (e.g. 'national', 'politics', 'economy') */
  categorySlug?: string;

  /** Optional sub-category or topic kicker */
  subCategory?: string;

  /** Descriptive topical tags for search and affinity calculation */
  tags: string[];

  /** Journalist or wire service byline */
  author: {
    name: string;
    avatarUrl?: string;
    role?: string;
  };

  /** ISO-8601 creation timestamp */
  publishedAt: string;

  /** Optional ISO-8601 last modified timestamp */
  updatedAt?: string;

  /** High-resolution hero image URL (WebP preferred) */
  imageUrl: string;

  /** Image caption text */
  imageCaption?: string;

  /** Photographic attribution credit */
  imageCredit?: string;

  /** Estimated reading duration in minutes */
  readTimeMinutes: number;

  /** Flag indicating breaking flash news status */
  isBreaking?: boolean;

  /** Flag indicating featured splash placement */
  isFeatured?: boolean;

  /** Canonical web URL on dailyamardesh.com */
  sourceUrl: string;

  /** List of contextual related article IDs */
  relatedArticleIds?: string[];
}
```

### 1.2 `RSSArticle` Ingestion Schema
Raw object model extracted from `dailyamardesh.com/feed` XML feeds:

```typescript
export interface RSSArticle {
  guid: string;
  title: string;
  link: string;
  pubDate: string;
  creator: string;
  contentSnippet: string;
  contentEncoded?: string;
  categories: string[];
  enclosure?: {
    url: string;
    type: string;
    length?: string;
  };
}
```

### 1.3 `Category` Taxonomy
```typescript
export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  icon: string;
  order: number;
  description?: string;
}
```

---

## 2. State Management Schemas (Zustand)

### 2.1 `AppState` & Feature Flags (`store/useAppStore.ts`)
```typescript
export interface FeatureFlags {
  enableExpoImage: boolean;
  enableNotifications: boolean;
  enableHaptics: boolean;
  enableBreakingNews: boolean;
  enableDailyBriefing: boolean;
  enableCategoryUpdates: boolean;
}

export interface AppState {
  features: FeatureFlags;
  themePreference: 'system' | 'light' | 'dark' | null;
  language: 'bn' | 'en';
  setFeatureFlag: (key: keyof FeatureFlags, value: boolean) => void;
  setThemePreference: (pref: 'system' | 'light' | 'dark') => void;
  setLanguage: (lang: 'bn' | 'en') => void;
  loadFeatureFlags: () => Promise<void>;
  saveFeatureFlags: () => Promise<void>;
}
```

### 2.2 `UserState` Schema (`user/useUserStore.ts`)
```typescript
export interface UserState {
  userId: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isInitializing: boolean;
  trackingEnabled: boolean;
  
  // Lifetime reading analytics
  totalArticlesRead: number;
  totalTimeSpentMs: number;
  readingStreakDays: number;
  
  // Actions
  initialize: () => Promise<void>;
  cleanup: () => Promise<void>;
  resetUserData: () => Promise<void>;
  toggleTracking: (enabled: boolean) => void;
  refreshAffinities: () => Promise<void>;
  getPersonalizedFeed: (articles: Article[]) => Promise<Article[]>;
  getRecommendations: (articles: Article[], excludeIds?: string[]) => Promise<Article[]>;
  getUserInterests: (limit?: number) => Promise<Array<{ type: string; id: string; score: number }>>;
  flushEventQueue: () => Promise<void>;
}
```

---

## 3. SQLite Relational Database DDL (`user/db.ts`)

The local on-device SQLite database manages anonymous personalization and user telemetry with zero external leakage.

```sql
-- User Metadata & Lifetime Reading Stats
CREATE TABLE IF NOT EXISTS user_metadata (
  user_id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  last_active_at INTEGER NOT NULL,
  total_articles_read INTEGER DEFAULT 0,
  total_time_spent_ms INTEGER DEFAULT 0,
  reading_streak_days INTEGER DEFAULT 0
);

-- On-Device Interaction Events Buffer
CREATE TABLE IF NOT EXISTS reading_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  category TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'read' | 'bookmark' | 'reaction' | 'share' | 'dwell'
  dwell_time_ms INTEGER DEFAULT 0,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user_metadata(user_id) ON DELETE CASCADE
);

-- Calculated Topic & Category Affinities
CREATE TABLE IF NOT EXISTS affinities (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'category' | 'tag'
  item_id TEXT NOT NULL,
  score REAL NOT NULL,
  last_updated INTEGER NOT NULL,
  UNIQUE(user_id, type, item_id)
);

-- Performance Indices
CREATE INDEX IF NOT EXISTS idx_reading_events_user_time 
ON reading_events(user_id, timestamp);

CREATE INDEX IF NOT EXISTS idx_affinities_user_type_score 
ON affinities(user_id, type, score DESC);
```

---

## 4. BYOK Multi-Model AI Schemas

### 4.1 Provider & Model Configurations (`services/byokAiService.ts`)
```typescript
export type AIProvider = 'anthropic' | 'openai' | 'google' | 'deepseek';

export interface AIModelConfig {
  id: string;
  name: string;
  provider: AIProvider;
  contextWindow: number;
  maxOutputTokens: number;
  defaultTemperature: number;
}

export interface BYOKCredentials {
  apiKeys: {
    anthropic?: string;
    openai?: string;
    google?: string;
    deepseek?: string;
  };
  preferredProvider: AIProvider;
  preferredModel: string;
}
```

### 4.2 AI Summary Response Schema
```typescript
export interface AISummaryResponse {
  /** Exactly 3 executive bullet points in formal Bengali */
  bulletPoints: [string, string, string];
  generatedAt: string;
  provider: AIProvider;
  model: string;
  tokensConsumed?: {
    prompt: number;
    completion: number;
  };
}
```

### 4.3 Conversational Assistant Message Schema
```typescript
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedFollowUps?: string[];
}
```

---

## 5. Prayer Times & Geographic Schemas

### 5.1 `PrayerTimes` Entity
```typescript
export interface PrayerTimes {
  date: string;
  district: string;
  districtBn: string;
  fajr: string;      // e.g. "04:42"
  sunrise: string;   // e.g. "05:54"
  dhuhr: string;     // e.g. "11:58"
  asr: string;       // e.g. "15:20"
  maghrib: string;   // e.g. "17:42"
  isha: string;      // e.g. "18:56"
  nextPrayer: {
    name: string;
    nameBn: string;
    time: string;
    remainingMinutes: number;
  };
}
```

### 5.2 Geographic District & Division Taxonomy
```typescript
export interface Division {
  id: string;
  nameBn: string;
  nameEn: string;
}

export interface District {
  id: string;
  nameBn: string;
  nameEn: string;
  divisionId: string;
  lat: number;
  lon: number;
}
```

---

## 6. Interactive e-Paper Schemas

```typescript
export interface ColumnHotspot {
  id: string;
  title: string;
  category: string;
  articleId?: string;
  /** Percentage-based coordinates [0 - 100] */
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EPaperPage {
  pageNumber: number;
  title: string;
  highResImageUrl: string;
  thumbnailImageUrl: string;
  hotspots: ColumnHotspot[];
}

export interface EPaperEdition {
  id: string;
  date: string;
  formattedDateBn: string;
  totalPages: number;
  pages: EPaperPage[];
}

export interface ArticleClip {
  id: string;
  editionId: string;
  pageNumber: number;
  hotspot: ColumnHotspot;
  clippedImageUri: string;
  clippedAt: string;
}
```

---

## 7. Push Notification & Inbox Schemas

```typescript
export type NotificationCategory = 'breaking' | 'daily' | 'category' | 'system';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  articleId?: string;
  deepLink?: string;
  receivedAt: string;
  isRead: boolean;
}

export interface PushTokenRegistration {
  token: string;
  platform: 'android' | 'ios';
  appVersion: string;
  updatedAt: string;
}
```

---

## 8. Cloud Sync & Profile Schemas

```typescript
export interface CloudBookmark {
  articleId: string;
  title: string;
  category: string;
  savedAt: string;
}

export interface CloudReadingHistory {
  articleId: string;
  readAt: string;
  progressPercent: number;
}

export interface SyncPacket {
  version: number;
  userId: string;
  timestamp: number;
  bookmarks: CloudBookmark[];
  history: CloudReadingHistory[];
  settings: {
    theme: 'system' | 'light' | 'dark';
    language: 'bn' | 'en';
    preferredDistrict: string;
  };
}
```

---

## 9. Multimedia YouTube Feed Schema

```typescript
export interface YouTubeVideo {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration?: string;
  viewCount?: number;
  isLive?: boolean;
}
```

---

## 10. AsyncStorage Storage Keys Directory

All local storage keys follow the namespace pattern `@amar_desh_*`:

| Storage Key | Data Type | Purpose |
| :--- | :--- | :--- |
| `@amar_desh_feature_flags` | `JSON (FeatureFlags)` | User toggles for haptics, image engine, notifications. |
| `@amar_desh_theme_preference`| `'system' \| 'light' \| 'dark'` | UI theme mode selection. |
| `@amar_desh_language` | `'bn' \| 'en'` | Active interface language. |
| `@amar_desh_tracking_enabled`| `boolean` | On-device personalization opt-in/opt-out status. |
| `@amar_desh_anonymous_id` | `UUID string` | On-device anonymous identifier. |
| `@amar_desh_byok_keys` | `JSON (BYOKCredentials)`| Encrypted/local user AI provider keys. |
| `@amar_desh_bookmarks` | `JSON (Article[])` | Locally saved articles queue. |
| `@amar_desh_reading_progress`| `JSON (Record<string, number>)` | Scroll position and percentage per article. |
| `@amar_desh_preferred_district`| `string (districtId)` | Selected user district for prayer times & local news. |
| `@amar_desh_notifications` | `JSON (NotificationItem[])`| In-app notification inbox history. |
| `@amar_desh_reactions_${id}`| `JSON (ReactionsState)` | Article reaction counts and user selected emoji. |
