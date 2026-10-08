/**
 * Deep Link Parsing
 *
 * Pure, dependency-light parsing of incoming URLs into the app's internal
 * route shapes. This module deliberately performs no navigation: the single
 * navigation entry point lives in `services/navigationService.ts` so that
 * deep links, notification taps, and (future) universal links all funnel
 * through one place.
 *
 * Parses both app-scheme links (`amardesh://article/<id>`) and the real
 * public web URLs the site serves, e.g.
 *   https://www.dailyamardesh.com/politics/amdhz6ur96ynd
 *   https://www.dailyamardesh.com/category/sports
 *
 * `parseDeepLink` never throws and always returns a `DeepLinkData`; unknown or
 * malformed input yields `{ type: 'unknown' }` so callers can safely fall back
 * to the home screen.
 */

import * as Linking from 'expo-linking';

/** Hosts the app claims (must stay in sync with app.json applinks/intentFilters). */
export const APP_LINK_HOSTS = ['www.dailyamardesh.com', 'dailyamardesh.com'];
export const APP_SCHEME = 'amardesh';

/**
 * Site path segments that are section names rather than article slugs.
 * Sourced from SITE_CATEGORIES in contentService; kept as plain string data
 * here so this module stays free of store/service imports.
 */
const CATEGORY_SLUGS = [
  'latest',
  'national',
  'politics',
  'business',
  'bangladesh',
  'entertainment',
  'world',
  'sports',
  'religion-islam',
  'op-ed',
  'feature',
  'education',
  'corporate',
  'july-revolution',
  'epaper',
  'video',
];

/** Tab names accepted by `amardesh://tab/<name>`. */
const TAB_ROUTES: Record<string, string> = {
  home: '/',
  video: '/video',
  bookmarks: '/bookmarks',
  saved: '/bookmarks',
  menu: '/menu',
  search: '/search',
  foryou: '/foryou',
  epaper: '/epaper',
  profile: '/profile',
};

export interface DeepLinkData {
  type: 'article' | 'category' | 'tab' | 'search' | 'unknown';
  id?: string;
  category?: string;
  tab?: string;
  query?: string;
}

const firstValue = (
  value: string | string[] | undefined
): string | undefined => {
  if (Array.isArray(value)) return value[0];
  return value;
};

/** Strip the scheme/host and any query/hash from an app-scheme URL. */
function appSchemePath(url: string): string | null {
  const prefix = `${APP_SCHEME}://`;
  if (!url.toLowerCase().startsWith(prefix)) return null;

  let rest = url.slice(prefix.length);
  // `amardesh:///article/x` has an empty host segment.
  rest = rest.replace(/^\/+/, '');
  // Drop hostname only when it is a known host (some links may omit it).
  const parts = rest.split('/');
  if (APP_LINK_HOSTS.includes(parts[0]?.toLowerCase())) {
    parts.shift();
  }
  return parts.join('/');
}

/**
 * Percent-decode one path segment.
 *
 * `Linking.parse()` decodes query params but not reliably the path, so path
 * segments are decoded here to keep ids consistent whichever URL shape a link
 * arrives in. Malformed escapes fall back to the raw text.
 */
function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/**
 * Turn a web URL into a relative path, or `null` when the host is not one we
 * claim (so we never hijack arbitrary links).
 */
function webPath(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (!APP_LINK_HOSTS.includes(host)) return null;
    return parsed.pathname.replace(/^\/+/, '');
  } catch {
    return null;
  }
}

/** Read a query parameter from any URL shape via expo-linking. */
function readQuery(
  url: string,
  keys: string[]
): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
  try {
    const { queryParams } = Linking.parse(url);
    for (const key of keys) {
      const raw = firstValue(queryParams?.[key]);
      if (raw !== undefined && raw !== '') out[key] = raw;
    }
  } catch {
    // Malformed URL: no query params available.
  }
  return out;
}

/**
 * Parse an incoming URL into an internal route descriptor.
 */
