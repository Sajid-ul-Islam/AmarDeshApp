/**
 * RSS Feed Fetching & Parsing
 *
 * Reads the Daily Amar Desh WordPress feed
 * (https://www.dailyamardesh.com/feed) into `Article` records.
 *
 * Verified shape of a live feed item:
 *   <title><![CDATA[…]]></title>
 *   <link>https://www.dailyamardesh.com/politics/amdhz6ur96ynd</link>
 *   <pubDate>Thu, 08 Oct 2026 09:13:47 GMT</pubDate>
 *   <description><![CDATA[ <p><img src="…"/> text
 *     <a class="more_link" href="…">বিস্তারিত</a></p> ]]></description>
 *   <content:encoded><![CDATA[ …same… ]]></content:encoded>
 *   <category>রাজনীতি</category>
 *   <enclosure length="0" type="image/jpg" url="https://…"/>   <!-- self-closing -->
 *
 * Notes:
 *  - `<enclosure … />` is self-closing, so a paired-tag regex never matches it;
 *    a dedicated attribute regex is required.
 *  - The feed has no `<dc:creator>`, so the author falls back to the desk name.
 *  - The description is NOT a single paragraph: the `<p>` boundaries must be
 *    preserved so the article reader can render real paragraphs. Stripping all
 *    tags first (as this module used to) collapsed the body into one wall of
 *    text plus a stray "বিস্তারিত" link label.
 */

import { Article } from '../types';

const RSS_FEED_URL = 'https://www.dailyamardesh.com/feed';

/** Fallback image when an item carries none. */
const FALLBACK_IMAGE =
  'https://images.dailyamardesh.com/ad/amardesh-shadhinotar-kotha-bole.jpg';

/** Default desk byline when the feed has no creator tag. */
const DEFAULT_AUTHOR = 'আমার দেশ ডেস্ক';

/** How many paragraphs to keep in `content` (keeps payloads reasonable). */
const MAX_PARAGRAPHS = 40;

/** Characters of the cleaned body used for `excerpt`. */
const EXCERPT_LENGTH = 180;

export const fetchRSSFeed = async (): Promise<Article[]> => {
  try {
    const response = await fetch(RSS_FEED_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return parseRSSFeed(text);
  } catch (error) {
    console.error('[RSS] Error fetching feed:', error);
    // Empty array tells articleStore to fall back to the offline cache.
    return [];
  }
};

/**
 * Parse raw feed XML into articles.
 *
 * Exported for direct unit testing against a real-feed fixture.
 */
export const parseRSSFeed = (xml: string): Article[] => {
  if (typeof xml !== 'string' || xml.indexOf('<item') === -1) {
    return [];
  }

  const articles: Article[] = [];
  const itemMatches = xml.match(/<item[\s\S]*?<\/item>/g) || [];

  itemMatches.forEach((item) => {
    const rawTitle = extractTag(item, 'title');
    if (!rawTitle) return;
    const title = cleanText(rawTitle);

    const link = decodeHTML(extractTag(item, 'link'));
    const pubDate = extractTag(item, 'pubDate');
    const category = extractTag(item, 'category');
    const author =
      extractTag(item, 'dc:creator') || extractTag(item, 'author') || '';

    // Prefer the richer content:encoded body, falling back to description.
    const rawBody =
      extractTag(item, 'content:encoded') || extractTag(item, 'description');

    // Image: the first <img> in the body, else the self-closing <enclosure/>.
    const imageUrl =
      extractImageUrl(rawBody) ||
      extractAttribute(item, 'enclosure', 'url') ||
      FALLBACK_IMAGE;

    const paragraphs = extractParagraphs(rawBody);
    // Video items in the feed carry no body text at all — only an <img> and a
    // "read more" anchor — so extraction yields nothing. Falling back to the
    // headline keeps `content` non-empty, which the article screen renders as
    // the lede instead of showing a blank page.
    const content = paragraphs.length > 0 ? paragraphs.join('\n\n') : title;
    const publishedAt = normalizePubDate(pubDate);

    articles.push({
      // Stable id derived from the article URL: the same story keeps the
      // same id across refreshes/relaunches, so bookmarks, reading state,
      // and personalization affinities survive feed re-fetches.
      id: `rss-${hashString(link || title)}`,
      link: link || undefined,
      title,
      excerpt: buildExcerpt(paragraphs, content),
      content,
      category: cleanText(category) || 'সর্বশেষ',
      imageUrl,
      author: cleanText(author) || DEFAULT_AUTHOR,
      publishedAt,
      // Breaking = published very recently. Derived from the NORMALIZED date so
      // an item with a missing/unparsable pubDate is treated consistently with
      // how it is sorted (as "just now") instead of being marked stale.
      isBreaking: isRecent(publishedAt, 6),
    });
  });

  // Newest first (RSS is usually ordered, but don't rely on it — the home
  // screen renders list index 0 as the hero article)
  articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return articles;
};

/**
 * Deterministic 32-bit hash (djb2) → base36. Used for stable article ids.
 */
const hashString = (input: string): string => {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
};

/**
 * Normalize RSS pubDate to an ISO string; falls back to now when missing
 * or unparsable so formatRelativeTime() always receives a valid date.
 */
const normalizePubDate = (pubDate: string): string => {
  if (pubDate) {
    const parsed = new Date(pubDate);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }
  return new Date().toISOString();
};

/** Whether the timestamp is within the last `hours` hours. */
const isRecent = (isoTimestamp: string, hours: number): boolean => {
  const parsed = isoTimestamp ? new Date(isoTimestamp).getTime() : NaN;
  if (isNaN(parsed)) return false;
  return Date.now() - parsed <= hours * 60 * 60 * 1000;
};

/**
 * Strip CDATA wrappers e.g. <![CDATA[ ... ]]> and stray XML artifacts.
 */
export const stripCDATA = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/<!\[CDATA\[/gi, '')
    .replace(/\]\]>/gi, '')
    .trim();
};

