import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect, useSyncExternalStore } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Article } from '../../data/mockData';
import { formatRelativeTime, toBengaliNumeral } from '../../utils/bengali';
import { ArticleThumbnail } from '../../components/OptimizedImage';
import { useUserStore } from '../../user';
import { loadArticles, getArticles, subscribeToArticles } from '../../services/articleStore';
import { useThemedStyles, useThemeTokens } from '../../theme';
import { getSafeHeaderPaddingTop } from '../../utils/layout';
import { AmarDeshLogo } from '../../components/AmarDeshLogo';

const POPULAR_SEARCH_TAGS = [
  'জুলাই বিপ্লব',
  'সংস্কার প্রস্তাব',
  'মাহমুদুর রহমান',
  'অর্থনীতি',
  'নির্বাচন',
  'খেলাধুলা',
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const tokens = useThemeTokens();
  const [query, setQuery] = useState('');
  const [hasTrackedSearch, setHasTrackedSearch] = useState(false);
  const trackEvent = useUserStore((state) => state.trackEvent);

  // Live news from dailyamardesh.com
  const liveArticles = useSyncExternalStore(
    subscribeToArticles,
    getArticles
  );

  const filteredArticles: Article[] = query.trim()
    ? liveArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (query.trim() && filteredArticles.length > 0 && !hasTrackedSearch) {
      trackEvent('search_performed', 'search', query, {
        query,
        result_count: filteredArticles.length,
      });
      setHasTrackedSearch(true);
    } else if (!query.trim()) {
      setHasTrackedSearch(false);
    }
  }, [query, filteredArticles.length]);

  const handleResultClick = (article: Article, index: number) => {
    trackEvent('search_result_clicked', 'article', article.id, {
      query,
      position: index,
    });
    router.push({
      pathname: '/article/[id]',
      params: { id: article.id, source: 'search' },
    } as any);
  };

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
        paddingTop: getSafeHeaderPaddingTop(insets.top, 8),
        paddingBottom: 12,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
      },
      searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tokens.surface.elevated,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 24,
        gap: 10,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      searchInput: {
        flex: 1,
        fontSize: 15,
        color: tokens.text.primary,
        padding: 0,
      },
      tagSection: {
        padding: 16,
      },
      tagSectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: tokens.text.secondary,
        marginBottom: 10,
      },
      tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
      },
      tagChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: tokens.surface.base,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      tagChipText: {
        fontSize: 13,
        color: tokens.brand.primary,
        fontWeight: '500',
      },
      resultMetaBar: {
        paddingHorizontal: 16,
        paddingVertical: 10,
      },
      resultCountText: {
        fontSize: 13,
        color: tokens.text.secondary,
      },
      listContent: {
        paddingHorizontal: 16,
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
        paddingVertical: 56,
        paddingHorizontal: 32,
      },
      emptyIconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: tokens.surface.elevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
      },
      emptyText: {
        fontSize: 15,
        color: tokens.text.primary,
        fontWeight: '600',
        marginBottom: 4,
      },
      emptySubtext: {
        fontSize: 13,
        color: tokens.text.secondary,
        textAlign: 'center',
      },
    })
  );

  return (
    <View style={styles.container}>
      {/* Search Header Bar */}
      <View style={styles.header}>
        <View style={{ marginBottom: 10, alignItems: 'center' }}>
          <AmarDeshLogo height={26} variant="png" />
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={tokens.brand.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="আমার দেশ সংবাদ অনুসন্ধান..."
            value={query}
            onChangeText={setQuery}
            placeholderTextColor={tokens.text.tertiary}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={tokens.interactive.inactive} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* When query is empty: popular search tags */}
      {!query.trim() && (
        <View style={styles.tagSection}>
          <Text style={styles.tagSectionTitle}>জনপ্রিয় অনুসন্ধান বিষয়সমূহ:</Text>
          <View style={styles.tagRow}>
            {POPULAR_SEARCH_TAGS.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={styles.tagChip}
                onPress={() => setQuery(tag)}
              >
                <Text style={styles.tagChipText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Results or Empty State */}
      {query.trim() ? (
        filteredArticles.length > 0 ? (
          <FlatList
            data={filteredArticles}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
              <View style={styles.resultMetaBar}>
                <Text style={styles.resultCountText}>
                  "{query}" সংক্রান্ত {toBengaliNumeral(filteredArticles.length)} টি ফলাফল পাওয়া গেছে
                </Text>
              </View>
            }
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.articleCard}
                onPress={() => handleResultClick(item, index)}
                activeOpacity={0.8}
              >
                <ArticleThumbnail uri={item.imageUrl} style={styles.articleImage} recyclingKey={item.id} />
                <View style={styles.articleContent}>
                  <Text style={styles.articleCategory}>{item.category}</Text>
                  <Text style={styles.articleTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.articleTime}>{formatRelativeTime(item.publishedAt)}</Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="search-outline" size={36} color={tokens.text.tertiary} />
            </View>
            <Text style={styles.emptyText}>কোনো ফলাফল পাওয়া যায়নি</Text>
            <Text style={styles.emptySubtext}>
              ভিন্ন শব্দ বা কীওয়ার্ড দিয়ে পুনরায় অনুসন্ধান করে দেখুন
            </Text>
          </View>
        )
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="newspaper-outline" size={36} color={tokens.text.tertiary} />
          </View>
          <Text style={styles.emptyText}>সংবাদ খুঁজতে উপরে লিখুন</Text>
          <Text style={styles.emptySubtext}>
            শিরোনাম, বিষয় বা যেকোনো সংবাদ ক্যাটাগরি অনুসন্ধান করুন
          </Text>
        </View>
      )}
    </View>
  );
}
