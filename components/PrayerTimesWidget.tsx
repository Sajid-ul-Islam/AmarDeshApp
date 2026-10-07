import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../theme';
import { PrayerTimeData } from '../services/prayerTimesService';

interface PrayerTimesWidgetProps {
  prayerData: PrayerTimeData;
  onChangeDivision: () => void;
}

export const PrayerTimesWidget: React.FC<PrayerTimesWidgetProps> = ({
  prayerData,
  onChangeDivision,
}) => {
  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        backgroundColor: tokens.surface.base,
        marginHorizontal: 16,
        marginVertical: 10,
        borderRadius: 4,
        padding: 14,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      },
      titleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      },
      titleText: {
        fontSize: 13.5,
        fontWeight: '700',
        color: tokens.brand.primary,
        letterSpacing: -0.2,
      },
      hijriBadge: {
        fontSize: 12,
        color: tokens.text.secondary,
      },
      divisionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: tokens.surface.elevated,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      divisionText: {
        fontSize: 12,
        color: tokens.brand.primary,
        fontWeight: '600',
      },
      timesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 4,
      },
      timeCol: {
        alignItems: 'center',
        flex: 1,
      },
      activeTimeCol: {
        backgroundColor: tokens.brand.surface,
        borderRadius: 8,
        paddingVertical: 4,
      },
      waqtName: {
        fontSize: 12,
        color: tokens.text.secondary,
        marginBottom: 3,
      },
      activeWaqtName: {
        color: tokens.brand.primary,
        fontWeight: 'bold',
      },
      waqtTime: {
        fontSize: 13,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      activeWaqtTime: {
        color: tokens.brand.primary,
      },
    })
  );

  const prayers = [
    { name: 'ফজর', time: prayerData.fajr },
    { name: 'যোহর', time: prayerData.dhuhr },
    { name: 'আসর', time: prayerData.asr },
    { name: 'মাগরিব', time: prayerData.maghrib },
    { name: 'এশা', time: prayerData.isha },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleLeft}>
          <Ionicons name="moon" size={16} color={styles.titleText.color} />
          <Text style={styles.titleText}>নামাজের সময়সূচি</Text>
          <Text style={styles.hijriBadge}>({prayerData.hijriDate})</Text>
        </View>

        <TouchableOpacity
          style={styles.divisionBtn}
          onPress={onChangeDivision}
          activeOpacity={0.7}
        >
          <Ionicons name="location-outline" size={12} color={styles.divisionText.color} />
          <Text style={styles.divisionText}>{prayerData.division}</Text>
          <Ionicons name="chevron-down" size={12} color={styles.divisionText.color} />
        </TouchableOpacity>
      </View>

      <View style={styles.timesRow}>
        {prayers.map((p, idx) => {
          // Highlight second waqt (e.g. current or next)
          const isHighlight = idx === 1;
          return (
            <View
              key={p.name}
              style={[styles.timeCol, isHighlight && styles.activeTimeCol]}
            >
              <Text style={[styles.waqtName, isHighlight && styles.activeWaqtName]}>
                {p.name}
              </Text>
              <Text style={[styles.waqtTime, isHighlight && styles.activeWaqtTime]}>
                {p.time}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
