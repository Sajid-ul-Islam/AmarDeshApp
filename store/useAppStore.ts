import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FeatureFlags {
  enableExpoImage: boolean;
  enableNotifications: boolean;
  enableHaptics: boolean;
  enableBreakingNews: boolean;
  enableDailyBriefing: boolean;
  enableCategoryUpdates: boolean;
}

interface AppState {
  features: FeatureFlags;
  /**
   * User's theme preference: system (default), light, or dark.
   * `null` means follow the system setting.
   */
  themePreference: 'system' | 'light' | 'dark' | null;
  setFeatureFlag: (key: keyof FeatureFlags, value: boolean) => void;
  setThemePreference: (pref: 'system' | 'light' | 'dark') => void;
  loadFeatureFlags: () => Promise<void>;
  saveFeatureFlags: () => Promise<void>;
}

const STORAGE_KEY = '@amar_desh_feature_flags';

const defaultFeatures: FeatureFlags = {
  enableExpoImage: true,
  enableNotifications: true,
  enableHaptics: true,
  enableBreakingNews: true,
  enableDailyBriefing: true,
  enableCategoryUpdates: false,
};

const THEME_KEY = '@amar_desh_theme_preference';

export const useAppStore = create<AppState>((set, get) => ({
  features: defaultFeatures,
  themePreference: null,

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
        const pref = JSON.parse(themeStored) as AppState['themePreference'];
        if (pref === 'system' || pref === 'light' || pref === 'dark') {
          set({ themePreference: pref });
        }
      }
    } catch (error) {
      console.error('Error loading feature flags:', error);
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
