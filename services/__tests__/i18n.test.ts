import {
  t,
  setAppLanguage,
  getCurrentLanguage,
  getSavedLanguage,
  subscribeLanguageChange,
  formatLocalizedNumeral,
  formatLocalizedRelativeTime,
  getLocalizedCategoryName,
  TRANSLATIONS,
} from '../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('i18n Localization Service', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await setAppLanguage('bn');
  });

  describe('Translation Key Lookups', () => {
    it('returns Bengali strings by default or when language is bn', () => {
      expect(t('tab_home')).toBe('হোম');
      expect(t('app_motto')).toBe('স্বাধীনতার কথা বলে');
      expect(t('breaking_news')).toBe('ব্রেকিং নিউজ');
    });

    it('returns English strings when language is set to en', async () => {
      await setAppLanguage('en');
      expect(t('tab_home')).toBe('Home');
      expect(t('app_motto')).toBe('Voice of Freedom');
      expect(t('breaking_news')).toBe('BREAKING NEWS');
    });

    it('supports language override parameter', () => {
      expect(t('tab_home', 'en')).toBe('Home');
      expect(t('tab_home', 'bn')).toBe('হোম');
    });

    it('has identical keys for both bn and en dictionaries', () => {
      const bnKeys = Object.keys(TRANSLATIONS.bn).sort();
      const enKeys = Object.keys(TRANSLATIONS.en).sort();
      expect(bnKeys).toEqual(enKeys);
    });
  });

  describe('Language State Management & Persistence', () => {
    it('updates current language and notifies subscribers', async () => {
      const listener = jest.fn();
      const unsubscribe = subscribeLanguageChange(listener);

      await setAppLanguage('en');
      expect(getCurrentLanguage()).toBe('en');
      expect(listener).toHaveBeenCalledWith('en');

      unsubscribe();
      await setAppLanguage('bn');
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('persists and restores language choice from AsyncStorage', async () => {
      await setAppLanguage('en');
      const loaded = await getSavedLanguage();
      expect(loaded).toBe('en');
    });
  });

  describe('Numeral Localization', () => {
    it('formats numbers into Bengali numerals when lang is bn', () => {
      expect(formatLocalizedNumeral(1234, 'bn')).toBe('১২৩৪');
      expect(formatLocalizedNumeral('5678', 'bn')).toBe('৫৬৭৮');
    });

    it('formats numbers into Western Arabic numerals when lang is en', () => {
      expect(formatLocalizedNumeral(1234, 'en')).toBe('1234');
      expect(formatLocalizedNumeral('5678', 'en')).toBe('5678');
    });
  });

  describe('Relative Time Localization', () => {
    it('formats relative times in Bengali', () => {
      const now = new Date();
      const justNow = new Date(now.getTime() - 10000).toISOString();
      const tenMinsAgo = new Date(now.getTime() - 10 * 60000).toISOString();
      const twoHoursAgo = new Date(now.getTime() - 2 * 3600000).toISOString();

      expect(formatLocalizedRelativeTime(justNow, 'bn')).toBe('এইমাত্র');
      expect(formatLocalizedRelativeTime(tenMinsAgo, 'bn')).toBe('১০ মিনিট আগে');
      expect(formatLocalizedRelativeTime(twoHoursAgo, 'bn')).toBe('২ ঘণ্টা আগে');
    });

    it('formats relative times in English', () => {
      const now = new Date();
      const justNow = new Date(now.getTime() - 10000).toISOString();
      const tenMinsAgo = new Date(now.getTime() - 10 * 60000).toISOString();
      const twoHoursAgo = new Date(now.getTime() - 2 * 3600000).toISOString();

      expect(formatLocalizedRelativeTime(justNow, 'en')).toBe('Just now');
      expect(formatLocalizedRelativeTime(tenMinsAgo, 'en')).toBe('10m ago');
      expect(formatLocalizedRelativeTime(twoHoursAgo, 'en')).toBe('2h ago');
    });
  });

  describe('Category Localization', () => {
    it('preserves Bengali category names when lang is bn', () => {
      expect(getLocalizedCategoryName('জাতীয়', 'bn')).toBe('জাতীয়');
      expect(getLocalizedCategoryName('রাজনীতি', 'bn')).toBe('রাজনীতি');
      expect(getLocalizedCategoryName('অর্থনীতি', 'bn')).toBe('অর্থনীতি');
    });

    it('maps Bengali category names to English when lang is en', () => {
      expect(getLocalizedCategoryName('জাতীয়', 'en')).toBe('National');
      expect(getLocalizedCategoryName('রাজনীতি', 'en')).toBe('Politics');
      expect(getLocalizedCategoryName('অর্থনীতি', 'en')).toBe('Economy');
      expect(getLocalizedCategoryName('জুলাই বিপ্লব', 'en')).toBe('July Revolution');
      expect(getLocalizedCategoryName('খেলা', 'en')).toBe('Sports');
    });

    it('falls back to input string if translation is not mapped', () => {
      expect(getLocalizedCategoryName('অজানা বিভাগ', 'en')).toBe('অজানা বিভাগ');
    });
  });
});
