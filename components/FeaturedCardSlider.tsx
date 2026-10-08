import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemedStyles, useThemeTokens } from '../theme';
import { Article } from '../data/mockData';
import { stripCDATA } from '../services/rssService';
import {
  getLocalizedCategoryName,
  formatLocalizedRelativeTime,
  formatLocalizedNumeral,
} from '../services/i18n';

interface FeaturedCardSliderProps {
  articles: Article[];
  language?: 'bn' | 'en';
  onPressArticle: (article: Article) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 44, 380);
const CARD_SPACING = 14;

export const FeaturedCardSlider: React.FC<FeaturedCardSliderProps> = ({
  articles,
  language = 'bn',
  onPressArticle,
}) => {
  const tokens = useThemeTokens();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  if (!articles || articles.length === 0) {
    return null;
  }

  // Display top 5 featured items for focused sliding experience
  const displayArticles = articles.slice(0, 5);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_SPACING));
    if (index >= 0 && index < displayArticles.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const scrollToIndex = (index: number) => {
    Haptics.selectionAsync();
    scrollRef.current?.scrollTo({
      x: index * (CARD_WIDTH + CARD_SPACING),
      animated: true,
    });
    setActiveIndex(index);
  };

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        marginBottom: 20,
      },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 10,
      },
      headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      },
      headerTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: tokens.text.primary,
        letterSpacing: -0.2,
      },
      counterBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.crimsonSurface,
        borderWidth: 0.5,
        borderColor: tokens.brand.primary,
      },
      counterText: {
        fontSize: 11,
        fontWeight: '700',
        color: tokens.brand.primary,
      },
      scrollContent: {
        paddingHorizontal: 16,
        gap: CARD_SPACING,
      },
      card: {
        width: CARD_WIDTH,
        height: 270,
        borderRadius: tokens.radii.xl,
        overflow: 'hidden',
        backgroundColor: tokens.surface.elevated,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      cardImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
      },
      vignetteBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 180,
        backgroundColor: 'rgba(5, 10, 8, 0.75)',
      },
      cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
      },
      categoryBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.primary,
      },
      categoryText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
      },
      breakingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: tokens.radii.pill,
        backgroundColor: '#DC2626',
      },
      breakingText: {
        color: '#FFFFFF',
        fontSize: 10.5,
        fontWeight: 'bold',
      },
      cardBody: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
      },
      title: {
        color: '#FFFFFF',
        fontSize: 18.5,
        fontWeight: '700',
        lineHeight: 25,
        letterSpacing: -0.3,
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.7)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      },
      metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      },
      metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      },
      metaText: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 11.5,
        fontWeight: '500',
      },
      metaDot: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 10,
      },
      paginationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 12,
      },
      dot: {
        height: 5,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.border.strong,
      },
      activeDot: {
        width: 22,
        backgroundColor: tokens.brand.primary,
      },
      inactiveDot: {
        width: 6,
      },
    })
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="sparkles" size={15} color={tokens.brand.primary} />
          <Text style={styles.headerTitle}>
            {language === 'bn' ? 'শীর্ষ গুরুত্বপূর্ণ খবর' : 'Top Featured Stories'}
          </Text>
        </View>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {formatLocalizedNumeral(activeIndex + 1, language)} /{' '}
            {formatLocalizedNumeral(displayArticles.length, language)}
          </Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        snapToAlignment="start"
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={32}
      >
        {displayArticles.map((article, idx) => {
          const isBreaking = Boolean(article.isBreaking || idx === 0);
          return (
            <TouchableOpacity
              key={article.id}
              style={styles.card}
              onPress={() => onPressArticle(article)}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel={stripCDATA(article.title)}
            >
              <Image
                source={{ uri: article.imageUrl }}
                style={styles.cardImage}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.gradientOverlay} />
              <View style={styles.vignetteBottom} />

              {/* Card Top Row: Category + Breaking Badge */}
              <View style={styles.cardTopRow}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>
                    {getLocalizedCategoryName(article.category, language)}
                  </Text>
                </View>

                {isBreaking && (
                  <View style={styles.breakingBadge}>
                    <Ionicons name="flash" size={10} color="#FFFFFF" />
                    <Text style={styles.breakingText}>
                      {language === 'bn' ? 'ব্রেকিং' : 'BREAKING'}
                    </Text>
                  </View>
                )}
              </View>

              {/* Card Bottom Body */}
              <View style={styles.cardBody}>
                <Text style={styles.title} numberOfLines={2}>
                  {stripCDATA(article.title)}
                </Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.85)" />
                    <Text style={styles.metaText}>
                      {formatLocalizedRelativeTime(article.publishedAt, language)}
                    </Text>
                  </View>

                  {article.author ? (
                    <>
                      <Text style={styles.metaDot}>•</Text>
                      <View style={styles.metaItem}>
                        <Ionicons name="person-outline" size={11} color="rgba(255,255,255,0.85)" />
                        <Text style={styles.metaText} numberOfLines={1}>
                          {article.author}
                        </Text>
                      </View>
                    </>
                  ) : null}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Slide Pagination Indicator Dots */}
      <View style={styles.paginationRow}>
        {displayArticles.map((_, dotIdx) => (
          <TouchableOpacity
            key={dotIdx}
            onPress={() => scrollToIndex(dotIdx)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          >
            <View
              style={[
                styles.dot,
                dotIdx === activeIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
