/**
 * Low-data mode and preference persistence.
 *
 * Regression guards for two bugs:
 *  1. The low-data switch was stored but never consulted by image or feed code,
 *     so turning it on changed nothing about what the app downloaded.
 *  2. `loadFeatureFlags` validated feedLayout against only 'magazine'/'compact',
 *     so choosing the swipeable 'card' deck reverted on every relaunch.
 */

import { resolveImageUrl, LOW_DATA_FEED_LIMIT } from '../../utils/imageUrl';
import { useAppStore } from '../../store/useAppStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CDN = 'https://images.dailyamardesh.com/original_images';

describe('imageUrl.resolveImageUrl', () => {
  it('downsizes a large CDN variant to the requested role', () => {
    expect(resolveImageUrl(`${CDN}/story-720x405.webp`, 'thumb', false)).toBe(
      `${CDN}/story-256x144.webp`
    );
    expect(resolveImageUrl(`${CDN}/story-720x405.webp`, 'card', false)).toBe(
      `${CDN}/story-480x270.webp`
    );
  });

  it('never upscales an image that is already smaller than the target', () => {
    expect(resolveImageUrl(`${CDN}/story-256x144.webp`, 'hero', false)).toBe(
      `${CDN}/story-256x144.webp`
    );
  });

  it('uses the smallest variant in low-data mode regardless of role', () => {
    const source = `${CDN}/story-720x405.webp`;
    expect(resolveImageUrl(source, 'hero', true)).toBe(`${CDN}/story-256x144.webp`);
    expect(resolveImageUrl(source, 'card', true)).toBe(`${CDN}/story-256x144.webp`);
    expect(resolveImageUrl(source, 'thumb', true)).toBe(`${CDN}/story-256x144.webp`);
  });

  it('preserves the aspect ratio and file extension', () => {
    const result = resolveImageUrl(`${CDN}/story-1200x675.jpg`, 'thumb', false);
    // 256 * (675/1200) = 144
    expect(result).toBe(`${CDN}/story-256x144.jpg`);
  });

  it('leaves non-variant URLs, other hosts, and malformed input untouched', () => {
    // No size suffix to rewrite.
    expect(resolveImageUrl(`${CDN}/logo.png`, 'thumb', false)).toBe(`${CDN}/logo.png`);
    // Not a resizable host.
    expect(resolveImageUrl('https://example.com/a-720x405.webp', 'thumb', false)).toBe(
      'https://example.com/a-720x405.webp'
    );
    // Unparsable / empty.
    expect(resolveImageUrl('not-a-url', 'thumb', false)).toBe('not-a-url');
    expect(resolveImageUrl('', 'thumb', true)).toBe('');
  });

  it('exposes a bounded low-data feed size', () => {
    expect(LOW_DATA_FEED_LIMIT).toBeGreaterThan(0);
    expect(LOW_DATA_FEED_LIMIT).toBeLessThanOrEqual(30);
  });
});

describe('useAppStore preference persistence', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useAppStore.setState({
      themePreference: 'system',
      feedLayout: 'magazine',
      lowDataMode: false,
    });
  });

  it('round-trips the swipeable card feed layout', async () => {
    // Regression: 'card' was not in the accepted list, so it was silently dropped.
    useAppStore.getState().setFeedLayout('card');
    await useAppStore.getState().loadFeatureFlags();
    expect(useAppStore.getState().feedLayout).toBe('card');
  });

  it('round-trips every supported feed layout', async () => {
    for (const layout of ['magazine', 'compact', 'card'] as const) {
      useAppStore.getState().setFeedLayout(layout);
      await useAppStore.getState().loadFeatureFlags();
      expect(useAppStore.getState().feedLayout).toBe(layout);
    }
  });

  it('round-trips low-data mode and defaults it to off', async () => {
    expect(useAppStore.getState().lowDataMode).toBe(false);

    useAppStore.getState().setLowDataMode(true);
    await useAppStore.getState().loadFeatureFlags();
    expect(useAppStore.getState().lowDataMode).toBe(true);

    useAppStore.getState().setLowDataMode(false);
    await useAppStore.getState().loadFeatureFlags();
    expect(useAppStore.getState().lowDataMode).toBe(false);
  });

  it('round-trips the theme preference including the system sentinel', async () => {
    for (const pref of ['dark', 'sepia', 'light', 'system'] as const) {
      useAppStore.getState().setThemePreference(pref);
      await useAppStore.getState().loadFeatureFlags();
      expect(useAppStore.getState().themePreference).toBe(pref);
    }
  });

  it('ignores an unknown persisted layout instead of corrupting state', async () => {
    useAppStore.getState().setFeedLayout('compact');
    await AsyncStorage.setItem('@amar_desh_feed_layout', '"gigantic"');
    await useAppStore.getState().loadFeatureFlags();
    // Falls back to the previous valid value, never to the bogus one.
    expect(useAppStore.getState().feedLayout).toBe('compact');
  });
});
