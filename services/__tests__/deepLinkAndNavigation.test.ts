/**
 * Deep link parsing + navigation gateway tests.
 *
 * These cover the real production URL shapes the Amar Desh CMS emits
 * (e.g. https://www.dailyamardesh.com/politics/amdhz6ur96ynd) as well as the
 * app's own scheme, and assert that unknown input never hijacks navigation.
 */

import {
  parseDeepLink,
  deepLinkToRoute,
  buildWebArticleUrl,
  generateArticleLink,
  APP_LINK_HOSTS,
} from '../deepLinkService';
import {
  setNavigator,
  handleIncomingUrl,
  openArticle,
  isNavigationReady,
  __resetNavigationForTests,
} from '../navigationService';

describe('deepLinkService.parseDeepLink', () => {
  it('parses the app scheme for articles, categories, tabs and search', () => {
    expect(parseDeepLink('amardesh://article/amd001')).toEqual({
      type: 'article',
      id: 'amd001',
    });
    expect(parseDeepLink('amardesh://category/sports')).toEqual({
      type: 'category',
      category: 'sports',
    });
    expect(parseDeepLink('amardesh://tab/bookmarks')).toEqual({
      type: 'tab',
      tab: 'bookmarks',
    });
    expect(parseDeepLink('amardesh://search?query=cricket')).toEqual({
      type: 'search',
      query: 'cricket',
    });
  });

  it('parses real public site URLs (section/slug)', () => {
    // Verified live shape: https://www.dailyamardesh.com/politics/amdhz6ur96ynd
    expect(parseDeepLink('https://www.dailyamardesh.com/politics/amdhz6ur96ynd')).toEqual({
      type: 'article',
      id: 'amdhz6ur96ynd',
    });
    // Bare domain as well as www.
    expect(parseDeepLink('https://dailyamardesh.com/sports/abc123')).toEqual({
      type: 'article',
      id: 'abc123',
    });
  });

  it('parses an unpublished/unknown section as an article rather than dropping it', () => {
    // A brand-new site vertical must still open the story.
    expect(parseDeepLink('https://www.dailyamardesh.com/lifestyle/new-story-slug')).toEqual({
      type: 'article',
      id: 'new-story-slug',
    });
  });

  it('parses legacy query-parameter links', () => {
    expect(parseDeepLink('https://www.dailyamardesh.com/?article=amd005')).toEqual({
      type: 'article',
      id: 'amd005',
    });
    expect(parseDeepLink('amardesh://open?articleId=amd007&source=notification')).toEqual({
      type: 'article',
      id: 'amd007',
    });
  });

  it('maps single-segment section URLs to tabs and categories', () => {
    expect(parseDeepLink('https://www.dailyamardesh.com/latest')).toEqual({
      type: 'tab',
      tab: 'home',
    });
    expect(parseDeepLink('https://www.dailyamardesh.com/video')).toEqual({
      type: 'tab',
      tab: 'video',
    });
    expect(parseDeepLink('https://www.dailyamardesh.com/politics')).toEqual({
      type: 'category',
      category: 'politics',
    });
  });

  it('never claims a host the app does not own', () => {
    expect(parseDeepLink('https://evil.example.com/politics/abc')).toEqual({
      type: 'unknown',
    });
    expect(parseDeepLink('https://www.dailyamardesh.com.evil.example.com/politics/abc')).toEqual({
      type: 'unknown',
    });
  });

  it('returns unknown for empty, malformed, or non-string input without throwing', () => {
    expect(parseDeepLink('')).toEqual({ type: 'unknown' });
    expect(parseDeepLink('   ')).toEqual({ type: 'unknown' });
    expect(parseDeepLink('not a url at all')).toEqual({ type: 'unknown' });
    expect(parseDeepLink(undefined as unknown as string)).toEqual({ type: 'unknown' });
    expect(parseDeepLink(null as unknown as string)).toEqual({ type: 'unknown' });
  });

  it('decodes percent-encoded ids and queries', () => {
    expect(parseDeepLink('amardesh://article/rss%2Dabc')).toEqual({
      type: 'article',
      id: 'rss-abc',
    });
    expect(parseDeepLink('amardesh://search?query=%E0%A6%95%E0%A7%8D%E0%A6%B0%E0%A6%BF%E0%A6%95%E0%A7%87%E0%A6%9F')).toEqual({
      type: 'search',
      query: 'ক্রিকেট',
    });
  });
});

