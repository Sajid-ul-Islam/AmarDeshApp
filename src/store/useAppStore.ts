import { create } from 'zustand';
import { FeatureFlags } from './useLayoutStore';

export type FeedMode = 'list' | 'cards';

interface AppState {
  isDarkMode: boolean;
  selectedCategory: string;
  bookmarks: string[];
  searchQuery: string;
  feedMode: FeedMode;

  // Feature flags (Group A)
  features: FeatureFlags;

  // Actions
  toggleDarkMode: () => void;
  setSelectedCategory: (category: string) => void;
  addBookmark: (articleId: string) => void;
  removeBookmark: (articleId: string) => void;
  setSearchQuery: (query: string) => void;
  setFeedMode: (mode: FeedMode) => void;
  toggleFeature: (feature: keyof FeatureFlags) => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

const STORAGE_KEY = 'amardesh_app_state';

// Default: all features enabled
const DEFAULT_FEATURES: FeatureFlags = {
  // Group A
  groupACoreUx: true,
  dragDropReorder: true,
  forYouTab: true,
  swipeCardFeed: true,
  hyperLocalFeed: true,
  // Group B
  groupBMultimodal: true,
  ttsListenMode: true,
  audioPlaylist: true,
  threeMinUpdate: true,
  verticalVideo: true,
  miniPlayer: true,
  // Group C
  groupCCommunity: true,
  emojiReactions: true,
  comments: true,
  mostCommented: true,
  readingStreak: true,
  // Group D
  groupDUtility: true,
  offlineMode: true,
  continueReading: true,
  fontSizeControl: true,
  enhancedSearch: true,
  smartSummary: true,
  // Group E
  groupECommercial: true,
  giftArticle: true,
  interactiveAds: true,
  customizableNav: true,
};

export const useAppStore = create<AppState>((set, get) => ({
  isDarkMode: false,
  selectedCategory: 'সর্বশেষ',
  bookmarks: [],
  searchQuery: '',
  feedMode: 'list',
  features: DEFAULT_FEATURES,

  toggleDarkMode: () => {
    set((state) => ({ isDarkMode: !state.isDarkMode }));
    get().saveToStorage();
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    get().saveToStorage();
  },

  addBookmark: (articleId) => {
    set((state) => ({
      bookmarks: [...state.bookmarks, articleId],
    }));
    get().saveToStorage();
  },

  removeBookmark: (articleId) => {
    set((state) => ({
      bookmarks: state.bookmarks.filter((id) => id !== articleId),
    }));
    get().saveToStorage();
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setFeedMode: (mode) => {
    set({ feedMode: mode });
    get().saveToStorage();
  },

  toggleFeature: (feature) => {
    set((state) => ({
      features: {
        ...state.features,
        [feature]: !state.features[feature],
      },
    }));
    get().saveToStorage();
  },

  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        set({
          isDarkMode: data.isDarkMode ?? false,
          selectedCategory: data.selectedCategory ?? 'সর্বশেষ',
          bookmarks: data.bookmarks ?? [],
          feedMode: data.feedMode ?? 'list',
          features: { ...DEFAULT_FEATURES, ...(data.features ?? {}) },
        });
      }
    } catch {
      // Fall back to defaults
    }
  },

  saveToStorage: () => {
    try {
      const state = get();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isDarkMode: state.isDarkMode,
          selectedCategory: state.selectedCategory,
          bookmarks: state.bookmarks,
          feedMode: state.feedMode,
          features: state.features,
        })
      );
    } catch {
      // Ignore storage errors
    }
  },
}));
