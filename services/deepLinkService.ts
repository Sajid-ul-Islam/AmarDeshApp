import * as Linking from 'expo-linking';
import { Article } from '../data/mockData';

// Deep link prefixes
const PREFIXES = [
  'amardesh://',
  'https://www.dailyamardesh.com',
  'https://dailyamardesh.com',
];

export interface DeepLinkData {
  type: 'article' | 'category' | 'tab' | 'search' | 'unknown';
  id?: string;
  category?: string;
  tab?: string;
  query?: string;
}

export const parseDeepLink = (url: string): DeepLinkData => {
  try {
    const parsed = Linking.parse(url);
    const path = parsed.path || '';
    const queryParams = parsed.queryParams || {};
    
    // Article link: amardesh://article/amd001 or https://dailyamardesh.com/article/amd001
    if (path.includes('article/') || queryParams.article) {
      const articleId = path.split('article/')[1] || queryParams.article;
      return {
        type: 'article',
        id: articleId,
      };
    }
    
    // Category link: amardesh://category/national
    if (path.includes('category/') || queryParams.category) {
      const category = path.split('category/')[1] || queryParams.category;
      return {
        type: 'category',
        category: category,
      };
    }
    
    // Tab link: amardesh://tab/bookmarks
    if (path.includes('tab/') || queryParams.tab) {
      const tab = path.split('tab/')[1] || queryParams.tab;
      return {
        type: 'tab',
        tab: tab,
      };
    }
    
    // Search link: amardesh://search?query=politics
    if (path.includes('search') || queryParams.query) {
      return {
        type: 'search',
        query: queryParams.query || '',
      };
    }
    
    return { type: 'unknown' };
  } catch (error) {
    console.error('Error parsing deep link:', error);
    return { type: 'unknown' };
  }
};

export const generateArticleLink = (articleId: string): string => {
  return `amardesh://article/${articleId}`;
};

export const generateCategoryLink = (category: string): string => {
  return `amardesh://category/${category}`;
};

export const generateTabLink = (tab: string): string => {
  return `amardesh://tab/${tab}`;
};

export const generateSearchLink = (query: string): string => {
  return `amardesh://search?query=${encodeURIComponent(query)}`;
};

// Listen for incoming deep links
export const addDeepLinkListener = (callback: (url: string) => void) => {
  return Linking.addEventListener('url', ({ url }) => {
    callback(url);
  });
};

// Get initial deep link (app opened via deep link)
export const getInitialDeepLink = async (): Promise<string | null> => {
  try {
    const url = await Linking.getInitialURL();
    return url;
  } catch (error) {
    console.error('Error getting initial deep link:', error);
    return null;
  }
};

// Open a URL
export const openURL = async (url: string): Promise<void> => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error(`Cannot open URL: ${url}`);
    }
  } catch (error) {
    console.error('Error opening URL:', error);
  }
};

// Open settings
export const openSettings = async (): Promise<void> => {
  try {
    await Linking.openSettings();
  } catch (error) {
    console.error('Error opening settings:', error);
  }
};
