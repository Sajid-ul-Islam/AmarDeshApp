# App Review & Scope Report
**Date:** 2026-09-20  
**App:** Daily Amar Desh (আমার দেশ) - Bengali News App  
**Version:** 1.3.0  
**Reviewer:** AI Development Agent

---

## 1. Executive Summary

**What is this app?**  
Daily Amar Desh is a Bengali-language news mobile application built with Expo/React Native that aggregates content from dailyamardesh.com via RSS feed. It provides article browsing, search, bookmarks, text-to-speech, sharing, and push notifications with a focus on Bengali localization and cultural relevance.

**Current Maturity Level:** **MVP (Minimum Viable Product)**  
The app has core functionality working but lacks production-ready features like authentication, analytics, comprehensive testing, and backend integration.

**Top 3 Strengths:**
1. ✅ **Solid Native Foundation** - Expo Router, theme system, feature flags, and optimized images are properly implemented
2. ✅ **Bengali Localization** - Complete Bengali UI with proper numerals, dates, and cultural context
3. ✅ **Modern Architecture** - Clean separation of concerns with services, stores, and theme tokens

**Top 3 Risks/Gaps:**
1. ❌ **Zero Test Coverage** - No unit tests, integration tests, or E2E tests exist
2. ❌ **No Backend Integration** - RSS-only data source with no API, authentication, or user accounts
3. ❌ **Documentation Mismatch** - AGENTS.md and architecture.md still reference the legacy web app structure

---

## 2. Tech Stack Inventory

### Core Framework
- **Expo SDK:** ~50.0.0
- **React Native:** 0.73.0
- **React:** 18.2.0
- **TypeScript:** ^5.1.3

### Navigation
- **Library:** expo-router ~3.4.0 (file-based routing)
- **Structure:** Tab navigation + Stack navigation
- **Deep Linking:** Configured for `amardesh://` scheme and `dailyamardesh.com` universal links

### State Management
- **Primary:** Zustand ^4.4.7
- **Stores:** 
  - `useAppStore` - Feature flags (native app)
  - Multiple stores in `/src/store` (web app, not used in native)

### Data Fetching
- **Method:** Native `fetch` API
- **RSS Parser:** Custom XML parser in `services/rssService.ts`
- **No React Query, tRPC, or advanced caching**

### UI/Styling
- **Approach:** Custom theme system with tokens
- **Implementation:** `theme/` directory with ThemeProvider and useThemedStyles hook
- **Icons:** @expo/vector-icons ^14.0.0
- **No NativeWind, Tamagui, or UI library**

### Storage
- **Primary:** @react-native-async-storage/async-storage 1.21.0
- **Usage:** Bookmarks, reading history, feature flags, notification preferences
- **No expo-sqlite or MMKV**

### Authentication
- **Status:** ❌ **NOT IMPLEMENTED**
- No user accounts, login, or session management

### Testing
- **Status:** ❌ **NOT IMPLEMENTED**
- No Jest, Vitest, Detox, or Maestro
- Zero test files in entire codebase

### Analytics/Crash Reporting
- **Status:** ❌ **NOT IMPLEMENTED**
- No Sentry, Firebase Analytics, or Amplitude
- Environment variables reference analytics keys but no integration

### Additional Libraries
- **Image Optimization:** expo-image ~1.10.0
- **Video:** react-native-youtube-iframe ^2.3.0
- **TTS:** expo-speech ~11.7.0
- **Notifications:** expo-notifications ~0.27.0
- **Sharing:** expo-sharing ~11.10.0
- **Clipboard:** expo-clipboard ~5.0.0
- **Haptics:** expo-haptics ~12.8.0 (installed, not used)
- **WebView:** react-native-webview 13.6.4
- **Gestures:** react-native-gesture-handler ~2.14.0
- **Animations:** react-native-reanimated ~3.6.0

---

## 3. Feature Capability Matrix

### A. Content Consumption

