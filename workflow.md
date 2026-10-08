# System Workflows & Engineering Procedures - Daily Amar Desh Mobile App
**কার্যপ্রণালী ও প্রকৌশল নির্দেশিকা - দৈনিক আমার দেশ**

---

| Attribute | Details |
| :--- | :--- |
| **Document Version** | 1.0.0 (Production Workflows) |
| **Scope** | Development, Release, Content Ingestion & User Experience Workflows |
| **Status** | Production Synchronized |
| **Last Synchronized** | October 2026 |

---

## 1. Engineering & Developer Workflows

### 1.1 Local Environment Setup & Bootstrapping
```bash
# 1. Clone repository & install dependencies
git clone https://github.com/Sajid-ul-Islam/AmarDeshApp.git
cd AmarDeshApp
npm install

# 2. Verify environment integrity
npm run typecheck    # Verifies strict TypeScript compliance (zero errors)
npm test             # Executes all 17 test suites (120 tests passing)

# 3. Start Expo development server
npm start
# Or platform specific:
npm run android      # Launches Android Emulator
npm run ios          # Launches iOS Simulator
npm run web          # Launches Web preview
```

### 1.2 Feature Development & Quality Gate Workflow
```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  Create Branch  │       │  Implement Code │       │ Automated Tests │
│ feat/<feature>  ├──────►│  + Feature Flag ├──────►│ npm run typecheck│
└─────────────────┘       └─────────────────┘       │    npm test     │
                                                            └────────┬────────┘
                                                                     │
┌─────────────────┐       ┌─────────────────┐                        │
│ Merge to main   │       │ Code Review     │                        ▼
│ & EAS Staging   │◄──────┤ & PR Checklist  │◄───────── PASS ALL GATES
└─────────────────┘       └─────────────────┘
```

1. **Branch Naming:** Enforce `feat/<feature-slug>`, `fix/<bug-description>`, or `docs/<doc-name>`.
2. **Feature Flags:** Guard experimental features in `store/useAppStore.ts` under `features`.
3. **Strict Quality Gates:** Before submitting PR:
   - `npm run typecheck` must report zero TypeScript errors.
   - `npm test` must run with 100% test pass rate.
   - All interactive UI touch targets must adhere to minimum 44×44px hit slop.
   - No hardcoded English strings on user-facing screens without Bengali fallbacks.

### 1.3 Build, EAS & Release Pipeline
The production mobile builds are compiled using Expo Application Services (EAS):

```bash
# Authenticate EAS CLI
eas login

# 1. Internal QA Preview Build (APK / Simulator build)
eas build --profile preview --platform android
eas build --profile preview --platform ios

# 2. Production Store Submission Build (AAB for Google Play, IPA for App Store)
eas build --profile production --platform android
eas build --profile production --platform ios

# 3. Automated Store Submission
eas submit --platform android --latest
eas submit --platform ios --latest
```

### 1.4 Over-The-Air (OTA) Updates Workflow via `expo-updates`
For instant runtime bug fixes and UI updates that do not alter native binary code:

```
[Developer edits JS/TS assets]
               │
               ▼
[Run automated test suite: npm test && npm run typecheck]
               │
               ▼
[Publish OTA Update: eas update --branch production --message "Fix headline spacing"]
               │
               ▼
[Client App boots: services/otaUpdateService.ts detects new manifest]
               │
               ▼
[Background download completes -> Hot-swaps on next app launch]
```

---

## 2. Content Ingestion & Publishing Workflows

### 2.1 Live RSS Ingestion & HTML Fallback Scraper Workflow
```
                     ┌───────────────────────────────┐
                     │ Client triggers fetchArticles │
                     └───────────────┬───────────────┘
                                     │
                     ┌───────────────▼───────────────┐
                     │ Check memory cache (TTL 5min) │
                     └───────┬───────────────┬───────┘
                             │ Valid         │ Expired / Miss
                             ▼               ▼
                      [Return Cache]  ┌───────────────────────────────────┐
                                      │ GET https://dailyamardesh.com/feed│
                                      └──────────────┬────────────────────┘
                                                     │
                                       ┌─────────────┴─────────────┐
                                       │ Status 200 OK?            │
                                       ├─────────────┬─────────────┤
                                       │ YES         │ NO (Error)  │
                                       ▼             ▼             │
                        ┌───────────────────┐ ┌──────────────────┐ │
                        │ Parse RSS XML     │ │ Run HTML Scraper │ │
                        │ CDATA sanitize    │ │ articleScraper.ts│ │
                        └─────────┬─────────┘ └────────┬─────────┘ │
                                  │                    │           │
                                  └──────────┬─────────┘           │
                                             ▼                     │
                              ┌────────────────────────┐           │
                              │ Deduplicate by GUID/ID │           │
                              └──────────────┬─────────┘           │
                                             ▼                     │
                              ┌────────────────────────┐           │
                              │ Write to AsyncStorage  │           │
                              │ & render feed UI       │           │
                              └────────────────────────┘           ▼
                                                       [Offline SQLite Fallback]
```

---

## 3. Core Feature Workflows

### 3.1 Bring-Your-Own-Key (BYOK) AI Summary Workflow
```
[User views Article Detail screen]
               │
               ▼
[User taps "স্মার্ট সারাংশ" (AI Summary) or opens AI Assistant Modal]
               │
               ▼
[Inspect local SecureStore / AsyncStorage for BYOK key]
               ├─────────────────────────────────────────┐
               │ Key Found                               │ Key Missing
               ▼                                         ▼
[Select Provider Endpoint:               [Display Setup Banner:
 Claude / GPT-4o / Gemini / DeepSeek]     "আপনার পছন্দের AI কী যোগ করুন"]
               │                                         │
               ▼                                         ▼
[Construct Bengali System Prompt:        [User navigates to app/settings/ai.tsx,
 "নিচের সংবাদ থেকে ৩টি মূল পয়েন্ট দিন..."] pastes key & validates with test ping]
               │
               ▼
[Execute HTTPS POST directly from mobile handset]
               │
               ├─────────────────────────────────────────┐
               │ Success (200 OK)                        │ Rate Limit / Error
               ▼                                         ▼
[Parse response into 3-bullet points     [Show friendly Bengali retry message
 and animate into AiSummaryCard.tsx]      or fallback to local extractive summary]
```

