# Product Requirements Document (PRD) - Daily Amar Desh Mobile App
**দৈনিক আমার দেশ - মোবাইল অ্যাপ্লিকেশন**

---

| Attribute | Details |
| :--- | :--- |
| **Product Name** | Daily Amar Desh Native Mobile App (দৈনিক আমার দেশ) |
| **Document Version** | 2.0.0 (Production Release) |
| **Target Platforms** | Android (APK / AAB via Google Play) & iOS (IPA via App Store) |
| **Core Architecture** | React Native 0.76 / Expo SDK 52 / Expo Router v4 |
| **Current Status** | ✅ **Production Ready & Feature Complete** |
| **Last Updated** | October 2026 |

---

## 1. Executive Summary & Product Vision

### 1.1 Brand Heritage
**Daily Amar Desh (দৈনিক আমার দেশ)** is one of Bangladesh's most iconic and resilient daily newspapers, internationally recognized for its unwavering stance on journalistic independence, rule of law, and democratic accountability under the motto **« স্বাধীনতার কথা বলে »** (*Speaks for Independence*).

### 1.2 Product Vision
The Daily Amar Desh Mobile App translates this journalistic authority into an uncompromising, lightning-fast native mobile experience. Built on a **privacy-first, local-resilient** architecture, the app unites traditional editorial elegance with modern digital workflows:

1. **Print Authority Meets Mobile Ergonomics:** The tactile clarity of broadsheet layout combined with responsive cards, micro-actions, and an icon-forward curvy design system.
2. **Multi-Modal Consumption:** Fluid transitions between reading long-form investigative journalism, listening via natural Bengali Text-to-Speech (TTS), and watching embedded video reportage via Picture-in-Picture (PiP).
3. **Private Intelligence (BYOK AI):** Reader-controlled, on-device AI integration supporting Claude, GPT-4o, Gemini, and DeepSeek for instant 3-bullet summaries and in-depth inquiry without centralized user profiling.
4. **Resilience & Zero-Censorship Availability:** Complete offline reading, SQLite-backed cache, and cross-platform reliability for readers across Bangladesh (even on unstable 3G networks) and the worldwide Bangladeshi diaspora.

---

## 2. Problem Statement & Market Opportunity

| Challenge | Existing Gap in Market | Amar Desh Solution |
| :--- | :--- | :--- |
| **Slow, Cluttered Mobile Web** | Ad-bloated websites, high data usage, layout shifts, poor mobile legibility. | Native Expo React Native app, zero third-party ad tracking, instantaneous cached loads (<1.8s). |
| **Commuter & Multi-Tasking Constraints** | Readers cannot read text while driving, walking, or riding public transit. | 1-tap Native Bengali TTS listen bar with playback speed control (0.75x–1.5x) and floating player. |
| **Digital vs. Print Disconnect** | Elderly and diaspora readers miss physical newspaper columns and authentic pagination. | Interactive e-Paper canvas with zoom, pan, column hotspot detection, and 1-tap clipping share. |
| **Opaque Algorithms & Privacy Invasion** | Commercial news apps track reader telemetry and sell behavioral profiles. | Local-first SQLite database, on-device affinity engine, zero telemetry, GDPR data export/purge. |
| **Historical & Revolutionary Context** | Crucial coverage of Bangladesh's democratic movements (e.g., July 2024 Revolution) gets lost in chronological feeds. | Dedicated July Revolution Archive hub documenting timeline, martyr tributes, and investigative exposés. |

---

## 3. User Personas

### Persona 1: The Daily Commuter (Rahim, 36, Dhaka)
- **Profile:** Software engineer in Dhaka commuting via Metro Rail and rickshaw (45–60 mins each way).
- **Behavior:** Needs quick morning briefing; listens to news audio on headphones; needs offline caching for underground metro zones.
- **Key Features Used:** Audio News Bar (TTS), Breaking News Ticker, Offline Read Queue, Prayer Times widget.

### Persona 2: The Expatriate Intellectual (Tariq, 48, London / Kuala Lumpur)
- **Profile:** Bangladeshi diaspora professional keeping close tabs on national politics and policy.
- **Behavior:** Prefers reading in-depth opinion editorials and broadsheet layout; values AI executive summaries to digest complex policy reports.
- **Key Features Used:** Interactive e-Paper column clipper, BYOK AI Summary Card, Cloud Sync across devices, Opinion columns.

