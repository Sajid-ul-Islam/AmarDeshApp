import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  BOOKMARKS: '@amardesh_bookmarks',
  READING_HISTORY: '@amardesh_history',
  PREFERENCES: '@amardesh_preferences',
  REACTIONS: '@amardesh_reactions',
  COMMENTS: '@amardesh_comments',
  STREAK: '@amardesh_streak',
  FONT_SIZE: '@amardesh_fontsize',
  DARK_MODE: '@amardesh_darkmode',
  OFFLINE_ARTICLES: '@amardesh_offline',
};

// Bookmarks
export const saveBookmarks = async (bookmarks: string[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Error saving bookmarks:', error);
  }
};

export const loadBookmarks = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    return [];
  }
};

// Reading History
export const saveReadingHistory = async (history: string[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.READING_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving history:', error);
  }
};

export const loadReadingHistory = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.READING_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
};

// Preferences
export const savePreferences = async (prefs: any) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
};

export const loadPreferences = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading preferences:', error);
    return {};
  }
};

// Reactions
export const saveReactions = async (reactions: any) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.REACTIONS, JSON.stringify(reactions));
  } catch (error) {
    console.error('Error saving reactions:', error);
  }
};

export const loadReactions = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.REACTIONS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading reactions:', error);
    return {};
  }
};

// Comments
export const saveComments = async (comments: any[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  } catch (error) {
    console.error('Error saving comments:', error);
  }
};

export const loadComments = async (): Promise<any[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMMENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading comments:', error);
    return [];
  }
};

// Reading Streak
export const saveStreak = async (streak: any) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
  } catch (error) {
    console.error('Error saving streak:', error);
  }
};

export const loadStreak = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.STREAK);
    return data ? JSON.parse(data) : { count: 0, lastRead: null };
  } catch (error) {
    console.error('Error loading streak:', error);
    return { count: 0, lastRead: null };
  }
};

// Font Size
export const saveFontSize = async (size: string) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FONT_SIZE, size);
  } catch (error) {
    console.error('Error saving font size:', error);
  }
};

export const loadFontSize = async (): Promise<string> => {
  try {
    const size = await AsyncStorage.getItem(STORAGE_KEYS.FONT_SIZE);
    return size || 'M';
  } catch (error) {
    console.error('Error loading font size:', error);
    return 'M';
  }
};

// Dark Mode
export const saveDarkMode = async (enabled: boolean) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(enabled));
  } catch (error) {
    console.error('Error saving dark mode:', error);
  }
};

export const loadDarkMode = async (): Promise<boolean | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading dark mode:', error);
    return null;
  }
};

// Offline Articles
export const saveOfflineArticles = async (articles: any[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_ARTICLES, JSON.stringify(articles));
  } catch (error) {
    console.error('Error saving offline articles:', error);
  }
};

export const loadOfflineArticles = async (): Promise<any[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_ARTICLES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading offline articles:', error);
    return [];
  }
};

// Clear all data
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