| Feature | Status | Location | Notes |
|---------|--------|----------|-------|
| Article reading | ✅ Complete | `app/article/[id].tsx` | Full article view with metadata |
| Feed browsing | ✅ Complete | `app/(tabs)/index.tsx` | Home screen with hero + list |
| Section navigation | ⚠️ Partial | `app/(tabs)/index.tsx` | Category tabs exist but not fully functional |
| Search | ✅ Complete | `app/(tabs)/search.tsx` | Real-time filtering |
| RSS feed integration | ✅ Complete | `services/rssService.ts` | Fetches from dailyamardesh.com |
| Category filtering | ⚠️ Partial | `app/(tabs)/index.tsx` | UI exists but filtering logic incomplete |
| Article metadata | ✅ Complete | `app/article/[id].tsx` | Author, date, category display |
| Breaking news badge | ✅ Complete | `app/(tabs)/index.tsx` | Visual indicator for breaking news |

### B. Personalization

| Feature | Status | Location | Notes |
|---------|--------|----------|-------|
| Bookmarks | ✅ Complete | `app/(tabs)/bookmarks.tsx` | Save/unsave articles |
| Reading history | ✅ Complete | `services/storage.ts` | Tracks last 50 articles |
| Topic following | ❌ Missing | - | Documented in /src but not in native app |
| Custom feed | ❌ Missing | - | "For You" tab exists in /src only |
| District/area filter | ❌ Missing | - | Documented but not implemented |
| Reading preferences | ⚠️ Partial | `store/useAppStore.ts` | Feature flags only, no user prefs |

### C. Multimodal

| Feature | Status | Location | Notes |
|---------|--------|----------|-------|
| Text-to-speech | ✅ Complete | `services/ttsService.ts`, `app/article/[id].tsx` | Bengali TTS with play/pause |
| YouTube playback | ✅ Complete | `components/YouTubePlayer.tsx` | Embedded YouTube player |
| Audio articles | ❌ Missing | - | TTS exists but no dedicated audio mode |
| Video feed | ❌ Missing | - | Documented in /src but not in native app |
| Podcast support | ❌ Missing | - | Not implemented |
| Background audio | ❌ Missing | - | TTS stops when app backgrounded |

### D. Social & Sharing

| Feature | Status | Location | Notes |
|---------|--------|----------|-------|
| Share sheet | ✅ Complete | `app/article/[id].tsx` | Custom bottom sheet UI |
| WhatsApp share | ✅ Complete | `services/sharingService.ts` | Direct share |
| Facebook share | ✅ Complete | `services/sharingService.ts` | Direct share |
| Twitter share | ✅ Complete | `services/sharingService.ts` | Direct share |
| Telegram share | ✅ Complete | `services/sharingService.ts` | Direct share |
| Email share | ✅ Complete | `services/sharingService.ts` | Mailto link |
| Copy link | ✅ Complete | `services/sharingService.ts` | Clipboard copy |
| Deep links | ⚠️ Partial | `services/deepLinkService.ts` | Configured but handler incomplete |
| Social embed | ❌ Missing | - | Not implemented |
| Comments | ❌ Missing | - | Documented in /src but not in native app |
| Reactions | ❌ Missing | - | Documented in /src but not in native app |

### E. Engagement

| Feature | Status | Location | Notes |
|---------|--------|----------|-------|
| Push notifications | ✅ Complete | `services/notificationService.ts` | Full implementation |
| Breaking news alerts | ✅ Complete | `services/notificationService.ts` | High priority channel |
| Daily briefing | ✅ Complete | `services/notificationService.ts` | 8 AM scheduled notification |
| Category updates | ✅ Complete | `services/notificationService.ts` | Low priority channel |
| Notification preferences | ✅ Complete | `app/settings/notifications.tsx` | Full settings UI |
| Quiet hours | ✅ Complete | `services/notificationService.ts` | Configurable time range |
| Reading streaks | ❌ Missing | - | Documented in /src but not in native app |
| Gamification | ❌ Missing | - | Not implemented |

### F. Utility

| Feature | Status | Location | Notes |
|---------|--------|----------|-------|
| Offline reading | ⚠️ Partial | `services/storage.ts` | Bookmarks persist, no full offline mode |
| Dark mode | ✅ Complete | `theme/` | System-based + manual toggle |
| Font size control | ❌ Missing | - | Documented in /src but not in native app |
| Continue reading | ❌ Missing | - | Documented in /src but not in native app |
| Smart summary | ❌ Missing | - | AI summary documented but not implemented |
| Pull to refresh | ✅ Complete | `app/(tabs)/index.tsx` | Home screen refresh |

### G. Commercial

