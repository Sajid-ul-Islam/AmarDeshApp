import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles, useThemeTokens } from '../theme';
import { toBengaliNumeral } from '../utils/bengali';

export interface LastReadItem {
  id: string;
  title: string;
  category: string;
  progress: number; // 0.0 to 1.0
  updatedAt: number;
}

export const LAST_READ_KEY = '@amar_desh_last_read';

export const ContinueReadingCard: React.FC = () => {
  const router = useRouter();
  const tokens = useThemeTokens();
  const [lastRead, setLastRead] = useState<LastReadItem | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(LAST_READ_KEY).then((raw) => {
      if (raw) {
        try {
          const item = JSON.parse(raw);
          // Show if read between 10% and 90% and within last 48 hours
          if (item.progress >= 0.1 && item.progress < 0.9) {
            setLastRead(item);
          }
        } catch {}
      }
    });
  }, []);

  if (!lastRead) return null;

  const percent = Math.round(lastRead.progress * 100);

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        backgroundColor: tokens.surface.base,
        marginHorizontal: 16,
        marginBottom: 14,
        borderRadius: tokens.radii.lg,
        padding: 14,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
      },
      titleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      },
      headerText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: tokens.brand.primary,
        textTransform: 'uppercase',
      },
      percentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: tokens.brand.surface,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: tokens.radii.pill,
      },
      percentText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: tokens.brand.primary,
      },
      articleTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: tokens.text.primary,
        lineHeight: 19,
        marginBottom: 10,
      },
      progressTrack: {
        height: 5,
        backgroundColor: tokens.surface.elevated,
        borderRadius: tokens.radii.pill,
        overflow: 'hidden',
        marginBottom: 8,
      },
      progressFill: {
        height: '100%',
        backgroundColor: tokens.brand.primary,
        borderRadius: tokens.radii.pill,
      },
      footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      catText: {
        fontSize: 11,
        color: tokens.text.secondary,
      },
      resumeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      },
      resumeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: tokens.brand.primary,
      },
    })
  );

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/article/${lastRead.id}` as any)}
      activeOpacity={0.8}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleLeft}>
          <Ionicons name="time-outline" size={14} color={tokens.brand.primary} />
          <Text style={styles.headerText}>চালিয়ে যান</Text>
        </View>
        <View style={styles.percentBadge}>
          <Ionicons name="bookmark" size={10} color={tokens.brand.primary} />
          <Text style={styles.percentText}>
            {toBengaliNumeral(percent)}%
          </Text>
        </View>
      </View>

      <Text style={styles.articleTitle} numberOfLines={2}>
        {lastRead.title}
      </Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent}%` }]} />
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.catText}>{lastRead.category}</Text>
        <View style={styles.resumeRow}>
          <Text style={styles.resumeText}>পড়ুন</Text>
          <Ionicons name="arrow-forward" size={13} color={tokens.brand.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