/** Read a paired element's inner content. */
const extractTag = (xml: string, tag: string): string => {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = xml.match(
    new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)<\\/${escaped}>`, 'i')
  );
  return match ? stripCDATA(match[1]) : '';
};

/**
 * Read an attribute from a self-closing element, e.g.
 * `<enclosure length="0" url="https://…"/>` → the url value.
 */
const extractAttribute = (
  xml: string,
  tag: string,
  attribute: string
): string => {
  const match = xml.match(
    new RegExp(`<${tag}[^>]*\\s${attribute}=["']([^"']*)["']`, 'i')
  );
  return match ? stripCDATA(match[1]).trim() : '';
};

/** First image URL found in a body fragment, preferring the widest rendition. */
const extractImageUrl = (body: string): string => {
  const matches = body.match(/<img[^>]+src=["']([^"']+)["']/gi);
  if (!matches || matches.length === 0) return '';

  // Prefer a src that is not a tiny thumbnail when several are present.
  for (const tag of matches) {
    const src = tag.match(/src=["']([^"']+)["']/i)?.[1];
    if (src && !/-\d{3}x\d{3}\./.test(src)) {
      return decodeHTML(src).trim();
    }
  }

  const first = matches[0].match(/src=["']([^"']+)["']/i)?.[1];
  return first ? decodeHTML(first).trim() : '';
};

/**
 * Split a feed body into clean paragraphs.
 *
 * Boundaries are taken from the source markup BEFORE tags are removed, because
 * removing tags first destroys the only paragraph information available.
 */
const extractParagraphs = (rawBody: string): string[] => {
  const body = stripCDATA(rawBody);
  if (!body) return [];

  const blocks = body
    .replace(/\r\n?/g, '\n')
    // Treat block-level boundaries as paragraph separators.
    .split(/<\/p>|<\/div>|<br\s*\/?>|<\/h[1-6]>|\n{2,}/i)
    .map((block) => block.trim())
    .filter(Boolean);

  const paragraphs = blocks
    // Drop WordPress "read more" anchors and their label entirely.
    .map((block) => block.replace(/<a[^>]*class=["'][^"']*more_link[^"']*["'][\s\S]*?<\/a>/gi, ''))
    .map((block) => cleanHtmlInline(block))
    // Remove a residual standalone "বিস্তারিত" label left by a stray anchor.
    .map((block) => block.replace(/(^|\s)বিস্তারিত\s*$/u, '').trim())
    .filter((block) => block.replace(/[\s\u200b\u00a0]/g, '').length > 0)
    // Drop caption-only/credit-only fragments shorter than a sentence.
    .filter((block) => block.length >= 2)
    .slice(0, MAX_PARAGRAPHS);

  return paragraphs;
};

/** Remove tags and decode entities inside a single block, keeping inline text. */
const cleanHtmlInline = (html: string): string =>
  decodeHTML(html.replace(/<[^>]*>/g, ' '))
    .replace(/[ \t\u00a0]+/g, ' ')
    .replace(/\s+([.,;:!?।])/g, '$1')
    .trim();

/** Plain-text version of a fragment (used for titles/categories). */
const cleanText = (input: string): string => cleanHtmlInline(stripCDATA(input));

/** First sentence-ish teaser derived from the cleaned body. */
const buildExcerpt = (paragraphs: string[], content: string): string => {
  const source =
    paragraphs.find((p) => p.length >= 40) ?? paragraphs[0] ?? content;
  if (!source) return '';
  if (source.length <= EXCERPT_LENGTH) return source;
  return `${source.slice(0, EXCERPT_LENGTH).trimEnd()}…`;
};

/** Decode the HTML entities WordPress emits, including numeric ones. */
const decodeHTML = (html: string): string =>
  stripCDATA(html)
    .replace(/&nbsp;/g, ' ')
    .replace(/&#0?39;/g, "'")
    .replace(/&#8217;/g, '’')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#(\d+);/g, (_match, code: string) => {
      const value = Number(code);
      return Number.isFinite(value) && value > 0 && value <= 0x10ffff
        ? String.fromCodePoint(value)
        : '';
    })
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();

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