| Feature | Status | Location | Notes |
|---------|--------|----------|-------|
| Paywall | ❌ Missing | - | Not implemented |
| Subscription | ❌ Missing | - | Not implemented |
| Ads | ❌ Missing | - | Not implemented |
| Gift article | ❌ Missing | - | Documented in /src but not in native app |
| Interactive polls | ❌ Missing | - | Documented in /src but not in native app |

### H. Platform Integration

| Feature | Status | Location | Notes |
|---------|--------|----------|-------|
| Deep linking | ⚠️ Partial | `app.json`, `services/deepLinkService.ts` | Configured but handler needs work |
| Universal links (iOS) | ✅ Complete | `app.json` | Associated domains configured |
| App links (Android) | ✅ Complete | `app.json` | Intent filters configured |
| Widgets | ❌ Missing | - | Not implemented |
| Live Activities | ❌ Missing | - | Not implemented |
| Share extensions | ❌ Missing | - | Not implemented |

### I. Developer Experience

| Feature | Status | Location | Notes |
|---------|--------|----------|-------|
| OTA updates | ⚠️ Partial | `app.json`, `eas.json` | Configured but not tested |
| EAS Build | ✅ Complete | `eas.json` | 3 profiles: dev, preview, production |
| EAS Submit | ⚠️ Partial | `eas.json` | Configured with placeholder values |
| Feature flags | ✅ Complete | `store/useAppStore.ts` | 6 flags with persistence |
| Error tracking | ❌ Missing | - | No Sentry or similar |
| Testing | ❌ Missing | - | Zero test coverage |
| CI/CD | ❌ Missing | - | No GitHub Actions or similar |
| Linting | ❌ Missing | - | No ESLint configured |
| Type checking | ⚠️ Partial | `tsconfig.json` | Config exists but not enforced in scripts |

---

## 4. What the App Can Do Today (User-Facing)

**A user can open the app and:**
- Browse the latest news from dailyamardesh.com in Bengali
- View articles with images, metadata, and full content
- Search for articles by keyword
- Save articles to bookmarks for later reading
- Listen to articles read aloud in Bengali (text-to-speech)
- Share articles to WhatsApp, Facebook, Twitter, Telegram, or email
- Copy article links to clipboard
- Watch embedded YouTube videos
- Receive push notifications for breaking news and daily briefings
- Configure notification preferences (breaking news, daily briefing, category updates, quiet hours)
- Switch between light and dark mode
- Pull to refresh the news feed

**The app currently does NOT support:**
- User accounts or authentication
- Personalized feeds based on reading history
- Following specific topics or authors
- Reading articles offline (only bookmarks persist)
- Adjusting font size
- Resuming reading position
- AI-generated article summaries
- Comments or social interactions
- Reading streaks or gamification
- In-app purchases or subscriptions
- Advertising
- Home screen widgets
- Live activities
- Sharing to Instagram Stories
- Viewing video-only content
- Podcast playback

---

## 5. What the App Cannot Do (Gaps)

### Critical Gaps

#### 1. User Authentication & Accounts
- **What's missing:** No login, registration, or user profiles
- **Why it matters:** Cannot sync data across devices, no personalization, no subscription model
- **Estimated effort:** L (2-3 weeks)
- **Dependencies:** Backend API, database, authentication provider (Firebase Auth, Auth0, etc.)

#### 2. Backend API Integration
- **What's missing:** No REST/GraphQL API, only RSS feed
- **Why it matters:** Limited to RSS content, no user data persistence, no advanced features
- **Estimated effort:** L (3-4 weeks for backend + integration)
- **Dependencies:** Backend infrastructure, database, API design

#### 3. Test Coverage
- **What's missing:** Zero tests (unit, integration, E2E)
- **Why it matters:** High risk of regressions, no quality assurance, difficult to maintain
- **Estimated effort:** M (1-2 weeks to add basic coverage)
- **Dependencies:** Testing framework setup (Jest, Detox)

#### 4. Analytics & Crash Reporting
- **What's missing:** No error tracking or user analytics
- **Why it matters:** Cannot track issues, no user behavior insights, poor debugging
- **Estimated effort:** S (2-3 days)
- **Dependencies:** Sentry, Firebase Analytics, or similar service

### High-Impact Gaps

