import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles, useThemeTokens } from '../../theme';
import {
  InboxNotification,
  getInboxNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  addNotificationToInbox,
  subscribeToInbox,
} from '../../services/notificationInboxService';
import { formatRelativeTime } from '../../utils/bengali';

type FilterType = 'all' | 'breaking' | 'daily' | 'category';

export default function NotificationCenterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tokens = useThemeTokens();

  const [notifications, setNotifications] = useState<InboxNotification[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  const loadData = async () => {
    const list = await getInboxNotifications();
    setNotifications(list);
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToInbox(() => {
      loadData();
    });
    return unsub;
  }, []);

  const handlePressItem = async (item: InboxNotification) => {
    if (!item.read) {
      await markNotificationAsRead(item.id);
    }
    if (item.articleId) {
      router.push(`/article/${item.articleId}` as any);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('নোটিফিকেশন মুছে ফেলুন', 'আপনি কি এটি মুছে ফেলতে চান?', [
      { text: 'বাতিল', style: 'cancel' },
      {
        text: 'মুছুন',
        style: 'destructive',
        onPress: () => deleteNotification(id),
      },
    ]);
  };

  const handleSimulateBreaking = async () => {
    await addNotificationToInbox({
      title: '🚨 জরুরি খবর: জুলাই গণঅভ্যুত্থানের ঐতিহাসিক ঘোষণাপত্র প্রণয়ন কমিটি গঠিত',
      body: 'বৈষম্যবিরোধী আন্দোলন ও জুলাই বিপ্লবের আকাঙ্ক্ষা বাস্তবায়নে জাতীয় সনদ প্রণয়ন শুরু হয়েছে।',
      channel: 'breaking',
      badge: 'ব্রেকিং',
      articleId: '1',
    });
    Alert.alert('সফল', 'নতুন ব্রেকিং নিউজ নোটিফিকেশন যুক্ত করা হয়েছে!');
  };

  const filteredList = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.channel === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: tokens.surface.subtle,
      },
      header: {
        paddingTop: insets.top > 0 ? insets.top : 12,
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
      },
      headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      },
      headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      },
      backBtn: {
        padding: 4,
      },
      headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      markAllBtn: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
        backgroundColor: tokens.surface.elevated,
      },
      markAllText: {
        fontSize: 12,
        color: tokens.brand.primary,
        fontWeight: '600',
      },
      filterRow: {
        flexDirection: 'row',
        gap: 8,
      },
      filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: tokens.surface.elevated,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      activeFilterChip: {
        backgroundColor: tokens.brand.primary,
        borderColor: tokens.brand.primary,
      },
      filterText: {
        fontSize: 12,
        color: tokens.text.secondary,
        fontWeight: '500',
      },
      activeFilterText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
      listContent: {
        padding: 16,
        paddingBottom: 40,
      },
      card: {
        flexDirection: 'row',
        backgroundColor: tokens.surface.base,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: tokens.border.default,
        elevation: 1,
      },
      unreadCard: {
        borderLeftWidth: 4,
        borderLeftColor: tokens.brand.primary,
        backgroundColor: tokens.surface.base,
      },
      breakingCard: {
        borderLeftColor: tokens.status.error,
      },
      cardLeft: {
        flex: 1,
      },
      cardBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
      },
      badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: tokens.surface.elevated,
      },
      breakingBadge: {
        backgroundColor: tokens.brand.crimsonSurface,
      },
      badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: tokens.text.secondary,
      },
      breakingBadgeText: {
        color: tokens.status.error,
      },
      timeText: {
        fontSize: 11,
        color: tokens.text.tertiary,
      },
      unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: tokens.brand.primary,
      },
      cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: tokens.text.primary,
        lineHeight: 20,
        marginBottom: 4,
      },
      cardBody: {
        fontSize: 12,
        color: tokens.text.secondary,
        lineHeight: 17,
      },
      cardRight: {
        justifyContent: 'center',
        paddingLeft: 10,
      },
      deleteBtn: {
        padding: 6,
      },
      emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
        paddingHorizontal: 32,
      },
      emptyIconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: tokens.surface.elevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
      },
      emptyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: tokens.text.primary,
        marginBottom: 6,
      },
      emptySub: {
        fontSize: 13,
        color: tokens.text.secondary,
        textAlign: 'center',
        lineHeight: 18,
      },
      testBar: {
        backgroundColor: tokens.surface.base,
        padding: 14,
        marginHorizontal: 16,
        marginTop: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: tokens.border.default,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      testBarTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      testBarSub: {
        fontSize: 11,
        color: tokens.text.secondary,
        marginTop: 2,
      },
      testSendBtn: {
        backgroundColor: tokens.brand.crimsonSurface,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: tokens.status.error,
      },
      testSendText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: tokens.status.error,
      },
    })
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={tokens.text.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>নোটিফিকেশন ইনবক্স</Text>
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllBtn}
              onPress={markAllNotificationsAsRead}
            >
              <Text style={styles.markAllText}>সব পঠিত</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          {[
            { id: 'all', label: 'সকল' },
            { id: 'breaking', label: 'ব্রেকিং নিউজ' },
            { id: 'daily', label: 'দৈনিক সারসংক্ষেপ' },
            { id: 'category', label: 'ক্যাটাগরি' },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.filterChip,
                filter === item.id && styles.activeFilterChip,
              ]}
              onPress={() => setFilter(item.id as FilterType)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === item.id && styles.activeFilterText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Simulator Test Bar */}
      <View style={styles.testBar}>
        <View>
          <Text style={styles.testBarTitle}>পুশ নোটিফিকেশন পরীক্ষা</Text>
          <Text style={styles.testBarSub}>ব্রেকিং নিউজ অ্যালার্ট সিমুলেট করুন</Text>
        </View>
        <TouchableOpacity
          style={styles.testSendBtn}
          onPress={handleSimulateBreaking}
        >
          <Text style={styles.testSendText}>+ টেস্ট অ্যালার্ট</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isBreaking = item.channel === 'breaking';
          return (
            <TouchableOpacity
              style={[
                styles.card,
                !item.read && styles.unreadCard,
                !item.read && isBreaking && styles.breakingCard,
              ]}
              onPress={() => handlePressItem(item)}
              activeOpacity={0.7}
            >
              <View style={styles.cardLeft}>
                <View style={styles.cardBadgeRow}>
                  <View
                    style={[
                      styles.badge,
                      isBreaking && styles.breakingBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        isBreaking && styles.breakingBadgeText,
                      ]}
                    >
                      {item.badge || (isBreaking ? 'জরুরি' : 'সংবাদ')}
                    </Text>
                  </View>
                  <Text style={styles.timeText}>
                    {formatRelativeTime(new Date(item.timestamp).toISOString())}
                  </Text>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>

                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardBody} numberOfLines={2}>
                  {item.body}
                </Text>
              </View>

              <View style={styles.cardRight}>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item.id)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={16}
                    color={tokens.text.tertiary}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name="notifications-outline"
                size={36}
                color={tokens.text.tertiary}
              />
            </View>
            <Text style={styles.emptyTitle}>কোনো নোটিফিকেশন নেই</Text>
            <Text style={styles.emptySub}>
              ব্রেকিং নিউজ বা গুরুত্বপূর্ণ আপডেট প্রকাশিত হলে এখানে তা দেখতে পাবেন।
            </Text>
          </View>
        }
      />
    </View>
  );
}
