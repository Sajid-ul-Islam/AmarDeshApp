import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
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
  const [burstEmoji, setBurstEmoji] = useState<string | null>(null);

  // Animated pop and floating burst
  const burstAnim = useRef(new Animated.Value(0)).current;
  const burstOpacity = useRef(new Animated.Value(0)).current;

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

  const triggerBurst = (emoji: string) => {
    setBurstEmoji(emoji);
    burstAnim.setValue(0);
    burstOpacity.setValue(1);

    Animated.parallel([
      Animated.timing(burstAnim, {
        toValue: -36,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(350),
        Animated.timing(burstOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => setBurstEmoji(null));
  };

  const handleReact = async (id: string, emoji: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const isAlreadySelected = userReaction === id;
    const nextUserReaction = isAlreadySelected ? null : id;

    if (!isAlreadySelected) {
      triggerBurst(emoji);
    }

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
        borderRadius: tokens.radii.lg,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      },
      titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1,
        marginRight: 8,
      },
      title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      totalText: {
        fontSize: 12,
        color: tokens.text.secondary,
        flexShrink: 0,
      },
      pillsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 6,
      },
      pillWrapper: {
        flex: 1,
        alignItems: 'center',
      },
      pill: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: tokens.radii.md,
        backgroundColor: tokens.surface.elevated,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.sm,
      },
      activePill: {
        backgroundColor: tokens.brand.surface,
        borderColor: tokens.brand.primary,
        borderWidth: 1.5,
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
      burstBubble: {
        position: 'absolute',
        top: 0,
        alignSelf: 'center',
        zIndex: 10,
        backgroundColor: tokens.brand.primary,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: tokens.radii.pill,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
      },
      burstText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold',
      },
    })
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Ionicons name="heart-circle-outline" size={17} color={tokens.brand.primary} />
          <Text style={styles.title} numberOfLines={1}>পাঠক প্রতিক্রিয়া</Text>
        </View>
        <Text style={styles.totalText} numberOfLines={1}>
          {toBengaliNumeral(totalReactions)} জনের মতামত
        </Text>
      </View>

      <View style={styles.pillsRow}>
        {REACTIONS.map((item) => {
          const isSelected = userReaction === item.id;
          const currentCount = counts[item.id] || item.defaultCount;
          const isBursting = burstEmoji === item.emoji;

          return (
            <View key={item.id} style={styles.pillWrapper}>
              {isBursting && (
                <Animated.View
                  style={[
                    styles.burstBubble,
                    {
                      transform: [{ translateY: burstAnim }],
                      opacity: burstOpacity,
                    },
                  ]}
                >
                  <Text style={styles.burstText}>+১ {item.emoji}</Text>
                </Animated.View>
              )}
              <TouchableOpacity
                style={[styles.pill, isSelected && styles.activePill]}
                onPress={() => handleReact(item.id, item.emoji)}
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
            </View>
          );
        })}
      </View>
    </View>
  );
};
