# Changelog - Daily Amar Desh Mobile App

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Gemini Dynamic Model Auto-Discovery & Resilient Multi-Model Engine
- **Dynamic Google Generative AI Model Discovery** (`services/byokAiService.ts`, `app/settings/ai.tsx`):
  - Implemented `discoverGeminiModels(apiKey)` dynamically querying `/v1beta/models` to discover models permitted for the user's API key.
  - Created automated candidate fallback sequence (`gemini-2.5-flash`, `gemini-flash-latest`, `gemini-2.0-flash`, `gemini-2.5-pro`, `gemini-1.5-flash`, etc.) ensuring **any valid Gemini API key works automatically** even when `gemini-1.5-flash` is unavailable.
  - Auto-updates and saves the detected working model in app storage upon connection test or content generation.
  - Connected project `.env` key (`EXPO_PUBLIC_GEMINI_API_KEY`) verified live with `gemini-2.5-flash` and `gemini-flash-latest`.

### Official Amar Desh YouTube Channel Live Integration
- **Real YouTube Channel Feed Integration** (`services/youtubeService.ts`, `app/(tabs)/video.tsx`):
  - Connected directly to the official Daily Amar Desh YouTube channel: `https://www.youtube.com/channel/UCVBUCoStRou7DZtlTxmhAmQ` (`UCVBUCoStRou7DZtlTxmhAmQ`).
  - Implemented Atom XML RSS feed parser with AsyncStorage caching and 15-minute TTL.
  - Added automatic Bengali video categorizer (`categorizeAmarDeshVideo`) mapping titles to: তাজা খবর, জুলাই বিপ্লব, মতামত ও বিশ্লেষণ, তথ্যপ্রযুক্তি, খেলাধুলা, আন্তর্জাতিক, সারা দেশ, রাজনীতি, অর্থনীতি.
  - Included curated offline fallback of genuine Amar Desh news bulletins and analyses.

### Native Edge-to-Edge Status Bar & Canvas Architecture
- **True Screen Edge-to-Edge Display** (`app/_layout.tsx`, `utils/layout.ts`, screens):
  - Replaced deprecated `expo-status-bar` with native `react-native` `StatusBar.setTranslucent(true)` and `StatusBar.setBackgroundColor('transparent', true)`.
  - Applied top insets directly to header backgrounds so broadsheet mastheads stretch from `y = 0` behind the status bar without dead stripes, gaps, or element overlap.

- **Amar Desh Brand Startup Splash Screen** (`components/StartupSplashScreen.tsx`, `app/_layout.tsx`, `app.json`):
  - Created animated startup splash overlay rendering official Amar Desh calligraphy logo (`assets/amardesh_logo.png`) and tagline ("স্বাধীনতার কথা বলে • সত্য ও সাহসের প্রতীক") with smooth entrance and exit transitions.
  - Added native splash configuration in `app.json`.
- **YouTube Video Player & Playback Resilience Fixes** (`components/YouTubePlayer.tsx`, `app/(tabs)/video.tsx`):
  - Eliminated perpetual loading freeze by adding a 2.5s failsafe timeout that auto-clears loading overlays.
  - Added dynamic remounting via `key={videoId}` so selecting new playlist videos cleanly reinstantiates the player.
  - Added `webViewStyle={{ opacity: 0.99 }}` and hardware acceleration props resolving Android WebView blank screen rendering issues.
  - Added direct "ইউটিউব অ্যাপে দেখুন ↗" fallback launch button for seamless viewing.
  - Updated sample video IDs with verified, universally embeddable news and test videos.
- **AI Assistant Simplification & Automatic Model Detection** (`app/settings/ai.tsx`, `services/i18n.ts`, `app/(tabs)/profile.tsx`):
  - Completely removed model selector UI; the system automatically detects and deploys the best, verified working model (`gemini-1.5-flash`, `llama-3.3-70b-versatile`, `gpt-4o-mini`, `deepseek-chat`).
  - Removed technical "BYOK" branding across the app in favor of "স্মার্ট AI সহকারী" (AI Assistant).
  - Streamlined settings interface to only require the user's API key with the 1-tap direct key collection link.
- **True Edge-to-Edge System Bar Configuration** (`app.json`, `app/_layout.tsx`):
  - Configured transparent, non-overlapping `androidStatusBar` and `androidNavigationBar` with sticky-immersive mode.
  - Preserved fail-safe dynamic top padding to guarantee no header elements overlap punch-hole cameras or mobile status bars.
