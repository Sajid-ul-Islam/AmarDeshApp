import { Article } from '../types';

const RSS_FEED_URL = 'https://www.dailyamardesh.com/feed';
// Multiple CORS proxy options for reliability
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
];
// RSS2JSON as alternative approach (converts RSS to JSON directly)
const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  category: string;
  description: string;
  enclosure?: {
    url: string;
  };
}

function parseRSSItems(xml: string): RSSItem[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const items = doc.querySelectorAll('item');
  const articles: RSSItem[] = [];

  items.forEach((item) => {
    const title = item.querySelector('title')?.textContent || '';
    const link = item.querySelector('link')?.textContent || '';
    const pubDate = item.querySelector('pubDate')?.textContent || '';
    const category = item.querySelector('category')?.textContent || '';
    const description = item.querySelector('description')?.textContent || '';
    
    // Extract image from description or enclosure
    let imageUrl = '';
    const enclosure = item.querySelector('enclosure');
    if (enclosure) {
      imageUrl = enclosure.getAttribute('url') || '';
    }
    
    // Try to extract image from description HTML
    if (!imageUrl && description) {
      const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
      if (imgMatch) {
        imageUrl = imgMatch[1];
      }
    }

    // Extract plain text from description (remove HTML tags)
    const plainDescription = description
      .replace(/<[^>]*>/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/বিস্তারিত/g, '')
      .trim();

    articles.push({
      title: title.trim(),
      link: link.trim(),
      pubDate: pubDate.trim(),
      category: category.trim(),
      description: plainDescription.substring(0, 200),
      enclosure: imageUrl ? { url: imageUrl } : undefined,
    });
  });

  return articles;
}

function rssItemToArticle(item: RSSItem, index: number): Article {
  // Generate a unique ID from the link
  const idFromLink = item.link.split('/').pop() || `article-${index}`;
  
  return {
    id: idFromLink,
    title: item.title,
    excerpt: item.description.substring(0, 150) + (item.description.length > 150 ? '...' : ''),
    content: item.description,
    category: item.category,
    imageUrl: item.enclosure?.url || 'https://images.dailyamardesh.com/ad/amardesh-shadhinotar-kotha-bole.jpg',
    author: 'আমার দেশ ডেস্ক',
    publishedAt: item.pubDate,
    isBreaking: index < 2, // First 2 articles marked as breaking
  };
}

export async function fetchLatestArticles(): Promise<Article[]> {
  // Strategy 1: Try rss2json API (most reliable, returns JSON directly)
  try {
    const response = await fetch(`${RSS2JSON_API}${encodeURIComponent(RSS_FEED_URL)}`);
    if (response.ok) {
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        return data.items.map((item: any, index: number) => {
          let imageUrl = '';
          // Try to get image from enclosure, thumbnail, or description
          if (item.enclosure?.link) {
            imageUrl = item.enclosure.link;
          } else if (item.thumbnail) {
            imageUrl = item.thumbnail;
          } else if (item.description) {
            const imgMatch = item.description.match(/<img[^>]+src="([^"]+)"/);
            if (imgMatch) imageUrl = imgMatch[1];
          }

          const plainDesc = (item.description || '')
            .replace(/<[^>]*>/g, '')
            .replace(/\[.*?\]/g, '')
            .replace(/বিস্তারিত/g, '')
            .trim();

          return {
            id: (item.link || '').split('/').pop() || `article-${index}`,
            title: item.title || '',
            excerpt: plainDesc.substring(0, 150) + (plainDesc.length > 150 ? '...' : ''),
            content: plainDesc,
            category: item.category || (item.categories && item.categories[0]) || 'সর্বশেষ',
            imageUrl: imageUrl || 'https://images.dailyamardesh.com/ad/amardesh-shadhinotar-kotha-bole.jpg',
            author: item.author || 'আমার দেশ ডেস্ক',
            publishedAt: item.pubDate || new Date().toISOString(),
            isBreaking: index < 2,
            sourceUrl: item.link || '',
          } as Article;
        });
      }
    }
  } catch (error) {
    console.warn('rss2json failed, trying CORS proxy...', error);
  }

  // Strategy 2: Try CORS proxies with XML parsing
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await fetch(`${proxy}${encodeURIComponent(RSS_FEED_URL)}`);
      if (!response.ok) continue;

      const xml = await response.text();
      const rssItems = parseRSSItems(xml);

      if (rssItems.length > 0) {
        return rssItems.map((item, index) => rssItemToArticle(item, index));
      }
    } catch (error) {
      console.warn(`Proxy ${proxy} failed:`, error);
      continue;
    }
  }

  console.error('All RSS fetch strategies failed');
  return [];
}

export async function fetchArticlesByCategory(category: string): Promise<Article[]> {
  // For category-specific feeds, we filter from the main feed
  // Some RSS feeds support category parameters
  const allArticles = await fetchLatestArticles();
  
  if (category === 'সর্বশেষ' || !category) {
    return allArticles;
  }
  
  return allArticles.filter(
    (article) => article.category === category
  );
}

// Cache management
const CACHE_KEY = 'amardesh_articles_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheData {
  articles: Article[];
  timestamp: number;
}

export function getCachedArticles(): Article[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const data: CacheData = JSON.parse(cached);
    const now = Date.now();
    
    if (now - data.timestamp > CACHE_DURATION) {
      return null; // Cache expired
    }
    
    return data.articles;
  } catch {
    return null;
  }
}

export function cacheArticles(articles: Article[]): void {
  try {
    const data: CacheData = {
      articles,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Silently fail if localStorage is full
  }
}

export async function fetchArticlesWithCache(): Promise<Article[]> {
  // Try cache first
  const cached = getCachedArticles();
  if (cached && cached.length > 0) {
    return cached;
  }
  
  // Fetch fresh data
  const articles = await fetchLatestArticles();
  if (articles.length > 0) {
    cacheArticles(articles);
  }
  return articles;
}
