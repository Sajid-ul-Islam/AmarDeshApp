import { create } from 'zustand';

interface AppState {
  isDarkMode: boolean;
  selectedCategory: string;
  bookmarks: string[];
  searchQuery: string;
  toggleDarkMode: () => void;
  setSelectedCategory: (category: string) => void;
  addBookmark: (articleId: string) => void;
  removeBookmark: (articleId: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isDarkMode: false,
  selectedCategory: 'সর্বশেষ',
  bookmarks: [],
  searchQuery: '',
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  addBookmark: (articleId) =>
    set((state) => ({
      bookmarks: [...state.bookmarks, articleId],
    })),
  removeBookmark: (articleId) =>
    set((state) => ({
      bookmarks: state.bookmarks.filter((id) => id !== articleId),
    })),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
