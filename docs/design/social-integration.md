# Social & Multimedia Integration Design

**Date:** 2026-09-20  
**Status:** In Progress  
**Author:** Development Agent

---

## 📋 Overview

This document outlines the implementation plan for deep linking, YouTube enhancement, and social sharing features for the Daily Amar Desh mobile app.

---

## 🎯 Feature A: Deep Linking

### Current State
- ❌ No URL parameter parsing
- ❌ No PWA manifest
- ❌ No service worker
- ❌ Share URLs generated but not handled

### Implementation Plan

#### 1. URL Parameter Handler Service
**File:** `src/services/deepLinkService.ts`

```typescript
// Parse URL parameters on app load
// Route to correct article/category based on params
// Handle invalid deep links gracefully
```

**Features:**
- Parse `?article=<id>` → Navigate to article detail
- Parse `?category=<name>` → Navigate to category page
- Parse `?tab=<tabName>` → Navigate to specific tab
- Fallback to home page if params invalid

#### 2. PWA Manifest
**File:** `public/manifest.json`

```json
{
  "name": "আমার দেশ",
  "short_name": "আমার দেশ",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#006B3F",
  "icons": [...]
}
```

#### 3. App.tsx Integration
- Add `useEffect` to parse URL params on mount
- Add state for deep link handling
- Route to appropriate screen based on params

#### 4. Feature Flag
- `enableDeepLinking: boolean` in useAppStore

**Files to Create/Modify:**
- ✅ NEW: `src/services/deepLinkService.ts`
- ✅ NEW: `public/manifest.json`
- ✅ MODIFY: `src/App.tsx` (add URL parsing)
- ✅ MODIFY: `src/store/useAppStore.ts` (add feature flag)
- ✅ MODIFY: `index.html` (link manifest)

**Estimated Effort:** 2-3 hours

---

## 🎥 Feature B: YouTube Enhancement

### Current State
- ⚠️ Basic iframe embeds in VideoFeed
- ❌ No reusable component
- ❌ No YouTube IFrame API
- ❌ No error handling

### Implementation Plan

#### 1. Reusable YouTubePlayer Component
**File:** `src/components/media/YouTubePlayer.tsx`

```typescript
interface YouTubePlayerProps {
  videoId: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  onReady?: () => void;
  onStateChange?: (state: string) => void;
  onError?: (error: string) => void;
}
```

**Features:**
- Accept videoId as prop
- Configurable autoplay, mute, controls
- Loading state while video loads
- Error handling for invalid videos
- Callback hooks for state changes

#### 2. YouTube IFrame API Integration
- Load YouTube IFrame API script dynamically
- Create player instance with API
- Add event listeners (onReady, onStateChange, onError)
- Programmatic controls (play, pause, seek, mute)

#### 3. Refactor VideoFeed
- Replace inline iframe with `<YouTubePlayer>` component
- Pass videoId from data
- Handle loading and error states

#### 4. Feature Flag
- `enableYouTubePlayer: boolean` in useAppStore

**Files to Create/Modify:**
- ✅ NEW: `src/components/media/YouTubePlayer.tsx`
- ✅ MODIFY: `src/components/media/VideoFeed.tsx` (use new component)
- ✅ MODIFY: `src/store/useAppStore.ts` (add feature flag)

**Estimated Effort:** 2-3 hours

---

## 📤 Feature C: Social Sharing Enhancement

### Current State
- ⚠️ Basic Web Share API in GiftArticle
- ❌ No platform-specific sharing
- ❌ No share sheet UI
- ❌ No image generation

### Implementation Plan

#### 1. Share Sheet Component
**File:** `src/components/social/ShareSheet.tsx`

```typescript
interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article;
}
```

**Features:**
- Bottom sheet UI (mobile-friendly)
- Platform icons (Facebook, Instagram, WhatsApp, Twitter, etc.)
- Share options:
  - Copy link
  - Share to...
  - Instagram Stories (image generation)
  - Facebook Feed
  - WhatsApp
  - Twitter/X
  - Email

#### 2. Share Image Generator
**File:** `src/services/shareImageService.ts`

```typescript
// Generate shareable image for Instagram Stories
// Use HTML Canvas to create image with:
// - Article title
// - Category badge
// - Logo/branding
// - Gradient background
```

**Features:**
- Canvas-based image generation
- Bengali text rendering
- Article metadata overlay
- Download/share generated image

#### 3. Platform-Specific Share Handlers
**File:** `src/services/socialShareService.ts`

```typescript
// Instagram Stories: Generate image + share
// Facebook: Use FB.ui() if SDK available, else Web Share
// WhatsApp: wa.me link with text
// Twitter: twitter.com/intent/tweet
// Email: mailto: link
```

**Features:**
- Instagram: Generate image → Open Instagram app (if mobile)
- Facebook: Web Share API or direct link
- WhatsApp: `https://wa.me/?text=<encoded>`
- Twitter: `https://twitter.com/intent/tweet?text=<encoded>`
- Email: `mailto:?subject=<subject>&body=<body>`

