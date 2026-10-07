import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useThemedStyles } from '../../theme';
import { YouTubePlayerComponent } from '../../components/YouTubePlayer';
import { FloatingVideoPlayer } from '../../components/FloatingVideoPlayer';
import { toBengaliNumeral } from '../../utils/bengali';
import { useAppStore } from '../../store/useAppStore';
import {
  t,
  getLocalizedCategoryName,
  formatLocalizedNumeral,
} from '../../services/i18n';
import { getSafeHeaderPaddingTop } from '../../utils/layout';
import { AmarDeshLogo } from '../../components/AmarDeshLogo';

interface VideoItem {
  id: string;
  title: string;
  duration: string;
  category: string;
  publishedAt: string;
  thumbnailUrl: string;
  youtubeId: string;
  views: number;
}

const SAMPLE_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'সংস্কার প্রশ্নে সরকার ও রাজনৈতিক দলগুলোর সাম্প্রতিক অবস্থান: বিশেষ বিশ্লেষণ',
    duration: '০৮:৪৫',
    category: 'বিশেষ প্রতিবেদন',
    publishedAt: '২ ঘণ্টা আগে',
    thumbnailUrl: 'https://images.dailyamardesh.com/original_images/imf-24dba6-720x405.webp',
    youtubeId: 'dQw4w9WgXcQ',
    views: 42100,
  },
  {
    id: 'vid-2',
    title: 'জুলাই গণঅভ্যুত্থানের ঐতিহাসিক দিনগুলো: প্রত্যক্ষদর্শীদের জবানবন্দি',
    duration: '১২:২০',
    category: 'জুলাই বিপ্লব',
    publishedAt: '৪ ঘণ্টা আগে',
    thumbnailUrl: 'https://images.dailyamardesh.com/original_images/আবরার-d8ad6c-256x144.webp',
    youtubeId: 'dQw4w9WgXcQ',
    views: 89300,
  },
  {
    id: 'vid-3',
    title: 'আইএমএফ ঋণচুক্তি ও ব্যাংকিং খাতের সার্বিক পরিস্থিতি নিয়ে মুখোমুখি অর্থনীতিবিদরা',
    duration: '১৫:১০',
    category: 'অর্থনীতি',
    publishedAt: '৬ ঘণ্টা আগে',
    thumbnailUrl: 'https://images.dailyamardesh.com/original_images/bangladesh_bank_P9AlMoN.jpg',
    youtubeId: 'dQw4w9WgXcQ',
    views: 31200,
  },
  {
    id: 'vid-4',
    title: 'রাজশাহী মেডিকেল বিশ্ববিদ্যালয় পরিস্থিতিতে শিক্ষার্থীদের প্রতিক্রিয়া ও দাবি',
    duration: '০৫:১৫',
    category: 'সারা দেশ',
    publishedAt: '১১ ঘণ্টা আগে',
    thumbnailUrl: 'https://images.dailyamardesh.com/original_images/Amardesh_bfghfg-bbe476-480x270.webp',
    youtubeId: 'dQw4w9WgXcQ',
    views: 19500,
  },
  {
    id: 'vid-5',
    title: '‘এই সবুজ গালিচা ছেড়ে যেতে মন চাইছে না’— মেসির বিদায়ী বক্তব্যের আবেগঘন মুহূর্ত',
    duration: '০৩:৪০',
    category: 'খেলা',
    publishedAt: '১ দিন আগে',
    thumbnailUrl: 'https://images.dailyamardesh.com/original_images/vbcjsb1s_lionel-messi-speech-afp_625x300_07_October_26-792a22-720x405.webp',
    youtubeId: 'dQw4w9WgXcQ',
    views: 125000,
  },
];

const CATEGORIES = ['সব ভিডিও', 'বিশেষ প্রতিবেদন', 'জুলাই বিপ্লব', 'রাজনীতি', 'অর্থনীতি', 'সারা দেশ', 'খেলা'];

