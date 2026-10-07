# Changelog - Daily Amar Desh Mobile App

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 2026 Advanced Mobile Newspaper Capabilities & Backend Newsroom Suite
- **Article Swipe & Next-Previous Navigation** (`app/article/[id].tsx`):
  - Category-scoped bidirectional article switcher ("← পূর্ববর্তী সংবাদ" / "পরবর্তী সংবাদ →") with rich headline preview cards.
  - Native gesture PanResponder allowing readers to swipe left or right to flip between news stories effortlessly.
- **Interactive ePaper Column Hotspot & Crop Reader** (`app/(tabs)/epaper.tsx`):
  - Interactive column hotspots on print replica newspaper pages with distinct Bengali badges ("কলাম পাঠ").
  - Rich bottom sheet modal displaying cropped article clipping, headline, snippet, social share, and 1-tap deep link to digitized full-text reading view.
  - Floating toolbar toggle to show or hide hotspots dynamically.
- **Floating Video Mini-Player / PiP Mode** (`components/FloatingVideoPlayer.tsx`, `app/(tabs)/video.tsx`):
  - Floating mini-player overlay in bottom-right corner when scrolling through video playlists or tapping "মিনি প্লেয়ার".
  - Allows browsing multimedia stories without interrupting active video playback context, with 1-tap expand and dismiss controls.
- **Native Editorial Ad & Sponsorship Unit** (`components/AdBanner.tsx`):
  - Dignified editorial sponsorship card with authentic Bengali badge ("বিজ্ঞাপন • SPONSORED"), sponsor partner attribution, custom blurb, and call-to-action button.
  - Seamlessly embedded in home feed (`app/(tabs)/index.tsx`) and article footer (`app/article/[id].tsx`).
- **Bidirectional Cloud Account Sync Service** (`services/cloudSyncService.ts`):
  - Cloud synchronization engine for bookmarks (set union merge), reading streaks (max streak merge), reader reactions, and preferences.
  - Offline queuing with retry handler and real-time state subscription listener.
- **Backend CMS Webhook & Push Notification Server Worker** (`server/cmsWebhookHandler.ts`, `server/pushNotificationWorker.ts`):
  - HMAC-SHA256 authenticated webhook listener for newsroom CMS publishing events (`article.published`, `breaking.alert`, `article.updated`).
  - Batch push notification dispatcher supporting Expo and FCM delivery with Bengali breaking news alert formatting.
- **Testing & Typecheck Verification**:
  - 13 test suites passing (86 / 86 unit and integration tests passing).
  - 0 TypeScript compiler errors (`npm run typecheck`).
- **BYOK (Bring Your Own Key) Multi-Provider AI Engine** (`services/byokAiService.ts`, `app/settings/ai.tsx`):
  - Client-side direct integration supporting Google Gemini (1.5/2.0 Flash), Groq (Llama 3.3 70B), DeepSeek AI (V3), and OpenAI (GPT-4o-mini).
  - Keys stored exclusively in local device storage (`@amar_desh_byok_ai_config`) with zero third-party relay.
  - Interactive test connection tool verifying provider status with instant Bengali diagnostic feedback.
  - Offline Bengali extractive fallback summarizer ensuring summary cards always display even without an active key.
- **AI 3-Point Smart Summary Card** (`components/AiSummaryCard.tsx`):
  - Integrated into article reader screens providing 3 concise, high-impact Bengali takeaway bullet points with quick expand/collapse and regeneration.
- **Interactive AI News Assistant Modal** (`components/AiAssistantModal.tsx`):
  - Q&A chat assistant on every article screen enabling readers to ask contextual questions (background, economic impact, jargon explanation) with pre-filled question chips.
- **Notification Center & Persistent Inbox** (`services/notificationInboxService.ts`, `app/notifications/index.tsx`):
  - Full-featured notification inbox with channel filtering (Breaking, Daily Briefing, Category, General), read/unread status tracking, unread count badge, and deep linking to target articles.
  - Live notification bell icon with badge count integrated into the home screen masthead header.
  - Push alert simulator allowing instant testing of breaking news alerts directly from the app.
- **Modern Newspaper Reader Engagement Suite**:
  - **Article Emoji Reactions** (`components/ArticleReactions.tsx`): Interactive 5-reaction bar (❤️ পছন্দ, 👍 গুরুত্বপূর্ণ, 💡 তথ্যবহুল, 😢 দুঃখজনক, 😡 ক্ষোভ) with local count aggregation in Bengali numerals.
  - **Continue Reading Shelf** (`components/ContinueReadingCard.tsx`): Persistent home feed card tracking articles read between 10% and 90% with dynamic percentage bar.
  - **Live Weather Chip** in Home masthead ("ঢাকা ২৮° সে. ⛅").