#### 4. Refactor GiftArticle
- Replace single button with share sheet trigger
- Show share sheet on tap
- Handle platform-specific sharing

#### 5. Feature Flags
- `enableSocialSharing: boolean` (master)
- `enableStorySharing: boolean` (Instagram/FB stories)

**Files to Create/Modify:**
- ✅ NEW: `src/components/social/ShareSheet.tsx`
- ✅ NEW: `src/services/shareImageService.ts`
- ✅ NEW: `src/services/socialShareService.ts`
- ✅ MODIFY: `src/components/commercial/GiftArticle.tsx` (use share sheet)
- ✅ MODIFY: `src/store/useAppStore.ts` (add feature flags)

**Estimated Effort:** 4-5 hours

---

## 🚩 Feature Flags Summary

```typescript
// Add to useAppStore
features: {
  // ... existing flags
  
  // Social & Multimedia
  enableDeepLinking: boolean;      // Feature A
  enableYouTubePlayer: boolean;    // Feature B
  enableSocialSharing: boolean;    // Feature C (master)
  enableStorySharing: boolean;     // Feature C (stories)
}
```

---

## 📁 File Structure (New)

```
src/
├── services/
│   ├── deepLinkService.ts        # NEW: URL parameter handling
│   ├── shareImageService.ts      # NEW: Canvas image generation
│   └── socialShareService.ts     # NEW: Platform-specific sharing
├── components/
│   ├── media/
│   │   └── YouTubePlayer.tsx     # NEW: Reusable YouTube component
│   └── social/
│       └── ShareSheet.tsx        # NEW: Share sheet UI
public/
└── manifest.json                  # NEW: PWA manifest
```

---

## 🔄 Implementation Order

1. **Deep Linking** (2-3 hours)
   - Create deepLinkService.ts
   - Add URL parsing to App.tsx
   - Create manifest.json
   - Add feature flag
   - Test with share URLs

2. **YouTube Enhancement** (2-3 hours)
   - Create YouTubePlayer.tsx
   - Add IFrame API integration
   - Refactor VideoFeed.tsx
   - Add feature flag
   - Test video playback

3. **Social Sharing** (4-5 hours)
   - Create ShareSheet.tsx
   - Create shareImageService.ts
   - Create socialShareService.ts
   - Refactor GiftArticle.tsx
   - Add feature flags
   - Test all platforms

**Total Estimated Effort:** 8-11 hours

---

## ✅ Acceptance Criteria

### Deep Linking
- [ ] Share URL opens correct article
- [ ] Category URL opens correct category
- [ ] Invalid URL shows home page
- [ ] PWA manifest loads correctly
- [ ] Feature flag disables deep linking

### YouTube Enhancement
- [ ] YouTubePlayer component works standalone
- [ ] VideoFeed uses new component
- [ ] Loading state shows while video loads
- [ ] Error state shows for invalid videos
- [ ] Feature flag disables YouTube player

### Social Sharing
- [ ] Share sheet opens on tap
- [ ] All platform buttons work
- [ ] Instagram story image generates correctly
- [ ] Copy link works
- [ ] Feature flags disable sharing features

---

## 🐛 Known Limitations

### Deep Linking
- Web-only (no native app link configuration)
- Requires PWA install for full experience
- Limited to URL parameters (no path-based routing)

### YouTube Enhancement
- Still uses iframe (not native player)
- Requires internet connection
- Subject to YouTube's terms of service

### Social Sharing
- Instagram/Facebook require manual posting (no direct API)
- Story sharing generates image but user must manually upload
- Web Share API not supported on all browsers
- No analytics tracking (future enhancement)

---

## 📊 Success Metrics

| Feature | Metric | Target |
|---------|--------|--------|
| Deep Linking | % of shared links that open correctly | > 95% |
| YouTube | Video playback success rate | > 98% |
| Social Sharing | % of users who share articles | > 10% |
| Social Sharing | Most used platform | Track top 3 |

---

## 🔄 Rollback Plan

Each feature has independent feature flag:
- `enableDeepLinking: false` → Disables URL parsing
- `enableYouTubePlayer: false` → Falls back to old iframe
- `enableSocialSharing: false` → Falls back to basic Web Share API

---

## 📝 Notes

### Deep Linking
- Web app can only handle URL parameters, not native app links
- For true native app links, would need React Native or native wrapper
- PWA manifest enables "Add to Home Screen" for app-like experience

### YouTube Enhancement
- YouTube IFrame API is free but requires API key for advanced features
- Basic embed works without API key
- Consider react-youtube library for easier integration (future)

### Social Sharing
- True Instagram/Facebook integration requires:
  - Facebook Developer account
  - App review process
  - OAuth implementation
  - Backend for token management
- Web-based workaround is simpler and works immediately
- Consider native app for full social integration (future)

---

**Status:** 🟢 **READY FOR IMPLEMENTATION**
