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

## Planned Modules (Group A - Core UX)

### New Stores (Planned)
| Store | Purpose |
|-------|---------|
| `useLayoutStore` | Section reorder state + persistence |
| `usePreferencesStore` | Followed categories, reading history |
| `useLocationStore` | District/area selection |

### New Components (Planned)
| Component | Purpose |
|-----------|---------|
| `SectionBlock` | Draggable wrapper for home sections |
| `EditLayoutMode` | Layout editing UI overlay |
| `CardFeed` | Swipeable card view |
| `SwipeCard` | Individual card in card mode |
| `ForYouPage` | Personalized feed page |
| `InterestPicker` | Category follow/unfollow UI |
| `DistrictPicker` | Division → district selector modal |
| `LocationBadge` | Selected area indicator |

### New Data (Planned)
| File | Purpose |
|------|---------|
| `src/data/districts.ts` | Static Bangladesh division/district data |
