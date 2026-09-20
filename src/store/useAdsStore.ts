import { create } from 'zustand';

export interface Poll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
}

interface AdsState {
  polls: Poll[];
  userVotes: Record<string, string>; // pollId -> optionId
  
  // Actions
  vote: (pollId: string, optionId: string) => void;
  hasVoted: (pollId: string) => boolean;
  getUserVote: (pollId: string) => string | null;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

const STORAGE_KEY = 'amardesh_ads';

// Sample polls
const DEFAULT_POLLS: Poll[] = [
  {
    id: 'poll-1',
    question: 'আপনার মতে দেশের সবচেয়ে জরুরি সমস্যা কী?',
    options: [
      { id: 'a', text: 'দ্রব্যমূল্য', votes: 45 },
      { id: 'b', text: 'দুর্নীতি', votes: 38 },
      { id: 'c', text: 'শিক্ষা', votes: 22 },
      { id: 'd', text: 'স্বাস্থ্য', votes: 18 },
    ],
    totalVotes: 123,
  },
  {
    id: 'poll-2',
    question: 'আপনি কোন মাধ্যমে সংবাদ পড়েন?',
    options: [
      { id: 'a', text: 'মোবাইল অ্যাপ', votes: 67 },
      { id: 'b', text: 'ওয়েবসাইট', votes: 42 },
      { id: 'c', text: 'সোশ্যাল মিডিয়া', votes: 35 },
      { id: 'd', text: 'প্রিন্ট পেপার', votes: 12 },
    ],
    totalVotes: 156,
  },
];

export const useAdsStore = create<AdsState>((set, get) => ({
  polls: DEFAULT_POLLS,
  userVotes: {},

  vote: (pollId, optionId) => {
    set((state) => {
      if (state.userVotes[pollId]) return state; // Already voted
      
      const newPolls = state.polls.map((poll) => {
        if (poll.id !== pollId) return poll;
        return {
          ...poll,
          options: poll.options.map((opt) =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          ),
          totalVotes: poll.totalVotes + 1,
        };
      });
      
      return {
        polls: newPolls,
        userVotes: { ...state.userVotes, [pollId]: optionId },
      };
    });
    get().saveToStorage();
  },

  hasVoted: (pollId) => {
    return !!get().userVotes[pollId];
  },

  getUserVote: (pollId) => {
    return get().userVotes[pollId] || null;
  },

  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        set({
          userVotes: data.userVotes || {},
        });
      }
    } catch {
      // Fall back to defaults
    }
  },

  saveToStorage: () => {
    try {
      const state = get();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        userVotes: state.userVotes,
      }));
    } catch {
      // Ignore storage errors
    }
  },
}));
