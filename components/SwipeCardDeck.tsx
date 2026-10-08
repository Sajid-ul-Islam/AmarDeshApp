import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
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

interface SwipeCardDeckProps {
  articles: Article[];
  language?: 'bn' | 'en';
  onPressArticle: (article: Article) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = Math.min(SCREEN_HEIGHT * 0.62, 540);

export const SwipeCardDeck: React.FC<SwipeCardDeckProps> = ({
  articles,
  language = 'bn',
  onPressArticle,
}) => {
  const tokens = useThemeTokens();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!articles || articles.length === 0) {
    return (
      <View style={stylesStatic.emptyContainer}>
        <Text style={stylesStatic.emptyText}>
          {language === 'bn' ? 'কোনো সংবাদ পাওয়া যায়নি' : 'No articles available'}
        </Text>
      </View>
    );
  }

  const currentArticle = articles[currentIndex] || articles[0];
  const total = articles.length;

  const handleNext = () => {
    if (currentIndex < total - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 32,
      },
      topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      },
      deckTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      },
      deckTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: tokens.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      },
      progressPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.surface,
        borderWidth: 0.5,
        borderColor: tokens.brand.primary,
      },
      progressText: {
        fontSize: 12,
        fontWeight: '700',
        color: tokens.brand.primary,
      },
      card: {
        height: CARD_HEIGHT,
        borderRadius: tokens.radii['2xl'],
        backgroundColor: tokens.surface.elevated,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.lg,
      },
      imageContainer: {
        height: '46%',
        width: '100%',
        backgroundColor: tokens.surface.subtle,
      },
      cardImage: {
        width: '100%',
        height: '100%',
      },
      imageGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.25)',
      },
      badgeRow: {
        position: 'absolute',
        top: 14,
        left: 14,
        right: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      categoryBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.primary,
      },
      categoryText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
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
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
        backgroundColor: tokens.surface.base,
      },
      title: {
        fontSize: 18,
        fontWeight: '700',
        color: tokens.text.primary,
        lineHeight: 25,
        letterSpacing: -0.3,
        marginBottom: 8,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      },
      excerpt: {
        fontSize: 13.5,
        color: tokens.text.secondary,
        lineHeight: 20,
        marginBottom: 10,
      },
      metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
      },
      metaText: {
        fontSize: 11.5,
        color: tokens.text.tertiary,
        fontWeight: '500',
      },
      readButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        borderRadius: tokens.radii.lg,
        backgroundColor: tokens.brand.primary,
        ...tokens.shadows.sm,
      },
      readButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
      },
      controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingHorizontal: 8,
      },
      navBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
      },
      navBtnDisabled: {
        opacity: 0.4,
      },
      navBtnText: {
        fontSize: 13,
        fontWeight: '600',
        color: tokens.text.primary,
      },
    })
  );

  return (
    <View style={styles.container}>
      {/* Top Deck Info Bar */}
      <View style={styles.topBar}>
        <View style={styles.deckTitleRow}>
          <Ionicons name="albums-outline" size={16} color={tokens.brand.primary} />
          <Text style={styles.deckTitle}>
            {language === 'bn' ? 'কার্ড স্লাইড ফিড' : 'Card Slide Feed'}
          </Text>
        </View>

        <View style={styles.progressPill}>
          <Text style={styles.progressText}>
            {formatLocalizedNumeral(currentIndex + 1, language)} /{' '}
            {formatLocalizedNumeral(total, language)}
          </Text>
        </View>
      </View>

      {/* Main Slide Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPressArticle(currentArticle)}
        activeOpacity={0.92}
        accessibilityRole="button"
        accessibilityLabel={stripCDATA(currentArticle.title)}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: currentArticle.imageUrl }}
            style={styles.cardImage}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.imageGradient} />

          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {getLocalizedCategoryName(currentArticle.category, language)}
              </Text>
            </View>

            {Boolean(currentArticle.isBreaking) && (
              <View style={styles.breakingBadge}>
                <Ionicons name="flash" size={11} color="#FFFFFF" />
                <Text style={styles.breakingText}>
                  {language === 'bn' ? 'ব্রেকিং' : 'BREAKING'}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.cardBody}>
          <View>
            <Text style={styles.title} numberOfLines={3}>
              {stripCDATA(currentArticle.title)}
            </Text>

            {currentArticle.excerpt ? (
              <Text style={styles.excerpt} numberOfLines={3}>
                {currentArticle.excerpt}
              </Text>
            ) : null}

            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={12} color={tokens.text.tertiary} />
              <Text style={styles.metaText}>
                {formatLocalizedRelativeTime(currentArticle.publishedAt, language)}
              </Text>
              {currentArticle.author ? (
                <>
                  <Text style={styles.metaText}>•</Text>
                  <Text style={styles.metaText}>{currentArticle.author}</Text>
                </>
              ) : null}
            </View>
          </View>

          <TouchableOpacity
            style={styles.readButton}
            onPress={() => onPressArticle(currentArticle)}
            activeOpacity={0.8}
          >
            <Text style={styles.readButtonText}>
              {language === 'bn' ? 'সম্পূর্ণ পড়ুন' : 'Read Full Story'}
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Bottom Prev / Next Nav Buttons */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
          onPress={handlePrev}
          disabled={currentIndex === 0}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={16} color={tokens.text.primary} />
          <Text style={styles.navBtnText}>
            {language === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, currentIndex === total - 1 && styles.navBtnDisabled]}
          onPress={handleNext}
          disabled={currentIndex === total - 1}
          activeOpacity={0.7}
        >
          <Text style={styles.navBtnText}>
            {language === 'bn' ? 'পরবর্তী' : 'Next'}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={tokens.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const stylesStatic = StyleSheet.create({
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
  },
});
