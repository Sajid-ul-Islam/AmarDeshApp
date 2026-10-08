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
  PanResponder,
  Platform,
  ActivityIndicator,
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
import { scrapeFullArticle, ScrapedArticleData, cleanText } from '../../services/articleScraper';
import { ReaderSettingsModal } from '../../components/ReaderSettingsModal';
import { AudioNewsBar } from '../../components/AudioNewsBar';
import { AiSummaryCard } from '../../components/AiSummaryCard';
import { AiAssistantModal } from '../../components/AiAssistantModal';
import { ArticleReactions } from '../../components/ArticleReactions';
import { AdBanner } from '../../components/AdBanner';
import { QuoteCardModal } from '../../components/QuoteCardModal';
import { ArticleTimeline } from '../../components/ArticleTimeline';
import { getArticlesByCategory } from '../../services/contentService';
import { useThemedStyles, useThemeTokens } from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../../store/useAppStore';
import {
  t,
  getLocalizedCategoryName,
  formatLocalizedRelativeTime,
} from '../../services/i18n';
import { getSafeHeaderPaddingTop } from '../../utils/layout';
import { AmarDeshLogo } from '../../components/AmarDeshLogo';

export default function ArticleDetailScreen() {
  const language = useAppStore((state) => state.language);
  const tokens = useThemeTokens();
  const { id } = useLocalSearchParams();
  const articleId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1.0);
  const [showAudioBar, setShowAudioBar] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

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
        article.publishedAt,
        article.link
      ).then((data) => {
        setScrapedData(data);
      });
    }
  }, [article?.id, article?.link]);

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
    setReadingProgress(clamped);

    if (article && clamped >= 0.1 && clamped < 0.95) {
      AsyncStorage.setItem(
        '@amar_desh_last_read',
        JSON.stringify({
          id: article.id,
          title: article.title,
          category: article.category,
          progress: clamped,
          updatedAt: Date.now(),
        })
      ).catch(() => {});
    }
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
        paddingTop: getSafeHeaderPaddingTop(insets.top, 8),
        paddingBottom: 10,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 0.5,
        borderBottomColor: tokens.border.subtle,
      },
      backButton: {
        padding: 6,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
      },
      headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      iconButton: {
        padding: 7,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.sm,
      },
      activeIconButton: {
        backgroundColor: tokens.brand.surface,
        borderColor: tokens.brand.primary,
        borderWidth: 1,
      },
      progressBarTrack: {
        height: 2.5,
        backgroundColor: tokens.surface.elevated,
        width: '100%',
      },
      progressBarFill: {
        height: '100%',
        backgroundColor: '#DC2626',
      },
      content: {
        flex: 1,
      },
      articleImage: {
        width: '100%',
        height: 235,
      },
      captionBox: {
        paddingHorizontal: 16,
        paddingVertical: 7,
        backgroundColor: tokens.surface.elevated,
        borderBottomWidth: 0.5,
        borderBottomColor: tokens.border.subtle,
      },
      captionText: {
        fontSize: 12,
        color: tokens.text.secondary,
        fontStyle: 'italic',
        lineHeight: 16,
      },
      articleBody: {
        padding: 18,
        paddingBottom: 100,
      },
      categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: tokens.brand.crimsonSurface,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: tokens.radii.pill,
        marginBottom: 12,
        borderWidth: 0.5,
        borderColor: tokens.brand.primary,
      },
      categoryText: {
        fontSize: 11.5,
        color: tokens.brand.primary,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
      },
      title: {
        fontSize: 26 * fontSizeMultiplier,
        fontWeight: '700',
        color: tokens.text.primary,
        lineHeight: 35 * fontSizeMultiplier,
        letterSpacing: -0.4,
        marginBottom: 16,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      },
      authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        marginBottom: 20,
        borderTopWidth: 0.5,
        borderTopColor: tokens.border.subtle,
        borderBottomWidth: 0.5,
        borderBottomColor: tokens.border.subtle,
      },
      avatar: {
        width: 38,
        height: 38,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
      },
      authorName: {
        fontSize: 14,
        fontWeight: '700',
        color: tokens.text.primary,
        letterSpacing: -0.1,
      },
      pubTime: {
        fontSize: 11.5,
        color: tokens.text.secondary,
        marginTop: 2,
        fontWeight: '500',
      },
      paragraph: {
        fontSize: 18 * fontSizeMultiplier,
        color: tokens.text.primary,
        lineHeight: 30 * fontSizeMultiplier,
        marginBottom: 20,
        letterSpacing: 0.1,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      },
      sourceCard: {
        backgroundColor: tokens.surface.elevated,
        padding: 14,
        borderRadius: tokens.radii.lg,
        marginTop: 18,
        marginBottom: 28,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      sourceCardText: {
        fontSize: 12,
        color: tokens.text.secondary,
        fontWeight: '500',
      },
      relatedHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: tokens.text.primary,
        marginBottom: 14,
        borderLeftWidth: 3.5,
        borderLeftColor: tokens.brand.primary,
        paddingLeft: 10,
        letterSpacing: -0.2,
      },
      relatedCard: {
        flexDirection: 'row',
        backgroundColor: tokens.surface.elevated,
        borderRadius: tokens.radii.lg,
        padding: 12,
        marginBottom: 10,
        gap: 12,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      relatedContent: {
        flex: 1,
        justifyContent: 'space-between',
      },
      relatedTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: tokens.text.primary,
        lineHeight: 20,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      },
      relatedTime: {
        fontSize: 11,
        color: tokens.text.tertiary,
      },
      relatedThumb: {
        width: 75,
        height: 56,
        borderRadius: tokens.radii.md,
      },
      // Share Sheet
      shareSheetOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        justifyContent: 'flex-end',
        zIndex: 1000,
      },
      shareSheet: {
        backgroundColor: tokens.surface.base,
        borderTopLeftRadius: tokens.radii['2xl'],
        borderTopRightRadius: tokens.radii['2xl'],
        padding: 22,
        paddingBottom: 40,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.lg,
      },
      shareSheetTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: tokens.text.primary,
        marginBottom: 18,
        textAlign: 'center',
      },
      shareOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 22,
      },
      shareOption: {
        alignItems: 'center',
      },
      shareIcon: {
        width: 50,
        height: 50,
        borderRadius: tokens.radii.pill,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
      },
      shareLabel: {
        fontSize: 11.5,
        color: tokens.text.secondary,
        fontWeight: '500',
      },
      shareSheetClose: {
        backgroundColor: tokens.surface.elevated,
        padding: 12,
        borderRadius: tokens.radii.pill,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
      },
      shareSheetCloseText: {
        fontSize: 14,
        color: tokens.text.primary,
        fontWeight: '600',
      },
      articleNavRow: {
        flexDirection: 'row',
        gap: 10,
        marginVertical: 18,
      },
      navCard: {
        flex: 1,
        backgroundColor: tokens.surface.elevated,
        borderRadius: tokens.radii.lg,
        padding: 12,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      navCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
      },
      navCardLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: tokens.brand.primary,
      },
      navCardTitle: {
        fontSize: 12.5,
        color: tokens.text.primary,
        lineHeight: 17,
      },
      swipeHintRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 8,
        marginTop: 4,
      },
      swipeHintText: {
        fontSize: 11,
        color: tokens.text.tertiary,
      },
    })
  );

  const categoryArticles = article ? getArticlesByCategory(article.category) : [];
  const currentIndex = article ? categoryArticles.findIndex((a) => a.id === article.id) : -1;
  const prevArticle = currentIndex > 0 ? categoryArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex >= 0 && currentIndex < categoryArticles.length - 1
      ? categoryArticles[currentIndex + 1]
      : null;

  const nextArticleRef = useRef(nextArticle);
  nextArticleRef.current = nextArticle;
  const prevArticleRef = useRef(prevArticle);
  prevArticleRef.current = prevArticle;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > 35 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2
        );
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -55 && nextArticleRef.current) {
          router.push(`/article/${nextArticleRef.current.id}` as any);
        } else if (gestureState.dx > 55 && prevArticleRef.current) {
          router.push(`/article/${prevArticleRef.current.id}` as any);
        }
      },
    })
  ).current;

  if (isResolving && !article) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={tokens.brand.primary} style={{ marginBottom: 12 }} />
        <Text style={{ color: tokens.text.secondary, fontSize: 14 }}>{t('loading_article', language)}</Text>
      </View>
    );
  }

  if (!article) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
        <Ionicons name="newspaper-outline" size={54} color={tokens.text.tertiary} style={{ marginBottom: 16 }} />
        <Text style={{ fontSize: 18, fontWeight: '700', color: tokens.text.primary, marginBottom: 8, textAlign: 'center' }}>
          {t('article_not_found', language)}
        </Text>
        <Text style={{ fontSize: 13, color: tokens.text.secondary, marginBottom: 24, textAlign: 'center' }}>
          সংবাদটি হয়তো সরানো হয়েছে বা লিংকটি সঠিক নয়।
        </Text>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/' as any))}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: tokens.brand.primary,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 999,
          }}
        >
          <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
          <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>
            {t('back', language) || 'ফিরে যান'}
          </Text>
        </TouchableOpacity>
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
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Focus Mode Floating Exit Pill or Standard Header */}
      {isFocusMode ? (
        <View
          style={{
            position: 'absolute',
            top: getSafeHeaderPaddingTop(insets.top, 8),
            right: 16,
            zIndex: 100,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: 'rgba(18, 18, 18, 0.78)',
              paddingHorizontal: 12,
              paddingVertical: 7,
              borderRadius: 999,
            }}
            onPress={() => setIsFocusMode(false)}
            accessibilityLabel="ফোকাস মোড ত্যাগ করুন"
          >
            <Ionicons name="contract-outline" size={16} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>
              ফোকাস ত্যাগ
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Standard Header Bar */
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={styles.title.color} />
          </TouchableOpacity>

          <AmarDeshLogo height={24} variant="png" />

          <View style={styles.headerActions}>
            {/* Focus Mode Toggle */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setIsFocusMode(true)}
              activeOpacity={0.7}
              accessibilityLabel="ফোকাস রিডিং মোড"
            >
              <Ionicons name="scan-outline" size={18} color={styles.authorName.color} />
            </TouchableOpacity>

            {/* Quote Card Generator */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowQuoteModal(true)}
              activeOpacity={0.7}
              accessibilityLabel="উদ্ধৃতি কার্ড তৈরি করুন"
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={18}
                color={styles.authorName.color}
              />
            </TouchableOpacity>

            {/* AI Assistant */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowAiAssistant(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="sparkles" size={18} color="#006B3F" />
            </TouchableOpacity>

            {/* TTS Audio Bar Toggle */}
            <TouchableOpacity
              style={[styles.iconButton, showAudioBar && styles.activeIconButton]}
              onPress={() => setShowAudioBar((prev) => !prev)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showAudioBar ? 'volume-high' : 'volume-medium-outline'}
                size={19}
                color={showAudioBar ? '#006B3F' : styles.authorName.color}
              />
            </TouchableOpacity>

            {/* Reader font size adjuster */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowSettingsModal(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="text-outline" size={19} color={styles.authorName.color} />
            </TouchableOpacity>

            {/* Bookmark */}
            <TouchableOpacity
              style={[styles.iconButton, isBookmarked && styles.activeIconButton]}
              onPress={toggleBookmark}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={19}
                color={isBookmarked ? '#006B3F' : styles.authorName.color}
              />
            </TouchableOpacity>

            {/* Share */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowShareSheet(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="share-social-outline" size={19} color={styles.authorName.color} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Reading Progress Bar */}
      <View style={styles.progressBarTrack}>
        <View
          style={[styles.progressBarFill, { width: `${Math.round(readingProgress * 100)}%` }]}
        />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={300}
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
            <Text style={styles.categoryText}>
              {getLocalizedCategoryName(article.category, language)}
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{cleanText(scrapedData?.title || article.title)}</Text>

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
                {t('published_prefix', language)}
                {formatLocalizedRelativeTime(article.publishedAt, language)}
              </Text>
            </View>
          </View>

          {/* AI 3-Point Smart Summary */}
          <AiSummaryCard
            article={article}
            fullText={scrapedData ? scrapedData.paragraphs.join(' ') : article.content}
            onOpenAssistant={() => setShowAiAssistant(true)}
            onOpenSettings={() => router.push('/settings/ai' as any)}
          />

          {/* Body Paragraphs with Dynamic In-Article Ad Placement */}
          {scrapedData && scrapedData.paragraphs.length > 0 ? (
            scrapedData.paragraphs.map((para, i) => (
              <React.Fragment key={i}>
                <Text style={styles.paragraph}>
                  {para}
                </Text>
                {/* Dynamic Inline Ad after 2nd paragraph for articles with 3+ paragraphs */}
                {i === 1 && scrapedData.paragraphs.length >= 3 && (
                  <View style={{ marginVertical: 8 }}>
                    <AdBanner variant="feed" />
                  </View>
                )}
              </React.Fragment>
            ))
          ) : (
            <Text style={styles.paragraph}>{article.content}</Text>
          )}

          {/* Reader Emoji Reactions Bar */}
          <ArticleReactions articleId={article.id} />

          {/* Next / Previous Article Navigation */}
          <View style={styles.articleNavRow}>
            {prevArticle ? (
              <TouchableOpacity
                style={styles.navCard}
                onPress={() => router.push(`/article/${prevArticle.id}` as any)}
                activeOpacity={0.75}
              >
                <View style={styles.navCardHeader}>
                  <Ionicons name="arrow-back" size={14} color="#006B3F" />
                  <Text style={styles.navCardLabel}>{t('prev_article', language)}</Text>
                </View>
                <Text style={styles.navCardTitle} numberOfLines={2}>
                  {prevArticle.title}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.navCard, { opacity: 0.45 }]}>
                <View style={styles.navCardHeader}>
                  <Ionicons name="arrow-back" size={14} color={styles.authorName.color} />
                  <Text style={[styles.navCardLabel, { color: styles.authorName.color }]}>
                    {t('start_of_category', language)}
                  </Text>
                </View>
                <Text style={[styles.navCardTitle, { color: styles.authorName.color }]}>
                  {t('no_prev_article', language)}
                </Text>
              </View>
            )}

            {nextArticle ? (
              <TouchableOpacity
                style={[styles.navCard, { alignItems: 'flex-end' }]}
                onPress={() => router.push(`/article/${nextArticle.id}` as any)}
                activeOpacity={0.75}
              >
                <View style={[styles.navCardHeader, { flexDirection: 'row-reverse' }]}>
                  <Ionicons name="arrow-forward" size={14} color="#006B3F" />
                  <Text style={styles.navCardLabel}>{t('next_article', language)}</Text>
                </View>
                <Text style={[styles.navCardTitle, { textAlign: 'right' }]} numberOfLines={2}>
                  {nextArticle.title}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.navCard, { opacity: 0.45, alignItems: 'flex-end' }]}>
                <View style={[styles.navCardHeader, { flexDirection: 'row-reverse' }]}>
                  <Ionicons name="arrow-forward" size={14} color={styles.authorName.color} />
                  <Text style={[styles.navCardLabel, { color: styles.authorName.color }]}>
                    {t('end_of_category', language)}
                  </Text>
                </View>
                <Text style={[styles.navCardTitle, { textAlign: 'right', color: styles.authorName.color }]}>
                  {t('no_next_article', language)}
                </Text>
              </View>
            )}
          </View>

          {/* Swipe Hint */}
          <View style={styles.swipeHintRow}>
            <Ionicons name="swap-horizontal" size={14} color={styles.swipeHintText.color} />
            <Text style={styles.swipeHintText}>{t('swipe_hint', language)}</Text>
          </View>

          {/* Contextual Timeline */}
          <ArticleTimeline />

          {/* Editorial Sponsored Card */}
          <AdBanner variant="articleFooter" />

          {/* Source Credit */}
          <View style={styles.sourceCard}>
            <Text style={styles.sourceCardText}>
              {t('copyright_notice', language)}
            </Text>
          </View>

          {/* Related Stories */}
          {relatedStories.length > 0 && (
            <View>
              <Text style={styles.relatedHeader}>{t('related_news', language)}</Text>
              {relatedStories.map((rel) => (
                <TouchableOpacity
                  key={rel.id}
                  style={styles.relatedCard}
                  onPress={() => router.push(`/article/${rel.id}` as any)}
                  activeOpacity={0.75}
                >
                  <View style={styles.relatedContent}>
                    <Text style={styles.relatedTitle} numberOfLines={2}>
                      {rel.title}
                    </Text>
                    <Text style={styles.relatedTime}>
                      {formatRelativeTime(rel.publishedAt)}
                    </Text>
                  </View>
                  <ArticleThumbnail uri={rel.imageUrl} style={styles.relatedThumb} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Audio News Bar */}
      {showAudioBar && (
        <AudioNewsBar
          title={cleanText(scrapedData?.title || article.title)}
          textToSpeak={fullTextToSpeak}
          onClose={() => setShowAudioBar(false)}
        />
      )}

      {/* Reader Settings Modal */}
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
            <Text style={styles.shareSheetTitle}>{t('share_news', language)}</Text>
            <View style={styles.shareOptions}>
              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => {
                  setShowShareSheet(false);
                  setShowQuoteModal(true);
                }}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#BA131A' }]}>
                  <Ionicons name="chatbubble-ellipses" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.shareLabel}>উদ্ধৃতি কার্ড</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShare('whatsapp')}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#25D366' }]}>
                  <Ionicons name="logo-whatsapp" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.shareLabel}>হোয়াটসঅ্যাপ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShare('facebook')}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#1877F2' }]}>
                  <Ionicons name="logo-facebook" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.shareLabel}>ফেসবুক</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShare('twitter')}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#000000' }]}>
                  <Ionicons name="logo-twitter" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.shareLabel}>এক্স (টুইটার)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShare('native')}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#6B7280' }]}>
                  <Ionicons name="share-outline" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.shareLabel}>
                  {language === 'bn' ? 'অন্যান্য' : 'More'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.shareSheetClose}
              onPress={() => setShowShareSheet(false)}
            >
              <Text style={styles.shareSheetCloseText}>{t('close', language)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Interactive AI News Assistant Modal */}
      <AiAssistantModal
        visible={showAiAssistant}
        article={article}
        onClose={() => setShowAiAssistant(false)}
        onOpenSettings={() => router.push('/settings/ai' as any)}
      />

      {/* Quote Card Generator Modal */}
      <QuoteCardModal
        visible={showQuoteModal}
        articleTitle={article.title}
        articleUrl={article.link || 'https://dailyamardesh.com'}
        authorName={article.author || 'আমার দেশ বিশেষ প্রতিবেদন'}
        initialQuote={article.excerpt || article.content.slice(0, 140)}
        onClose={() => setShowQuoteModal(false)}
      />
    </View>
  );
}
