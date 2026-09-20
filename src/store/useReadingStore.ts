import { create } from 'zustand';

export type FontSize = 'S' | 'M' | 'L' | 'XL';

interface ReadingState {
  fontSize: FontSize;
  scrollPositions: Record<string, number>; // articleId -> scrollPosition
  
  // Actions
  setFontSize: (size: FontSize) => void;
  saveScrollPosition: (articleId: string, position: number) => void;
  getScrollPosition: (articleId: string) => number | null;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

const STORAGE_KEY = 'amardesh_reading';

export const useReadingStore = create<ReadingState>((set, get) => ({
  fontSize: 'M',
  scrollPositions: {},

  setFontSize: (size) => {
    set({ fontSize: size });
    get().saveToStorage();
  },

  saveScrollPosition: (articleId, position) => {
    set((state) => ({
      scrollPositions: { ...state.scrollPositions, [articleId]: position },
    }));
    get().saveToStorage();
  },

  getScrollPosition: (articleId) => {
    return get().scrollPositions[articleId] || null;
  },

  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        set({
          fontSize: data.fontSize || 'M',
          scrollPositions: data.scrollPositions || {},
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
          fontSize: state.fontSize,
          scrollPositions: state.scrollPositions,
        })
      );
    } catch {
      // Ignore storage errors
    }
  },
}));
