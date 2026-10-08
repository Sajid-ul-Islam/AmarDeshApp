import React, { useState, useEffect, useRef, useMemo, useSyncExternalStore } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles, useThemeTokens } from '../../theme';
import { ArticleThumbnail } from '../../components/OptimizedImage';
import {
  getArticlesByCategory,
  lookupCategory,
} from '../../services/contentService';
import {
  getArticles,
  subscribeToArticles,
  loadArticles,
} from '../../services/articleStore';
import { formatRelativeTime, toBengaliNumeral } from '../../utils/bengali';
import type { Article } from '../../types';
import { getSafeHeaderPaddingTop } from '../../utils/layout';
import { AmarDeshLogo } from '../../components/AmarDeshLogo';

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tokens = useThemeTokens();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  const categorySlug = Array.isArray(slug) ? slug[0] : slug || 'latest';
  // Accept a slug from the route; fall back to the raw value for unknown
  // sections so a newly added site vertical still renders instead of blanking.
  const categoryMeta =
    lookupCategory(categorySlug) ?? {
      id: categorySlug,
      name: categorySlug,
      slug: categorySlug,
    };

  // Subscribe to the shared article store. Without this the screen read the
  // store once at mount and never repainted when the live feed arrived, so a
  // cold start showed only placeholder articles.
  const liveArticles = useSyncExternalStore(subscribeToArticles, getArticles);

  const articles = useMemo(
    () => getArticlesByCategory(categoryMeta.slug || categoryMeta.name),
    // liveArticles is the store's snapshot; categoryMeta drives the filter.
    [liveArticles, categoryMeta.slug, categoryMeta.name]
  );

  // Kick off a fetch if the store is still empty, and always clear the
  // loading state once the store reports something (or the fetch settles).
  useEffect(() => {
    let active = true;

    const settle = () => {
      if (active) setIsLoading(false);
    };

    if (liveArticles.length > 0) {
      settle();
      return () => {
        active = false;
      };
    }

    loadArticles()
      .catch((error) => console.error('[Category] Feed load failed:', error))
      .finally(settle);

    return () => {
      active = false;
    };
  }, [liveArticles.length]);

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: tokens.surface.subtle,
      },
      header: {
        paddingTop: getSafeHeaderPaddingTop(insets.top, 8),
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 0.5,
        borderBottomColor: tokens.border.subtle,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
        marginRight: 8,
      },
      backButton: {
        padding: 4,
      },
      headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tokens.text.primary,
        flexShrink: 1,
      },
      countBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: tokens.surface.elevated,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: tokens.radii.pill,
      },
      countText: {
        fontSize: 12,
        color: tokens.text.secondary,
        fontWeight: '600',
      },
      listContent: {
        padding: 16,
        paddingBottom: 32,
      },
      card: {
        flexDirection: 'row',
        backgroundColor: tokens.surface.base,
        borderRadius: tokens.radii.lg,
        marginBottom: 12,
        padding: 12,
        gap: 12,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      cardContent: {
        flex: 1,
        justifyContent: 'space-between',
      },
      cardTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: tokens.text.primary,
        lineHeight: 20,
        marginBottom: 4,
      },
      cardExcerpt: {
        fontSize: 12,
        color: tokens.text.secondary,
        lineHeight: 16,
        marginBottom: 6,
      },
      cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      authorText: {
        fontSize: 11,
        color: tokens.brand.primary,
        fontWeight: '500',
      },
      timeText: {
        fontSize: 11,
        color: tokens.text.tertiary,
      },
      thumbnail: {
        width: 100,
        height: 75,
        borderRadius: tokens.radii.md,
      },
      emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
      },
      emptyText: {
        fontSize: 14,
        color: tokens.text.secondary,
        marginTop: 8,
      },
      retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 16,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: tokens.radii.pill,
        borderWidth: 1,
        borderColor: tokens.brand.primary,
        minHeight: 44,
      },
      retryText: {
        fontSize: 13,
        fontWeight: '600',
        color: tokens.brand.primary,
      },
    })
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Force a real network refresh rather than a cosmetic spinner delay.
      await loadArticles(true);
    } catch (error) {
      console.error('[Category] Refresh failed:', error);
    } finally {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      refreshTimerRef.current = setTimeout(() => setRefreshing(false), 300);
    }
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="small" color={tokens.brand.primary} />
          <Text style={styles.emptyText}>সংবাদ লোড হচ্ছে…</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="newspaper-outline" size={40} color={tokens.text.tertiary} />
        <Text style={styles.emptyText}>এই বিভাগে এখন কোনো সংবাদ নেই</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRefresh}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="আবার চেষ্টা করুন"
        >
          <Ionicons name="refresh" size={15} color={tokens.brand.primary} />
          <Text style={styles.retryText}>আবার চেষ্টা করুন</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="ফিরে যান"
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={tokens.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{categoryMeta.name}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={styles.countBadge}>
            <Ionicons name="newspaper-outline" size={13} color={tokens.text.secondary} />
            <Text style={styles.countText}>
              {toBengaliNumeral(articles.length)}
            </Text>
          </View>
          <AmarDeshLogo height={24} variant="png" />
        </View>
      </View>

      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/article/${item.id}` as never)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={item.title}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.cardExcerpt} numberOfLines={2}>
                {item.excerpt}
              </Text>
              <View style={styles.cardMeta}>
                <Text style={styles.authorText}>{item.author}</Text>
                <Text style={styles.timeText}>
                  {formatRelativeTime(item.publishedAt)}
                </Text>
              </View>
            </View>

            <ArticleThumbnail
              uri={item.imageUrl}
              style={styles.thumbnail}
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={renderEmpty()}
      />
    </View>
  );
}
