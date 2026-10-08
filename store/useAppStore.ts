import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SupportedLanguage,
  LANGUAGE_STORAGE_KEY,
  setAppLanguage,
} from '../services/i18n';
import {
  DEFAULT_FONT_PREFERENCE,
  FONT_OPTIONS,
  type FontPreference,
} from '../services/fontService';

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
   * User's theme preference.
   *
   * `'system'` is the single "follow the OS" representation — it used to be
   * `null` at runtime while `'system'` was what got persisted, so reloading a
   * saved choice could disagree with the in-memory default. The provider maps
   * `'system'` to the OS scheme.
   */
  themePreference: ThemePreference;
  /**
   * User's app language: 'bn' (Bengali) or 'en' (English).
   */
  language: SupportedLanguage;
  /**
   * Home feed presentation layout: 'magazine' (large cards), 'compact' (dense list), or 'card' (swipeable deck).
   */
  feedLayout: FeedLayout;
  /**
   * Reduces data usage: smaller images and a shorter feed.
   */
  lowDataMode: boolean;
  /**
   * Selected typography profile. Defaults to the publisher's own family, which
   * is what the website uses for body copy.
   */
  fontPreference: FontPreference;
  setFeatureFlag: (key: keyof FeatureFlags, value: boolean) => void;
  setThemePreference: (pref: ThemePreference) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  setFeedLayout: (layout: FeedLayout) => void;
  setLowDataMode: (enabled: boolean) => void;
  setFontPreference: (pref: FontPreference) => void;
  loadFeatureFlags: () => Promise<void>;
  saveFeatureFlags: () => Promise<void>;
}

export type ThemePreference = 'system' | 'light' | 'dark' | 'sepia';
export type FeedLayout = 'magazine' | 'compact' | 'card';

const STORAGE_KEY = '@amar_desh_feature_flags';
const FEED_LAYOUT_KEY = '@amar_desh_feed_layout';
const LOW_DATA_KEY = '@amar_desh_low_data_mode';
const FONT_KEY = '@amar_desh_font_preference';

/** Every layout the feed supports. Kept next to the loader that validates it. */
const FEED_LAYOUTS: readonly FeedLayout[] = ['magazine', 'compact', 'card'];
/** Every selectable font profile, derived from the font service. */
const FONT_PREFERENCES: readonly FontPreference[] = FONT_OPTIONS.map((o) => o.key);
const THEME_PREFERENCES: readonly ThemePreference[] = [
  'system',
  'light',
  'dark',
  'sepia',
];

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

/**
 * Read a persisted value that may be JSON-encoded, a bare string, or a legacy
 * plain value. Retained so preferences written by earlier app versions still
 * load instead of silently reverting to defaults.
 */
function parseStoredValue(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  features: defaultFeatures,
  themePreference: 'system',
  language: 'bn',
  feedLayout: 'magazine',
  lowDataMode: false,
  fontPreference: DEFAULT_FONT_PREFERENCE,

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

  setLowDataMode: (enabled) => {
    set({ lowDataMode: enabled });
    AsyncStorage.setItem(LOW_DATA_KEY, JSON.stringify(enabled)).catch((error) =>
      console.error('Error saving low data mode:', error)
    );
  },

  setFontPreference: (pref) => {
    set({ fontPreference: pref });
    AsyncStorage.setItem(FONT_KEY, JSON.stringify(pref)).catch((error) =>
      console.error('Error saving font preference:', error)
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
        const pref = parseStoredValue(themeStored);
        if (THEME_PREFERENCES.includes(pref as ThemePreference)) {
          set({ themePreference: pref as ThemePreference });
        }
      }

      // Load feed layout. Must accept every layout the setter can persist —
      // 'card' was previously omitted here, so the swipeable deck silently
      // reverted to the magazine layout on every relaunch.
      const layoutStored = await AsyncStorage.getItem(FEED_LAYOUT_KEY);
      if (layoutStored) {
        const layout = parseStoredValue(layoutStored);
        if (FEED_LAYOUTS.includes(layout as FeedLayout)) {
          set({ feedLayout: layout as FeedLayout });
        }
      }

      // Load low-data mode
      const lowDataStored = await AsyncStorage.getItem(LOW_DATA_KEY);
      if (lowDataStored !== null) {
        set({ lowDataMode: lowDataStored === 'true' || parseStoredValue(lowDataStored) === true });
      }

      // Load font preference
      const fontStored = await AsyncStorage.getItem(FONT_KEY);
      if (fontStored) {
        const font = parseStoredValue(fontStored);
        if (FONT_PREFERENCES.includes(font as FontPreference)) {
          set({ fontPreference: font as FontPreference });
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
