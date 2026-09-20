# PRD: Group A — Core UX & Personalization

**Feature Group:** Core UX & Personalization
**Status:** Draft — Awaiting Approval
**Feature Flags:** `groupACoreUx` (master), plus per-feature flags
**Target Release:** v1.1.0
**Dependencies:** None (pure frontend)
**Author:** Development Agent
**Date:** 2026-09-20

---

## 📋 Overview

This PRD covers four features that enhance the core reading experience through personalization and navigation flexibility:

| # | Feature | Flag | Priority |
|---|---------|------|----------|
| A1 | User-reorderable feed sections | `dragDropReorder` | P0 |
| A2 | "For You" / "My News" tab | `forYouTab` | P0 |
| A3 | Dual navigation toggle (list ↔ cards) | `swipeCardFeed` | P1 |
| A4 | Hyper-local feed selector | `hyperLocalFeed` | P1 |

---

## 🔑 Key Design Decisions (Pre-Approved)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Drag library | `@dnd-kit/core` + `@dnd-kit/sortable` | Already installed, accessible, mobile-friendly |
| Animation library | `framer-motion` | Already installed, great for swipe gestures |
| Persistence | `localStorage` via Zustand | No backend needed, works offline |
| Auth requirement | **None** | All features work without login |
| Data source | Existing `useArticles` hook | No new data layer needed |

---

## 🎯 Feature A1: User-Reorderable Feed Sections

### Description
Allow users to drag-and-drop reorder the sections on their home feed (e.g., Prayer Times, Hero, News Grid, Most Read, etc.). Order is persisted per device.

### Functional Requirements

**FR-1:** The home feed consists of identifiable "section blocks" that can be reordered.
**FR-2:** Each section block has a visible drag handle (⋮⋮ icon) that appears on long-press or hover.
**FR-3:** User can drag a section to a new position and drop it.
**FR-4:** The new order is saved to `localStorage` immediately on drop.
**FR-5:** On app load, sections render in the user's saved order.
**FR-6:** A "Reset to Default" button restores the original section order.
**FR-7:** The reorder UI is only visible when the user explicitly enters "Edit Layout" mode (via a settings button).
**FR-8:** When not in edit mode, sections render normally with no drag affordance.

### Available Sections (Default Order)
```
1. Live Data Indicator
2. Prayer Times Widget
3. Hero Article
4. News Grid (2-column)
5. Most Read Section
6. More Articles (horizontal list)
```

### Acceptance Criteria

**AC-1:** GIVEN user is on the home page, WHEN they tap "Edit Layout" button, THEN drag handles appear on each section.
**AC-2:** GIVEN user is in edit mode, WHEN they drag "Prayer Times" below "News Grid" and release, THEN the section order updates visually.
**AC-3:** GIVEN user has reordered sections, WHEN they close and reopen the app, THEN sections appear in the saved order.
**AC-4:** GIVEN user is in edit mode, WHEN they tap "Reset to Default", THEN sections return to original order AND localStorage is cleared.
**AC-5:** GIVEN user is NOT in edit mode, WHEN they view the home page, THEN no drag handles are visible and sections are non-interactive.
**AC-6:** GIVEN user is on a touch device, WHEN they long-press (500ms) a drag handle, THEN drag mode activates.

### Edge Cases

| Case | Behavior |
|------|----------|
| First visit (no saved order) | Use default order |
| localStorage full/unavailable | Fall back to default order, show toast |
| Section has no content (e.g., no articles) | Section still draggable, shows empty state |
| Screen rotation during drag | Cancel drag, restore previous position |
| Very small screen (<320px) | Disable drag, show "Layout editing not available" |

### Files to Touch
```
NEW: src/components/home/SectionBlock.tsx
NEW: src/components/home/EditLayoutMode.tsx
NEW: src/store/useLayoutStore.ts
MODIFY: src/pages/HomePage.tsx (wrap sections in SectionBlock)
MODIFY: src/store/useAppStore.ts (add feature flag)
```

### API Contract Changes
**None** — Pure frontend feature.

---

## 🎯 Feature A2: "For You" / "My News" Tab

### Description
A new tab in the bottom navigation that aggregates content based on user preferences: followed categories, bookmarked articles, and reading history. Works without authentication using localStorage.

