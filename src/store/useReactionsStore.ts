import { create } from 'zustand';

export type EmojiReaction = '❤️' | '😂' | '😮' | '😢' | '😡';

interface Comment {
  id: string;
  articleId: string;
  text: string;
  author: string;
  timestamp: number;
  likes: number;
}

interface ReactionsState {
  // Emoji reactions
  reactions: Record<string, Record<EmojiReaction, number>>; // articleId -> {emoji -> count}
  userReactions: Record<string, EmojiReaction>; // articleId -> user's reaction
  
  // Comments
  comments: Comment[];
  
  // Reading streak
  streak: number;
  lastReadDate: string; // YYYY-MM-DD
  points: number;
  
  // Actions
  addReaction: (articleId: string, emoji: EmojiReaction) => void;
  removeReaction: (articleId: string) => void;
  addComment: (articleId: string, text: string, author: string) => void;
  likeComment: (commentId: string) => void;
  getCommentsForArticle: (articleId: string) => Comment[];
  incrementStreak: () => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

const STORAGE_KEY = 'amardesh_reactions';

export const useReactionsStore = create<ReactionsState>((set, get) => ({
  reactions: {},
  userReactions: {},
  comments: [],
  streak: 0,
  lastReadDate: '',
  points: 0,

  addReaction: (articleId, emoji) => {
    set((state) => {
      const currentReaction = state.userReactions[articleId];
      const newReactions = { ...state.reactions };
      const newUserReactions = { ...state.userReactions };
      
      // Remove old reaction if exists
      if (currentReaction) {
        newReactions[articleId] = { ...newReactions[articleId] };
        newReactions[articleId][currentReaction] = Math.max(0, (newReactions[articleId][currentReaction] || 0) - 1);
      }
      
      // Add new reaction
      if (!newReactions[articleId]) {
        newReactions[articleId] = { '❤️': 0, '😂': 0, '😮': 0, '😢': 0, '😡': 0 };
      }
      newReactions[articleId][emoji] = (newReactions[articleId][emoji] || 0) + 1;
      newUserReactions[articleId] = emoji;
      
      return { reactions: newReactions, userReactions: newUserReactions };
    });
    get().saveToStorage();
  },

  removeReaction: (articleId) => {
    set((state) => {
      const currentReaction = state.userReactions[articleId];
      if (!currentReaction) return state;
      
      const newReactions = { ...state.reactions };
      const newUserReactions = { ...state.userReactions };
      
      if (newReactions[articleId]) {
        newReactions[articleId] = { ...newReactions[articleId] };
        newReactions[articleId][currentReaction] = Math.max(0, (newReactions[articleId][currentReaction] || 0) - 1);
      }
      
      delete newUserReactions[articleId];
      
      return { reactions: newReactions, userReactions: newUserReactions };
    });
    get().saveToStorage();
  },

  addComment: (articleId, text, author) => {
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      articleId,
      text,
      author,
      timestamp: Date.now(),
      likes: 0,
    };
    
    set((state) => ({
      comments: [...state.comments, comment],
    }));
    get().saveToStorage();
  },

  likeComment: (commentId) => {
    set((state) => ({
      comments: state.comments.map((c) =>
        c.id === commentId ? { ...c, likes: c.likes + 1 } : c
      ),
    }));
    get().saveToStorage();
  },

  getCommentsForArticle: (articleId) => {
    return get().comments.filter((c) => c.articleId === articleId);
  },

  incrementStreak: () => {
    const today = new Date().toISOString().split('T')[0];
    const state = get();
    
    if (state.lastReadDate === today) return; // Already counted today
    
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const newStreak = state.lastReadDate === yesterday ? state.streak + 1 : 1;
    
    set({
      streak: newStreak,
      lastReadDate: today,
      points: state.points + 10,
    });
    get().saveToStorage();
  },

  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        set({
          reactions: data.reactions || {},
          userReactions: data.userReactions || {},
          comments: data.comments || [],
          streak: data.streak || 0,
          lastReadDate: data.lastReadDate || '',
          points: data.points || 0,
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
          reactions: state.reactions,
          userReactions: state.userReactions,
          comments: state.comments,
          streak: state.streak,
          lastReadDate: state.lastReadDate,
          points: state.points,
        })
      );
    } catch {
      // Ignore storage errors
    }
  },
}));
