import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemedStyles, useThemeTokens } from '../theme';
import { DEFAULT_RATES, type LiveIndicatorItem } from '../data/ratesData';
export { DEFAULT_RATES };
export type { LiveIndicatorItem };

export const LiveRatesTicker: React.FC = () => {
  const tokens = useThemeTokens();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handlePressItem = (id: string) => {
    Haptics.selectionAsync();
    setActiveItem(activeItem === id ? null : id);
  };

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        backgroundColor: tokens.surface.subtle,
        borderBottomWidth: 0.5,
        borderBottomColor: tokens.border.subtle,
        paddingVertical: 6,
      },
      scrollContent: {
        paddingHorizontal: 16,
        gap: 8,
      },
      ratePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: tokens.surface.base,
        borderRadius: tokens.radii.pill,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.sm,
      },
      activeRatePill: {
        borderColor: tokens.brand.primary,
        backgroundColor: tokens.brand.surface,
      },
      iconBox: {
        width: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
      },
      titleText: {
        fontSize: 11,
        color: tokens.text.secondary,
        fontWeight: '500',
      },
      valueText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      changeBadge: {
        fontSize: 10,
        fontWeight: 'bold',
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 4,
      },
      positiveBadge: {
        color: tokens.status.success,
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
      },
    })
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {DEFAULT_RATES.map((item) => {
          const isSelected = activeItem === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.ratePill, isSelected && styles.activeRatePill]}
              onPress={() => handlePressItem(item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.iconBox}>
                <Ionicons
                  name={item.icon as any}
                  size={14}
                  color={item.category === 'cricket' ? tokens.brand.primary : tokens.brand.accent}
                />
              </View>
              <Text style={styles.titleText}>{item.title}:</Text>
              <Text style={styles.valueText}>{item.value}</Text>
              {item.change && (
                <Text
                  style={[
                    styles.changeBadge,
                    item.isPositive && styles.positiveBadge,
                  ]}
                >
                  {item.change}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