- **Test & Type Verification**:
  - 11 test suites passing, 78 / 78 tests passing (`npm test`).
  - 0 TypeScript type errors (`npm run typecheck`).

### Complete UI/UX Brand Polish & CybrCraft Enterprise Proposal Suite
- **Universal Theme Token Migration** (`theme/tokens.ts`, `theme/useThemedStyles.ts`) — Unified Brand Crimson (`#DC2626`), Forest Green (`#006B3F`), Editorial Slate (`#0F172A`), and OLED dark mode (`#0A0A0A`). Upgraded bottom tab layout, bookmarks, search, profile, menu, category, and settings screens with dynamic token-driven styling and high-contrast dark theme.
- **Enhanced Article Detail & Reader Experience** (`app/article/[id].tsx`) — Live 0–100% reading progress indicator, floating Bengali TTS audio player bar, and reader font customization.
- **Enterprise Proposal & Outreach Package for Daily Amar Desh** (`docs/`):
  - `Daily_Amar_Desh_Mobile_App_Proposal_CybrCraft.docx` (985 KB native Word document with official logos, KPI charts, timeline, and two-phase official CMS integration narrative).
  - `Daily_Amar_Desh_Mobile_App_Proposal_CybrCraft.html` (Interactive HTML document with base64 embedded visual assets, printable to PDF).
  - `AMAR_DESH_PROPOSAL_BENGALI.md` (Dignified formal Bengali letter to Editor Mahmudur Rahman).
  - `AMAR_DESH_MOBILE_APP_PROPOSAL.md` (10-section Master Technical Proposal in English).
  - `MODERN_NEWSPAPER_APP_INDUSTRY_REPORT.md` (2026 Industry Benchmark Report covering 10 pillars of modern news apps).
  - `PROPOSAL_STRATEGY_PLAN.md` & `OUTREACH_KIT_CONTACT_US.md` (Strategic multi-channel pitch plan with ready-to-send payloads).
  - `AMAR_DESH_UI_UX_BRAND_GUIDE.md` (UI/UX design system specification).
- **Test & Type Verification** — 0 TypeScript compiler errors (`npm run typecheck`), 100% pass rate across all 9 test suites (70/70 unit and integration tests).

### Modern Industry-Standard Expo Android App & dailyamardesh.com Content Mirroring
- **5-Tab Native Android Navigation** — Upgraded navigation structure to 5 core tabs: হোম (Home), ই-পেপার (ePaper Gallery), ভিডিও (Multimedia Hub), সেভ (Saved & Offline), and মেনু (Full 14-category catalog, search & settings).
- **ePaper Static Image Gallery Edition** (`app/(tabs)/epaper.tsx`) — Native daily print replica reader with page switching (১ম পাতা, ২য় পাতা, সম্পাদকীয়, ইত্যাদি), pinch-to-zoom, and one-tap offline download manager.
- **Video & Multimedia News Hub** (`app/(tabs)/video.tsx`) — Video news stream featuring Amar Desh video reports, duration tags, category chips, and inline YouTube video player.
- **Full Taxonomy & Content Service** (`services/contentService.ts`) — Unified ingestion supporting all 14 site verticals (সর্বশেষ, জুলাই বিপ্লব, জাতীয়, রাজনীতি, বাণিজ্য, সারা দেশ, বিনোদন, বিশ্ব, খেলা, ইসলাম ও জীবন, মতামত, ফিচার, শিক্ষা, কর্পোরেট).
- **Rich Full-Text Article Extractor** (`services/articleScraper.ts`) — On-demand scraper fetching structured paragraphs, photo captions, author avatars, and caching to SQLite/AsyncStorage for instant offline re-reads.
- **Enhanced Article Reader** (`app/article/[id].tsx`) — In-reader font size scaler (A- / A+), floating Bengali TTS audio player bar (`components/AudioNewsBar.tsx`), photo captions, and related stories.
- **July Revolution Memorial Portal** (`app/july-revolution/index.tsx`) — Flagship hub commemorating the 2024 uprising with martyr memoirs and reform articles.
- **District News & Prayer Times Utility** (`services/prayerTimesService.ts`, `components/PrayerTimesWidget.tsx`, `components/DistrictPickerModal.tsx`) — Division-accurate Namaz times with Hijri date and 8-division countrywide selector.
- **Animated Breaking News Ticker** (`components/BreakingNewsTicker.tsx`) — Live marquee ticker with pulsating red badge.

