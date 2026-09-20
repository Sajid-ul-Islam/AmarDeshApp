# Changelog - Daily Amar Desh Mobile App

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
