import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../theme';
import { stripCDATA } from '../services/rssService';

interface BreakingNewsTickerProps {
  headlines: Array<{ id: string; title: string }>;
}

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({ headlines }) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tokens.brand.crimsonSurface,
        borderTopWidth: 1,
        borderTopColor: tokens.border.default,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
        paddingHorizontal: 14,
        paddingVertical: 9,
      },
      badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tokens.brand.primary,
        paddingHorizontal: 8,
        paddingVertical: 3.5,
        borderRadius: 2,
        marginRight: 10,
        gap: 5,
      },
      pulseDot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: '#FFFFFF',
      },
      badgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 0.3,
      },
      headlineTouchable: {
        flex: 1,
      },
      headlineText: {
        fontSize: 13.5,
        color: tokens.text.primary,
        fontWeight: '600',
        lineHeight: 18,
      },
      chevron: {
        marginLeft: 6,
      },
    })
  );

  // Pulsating dot effect
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulseAnim]);

  // Headline cycle animation
  useEffect(() => {
    if (headlines.length <= 1) return;
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex((prev) => (prev + 1) % headlines.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }).start();
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [headlines.length, fadeAnim]);

  if (!headlines || headlines.length === 0) return null;

  const currentStory = headlines[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Animated.View style={[styles.pulseDot, { opacity: pulseAnim }]} />
        <Text style={styles.badgeText}>ব্রেকিং</Text>
      </View>

      <TouchableOpacity
        style={styles.headlineTouchable}
        onPress={() => router.push(`/article/${currentStory.id}` as any)}
        activeOpacity={0.7}
      >
        <Animated.Text
          style={[styles.headlineText, { opacity: fadeAnim }]}
          numberOfLines={1}
        >
          {stripCDATA(currentStory.title)}
        </Animated.Text>
      </TouchableOpacity>

      <Ionicons name="chevron-forward" size={16} color="#DC2626" style={styles.chevron} />
    </View>
  );
};
