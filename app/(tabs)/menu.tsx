import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles, useThemeTokens } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { t, getLocalizedCategoryName, SupportedLanguage } from '../../services/i18n';
import { getSafeHeaderPaddingTop, getSafeBottomPadding } from '../../utils/layout';
import { AmarDeshLogo } from '../../components/AmarDeshLogo';
import { DistrictPickerModal } from '../../components/DistrictPickerModal';
import { PrayerTimesWidget } from '../../components/PrayerTimesWidget';
import {
  getSavedPrayerData,
  requestGpsPrayerTimes,
  resetToDhakaDefault,
  PrayerTimeData,
  getPrayerTimesForDivision,
} from '../../services/prayerTimesService';

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
  // Low-data mode is owned by the store (see app/settings) — no local mirror.
  const [prayerData, setPrayerData] = useState<PrayerTimeData>(
    getPrayerTimesForDivision('ঢাকা')
  );
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    getSavedPrayerData().then(setPrayerData);
  }, []);

  const handleRequestGps = async () => {
    const result = await requestGpsPrayerTimes();
    if (result.success && result.data) {
      setPrayerData(result.data);
    } else if (result.error) {
      Alert.alert('লোকেশন বার্তা', result.error);
    }
  };

  const handleResetDhaka = async () => {
    const defaultData = await resetToDhakaDefault();
    setPrayerData(defaultData);
  };

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: tokens.surface.subtle,
      },
      header: {
        paddingTop: getSafeHeaderPaddingTop(insets.top, 8),
        paddingHorizontal: 20,
        paddingBottom: getSafeBottomPadding(insets.bottom, 16),
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
      searchIconButton: {
        width: 38,
        height: 38,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.sm,
      },
      scrollContent: {
        paddingBottom: getSafeBottomPadding(insets.bottom, 40),
      },
      quickBar: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: tokens.surface.base,
        borderRadius: tokens.radii.lg,
        padding: 12,
        justifyContent: 'space-around',
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      quickItem: {
        alignItems: 'center',
        gap: 6,
      },
      quickIconCircle: {
        width: 44,
        height: 44,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.surface,
        alignItems: 'center',
        justifyContent: 'center',
      },
      quickText: {
        fontSize: 12,
        fontWeight: '600',
        color: tokens.text.primary,
      },
      epaperCard: {
        backgroundColor: tokens.surface.base,
        marginHorizontal: 16,
        marginTop: 14,
        padding: 14,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        borderColor: tokens.brand.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...tokens.shadows.card,
      },
      epaperCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
      },
      epaperIconBox: {
        width: 44,
        height: 44,
        borderRadius: tokens.radii.md,
        backgroundColor: tokens.brand.surface,
        alignItems: 'center',
        justifyContent: 'center',
      },
      epaperTextCol: {
        flex: 1,
      },
      epaperBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 2,
      },
      epaperBadge: {
        fontSize: 10,
        fontWeight: 'bold',
        color: tokens.brand.primary,
        backgroundColor: tokens.brand.surface,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: tokens.radii.pill,
      },
      epaperTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: tokens.text.primary,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      },
      epaperSub: {
        fontSize: 11.5,
        color: tokens.text.secondary,
        marginTop: 2,
      },
      epaperReadButton: {
        backgroundColor: tokens.brand.primary,
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: tokens.radii.pill,
        ...tokens.shadows.sm,
      },
      epaperReadButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
      },
      sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: tokens.brand.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
      },
      gridCard: {
        backgroundColor: tokens.surface.base,
        marginHorizontal: 16,
        borderRadius: tokens.radii.lg,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 0.5,
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
        borderRadius: tokens.radii.pill,
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
        borderBottomWidth: 0.5,
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
        borderRadius: tokens.radii.pill,
        padding: 3,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
      },
      langBtn: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: tokens.radii.pill,
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
      dateWeatherCard: {
        backgroundColor: tokens.surface.base,
        marginHorizontal: 16,
        marginTop: 14,
        marginBottom: 4,
        paddingHorizontal: 14,
        paddingVertical: 11,
        borderRadius: tokens.radii.lg,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...tokens.shadows.card,
      },
      dateWeatherLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1,
      },
      dateWeatherText: {
        fontSize: 12.5,
        fontWeight: '600',
        color: tokens.text.primary,
      },
      weatherBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: tokens.surface.elevated,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: tokens.radii.pill,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
      },
      weatherText: {
        fontSize: 11.5,
        fontWeight: '600',
        color: tokens.text.secondary,
      },
      locationPillBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: tokens.brand.surface,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: tokens.radii.pill,
        borderWidth: 0.5,
        borderColor: tokens.brand.primary,
      },
      oneStopSettingsHero: {
        backgroundColor: tokens.surface.base,
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 14,
        borderRadius: tokens.radii.lg,
        borderWidth: 1.5,
        borderColor: tokens.brand.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...tokens.shadows.card,
      },
      oneStopSettingsLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
        marginRight: 8,
      },
      oneStopIconBox: {
        width: 44,
        height: 44,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.primary,
        alignItems: 'center',
        justifyContent: 'center',
      },
      oneStopTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      oneStopBadge: {
        backgroundColor: tokens.brand.crimsonSurface,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: tokens.radii.pill,
      },
      oneStopBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: tokens.brand.secondary,
      },
      oneStopSubtitle: {
        fontSize: 11.5,
        color: tokens.text.secondary,
        marginTop: 3,
      },
      locationPillText: {
        fontSize: 12,
        fontWeight: '700',
        color: tokens.brand.primary,
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
          <AmarDeshLogo height={28} variant="png" showMotto language={language} />
          <TouchableOpacity
            style={styles.searchIconButton}
            onPress={() => router.push('/search' as any)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={language === 'bn' ? 'অনুসন্ধান' : 'Search'}
          >
            <Ionicons name="search" size={19} color={tokens.brand.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Date, Weekday & Weather Bar (Moved from Home Top) */}
        <View style={styles.dateWeatherCard}>
          <View style={styles.dateWeatherLeft}>
            <Ionicons name="calendar-outline" size={14} color={tokens.brand.primary} />
            <Text style={styles.dateWeatherText}>
              {language === 'bn'
                ? 'বুধবার, ০৭ অক্টোবর ২০২৬ • ২৩ রবিউস সানি ১৪৪৮'
                : 'Wednesday, Oct 7, 2026 • 23 Rabi al-Thani 1448'}
            </Text>
          </View>
          <View style={styles.weatherBadge}>
            <Ionicons name="partly-sunny" size={13} color="#D97706" />
            <Text style={styles.weatherText}>
              {language === 'bn'
                ? `${prayerData.division || 'ঢাকা'} ২৮° সে.`
                : `${prayerData.division || 'Dhaka'} 28° C`}
            </Text>
          </View>
        </View>

        {/* Prayer Times Widget in Menu */}
        <PrayerTimesWidget
          prayerData={prayerData}
          onChangeDivision={() => setShowLocationModal(true)}
        />

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

        {/* Featured ePaper Edition Card under Menu */}
        <TouchableOpacity
          style={styles.epaperCard}
          onPress={() => router.push('/epaper' as any)}
          activeOpacity={0.8}
        >
          <View style={styles.epaperCardLeft}>
            <View style={styles.epaperIconBox}>
              <Ionicons name="newspaper" size={24} color={tokens.brand.primary} />
            </View>
            <View style={styles.epaperTextCol}>
              <View style={styles.epaperBadgeRow}>
                <Text style={styles.epaperBadge}>ডিজিটাল প্রিন্ট সংস্করণ</Text>
              </View>
              <Text style={styles.epaperTitle}>
                {language === 'bn' ? 'দৈনিক আমার দেশ ই-পেপার' : 'Daily Amar Desh ePaper'}
              </Text>
              <Text style={styles.epaperSub} numberOfLines={1}>
                {language === 'bn'
                  ? 'মুদ্রিত পত্রিকার পূর্ণাঙ্গ ডিজিটাল পাতা ও কলাম পাঠ'
                  : 'Read full print replica pages & column zoom'}
              </Text>
            </View>
          </View>
          <View style={styles.epaperReadButton}>
            <Text style={styles.epaperReadButtonText}>
              {language === 'bn' ? 'পড়ুন ↗' : 'Read ↗'}
            </Text>
          </View>
        </TouchableOpacity>

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

        {/* Settings Hero */}
        <Text style={styles.sectionTitle}>{t('settings_title', language)}</Text>

        <TouchableOpacity
          style={styles.oneStopSettingsHero}
          onPress={() => router.push('/settings' as any)}
          activeOpacity={0.8}
        >
          <View style={styles.oneStopSettingsLeft}>
            <View style={styles.oneStopIconBox}>
              <Ionicons name="settings" size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.oneStopTitle}>
                {t('settings_hub_title', language)}
              </Text>
              <Text style={styles.oneStopSubtitle} numberOfLines={1}>
                {t('settings_hub_sub', language)}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={tokens.brand.primary} />
        </TouchableOpacity>

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
                  {language === 'bn' ? 'বাংলা' : 'English'}
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

          {/* Edition & Prayer Location Setting */}
          <TouchableOpacity
            style={styles.utilityRow}
            onPress={() => setShowLocationModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.utilityLeft}>
              <View style={styles.catIconBox}>
                <Ionicons name="location-outline" size={20} color={tokens.brand.primary} />
              </View>
              <View>
                <Text style={styles.utilityTitle}>
                  {language === 'bn' ? 'সংস্করণ ও অবস্থান' : 'Edition & Location'}
                </Text>
                <Text style={styles.utilitySubtitle}>
                  {prayerData.isGps
                    ? `${prayerData.division} (GPS)`
                    : `${prayerData.division || 'ঢাকা'}`}
                </Text>
              </View>
            </View>
            <View style={styles.locationPillBadge}>
              <Text style={styles.locationPillText}>
                {prayerData.isGps ? 'GPS' : 'ডিফল্ট'}
              </Text>
              <Ionicons name="chevron-forward" size={14} color={tokens.brand.primary} />
            </View>
          </TouchableOpacity>

          {/* Reading Theme Selector */}
          <View style={styles.utilityRow}>
            <View style={styles.utilityLeft}>
              <View style={styles.catIconBox}>
                <Ionicons
                  name={themePreference === 'dark' ? 'moon' : themePreference === 'sepia' ? 'book-outline' : 'sunny'}
                  size={20}
                  color={tokens.brand.primary}
                />
              </View>
              <View>
                <Text style={styles.utilityTitle}>{language === 'bn' ? 'থিম' : 'Theme'}</Text>
                <Text style={styles.utilitySubtitle}>
                  {themePreference === 'dark'
                    ? (language === 'bn' ? 'ওলেড ডার্ক' : 'Dark')
                    : themePreference === 'sepia'
                      ? (language === 'bn' ? 'সেপিয়া' : 'Sepia')
                      : (language === 'bn' ? 'লাইট' : 'Light')}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {[
                { label: '☀️', value: 'light' as const, title: 'লাইট' },
                { label: '📜', value: 'sepia' as const, title: 'সেপিয়া' },
                { label: '🌙', value: 'dark' as const, title: 'ডার্ক' },
              ].map((opt) => {
                const isCur = (themePreference || 'light') === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      borderRadius: tokens.radii.pill,
                      backgroundColor: isCur ? tokens.brand.primary : tokens.surface.subtle,
                      borderWidth: 0.5,
                      borderColor: isCur ? tokens.brand.primary : tokens.border.subtle,
                    }}
                    onPress={() => setThemePreference(opt.value)}
                  >
                    <Text style={{ fontSize: 13, color: isCur ? '#FFFFFF' : tokens.text.primary, fontWeight: '600' }}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Settings Gateway */}
          <TouchableOpacity
            style={styles.utilityRow}
            onPress={() => router.push('/settings' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.utilityLeft}>
              <View style={[styles.catIconBox, { backgroundColor: tokens.brand.surface }]}>
                <Ionicons name="options-outline" size={20} color={tokens.brand.primary} />
              </View>
              <View>
                <Text style={styles.utilityTitle}>
                  {t('settings_title', language)}
                </Text>
                <Text style={styles.utilitySubtitle}>
                  {t('settings_hub_sub', language)}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={tokens.interactive.inactive} />
          </TouchableOpacity>

          {/* Notification Inbox */}
          <TouchableOpacity
            style={styles.utilityRow}
            onPress={() => router.push('/notifications' as any)}
            activeOpacity={0.7}
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

      {/* Location / Prayer Settings Modal */}
      <DistrictPickerModal
        visible={showLocationModal}
        selectedDivision={prayerData.division}
        isGps={Boolean(prayerData.isGps)}
        onRequestGps={handleRequestGps}
        onResetDhaka={handleResetDhaka}
        onClose={() => setShowLocationModal(false)}
      />
    </View>
  );
}
