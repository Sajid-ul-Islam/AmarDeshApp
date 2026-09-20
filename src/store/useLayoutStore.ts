import { create } from 'zustand';

// Feature flags for Group A - Core UX & Personalization
export interface FeatureFlags {
  groupACoreUx: boolean;     // Master kill switch
  dragDropReorder: boolean;  // A1: User-reorderable sections
  forYouTab: boolean;        // A2: For You / My News tab
  swipeCardFeed: boolean;    // A3: Dual nav toggle (list ↔ cards)
  hyperLocalFeed: boolean;   // A4: District-based filter
}

interface LayoutState {
  // Section order (default order)
  sectionOrder: string[];
  isEditMode: boolean;

  // Actions
  reorderSections: (fromIndex: number, toIndex: number) => void;
  resetToDefault: () => void;
  setEditMode: (mode: boolean) => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

export const DEFAULT_SECTION_ORDER = [
  'liveIndicator',
  'prayerTimes',
  'heroArticle',
  'newsGrid',
  'mostRead',
  'moreArticles',
];

const STORAGE_KEY = 'amardesh_layout';

export const useLayoutStore = create<LayoutState>((set, get) => ({
  sectionOrder: DEFAULT_SECTION_ORDER,
  isEditMode: false,

  reorderSections: (fromIndex, toIndex) => {
    set((state) => {
      const newOrder = [...state.sectionOrder];
      const [moved] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, moved);
      return { sectionOrder: newOrder };
    });
    get().saveToStorage();
  },

  resetToDefault: () => {
    set({ sectionOrder: DEFAULT_SECTION_ORDER });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  },

  setEditMode: (mode) => set({ isEditMode: mode }),

  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length === DEFAULT_SECTION_ORDER.length) {
          // Validate all sections are present
          const allPresent = DEFAULT_SECTION_ORDER.every((s) => parsed.includes(s));
          if (allPresent) {
            set({ sectionOrder: parsed });
          }
        }
      }
    } catch {
      // Fall back to default
    }
  },

  saveToStorage: () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(get().sectionOrder));
    } catch {
      // Ignore storage errors
    }
  },
}));
