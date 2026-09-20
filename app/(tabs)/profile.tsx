import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import SyncStatus from '../../components/SyncStatus';
import {
  signOut,
  onAuthStateChange,
} from '../../services/firebase';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface ProfileMenuItem {
  icon: IoniconName;
  label: string;
  action: () => void;
}

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setIsAuth(!!user);
      setUserName(user?.displayName || user?.email || null);
    });
    return unsubscribe;
  }, []);

  const menuItems: ProfileMenuItem[] = [
    { icon: 'notifications-outline', label: 'নোটিফিকেশন', action: () => router.push('/settings/notifications') },
    { icon: 'shield-checkmark-outline', label: 'গোপনীয়তা', action: () => router.push('/settings/privacy') },
    { icon: 'newspaper-outline', label: 'ইপেপার', action: () => {} },
    { icon: 'videocam-outline', label: 'ভিডিও', action: () => {} },
    { icon: 'chatbubble-outline', label: 'AI সহকারী', action: () => {} },
    { icon: 'settings-outline', label: 'সেটিংস', action: () => {} },
    { icon: 'information-circle-outline', label: 'আমাদের সম্পর্কে', action: () => {} },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>আরও</Text>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <View style={styles.appInfo}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>আ.দে</Text>
          </View>
          <View>
            <Text style={styles.appName}>আমার দেশ</Text>
            <Text style={styles.tagline}>স্বাধীনতার কথা বলে</Text>
          </View>
        </View>
      </View>

      {/* Sync Status */}
      <SyncStatus onLoginPress={() => router.push('/auth/login')} />

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
              <Ionicons name="log-out-outline" size={24} color="#DC2626" />
              <Text style={[styles.menuLabel, { color: '#DC2626' }]}>লগআউট</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      )}

      {/* Dark Mode Toggle */}
      <View style={styles.section}>
        <View style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="moon-outline" size={24} color="#006B3F" />
            <Text style={styles.menuLabel}>ডার্ক মোড</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#D1D5DB', true: '#006B3F' }}
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
              <Ionicons name={item.icon} size={24} color="#006B3F" />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Links */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.linkItem}>
          <Text style={styles.linkText}>🌐 ওয়েবসাইট</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkItem}>
          <Text style={styles.linkText}>📰 ই-পেপার</Text>
        </TouchableOpacity>
      </View>

      {/* Version */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>সংস্করণ ১.৩.০</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    backgroundColor: '#006B3F',
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
    color: '#111827',
  },
  tagline: {
    fontSize: 12,
    color: '#6B7280',
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
    borderBottomColor: '#F3F4F6',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuLabel: {
    fontSize: 16,
    color: '#111827',
  },
  linkItem: {
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 14,
    color: '#006B3F',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