### Functional Requirements

**FR-1:** A new "আমার জন্য" (For You) tab appears in the bottom navigation bar.
**FR-2:** The tab aggregates articles from:
  - User's followed categories (selected via a preference picker)
  - Recently bookmarked articles
  - Most-read categories (inferred from reading history)
**FR-3:** Users can follow/unfollow categories via a "Manage Interests" screen.
**FR-4:** The "For You" feed shows a mixed, deduplicated list of articles sorted by recency.
**FR-5:** If the user has no preferences set, show a friendly onboarding prompt: "বিভাগ নির্বাচন করুন" (Select categories).
**FR-6:** Reading history is tracked (last 50 article IDs) in localStorage.
**FR-7:** The tab shows a "🔥 Based on your interests" header.
**FR-8:** Users can clear their reading history via settings.

### Acceptance Criteria

**AC-1:** GIVEN user has followed "জাতীয়" and "খেলা", WHEN they open "আমার জন্য" tab, THEN they see articles from those categories.
**AC-2:** GIVEN user has no followed categories, WHEN they open the tab, THEN they see an onboarding prompt with category chips to follow.
**AC-3:** GIVEN user follows categories, WHEN they tap "Manage Interests", THEN they see all categories with follow/unfollow toggles.
**AC-4:** GIVEN user has read 10 articles in "রাজনীতি", WHEN the system infers interests, THEN "রাজনীতি" is suggested as a category to follow.
**AC-5:** GIVEN user has bookmarked articles, WHEN they open "আমার জন্য", THEN bookmarked articles appear in the feed (marked with 🔖).
**AC-6:** GIVEN user clears reading history, WHEN the system recalculates, THEN inferred interests reset.

### Edge Cases

| Case | Behavior |
|------|----------|
| No followed categories + no history | Show onboarding prompt |
| All followed categories have no articles | Show "No articles found" with suggestion to follow more |
| localStorage cleared externally | Treat as new user, show onboarding |
| User follows all 20 categories | Show mixed feed, no special handling |
| Offline mode | Show cached articles from followed categories |

### Files to Touch
```
NEW: src/pages/ForYouPage.tsx
NEW: src/components/home/InterestPicker.tsx
NEW: src/store/usePreferencesStore.ts
NEW: src/hooks/useReadingHistory.ts
MODIFY: src/components/common/BottomNav.tsx (add tab)
MODIFY: src/App.tsx (add route)
MODIFY: src/store/useAppStore.ts (add feature flag)
```

### API Contract Changes
**None** — Pure frontend. Reading history and preferences stored in localStorage.

### Data Shape (New Store)
```typescript
interface PreferencesState {
  followedCategories: string[];
  readingHistory: string[]; // article IDs
  inferredInterests: string[];
  followCategory: (cat: string) => void;
  unfollowCategory: (cat: string) => void;
  addToHistory: (articleId: string) => void;
  clearHistory: () => void;
}
```

---

## 🎯 Feature A3: Dual Navigation Toggle (List ↔ Cards)

### Description
Allow users to switch between two feed viewing modes: traditional scrollable list and Tinder-style swipeable cards.

### Functional Requirements

**FR-1:** A toggle button (📋/🃏 icon) appears in the home page header area.
**FR-2:** In "List Mode" (default), articles display as the current scrollable feed.
**FR-3:** In "Card Mode", articles display as full-screen swipeable cards (one at a time).
**FR-4:** In Card Mode, user can swipe left to skip, swipe right to read/open.
**FR-5:** In Card Mode, user can tap to open the article detail.
**FR-6:** The selected mode is persisted in localStorage.
**FR-7:** Card Mode shows article image (full bleed), title, excerpt, category, and time.
**FR-8:** A progress indicator shows "3 of 12" in Card Mode.
**FR-9:** Swipe animations use framer-motion with spring physics.
**FR-10:** Card Mode supports both touch swipe and keyboard arrows (← →).

### Acceptance Criteria

