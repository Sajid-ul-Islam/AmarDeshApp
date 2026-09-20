import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../../theme';
import { useUserStore } from '../../user';
import { useState, useEffect } from 'react';

export default function PrivacySettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
    interestsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 8,
    },
    interestChip: {
      backgroundColor: tokens.brand.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    interestText: {
      fontSize: 12,
      color: tokens.brand.primary,
      fontWeight: '600',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 12,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: tokens.brand.primary,
    },
    statLabel: {
      fontSize: 12,
      color: tokens.text.secondary,
      marginTop: 4,
    },
  }));

  const { 
    trackingEnabled, 
    toggleTracking, 
    resetUserData, 
    getUserInterests,
    totalArticlesRead,
    totalTimeSpentMs,
    readingStreakDays,
  } = useUserStore();

  const [interests, setInterests] = useState<Array<{ type: string; id: string; score: number }>>([]);

  useEffect(() => {
    loadInterests();
  }, []);

  const loadInterests = async () => {
    const userInterests = await getUserInterests(10);
    setInterests(userInterests);
  };

  const handleResetData = () => {
    Alert.alert(
      'ডেটা মুছে ফেলুন',
      'আপনার সমস্ত ট্র্যাকিং ডেটা, বুকমার্ক, এবং পছন্দগুলো মুছে ফেলা হবে। এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।',
      [
        { text: 'বাতিল', style: 'cancel' },
        { 
          text: 'মুছে ফেলুন', 
          style: 'destructive',
          onPress: async () => {
            await resetUserData();
            Alert.alert('সফল', 'আপনার সমস্ত ডেটা মুছে ফেলা হয়েছে');
            router.back();
          }
        },
      ]
    );
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours} ঘণ্টা ${minutes % 60} মিনিট`;
    }
    return `${minutes} মিনিট`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>গোপনীয়তা সেটিংস</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Tracking Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ট্র্যাকিং</Text>
          
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>বিহেভিয়ার ট্র্যাকিং</Text>
              <Text style={styles.settingDescription}>
                আপনার পড়ার অভ্যাস ট্র্যাক করে ব্যক্তিগতকৃত সুপারিশ প্রদান করুন
              </Text>
            </View>
            <Switch
              value={trackingEnabled}
              onValueChange={toggleTracking}
            />
          </View>
        </View>

        {/* Reading Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>আপনার পরিসংখ্যান</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalArticlesRead}</Text>
              <Text style={styles.statLabel}>পড়া হয়েছে</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatTime(totalTimeSpentMs)}</Text>
              <Text style={styles.statLabel}>সময় ব্যয়</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{readingStreakDays}</Text>
              <Text style={styles.statLabel}>দিনের ধারা</Text>
            </View>
          </View>
        </View>

        {/* User Interests */}
        {interests.length > 0 && (
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={styles.sectionTitle}>আপনার আগ্রহ</Text>
              <TouchableOpacity onPress={() => router.push('/settings/interests')}>
                <Text style={{ fontSize: 14, color: '#006B3F', fontWeight: '600' }}>
                  সব দেখুন →
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.interestsContainer}>
              {interests.slice(0, 10).map((interest, index) => (
                <View key={index} style={styles.interestChip}>
                  <Text style={styles.interestText}>
                    {interest.id} ({Math.round(interest.score * 100)}%)
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            🔒 আপনার সমস্ত ডেটা আপনার ডিভাইসে স্থানীয়ভাবে সংরক্ষিত হয়। আমরা কোনো ব্যক্তিগত তথ্য সংগ্রহ করি না বা ক্লাউডে আপলোড করি না।
          </Text>
        </View>

        {/* What We Track */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>আমরা কী ট্র্যাক করি</Text>
          
          <View style={[styles.settingRow, styles.settingRowLast]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>✓ আপনি কোন সংবাদ পড়েন</Text>
              <Text style={styles.settingLabel}>✓ আপনি কতক্ষণ পড়েন</Text>
              <Text style={styles.settingLabel}>✓ আপনি কোন বিষয় পছন্দ করেন</Text>
              <Text style={styles.settingLabel}>✓ আপনার বুকমার্ক</Text>
              <Text style={[styles.settingLabel, { marginTop: 8, color: '#DC2626' }]}>
                ✗ কোনো ব্যক্তিগত তথ্য নয়
              </Text>
              <Text style={[styles.settingLabel, { color: '#DC2626' }]}>
                ✗ কোনো অবস্থান ডেটা নয়
              </Text>
              <Text style={[styles.settingLabel, { color: '#DC2626' }]}>
                ✗ কোনো পরিচিতি নয়
              </Text>
            </View>
          </View>
        </View>

        {/* Export Data */}
        <TouchableOpacity
          style={[styles.dangerButton, { backgroundColor: '#006B3F' }]}
          onPress={() => router.push('/settings/export')}
        >
          <Text style={styles.dangerButtonText}>
            ডেটা এক্সপোর্ট করুন
          </Text>
        </TouchableOpacity>

        {/* Reset Button */}
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleResetData}
        >
          <Text style={styles.dangerButtonText}>
            সমস্ত ডেটা মুছে ফেলুন
          </Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}