### Persona 3: The Student & Youth Activist (Anika, 21, Chittagong University)
- **Profile:** University student deeply engaged in civic reform and current affairs.
- **Behavior:** Uses smartphone late at night in OLED dark mode; shares verified news snippets on WhatsApp and Telegram.
- **Key Features Used:** July Revolution Special Hub, OLED Night Edition theme, Native Share Sheet, Article Reactions (5 emojis).

### Persona 4: The Regional Grassroots Reader (Abul Kashem, 54, Bogura)
- **Profile:** Small business owner in northern Bangladesh relying on 3G cellular network.
- **Behavior:** Primary interest in division/district news, agriculture, and market commodity prices; requires clear, large Bengali typography.
- **Key Features Used:** District Picker (64 districts filter), Reader Settings (font size scaling), Local Prayer Times calculation.

---

## 4. Product Pillars & Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DAILY AMAR DESH MOBILE                          │
├──────────────────┬───────────────────┬─────────────────────────────────┤
│  1. EDITORIAL    │  2. MULTIMODAL    │  3. INTELLIGENCE & SYNC         │
│  - Live RSS Feed │  - Bengali TTS    │  - BYOK Multi-Model AI Engine   │
│  - Breaking News │  - YouTube PiP    │  - On-Device Affinity SQLite    │
│  - 64 Districts  │  - e-Paper Canvas │  - Supabase/Firebase Cloud Sync │
├──────────────────┴───────────────────┴─────────────────────────────────┤
│                     ICON-FIRST CURVY DESIGN SYSTEM                     │
│    Noto Serif / Noto Sans Bengali • OLED Night Mode • 44px Touch Targets│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Functional Requirements & Feature Specifications

### 5.1 Pillar 1: Editorial Feed & Core Navigation (P0)

#### 5.1.1 Masthead & Header
- **Localized Date & Hijri Calendar:** Shows current date in Bengali format (`বুধবার, ৭ অক্টোবর ২০২৬`) and weather indicator.
- **Prayer Times Quick Bar:** Displays upcoming prayer name and countdown time for user's district with GPS icon.
- **Language Switcher Pill:** One-tap toggle between Bengali (`বাংলা`) and English (`EN`) interface.
- **Brand Logo:** High-definition vector-rendered `AmarDeshLogo` with sub-headline *« স্বাধীনতার কথা বলে »*.

#### 5.1.2 Home Feed & Breaking News Ticker
- **Breaking News Marquee:** Pulsing red badge (`#BA131A`) with dynamic auto-scrolling flash news headers.
- **Lead Hero Article Card:** 16:9 featured story with high-resolution image, category kicker, reading time, and author byline.
- **Category Filter Rail:** Horizontally scrollable pill chips (সর্বশেষ, জাতীয়, রাজনীতি, অর্থনীতি, আন্তর্জাতিক, খেলা, বিনোদন, মতামাত).
- **Pull-to-Refresh & Pagination:** Standardized haptic pull-to-refresh pulling live RSS feeds with infinite scroll buffer.

#### 5.1.3 Article Detail Reader
- **Typography Engine:** Dual-script serif reading prose (`Noto Serif Bengali` / `Newsreader`) with 1.6x optical line height.
- **Reading Progress Bar:** 2px high-visibility progress strip pinned to top viewport.
- **Reader Settings Modal:** Quick customization sheet for text size (`A- / A+`), line height, and font family.
- **Related Articles:** Contextually suggested stories matching current article's category and tags.

---

### 5.2 Pillar 2: Multi-Modal News (P1)

#### 5.2.1 Text-to-Speech (TTS) Listen Mode
- **Native Bengali Speech Engine:** Integrated via Expo Speech with fallback phonetic preprocessing.
- **Audio News Bar:** Floating bottom player bar with Play, Pause, 10s Rewind, and Speed Toggle (`0.75x`, `1.0x`, `1.25x`, `1.5x`).
- **Background Audio Support:** Continues playback when screen is locked or while browsing other tabs.

#### 5.2.2 YouTube Video Feed & Floating Player (PiP)
- **Official Channel Feed:** Curated video list synchronized with Daily Amar Desh's verified YouTube channel.
- **Inline & Floating Player:** Native embedded player with 1-tap transition to floating Picture-in-Picture window (`200x112px`).
- **Channel Deep Link:** Direct icon button linking to YouTube application for live broadcasts.

#### 5.2.3 Interactive e-Paper BroadSheet
- **High-Resolution Canvas:** Vectorized pan/zoom of daily print editions with pinch-to-zoom gestures.
- **Column Hotspots:** Smart bounding boxes around individual news columns with `"কলাম পাঠ"` indicators.
- **Clipping Sheet:** One-tap column cropping generating shareable image cards with source attribution.

---