**AC-1:** GIVEN user is in List Mode, WHEN they tap the toggle button, THEN feed switches to Card Mode with animation.
**AC-2:** GIVEN user is in Card Mode, WHEN they swipe right on a card, THEN the article detail opens.
**AC-3:** GIVEN user is in Card Mode, WHEN they swipe left, THEN the next card appears with animation.
**AC-4:** GIVEN user is in Card Mode, WHEN they reach the last card, THEN a "No more articles" message appears.
**AC-5:** GIVEN user switches to Card Mode, WHEN they close and reopen the app, THEN Card Mode is still active.
**AC-6:** GIVEN user is in Card Mode on desktop, WHEN they press → arrow, THEN next card appears.

### Edge Cases

| Case | Behavior |
|------|----------|
| Only 1 article available | Show single card, no swipe |
| No articles | Show empty state in both modes |
| Image fails to load | Show category color placeholder |
| Very slow connection | Show skeleton card while loading |
| User swipes rapidly | Debounce to prevent animation overlap |

### Files to Touch
```
NEW: src/components/home/CardFeed.tsx
NEW: src/components/home/SwipeCard.tsx
MODIFY: src/pages/HomePage.tsx (add toggle + conditional render)
MODIFY: src/store/useAppStore.ts (add feedMode + feature flag)
```

### API Contract Changes
**None** — Uses existing `useArticles` hook.

---

## 🎯 Feature A4: Hyper-Local Feed Selector

### Description
Allow users to filter news by their district or neighborhood, showing locally relevant articles.

### Functional Requirements

**FR-1:** A "📍 এলাকা" (Area) selector appears in the category tabs bar.
**FR-2:** Tapping it opens a district picker modal with Bangladesh's 8 divisions → 64 districts hierarchy.
**FR-3:** User can select one district as their "home location".
**FR-4:** Selected district is persisted in localStorage.
**FR-5:** When a district is selected, a "📍 [District Name]" badge appears in the header.
**FR-6:** The home feed filters to show articles tagged with that district (when available).
**FR-7:** If no articles match the district, show a message: "এই এলাকায় কোনো সংবাদ নেই" with option to clear filter.
**FR-8:** User can clear the location filter via the badge (tap X).
**FR-9:** Division → District data is bundled as static JSON (no API needed).
**FR-10:** The selector integrates with existing category filter (can combine: "জাতীয়" + "ঢাকা").

### Bangladesh Divisions & Districts (Sample)
```
ঢাকা: ঢাকা, গাজীপুর, নারায়ণগঞ্জ, টাঙ্গাইল, ...
চট্টগ্রাম: চট্টগ্রাম, কক্সবাজার, রাঙামাটি, ...
রাজশাহী: রাজশাহী, বগুড়া, পাবনা, ...
... (all 64 districts)
```

### Acceptance Criteria

**AC-1:** GIVEN user taps "📍 এলাকা", WHEN the modal opens, THEN they see 8 divisions.
**AC-2:** GIVEN user taps "ঢাকা" division, WHEN districts load, THEN they see all Dhaka district options.
**AC-3:** GIVEN user selects "কুমিল্লা", WHEN they return to home, THEN the "📍 কুমিল্লা" badge appears.
**AC-4:** GIVEN user has selected a district, WHEN articles load, THEN district-matching articles are prioritized.
**AC-5:** GIVEN user taps the X on the location badge, WHEN filter clears, THEN full national feed shows.
**AC-6:** GIVEN user has district selected AND category "খেলা" selected, WHEN feed loads, THEN only sports articles from that district show (or all sports if none match).

### Edge Cases

| Case | Behavior |
|------|----------|
| No articles match district | Show message + "Clear filter" button |
| District name doesn't match RSS category | Show all articles, note mismatch |
| User selects district, goes offline | Show cached articles from that district |
| Very small screen | District picker uses full-screen modal |
| User has never selected district | No filter applied, no badge shown |

### Files to Touch
```
NEW: src/data/districts.ts (static division/district data)
NEW: src/components/common/DistrictPicker.tsx
NEW: src/components/common/LocationBadge.tsx
NEW: src/store/useLocationStore.ts
MODIFY: src/components/common/CategoryTabs.tsx (add area button)
MODIFY: src/pages/HomePage.tsx (apply location filter)
MODIFY: src/store/useAppStore.ts (add feature flag)
```

### API Contract Changes
**None** — Static data + client-side filtering.

