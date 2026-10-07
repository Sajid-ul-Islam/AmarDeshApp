import React, { useState, useEffect, useSyncExternalStore } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
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
import { useThemedStyles } from '../../theme';
import { ArticleThumbnail, ArticleHeroImage } from '../../components/OptimizedImage';
import { useUserStore, trackCategoryViewed } from '../../user';
import ReadingStreak from '../../components/ReadingStreak';
import { BreakingNewsTicker } from '../../components/BreakingNewsTicker';
import { PrayerTimesWidget } from '../../components/PrayerTimesWidget';
import { DistrictPickerModal } from '../../components/DistrictPickerModal';
import { ContinueReadingCard } from '../../components/ContinueReadingCard';
import {
  getPrayerTimesForDivision,
  PrayerTimeData,
} from '../../services/prayerTimesService';
import {
  SITE_CATEGORIES,
  getArticlesByCategory,
} from '../../services/contentService';
import {
  getSelectedDivision,
  saveSelectedDivision,
} from '../../services/districtService';
import {
  getUnreadNotificationCount,
  subscribeToInbox,
} from '../../services/notificationInboxService';
import { toBengaliNumeral } from '../../utils/bengali';
import { AdBanner } from '../../components/AdBanner';
import { useAppStore } from '../../store/useAppStore';
import {
  t,
  getLocalizedCategoryName,
  formatLocalizedNumeral,
  formatLocalizedRelativeTime,
} from '../../services/i18n';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('সর্বশেষ');
  const [selectedDivision, setSelectedDivision] = useState('ঢাকা');
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const [prayerData, setPrayerData] = useState<PrayerTimeData>(
    getPrayerTimesForDivision('ঢাকা')
  );

  // Live news from dailyamardesh.com shared store
  const liveArticles = useSyncExternalStore(subscribeToArticles, getArticles);
  const baseArticles: Article[] =
    liveArticles.length > 0 ? liveArticles : mockArticles;

  const [displayArticles, setDisplayArticles] = useState<Article[]>(baseArticles);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const isUserReady = useUserStore((state) => state.isInitialized);
  const getPersonalizedFeed = useUserStore((state) => state.getPersonalizedFeed);

  // Load saved division on mount
  useEffect(() => {
    getSelectedDivision().then(setSelectedDivision);
  }, []);

  // Update prayer times when division changes
  useEffect(() => {
    setPrayerData(getPrayerTimesForDivision(selectedDivision));
  }, [selectedDivision]);

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
      topDateBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: insets.top > 0 ? insets.top + 4 : 8,
        paddingBottom: 6,
        backgroundColor: tokens.surface.elevated,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
      },
      dateText: {
        fontSize: 12,
        color: tokens.text.secondary,
        fontWeight: '500',
      },
      divisionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      },
      divisionBadgeText: {
        fontSize: 12,
        color: tokens.brand.primary,
        fontWeight: '600',
      },
      langPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 10,
        backgroundColor: tokens.brand.surface,
        borderWidth: 1,
        borderColor: tokens.brand.primary,
      },
      langPillText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: tokens.brand.primary,
      },
      mainHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
      },
      logoArea: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      },
      logoBadge: {
        backgroundColor: '#DC2626',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        elevation: 2,
        shadowColor: '#DC2626',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      logoBadgeText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 0.5,
      },
      mottoCol: {
        justifyContent: 'center',
      },
      appName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tokens.text.primary,
        letterSpacing: -0.3,
      },
      appSlogan: {
        fontSize: 11,
        color: tokens.text.secondary,
        fontWeight: '500',
        marginTop: 1,
      },
      headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      },
      iconBtn: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: tokens.surface.elevated,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      notifBadge: {
        position: 'absolute',
        top: -3,
        right: -3,
        backgroundColor: '#DC2626',
        borderRadius: 9,
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
        paddingHorizontal: 12,
        paddingVertical: 9,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
      },
      catChip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: tokens.surface.elevated,
        marginRight: 8,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      specialCatChip: {
        backgroundColor: tokens.brand.crimsonSurface,
        borderColor: '#FCA5A5',
      },
      activeCatChip: {
        backgroundColor: tokens.brand.primary,
        borderColor: tokens.brand.primary,
      },
      activeSpecialCatChip: {
        backgroundColor: '#DC2626',
        borderColor: '#DC2626',
      },
      catChipText: {
        fontSize: 13,
        color: tokens.text.secondary,
        fontWeight: '500',
      },
      specialCatChipText: {
        color: '#DC2626',
        fontWeight: 'bold',
      },
      activeCatChipText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
      listContent: {
        padding: 16,
        paddingBottom: 40,
      },
      heroCard: {
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: tokens.surface.base,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: tokens.border.default,
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
        backgroundColor: 'rgba(15, 23, 42, 0.78)',
      },
      heroBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
      },
      heroCategory: {
        color: '#4ADE80',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
      },
      heroTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 25,
        marginBottom: 6,
      },
      heroTime: {
        color: '#E2E8F0',
        fontSize: 11.5,
      },
      spotlightBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: tokens.brand.crimsonSurface,
        borderLeftWidth: 4,
        borderLeftColor: '#DC2626',
        padding: 14,
        borderRadius: 10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      spotlightTitle: {
        fontSize: 14.5,
        fontWeight: 'bold',
        color: '#DC2626',
      },
      spotlightSub: {
        fontSize: 11.5,
        color: tokens.text.secondary,
        marginTop: 3,
      },
      articleCard: {
        flexDirection: 'row',
        backgroundColor: tokens.surface.base,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
        padding: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: tokens.border.default,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      articleContent: {
        flex: 1,
        justifyContent: 'space-between',
      },
      articleCategory: {
        fontSize: 11.5,
        color: tokens.brand.primary,
        fontWeight: '700',
        marginBottom: 4,
      },
      articleTitle: {
        fontSize: 14.5,
        fontWeight: 'bold',
        color: tokens.text.primary,
        lineHeight: 21,
        marginBottom: 4,
      },
      articleTime: {
        fontSize: 11,
        color: tokens.text.tertiary,
      },
      articleImage: {
        width: 105,
        height: 75,
        borderRadius: 8,
      },
    })
  );

  const renderHeader = () => (
    <View>
      {/* Continue Reading Shelf (if last read exists) */}
      <ContinueReadingCard />

      {/* Breaking News Marquee */}
      {breakingHeadlines.length > 0 && (
        <BreakingNewsTicker headlines={breakingHeadlines} />
      )}

      {/* Prayer Times Widget */}
      <PrayerTimesWidget
        prayerData={prayerData}
        onChangeDivision={() => setShowDistrictModal(true)}
      />

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
          <Ionicons name="arrow-forward" size={18} color="#DC2626" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderArticle = ({ item, index }: { item: Article; index: number }) => {
    if (index === 0) {
      return (
        <TouchableOpacity
          style={styles.heroCard}
          onPress={() => router.push(`/article/${item.id}` as any)}
          activeOpacity={0.85}
        >
          <ArticleHeroImage uri={item.imageUrl} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            <View style={styles.heroBadgeRow}>
              <Text style={styles.heroCategory}>
                {getLocalizedCategoryName(item.category, language)}
              </Text>
            </View>
            <Text style={styles.heroTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.heroTime}>
              {formatLocalizedRelativeTime(item.publishedAt, language)} • {item.author}
            </Text>
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
              {item.title}
            </Text>
            <Text style={styles.articleTime}>
              {formatLocalizedRelativeTime(item.publishedAt, language)}
            </Text>
          </View>
          <ArticleThumbnail uri={item.imageUrl} style={styles.articleImage} />
        </TouchableOpacity>
        {index === 2 && <AdBanner variant="feed" />}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Date & Weather Bar with Language Switcher */}
      <View style={styles.topDateBar}>
        <Text style={styles.dateText}>
          {language === 'bn'
            ? 'বুধবার, ০৭ অক্টোবর ২০২৬ • ঢাকা ২৮° সে. ⛅'
            : 'Wednesday, Oct 7, 2026 • Dhaka 28° C ⛅'}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            style={styles.langPill}
            onPress={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            activeOpacity={0.7}
          >
            <Ionicons name="globe-outline" size={11} color={styles.divisionBadgeText.color} />
            <Text style={styles.langPillText}>
              {language === 'bn' ? 'বাংলা' : 'EN'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.divisionBadge}
            onPress={() => setShowDistrictModal(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="location-sharp" size={12} color={styles.divisionBadgeText.color} />
            <Text style={styles.divisionBadgeText}>
              {selectedDivision} {t('edition_label', language)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Header */}
      <View style={styles.mainHeader}>
        <View style={styles.logoArea}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>আমার দেশ</Text>
          </View>
          <View style={styles.mottoCol}>
            <Text style={styles.appName}>{t('app_name', language)}</Text>
            <Text style={styles.appSlogan}>{t('app_motto', language)}</Text>
          </View>
        </View>

        <View style={styles.headerIcons}>
          {/* AI Settings / BYOK shortcut */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/settings/ai' as any)}
            activeOpacity={0.7}
          >
            <Ionicons name="sparkles" size={17} color="#006B3F" />
          </TouchableOpacity>

          {/* Notification Center */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/notifications' as any)}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={18} color={styles.appName.color} />
            {unreadNotifCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>
                  {unreadNotifCount > 9 ? '৯+' : formatLocalizedNumeral(unreadNotifCount, language)}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Search */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/search' as any)}
            activeOpacity={0.7}
          >
            <Ionicons name="search" size={18} color={styles.appName.color} />
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

      {/* District / Division Selector Modal */}
      <DistrictPickerModal
        visible={showDistrictModal}
        selectedDivision={selectedDivision}
        onSelectDivision={(div) => {
          setSelectedDivision(div);
          saveSelectedDivision(div);
        }}
        onClose={() => setShowDistrictModal(false)}
      />
    </View>
  );
}
