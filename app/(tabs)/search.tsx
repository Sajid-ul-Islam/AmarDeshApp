import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Article } from '../../data/mockData';
import { formatRelativeTime } from '../../utils/bengali';
import { ArticleThumbnail } from '../../components/OptimizedImage';
import { useUserStore } from '../../user';
import { useSyncExternalStore } from 'react';
import { loadArticles, getArticles, subscribeToArticles } from '../../services/articleStore';

export default function SearchScreen() {
  // Edge-to-edge: pad content below the status bar
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [hasTrackedSearch, setHasTrackedSearch] = useState(false);
  const trackEvent = useUserStore((state) => state.trackEvent);

  // Live news from dailyamardesh.com (shared store; previously searched
  // only the static mock list)
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

  // Track search performed
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
    // Track search result clicked
    trackEvent('search_result_clicked', 'article', article.id, {
      query,
      position: index,
    });
    // Pass source so article_opened attribution records 'search'
    router.push({
      pathname: '/article/[id]',
      params: { id: article.id, source: 'search' },
    } as const);
  };

  // Kick off the shared load (no-op if already loaded/loading)
  useEffect(() => {
    loadArticles();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="সংবাদ খুঁজুন..."
          value={query}
          onChangeText={setQuery}
          placeholderTextColor="#9CA3AF"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      {query.trim() ? (
        filteredArticles.length > 0 ? (
          <FlatList
            data={filteredArticles}
            keyExtractor={(item) => item.id}
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
            <Ionicons name="search-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>কোনো ফলাফল পাওয়া যায়নি</Text>
          </View>
        )
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>সংবাদ খুঁজতে উপরে টাইপ করুন</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  listContent: {
    paddingHorizontal: 16,
    // Edge-to-edge: keep last results clear of the tab bar / gesture bar
    paddingBottom: 24,
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  articleImage: {
    width: 100,
    height: 100,
  },
  articleContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  articleCategory: {
    fontSize: 12,
    color: '#006B3F',
    fontWeight: '600',
    marginBottom: 4,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  articleTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
  },
});
