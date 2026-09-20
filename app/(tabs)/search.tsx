import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { articles } from '../../data/mockData';
import { formatRelativeTime } from '../../utils/bengali';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filteredArticles = query.trim()
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <View style={styles.container}>
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
