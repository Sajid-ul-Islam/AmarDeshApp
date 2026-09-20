import React from 'react';
import { Image as ExpoImage } from 'expo-image';
import type { ImageContentFit, ImageProps as ExpoImageProps, ImageTransition } from 'expo-image';
import { Image as RNImage, StyleSheet } from 'react-native';
import type { ImageProps as RNImageProps } from 'react-native';
import { useAppStore } from '../store/useAppStore';

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
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = (props) => {
  const { features } = useAppStore();
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
    ...rest 
  } = props;
  const expoSource =
    typeof source === 'string' || typeof source === 'number' || Array.isArray(source)
      ? source
      : source.uri;
  const rnSource = Array.isArray(source)
    ? source.map((item) => (typeof item === 'string' ? { uri: item } : item))
    : typeof source === 'string'
      ? { uri: source }
      : source;

  // Use expo-image if feature flag is enabled
  if (features.enableExpoImage) {
    return (
      <ExpoImage
        source={expoSource}
        style={style}
        contentFit={contentFit}
        transition={transition}
        cachePolicy={cachePolicy}
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
