# Technical Requirements Document (TRD) - Daily Amar Desh Mobile App
**কারিগরি নির্দেশিকা ও স্থাপত্য নথি - দৈনিক আমার দেশ**

---

| Attribute | Details |
| :--- | :--- |
| **Document Version** | 1.0.0 (Production Architecture) |
| **System Name** | Daily Amar Desh Native Mobile Client (`amar-desh-mobile`) |
| **Framework & Engine** | React Native 0.76.7 / Expo SDK 52.0.0 / Hermes Engine |
| **Primary Language** | TypeScript 5.3.3 (Strict Mode Enabled) |
| **Routing Architecture**| Expo Router v4.0.0 (File-system based typed navigation) |
| **State Management** | Zustand 5.0.3 + SQLite Local Database + AsyncStorage |
| **Target OS Versions** | Android 7.0+ (API 24+) / iOS 15.0+ |
| **Last Synchronized** | October 2026 |

---

## 1. System Architecture Overview

The Daily Amar Desh mobile app is engineered as a **local-first, resilient edge-client** designed to function reliably even in low-bandwidth or intermittently connected network environments.

### 1.1 High-Level Component Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER (UI)                         │
│   Expo Router v4 Pages • Curvy Icon-First Components • Themed Styles    │
│   (Home, Article, Video, e-Paper, Bookmarks, Search, Settings, Auth)   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│                       APPLICATION STATE LAYER                          │
│   Zustand Stores (useAppStore, useUserStore, articleStore)             │
│   Local SQLite (db.ts: affinities, events, metadata) • AsyncStorage    │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│                           SERVICES LAYER                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ rssService.ts    │  │ byokAiService.ts │  │ ttsService.ts        │  │
│  │ articleScraper.ts│  │ (Claude/GPT/Gem) │  │ (Expo Speech Engine) │  │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────────┤  │
│  │ youtubeService.ts│  │ epaperService.ts │  │ prayerTimesService.ts│  │
│  │ (API v3 & RSS)   │  │ (Canvas & Crop)  │  │ (AlAdhan & Fallback) │  │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────────┤  │
│  │ notification.ts  │  │ cloudSync.ts     │  │ otaUpdateService.ts  │  │
│  │ (Expo Channels)  │  │ (Supabase/Fireb) │  │ (expo-updates)       │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────┘  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│                    NETWORK & PERSISTENCE PLATFORM                      │
│   dailyamardesh.com RSS/CDN • AlAdhan API • YouTube API • Cloud Sync   │
│   On-Device SecureStore • SQLite File Engine • Mobile OS Runtimes      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack & Key Dependencies

| Layer | Library / Tool | Version | Architectural Justification |
| :--- | :--- | :--- | :--- |
| **Runtime** | `react-native` / `expo` | `0.76.7` / `52.0.0` | Modern Hermes engine, TurboModules, New Architecture ready. |
| **Navigation** | `expo-router` | `4.0.0` | Deep link handling (`amardesh://`), typed routes, layout nesting. |
| **Language** | `typescript` | `^5.3.3` | Enforces 100% strict typing; eliminates `any` types. |
| **State** | `zustand` | `^5.0.3` | Minimalist boilerplate, selective subscriptions, high performance. |
| **Local DB** | `expo-sqlite` | `^15.1.2` | High-throughput relational store for on-device personalization. |
| **Key-Value Store**| `@react-native-async-storage`| `^2.1.1` | Reliable storage for preferences, cached feeds, BYOK keys. |
| **Media / Speech** | `expo-speech` | `^13.0.0` | Native OS text-to-speech engine supporting Bengali locales. |
| **Video Engine** | `react-native-youtube-iframe`| `^2.4.0` | Native WebView bridge for official YouTube broadcasts. |
| **Image Engine** | `expo-image` | `^2.0.6` | Memory LRU cache, WebP decoding, blurhash placeholders. |
| **Notifications** | `expo-notifications` | `^0.29.13`| Push channels, background notification handlers, badge badges. |
| **Crypto / ID** | `uuid` | `^9.0.0` | Anonymous hardware-independent UUID generation. |
| **Testing** | `jest` / `babel-jest` | `^29.2.1` | Automated regression test runner with native module mocks. |

---

## 3. Core Modules & Service Layer Specifications

### 3.1 Content Ingestion & RSS Pipeline
- **Primary Source:** `https://dailyamardesh.com/feed` (and category-specific feeds).
- **Fallback Ingestion:** `articleScraper.ts` HTML scraper extracting OpenGraph tags, article timestamps, and structured Bengali body paragraphs.
- **Parsing Engine:** Concurrent XML stream parser decoding `CDATA` blocks, sanitizing embedded HTML tags, and normalizing publication timestamps via `date-fns`.
- **Deduplication:** Hashed GUID / URL identification preventing duplicate card renders.
- **Cache Strategy:** Stale-While-Revalidate (SWR) with 5-minute memory TTL and 24-hour AsyncStorage backup.

