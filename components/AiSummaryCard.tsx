import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles, useThemeTokens } from '../theme';
import { Article } from '../data/mockData';
import { generateArticleSummary } from '../services/byokAiService';
import { toBengaliNumeral } from '../utils/bengali';

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

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      card: {
        backgroundColor: tokens.surface.elevated,
        borderRadius: 4,
        marginHorizontal: 16,
        marginVertical: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: tokens.border.default,
        borderLeftWidth: 3.5,
        borderLeftColor: tokens.brand.primary,
      },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: isCollapsed ? 0 : 12,
      },
      headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
      },
      iconBox: {
        width: 26,
        height: 26,
        borderRadius: 3,
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
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: tokens.border.default,
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
      refreshBtn: {
        padding: 4,
      },
      collapseBtn: {
        padding: 4,
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
        borderRadius: 11,
        backgroundColor: tokens.surface.base,
        borderWidth: 1,
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
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 107, 63, 0.15)',
      },
      askButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: tokens.surface.base,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: tokens.brand.primary,
      },
      askButtonText: {
        fontSize: 12,
        color: tokens.brand.primary,
        fontWeight: 'bold',
      },
      configLink: {
        fontSize: 11,
        color: tokens.text.secondary,
        textDecorationLine: 'underline',
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
            <Text style={styles.headerTitle}>এক নজরে ৩টি প্রধান পয়েন্ট</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {isAiGenerated ? `${providerUsed || 'AI'} বিশ্লেষিত` : 'দ্রুত সারসংক্ষেপ'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={handleRegenerate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={tokens.brand.primary} />
            ) : (
              <Ionicons name="sync-outline" size={18} color={tokens.brand.primary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.collapseBtn}
            onPress={() => setIsCollapsed(!isCollapsed)}
          >
            <Ionicons
              name={isCollapsed ? 'chevron-down' : 'chevron-up'}
              size={18}
              color={tokens.brand.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {!isCollapsed && (
        <View style={styles.body}>
          {loading && points.length === 0 ? (
            <ActivityIndicator size="small" color={tokens.brand.primary} style={{ marginVertical: 12 }} />
          ) : (
            points.map((pt, idx) => (
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
              >
                <Ionicons name="chatbubbles-outline" size={14} color={tokens.brand.primary} />
                <Text style={styles.askButtonText}>এআইকে প্রশ্ন করুন</Text>
              </TouchableOpacity>
            )}

            {!isAiGenerated && onOpenSettings && (
              <TouchableOpacity onPress={onOpenSettings}>
                <Text style={styles.configLink}>নিজস্ব এপিআই কি দিন ↗</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};
