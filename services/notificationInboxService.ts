import AsyncStorage from '@react-native-async-storage/async-storage';

export interface InboxNotification {
  id: string;
  title: string;
  body: string;
  channel: 'breaking' | 'daily' | 'category' | 'general';
  timestamp: number;
  read: boolean;
  articleId?: string;
  badge?: string;
}

const INBOX_KEY = '@amar_desh_notification_inbox';

const INITIAL_SAMPLE_NOTIFICATIONS: InboxNotification[] = [
  {
    id: 'notif-1',
    title: '🚨 ব্রেকিং নিউজ: সংস্কার প্রশ্নে রাজনৈতিক দলগুলোর সাথে চূড়ান্ত বৈঠক শুরু',
    body: 'জাতীয় ঐক্য ও নির্বাচনী রোডম্যাপ চূড়ান্ত করতে জরুরি আলোচনায় বসেছেন সরকারের শীর্ষ উপদেষ্টা ও রাজনৈতিক নেতৃবৃন্দ।',
    channel: 'breaking',
    timestamp: Date.now() - 1000 * 60 * 35, // 35 mins ago
    read: false,
    articleId: '1',
    badge: 'জরুরি',
  },
  {
    id: 'notif-2',
    title: '🌅 দৈনিক সকালের সংবাদ সারসংক্ষেপ',
    body: 'আজ বুধবার ০৭ অক্টোবর ২০২৬: ব্যাংক খাত সংস্কার, জুলাই শহীদ পরিবারদের সহায়তা ও আন্তর্জাতিক কূটনৈতিক গুরুত্বপূর্ণ খবর।',
    channel: 'daily',
    timestamp: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago
    read: false,
    badge: 'সারসংক্ষেপ',
  },
  {
    id: 'notif-3',
    title: '🏛️ জুলাই বিপ্লব ২০২৪: প্রত্যক্ষদর্শীদের নতুন জবানবন্দি প্রকাশ',
    body: 'গণঅভ্যুত্থানের ঐতিহাসিক দিনগুলোর অদেখা দলিল ও শহীদদের আত্মত্যাগের স্মৃতিচারণমূলক বিশেষ প্রতিবেদন।',
    channel: 'category',
    timestamp: Date.now() - 1000 * 60 * 60 * 18, // 18 hours ago
    read: true,
    articleId: 'july-1',
    badge: 'জুলাই বিপ্লব',
  },
  {
    id: 'notif-4',
    title: '📰 আজকের ডিজিটাল ই-পেপার সংস্করণ প্রকাশিত হয়েছে',
    body: 'দৈনিক আমার দেশ আজকের সম্পূর্ণ ঢাকা সংস্করণ এখন অ্যাপে অফলাইনে পড়ার জন্য প্রস্তুত।',
    channel: 'general',
    timestamp: Date.now() - 1000 * 60 * 60 * 28, // 28 hours ago
    read: true,
    badge: 'ই-পেপার',
  },
];

let cachedInbox: InboxNotification[] | null = null;
const listeners: Array<() => void> = [];

const notifyListeners = () => {
  listeners.forEach((fn) => fn());
};

export const subscribeToInbox = (listener: () => void) => {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx !== -1) listeners.splice(idx, 1);
  };
};

/**
 * Get all inbox notifications, seeding defaults if empty
 */
export async function getInboxNotifications(): Promise<InboxNotification[]> {
  try {
    const raw = await AsyncStorage.getItem(INBOX_KEY);
    if (raw) {
      cachedInbox = JSON.parse(raw);
      return cachedInbox || [];
    }

    // Seed defaults for realistic rich experience
    await AsyncStorage.setItem(INBOX_KEY, JSON.stringify(INITIAL_SAMPLE_NOTIFICATIONS));
    cachedInbox = INITIAL_SAMPLE_NOTIFICATIONS;
    return cachedInbox;
  } catch (error) {
    console.error('[Notification Inbox] Load failed:', error);
    return INITIAL_SAMPLE_NOTIFICATIONS;
  }
}

/**
 * Add a new notification to the user's inbox
 */
export async function addNotificationToInbox(
  notification: Omit<InboxNotification, 'id' | 'timestamp' | 'read'> & {
    id?: string;
    timestamp?: number;
  }
): Promise<InboxNotification> {
  const current = await getInboxNotifications();
  const newItem: InboxNotification = {
    id: notification.id || `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: notification.timestamp || Date.now(),
    read: false,
    ...notification,
  };

  const updated = [newItem, ...current].slice(0, 100); // Retain latest 100
  cachedInbox = updated;
  await AsyncStorage.setItem(INBOX_KEY, JSON.stringify(updated));
  notifyListeners();
  return newItem;
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(id: string): Promise<void> {
  const current = await getInboxNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  cachedInbox = updated;
  await AsyncStorage.setItem(INBOX_KEY, JSON.stringify(updated));
  notifyListeners();
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  const current = await getInboxNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  cachedInbox = updated;
  await AsyncStorage.setItem(INBOX_KEY, JSON.stringify(updated));
  notifyListeners();
}

/**
 * Delete a notification
 */
export async function deleteNotification(id: string): Promise<void> {
  const current = await getInboxNotifications();
  const updated = current.filter((n) => n.id !== id);
  cachedInbox = updated;
  await AsyncStorage.setItem(INBOX_KEY, JSON.stringify(updated));
  notifyListeners();
}

/**
 * Clear all notifications
 */
export async function clearAllNotifications(): Promise<void> {
  cachedInbox = [];
  await AsyncStorage.setItem(INBOX_KEY, JSON.stringify([]));
  notifyListeners();
}

/**
 * Get count of unread notifications
 */
export async function getUnreadNotificationCount(): Promise<number> {
  const current = await getInboxNotifications();
  return current.filter((n) => !n.read).length;
}