#### 5. Offline Reading Mode
- **What's missing:** Cannot read articles without internet
- **Why it matters:** Poor UX in low-connectivity areas, limits usability
- **Estimated effort:** M (1 week)
- **Dependencies:** Local database (expo-sqlite), sync logic

#### 6. Personalized Feed
- **What's missing:** No "For You" tab or interest-based recommendations
- **Why it matters:** Lower engagement, generic experience
- **Estimated effort:** M (1-2 weeks)
- **Dependencies:** User accounts, reading history analysis

#### 7. Social Features
- **What's missing:** No comments, reactions, or community features
- **Why it matters:** Lower engagement, no user-generated content
- **Estimated effort:** L (2-3 weeks)
- **Dependencies:** Backend API, moderation system

#### 8. Advanced Search
- **What's missing:** Basic keyword search only, no filters, no AI search
- **Why it matters:** Hard to find specific content, poor discoverability
- **Estimated effort:** M (1 week)
- **Dependencies:** Search backend (Elasticsearch, Algolia)

### Medium-Priority Gaps

#### 9. Font Size Control
- **What's missing:** Cannot adjust text size
- **Why it matters:** Accessibility issue for users with vision impairments
- **Estimated effort:** S (2-3 days)
- **Dependencies:** None

#### 10. Continue Reading
- **What's missing:** Cannot resume where left off
- **Why it matters:** Poor UX for long articles
- **Estimated effort:** S (1-2 days)
- **Dependencies:** None

#### 11. AI Summaries
- **What's missing:** No AI-generated article summaries
- **Why it matters:** Time-saving feature, competitive differentiator
- **Estimated effort:** M (1 week)
- **Dependencies:** AI service integration (OpenAI, etc.)

#### 12. Home Screen Widgets
- **What's missing:** No iOS/Android widgets
- **Why it matters:** Reduced visibility, lower engagement
- **Estimated effort:** M (1 week)
- **Dependencies:** Native widget development

---

## 6. Architecture Observations

### Strengths
✅ **Clean separation of concerns** - Services, stores, components, and theme are well-organized  
✅ **Feature flag system** - Allows safe rollout of new features  
✅ **Theme system** - Consistent design tokens with light/dark mode support  
✅ **TypeScript** - Type safety throughout the codebase  
✅ **Expo Router** - Modern file-based routing with deep linking  

### Issues & Concerns

#### 1. Dual Codebase Confusion
**Issue:** Two separate codebases exist:
- `/app` - Native Expo app (active)
- `/src` - Legacy web app (not used)

**Impact:** 
- Documentation references `/src` structure
- Confusing for new developers
- Wasted disk space
- Potential for divergent implementations

**Recommendation:** Archive or remove `/src` directory, update all documentation

#### 2. Documentation Mismatch
**Issue:** `AGENTS.md` and `architecture.md` still reference the web app structure

**Evidence:**
- `AGENTS.md` line 52-74: References `src/` directory structure
- `architecture.md` line 36-46: Lists web technologies (Vite, Tailwind, Axios)

**Impact:** Misleading for developers, outdated information

**Recommendation:** Update documentation to reflect native app structure

#### 3. Inconsistent State Management
**Issue:** Multiple store patterns exist
- Native app: `store/useAppStore.ts` (Zustand)
- Web app: `src/store/` (multiple Zustand stores)

**Impact:** Confusion about which store to use, potential for bugs

**Recommendation:** Consolidate to single store pattern, remove web app stores

#### 4. No Error Boundaries
**Issue:** No React error boundaries in the app

**Impact:** App crashes will show red screen instead of graceful error UI

**Recommendation:** Add error boundaries at screen and component levels

#### 5. Hardcoded Values
**Issue:** Several hardcoded values that should be configurable

**Evidence:**
- `eas.json` line 54-57: Placeholder Apple ID and team ID
- `app.json` line 94: `"projectId": "your-project-id"`
- `services/notificationService.ts` line 113: Hardcoded project ID

**Impact:** Cannot deploy without manual configuration, risk of errors

**Recommendation:** Use environment variables, add setup documentation

#### 6. Unused Dependencies
**Issue:** Several dependencies installed but not used in native app

**Evidence:**
- `react-native-webview` - Not imported anywhere in `/app`
- `@react-navigation/*` - Using expo-router instead
- `date-fns` - Not used (custom date formatting in utils)

