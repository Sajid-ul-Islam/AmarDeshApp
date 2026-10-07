import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemedStyles, useThemeTokens } from '../theme';
import { toBengaliNumeral } from '../utils/bengali';

interface ArticleReactionsProps {
  articleId: string;
}

interface ReactionItem {
  id: string;
  emoji: string;
  label: string;
  defaultCount: number;
}

const REACTIONS: ReactionItem[] = [
  { id: 'love', emoji: '❤️', label: 'পছন্দ', defaultCount: 42 },
  { id: 'important', emoji: '👍', label: 'গুরুত্বপূর্ণ', defaultCount: 88 },
  { id: 'insightful', emoji: '💡', label: 'তথ্যবহুল', defaultCount: 29 },
  { id: 'sad', emoji: '😢', label: 'দুঃখজনক', defaultCount: 15 },
  { id: 'angry', emoji: '😡', label: 'ক্ষোভ', defaultCount: 23 },
];

export const ArticleReactions: React.FC<ArticleReactionsProps> = ({ articleId }) => {
  const tokens = useThemeTokens();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [userReaction, setUserReaction] = useState<string | null>(null);

  const storageKey = `@amar_desh_reactions_${articleId}`;

  useEffect(() => {
    AsyncStorage.getItem(storageKey).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setCounts(parsed.counts || {});
          setUserReaction(parsed.userReaction || null);
          return;
        } catch {}
      }
      // Initialize with default counts
      const initial: Record<string, number> = {};
      REACTIONS.forEach((r) => {
        initial[r.id] = r.defaultCount;
      });
      setCounts(initial);
    });
  }, [articleId]);

  const handleReact = async (id: string) => {
    const isAlreadySelected = userReaction === id;
    const nextUserReaction = isAlreadySelected ? null : id;

    const nextCounts = { ...counts };
    if (isAlreadySelected) {
      nextCounts[id] = Math.max(0, (nextCounts[id] || 1) - 1);
    } else {
      if (userReaction) {
        nextCounts[userReaction] = Math.max(0, (nextCounts[userReaction] || 1) - 1);
      }
      nextCounts[id] = (nextCounts[id] || 0) + 1;
    }

    setCounts(nextCounts);
    setUserReaction(nextUserReaction);

    await AsyncStorage.setItem(
      storageKey,
      JSON.stringify({
        counts: nextCounts,
        userReaction: nextUserReaction,
      })
    );
  };

  const totalReactions = Object.values(counts).reduce((a, b) => a + b, 0);

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        backgroundColor: tokens.surface.base,
        marginHorizontal: 16,
        marginVertical: 14,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      },
      title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      totalText: {
        fontSize: 12,
        color: tokens.text.secondary,
      },
      pillsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 6,
      },
      pill: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: tokens.surface.elevated,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      activePill: {
        backgroundColor: tokens.brand.surface,
        borderColor: tokens.brand.primary,
      },
      emoji: {
        fontSize: 18,
        marginBottom: 2,
      },
      countText: {
        fontSize: 11,
        fontWeight: '600',
        color: tokens.text.secondary,
      },
      activeCountText: {
        color: tokens.brand.primary,
        fontWeight: 'bold',
      },
    })
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>আপনার প্রতিক্রিয়া জানান</Text>
        <Text style={styles.totalText}>
          {toBengaliNumeral(totalReactions)} জন মতামত দিয়েছেন
        </Text>
      </View>

      <View style={styles.pillsRow}>
        {REACTIONS.map((item) => {
          const isSelected = userReaction === item.id;
          const currentCount = counts[item.id] || item.defaultCount;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.pill, isSelected && styles.activePill]}
              onPress={() => handleReact(item.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text
                style={[
                  styles.countText,
                  isSelected && styles.activeCountText,
                ]}
              >
                {toBengaliNumeral(currentCount)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
