import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loadBookmarks,
  saveBookmarks,
  loadStreak,
  saveStreak,
  loadPreferences,
  savePreferences,
  loadReactions,
  saveReactions,
} from './storage';

const SYNC_METADATA_KEY = '@amar_desh_cloud_sync_metadata';
const SYNC_QUEUE_KEY = '@amar_desh_cloud_sync_queue';

export interface CloudSyncState {
  isSyncing: boolean;
  lastSyncedAt: number | null;
  pendingChanges: number;
  lastError: string | null;
  userId: string | null;
}

export interface SyncPayload {
  userId: string;
  bookmarks: string[];
  readingStreak: { count: number; lastRead: string | null };
  reactions: Record<string, string>;
  preferences: Record<string, any>;
  clientTimestamp: number;
}

export interface SyncResult {
  success: boolean;
  syncedAt: number;
  bookmarksCount: number;
  streakCount: number;
  queued?: boolean;
  error?: string;
}

type SyncListener = (state: CloudSyncState) => void;
const listeners = new Set<SyncListener>();

let currentSyncState: CloudSyncState = {
  isSyncing: false,
  lastSyncedAt: null,
  pendingChanges: 0,
  lastError: null,
  userId: null,
};

const notifyListeners = () => {
  listeners.forEach((listener) => {
    try {
      listener({ ...currentSyncState });
    } catch (e) {
      console.warn('Sync listener notification error', e);
    }
  });
};

export const subscribeToSyncState = (listener: SyncListener): (() => void) => {
  listeners.add(listener);
  listener({ ...currentSyncState });
  return () => {
    listeners.delete(listener);
  };
};

export const getCloudSyncState = async (): Promise<CloudSyncState> => {
  try {
    const raw = await AsyncStorage.getItem(SYNC_METADATA_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      currentSyncState = {
        ...currentSyncState,
        lastSyncedAt: parsed.lastSyncedAt || null,
        userId: parsed.userId || null,
      };
    }
  } catch (e) {
    // Ignore read errors
  }
  return { ...currentSyncState };
};

/**
 * Perform bidirectional sync between local AsyncStorage and Cloud Store.
 * Supports offline queuing and automatic union conflict resolution.
 */
export const syncAccountData = async (
  userId: string = 'guest-reader',
  customCloudUrl?: string
): Promise<SyncResult> => {
  currentSyncState.isSyncing = true;
  currentSyncState.lastError = null;
  currentSyncState.userId = userId;
  notifyListeners();

  try {
    // 1. Gather all local data
    const [bookmarks, streak, reactions, preferences] = await Promise.all([
      loadBookmarks(),
      loadStreak(),
      loadReactions(),
      loadPreferences(),
    ]);

    const payload: SyncPayload = {
      userId,
      bookmarks,
      readingStreak: streak,
      reactions,
      preferences,
      clientTimestamp: Date.now(),
    };

    let remoteData: Partial<SyncPayload> | null = null;

    // 2. Transmit to remote endpoint if available
    if (customCloudUrl) {
      try {
        const response = await fetch(customCloudUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Amar-Desh-Client': 'Expo-Mobile-2026',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Cloud server returned HTTP ${response.status}`);
        }
        remoteData = await response.json();
      } catch (networkErr: any) {
        // Queue for later sync
        await queueFailedSync(payload);
        currentSyncState.isSyncing = false;
        currentSyncState.pendingChanges += 1;
        currentSyncState.lastError = 'নেটওয়ার্ক সংযোগ পাওয়া যায়নি, অফলাইন সারিতে রাখা হয়েছে';
        notifyListeners();

        return {
          success: false,
          syncedAt: Date.now(),
          bookmarksCount: bookmarks.length,
          streakCount: streak.count || 0,
          queued: true,
          error: 'Offline queued',
        };
      }
    } else {
      // Standalone cloud sync simulator (persists client-side sync record)
      remoteData = {
        bookmarks: payload.bookmarks,
        readingStreak: payload.readingStreak,
        reactions: payload.reactions,
        preferences: payload.preferences,
      };
    }

    // 3. Conflict resolution & merge
    const mergedBookmarks = Array.from(
      new Set([...bookmarks, ...(remoteData?.bookmarks || [])])
    );

    const remoteStreak = remoteData?.readingStreak || { count: 0, lastRead: null };
    const mergedStreak = {
      count: Math.max(streak.count || 0, remoteStreak.count || 0),
      lastRead: streak.lastRead || remoteStreak.lastRead || null,
    };

    const mergedReactions = {
      ...reactions,
      ...(remoteData?.reactions || {}),
    };

    const mergedPreferences = {
      ...preferences,
      ...(remoteData?.preferences || {}),
    };

    // 4. Save merged datasets back to local storage
    await Promise.all([
      saveBookmarks(mergedBookmarks),
      saveStreak(mergedStreak),
      saveReactions(mergedReactions),
      savePreferences(mergedPreferences),
    ]);

    const now = Date.now();
    currentSyncState.isSyncing = false;
    currentSyncState.lastSyncedAt = now;
    currentSyncState.pendingChanges = 0;
    currentSyncState.lastError = null;

    await AsyncStorage.setItem(
      SYNC_METADATA_KEY,
      JSON.stringify({
        lastSyncedAt: now,
        userId,
      })
    );

    notifyListeners();

    return {
      success: true,
      syncedAt: now,
      bookmarksCount: mergedBookmarks.length,
      streakCount: mergedStreak.count,
    };
  } catch (err: any) {
    currentSyncState.isSyncing = false;
    currentSyncState.lastError = err?.message || 'সিঙ্ক করতে ত্রুটি দেখা দিয়েছে';
    notifyListeners();

    return {
      success: false,
      syncedAt: Date.now(),
      bookmarksCount: 0,
      streakCount: 0,
      error: err?.message,
    };
  }
};

const queueFailedSync = async (payload: SyncPayload) => {
  try {
    const raw = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    const queue: SyncPayload[] = raw ? JSON.parse(raw) : [];
    queue.push(payload);
    // Keep at most 10 queued items
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue.slice(-10)));
  } catch (e) {
    // Ignore queue failure
  }
};

export const flushSyncQueue = async (customCloudUrl: string): Promise<boolean> => {
  try {
    const raw = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    if (!raw) return true;
    const queue: SyncPayload[] = JSON.parse(raw);
    if (queue.length === 0) return true;

    for (const item of queue) {
      await fetch(customCloudUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
    }

    await AsyncStorage.removeItem(SYNC_QUEUE_KEY);
    return true;
  } catch (e) {
    return false;
  }
};
