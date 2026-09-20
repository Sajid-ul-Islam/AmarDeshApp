import React from 'react';
import { Image as ExpoImage, ImageProps as ExpoImageProps } from 'expo-image';
import { Image as RNImage, ImageProps as RNImageProps, StyleSheet, View } from 'react-native';
import { useAppStore } from '../store/useAppStore';

// Combined props type
type ImageProps = (ExpoImageProps | RNImageProps) & {
  source: any;
  style?: any;
  contentFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  transition?: number | { duration: number; effect?: 'ease-in-out' | 'ease-in' | 'ease-out' | 'linear' | 'bounce' | 'flip' | 'cross-dissolve' };
  cachePolicy?: 'none' | 'disk' | 'memory' | 'memory-disk';
  recyclingKey?: string;
  placeholder?: string;
  blurhash?: string;
  testID?: string;
};

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
export const OptimizedImage: React.FC<ImageProps> = (props) => {
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

  // Use expo-image if feature flag is enabled
  if (features.enableExpoImage) {
    return (
      <ExpoImage
        source={typeof source === 'string' ? source : source.uri}
        style={style}
        contentFit={contentFit as any}
        transition={transition}
        cachePolicy={cachePolicy as any}
        recyclingKey={recyclingKey}
        placeholder={blurhash || placeholder}
        testID={testID}
      />
    );
  }

  // Fallback to React Native Image
  return (
    <RNImage
      source={typeof source === 'string' ? { uri: source } : source}
      style={style}
      resizeMode={contentFit === 'cover' ? 'cover' : contentFit === 'contain' ? 'contain' : 'stretch'}
      testID={testID}
      {...(rest as RNImageProps)}
    />
  );
};

/**
 * Article Thumbnail Image
 * Optimized for article list thumbnails
 */
export const ArticleThumbnail: React.FC<{
  uri: string;
  style?: any;
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
  style?: any;
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
