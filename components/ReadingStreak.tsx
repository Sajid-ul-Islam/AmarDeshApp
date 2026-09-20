import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../theme';
import { useUserStore } from '../user';

interface ReadingStreakProps {
  compact?: boolean;
}

export default function ReadingStreak({ compact = false }: ReadingStreakProps) {
  const styles = useThemedStyles((tokens) => StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: tokens.brand.surface,
      paddingHorizontal: compact ? 12 : 16,
      paddingVertical: compact ? 8 : 12,
      borderRadius: 12,
      gap: 8,
    },
    icon: {
      color: tokens.brand.primary,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: compact ? 14 : 16,
      fontWeight: 'bold',
      color: tokens.text.primary,
    },
    subtitle: {
      fontSize: 12,
      color: tokens.text.secondary,
      marginTop: 2,
    },
    streakBadge: {
      backgroundColor: tokens.brand.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    streakText: {
      color: tokens.brand.onPrimary,
      fontSize: compact ? 16 : 18,
      fontWeight: 'bold',
    },
  }));

  const readingStreakDays = useUserStore((state) => state.readingStreakDays);

  if (readingStreakDays === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Ionicons 
        name="flame" 
        size={compact ? 20 : 24} 
        color={styles.icon.color} 
      />
      <View style={styles.content}>
        <Text style={styles.title}>পড়ার ধারা</Text>
        {!compact && (
          <Text style={styles.subtitle}>
            পরপর {readingStreakDays} দিন ধরে পড়ছেন
          </Text>
        )}
      </View>
      <View style={styles.streakBadge}>
        <Text style={styles.streakText}>{readingStreakDays}</Text>
      </View>
    </View>
  );
}