**Impact:** Larger bundle size, confusion about what's actually used

**Recommendation:** Audit and remove unused dependencies

#### 7. No API Layer Abstraction
**Issue:** Direct `fetch` calls in services, no API client abstraction

**Impact:** Hard to switch APIs, no centralized error handling, no request/response interceptors

**Recommendation:** Create API client with interceptors, error handling, and retry logic

#### 8. Security Concerns
**Issue:** No security audit or best practices visible

**Evidence:**
- No input sanitization in RSS parser
- No CSP or security headers
- Environment variables in `.env` files (should use EAS Secrets)

**Impact:** Potential security vulnerabilities

**Recommendation:** Security audit, add input validation, use EAS Secrets for sensitive data

---

## 7. Performance Snapshot

### Bundle Size Concerns

**Large Dependencies:**
- `react-native-youtube-iframe` - Adds significant size for YouTube playback
- `react-native-webview` - Large dependency, unclear if used
- `@react-navigation/*` - Redundant with expo-router

**Recommendation:** 
- Remove unused dependencies
- Enable bundle size monitoring
- Consider code splitting for large features

### Image Handling

**Current State:** ✅ **Good**
- Using `expo-image` with optimization
- `OptimizedImage` wrapper with feature flag
- Proper content fit and caching

**Issues:**
- No responsive image sizes (all images same size)
- No blurhash placeholders
- No image prefetching

**Recommendation:**
- Add responsive image sizes based on screen density
- Implement blurhash for better loading UX
- Add image prefetching for next articles

### List Rendering

**Current State:** ⚠️ **Adequate**
- Using `FlatList` for article lists
- `recyclingKey` prop used in `OptimizedImage`

**Issues:**
- Not using `FlashList` (better performance for large lists)
- No virtualization for very long lists
- No infinite scroll pagination

**Recommendation:**
- Migrate to `FlashList` for better performance
- Implement infinite scroll with pagination
- Add loading skeletons

### Navigation Performance

**Current State:** ✅ **Good**
- Using expo-router with file-based routing
- Stack navigation for article detail
- Tab navigation for main screens

**Issues:**
- No lazy loading of screens
- No preloading of next screens
- No transition animations configured

**Recommendation:**
- Add screen preloading for faster navigation
- Configure custom transitions
- Implement lazy loading for heavy screens

### Startup Time

**Current State:** ⚠️ **Concerns**
- Root layout loads feature flags and initializes notifications
- No code splitting visible
- Multiple services initialized on startup

**Issues:**
- Notification initialization may be slow
- No deferred loading of non-critical features
- No splash screen optimization

**Recommendation:**
- Defer non-critical initialization
- Add proper splash screen
- Implement code splitting
- Profile startup time and optimize

---

## 8. Scope Definition

### In Scope (Current)
What the app is designed to do today:

✅ **Content Consumption**
- Browse news feed from RSS
- Read full articles
- Search articles
- View article metadata

✅ **Personalization**
- Bookmark articles
- Reading history tracking

✅ **Multimodal**
- Text-to-speech playback
- YouTube video playback

✅ **Social & Sharing**
- Share to 6 platforms
- Copy links
- Deep linking (basic)

✅ **Engagement**
- Push notifications
- Notification preferences
- Daily briefings

✅ **Utility**
- Dark mode
- Pull to refresh
- Feature flags

✅ **Platform**
- iOS and Android support
- Deep linking configuration
- EAS Build configuration

### Adjacent Scope (Reachable)
What could be added in 1-2 quarters with current architecture:

🔶 **Enhanced Personalization**
- Topic following (extend existing preference system)
- Custom feed algorithm (use reading history)
- District/area filtering (extend location service)

🔶 **Advanced Multimodal**
- Background audio playback (extend TTS service)
- Audio article mode (dedicated audio UI)
- Podcast support (extend audio service)

🔶 **Social Features**
- Comments system (add backend + UI)
- Reactions (extend existing service)
- Share to Instagram Stories (extend sharing service)

🔶 **Utility Enhancements**
- Font size control (add preference + UI)
- Continue reading (track scroll position)
- Offline reading mode (add local storage)

🔶 **Platform Integration**
- Home screen widgets (native development)
- Live Activities (iOS-specific)
- Share extensions (native development)

