# Changelog - Daily Amar Desh Mobile App

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 🃏 Card Slide UI Experience & 3-Way Layout Switcher
- **Featured Stories Horizontal Card Carousel** ([components/FeaturedCardSlider.tsx](file:///d:/Repo/AmarDeshApp/components/FeaturedCardSlider.tsx), [app/(tabs)/index.tsx](file:///d:/Repo/AmarDeshApp/app/(tabs)/index.tsx)):
  - Snapping horizontal carousel at the top of the magazine feed displaying top 5 lead breaking stories.
  - Features high-resolution cover imagery, dark gradient vignette overlay, category badge, live breaking tag (`ব্রেকিং` / `BREAKING`), author & relative timestamp, and interactive pagination indicator dots (`১ / ৫`).
- **Interactive Card Slide Deck Feed Mode** ([components/SwipeCardDeck.tsx](file:///d:/Repo/AmarDeshApp/components/SwipeCardDeck.tsx)):
  - Full-screen card slide deck enabling readers to flip through news articles card-by-card.
  - Includes progress pill indicator (`১ / ২০`), large image with category badge, bold headline, snippet excerpt, "Read Full Story" button, and Previous/Next buttons.
- **Horizontal Related Stories Shelf** ([components/RelatedCardSlider.tsx](file:///d:/Repo/AmarDeshApp/components/RelatedCardSlider.tsx), [app/article/[id].tsx](file:///d:/Repo/AmarDeshApp/app/article/[id].tsx)):
  - Replaced the vertical related stories list at the bottom of the article view with a horizontal snapping card shelf displaying up to 6 contextually related stories.
- **3-Way Feed Layout Switcher Relocated from Header to Nav Bar** ([store/useAppStore.ts](file:///d:/Repo/AmarDeshApp/store/useAppStore.ts), [app/(tabs)/index.tsx](file:///d:/Repo/AmarDeshApp/app/(tabs)/index.tsx), [components/SideNavDrawer.tsx](file:///d:/Repo/AmarDeshApp/components/SideNavDrawer.tsx), [app/settings/index.tsx](file:///d:/Repo/AmarDeshApp/app/settings/index.tsx)):
  - Removed grid/list view mode toggle from the top masthead header bar to keep the header uncluttered and focused purely on the full logo, notifications, and search.
  - Added quick view mode button (`list-outline` / `grid-outline` / `albums-outline`) directly on the horizontal Category Navigation Bar in the home feed.
  - Added dedicated Feed Layout pills selector row (ম্যাগাজিন • লিস্ট • কার্ড) within the Side Navigation Drawer.
  - Seamlessly cycles between **Magazine** (`'magazine'`), **List/Compact** (`'compact'`), and **Card Slide** (`'card'`).

### 📌 Article Byline Action Toolbar (Sound, Font, Save, Share)
- **Header Cleanliness & Byline Action Toolbar** ([app/article/[id].tsx](file:///d:/Repo/AmarDeshApp/app/article/[id].tsx)):
  - Moved all 4 action buttons (TTS Audio/Sound `volume-high`, Reader Settings & Font `text-outline`, Bookmark/Save `bookmark`, and Share `share-social-outline`) out of the cramped top navigation bar down beside the **Published: Date** (`প্রকাশ: সময়`) in the author byline row.
  - Modernized the top article header bar into a clean, spacious layout featuring the back button and centered square emblem with balanced margins.
  - Ensures responsive layout with auto-wrapping (`justifyContent: 'space-between'`, `flexWrap: 'wrap'`) so text and action pills remain comfortable and unclipped across all device screens.

### 🏷️ Full Amar Desh Logo Standard Across All Headers
- **Full Calligraphy Logo (`variant="png"`) in All App Headers**:
  - Enforced the official full Amar Desh calligraphy banner logo (`variant="png"`) across all top navigation header bars without exception.
  - Upgraded article reader header ([app/article/[id].tsx](file:///d:/Repo/AmarDeshApp/app/article/[id].tsx)), bookmarks header ([app/(tabs)/bookmarks.tsx](file:///d:/Repo/AmarDeshApp/app/(tabs)/bookmarks.tsx)), category header ([app/category/[slug].tsx](file:///d:/Repo/AmarDeshApp/app/category/[slug].tsx)), July Revolution header ([app/july-revolution/index.tsx](file:///d:/Repo/AmarDeshApp/app/july-revolution/index.tsx)), notifications header ([app/notifications/index.tsx](file:///d:/Repo/AmarDeshApp/app/notifications/index.tsx)), privacy settings ([app/settings/privacy.tsx](file:///d:/Repo/AmarDeshApp/app/settings/privacy.tsx)), export settings ([app/settings/export.tsx](file:///d:/Repo/AmarDeshApp/app/settings/export.tsx)), and notification settings ([app/settings/notifications.tsx](file:///d:/Repo/AmarDeshApp/app/settings/notifications.tsx)) to render the full official banner.
  - Preserved the square frame (`borderRadius: 0`) for `assets/icon.png` in avatar and fallback contexts (such as editorial author avatars and app icon representations).

### 🤖 Moderate Token Cap & Guaranteed Complete Answer System (`components/AiAssistantModal.tsx`, `services/byokAiService.ts`)
- **Moderate Token Cap (1,000 Tokens)**:
  - Adjusted LLM output token ceiling to a moderate, cost/quota-friendly **1,000 tokens** (`maxOutputTokens: 1000` / `max_tokens: 1000`), reducing latency while providing ample headroom.
- **Strict Prompt-Level Length & Completeness Control**:
  - Enforced strict length limits in the Bengali system prompt: 100–150 words (or 2 clean paragraphs / 3–4 bullet points).
  - Since 100–150 Bengali words consume ~450–650 tokens, the AI deliberately plans and completes its entire answer well before reaching the 1,000-token limit.
  - Mandated that the response must end with a full concluding sentence (`।`) without leaving any statement unfinished.
- **Deterministic Response Finalization (`finalizeBengaliResponse`)**:
  - Implemented safety post-processor that detects if any model outputs an unpunctuated trailing sentence fragment and automatically trims cleanly to the last complete sentence ending with `।` or closes it properly.
  - Added unit test suite in `services/__tests__/byokAiService.test.ts` verifying all 3 edge cases (100% passing).
- **Enhanced AI Chat UI & Auto-Scrolling**:
  - Attached `ScrollView` ref with automatic `scrollToEnd` on response arrival and layout resize (`onContentSizeChange`).
  - Added automatic keyboard dismissal upon submitting a question to free up full sheet reading viewport.
  - Expanded message bubble width to `92%` and enabled `selectable={true}` for easy text copying.

### ✂️ Concise Label Streamlining & UI Naming Polish (v1.5.1)
- **Concise Navigation & Settings Labels** (`services/i18n.ts`, `app/settings/index.tsx`, `components/SideNavDrawer.tsx`, `app/(tabs)/menu.tsx`, `app/(tabs)/profile.tsx`):
  - Shortened verbose labels to clean, direct terms across both Bengali (বাংলা) and English:
    - "সকল সেটিংস ও নিয়ন্ত্রণ হাব" / "All Settings & Control Hub" → **"সেটিংস"** / **"Settings"**
    - "সকল সেটিংস ও নিয়ন্ত্রণ হাব (এক স্টপে সব)" → **"সেটিংস"** / **"Settings"**
    - "সাইড মেনু খুলুন" / "Open Side Menu" → **"মেনু খুলুন"** / **"Open Menu"**
    - "অ্যাপ রূপ ও প্রদর্শন" / "Appearance & Display" → **"ডিসপ্লে ও থিম"** / **"Display & Theme"**
    - "ক্যাশ খালি করুন" / "Clear Offline Cache" → **"ক্যাশ মুছুন"** / **"Clear Cache"**
    - "ফিড লেআউট" / "Feed Layout" → **"লেআউট"** / **"Layout"**
    - "অ্যাপ আপডেট পরীক্ষা (OTA)" / "Check for Updates" → **"আপডেট পরীক্ষা"** / **"Check Updates"**
    - "আমার দেশ সম্পর্কে" / "About Daily Amar Desh" → **"পরিচিতি"** / **"About"**
    - "সংরক্ষিত সংবাদ ও আপনার জন্য" → **"সংরক্ষিত"** / **"Saved"**
    - "ই-পেপার সংস্করণ" → **"ই-পেপার"** / **"E-Paper"**
    - "ভিডিও ও মাল্টিমিডিয়া" → **"ভিডিও"** / **"Videos"**
    - "নোটিফিকেশন ইনবক্স" → **"নোটিফিকেশন"** / **"Notifications"**
    - "সংস্করণ ও নামাজের অবস্থান" → **"সংস্করণ ও অবস্থান"** / **"Edition & Location"**
  - Updated all corresponding unit and integration test assertions (`services/__tests__/settingsAndSideNav.test.ts`), maintaining 100% test pass rate (133/133 tests) and 0 TypeScript errors.

### 🧭 Side Navigation Drawer & Unified One-Stop Settings Hub (v1.5.0)
- **Animated Side Navigation Bar (Drawer)** (`components/SideNavDrawer.tsx`, `app/(tabs)/index.tsx`):
  - Created high-performance animated slide-in drawer (`translateX: -DRAWER_WIDTH` to `0`) with touch-to-dismiss semi-transparent backdrop.
  - Masthead branding featuring Amar Desh logo, motto ("সত্যের পক্ষে আপসহীন"), edition details, user account & cloud sync status pill.
  - Navigation rails to all core sections: প্রচ্ছদ (Home), ই-পেপার (e-Paper), ভিডিও (Video), সংরক্ষিত সংবাদ (Saved), আপনার জন্য (For You AI), জুলাই বিপ্লব ২০২৪ (July Revolution Archive), নামাজের সময়সূচি (Prayer Times), এবং নোটিফিকেশন ইনবক্স (Notification Inbox).
  - Prominent spotlight card linking directly to the One-Stop Settings Hub (`/settings`).
  - Quick bottom utilities: 3-way theme switcher (☀️ লাইট / 📜 সেপিয়া / 🌙 ডার্ক) and language toggle (বাংলা / English).
  - Added hamburger menu trigger button (`menu-outline`) in `app/(tabs)/index.tsx` broadsheet masthead header.
- **Unified One-Stop Settings Solution** (`app/settings/index.tsx`, `app/_layout.tsx`):
  - Consolidated all fragmented app configuration into a single, comprehensive one-stop destination:
    1. **রূপ ও ভিজ্যুয়াল ডিসপ্লে (Appearance & Display)**: 3-way theme visual swatches (Light, Sepia, Dark), language toggle, magazine broadsheet vs compact list feed layout, and reading font size selector (S, M, L, XL).
    2. **স্মার্ট এআই সহকারী (Smart AI Engine - BYOK)**: Active AI provider indicator (Gemini, OpenAI, Groq, DeepSeek) with 1-tap route to `/settings/ai`.
    3. **বিজ্ঞপ্তি ও পুশ অ্যালার্ট (Notifications & Alerts)**: Instant toggles for breaking news alerts, daily morning briefing, and links to detailed quiet-hour settings (`/settings/notifications`) and notification inbox (`/notifications`).
    4. **পছন্দ, আগ্রহ ও সংস্করণ (Interests & Edition)**: 1-tap link to topic personalization (`/settings/interests`) and division/district picker modal with GPS toggle.
    5. **ডেটা সাশ্রয় ও অফলাইন ক্যাশ (Data & Offline Storage)**: Low-data mode toggle, cached article count indicator, 1-tap offline database cache purge (`clearAllCachedArticles`), and reading data backup export (`/settings/export`).
    6. **গোপনীয়তা, ক্লাউড সিঙ্ক ও সুরক্ষা (Privacy & Cloud Sync)**: Anonymous Device ID, cloud sync state indicator with instant "সিঙ্ক" trigger (`syncAccountData`), and privacy controls (`/settings/privacy`).
    7. **সফটওয়্যার আপডেট ও সিস্টেম (App Updates & System)**: Version 1.4.2 display, OTA update check button (`checkForOtaUpdate`).
    8. **আমাদের পরিচিতি (About Daily Amar Desh)**: Editor & Publisher Mahmudur Rahman, Karwan Bazar headquarters, and editorial charter.
- **Streamlined Menu & Profile Screens** (`app/(tabs)/menu.tsx`, `app/(tabs)/profile.tsx`):
  - Replaced sprawling redundant settings in `menu.tsx` with a prominent "One-Stop Settings Hub" hero card.
  - Positioned "One-Stop Settings Hub" as the primary configuration item in `profile.tsx`.
- **Header Declutter & AI Settings Centralization** (`app/(tabs)/index.tsx`, `app/settings/index.tsx`):
  - Removed redundant AI sparkles icon button from the broadsheet masthead header, decluttering the top bar for optimal spacing.
  - Centralized full AI assistant management into Section 2 of the One-Stop Settings Hub with live provider status, 1-tap provider switching (Gemini, ChatGPT, Groq, DeepSeek), and direct link to API Key & Model settings.
- **Test Suite & Verification** (`services/__tests__/settingsAndSideNav.test.ts`):
  - Created 7 new integration tests verifying settings translations, font size storage, cache purge, and store preference switches.
  - All 19 test suites and 133 tests passing with 0 errors. Zero TypeScript compiler errors.

### 🎨 UI/UX Component Overlap Resolution & Icon-First Upgrades (v1.4.2)
- **Eliminated Article Header Crowd & Logo Collision** (`app/article/[id].tsx`, `components/ReaderSettingsModal.tsx`):
  - Streamlined congested 7-button header cluster down to 4 core icon buttons (`Audio`, `Reader Settings`, `Bookmark`, `Share`), freeing up >120px horizontal width to guarantee zero collision with `AmarDeshLogo` on small screens (<380px).
  - Integrated `Focus Mode`, `Quote Card Generator`, and `AI Assistant` directly into `ReaderSettingsModal.tsx` with dedicated icon-first trigger chips.
- **Fixed Floating Mini-Player Bottom Tab Bar Overlap** (`components/FloatingVideoPlayer.tsx`):
  - Elevated floating PiP video player by utilizing dynamic `useSafeAreaInsets` (`bottom: 68 + insets.bottom`), ensuring it never covers the 60px bottom tab bar.
- **Resolved Audio News Bar Home Indicator Overlap** (`components/AudioNewsBar.tsx`):
  - Integrated `useSafeAreaInsets` to adjust `bottom: Math.max(insets.bottom + 12, 20)`, eliminating collision with home indicator gestures.
- **Protected Auxiliary Full-Screen Views from Tab Bar Clash** (`app/(tabs)/_layout.tsx`, `app/(tabs)/epaper.tsx`):
  - Set `tabBarStyle: { display: 'none' }` on auxiliary routes (`epaper`, `search`), providing edge-to-edge viewports.
  - Positioned e-Paper floating navigation pill with safe area insets (`bottom: Math.max(insets.bottom + 14, 20)`).
- **Fixed Visual Web Stories Notch & Home Bar Clipping** (`components/VisualStoryModal.tsx`):
  - Switched from static `SafeAreaView` (44px) to dynamic `insets.top + 8`, preventing progress bar clipping under iOS Dynamic Island (59px) and Android punch-hole cameras.
  - Positioned story takeaway bottom deck at `bottom: Math.max(insets.bottom + 16, 32)` with icon-first `arrow-up-circle-outline` CTA.
- **Icon-First Market & Sports Ticker Trends** (`components/LiveRatesTicker.tsx`):
  - Replaced plain text plus/minus indicators with directional caret vector icons (`caret-up` / `caret-down`).
- **Icon-First Tone Pills & Non-Overlapping Header in AI Summary** (`components/AiSummaryCard.tsx`):
  - Added distinctive vector icons to each tone pill (`list-outline` for Key Points, `sparkles-outline` for Simplified, `analytics-outline` for Context).
  - Concise `স্মার্ট সারাংশ` title with `numberOfLines={1}` prevents header collision on compact devices.
- **Celestial Waqt Icons & Collision Prevention in Prayer Times** (`components/PrayerTimesWidget.tsx`):
  - Added celestial icons to prayer waqts (`sunny-outline`, `sunny`, `partly-sunny-outline`, `cloudy-night-outline`, `moon-outline`).
  - Added `flex: 1` and `numberOfLines={1}` to prevent location badge collision with header title.
- **Category & Bookmarks Header Collision Protections** (`app/category/[slug].tsx`, `app/(tabs)/bookmarks.tsx`):
  - Replaced verbose `{X} টি সংবাদ` text with icon-first newspaper badge (`newspaper-outline` + numeral).
  - Added `flex: 1` and `numberOfLines={1}` across title containers.
- **Quote Card Title & Footer Elasticity** (`components/QuoteCardModal.tsx`):
  - Added `numberOfLines={1}` and `flex: 1` to modal title, and replaced fixed `maxWidth: 200` with flexible `flexShrink: 1` on author/source meta.

### 🐛 Codebase-Wide Bug Fixes & Resiliency Hardening (v1.4.1)
- **Resolved Deprecated Clipboard API & Unmount Timer Leak** (`components/QuoteCardModal.tsx`):
  - Migrated from deprecated `Clipboard` in `react-native` to `* as Clipboard from 'expo-clipboard'` (`setStringAsync`).
  - Added `copyTimeoutRef` typed as `ReturnType<typeof setTimeout> | null` and wired unmount cleanup.
- **Fixed Impure React 18/19 State Updater Side-Effect Pattern** (`components/VisualStoryModal.tsx`):
  - Separated state progression interval from navigation side-effects (`setCurrentIndex`, `onClose`), eliminating React concurrent render warnings and navigation race conditions.
- **Enhanced Story Asset Performance & Fixed Progress Bar Keys** (`components/VisualStoriesBar.tsx`, `components/VisualStoryModal.tsx`):
  - Upgraded standard React Native `Image` to high-performance `expo-image` with `contentFit="cover"` and `priority="high"`.
  - Replaced index-based `key={i}` with guaranteed unique composite identifiers (`key={story.id || i}`).
- **Safeguarded AI Summary Regeneration against Network Drops** (`components/AiSummaryCard.tsx`):
  - Wrapped `generateArticleSummary()` invocation in defensive `try/catch/finally` block to prevent unhandled promise rejections.
- **Resolved TTS Speech Synthesis Background Leaks** (`services/ttsService.ts`, `components/AudioNewsBar.tsx`):
  - Added lifecycle callbacks (`onDone`, `onStopped`, `onError`) to `TTSOptions` and bound to `Speech.speak`.
  - Added unmount cleanup hook in `AudioNewsBar` to cancel ongoing speech synthesis when readers navigate away.
  - Automatically resets playback state and pauses waveform equalization when speech completes.
- **Resolved Trapped Blank Screen on Missing / Loading Articles** (`app/article/[id].tsx`):
  - Added native `ActivityIndicator` loading spinner during deep link / RSS article resolution.
  - Provided graceful fallback screen with a back navigation button (`router.back()`) and friendly Bengali guidance (`'সংবাদটি হয়তো সরানো হয়েছে বা লিংকটি সঠিক নয়'`).
- **Fixed Market Ticker Negative Badge Styling** (`components/LiveRatesTicker.tsx`):
  - Added missing `negativeBadge` style token for negative financial and sports changes.
- **Resolved Hardcoded English UI Strings** (`components/ArticleTimeline.tsx`, `services/i18n.ts`):
  - Replaced English `(Context Timeline)` with pure Bengali `ঘটনাপ্রবাহের ধারাবাহিক প্রেক্ষাপট`.
  - Added missing `back: 'ফিরে যান'` / `back: 'Go Back'` i18n localization keys.
- **Prevented Unhandled Network Hangs & Timer Leaks in Ingestion Services** (`services/youtubeService.ts`, `services/articleScraper.ts`):
  - Wrapped `clearTimeout(timer)` inside `finally` blocks in `fetchTrendingVideos` and `scrapeFullArticle`.
  - Added 5-second `AbortController` timeout to article scraping pipeline.
- **Defensive Storage Preference Deserialization** (`store/useAppStore.ts`):
  - Wrapped `themeStored` and `layoutStored` parsing in try/catch to prevent malformed raw strings from corrupting user state hydration.
- **Fixed e-Paper Magnifier Loupe Interactive Pan Tracking** (`app/(tabs)/epaper.tsx`):
  - Attached touch responders (`onTouchStart`, `onTouchMove`) to e-Paper page canvas to ensure magnifying loupe smoothly tracks finger movement.
- **Eliminated Unmount Timer Leaks Across App Screens** (`components/StartupSplashScreen.tsx`, `app/category/[slug].tsx`, `app/settings/ai.tsx`):
  - Added cleanup logic to clear pending `setTimeout` calls when users navigate away or dismiss modals.
- **Codebase-Wide TypeScript Strict Compliance (Elimination of `any` types)** (`services/storage.ts`, `services/byokAiService.ts`, `services/cloudSyncService.ts`, `services/firebase/authService.ts`, `services/offlineDatabase.ts`, `components/AiAssistantModal.tsx`):
  - Defined explicit interfaces (`ReadingStreak`, `StoredComment`, `CachedArticleRow`, `GeminiContentItem`, `FirebaseErrorLike`) and replaced `any` types with strictly typed contracts and `unknown` catch blocks.

### 💎 Editorial UI/UX Upgrades Suite (v1.4.0)
- **New 3rd Reading Theme: "সংবাদপত্র সেপিয়া" (Parchment Sepia Mode)** (`theme/tokens.ts`, `theme/index.ts`, `theme/ThemeProvider.tsx`, `store/useAppStore.ts`, `app/(tabs)/menu.tsx`, `components/ReaderSettingsModal.tsx`):
  - Engineered dedicated broadsheet newsprint parchment theme (`surface.base: #f4ebd9`, `surface.subtle: #ebdcc4`, `text.primary: #2c221e`, `text.secondary: #6c5b51`, `brand.primary: #9e1b1b`, `border.default: #ded1bb`, warm diffused shadows `#3c2e24`).
  - Added 3-way theme selectors across Drawer/Menu and Article Reader settings modal (`☀️ লাইট`, `📜 সেপিয়া`, `🌙 ডার্ক`).
- **Editorial Quote Card Generator Modal** (`components/QuoteCardModal.tsx`, `app/article/[id].tsx`):
  - Modal component allowing readers to generate beautiful, branded visual quote cards from article excerpts.
  - Features 4 editorial palette themes (ডার্ক, লাইট, ক্লাসিক লাল, বোটানিক্যাল গ্রিন), editable quotes, Amar Desh masthead branding, 1-tap clipboard copying, and native share sheet integration.
- **"আজকের দৃষ্টিপাত" Visual Web Stories Rail & Full-Screen Viewer** (`components/VisualStoriesBar.tsx`, `components/VisualStoryModal.tsx`, `data/storiesData.ts`, `app/(tabs)/index.tsx`):
  - Story preview rail on Home feed featuring visual thumbnails, category badges, and unread indicator borders.
  - Full-screen story experience with auto-advancing progress timers, touch tap navigation (left for prev, right for next), bottom takeaway summary card, and direct deep-linking into full article.
- **Focus Reading Mode (ডিস্ট্র্যাকশন-মুক্ত পাঠ)** (`app/article/[id].tsx`):
  - Distraction-free reading toggle in article view that hides all navigation chrome, audio player, AI cards, and reaction widgets to focus solely on Bengali editorial typography.
  - Floating pill controller to quickly return to standard reading layout.
- **Feed Presentation Switcher (Magazine vs Compact)** (`store/useAppStore.ts`, `app/(tabs)/index.tsx`):
  - Header toggle allowing readers to seamlessly switch between rich editorial "ম্যাগাজিন ভিউ" (hero cards with excerpts) and high-density "কমপ্যাক্ট ভিউ" (fast-scan list layout with thumbnails).
  - Preserves user preference in persistent AsyncStorage (`@amar_desh_feed_layout`).
- **Animated Speech Waveform & Dockable Mini-Pill** (`components/AudioNewsBar.tsx`):
  - Upgraded TTS audio player with an animated 4-bar equalizer reflecting speech playback.
  - Added dockable mini-pill button mode that stays out of the way while scrolling through articles and smoothly expands into full audio controls upon tapping.
- **Reaction Particle Burst & Haptic Feedback** (`components/ArticleReactions.tsx`):
  - Interactive micro-animation with floating `+1` bubble particle burst upon selecting emoji reactions (পছন্দ, ভালোবাসা, দারুণ, মন খারাপ, প্রতিবাদ).
  - Tactile physical response powered by `expo-haptics`.
- **Contextual Milestone Timeline Scrubber** (`components/ArticleTimeline.tsx`, `app/article/[id].tsx`):
  - Vertical chronological timeline for ongoing news, investigations, and developing national stories.
  - Visual nodes with date badges, milestone summaries, and highlighted current status node.
- **AI Tone & Simplification Switcher ("সহজ ভাষায় পড়ুন")** (`components/AiSummaryCard.tsx`):
  - 3-mode perspective switcher: `মূল পয়েন্ট` (Key Takeaways), `সহজ ভাষায়` (Simplified Bengali for youth and quick scan), and `প্রেক্ষাপট` (Historical Context & Background).
- **Live Cricket Scores & Market Indicators Ticker** (`components/LiveRatesTicker.tsx`, `data/ratesData.ts`, `app/(tabs)/index.tsx`):
  - Real-time financial and sports ticker at top of Home feed featuring Bangladesh live cricket, DSEX index, USD/BDT currency rate, and 22-carat gold price.
- **ePaper Magnifier Loupe Lens** (`app/(tabs)/epaper.tsx`):
  - Interactive 2.5x circular magnifier lens with responsive touch pan responder for inspecting fine column print, editorials, and classified ads.
  - Floating toggle control in bottom action bar.
- **Complete Automated Test Coverage & Isolated Modules Compliance** (`services/__tests__/uiUxEnhancements.test.ts`):
  - Added dedicated test suite verifying Sepia tokens, theme switcher, feed layout store actions, stories dataset, and live indicators.
  - Maintained 100% test pass rate (18 test suites, 126 tests) and zero TypeScript errors (`tsc --noEmit`).

### Complete Production Specifications & Engineering Documentation Suite
- **Updated Product Requirements Document (`PRD.md`, `docs/PRD.md`)**:
  - Overhauled PRD to Version 2.0.0 reflecting the complete native Expo React Native mobile application.
  - Documented product vision, 4 user personas, 6 core pillars, feature prioritization matrix (P0–P3), performance benchmarks, privacy guarantees, and success KPIs.
- **Created Technical Requirements Document (`TRD.md`, `docs/TRD.md`)**:
  - Documented full system architecture, technology justifications (Expo SDK 52, React Native 0.76, Hermes, Zustand 5, SQLite), service layer contracts, offline caching strategies, BYOK AI provider abstractions, and automated testing architecture.
- **Updated Design System Specification (`DESIGN.md`, `docs/DESIGN.md`)**:
  - Unified Modern Editorial broadsheet aesthetics with the Curvy & Icon-First UI design system.
  - Documented border-radius tokens (`radii`), diffused ambient shadows (`shadows`), OLED Night Edition palette, typography hierarchy, micro-interactions, and component library specifications for all 18+ components.
- **Added Data Schemas Specification (`schema.md`, `docs/schema.md`)**:
  - Documented TypeScript interfaces, SQLite relational DDL, Zustand store shapes, BYOK multi-model AI schemas, prayer times data models, e-Paper hotspot schemas, push notification payloads, and persistent `@amar_desh_*` AsyncStorage keys directory.
- **Added System Workflows Specification (`workflow.md`, `docs/workflow.md`)**:
  - Documented end-to-end procedures for developer onboarding, feature development quality gates, EAS builds, OTA updates, RSS/scraper ingestion pipelines, BYOK AI queries, TTS audio synthesis, e-Paper column cropping, and offline synchronization.
- **Completed & Synchronized Task Tracking (`TODO.md`, `docs/TODO.md`)**:
  - Brought sprint tracker to 100% completion across all 6 core phases, verified 17 test suites (120/120 tests passing), zero TypeScript errors, and established pre-launch production release checklist.

### Rounded Curvy Design System & Icon-First UI Overhaul
- **Centralized Border Radius Tokens & Soft Shadows** (`theme/tokens.ts`, `theme/index.ts`):
  - Defined design tokens for radii: `sm: 8px`, `md: 12px`, `lg: 16px`, `pill: 999px` (as well as `xs: 4px`, `xl: 20px`, `2xl: 24px`).
  - Added cross-platform soft diffused shadows (`shadows.card`, `shadows.soft`, `shadows.lg`, `shadows.sm`) replacing harsh borders (`borderWidth: 1.5`) with hairline subtle borders (`0.5px`, `border.subtle`).
  - Exposed `radii` and `shadows` through `getThemeTokens` and `useThemedStyles`, enabling global radius modifications in one central place.
  - Applied tokens across buttons, cards, inputs, modals, sheets, and lists across all components and screens.
- **Icon-First UI Transformation**:
  - Replaced verbose text buttons and prompts with clean icon-driven controls (e.g. icon pill for Bookmarks customization, compact YouTube and PiP action buttons in Video screen, icon-led GPS prompt in PrayerTimesWidget, and close icon button in ReaderSettingsModal).
  - Maintained strict Bengali text fidelity, complete responsive layouts, and zero test regressions (all 17 test suites, 120 tests passing).

### Clean Broadsheet Masthead & Top Options Relocation
- **Ultra-Clean Home Masthead & Settings/Menu Relocation** (`app/(tabs)/index.tsx`, `app/(tabs)/menu.tsx`, `app/(tabs)/profile.tsx`):
  - Completely removed the top date/weekday bar, weather text, language toggle, and edition badge from the top of the Home feed to achieve a clean broadsheet masthead directly behind the transparent status bar.
  - Relocated today's Gregorian date, weekday, Hijri date, and local weather widget to a dedicated card inside Menu (`menu.tsx`).
  - Added interactive "সংস্করণ ও নামাজের অবস্থান" (Edition & Location) and "ভাষা পরিবর্তন" (Language) settings into both Menu and Profile/Settings with seamless GPS and Dhaka default configuration.

### Prayer Timetable Dhaka Default & GPS Local Time Auto-Detection
- **Dhaka Default & Native GPS Prayer Schedule** (`services/prayerTimesService.ts`, `components/PrayerTimesWidget.tsx`, `components/DistrictPickerModal.tsx`, `app/(tabs)/index.tsx`):
  - Completely removed the "আপনার বিভাগ নির্বাচন করুন" option and 8-division picker list from the application.
  - Standardized on Dhaka (`ঢাকা`) as the primary nationwide default timetable.
  - Installed `expo-location` and created `requestGpsPrayerTimes()` with precise solar offset calculation (`calculateSolarOffsetMinutes`), mapping device longitude to accurate local solar prayer times.
  - Added interactive GPS prompt modal and 1-tap widget prompt allowing readers to effortlessly switch between GPS local time and Dhaka default.
  - Added reverse geocoding mapping English coordinates/districts to localized Bengali names.

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
