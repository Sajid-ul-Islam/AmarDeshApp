import React, { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { articles as mockArticles, Article } from '../../data/mockData';
import { toBengaliNumeral } from '../../utils/bengali';
import { loadBookmarks } from '../../services/storage';
import { ArticleThumbnail, ArticleHeroImage } from '../../components/OptimizedImage';
import { loadArticles, getArticles, subscribeToArticles } from '../../services/articleStore';
import { stripCDATA } from '../../services/rssService';
import { useThemedStyles, useThemeTokens } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { useUserStore } from '../../user';
import {
  t,
  getLocalizedCategoryName,
  formatLocalizedNumeral,
  formatLocalizedRelativeTime,
} from '../../services/i18n';
import { getSafeHeaderPaddingTop } from '../../utils/layout';
import { AmarDeshLogo } from '../../components/AmarDeshLogo';

export default function BookmarksScreen() {
  const language = useAppStore((state) => state.language);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tokens = useThemeTokens();
  const params = useLocalSearchParams<{ tab?: string }>();

  // Sub-tab selection: 'saved' (Bookmarks) or 'foryou' (Personalized Feed)
  const [activeTab, setActiveTab] = useState<'saved' | 'foryou'>(
    params.tab === 'foryou' ? 'foryou' : 'saved'
  );

  useEffect(() => {
    if (params.tab === 'foryou') {
      setActiveTab('foryou');
    } else if (params.tab === 'saved') {
      setActiveTab('saved');
    }
  }, [params.tab]);

  // Live news from dailyamardesh.com
  const liveArticles = useSyncExternalStore(subscribeToArticles, getArticles);
  const allArticles: Article[] = liveArticles.length > 0 ? liveArticles : mockArticles;

  // Saved Bookmarks state
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Article[]>([]);

  // For You state
  const [personalizedArticles, setPersonalizedArticles] = useState<Article[]>([]);
  const [interests, setInterests] = useState<Array<{ type: string; id: string; score: number }>>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getPersonalizedFeed = useUserStore((state) => state.getPersonalizedFeed);
  const getUserInterests = useUserStore((state) => state.getUserInterests);
  const isUserReady = useUserStore((state) => state.isInitialized);

  // Load Bookmarks on screen focus
  useFocusEffect(
    useCallback(() => {
      let active = true;

      loadBookmarks().then((bookmarkIds) => {
        if (!active) return;
        const saved = bookmarkIds
          .map((id) => allArticles.find((a) => a.id === id))
          .filter((a): a is Article => a !== undefined);
        setBookmarkedArticles(saved);
      });

      return () => {
        active = false;
      };
    }, [allArticles])
  );

  // Initial load
  useEffect(() => {
    loadArticles();
  }, []);

  const loadForYouFeed = useCallback(async () => {
    if (!isUserReady) return;
    try {
      const feed = await getPersonalizedFeed(allArticles);
      setPersonalizedArticles(feed);
      const userInterests = await getUserInterests(5);
      setInterests(userInterests);
    } catch {
      setPersonalizedArticles(allArticles.slice(0, 10));
    }
  }, [isUserReady, getPersonalizedFeed, getUserInterests, allArticles]);

  useEffect(() => {
    loadForYouFeed();
  }, [loadForYouFeed]);

  const onRefreshForYou = async () => {
    setRefreshing(true);
    await loadForYouFeed();
    setRefreshing(false);
  };

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: tokens.surface.subtle,
      },
      header: {
        paddingTop: getSafeHeaderPaddingTop(insets.top, 6),
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tokens.text.primary,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      },
      headerRightAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      },
      interestsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: tokens.surface.elevated,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      interestsBtnText: {
        fontSize: 11,
        fontWeight: '600',
        color: tokens.text.secondary,
      },
      countBadge: {
        backgroundColor: tokens.brand.surface,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      countText: {
        fontSize: 11.5,
        fontWeight: '700',
        color: tokens.brand.primary,
      },
      // Segment Switcher: [ সংরক্ষিত | আপনার জন্য ]
      segmentContainer: {
        flexDirection: 'row',
        backgroundColor: tokens.surface.base,
        marginHorizontal: 16,
        marginTop: 10,
        marginBottom: 6,
        padding: 3,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      segmentBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 4,
        gap: 6,
      },
      segmentBtnActive: {
        backgroundColor: tokens.brand.primary,
      },
      segmentText: {
        fontSize: 13,
        fontWeight: '600',
        color: tokens.text.secondary,
      },
      segmentTextActive: {
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
      countPill: {
        backgroundColor: tokens.surface.elevated,
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 10,
      },
      countPillActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
      },
      countPillText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: tokens.text.secondary,
      },
      countPillTextActive: {
        color: '#FFFFFF',
      },
      sparkleBadge: {
        backgroundColor: tokens.brand.surface,
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 4,
      },
      sparkleBadgeActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
      },
      sparkleBadgeText: {
        fontSize: 9.5,
        fontWeight: 'bold',
        color: tokens.brand.primary,
      },
      sparkleBadgeTextActive: {
        color: '#FFFFFF',
      },
      // Interests banner in For You tab
      interestsBanner: {
        backgroundColor: tokens.surface.base,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.subtle,
      },
      interestsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      },
      interestsLabel: {
        fontSize: 11.5,
        color: tokens.text.secondary,
        fontWeight: '500',
      },
      interestsScroll: {
        flexDirection: 'row',
        gap: 6,
        paddingVertical: 4,
      },
      interestChip: {
        backgroundColor: tokens.surface.elevated,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      interestText: {
        fontSize: 11,
        color: tokens.brand.primary,
        fontWeight: '600',
      },
      // Article lists
      listContent: {
        padding: 16,
        paddingBottom: 32,
      },
      articleCard: {
        flexDirection: 'row',
        backgroundColor: tokens.surface.base,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      articleImage: {
        width: 104,
        height: 88,
      },
      articleContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
      },
      articleCategory: {
        fontSize: 11,
        color: tokens.brand.primary,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 3,
      },
      articleTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: tokens.text.primary,
        lineHeight: 21,
        letterSpacing: -0.2,
        marginBottom: 4,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      },
      articleTime: {
        fontSize: 11,
        color: tokens.text.tertiary,
        fontWeight: '500',
      },
      // Lead hero card for For You tab
      heroCard: {
        backgroundColor: tokens.surface.base,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 14,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      heroImage: {
        width: '100%',
        height: 190,
      },
      heroContent: {
        padding: 14,
      },
      heroBadge: {
        alignSelf: 'flex-start',
        backgroundColor: tokens.brand.surface,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 3,
        marginBottom: 6,
      },
      heroBadgeText: {
        fontSize: 10.5,
        fontWeight: 'bold',
        color: tokens.brand.primary,
        textTransform: 'uppercase',
      },
      heroTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: tokens.text.primary,
        lineHeight: 23,
        marginBottom: 6,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      },
      heroTime: {
        fontSize: 11.5,
        color: tokens.text.tertiary,
      },
      // Empty states
      emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
        paddingHorizontal: 32,
      },
      emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: tokens.surface.elevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
      },
      emptyText: {
        fontSize: 16,
        color: tokens.text.primary,
        fontWeight: 'bold',
        marginBottom: 6,
        textAlign: 'center',
      },
      emptySubtext: {
        fontSize: 13,
        color: tokens.text.secondary,
        textAlign: 'center',
        lineHeight: 19,
      },
    })
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <AmarDeshLogo height={20} variant="png" />
          <Text style={styles.title}>
            {activeTab === 'saved' ? t('saved_articles', language) : t('for_you', language)}
          </Text>
        </View>

        <View style={styles.headerRightAction}>
          {activeTab === 'saved' && bookmarkedArticles.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {language === 'bn'
                  ? `${formatLocalizedNumeral(bookmarkedArticles.length, language)} টি`
                  : `${bookmarkedArticles.length} ${bookmarkedArticles.length === 1 ? 'item' : 'items'}`}
              </Text>
            </View>
          )}

          {activeTab === 'foryou' && (
            <TouchableOpacity
              style={styles.interestsBtn}
              onPress={() => router.push('/settings/interests' as any)}
              activeOpacity={0.7}
            >
              <Ionicons name="options-outline" size={13} color={tokens.text.secondary} />
              <Text style={styles.interestsBtnText}>{t('customize_interests', language)}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Segment Switcher: [ সংরক্ষিত | আপনার জন্য ] */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'saved' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('saved')}
          activeOpacity={0.75}
        >
          <Ionicons
            name={activeTab === 'saved' ? 'bookmark' : 'bookmark-outline'}
            size={15}
            color={activeTab === 'saved' ? '#FFFFFF' : tokens.text.secondary}
          />
          <Text style={[styles.segmentText, activeTab === 'saved' && styles.segmentTextActive]}>
            {t('saved_articles', language)}
          </Text>
          {bookmarkedArticles.length > 0 && (
            <View style={[styles.countPill, activeTab === 'saved' && styles.countPillActive]}>
              <Text
                style={[
                  styles.countPillText,
                  activeTab === 'saved' && styles.countPillTextActive,
                ]}
              >
                {toBengaliNumeral(bookmarkedArticles.length)}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'foryou' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('foryou')}
          activeOpacity={0.75}
        >
          <Ionicons
            name={activeTab === 'foryou' ? 'sparkles' : 'sparkles-outline'}
            size={15}
            color={activeTab === 'foryou' ? '#FFFFFF' : tokens.text.secondary}
          />
          <Text style={[styles.segmentText, activeTab === 'foryou' && styles.segmentTextActive]}>
            {t('for_you', language)}
          </Text>
          <View style={[styles.sparkleBadge, activeTab === 'foryou' && styles.sparkleBadgeActive]}>
            <Text
              style={[
                styles.sparkleBadgeText,
                activeTab === 'foryou' && styles.sparkleBadgeTextActive,
              ]}
            >
              AI
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* For You Top Interests Bar */}
      {activeTab === 'foryou' && interests.length > 0 && (
        <View style={styles.interestsBanner}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.interestsScroll}>
            <Text style={[styles.interestsLabel, { alignSelf: 'center', marginRight: 4 }]}>
              {t('top_interests', language)}
            </Text>
            {interests.map((interest, idx) => (
              <View key={idx} style={styles.interestChip}>
                <Text style={styles.interestText}>{interest.id}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Tab 1 Content: Saved Articles */}
      {activeTab === 'saved' && (
        bookmarkedArticles.length > 0 ? (
          <FlatList
            data={bookmarkedArticles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.articleCard}
                onPress={() => router.push(`/article/${item.id}` as any)}
                activeOpacity={0.8}
              >
                <ArticleThumbnail uri={item.imageUrl} style={styles.articleImage} recyclingKey={item.id} />
                <View style={styles.articleContent}>
                  <Text style={styles.articleCategory}>
                    {getLocalizedCategoryName(item.category, language)}
                  </Text>
                  <Text style={styles.articleTitle} numberOfLines={2}>
                    {stripCDATA(item.title)}
                  </Text>
                  <Text style={styles.articleTime}>
                    {formatLocalizedRelativeTime(item.publishedAt, language)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="bookmark-outline" size={40} color={tokens.text.tertiary} />
            </View>
            <Text style={styles.emptyText}>{t('no_saved_articles', language)}</Text>
            <Text style={styles.emptySubtext}>
              {language === 'bn'
                ? 'খবরের পাতার উপরে বা পাশে বুকমার্ক আইকনে ট্যাপ করে যেকোনো খবর পরবর্তীতে পড়ার জন্য সেভ করে রাখতে পারেন।'
                : 'Tap the bookmark icon on any article to save it for reading later, even while offline.'}
            </Text>
          </View>
        )
      )}

      {/* Tab 2 Content: For You (Personalized Feed) */}
      {activeTab === 'foryou' && (
        personalizedArticles.length > 0 ? (
          <FlatList
            data={personalizedArticles}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefreshForYou}
                tintColor={tokens.brand.primary}
                colors={[tokens.brand.primary]}
              />
            }
            renderItem={({ item, index }) => {
              if (index === 0) {
                return (
                  <TouchableOpacity
                    style={styles.heroCard}
                    onPress={() => router.push(`/article/${item.id}` as any)}
                    activeOpacity={0.85}
                  >
                    <ArticleHeroImage uri={item.imageUrl} style={styles.heroImage} />
                    <View style={styles.heroContent}>
                      <View style={styles.heroBadge}>
                        <Text style={styles.heroBadgeText}>
                          {getLocalizedCategoryName(item.category, language)} • সুপারিশকৃত
                        </Text>
                      </View>
                      <Text style={styles.heroTitle} numberOfLines={2}>
                        {stripCDATA(item.title)}
                      </Text>
                      <Text style={styles.heroTime}>
                        {formatLocalizedRelativeTime(item.publishedAt, language)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  style={styles.articleCard}
                  onPress={() => router.push(`/article/${item.id}` as any)}
                  activeOpacity={0.8}
                >
                  <ArticleThumbnail uri={item.imageUrl} style={styles.articleImage} recyclingKey={item.id} />
                  <View style={styles.articleContent}>
                    <Text style={styles.articleCategory}>
                      {getLocalizedCategoryName(item.category, language)}
                    </Text>
                    <Text style={styles.articleTitle} numberOfLines={2}>
                      {stripCDATA(item.title)}
                    </Text>
                    <Text style={styles.articleTime}>
                      {formatLocalizedRelativeTime(item.publishedAt, language)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="sparkles-outline" size={40} color={tokens.brand.primary} />
            </View>
            <Text style={styles.emptyText}>
              {language === 'bn' ? 'ব্যক্তিগতকৃত সুপারিশ প্রস্তুত হচ্ছে' : 'Personalizing your recommendations'}
            </Text>
            <Text style={styles.emptySubtext}>
              {language === 'bn'
                ? 'আপনার পাঠাভ্যাস ও আগ্রহের বিষয়গুলো বিশ্লেষণ করে সেরা সংবাদগুলো এখানে স্বয়ংক্রিয়ভাবে সাজানো হবে।'
                : 'Articles matching your reading topics and interests will appear here automatically.'}
            </Text>
          </View>
        )
      )}
    </View>
  );
}