### Live News Everywhere (no more hardcoded articles)
- **Single shared live feed** — new `services/articleStore.ts` is the one source of truth: a single in-flight RSS fetch shared by all screens, cached to AsyncStorage after every successful fetch, with a subscribe API (`useSyncExternalStore`) so screens re-render when fresh data lands.
- **All screens now read live data** — Search, For You, Bookmarks, and Article Detail previously searched/rendered only the static mock list; they now resolve against the live feed (mock data only as last-resort offline fallback).
- **Stable article IDs** — RSS articles were re-id'ed `rss-<index>-<timestamp>` on every fetch, breaking bookmarks/deep links across refreshes. IDs are now a deterministic hash of the article URL, and the list is sorted newest-first.
- **Correct breaking flag** — `isBreaking` was "first 2 feed items" (reshuffled every refresh); it now means published within the last 6 hours.
- **Warm on launch** — root layout kicks off the fetch before any screen mounts.
- 12 new unit tests for the store (58 total passing).

### Event Tracking Completion & Expo Go Crash Fix
- **Fixed Android startup crash in Expo Go** — `expo-notifications` is now loaded lazily; its module-level push-token registration throws in Expo Go since SDK 53. All notification APIs no-op gracefully in Expo Go on Android, and the notifications settings screen shows an explanatory banner (Bengali).
- **AppState lifecycle** — event tracker now flushes the in-memory queue and records `app_backgrounded` (with session duration) when the app backgrounds, preventing event loss when the JS runtime is suspended.
- **90-day data retention** — events older than 90 days are purged during user store initialization (design doc §7.1).
- **article_state aggregation** — new `user/articleState.ts` maintains open count, cumulative dwell time, max scroll depth, and saved/shared flags per article; wired into the article screen's open/close/bookmark/share flows.
- **Correct source attribution** — `article_opened` now records `search` (passed from search results), `notification` (appended by the notification tap handler), and `deep_link` instead of hardcoded `feed`.
- **category_viewed tracking** — home screen category tabs now emit `category_viewed` events.
- **Persisted privacy toggle** — the behavior-tracking opt-out now survives app restarts via AsyncStorage.
- Test setup: AsyncStorage mock now returns promises like the real module.

### Expo SDK 57 Migration
- Upgrade Expo, React Native, React, Expo Router, and native dependencies to the SDK 57 versions.
- Remove unused native Firebase, legacy navigation, and retired `expo-av` dependencies; Firebase uses the existing JavaScript SDK.
- Let `babel-preset-expo` configure Reanimated/Worklets and remove references to missing icon and splash assets.
- Add mobile type checking, Android/iOS bundle export, and an explicit Expo Go startup command.
- Correct Firebase module paths and notification API types; skip remote push token registration in Expo Go.
- Update native setup instructions for Node.js 22.13+ and SDK 57.

### Social & Multimedia Integration ✅
- **Deep Linking** - URL parameter parsing, PWA manifest, article/category routing from shared links
- **YouTube Enhancement** - Reusable `<YouTubePlayer>` component with loading/error states
- **Social Sharing** - Enhanced share sheet with platform icons (WhatsApp, Facebook, Twitter, Telegram, Email)
- **Story Sharing** - Canvas-based image generation for Instagram/Facebook stories
- **PWA Support** - Manifest.json for app-like experience
- New services: `deepLinkService.ts`, `socialShareService.ts`, `shareImageService.ts`
- New components: `YouTubePlayer.tsx`, `ShareSheet.tsx`
- Feature flags: `enableDeepLinking`, `enableYouTubePlayer`, `enableSocialSharing`, `enableStorySharing`

### Documentation
- Created `AGENTS.md` - Development guide with commands, style, guardrails
- Created `docs/prd/group-a-core-ux.md` - PRD for Group A features
- Created `docs/prd/group-b-multimodal.md` - PRD for Group B features
- Created `docs/prd/groups-c-d-e.md` - PRD for Groups C, D, E features
- Created `AUDIT_REPORT.md` - Codebase audit for social/multimedia features
- Created `docs/design/social-integration.md` - Design doc for social integration

### Implemented (Group B - Multimodal Content) ✅
- **B1: TTS Listen Mode** — Browser SpeechSynthesis API, Bengali voice support, play/pause/speed controls
- **B2: Audio Playlist** — Queue articles, auto-advance, skip previous/next
- **B3: 3-Minute Update** — Curated top-5 news briefing card on home page
- **B4: Vertical Video Feed** — TikTok-style YouTube embeds with swipe navigation
- **B5: Mini Player** — Persistent player bar above bottom nav with progress
- **TTS Service** — Bengali text-to-speech with rate control and progress tracking
- **Player Store** — Global audio state with queue management
- **Listen Button** — Added to article detail pages
- **Feature flags** — All Group B features independently toggleable

