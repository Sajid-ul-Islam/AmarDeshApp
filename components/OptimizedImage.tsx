import React, { useMemo } from 'react';
import { Image as ExpoImage } from 'expo-image';
import type { ImageContentFit, ImageProps as ExpoImageProps, ImageTransition } from 'expo-image';
import { Image as RNImage, StyleSheet } from 'react-native';
import type { ImageProps as RNImageProps } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { resolveImageUrl, type ImageSize } from '../utils/imageUrl';

type OptimizedImageSource =
  | string
  | number
  | { uri: string }
  | string[]
  | { uri: string }[];

type OptimizedImageProps = {
  source: OptimizedImageSource;
  style?: ExpoImageProps['style'];
  contentFit?: ImageContentFit;
  transition?: ImageTransition | number | null;
  cachePolicy?: NonNullable<ExpoImageProps['cachePolicy']>;
  recyclingKey?: string;
  placeholder?: string;
  blurhash?: string;
  testID?: string;
  /**
   * Display role, used to pick a right-sized CDN variant and to honour
   * low-data mode. Defaults to `card`.
   */
  size?: ImageSize;
} & Omit<RNImageProps, 'source' | 'style' | 'resizeMode' | 'testID'>;

/**
 * Optimized Image Component
 *
 * Uses expo-image when enableExpoImage feature flag is true,
 * falls back to React Native Image otherwise.
 *
 * Benefits of expo-image:
 * - 10x faster image loading
 * - Progressive JPEG support
 * - WebP support
 * - Advanced caching (memory + disk)
 * - Smooth fade-in transitions
 * - Better memory management
 *
 * Honours low-data mode: images are requested at the smallest stored CDN
 * variant, decode quality is lowered, and the disk cache is skipped (which was
 * previously a stored preference with no effect on what the app downloaded).
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = (props) => {
  const features = useAppStore((state) => state.features);
  const lowDataMode = useAppStore((state) => state.lowDataMode);
  const {
    source,
    style,
    contentFit = 'cover',
    transition = 200,
    cachePolicy = 'memory-disk',
    recyclingKey,
    placeholder,
    blurhash,
    testID,
    size = 'card',
    ...rest
  } = props;

  const sizedSource = useMemo<OptimizedImageSource>(() => {
    // Rewrite only the URI-carrying branches; numbers (bundled local assets)
    // and anything unrecognised are passed through untouched.
    if (typeof source === 'string') {
      return resolveImageUrl(source, size, lowDataMode);
    }

    if (Array.isArray(source)) {
      const asUris = (items: string[]): string[] =>
        items.map((item) => resolveImageUrl(item, size, lowDataMode));
      const asObjects = (items: { uri: string }[]): { uri: string }[] =>
        items.map((item) => ({
          uri: resolveImageUrl(item.uri, size, lowDataMode),
        }));

      const looksLikeUris =
        source.length === 0 || typeof source[0] === 'string';
      return looksLikeUris
        ? asUris(source as string[])
        : asObjects(source as { uri: string }[]);
    }

    if (typeof source === 'object' && source !== null) {
      const single = source as { uri: string };
      return { uri: resolveImageUrl(single.uri, size, lowDataMode) };
    }

    return source;
  }, [source, size, lowDataMode]);

  const expoSource =
    typeof sizedSource === 'string' || typeof sizedSource === 'number' || Array.isArray(sizedSource)
      ? sizedSource
      : sizedSource.uri;
  const rnSource = Array.isArray(sizedSource)
    ? sizedSource.map((item) => (typeof item === 'string' ? { uri: item } : item))
    : typeof sizedSource === 'string'
      ? { uri: sizedSource }
      : sizedSource;

  // Use expo-image if feature flag is enabled
  if (features.enableExpoImage) {
    return (
      <ExpoImage
        source={expoSource}
        style={style}
        contentFit={contentFit}
        transition={lowDataMode ? 0 : transition}
        cachePolicy={lowDataMode ? 'memory' : cachePolicy}
        recyclingKey={recyclingKey}
        placeholder={blurhash || placeholder}
        testID={testID}
      />
    );
  }

  // Fallback to React Native Image
  return (
    <RNImage
      source={rnSource}
      style={style}
      resizeMode={contentFit === 'cover' ? 'cover' : contentFit === 'contain' ? 'contain' : 'stretch'}
      testID={testID}
      {...rest}
    />
  );
};

/**
 * Article Thumbnail Image
 * Optimized for article list thumbnails
 */
export const ArticleThumbnail: React.FC<{
  uri: string;
  style?: ExpoImageProps['style'];
  recyclingKey?: string;
}> = ({ uri, style, recyclingKey }) => {
  return (
    <OptimizedImage
      source={uri}
      style={[styles.thumbnail, style]}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
      recyclingKey={recyclingKey}
      size="thumb"
    />
  );
};

/**
 * Article Hero Image
 * Optimized for large hero images
 */
export const ArticleHeroImage: React.FC<{
  uri: string;
  style?: ExpoImageProps['style'];
}> = ({ uri, style }) => {
  return (
    <OptimizedImage
      source={uri}
      style={[styles.hero, style]}
      contentFit="cover"
      transition={300}
      cachePolicy="memory-disk"
      size="hero"
    />
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    width: '100%',
    height: 100,
    backgroundColor: '#f0f0f0',
  },
  hero: {
    width: '100%',
    height: 220,
    backgroundColor: '#f0f0f0',
  },
});

export default OptimizedImage;
