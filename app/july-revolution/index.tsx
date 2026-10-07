import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../../theme';
import { ArticleThumbnail } from '../../components/OptimizedImage';
import { formatRelativeTime } from '../../utils/bengali';
import { CATEGORY_ARTICLES } from '../../services/contentService';
import { Article } from '../../data/mockData';
import { getSafeHeaderPaddingTop } from '../../utils/layout';
import { AmarDeshLogo } from '../../components/AmarDeshLogo';

const JULY_SUB_TABS = [
  'সকল প্রতিবেদন',
  'শহীদদের স্মৃতিকথা',
  'সংস্কার প্রস্তাবনা',
  'গণঅভ্যুত্থানের দলিল',
];

export default function JulyRevolutionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('সকল প্রতিবেদন');

  const articles: Article[] = CATEGORY_ARTICLES['july-revolution'] || [];

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: tokens.surface.subtle,
      },
      header: {
        paddingTop: getSafeHeaderPaddingTop(insets.top, 8),
        paddingHorizontal: 16,
        paddingBottom: 14,
        backgroundColor: '#7F1D1D', // Deep memorial red
      },
      headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
      },
      backBtn: {
        padding: 4,
      },
      headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      },
      headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
      },
      subHeader: {
        fontSize: 12,
        color: '#FECACA',
        marginTop: 2,
        lineHeight: 16,
      },
      tabScroll: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 0.5,
        borderBottomColor: tokens.border.subtle,
      },
      tabPill: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
        marginRight: 8,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
      },
      activeTabPill: {
        backgroundColor: '#DC2626',
        borderColor: '#DC2626',
      },
      tabText: {
        fontSize: 13,
        color: tokens.text.secondary,
      },
      activeTabText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
      listContent: {
        padding: 16,
        paddingBottom: 32,
      },
      heroCard: {
        backgroundColor: tokens.surface.base,
        borderRadius: tokens.radii.lg,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      heroBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#DC2626',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: tokens.radii.pill,
        zIndex: 2,
      },
      heroBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold',
      },
      heroImage: {
        width: '100%',
        height: 180,
      },
      heroInfo: {
        padding: 14,
      },
      heroTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: tokens.text.primary,
        lineHeight: 22,
        marginBottom: 6,
      },
      heroExcerpt: {
        fontSize: 13,
        color: tokens.text.secondary,
        lineHeight: 18,
        marginBottom: 8,
      },
      heroMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      metaAuthor: {
        fontSize: 11,
        color: tokens.brand.secondary,
        fontWeight: '600',
      },
      metaTime: {
        fontSize: 11,
        color: tokens.text.tertiary,
      },
      regularCard: {
        flexDirection: 'row',
        backgroundColor: tokens.surface.base,
        borderRadius: tokens.radii.lg,
        padding: 12,
        marginBottom: 12,
        gap: 12,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      regularContent: {
        flex: 1,
        justifyContent: 'space-between',
      },
      regularTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: tokens.text.primary,
        lineHeight: 19,
        marginBottom: 4,
      },
      regularThumb: {
        width: 100,
        height: 75,
        borderRadius: tokens.radii.md,
      },
    })
  );

  return (
    <View style={styles.container}>
      {/* Memorial Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerTitleRow}>
            <Ionicons name="flame" size={20} color="#F87171" />
            <Text style={styles.headerTitle}>জুলাই বিপ্লব ২০২৪</Text>
          </View>

          <AmarDeshLogo height={20} variant="png" />
        </View>

        <Text style={styles.subHeader}>
          শহীদদের রক্তের ঋণ, ছাত্র-জনতার গণঅভ্যুত্থান ও বৈষম্যহীন নতুন বাংলাদেশ
        </Text>
      </View>

      {/* Sub Tabs */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          {JULY_SUB_TABS.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabPill, isSelected && styles.activeTabPill]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[styles.tabText, isSelected && styles.activeTabText]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Articles Stream */}
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => {
          if (index === 0) {
            return (
              <TouchableOpacity
                style={styles.heroCard}
                onPress={() => router.push(`/article/${item.id}` as any)}
                activeOpacity={0.8}
              >
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>বিশেষ প্রতিবেদন</Text>
                </View>
                <ArticleThumbnail
                  uri={item.imageUrl}
                  style={styles.heroImage}
                />
                <View style={styles.heroInfo}>
                  <Text style={styles.heroTitle}>{item.title}</Text>
                  <Text style={styles.heroExcerpt} numberOfLines={2}>
                    {item.excerpt}
                  </Text>
                  <View style={styles.heroMeta}>
                    <Text style={styles.metaAuthor}>{item.author}</Text>
                    <Text style={styles.metaTime}>
                      {formatRelativeTime(item.publishedAt)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              style={styles.regularCard}
              onPress={() => router.push(`/article/${item.id}` as any)}
              activeOpacity={0.8}
            >
              <View style={styles.regularContent}>
                <Text style={styles.regularTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.metaTime}>
                  {formatRelativeTime(item.publishedAt)} • {item.author}
                </Text>
              </View>
              <ArticleThumbnail
                uri={item.imageUrl}
                style={styles.regularThumb}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