🔶 **Developer Experience**
- Add test coverage (Jest + Detox)
- Add error tracking (Sentry)
- Add analytics (Firebase)
- Complete EAS Submit configuration

### Out of Scope (Requires Rewrite or New App)
What would require fundamental changes:

❌ **User Authentication System**
- Requires backend infrastructure
- Needs database design
- Requires security audit
- **Effort:** 3-4 weeks + backend

❌ **Backend API**
- Requires full backend development
- Database design and migration
- API versioning strategy
- **Effort:** 4-6 weeks

❌ **Real-time Features**
- WebSocket infrastructure
- Real-time collaboration
- Live updates
- **Effort:** 3-4 weeks + backend

❌ **Monetization System**
- Payment integration
- Subscription management
- Receipt validation
- **Effort:** 4-6 weeks + backend + legal

❌ **Advanced AI Features**
- Custom ML models
- Personalized recommendations
- Content generation
- **Effort:** 6-8 weeks + ML infrastructure

❌ **Multi-language Support**
- i18n infrastructure
- Translation management
- RTL support
- **Effort:** 3-4 weeks

---

## 9. Recommended Roadmap (Next 3 Phases)

### Phase 1: Polish & Fix (Now, 1-2 weeks)
**Goal:** Fix critical issues and prepare for beta testing

#### High Priority
1. **Remove legacy `/src` directory** (S, 1 day)
   - Archive or delete web app code
   - Update all documentation references
   - Clean up package.json

2. **Add error boundaries** (S, 1 day)
   - Add at screen level
   - Add at component level for critical components
   - Graceful error UI

3. **Fix hardcoded values** (S, 1 day)
   - Move to environment variables
   - Use EAS Secrets for sensitive data
   - Document setup process

4. **Remove unused dependencies** (S, 1 day)
   - Audit package.json
   - Remove react-native-webview if not used
   - Remove @react-navigation if not used
   - Remove date-fns if not used

5. **Add basic test coverage** (M, 3-5 days)
   - Set up Jest
   - Add unit tests for services
   - Add unit tests for stores
   - Target 50% coverage

#### Medium Priority
6. **Add error tracking** (S, 1 day)
   - Integrate Sentry
   - Add error boundaries
   - Configure source maps

7. **Optimize startup time** (M, 2-3 days)
   - Defer notification initialization
   - Add proper splash screen
   - Profile and optimize

8. **Add analytics** (S, 1-2 days)
   - Integrate Firebase Analytics
   - Track key events
   - Set up crash reporting

**Success Metrics:**
- ✅ Zero critical bugs
- ✅ 50% test coverage
- ✅ Error tracking active
- ✅ Analytics active
- ✅ Documentation updated

---

### Phase 2: Feature Expansion (Next, 1-2 months)
**Goal:** Add high-value features that improve user engagement

#### Priority 1: User Experience
1. **Font size control** (S, 2-3 days)
   - Add preference to settings
   - Persist in AsyncStorage
   - Apply to all text

2. **Continue reading** (S, 2-3 days)
   - Track scroll position
   - Show resume banner
   - Restore position on open

3. **Offline reading mode** (M, 1 week)
   - Add expo-sqlite
   - Cache articles locally
   - Sync when online
   - Offline indicator

#### Priority 2: Personalization
4. **Topic following** (M, 1 week)
   - Add follow/unfollow UI
   - Persist preferences
   - Filter feed by followed topics

5. **Custom "For You" feed** (M, 1-2 weeks)
   - Algorithm based on reading history
   - Followed topics weighting
   - Fresh content prioritization

6. **Advanced search** (M, 1 week)
   - Add filters (date, category, author)
   - Search highlighting
   - Recent searches

#### Priority 3: Engagement
7. **Reading streaks** (S, 3-4 days)
   - Track consecutive days
   - Show streak counter
   - Celebration animations

8. **Comments system** (L, 2-3 weeks)
   - Backend API for comments
   - Comment UI on articles
   - Moderation system
   - Like/reply functionality

9. **Reactions** (S, 3-4 days)
   - Emoji reactions on articles
   - Reaction counts
   - Persist locally

**Dependencies:**
- Offline reading → expo-sqlite integration
- Comments → Backend API required
- Custom feed → Reading history analysis

