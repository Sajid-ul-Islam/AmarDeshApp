/**
 * Navigation Gateway
 *
 * The single entry point for navigation triggered from *outside* React:
 * incoming deep links (`amardesh://…`, `https://dailyamardesh.com/…`) and
 * notification taps.
 *
 * Why late binding: `notificationService` needs to navigate, but
 * `app/_layout.tsx` is the only place that owns the expo-router instance.
 * Importing expo-router directly from a service would also import app routes
 * into unit tests. So the root layout calls `setNavigator(router)` once and
 * every other module routes through the injected implementation; before that
 * (and in tests) navigation is a recorded no-op.
 *
 * See also: `services/deepLinkService.ts` (pure URL → route mapping).
 */

import type { useRouter } from 'expo-router';
import { deepLinkToRoute, parseDeepLink, type DeepLinkData } from './deepLinkService';

/**
 * The expo-router instance the root layout injects.
 *
 * Derived from `useRouter()`'s return type rather than importing an internal
 * `Router`/`ImperativeRouter` type from a `expo-router/build/*` subpath, so this
 * keeps working across expo-router minor releases. Only `push`/`replace` are used.
 */
export type NavigatorLike = Pick<ReturnType<typeof useRouter>, 'push' | 'replace'>;

let navigator: NavigatorLike | null = null;

/** Routes requested before a navigator was available, replayed on attach. */
let pendingRoute: string | null = null;

/** Called by `app/_layout.tsx` once the router is mounted. */
export function setNavigator(next: NavigatorLike | null): void {
  navigator = next;

  if (navigator && pendingRoute) {
    const route = pendingRoute;
    pendingRoute = null;
    safePush(route);
  }
}

/** Whether external navigation is currently possible. */
export function isNavigationReady(): boolean {
  return navigator !== null;
}

/**
 * Test-only: clear the injected navigator and any queued route.
 */
export function __resetNavigationForTests(): void {
  navigator = null;
  pendingRoute = null;
}

function safePush(route: string): boolean {
  if (!navigator) {
    // Queue the first external route so a cold-start deep link is not lost
    // while the router tree is still mounting.
    pendingRoute = route;
    return false;
  }
  try {
    // Routes are built dynamically from URL input, so they cannot be checked
    // against expo-router's generated route union at compile time. This is the
    // single place that assertion happens; every route string originates from
    // deepLinkToRoute()/openArticle(), which only emit known app routes.
    navigator.push(route as Parameters<NavigatorLike['push']>[0]);
    return true;
  } catch (error) {
    console.error(`[Navigation] Failed to open route "${route}":`, error);
    return false;
  }
}

/**
 * Navigate to the route described by an incoming URL.
 *
 * Returns the route that was navigated to, or `null` when the URL was unknown
 * or malformed (in which case the caller should leave the user where they are).
 */
export function handleIncomingUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  const data: DeepLinkData = parseDeepLink(url);
  const route = deepLinkToRoute(data);

  if (!route) {
    if (data.type !== 'unknown') {
      console.warn(`[Navigation] Deep link had no route: ${url}`);
    }
    return null;
  }

  safePush(route);
  return route;
}

/**
 * Navigate to an article by id.
 *
 * Prefers the in-app route (so the article opens inside the app rather than a
 * browser). Used by notification taps and share-sheet referrals.
 */
export function openArticle(articleId: string | null | undefined): string | null {
  if (!articleId) return null;
  const route = `/article/${encodeURIComponent(articleId)}`;
  safePush(route);
  return route;
}
