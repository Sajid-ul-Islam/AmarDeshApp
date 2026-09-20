import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { articles } from '../../data/mockData';
import { formatRelativeTime } from '../../utils/bengali';

export default function BookmarksScreen() {
  const router = useRouter();
  // In a real app, this would come from AsyncStorage
  const bookmarkedArticles = articles.slice(0, 3); // Mock bookmarks

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>সেভ করা সংবাদ</Text>
      </View>

      {bookmarkedArticles.length > 0 ? (
        <FlatList
          data={bookmarkedArticles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
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
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="bookmark-outline" size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>কোনো সংবাদ সেভ করা হয়নি</Text>
          <Text style={styles.emptySubtext}>
            সংবাদের পাশে বুকমার্ক আইকনে ট্যাপ করুন
          </Text>
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  listContent: {
    padding: 16,
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
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
});
