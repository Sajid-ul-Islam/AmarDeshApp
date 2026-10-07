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
        borderRadius: tokens.radii.lg,
        padding: 14,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
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
        fontSize: 13.5,
        fontWeight: '700',
        color: tokens.brand.primary,
        letterSpacing: -0.2,
      },
      hijriBadge: {
        fontSize: 11.5,
        color: tokens.text.secondary,
      },
      locationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: tokens.surface.elevated,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: tokens.radii.pill,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.sm,
      },
      activeGpsBtn: {
        backgroundColor: tokens.brand.surface,
        borderColor: tokens.brand.primary,
      },
      locationText: {
        fontSize: 11.5,
        color: tokens.brand.primary,
        fontWeight: '700',
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
        borderRadius: tokens.radii.sm,
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
      gpsPromptBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: tokens.border.subtle,
      },
      gpsPromptText: {
        fontSize: 11.5,
        color: tokens.brand.primary,
        fontWeight: '600',
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

  const isGpsActive = Boolean(prayerData.isGps);
  const locationLabel = isGpsActive
    ? `${prayerData.division} (GPS)`
    : `${prayerData.division || 'ঢাকা'} (ডিফল্ট)`;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleLeft}>
          <Ionicons name="moon" size={16} color={styles.titleText.color} />
          <Text style={styles.titleText}>নামাজের সময়সূচি</Text>
          <Text style={styles.hijriBadge}>({prayerData.hijriDate})</Text>
        </View>

        <TouchableOpacity
          style={[styles.locationBtn, isGpsActive && styles.activeGpsBtn]}
          onPress={onChangeDivision}
          activeOpacity={0.7}
          accessibilityLabel="নামাজের অবস্থান পরিবর্তন করুন"
        >
          <Ionicons
            name={isGpsActive ? 'navigate' : 'location-outline'}
            size={12}
            color={styles.locationText.color}
          />
          <Text style={styles.locationText}>{locationLabel}</Text>
          <Ionicons name="chevron-down" size={12} color={styles.locationText.color} />
        </TouchableOpacity>
      </View>

      <View style={styles.timesRow}>
        {prayers.map((p, idx) => {
          // Highlight current/upcoming waqt
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

      {/* GPS Prompt to ask user for local time if still using default */}
      {!isGpsActive && (
        <TouchableOpacity
          style={styles.gpsPromptBar}
          onPress={onChangeDivision}
          activeOpacity={0.7}
        >
          <Ionicons name="navigate-circle-outline" size={14} color={styles.gpsPromptText.color} />
          <Text style={styles.gpsPromptText}>
            আপনার এলাকার সঠিক সময়ের জন্য GPS ব্যবহার করুন ↗
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
