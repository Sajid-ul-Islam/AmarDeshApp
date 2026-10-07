import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { articles as mockArticles, Article } from '../../data/mockData';
import { formatRelativeTime, toBengaliNumeral } from '../../utils/bengali';
import { loadBookmarks } from '../../services/storage';
import { ArticleThumbnail } from '../../components/OptimizedImage';
import { loadArticles, getArticles, subscribeToArticles } from '../../services/articleStore';
import { useThemedStyles, useThemeTokens } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import {
  t,
  getLocalizedCategoryName,
  formatLocalizedNumeral,
  formatLocalizedRelativeTime,
} from '../../services/i18n';

export default function BookmarksScreen() {
  const language = useAppStore((state) => state.language);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tokens = useThemeTokens();
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Article[]>([]);

  // Live news from dailyamardesh.com
  const liveArticles = useSyncExternalStore(
    subscribeToArticles,
    getArticles
  );
  const allArticles: Article[] = liveArticles.length > 0 ? liveArticles : mockArticles;

  useFocusEffect(
    useCallback(() => {
      let active = true;

      loadBookmarks().then((bookmarkIds) => {
        if (!active) return;

        const savedArticles = bookmarkIds
          .map((id) => allArticles.find((a) => a.id === id))
          .filter((a): a is Article => a !== undefined);
        setBookmarkedArticles(savedArticles);
      });

      return () => {
        active = false;
      };
    }, [allArticles])
  );

  useEffect(() => {
    loadArticles();
  }, []);

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: tokens.surface.subtle,
      },
      header: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      countBadge: {
        backgroundColor: tokens.brand.surface,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
      },
      countText: {
        fontSize: 12,
        fontWeight: '600',
        color: tokens.brand.primary,
      },
      listContent: {
        padding: 16,
        paddingBottom: 28,
      },
      articleCard: {
        flexDirection: 'row',
        backgroundColor: tokens.surface.base,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: tokens.border.default,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      articleImage: {
        width: 104,
        height: 88,
      },
      articleContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
      },
      articleCategory: {
        fontSize: 12,
        color: tokens.brand.primary,
        fontWeight: '700',
        marginBottom: 3,
      },
      articleTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: tokens.text.primary,
        lineHeight: 19,
        marginBottom: 4,
      },
      articleTime: {
        fontSize: 11,
        color: tokens.text.tertiary,
      },
      emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
        paddingHorizontal: 32,
      },
      emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: tokens.surface.elevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
      },
      emptyText: {
        fontSize: 16,
        color: tokens.text.primary,
        fontWeight: 'bold',
        marginBottom: 6,
      },
      emptySubtext: {
        fontSize: 13,
        color: tokens.text.secondary,
        textAlign: 'center',
        lineHeight: 18,
      },
    })
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="bookmark" size={20} color={tokens.brand.primary} />
          <Text style={styles.title}>{t('saved_articles', language)}</Text>
        </View>
        {bookmarkedArticles.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {language === 'bn'
                ? `${formatLocalizedNumeral(bookmarkedArticles.length, language)} টি`
                : `${bookmarkedArticles.length} ${bookmarkedArticles.length === 1 ? 'article' : 'articles'}`}
            </Text>
          </View>
        )}
      </View>

      {bookmarkedArticles.length > 0 ? (
        <FlatList
          data={bookmarkedArticles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.articleCard}
              onPress={() => router.push(`/article/${item.id}` as any)}
              activeOpacity={0.8}
            >
              <ArticleThumbnail uri={item.imageUrl} style={styles.articleImage} recyclingKey={item.id} />
              <View style={styles.articleContent}>
                <Text style={styles.articleCategory}>
                  {getLocalizedCategoryName(item.category, language)}
                </Text>
                <Text style={styles.articleTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.articleTime}>
                  {formatLocalizedRelativeTime(item.publishedAt, language)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="bookmark-outline" size={40} color={tokens.text.tertiary} />
          </View>
          <Text style={styles.emptyText}>{t('no_saved_articles', language)}</Text>
          <Text style={styles.emptySubtext}>
            {language === 'bn'
              ? 'খবরের পাতার উপরে বা পাশে বুকমার্ক আইকনে ট্যাপ করে যেকোনো খবর পরবর্তীতে পড়ার জন্য সেভ করে রাখতে পারেন।'
              : 'Tap the bookmark icon on any article to save it for reading later, even while offline.'}
          </Text>
        </View>
      )}
    </View>
  );
}
