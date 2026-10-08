/**
 * Category resolution and filtering.
 *
 * Regression guard for a bug where the category screen passed a Bengali label
 * (`খেলা`) into a lookup that only understood slugs, so live feed articles never
 * matched and the screen fell back to unrelated placeholder stories.
 */

import {
  lookupCategory,
  sectionSlugForCategory,
  getArticlesByCategory,
  normalizeBengali,
  SITE_CATEGORIES,
} from '../contentService';
import {
  __resetArticleStoreForTests,
  setArticlesForTests,
} from '../articleStore';
import type { Article } from '../../types';

const makeArticle = (over: Partial<Article>): Article => ({
  id: 'a1',
  title: 'শিরোনাম',
  excerpt: 'সারসংক্ষেপ',
  content: 'বিস্তারিত',
  category: 'খেলা',
  imageUrl: 'https://example.com/i.jpg',
  author: 'ক্রীড়া প্রতিবেদক',
  publishedAt: '2026-10-08T09:00:00Z',
  ...over,
});

describe('contentService.lookupCategory', () => {
  it('resolves a route slug', () => {
    expect(lookupCategory('sports')?.name).toBe('খেলা');
    expect(lookupCategory('politics')?.name).toBe('রাজনীতি');
    expect(lookupCategory('bangladesh')?.name).toBe('সারা দেশ');
  });

  it('resolves a Bengali label (what the feed and home chips use)', () => {
    expect(lookupCategory('খেলা')?.slug).toBe('sports');
    expect(lookupCategory('রাজনীতি')?.slug).toBe('politics');
    expect(lookupCategory('সারা দেশ')?.slug).toBe('bangladesh');
  });

  it('resolves an internal id and is case-insensitive on slugs', () => {
    expect(lookupCategory('all')?.name).toBe('সর্বশেষ');
    expect(lookupCategory('SPORTS')?.slug).toBe('sports');
    expect(lookupCategory('  politics  ')?.slug).toBe('politics');
  });

  it('returns undefined for unknown or empty input', () => {
    expect(lookupCategory('not-a-section')).toBeUndefined();
    expect(lookupCategory('')).toBeUndefined();
  });

  it.each([
    ['সারা দেশ', 'bangladesh'],
    ['বিশ্ব', 'world'],
    ['জাতীয়', 'national'],
    ['রাজনীতি', 'politics'],
    ['শিক্ষা', 'education'],
    ['ফিচার', 'feature'],
  ])('resolves feed label %s to the %s section', (label, slug) => {
    // Labels observed in the live feed on 2026-10-08.
    expect(lookupCategory(label)?.slug).toBe(slug);
  });

  it('maps a category label to its URL section for sharing', () => {
    expect(sectionSlugForCategory('খেলা')).toBe('sports');
    expect(sectionSlugForCategory('unknown-label')).toBeUndefined();
  });
});

describe('contentService.normalizeBengali', () => {
  it('folds the two ways Bengali writes য় into one form', () => {
    // The site's UI uses জাতীয় (য + ়), the RSS feed emits জাতীয় (য়).
    // Both must normalize identically or the national section never matches.
    const decomposed = '\u099c\u09be\u09a4\u09c0\u09af\u09bc'; // য + ়
    const precomposed = '\u099c\u09be\u09a4\u09c0\u09df'; // য়

    expect(decomposed).not.toBe(precomposed);
    expect(normalizeBengali(decomposed)).toBe(normalizeBengali(precomposed));
  });

  it('is idempotent, collapses whitespace, and lowercases', () => {
    const once = normalizeBengali('  SPORTS  ');
    expect(once).toBe('sports');
    expect(normalizeBengali(once)).toBe(once);
  });

  it('returns an empty string for empty input', () => {
    expect(normalizeBengali('')).toBe('');
    expect(normalizeBengali('   ')).toBe('');
  });
});

describe('contentService.getArticlesByCategory', () => {
  const sports = makeArticle({ id: 'sports-1' });
  const politics = makeArticle({ id: 'politics-1', category: 'রাজনীতি' });

  beforeEach(() => {
    __resetArticleStoreForTests();
    setArticlesForTests([sports, politics]);
  });

  afterEach(() => {
    __resetArticleStoreForTests();
  });

  it('filters live articles when given a Bengali label', () => {
    const result = getArticlesByCategory('খেলা');
    expect(result.map((a) => a.id)).toContain('sports-1');
    expect(result.map((a) => a.id)).not.toContain('politics-1');
  });

  it('filters live articles when given the route slug', () => {
    const result = getArticlesByCategory('sports');
    expect(result.map((a) => a.id)).toContain('sports-1');
    expect(result.map((a) => a.id)).not.toContain('politics-1');
  });

  it('returns the whole feed for the latest section', () => {
    expect(getArticlesByCategory('latest')).toHaveLength(2);
    expect(getArticlesByCategory('সর্বশেষ')).toHaveLength(2);
  });

  it('returns an empty list for an unknown vertical instead of unrelated stubs', () => {
    // Previously this returned CATEGORY_ARTICLES entries from other sections.
    expect(getArticlesByCategory('definitely-not-a-section')).toEqual([]);
  });

  it('never throws for odd input', () => {
    expect(() => getArticlesByCategory('')).not.toThrow();
    expect(() => getArticlesByCategory('   ')).not.toThrow();
  });
});

describe('contentService.SITE_CATEGORIES', () => {
  it('has a unique slug and id for every section', () => {
    const slugs = SITE_CATEGORIES.map((c) => c.slug);
    const ids = SITE_CATEGORIES.map((c) => c.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('uses Bengali display names', () => {
    for (const category of SITE_CATEGORIES) {
      expect(category.name).toMatch(/[\u0980-\u09FF]/);
    }
  });
});
