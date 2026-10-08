import { useAppStore } from '../../store/useAppStore';
import { articles } from '../../data/mockData';
import { getLocalizedCategoryName, formatLocalizedNumeral, formatLocalizedRelativeTime } from '../i18n';

describe('Card Sliders & Landing Page Byline Toolbar', () => {
  beforeEach(() => {
    useAppStore.setState({ feedLayout: 'magazine', language: 'bn' });
  });

  it('supports cycling feed layouts: magazine -> compact -> card -> magazine', () => {
    const store = useAppStore.getState();

    expect(store.feedLayout).toBe('magazine');

    store.setFeedLayout('compact');
    expect(useAppStore.getState().feedLayout).toBe('compact');

    store.setFeedLayout('card');
    expect(useAppStore.getState().feedLayout).toBe('card');

    store.setFeedLayout('magazine');
    expect(useAppStore.getState().feedLayout).toBe('magazine');
  });

  it('provides up to 5 featured stories for the FeaturedCardSlider', () => {
    const featuredArticles = articles.slice(0, 5);
    expect(featuredArticles.length).toBeLessThanOrEqual(5);
    expect(featuredArticles.length).toBeGreaterThan(0);

    const first = featuredArticles[0];
    expect(first.title).toBeDefined();
    expect(first.imageUrl).toBeDefined();
    expect(first.category).toBeDefined();
  });

  it('formats numerals and relative time cleanly in both Bengali and English', () => {
    expect(formatLocalizedNumeral(1, 'bn')).toBe('১');
    expect(formatLocalizedNumeral(5, 'bn')).toBe('৫');
    expect(formatLocalizedNumeral(1, 'en')).toBe('1');
    expect(formatLocalizedNumeral(5, 'en')).toBe('5');

    const recentIso = new Date(Date.now() - 1000 * 60 * 30).toISOString();
    const bnTime = formatLocalizedRelativeTime(recentIso, 'bn');
    const enTime = formatLocalizedRelativeTime(recentIso, 'en');

    expect(bnTime).toContain('আগে');
    expect(enTime).toContain('ago');
  });

  it('correctly maps localized category names for slider badges', () => {
    expect(getLocalizedCategoryName('জাতীয়', 'bn')).toBe('জাতীয়');
    expect(getLocalizedCategoryName('জাতীয়', 'en')).toBe('National');
    expect(getLocalizedCategoryName('আন্তর্জাতিক', 'bn')).toBe('আন্তর্জাতিক');
    expect(getLocalizedCategoryName('আন্তর্জাতিক', 'en')).toBe('World');
  });

  it('provides up to 6 related stories for the RelatedCardSlider in article view', () => {
    const targetArticle = articles[0];
    const relatedStories = articles
      .filter((a) => a.id !== targetArticle.id && a.category === targetArticle.category)
      .slice(0, 6);

    expect(relatedStories.every((a) => a.id !== targetArticle.id)).toBe(true);
    expect(relatedStories.length).toBeLessThanOrEqual(6);
  });
});
