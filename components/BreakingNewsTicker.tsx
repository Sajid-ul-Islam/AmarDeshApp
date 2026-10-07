import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../theme';

interface BreakingNewsTickerProps {
  headlines: Array<{ id: string; title: string }>;
}

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({ headlines }) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF2F2',
        borderBottomWidth: 1,
        borderBottomColor: '#FECACA',
        paddingHorizontal: 12,
        paddingVertical: 8,
      },
      badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DC2626',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        marginRight: 8,
        gap: 4,
      },
      pulseDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
      },
      badgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold',
      },
      headlineTouchable: {
        flex: 1,
      },
      headlineText: {
        fontSize: 13,
        color: '#991B1B',
        fontWeight: '600',
      },
    })
  );

  useEffect(() => {
    if (headlines.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [headlines.length]);

  if (!headlines || headlines.length === 0) return null;

  const currentStory = headlines[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <View style={styles.pulseDot} />
        <Text style={styles.badgeText}>ব্রেকিং</Text>
      </View>

      <TouchableOpacity
        style={styles.headlineTouchable}
        onPress={() => router.push(`/article/${currentStory.id}` as any)}
        activeOpacity={0.7}
      >
        <Text style={styles.headlineText} numberOfLines={1}>
          {currentStory.title}
        </Text>
      </TouchableOpacity>

      <Ionicons name="chevron-forward" size={16} color="#DC2626" />
    </View>
  );
};
