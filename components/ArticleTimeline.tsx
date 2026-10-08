import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemedStyles, useThemeTokens } from '../theme';

export interface TimelineMilestone {
  date: string;
  title: string;
  summary: string;
}

interface ArticleTimelineProps {
  milestones?: TimelineMilestone[];
}

const DEFAULT_MILESTONES: TimelineMilestone[] = [
  {
    date: 'জুলাই ২০২৪',
    title: 'ছাত্র-জনতার গণঅভ্যুত্থান সূচনা',
    summary: 'বৈষম্যবিরোধী ছাত্র আন্দোলনের ডাকে সারা দেশে কোটা সংস্কার ও পরবর্তীতে এক দফা গণদাবি তীব্র রূপ নেয়।',
  },
  {
    date: 'আগস্ট ২০২৪',
    title: 'স্বৈরাচারী শাসনের অবসান ও অন্তর্বর্তী সরকার',
    summary: '৫ আগস্ট ঐতিহাসিক বিজয়ের পর ড. মুহাম্মদ ইউনূসের নেতৃত্বে রাষ্ট্র সংস্কারের অন্তর্বর্তীকালীন সরকার শপথ গ্রহণ করে।',
  },
  {
    date: 'বর্তমান প্রেক্ষাপট',
    title: 'অর্থনীতি ও বিচার বিভাগীয় পুনর্বিন্যাস',
    summary: 'ব্যাংকিং খাত সংস্কার, নতুন শ্রমনীতি ও স্বাধীন বিচার বিভাগ প্রতিষ্ঠার বহুমুখী পদক্ষেপ কার্যকর হচ্ছে।',
  },
];

export const ArticleTimeline: React.FC<ArticleTimelineProps> = ({
  milestones = DEFAULT_MILESTONES,
}) => {
  const tokens = useThemeTokens();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(milestones.length - 1);

  const toggleExpand = (index: number) => {
    Haptics.selectionAsync();
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        backgroundColor: tokens.surface.subtle,
        marginHorizontal: 16,
        marginVertical: 14,
        padding: 16,
        borderRadius: tokens.radii.lg,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
      },
      headerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      timelineList: {
        paddingLeft: 4,
      },
      nodeRow: {
        flexDirection: 'row',
        gap: 12,
        position: 'relative',
      },
      trackCol: {
        alignItems: 'center',
        width: 16,
      },
      dot: {
        width: 12,
        height: 12,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.border.strong,
        marginTop: 4,
        borderWidth: 2,
        borderColor: tokens.surface.base,
      },
      activeDot: {
        backgroundColor: tokens.brand.primary,
        width: 14,
        height: 14,
        ...tokens.shadows.sm,
      },
      line: {
        flex: 1,
        width: 2,
        backgroundColor: tokens.border.default,
        marginVertical: 4,
      },
      contentCol: {
        flex: 1,
        paddingBottom: 16,
      },
      nodeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      dateBadge: {
        fontSize: 11,
        fontWeight: 'bold',
        color: tokens.brand.primary,
      },
      nodeTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: tokens.text.primary,
        marginTop: 2,
      },
      nodeSummary: {
        fontSize: 12,
        color: tokens.text.secondary,
        lineHeight: 18,
        marginTop: 6,
      },
    })
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="git-network-outline" size={18} color={tokens.brand.primary} />
        <Text style={styles.headerTitle}>ঘটনাপ্রবাহের ধারাবাহিক প্রেক্ষাপট</Text>
      </View>

      <View style={styles.timelineList}>
        {milestones.map((item, index) => {
          const isLast = index === milestones.length - 1;
          const isExpanded = expandedIndex === index;

          return (
            <TouchableOpacity
              key={`${item.date}-${index}`}
              style={styles.nodeRow}
              onPress={() => toggleExpand(index)}
              activeOpacity={0.8}
            >
              <View style={styles.trackCol}>
                <View style={[styles.dot, isLast && styles.activeDot]} />
                {!isLast && <View style={styles.line} />}
              </View>

              <View style={styles.contentCol}>
                <View style={styles.nodeHeader}>
                  <Text style={styles.dateBadge}>{item.date}</Text>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={tokens.text.secondary}
                  />
                </View>
                <Text style={styles.nodeTitle}>{item.title}</Text>
                {isExpanded && (
                  <Text style={styles.nodeSummary}>{item.summary}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
