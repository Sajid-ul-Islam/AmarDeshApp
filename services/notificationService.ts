import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import type * as NotificationsType from 'expo-notifications';

/**
 * expo-notifications must be loaded lazily.
 *
 * Importing it statically triggers a module-level side effect
 * (DevicePushTokenAutoRegistration registers a push-token listener at import
 * time) that THROWS on Android inside Expo Go since SDK 53 — crashing the
 * app at startup before any of our code runs. So we only require() the
 * module when it is actually usable:
 *
 * - Development/production builds: always available
 * - Expo Go on iOS: available (limited push support, local notifications OK)
 * - Expo Go on Android: NOT available — every API no-ops via `notifications`
 *   being null and `isNotificationApiAvailable()` returning false
 *
 * NOTE: when `notifications` is null, values typed as Notifications.* are
 * unobservable at runtime, so consumers see inert behavior instead of a
 * crash. Full functionality requires a development build.
 */
let notificationsModule: typeof NotificationsType | null = null;
let notificationsLoadAttempted = false;

function loadNotifications(): typeof NotificationsType | null {
  if (notificationsLoadAttempted) {
    return notificationsModule;
  }
  notificationsLoadAttempted = true;

  const inExpoGo =
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

  if (inExpoGo && Platform.OS === 'android') {
    console.log(
      '[Notifications] Remote push unavailable in Expo Go on Android; notifications disabled. Use a development build for full support.'
    );
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    notificationsModule =
      require('expo-notifications') as typeof NotificationsType;
  } catch (error) {
    console.warn('[Notifications] Failed to load expo-notifications:', error);
    notificationsModule = null;
  }
  return notificationsModule;
}

/**
 * Whether the native notification APIs are usable in the current runtime.
 */
export function isNotificationApiAvailable(): boolean {
  return loadNotifications() !== null;
}

// Notification channel IDs
export const CHANNELS = {
  BREAKING: 'breaking-news',
  DAILY: 'daily-briefing',
  CATEGORY: 'category-updates',
  GENERAL: 'general',
};

// Notification preferences storage key
const PREFS_KEY = '@amar_desh_notification_prefs';

// Default notification preferences
export interface NotificationPreferences {
  enabled: boolean;
  breakingNews: boolean;
  dailyBriefing: boolean;
  categoryUpdates: boolean;
  followedCategories: string[];
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
}

const defaultPreferences: NotificationPreferences = {
  enabled: true,
  breakingNews: true,
  dailyBriefing: true,
  categoryUpdates: false,
  followedCategories: [],
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '07:00',
  },
};

/**
 * Configure notification channels for Android
 */
