import { create } from 'zustand';

interface PreferencesState {
  // User preferences
  followedCategories: string[];
  readingHistory: string[]; // Article IDs (last 50)
  inferredInterests: string[]; // Categories inferred from reading

  // Actions
  followCategory: (category: string) => void;
  unfollowCategory: (category: string) => void;
  addToHistory: (articleId: string, category: string) => void;
  clearHistory: () => void;
  updateInferredInterests: () => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

const STORAGE_KEY = 'amardesh_preferences';
const MAX_HISTORY = 50;

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  followedCategories: [],
  readingHistory: [],
  inferredInterests: [],

  followCategory: (category) => {
    set((state) => {
      if (state.followedCategories.includes(category)) {
        return state; // Already followed
      }
      return { followedCategories: [...state.followedCategories, category] };
    });
    get().saveToStorage();
  },

  unfollowCategory: (category) => {
    set((state) => ({
      followedCategories: state.followedCategories.filter((c) => c !== category),
    }));
    get().saveToStorage();
  },

  addToHistory: (articleId, category) => {
    set((state) => {
      // Remove if already exists (to move to top)
      const filtered = state.readingHistory.filter((id) => id !== articleId);
      // Add to front
      const newHistory = [articleId, ...filtered].slice(0, MAX_HISTORY);
      return { readingHistory: newHistory };
    });

    // Update inferred interests based on recent history
    get().updateInferredInterests();
    get().saveToStorage();
  },

  clearHistory: () => {
    set({ readingHistory: [], inferredInterests: [] });
    get().saveToStorage();
  },

  updateInferredInterests: () => {
    const { readingHistory } = get();
    
    // Count categories from recent history (last 20 articles)
    const categoryCount: Record<string, number> = {};
    const recentHistory = readingHistory.slice(0, 20);
    
    // This would need article data to map IDs to categories
    // For now, we'll use a simplified approach
    // In real implementation, we'd need to fetch article metadata
    
    // Sort by count and take top 3
    const sorted = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([cat]) => cat);
    
    set({ inferredInterests: sorted });
  },

  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        set({
          followedCategories: data.followedCategories || [],
          readingHistory: data.readingHistory || [],
          inferredInterests: data.inferredInterests || [],
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
          followedCategories: state.followedCategories,
          readingHistory: state.readingHistory,
          inferredInterests: state.inferredInterests,
        })
      );
    } catch {
      // Ignore storage errors
    }
  },
}));
