/**
 * Live end-to-end smoke test for the content pipeline.
 *
 * Everything else in the suite uses fixtures; this one hits the real production
 * feed to prove that `fetchRSSFeed` → `parseRSSFeed` still produces usable
 * articles against the site as it exists today. It is the check that answers
 * "is the app actually fetching live news?".
 *
 * Network-dependent: the assertions are structural (counts, shapes, ordering)
 * rather than content-specific, so a changed headline never breaks the build.
 * Run manually with:
 *   npm test -- services/__tests__/liveFeed.integration.test.ts
 */

import { fetchRSSFeed, parseRSSFeed } from '../rssService';
import { loadArticles, getArticles, __resetArticleStoreForTests } from '../articleStore';
import type { Article } from '../../types';

const TEST_TIMEOUT_MS = 45_000;

/** Skip cleanly in offline CI rather than reporting a false failure. */
async function feedIsReachable(): Promise<boolean> {
  try {
    const response = await fetch('https://www.dailyamardesh.com/feed', {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}

describe('live RSS feed (network)', () => {
  let reachable = false;

  beforeAll(async () => {
    reachable = await feedIsReachable();
    if (!reachable) {
      console.warn('[liveFeed] dailyamardesh.com/feed unreachable — skipping live assertions');
    }
  }, TEST_TIMEOUT_MS);

  it('fetches and parses real articles from the production feed', async () => {
    if (!reachable) return;

    const articles = await fetchRSSFeed();
    // Diagnostic: proves the network path actually ran (a skipped test would
    // otherwise look identical to a passing one).
    // eslint-disable-next-line no-console
    console.log(`[liveFeed] parsed ${articles.length} live articles; first: ${articles[0]?.title?.slice(0, 40)}`);

    expect(Array.isArray(articles)).toBe(true);
    expect(articles.length).toBeGreaterThan(0);

    for (const article of articles) {
      // Ids are what bookmarks, deep links and reading history key on.
      expect(article.id).toMatch(/^rss-[0-9a-z]+$/);
      // Titles must be decoded Bengali, not raw CDATA.
      expect(article.title.length).toBeGreaterThan(3);
      expect(article.title).not.toContain('CDATA');
      expect(article.title).toMatch(/[\u0980-\u09FF]/);
      // The shareable URL must be a real public https link.
      expect(article.link).toMatch(/^https:\/\/www\.dailyamardesh\.com\//);
      // Body must be usable text with paragraph structure preserved.
      expect(article.content.length).toBeGreaterThan(10);
      expect(article.content).not.toMatch(/<[a-z/]/i);
      // A category is required for section filtering.
      expect(article.category.length).toBeGreaterThan(0);
      // Image must be an absolute URL so it renders.
      expect(article.imageUrl).toMatch(/^https?:\/\//);
      // Dates must be valid so relative-time formatting works.
      expect(Number.isNaN(new Date(article.publishedAt).getTime())).toBe(false);
    }
  }, TEST_TIMEOUT_MS);

  it('returns articles newest-first', async () => {
    if (!reachable) return;

    const articles = await fetchRSSFeed();
    const times = articles.map((a) => new Date(a.publishedAt).getTime());
    const sorted = [...times].sort((a, b) => b - a);
    expect(times).toEqual(sorted);
  }, TEST_TIMEOUT_MS);

  it('produces at least one multi-paragraph article', async () => {
    if (!reachable) return;

    const articles = await fetchRSSFeed();
    const withParagraphs = articles.filter((a) => a.content.includes('\n\n'));
    // Regression guard: the old parser collapsed every body into one blob.
    expect(withParagraphs.length).toBeGreaterThan(0);
  }, TEST_TIMEOUT_MS);

  it('serves the same article across a refresh with a stable id', async () => {
    if (!reachable) return;

    const first = await fetchRSSFeed();
    const second = await fetchRSSFeed();

    const firstIds = new Set(first.map((a) => a.id));
    const overlap = second.filter((a) => firstIds.has(a.id));

    // The feed is 20 items and changes slowly; at least one story must persist
    // with the identical id, or bookmarks/deep links would break on every load.
    expect(overlap.length).toBeGreaterThan(0);
    const sample = overlap[0];
    const sameInFirst = first.find((a) => a.id === sample.id) as Article;
    expect(sameInFirst.title).toBe(sample.title);
    expect(sameInFirst.link).toBe(sample.link);
  }, TEST_TIMEOUT_MS);

  it('flows through the shared article store (what screens read)', async () => {
    if (!reachable) return;

    __resetArticleStoreForTests();
    const stored = await loadArticles();
    const snapshot = getArticles();

    // The store keeps no mock fallback any more, so a working network path must
    // leave real articles in memory.
    expect(stored.length).toBeGreaterThan(0);
    expect(snapshot.length).toBe(stored.length);
    expect(snapshot[0].id).toMatch(/^rss-/);
  }, TEST_TIMEOUT_MS);

  it('parses the real feed markup without regressing on the old bug', async () => {
    if (!reachable) return;

    const xml = await (await fetch('https://www.dailyamardesh.com/feed')).text();
    const articles = parseRSSFeed(xml);

    expect(articles.length).toBeGreaterThan(0);
    // No leftover WordPress read-more anchors or stray markup.
    for (const article of articles) {
      expect(article.content).not.toContain('more_link');
      expect(article.content).not.toContain('href=');
      expect(article.content).not.toContain('&amp;');
      expect(article.content).not.toContain('&nbsp;');
      // A trailing bare "বিস্তারিত" is the more-link label. Mid-sentence prose
      // such as "বিস্তারিত আসছে..." is legitimate editorial copy and must stay.
      expect(article.content).not.toMatch(/(^|\s)বিস্তারিত\s*$/u);
    }
  }, TEST_TIMEOUT_MS);
});
