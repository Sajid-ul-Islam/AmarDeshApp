import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { articles } from '../../data/mockData';
import { formatRelativeTime } from '../../utils/bengali';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
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
          <Image source={{ uri: item.imageUrl }} style={styles.heroImage} />
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
        <Image source={{ uri: item.imageUrl }} style={styles.articleImage} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    backgroundColor: '#006B3F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeCategory: {
    backgroundColor: '#006B3F',
  },
  categoryText: {
    fontSize: 14,
    color: '#374151',
  },
  activeCategoryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  heroCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  breakingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  heroCategory: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroTime: {
    color: '#D1D5DB',
    fontSize: 12,
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
});
