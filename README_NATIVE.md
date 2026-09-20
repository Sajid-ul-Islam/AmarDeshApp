# আমার দেশ - Expo React Native Mobile App

A native mobile application for Daily Amar Desh (আমার দেশ) Bengali newspaper, built with Expo and React Native.

## 🎉 Conversion Complete!

The web application has been successfully converted to a native Expo React Native app.

## 📱 What's Been Converted

### ✅ Core Features Implemented

1. **Tab Navigation** - 4 main tabs (Home, Search, Bookmarks, Profile)
2. **Home Screen** - Article list with hero card and category tabs
3. **Search Screen** - Real-time search with filtered results
4. **Bookmarks Screen** - Saved articles list
5. **Profile Screen** - Settings and app info
6. **Article Detail Screen** - Full article view with metadata
7. **Bengali Localization** - All text in Bengali with proper numerals
8. **Dark Mode Support** - System-based dark mode detection

### 🏗️ Project Structure

```
app/
├── _layout.tsx              # Root layout with navigation
├── (tabs)/
│   ├── _layout.tsx          # Tab navigation layout
│   ├── index.tsx            # Home screen
│   ├── search.tsx           # Search screen
│   ├── bookmarks.tsx        # Bookmarks screen
│   └── profile.tsx          # Profile/More screen
└── article/
    └── [id].tsx             # Article detail screen

data/
└── mockData.ts              # Mock article data

utils/
└── bengali.ts               # Bengali utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Or run on specific platform
npm run ios      # iOS simulator
npm run android  # Android emulator
```

### Building for Production

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Or use EAS Build (recommended)
eas build --platform ios
eas build --platform android
```

## 📊 Key Differences from Web Version

| Feature | Web Version | React Native Version |
|---------|-------------|---------------------|
| **Navigation** | State-based routing | Expo Router (file-based) |
| **Styling** | Tailwind CSS | React Native StyleSheet |
| **Storage** | localStorage | AsyncStorage (planned) |
| **Sharing** | Web Share API | expo-sharing (planned) |
| **Deep Links** | URL parameters | expo-linking (planned) |
| **YouTube** | iframe embed | react-native-youtube-iframe (planned) |
| **TTS** | SpeechSynthesis API | expo-speech (planned) |
| **Images** | Lazy loading | FastImage (planned) |

## 🎯 Features Status

### ✅ Implemented
- [x] Tab navigation (4 tabs)
- [x] Home screen with article list
- [x] Hero article card
- [x] Category tabs
- [x] Search functionality
- [x] Bookmarks screen
- [x] Profile/Settings screen
- [x] Article detail screen
- [x] Bengali text and numerals
- [x] Dark mode support
- [x] Pull-to-refresh
- [x] Responsive layouts

### 🔄 Planned (Next Phase)
- [ ] AsyncStorage for bookmarks persistence
- [ ] RSS feed integration
- [ ] Deep linking support
- [ ] Native sharing (expo-sharing)
- [ ] Text-to-speech (expo-speech)
- [ ] YouTube player integration
- [ ] Push notifications
- [ ] Offline reading
- [ ] AI assistant integration
- [ ] Social sharing (Instagram, Facebook)
- [ ] Emoji reactions
- [ ] Comments system
- [ ] Reading streak tracking
- [ ] Font size controls
- [ ] Customizable navigation

## 🎨 Design System

### Colors
- **Primary Green:** `#006B3F`
- **Dark Green:** `#004D2C`
- **Background:** `#F9FAFB` (light) / `#111827` (dark)
- **Text:** `#111827` (light) / `#FFFFFF` (dark)
- **Secondary:** `#6B7280`

### Typography
- **Font Family:** System default (supports Bengali)
- **Title:** 22px, bold
- **Body:** 16px, regular
- **Caption:** 12px, regular

### Spacing
- **Small:** 8px
- **Medium:** 12px
- **Large:** 16px
- **XL:** 24px

## 📱 Platform Support

| Platform | Status | Min Version |
|----------|--------|-------------|
| **iOS** | ✅ Ready | iOS 13.0+ |
| **Android** | ✅ Ready | Android 6.0+ (API 23) |
| **Web** | ⚠️ Partial | Modern browsers |

## 🔧 Configuration

### app.json
- **App Name:** আমার দেশ
- **Bundle ID:** `com.amardesh.mobile`
- **Scheme:** `amardesh`
- **Deep Links:** Configured for `dailyamardesh.com`

### Permissions
- Camera (for sharing photos)
- Photo Library (for sharing images)

## 📦 Dependencies

### Core
- `expo` ~50.0.0
- `expo-router` ~3.4.0
- `react-native` 0.73.0
- `react` 18.2.0

### Navigation
- `@react-navigation/native` ^6.1.9
- `@react-navigation/bottom-tabs` ^6.5.11

### UI
- `react-native-safe-area-context` 4.8.2
- `@expo/vector-icons` ^14.0.0

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📝 Development Notes

### Bengali Text
All UI text is in Bengali. Numbers are converted using `toBengaliNumeral()` utility.

### Images
Article images are loaded from `images.dailyamardesh.com` CDN. Consider using `expo-image` for better performance.

### Navigation
Using Expo Router for file-based routing. Deep links are configured in `app.json`.

### State Management
Currently using local state. For production, consider:
- Zustand (lightweight)
- Redux Toolkit (complex state)
- React Context (simple state)

## 🚀 Next Steps

### Phase 1: Core Features (Current)
1. ✅ Basic navigation and screens
2. ✅ Article display
3. ✅ Search functionality
4. 🔄 Data persistence (AsyncStorage)
5. 🔄 RSS feed integration

### Phase 2: Enhanced Features
1. Native sharing
2. Deep linking
3. Push notifications
4. Offline reading
5. Text-to-speech

### Phase 3: Advanced Features
1. AI assistant
2. Social integration
3. Community features
4. Analytics
5. Performance optimization

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Navigation](https://reactnavigation.org/)

## 🤝 Contributing

This is a conversion project. For the original web version, see the `src/` directory (deprecated).

## 📄 License

©️ 2024-2026 Daily Amar Desh. All rights reserved.

## 📞 Support

For issues or questions, please refer to the original documentation:
- `README.md` (web version)
- `AGENTS.md` (development guide)
- `architecture.md` (system design)

---

**Status:** ✅ **Expo React Native conversion complete. Ready for testing and enhancement.**
