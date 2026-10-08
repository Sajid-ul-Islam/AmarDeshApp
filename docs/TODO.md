# TODO - Daily Amar Desh Mobile App (দৈনিক আমার দেশ)

## 📌 Overall Project Status: 100% Core Features Complete (v1.4.2)
All 6 development phases, the icon-first curvy design system, multi-tier offline persistence, BYOK AI multi-model engine, interactive e-paper, full Bengali localization, Editorial UI/UX Upgrades (Sepia theme, Visual Stories, Quote Cards, Live Ticker), codebase-wide bug fixes, and UI/UX component overlap resolution & icon-first upgrades have been implemented and validated with 18 test suites (126/126 tests passing) and zero TypeScript errors.

---

## 🎨 Phase A: Icon-First UI & Modern Curvy Design System

### ✅ Completed
- [x] Defined central border-radius tokens in `theme/tokens.ts` (`sm: 8px`, `md: 12px`, `lg: 16px`, `xl: 20px`, `2xl: 24px`, `pill: 999px`)
- [x] Integrated `radii` and `shadows` (soft card & diffused ambient shadows) into `getThemeTokens` and `useThemedStyles`
- [x] Refactored all 18 primary components and screens to rounded/curvy design system:
  - [x] `components/PrayerTimesWidget.tsx` (curvy container, soft shadows, pill indicators, icon-led GPS prompt)
  - [x] `components/DistrictPickerModal.tsx` (curvy sheet `radii['2xl']`, pill buttons, icon badges)
  - [x] `components/AdBanner.tsx` (curvy cards, pill CTA buttons, soft shadows)
  - [x] `components/AiSummaryCard.tsx` (curvy card, pill buttons, icon-first regenerate and toggle controls)
  - [x] `components/AiAssistantModal.tsx` (curvy bottom sheet, pill chips, rounded bubbles)
  - [x] `components/BreakingNewsTicker.tsx` (pill badge, pill pulse dot, hairline borders)
  - [x] `components/ContinueReadingCard.tsx` (curvy container, pill progress, icon-driven action)
  - [x] `components/ReadingStreak.tsx` (curvy card, pill flame badge)
  - [x] `components/ArticleReactions.tsx` (curvy container, rounded reaction pills)
  - [x] `components/AudioNewsBar.tsx` (curvy player bar, pill speed and playback buttons)
  - [x] `components/FloatingVideoPlayer.tsx` (curvy floating container, pill status badges)
  - [x] `components/ReaderSettingsModal.tsx` (curvy modal, pill buttons, close icon button)
  - [x] `components/SyncStatus.tsx` (curvy container, pill login/sync buttons)
  - [x] `app/(tabs)/index.tsx` (curvy hero card & article cards, pill category chips, icon-only header buttons)
  - [x] `app/(tabs)/video.tsx` (curvy cards, pill chips, concise icon-led channel and PiP buttons)
  - [x] `app/(tabs)/menu.tsx` (curvy date/weather and e-paper cards, pill search button, pill language segment)
  - [x] `app/(tabs)/bookmarks.tsx` (curvy cards, pill segment tabs, icon-first interests action)
  - [x] `app/(tabs)/search.tsx` (pill search bar, pill tag chips, curvy result cards)
  - [x] `app/(tabs)/epaper.tsx` (curvy viewer card, pill floating control bar, curvy crop sheet)
  - [x] `app/article/[id].tsx` (curvy cards, pill buttons, curvy share sheet)
  - [x] `app/settings/ai.tsx`, `app/category/[slug].tsx`, `app/july-revolution/index.tsx`, `app/auth/login.tsx`, `app/settings/interests.tsx`, `app/settings/privacy.tsx`
- [x] Replaced bulky text with icons in key action areas:
  - [x] Bookmarks: Replaced long text "পছন্দ কাস্টমাইজ করুন" with icon-first `<Ionicons name="options-outline" />` and compact label
  - [x] Video screen: Replaced long labels with YouTube icon badge "চ্যানেল ↗", and "ভাসমান" PiP button
  - [x] Prayer Times: Replaced long prompt with icon-led `<Ionicons name="navigate" /> সঠিক সময়ে GPS অন করুন →`
  - [x] Fixed `ReaderSettingsModal.tsx` tokens typing and close icon button
  - [x] Optimized micro-touch hit slop across all pill action buttons (min 44x44px)

