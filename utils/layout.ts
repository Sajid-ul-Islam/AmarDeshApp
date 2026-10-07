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
export function getSafeHeaderPaddingTop(insetsTop: number = 0, extraOffset: number = 8): number {
  const androidStatusBarHeight =
    Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 0;
  const iosMinimumStatus = Platform.OS === 'ios' ? 20 : 0;

  // Use the largest of the measured safe inset or known platform status bar heights
  const effectiveTop = Math.max(insetsTop, androidStatusBarHeight, iosMinimumStatus);

  return effectiveTop + extraOffset;
}
