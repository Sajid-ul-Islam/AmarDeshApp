import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import {
  isAuthenticated,
  getCurrentUser,
  onAuthStateChange,
  syncToCloud,
  pullFromCloud,
  getLastSyncTime,
  isSyncInProgress,
} from '../services/firebase';

interface SyncStatusProps {
  onLoginPress?: () => void;
}

export default function SyncStatus({ onLoginPress }: SyncStatusProps) {
  const { tokens } = useTheme();
  const colors = {
    surface: tokens.surface.base,
    text: tokens.text.primary,
    textSecondary: tokens.text.secondary,
    primary: tokens.brand.primary,
    white: '#FFFFFF',
    success: tokens.status.success,
  };
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<number>(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      setIsAuth(!!user);
      setUserName(user?.displayName || user?.email || null);
    });

    // Update sync status periodically
    const interval = setInterval(() => {
      setLastSync(getLastSyncTime());
      setSyncing(isSyncInProgress());
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleSync = async () => {
    const user = getCurrentUser();
    if (!user) return;

    setSyncing(true);
    try {
      await syncToCloud(user.uid);
      setLastSync(getLastSyncTime());
    } catch (error) {
      console.error('[SyncStatus] Sync error:', error);
    } finally {
      setSyncing(false);
    }
  };

  const formatLastSync = (timestamp: number): string => {
    if (!timestamp) return 'কখনো সিঙ্ক হয়নি';

    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'এইমাত্র';
    if (minutes < 60) return `${minutes} মিনিট আগে`;
    if (hours < 24) return `${hours} ঘণ্টা আগে`;
    return `${days} দিন আগে`;
  };

  // Not authenticated
  if (!isAuth) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <View style={styles.iconContainer}>
          <Ionicons name="cloud-offline-outline" size={24} color={colors.textSecondary} />
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>ক্লাউড সিঙ্ক বন্ধ</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            লগইন করুন সব ডিভাইসে ডেটা সিঙ্ক করতে
          </Text>
        </View>
        {onLoginPress && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={onLoginPress}
          >
            <Text style={[styles.buttonText, { color: colors.white }]}>লগইন করুন</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Authenticated
  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.iconContainer}>
        {syncing ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons name="cloud-done" size={24} color={colors.success} />
        )}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {userName || 'ব্যবহারকারী'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          শেষ সিঙ্ক: {formatLastSync(lastSync)}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.syncButton, { borderColor: colors.primary }]}
        onPress={handleSync}
        disabled={syncing}
      >
        <Ionicons name="sync" size={16} color={colors.primary} />
        <Text style={[styles.syncButtonText, { color: colors.primary }]}>
          {syncing ? 'সিঙ্ক হচ্ছে...' : 'সিঙ্ক'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  syncButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
