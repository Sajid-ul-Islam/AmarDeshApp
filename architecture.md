# Architecture Document - Daily Amar Desh Mobile App

## System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile Application                        │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │   UI Layer   │  │  State Mgmt  │  │   Navigation      │  │
│  │  (React)     │  │  (Context/   │  │   (React Router)  │  │
│  │              │  │   Zustand)   │  │                   │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬──────────┘  │
│         │                  │                    │             │
│  ┌──────┴──────────────────┴────────────────────┴──────────┐ │
│  │                    Service Layer                         │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │ │
│  │  │ API      │ │ Cache    │ │ Push     │ │ Auth      │  │ │
│  │  │ Service  │ │ Service  │ │ Notif    │ │ Service   │  │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend / API Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  REST API    │  │  WebSocket   │  │  CDN (Images)    │  │
│  │  /graphql    │  │  (Live)      │  │  CloudFlare      │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend (Web App - Mobile Responsive)
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 18 + TypeScript | UI Components |
| Build Tool | Vite | Fast development & build |
| Styling | Tailwind CSS | Utility-first CSS |
| State Management | Zustand | Lightweight state |
| Routing | React Router v6 | Navigation |
| HTTP Client | Axios | API calls |
| Icons | Lucide React | Icon library |
| Fonts | Noto Sans Bengali | Bengali typography |

### Data Layer
| Component | Technology | Purpose |
|-----------|-----------|---------|
| API | REST API (mock) | News data |
| Cache | localStorage + IndexedDB | Offline support |
| Images | CDN URLs | Optimized delivery |

## Folder Structure
```
src/
├── components/
│   ├── common/          # Shared UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── NewsCard.tsx
│   │   ├── CategoryTabs.tsx
│   │   └── PrayerTimes.tsx
│   ├── home/            # Home page components
│   │   ├── HeroSection.tsx
│   │   ├── LatestNews.tsx
│   │   ├── MostRead.tsx
│   │   └── CategorySection.tsx
│   └── article/         # Article components
│       ├── ArticleCard.tsx
│       └── ArticleDetail.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── CategoryPage.tsx
│   ├── ArticlePage.tsx
│   ├── SearchPage.tsx
│   └── BookmarkPage.tsx
├── services/
│   ├── api.ts
│   ├── cache.ts
│   └── notification.ts
├── hooks/
│   ├── useArticles.ts
│   ├── useCategories.ts
│   └── useBookmarks.ts
├── store/
│   ├── useAppStore.ts
│   └── useBookmarkStore.ts
├── types/
│   └── index.ts
├── data/
│   └── mockData.ts
├── utils/
│   ├── dateFormat.ts
│   └── bengaliNumeral.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Data Flow
```
User Action → Component → Hook → Service → API/Cache → Store → UI Update
```

## Key Design Decisions
1. **Mobile-first web app** - Responsive design mimicking native app
2. **Mock API** - Simulated data for development (ready for real API integration)
3. **Offline-first** - Cache articles for offline reading
4. **Bengali UI** - Full Bengali language interface
5. **Performance** - Lazy loading, image optimization, code splitting
6. **BYoak AI** - Bring Your Own API Key for AI features (no server needed)
7. **Feature Flags** - All new features behind Zustand-managed flags

## Implemented Modules

### Expo SDK Modules ✅
- `expo-image` - Optimized image loading with 10x performance improvement
- `expo-router` - File-based navigation with deep linking
- `expo-status-bar` - Status bar control
- `expo-sharing` - Native share functionality
- `expo-linking` - Deep linking and URL handling
- `expo-clipboard` - Clipboard operations
- `expo-speech` - Text-to-speech for Bengali
- `expo-constants` - App constants and configuration
- `expo-notifications` - Push notifications (installed, implementation pending)
- `expo-haptics` - Haptic feedback (installed, implementation pending)
- `expo-av` - Audio/video playback (installed, implementation pending)

### Third-Party Modules ✅
- `@react-native-async-storage/async-storage` - Persistent storage
- `react-native-youtube-iframe` - YouTube video player
- `react-native-webview` - WebView support
- `react-native-gesture-handler` - Gesture handling
- `react-native-reanimated` - Animations
- `@react-navigation/*` - Navigation components
- `zustand` - State management

### Custom Components ✅
- `OptimizedImage` - Wrapper for expo-image with feature flag
- `YouTubePlayer` - YouTube video player component

### Group A - Core UX & Personalization ✅
- `useLayoutStore` - Section reorder state + persistence
- `usePreferencesStore` - Followed categories, reading history
- `useLocationStore` - District/area selection
- `SectionBlock`, `EditLayoutMode` - Drag-drop reorder
- `CardFeed`, `SwipeCard` - Swipeable card view
- `ForYouPage`, `InterestPicker` - Personalized feed
- `DistrictPicker`, `LocationBadge` - Hyper-local filtering

### Group B - Multimodal Content ✅
- `usePlayerStore` - Audio playback + queue management
- `ttsService` - Text-to-speech with Bengali voice support
- `MiniPlayer`, `ListenMode` - Audio player UI
- `ThreeMinUpdate` - News briefing card
- `VideoFeed`, `YouTubePlayer` - Video feed with YouTube integration

### Group C - Community & Engagement ✅
- `useReactionsStore` - Emoji reactions, comments, reading streaks
- `EmojiReactions` - Article reaction buttons
- `CommentsSection` - Comments with featured comments
- `ReadingStreak` - Gamified reading tracker with confetti

### Group D - Utility & Accessibility ✅
- `useOfflineStore` - Offline article downloads
- `useReadingStore` - Font size + scroll position persistence
- `FontSizeControl` - Adjustable text size
- `OfflineDownloadButton` - Download articles for offline reading
- `ContinueReading` - Auto-save scroll position
- `SmartSummary` - AI-generated article summaries

### Group E - Commercial ✅
- `useAdsStore` - Interactive polls + user votes
- `GiftArticle` - Share articles with enhanced share sheet
- `InteractivePoll` - Embedded polls with real-time results
- `CustomizableNav` - User-configurable bottom navigation

### Social & Multimedia Integration ✅
- `deepLinkService` - URL parameter parsing + deep link handling
- `socialShareService` - Platform-specific sharing (WhatsApp, Facebook, Twitter, etc.)
- `shareImageService` - Canvas-based story image generation
- `YouTubePlayer` - Reusable YouTube embed component with error handling
- `ShareSheet` - Bottom sheet UI with platform icons + story sharing
- PWA manifest for app-like experience
