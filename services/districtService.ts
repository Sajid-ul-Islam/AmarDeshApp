import AsyncStorage from '@react-native-async-storage/async-storage';

const DIVISION_STORAGE_KEY = '@amardesh_user_division';

export const BANGLADESH_DIVISIONS = [
  'ঢাকা',
  'চট্টগ্রাম',
  'সিলেট',
  'রাজশাহী',
  'খুলনা',
  'বরিশাল',
  'রংপুর',
  'ময়মনসিংহ',
];

/**
 * Get currently selected user division (defaults to 'ঢাকা')
 */
export async function getSelectedDivision(): Promise<string> {
  try {
    const saved = await AsyncStorage.getItem(DIVISION_STORAGE_KEY);
    if (saved && BANGLADESH_DIVISIONS.includes(saved)) {
      return saved;
    }
  } catch (error) {
    console.warn('Error reading saved division:', error);
  }
  return 'ঢাকা';
}

/**
 * Persist user's preferred division
 */
export async function saveSelectedDivision(division: string): Promise<void> {
  try {
    await AsyncStorage.setItem(DIVISION_STORAGE_KEY, division);
  } catch (error) {
    console.error('Error saving division:', error);
  }
}
