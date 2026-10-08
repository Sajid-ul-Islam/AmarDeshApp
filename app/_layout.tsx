import { Stack, useRouter } from 'expo-router';
import { StatusBar as RNStatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../theme';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFonts } from 'expo-font';
import { useAppStore } from '../store/useAppStore';
import {
  initializeNotifications,
  addNotificationResponseListener,
  handleNotificationTap,
} from '../services/notificationService';
import { useUserStore } from '../user';
import { initializeAuthListener, isFirebaseConfigured } from '../services/firebase';
import { warmArticleStore } from '../services/articleStore';
import { StartupSplashScreen } from '../components/StartupSplashScreen';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { FONT_ASSETS } from '../services/fontService';
import {
  addDeepLinkListener,
  getInitialDeepLink,
} from '../services/deepLinkService';
import { setNavigator, handleIncomingUrl } from '../services/navigationService';

// Activate edge-to-edge rendering immediately when bundle evaluates on Android
if (Platform.OS === 'android') {
  RNStatusBar.setTranslucent(true);
  RNStatusBar.setBackgroundColor('transparent', true);
}

/**
 * Ensures system status bar is transparent and translucent, allowing the app canvas
 * to extend edge-to-edge behind the mobile status bar without clipping or dead bands.
 */
function EdgeToEdgeStatusBar() {
  const { isDark } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'android') {
      RNStatusBar.setTranslucent(true);
      RNStatusBar.setBackgroundColor('transparent', true);
    }
  }, [isDark]);

  return (
    <RNStatusBar
      translucent
      backgroundColor="transparent"
      barStyle={isDark ? 'light-content' : 'dark-content'}
    />
  );
}

/**
 * Single gateway for navigation triggered from outside React:
 * incoming deep/universal links and notification taps.
 *
 * Mounted inside the navigator tree so `useRouter()` is available. The router is
 * injected into `navigationService` immediately, which also flushes any route
 * that arrived during a cold start (before the tree was mounted).
 */
function ExternalNavigationGateway() {
  const router = useRouter();

  useEffect(() => {
    setNavigator(router);
    return () => setNavigator(null);
  }, [router]);

  useEffect(() => {
    let active = true;

    // Cold start: the URL that launched the app.
    getInitialDeepLink().then((url) => {
      if (active && url) handleIncomingUrl(url);
    });

    // Warm start: links opened while the app is already running.
    const subscription = addDeepLinkListener((url) => handleIncomingUrl(url));

    // Notification taps.
    const notificationSubscription = addNotificationResponseListener(
      (response) => {
        handleNotificationTap(response).catch((error) =>
          console.error('[Notifications] Tap handling failed:', error)
        );
      }
    );

    return () => {
      active = false;
      subscription?.remove();
      notificationSubscription?.remove();
    };
  }, []);

  return null;
}

export default function RootLayout() {
  const loadFeatureFlags = useAppStore((state) => state.loadFeatureFlags);
  const features = useAppStore((state) => state.features);
  const initializeUser = useUserStore((state) => state.initialize);
  const [splashDismissed, setSplashDismissed] = useState(false);
  const [flagsLoaded, setFlagsLoaded] = useState(false);

  /**
   * Load the bundled typography.
   *
   * These are the same TTF files the website serves (see
   * services/fontService.ts). Loading them up front means text never flashes in
   * the fallback family and then swaps. A load failure is non-fatal: styles fall
   * back to the platform font rather than blocking startup.
   */
  const [fontsLoaded, fontError] = useFonts(FONT_ASSETS);

  useEffect(() => {
    if (fontError) {
      console.warn('[Fonts] Failed to load bundled fonts, using system fallback:', fontError);
    }
  }, [fontError]);

  // Read persisted preferences FIRST, then act on them. Gating notification
  // setup on `features.enableNotifications` before the stored flags load would
  // request the OS permission prompt on every cold start, even for a user who
  // had turned notifications off.
  useEffect(() => {
    let active = true;

    loadFeatureFlags()
      .catch((error) => console.error('[App] Failed to load feature flags:', error))
      .finally(() => {
        if (active) setFlagsLoaded(true);
      });

    // Start fetching live news immediately (shared store; screens read
    // from it without each firing their own RSS request)
    warmArticleStore();

    // Initialize user profile system
    initializeUser();

    // Initialize Firebase Auth only when a project is actually configured
    if (isFirebaseConfigured()) {
      initializeAuthListener();
    }

    return () => {
      active = false;
    };
  }, [loadFeatureFlags, initializeUser]);

  // Set up notifications only after the user's stored preferences are known.
  useEffect(() => {
    if (!flagsLoaded || !features.enableNotifications) return;
    initializeNotifications().catch((error) =>
      console.error('[Notifications] Initialization failed:', error)
    );
  }, [flagsLoaded, features.enableNotifications]);

  const handleSplashFinish = useCallback(() => setSplashDismissed(true), []);

  // Hold the splash until the bundled fonts are available, so the first frame of
  // real content is not rendered in a fallback family. Bounded: a font failure
  // does not keep the reader on the splash screen.
  const showSplash = !splashDismissed || (!fontsLoaded && !fontError);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {/* Edge-to-Edge System Bar Configuration */}
        <EdgeToEdgeStatusBar />
        <ErrorBoundary>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="article/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="category/[slug]" options={{ headerShown: false }} />
            <Stack.Screen name="july-revolution/index" options={{ headerShown: false }} />
            <Stack.Screen name="notifications/index" options={{ headerShown: false }} />
            <Stack.Screen name="settings/index" options={{ headerShown: false }} />
            <Stack.Screen name="settings/ai" options={{ headerShown: false }} />
            <Stack.Screen name="settings/notifications" options={{ headerShown: false }} />
            <Stack.Screen name="settings/privacy" options={{ headerShown: false }} />
            <Stack.Screen name="settings/interests" options={{ headerShown: false }} />
            <Stack.Screen name="settings/export" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          </Stack>
          <ExternalNavigationGateway />
        </ErrorBoundary>

        {/* Startup Amar Desh Logo Splash Screen */}
        {showSplash && <StartupSplashScreen onFinish={handleSplashFinish} />}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
