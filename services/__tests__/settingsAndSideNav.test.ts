import { t, SupportedLanguage } from '../i18n';
import { useAppStore } from '../../store/useAppStore';
import { saveFontSize, loadFontSize } from '../storage';
import { clearAllCachedArticles, getOfflineArticleCount } from '../offlineDatabase';

describe('One-Stop Settings Hub and Side Navigation Drawer Suite', () => {
  describe('i18n Translations for Settings Hub and Side Nav', () => {
    it('provides Bengali translations for all settings hub and side nav keys', () => {
      expect(t('settings_hub_title', 'bn')).toBe('সেটিংস');
      expect(t('settings_hub_sub', 'bn')).toContain('থিম, এআই, নোটিফিকেশন ও ডেটা');
      expect(t('side_nav_open', 'bn')).toBe('মেনু খুলুন');
      expect(t('side_nav_close', 'bn')).toBe('মেনু বন্ধ করুন');
      expect(t('appearance_title', 'bn')).toBe('ডিসপ্লে ও থিম');
      expect(t('clear_cache', 'bn')).toBe('ক্যাশ মুছুন');
      expect(t('cache_cleared', 'bn')).toBe('ক্যাশ সফলভাবে খালি করা হয়েছে');
      expect(t('feed_layout_label', 'bn')).toBe('লেআউট');
      expect(t('check_updates', 'bn')).toBe('আপডেট পরীক্ষা');
    });

    it('provides English translations for all settings hub and side nav keys', () => {
      expect(t('settings_hub_title', 'en')).toBe('Settings');
      expect(t('settings_hub_sub', 'en')).toContain('Theme, AI, alerts & data');
      expect(t('side_nav_open', 'en')).toBe('Open Menu');
      expect(t('side_nav_close', 'en')).toBe('Close Menu');
      expect(t('appearance_title', 'en')).toBe('Display & Theme');
      expect(t('clear_cache', 'en')).toBe('Clear Cache');
      expect(t('cache_cleared', 'en')).toBe('Offline cache cleared successfully');
      expect(t('feed_layout_label', 'en')).toBe('Layout');
      expect(t('check_updates', 'en')).toBe('Check Updates');
    });
  });

  describe('Font Size Preferences Integration', () => {
    it('persists and loads font size setting S, M, L, XL', async () => {
      await saveFontSize('L');
      let loaded = await loadFontSize();
      expect(loaded).toBe('L');

      await saveFontSize('XL');
      loaded = await loadFontSize();
      expect(loaded).toBe('XL');

      await saveFontSize('M');
      loaded = await loadFontSize();
      expect(loaded).toBe('M');
    });
  });

  describe('Offline Database Cache Purge', () => {
    it('successfully calls clearAllCachedArticles without throwing', async () => {
      const initialCount = await getOfflineArticleCount();
      expect(typeof initialCount).toBe('number');

      const cleared = await clearAllCachedArticles();
      expect(typeof cleared).toBe('number');

      const newCount = await getOfflineArticleCount();
      expect(newCount).toBe(0);
    });
  });

  describe('Store Preferences Integration for Unified Settings', () => {
    it('supports 3-way theme preference switching', () => {
      const store = useAppStore.getState();

      store.setThemePreference('sepia');
      expect(useAppStore.getState().themePreference).toBe('sepia');

      store.setThemePreference('dark');
      expect(useAppStore.getState().themePreference).toBe('dark');

      store.setThemePreference('light');
      expect(useAppStore.getState().themePreference).toBe('light');
    });

    it('supports dual language selection bn and en', () => {
      const store = useAppStore.getState();

      store.setLanguage('en');
      expect(useAppStore.getState().language).toBe('en');

      store.setLanguage('bn');
      expect(useAppStore.getState().language).toBe('bn');
    });

    it('supports magazine and compact feed layout choices', () => {
      const store = useAppStore.getState();

      store.setFeedLayout('compact');
      expect(useAppStore.getState().feedLayout).toBe('compact');

      store.setFeedLayout('magazine');
      expect(useAppStore.getState().feedLayout).toBe('magazine');
    });
  });
});
