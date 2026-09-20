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
  setFeatureFlag: (key: keyof FeatureFlags, value: boolean) => void;
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

export const useAppStore = create<AppState>((set, get) => ({
  features: defaultFeatures,

  setFeatureFlag: (key, value) => {
    set((state) => ({
      features: { ...state.features, [key]: value },
    }));
    get().saveFeatureFlags();
  },

  loadFeatureFlags: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const features = JSON.parse(stored);
        set({ features: { ...defaultFeatures, ...features } });
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
