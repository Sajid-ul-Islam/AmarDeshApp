import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { articles as mockArticles, Article } from '../../data/mockData';
import { getArticleById, loadArticles } from '../../services/articleStore';
import { formatRelativeTime } from '../../utils/bengali';
import {
  loadBookmarks,
  saveBookmarks,
  loadReadingHistory,
  saveReadingHistory,
} from '../../services/storage';
import { shareToPlatform, SharePlatform } from '../../services/sharingService';
import { ArticleHeroImage, ArticleThumbnail } from '../../components/OptimizedImage';
import {
  useUserStore,
  recordArticleOpen,
  recordArticleClose,
  setArticleSaved,
  setArticleShared,
} from '../../user';
import { scrapeFullArticle, ScrapedArticleData } from '../../services/articleScraper';
import { ReaderSettingsModal } from '../../components/ReaderSettingsModal';
import { AudioNewsBar } from '../../components/AudioNewsBar';
import { getArticlesByCategory } from '../../services/contentService';
import { useThemedStyles } from '../../theme';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const articleId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1.0);
  const [showAudioBar, setShowAudioBar] = useState(false);

  const savedThisSessionRef = useRef(false);
  const sharedThisSessionRef = useRef(false);
  const scrollDepthRef = useRef(0);
  const openTimeRef = useRef(Date.now());
  const trackEvent = useUserStore((state) => state.trackEvent);

  const [resolvedArticle, setResolvedArticle] = useState<Article | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedArticleData | null>(null);

  // Resolve base article
  useEffect(() => {
    let active = true;
    const inStore = articleId ? getArticleById(articleId) : undefined;
    if (inStore) {
      setResolvedArticle(inStore);
      setIsResolving(false);
      return;
    }

    if (articleId) {
      setIsResolving(true);
      loadArticles()
        .then(() => {
          if (!active) return;
          setResolvedArticle(getArticleById(articleId) ?? null);
        })
        .catch(() => {
          if (active) setResolvedArticle(null);
        })
        .finally(() => {
          if (active) setIsResolving(false);
        });
    } else {
      setResolvedArticle(null);
    }

    return () => {
      active = false;
    };
  }, [articleId]);

  const mockArticle = mockArticles.find((a) => a.id === articleId);
  const article: Article | undefined = mockArticle ?? (resolvedArticle ?? undefined);

  // On-demand full-text scraper & rich paragraphs
  useEffect(() => {
    if (article) {
      scrapeFullArticle(
        article.id,
        article.title,
        article.content,
        article.imageUrl,
        article.author,
        article.publishedAt
      ).then((data) => {
        setScrapedData(data);
      });
    }
  }, [article]);

  // Load bookmarks & tracking
  useEffect(() => {
    loadBookmarks().then(setBookmarks);

    if (article) {
      loadReadingHistory().then((history) => {
        const newHistory = [
          article.id,
          ...history.filter((id) => id !== article.id),
        ].slice(0, 50);
        saveReadingHistory(newHistory);
      });

      trackEvent('article_opened', 'article', article.id, {
        category: article.category,
        author: article.author,
      });

      recordArticleOpen(article.id);
    }
  }, [articleId]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const depth =
      (layoutMeasurement.height + contentOffset.y) / (contentSize.height || 1);
    const clamped = Math.min(1, Math.max(0, depth));
    scrollDepthRef.current = clamped;
  };

  useEffect(() => {
    openTimeRef.current = Date.now();
    return () => {
      if (article) {
        const dwellTime = Date.now() - openTimeRef.current;
        trackEvent('article_closed', 'article', article.id, {
          dwell_time_ms: dwellTime,
          max_scroll_depth: scrollDepthRef.current,
        });
        recordArticleClose(article.id, dwellTime, scrollDepthRef.current);
      }
    };
  }, [articleId]);

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: tokens.surface.base,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: insets.top > 0 ? insets.top + 4 : 10,
        paddingBottom: 10,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
      },
      backButton: {
        padding: 4,
      },
      headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      },
      iconButton: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: tokens.surface.elevated,
      },
      content: {
        flex: 1,
      },
      articleImage: {
        width: '100%',
        height: 230,
      },
      captionBox: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        backgroundColor: tokens.surface.elevated,
      },
      captionText: {
        fontSize: 12,
        color: tokens.text.secondary,
        fontStyle: 'italic',
      },
      articleBody: {
        padding: 16,
        paddingBottom: 80,
      },
      categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: tokens.brand.surface,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 8,
      },
      categoryText: {
        fontSize: 12,
        color: tokens.brand.primary,
        fontWeight: 'bold',
      },
      title: {
        fontSize: 22 * fontSizeMultiplier,
        fontWeight: 'bold',
        color: tokens.text.primary,
        lineHeight: 30 * fontSizeMultiplier,
        marginBottom: 12,
      },
      authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingBottom: 14,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
      },
      avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: tokens.surface.elevated,
      },
      authorName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      pubTime: {
        fontSize: 11,
        color: tokens.text.tertiary,
        marginTop: 2,
      },
      paragraph: {
        fontSize: 16 * fontSizeMultiplier,
        color: tokens.text.primary,
        lineHeight: 26 * fontSizeMultiplier,
        marginBottom: 16,
        textAlign: 'justify',
      },
      sourceCard: {
        backgroundColor: tokens.surface.elevated,
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
        marginBottom: 24,
        alignItems: 'center',
      },
      sourceCardText: {
        fontSize: 12,
        color: tokens.text.secondary,
      },
      relatedHeader: {
        fontSize: 17,
        fontWeight: 'bold',
        color: tokens.text.primary,
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: tokens.brand.primary,
        paddingLeft: 8,
      },
      relatedCard: {
        flexDirection: 'row',
        backgroundColor: tokens.surface.elevated,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        gap: 10,
      },
      relatedContent: {
        flex: 1,
        justifyContent: 'space-between',
      },
      relatedTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: tokens.text.primary,
        lineHeight: 18,
      },
      relatedTime: {
        fontSize: 11,
        color: tokens.text.tertiary,
      },
      relatedThumb: {
        width: 70,
        height: 52,
        borderRadius: 4,
      },
      // Share Sheet
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
        backgroundColor: tokens.surface.base,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
      },
      shareSheetTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: tokens.text.primary,
        marginBottom: 16,
        textAlign: 'center',
      },
      shareOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
      },
      shareOption: {
        alignItems: 'center',
      },
      shareIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
      },
      shareLabel: {
        fontSize: 11,
        color: tokens.text.secondary,
      },
      shareSheetClose: {
        backgroundColor: tokens.surface.elevated,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
      },
      shareSheetCloseText: {
        fontSize: 14,
        color: tokens.text.primary,
        fontWeight: '600',
      },
    })
  );

  if (isResolving && !article) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#6B7280' }}>সংবাদ লোড হচ্ছে...</Text>
      </View>
    );
  }

  if (!article) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#6B7280' }}>সংবাদ পাওয়া যায়নি</Text>
      </View>
    );
  }

  const isBookmarked = bookmarks.includes(article.id);

  const toggleBookmark = async () => {
    let newBookmarks: string[];
    if (isBookmarked) {
      newBookmarks = bookmarks.filter((id) => id !== article.id);
      trackEvent('article_unsaved', 'article', article.id);
      setArticleSaved(article.id, false);
    } else {
      newBookmarks = [...bookmarks, article.id];
      trackEvent('article_saved', 'article', article.id, {
        category: article.category,
        author: article.author,
      });
      setArticleSaved(article.id, true);
    }
    setBookmarks(newBookmarks);
    await saveBookmarks(newBookmarks);
  };

  const handleShare = async (platform: SharePlatform) => {
    await shareToPlatform(platform, article);
    setShowShareSheet(false);
    trackEvent('article_shared', 'article', article.id, { platform });
    setArticleShared(article.id);
  };

  const relatedStories = getArticlesByCategory(article.category)
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  const fullTextToSpeak = `${article.title}. ${
    scrapedData ? scrapedData.paragraphs.join(' ') : article.content
  }`;

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          {/* TTS Audio Bar Toggle */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowAudioBar((prev) => !prev)}
          >
            <Ionicons
              name={showAudioBar ? 'volume-high' : 'volume-medium-outline'}
              size={20}
              color={showAudioBar ? '#006B3F' : '#6B7280'}
            />
          </TouchableOpacity>

          {/* Reader font size adjuster */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowSettingsModal(true)}
          >
            <Ionicons name="text-outline" size={20} color="#6B7280" />
          </TouchableOpacity>

          {/* Bookmark */}
          <TouchableOpacity style={styles.iconButton} onPress={toggleBookmark}>
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isBookmarked ? '#006B3F' : '#6B7280'}
            />
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowShareSheet(true)}
          >
            <Ionicons name="share-social-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={500}
      >
        {/* Hero Image */}
        <ArticleHeroImage
          uri={scrapedData?.heroImageUrl || article.imageUrl}
          style={styles.articleImage}
        />

        {scrapedData?.caption && (
          <View style={styles.captionBox}>
            <Text style={styles.captionText}>{scrapedData.caption}</Text>
          </View>
        )}

        <View style={styles.articleBody}>
          {/* Category */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{article.category}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{scrapedData?.title || article.title}</Text>

          {/* Author Byline */}
          <View style={styles.authorRow}>
            <Image
              source={{
                uri:
                  scrapedData?.authorAvatar ||
                  'https://images.dailyamardesh.com/ad/amardesh-shadhinotar-kotha-bole.jpg',
              }}
              style={styles.avatar}
              contentFit="cover"
            />
            <View>
              <Text style={styles.authorName}>
                {scrapedData?.author || article.author}
              </Text>
              <Text style={styles.pubTime}>
                প্রকাশিত: {formatRelativeTime(article.publishedAt)}
              </Text>
            </View>
          </View>

          {/* Body Paragraphs */}
          {scrapedData && scrapedData.paragraphs.length > 0 ? (
            scrapedData.paragraphs.map((para, i) => (
              <Text key={i} style={styles.paragraph}>
                {para}
              </Text>
            ))
          ) : (
            <Text style={styles.paragraph}>{article.content}</Text>
          )}

          {/* Source Credit */}
          <View style={styles.sourceCard}>
            <Text style={styles.sourceCardText}>
              স্বত্ব © ২০২৪-২০২৬ দৈনিক আমার দেশ • dailyamardesh.com
            </Text>
          </View>

          {/* Related Stories */}
          {relatedStories.length > 0 && (
            <View>
              <Text style={styles.relatedHeader}>সম্পর্কিত সংবাদ</Text>
              {relatedStories.map((rel) => (
                <TouchableOpacity
                  key={rel.id}
                  style={styles.relatedCard}
                  onPress={() => router.push(`/article/${rel.id}`)}
                >
                  <View style={styles.relatedContent}>
                    <Text style={styles.relatedTitle} numberOfLines={2}>
                      {rel.title}
                    </Text>
                    <Text style={styles.relatedTime}>
                      {formatRelativeTime(rel.publishedAt)}
                    </Text>
                  </View>
                  <ArticleThumbnail
                    uri={rel.imageUrl}
                    style={styles.relatedThumb}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Audio News Bar */}
      {showAudioBar && (
        <AudioNewsBar
          title={article.title}
          textToSpeak={fullTextToSpeak}
          onClose={() => setShowAudioBar(false)}
        />
      )}

      {/* Reader Font Sizing Modal */}
      <ReaderSettingsModal
        visible={showSettingsModal}
        fontSizeMultiplier={fontSizeMultiplier}
        onFontSizeChange={setFontSizeMultiplier}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* Share Sheet */}
      {showShareSheet && (
        <View style={styles.shareSheetOverlay}>
          <View style={styles.shareSheet}>
            <Text style={styles.shareSheetTitle}>সংবাদটি শেয়ার করুন</Text>
            <View style={styles.shareOptions}>
              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShare('whatsapp')}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#25D366' }]}>
                  <Ionicons name="logo-whatsapp" size={24} color="#fff" />
                </View>
                <Text style={styles.shareLabel}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShare('facebook')}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#1877F2' }]}>
                  <Ionicons name="logo-facebook" size={24} color="#fff" />
                </View>
                <Text style={styles.shareLabel}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShare('telegram')}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#0088cc' }]}>
                  <Ionicons name="send" size={22} color="#fff" />
                </View>
                <Text style={styles.shareLabel}>Telegram</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShare('copy')}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#6B7280' }]}>
                  <Ionicons name="link" size={22} color="#fff" />
                </View>
                <Text style={styles.shareLabel}>কপি লিংক</Text>
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
    </View>
  );
}
