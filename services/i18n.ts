import AsyncStorage from '@react-native-async-storage/async-storage';
import { toBengaliNumeral } from '../utils/bengali';

export type SupportedLanguage = 'bn' | 'en';

export const LANGUAGE_STORAGE_KEY = '@amar_desh_language_preference';

export const TRANSLATIONS = {
  bn: {
    // Navigation Tabs
    tab_home: 'হোম',
    tab_epaper: 'ই-পেপার',
    tab_video: 'ভিডিও',
    tab_saved: 'সেভ',
    tab_menu: 'মেনু',

    // App Header & Branding
    app_name: 'দৈনিক আমার দেশ',
    app_motto: 'স্বাধীনতার কথা বলে',
    edition_label: 'সংস্করণ',
    weather_dhaka: 'ঢাকা ২৮° সে. ⛅',
    search_placeholder: 'সংবাদ ও বিষয়বস্তু খুঁজুন...',
    breaking_news: 'ব্রেকিং নিউজ',
    july_spotlight_title: 'জুলাই বিপ্লব ২০২৪: বিশেষ আর্কাইভ ও স্মৃতিস্তম্ভ',
    july_spotlight_sub: 'শহীদদের স্মৃতিকথা, গণঅভ্যুত্থানের দলিল ও নতুন বাংলাদেশ',

    // Categories
    cat_all: 'সর্বশেষ',
    cat_latest: 'সর্বশেষ সংবাদ',
    cat_july_revolution: 'জুলাই বিপ্লব ২০২৪',
    cat_national: 'জাতীয়',
    cat_politics: 'রাজনীতি',
    cat_economy: 'অর্থনীতি',
    cat_business: 'বাণিজ্য ও অর্থনীতি',
    cat_countrywide: 'সারা দেশ',
    cat_world: 'বিশ্ব',
    cat_sports: 'খেলা',
    cat_sports_full: 'খেলাধুলা',
    cat_entertainment: 'বিনোদন',
    cat_entertainment_full: 'বিনোদন ও সংস্কৃতি',
    cat_islam: 'ইসলাম ও জীবন',
    cat_opinion: 'মতামত',
    cat_opinion_full: 'মতামত ও উপ-সম্পাদকীয়',
    cat_feature: 'ফিচার',
    cat_feature_full: 'ফিচার ও জীবনধারা',
    cat_corporate: 'কর্পোরেট সংবাদ',
    cat_education: 'শিক্ষা ও ক্যাম্পাস',
    cat_special: 'বিশেষ প্রতিবেদন',

    // Article Details & Reader
    published_prefix: 'প্রকাশিত: ',
    published_by: 'লেখক: ',
    ai_summary_title: '৩-পয়েন্ট স্মার্ট এআই সারসংক্ষেপ',
    ai_assistant_btn: 'এআই সহকারীকে প্রশ্ন করুন',
    listen_audio: 'সংবাদ শুনুন',
    reactions_title: 'সংবাদটিতে আপনার প্রতিক্রিয়া',
    prev_article: 'পূর্ববর্তী সংবাদ',
    next_article: 'পরবর্তী সংবাদ',
    no_prev_article: 'পূর্ববর্তী কোনো সংবাদ নেই',
    no_next_article: 'পরবর্তী কোনো সংবাদ নেই',
    start_of_category: 'শুরুতে আছেন',
    end_of_category: 'শেষ সংবাদ',
    swipe_hint: 'সংবাদ বদলাতে বামে বা ডানে সোয়াইপ করুন',
    related_news: 'সম্পর্কিত সংবাদ',
    copyright_notice: 'স্বত্ব © ২০২৪-২০২৬ দৈনিক আমার দেশ • dailyamardesh.com • স্বাধীনতার কথা বলে',
    article_not_found: 'সংবাদ পাওয়া যায়নি',
    loading_article: 'সংবাদ লোড হচ্ছে...',
    share_news: 'সংবাদটি শেয়ার করুন',
    close: 'বন্ধ করুন',
    back: 'ফিরে যান',

    // ePaper
    epaper_header: 'ই-পেপার সংস্করণ',
    page_prefix: 'পাতা ',
    download: 'ডাউনলোড',
    downloaded: 'সংরক্ষিত',
    column_read: 'কলাম পাঠ',
    digital_read: 'সম্পূর্ণ ডিজিটাল পাঠ',
    hotspots_toggle: 'কলাম চিহ্নিত করুন',

    // Video
    video_hub_title: 'আমার দেশ মাল্টিমিডিয়া',
    all_videos: 'সব ভিডিও',
    more_videos: 'আরও ভিডিও সংবাদ',
    mini_player: 'মিনি প্লেয়ার',
    views_suffix: ' বার দেখা হয়েছে',

    // Settings & Utilities
    settings_title: 'সেটিংস ও প্রয়োজনীয় সেবা',
    language_select: 'ভাষা নির্বাচন (Language)',
    lang_bengali: 'বাংলা (Bengali)',
    lang_english: 'English (ইংরেজি)',
    dark_mode: 'ডার্ক মোড (Dark Theme)',
    dark_mode_active: 'চালু আছে',
    dark_mode_inactive: 'বন্ধ আছে',
    data_saver: 'কম ডেটা মোড (Data Saver)',
    data_saver_sub: 'স্লো বা ২জি/৩জি ইন্টারনেটে দ্রুত লোড',
    ai_settings_title: 'স্মার্ট এআই সহকারী সেটিংস',
    ai_settings_sub: 'Google Gemini / Llama / ChatGPT কি যুক্ত করুন',
    notification_inbox: 'নোটিফিকেশন ইনবক্স',
    notification_inbox_sub: 'সকল ব্রেকিং ও গুরুত্বপূর্ণ অ্যালার্ট',
    notification_control: 'নোটিফিকেশন নিয়ন্ত্রণ',
    notification_control_sub: 'টাইমলাইন ও ক্যাটাগরি ফিল্টার',
    cloud_sync: 'ক্লাউড অ্যাকাউন্ট সিঙ্ক',
    cloud_sync_sub: 'বুকমার্ক ও রিডিং স্ট্রিক সংরক্ষণ',
    about_us: 'আমার দেশ সম্পর্কে',
    about_us_sub: 'যোগাযোগ ও সম্পাদকীয় নীতিমালা',

    // Common
    save: 'সংরক্ষণ',
    saved_articles: 'সংরক্ষিত সংবাদ',
    no_saved_articles: 'কোনো সংরক্ষিত সংবাদ নেই',
    offline_reading: 'অফলাইন পাঠ',
    for_you: 'আপনার জন্য',
    for_you_sub: 'আপনার পাঠাভ্যাস ও আগ্রহ অনুযায়ী বাছাইকৃত',
    top_interests: 'আপনার শীর্ষ আগ্রহ:',
    customize_interests: 'পছন্দ পরিবর্তন',
    retry: 'পুনরায় চেষ্টা করুন',
    just_now: 'এইমাত্র',
    minutes_ago: ' মিনিট আগে',
    hours_ago: ' ঘণ্টা আগে',
    days_ago: ' দিন আগে',
  },

  en: {
    // Navigation Tabs
    tab_home: 'Home',
    tab_epaper: 'ePaper',
    tab_video: 'Video',
    tab_saved: 'Saved',
    tab_menu: 'Menu',

    // App Header & Branding
    app_name: 'Daily Amar Desh',
    app_motto: 'Voice of Freedom',
    edition_label: 'Edition',
    weather_dhaka: 'Dhaka 28° C ⛅',
    search_placeholder: 'Search news and topics...',
    breaking_news: 'BREAKING NEWS',
    july_spotlight_title: 'July 2024 Revolution: Special Archive & Memorial',
    july_spotlight_sub: 'Martyr memoirs, mass uprising documents & new Bangladesh',

    // Categories
    cat_all: 'Latest',
    cat_latest: 'Latest News',
    cat_july_revolution: 'July Revolution 2024',
    cat_national: 'National',
    cat_politics: 'Politics',
    cat_economy: 'Economy',
    cat_business: 'Business & Economy',
    cat_countrywide: 'Countrywide',
    cat_world: 'World',
    cat_sports: 'Sports',
    cat_sports_full: 'Sports',
    cat_entertainment: 'Entertainment',
    cat_entertainment_full: 'Culture & Entertainment',
    cat_islam: 'Islam & Life',
    cat_opinion: 'Opinion',
    cat_opinion_full: 'Opinion & Editorial',
    cat_feature: 'Feature',
    cat_feature_full: 'Lifestyle & Features',
    cat_corporate: 'Corporate News',
    cat_education: 'Education & Campus',
    cat_special: 'Special Report',

    // Article Details & Reader
    published_prefix: 'Published: ',
    published_by: 'Author: ',
    ai_summary_title: '3-Point AI Smart Summary',
    ai_assistant_btn: 'Ask AI News Assistant',
    listen_audio: 'Listen to News',
    reactions_title: 'Reader Reactions',
    prev_article: 'Previous Story',
    next_article: 'Next Story',
    no_prev_article: 'No previous story',
    no_next_article: 'No next story',
    start_of_category: 'Start of Section',
    end_of_category: 'Latest Story',
    swipe_hint: 'Swipe left or right to flip stories',
    related_news: 'Related News',
    copyright_notice: 'Copyright © 2024-2026 Daily Amar Desh • dailyamardesh.com • Voice of Freedom',
    article_not_found: 'Article not found',
    loading_article: 'Loading article...',
    share_news: 'Share this story',
    close: 'Close',
    back: 'Go Back',

    // ePaper
    epaper_header: 'ePaper Edition',
    page_prefix: 'Page ',
    download: 'Download',
    downloaded: 'Saved',
    column_read: 'Read Column',
    digital_read: 'Read Full Digital Version',
    hotspots_toggle: 'Scan Columns',

    // Video
    video_hub_title: 'Amar Desh Multimedia',
    all_videos: 'All Videos',
    more_videos: 'More Video News',
    mini_player: 'Mini Player',
    views_suffix: ' views',

    // Settings & Utilities
    settings_title: 'Settings & Services',
    language_select: 'Language (ভাষা নির্বাচন)',
    lang_bengali: 'বাংলা (Bengali)',
    lang_english: 'English',
    dark_mode: 'Dark Theme',
    dark_mode_active: 'Enabled',
    dark_mode_inactive: 'Disabled',
    data_saver: 'Data Saver Mode',
    data_saver_sub: 'Fast loading on slow 2G/3G connections',
    ai_settings_title: 'AI Assistant Settings',
    ai_settings_sub: 'Connect Google Gemini / Llama / OpenAI key',
    notification_inbox: 'Notification Inbox',
    notification_inbox_sub: 'All breaking & urgent alerts',
    notification_control: 'Notification Preferences',
    notification_control_sub: 'Delivery timing & category filters',
    cloud_sync: 'Cloud Account Sync',
    cloud_sync_sub: 'Sync bookmarks & reading streak',
    about_us: 'About Daily Amar Desh',
    about_us_sub: 'Contact & Editorial Standards',

    // Common
    save: 'Save',
    saved_articles: 'Saved Articles',
    no_saved_articles: 'No saved articles yet',
    offline_reading: 'Offline Reading',
    for_you: 'For You',
    for_you_sub: 'Personalized based on your reading history',
    top_interests: 'Your Top Interests:',
    customize_interests: 'Change Interests',
    retry: 'Try Again',
    just_now: 'Just now',
    minutes_ago: ' mins ago',
    hours_ago: ' hrs ago',
    days_ago: ' days ago',
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.bn;

let currentLanguage: SupportedLanguage = 'bn';
const languageListeners = new Set<(lang: SupportedLanguage) => void>();

export const getSavedLanguage = async (): Promise<SupportedLanguage> => {
  try {
    const val = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (val === 'en' || val === 'bn') {
      currentLanguage = val;
    }
  } catch (e) {
    // Default to Bengali
  }
  return currentLanguage;
};

export const setAppLanguage = async (lang: SupportedLanguage): Promise<void> => {
  currentLanguage = lang;
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch (e) {
    // Ignore save error
  }
  languageListeners.forEach((fn) => {
    try {
      fn(lang);
    } catch (err) {
      console.warn('Language listener error', err);
    }
  });
};

export const subscribeLanguageChange = (
  listener: (lang: SupportedLanguage) => void
): (() => void) => {
  languageListeners.add(listener);
  return () => {
    languageListeners.delete(listener);
  };
};

export const getCurrentLanguage = (): SupportedLanguage => currentLanguage;

/**
 * Translate a key according to the active or requested language.
 */
export const t = (
  key: TranslationKey,
  languageOverride?: SupportedLanguage
): string => {
  const lang = languageOverride || currentLanguage;
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.bn;
  return dict[key] || TRANSLATIONS.bn[key] || String(key);
};

/**
 * Format numbers according to active language (Bengali numerals vs Western Arabic).
 */
export const formatLocalizedNumeral = (
  num: number | string,
  lang: SupportedLanguage = currentLanguage
): string => {
  if (lang === 'bn') {
    return toBengaliNumeral(num);
  }
  return String(num);
};

/**
 * Format relative time according to active language.
 */
export const formatLocalizedRelativeTime = (
  dateString: string,
  lang: SupportedLanguage = currentLanguage
): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (lang === 'en') {
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    const monthsEn = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return `${date.getDate()} ${monthsEn[date.getMonth()]} ${date.getFullYear()}`;
  }

  // Bengali relative time
  if (diffMins < 1) return 'এইমাত্র';
  if (diffMins < 60) return `${toBengaliNumeral(diffMins)} মিনিট আগে`;
  if (diffHours < 24) return `${toBengaliNumeral(diffHours)} ঘণ্টা আগে`;
  if (diffDays < 7) return `${toBengaliNumeral(diffDays)} দিন আগে`;

  const monthsBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর',
  ];
  return `${toBengaliNumeral(date.getDate())} ${monthsBn[date.getMonth()]} ${toBengaliNumeral(date.getFullYear())}`;
};

