import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../theme';
import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { initializeNotifications } from '../services/notificationService';
import { useUserStore } from '../user';

export default function RootLayout() {
  const loadFeatureFlags = useAppStore((state) => state.loadFeatureFlags);
  const features = useAppStore((state) => state.features);
  const initializeUser = useUserStore((state) => state.initialize);

  useEffect(() => {
    loadFeatureFlags();
    
    // Initialize user profile system
    initializeUser();
    
    // Initialize notifications if enabled
    if (features.enableNotifications) {
      initializeNotifications();
    }
  }, [loadFeatureFlags, features.enableNotifications, initializeUser]);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="article/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="settings/notifications" options={{ headerShown: false }} />
          <Stack.Screen name="settings/privacy" options={{ headerShown: false }} />
          <Stack.Screen name="settings/interests" options={{ headerShown: false }} />
          <Stack.Screen name="settings/export" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
