# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Phase 7: Advanced Analytics (Reading patterns, A/B testing)
- Phase 8: AI Enhancements (AI summaries, ML recommendations)
- Phase 9: Social Features (Share activity, Reading groups)
- Phase 10: Monetization (Premium subscriptions, Ads)

## [2.0.0] - 2026-09-20

### Added
- **Phase 6: Authentication & Cloud Sync**
  - Firebase authentication (email/password, Google, Apple Sign-In)
  - Cloud sync service with Firestore
  - Bidirectional sync (local ↔ cloud)
  - Anonymous to authenticated user migration
  - Sync status component with real-time updates
  - Login/signup screen with Bengali UI
  - Profile screen integration with auth
  - Conflict resolution (last write wins)
  - Incremental sync (only changed data)
  - Offline support (queue changes when offline)

### Changed
- Updated root layout to initialize Firebase auth
- Added auth route to navigation stack
- Enhanced profile screen with sync status and logout

### Security
- Added Firebase security rules
- Encrypted data transmission (HTTPS)
- User-only data access in Firestore

## [1.5.0] - 2026-09-20

### Added
- **Phase 5: Advanced Features**
  - "For You" dedicated tab with personalized feed
  - Reading streak UI with gamification
  - Interest management screen with visual scores
  - Data export functionality (JSON/CSV)
  - Privacy settings enhancements

### Changed
- Updated tab navigation to include "For You" tab
- Enhanced home screen with reading streak component
- Improved privacy screen with interest display

## [1.4.0] - 2026-09-20

### Added
- **Phase 4: Polish & Testing**
  - 22 unit tests across all modules
  - 12 integration tests for end-to-end flows
  - 7 performance benchmarks
  - Privacy audit (A+ rating, 70/70)
  - Jest configuration and test setup
  - Performance test suite

### Changed
- Improved error handling across all modules
- Enhanced logging for debugging
- Optimized database queries

### Testing
- Achieved >70% test coverage
- All performance benchmarks met
- Privacy audit passed with A+ rating

## [1.3.0] - 2026-09-20

### Added
- **Phase 3: Integration**
  - Article detail tracking (8 event types)
  - Search behavior tracking
  - Home screen personalization
  - Privacy settings UI
  - Event tracking integration in all screens

### Changed
- Integrated user tracking into article detail screen
- Added search tracking to search screen
- Implemented personalized feed on home screen
- Created privacy settings screen with full controls

## [1.2.0] - 2026-09-20

### Added
- **Phase 2: Core Features**
  - Affinity scoring algorithm with recency decay
  - Personalization engine with content ranking
  - "For You" feed generation
  - Recommendation system
  - Multi-entity tracking (topics, authors, sections)

### Changed
- Implemented engagement-weighted scoring
- Added 7-day half-life recency decay
- Created content ranking algorithm with diversity injection

## [1.1.0] - 2026-09-20

### Added
- **Phase 1: Foundation**
  - Anonymous UUID generation with secure storage
  - SQLite database schema (4 tables)
  - Event tracking system with batch processing
  - Basic storage layer
  - User store with Zustand

### Changed
- Set up project structure
- Configured TypeScript and dependencies
- Created core modules for user profile system

## [1.0.0] - 2026-09-20

### Added
- Initial release of Daily Amar Desh mobile app
- Bengali news reader with RSS feed integration
- Article browsing and search
- Bookmark functionality
- Text-to-speech support
- Dark mode support
- Category filtering
- Deep linking support
- Social sharing (WhatsApp, Facebook, Twitter, Telegram, Email)
- YouTube video player integration
- Push notifications
- Offline reading support
- PWA manifest

### Features
- Complete Bengali localization
- Responsive design for mobile devices
- Privacy-first architecture
- Offline-first capabilities
- RSS feed parsing
- Image optimization with expo-image
- Theme system with light/dark modes

---

## Version History

### Versioning Strategy

We use [Semantic Versioning](https://semver.org/):

- **MAJOR** version: Incompatible API changes
- **MINOR** version: New functionality (backwards compatible)
- **PATCH** version: Bug fixes (backwards compatible)

### Release Schedule

- **Major releases**: Quarterly
- **Minor releases**: Monthly
- **Patch releases**: As needed for bug fixes

---

## Migration Guides

### 1.x to 2.0

**Breaking Changes:**
- Firebase configuration required for cloud sync
- Environment variables added for Firebase

**Migration Steps:**
1. Create Firebase project
2. Add environment variables to `.env`
3. Run `npm install` to update dependencies
4. Test authentication flow
5. Verify cloud sync functionality

**Note:** The app works fully without authentication. Cloud sync is optional.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## Acknowledgments

- Expo team for the amazing framework
- Firebase for authentication and cloud services
- React Native community
- Daily Amar Desh for news content

---

**Last Updated:** September 20, 2026