export default function VideoScreen() {
  const language = useAppStore((state) => state.language);
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<VideoItem>>(null);
  const [selectedCategory, setSelectedCategory] = useState('সব ভিডিও');
  const [activeVideo, setActiveVideo] = useState<VideoItem>(SAMPLE_VIDEOS[0]);
  const [isScrolledPast, setIsScrolledPast] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [isMiniDismissed, setIsMiniDismissed] = useState(false);

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: tokens.surface.subtle,
      },
      header: {
        paddingTop: getSafeHeaderPaddingTop(insets.top, 8),
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
      },
      headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
      },
      liveDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: tokens.status.error,
      },
      headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      categoryScroll: {
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 4,
      },
      catChip: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 4,
        backgroundColor: tokens.surface.elevated,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      activeCatChip: {
        backgroundColor: tokens.brand.primary,
        borderColor: tokens.brand.primary,
      },
      catChipText: {
        fontSize: 12.5,
        color: tokens.text.secondary,
        fontWeight: '600',
      },
      activeCatChipText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
      playerWrapper: {
        backgroundColor: '#000000',
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
      },
      activeDetails: {
        padding: 16,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
      },
      activeDetailsHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
      },
      activeCatBadge: {
        alignSelf: 'flex-start',
        backgroundColor: tokens.brand.surface,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      activeCatText: {
        color: tokens.brand.primary,
        fontSize: 11.5,
        fontWeight: '700',
        textTransform: 'uppercase',
      },
      pipBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: tokens.surface.elevated,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      pipBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: tokens.text.primary,
      },
      activeTitle: {
        fontSize: 16.5,
        fontWeight: '700',
        color: tokens.text.primary,
        lineHeight: 23,
        letterSpacing: -0.2,
        marginBottom: 6,
      },
      activeMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      },
      metaText: {
        fontSize: 12,
        color: tokens.text.tertiary,
      },
      listHeaderTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: tokens.text.primary,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 10,
        letterSpacing: -0.2,
      },
      videoCard: {
        flexDirection: 'row',
        backgroundColor: tokens.surface.base,
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 4,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      thumbContainer: {
        width: 130,
        height: 84,
        position: 'relative',
        backgroundColor: '#000',
      },
      thumbnail: {
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
        backgroundColor: 'rgba(0,0,0,0.25)',
      },
      durationBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.75)',
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 3,
      },
      durationText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
      },
      cardInfo: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between',
      },
      cardTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: tokens.text.primary,
        lineHeight: 18,
      },
      cardMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      cardCategory: {
        fontSize: 11,
        color: tokens.brand.primary,
        fontWeight: '600',
      },
      cardTime: {
        fontSize: 11,
        color: tokens.text.tertiary,
      },
    })
  );

  const filteredVideos =
    selectedCategory === 'সব ভিডিও'
      ? SAMPLE_VIDEOS
      : SAMPLE_VIDEOS.filter((v) => v.category === selectedCategory);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const shouldShow = scrollY > 280;
    if (shouldShow !== isScrolledPast) {
      setIsScrolledPast(shouldShow);
      if (shouldShow) {
        setIsMiniDismissed(false);
      }
    }
  };

  const handleSelectVideo = (item: VideoItem) => {
    setActiveVideo(item);
    setIsMiniDismissed(false);
    setShowMiniPlayer(false);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const renderHeader = () => (
    <View>
      {/* Embedded Player for Active Video */}
      <View style={styles.playerWrapper}>
        <YouTubePlayerComponent videoId={activeVideo.youtubeId} />
      </View>

      {/* Active Video Details */}
      <View style={styles.activeDetails}>
        <View style={styles.activeDetailsHeaderRow}>
          <View style={styles.activeCatBadge}>
            <Text style={styles.activeCatText}>
              {getLocalizedCategoryName(activeVideo.category, language)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.pipBtn}
            onPress={() => {
              setShowMiniPlayer(true);
              setIsMiniDismissed(false);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="copy-outline" size={13} color={styles.activeCatText.color} />
            <Text style={styles.pipBtnText}>{t('mini_player', language)}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.activeTitle}>{activeVideo.title}</Text>
        <View style={styles.activeMeta}>
          <Text style={styles.metaText}>{activeVideo.publishedAt}</Text>
          <Text style={styles.metaText}>•</Text>
          <Text style={styles.metaText}>
            {formatLocalizedNumeral(activeVideo.views, language)}
            {t('views_suffix', language)}
          </Text>
        </View>
      </View>

      {/* Playlist Title */}
      <Text style={styles.listHeaderTitle}>{t('more_videos', language)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <AmarDeshLogo height={24} variant="png" />
          <View style={styles.liveDot} />
          <Text style={styles.headerTitle}>{t('video_hub_title', language)}</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.catChip,
                selectedCategory === cat && styles.activeCatChip,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.catChipText,
                  selectedCategory === cat && styles.activeCatChipText,
                ]}
              >
                {cat === 'সব ভিডিও'
                  ? t('all_videos', language)
                  : getLocalizedCategoryName(cat, language)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Video Playlist with Main Player as Header */}
      <FlatList
        ref={listRef}
        data={filteredVideos.filter((v) => v.id !== activeVideo.id)}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 60 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.videoCard}
            onPress={() => handleSelectVideo(item)}
            activeOpacity={0.8}
          >
            <View style={styles.thumbContainer}>
              <Image
                source={{ uri: item.thumbnailUrl }}
                style={styles.thumbnail}
                contentFit="cover"
              />
              <View style={styles.playOverlay}>
                <Ionicons name="play-circle" size={28} color="#FFFFFF" />
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{item.duration}</Text>
              </View>
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.cardMetaRow}>
                <Text style={styles.cardCategory}>
                  {getLocalizedCategoryName(item.category, language)}
                </Text>
                <Text style={styles.cardTime}>{item.publishedAt}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Floating Video Mini-Player / PiP Overlay */}
      <FloatingVideoPlayer
        video={activeVideo}
        visible={(isScrolledPast || showMiniPlayer) && !isMiniDismissed}
        onExpand={() => {
          listRef.current?.scrollToOffset({ offset: 0, animated: true });
          setShowMiniPlayer(false);
          setIsMiniDismissed(false);
        }}
        onClose={() => {
          setIsMiniDismissed(true);
          setShowMiniPlayer(false);
        }}
      />
    </View>
  );
}
