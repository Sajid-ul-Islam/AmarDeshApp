import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ScrapedArticleData {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  publishedAt: string;
  heroImageUrl: string;
  caption?: string;
  paragraphs: string[];
  relatedArticles?: Array<{ id: string; title: string; imageUrl: string }>;
}

const CACHE_PREFIX = '@amardesh_scraped_article_';

/**
 * Fetch and extract the full article content from dailyamardesh.com HTML
 */
export async function scrapeFullArticle(
  articleUrlOrId: string,
  fallbackTitle: string,
  fallbackContent: string,
  fallbackImage: string,
  fallbackAuthor: string,
  fallbackDate: string,
  articleLink?: string
): Promise<ScrapedArticleData> {
  const cleanedFallbackTitle = cleanText(fallbackTitle);
  const cleanedFallbackContent = cleanText(fallbackContent);
  const cacheKey = `${CACHE_PREFIX}${articleLink || articleUrlOrId}`;

  // 1. Try local cache first for instant rendering
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      parsed.title = cleanText(parsed.title);
      return parsed;
    }
  } catch (err) {
    console.error('Error reading article cache:', err);
  }

  // 2. Build target URL if it's an ID or full URL
  let targetUrl = articleLink || articleUrlOrId;
  if (!targetUrl.startsWith('http')) {
    // If it's a slug or id, we construct standard portal path or use fallback
    if (targetUrl.startsWith('amd')) {
      targetUrl = `https://www.dailyamardesh.com/news/${targetUrl}`;
    }
  }

  // 3. Attempt live extraction if we have a valid HTTP URL
  if (targetUrl.startsWith('http')) {
    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AmarDeshApp/1.3',
          Accept: 'text/html',
        },
      });

      if (response.ok) {
        const html = await response.text();
        const extracted = parseArticleHtml(
          html,
          articleUrlOrId,
          cleanedFallbackTitle,
          cleanedFallbackContent,
          fallbackImage,
          fallbackAuthor,
          fallbackDate
        );

        // Cache for subsequent opens
        AsyncStorage.setItem(cacheKey, JSON.stringify(extracted)).catch(() => {});
        return extracted;
      }
    } catch (fetchErr) {
      console.warn('[ArticleScraper] Live fetch failed, using fallback:', fetchErr);
    }
  }

  // 4. Clean and split fallback content into structured paragraphs
  const paragraphs = cleanedFallbackContent
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return {
    id: articleUrlOrId,
    title: cleanedFallbackTitle,
    author: cleanText(fallbackAuthor) || 'আমার দেশ অনলাইন',
    publishedAt: fallbackDate,
    heroImageUrl: fallbackImage,
    paragraphs: paragraphs.length > 0 ? paragraphs : [cleanedFallbackContent],
  };
}

/**
 * Helper to parse HTML DOM substrings safely in React Native JS environment
 */
function parseArticleHtml(
  html: string,
  id: string,
  fallbackTitle: string,
  fallbackContent: string,
  fallbackImage: string,
  fallbackAuthor: string,
  fallbackDate: string
): ScrapedArticleData {
  // Extract Title
  const titleMatch =
    html.match(/<h1[^>]*itemProp="headline"[^>]*>([\s\S]*?)<\/h1>/i) ||
    html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
    html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? cleanText(titleMatch[1].replace(/\|.*$/, '')) : cleanText(fallbackTitle);

  // Extract Caption
  const captionMatch = html.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
  const caption = captionMatch ? cleanText(captionMatch[1]) : undefined;

  // Extract Author
  const authorMatch = html.match(/itemProp="name"[^>]*>([\s\S]*?)<\/a>/i);
  const author = authorMatch ? cleanText(authorMatch[1]) : cleanText(fallbackAuthor);

  // Extract Author Avatar
  const avatarMatch = html.match(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*amr_ds_anlin[^"]*)"/i);
  const authorAvatar = avatarMatch ? avatarMatch[2] : undefined;

  // Extract Paragraphs from body
  const paragraphs: string[] = [];
  const richTextSectionMatch = html.match(/class="block-full_richtext">([\s\S]*?)<\/div>/i);
  
  if (richTextSectionMatch) {
    const pMatches = richTextSectionMatch[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi);
    for (const match of pMatches) {
      const text = cleanText(match[1]);
      if (text.length > 10) {
        paragraphs.push(text);
      }
    }
  }

  // If no paragraphs parsed from block, fallback
  if (paragraphs.length === 0) {
    const fallbackParas = fallbackContent.split(/\n\n+/).map((p) => p.trim());
    paragraphs.push(...fallbackParas.filter((p) => p.length > 0));
  }

  return {
    id,
    title,
    author,
    authorAvatar,
    publishedAt: fallbackDate,
    heroImageUrl: fallbackImage,
    caption,
    paragraphs,
  };
}

export function cleanText(text: string): string {
  if (!text) return '';
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/<!\[CDATA\[/gi, '')
    .replace(/\]\]>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}
