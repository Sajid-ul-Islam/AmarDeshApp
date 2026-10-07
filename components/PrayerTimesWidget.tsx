import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
      },
      titleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      },
      titleText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: tokens.brand.primary,
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
        borderRadius: 12,
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
      },
      waqtName: {
        fontSize: 12,
        color: tokens.text.secondary,
        marginBottom: 2,
      },
      waqtTime: {
        fontSize: 13,
        fontWeight: 'bold',
        color: tokens.text.primary,
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
          <Ionicons name="moon" size={16} color="#006B3F" />
          <Text style={styles.titleText}>নামাজের সময়সূচি</Text>
          <Text style={styles.hijriBadge}>({prayerData.hijriDate})</Text>
        </View>

        <TouchableOpacity style={styles.divisionBtn} onPress={onChangeDivision}>
          <Ionicons name="location-outline" size={12} color="#006B3F" />
          <Text style={styles.divisionText}>{prayerData.division}</Text>
          <Ionicons name="chevron-down" size={12} color="#006B3F" />
        </TouchableOpacity>
      </View>

      <View style={styles.timesRow}>
        {prayers.map((p) => (
          <View key={p.name} style={styles.timeCol}>
            <Text style={styles.waqtName}>{p.name}</Text>
            <Text style={styles.waqtTime}>{p.time}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