### 5.3 Pillar 3: On-Device Intelligence & BYOK AI (P2)

#### 5.3.1 Bring-Your-Own-Key (BYOK) Architecture
- **Multi-LLM Support:** Direct client-side API integrations for:
  - **Anthropic Claude:** Claude 3.5 Sonnet, Claude 3 Haiku
  - **OpenAI:** GPT-4o, GPT-4o-mini
  - **Google Gemini:** Gemini 1.5 Pro, Gemini 1.5 Flash
  - **DeepSeek:** DeepSeek Chat, DeepSeek Coder
- **Key Security:** API keys stored exclusively on client hardware via `AsyncStorage` / `SecureStore`. Keys are NEVER transmitted to Amar Desh intermediate servers.
- **Key Validation & Usage Guard:** Built-in connection tester with token balance safety limits.

#### 5.3.2 AI Executive Summary Card
- **3-Bullet Key Takeaways:** Automatically extracts 3 salient points from long-form articles in natural, grammatically pure Bengali.
- **Regenerate & Deep Dive:** Quick action buttons to re-summarize or expand bullet points.

#### 5.3.3 Conversational Assistant Modal
- **Contextual Q&A:** Bottom-sheet chat interface allowing readers to ask follow-up questions directly about the active article.
- **Suggested Inquiry Chips:** Quick prompt buttons (e.g., *"প্রেক্ষাপট ব্যাখ্যা করুন"*, *"গুরুত্বপূর্ণ ব্যক্তিত্ব কারা?"*, *"পরবর্তী প্রভাব কী হতে পারে?"*).

---

### 5.4 Pillar 4: Cultural & Regional Features (P1 / P2)

#### 5.4.1 Bangladesh District News Hub (64 Districts)
- **Division & District Taxonomy:** Comprehensive coverage of all 8 administrative divisions and 64 districts.
- **District Picker Modal:** Instant searchable bottom sheet with quick-filter division tabs.
- **Hyper-Local Caching:** Remembers user's preferred district and surfaces local news on the home feed.

#### 5.4.2 Daily Prayer Times (সালাত ও ইফতার সময়সূচি)
- **Accurate Astronomical Calculation:** AlAdhan API synchronization with offline geometric formula fallback.
- **5 Daily Prayers + Sunrise/Tahajjud:** Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha calculations with district adjustments.
- **GPS-Assisted Accuracy:** 1-tap location detection for pinpoint timing adjustments.

#### 5.4.3 July Revolution Special Hub (জুলাই বিপ্লব ২০২৪)
- **Historical Timeline:** Interactive chronological documentation of the July 2024 Student-People Uprising.
- **Martyr Archive & Memorials:** Verified profiles, martyr tributes, and investigative records.
- **Audio-Visual Retrospective:** Special video documentaries and photojournalism galleries.

---

### 5.5 Pillar 5: Personalization, Offline & Cloud Sync (P1 / P2)

#### 5.5.1 Local-First SQLite Personalization
- **Anonymous User ID:** UUID generated on first launch; zero requirement for user registration or phone number.
- **On-Device Affinity Engine:** Calculates weighted scores for categories and tags based on dwell time and read events.
- **"For You" Personalized Stream:** Algorithmic curation that preserves reader diversity and avoids ideological filter bubbles.

#### 5.5.2 Offline Database & Read-Later Queue
- **Automatic Feed Caching:** Last 50 articles automatically cached in SQLite / AsyncStorage for offline access.
- **Explicit Bookmark Queue:** Persistent saved articles tab with tag grouping and storage space indicators.
- **Offline Reading Progress:** Syncs read percentage and bookmarks seamlessly upon internet restoration.

#### 5.5.3 Cloud Continuity & Sync
- **Dual Cloud Backend Support:** Pluggable adapter supporting Supabase Auth and Firebase Auth.
- **Cross-Device Sync:** Syncs bookmarks, reading streaks, and saved preferences across multiple user devices upon login.
- **Conflict Resolution:** Last-Write-Wins (LWW) with client-timestamp reconciliation.

#### 5.5.4 Privacy, Compliance & Data Sovereignty
- **Tracking Opt-Out:** Master toggle to immediately disable local event tracking and purge affinity vectors.
- **GDPR-Grade Data Export:** One-tap export generating structured JSON containing reading history and bookmarks.
- **Instant Data Purge:** One-tap irreversible deletion of all local database records and user identifiers.

---

## 6. Non-Functional Requirements (NFRs)

