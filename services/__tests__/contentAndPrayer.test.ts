import {
  getPrayerTimesForDivision,
  BANGLADESH_DIVISIONS,
  DHAKA_DEFAULT,
  calculateSolarOffsetMinutes,
  getPrayerTimesForOffset,
  mapEnglishDistrictToBengali,
  requestGpsPrayerTimes,
  resetToDhakaDefault,
} from '../prayerTimesService';
import { getArticlesByCategory, SITE_CATEGORIES } from '../contentService';

describe('PrayerTimesService', () => {
  it('defaults to Dhaka as standard prayer time reference', () => {
    expect(DHAKA_DEFAULT).toBe('ঢাকা');
    const defaultTimes = getPrayerTimesForDivision();
    expect(defaultTimes.division).toBe('ঢাকা');
    expect(defaultTimes.isGps).toBe(false);
  });

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

  it('calculates solar offset minutes relative to Dhaka longitude accurately', () => {
    // Dhaka longitude (~90.4125): offset is 0
    expect(calculateSolarOffsetMinutes(90.4125)).toBe(0);

    // Sylhet (~91.87° E): East, earlier times (-6 min)
    expect(calculateSolarOffsetMinutes(91.87)).toBe(-6);

    // Rajshahi (~88.62° E): West, later times (+7 min)
    expect(calculateSolarOffsetMinutes(88.62)).toBe(7);
  });

  it('translates English district names to Bengali properly', () => {
    expect(mapEnglishDistrictToBengali('Chittagong')).toBe('চট্টগ্রাম');
    expect(mapEnglishDistrictToBengali('Sylhet')).toBe('সিলেট');
    expect(mapEnglishDistrictToBengali('Rajshahi')).toBe('রাজশাহী');
    expect(mapEnglishDistrictToBengali('Kushtia')).toBe('কুষ্টিয়া');
    expect(mapEnglishDistrictToBengali('')).toBe('আপনার এলাকা');
  });

  it('requests GPS prayer times and calculates local schedule', async () => {
    const result = await requestGpsPrayerTimes();
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.isGps).toBe(true);
    expect(result.data?.fajr).toMatch(/^[০-৯]{2}:[০-৯]{2}$/);
  });

  it('resets prayer times back to Dhaka default', async () => {
    const times = await resetToDhakaDefault();
    expect(times.division).toBe('ঢাকা');
    expect(times.isGps).toBe(false);
    expect(times.offsetMinutes).toBe(0);
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
