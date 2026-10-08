import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeTokens, useThemedStyles } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { useUserStore } from '../user';
import { t, SupportedLanguage } from '../services/i18n';
import { AmarDeshLogo } from './AmarDeshLogo';
import { DistrictPickerModal } from './DistrictPickerModal';
import {
  getSavedPrayerData,
  requestGpsPrayerTimes,
  resetToDhakaDefault,
  PrayerTimeData,
  getPrayerTimesForDivision,
} from '../services/prayerTimesService';

interface SideNavDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 340);

export function SideNavDrawer({ visible, onClose }: SideNavDrawerProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tokens = useThemeTokens();
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const themePreference = useAppStore((state) => state.themePreference);
  const setThemePreference = useAppStore((state) => state.setThemePreference);
  const feedLayout = useAppStore((state) => state.feedLayout);
  const setFeedLayout = useAppStore((state) => state.setFeedLayout);
  const userId = useUserStore((state) => state.userId);

  const [modalVisible, setModalVisible] = useState(visible);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [prayerData, setPrayerData] = useState<PrayerTimeData>(
    getPrayerTimesForDivision('ঢাকা')
  );

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getSavedPrayerData().then(setPrayerData);
  }, []);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalVisible(false);
      });
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      onClose();
    });
  };

  const navigateTo = (path: string) => {
    handleClose();
    setTimeout(() => {
      router.push(path as any);
    }, 150);
  };

  const handleRequestGps = async () => {
    const result = await requestGpsPrayerTimes();
    if (result.success && result.data) {
      setPrayerData(result.data);
    }
  };

  const handleResetDhaka = async () => {
    const defaultData = await resetToDhakaDefault();
    setPrayerData(defaultData);
  };

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
      },
      backdropTouchable: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      drawerContainer: {
        width: DRAWER_WIDTH,
        height: '100%',
        backgroundColor: tokens.surface.base,
        borderRightWidth: 1,
        borderRightColor: tokens.border.default,
        paddingTop: Math.max(insets.top, 16),
        paddingBottom: Math.max(insets.bottom, 16),
        ...tokens.shadows.card,
      },
      drawerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.subtle,
      },
      closeBtn: {
        width: 36,
        height: 36,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.subtle,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
      },
      userCard: {
        marginHorizontal: 14,
        marginTop: 12,
        marginBottom: 8,
        padding: 12,
        borderRadius: tokens.radii.md,
        backgroundColor: tokens.surface.subtle,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      },
      userAvatarBox: {
        width: 40,
        height: 40,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: tokens.brand.primary,
      },
      userCardInfo: {
        flex: 1,
      },
      userNameText: {
        fontSize: 13.5,
        fontWeight: '700',
        color: tokens.text.primary,
      },
      userStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
      },
      statusDot: {
        width: 6,
        height: 6,
        borderRadius: tokens.radii.pill,
        backgroundColor: '#10B981',
      },
      userStatusText: {
        fontSize: 11,
        color: tokens.text.secondary,
        fontWeight: '500',
      },
      scrollArea: {
        flex: 1,
        paddingHorizontal: 12,
        paddingTop: 6,
      },
      sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: tokens.text.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginTop: 12,
        marginBottom: 6,
        marginHorizontal: 8,
      },
      navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: tokens.radii.md,
        marginBottom: 3,
      },
      navItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
      },
      navIconBox: {
        width: 32,
        height: 32,
        borderRadius: tokens.radii.sm,
        backgroundColor: tokens.surface.subtle,
        alignItems: 'center',
        justifyContent: 'center',
      },
      navText: {
        fontSize: 14,
        fontWeight: '600',
        color: tokens.text.primary,
      },
      badgeTag: {
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.crimsonSurface,
      },
      badgeTagText: {
        fontSize: 10,
        fontWeight: '700',
        color: tokens.brand.secondary,
      },
      layoutPillsRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 6,
        marginBottom: 14,
      },
      layoutPill: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingVertical: 9,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
      },
      layoutPillActive: {
        backgroundColor: tokens.brand.primary,
        borderColor: tokens.brand.primary,
      },
      layoutPillText: {
        fontSize: 12,
        fontWeight: '600',
        color: tokens.text.secondary,
      },
      layoutPillTextActive: {
        color: '#FFFFFF',
        fontWeight: '700',
      },
      settingsHeroCard: {
        marginTop: 12,
        marginBottom: 8,
        padding: 12,
        borderRadius: tokens.radii.lg,
        backgroundColor: tokens.brand.surface,
        borderWidth: 1,
        borderColor: tokens.brand.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...tokens.shadows.sm,
      },
      settingsHeroLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
      },
      settingsIconBox: {
        width: 40,
        height: 40,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.primary,
        alignItems: 'center',
        justifyContent: 'center',
      },
      settingsHeroTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: tokens.brand.primary,
      },
      settingsHeroSubtitle: {
        fontSize: 11,
        color: tokens.text.secondary,
        marginTop: 1,
      },
      drawerFooter: {
        paddingHorizontal: 14,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: tokens.border.subtle,
      },
      quickControlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
      },
      themeToggleGroup: {
        flexDirection: 'row',
        backgroundColor: tokens.surface.subtle,
        borderRadius: tokens.radii.pill,
        padding: 2,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
      },
      themeBtn: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: tokens.radii.pill,
      },
      themeBtnActive: {
        backgroundColor: tokens.brand.primary,
      },
      themeBtnText: {
        fontSize: 12,
        color: tokens.text.secondary,
        fontWeight: '600',
      },
      themeBtnTextActive: {
        color: '#FFFFFF',
      },
      langPillBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.subtle,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
      },
      langPillText: {
        fontSize: 12,
        fontWeight: '700',
        color: tokens.brand.primary,
      },
      footerMotto: {
        fontSize: 10.5,
        color: tokens.text.tertiary,
        textAlign: 'center',
        marginTop: 4,
      },
      footerEditor: {
        fontSize: 11,
        fontWeight: '600',
        color: tokens.text.secondary,
        textAlign: 'center',
        marginTop: 2,
      },
    })
  );

  if (!modalVisible) return null;

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.backdropTouchable, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={handleClose}
            accessibilityLabel={t('side_nav_close', language)}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.drawerContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Drawer Header */}
          <View style={styles.drawerHeader}>
            <AmarDeshLogo height={26} variant="png" showMotto language={language} />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleClose}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={t('side_nav_close', language)}
            >
              <Ionicons name="close" size={20} color={tokens.text.primary} />
            </TouchableOpacity>
          </View>

          {/* User Profile & Sync Status */}
          <TouchableOpacity
            style={styles.userCard}
            onPress={() => navigateTo('/(tabs)/profile')}
            activeOpacity={0.75}
          >
            <View style={styles.userAvatarBox}>
              <Ionicons name="person" size={20} color={tokens.brand.primary} />
            </View>
            <View style={styles.userCardInfo}>
              <Text style={styles.userNameText}>
                {language === 'bn' ? 'সম্মানিত পাঠক' : 'Valued Reader'}
              </Text>
              <View style={styles.userStatusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.userStatusText}>
                  {userId ? (language === 'bn' ? 'ক্লাউড সিঙ্ক সক্রিয়' : 'Cloud Sync Active') : (language === 'bn' ? 'অফলাইন মোড' : 'Offline Mode')}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={tokens.text.tertiary} />
          </TouchableOpacity>

          {/* Navigation Items */}
          <ScrollView
            style={styles.scrollArea}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {/* Primary News Navigation */}
            <Text style={styles.sectionLabel}>
              {language === 'bn' ? 'বিভাগ' : 'Sections'}
            </Text>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigateTo('/(tabs)')}
              activeOpacity={0.7}
            >
              <View style={styles.navItemLeft}>
                <View style={styles.navIconBox}>
                  <Ionicons name="home-outline" size={18} color={tokens.brand.primary} />
                </View>
                <Text style={styles.navText}>
                  {language === 'bn' ? 'প্রচ্ছদ' : 'Home'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={tokens.interactive.inactive} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigateTo('/(tabs)/epaper')}
              activeOpacity={0.7}
            >
              <View style={styles.navItemLeft}>
                <View style={styles.navIconBox}>
                  <Ionicons name="newspaper-outline" size={18} color={tokens.brand.primary} />
                </View>
                <Text style={styles.navText}>
                  {language === 'bn' ? 'ই-পেপার' : 'ePaper'}
                </Text>
              </View>
              <View style={styles.badgeTag}>
                <Text style={styles.badgeTagText}>{language === 'bn' ? 'নতুন' : 'New'}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigateTo('/(tabs)/video')}
              activeOpacity={0.7}
            >
              <View style={styles.navItemLeft}>
                <View style={styles.navIconBox}>
                  <Ionicons name="play-circle-outline" size={18} color={tokens.brand.primary} />
                </View>
                <Text style={styles.navText}>
                  {language === 'bn' ? 'ভিডিও' : 'Video'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={tokens.interactive.inactive} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigateTo('/(tabs)/bookmarks')}
              activeOpacity={0.7}
            >
              <View style={styles.navItemLeft}>
                <View style={styles.navIconBox}>
                  <Ionicons name="bookmark-outline" size={18} color={tokens.brand.primary} />
                </View>
                <Text style={styles.navText}>
                  {language === 'bn' ? 'সংরক্ষিত' : 'Saved'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={tokens.interactive.inactive} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigateTo('/(tabs)/foryou')}
              activeOpacity={0.7}
            >
              <View style={styles.navItemLeft}>
                <View style={styles.navIconBox}>
                  <Ionicons name="sparkles-outline" size={18} color={tokens.brand.primary} />
                </View>
                <Text style={styles.navText}>
                  {language === 'bn' ? 'আপনার জন্য' : 'For You'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={tokens.interactive.inactive} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigateTo('/july-revolution')}
              activeOpacity={0.7}
            >
              <View style={styles.navItemLeft}>
                <View style={[styles.navIconBox, { backgroundColor: tokens.brand.crimsonSurface }]}>
                  <Ionicons name="flame" size={18} color={tokens.brand.secondary} />
                </View>
                <Text style={[styles.navText, { color: tokens.brand.secondary }]}>
                  {language === 'bn' ? 'জুলাই বিপ্লব' : 'July Revolution'}
                </Text>
              </View>
              <View style={styles.badgeTag}>
                <Text style={styles.badgeTagText}>{language === 'bn' ? 'স্মারক' : 'Archive'}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => setShowLocationModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.navItemLeft}>
                <View style={styles.navIconBox}>
                  <Ionicons name="moon-outline" size={18} color={tokens.brand.primary} />
                </View>
                <Text style={styles.navText}>
                  {language === 'bn' ? 'নামাজের সময়' : 'Prayer Times'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={tokens.interactive.inactive} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigateTo('/notifications')}
              activeOpacity={0.7}
            >
              <View style={styles.navItemLeft}>
                <View style={styles.navIconBox}>
                  <Ionicons name="notifications-outline" size={18} color={tokens.brand.primary} />
                </View>
                <Text style={styles.navText}>
                  {language === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={tokens.interactive.inactive} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigateTo('/sponsored')}
              activeOpacity={0.7}
            >
              <View style={styles.navItemLeft}>
                <View style={[styles.navIconBox, { backgroundColor: tokens.brand.crimsonSurface }]}>
                  <Ionicons name="cart-outline" size={18} color={tokens.brand.primary} />
                </View>
                <Text style={styles.navText}>
                  {language === 'bn' ? 'স্পন্সরড শপ ও ডিলস' : 'Sponsored Deals'}
                </Text>
              </View>
              <View style={styles.badgeTag}>
                <Text style={styles.badgeTagText}>{language === 'bn' ? 'ডিলস' : 'Deals'}</Text>
              </View>
            </TouchableOpacity>

            {/* FEED LAYOUT SELECTOR */}
            <Text style={styles.sectionLabel}>
              {language === 'bn' ? 'ফিড লেআউট' : 'Feed Layout'}
            </Text>

            <View style={styles.layoutPillsRow}>
              {[
                {
                  key: 'magazine' as const,
                  label: language === 'bn' ? 'ম্যাগাজিন' : 'Magazine',
                  icon: 'list-outline',
                },
                {
                  key: 'compact' as const,
                  label: language === 'bn' ? 'লিস্ট' : 'List',
                  icon: 'grid-outline',
                },
                {
                  key: 'card' as const,
                  label: language === 'bn' ? 'কার্ড' : 'Card',
                  icon: 'albums-outline',
                },
              ].map((item) => {
                const isCur = feedLayout === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.layoutPill, isCur && styles.layoutPillActive]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setFeedLayout(item.key);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={14}
                      color={isCur ? '#FFFFFF' : tokens.text.secondary}
                    />
                    <Text
                      style={[
                        styles.layoutPillText,
                        isCur && styles.layoutPillTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* SETTINGS ENTRY */}
            <Text style={styles.sectionLabel}>
              {language === 'bn' ? 'সেটিংস' : 'Settings'}
            </Text>

            <TouchableOpacity
              style={styles.settingsHeroCard}
              onPress={() => navigateTo('/settings')}
              activeOpacity={0.8}
            >
              <View style={styles.settingsHeroLeft}>
                <View style={styles.settingsIconBox}>
                  <Ionicons name="settings" size={22} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingsHeroTitle}>
                    {t('settings_hub_title', language)}
                  </Text>
                  <Text style={styles.settingsHeroSubtitle} numberOfLines={1}>
                    {t('settings_hub_sub', language)}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={tokens.brand.primary} />
            </TouchableOpacity>
          </ScrollView>

          {/* Quick Drawer Footer */}
          <View style={styles.drawerFooter}>
            <View style={styles.quickControlsRow}>
              {/* Theme Quick Switcher */}
              <View style={styles.themeToggleGroup}>
                {[
                  { value: 'light' as const, label: '☀️' },
                  { value: 'sepia' as const, label: '📜' },
                  { value: 'dark' as const, label: '🌙' },
                ].map((th) => {
                  const isActive = (themePreference || 'light') === th.value;
                  return (
                    <TouchableOpacity
                      key={th.value}
                      style={[styles.themeBtn, isActive && styles.themeBtnActive]}
                      onPress={() => setThemePreference(th.value)}
                    >
                      <Text
                        style={[
                          styles.themeBtnText,
                          isActive && styles.themeBtnTextActive,
                        ]}
                      >
                        {th.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Language Quick Switcher */}
              <TouchableOpacity
                style={styles.langPillBtn}
                onPress={() => {
                  const nextLang = language === 'bn' ? 'en' : 'bn';
                  setLanguage(nextLang);
                }}
              >
                <Ionicons name="language" size={14} color={tokens.brand.primary} />
                <Text style={styles.langPillText}>
                  {language === 'bn' ? 'English' : 'বাংলা'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.footerEditor}>
              {language === 'bn' ? 'সম্পাদক ও প্রকাশক: মাহমুদুর রহমান' : 'Editor & Publisher: Mahmudur Rahman'}
            </Text>
            <Text style={styles.footerMotto}>
              {language === 'bn' ? 'দৈনিক আমার দেশ • সংস্করণ ১.৪.২' : 'Daily Amar Desh • Version 1.4.2'}
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* District & Location Picker Modal */}
      <DistrictPickerModal
        visible={showLocationModal}
        selectedDivision={prayerData.division}
        isGps={Boolean(prayerData.isGps)}
        onRequestGps={handleRequestGps}
        onResetDhaka={handleResetDhaka}
        onClose={() => setShowLocationModal(false)}
      />
    </Modal>
  );
}