### 3.2 Bengali Text-to-Speech (TTS) Audio News Workflow
1. **Trigger:** User taps the `<Ionicons name="volume-high" />` icon in the article detail header or list card.
2. **Text Normalization:**
   - Cleans HTML tags, URLs, and image captions.
   - Translates Latin digits to Bengali numerals (`0-9` -> `০-৯`) for natural pronunciation.
   - Expands abbreviations (*ডাঃ* -> *ডাক্তার*).
3. **Voice Engine Synthesis:**
   - Dispatches speech request to `expo-speech` with `language: 'bn-BD'` (fallback to `bn-IN` or OS default).
   - Manages playback rate (`0.75x`, `1.0x`, `1.25x`, `1.5x`) dynamically.
4. **UI State Docking:** Renders docked `AudioNewsBar.tsx` player at viewport bottom with pause, resume, and 10s skip controls.
5. **Background Audio:** Playback continues uninterrupted if screen turns off or user switches apps.

### 3.3 Interactive e-Paper Column Hotspot & Crop Workflow
1. **Edition Ingestion:** Downloads optimized high-resolution daily page images and hotspot coordinate matrices.
2. **Canvas Projection:** Renders pan/zoom canvas via `app/(tabs)/epaper.tsx`.
3. **Hotspot Overlay:** Projects highlighted boundary frames over recognized columns with `"কলাম পাঠ"` badges.
4. **Crop Action:** User taps hotspot or initiates freehand crop:
   - System computes relative coordinates `[x, y, width, height]`.
   - Generates high-resolution cropped graphic image.
   - Opens bottom sheet modal with digitized text preview and 1-tap Native Share to WhatsApp, Facebook, or Telegram.

### 3.4 Local-First Personalization & Affinity Workflow
```
[User interacts with article: Read (>15s), Bookmark, Reaction, or Share]
                                  │
                                  ▼
[EventTracker buffers event into in-memory queue]
                                  │
                                  ▼
[Periodic or background flush writes batch into SQLite reading_events table]
                                  │
                                  ▼
[AffinityCalculator runs exponential decay model: Score = Weight * e^(-lambda * t)]
                                  │
                                  ▼
[Updates affinities table for associated categories & tags]
                                  │
                                  ▼
[PersonalizationEngine re-ranks articles for "For You" personalized feed]
```

### 3.5 Push Notification & In-App Inbox Workflow
```
[CMS publishes breaking story or scheduled daily briefing]
                                  │
                                  ▼
[CMS webhook triggers Expo Push Notification server]
                                  │
                                  ▼
[Expo pushes to Apple APNs / Google FCM token]
                                  │
                                  ▼
[Device receives notification payload via notificationService.ts]
                                  │
                                  ▼
[Notification written to local notificationInboxService.ts SQLite / AsyncStorage]
                                  │
                                  ├────────────────────────────────────────┐
                                  │ User taps push banner                  │ User opens app normally
                                  ▼                                        ▼
[deepLinkService navigates       [Unread badge counter increments on
 directly to app/article/[id]]    menu/inbox tab]
```

---

## 4. User Experience Journey Workflows

### 4.1 First-Time Launch & Onboarding Journey
```
[App Cold Launch] ──► [StartupSplashScreen: Brand Logo + « স্বাধীনতার কথা বলে »]
                             │
                             ▼
              [Generate Local Anonymous UUID]
                             │
                             ▼
              [Initialize SQLite Database: user/db.ts]
                             │
                             ▼
              [Language & District Preference Check]
              (Defaults to Bengali 'bn' & Dhaka district)
                             │
                             ▼
              [Render Home Feed with Live RSS, Prayer Times & Breaking Ticker]
```

### 4.2 Offline Commuter Reading Journey
1. **Pre-Commute:** While connected to Wi-Fi/4G, the app automatically caches the top 50 news articles and user bookmarks in SQLite and AsyncStorage.
2. **Offline Transit:** User enters subway / underground zone with zero cellular connectivity:
   - App detects offline status via NetInfo.
   - Home screen displays cached stories seamlessly without error screens.
   - User reads articles, marks bookmarks, and posts emoji reactions.
3. **Reconnection:** Connectivity restores:
   - Event queue automatically flushes queued interaction events to SQLite.
   - Cloud sync adapter synchronizes bookmarks to Supabase/Firebase if user is authenticated.
   - RSS feed refreshes in background.

### 4.3 Data Sovereignty & Privacy Journey
1. User navigates to **মেনু** -> **সেটিংস** -> **গোপনীয়তা ও ডেটা** (`app/settings/privacy.tsx`).
2. User reviews lifetime statistics (total articles read, total reading time, active streak days).
3. **Export Flow:** User taps **"ডেটা এক্সপোর্ট করুন"** (`app/settings/export.tsx`), generating an encrypted JSON archive of all reading records and bookmarks for download or email.
4. **Purge Flow:** User taps **"সমস্ত ডেটা মুছুন"**:
   - System prompts confirmation alert with danger styling.
   - Drops all SQLite records in `user_metadata`, `reading_events`, and `affinities`.
   - Clears AsyncStorage keys and generates a clean anonymous ID.
