import AsyncStorage from '@react-native-async-storage/async-storage';
import { toBengaliNumeral } from '../utils/bengali';

export interface EPaperPageScan {
  pageNumber: number;
  title: string;
  imageUrl: string;
  hdImageUrl: string;
}

export interface EPaperEdition {
  date: string; // YYYY-MM-DD
  bengaliDate: string;
  totalPages: number;
  pages: EPaperPageScan[];
  downloaded: boolean;
}

const EPAPER_CACHE_PREFIX = '@amardesh_epaper_edition_';

const DEFAULT_TITLES = [
  '১ম পাতা (প্রধান খবর)',
  '২য় পাতা (নগর ও জাতীয়)',
  '৩য় পাতা (সম্পাদকীয় ও মতামত)',
  '৪র্থ পাতা (সারা দেশ)',
  '৫ম পাতা (আন্তর্জাতিক)',
  '৬ষ্ঠ পাতা (বাণিজ্য ও ব্যাংক)',
  '৭ম পাতা (খেলাধুলা)',
  '৮ম পাতা (ফিচার ও সাহিত্য)',
];

/**
 * Resolve ePaper edition for a given date
 */
export async function getEPaperEditionForDate(dateStr?: string): Promise<EPaperEdition> {
  const targetDate = dateStr || getTodayDateString();
  const cacheKey = `${EPAPER_CACHE_PREFIX}${targetDate}`;

  // 1. Check local offline cache
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.error('Error reading ePaper cache:', err);
  }

  // 2. Generate pages (resolving from eamardesh.com or static HD replicas)
  const pages: EPaperPageScan[] = DEFAULT_TITLES.map((title, i) => {
    const pageNum = i + 1;
    return {
      pageNumber: pageNum,
      title,
      imageUrl: `https://images.dailyamardesh.com/epaper/${targetDate}/page_${pageNum}_thumb.jpg`,
      hdImageUrl: `https://images.dailyamardesh.com/epaper/${targetDate}/page_${pageNum}_hd.jpg`,
    };
  });

  const edition: EPaperEdition = {
    date: targetDate,
    bengaliDate: '০৭ অক্টোবর ২০২৬',
    totalPages: pages.length,
    pages,
    downloaded: false,
  };

  return edition;
}

/**
 * Save / Download entire ePaper edition for offline reading
 */
export async function saveEPaperEditionOffline(edition: EPaperEdition): Promise<void> {
  const cacheKey = `${EPAPER_CACHE_PREFIX}${edition.date}`;
  const updated = { ...edition, downloaded: true };
  await AsyncStorage.setItem(cacheKey, JSON.stringify(updated));
}

function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
