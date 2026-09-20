import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { articles } from '../../data/mockData';
import { formatRelativeTime } from '../../utils/bengali';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const article = articles.find((a) => a.id === id);

  if (!article) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>সংবাদ পাওয়া যায়নি</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Ionicons name="bookmark-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Ionicons name="share-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Article Image */}
        <Image source={{ uri: article.imageUrl }} style={styles.articleImage} />

        {/* Article Content */}
        <View style={styles.articleBody}>
          <Text style={styles.category}>{article.category}</Text>
          <Text style={styles.title}>{article.title}</Text>

          <View style={styles.meta}>
            <Text style={styles.author}>{article.author}</Text>
            <Text style={styles.metaDot}>•</Text>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={12} color="#6B7280" />
              <Text style={styles.time}>{formatRelativeTime(article.publishedAt)}</Text>
            </View>
          </View>

          <Text style={styles.excerpt}>{article.excerpt}</Text>
          <Text style={styles.content}>{article.content}</Text>

          <Text style={styles.additionalContent}>
            সংবাদটি গুরুত্বপূর্ণ কারণ এটি দেশের বর্তমান পরিস্থিতি তুলে ধরে। পাঠকদের এই বিষয়ে সচেতন থাকা জরুরি। বিভিন্ন মহল থেকে এই ঘটনাকে নিয়ে বিভিন্ন প্রতিক্রিয়া আসছে।
          </Text>

          <Text style={styles.additionalContent}>
            বিশেষজ্ঞরা বলছেন, এই ঘটনার প্রভাব দীর্ঘমেয়াদে দেশের রাজনৈতিক ও সামাজিক ক্ষেত্রে পড়বে। সরকারি পর্যায়ে ইতোমধ্যে পদক্ষেপ নেওয়া শুরু হয়েছে।
          </Text>

          {/* Tags */}
          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>#{article.category}</Text>
            </View>
          </View>

          {/* Source Credit */}
          <View style={styles.source}>
            <Text style={styles.sourceText}>উৎস: dailyamardesh.com</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  backButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  articleImage: {
    width: '100%',
    height: 220,
  },
  articleBody: {
    padding: 16,
  },
  category: {
    fontSize: 12,
    color: '#006B3F',
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    lineHeight: 28,
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  author: {
    fontSize: 12,
    color: '#6B7280',
  },
  metaDot: {
    fontSize: 12,
    color: '#6B7280',
    marginHorizontal: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 12,
    color: '#6B7280',
  },
  excerpt: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
    marginBottom: 16,
  },
  additionalContent: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
    marginBottom: 16,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 24,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    color: '#6B7280',
  },
  source: {
    marginTop: 24,
    alignItems: 'center',
  },
  sourceText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 48,
  },
});
