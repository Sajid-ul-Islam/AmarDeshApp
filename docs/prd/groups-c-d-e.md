# PRD: Groups C, D, E — Community, Utility, Commercial

**Date:** 2026-09-20
**Status:** Implemented

---

## Group C — Community & Engagement

### C1: Emoji Reactions
- **FR-1:** 5 emoji reactions (❤️ 😂 😮 😢 😡) on article detail
- **FR-2:** One reaction per article per user (can change)
- **FR-3:** Reaction counts shown publicly
- **FR-4:** Persisted in localStorage

### C2: Featured Comments
- **FR-1:** Comments section below article body
- **FR-2:** Users can add comments (stored locally)
- **FR-3:** Top 3 comments highlighted as "featured"
- **FR-4:** Like button on comments

### C3: Most Commented Module
- **FR-1:** Homepage widget showing top 5 most-commented articles
- **FR-2:** Updates in real-time as comments are added

### C4: Reading Streak
- **FR-1:** Track consecutive days of reading
- **FR-2:** Points earned per article (10 pts)
- **FR-3:** Streak display in header area
- **FR-4:** Celebration animation on milestone (confetti)

---

## Group D — Utility & Accessibility

### D1: Offline Article Download
- **FR-1:** Download button on article detail
- **FR-2:** Articles stored in IndexedDB
- **FR-3:** "Offline" section in bookmarks page
- **FR-4:** Visual indicator for downloaded articles

### D2: Continue Reading
- **FR-1:** Auto-save scroll position per article
- **FR-2:** "Continue Reading" banner when reopening
- **FR-3:** Restore scroll position on tap

### D3: Font Size + Theme Controls
- **FR-1:** Font size slider (S/M/L/XL)
- **FR-2:** Persists across sessions
- **FR-3:** Respects system dark mode preference

### D4: Enhanced Search
- **FR-1:** Search across all articles (live + cached)
- **FR-2:** AI-generated summary of search results (via BYoak)
- **FR-3:** Filter by category in search

### D5: Smart Summary
- **FR-1:** AI-generated summary at top of long articles
- **FR-2:** Uses BYoak AI if configured
- **FR-3:** "Skip to full article" button

---

## Group E — Commercial

### E1: Gift an Article
- **FR-1:** "Gift" button on article detail
- **FR-2:** Generates shareable link with article preview
- **FR-3:** Uses Web Share API where available

### E2: Interactive Ad Slots
- **FR-1:** Poll/survey widget between articles
- **FR-2:** User votes stored locally
- **FR-3:** Results shown after voting

### E3: Customizable Bottom Nav
- **FR-1:** User can reorder bottom nav items
- **FR-2:** Choose from available tabs
- **FR-3:** Persisted in localStorage
