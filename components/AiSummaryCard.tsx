import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemedStyles, useThemeTokens } from '../theme';
import { Article } from '../data/mockData';
import { generateArticleSummary } from '../services/byokAiService';
import { toBengaliNumeral } from '../utils/bengali';

export type SummaryTone = 'executive' | 'simplified' | 'analysis';

interface AiSummaryCardProps {
  article: Article;
  fullText?: string;
  onOpenAssistant?: () => void;
  onOpenSettings?: () => void;
}

export const AiSummaryCard: React.FC<AiSummaryCardProps> = ({
  article,
  fullText,
  onOpenAssistant,
  onOpenSettings,
}) => {
  const tokens = useThemeTokens();
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState<string[]>([]);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [providerUsed, setProviderUsed] = useState<string | undefined>();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tone, setTone] = useState<SummaryTone>('executive');

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    generateArticleSummary(article, fullText)
      .then((res) => {
        if (!mounted) return;
        setPoints(res.points);
        setIsAiGenerated(res.isAiGenerated);
        setProviderUsed(res.providerUsed);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [article.id, fullText]);

  const handleRegenerate = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);
    try {
      const res = await generateArticleSummary(article, fullText);
      setPoints(res.points);
      setIsAiGenerated(res.isAiGenerated);
      setProviderUsed(res.providerUsed);
    } finally {
      setLoading(false);
    }
  };

  const handleToneChange = (newTone: SummaryTone) => {
    Haptics.selectionAsync();
    setTone(newTone);
  };

  // Format points based on selected tone
  const getDisplayedPoints = () => {
    if (points.length === 0) return [];
    if (tone === 'simplified') {
      return points.map((p) => {
        // Provide simplified conversational Bengali prefix/context
        return p.replace(/^(তবে|অতএব|সুতরাং|পরবর্তীতে)\s*/, '');
      });
    }
    if (tone === 'analysis') {
      return [
        `কৌশলগত প্রভাব: ${points[0] || 'অর্থনৈতিক ও সামাজিক প্রভাব বিস্তৃত হচ্ছে।'}`,
        `নীতিগত দিক: ${points[1] || 'সংশ্লিষ্ট কর্তৃপক্ষ সংস্কার রূপরেখা বাস্তবায়ন করছে।'}`,
        `ভবিষ্যত ফলাফল: ${points[2] || 'আগামী মাসগুলোতে এর সুদূরপ্রসারী পরিবর্তন দৃশ্যমান হবে।'}`,
      ];
    }
    return points;
  };

  const displayedPoints = getDisplayedPoints();

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      card: {
        backgroundColor: tokens.surface.elevated,
        borderRadius: tokens.radii.lg,
        marginHorizontal: 16,
        marginVertical: 14,
        padding: 14,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        borderLeftWidth: 3.5,
        borderLeftColor: tokens.brand.primary,
        ...tokens.shadows.card,
      },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: isCollapsed ? 0 : 10,
      },
      headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
      },
      iconBox: {
        width: 28,
        height: 28,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.primary,
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: tokens.text.primary,
        letterSpacing: -0.2,
      },
      badge: {
        backgroundColor: tokens.surface.base,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: tokens.radii.pill,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
      },
      badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: tokens.brand.primary,
      },
      controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      },
      iconBtn: {
        width: 30,
        height: 30,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.base,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
      },
      toneBarRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 12,
        paddingTop: 4,
      },
      tonePill: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.base,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
      },
      activeTonePill: {
        backgroundColor: tokens.brand.primary,
        borderColor: tokens.brand.primary,
      },
      tonePillText: {
        fontSize: 11,
        color: tokens.text.secondary,
        fontWeight: '500',
      },
      activeTonePillText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
      body: {
        gap: 10,
      },
      pointRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
      },
      pointNumCircle: {
        width: 22,
        height: 22,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.base,
        borderWidth: 0.5,
        borderColor: tokens.brand.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
      },
      pointNumText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: tokens.brand.primary,
      },
      pointText: {
        flex: 1,
        fontSize: 14,
        color: tokens.text.primary,
        lineHeight: 20,
      },
      footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 0.5,
        borderTopColor: 'rgba(0, 107, 63, 0.15)',
      },
      askButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: tokens.surface.base,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: tokens.radii.pill,
        borderWidth: 0.5,
        borderColor: tokens.brand.primary,
        ...tokens.shadows.sm,
      },
      askButtonText: {
        fontSize: 12,
        color: tokens.brand.primary,
        fontWeight: 'bold',
      },
      configLink: {
        fontSize: 11.5,
        color: tokens.text.secondary,
        fontWeight: '500',
      },
    })
  );

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => setIsCollapsed(!isCollapsed)}
          activeOpacity={0.8}
        >
          <View style={styles.iconBox}>
            <Ionicons name="sparkles" size={16} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.headerTitle}>স্মার্ট সারাংশ ও মূল পয়েন্ট</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {isAiGenerated ? `${providerUsed || 'AI'} বিশ্লেষিত` : 'দ্রুত সারসংক্ষেপ'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={handleRegenerate}
            disabled={loading}
            accessibilityLabel="রিলোড"
          >
            {loading ? (
              <ActivityIndicator size="small" color={tokens.brand.primary} />
            ) : (
              <Ionicons name="sync-outline" size={16} color={tokens.brand.primary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setIsCollapsed(!isCollapsed)}
            accessibilityLabel={isCollapsed ? 'প্রসারিত করুন' : 'সংকুচিত করুন'}
          >
            <Ionicons
              name={isCollapsed ? 'chevron-down' : 'chevron-up'}
              size={16}
              color={tokens.brand.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {!isCollapsed && (
        <View style={styles.body}>
          {/* Tone Selector Pill Row */}
          <View style={styles.toneBarRow}>
            {[
              { id: 'executive' as const, label: '📋 মূল পয়েন্ট' },
              { id: 'simplified' as const, label: '💡 সহজ ভাষায়' },
              { id: 'analysis' as const, label: '🔍 প্রেক্ষাপট' },
            ].map((t) => {
              const isActive = tone === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.tonePill, isActive && styles.activeTonePill]}
                  onPress={() => handleToneChange(t.id)}
                >
                  <Text
                    style={[
                      styles.tonePillText,
                      isActive && styles.activeTonePillText,
                    ]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {loading && displayedPoints.length === 0 ? (
            <ActivityIndicator size="small" color={tokens.brand.primary} style={{ marginVertical: 12 }} />
          ) : (
            displayedPoints.map((pt, idx) => (
              <View key={idx} style={styles.pointRow}>
                <View style={styles.pointNumCircle}>
                  <Text style={styles.pointNumText}>
                    {toBengaliNumeral(idx + 1)}
                  </Text>
                </View>
                <Text style={styles.pointText}>{pt}</Text>
              </View>
            ))
          )}

          <View style={styles.footerRow}>
            {onOpenAssistant && (
              <TouchableOpacity
                style={styles.askButton}
                onPress={onOpenAssistant}
                accessibilityLabel="প্রশ্ন করুন"
              >
                <Ionicons name="chatbubbles-outline" size={14} color={tokens.brand.primary} />
                <Text style={styles.askButtonText}>প্রশ্ন করুন</Text>
              </TouchableOpacity>
            )}

            {!isAiGenerated && onOpenSettings && (
              <TouchableOpacity
                onPress={onOpenSettings}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                activeOpacity={0.7}
                accessibilityLabel="API কি"
              >
                <Ionicons name="key-outline" size={14} color={tokens.brand.primary} />
                <Text style={styles.configLink}>API কি ↗</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};
