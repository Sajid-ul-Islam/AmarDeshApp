import { create } from 'zustand';

interface LocationState {
  selectedDivision: string | null;
  selectedDistrict: string | null;

  // Actions
  setLocation: (division: string, district: string) => void;
  clearLocation: () => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

const STORAGE_KEY = 'amardesh_location';

export const useLocationStore = create<LocationState>((set, get) => ({
  selectedDivision: null,
  selectedDistrict: null,

  setLocation: (division, district) => {
    set({ selectedDivision: division, selectedDistrict: district });
    get().saveToStorage();
  },

  clearLocation: () => {
    set({ selectedDivision: null, selectedDistrict: null });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  },

  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        set({
          selectedDivision: data.division || null,
          selectedDistrict: data.district || null,
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
          division: state.selectedDivision,
          district: state.selectedDistrict,
        })
      );
    } catch {
      // Ignore
    }
  },
}));