- **Over-The-Air (OTA) Application Update System** (`services/otaUpdateService.ts`, `app/(tabs)/profile.tsx`):
  - Implemented `otaUpdateService.ts` supporting EAS Update runtime versioning, update check manifests, and seamless reload handling.
  - Integrated "অ্যাপ আপডেট পরীক্ষা (OTA)" menu action and live check trigger in Profile screen.
- **Minimalist Search Trigger Icon** (`app/(tabs)/menu.tsx`):
  - Replaced text pill with clean, circular search icon button matching editorial design tokens.
- **Unified 'For You' Feed under the Save Option** (`app/(tabs)/bookmarks.tsx`, `app/(tabs)/foryou.tsx`, `app/(tabs)/_layout.tsx`):
  - Integrated personalized recommendations and reading affinities directly into the "Save" tab (`সেভ`) via an intuitive top segmented switcher (`[সংরক্ষিত | আপনার জন্য]`).
  - Seamlessly combines offline bookmarked reading with AI-powered personalized news feeds and user interest topics under one central hub.
- **ePaper Integration under Menu** (`app/(tabs)/menu.tsx`, `app/(tabs)/_layout.tsx`):
  - Moved ePaper from the main bottom navigation tab bar into a prominent featured editorial card and quick access action under the Menu (`মেনু`).
  - Streamlined bottom navigation into an intuitive 4-tab bar (Home, Video, Saved, Menu) while giving digital print replicas dedicated focus inside the Menu.

### Official Amar Desh Branding & Edge-to-Edge Top Bar System
- **Fail-Safe Edge-to-Edge Layout Architecture** (`utils/layout.ts`, all app screens):
  - Created centralized `getSafeHeaderPaddingTop(insets.top, extraOffset)` resolving all status bar, notch, and punch-hole overlap issues on Android 14/15 and iOS.
  - Applied across Home (`app/(tabs)/index.tsx`), Article Reader (`app/article/[id].tsx`), ePaper (`app/(tabs)/epaper.tsx`), Video Hub (`app/(tabs)/video.tsx`), Bookmarks (`app/(tabs)/bookmarks.tsx`), Menu (`app/(tabs)/menu.tsx`), Profile (`app/(tabs)/profile.tsx`), Search (`app/(tabs)/search.tsx`), Notifications (`app/notifications/index.tsx`), July Revolution (`app/july-revolution/index.tsx`), and Settings screens.
- **Official Amar Desh Logo Integration** (`components/AmarDeshLogo.tsx`, `assets/amardesh_logo.png`, `assets/amardesh_logo.jpg`):
  - Implemented high-resolution official Amar Desh logo with authentic red sun emblem and Bengali calligraphy.
  - Replaced plain text mastheads and placeholder boxes with official `AmarDeshLogo` across home masthead, reader top bar, ePaper header, video header, menu, profile, and login screens.
  - Automatically adapts to light and dark theme modes with optimal contrast.

### BYOK Multi-Provider AI Direct Link & Auto-Working Models Suite
- **Direct 1-Tap API Key Collection Links** (`services/byokAiService.ts`, `app/settings/ai.tsx`, `components/AiAssistantModal.tsx`, `components/AiSummaryCard.tsx`):
  - Added dedicated high-visibility action cards in AI settings with 1-tap direct links (`Linking.openURL`) to official API key creation portals:
    - **Google Gemini**: `https://aistudio.google.com/app/apikey` (Google AI Studio - 100% free personal tier)
    - **Groq Cloud**: `https://console.groq.com/keys` (Groq Console - free developer tier)
    - **OpenAI**: `https://platform.openai.com/api-keys` (OpenAI Platform)
    - **DeepSeek**: `https://platform.deepseek.com/api_keys` (DeepSeek Platform)
  - Integrated one-click clipboard copying (`expo-clipboard`) and 3-step localized setup guide for collecting keys in seconds.
  - Added contextual shortcuts in AI Assistant Modal and Summary Card prompting readers to collect a free key with 1 tap.
- **Verified Auto-Working Default Models & Resilient Fallbacks**:
  - Configured verified standard out-of-the-box API models for each provider (`gemini-1.5-flash`, `llama-3.3-70b-versatile`, `gpt-4o-mini`, `deepseek-chat`).
  - Added visual model selection chips with "✓ অটো-ভেরিফায়েড" badges and descriptions.
  - Implemented automatic fallback retry mechanisms (e.g., if a deprecated model is supplied, services automatically retry with the default working model).
  - Added comprehensive automated test suite (`services/__tests__/layoutAndLogo.test.ts`) with 100% pass rate across 102 tests.

