/**
 * Image URL Sizing
 *
 * The Amar Desh CDN stores WordPress-style responsive variants of every
 * uploaded image: `…-720x405.webp`, `…-256x144.webp`, and so on. Live feed
 * items reference the large variant, which is wasteful for a 100px thumbnail —
 * and especially wasteful in low-data mode, which was previously just a stored
 * boolean with no effect on rendering.
 *
 * These helpers rewrite a known variant to a smaller one on the same host. Only
 * URLs that already carry a variant suffix are touched, and hosts are never
 * swapped, so an unrecognised URL is passed through unchanged.
 */

/** Match the trailing `-<width>x<height>` before the extension. */
const VARIANT_PATTERN = /-(\d{2,4})x(\d{2,4})(\.[a-z0-9]+)$/i;

/** Hosts that serve resizable article imagery. */
const RESIZABLE_HOSTS = new Set(['images.dailyamardesh.com']);

export type ImageSize = 'thumb' | 'card' | 'hero' | 'full';

/** Target widths per role. Chosen to match variants the CDN actually stores. */
const TARGET_WIDTH: Record<ImageSize, number> = {
  thumb: 256,
  card: 480,
  hero: 720,
  full: Number.POSITIVE_INFINITY,
};

function resizeUrl(url: string, size: ImageSize): string {
  if (!url || typeof url !== 'string') return url;

  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return url;
  }

  if (!RESIZABLE_HOSTS.has(host)) return url;

  const match = url.match(VARIANT_PATTERN);
  if (!match) return url;

  const currentWidth = Number(match[1]);
  const targetWidth = TARGET_WIDTH[size];
  if (!Number.isFinite(targetWidth) || currentWidth <= targetWidth) {
    // Already small enough (or a full-size request): leave it alone.
    return url;
  }

  const aspect = Number(match[2]) / currentWidth;
  const height = Math.max(1, Math.round(targetWidth * aspect));

  return url.replace(VARIANT_PATTERN, `-${targetWidth}x${height}$3`);
}

/**
 * Pick the best image URL for a display role.
 *
 * In low-data mode every role is capped at the thumbnail variant so the reader
 * saves bandwidth.
 */
export function resolveImageUrl(
  url: string,
  size: ImageSize,
  lowDataMode: boolean
): string {
  if (!url) return url;

  if (!lowDataMode) return resizeUrl(url, size);

  // Low data: always the smallest stored variant.
  return resizeUrl(url, 'thumb');
}

/** How many feed items to render while low-data mode is on. */
export const LOW_DATA_FEED_LIMIT = 12;