---

## 🎯 Phase 1: Core Native Architecture & Feed Experience

### ✅ Completed
- [x] Setup native Expo SDK 52 / React Native 0.76 architecture with Expo Router v4
- [x] Define TypeScript interfaces for articles, categories, prayer times, and bookmarks
- [x] Build Root Layout (`app/_layout.tsx`) with safe area provider and theme context
- [x] Build Tab Navigation (`app/(tabs)/_layout.tsx`) with 5 tabs: Home, Video, e-Paper, Bookmarks, Menu
- [x] Build Home Feed (`app/(tabs)/index.tsx`) with hero article, category chips, breaking news ticker, and pull-to-refresh
- [x] Build Header & Masthead with date, prayer times summary, weather, and language toggle
- [x] Build Category Navigation with horizontal scroll chips and dedicated pages (`app/category/[slug].tsx`)
- [x] Build Search Screen (`app/(tabs)/search.tsx`) with debounced querying, history tags, and category filters
- [x] Build Article Detail Page (`app/article/[id].tsx`) with rich typography, author bylines, and related articles
- [x] Implement live RSS ingestion (`services/rssService.ts`) with HTML scraper fallback (`services/articleScraper.ts`)
- [x] Implement deep link handling (`services/deepLinkService.ts`) for `amardesh://` scheme

---

## 📱 Phase 2: Enhanced Multimedia, Audio & Engagement

### ✅ Completed
- [x] Implement native Text-to-Speech service (`services/ttsService.ts`) with Bengali language voice fallback
- [x] Build floating and docked Audio News Player (`components/AudioNewsBar.tsx`) with 0.75x–1.5x speed controls
- [x] Build YouTube Multimedia Feed (`app/(tabs)/video.tsx`) and YouTube player (`components/YouTubePlayer.tsx`)
- [x] Build Picture-in-Picture floating video player (`components/FloatingVideoPlayer.tsx`)
- [x] Implement native share sheet (`services/sharingService.ts`) supporting 6 channels (WhatsApp, Facebook, Twitter, Telegram, Email, Copy Link)
- [x] Build Article Reactions (`components/ArticleReactions.tsx`) with 5 emoji sentiments and aggregate counters
- [x] Build Reading Streak & Habit Tracker (`components/ReadingStreak.tsx`)
- [x] Build Reader Settings Modal (`components/ReaderSettingsModal.tsx`) with font scaling and line height adjustment
- [x] Implement dark mode & OLED night mode with system theme detection (`theme/index.ts`, `theme/tokens.ts`)

---

## 💾 Phase 3: Offline Resilience, Caching & Local Personalization

### ✅ Completed
- [x] Build multi-tier offline storage engine (`services/storage.ts` & `services/offlineDatabase.ts`)
- [x] Implement SQLite on-device user profile database (`user/db.ts`) with automated migrations
- [x] Build on-device event tracker (`user/eventTracker.ts`) with zero-leak privacy controls
- [x] Build on-device affinity calculator (`user/affinityCalculator.ts`) calculating category and tag weights
- [x] Build on-device personalization engine (`user/personalizationEngine.ts`) for "For You" recommendations
- [x] Build Continued Reading Tracker (`components/ContinueReadingCard.tsx`) saving scroll offset & article progress
- [x] Build Bookmarks Store (`services/articleStore.ts`) with tag categorization and offline availability indicators
- [x] Implement network resilience with offline fallback to cached feeds

---

## 🔔 Phase 4: Push Notifications & Live Communications

### ✅ Completed
- [x] Setup Expo Notifications (`services/notificationService.ts`) with notification channels (Breaking, Daily Briefing, Categories)
- [x] Implement In-App Notification Inbox (`services/notificationInboxService.ts`) with read/unread flags and badges
- [x] Build Notifications Screen (`app/notifications/index.tsx`) and Settings (`app/settings/notifications.tsx`)
- [x] Build Breaking News Ticker (`components/BreakingNewsTicker.tsx`) with real-time flash animation
- [x] Build Server-side CMS webhook and push handler (`server/__tests__/cmsWebhookAndPush.test.ts`)
- [x] Build Over-The-Air (OTA) update service (`services/otaUpdateService.ts`) with update check on launch

---

## 🤖 Phase 5: BYOK Multi-Model AI & Interactive e-Paper

