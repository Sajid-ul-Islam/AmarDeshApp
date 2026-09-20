# PRD: Group B — Multimodal Content

**Feature Group:** Multimodal Content
**Status:** Implemented
**Feature Flags:** `groupBMultimodal` (master), `ttsListenMode`, `audioPlaylist`, `threeMinUpdate`, `verticalVideo`, `miniPlayer`
**Target Release:** v1.2.0
**Dependencies:** Group A (completed), BYoak AI (for summaries)
**Date:** 2026-09-20

---

## 📋 Overview

| # | Feature | Flag | Priority |
|---|---------|------|----------|
| B1 | "Listen" Mode (TTS) | `ttsListenMode` | P0 |
| B2 | Audio Playlist | `audioPlaylist` | P0 |
| B3 | "3-Minute Update" | `threeMinUpdate` | P1 |
| B4 | Vertical Video Feed | `verticalVideo` | P1 |
| B5 | Continue-Playing Indicator | `miniPlayer` | P0 |

---

## 🎯 Feature B1: "Listen" Mode (TTS)

### Description
Text-to-Speech for articles using browser's built-in SpeechSynthesis API. Supports Bengali voice, play/pause, speed control, and progress tracking.

### Functional Requirements
- **FR-1:** "🔊 শুনুন" button on every article detail page
- **FR-2:** Tapping opens full-screen Listen Mode with article text highlighted
- **FR-3:** Controls: Play/Pause, Skip ±10s, Speed (0.5x, 1x, 1.5x, 2x)
- **FR-4:** Progress bar shows reading position
- **FR-5:** Uses browser's SpeechSynthesis API (free, no API key needed)
- **FR-6:** Prefers Bengali voice if available, falls back to default
- **FR-7:** Auto-stops when user navigates away (unless mini-player active)
- **FR-8:** Estimated reading time shown before starting

### Acceptance Criteria
- **AC-1:** GIVEN article detail page, WHEN user taps "শুনুন", THEN listen mode opens
- **AC-2:** GIVEN listen mode active, WHEN user taps pause, THEN speech pauses
- **AC-3:** GIVEN listen mode active, WHEN user changes speed to 2x, THEN speech speeds up
- **AC-4:** GIVEN no Bengali voice available, WHEN user starts listening, THEN default voice reads Bengali text
- **AC-5:** GIVEN listen mode active, WHEN article finishes, THEN "complete" state shown

---

## 🎯 Feature B2: Audio Playlist

### Description
Queue multiple articles for continuous listening. Auto-advances to next article.

### Functional Requirements
- **FR-1:** "Add to Queue" button on article cards
- **FR-2:** Playlist shows queued articles with drag-to-reorder
- **FR-3:** Auto-plays next article when current finishes
- **FR-4:** Swipe-to-skip in listen mode
- **FR-5:** Queue persisted in sessionStorage (per-session)
- **FR-6:** "Clear Queue" option

---

## 🎯 Feature B3: "3-Minute Update"

### Description
Curated playlist of top 5 news summaries, playable as a 3-minute audio briefing.

### Functional Requirements
- **FR-1:** "৩ মিনিট আপডেট" card on home page
- **FR-2:** Contains top 5 breaking/important news excerpts
- **FR-3:** Total duration ~3 minutes
- **FR-4:** One-tap play starts the briefing
- **FR-5:** Shows progress through the briefing

---

## 🎯 Feature B4: Vertical Video Feed

### Description
TikTok-style vertical video feed using YouTube embeds from the newspaper's channel.

### Functional Requirements
- **FR-1:** "ভিডিও" accessible from More menu
- **FR-2:** Full-screen vertical video cards
- **FR-3:** Swipe up/down to navigate
- **FR-4:** YouTube iframe embeds
- **FR-5:** Video title + category overlay
- **FR-6:** Auto-play when in viewport

---

## 🎯 Feature B5: Mini-Player (Continue-Playing)

### Description
Persistent mini-player bar that stays across navigation when audio is playing.

### Functional Requirements
- **FR-1:** Mini-player appears above bottom nav when audio is active
- **FR-2:** Shows: article title (truncated), play/pause, close
- **FR-3:** Tapping expands to full listen mode
- **FR-4:** Persists across page navigation
- **FR-5:** Close button stops playback and dismisses

---

## 🚫 Out of Scope
- Custom TTS voices (cloud APIs)
- Video upload/hosting
- Background playback (PWA limitation)
- Download audio for offline
- Podcast RSS integration

---

## 📁 Implementation Plan

### New Files
- `src/services/ttsService.ts`
- `src/store/usePlayerStore.ts`
- `src/components/media/MiniPlayer.tsx`
- `src/components/media/ListenMode.tsx`
- `src/components/media/AudioPlaylist.tsx`
- `src/components/media/ThreeMinUpdate.tsx`
- `src/components/media/VideoFeed.tsx`
- `src/pages/VideoPage.tsx`

### Modified Files
- `src/store/useAppStore.ts` (feature flags)
- `src/components/article/ArticleDetail.tsx` (listen button)
- `src/pages/HomePage.tsx` (3-min update card)
- `src/App.tsx` (mini-player + routes)
