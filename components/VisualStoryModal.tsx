import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { type VisualStoryItem } from '../data/storiesData';
export type { VisualStoryItem };

interface VisualStoryModalProps {
  visible: boolean;
  stories: VisualStoryItem[];
  initialIndex?: number;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');
const STORY_DURATION_MS = 7000;

export const VisualStoryModal: React.FC<VisualStoryModalProps> = ({
  visible,
  stories,
  initialIndex = 0,
  onClose,
}) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      setProgress(0);
    }
  }, [visible, initialIndex]);

  useEffect(() => {
    if (!visible || stories.length === 0) return;

    const interval = 100;
    const step = 100 / (STORY_DURATION_MS / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((idx) => idx + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [visible, currentIndex, stories.length]);

  if (!visible || stories.length === 0) return null;

  const currentStory = stories[currentIndex] || stories[0];

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((idx) => idx + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
      setProgress(0);
    }
  };

  const handleReadFullArticle = () => {
    onClose();
    if (currentStory.articleId) {
      router.push(`/article/${currentStory.articleId}`);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <StatusBar barStyle="light-content" translucent />
      <View style={styles.container}>
        {/* Story Background Image */}
        <Image
          source={{ uri: currentStory.imageUrl }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        {/* Dark Gradient / Scrim Overlay */}
        <View style={styles.scrim} />

        {/* Top Story Controls & Progress Bars */}
        <SafeAreaView style={styles.topSafeArea}>
          <View style={styles.progressRow}>
            {stories.map((_, i) => (
              <View key={i} style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width:
                        i < currentIndex
                          ? '100%'
                          : i === currentIndex
                            ? `${progress}%`
                            : '0%',
                    },
                  ]}
                />
              </View>
            ))}
          </View>

          <View style={styles.headerInfoRow}>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>{currentStory.category}</Text>
            </View>
            <Text style={styles.timeText}>{currentStory.publishedAt}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Tap areas for Prev / Next */}
        <View style={styles.tapAreaContainer}>
          <TouchableOpacity
            style={styles.tapLeft}
            activeOpacity={1}
            onPress={handlePrev}
          />
          <TouchableOpacity
            style={styles.tapRight}
            activeOpacity={1}
            onPress={handleNext}
          />
        </View>

        {/* Story Content Bottom Deck */}
        <View style={styles.bottomContent}>
          <Text style={styles.storyTitle}>{currentStory.title}</Text>
          <Text style={styles.storyTakeaway}>{currentStory.takeaway}</Text>

          <TouchableOpacity
            style={styles.readMoreBtn}
            onPress={handleReadFullArticle}
          >
            <Ionicons name="chevron-up" size={18} color="#FFFFFF" />
            <Text style={styles.readMoreText}>পুরো খবর পড়ুন</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFill,
    width,
    height,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  topSafeArea: {
    paddingTop: 44,
    paddingHorizontal: 16,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  headerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgePill: {
    backgroundColor: '#BA131A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    flex: 1,
    marginLeft: 10,
  },
  closeBtn: {
    padding: 6,
  },
  tapAreaContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  tapLeft: {
    flex: 1,
  },
  tapRight: {
    flex: 2,
  },
  bottomContent: {
    position: 'absolute',
    bottom: 48,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(18, 18, 18, 0.85)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  storyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 30,
    fontFamily: 'serif',
    marginBottom: 8,
  },
  storyTakeaway: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 22,
    marginBottom: 16,
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#BA131A',
    paddingVertical: 12,
    borderRadius: 999,
  },
  readMoreText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
