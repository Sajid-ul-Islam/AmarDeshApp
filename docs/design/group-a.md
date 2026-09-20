# Design Doc: Group A — Core UX & Personalization

**Status:** ✅ Implemented
**Feature Flags:** `groupACoreUx` (master), `dragDropReorder`, `forYouTab`, `swipeCardFeed`, `hyperLocalFeed`
**Date:** 2026-09-20

---

## Chosen Approach

### A1: Drag-Drop Reorder
- **Library:** @dnd-kit/core + @dnd-kit/sortable (already installed)
- **Pattern:** Edit mode toggle (via CategoryTabs button) → sections become draggable
- **Persistence:** localStorage via useLayoutStore
- **Rejected:** react-beautiful-dnd (deprecated), react-dnd (heavier)

### A2: For You Tab
- **Pattern:** New bottom nav tab replacing "ক্যাটা" (Categories)
- **Data:** Filters existing articles by followed categories
- **Onboarding:** Interest picker shown when no categories followed
- **Rejected:** Separate page (harder to discover), AI recommendations (needs backend)

### A3: Dual Navigation (List ↔ Cards)
- **Library:** framer-motion (already installed) for swipe gestures
- **Pattern:** Toggle button in header switches between list and card mode
- **Swipe:** Right = open article, Left = next card (Tinder-style)
- **Rejected:** TikTok-style vertical swipe (less intuitive for news)

### A4: Hyper-Local Feed
- **Data:** Static JSON with 8 divisions → 64 districts
- **Pattern:** Button in category tabs opens district picker modal
- **Badge:** LocationBadge shows selected district with clear button
- **Rejected:** API-based (needs backend), map picker (over-engineered)

---

## Files Created

### Stores (3)
- `src/store/useLayoutStore.ts` — Section order + edit mode
- `src/store/usePreferencesStore.ts` — Followed categories + reading history
- `src/store/useLocationStore.ts` — Division/district selection

### Components (7)
- `src/components/home/SectionBlock.tsx` — Draggable section wrapper
- `src/components/home/EditLayoutMode.tsx` — Edit mode container with toolbar
- `src/components/home/CardFeed.tsx` — Card feed manager
- `src/components/home/SwipeCard.tsx` — Individual swipeable card
- `src/components/home/InterestPicker.tsx` — Category follow/unfollow UI
- `src/components/common/DistrictPicker.tsx` — Division → district modal
- `src/components/common/LocationBadge.tsx` — Selected area indicator

### Pages (1)
- `src/pages/ForYouPage.tsx` — Personalized feed page

### Data (1)
- `src/data/districts.ts` — Bangladesh division/district data

### Modified (5)
- `src/store/useAppStore.ts` — Added feature flags + feed mode
- `src/components/common/BottomNav.tsx` — Replaced Categories with For You
- `src/components/common/CategoryTabs.tsx` — Added area selector + edit layout button
- `src/pages/HomePage.tsx` — Added card mode + edit layout integration
- `src/App.tsx` — Added ForYouPage route + store initialization

---

## Rollback Plan

Each feature degrades gracefully when its flag is off:

| Flag Off | Behavior |
|----------|----------|
| `dragDropReorder` | No edit button, sections in default order |
| `forYouTab` | AI tab shown instead of For You |
| `swipeCardFeed` | No toggle button, list mode only |
| `hyperLocalFeed` | No area button in category tabs |
| `groupACoreUx` | ALL features disabled |

---

## Feature Flag Access

Users can toggle flags in "আরও" (More) menu under "🚩 ফিচার ফ্ল্যাগ" section.

---

## Testing Notes

### Manual Testing Checklist
- [ ] Drag sections in edit mode → reorder persists after reload
- [ ] Reset button restores default order
- [ ] For You tab shows onboarding when no categories followed
- [ ] Follow categories → articles appear in For You feed
- [ ] Card mode toggle works → swipe right opens article
- [ ] Swipe left advances to next card
- [ ] Keyboard arrows work in card mode (desktop)
- [ ] District picker shows 8 divisions → districts on tap
- [ ] Selected district shows badge → can be cleared
- [ ] All features toggle on/off via feature flags
- [ ] Dark mode works for all new components
- [ ] Bengali text renders correctly

### Known Limitations
- District filter doesn't actually filter RSS articles (no district metadata in RSS)
- Reading history inference is placeholder (needs article metadata mapping)
- Card mode doesn't prefetch next card image
