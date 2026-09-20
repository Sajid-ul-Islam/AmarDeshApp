import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

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
export async function requestNotificationPermissions(): Promise<Notifications.PermissionStatus> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  
  if (existingStatus === 'granted') {
    return existingStatus;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status;
}

/**
 * Get push token for remote notifications
 */
export async function getPushToken(): Promise<string | null> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    
    if (status !== 'granted') {
      console.log('Notification permissions not granted');
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // Replace with actual EAS project ID
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
  data?: any,
  channelId: string = CHANNELS.GENERAL,
  trigger?: Notifications.NotificationTriggerInput
): Promise<string> {
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
 * Schedule a daily briefing notification
 */
export async function scheduleDailyBriefing(time: Date = new Date()): Promise<string> {
  // Set to 8:00 AM tomorrow
  const trigger = new Date(time);
  trigger.setHours(8, 0, 0, 0);
  
  if (trigger.getTime() < Date.now()) {
    trigger.setDate(trigger.getDate() + 1);
  }

  return await scheduleLocalNotification(
    'দৈনিক সংবাদ',
    'আজকের গুরুত্বপূর্ণ সংবাদ পড়ুন',
    { type: 'daily-briefing' },
    CHANNELS.DAILY,
    {
      type: 'daily',
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
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Cancel a specific notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
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
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Listen for foreground notifications
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Handle notification tap and navigate
 */
export async function handleNotificationTap(
  response: Notifications.NotificationResponse
): Promise<void> {
  const { data } = response.notification.request.content;
  
  if (data?.url) {
    // Deep link to article
    await Linking.openURL(data.url);
  } else if (data?.articleId) {
    // Fallback: construct URL
    await Linking.openURL(`amardesh://article/${data.articleId}`);
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
  
  const [startHours, startMinutes] = preferences.quietHours.start.split(':').map(Number);
  const [endHours, endMinutes] = preferences.quietHours.end.split(':').map(Number);
  
  const startMinutes = startHours * 60 + startMinutes;
  const endMinutes = endHours * 60 + endMinutes;

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