### ✅ Completed
- [x] Implement Bring-Your-Own-Key (BYOK) AI Service (`services/byokAiService.ts`) supporting:
  - [x] Anthropic Claude (Claude 3.5 Sonnet, Claude 3 Haiku)
  - [x] OpenAI (GPT-4o, GPT-4o-mini)
  - [x] Google Gemini (Gemini 1.5 Pro, Gemini 1.5 Flash)
  - [x] DeepSeek (DeepSeek Chat, DeepSeek Coder)
- [x] Build AI Key Configuration & Testing Screen (`app/settings/ai.tsx`) with client-side secure persistence
- [x] Build AI Summary Card (`components/AiSummaryCard.tsx`) extracting 3 key bullet points in Bengali
- [x] Build AI Conversational Assistant Sheet (`components/AiAssistantModal.tsx`) with contextual article Q&A
- [x] Implement Interactive e-Paper Reader (`app/(tabs)/epaper.tsx`, `services/epaperService.ts`) with:
  - [x] High-resolution page pan and pinch-zoom
  - [x] Interactive column hotspots with "কলাম পাঠ" overlays
  - [x] Column crop & clipping bottom sheet modal with share actions

---

## 🌐 Phase 6: Cloud Sync, July Revolution Archive & Hyper-Local Feeds

### ✅ Completed
- [x] Build Cloud Sync Service (`services/cloudSyncService.ts`) supporting Supabase and Firebase adapters
- [x] Build User Auth & Sync Management Screen (`app/auth/login.tsx`, `components/SyncStatus.tsx`)
- [x] Build July Revolution Special Archive (`app/july-revolution/index.tsx`) commemorating the July 2024 movement
- [x] Build Bangladesh District & Division Service (`services/districtService.ts`) covering all 64 districts & 8 divisions
- [x] Build District Picker Modal (`components/DistrictPickerModal.tsx`) with quick division filter and search
- [x] Build Prayer Times Service (`services/prayerTimesService.ts`) with GPS calculation & offline fallback for 64 districts
- [x] Build Privacy & Data Export Screen (`app/settings/privacy.tsx`, `app/settings/export.tsx`) with GDPR data download/purge
- [x] Build Internationalization Engine (`services/i18n.ts`) supporting 100% Bengali (`bn`) and English (`en`) interface

---

## 💎 Phase UI/UX: Editorial Upgrades & Micro-Interactions (v1.4.0)

### ✅ Completed
- [x] **"সংবাদপত্র সেপিয়া" (Parchment Sepia Mode)** (`theme/tokens.ts`, `theme/index.ts`, `theme/ThemeProvider.tsx`, `store/useAppStore.ts`):
  - Added 3rd broadsheet theme with warm parchment palette (`#f4ebd9`), ink typography (`#2c221e`), and diffused warm shadows (`#3c2e24`)
  - Integrated 3-way theme toggle across Menu and Article Reader settings modal (☀️ লাইট, 📜 সেপিয়া, 🌙 ডার্ক)
- [x] **Editorial Quote Card Generator Modal** (`components/QuoteCardModal.tsx`, `app/article/[id].tsx`):
  - Branded editorial quote card creation with 4 palette themes, Amar Desh logo watermark, editable quotes, clipboard copy, and native share sheet
- [x] **"আজকের দৃষ্টিপাত" Visual Web Stories Rail & Full-Screen Viewer** (`components/VisualStoriesBar.tsx`, `components/VisualStoryModal.tsx`, `data/storiesData.ts`, `app/(tabs)/index.tsx`):
  - Horizontal circular story preview rail below masthead
  - Full-screen story viewer with progress timers, tap navigation, takeaway card, and article deep-link
- [x] **Focus Reading Mode (ডিস্ট্র্যাকশন-মুক্ত পাঠ)** (`app/article/[id].tsx`):
  - Distraction-free reading toggle collapsing chrome, audio, AI, and reactions to focus on pure typography
  - Floating restore pill to return to standard broadsheet layout
- [x] **Feed Presentation Switcher (Magazine vs Compact)** (`store/useAppStore.ts`, `app/(tabs)/index.tsx`):
  - Quick header toggle between Magazine (hero cards) and Compact list (high-density list with thumbnails)
  - Persistent AsyncStorage storage (`@amar_desh_feed_layout`)
