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
import { useThemedStyles, useThemeTokens } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { t, getLocalizedCategoryName, SupportedLanguage } from '../../services/i18n';

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
  const tokens = useThemeTokens();
  const themePreference = useAppStore((state) => state.themePreference);
  const setThemePreference = useAppStore((state) => state.setThemePreference);
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
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
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      searchPillText: {
        fontSize: 13,
        color: tokens.text.secondary,
        fontWeight: '500',
      },
      scrollContent: {
        paddingBottom: 40,
      },
      quickBar: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: tokens.surface.base,
        borderRadius: 12,
        padding: 12,
        justifyContent: 'space-around',
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      quickItem: {
        alignItems: 'center',
        gap: 6,
      },
      quickIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: tokens.brand.surface,
        alignItems: 'center',
        justifyContent: 'center',
      },
      quickText: {
        fontSize: 12,
        fontWeight: '600',
        color: tokens.text.primary,
      },
      sectionTitle: {
        fontSize: 13.5,
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
        backgroundColor: tokens.brand.crimsonSurface,
      },
      categoryText: {
        fontSize: 15,
        fontWeight: '600',
        color: tokens.text.primary,
      },
      specialCategoryText: {
        color: tokens.brand.secondary,
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
        flex: 1,
        marginRight: 8,
      },
      utilityTitle: {
        fontSize: 14.5,
        color: tokens.text.primary,
        fontWeight: '600',
      },
      utilitySubtitle: {
        fontSize: 12,
        color: tokens.text.secondary,
        marginTop: 2,
      },
      langSegment: {
        flexDirection: 'row',
        backgroundColor: tokens.surface.subtle,
        borderRadius: 8,
        padding: 3,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      langBtn: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
      },
      langBtnActive: {
        backgroundColor: tokens.brand.primary,
      },
      langBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: tokens.text.secondary,
      },
      langBtnTextActive: {
        color: '#FFFFFF',
        fontWeight: 'bold',
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
            <Text style={styles.brandTitle}>{t('app_name', language)}</Text>
            <Text style={styles.motto}>
              {t('app_motto', language)} • {language === 'bn' ? 'সংস্করণ ১.৩' : 'v1.3'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.searchPill}
            onPress={() => router.push('/search' as any)}
            activeOpacity={0.7}
          >
            <Ionicons name="search" size={16} color={tokens.brand.primary} />
            <Text style={styles.searchPillText}>
              {language === 'bn' ? 'অনুসন্ধান' : 'Search'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Quick Access Bar */}
        <View style={styles.quickBar}>
          <TouchableOpacity
            style={styles.quickItem}
            onPress={() => router.push('/epaper' as any)}
          >
            <View style={styles.quickIconCircle}>
              <Ionicons name="newspaper" size={20} color={tokens.brand.primary} />
            </View>
            <Text style={styles.quickText}>{t('tab_epaper', language)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickItem}
            onPress={() => router.push('/video' as any)}
          >
            <View style={styles.quickIconCircle}>
              <Ionicons name="play-circle" size={20} color={tokens.brand.primary} />
            </View>
            <Text style={styles.quickText}>{t('tab_video', language)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickItem}
            onPress={() => router.push('/bookmarks' as any)}
          >
            <View style={styles.quickIconCircle}>
              <Ionicons name="bookmark" size={20} color={tokens.brand.primary} />
            </View>
            <Text style={styles.quickText}>{t('tab_saved', language)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickItem}
            onPress={() => router.push('/july-revolution' as any)}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: tokens.brand.crimsonSurface }]}>
              <Ionicons name="flame" size={20} color={tokens.brand.secondary} />
            </View>
            <Text style={[styles.quickText, { color: tokens.brand.secondary }]}>
              {language === 'bn' ? 'জুলাই বিপ্লব' : 'July Revolution'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* News Categories Section */}
        <Text style={styles.sectionTitle}>
          {language === 'bn' ? 'সকল বিভাগ ও সংবাদ তালিকা' : 'All Sections & News Catalog'}
        </Text>
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
                    color={cat.isSpecial ? tokens.brand.secondary : tokens.brand.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.categoryText,
                    cat.isSpecial && styles.specialCategoryText,
                  ]}
                >
                  {getLocalizedCategoryName(cat.name, language)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={tokens.interactive.inactive} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Utilities & Settings */}
        <Text style={styles.sectionTitle}>{t('settings_title', language)}</Text>
        <View style={styles.gridCard}>
          {/* Language Selection Segmented Control */}
          <View style={styles.utilityRow}>
            <View style={styles.utilityLeft}>
              <View style={[styles.catIconBox, { backgroundColor: tokens.brand.surface }]}>
                <Ionicons name="language" size={20} color={tokens.brand.primary} />
              </View>
              <View>
                <Text style={styles.utilityTitle}>{t('language_select', language)}</Text>
                <Text style={styles.utilitySubtitle}>
                  {language === 'bn' ? 'বাংলা নির্বাচিত' : 'English Selected'}
                </Text>
              </View>
            </View>
            <View style={styles.langSegment}>
              <TouchableOpacity
                style={[styles.langBtn, language === 'bn' && styles.langBtnActive]}
                onPress={() => setLanguage('bn')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.langBtnText,
                    language === 'bn' && styles.langBtnTextActive,
                  ]}
                >
                  বাংলা
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
                onPress={() => setLanguage('en')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.langBtnText,
                    language === 'en' && styles.langBtnTextActive,
                  ]}
                >
                  English
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Dark Mode Toggle */}
          <View style={styles.utilityRow}>
            <View style={styles.utilityLeft}>
              <View style={styles.catIconBox}>
                <Ionicons
                  name={themePreference === 'dark' ? 'moon' : 'sunny'}
                  size={20}
                  color={tokens.brand.primary}
                />
              </View>
              <View>
                <Text style={styles.utilityTitle}>{t('dark_mode', language)}</Text>
                <Text style={styles.utilitySubtitle}>
                  {themePreference === 'dark'
                    ? t('dark_mode_active', language)
                    : t('dark_mode_inactive', language)}
                </Text>
              </View>
            </View>
            <Switch
              value={themePreference === 'dark'}
              onValueChange={(val) => setThemePreference(val ? 'dark' : 'light')}
              trackColor={{ false: tokens.border.strong, true: tokens.brand.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Low Data Mode Toggle */}
          <View style={styles.utilityRow}>
            <View style={styles.utilityLeft}>
              <View style={styles.catIconBox}>
                <Ionicons name="cellular-outline" size={20} color={tokens.brand.primary} />
              </View>
              <View>
                <Text style={styles.utilityTitle}>{t('data_saver', language)}</Text>
                <Text style={styles.utilitySubtitle}>
                  {t('data_saver_sub', language)}
                </Text>
              </View>
            </View>
            <Switch
              value={lowDataMode}
              onValueChange={setLowDataMode}
              trackColor={{ false: tokens.border.strong, true: tokens.brand.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* AI Settings (BYOK) */}
          <TouchableOpacity
            style={styles.utilityRow}
            onPress={() => router.push('/settings/ai' as any)}
          >
            <View style={styles.utilityLeft}>
              <View style={[styles.catIconBox, { backgroundColor: tokens.brand.surface }]}>
                <Ionicons name="sparkles" size={20} color={tokens.brand.primary} />
              </View>
              <View>
                <Text style={styles.utilityTitle}>{t('ai_settings_title', language)}</Text>
                <Text style={styles.utilitySubtitle}>{t('ai_settings_sub', language)}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={tokens.interactive.inactive} />
          </TouchableOpacity>

          {/* Notification Inbox */}
          <TouchableOpacity
            style={styles.utilityRow}
            onPress={() => router.push('/notifications' as any)}
          >
            <View style={styles.utilityLeft}>
              <View style={styles.catIconBox}>
                <Ionicons name="notifications-outline" size={20} color={tokens.brand.primary} />
              </View>
              <View>
                <Text style={styles.utilityTitle}>{t('notification_inbox', language)}</Text>
                <Text style={styles.utilitySubtitle}>{t('notification_inbox_sub', language)}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={tokens.interactive.inactive} />
          </TouchableOpacity>

          {/* Notification Settings */}
          <TouchableOpacity
            style={styles.utilityRow}
            onPress={() => router.push('/settings/notifications' as any)}
          >
            <View style={styles.utilityLeft}>
              <View style={styles.catIconBox}>
                <Ionicons name="options-outline" size={20} color={tokens.brand.primary} />
              </View>
              <View>
                <Text style={styles.utilityTitle}>{t('notification_control', language)}</Text>
                <Text style={styles.utilitySubtitle}>{t('notification_control_sub', language)}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={tokens.interactive.inactive} />
          </TouchableOpacity>

          {/* About Us */}
          <TouchableOpacity
            style={[styles.utilityRow, { borderBottomWidth: 0 }]}
            onPress={() => {
              Alert.alert(
                t('about_us', language),
                language === 'bn'
                  ? 'দৈনিক আমার দেশ বাংলাদেশসহ বিশ্বের শীর্ষস্থানীয় বাংলা নিউজ পোর্টাল ও জাতীয় দৈনিক।\n\nসম্পাদক ও প্রকাশক: মাহমুদুর রহমান\nকারওয়ান বাজার, ঢাকা-১২১৫।'
                  : 'Daily Amar Desh is a leading national newspaper and digital news portal.\n\nEditor & Publisher: Mahmudur Rahman\nKarwan Bazar, Dhaka-1215, Bangladesh.'
              );
            }}
          >
            <View style={styles.utilityLeft}>
              <View style={styles.catIconBox}>
                <Ionicons name="information-circle-outline" size={20} color={tokens.brand.primary} />
              </View>
              <View>
                <Text style={styles.utilityTitle}>{t('about_us', language)}</Text>
                <Text style={styles.utilitySubtitle}>{t('about_us_sub', language)}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={tokens.interactive.inactive} />
          </TouchableOpacity>
        </View>

        {/* Footer Attribution */}
        <View style={styles.infoFooter}>
          <Text style={styles.footerText}>
            {t('copyright_notice', language)}
          </Text>
          <Text style={styles.editorText}>
            {language === 'bn' ? 'সম্পাদক: মাহমুদুর রহমান' : 'Editor: Mahmudur Rahman'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
