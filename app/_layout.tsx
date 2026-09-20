import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../theme';
import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { initializeNotifications } from '../services/notificationService';

export default function RootLayout() {
  const loadFeatureFlags = useAppStore((state) => state.loadFeatureFlags);
  const features = useAppStore((state) => state.features);

  useEffect(() => {
    loadFeatureFlags();
    
    // Initialize notifications if enabled
    if (features.enableNotifications) {
      initializeNotifications();
    }
  }, [loadFeatureFlags, features.enableNotifications]);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="article/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="settings/notifications" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