export const parseDeepLink = (url: string): DeepLinkData => {
  if (typeof url !== 'string' || url.trim() === '') {
    return { type: 'unknown' };
  }

  try {
    const query = readQuery(url, [
      'article',
      'articleId',
      'category',
      'tab',
      'query',
      'q',
      'slug',
    ]);

    const relativePath = appSchemePath(url) ?? webPath(url);
    const segments = (relativePath ?? '')
      .split('/')
      .filter(Boolean)
      .map(decodeSegment);
    const [first, second] = segments;

    // 1. Explicit query parameters win — they are unambiguous.
    if (query.article || query.articleId) {
      return { type: 'article', id: query.article || query.articleId };
    }
    if (query.category) {
      return { type: 'category', category: query.category };
    }
    if (query.tab) {
      return { type: 'tab', tab: query.tab };
    }
    if (query.query || query.q) {
      return { type: 'search', query: query.query || query.q || '' };
    }

    // 2. Path-based routing.
    if (first === 'article' || first === 'news') {
      if (second) return { type: 'article', id: second };
      return { type: 'unknown' };
    }
    if (first === 'category') {
      if (second) return { type: 'category', category: second };
      return { type: 'unknown' };
    }
    if (first === 'tab') {
      if (second) return { type: 'tab', tab: second };
      return { type: 'unknown' };
    }
    if (first === 'search') {
      return { type: 'search', query: query.q || '' };
    }

    // 3. Public site URL: first segment is a section name, second is the slug.
    //    e.g. /politics/amdhz6ur96ynd -> article, /category/sports -> category
    if (first && second) {
      if (CATEGORY_SLUGS.includes(first)) {
        return { type: 'article', id: second };
      }
      // Unknown section, but it still looks like /section/slug: treat as an
      // article so a newly added site vertical keeps working.
      return { type: 'article', id: second };
    }

    // 4. Single segment: known section or tab.
    if (first) {
      if (CATEGORY_SLUGS.includes(first)) {
        // `latest` is the home feed; everything else is a category screen.
        if (first === 'latest') return { type: 'tab', tab: 'home' };
        if (first === 'video') return { type: 'tab', tab: 'video' };
        if (first === 'epaper') return { type: 'tab', tab: 'epaper' };
        return { type: 'category', category: first };
      }
      if (TAB_ROUTES[first]) {
        return { type: 'tab', tab: first };
      }
    }

    return { type: 'unknown' };
  } catch (error) {
    console.error('[DeepLink] Error parsing URL:', error);
    return { type: 'unknown' };
  }
};

/**
 * Map a parsed deep link to an expo-router path, or `null` when it should not
 * navigate (callers keep the user on the current screen).
 */
export const deepLinkToRoute = (data: DeepLinkData): string | null => {
  switch (data.type) {
    case 'article':
      return data.id ? `/article/${encodeURIComponent(data.id)}` : null;
    case 'category':
      return data.category
        ? `/category/${encodeURIComponent(data.category)}`
        : null;
    case 'search':
      return data.query
        ? `/search?q=${encodeURIComponent(data.query)}`
        : '/search';
    case 'tab':
      return data.tab ? TAB_ROUTES[data.tab] ?? null : null;
    default:
      return null;
  }
};

/**
 * The public web URL for an article.
 *
 * VERIFIED against the live site: only `/<section>/<slug>` resolves
 * (`https://www.dailyamardesh.com/politics/amdhz6ur96ynd` → HTTP 200), while
 * `/news/<slug>` returns no response. Since the section is part of the path,
 * pass it when known; otherwise fall back to the generic `news` prefix, which
 * the site redirects for some hosts but must not be relied on — prefer
 * `article.link`, which is always the canonical URL from the feed.
 */
export const buildWebArticleUrl = (
  slugOrId: string,
  sectionSlug?: string
): string => {
  const section = sectionSlug?.trim() || 'news';
  return `${SITE_HOME_URL}/${encodeURIComponent(section)}/${encodeURIComponent(slugOrId)}`;
};

/** Canonical public site origin. Single source of truth for own-brand share links. */
export const SITE_HOME_URL = 'https://www.dailyamardesh.com';

/** The public web URL for a section (category) page. */
export const buildWebCategoryUrl = (slug: string): string =>
  `${SITE_HOME_URL}/${encodeURIComponent(slug)}`;

/** App-scheme link for an article — internal/referral use only. */
export const generateArticleLink = (articleId: string): string =>
  `${APP_SCHEME}://article/${encodeURIComponent(articleId)}`;

export const generateCategoryLink = (category: string): string =>
  `${APP_SCHEME}://category/${encodeURIComponent(category)}`;

export const generateTabLink = (tab: string): string =>
  `${APP_SCHEME}://tab/${encodeURIComponent(tab)}`;

export const generateSearchLink = (query: string): string =>
  `${APP_SCHEME}://search?query=${encodeURIComponent(query)}`;

// ---------------------------------------------------------------------------
// Linking helpers
// ---------------------------------------------------------------------------

/** Subscribe to URLs that arrive while the app is running. */
export const addDeepLinkListener = (
  callback: (url: string) => void
): { remove: () => void } => Linking.addEventListener('url', ({ url }) => callback(url));

/** Read the URL that launched the app, if any. */
export const getInitialDeepLink = async (): Promise<string | null> => {
  try {
    return await Linking.getInitialURL();
  } catch (error) {
    console.error('[DeepLink] Error reading initial URL:', error);
    return null;
  }
};

/** Open an external URL (never used for the app's own scheme). */
export const openURL = async (url: string): Promise<boolean> => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      console.warn(`[DeepLink] Cannot open URL: ${url}`);
      return false;
    }
    await Linking.openURL(url);
    return true;
  } catch (error) {
    console.error('[DeepLink] Error opening URL:', error);
    return false;
  }
};

/** Open the OS settings app (used when a permission is permanently denied). */
export const openSettings = async (): Promise<void> => {
  try {
    await Linking.openSettings();
  } catch (error) {
    console.error('[DeepLink] Error opening settings:', error);
  }
};
