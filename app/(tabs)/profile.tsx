import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import SyncStatus from '../../components/SyncStatus';
import { useAppStore } from '../../store/useAppStore';
import { useThemedStyles, useThemeTokens } from '../../theme';
import {
  signOut,
  onAuthStateChange,
} from '../../services/firebase';
import { getSafeHeaderPaddingTop } from '../../utils/layout';
import { AmarDeshLogo } from '../../components/AmarDeshLogo';
import { checkForOtaUpdate, applyOtaUpdate } from '../../services/otaUpdateService';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface ProfileMenuItem {
  icon: IoniconName;
  label: string;
  action: () => void;
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tokens = useThemeTokens();
  const themePreference = useAppStore((state) => state.themePreference);
  const setThemePreference = useAppStore((state) => state.setThemePreference);
  const darkMode = themePreference === 'dark';
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [checkingUpdate, setCheckingUpdate] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setIsAuth(!!user);
      setUserName(user?.displayName || user?.email || null);
    });
    return unsubscribe;
  }, []);

  const handleCheckOtaUpdate = async () => {
    setCheckingUpdate(true);
    try {
      const updateInfo = await checkForOtaUpdate();
      if (updateInfo.isAvailable) {
        Alert.alert(
          'নতুন আপডেট উপলব্ধ!',
          `সংস্করণ: ${updateInfo.latestVersion}\n\n${updateInfo.releaseNotes}\n\nআপনি কি এখনই আপডেটটি ডাউনলোড করে সক্রিয় করতে চান?`,
          [
            { text: 'পরে', style: 'cancel' },
            {
              text: 'এখনই আপডেট করুন',
              onPress: async () => {
                const res = await applyOtaUpdate();
                Alert.alert('আপডেট', res.message);
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'অ্যাপ আপ-টু-ডেট আছে',
          `বর্তমান সংস্করণ: ১.৩.০ (লেটেস্ট রিলিজ)\nসর্বশেষ পরীক্ষা: ${updateInfo.lastChecked || 'এইমাত্র'}\n\nআপনার ডিভাইসে দৈনিক আমার দেশের সমস্ত নতুন ফিচার ও নিরাপত্তা আপডেট সচল রয়েছে।`
        );
      }
    } catch {
      Alert.alert('ত্রুটি', 'আপডেট পরীক্ষা করতে ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।');
    } finally {
      setCheckingUpdate(false);
    }
  };

  const menuItems: ProfileMenuItem[] = [
    { icon: 'sparkles-outline', label: 'স্মার্ট AI সহকারী সেটিংস', action: () => router.push('/settings/ai' as any) },
    { icon: 'cloud-download-outline', label: 'অ্যাপ আপডেট পরীক্ষা (OTA)', action: handleCheckOtaUpdate },
    { icon: 'notifications-outline', label: 'নোটিফিকেশন ইনবক্স', action: () => router.push('/notifications' as any) },
    { icon: 'newspaper-outline', label: 'ই-পেপার সংস্করণ', action: () => router.push('/epaper' as any) },
    { icon: 'videocam-outline', label: 'ভিডিও ও মাল্টিমিডিয়া', action: () => router.push('/video' as any) },
    { icon: 'bookmark-outline', label: 'সংরক্ষিত সংবাদ', action: () => router.push('/bookmarks' as any) },
    { icon: 'options-outline', label: 'নোটিফিকেশন নিয়ন্ত্রণ সেটিংস', action: () => router.push('/settings/notifications' as any) },
    { icon: 'heart-outline', label: 'পছন্দের বিষয়সমূহ (আগ্রহ)', action: () => router.push('/settings/interests' as any) },
    { icon: 'shield-checkmark-outline', label: 'গোপনীয়তা ও নিরাপত্তা', action: () => router.push('/settings/privacy' as any) },
    { icon: 'download-outline', label: 'পড়ার ডেটা এক্সপোর্ট', action: () => router.push('/settings/export' as any) },
    {
      icon: 'information-circle-outline',
      label: 'আমার দেশ সম্পর্কে',
      action: () => {
        Alert.alert(
          'আমার দেশ সম্পর্কে',
          'দৈনিক আমার দেশ — স্বাধীনতার কথা বলে\n\nসম্পাদক ও প্রকাশক: মাহমুদুর রহমান\nকারওয়ান বাজার, ঢাকা-১২১৫।\nফোন: +৮৮০২-৯১১৮৮৫১'
        );
      },
    },
  ];

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: tokens.surface.subtle,
      },
      header: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      section: {
        backgroundColor: tokens.surface.base,
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: tokens.border.default,
      },
      appInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      },
      logo: {
        backgroundColor: tokens.brand.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
      },
      logoText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
      },
      appName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      tagline: {
        fontSize: 12,
        color: tokens.text.secondary,
        marginTop: 2,
      },
      menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
      },
      menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.subtle,
      },
      menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      },
      menuLabel: {
        fontSize: 15,
        color: tokens.text.primary,
        fontWeight: '500',
      },
      linkItem: {
        paddingVertical: 8,
      },
      linkText: {
        fontSize: 14,
        color: tokens.brand.primary,
        fontWeight: '500',
      },
      versionContainer: {
        alignItems: 'center',
        paddingVertical: 24,
      },
      versionText: {
        fontSize: 12,
        color: tokens.text.tertiary,
      },
    })
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: getSafeHeaderPaddingTop(insets.top, 0),
        paddingBottom: 32,
      }}
    >
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.title}>প্রোফাইল ও সেটিংস</Text>
          <AmarDeshLogo height={24} variant="png" />
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <View style={styles.appInfo}>
          <AmarDeshLogo height={32} variant="png" showMotto />
        </View>
      </View>

      {/* Sync Status */}
      <SyncStatus onLoginPress={() => router.push('/auth/login' as any)} />

      {/* Logout Button (if authenticated) */}
      {isAuth && (
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              Alert.alert(
                'লগআউট',
                'আপনি কি লগআউট করতে চান?',
                [
                  { text: 'বাতিল', style: 'cancel' },
                  {
                    text: 'লগআউট',
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        await signOut();
                        Alert.alert('সফল', 'সফলভাবে লগআউট হয়েছে');
                      } catch (error) {
                        Alert.alert('ত্রুটি', 'লগআউট করতে সমস্যা হয়েছে');
                      }
                    },
                  },
                ]
              );
            }}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="log-out-outline" size={22} color={tokens.status.error} />
              <Text style={[styles.menuLabel, { color: tokens.status.error }]}>লগআউট</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={tokens.interactive.inactive} />
          </TouchableOpacity>
        </View>
      )}

      {/* Dark Mode Toggle */}
      <View style={styles.section}>
        <View style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons
              name={darkMode ? 'moon' : 'sunny'}
              size={22}
              color={tokens.brand.primary}
            />
            <Text style={styles.menuLabel}>ডার্ক মোড (Dark Theme)</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={(value) =>
              setThemePreference(value ? 'dark' : 'light')
            }
            trackColor={{ false: tokens.border.strong, true: tokens.brand.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.section}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index < menuItems.length - 1 && styles.menuItemBorder,
            ]}
            onPress={item.action}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon} size={22} color={tokens.brand.primary} />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={tokens.interactive.inactive} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Official Links */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.linkItem}
          onPress={() => Linking.openURL('https://www.dailyamardesh.com')}
        >
          <Text style={styles.linkText}>🌐 অফিসিয়াল ওয়েবসাইট: dailyamardesh.com</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkItem}
          onPress={() => router.push('/epaper' as any)}
        >
          <Text style={styles.linkText}>📰 ডিজিটাল ই-পেপার সংস্করণ</Text>
        </TouchableOpacity>
      </View>

      {/* Version & OTA Trigger */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>সংস্করণ ১.৩.০ • সাইবারক্র্যাফট (CybrCraft)</Text>
        <TouchableOpacity
          onPress={handleCheckOtaUpdate}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}
          disabled={checkingUpdate}
          activeOpacity={0.7}
        >
          {checkingUpdate ? (
            <ActivityIndicator size="small" color={tokens.brand.primary} />
          ) : (
            <>
              <Ionicons name="refresh-outline" size={14} color={tokens.brand.primary} />
              <Text style={{ fontSize: 12, color: tokens.brand.primary, fontWeight: '600' }}>
                আপডেট পরীক্ষা করুন (OTA)
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
