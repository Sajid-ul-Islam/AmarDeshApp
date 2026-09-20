import { Article } from '../data/mockData';

const RSS_FEED_URL = 'https://www.dailyamardesh.com/feed';

export const fetchRSSFeed = async (): Promise<Article[]> => {
  try {
    // Using a CORS proxy for web, or direct fetch for native
    const response = await fetch(RSS_FEED_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    
    // Parse RSS XML
    const articles = parseRSSFeed(text);
    return articles;
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    // Return empty array on error, app will use mock data
    return [];
  }
};

const parseRSSFeed = (xml: string): Article[] => {
  const articles: Article[] = [];
  
  // Simple XML parsing (in production, use a proper XML parser)
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  
  itemMatches.forEach((item, index) => {
    const title = extractTag(item, 'title');
    const link = extractTag(item, 'link');
    const description = extractTag(item, 'description');
    const pubDate = extractTag(item, 'pubDate');
    const category = extractTag(item, 'category');
    const author = extractTag(item, 'author') || extractTag(item, 'dc:creator');
    
    // Extract image from description or enclosure
    const imageUrl = extractImageFromDescription(description) || 
                     extractTag(item, 'enclosure', 'url') ||
                     'https://images.dailyamardesh.com/ad/amardesh-shadhinotar-kotha-bole.jpg';
    
    // Clean description
    const cleanDescription = cleanHTML(description);
    
    if (title) {
      articles.push({
        id: `rss-${index}-${Date.now()}`,
        title: decodeHTML(title),
        excerpt: cleanDescription.substring(0, 150) + '...',
        content: cleanDescription,
        category: category || 'সর্বশেষ',
        imageUrl: imageUrl,
        author: author || 'আমার দেশ ডেস্ক',
        publishedAt: pubDate || new Date().toISOString(),
        isBreaking: index < 2,
      });
    }
  });
  
  return articles;
};

const extractTag = (xml: string, tag: string, attribute?: string): string => {
  if (attribute) {
    const match = xml.match(new RegExp(`<${tag}[^>]*${attribute}="([^"]*)"`, 'i'));
    return match ? match[1] : '';
  }
  
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? match[1].trim() : '';
};

const extractImageFromDescription = (description: string): string => {
  const match = description.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : '';
};

const cleanHTML = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
};

const decodeHTML = (html: string): string => {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
};

// Cache RSS feed for offline use
export const cacheRSSFeed = async (articles: Article[]) => {
  try {
    const { saveOfflineArticles } = await import('./storage');
    await saveOfflineArticles(articles);
  } catch (error) {
    console.error('Error caching RSS feed:', error);
  }
};

export const getCachedRSSFeed = async (): Promise<Article[]> => {
  try {
    const { loadOfflineArticles } = await import('./storage');
    return await loadOfflineArticles();
  } catch (error) {
    console.error('Error getting cached RSS feed:', error);
    return [];
  }
};
