# TODO - Daily Amar Desh Mobile App

## 🎨 Icon-First UI & Modern Curvy Design System

### ✅ Completed
- [x] Defined central border-radius tokens in `theme/tokens.ts` (`sm: 8px`, `md: 12px`, `lg: 16px`, `pill: 999px`)
- [x] Integrated `radii` and `shadows` (soft card & diffused ambient shadows) into `getThemeTokens` and `useThemedStyles`
- [x] Refactored all 18 primary components and screens to rounded/curvy design system:
  - `components/PrayerTimesWidget.tsx` (curvy container, soft shadows, pill indicators, icon-led GPS prompt)
  - `components/DistrictPickerModal.tsx` (curvy sheet `radii['2xl']`, pill buttons, icon badges)
  - `components/AdBanner.tsx` (curvy cards, pill CTA buttons, soft shadows)
  - `components/AiSummaryCard.tsx` (curvy card, pill buttons, icon-first regenerate and toggle controls)
  - `components/AiAssistantModal.tsx` (curvy bottom sheet, pill chips, rounded bubbles)
  - `components/BreakingNewsTicker.tsx` (pill badge, pill pulse dot, hairline borders)
  - `components/ContinueReadingCard.tsx` (curvy container, pill progress, icon-driven action)
  - `components/ReadingStreak.tsx` (curvy card, pill flame badge)
  - `components/ArticleReactions.tsx` (curvy container, rounded reaction pills)
  - `components/AudioNewsBar.tsx` (curvy player bar, pill speed and playback buttons)
  - `components/FloatingVideoPlayer.tsx` (curvy floating container, pill status badges)
  - `components/ReaderSettingsModal.tsx` (curvy modal, pill buttons, close icon button)
  - `components/SyncStatus.tsx` (curvy container, pill login/sync buttons)
  - `app/(tabs)/index.tsx` (curvy hero card & article cards, pill category chips, icon-only header buttons)
  - `app/(tabs)/video.tsx` (curvy cards, pill chips, concise icon-led channel and PiP buttons)
  - `app/(tabs)/menu.tsx` (curvy date/weather and e-paper cards, pill search button, pill language segment)
  - `app/(tabs)/bookmarks.tsx` (curvy cards, pill segment tabs, icon-first interests action)
  - `app/(tabs)/search.tsx` (pill search bar, pill tag chips, curvy result cards)
  - `app/(tabs)/epaper.tsx` (curvy viewer card, pill floating control bar, curvy crop sheet)
  - `app/article/[id].tsx` (curvy cards, pill buttons, curvy share sheet)
  - `app/settings/ai.tsx`, `app/category/[slug].tsx`, `app/july-revolution/index.tsx`, `app/auth/login.tsx`, `app/settings/interests.tsx`, `app/settings/privacy.tsx`
- [x] Replaced bulky text with icons in key action areas:
  - Bookmarks: Replaced long text "পছন্দ কাস্টমাইজ করুন" with icon-first `<Ionicons name="options-outline" />` and compact label
  - Video screen: Replaced long labels "অফিসিয়াল চ্যানেল" with YouTube icon badge "চ্যানেল ↗", and "ভাসমান প্লেয়ার" with PiP icon "ভাসমান"
  - Prayer Times: Replaced long prompt with icon-led `<Ionicons name="navigate" /> সঠিক সময়ে GPS অন করুন →`
  - Fixed `ReaderSettingsModal.tsx` tokens typing and close icon button

### 📋 Icon-First Backlog (For Later Polish)
- [ ] Replace any remaining verbose button labels in settings screens with icon-forward pills
- [ ] Add SVG micro-icons next to search suggestions and category filter headers
- [ ] Add animated icon feedback for bookmark and reaction touches
- [ ] Further reduce text label footprints in media player floating controls

---

## 🎯 MVP Architecture & Sprint Tracker

### ✅ Completed
- [x] Research website (dailyamardesh.com)
- [x] Create R&D documentation
- [x] Create Architecture document
- [x] Create Design document
- [x] Create PRD document
- [x] Create Rules document
- [x] Create Agent document
- [x] Create README
- [x] Create Test Plan
- [x] Create Changelog
- [x] Create TODO list
- [x] Setup project skeleton
- [x] Define TypeScript types
- [x] Create mock data
- [x] Create utility functions

### 🔄 In Progress
- [ ] Build Home Page layout
- [ ] Build Header component
- [ ] Build Category navigation
- [ ] Build News Card components
- [ ] Build Prayer Times widget

### 📋 Backlog

#### Phase 1 - Core Features
- [ ] Article detail page
- [ ] Category page with article list
- [ ] Search page with results
- [ ] Bottom navigation bar
- [ ] Footer component
- [ ] Loading states / Skeleton screens
- [ ] Error boundary component
- [ ] 404 page

#### Phase 2 - Enhanced Features
- [ ] Bookmark functionality
- [ ] Dark mode toggle
- [ ] Share article functionality
- [ ] Most read section
- [ ] Video section page
- [ ] Font size adjustment
- [ ] Pull to refresh animation
- [ ] Infinite scroll

#### Phase 3 - Advanced Features
- [ ] Service Worker for offline support
- [ ] Push notification setup
- [ ] PWA manifest
- [ ] Area-wise news filter
- [ ] e-Paper link integration
- [ ] Analytics integration
- [ ] Performance optimization
- [ ] SEO optimization

## 📊 Progress Tracker

| Phase | Tasks | Completed | Progress |
|-------|-------|-----------|----------|
| Documentation | 10 | 10 | ████████████ 100% |
| Phase 1 (MVP) | 15 | 4 | ████░░░░░░░░ 27% |
| Phase 2 | 8 | 0 | ░░░░░░░░░░░░ 0% |
| Phase 3 | 8 | 0 | ░░░░░░░░░░░░ 0% |

## 🐛 Known Issues
- None yet (initial setup)

## 💡 Ideas / Future Considerations
- Add Bengali calendar integration
- Weather widget for Bangladesh
- Gold/currency rate ticker
- Traffic update for Dhaka
- Cricket score live widget
- Election results tracker
