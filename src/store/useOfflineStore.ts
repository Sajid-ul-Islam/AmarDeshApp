import { create } from 'zustand';
import { Article } from '../types';

interface OfflineState {
  downloadedArticles: Article[];
  isDownloading: boolean;
  
  // Actions
  downloadArticle: (article: Article) => Promise<void>;
  removeArticle: (articleId: string) => void;
  isArticleDownloaded: (articleId: string) => boolean;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

const STORAGE_KEY = 'amardesh_offline';

export const useOfflineStore = create<OfflineState>((set, get) => ({
  downloadedArticles: [],
  isDownloading: false,

  downloadArticle: async (article) => {
    set({ isDownloading: true });
    
    try {
      // Simulate download delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      set((state) => ({
        downloadedArticles: [...state.downloadedArticles, article],
        isDownloading: false,
      }));
      
      get().saveToStorage();
    } catch (error) {
      console.error('Failed to download article:', error);
      set({ isDownloading: false });
    }
  },

  removeArticle: (articleId) => {
    set((state) => ({
      downloadedArticles: state.downloadedArticles.filter((a) => a.id !== articleId),
    }));
    get().saveToStorage();
  },

  isArticleDownloaded: (articleId) => {
    return get().downloadedArticles.some((a) => a.id === articleId);
  },

  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const articles = JSON.parse(stored);
        set({ downloadedArticles: articles });
      }
    } catch {
      // Fall back to defaults
    }
  },

  saveToStorage: () => {
    try {
      const state = get();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.downloadedArticles));
    } catch {
      // Ignore storage errors
    }
  },
}));