### Stitch Modern Editorial Design System Migration
- **Editorial Broadside Tokens & Aesthetics** (`theme/tokens.ts`):
  - Synchronized tokens with Stitch MCP `Mobile News App` (`projects/14803972069666724044`): warm newsprint parchment (`#FBF9F5`), deep printer's ink (`#121212`), Editorial Crimson (`#BA131A`), National Forest Green (`#006B3F`), and 1px structural hairline rules (`#E5E0D8`).
  - Implemented OLED Night Edition (`#0A0A0A`, off-white typography `#F5F5F7`, `#27272A` dividers).
  - Added complete Stitch typographic scale (`headlineXl`, `headlineXlMobile`, `headlineLg`, `headlineLgMobile`, `headlineMd`, `headlineSm`, `bodyLg`, `bodyMd`, `bodySm`, `labelMd`, `labelSm`).
  - Transitioned shape system to architectural flatness with `4px` micro-radii and zero blurry elevation drop-shadows.
- **Home Feed Broadsheet Transformation** (`app/(tabs)/index.tsx`, `components/BreakingNewsTicker.tsx`, `components/PrayerTimesWidget.tsx`, `components/ContinueReadingCard.tsx`):
  - Redesigned lead hero card: top 16:9 photo with bottom hairline border, followed by clean parchment text box with uppercase crimson kicker, bold Newsreader headline, and byline row.
  - Redesigned compact feed cards: 1:1 square right-aligned thumbnails (`86x86px`) with 1px hairline bottom rules.
  - Refactored category tabs with sharp 1px bordered tabs.
  - Updated Breaking News ticker and Prayer Times widget with planar 1px borders and sharp geometry.
- **Long-Form Reader Typography** (`app/article/[id].tsx`, `components/AiSummaryCard.tsx`):
  - Upgraded article title to `26px` with `-0.4` tracking; body copy to `18px` with `30px` line-height for optical reading comfort.
  - Author byline row bracketed by top and bottom 1px hairline rules.
  - AI Summary card restyled to planar surface (`#EFEEEA` / `#141414`) with 3.5px crimson accent left border.
- **ePaper, Video & Navigation Polish** (`app/(tabs)/_layout.tsx`, `app/(tabs)/epaper.tsx`, `app/(tabs)/video.tsx`, `app/(tabs)/menu.tsx`, `app/(tabs)/bookmarks.tsx`):
  - Bottom tab bar updated with 1px solid hairline top divider and Editorial Crimson active tint.
  - Planar newsprint canvas on ePaper and video cards.

### Bilingual Localization Engine (Bengali & English)
- **Comprehensive Dual-Language Support** (`services/i18n.ts`, `services/__tests__/i18n.test.ts`):
  - Created bilingual translation engine with typed dictionaries (`TRANSLATIONS.bn`, `TRANSLATIONS.en`), `t()`, `formatLocalizedNumeral()`, `formatLocalizedRelativeTime()`, `getLocalizedCategoryName()`, and listener subscription system.
  - Zero-friction instant language toggle between Bengali (`bn`) and English (`en`) with persistent device storage (`@amar_desh_language_preference`).
  - Added full test coverage for i18n service (13 passing tests).
- **Interactive UI Language Switchers**:
  - Quick toggle pill in the home masthead date bar (`app/(tabs)/index.tsx`) allowing 1-tap switching (`[বাংলা | EN]`).
  - Segmented language control option in settings & menu screen (`app/(tabs)/menu.tsx`).
- **End-to-End Screen Localization**:
  - **Bottom Navigation Tabs** (`app/(tabs)/_layout.tsx`): Dynamic tab labels (`Home / ePaper / Video / Saved / Menu` vs `হোম / ই-পেপার / ভিডিও / সেভ / মেনু`).
  - **Home Screen & Category Bar** (`app/(tabs)/index.tsx`): Localized weather banner, division badge, category chips, breaking news banner, and July revolution spotlight.
  - **Article Detail & Reader** (`app/article/[id].tsx`): Localized bylines, published dates, audio listen prompt, AI summary card, bidirectional navigation, swipe hints, copyright notice, related stories, and share dialogs.
  - **ePaper Digital Reader** (`app/(tabs)/epaper.tsx`): Localized edition dates, column hotspots, and full digital reading triggers.
  - **Multimedia & Video Hub** (`app/(tabs)/video.tsx`): Localized title, video category filters, views counter, and PiP mini player controls.
  - **Saved Articles & Bookmarks** (`app/(tabs)/bookmarks.tsx`): Localized counter badges, card metadata, and empty state guides.

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