describe('deepLinkService.deepLinkToRoute', () => {
  it('maps every known type to an expo-router path', () => {
    expect(deepLinkToRoute({ type: 'article', id: 'amd001' })).toBe('/article/amd001');
    expect(deepLinkToRoute({ type: 'category', category: 'sports' })).toBe('/category/sports');
    expect(deepLinkToRoute({ type: 'search', query: 'cricket' })).toBe('/search?q=cricket');
    expect(deepLinkToRoute({ type: 'tab', tab: 'bookmarks' })).toBe('/bookmarks');
    expect(deepLinkToRoute({ type: 'tab', tab: 'saved' })).toBe('/bookmarks');
    expect(deepLinkToRoute({ type: 'tab', tab: 'home' })).toBe('/');
  });

  it('returns null for unknown or incomplete links', () => {
    expect(deepLinkToRoute({ type: 'unknown' })).toBeNull();
    expect(deepLinkToRoute({ type: 'article' })).toBeNull();
    expect(deepLinkToRoute({ type: 'category' })).toBeNull();
    expect(deepLinkToRoute({ type: 'tab', tab: 'nonexistent-tab' })).toBeNull();
  });
});

describe('deepLinkService link builders', () => {
  it('builds a public https URL for sharing (never the app scheme)', () => {
    const url = buildWebArticleUrl('amdhz6ur96ynd');
    expect(url).toBe('https://www.dailyamardesh.com/news/amdhz6ur96ynd');
    expect(url.startsWith('https://')).toBe(true);
  });

  it('encodes ids that contain reserved characters', () => {
    expect(buildWebArticleUrl('a/b?c')).toBe('https://www.dailyamardesh.com/news/a%2Fb%3Fc');
  });

  it('builds the internal app-scheme link', () => {
    expect(generateArticleLink('amd001')).toBe('amardesh://article/amd001');
  });

  it('claims exactly the hosts declared in app.json', () => {
    expect(APP_LINK_HOSTS).toEqual(['www.dailyamardesh.com', 'dailyamardesh.com']);
  });
});

describe('navigationService gateway', () => {
  const push = jest.fn();

  beforeEach(() => {
    push.mockClear();
    __resetNavigationForTests();
  });

  afterEach(() => {
    __resetNavigationForTests();
  });

  it('reports not-ready and queues the route until a navigator is injected', () => {
    expect(isNavigationReady()).toBe(false);

    const route = handleIncomingUrl('amardesh://article/coldstart1');
    expect(route).toBe('/article/coldstart1');

    // No navigator yet: nothing pushed, but the route is not lost.
    expect(push).not.toHaveBeenCalled();

    // Attaching the navigator flushes the queued cold-start route.
    setNavigator({ push, replace: jest.fn() } as never);
    expect(push).toHaveBeenCalledWith('/article/coldstart1');
  });

  it('navigates a public web article URL into the app', () => {
    setNavigator({ push, replace: jest.fn() } as never);
    const route = handleIncomingUrl('https://www.dailyamardesh.com/politics/amdhz6ur96ynd');
    expect(route).toBe('/article/amdhz6ur96ynd');
    expect(push).toHaveBeenCalledWith('/article/amdhz6ur96ynd');
  });

  it('ignores unknown links instead of navigating home', () => {
    setNavigator({ push, replace: jest.fn() } as never);
    expect(handleIncomingUrl('https://evil.example.com/politics/abc')).toBeNull();
    expect(handleIncomingUrl(null)).toBeNull();
    expect(push).not.toHaveBeenCalled();
  });

  it('opens an article by id, and is a no-op without an id', () => {
    setNavigator({ push, replace: jest.fn() } as never);
    expect(openArticle('amd002')).toBe('/article/amd002');
    expect(push).toHaveBeenCalledWith('/article/amd002');

    push.mockClear();
    expect(openArticle(undefined)).toBeNull();
    expect(push).not.toHaveBeenCalled();
  });

  it('does not throw when the navigator itself throws', () => {
    const exploding = jest.fn(() => {
      throw new Error('navigation unavailable');
    });
    setNavigator({ push: exploding, replace: jest.fn() } as never);

    expect(() => handleIncomingUrl('amardesh://article/amd003')).not.toThrow();
    expect(exploding).toHaveBeenCalled();
  });
});
