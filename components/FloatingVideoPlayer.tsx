import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../theme';

export interface FloatingVideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  thumbnailUrl: string;
  youtubeId: string;
}

interface FloatingVideoPlayerProps {
  video: FloatingVideoItem | null;
  visible: boolean;
  onExpand: () => void;
  onClose: () => void;
}

export const FloatingVideoPlayer: React.FC<FloatingVideoPlayerProps> = ({
  video,
  visible,
  onExpand,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      floatingCard: {
        position: 'absolute',
        bottom: 68 + insets.bottom,
        right: 16,
        width: 230,
        backgroundColor: tokens.surface.elevated,
        borderRadius: tokens.radii.lg,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.lg,
        zIndex: 999,
      },
      videoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 5,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
      },
      headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        flex: 1,
      },
      liveIndicator: {
        width: 6,
        height: 6,
        borderRadius: tokens.radii.pill,
        backgroundColor: '#DC2626',
      },
      categoryBadge: {
        fontSize: 10,
        color: '#4ADE80',
        fontWeight: 'bold',
      },
      headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      },
      actionIcon: {
        padding: 2,
      },
      previewContainer: {
        width: '100%',
        height: 110,
        position: 'relative',
        backgroundColor: '#000000',
      },
      previewImage: {
        width: '100%',
        height: '100%',
      },
      playOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      },
      playButtonCircle: {
        width: 36,
        height: 36,
        borderRadius: tokens.radii.pill,
        backgroundColor: 'rgba(0, 107, 63, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      durationBadge: {
        position: 'absolute',
        bottom: 4,
        right: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: tokens.radii.pill,
      },
      durationText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: 'bold',
      },
      infoSection: {
        padding: 8,
        backgroundColor: tokens.surface.elevated,
      },
      titleText: {
        fontSize: 11.5,
        fontWeight: '600',
        color: tokens.text.primary,
        lineHeight: 16,
      },
    })
  );

  if (!visible || !video) {
    return null;
  }

  return (
    <View style={styles.floatingCard}>
      {/* Floating Header */}
      <View style={styles.videoHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.liveIndicator} />
          <Text style={styles.categoryBadge} numberOfLines={1}>
            {video.category}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={onExpand}
            style={styles.actionIcon}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            accessibilityLabel="ভিডিও বড় করুন"
          >
            <Ionicons name="expand-outline" size={14} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            style={styles.actionIcon}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            accessibilityLabel="মিনি-প্লেয়ার বন্ধ করুন"
          >
            <Ionicons name="close" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Video Preview */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onExpand}
        style={styles.previewContainer}
      >
        <Image
          source={{ uri: video.thumbnailUrl }}
          style={styles.previewImage}
          contentFit="cover"
        />
        <View style={styles.playOverlay}>
          <View style={styles.playButtonCircle}>
            <Ionicons name="play" size={16} color="#FFFFFF" />
          </View>
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>
      </TouchableOpacity>

      {/* Title */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onExpand}
        style={styles.infoSection}
      >
        <Text style={styles.titleText} numberOfLines={1}>
          {video.title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
