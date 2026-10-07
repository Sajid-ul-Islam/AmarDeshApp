import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles, useThemeTokens } from '../../theme';
import { ArticleThumbnail } from '../../components/OptimizedImage';
import { getArticlesByCategory, SITE_CATEGORIES } from '../../services/contentService';
import { formatRelativeTime, toBengaliNumeral } from '../../utils/bengali';
import { Article } from '../../data/mockData';
import { getSafeHeaderPaddingTop } from '../../utils/layout';
import { AmarDeshLogo } from '../../components/AmarDeshLogo';

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tokens = useThemeTokens();
  const [refreshing, setRefreshing] = useState(false);

  const categorySlug = Array.isArray(slug) ? slug[0] : slug || 'latest';
  const categoryMeta =
    SITE_CATEGORIES.find((c) => c.slug === categorySlug || c.id === categorySlug) || {
      id: categorySlug,
      name: categorySlug,
      slug: categorySlug,
    };

  const articles = getArticlesByCategory(categoryMeta.name);

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
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      },
      backButton: {
        padding: 4,
      },
      headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      countBadge: {
        backgroundColor: tokens.surface.elevated,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
      },
      countText: {
        fontSize: 12,
        color: tokens.text.secondary,
      },
      listContent: {
        padding: 16,
        paddingBottom: 32,
      },
      card: {
        flexDirection: 'row',
        backgroundColor: tokens.surface.base,
        borderRadius: 10,
        marginBottom: 12,
        padding: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: tokens.border.default,
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
        borderRadius: 6,
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
    })
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={tokens.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{categoryMeta.name}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {toBengaliNumeral(articles.length)} টি সংবাদ
            </Text>
          </View>
          <AmarDeshLogo height={20} variant="png" />
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
            onPress={() => router.push(`/article/${item.id}` as any)}
            activeOpacity={0.8}
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="newspaper-outline" size={40} color={tokens.text.tertiary} />
            <Text style={styles.emptyText}>এই বিভাগে কোনো সংবাদ পাওয়া যায়নি</Text>
          </View>
        }
      />
    </View>
  );
}