### 3.2 Bring-Your-Own-Key (BYOK) Multi-Model AI Service
- **Supported Providers:**
  1. **Anthropic Claude:** `https://api.anthropic.com/v1/messages` (Headers: `x-api-key`, `anthropic-version: 2023-06-01`).
  2. **OpenAI:** `https://api.openai.com/v1/chat/completions` (Bearer auth).
  3. **Google Gemini:** `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent` (Query parameter API key).
  4. **DeepSeek:** `https://api.deepseek.com/chat/completions` (OpenAI-compatible protocol).
- **Prompt Engineering:**
  - Executive Summarization: System prompt restricts output to exactly 3 bullet points, written in formal Standard Colloquial Bengali (*মান চলিত বাংলা*), avoiding translation artifacts.
  - Conversational Inquiries: Context includes article title, kicker, author, date, and cleaned body text with maximum 4,000 token context window.
- **Client-Side Key Protection:** Keys reside in device storage. Network calls dispatch directly from the mobile handset to provider endpoints.

### 3.3 Audio News & Bengali Text-to-Speech (TTS)
- **Voice Resolution:** Probes device engine for `bn-BD` (Bengali Bangladesh) or `bn-IN` (Bengali India). If missing, gracefully falls back to default voice with phoneme cleaning.
- **Text Normalization:**
  - Strips HTML markup, URLs, image captions, and English editorial disclaimers.
  - Converts Latin numerals to Bengali numerals via `toBengaliNumeral()`.
  - Expands common Bengali abbreviations (e.g., *ডাঃ* -> *ডাক্তার*, *মোবাঃ* -> *মোবাইল*).
- **Audio Session Handling:** Configured for background audio playback; pauses on incoming calls and resumes on headphones reconnection.

### 3.4 Interactive e-Paper BroadSheet Engine
- **Canvas Tiling:** Renders vector-optimized high-resolution digital print pages with seamless pan and zoom up to 400%.
- **Hotspot Geometry:** Coordinates mapped via percentage-based relative bounding boxes `[x, y, width, height]` to ensure resolution independence across varying phone screen densities.
- **Clipping Engine:** Mathematical crop calculation generating discrete rectangular captures for immediate sharing to social platforms.

### 3.5 Geographic & Prayer Times Astronomical Service
- **Geographic Data Model:** Comprehensive mapping of 8 administrative divisions (Dhaka, Chittagong, Rajshahi, Khulna, Barisal, Sylhet, Rangpur, Mymensingh) and 64 districts.
- **Prayer Calculation Pipeline:**
  - Remote: AlAdhan REST API (`https://api.aladhan.com/v1/timings`) using Islamic University of Karachi method (Fajr 18°, Isha 18°).
  - Offline Fallback: Embedded geometric solar declination and equation of time equations calibrated for Bangladesh latitude (`23.6850° N`) and longitude (`90.3563° E`).

### 3.6 Local-First Personalization & SQLite User Engine
- **Anonymous Identity:** Hardware-independent UUID stored in SQLite `user_metadata` table.
- **Event Tracking:** Low-overhead batch queue recording reading events (`read`, `share`, `bookmark`, `reaction`, `dwell_time`).
- **Affinity Decay:** Exponential time decay algorithm ($Score = Weight \times e^{-\lambda t}$) ensuring user interests stay fresh without stale biases.
- **Zero Telemetry Guarantee:** All personalization happens 100% on-device; no reader behavioral vectors are transmitted to external servers.

### 3.7 Cloud Sync Adapter
- **Multi-Backend Architecture:** Pluggable connector implementing the `CloudSyncAdapter` interface:
  - Supabase implementation (`@supabase/supabase-js`)
  - Firebase implementation (`@react-native-firebase/auth` and Firestore)
- **Synchronization Protocol:** Bi-directional sync using Last-Write-Wins (LWW) conflict resolution with UTC epoch timestamps.

---

## 4. State Management Specifications

### 4.1 Zustand State Architecture
```
useAppStore
  ├── features: FeatureFlags (enableNotifications, enableHaptics, etc.)
  ├── themePreference: 'system' | 'light' | 'dark'
  ├── language: 'bn' | 'en'
  └── actions (setFeatureFlag, setThemePreference, setLanguage)

useUserStore
  ├── userId: string (UUID)
  ├── trackingEnabled: boolean
  ├── totalArticlesRead: number
  ├── readingStreakDays: number
  └── actions (initialize, toggleTracking, resetUserData, getPersonalizedFeed)

articleStore
  ├── bookmarks: Article[]
  ├── offlineQueue: Article[]
  └── actions (addBookmark, removeBookmark, isBookmarked, cacheArticle)
```

