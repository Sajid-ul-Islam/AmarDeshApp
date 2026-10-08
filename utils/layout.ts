import { Platform, StatusBar } from 'react-native';

/**
 * Calculates a robust, fail-safe top padding that prevents ANY component from
 * overlapping with the mobile device's top status bar, camera punch-hole, notch, or Dynamic Island.
 *
 * Essential for modern edge-to-edge screen configurations on Android 14/15 and iOS.
 *
 * @param insetsTop - Top inset from useSafeAreaInsets()
 * @param extraOffset - Additional breathing room (default: 8px)
 * @returns Safe top padding in pixels
 */
export function getSafeHeaderPaddingTop(insetsTop: number = 0, extraOffset: number = 4): number {
  const androidStatusBarHeight =
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;
  const iosMinimumStatus = Platform.OS === 'ios' ? 20 : 0;

  // Use the largest of the measured safe inset or known platform status bar heights
  const effectiveTop = Math.max(insetsTop, androidStatusBarHeight, iosMinimumStatus);

  return effectiveTop + extraOffset;
}

/** Content height of the bottom tab bar, excluding the device's bottom inset. */
export const TAB_BAR_CONTENT_HEIGHT = 60;

/**
 * Bottom padding that keeps scrollable content clear of the floating bottom tab
 * bar and the device's home indicator / gesture bar.
 *
 * The tab bar is positioned over the screen content by the navigator, so a
 * scroll view whose content ends flush with the viewport has its last row
 * (and any "load more" affordance) hidden behind the bar. This returns a value
 * that clears the bar plus the device inset, with extra room for an overlay
 * such as the floating video player.
 *
 * @param insetsBottom - Bottom inset from useSafeAreaInsets()
 * @param extraOffset - Additional breathing room above the bar (default: 16px)
 * @param includeTabBar - Set false on screens rendered outside the tab
 *                        navigator (settings, article, auth, ...)
 */
export function getSafeBottomPadding(
  insetsBottom: number = 0,
  extraOffset: number = 16,
  includeTabBar: boolean = true
): number {
  const bar = includeTabBar ? TAB_BAR_CONTENT_HEIGHT : 0;
  return bar + Math.max(insetsBottom, 0) + extraOffset;
}
