import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useThemedStyles, useThemeTokens } from '../theme';
import { VisualStoryModal } from './VisualStoryModal';
import { DEFAULT_STORIES, type VisualStoryItem } from '../data/storiesData';
export { DEFAULT_STORIES };
export type { VisualStoryItem };

interface VisualStoriesBarProps {
  stories?: VisualStoryItem[];
}

export const VisualStoriesBar: React.FC<VisualStoriesBarProps> = ({
  stories = DEFAULT_STORIES,
}) => {
  const tokens = useThemeTokens();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleOpenStory = (index: number) => {
    Haptics.selectionAsync();
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        paddingVertical: 12,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 0.5,
        borderBottomColor: tokens.border.subtle,
      },
      scrollContent: {
        paddingHorizontal: 16,
        gap: 14,
      },
      storyItem: {
        alignItems: 'center',
        width: 68,
      },
      ringWrapper: {
        width: 62,
        height: 62,
        borderRadius: tokens.radii.pill,
        borderWidth: 2,
        borderColor: tokens.brand.primary,
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
        ...tokens.shadows.sm,
      },
      avatarImage: {
        width: 54,
        height: 54,
        borderRadius: tokens.radii.pill,
      },
      categoryBadge: {
        position: 'absolute',
        bottom: -2,
        backgroundColor: tokens.brand.primary,
        borderRadius: tokens.radii.pill,
        paddingHorizontal: 6,
        paddingVertical: 1,
      },
      categoryText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: 'bold',
      },
      storyLabel: {
        fontSize: 11,
        color: tokens.text.primary,
        fontWeight: '500',
        marginTop: 6,
        textAlign: 'center',
      },
    })
  );

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {stories.map((story, index) => (
            <TouchableOpacity
              key={story.id}
              style={styles.storyItem}
              onPress={() => handleOpenStory(index)}
              activeOpacity={0.8}
            >
              <View style={styles.ringWrapper}>
                <Image
                  source={{ uri: story.imageUrl }}
                  style={styles.avatarImage}
                />
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{story.category}</Text>
                </View>
              </View>
              <Text style={styles.storyLabel} numberOfLines={1}>
                {story.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <VisualStoryModal
        visible={modalVisible}
        stories={stories}
        initialIndex={selectedIndex}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};
