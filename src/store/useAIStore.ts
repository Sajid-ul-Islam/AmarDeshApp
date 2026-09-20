import { create } from 'zustand';
import { AIProvider, ChatMessage } from '../services/aiService';

interface AIState {
  // API Key Management (BYoak)
  provider: AIProvider;
  apiKey: string;
  model: string;
  isConfigured: boolean;

  // Chat
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setProvider: (provider: AIProvider) => void;
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

const STORAGE_KEY = 'byoak_ai_config';

export const useAIStore = create<AIState>((set, get) => ({
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-2.0-flash',
  isConfigured: false,
  messages: [],
  isLoading: false,
  error: null,

  setProvider: (provider) => {
    set({ provider });
    get().saveToStorage();
  },

  setApiKey: (apiKey) => {
    set({ apiKey, isConfigured: apiKey.length > 0 });
    get().saveToStorage();
  },

  setModel: (model) => {
    set({ model });
    get().saveToStorage();
  },

  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
    get().saveToStorage();
  },

  clearMessages: () => {
    set({ messages: [] });
    get().saveToStorage();
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        set({
          provider: data.provider || 'gemini',
          apiKey: data.apiKey || '',
          model: data.model || 'gemini-2.0-flash',
          isConfigured: (data.apiKey || '').length > 0,
          messages: data.messages || [],
        });
      }
    } catch (error) {
      console.error('Failed to load AI config from storage:', error);
    }
  },

  saveToStorage: () => {
    try {
      const state = get();
      const data = {
        provider: state.provider,
        apiKey: state.apiKey,
        model: state.model,
        messages: state.messages.slice(-50), // Keep last 50 messages
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save AI config to storage:', error);
    }
  },
}));
