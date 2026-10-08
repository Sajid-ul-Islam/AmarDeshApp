import React, { useState, useEffect, useSyncExternalStore } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { articles as mockArticles, Article } from '../../data/mockData';
import { formatRelativeTime } from '../../utils/bengali';
import {
  loadArticles,
  getArticles,
  subscribeToArticles,
} from '../../services/articleStore';
import { loadBookmarks } from '../../services/storage';
import { stripCDATA } from '../../services/rssService';
import { useThemedStyles, useThemeTokens } from '../../theme';
import { ArticleThumbnail, ArticleHeroImage } from '../../components/OptimizedImage';
import { useUserStore, trackCategoryViewed } from '../../user';
import ReadingStreak from '../../components/ReadingStreak';
import { BreakingNewsTicker } from '../../components/BreakingNewsTicker';
import { ContinueReadingCard } from '../../components/ContinueReadingCard';
import {
  SITE_CATEGORIES,
  getArticlesByCategory,
} from '../../services/contentService';
import {
  getUnreadNotificationCount,
  subscribeToInbox,
} from '../../services/notificationInboxService';
import { toBengaliNumeral } from '../../utils/bengali';
import { AdBanner } from '../../components/AdBanner';
import { VisualStoriesBar } from '../../components/VisualStoriesBar';
import { LiveRatesTicker } from '../../components/LiveRatesTicker';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '../../store/useAppStore';
import {
  t,
  getLocalizedCategoryName,
  formatLocalizedNumeral,
  formatLocalizedRelativeTime,
} from '../../services/i18n';
import { getSafeHeaderPaddingTop } from '../../utils/layout';
import { AmarDeshLogo } from '../../components/AmarDeshLogo';
import { SideNavDrawer } from '../../components/SideNavDrawer';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tokens = useThemeTokens();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('সর্বশেষ');
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const language = useAppStore((state) => state.language);
  const feedLayout = useAppStore((state) => state.feedLayout);
  const setFeedLayout = useAppStore((state) => state.setFeedLayout);

  // Live news from dailyamardesh.com shared store
  const liveArticles = useSyncExternalStore(subscribeToArticles, getArticles);
  const baseArticles: Article[] =
    liveArticles.length > 0 ? liveArticles : mockArticles;

  const [displayArticles, setDisplayArticles] = useState<Article[]>(baseArticles);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const isUserReady = useUserStore((state) => state.isInitialized);
  const getPersonalizedFeed = useUserStore((state) => state.getPersonalizedFeed);

  // Load bookmarks on mount
  useEffect(() => {
    loadBookmarks().then(setBookmarks);
  }, []);

  // Update articles when category or live store changes
  useEffect(() => {
    if (selectedCategory === 'সর্বশেষ') {
      if (isUserReady && baseArticles.length > 0) {
        getPersonalizedFeed(baseArticles).then(setDisplayArticles);
      } else {
        setDisplayArticles(baseArticles);
      }
    } else {
      const filtered = getArticlesByCategory(selectedCategory);
      setDisplayArticles(filtered);
    }
  }, [selectedCategory, baseArticles, isUserReady]);

  // Subscribe to notification inbox for unread count
  useEffect(() => {
    getUnreadNotificationCount().then(setUnreadNotifCount);
    const unsub = subscribeToInbox(() => {
      getUnreadNotificationCount().then(setUnreadNotifCount);
    });
    return unsub;
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadArticles(true);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const breakingHeadlines = baseArticles
    .filter((a) => a.isBreaking || a.category === 'জাতীয়' || a.category === 'রাজনীতি')
    .slice(0, 5)
    .map((a) => ({ id: a.id, title: a.title }));

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: tokens.surface.subtle,
      },
      mainHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: getSafeHeaderPaddingTop(insets.top, 8),
        paddingBottom: 10,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
      },
      hamburgerBtn: {
        width: 36,
        height: 36,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.sm,
      },
      mastheadCol: {
        flex: 1,
        justifyContent: 'center',
      },
      mastheadTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      mastheadAccentBar: {
        width: 3.5,
        height: 22,
        backgroundColor: tokens.brand.primary,
        borderRadius: 1,
      },
      mastheadTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: tokens.text.primary,
        letterSpacing: -0.4,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      },
      mastheadMotto: {
        fontSize: 10.5,
        color: tokens.text.secondary,
        fontWeight: '500',
        marginTop: 3,
        letterSpacing: 0.3,
      },
      headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      iconBtn: {
        width: 36,
        height: 36,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.sm,
      },
      notifBadge: {
        position: 'absolute',
        top: -3,
        right: -3,
        backgroundColor: '#DC2626',
        borderRadius: tokens.radii.pill,
        minWidth: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
      },
      notifBadgeText: {
        color: '#FFFFFF',
        fontSize: 9.5,
        fontWeight: 'bold',
      },
      categoryScroll: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 0.5,
        borderBottomColor: tokens.border.subtle,
      },
      catChip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.subtle,
        marginRight: 8,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
      },
      specialCatChip: {
        backgroundColor: tokens.brand.crimsonSurface,
        borderWidth: 1,
        borderColor: tokens.brand.primary,
      },
      activeCatChip: {
        backgroundColor: tokens.text.primary,
        borderColor: tokens.text.primary,
      },
      activeSpecialCatChip: {
        backgroundColor: tokens.brand.primary,
        borderColor: tokens.brand.primary,
      },
      catChipText: {
        fontSize: 12.5,
        color: tokens.text.secondary,
        fontWeight: '600',
        letterSpacing: 0.2,
      },
      specialCatChipText: {
        color: tokens.brand.primary,
        fontWeight: '700',
      },
      activeCatChipText: {
        color: tokens.surface.base,
        fontWeight: '700',
      },
      listContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 40,
      },
      heroCard: {
        borderRadius: tokens.radii.lg,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: tokens.surface.base,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      heroImage: {
        width: '100%',
        height: 220,
        borderBottomWidth: 0.5,
        borderBottomColor: tokens.border.subtle,
      },
      heroBody: {
        padding: 16,
        backgroundColor: tokens.surface.base,
      },
      heroKickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
      },
      heroKicker: {
        color: tokens.brand.primary,
        fontSize: 11.5,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.7,
      },
      heroTitle: {
        color: tokens.text.primary,
        fontSize: 22,
        fontWeight: '700',
        lineHeight: 30,
        letterSpacing: -0.3,
        marginBottom: 8,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      },
      heroSnippet: {
        color: tokens.text.secondary,
        fontSize: 14,
        lineHeight: 21,
        marginBottom: 10,
      },
      heroMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingTop: 8,
        borderTopWidth: 0.5,
        borderTopColor: tokens.border.subtle,
      },
      heroTime: {
        color: tokens.text.tertiary,
        fontSize: 11.5,
        fontWeight: '500',
      },
      spotlightBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: tokens.surface.elevated,
        borderLeftWidth: 3.5,
        borderLeftColor: tokens.brand.primary,
        padding: 14,
        borderRadius: tokens.radii.lg,
        marginBottom: 16,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      spotlightTitle: {
        fontSize: 14.5,
        fontWeight: '700',
        color: tokens.brand.primary,
        letterSpacing: -0.2,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      },
      spotlightSub: {
        fontSize: 12,
        color: tokens.text.secondary,
        marginTop: 3,
        lineHeight: 17,
      },
      articleCard: {
        flexDirection: 'row',
        backgroundColor: tokens.surface.base,
        padding: 12,
        borderRadius: tokens.radii.lg,
        marginBottom: 12,
        gap: 12,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      articleContent: {
        flex: 1,
        justifyContent: 'space-between',
      },
      articleCategory: {
        fontSize: 11,
        color: tokens.brand.primary,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
      },
      articleTitle: {
        fontSize: 15.5,
        fontWeight: '700',
        color: tokens.text.primary,
        lineHeight: 22,
        letterSpacing: -0.2,
        marginBottom: 6,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      },
      articleMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      },
      articleTime: {
        fontSize: 11,
        color: tokens.text.tertiary,
        fontWeight: '500',
      },
      articleImage: {
        width: 86,
        height: 86,
        borderRadius: tokens.radii.md,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
      },
    })
  );

  const renderHeader = () => (
    <View>
      {/* Live Cricket Scores & Financial Market Ticker */}
      <LiveRatesTicker />

      {/* Visual Web Stories Carousel */}
      <VisualStoriesBar />

      {/* Continue Reading Shelf (if last read exists) */}
      <ContinueReadingCard />

      {/* Breaking News Marquee */}
      {breakingHeadlines.length > 0 && (
        <BreakingNewsTicker headlines={breakingHeadlines} />
      )}

      {/* Reading streak */}
      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <ReadingStreak compact={true} />
      </View>

      {/* July Revolution Highlight (on All tab) */}
      {selectedCategory === 'সর্বশেষ' && (
        <TouchableOpacity
          style={styles.spotlightBanner}
          onPress={() => setSelectedCategory('জুলাই বিপ্লব')}
          activeOpacity={0.75}
        >
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.spotlightTitle}>
              {t('july_spotlight_title', language)}
            </Text>
            <Text style={styles.spotlightSub}>
              {t('july_spotlight_sub', language)}
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={tokens.brand.primary} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderArticle = ({ item, index }: { item: Article; index: number }) => {
    if (feedLayout === 'magazine' && index === 0) {
      return (
        <TouchableOpacity
          style={styles.heroCard}
          onPress={() => router.push(`/article/${item.id}` as any)}
          activeOpacity={0.85}
        >
          <ArticleHeroImage uri={item.imageUrl} style={styles.heroImage} />
          <View style={styles.heroBody}>
            <View style={styles.heroKickerRow}>
              <Text style={styles.heroKicker}>
                {getLocalizedCategoryName(item.category, language)}
              </Text>
            </View>
            <Text style={styles.heroTitle} numberOfLines={3}>
              {stripCDATA(item.title)}
            </Text>
            {item.excerpt ? (
              <Text style={styles.heroSnippet} numberOfLines={2}>
                {item.excerpt}
              </Text>
            ) : null}
            <View style={styles.heroMetaRow}>
              <Ionicons name="time-outline" size={12} color={styles.heroTime.color} />
              <Text style={styles.heroTime}>
                {formatLocalizedRelativeTime(item.publishedAt, language)}
              </Text>
              {item.author ? (
                <>
                  <Text style={styles.heroTime}>•</Text>
                  <Text style={styles.heroTime}>{item.author}</Text>
                </>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View>
        <TouchableOpacity
          style={styles.articleCard}
          onPress={() => router.push(`/article/${item.id}` as any)}
          activeOpacity={0.75}
        >
          <View style={styles.articleContent}>
            <Text style={styles.articleCategory}>
              {getLocalizedCategoryName(item.category, language)}
            </Text>
            <Text style={styles.articleTitle} numberOfLines={2}>
              {stripCDATA(item.title)}
            </Text>
            <View style={styles.articleMetaRow}>
              <Ionicons name="time-outline" size={11} color={styles.articleTime.color} />
              <Text style={styles.articleTime}>
                {formatLocalizedRelativeTime(item.publishedAt, language)}
              </Text>
            </View>
          </View>
          <ArticleThumbnail uri={item.imageUrl} style={styles.articleImage} />
        </TouchableOpacity>
        {/* Dynamic In-Feed Ad Placement */}
        {(index === 2 || (index > 2 && (index - 2) % 6 === 0)) && (
          <AdBanner variant={index === 2 ? 'feed' : 'compact'} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Broadsheet Masthead with Official Logo & Side Nav Drawer Trigger */}
      <View style={styles.mainHeader}>
        <TouchableOpacity
          style={styles.hamburgerBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setIsSideNavOpen(true);
          }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={t('side_nav_open', language)}
        >
          <Ionicons name="menu" size={22} color={tokens.brand.primary} />
        </TouchableOpacity>

        <View style={styles.mastheadCol}>
          <AmarDeshLogo height={34} variant="png" showMotto language={language} />
        </View>

        <View style={styles.headerIcons}>
          {/* AI Settings / BYOK shortcut */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/settings/ai' as any)}
            activeOpacity={0.7}
          >
            <Ionicons name="sparkles" size={16} color={tokens.brand.heritageGreen} />
          </TouchableOpacity>

          {/* Notification Center */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/notifications' as any)}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={17} color={styles.mastheadTitle.color} />
            {unreadNotifCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>
                  {unreadNotifCount > 9 ? '৯+' : formatLocalizedNumeral(unreadNotifCount, language)}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Feed Layout Toggle (Magazine vs Compact List) */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {
              Haptics.selectionAsync();
              setFeedLayout(feedLayout === 'magazine' ? 'compact' : 'magazine');
            }}
            activeOpacity={0.7}
            accessibilityLabel="ফিড লেআউট পরিবর্তন"
          >
            <Ionicons
              name={feedLayout === 'magazine' ? 'list-outline' : 'grid-outline'}
              size={17}
              color={styles.mastheadTitle.color}
            />
          </TouchableOpacity>

          {/* Search */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/search' as any)}
            activeOpacity={0.7}
          >
            <Ionicons name="search" size={17} color={styles.mastheadTitle.color} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Horizontal Category Bar */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {SITE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.catChip,
                  cat.isSpecial && styles.specialCatChip,
                  isSelected && styles.activeCatChip,
                  isSelected && cat.isSpecial && styles.activeSpecialCatChip,
                ]}
                onPress={() => {
                  setSelectedCategory(cat.name);
                  trackCategoryViewed(cat.name, 'tab');
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.catChipText,
                    cat.isSpecial && styles.specialCatChipText,
                    isSelected && styles.activeCatChipText,
                  ]}
                >
                  {getLocalizedCategoryName(cat.name, language)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Articles Stream */}
      <FlatList
        data={displayArticles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Global Animated Side Navigation Drawer */}
      <SideNavDrawer
        visible={isSideNavOpen}
        onClose={() => setIsSideNavOpen(false)}
      />
    </View>
  );
}
