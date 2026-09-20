import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useThemedStyles } from '../../theme';
import { useUserStore } from '../../user';
import { useState } from 'react';

export default function ExportDataScreen() {
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
      flex: 1,
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
    exportOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border.subtle,
    },
    exportOptionLast: {
      borderBottomWidth: 0,
    },
    optionInfo: {
      flex: 1,
    },
    optionTitle: {
      fontSize: 16,
      color: tokens.text.primary,
      fontWeight: '600',
    },
    optionDescription: {
      fontSize: 12,
      color: tokens.text.secondary,
      marginTop: 4,
    },
    exportButton: {
      backgroundColor: tokens.brand.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    exportButtonText: {
      color: tokens.brand.onPrimary,
      fontSize: 14,
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
    userId,
    totalArticlesRead,
    totalTimeSpentMs,
    readingStreakDays,
  } = useUserStore();

  const [exporting, setExporting] = useState(false);

  const handleExportJSON = async () => {
    setExporting(true);
    try {
      // In a real implementation, you would fetch data from the database
      // For now, we'll create a sample export
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        userId: userId,
        stats: {
          totalArticlesRead,
          totalTimeSpentMs,
          readingStreakDays,
        },
        interests: [], // Would fetch from database
        events: [], // Would fetch from database
        bookmarks: [], // Would fetch from database
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      
      // Copy to clipboard
      await Clipboard.setStringAsync(jsonString);

      Alert.alert(
        'সফল', 
        'আপনার ডেটা ক্লিপবোর্ডে কপি করা হয়েছে। আপনি এখন এটি যেকোনো জায়গায় পেস্ট করতে পারেন।'
      );
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('ত্রুটি', 'ডেটা এক্সপোর্ট করতে সমস্যা হয়েছে');
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      // In a real implementation, you would fetch events from the database
      // For now, we'll create a sample CSV
      const csvHeader = 'event_type,entity_type,entity_id,created_at\n';
      const csvContent = csvHeader; // Would add actual data rows
      
      // Copy to clipboard
      await Clipboard.setStringAsync(csvContent);

      Alert.alert(
        'সফল', 
        'আপনার ইভেন্ট ডেটা ক্লিপবোর্ডে কপি করা হয়েছে। আপনি এখন এটি স্প্রেডশিটে পেস্ট করতে পারেন।'
      );
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('ত্রুটি', 'ডেটা এক্সপোর্ট করতে সমস্যা হয়েছে');
    } finally {
      setExporting(false);
    }
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
        <Text style={styles.title}>ডেটা এক্সপোর্ট</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>আপনার ডেটা</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalArticlesRead}</Text>
              <Text style={styles.statLabel}>পড়া হয়েছে</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{readingStreakDays}</Text>
              <Text style={styles.statLabel}>দিনের ধারা</Text>
            </View>
          </View>
        </View>

        {/* Export Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>এক্সপোর্ট অপশন</Text>
          
          <View style={styles.exportOption}>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>সম্পূর্ণ ডেটা (JSON)</Text>
              <Text style={styles.optionDescription}>
                আপনার সমস্ত প্রোফাইল, আগ্রহ, এবং কার্যকলাপ
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.exportButton}
              onPress={handleExportJSON}
              disabled={exporting}
            >
              <Text style={styles.exportButtonText}>
                {exporting ? 'এক্সপোর্ট হচ্ছে...' : 'এক্সপোর্ট'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.exportOption, styles.exportOptionLast]}>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>ইভেন্ট লগ (CSV)</Text>
              <Text style={styles.optionDescription}>
                সমস্ত ট্র্যাক করা ইভেন্ট স্প্রেডশিট ফরম্যাটে
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.exportButton}
              onPress={handleExportCSV}
              disabled={exporting}
            >
              <Text style={styles.exportButtonText}>
                {exporting ? 'এক্সপোর্ট হচ্ছে...' : 'এক্সপোর্ট'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            🔒 আপনার সমস্ত ডেটা আপনার ডিভাইসে সংরক্ষিত হয়। এক্সপোর্ট করা ফাইলগুলো শুধুমাত্র আপনার কাছে থাকবে।
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}