---

## 🚫 Out of Scope (Explicitly)

| Item | Reason |
|------|--------|
| Server-side user accounts | No backend yet; use localStorage |
| Real-time collaboration | Not needed for personalization |
| AI-powered recommendations | Separate feature (Group D) |
| Push notifications for followed topics | Separate feature (future) |
| Cross-device sync | Requires auth backend |
| Neighborhood-level granularity (below district) | No data source available |
| Map-based location picker | Over-engineered for v1 |
| Paid subscription gating | No paywall system exists |

---

## 🧪 Testing Strategy

### Unit Tests
- `usePreferencesStore` — follow/unfollow, history tracking
- `useLayoutStore` — reorder, reset, persistence
- `useLocationStore` — district selection, filtering
- District data — validate all 64 districts present

### Component Tests
- `SectionBlock` — drag handle visibility in edit mode
- `SwipeCard` — swipe gestures, animation
- `DistrictPicker` — division → district navigation
- `InterestPicker` — follow/unfollow toggles
- `ForYouPage` — empty state, onboarding prompt

### Integration Tests
- Reorder sections → persist → reload → verify order
- Follow categories → open For You → verify articles
- Select district → verify badge → verify filter
- Switch list ↔ card mode → persist → reload

### Manual Testing
- [ ] Drag-and-drop on iOS Safari
- [ ] Drag-and-drop on Android Chrome
- [ ] Swipe cards on touch devices
- [ ] Keyboard navigation for cards (desktop)
- [ ] Dark mode for all new components
- [ ] Bengali text rendering
- [ ] Screen reader announces drag handles

---

## 📊 Success Metrics

| Metric | Target |
|--------|--------|
| % users who try reorder | > 15% |
| % users who follow ≥1 category | > 30% |
| % users who try card mode | > 10% |
| % users who set location | > 20% |
| Avg. session duration (with features) | > 7 min (vs 5 min baseline) |
| Feature adoption (30-day) | > 40% use at least 1 feature |

---

## 🔄 Rollback Plan

Each feature is independently flaggable:
- If `dragDropReorder` causes issues → disable, sections render in default order
- If `forYouTab` causes issues → disable, tab hidden from nav
- If `swipeCardFeed` causes issues → disable, toggle hidden, list mode only
- If `hyperLocalFeed` causes issues → disable, no location filter

**Master kill switch:** Set `groupACoreUx: false` to disable ALL Group A features.

---

## 📝 Implementation Order

1. **Feature flags** — Add to `useAppStore` first
2. **A1: Drag-drop reorder** — Self-contained, no dependencies
3. **A3: Dual nav toggle** — Self-contained, uses existing data
4. **A4: Hyper-local selector** — Needs district data, filtering logic
5. **A2: For You tab** — Depends on A4 (location) and reading history

---

## ❓ Open Questions (Need Your Input)

1. **For You tab position:** Should it replace "ক্যাটা" (Categories) in bottom nav, or be a 6th tab?
   - **Option A:** Replace Categories (5 tabs total)
   - **Option B:** Add as 6th tab (might be crowded)
   - **My recommendation:** Option A — Categories accessible via home page header

2. **Card Mode swipe direction:** 
   - **Option A:** Right = open, Left = skip (Tinder-style)
   - **Option B:** Up = open, Down = skip (TikTok-style)
   - **My recommendation:** Option A — more intuitive for news

3. **District data source:** 
   - **Option A:** Bundle static JSON (64 districts)
   - **Option B:** Fetch from API
   - **My recommendation:** Option A — no backend needed, works offline

4. **Edit Layout access:**
   - **Option A:** Button in header (always visible)
   - **Option B:** Long-press on home screen
   - **Option C:** Hidden in "আরও" (More) menu
   - **My recommendation:** Option C — avoid cluttering header

---

## ✅ Approval Checklist

- [ ] PRD reviewed and approved
- [ ] Open questions resolved
- [ ] Feature flag names confirmed
- [ ] Implementation order approved
- [ ] Testing strategy approved

---

**Status:** ⏸️ **AWAITING APPROVAL**

Please review and provide feedback. Once approved, I'll proceed to Step 2: Per-Feature Design Docs and Implementation.
