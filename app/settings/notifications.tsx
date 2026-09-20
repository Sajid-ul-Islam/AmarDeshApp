import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../../theme';
import { 
  NotificationPreferences, 
  loadNotificationPreferences, 
  saveNotificationPreferences,
  cancelAllNotifications,
  scheduleDailyBriefing,
} from '../../services/notificationService';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const styles = useThemedStyles((tokens) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.surface.subtle,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: tokens.surface.base,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border.default,
    },
    backButton: {
      padding: 8,
      marginRight: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: tokens.text.primary,
    },
    content: {
      flex: 1,
    },
    section: {
      backgroundColor: tokens.surface.base,
      marginTop: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: tokens.text.secondary,
      marginBottom: 12,
      textTransform: 'uppercase',
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border.subtle,
    },
    settingRowLast: {
      borderBottomWidth: 0,
    },
    settingLabel: {
      fontSize: 16,
      color: tokens.text.primary,
      flex: 1,
    },
    settingDescription: {
      fontSize: 12,
      color: tokens.text.secondary,
      marginTop: 4,
    },
    dangerButton: {
      backgroundColor: tokens.status.error,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 24,
      marginHorizontal: 16,
    },
    dangerButtonText: {
      color: tokens.text.inverse,
      fontSize: 16,
      fontWeight: '600',
    },
    infoBox: {
      backgroundColor: tokens.surface.elevated,
      padding: 16,
      margin: 16,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: tokens.brand.primary,
    },
    infoText: {
      fontSize: 14,
      color: tokens.text.secondary,
      lineHeight: 20,
    },
  }));

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: true,
    breakingNews: true,
    dailyBriefing: true,
    categoryUpdates: false,
    followedCategories: [],
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00',
    },
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    const prefs = await loadNotificationPreferences();
    setPreferences(prefs);
  };

  const updatePreference = async (key: keyof NotificationPreferences, value: any) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    await saveNotificationPreferences(newPrefs);

    // Handle specific preference changes
    if (key === 'dailyBriefing') {
      if (value) {
        await scheduleDailyBriefing();
      } else {
        await cancelAllNotifications();
      }
    }
  };

  const handleResetNotifications = async () => {
    await cancelAllNotifications();
    // Show confirmation (in real app, use Alert)
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>নোটিফিকেশন সেটিংস</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>সাধারণ</Text>
          
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>নোটিফিকেশন চালু করুন</Text>
              <Text style={styles.settingDescription}>
                সকল নোটিফিকেশন বন্ধ বা চালু করুন
              </Text>
            </View>
            <Switch
              value={preferences.enabled}
              onValueChange={(value) => updatePreference('enabled', value)}
            />
          </View>
        </View>

        {/* Notification Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>নোটিফিকেশনের ধরন</Text>
          
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>ব্রেকিং নিউজ</Text>
              <Text style={styles.settingDescription}>
                গুরুত্বপূর্ণ সংবাদ তাৎক্ষণিকভাবে পান
              </Text>
            </View>
            <Switch
              value={preferences.breakingNews}
              onValueChange={(value) => updatePreference('breakingNews', value)}
              disabled={!preferences.enabled}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>দৈনিক সংবাদ</Text>
              <Text style={styles.settingDescription}>
                প্রতিদিন সকাল ৮টায় সংবাদ সারাংশ
              </Text>
            </View>
            <Switch
              value={preferences.dailyBriefing}
              onValueChange={(value) => updatePreference('dailyBriefing', value)}
              disabled={!preferences.enabled}
            />
          </View>

          <View style={[styles.settingRow, styles.settingRowLast]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>বিভাগ আপডেট</Text>
              <Text style={styles.settingDescription}>
                আপনার পছন্দের বিভাগের সংবাদ
              </Text>
            </View>
            <Switch
              value={preferences.categoryUpdates}
              onValueChange={(value) => updatePreference('categoryUpdates', value)}
              disabled={!preferences.enabled}
            />
          </View>
        </View>

        {/* Quiet Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>শান্ত সময়</Text>
          
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>শান্ত সময় চালু করুন</Text>
              <Text style={styles.settingDescription}>
                নির্দিষ্ট সময়ে নোটিফিকেশন বন্ধ থাকবে
              </Text>
            </View>
            <Switch
              value={preferences.quietHours.enabled}
              onValueChange={(value) => 
                updatePreference('quietHours', { 
                  ...preferences.quietHours, 
                  enabled: value 
                })
              }
              disabled={!preferences.enabled}
            />
          </View>

          {preferences.quietHours.enabled && (
            <View style={[styles.settingRow, styles.settingRowLast]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingLabel}>
                  {preferences.quietHours.start} - {preferences.quietHours.end}
                </Text>
                <Text style={styles.settingDescription}>
                  এই সময়ে নোটিফিকেশন আসবে না
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 নোটিফিকেশনে ট্যাপ করে সরাসরি সংবাদ পড়ুন। ব্রেকিং নিউজ সবচেয়ে গুরুত্বপূর্ণ সংবাদ তাৎক্ষণিকভাবে পৌঁছে দেয়।
          </Text>
        </View>

        {/* Reset Button */}
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleResetNotifications}
        >
          <Text style={styles.dangerButtonText}>
            সকল নোটিফিকেশন রিসেট করুন
          </Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}
