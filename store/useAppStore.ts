import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SupportedLanguage,
  LANGUAGE_STORAGE_KEY,
  setAppLanguage,
} from '../services/i18n';

interface FeatureFlags {
  enableExpoImage: boolean;
  enableNotifications: boolean;
  enableHaptics: boolean;
  enableBreakingNews: boolean;
  enableDailyBriefing: boolean;
  enableCategoryUpdates: boolean;
  enableSponsoredCommerce: boolean;
}

interface AppState {
  features: FeatureFlags;
  /**
   * User's theme preference: system (default), light, dark, or sepia.
   * `null` means follow the system setting.
   */
  themePreference: 'system' | 'light' | 'dark' | 'sepia' | null;
  /**
   * User's app language: 'bn' (Bengali) or 'en' (English).
   */
  language: SupportedLanguage;
  /**
   * Home feed presentation layout: 'magazine' (large cards), 'compact' (dense list), or 'card' (swipeable deck).
   */
  feedLayout: 'magazine' | 'compact' | 'card';
  setFeatureFlag: (key: keyof FeatureFlags, value: boolean) => void;
  setThemePreference: (pref: 'system' | 'light' | 'dark' | 'sepia') => void;
  setLanguage: (lang: SupportedLanguage) => void;
  setFeedLayout: (layout: 'magazine' | 'compact' | 'card') => void;
  loadFeatureFlags: () => Promise<void>;
  saveFeatureFlags: () => Promise<void>;
}

const STORAGE_KEY = '@amar_desh_feature_flags';
const FEED_LAYOUT_KEY = '@amar_desh_feed_layout';

const defaultFeatures: FeatureFlags = {
  enableExpoImage: true,
  enableNotifications: true,
  enableHaptics: true,
  enableBreakingNews: true,
  enableDailyBriefing: true,
  enableCategoryUpdates: false,
  enableSponsoredCommerce: true,
};

const THEME_KEY = '@amar_desh_theme_preference';

export const useAppStore = create<AppState>((set, get) => ({
  features: defaultFeatures,
  themePreference: null,
  language: 'bn',
  feedLayout: 'magazine',

  setFeatureFlag: (key, value) => {
    set((state) => ({
      features: { ...state.features, [key]: value },
    }));
    get().saveFeatureFlags();
  },

  setThemePreference: (pref) => {
    set({ themePreference: pref });
    // Persist (fire-and-forget)
    AsyncStorage.setItem(THEME_KEY, JSON.stringify(pref)).catch((error) =>
      console.error('Error saving theme preference:', error)
    );
  },

  setLanguage: (lang: SupportedLanguage) => {
    set({ language: lang });
    setAppLanguage(lang).catch((error) =>
      console.error('Error saving language preference:', error)
    );
  },

  setFeedLayout: (layout) => {
    set({ feedLayout: layout });
    AsyncStorage.setItem(FEED_LAYOUT_KEY, JSON.stringify(layout)).catch((error) =>
      console.error('Error saving feed layout:', error)
    );
  },

  loadFeatureFlags: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const features = JSON.parse(stored);
        set({ features: { ...defaultFeatures, ...features } });
      }

      // Load theme preference alongside feature flags
      const themeStored = await AsyncStorage.getItem(THEME_KEY);
      if (themeStored) {
        let pref: unknown = themeStored;
        try {
          pref = JSON.parse(themeStored);
        } catch {
          pref = themeStored;
        }
        if (pref === 'system' || pref === 'light' || pref === 'dark' || pref === 'sepia') {
          set({ themePreference: pref });
        }
      }

      // Load feed layout
      const layoutStored = await AsyncStorage.getItem(FEED_LAYOUT_KEY);
      if (layoutStored) {
        let layout: unknown = layoutStored;
        try {
          layout = JSON.parse(layoutStored);
        } catch {
          layout = layoutStored;
        }
        if (layout === 'magazine' || layout === 'compact') {
          set({ feedLayout: layout });
        }
      }

      // Load language preference
      const langStored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (langStored === 'en' || langStored === 'bn') {
        set({ language: langStored });
        await setAppLanguage(langStored);
      }
    } catch (error) {
      console.error('Error loading feature flags & preferences:', error);
    }
  },

  saveFeatureFlags: async () => {
    try {
      const { features } = get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(features));
    } catch (error) {
      console.error('Error saving feature flags:', error);
    }
  },
}));