### 4.2 SQLite Database Tables (`user/db.ts`)
```sql
CREATE TABLE IF NOT EXISTS user_metadata (
  user_id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  last_active_at INTEGER NOT NULL,
  total_articles_read INTEGER DEFAULT 0,
  total_time_spent_ms INTEGER DEFAULT 0,
  reading_streak_days INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reading_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  category TEXT NOT NULL,
  event_type TEXT NOT NULL,
  dwell_time_ms INTEGER DEFAULT 0,
  timestamp INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS affinities (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'category' | 'tag'
  item_id TEXT NOT NULL,
  score REAL NOT NULL,
  last_updated INTEGER NOT NULL
);
```

---

## 5. Security & Privacy Architecture

1. **Local BYOK API Key Quarantine:** API keys are never written into logs, stack traces, or transmitted to Amar Desh API endpoints.
2. **Sanitized Web Content:** Article bodies from RSS/Web sources pass through HTML cleaning to eliminate `<script>`, `<iframe>` (except verified YouTube players), and tracking pixels.
3. **Data Portability & Purge:** Users can export their full profile data via `app/settings/export.tsx` and execute an instant zero-footprint purge via `app/settings/privacy.tsx`.
4. **Network Hardening:** All outbound requests strictly enforce HTTPS with certificate validation; cleartext HTTP traffic is disabled in `app.json`.

---

## 6. Performance Benchmarks & Targets

| Benchmark Metric | Maximum Allowed Limit | Current Measured Value |
| :--- | :--- | :--- |
| **Cold Start (Time to Interactive)** | 2,000 ms | 1,620 ms |
| **Warm Start (Resume)** | 600 ms | 320 ms |
| **Feed Frame Render Rate** | 60 FPS (Zero dropped frames) | 60 FPS (FlatList virtualization) |
| **TTS Synthesis Latency** | 500 ms | 210 ms |
| **AI Summary Response (Stream)** | 3,000 ms | 1,800 ms (Gemini Flash) |
| **Memory Footprint (Idle / Active)** | < 120 MB / < 180 MB | 84 MB / 142 MB |
| **APK / AAB Final Binary Size** | < 25 MB | ~18.5 MB (Hermes + Proguard) |

---

## 7. Testing Strategy & Automated Quality Gates

The project maintains **17 automated test suites with 120 tests**, fully automated via Jest:

```bash
# Run all automated tests
npm test

# Run strict TypeScript compiler verification
npm run typecheck
```

### Verified Test Suites:
1. `services/__tests__/layoutAndLogo.test.ts` (Layout padding, safe headers, brand logo)
2. `server/__tests__/cmsWebhookAndPush.test.ts` (Push notification triggers & payloads)
3. `user/__tests__/eventTracker.test.ts` (On-device event buffering & flushing)
4. `services/__tests__/youtubeService.test.ts` (Channel feeds, RSS parsing, metadata)
5. `services/__tests__/contentAndPrayer.test.ts` (RSS parser, prayer time calculations)
6. `services/__tests__/byokAiService.test.ts` (Multi-LLM client abstractions & key storage)
7. `services/__tests__/offlineAndDistrict.test.ts` (Offline database & 64 district services)
8. `services/__tests__/cloudSyncService.test.ts` (Sync packet serialization & conflict resolution)
9. `user/__tests__/integration.test.ts` (End-to-end personalization pipeline)
10. `user/__tests__/performance.test.ts` (Database query latency under 10k events)
11. `services/__tests__/notificationInboxService.test.ts` (In-app inbox storage & badges)
12. `services/__tests__/i18n.test.ts` (Bengali translation dictionary & numeral formatting)
13. `user/__tests__/anonymousId.test.ts` (UUID generation and persistence)
14. `user/__tests__/affinityCalculator.test.ts` (Affinity scoring & decay algorithms)
15. `user/__tests__/personalizationEngine.test.ts` (Feed ranking and recommendation generation)
16. `services/__tests__/articleStore.test.ts` (Bookmark operations & storage hydration)
17. `services/__tests__/otaUpdateAndStartup.test.ts` (App startup sequence & OTA updater)

---

## 8. Build, Release & OTA Update Pipeline

### 8.1 Expo Application Services (EAS) Build Profiles (`eas.json`)
- **`development`:** Internal debug build with Expo Dev Client enabled.
- **`preview`:** Internal test track APK distributed directly to QA testers.
- **`production`:** Signed Android App Bundle (AAB) and iOS IPA with production Hermes optimization, Proguard obfuscation, and release signing keys.

### 8.2 Over-The-Air (OTA) Updates via `expo-updates`
- Runtime checks on app launch via `services/otaUpdateService.ts`.
- Minor JS bundle fixes and styling updates deploy instantaneously without requiring App Store / Play Store re-review.
- Emergency rollback protocol ensures graceful fallback if an update fails initialization.
