import { getSelectedDivision, saveSelectedDivision, BANGLADESH_DIVISIONS } from '../districtService';
import { getEPaperEditionForDate, saveEPaperEditionOffline } from '../epaperService';
import {
  initOfflineDatabase,
  saveArticlesToOfflineDb,
  getCachedArticlesByCategory,
  searchCachedArticles,
  evictOldCachedArticles,
} from '../offlineDatabase';

describe('DistrictService', () => {
  it('returns default division ঢাকা', async () => {
    const div = await getSelectedDivision();
    expect(div).toBe('ঢাকা');
  });

  it('persists selected division', async () => {
    await saveSelectedDivision('চট্টগ্রাম');
    const div = await getSelectedDivision();
    expect(div).toBe('চট্টগ্রাম');
  });

  it('includes all 8 administrative divisions', () => {
    expect(BANGLADESH_DIVISIONS).toHaveLength(8);
    expect(BANGLADESH_DIVISIONS).toContain('সিলেট');
    expect(BANGLADESH_DIVISIONS).toContain('রাজশাহী');
  });
});

describe('EPaperService', () => {
  it('resolves ePaper edition for date with 8 pages', async () => {
    const edition = await getEPaperEditionForDate('2026-10-07');
    expect(edition.date).toBe('2026-10-07');
    expect(edition.totalPages).toBe(8);
    expect(edition.pages).toHaveLength(8);
    expect(edition.pages[0].title).toContain('১ম পাতা');
    expect(edition.pages[7].title).toContain('৮ম পাতা');
  });

  it('saves ePaper edition offline', async () => {
    const edition = await getEPaperEditionForDate('2026-10-07');
    await saveEPaperEditionOffline(edition);
    const cached = await getEPaperEditionForDate('2026-10-07');
    expect(cached.downloaded).toBe(true);
  });
});

describe('OfflineDatabase', () => {
  beforeAll(async () => {
    await initOfflineDatabase();
  });

  it('saves and retrieves cached articles', async () => {
    const sampleArticles = [
      {
        id: 'test-off-1',
        title: 'টেস্ট অফলাইন সংবাদ শিরোনাম',
        excerpt: 'সংক্ষিপ্ত বিবরণ',
        content: 'পূর্ণাঙ্গ সংবাদ বিবরণী',
        category: 'জাতীয়',
        imageUrl: 'https://example.com/test.jpg',
        author: 'রিপোর্টার',
        publishedAt: '2026-10-07T10:00:00Z',
      },
    ];

    await saveArticlesToOfflineDb(sampleArticles);
    const results = await getCachedArticlesByCategory('জাতীয়');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((a) => a.id === 'test-off-1')).toBe(true);
  });

  it('searches cached articles by keyword', async () => {
    const results = await searchCachedArticles('অফলাইন');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain('অফলাইন');
  });

  it('runs LRU eviction cleanly', async () => {
    const evictedCount = await evictOldCachedArticles(7);
    expect(typeof evictedCount).toBe('number');
  });
});