export async function configureNotificationChannels(): Promise<void> {
  const Notifications = loadNotifications();
  if (!Notifications) return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNELS.BREAKING, {
      name: 'Breaking News',
      description: 'Urgent breaking news alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF0000',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync(CHANNELS.DAILY, {
      name: 'Daily Briefing',
      description: 'Morning news summary',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync(CHANNELS.CATEGORY, {
      name: 'Category Updates',
      description: 'News from your followed categories',
      importance: Notifications.AndroidImportance.LOW,
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync(CHANNELS.GENERAL, {
      name: 'General',
      description: 'General notifications',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
  }
}

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<NotificationsType.PermissionStatus> {
  const Notifications = loadNotifications();
  if (!Notifications) return 'denied' as NotificationsType.PermissionStatus;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  
  if (existingStatus === 'granted') {
    return existingStatus;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status;
}

/**
 * EAS project ID used for Expo push tokens and OTA updates.
 * Keep in sync with `expo.extra.eas.projectId` in app.json.
 */
const EAS_PROJECT_ID = process.env.EXPO_PUBLIC_EAS_PROJECT_ID || 'your-project-id';

/**
 * Check whether push notifications can actually work.
 * Placeholder project IDs cause getExpoPushTokenAsync to fail at runtime,
 * so we skip the call entirely until a real ID is configured.
 */
function hasValidProjectId(): boolean {
  return !!EAS_PROJECT_ID && EAS_PROJECT_ID !== 'your-project-id';
}

/**
 * Get push token for remote notifications
 */
export async function getPushToken(): Promise<string | null> {
  const Notifications = loadNotifications();
  if (!Notifications) return null;

  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    return null;
  }

  if (!hasValidProjectId()) {
    console.log('[Notifications] EAS project ID not configured, skipping push token');
    return null;
  }

  try {
    const { status } = await Notifications.getPermissionsAsync();
    
    if (status !== 'granted') {
      console.log('Notification permissions not granted');
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: EAS_PROJECT_ID,
    })).data;

    // Store token for backend registration
    await AsyncStorage.setItem('@amar_desh_push_token', token);
    
    return token;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
}

/**
 * Schedule a local notification
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>,
  channelId: string = CHANNELS.GENERAL,
  trigger?: NotificationsType.NotificationTriggerInput
): Promise<string> {
  const Notifications = loadNotifications();
  if (!Notifications) return '';

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: 'default',
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: trigger || null, // null = show immediately
  });

  return notificationId;
}

/**
 * Schedule a daily briefing notification (fires every day at 8:00 AM)
 */
export async function scheduleDailyBriefing(): Promise<string> {
  const Notifications = loadNotifications();
  if (!Notifications) return '';

  return await scheduleLocalNotification(
    'দৈনিক সংবাদ',
    'আজকের গুরুত্বপূর্ণ সংবাদ পড়ুন',
    { type: 'daily-briefing' },
    CHANNELS.DAILY,
    {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 0,
    }
  );
}

/**
 * Send breaking news notification
 */
export async function sendBreakingNewsNotification(
  articleId: string,
  title: string,
  excerpt: string
): Promise<string> {
  return await scheduleLocalNotification(
    '🔴 ব্রেকিং নিউজ',
    title,
    { 
      type: 'breaking-news',
      articleId,
      url: `amardesh://article/${articleId}`,
    },
    CHANNELS.BREAKING
  );
}

/**
 * Send category update notification
 */
export async function sendCategoryUpdateNotification(
  category: string,
  articleId: string,
  title: string
): Promise<string> {
  return await scheduleLocalNotification(
    `${category} আপডেট`,
    title,
    { 
      type: 'category-update',
      category,
      articleId,
      url: `amardesh://article/${articleId}`,
    },
    CHANNELS.CATEGORY
  );
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  const Notifications = loadNotifications();
  if (!Notifications) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Cancel a specific notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  const Notifications = loadNotifications();
  if (!Notifications) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledNotifications(): Promise<NotificationsType.NotificationRequest[]> {
  const Notifications = loadNotifications();
  if (!Notifications) return [];
  return await Notifications.getAllScheduledNotificationsAsync();
}

/**
 * Load notification preferences from storage
 */
export async function loadNotificationPreferences(): Promise<NotificationPreferences> {
  try {
    const stored = await AsyncStorage.getItem(PREFS_KEY);
    if (stored) {
      return { ...defaultPreferences, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error loading notification preferences:', error);
  }
  return defaultPreferences;
}

/**
 * Save notification preferences to storage
 */
export async function saveNotificationPreferences(
  preferences: NotificationPreferences
): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving notification preferences:', error);
  }
}

/**
 * Handle notification tap - navigate to article
 */
export function setupNotificationHandler(): void {
  const Notifications = loadNotifications();
  if (!Notifications) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * Listen for notification responses (taps)
 */
export function addNotificationResponseListener(
  callback: (response: NotificationsType.NotificationResponse) => void
): ReturnType<typeof NotificationsType.addNotificationResponseReceivedListener> | null {
  const Notifications = loadNotifications();
  if (!Notifications) return null;
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Listen for foreground notifications
 */
export function addNotificationReceivedListener(
  callback: (notification: NotificationsType.Notification) => void
): ReturnType<typeof NotificationsType.addNotificationReceivedListener> | null {
  const Notifications = loadNotifications();
  if (!Notifications) return null;
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Handle notification tap and navigate
 * Appends source=notification so article_opened attribution records
 * where the user came from.
 */
export async function handleNotificationTap(
  response: NotificationsType.NotificationResponse
): Promise<void> {
  const { data } = response.notification.request.content;
  
  if (typeof data?.url === 'string') {
    // Deep link to article (append attribution param if not present)
    const url = data.url.includes('source=')
      ? data.url
      : `${data.url}${data.url.includes('?') ? '&' : '?'}source=notification`;
    await Linking.openURL(url);
  } else if (data?.articleId) {
    // Fallback: construct URL with attribution
    await Linking.openURL(`amardesh://article/${data.articleId}?source=notification`);
  }
}

/**
 * Check if current time is within quiet hours
 */
export function isWithinQuietHours(preferences: NotificationPreferences): boolean {
  if (!preferences.quietHours.enabled) {
    return false;
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const [startHour, startMinute] = preferences.quietHours.start.split(':').map(Number);
  const [endHour, endMinute] = preferences.quietHours.end.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  // Handle overnight quiet hours (e.g., 22:00 to 07:00)
  if (startMinutes > endMinutes) {
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

/**
 * Initialize notifications system
 */
export async function initializeNotifications(): Promise<void> {
  // Configure channels (Android)
  await configureNotificationChannels();
  
  // Set up notification handler
  setupNotificationHandler();
  
  // Request permissions
  const status = await requestNotificationPermissions();
  
  if (status === 'granted') {
    // Get push token
    await getPushToken();
    
    // Load preferences
    const preferences = await loadNotificationPreferences();
    
    // Schedule daily briefing if enabled
    if (preferences.enabled && preferences.dailyBriefing) {
      await scheduleDailyBriefing();
    }
  }
}
