import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { articles as mockArticles, Article } from '../../data/mockData';
import { formatRelativeTime } from '../../utils/bengali';
import { useState, useEffect } from 'react';
import { loadBookmarks, saveBookmarks, loadReadingHistory, saveReadingHistory } from '../../services/storage';
import { shareToPlatform, SharePlatform } from '../../services/sharingService';
import { speakArticle, stopSpeaking, isSpeaking } from '../../services/ttsService';
import { YouTubePlayerComponent } from '../../components/YouTubePlayer';
import { ArticleHeroImage } from '../../components/OptimizedImage';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);

  const article = mockArticles.find((a) => a.id === id);

  // Load bookmarks on mount
  useEffect(() => {
    loadBookmarks().then(setBookmarks);
    
    // Add to reading history
    if (article) {
      loadReadingHistory().then((history) => {
        const newHistory = [article.id, ...history.filter(id => id !== article.id)].slice(0, 50);
        saveReadingHistory(newHistory);
      });
    }
  }, [id]);

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  if (!article) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>সংবাদ পাওয়া যায়নি</Text>
      </View>
    );
  }

  const isBookmarked = bookmarks.includes(article.id);

  const toggleBookmark = async () => {
    let newBookmarks: string[];
    
    if (isBookmarked) {
      newBookmarks = bookmarks.filter(id => id !== article.id);
    } else {
      newBookmarks = [...bookmarks, article.id];
    }
    
    setBookmarks(newBookmarks);
    await saveBookmarks(newBookmarks);
  };

  const handleShare = async (platform: SharePlatform) => {
    await shareToPlatform(platform, article);
    setShowShareSheet(false);
  };

  const handleTTS = async () => {
    const currentlySpeaking = await isSpeaking();
    
    if (currentlySpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      speakArticle(article, { rate: 1.0 });
      setIsSpeaking(true);
    }
  };

  const handleCopyLink = async () => {
    await shareToPlatform('copy', article);
    Alert.alert('কপি হয়েছে', 'লিংক কপি করা হয়েছে');
  };

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
          <TouchableOpacity 
            style={styles.iconButton} 
            activeOpacity={0.7}
            onPress={handleTTS}
          >
            <Ionicons 
              name={isSpeaking ? "pause" : "volume-high"} 
              size={24} 
              color={isSpeaking ? "#006B3F" : "#6B7280"} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton} 
            activeOpacity={0.7}
            onPress={toggleBookmark}
          >
            <Ionicons 
              name={isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={isBookmarked ? "#006B3F" : "#6B7280"} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton} 
            activeOpacity={0.7}
            onPress={() => setShowShareSheet(true)}
          >
            <Ionicons name="share-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Share Sheet Modal */}
      {showShareSheet && (
        <View style={styles.shareSheetOverlay}>
          <View style={styles.shareSheet}>
            <Text style={styles.shareSheetTitle}>শেয়ার করুন</Text>
            <View style={styles.shareOptions}>
              <TouchableOpacity style={styles.shareOption} onPress={() => handleShare('whatsapp')}>
                <View style={[styles.shareIcon, { backgroundColor: '#25D366' }]}>
                  <Ionicons name="logo-whatsapp" size={24} color="#fff" />
                </View>
                <Text style={styles.shareLabel}>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareOption} onPress={() => handleShare('facebook')}>
                <View style={[styles.shareIcon, { backgroundColor: '#1877F2' }]}>
                  <Ionicons name="logo-facebook" size={24} color="#fff" />
                </View>
                <Text style={styles.shareLabel}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareOption} onPress={() => handleShare('twitter')}>
                <View style={[styles.shareIcon, { backgroundColor: '#1DA1F2' }]}>
                  <Ionicons name="logo-twitter" size={24} color="#fff" />
                </View>
                <Text style={styles.shareLabel}>Twitter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareOption} onPress={() => handleShare('telegram')}>
                <View style={[styles.shareIcon, { backgroundColor: '#0088cc' }]}>
                  <Ionicons name="send" size={24} color="#fff" />
                </View>
                <Text style={styles.shareLabel}>Telegram</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareOption} onPress={handleCopyLink}>
                <View style={[styles.shareIcon, { backgroundColor: '#6B7280' }]}>
                  <Ionicons name="link" size={24} color="#fff" />
                </View>
                <Text style={styles.shareLabel}>লিংক কপি</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.shareSheetClose}
              onPress={() => setShowShareSheet(false)}
            >
              <Text style={styles.shareSheetCloseText}>বন্ধ করুন</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Article Image */}
        <ArticleHeroImage uri={article.imageUrl} style={styles.articleImage} />

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
  // Share Sheet Styles
  shareSheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  shareSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  shareSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  shareOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  shareOption: {
    alignItems: 'center',
    marginVertical: 10,
    width: '20%',
  },
  shareIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  shareLabel: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
  },
  shareSheetClose: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  shareSheetCloseText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
});
