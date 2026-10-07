import { Stack } from 'expo-router';
import { StatusBar as RNStatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../theme';
import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { initializeNotifications } from '../services/notificationService';
import { useUserStore } from '../user';
import { initializeAuthListener, isFirebaseConfigured } from '../services/firebase';
import { warmArticleStore } from '../services/articleStore';
import { StartupSplashScreen } from '../components/StartupSplashScreen';

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

export default function RootLayout() {
  const loadFeatureFlags = useAppStore((state) => state.loadFeatureFlags);
  const features = useAppStore((state) => state.features);
  const initializeUser = useUserStore((state) => state.initialize);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    loadFeatureFlags();

    // Start fetching live news immediately (shared store; screens read
    // from it without each firing their own RSS request)
    warmArticleStore();
    
    // Initialize user profile system
    initializeUser();
    
    // Initialize notifications if enabled
    if (features.enableNotifications) {
      initializeNotifications();
    }
    
    // Initialize Firebase Auth if configured
    if (isFirebaseConfigured()) {
      initializeAuthListener();
    }
  }, [loadFeatureFlags, features.enableNotifications, initializeUser]);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {/* Edge-to-Edge System Bar Configuration */}
        <EdgeToEdgeStatusBar />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="article/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="category/[slug]" options={{ headerShown: false }} />
          <Stack.Screen name="july-revolution/index" options={{ headerShown: false }} />
          <Stack.Screen name="notifications/index" options={{ headerShown: false }} />
          <Stack.Screen name="settings/ai" options={{ headerShown: false }} />
          <Stack.Screen name="settings/notifications" options={{ headerShown: false }} />
          <Stack.Screen name="settings/privacy" options={{ headerShown: false }} />
          <Stack.Screen name="settings/interests" options={{ headerShown: false }} />
          <Stack.Screen name="settings/export" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        </Stack>

        {/* Startup Amar Desh Logo Splash Screen */}
        {showSplash && (
          <StartupSplashScreen onFinish={() => setShowSplash(false)} />
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
