import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { articles as mockArticles, Article } from '../../data/mockData';
import { formatRelativeTime } from '../../utils/bengali';
import { useThemedStyles } from '../../theme';
import { ArticleThumbnail, ArticleHeroImage } from '../../components/OptimizedImage';
import { useUserStore } from '../../user';

export default function ForYouScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [personalizedArticles, setPersonalizedArticles] = useState<Article[]>([]);
  
  const getPersonalizedFeed = useUserStore((state) => state.getPersonalizedFeed);
  const getUserInterests = useUserStore((state) => state.getUserInterests);
  const isUserReady = useUserStore((state) => state.isInitialized);
  const [interests, setInterests] = useState<Array<{ type: string; id: string; score: number }>>([]);

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
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: tokens.text.primary,
    },
    subtitle: {
      fontSize: 12,
      color: tokens.text.secondary,
      marginTop: 2,
    },
    interestsContainer: {
      backgroundColor: tokens.surface.base,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border.default,
    },
    interestsLabel: {
      fontSize: 12,
      color: tokens.text.secondary,
      marginBottom: 8,
    },
    interestsList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    interestChip: {
      backgroundColor: tokens.brand.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    interestText: {
      fontSize: 12,
      color: tokens.brand.primary,
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
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
    },
    emptyText: {
      fontSize: 16,
      color: tokens.text.secondary,
      textAlign: 'center',
      marginTop: 12,
    },
  }));

  // Load personalized feed
  useEffect(() => {
    const loadFeed = async () => {
      if (isUserReady) {
        const feed = await getPersonalizedFeed(mockArticles);
        setPersonalizedArticles(feed);
        
        const userInterests = await getUserInterests(5);
        setInterests(userInterests);
      }
    };
    
    loadFeed();
  }, [isUserReady]);

  const onRefresh = async () => {
    setRefreshing(true);
    const feed = await getPersonalizedFeed(mockArticles);
    setPersonalizedArticles(feed);
    setRefreshing(false);
  };

  const renderArticle = ({ item, index }: { item: Article; index: number }) => {
    if (index === 0 && personalizedArticles.length > 0) {
      // Hero article
      return (
        <TouchableOpacity
          style={styles.heroCard}
          onPress={() => router.push(`/article/${item.id}`)}
          activeOpacity={0.8}
        >
          <ArticleHeroImage uri={item.imageUrl} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
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

  if (!isUserReady) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>আপনার জন্য</Text>
          </View>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>লোড হচ্ছে...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View>
            <Text style={styles.title}>আপনার জন্য</Text>
            <Text style={styles.subtitle}>আপনার আগ্রহের উপর ভিত্তি করে</Text>
          </View>
        </View>
      </View>

      {/* Interests */}
      {interests.length > 0 && (
        <View style={styles.interestsContainer}>
          <Text style={styles.interestsLabel}>আপনার শীর্ষ আগ্রহ:</Text>
          <View style={styles.interestsList}>
            {interests.map((interest, index) => (
              <View key={index} style={styles.interestChip}>
                <Text style={styles.interestText}>
                  {interest.id}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Articles List */}
      {personalizedArticles.length > 0 ? (
        <FlatList
          data={personalizedArticles}
          renderItem={renderArticle}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            আরও সংবাদ পড়ুন আপনার জন্য ব্যক্তিগতকৃত সুপারিশ পেতে
          </Text>
        </View>
      )}
    </View>
  );
}
