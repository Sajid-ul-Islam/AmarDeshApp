import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemedStyles, useThemeTokens } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { useUserStore } from '../../user';
import { t, SupportedLanguage, formatLocalizedNumeral } from '../../services/i18n';
import { getSafeHeaderPaddingTop } from '../../utils/layout';
import { AmarDeshLogo } from '../../components/AmarDeshLogo';
import { DistrictPickerModal } from '../../components/DistrictPickerModal';
import {
  loadFontSize,
  saveFontSize,
} from '../../services/storage';
import {
  getByokAiConfig,
  saveByokAiConfig,
  AiProvider,
  PROVIDER_METADATA,
} from '../../services/byokAiService';
import {
  loadNotificationPreferences,
  saveNotificationPreferences,
  NotificationPreferences,
} from '../../services/notificationService';
import {
  getOfflineArticleCount,
  clearAllCachedArticles,
} from '../../services/offlineDatabase';
import {
  getCloudSyncState,
  syncAccountData,
  CloudSyncState,
} from '../../services/cloudSyncService';
import {
  checkForOtaUpdate,
  applyOtaUpdate,
} from '../../services/otaUpdateService';
import {
  getSavedPrayerData,
  requestGpsPrayerTimes,
  resetToDhakaDefault,
  PrayerTimeData,
  getPrayerTimesForDivision,
} from '../../services/prayerTimesService';

const LOW_DATA_STORAGE_KEY = '@amar_desh_low_data_mode';