### 6.1 Performance Benchmarks
| Metric | Target | Verified Reality |
| :--- | :--- | :--- |
| **Cold Start Launch Time** | < 2.0 seconds | ~1.6 seconds on mid-tier Android |
| **Warm Start Resume** | < 600 ms | < 350 ms |
| **Feed Scrolling Frame Rate** | 60 FPS (Zero stutter) | 60 FPS via FlatList & memoized cards |
| **RSS Ingestion to Render** | < 1.5 seconds | ~800 ms with concurrent parser |
| **Offline Cache Load** | < 300 ms | Instantaneous SQLite / AsyncStorage query |
| **App Bundle Size** | < 25 MB (Android AAB) | Optimized via Hermes & tree shaking |

### 6.2 Security & Data Protection
- **Zero Third-Party Ad Trackers:** No Google AdMob, Facebook SDK, or third-party behavioral trackers.
- **Local-First BYOK Security:** User API keys for Claude, OpenAI, Gemini, and DeepSeek stored in secure device storage; never sent to Amar Desh servers.
- **Network Encryption:** Mandatory HTTPS/TLS 1.3 across all RSS, API, and cloud synchronization endpoints.
- **Sanitized HTML Rendering:** XSS prevention and script tag stripping in article body parser.

### 6.3 Accessibility & Inclusivity (a11y)
- **Touch Target Standard:** Minimum 44×44px interactive bounds across all icons, pills, and segment toggles.
- **Contrast Ratios:** WCAG AAA (>7:1) for body text; WCAG AA (>4.5:1) for secondary metadata and icons.
- **Screen Reader Support:** Semantic accessibility labels in Bengali for all non-text action buttons.
- **Dynamic Font Scaling:** Full UI responsiveness up to 150% system font scaling without container clipping.

---

## 7. Release Milestones & Phase Tracking

```
Phase 1: Core Native MVP (Completed v1.0.0)
  ├── Expo Router v4 & Native Shell
  ├── Live RSS & Scraper Pipeline
  └── Category, Article & Search Screens
Phase 2: Multimedia & Interactions (Completed v1.1.0)
  ├── Native Bengali TTS & Audio News Bar
  ├── YouTube Hub & PiP Video Player
  └── Reactions & Reader Settings Modal
Phase 3: Offline & Local Personalization (Completed v1.2.0)
  ├── Multi-Tier Offline Storage & SQLite DB
  ├── On-Device Event Tracker & Affinity Calculator
  └── Continue Reading Card & Reading Streak
Phase 4: Notifications & OTA Updates (Completed v1.2.5)
  ├── Expo Push Channels & In-App Notification Inbox
  ├── Breaking News Marquee
  └── Over-The-Air Update Service
Phase 5: BYOK Multi-LLM AI & e-Paper (Completed v1.2.8)
  ├── Claude, GPT-4o, Gemini, DeepSeek Provider Engine
  ├── AI Summary Card & Conversational Assistant
  └── Interactive e-Paper BroadSheet Canvas & Column Clipper
Phase 6: Cloud Sync & Cultural Specials (Completed v1.3.0)
  ├── Supabase / Firebase Cloud Sync Engine
  ├── July Revolution 2024 Special Archive
  ├── 64-District News & Prayer Times Engine
  └── Modern Curvy & Icon-First Design Overhaul
Phase 7: Editorial UI/UX & Micro-Interactions Suite (Completed v1.4.0)
  ├── 3rd Theme: "সংবাদপত্র সেপিয়া" (Parchment Sepia Mode)
  ├── Editorial Quote Card Generator Modal
  ├── "আজকের দৃষ্টিপাত" Visual Web Stories Rail & Full-Screen Viewer
  ├── Focus Reading Mode & Feed Layout Switcher (Magazine vs Compact)
  ├── Live Cricket Scores & Market Indicators Ticker
  ├── ePaper Magnifier Loupe Lens & Animated Speech Waveform
  └── Contextual Milestone Timeline & AI Tone Switcher
```

---

## 8. Success Metrics & Key Performance Indicators (KPIs)

1. **User Retention:** >40% Day-7 retention, >25% Day-30 retention across Android & iOS.
2. **Session Engagement:** Average session duration > 6.5 minutes; > 3.8 articles read per active session.
3. **Multi-Modal Adoption:** > 30% of readers engaging with Bengali TTS Audio News at least once per week.
4. **Offline Resilience:** Zero crash rate during offline launches; > 15% of total article reads fulfilled from local offline cache.
5. **AI Feature Utilization:** > 20% of readers configuring BYOK keys or utilizing AI 3-bullet summary cards.
6. **App Stability:** > 99.8% crash-free user sessions across Google Play Console and Apple App Store.
