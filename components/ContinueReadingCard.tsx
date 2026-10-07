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
        borderRadius: 4,
        padding: 14,
        borderWidth: 1,
        borderColor: tokens.border.default,
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
      percentText: {
        fontSize: 12,
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
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 8,
      },
      progressFill: {
        height: '100%',
        backgroundColor: tokens.brand.primary,
        borderRadius: 3,
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
          <Text style={styles.headerText}>পড়া চালিয়ে যান</Text>
        </View>
        <Text style={styles.percentText}>
          {toBengaliNumeral(percent)}% পড়া হয়েছে
        </Text>
      </View>

      <Text style={styles.articleTitle} numberOfLines={2}>
        {lastRead.title}
      </Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent}%` }]} />
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.catText}>{lastRead.category}</Text>
        <Text style={styles.resumeText}>পড়ুন →</Text>
      </View>
    </TouchableOpacity>
  );
};