### Implemented (Group C - Community & Engagement) ✅
- **C1: Emoji Reactions** — 5 emoji reactions (❤️ 😂 😮 😢 😡) on articles with persistent counts
- **C2: Comments Section** — Full comments system with featured comments and like functionality
- **C3: Reading Streak** — Track consecutive reading days with points system and confetti celebrations
- **C4: Most Commented** — Homepage widget showing top 5 most-commented articles
- **Reactions Store** — Manages reactions, comments, and reading streaks
- **Confetti Integration** — canvas-confetti for milestone celebrations

### Implemented (Group D - Utility & Accessibility) ✅
- **D1: Offline Download** — Download articles for offline reading with visual indicators
- **D2: Continue Reading** — Auto-save scroll position with restore banner
- **D3: Font Size Control** — Adjustable font sizes (S/M/L/XL) with persistent settings
- **D4: Enhanced Search** — Search across all articles with category filtering
- **D5: Smart Summary** — AI-generated article summaries using BYoak AI integration
- **Offline Store** — Manages downloaded articles
- **Reading Store** — Manages font size and scroll positions

### Implemented (Group E - Commercial) ✅
- **E1: Gift Article** — Share articles via Web Share API with clipboard fallback
- **E2: Interactive Polls** — Embedded polls with real-time voting and results visualization
- **E3: Customizable Nav** — User-configurable bottom navigation with toggle switches
- **Ads Store** — Manages polls and user votes
- **Web Share API** — Native sharing with fallback support

### Implemented (Group A - Core UX & Personalization) ✅
- **A1: User-reorderable feed sections** — Drag-to-reorder with @dnd-kit, edit mode, reset to default
- **A2: "For You" tab** — Personalized feed based on followed categories, interest picker, onboarding
- **A3: Dual navigation toggle** — List ↔ Card mode with framer-motion swipe gestures
- **A4: Hyper-local feed selector** — District picker with 8 divisions → 64 districts, location badge
- **Feature flag system** — All features independently toggleable via "আরও" menu
- **3 new Zustand stores** — useLayoutStore, usePreferencesStore, useLocationStore
- **7 new components** — SectionBlock, EditLayoutMode, CardFeed, SwipeCard, InterestPicker, DistrictPicker, LocationBadge
- **1 new page** — ForYouPage
- **Static district data** — All 64 Bangladesh districts bundled

### Added
- Initial project setup with React + Vite + TypeScript + Tailwind CSS
- Documentation files (R&D, Architecture, Design, PRD, Rules, Agent, Test Plan)
- Project skeleton with folder structure
- Mock data for news articles
- Type definitions for articles and categories
- **RSS Feed Integration** - Fetches LIVE data from dailyamardesh.com/feed
- **Multi-strategy data fetching** - rss2json API + CORS proxy fallbacks
- **5-minute cache** - Reduces API calls, improves performance
- **Loading skeletons** - Smooth UX while data loads
- **Live/Demo indicator** - Shows whether data is live or fallback
- **Pull to refresh** - Manual refresh button
- **Source linking** - "Read on website" button links to original article
- **Error handling** - Graceful fallback to mock data on failure
- **BYoak AI Assistant** - Bring Your Own API Key AI chat system
  - Supports OpenAI, Google Gemini, Anthropic Claude, OpenRouter
  - Contextual article analysis (summarize, explain, translate, impact)
  - Chat history with localStorage persistence
  - Privacy-first: API keys stored only in user's browser
  - "Ask AI" button on article detail pages
  - Quick action buttons for common tasks
  - Bengali language AI responses
  - Free API key guide for users

### Planned
- Home page with hero section and news feed
- Category navigation with horizontal scrolling
- Article detail page
- Search functionality
- Prayer times widget
- Bookmark feature
- Dark mode toggle
- Bottom navigation bar
- Responsive layout for all screen sizes
- Offline support with service worker
- Push notifications

## [0.1.0] - 2026-09-20

### Added
- Project initialization
- Documentation suite created:
  - R&D.md - Website research and analysis
  - architecture.md - System architecture design
  - DESIGN.md - UI/UX design specifications
  - PRD.md - Product requirements document
  - RULES.md - Coding rules and guidelines
  - Agent.md - AI agent configuration
  - TEST_PLAN.md - Testing strategy
  - CHANGELOG.md - This file
  - README.md - Project overview
  - TODO.md - Task tracking
- Initial application skeleton
- Mock data with Bengali news articles
- TypeScript type definitions
- Utility functions for Bengali numerals

---

## Version History Format

### Types of Changes
- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Vulnerability fixes