**Success Metrics:**
- ✅ 30% increase in session duration
- ✅ 20% increase in articles read per session
- ✅ 15% of users follow at least 1 topic
- ✅ 10% of users have reading streak > 7 days

---

### Phase 3: Differentiation (Later, 3-6 months)
**Goal:** Add features that set the app apart from competitors

#### Priority 1: AI Features
1. **AI article summaries** (M, 1 week)
   - Integrate OpenAI API
   - Generate 2-3 sentence summaries
   - Show at top of articles
   - BYoak model (user's API key)

2. **Smart search with AI** (M, 1-2 weeks)
   - Natural language search
   - Semantic search
   - AI-powered recommendations

3. **Personalized recommendations** (L, 2-3 weeks)
   - ML model for recommendations
   - Based on reading history
   - Collaborative filtering

#### Priority 2: Advanced Multimodal
4. **Background audio playback** (M, 1 week)
   - Extend TTS service
   - Lock screen controls
   - Audio session management

5. **Audio article mode** (M, 1 week)
   - Dedicated audio UI
   - Playlist support
   - Playback speed control

6. **Podcast support** (L, 2-3 weeks)
   - Podcast feed parsing
   - Episode browsing
   - Download for offline

#### Priority 3: Platform Integration
7. **Home screen widgets** (M, 1-2 weeks)
   - iOS widget
   - Android widget
   - Breaking news widget
   - Top stories widget

8. **Live Activities** (M, 1 week)
   - iOS Live Activities
   - Breaking news alerts
   - Live score updates

9. **Share extensions** (M, 1 week)
   - iOS share extension
   - Android share intent
   - Save to app from other apps

#### Priority 4: Community
10. **User profiles** (L, 2-3 weeks)
    - User accounts
    - Profile customization
    - Reading history visibility

11. **Social sharing enhancements** (M, 1 week)
    - Share to Instagram Stories
    - Custom share images
    - Share with quotes

12. **Community features** (L, 3-4 weeks)
    - Discussion forums
    - User-generated content
    - Expert Q&A

**Dependencies:**
- AI features → OpenAI API integration
- User profiles → Backend + authentication
- Community → Moderation system

**Success Metrics:**
- ✅ 25% of users use AI summaries
- ✅ 15% of users listen to articles
- ✅ 10% of users engage with community
- ✅ 5% increase in daily active users

---

## 10. Open Questions for the Team

### Business & Product
1. **What is the monetization strategy?**
   - Subscription model?
   - Advertising?
   - Freemium?
   - No monetization planned?

2. **Who is the target audience?**
   - Age range?
   - Geographic focus (Bangladesh only or global Bengali speakers)?
   - Tech-savviness level?

3. **What are the success metrics?**
   - DAU/MAU targets?
   - Session duration goals?
   - Retention targets?
   - Revenue goals?

4. **What is the content strategy?**
   - Only RSS from dailyamardesh.com?
   - Multiple sources planned?
   - Original content?
   - User-generated content?

### Technical
5. **Is there a backend team?**
   - Who will build the API?
   - What's the timeline?
   - What's the tech stack?

6. **What's the deployment strategy?**
   - App Store and Play Store release cadence?
   - Beta testing process?
   - Rollout strategy?

7. **What's the QA process?**
   - Manual testing?
   - Automated testing?
   - Beta testers?

8. **What's the support model?**
   - User support channel?
   - Bug reporting process?
   - Feature request process?

### Design & UX
9. **Is there a design system?**
   - Design tokens defined?
   - Component library?
   - Design handoff process?

10. **What's the accessibility requirement?**
    - WCAG compliance level?
    - Screen reader support?
    - Keyboard navigation?

11. **What languages are supported?**
    - Bengali only?
    - English support planned?
    - Other languages?

### Legal & Compliance
12. **What are the privacy requirements?**
    - GDPR compliance?
    - Data retention policy?
    - User data handling?

13. **What are the content licensing requirements?**
    - RSS feed usage rights?
    - Image licensing?
    - Third-party content?

14. **What are the regional compliance requirements?**
    - Bangladesh-specific regulations?
    - App store guidelines?
    - Content moderation?

### Analytics & Research
15. **Is there user research data?**
    - User interviews?
    - Surveys?
    - Usability testing?

16. **What analytics are currently tracked?**
    - Web analytics?
    - App analytics?
    - Business intelligence?

17. **What are the key user journeys?**
    - Primary use cases?
    - Secondary use cases?
    - Edge cases?

---

## Appendix A: File Structure Summary

### Native App (`/app`)
```
app/
├── _layout.tsx                    # Root layout with providers
├── (tabs)/
│   ├── _layout.tsx                # Tab navigation
│   ├── index.tsx                  # Home screen
│   ├── search.tsx                 # Search screen
│   ├── bookmarks.tsx              # Bookmarks screen
│   └── profile.tsx                # Profile/settings screen
├── article/
│   └── [id].tsx                   # Article detail screen
└── settings/
    └── notifications.tsx          # Notification settings

components/
├── OptimizedImage.tsx             # Image optimization wrapper
└── YouTubePlayer.tsx              # YouTube player component

services/
├── deepLinkService.ts             # Deep linking logic
├── notificationService.ts         # Push notifications
├── rssService.ts                  # RSS feed parsing
├── sharingService.ts              # Social sharing
├── storage.ts                     # AsyncStorage wrapper
└── ttsService.ts                  # Text-to-speech

store/
└── useAppStore.ts                 # Feature flags store

theme/
├── ThemeProvider.tsx              # Theme context provider
├── index.ts                       # Theme exports
├── tokens.ts                      # Design tokens
└── useThemedStyles.ts             # Themed styles hook

data/
└── mockData.ts                    # Mock article data

utils/
└── bengali.ts                     # Bengali utilities
```

### Legacy Web App (`/src`) - NOT USED
```
src/
├── App.tsx
├── components/                    # 20+ components
├── pages/                         # 5 pages
├── services/                      # 6 services
├── store/                         # 10 stores
├── hooks/
├── types/
├── data/
└── utils/
```

---

## Appendix B: Dependency Analysis

### Used in Native App
- ✅ expo (~50.0.0)
- ✅ expo-router (~3.4.0)
- ✅ expo-image (~1.10.0)
- ✅ expo-notifications (~0.27.0)
- ✅ expo-speech (~11.7.0)
- ✅ expo-sharing (~11.10.0)
- ✅ expo-linking (~6.2.0)
- ✅ expo-clipboard (~5.0.0)
- ✅ expo-constants (~15.4.0)
- ✅ expo-status-bar (~1.11.0)
- ✅ @react-native-async-storage/async-storage (1.21.0)
- ✅ zustand (^4.4.7)
- ✅ react-native-youtube-iframe (^2.3.0)
- ✅ @expo/vector-icons (^14.0.0)
- ✅ react-native-safe-area-context (4.8.2)
- ✅ react-native-screens (~3.29.0)
- ✅ react-native-gesture-handler (~2.14.0)
- ✅ react-native-reanimated (~3.6.0)

### Installed but Unused
- ⚠️ expo-av (~13.10.0) - Not imported in native app
- ⚠️ expo-haptics (~12.8.0) - Not imported in native app
- ⚠️ react-native-webview (13.6.4) - Not imported in native app
- ⚠️ @react-navigation/native (^6.1.9) - Using expo-router instead
- ⚠️ @react-navigation/bottom-tabs (^6.5.11) - Using expo-router instead
- ⚠️ @react-navigation/native-stack (^6.9.17) - Using expo-router instead
- ⚠️ date-fns (^2.30.0) - Not used (custom utils)

### Recommendation
Remove unused dependencies to reduce bundle size:
```bash
npm uninstall expo-av expo-haptics react-native-webview @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack date-fns
```

---

## Appendix C: Security Checklist

### Current State
- ❌ No input sanitization in RSS parser
- ❌ No CSP or security headers
- ❌ Environment variables in `.env` files
- ❌ No security audit
- ❌ No dependency vulnerability scanning
- ❌ No certificate pinning
- ❌ No jailbreak/root detection

### Recommendations
1. Add input validation and sanitization
2. Use EAS Secrets for sensitive data
3. Run `npm audit` regularly
4. Add certificate pinning for API calls
5. Implement jailbreak/root detection
6. Add security headers
7. Conduct security audit before production

---

**Report Complete**  
**Next Steps:** Review findings, prioritize roadmap, assign resources
