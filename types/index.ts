/**
 * Shared application types.
 *
 * `Article` and `CategoryMeta` used to live inside `data/mockData.ts`, which
 * forced every screen and service to import the mock-data module just to get a
 * type — and kept the mock fixtures reachable from the production bundle. Types
 * live here now; `data/mockData.ts` re-exports `Article` so existing import
 * sites keep compiling while they are migrated.
 */

/** A news article, whether from the live RSS feed, offline cache, or the CMS. */
export interface Article {
  /** Stable id. Live feed ids are `rss-<djb2 hash of the article URL>`. */
  id: string;
  title: string;
  /** Short teaser shown on cards. */
  excerpt: string;
  /** Full body text (live feed items carry the feed description). */
  content: string;
  /** Bengali category label, e.g. `রাজনীতি`. */
  category: string;
  imageUrl: string;
  author: string;
  /** ISO 8601 timestamp. */
  publishedAt: string;
  isBreaking?: boolean;
  /**
   * Canonical public URL of the story on dailyamardesh.com.
   *
   * This is the URL that must be shared: it opens in a browser for recipients
   * without the app, and resolves to the article route when the app is
   * installed. Never share an `amardesh://` link — see services/sharingService.
   */
  link?: string;
}

/** A site section, used for navigation and category filtering. */
export interface CategoryMeta {
  id: string;
  /** Bengali display name, matching dailyamardesh.com. */
  name: string;
  /** URL-safe slug used in `/category/[slug]`. */
  slug: string;
  description?: string;
  /** Sections with bespoke presentation (e.g. the July Revolution hub). */
  isSpecial?: boolean;
}
