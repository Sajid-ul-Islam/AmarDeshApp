import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../../theme';
import { useUserStore } from '../../user';
import { useState, useEffect } from 'react';

export default function InterestsScreen() {
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
    interestItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border.subtle,
    },
    interestItemLast: {
      borderBottomWidth: 0,
    },
    interestInfo: {
      flex: 1,
    },
    interestName: {
      fontSize: 16,
      color: tokens.text.primary,
      fontWeight: '600',
    },
    interestType: {
      fontSize: 12,
      color: tokens.text.secondary,
      marginTop: 2,
    },
    scoreContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    scoreBar: {
      width: 100,
      height: 8,
      backgroundColor: tokens.surface.elevated,
      borderRadius: 4,
      overflow: 'hidden',
    },
    scoreFill: {
      height: '100%',
      backgroundColor: tokens.brand.primary,
      borderRadius: 4,
    },
    scoreText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: tokens.brand.primary,
      minWidth: 40,
      textAlign: 'right',
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
      paddingHorizontal: 32,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyText: {
      fontSize: 16,
      color: tokens.text.secondary,
      textAlign: 'center',
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: tokens.text.tertiary,
      textAlign: 'center',
    },
    resetButton: {
      backgroundColor: tokens.status.error,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 24,
      marginHorizontal: 16,
    },
    resetButtonText: {
      color: tokens.text.inverse,
      fontSize: 16,
      fontWeight: '600',
    },
  }));

  const { getUserInterests, refreshAffinities } = useUserStore();
  const [interests, setInterests] = useState<Array<{ type: string; id: string; score: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterests();
  }, []);

  const loadInterests = async () => {
    setLoading(true);
    const userInterests = await getUserInterests(50);
    setInterests(userInterests);
    setLoading(false);
  };

  const handleReset = () => {
    Alert.alert(
      'আগ্রহ রিসেট করুন',
      'আপনার সমস্ত আগ্রহ স্কোর মুছে ফেলা হবে। এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।',
      [
        { text: 'বাতিল', style: 'cancel' },
        { 
          text: 'রিসেট করুন', 
          style: 'destructive',
          onPress: async () => {
            await refreshAffinities();
            await loadInterests();
            Alert.alert('সফল', 'আপনার আগ্রহ রিসেট করা হয়েছে');
          }
        },
      ]
    );
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'topic':
        return 'বিষয়';
      case 'author':
        return 'লেখক';
      case 'section':
        return 'বিভাগ';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.title}>আপনার আগ্রহ</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>লোড হচ্ছে...</Text>
        </View>
      </View>
    );
  }

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
        <Text style={styles.title}>আপনার আগ্রহ</Text>
      </View>

      <ScrollView style={styles.content}>
        {interests.length > 0 ? (
          <>
            {/* Topics */}
            {interests.filter(i => i.type === 'topic').length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>বিষয়</Text>
                {interests
                  .filter(i => i.type === 'topic')
                  .map((interest, index, array) => (
                    <View 
                      key={index} 
                      style={[
                        styles.interestItem,
                        index === array.length - 1 && styles.interestItemLast,
                      ]}
                    >
                      <View style={styles.interestInfo}>
                        <Text style={styles.interestName}>{interest.id}</Text>
                        <Text style={styles.interestType}>{getTypeLabel(interest.type)}</Text>
                      </View>
                      <View style={styles.scoreContainer}>
                        <View style={styles.scoreBar}>
                          <View 
                            style={[
                              styles.scoreFill, 
                              { width: `${interest.score * 100}%` }
                            ]} 
                          />
                        </View>
                        <Text style={styles.scoreText}>
                          {Math.round(interest.score * 100)}%
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
            )}

            {/* Authors */}
            {interests.filter(i => i.type === 'author').length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>লেখক</Text>
                {interests
                  .filter(i => i.type === 'author')
                  .map((interest, index, array) => (
                    <View 
                      key={index} 
                      style={[
                        styles.interestItem,
                        index === array.length - 1 && styles.interestItemLast,
                      ]}
                    >
                      <View style={styles.interestInfo}>
                        <Text style={styles.interestName}>{interest.id}</Text>
                        <Text style={styles.interestType}>{getTypeLabel(interest.type)}</Text>
                      </View>
                      <View style={styles.scoreContainer}>
                        <View style={styles.scoreBar}>
                          <View 
                            style={[
                              styles.scoreFill, 
                              { width: `${interest.score * 100}%` }
                            ]} 
                          />
                        </View>
                        <Text style={styles.scoreText}>
                          {Math.round(interest.score * 100)}%
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
            )}

            {/* Sections */}
            {interests.filter(i => i.type === 'section').length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>বিভাগ</Text>
                {interests
                  .filter(i => i.type === 'section')
                  .map((interest, index, array) => (
                    <View 
                      key={index} 
                      style={[
                        styles.interestItem,
                        index === array.length - 1 && styles.interestItemLast,
                      ]}
                    >
                      <View style={styles.interestInfo}>
                        <Text style={styles.interestName}>{interest.id}</Text>
                        <Text style={styles.interestType}>{getTypeLabel(interest.type)}</Text>
                      </View>
                      <View style={styles.scoreContainer}>
                        <View style={styles.scoreBar}>
                          <View 
                            style={[
                              styles.scoreFill, 
                              { width: `${interest.score * 100}%` }
                            ]} 
                          />
                        </View>
                        <Text style={styles.scoreText}>
                          {Math.round(interest.score * 100)}%
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
            )}

            {/* Reset Button */}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>
                সমস্ত আগ্রহ রিসেট করুন
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons 
              name="heart-outline" 
              size={64} 
              color="#D1D5DB" 
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>
              কোনো আগ্রহ নেই
            </Text>
            <Text style={styles.emptySubtext}>
              আরও সংবাদ পড়ুন আপনার আগ্রহ জানতে
            </Text>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}