export default function OneStopSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tokens = useThemeTokens();

  // Store state
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const themePreference = useAppStore((state) => state.themePreference);
  const setThemePreference = useAppStore((state) => state.setThemePreference);
  const feedLayout = useAppStore((state) => state.feedLayout);
  const setFeedLayout = useAppStore((state) => state.setFeedLayout);
  const userId = useUserStore((state) => state.userId);

  // Local settings state
  const [fontSize, setFontSize] = useState<string>('M');
  const [lowDataMode, setLowDataMode] = useState<boolean>(false);
  const [cachedCount, setCachedCount] = useState<number>(0);
  const [isClearingCache, setIsClearingCache] = useState<boolean>(false);
  const [checkingUpdate, setCheckingUpdate] = useState<boolean>(false);

  // AI config summary
  const [aiProvider, setAiProvider] = useState<AiProvider>('gemini');
  const [hasAiKey, setHasAiKey] = useState<boolean>(false);

  // Notification summary
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>({
    enabled: true,
    breakingNews: true,
    dailyBriefing: true,
    categoryUpdates: false,
    followedCategories: [],
    quietHours: { enabled: false, start: '22:00', end: '07:00' },
  });

  // Prayer & Location
  const [prayerData, setPrayerData] = useState<PrayerTimeData>(
    getPrayerTimesForDivision('ঢাকা')
  );
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

  // Cloud Sync
  const [syncState, setSyncState] = useState<CloudSyncState>({
    isSyncing: false,
    lastSyncedAt: null,
    pendingChanges: 0,
    lastError: null,
    userId: null,
  });

  useEffect(() => {
    loadFontSize().then(setFontSize);

    AsyncStorage.getItem(LOW_DATA_STORAGE_KEY).then((val) => {
      if (val !== null) setLowDataMode(JSON.parse(val));
    });

    getOfflineArticleCount().then(setCachedCount);

    getByokAiConfig().then((cfg) => {
      setAiProvider(cfg.provider);
      setHasAiKey(Boolean(cfg.apiKey && cfg.apiKey.length > 5));
    });

    loadNotificationPreferences().then(setNotifPrefs);

    getSavedPrayerData().then(setPrayerData);

    getCloudSyncState().then(setSyncState);
  }, []);

  const handleToggleLowData = async (value: boolean) => {
    Haptics.selectionAsync();
    setLowDataMode(value);
    await AsyncStorage.setItem(LOW_DATA_STORAGE_KEY, JSON.stringify(value));
  };

  const handleSelectAiProvider = async (prov: AiProvider) => {
    Haptics.selectionAsync();
    setAiProvider(prov);
    const existing = await getByokAiConfig();
    const updated = {
      ...existing,
      provider: prov,
      model: PROVIDER_METADATA[prov].defaultModel,
    };
    await saveByokAiConfig(updated);
    setHasAiKey(Boolean(updated.apiKey && updated.apiKey.length > 5));
  };

  const handleChangeFontSize = async (size: string) => {
    Haptics.selectionAsync();
    setFontSize(size);
    await saveFontSize(size);
  };

  const handleToggleNotifFlag = async (
    field: 'breakingNews' | 'dailyBriefing' | 'categoryUpdates',
    value: boolean
  ) => {
    Haptics.selectionAsync();
    const updated = { ...notifPrefs, [field]: value };
    setNotifPrefs(updated);
    await saveNotificationPreferences(updated);
  };

  const handleClearCache = () => {
    Alert.alert(
      language === 'bn' ? 'ক্যাশ খালি নিশ্চিতকরণ' : 'Confirm Clear Cache',
      language === 'bn'
        ? `বর্তমানে ডিভাইসে সংরক্ষিত ${formatLocalizedNumeral(cachedCount, 'bn')}টি অফলাইন সংবাদ ডাটাবেস থেকে মুছে ফেলা হবে। আপনি কি নিশ্চিত?`
        : `This will remove ${cachedCount} cached offline articles from storage. Are you sure?`,
      [
        { text: language === 'bn' ? 'বাতিল' : 'Cancel', style: 'cancel' },
        {
          text: language === 'bn' ? 'মুছে ফেলুন' : 'Clear',
          style: 'destructive',
          onPress: async () => {
            setIsClearingCache(true);
            try {
              await clearAllCachedArticles();
              setCachedCount(0);
              Alert.alert(
                language === 'bn' ? 'সফল' : 'Success',
                t('cache_cleared', language)
              );
            } catch {
              Alert.alert(
                language === 'bn' ? 'ত্রুটি' : 'Error',
                language === 'bn' ? 'ক্যাশ খালি করা সম্ভব হয়নি।' : 'Failed to clear cache.'
              );
            } finally {
              setIsClearingCache(false);
            }
          },
        },
      ]
    );
  };

  const handleSyncNow = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const res = await syncAccountData(userId || 'reader-account');
    const newState = await getCloudSyncState();
    setSyncState(newState);
    if (res.success) {
      Alert.alert(
        language === 'bn' ? 'সিঙ্ক সম্পন্ন' : 'Sync Complete',
        language === 'bn'
          ? 'ক্লাউডে বুকমার্ক ও রিডিং হিস্ট্রি সফলভাবে সিঙ্ক হয়েছে।'
          : 'Bookmarks and reading history successfully synced.'
      );
    }
  };

  const handleCheckOta = async () => {
    setCheckingUpdate(true);
    try {
      const updateInfo = await checkForOtaUpdate();
      if (updateInfo.isAvailable) {
        Alert.alert(
          language === 'bn' ? 'নতুন সংস্করণ উপলব্ধ!' : 'Update Available!',
          `${language === 'bn' ? 'সংস্করণ' : 'Version'}: ${updateInfo.latestVersion}\n\n${updateInfo.releaseNotes || ''}\n\n${language === 'bn' ? 'আপনি কি এখনই আপডেটটি ডাউনলোড করে সক্রিয় করতে চান?' : 'Download and apply now?'}`,
          [
            { text: language === 'bn' ? 'পরে' : 'Later', style: 'cancel' },
            {
              text: language === 'bn' ? 'এখনই আপডেট করুন' : 'Update Now',
              onPress: async () => {
                const res = await applyOtaUpdate();
                Alert.alert('আপডেট', res.message);
              },
            },
          ]
        );
      } else {
        Alert.alert(
          language === 'bn' ? 'অ্যাপ আপ-টু-ডেট আছে' : 'Up to Date',
          language === 'bn'
            ? `বর্তমান সংস্করণ: ১.৪.২ (লেটেস্ট রিলিজ)\nসর্বশেষ পরীক্ষা: ${updateInfo.lastChecked || 'এইমাত্র'}\n\nদৈনিক আমার দেশের সমস্ত নতুন নিরাপত্তা ফিচার ও এআই আপডেট সক্রিয় রয়েছে।`
            : `Current version: 1.4.2 (Latest)\nAll features and security modules are active.`
        );
      }
    } catch {
      Alert.alert(
        language === 'bn' ? 'ত্রুটি' : 'Error',
        language === 'bn'
          ? 'আপডেট সার্ভারের সাথে সংযোগ করা সম্ভব হয়নি।'
          : 'Could not connect to update servers.'
      );
    } finally {
      setCheckingUpdate(false);
    }
  };

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: tokens.surface.subtle,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: getSafeHeaderPaddingTop(insets.top, 8),
        paddingHorizontal: 16,
        paddingBottom: 14,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
      },
      backBtn: {
        width: 38,
        height: 38,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.subtle,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
      },
      headerTitleCol: {
        flex: 1,
      },
      headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: tokens.text.primary,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      },
      headerSubtitle: {
        fontSize: 11,
        color: tokens.text.secondary,
        marginTop: 2,
      },
      content: {
        paddingBottom: Math.max(insets.bottom, 24) + 20,
      },
      sectionWrapper: {
        marginTop: 16,
        marginHorizontal: 16,
      },
      sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
        paddingHorizontal: 4,
      },
      sectionIconBox: {
        width: 24,
        height: 24,
        borderRadius: tokens.radii.sm,
        backgroundColor: tokens.brand.surface,
        alignItems: 'center',
        justifyContent: 'center',
      },
      sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: tokens.brand.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
      },
      card: {
        backgroundColor: tokens.surface.base,
        borderRadius: tokens.radii.lg,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        overflow: 'hidden',
        ...tokens.shadows.card,
      },
      rowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: tokens.border.subtle,
      },
      rowItemLast: {
        borderBottomWidth: 0,
      },
      rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
        marginRight: 10,
      },
      itemIconBox: {
        width: 36,
        height: 36,
        borderRadius: tokens.radii.md,
        backgroundColor: tokens.surface.subtle,
        alignItems: 'center',
        justifyContent: 'center',
      },
      rowTitle: {
        fontSize: 14.5,
        fontWeight: '600',
        color: tokens.text.primary,
      },
      rowSubtitle: {
        fontSize: 11.5,
        color: tokens.text.secondary,
        marginTop: 2,
      },
      themeCardsGrid: {
        flexDirection: 'row',
        gap: 8,
        padding: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: tokens.border.subtle,
      },
      themeCardOption: {
        flex: 1,
        borderRadius: tokens.radii.md,
        padding: 10,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: tokens.border.subtle,
        backgroundColor: tokens.surface.subtle,
      },
      themeCardSelected: {
        borderColor: tokens.brand.primary,
        backgroundColor: tokens.brand.surface,
      },
      themeIconCircle: {
        width: 32,
        height: 32,
        borderRadius: tokens.radii.pill,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
      },
      themeOptionLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: tokens.text.primary,
      },
      themeOptionSub: {
        fontSize: 10,
        color: tokens.text.secondary,
        marginTop: 2,
        textAlign: 'center',
      },
      fontSizesRow: {
        flexDirection: 'row',
        gap: 6,
      },
      fontPill: {
        width: 34,
        height: 32,
        borderRadius: tokens.radii.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tokens.surface.subtle,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
      },
      fontPillSelected: {
        backgroundColor: tokens.brand.primary,
        borderColor: tokens.brand.primary,
      },
      fontPillText: {
        fontSize: 12,
        fontWeight: '700',
        color: tokens.text.primary,
      },
      fontPillTextSelected: {
        color: '#FFFFFF',
      },
      statusChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.surface,
        borderWidth: 0.5,
        borderColor: tokens.brand.primary,
      },
      statusChipText: {
        fontSize: 11.5,
        fontWeight: '700',
        color: tokens.brand.primary,
      },
      aboutCard: {
        backgroundColor: tokens.surface.base,
        borderRadius: tokens.radii.lg,
        padding: 16,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      aboutMotto: {
        fontSize: 12,
        fontWeight: '600',
        color: tokens.brand.primary,
        marginTop: 8,
      },
      aboutDesc: {
        fontSize: 12,
        color: tokens.text.secondary,
        textAlign: 'center',
        lineHeight: 18,
        marginTop: 8,
      },
      aboutEditor: {
        fontSize: 13,
        fontWeight: 'bold',
        color: tokens.text.primary,
        marginTop: 10,
      },
      aboutVersion: {
        fontSize: 11,
        color: tokens.text.tertiary,
        marginTop: 4,
      },
    })
  );

  return (
    <View style={styles.container}>
      {/* Sticky Masthead Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={language === 'bn' ? 'ফিরে যান' : 'Go back'}
        >
          <Ionicons name="arrow-back" size={20} color={tokens.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>
            {t('settings_hub_title', language)}
          </Text>
          <Text style={styles.headerSubtitle}>
            {t('settings_hub_sub', language)}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. APPEARANCE & DISPLAY (রূপ ও ভিজ্যুয়াল ডিসপ্লে) */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBox}>
              <Ionicons name="color-palette" size={14} color={tokens.brand.primary} />
            </View>
            <Text style={styles.sectionTitle}>{t('appearance_title', language)}</Text>
          </View>

          <View style={styles.card}>
            {/* 3-Way Reading Theme Swatches */}
            <View style={styles.themeCardsGrid}>
              {[
                {
                  id: 'light' as const,
                  title: language === 'bn' ? 'লাইট' : 'Light',
                  sub: language === 'bn' ? 'স্বচ্ছ উজ্জ্বল' : 'Clean & Crisp',
                  icon: 'sunny' as const,
                  iconBg: '#FEF3C7',
                  iconColor: '#D97706',
                },
                {
                  id: 'sepia' as const,
                  title: language === 'bn' ? 'সেপিয়া' : 'Sepia',
                  sub: language === 'bn' ? 'সংবাদপত্র টোন' : 'Warm Paper',
                  icon: 'book' as const,
                  iconBg: '#F5EBDC',
                  iconColor: '#92400E',
                },
                {
                  id: 'dark' as const,
                  title: language === 'bn' ? 'ওলেড ডার্ক' : 'Dark',
                  sub: language === 'bn' ? 'চোখের আরাম' : 'OLED Battery',
                  icon: 'moon' as const,
                  iconBg: '#1F2937',
                  iconColor: '#60A5FA',
                },
              ].map((themeOpt) => {
                const isSelected = (themePreference || 'light') === themeOpt.id;
                return (
                  <TouchableOpacity
                    key={themeOpt.id}
                    style={[
                      styles.themeCardOption,
                      isSelected && styles.themeCardSelected,
                    ]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setThemePreference(themeOpt.id);
                    }}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.themeIconCircle,
                        { backgroundColor: themeOpt.iconBg },
                      ]}
                    >
                      <Ionicons
                        name={themeOpt.icon}
                        size={16}
                        color={themeOpt.iconColor}
                      />
                    </View>
                    <Text style={styles.themeOptionLabel}>{themeOpt.title}</Text>
                    <Text style={styles.themeOptionSub}>{themeOpt.sub}</Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={14}
                        color={tokens.brand.primary}
                        style={{ marginTop: 4 }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Language Selection */}
            <View style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <View style={styles.itemIconBox}>
                  <Ionicons name="language" size={18} color={tokens.brand.primary} />
                </View>
                <View>
                  <Text style={styles.rowTitle}>{t('language_select', language)}</Text>
                  <Text style={styles.rowSubtitle}>
                    {language === 'bn' ? 'বাংলা নির্বাচিত' : 'English Selected'}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {(['bn', 'en'] as const).map((lang) => {
                  const isCur = language === lang;
                  return (
                    <TouchableOpacity
                      key={lang}
                      style={[
                        styles.fontPill,
                        { width: 56 },
                        isCur && styles.fontPillSelected,
                      ]}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setLanguage(lang);
                      }}
                    >
                      <Text
                        style={[
                          styles.fontPillText,
                          isCur && styles.fontPillTextSelected,
                        ]}
                      >
                        {lang === 'bn' ? 'বাংলা' : 'EN'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Feed Presentation Layout */}
            <View style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <View style={styles.itemIconBox}>
                  <Ionicons name="albums-outline" size={18} color={tokens.brand.primary} />
                </View>
                <View>
                  <Text style={styles.rowTitle}>{t('feed_layout_label', language)}</Text>
                  <Text style={styles.rowSubtitle}>
                    {feedLayout === 'magazine'
                      ? (language === 'bn' ? 'ম্যাগাজিন ব্রডশিট ভিউ' : 'Magazine Broadsheet View')
                      : (language === 'bn' ? 'কমপ্যাক্ট দ্রুত তালিকা' : 'Dense Compact List')}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {[
                  { key: 'magazine' as const, label: language === 'bn' ? 'ম্যাগাজিন' : 'Magazine' },
                  { key: 'compact' as const, label: language === 'bn' ? 'কমপ্যাক্ট' : 'Compact' },
                ].map((item) => {
                  const isCur = feedLayout === item.key;
                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={[
                        styles.fontPill,
                        { width: 68 },
                        isCur && styles.fontPillSelected,
                      ]}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setFeedLayout(item.key);
                      }}
                    >
                      <Text
                        style={[
                          styles.fontPillText,
                          isCur && styles.fontPillTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Reading Font Size */}
            <View style={[styles.rowItem, styles.rowItemLast]}>
              <View style={styles.rowLeft}>
                <View style={styles.itemIconBox}>
                  <Ionicons name="text-outline" size={18} color={tokens.brand.primary} />
                </View>
                <View>
                  <Text style={styles.rowTitle}>{t('font_size_label', language)}</Text>
                  <Text style={styles.rowSubtitle}>
                    {fontSize === 'S'
                      ? (language === 'bn' ? 'ছোট হরফ' : 'Small')
                      : fontSize === 'M'
                        ? (language === 'bn' ? 'মাঝারি (প্রমিত)' : 'Medium (Standard)')
                        : fontSize === 'L'
                          ? (language === 'bn' ? 'বড় হরফ' : 'Large')
                          : (language === 'bn' ? 'খুব বড় হরফ' : 'Extra Large')}
                  </Text>
                </View>
              </View>
              <View style={styles.fontSizesRow}>
                {['S', 'M', 'L', 'XL'].map((size) => {
                  const isCur = fontSize === size;
                  return (
                    <TouchableOpacity
                      key={size}
                      style={[styles.fontPill, isCur && styles.fontPillSelected]}
                      onPress={() => handleChangeFontSize(size)}
                    >
                      <Text
                        style={[
                          styles.fontPillText,
                          isCur && styles.fontPillTextSelected,
                        ]}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        {/* 2. SMART AI ENGINE & BYOK (এআই সহকারী) */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBox}>
              <Ionicons name="sparkles" size={14} color={tokens.brand.primary} />
            </View>
            <Text style={styles.sectionTitle}>
              {language === 'bn' ? 'এআই সহকারী' : 'AI Assistant'}
            </Text>
          </View>

          <View style={styles.card}>
            {/* Active Provider Status Card */}
            <TouchableOpacity
              style={styles.rowItem}
              onPress={() => router.push('/settings/ai' as any)}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View
                  style={[
                    styles.itemIconBox,
                    { backgroundColor: tokens.brand.surface },
                  ]}
                >
                  <Ionicons name="hardware-chip" size={18} color={tokens.brand.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>
                    {PROVIDER_METADATA[aiProvider]?.name || 'Google Gemini AI'}
                  </Text>
                  <Text style={styles.rowSubtitle}>
                    {hasAiKey
                      ? (language === 'bn' ? 'কাস্টম কী সক্রিয়' : 'Custom Key Active')
                      : (language === 'bn' ? 'স্বয়ংক্রিয় ক্লাউড ইঞ্জিন' : 'Default Cloud Engine')}
                  </Text>
                </View>
              </View>
              <View style={styles.statusChip}>
                <Text style={styles.statusChipText}>
                  {language === 'bn' ? 'সেটিংস' : 'Settings'}
                </Text>
                <Ionicons name="chevron-forward" size={14} color={tokens.brand.primary} />
              </View>
            </TouchableOpacity>

            {/* Quick Provider Switcher */}
            <View style={[styles.rowItem, styles.rowItemLast]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowTitle, { fontSize: 13, marginBottom: 8 }]}>
                  {language === 'bn' ? 'ইঞ্জিন নির্বাচন:' : 'Select Engine:'}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8 }}
                >
                  {(['gemini', 'openai', 'groq', 'deepseek'] as const).map((prov) => {
                    const isCur = aiProvider === prov;
                    const meta = PROVIDER_METADATA[prov];
                    const label = prov === 'openai' ? 'ChatGPT' : meta.name;
                    return (
                      <TouchableOpacity
                        key={prov}
                        style={[
                          styles.fontPill,
                          {
                            width: 'auto',
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5,
                          },
                          isCur && styles.fontPillSelected,
                        ]}
                        onPress={() => handleSelectAiProvider(prov)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="sparkles"
                          size={11}
                          color={isCur ? '#FFFFFF' : tokens.brand.primary}
                        />
                        <Text
                          style={[
                            styles.fontPillText,
                            { fontSize: 11.5 },
                            isCur && styles.fontPillTextSelected,
                          ]}
                        >
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>

        {/* 3. NOTIFICATIONS (নোটিফিকেশন) */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBox}>
              <Ionicons name="notifications" size={14} color={tokens.brand.primary} />
            </View>
            <Text style={styles.sectionTitle}>
              {language === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}
            </Text>
          </View>

          <View style={styles.card}>
            {/* Breaking News Toggle */}
            <View style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <View style={styles.itemIconBox}>
                  <Ionicons name="flash" size={18} color="#DC2626" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>
                    {language === 'bn' ? 'ব্রেকিং নিউজ' : 'Breaking News'}
                  </Text>
                  <Text style={styles.rowSubtitle}>
                    {language === 'bn' ? 'তাত্ক্ষণিক অ্যালার্ট' : 'Instant push alerts'}
                  </Text>
                </View>
              </View>
              <Switch
                value={notifPrefs.breakingNews}
                onValueChange={(val) => handleToggleNotifFlag('breakingNews', val)}
                trackColor={{ false: tokens.border.strong, true: tokens.brand.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Daily Briefing Toggle */}
            <View style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <View style={styles.itemIconBox}>
                  <Ionicons name="sunny" size={18} color="#D97706" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>
                    {language === 'bn' ? 'দৈনিক বুলেটিন' : 'Daily Briefing'}
                  </Text>
                  <Text style={styles.rowSubtitle}>
                    {language === 'bn' ? 'সকাল ৮টার বুলেটিন' : 'Morning 8:00 AM summary'}
                  </Text>
                </View>
              </View>
              <Switch
                value={notifPrefs.dailyBriefing}
                onValueChange={(val) => handleToggleNotifFlag('dailyBriefing', val)}
                trackColor={{ false: tokens.border.strong, true: tokens.brand.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Notification Preferences Deep Link */}
            <TouchableOpacity
              style={styles.rowItem}
              onPress={() => router.push('/settings/notifications' as any)}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View style={styles.itemIconBox}>
                  <Ionicons name="options-outline" size={18} color={tokens.brand.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>
                    {language === 'bn' ? 'নোটিফিকেশন ফিল্টার' : 'Notification Filters'}
                  </Text>
                  <Text style={styles.rowSubtitle}>
                    {language === 'bn' ? 'শান্ত সময় ও ক্যাটাগরি' : 'Quiet hours & categories'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={tokens.interactive.inactive} />
            </TouchableOpacity>

            {/* Notification Inbox Deep Link */}
            <TouchableOpacity
              style={[styles.rowItem, styles.rowItemLast]}
              onPress={() => router.push('/notifications' as any)}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View style={styles.itemIconBox}>
                  <Ionicons name="mail-unread-outline" size={18} color={tokens.brand.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>
                    {t('notification_inbox', language)}
                  </Text>
                  <Text style={styles.rowSubtitle}>
                    {t('notification_inbox_sub', language)}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={tokens.interactive.inactive} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. INTERESTS & LOCATION (পছন্দ ও সংস্করণ) */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBox}>
              <Ionicons name="heart" size={14} color={tokens.brand.primary} />
            </View>
            <Text style={styles.sectionTitle}>
              {language === 'bn' ? 'পছন্দ ও সংস্করণ' : 'Interests & Edition'}
            </Text>
          </View>

          <View style={styles.card}>
            {/* Topic Interests Selection */}
            <TouchableOpacity
              style={styles.rowItem}
              onPress={() => router.push('/settings/interests' as any)}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View style={styles.itemIconBox}>
                  <Ionicons name="heart-outline" size={18} color={tokens.brand.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>
                    {language === 'bn' ? 'পছন্দের বিষয়' : 'Topic Interests'}
                  </Text>
                  <Text style={styles.rowSubtitle}>
                    {language === 'bn' ? 'ফিড ও সুপারিশ পরিবর্তন' : 'Tune feed suggestions'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={tokens.interactive.inactive} />
            </TouchableOpacity>

            {/* Edition & Prayer Division */}
            <TouchableOpacity
              style={[styles.rowItem, styles.rowItemLast]}
              onPress={() => setShowLocationModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View style={styles.itemIconBox}>
                  <Ionicons name="location-outline" size={18} color={tokens.brand.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>
                    {language === 'bn' ? 'সংস্করণ ও অবস্থান' : 'Edition & Location'}
                  </Text>
                  <Text style={styles.rowSubtitle}>
                    {prayerData.isGps
                      ? `${prayerData.division} (GPS)`
                      : `${prayerData.division || 'ঢাকা'}`}
                  </Text>
                </View>
              </View>
              <View style={styles.statusChip}>
                <Text style={styles.statusChipText}>
                  {prayerData.division || 'ঢাকা'}
                </Text>
                <Ionicons name="chevron-forward" size={14} color={tokens.brand.primary} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. DATA, OFFLINE & STORAGE (ডেটা ও স্টোরেজ) */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBox}>
              <Ionicons name="cellular" size={14} color={tokens.brand.primary} />
            </View>
            <Text style={styles.sectionTitle}>{t('data_storage_title', language)}</Text>
          </View>

          <View style={styles.card}>
            {/* Low Data Mode Toggle */}
            <View style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <View style={styles.itemIconBox}>
                  <Ionicons name="cellular-outline" size={18} color={tokens.brand.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{t('data_saver', language)}</Text>
                  <Text style={styles.rowSubtitle}>{t('data_saver_sub', language)}</Text>
                </View>
              </View>
              <Switch
                value={lowDataMode}
                onValueChange={handleToggleLowData}
                trackColor={{ false: tokens.border.strong, true: tokens.brand.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Offline Cache & Clear Cache */}
            <View style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <View style={styles.itemIconBox}>
                  <Ionicons name="cloud-offline-outline" size={18} color={tokens.brand.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>
                    {language === 'bn' ? 'অফলাইন ক্যাশ' : 'Offline Cache'}
                  </Text>
                  <Text style={styles.rowSubtitle}>
                    {language === 'bn'
                      ? `${formatLocalizedNumeral(cachedCount, 'bn')}টি সংবাদ সংরক্ষিত`
                      : `${cachedCount} cached articles`}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.statusChip, { borderColor: '#DC2626', backgroundColor: '#FEE2E2' }]}
                onPress={handleClearCache}
                disabled={isClearingCache || cachedCount === 0}
              >
                {isClearingCache ? (
                  <ActivityIndicator size="small" color="#DC2626" />
                ) : (
                  <>
                    <Ionicons name="trash-outline" size={13} color="#DC2626" />
                    <Text style={[styles.statusChipText, { color: '#DC2626' }]}>
                      {t('clear_cache', language)}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Export Reading Data */}
            <TouchableOpacity
              style={[styles.rowItem, styles.rowItemLast]}
              onPress={() => router.push('/settings/export' as any)}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View style={styles.itemIconBox}>
                  <Ionicons name="download-outline" size={18} color={tokens.brand.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>
                    {language === 'bn' ? 'ডেটা এক্সপোর্ট' : 'Data Export'}
                  </Text>
                  <Text style={styles.rowSubtitle}>
                    {language === 'bn' ? 'বুকমার্ক ও ইতিহাস ব্যাকআপ' : 'Export bookmarks & history'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={tokens.interactive.inactive} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 6. PRIVACY & SYNC (গোপনীয়তা) */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBox}>
              <Ionicons name="shield-checkmark" size={14} color={tokens.brand.primary} />
            </View>
            <Text style={styles.sectionTitle}>{t('privacy_security_title', language)}</Text>
          </View>

          <View style={styles.card}>
            {/* Cloud Sync State */}
            <View style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <View style={styles.itemIconBox}>
                  <Ionicons name="cloud-done-outline" size={18} color={tokens.brand.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{t('cloud_sync', language)}</Text>
                  <Text style={styles.rowSubtitle}>
                    {syncState.isSyncing
                      ? (language === 'bn' ? 'সিঙ্ক হচ্ছে...' : 'Syncing...')
                      : syncState.lastSyncedAt
                        ? (language === 'bn' ? 'সিঙ্ক সম্পন্ন' : 'Synced')
                        : (language === 'bn' ? 'লোকাল মোড' : 'Local mode')}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.statusChip}
                onPress={handleSyncNow}
                disabled={syncState.isSyncing}
              >
                {syncState.isSyncing ? (
                  <ActivityIndicator size="small" color={tokens.brand.primary} />
                ) : (
                  <>
                    <Ionicons name="sync" size={13} color={tokens.brand.primary} />
                    <Text style={styles.statusChipText}>
                      {language === 'bn' ? 'সিঙ্ক' : 'Sync'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Privacy Policy */}
            <TouchableOpacity
              style={[styles.rowItem, styles.rowItemLast]}
              onPress={() => router.push('/settings/privacy' as any)}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View style={styles.itemIconBox}>
                  <Ionicons name="lock-closed-outline" size={18} color={tokens.brand.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>
                    {language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
                  </Text>
                  <Text style={styles.rowSubtitle}>
                    {language === 'bn' ? 'ডিভাইস আইডি ও ডেটা সুরক্ষা' : 'Device ID & Data Rights'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={tokens.interactive.inactive} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 7. APP UPDATES (আপডেট) */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBox}>
              <Ionicons name="sync-circle" size={14} color={tokens.brand.primary} />
            </View>
            <Text style={styles.sectionTitle}>
              {language === 'bn' ? 'আপডেট' : 'Updates'}
            </Text>
          </View>

          <View style={styles.card}>
            <View style={[styles.rowItem, styles.rowItemLast]}>
              <View style={styles.rowLeft}>
                <View style={styles.itemIconBox}>
                  <Ionicons name="cloud-download-outline" size={18} color={tokens.brand.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>
                    {language === 'bn' ? 'আপডেট পরীক্ষা' : 'Check Updates'}
                  </Text>
                  <Text style={styles.rowSubtitle}>
                    {language === 'bn' ? 'সংস্করণ: ১.৪.২ (লেটেস্ট)' : 'Version 1.4.2'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.statusChip}
                onPress={handleCheckOta}
                disabled={checkingUpdate}
              >
                {checkingUpdate ? (
                  <ActivityIndicator size="small" color={tokens.brand.primary} />
                ) : (
                  <>
                    <Ionicons name="refresh" size={13} color={tokens.brand.primary} />
                    <Text style={styles.statusChipText}>
                      {t('check_updates', language)}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 8. ABOUT AMAR DESH (পরিচিতি) */}
        <View style={styles.sectionWrapper}>
          <View style={styles.aboutCard}>
            <AmarDeshLogo height={32} variant="png" showMotto language={language} />
            <Text style={styles.aboutMotto}>
              {language === 'bn' ? 'স্বাধীনতার কথা বলে' : 'Voice of Freedom'}
            </Text>
            <Text style={styles.aboutDesc}>
              {language === 'bn'
                ? 'দৈনিক আমার দেশ বাংলাদেশসহ বিশ্বের শীর্ষস্থানীয় বাংলা ডিজিটাল সংবাদপত্র। বস্তুনিষ্ঠ, আপসহীন ও নির্ভীক সাংবাদিকতার মূল ধারা।'
                : 'Daily Amar Desh is Bangladesh’s leading independent national broadsheet newspaper and digital media portal.'}
            </Text>
            <Text style={styles.aboutEditor}>
              {language === 'bn' ? 'সম্পাদক ও প্রকাশক: মাহমুদুর রহমান' : 'Editor & Publisher: Mahmudur Rahman'}
            </Text>
            <Text style={styles.aboutVersion}>
              {language === 'bn'
                ? 'কারওয়ান বাজার, ঢাকা-১২১৫ • সংস্করণ ১.৪.২'
                : 'Karwan Bazar, Dhaka-1215 • Version 1.4.2'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* District & Location Picker Modal */}
      <DistrictPickerModal
        visible={showLocationModal}
        selectedDivision={prayerData.division}
        isGps={Boolean(prayerData.isGps)}
        onRequestGps={async () => {
          const res = await requestGpsPrayerTimes();
          if (res.success && res.data) setPrayerData(res.data);
        }}
        onResetDhaka={async () => {
          const res = await resetToDhakaDefault();
          setPrayerData(res);
        }}
        onClose={() => setShowLocationModal(false)}
      />
    </View>
  );
}
