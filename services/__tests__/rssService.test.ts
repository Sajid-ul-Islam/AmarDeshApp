/**
 * RSS parsing tests against a REAL feed fixture.
 *
 * `fixtures/amar-desh-feed-sample.xml` is three unmodified `<item>` elements
 * captured from https://www.dailyamardesh.com/feed, so these assertions pin the
 * parser to the feed's actual markup contract rather than to a simplified
 * hand-written sample. The previous parser stripped all HTML before looking for
 * paragraph breaks, which collapsed each article into a single blob; the
 * paragraph assertions below are the regression guard for that.
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { parseRSSFeed, stripCDATA } from '../rssService';
import type { Article } from '../../types';

const FIXTURE = readFileSync(
  join(__dirname, 'fixtures', 'amar-desh-feed-sample.xml'),
  'utf-8'
);

describe('rssService.parseRSSFeed (real feed fixture)', () => {
  let articles: Article[];

  beforeAll(() => {
    articles = parseRSSFeed(FIXTURE);
  });

  it('parses every item in the feed', () => {
    expect(articles.length).toBe(3);
  });

  it('extracts a clean, decoded Bengali title with no CDATA wrapper', () => {
    for (const article of articles) {
      expect(article.title.length).toBeGreaterThan(0);
      expect(article.title).not.toContain('CDATA');
      expect(article.title).not.toContain('<![CDATA[');
      expect(article.title).not.toContain(']]>');
      // Bengali script must survive decoding.
      expect(article.title).toMatch(/[\u0980-\u09FF]/);
    }
  });

  it('assigns stable `rss-` ids derived from the article URL', () => {
    for (const article of articles) {
      expect(article.id).toMatch(/^rss-[0-9a-z]+$/);
    }
    // Deterministic: re-parsing yields identical ids.
    const again = parseRSSFeed(FIXTURE);
    expect(again.map((a) => a.id)).toEqual(articles.map((a) => a.id));
  });

  it('keeps the canonical public link, which is what gets shared', () => {
    for (const article of articles) {
      expect(article.link).toMatch(/^https:\/\/www\.dailyamardesh\.com\//);
      // The link must not be the app's own scheme.
      expect(article.link?.startsWith('amardesh://')).toBe(false);
    }
    // Ids are derived from the link, so a shared id round-trips.
    const first = articles[0];
    expect(first.link).toBeDefined();
  });

  it('preserves paragraph structure instead of collapsing the body', () => {
    for (const article of articles) {
      expect(article.content.length).toBeGreaterThan(40);
      // Real paragraphs, separated by blank lines.
      expect(article.content).not.toContain('<p>');
      expect(article.content).not.toContain('</p>');
      expect(article.content).not.toContain('<img');
      // No leftover WordPress "read more" label.
      expect(article.content).not.toMatch(/বিস্তারিত\s*$/u);
      expect(article.content).not.toContain('more_link');
    }
  });

  it('strips the WordPress more_link anchor and its label', () => {
    // The fixture contains `<a class="more_link" …>বিস্তারিত</a>` in every item.
    expect(FIXTURE).toContain('more_link');
    expect(FIXTURE).toContain('বিস্তারিত');
    for (const article of articles) {
      expect(article.content).not.toContain('more_link');
      expect(article.content).not.toMatch(/বিস্তারিত/u);
    }
  });

  it('reads the image from the body, not from the self-closing enclosure', () => {
    // `<enclosure … />` is self-closing, so a paired-tag regex cannot match it.
    expect(FIXTURE).toMatch(/<enclosure[^>]*\/>/);
    for (const article of articles) {
      expect(article.imageUrl).toMatch(/^https:\/\//);
      expect(article.imageUrl).not.toContain('<');
    }
  });

  it('finds a category for every item', () => {
    for (const article of articles) {
      expect(article.category.length).toBeGreaterThan(0);
      expect(article.category).toMatch(/[\u0980-\u09FF]/);
      // The previous fallback leaked through when the tag was missed.
      expect(article.category).not.toContain('<');
    }
  });

  it('produces a valid ISO publishedAt and a non-empty excerpt', () => {
    for (const article of articles) {
      expect(Number.isNaN(new Date(article.publishedAt).getTime())).toBe(false);
      expect(article.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(article.excerpt.length).toBeGreaterThan(0);
      expect(article.excerpt.length).toBeLessThanOrEqual(181);
    }
  });

  it('sorts newest first', () => {
    const times = articles.map((a) => new Date(a.publishedAt).getTime());
    const sorted = [...times].sort((a, b) => b - a);
    expect(times).toEqual(sorted);
  });

  it('falls back to the desk byline when the feed has no creator tag', () => {
    // Verified: the live feed emits no <dc:creator>.
    expect(FIXTURE).not.toContain('<dc:creator');
    for (const article of articles) {
      expect(article.author).toBe('আমার দেশ ডেস্ক');
    }
  });
});

describe('rssService.parseRSSFeed (defensive)', () => {
  it('returns an empty array for malformed or empty input without throwing', () => {
    expect(parseRSSFeed('')).toEqual([]);
    expect(parseRSSFeed('<rss></rss>')).toEqual([]);
    expect(parseRSSFeed('not xml at all')).toEqual([]);
    expect(parseRSSFeed(undefined as unknown as string)).toEqual([]);
  });

  it('skips items with no title rather than emitting blank cards', () => {
    const xml = `<rss><channel>
      <item><link>https://www.dailyamardesh.com/x/1</link><pubDate>Thu, 08 Oct 2026 09:00:00 GMT</pubDate></item>
      <item><title>ঠিক আছে</title><link>https://www.dailyamardesh.com/x/2</link><pubDate>Thu, 08 Oct 2026 09:00:00 GMT</pubDate></item>
    </channel></rss>`;
    const parsed = parseRSSFeed(xml);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].title).toBe('ঠিক আছে');
  });

  it('falls back to the headline for body-less video items', () => {
    // Real feed shape for a `<category>ভিডিও</category>` item: the body contains
    // nothing but an <img> and the "বিস্তারিত" more-link, so paragraph extraction
    // yields an empty list. An empty `content` rendered a blank article page.
    const xml = `<rss><channel><item>
      <title><![CDATA[নোবেল নিয়ে ট্রাম্পের আক্ষেপ কাটছে না]]></title>
      <link>https://www.dailyamardesh.com/video/amdad4hog4g9m</link>
      <pubDate>Thu, 08 Oct 2026 09:29:25 GMT</pubDate>
      <description><![CDATA[
        <p>
          <img style="height:576px;width:1024px" src="https://images.dailyamardesh.com/original_images/clip-d01e5c.jpg" />
          <a class="more_link" href="https://www.dailyamardesh.com/video/amdad4hog4g9m">বিস্তারিত</a>
        </p>
      ]]></description>
      <category>ভিডিও</category>
      <enclosure length="0" type="image/jpg" url="https://images.dailyamardesh.com/original_images/clip-d01e5c.jpg"/>
    </item></channel></rss>`;

    const [article] = parseRSSFeed(xml);

    expect(article).toBeDefined();
    expect(article.content.length).toBeGreaterThan(0);
    expect(article.content).toBe('নোবেল নিয়ে ট্রাম্পের আক্ষেপ কাটছে না');
    expect(article.excerpt.length).toBeGreaterThan(0);
    // The image still comes from the body so the card renders.
    expect(article.imageUrl).toContain('clip-d01e5c.jpg');
  });

  it('keeps legitimate mid-sentence "বিস্তারিত আসছে" prose', () => {
    // Only the read-more LABEL is an artifact; the word inside a sentence is
    // normal editorial copy and must not be stripped.
    const xml = `<rss><channel><item>
      <title>বন্দর চুক্তি</title>
      <link>https://www.dailyamardesh.com/bangladesh/port-deal</link>
      <pubDate>Thu, 08 Oct 2026 09:00:00 GMT</pubDate>
      <description><![CDATA[<p>বৃহস্পতিবার এ নিয়ে চুক্তি স্বাক্ষরিত হয়েছে। বিস্তারিত আসছে...</p>]]></description>
      <category>সারা দেশ</category>
    </item></channel></rss>`;

    const [article] = parseRSSFeed(xml);
    expect(article.content).toContain('বিস্তারিত আসছে');
  });

  it('decodes numeric HTML entities', () => {
    const xml = `<rss><channel><item>
      <title>ক&#8217;খন &#8220;উদ্ধৃতি&#8221;</title>
      <link>https://www.dailyamardesh.com/x/3</link>
      <pubDate>Thu, 08 Oct 2026 09:00:00 GMT</pubDate>
    </item></channel></rss>`;
    const [article] = parseRSSFeed(xml);
    expect(article.title).toBe('ক’খন “উদ্ধৃতি”');
  });

  it('normalizes a missing pubDate to a valid ISO timestamp', () => {
    const xml = `<rss><channel><item>
      <title>শিরোনাম</title>
      <link>https://www.dailyamardesh.com/x/4</link>
    </item></channel></rss>`;
    const [article] = parseRSSFeed(xml);
    expect(Number.isNaN(new Date(article.publishedAt).getTime())).toBe(false);
    expect(typeof article.isBreaking).toBe('boolean');
    // A missing pubDate normalizes to "now", which counts as recent.
    expect(article.isBreaking).toBe(true);
  });
});

describe('rssService.stripCDATA', () => {
  it('unwraps CDATA and trims', () => {
    expect(stripCDATA('<![CDATA[ hello ]]>')).toBe('hello');
    expect(stripCDATA('plain')).toBe('plain');
    expect(stripCDATA('')).toBe('');
  });
});
