import { create } from 'zustand';
import { Article } from '../types';
import * as tts from '../services/ttsService';

interface PlayerState {
  // Current playback
  currentArticle: Article | null;
  isPlaying: boolean;
  isPaused: boolean;
  playbackRate: number;
  progress: number; // 0-100
  
  // Queue
  queue: Article[];
  queueIndex: number;
  
  // Actions
  play: (article: Article) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setRate: (rate: number) => void;
  setProgress: (progress: number) => void;
  addToQueue: (article: Article) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentArticle: null,
  isPlaying: false,
  isPaused: false,
  playbackRate: 1.0,
  progress: 0,
  queue: [],
  queueIndex: -1,

  play: (article: Article) => {
    const state = get();
    
    // Stop current playback
    tts.stop();
    
    // Start new playback
    set({
      currentArticle: article,
      isPlaying: true,
      isPaused: false,
      progress: 0,
    });
    
    // Speak the article
    const fullText = `${article.title}. ${article.excerpt}. ${article.content}`;
    
    tts.speak(
      fullText,
      () => {
        // On end
        set({ isPlaying: false, progress: 100 });
        // Auto-play next if in queue
        const nextState = get();
        if (nextState.queueIndex < nextState.queue.length - 1) {
          setTimeout(() => get().playNext(), 500);
        }
      },
      (charIndex) => {
        // On boundary - update progress
        const totalChars = fullText.length;
        const progress = (charIndex / totalChars) * 100;
        set({ progress: Math.min(progress, 100) });
      }
    );
  },

  pause: () => {
    tts.pause();
    set({ isPaused: true });
  },

  resume: () => {
    tts.resume();
    set({ isPaused: false });
  },

  stop: () => {
    tts.stop();
    set({
      currentArticle: null,
      isPlaying: false,
      isPaused: false,
      progress: 0,
    });
  },

  setRate: (rate: number) => {
    tts.setRate(rate);
    set({ playbackRate: rate });
    
    // If currently playing, restart with new rate
    const state = get();
    if (state.isPlaying && state.currentArticle) {
      get().play(state.currentArticle);
    }
  },

  setProgress: (progress: number) => {
    set({ progress });
  },

  addToQueue: (article: Article) => {
    const state = get();
    const newQueue = [...state.queue, article];
    set({ queue: newQueue });
    
    // If nothing playing, start this article
    if (!state.currentArticle) {
      set({ queueIndex: newQueue.length - 1 });
      get().play(article);
    }
  },

  removeFromQueue: (index: number) => {
    const state = get();
    const newQueue = state.queue.filter((_, i) => i !== index);
    let newQueueIndex = state.queueIndex;
    
    // Adjust index if needed
    if (index < state.queueIndex) {
      newQueueIndex--;
    } else if (index === state.queueIndex) {
      // Removed current, play next
      if (newQueueIndex < newQueue.length) {
        get().play(newQueue[newQueueIndex]);
      } else {
        get().stop();
      }
    }
    
    set({ queue: newQueue, queueIndex: newQueueIndex });
  },

  clearQueue: () => {
    set({ queue: [], queueIndex: -1 });
    get().stop();
  },

  playNext: () => {
    const state = get();
    if (state.queueIndex < state.queue.length - 1) {
      const nextIndex = state.queueIndex + 1;
      const nextArticle = state.queue[nextIndex];
      set({ queueIndex: nextIndex });
      get().play(nextArticle);
    }
  },

  playPrevious: () => {
    const state = get();
    if (state.queueIndex > 0) {
      const prevIndex = state.queueIndex - 1;
      const prevArticle = state.queue[prevIndex];
      set({ queueIndex: prevIndex });
      get().play(prevArticle);
    }
  },
}));
