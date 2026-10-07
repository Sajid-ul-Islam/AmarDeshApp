import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Linking,
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
import { AdBanner } from '../../components/AdBanner';
import {
  getAmarDeshVideos,
  VIDEO_CATEGORIES,
  AMAR_DESH_YT_CHANNEL_URL,
  CURATED_AMAR_DESH_VIDEOS,
  VideoItem,
} from '../../services/youtubeService';

export default function VideoScreen() {
  const language = useAppStore((state) => state.language);
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<VideoItem>>(null);
  const [videos, setVideos] = useState<VideoItem[]>(CURATED_AMAR_DESH_VIDEOS);
  const [selectedCategory, setSelectedCategory] = useState('সব ভিডিও');
  const [activeVideo, setActiveVideo] = useState<VideoItem>(CURATED_AMAR_DESH_VIDEOS[0]);
  const [refreshing, setRefreshing] = useState(false);
  const [isScrolledPast, setIsScrolledPast] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [isMiniDismissed, setIsMiniDismissed] = useState(false);

  // Fetch live videos from official Daily Amar Desh YouTube channel on mount
  useEffect(() => {
    let isMounted = true;
    getAmarDeshVideos().then((items) => {
      if (isMounted && items.length > 0) {
        setVideos(items);
        setActiveVideo(items[0]);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const live = await getAmarDeshVideos(true);
      if (live.length > 0) {
        setVideos(live);
      }
    } finally {
      setRefreshing(false);
    }
  };

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
        justifyContent: 'space-between',
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
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
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
        borderBottomWidth: 0.5,
        borderBottomColor: tokens.border.subtle,
      },
      activeDetails: {
        padding: 16,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 0.5,
        borderBottomColor: tokens.border.subtle,
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
        borderRadius: tokens.radii.pill,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
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
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.sm,
      },
      pipBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: tokens.text.primary,
      },
      ytChannelBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.sm,
      },
      ytChannelBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#DC2626',
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
        borderRadius: tokens.radii.lg,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      thumbContainer: {
        width: 130,
        height: 84,
        position: 'relative',
        backgroundColor: '#000',
        borderRadius: tokens.radii.md,
        overflow: 'hidden',
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
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: tokens.radii.pill,
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
      ? videos
      : videos.filter((v) => v.category === selectedCategory);

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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <TouchableOpacity
              style={styles.ytChannelBtn}
              onPress={() => Linking.openURL(AMAR_DESH_YT_CHANNEL_URL)}
              activeOpacity={0.7}
              accessibilityLabel="অফিসিয়াল ইউটিউব চ্যানেল"
            >
              <Ionicons name="logo-youtube" size={15} color="#DC2626" />
              <Text style={styles.ytChannelBtnText}>চ্যানেল ↗</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pipBtn}
              onPress={() => {
                setShowMiniPlayer(true);
                setIsMiniDismissed(false);
              }}
              activeOpacity={0.7}
              accessibilityLabel="ভাসমান প্লেয়ার চালু করুন"
            >
              <Ionicons name="copy-outline" size={14} color={styles.activeCatText.color} />
              <Text style={styles.pipBtnText}>
                {language === 'bn' ? 'ভাসমান' : 'PiP'}
              </Text>
            </TouchableOpacity>
          </View>
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
          <AmarDeshLogo height={28} variant="png" />
          <TouchableOpacity
            style={styles.ytChannelBtn}
            onPress={() => Linking.openURL(AMAR_DESH_YT_CHANNEL_URL)}
            activeOpacity={0.7}
          >
            <Ionicons name="logo-youtube" size={13} color="#DC2626" />
            <Text style={styles.ytChannelBtnText}>অফিসিয়াল চ্যানেল</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {VIDEO_CATEGORIES.map((cat) => (
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ba131a', '#006B3F']}
            tintColor="#ba131a"
          />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 60 }}
        renderItem={({ item, index }) => (
          <View>
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

            {/* Dynamic Native Ad Placement between videos */}
            {(index === 2 || (index > 2 && (index - 2) % 6 === 0)) && (
              <View style={{ paddingHorizontal: 16 }}>
                <AdBanner variant="compact" />
              </View>
            )}
          </View>
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
