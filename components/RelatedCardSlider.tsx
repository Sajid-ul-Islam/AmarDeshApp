import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles, useThemeTokens } from '../theme';
import type { Article } from '../types';
import { stripCDATA } from '../services/rssService';
import {
  getLocalizedCategoryName,
  formatLocalizedRelativeTime,
} from '../services/i18n';

interface RelatedCardSliderProps {
  articles: Article[];
  language?: 'bn' | 'en';
  onPressArticle: (article: Article) => void;
}

const CARD_WIDTH = 220;
const CARD_HEIGHT = 210;

export const RelatedCardSlider: React.FC<RelatedCardSliderProps> = ({
  articles,
  language = 'bn',
  onPressArticle,
}) => {
  const tokens = useThemeTokens();

  if (!articles || articles.length === 0) {
    return null;
  }

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        marginTop: 18,
        marginBottom: 24,
      },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 12,
      },
      headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      },
      headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: tokens.text.primary,
        letterSpacing: -0.2,
      },
      scrollContent: {
        paddingHorizontal: 16,
        gap: 12,
      },
      card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: tokens.radii.lg,
        backgroundColor: tokens.surface.elevated,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        overflow: 'hidden',
        ...tokens.shadows.sm,
      },
      imageContainer: {
        width: '100%',
        height: 110,
        backgroundColor: tokens.surface.subtle,
      },
      thumbnail: {
        width: '100%',
        height: '100%',
      },
      categoryBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: tokens.radii.pill,
        backgroundColor: 'rgba(0, 107, 63, 0.9)',
      },
      categoryText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
      },
      body: {
        padding: 10,
        flex: 1,
        justifyContent: 'space-between',
      },
      title: {
        fontSize: 13.5,
        fontWeight: '700',
        color: tokens.text.primary,
        lineHeight: 18,
        letterSpacing: -0.2,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      },
      metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
      },
      metaText: {
        fontSize: 11,
        color: tokens.text.tertiary,
        fontWeight: '500',
      },
    })
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="documents-outline" size={17} color={tokens.brand.primary} />
          <Text style={styles.headerTitle}>
            {language === 'bn' ? 'সম্পর্কিত সংবাদ' : 'Related Stories'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={tokens.text.tertiary} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 12}
        contentContainerStyle={styles.scrollContent}
      >
        {articles.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => onPressArticle(item)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={stripCDATA(item.title)}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.thumbnail}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {getLocalizedCategoryName(item.category, language)}
                </Text>
              </View>
            </View>

            <View style={styles.body}>
              <Text style={styles.title} numberOfLines={2}>
                {stripCDATA(item.title)}
              </Text>

              <View style={styles.metaRow}>
                <Ionicons name="time-outline" size={11} color={tokens.text.tertiary} />
                <Text style={styles.metaText}>
                  {formatLocalizedRelativeTime(item.publishedAt, language)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