/**
 * Translate Bengali category names to English if language is English
 */
export const getLocalizedCategoryName = (
  categoryName: string,
  lang: SupportedLanguage = currentLanguage
): string => {
  if (lang === 'bn') return categoryName;

  const mapping: Record<string, string> = {
    সর্বশেষ: 'Latest',
    'জুলাই বিপ্লব': 'July Revolution',
    'জুলাই বিপ্লব ২০২৪': 'July Revolution 2024',
    জাতীয়: 'National',
    রাজনীতি: 'Politics',
    অর্থনীতি: 'Economy',
    'বাণিজ্য ও অর্থনীতি': 'Business & Economy',
    বাণিজ্য: 'Business',
    'সারা দেশ': 'Countrywide',
    আন্তর্জাতিক: 'World',
    বিশ্ব: 'World',
    খেলা: 'Sports',
    খেলাধুলা: 'Sports',
    বিনোদন: 'Entertainment',
    'ইসলাম ও জীবন': 'Islam & Life',
    মতামত: 'Opinion',
    সম্পাদকীয়: 'Editorial',
    ফিচার: 'Features',
    শিক্ষা: 'Education',
    কর্পোরেট: 'Corporate',
    'বিশেষ প্রতিবেদন': 'Special Report',
    'তাজা খবর': 'Top News',
    'মতামত ও বিশ্লেষণ': 'Opinion & Analysis',
    তথ্যপ্রযুক্তি: 'Tech & AI',
  };

  return mapping[categoryName] || categoryName;
};
