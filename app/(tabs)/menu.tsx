import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../../theme';
import { useAppStore } from '../../store/useAppStore';

interface CategoryItem {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  isSpecial?: boolean;
}

const ALL_CATEGORIES: CategoryItem[] = [
  { id: 'latest', name: 'সর্বশেষ সংবাদ', icon: 'flash' },
  { id: 'july-revolution', name: 'জুলাই বিপ্লব ২০২৪', icon: 'flame', isSpecial: true },
  { id: 'national', name: 'জাতীয়', icon: 'business' },
  { id: 'politics', name: 'রাজনীতি', icon: 'megaphone' },
  { id: 'business', name: 'বাণিজ্য ও অর্থনীতি', icon: 'trending-up' },
  { id: 'bangladesh', name: 'সারা দেশ (বিভাগ ও জেলা)', icon: 'location' },
  { id: 'world', name: 'বিশ্ব সংবাদ', icon: 'globe' },
  { id: 'sports', name: 'খেলাধুলা', icon: 'football' },
  { id: 'entertainment', name: 'বিনোদন ও সংস্কৃতি', icon: 'film' },
  { id: 'islam', name: 'ইসলাম ও জীবন', icon: 'moon' },
  { id: 'opinion', name: 'মতামত ও উপ-সম্পাদকীয়', icon: 'create' },
  { id: 'feature', name: 'ফিচার ও জীবনধারা', icon: 'book' },
  { id: 'corporate', name: 'কর্পোরেট সংবাদ', icon: 'briefcase' },
  { id: 'education', name: 'শিক্ষা ও ক্যাম্পাস', icon: 'school' },
];