- [x] **Animated Speech Waveform & Dockable Mini-Pill** (`components/AudioNewsBar.tsx`):
  - 4-bar animated equalizer responding to TTS speech playback
  - Dockable floating mini-pill mode that stays out of the reader's view and expands on tap
- [x] **Reaction Particle Burst & Haptic Feedback** (`components/ArticleReactions.tsx`):
  - Floating `+1` particle burst micro-animation with spring scaling and opacity fade
  - Tactile physical feedback via `expo-haptics`
- [x] **Contextual Milestone Timeline Scrubber** (`components/ArticleTimeline.tsx`, `app/article/[id].tsx`):
  - Vertical timeline with date badges, milestone summaries, and highlighted current status node for developing news
- [x] **AI Tone & Simplification Switcher ("সহজ ভাষায় পড়ুন")** (`components/AiSummaryCard.tsx`):
  - 3-segment switcher in AI Summary card: `মূল পয়েন্ট` (Key Takeaways), `সহজ ভাষায়` (Simplified Bengali), and `প্রেক্ষাপট` (Historical Context)
- [x] **Live Cricket Scores & Market Indicators Ticker** (`components/LiveRatesTicker.tsx`, `data/ratesData.ts`, `app/(tabs)/index.tsx`):
  - Real-time horizontal ticker for Bangladesh cricket, DSEX index, USD/BDT rate, and gold prices
- [x] **ePaper Magnifier Loupe Lens** (`app/(tabs)/epaper.tsx`):
  - 2.5x circular magnifier lens with touch responder for inspecting fine column print and classifieds
- [x] **Automated Test Suite for UI/UX Upgrades** (`services/__tests__/uiUxEnhancements.test.ts`):
  - 100% pass across all 18 test suites (126/126 tests) with zero TypeScript errors

---

## 📊 Comprehensive Progress Summary

| Phase / Module | Scope | Status | Test Suites | Progress |
| :--- | :--- | :---: | :---: | :---: |
| **Documentation & System Specs** | PRD, TRD, DESIGN, Architecture, Schema, Workflow | ✅ | N/A | **100%** |
| **Phase 1: Core Native App** | Layout, Home, Article, Category, Search, RSS | ✅ | 3 Suites | **100%** |
| **Phase 2: Multimedia & Audio** | TTS, YouTube Player, PiP, Sharing, Reactions | ✅ | 2 Suites | **100%** |
| **Phase 3: Offline & Personalization**| SQLite DB, Event Tracker, Affinity, Slices | ✅ | 4 Suites | **100%** |
| **Phase 4: Notifications & OTA** | Push Channels, Inbox, OTA Update Service | ✅ | 3 Suites | **100%** |
| **Phase 5: BYOK AI & e-Paper** | Claude/GPT/Gemini/DeepSeek, e-Paper Canvas | ✅ | 2 Suites | **100%** |
| **Phase 6: Cloud Sync & Specials** | Cloud Sync, July Revolution, 64 Districts, Prayer | ✅ | 3 Suites | **100%** |
| **Design System (Curvy & Icon-First)**| Tokens, Radii, Shadows, 18 Components Refactored | ✅ | Included | **100%** |
| **UI/UX Upgrades Suite (v1.4.0)** | Sepia Theme, Quote Cards, Web Stories, Loupe, Ticker | ✅ | 1 Suite | **100%** |

**Total Automated Test Coverage:** 18 Test Suites / 126 Unit & Integration Tests Passed (100%).

---

## 🚀 Release Readiness & Deployment Checklist

### Pre-Launch Production Tasks
- [ ] Configure EAS Build production credentials for Google Play Store (Upload Keystore)
- [ ] Configure Apple Developer Team ID and App Store Provisioning Profiles (`eas.json`)
- [ ] Set production RSS feed endpoints and fallback CDN URLs in `.env.production`
- [ ] Generate final high-resolution marketing screenshots for Google Play & iOS App Store
- [ ] Connect remote Sentry / Crashlytics DSN for production release exception monitoring
- [ ] Perform staging build test via `eas build --profile staging --platform android`

### Post-Launch Backlog (v1.5.0+)
- [ ] Audio podcast series download for offline morning commute listening
- [ ] Citizen journalism reporting module with encrypted image upload
- [ ] Apple Watch & Android Wear glanceable breaking news complication
