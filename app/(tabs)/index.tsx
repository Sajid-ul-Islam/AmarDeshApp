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

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('সর্বশেষ');
  const [selectedDivision, setSelectedDivision] = useState('ঢাকা');
  const [showDistrictModal, setShowDistrictModal] = useState(false);
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
        gap: 8,
      },
      logoBadge: {
        backgroundColor: tokens.brand.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 4,
      },
      logoBadgeText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
      },
      mottoCol: {
        justifyContent: 'center',
      },
      appName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      appSlogan: {
        fontSize: 10,
        color: tokens.text.secondary,
        marginTop: 1,
      },
      headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      },
      iconBtn: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: tokens.surface.elevated,
      },
      categoryScroll: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
      },
      catChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 18,
        backgroundColor: tokens.surface.elevated,
        marginRight: 8,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      specialCatChip: {
        backgroundColor: '#FEF2F2',
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
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: tokens.surface.base,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
      },
      heroBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
      },
      heroCategory: {
        color: tokens.brand.accent,
        fontSize: 12,
        fontWeight: '600',
      },
      heroTitle: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold',
        lineHeight: 24,
        marginBottom: 6,
      },
      heroTime: {
        color: '#D1D5DB',
        fontSize: 11,
      },
      spotlightBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FEF2F2',
        borderLeftWidth: 4,
        borderLeftColor: '#DC2626',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
      },
      spotlightTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#991B1B',
      },
      spotlightSub: {
        fontSize: 11,
        color: '#B91C1C',
        marginTop: 2,
      },
      articleCard: {
        flexDirection: 'row',
        backgroundColor: tokens.surface.base,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 12,
        padding: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      articleContent: {
        flex: 1,
        justifyContent: 'space-between',
      },
      articleCategory: {
        fontSize: 12,
        color: tokens.brand.primary,
        fontWeight: '600',
        marginBottom: 4,
      },
      articleTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: tokens.text.primary,
        lineHeight: 20,
        marginBottom: 4,
      },
      articleTime: {
        fontSize: 11,
        color: tokens.text.tertiary,
      },
      articleImage: {
        width: 105,
        height: 75,
        borderRadius: 6,
      },
    })
  );

  const renderHeader = () => (
    <View>
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
        >
          <View>
            <Text style={styles.spotlightTitle}>
              জুলাই বিপ্লব ২০২৪: বিশেষ আর্কাইভ ও প্রতিবেদন
            </Text>
            <Text style={styles.spotlightSub}>
              শহীদদের স্মৃতিকথা, গণঅভ্যুত্থানের দলিল ও নতুন বাংলাদেশ
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
          activeOpacity={0.8}
        >
          <ArticleHeroImage uri={item.imageUrl} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            <View style={styles.heroBadgeRow}>
              <Text style={styles.heroCategory}>{item.category}</Text>
            </View>
            <Text style={styles.heroTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.heroTime}>
              {formatRelativeTime(item.publishedAt)} • {item.author}
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
        <View style={styles.articleContent}>
          <Text style={styles.articleCategory}>{item.category}</Text>
          <Text style={styles.articleTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.articleTime}>
            {formatRelativeTime(item.publishedAt)}
          </Text>
        </View>
        <ArticleThumbnail uri={item.imageUrl} style={styles.articleImage} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Bengali Date Bar */}
      <View style={styles.topDateBar}>
        <Text style={styles.dateText}>বুধবার, ০৭ অক্টোবর ২০২৬</Text>
        <TouchableOpacity
          style={styles.divisionBadge}
          onPress={() => setShowDistrictModal(true)}
        >
          <Ionicons name="location-sharp" size={12} color="#006B3F" />
          <Text style={styles.divisionBadgeText}>{selectedDivision} সংস্করণ</Text>
        </TouchableOpacity>
      </View>

      {/* Main Header */}
      <View style={styles.mainHeader}>
        <View style={styles.logoArea}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>আমার দেশ</Text>
          </View>
          <View style={styles.mottoCol}>
            <Text style={styles.appName}>দৈনিক আমার দেশ</Text>
            <Text style={styles.appSlogan}>স্বাধীনতার কথা বলে</Text>
          </View>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/search' as any)}
          >
            <Ionicons name="search" size={20} color="#111827" />
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
              >
                <Text
                  style={[
                    styles.catChipText,
                    cat.isSpecial && styles.specialCatChipText,
                    isSelected && styles.activeCatChipText,
                  ]}
                >
                  {cat.name}
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