export default function MenuScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const themePreference = useAppStore((state) => state.themePreference);
  const setThemePreference = useAppStore((state) => state.setThemePreference);
  const [lowDataMode, setLowDataMode] = useState(false);

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: tokens.surface.subtle,
      },
      header: {
        paddingTop: insets.top > 0 ? insets.top : 16,
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
      },
      brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      brandTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: tokens.brand.primary,
      },
      motto: {
        fontSize: 12,
        color: tokens.text.secondary,
        marginTop: 2,
      },
      searchPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tokens.surface.elevated,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
      },
      searchPillText: {
        fontSize: 13,
        color: tokens.text.secondary,
      },
      scrollContent: {
        paddingBottom: 40,
      },
      sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: tokens.text.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
      },
      gridCard: {
        backgroundColor: tokens.surface.base,
        marginHorizontal: 16,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.subtle,
      },
      categoryLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      },
      catIconBox: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: tokens.surface.elevated,
        justifyContent: 'center',
        alignItems: 'center',
      },
      specialIconBox: {
        backgroundColor: '#FEF2F2',
      },
      categoryText: {
        fontSize: 15,
        fontWeight: '600',
        color: tokens.text.primary,
      },
      specialCategoryText: {
        color: '#DC2626',
        fontWeight: 'bold',
      },
      utilityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.subtle,
      },
      utilityLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      },
      utilityTitle: {
        fontSize: 15,
        color: tokens.text.primary,
        fontWeight: '500',
      },
      utilitySubtitle: {
        fontSize: 12,
        color: tokens.text.secondary,
        marginTop: 2,
      },
      infoFooter: {
        alignItems: 'center',
        marginTop: 24,
        paddingHorizontal: 24,
      },
      footerText: {
        fontSize: 12,
        color: tokens.text.tertiary,
        textAlign: 'center',
        lineHeight: 18,
      },
      editorText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: tokens.text.secondary,
        marginTop: 6,
      },
    })
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View>
            <Text style={styles.brandTitle}>দৈনিক আমার দেশ</Text>
            <Text style={styles.motto}>স্বাধীনতার কথা বলে • সংস্করণ ১.৩</Text>
          </View>
          <TouchableOpacity
            style={styles.searchPill}
            onPress={() => router.push('/search')}
          >
            <Ionicons name="search" size={16} color="#006B3F" />
            <Text style={styles.searchPillText}>অনুসন্ধান</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* News Categories Section */}
        <Text style={styles.sectionTitle}>সকল বিভাগ ও সংবাদ তালিকা</Text>
        <View style={styles.gridCard}>
          {ALL_CATEGORIES.map((cat, idx) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryRow,
                idx === ALL_CATEGORIES.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={() => {
                if (cat.id === 'july-revolution') {
                  router.push('/july-revolution' as any);
                } else if (cat.id === 'latest') {
                  router.push('/' as any);
                } else {
                  router.push(`/category/${cat.id}` as any);
                }
              }}
            >
              <View style={styles.categoryLeft}>
                <View
                  style={[
                    styles.catIconBox,
                    cat.isSpecial && styles.specialIconBox,
                  ]}
                >
                  <Ionicons
                    name={cat.icon}
                    size={20}
                    color={cat.isSpecial ? '#DC2626' : '#006B3F'}
                  />
                </View>
                <Text
                  style={[
                    styles.categoryText,
                    cat.isSpecial && styles.specialCategoryText,
                  ]}
                >
                  {cat.name}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Utilities & Settings */}
        <Text style={styles.sectionTitle}>সেটিংস ও প্রয়োজনীয় সেবা</Text>
        <View style={styles.gridCard}>
          {/* Dark Mode Toggle */}
          <View style={styles.utilityRow}>
            <View style={styles.utilityLeft}>
              <View style={styles.catIconBox}>
                <Ionicons
                  name={themePreference === 'dark' ? 'moon' : 'sunny'}
                  size={20}
                  color="#006B3F"
                />
              </View>
              <View>
                <Text style={styles.utilityTitle}>ডার্ক মোড</Text>
                <Text style={styles.utilitySubtitle}>
                  {themePreference === 'dark' ? 'চালু আছে' : 'বন্ধ আছে'}
                </Text>
              </View>
            </View>
            <Switch
              value={themePreference === 'dark'}
              onValueChange={(val) => setThemePreference(val ? 'dark' : 'light')}
              trackColor={{ false: '#D1D5DB', true: '#006B3F' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Low Data Mode Toggle */}
          <View style={styles.utilityRow}>
            <View style={styles.utilityLeft}>
              <View style={styles.catIconBox}>
                <Ionicons name="cellular-outline" size={20} color="#006B3F" />
              </View>
              <View>
                <Text style={styles.utilityTitle}>কম ডেটা মোড (Data Saver)</Text>
                <Text style={styles.utilitySubtitle}>
                  স্লো বা ২জি/৩জি ইন্টারনেটে দ্রুত লোড
                </Text>
              </View>
            </View>
            <Switch
              value={lowDataMode}
              onValueChange={setLowDataMode}
              trackColor={{ false: '#D1D5DB', true: '#006B3F' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Notification Settings */}
          <TouchableOpacity
            style={styles.utilityRow}
            onPress={() => router.push('/settings/notifications')}
          >
            <View style={styles.utilityLeft}>
              <View style={styles.catIconBox}>
                <Ionicons name="notifications-outline" size={20} color="#006B3F" />
              </View>
              <View>
                <Text style={styles.utilityTitle}>নোটিফিকেশন অ্যালার্ট</Text>
                <Text style={styles.utilitySubtitle}>ব্রেকিং নিউজ ও দৈনিক সারসংক্ষেপ</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          {/* About Us */}
          <TouchableOpacity
            style={[styles.utilityRow, { borderBottomWidth: 0 }]}
            onPress={() => {
              Alert.alert(
                'আমার দেশ সম্পর্কে',
                'দৈনিক আমার দেশ বাংলাদেশসহ বিশ্বের শীর্ষস্থানীয় বাংলা নিউজ পোর্টাল ও জাতীয় দৈনিক।\n\nসম্পাদক ও প্রকাশক: মাহমুদুর রহমান\nকারওয়ান বাজার, ঢাকা-১২১৫।'
              );
            }}
          >
            <View style={styles.utilityLeft}>
              <View style={styles.catIconBox}>
                <Ionicons name="information-circle-outline" size={20} color="#006B3F" />
              </View>
              <View>
                <Text style={styles.utilityTitle}>আমার দেশ সম্পর্কে</Text>
                <Text style={styles.utilitySubtitle}>যোগাযোগ ও সম্পাদকীয় নীতিমালা</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Corporate / Office Footer info */}
        <View style={styles.infoFooter}>
          <Text style={styles.editorText}>সম্পাদক ও প্রকাশক: মাহমুদুর রহমান</Text>
          <Text style={styles.footerText}>
            ঢাকা ট্রেড সেন্টার, ৯৯ কাজী নজরুল ইসলাম অ্যাভিনিউ, কারওয়ান বাজার, ঢাকা-১২১৫{'\n'}
            স্বত্ব © ২০২৪-২০২৬ দৈনিক আমার দেশ
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
