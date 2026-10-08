import { getThemeTokens } from '../../theme/tokens';
import { useAppStore } from '../../store/useAppStore';
import { DEFAULT_STORIES } from '../../data/storiesData';
import { DEFAULT_RATES } from '../../data/ratesData';

describe('UI/UX Upgrades and Enhancement Tokens', () => {
  describe('Sepia Theme Tokens (সংবাদপত্র সেপিয়া)', () => {
    it('provides specialized sepia parchment palette and contrast-compliant colors', () => {
      const sepiaTokens = getThemeTokens('sepia');

      expect(sepiaTokens.surface.base).toBe('#f4ebd9');
      expect(sepiaTokens.surface.subtle).toBe('#ebdcc4');
      expect(sepiaTokens.text.primary).toBe('#2c221e');
      expect(sepiaTokens.text.secondary).toBe('#6c5b51');
      expect(sepiaTokens.brand.primary).toBe('#9e1b1b');
      expect(sepiaTokens.border.default).toBe('#ded1bb');

      // Verify sepia shadows exist and have warm tint
      expect(sepiaTokens.shadows.card).toBeDefined();
      expect(sepiaTokens.shadows.card.shadowColor).toBe('#3c2e24');
    });

    it('returns standard light and dark tokens consistently', () => {
      const lightTokens = getThemeTokens('light');
      const darkTokens = getThemeTokens('dark');

      expect(lightTokens.surface.base).toBe('#fbf9f5');
      expect(lightTokens.text.primary).toBe('#121212');

      expect(darkTokens.surface.base).toBe('#0a0a0a');
      expect(darkTokens.text.primary).toBe('#f5f5f7');
    });
  });

  describe('Feed Layout and Theme Preferences Store', () => {
    it('allows toggling themePreference to sepia, dark, and light', () => {
      const store = useAppStore.getState();

      store.setThemePreference('sepia');
      expect(useAppStore.getState().themePreference).toBe('sepia');

      store.setThemePreference('dark');
      expect(useAppStore.getState().themePreference).toBe('dark');

      store.setThemePreference('light');
      expect(useAppStore.getState().themePreference).toBe('light');

      store.setThemePreference('system');
      expect(useAppStore.getState().themePreference).toBe('system');
    });

    it('allows switching feedLayout between magazine and compact', () => {
      const store = useAppStore.getState();

      store.setFeedLayout('compact');
      expect(useAppStore.getState().feedLayout).toBe('compact');

      store.setFeedLayout('magazine');
      expect(useAppStore.getState().feedLayout).toBe('magazine');
    });
  });

  describe('Visual Web Stories Integrity', () => {
    it('provides valid story items with full visual schema', () => {
      expect(DEFAULT_STORIES.length).toBeGreaterThanOrEqual(4);

      for (const story of DEFAULT_STORIES) {
        expect(story.id).toBeDefined();
        expect(story.articleId).toBeDefined();
        expect(story.category).toBeDefined();
        expect(story.title.length).toBeGreaterThan(0);
        expect(story.takeaway.length).toBeGreaterThan(0);
        expect(story.imageUrl).toMatch(/^https:\/\//);
        expect(story.publishedAt).toBeDefined();
      }
    });
  });

  describe('Live Rates and Sports Ticker Integrity', () => {
    it('contains real-time indicators for cricket, stock, currency, and gold', () => {
      expect(DEFAULT_RATES.length).toBe(4);

      const categories = DEFAULT_RATES.map((r) => r.category);
      expect(categories).toContain('cricket');
      expect(categories).toContain('stock');
      expect(categories).toContain('currency');
      expect(categories).toContain('gold');

      for (const item of DEFAULT_RATES) {
        expect(item.id).toBeDefined();
        expect(item.title).toBeDefined();
        expect(item.value).toBeDefined();
        expect(item.icon).toBeDefined();
      }
    });
  });
});
