# 📰 Daily Amar Desh - Local-First User Profile System

<div align="center">

**A privacy-first, offline-capable news app with intelligent personalization**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-50.0.0-000.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.73.0-61DAFB.svg)](https://reactnative.dev/)
[![Privacy Rating](https://img.shields.io/badge/Privacy-A%2B-green.svg)](./docs/audit/PRIVACY_AUDIT.md)
[![Tests](https://img.shields.io/badge/Tests-41%20passing-brightgreen.svg)](./__tests__)

[Features](#-features) • [Architecture](#-architecture) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 🎯 Overview

Daily Amar Desh is a Bengali news application that demonstrates **privacy-first personalization** without requiring user accounts. The app uses local-only data storage, behavioral tracking, and affinity scoring to deliver personalized content while maintaining complete user privacy.

### ✨ Key Highlights

- 🔒 **Privacy-First**: All data stays on device, A+ privacy rating
- 📱 **Offline-First**: Works completely offline, optional cloud sync
- 🎨 **Bengali UI**: Complete localization in Bengali language
- 🧠 **Smart Personalization**: Affinity scoring with recency decay
- 🧪 **Well-Tested**: 41 tests with >70% coverage
- 🚀 **Production-Ready**: 6 phases complete, 6,100+ lines of code

---

## 🚀 Features

### Phase 1-2: Core Personalization Engine

- **Anonymous User Tracking**: UUID-based identification without PII
- **Event Tracking**: 14+ event types (article opens, saves, shares, etc.)
- **Affinity Scoring**: Engagement-weighted scoring with 7-day recency decay
- **Content Ranking**: Multi-factor algorithm (topic 50%, author 30%, recency 20%)
- **Diversity Injection**: 10% random content to prevent filter bubbles

### Phase 3-4: Integration & Testing

- **Article Tracking**: 8 event types per article (opened, closed, scrolled, etc.)
- **Search Tracking**: Query and result click tracking
- **Privacy Settings**: Full user control (toggle, view, export, delete)
- **41 Tests**: Unit, integration, and performance tests
- **A+ Privacy Audit**: 70/70 score on privacy compliance

### Phase 5: Advanced Features

- **"For You" Tab**: Dedicated personalized feed
- **Reading Streak**: Gamification with visual counter
- **Interest Management**: View and manage affinity scores
- **Data Export**: JSON and CSV export functionality

### Phase 6: Authentication & Cloud Sync

- **Optional Authentication**: Email/password, Google, Apple Sign-In
- **Cloud Sync**: Bidirectional sync with Firestore
- **Cross-Device**: Access data on multiple devices
- **Migration**: Seamless anonymous → authenticated transition

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Home     │  │ For You  │  │ Profile  │  ...         │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Personalization Engine                      │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ Content Ranking  │  │ Recommendations  │            │
│  └──────────────────┘  └──────────────────┘            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Affinity Calculator                         │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ Score Calculation│  │ Recency Decay    │            │
│  └──────────────────┘  └──────────────────┘            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Event Tracker                               │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ Event Queue      │  │ Batch Processing │            │
│  └──────────────────┘  └──────────────────┘            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Storage Layer                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ SQLite   │  │ Secure   │  │ Firebase │              │
│  │ (Local)  │  │ Store    │  │ (Cloud)  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Action** → Event Tracker captures behavior
2. **Event Queue** → Batched and written to SQLite
3. **Affinity Calculator** → Computes scores with decay
4. **Personalization Engine** → Ranks content based on affinities
5. **UI Rendering** → Displays personalized feed

---

## 📊 Performance Metrics

| Operation | Target | Actual | Status |
|-----------|--------|--------|--------|
| Insert 100 events | < 50ms | ~35ms | ✅ |
| Insert 1000 events | < 200ms | ~150ms | ✅ |
| Query events | < 50ms | ~30ms | ✅ |
| Calculate affinity | < 500ms | ~350ms | ✅ |
| Rank 1000 articles | < 200ms | ~150ms | ✅ |
| Cloud sync | < 5s | ~3s | ✅ |

---

## 🛠️ Installation

### Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode 14+ (for iOS development)
- Android: Android Studio (for Android development)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/amar-desh-mobile.git
   cd amar-desh-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (optional, for cloud sync)
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/emulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- user/__tests__/affinityCalculator.test.ts
```

### Test Coverage

- **Unit Tests**: 22 tests across 4 modules
- **Integration Tests**: 12 tests for end-to-end flows
- **Performance Tests**: 7 benchmarks for critical operations
- **Total Coverage**: > 70%

---

## 📱 Usage

### Anonymous Mode (Default)

The app works fully without authentication:
- All data stored locally on device
- Personalization based on reading behavior
- Privacy controls in Settings → Privacy

### Authenticated Mode (Optional)

For cross-device sync:
1. Go to Profile → Login
2. Sign in with email, Google, or Apple
3. Data automatically syncs to cloud
4. Access on multiple devices

---

## 🔒 Privacy

### Privacy-First Design

- ✅ **Local-First**: All data stays on device by default
- ✅ **No PII**: No personal information collected
- ✅ **Encrypted**: Secure storage for anonymous ID
- ✅ **User Control**: Toggle, view, export, delete data
- ✅ **Transparent**: Clear about what's tracked
- ✅ **A+ Rating**: 70/70 score on privacy audit

### What We Track

**Tracked:**
- Article opens, reads, saves, shares
- Search queries and result clicks
- Category views
- TTS usage
- Scroll depth and dwell time

**Not Tracked:**
- Personal information (name, email, phone)
- Device identifiers (IDFA, ADID)
- Location data
- Contacts or social graph
- IP addresses

---

## 📚 Documentation

### Core Documentation

- [Architecture](./docs/architecture.md) - System design and data flow
- [Privacy Audit](./docs/audit/PRIVACY_AUDIT.md) - A+ privacy rating details
- [Phase 1-2](./PHASE1_2_CORE.md) - Foundation and core features
- [Phase 3-4](./PHASE3_4_INTEGRATION.md) - Integration and testing
- [Phase 5](./PHASE5_ADVANCED.md) - Advanced features
- [Phase 6](./PHASE6_AUTHENTICATION.md) - Authentication and cloud sync

### API Documentation

- [Event Tracker API](./docs/api/eventTracker.md) - Event tracking methods
- [Affinity Calculator API](./docs/api/affinityCalculator.md) - Scoring algorithms
- [Personalization Engine API](./docs/api/personalizationEngine.md) - Ranking and recommendations
- [Authentication API](./docs/api/authentication.md) - Auth and sync methods

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Write tests for new features
- Maintain > 70% test coverage
- Update documentation
- Follow the existing code style

---

## 🗺️ Roadmap

### Completed ✅

- [x] Phase 1: Foundation (Anonymous ID, SQLite, Event Tracking)
- [x] Phase 2: Core Features (Affinity Scoring, Personalization)
- [x] Phase 3: Integration (Article Tracking, Privacy UI)
- [x] Phase 4: Testing (41 tests, A+ privacy audit)
- [x] Phase 5: Advanced Features (For You tab, Reading Streak)
- [x] Phase 6: Authentication (Firebase, Cloud Sync)

### Future (Optional) 🔮

- [ ] Phase 7: Advanced Analytics (Reading patterns, A/B testing)
- [ ] Phase 8: AI Enhancements (AI summaries, ML recommendations)
- [ ] Phase 9: Social Features (Share activity, Reading groups)
- [ ] Phase 10: Monetization (Premium subscriptions, Ads)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Expo Team** - For the amazing React Native framework
- **Firebase Team** - For authentication and cloud services
- **React Native Community** - For the robust mobile ecosystem
- **Daily Amar Desh** - For the news content and inspiration

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/amar-desh-mobile/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/amar-desh-mobile/discussions)
- **Email**: support@amardesh.com

---

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐

---

<div align="center">

**Built with ❤️ for privacy-conscious news readers**

[Website](https://amardesh.com) • [Documentation](./docs) • [Privacy Policy](./PRIVACY_POLICY.md) • [Terms of Service](./TERMS.md)

</div>
