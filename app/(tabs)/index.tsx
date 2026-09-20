import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { articles as mockArticles, Article } from '../../data/mockData';
import { formatRelativeTime } from '../../utils/bengali';
import { fetchRSSFeed } from '../../services/rssService';
import { loadBookmarks, saveBookmarks } from '../../services/storage';
import { useThemedStyles } from '../../theme';
import { ArticleThumbnail, ArticleHeroImage } from '../../components/OptimizedImage';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  
  // Use themed styles
  const styles = useThemedStyles((tokens) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.surface.subtle,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: tokens.surface.base,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border.default,
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    logo: {
      backgroundColor: tokens.brand.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    logoText: {
      color: tokens.brand.onPrimary,
      fontSize: 16,
      fontWeight: 'bold',
    },
    appName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: tokens.text.primary,
    },
    categoryContainer: {
      flexDirection: 'row',
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: tokens.surface.base,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border.default,
      gap: 8,
    },
    categoryTab: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: tokens.surface.elevated,
    },
    activeCategory: {
      backgroundColor: tokens.brand.primary,
    },
    categoryText: {
      fontSize: 14,
      color: tokens.text.secondary,
    },
    activeCategoryText: {
      color: tokens.brand.onPrimary,
      fontWeight: '600',
    },
    listContent: {
      padding: 16,
    },
    heroCard: {
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 16,
      backgroundColor: tokens.surface.base,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    heroImage: {
      width: '100%',
      height: 220,
    },
    heroOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    breakingBadge: {
      backgroundColor: tokens.status.error,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      alignSelf: 'flex-start',
      marginBottom: 8,
    },
    breakingText: {
      color: tokens.text.inverse,
      fontSize: 10,
      fontWeight: 'bold',
    },
    heroCategory: {
      color: tokens.brand.accent,
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 4,
    },
    heroTitle: {
      color: tokens.text.inverse,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    heroTime: {
      color: tokens.text.tertiary,
      fontSize: 12,
    },
    articleCard: {
      flexDirection: 'row',
      backgroundColor: tokens.surface.base,
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
      color: tokens.brand.primary,
      fontWeight: '600',
      marginBottom: 4,
    },
    articleTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: tokens.text.primary,
      marginBottom: 4,
    },
    articleTime: {
      fontSize: 12,
      color: tokens.text.secondary,
    },
  }));

  // Load bookmarks on mount
  useEffect(() => {
    loadBookmarks().then(setBookmarks);
  }, []);

  // Fetch RSS feed on mount
  useEffect(() => {
    const loadRSSFeed = async () => {
      try {
        const rssArticles = await fetchRSSFeed();
        if (rssArticles.length > 0) {
          setArticles(rssArticles);
        }
      } catch (error) {
        console.error('Error loading RSS feed:', error);
        // Keep using mock data
      }
    };
    
    loadRSSFeed();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const rssArticles = await fetchRSSFeed();
      if (rssArticles.length > 0) {
        setArticles(rssArticles);
      } else {
        // Simulate refresh delay if RSS fails
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error('Error refreshing:', error);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setRefreshing(false);
  };

  const renderArticle = ({ item, index }: { item: any; index: number }) => {
    if (index === 0) {
      // Hero article
      return (
        <TouchableOpacity
          style={styles.heroCard}
          onPress={() => router.push(`/article/${item.id}`)}
          activeOpacity={0.8}
        >
          <ArticleHeroImage uri={item.imageUrl} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            {item.isBreaking && (
              <View style={styles.breakingBadge}>
                <Text style={styles.breakingText}>ব্রেকিং</Text>
              </View>
            )}
            <Text style={styles.heroCategory}>{item.category}</Text>
            <Text style={styles.heroTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.heroTime}>{formatRelativeTime(item.publishedAt)}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    // Regular article card
    return (
      <TouchableOpacity
        style={styles.articleCard}
        onPress={() => router.push(`/article/${item.id}`)}
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
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>আ.দে</Text>
          </View>
          <Text style={styles.appName}>আমার দেশ</Text>
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity style={[styles.categoryTab, styles.activeCategory]}>
          <Text style={[styles.categoryText, styles.activeCategoryText]}>সর্বশেষ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryTab}>
          <Text style={styles.categoryText}>জাতীয়</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryTab}>
          <Text style={styles.categoryText}>রাজনীতি</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryTab}>
          <Text style={styles.categoryText}>খেলা</Text>
        </TouchableOpacity>
      </View>

      {/* Articles List */}
      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
