import { getPrayerTimesForDivision, BANGLADESH_DIVISIONS } from '../prayerTimesService';
import { getArticlesByCategory, SITE_CATEGORIES } from '../contentService';

describe('PrayerTimesService', () => {
  it('calculates prayer times for Dhaka with valid structure', () => {
    const times = getPrayerTimesForDivision('ঢাকা');
    expect(times.division).toBe('ঢাকা');
    expect(times.fajr).toBeDefined();
    expect(times.dhuhr).toBeDefined();
    expect(times.asr).toBeDefined();
    expect(times.maghrib).toBeDefined();
    expect(times.isha).toBeDefined();
    expect(times.hijriDate).toContain('হিজরি');
  });

  it('handles all 8 divisions in Bangladesh', () => {
    BANGLADESH_DIVISIONS.forEach((division) => {
      const times = getPrayerTimesForDivision(division);
      expect(times.division).toBe(division);
      expect(times.fajr).toMatch(/^[০-৯]{2}:[০-৯]{2}$/);
    });
  });
});

describe('ContentService', () => {
  it('contains all 14 core verticals matching dailyamardesh.com', () => {
    expect(SITE_CATEGORIES.length).toBeGreaterThanOrEqual(14);
    const categoryNames = SITE_CATEGORIES.map((c) => c.name);
    expect(categoryNames).toContain('সর্বশেষ');
    expect(categoryNames).toContain('জুলাই বিপ্লব');
    expect(categoryNames).toContain('জাতীয়');
    expect(categoryNames).toContain('রাজনীতি');
    expect(categoryNames).toContain('বাণিজ্য');
    expect(categoryNames).toContain('সারা দেশ');
    expect(categoryNames).toContain('খেলা');
    expect(categoryNames).toContain('ইসলাম ও জীবন');
  });

  it('retrieves articles for vertical categories', () => {
    const latest = getArticlesByCategory('সর্বশেষ');
    expect(latest.length).toBeGreaterThan(0);

    const julyArticles = getArticlesByCategory('জুলাই বিপ্লব');
    expect(julyArticles.length).toBeGreaterThan(0);
    expect(julyArticles[0].category).toBe('জুলাই বিপ্লব');

    const sportsArticles = getArticlesByCategory('খেলা');
    expect(sportsArticles.length).toBeGreaterThan(0);
  });
});
