import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  Modal,
  Share,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useThemedStyles } from '../../theme';
import { toBengaliNumeral } from '../../utils/bengali';
import { useAppStore } from '../../store/useAppStore';
import { t, formatLocalizedNumeral } from '../../services/i18n';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ArticleHotspot {
  id: string;
  articleId?: string;
  title: string;
  category: string;
  snippet: string;
  x: number; // percentage from left
  y: number; // percentage from top
  width: number; // percentage width
  height: number; // percentage height
  cropImageUrl?: string;
}

export interface EPaperPage {
  pageNumber: number;
  title: string;
  imageUrl: string;
  hdImageUrl: string;
  hotspots?: ArticleHotspot[];
}

const EPAPER_PAGES: EPaperPage[] = [
  {
    pageNumber: 1,
    title: '১ম পাতা (প্রধান খবর)',
    imageUrl: 'https://images.dailyamardesh.com/ad/amardesh-shadhinotar-kotha-bole.jpg',
    hdImageUrl: 'https://images.dailyamardesh.com/manualimages/amardesh-shadhinotar-kotha-bole.jpg',
    hotspots: [
      {
        id: 'hs-1-1',
        articleId: 'art-1',
        title: 'নতুন বাংলাদেশের অভিযাত্রায় দৈনিক আমার দেশ: সত্য ও নির্ভীক কন্ঠস্বর',
        category: 'প্রধান সংবাদ',
        snippet: 'ফ্যাসিবাদবিরোধী লড়াই ও জুলাই বিপ্লবের আকাঙ্ক্ষাকে ধারণ করে পুনর্জন্ম নেওয়া দৈনিক আমার দেশ সকল বাধা পেরিয়ে গণমানুষের মুখপত্র হিসেবে দায়িত্ব পালন করে যাচ্ছে।',
        x: 4,
        y: 12,
        width: 92,
        height: 32,
        cropImageUrl: 'https://images.dailyamardesh.com/ad/amardesh-shadhinotar-kotha-bole.jpg',
      },
      {
        id: 'hs-1-2',
        articleId: 'art-2',
        title: 'অর্থনৈতিক পুনর্গঠনে গতি আনতে সংস্কার কমিশনের সুনির্দিষ্ট সুপারিশ',
        category: 'অর্থনীতি',
        snippet: 'ব্যাংকিং খাতে শৃঙ্খলা ফেরানো, মুদ্রা পাচার রোধ এবং রাজস্ব আদায়ে আধুনিক প্রযুক্তির ব্যবহারের সুপারিশ করেছে অর্থনীতি বিষয়ক সংস্কার টাস্কফোর্স।',
        x: 4,
        y: 52,
        width: 92,
        height: 28,
        cropImageUrl: 'https://images.dailyamardesh.com/original_images/imf-24dba6-720x405.webp',
      },
    ],
  },
  {
    pageNumber: 2,
    title: '২য় পাতা (নগর ও জাতীয়)',
    imageUrl: 'https://images.dailyamardesh.com/original_images/imf-24dba6-720x405.webp',
    hdImageUrl: 'https://images.dailyamardesh.com/original_images/imf-24dba6-720x405.webp',
    hotspots: [
      {
        id: 'hs-2-1',
        articleId: 'art-2',
        title: 'আইএমএফ প্রতিনিধির সাথে বৈঠক: সংস্কার বাস্তবায়নে অগ্রগতি পর্যালোচনা',
        category: 'নগর ও জাতীয়',
        snippet: 'ঋণ কর্মসূচির পরবর্তী কিস্তি ছাড়ের লক্ষ্যে আইএমএফ প্রতিনিধিদলের সঙ্গে অর্থ উপদেষ্টা ও বাংলাদেশ ব্যাংক গভর্নরের ফলপ্রসূ আলোচনা অনুষ্ঠিত।',
        x: 5,
        y: 18,
        width: 90,
        height: 36,
        cropImageUrl: 'https://images.dailyamardesh.com/original_images/imf-24dba6-720x405.webp',
      },
    ],
  },
  {
    pageNumber: 3,
    title: '৩য় পাতা (সম্পাদকীয় ও মতামত)',
    imageUrl: 'https://images.dailyamardesh.com/original_images/Mahamudur_rhaman_Q0bVlbS.jpg',
    hdImageUrl: 'https://images.dailyamardesh.com/original_images/Mahamudur_rhaman_Q0bVlbS.jpg',
    hotspots: [
      {
        id: 'hs-3-1',
        articleId: 'art-3',
        title: 'সম্পাদকীয়: গণমাধ্যমের স্বাধীনতা ও আগামীর গণতান্ত্রিক রূপরেখা',
        category: 'সম্পাদকীয়',
        snippet: 'সংবাদপত্রের কণ্ঠরোধকারী কালাকানুন বাতিল করে স্বাধীন ও দায়িত্বশীল গণমাধ্যম প্রতিষ্ঠায় জাতীয় ঐকমত্য গড়ে তোলার এখনই উপযুক্ত সময়।',
        x: 5,
        y: 15,
        width: 90,
        height: 42,
        cropImageUrl: 'https://images.dailyamardesh.com/original_images/Mahamudur_rhaman_Q0bVlbS.jpg',
      },
    ],
  },
  {
    pageNumber: 4,
    title: '৪র্থ পাতা (সারা দেশ)',
    imageUrl: 'https://images.dailyamardesh.com/original_images/sonargoan-fbe10b-256x144.webp',
    hdImageUrl: 'https://images.dailyamardesh.com/original_images/sonargoan-fbe10b-256x144.webp',
    hotspots: [
      {
        id: 'hs-4-1',
        articleId: 'art-4',
        title: 'সোনারগাঁওয়ে ঐতিহাসিক নিদর্শন ও পর্যটন শিল্পের পুনরুজ্জীবন প্রকল্প',
        category: 'সারা দেশ',
        snippet: 'প্রাচীন বাংলার ঐতিহ্যমণ্ডিত সোনারগাঁওয়ে দেশি-বিদেশি পর্যটকদের সুবিধার্থে অবকাঠামোগত উন্নয়ন কাজ শুরু হতে যাচ্ছে।',
        x: 5,
        y: 18,
        width: 90,
        height: 35,
        cropImageUrl: 'https://images.dailyamardesh.com/original_images/sonargoan-fbe10b-256x144.webp',
      },
    ],
  },
  {
    pageNumber: 5,
    title: '৫ম পাতা (আন্তর্জাতিক)',
    imageUrl: 'https://images.dailyamardesh.com/original_images/Trump-6f9e84-720x405.webp',
    hdImageUrl: 'https://images.dailyamardesh.com/original_images/Trump-6f9e84-720x405.webp',
  },
  {
    pageNumber: 6,
    title: '৬ষ্ঠ পাতা (বাণিজ্য ও ব্যাংক)',
    imageUrl: 'https://images.dailyamardesh.com/original_images/bangladesh_bank_P9AlMoN.jpg',
    hdImageUrl: 'https://images.dailyamardesh.com/original_images/bangladesh_bank_P9AlMoN.jpg',
    hotspots: [
      {
        id: 'hs-6-1',
        articleId: 'art-2',
        title: 'ব্যাংকিং খাতের স্থিতিশীলতা রক্ষায় কেন্দ্রীয় ব্যাংকের কঠোর তদারকি',
        category: 'বাণিজ্য ও ব্যাংক',
        snippet: 'খেলাপি ঋণ নিয়ন্ত্রণে বিশেষ নিরীক্ষা ও তারল্য সহায়তা অব্যাহত রেখে আস্থার সংকট দূর করার উদ্যোগ গ্রহণ করা হয়েছে।',
        x: 5,
        y: 20,
        width: 90,
        height: 38,
        cropImageUrl: 'https://images.dailyamardesh.com/original_images/bangladesh_bank_P9AlMoN.jpg',
      },
    ],
  },
  {
    pageNumber: 7,
    title: '৭ম পাতা (খেলাধুলা)',
    imageUrl: 'https://images.dailyamardesh.com/original_images/vbcjsb1s_lionel-messi-speech-afp_625x300_07_October_26-792a22-720x405.webp',
    hdImageUrl: 'https://images.dailyamardesh.com/original_images/vbcjsb1s_lionel-messi-speech-afp_625x300_07_October_26-792a22-720x405.webp',
    hotspots: [
      {
        id: 'hs-7-1',
        articleId: 'art-5',
        title: '‘এই সবুজ গালিচা ছেড়ে যেতে মন চাইছে না’— মেসির আবেগঘন বিদায়',
        category: 'খেলাধুলা',
        snippet: 'ফুটবল ইতিহাসের অন্যতম সেরা মহাতারকা লিওনেল মেসির আন্তর্জাতিক মাঠের বিদায়ী বক্তব্যের আবেগাপ্লুত বিবরণ।',
        x: 5,
        y: 18,
        width: 90,
        height: 38,
        cropImageUrl: 'https://images.dailyamardesh.com/original_images/vbcjsb1s_lionel-messi-speech-afp_625x300_07_October_26-792a22-720x405.webp',
      },
    ],
  },
  {
    pageNumber: 8,
    title: '৮ম পাতা (ফিচার ও সাহিত্য)',
    imageUrl: 'https://images.dailyamardesh.com/original_images/আমারদেশ-5f83c2-256x144.webp',
    hdImageUrl: 'https://images.dailyamardesh.com/original_images/আমারদেশ-5f83c2-256x144.webp',
  },
];

export default function EPaperScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState<1 | 1.5 | 2>(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const language = useAppStore((state) => state.language);
  const [showHotspots, setShowHotspots] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<ArticleHotspot | null>(null);

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: tokens.surface.subtle,
      },
      header: {
        paddingTop: insets.top > 0 ? insets.top : 12,
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
      },
      headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
      },
      titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      logoBadge: {
        backgroundColor: tokens.brand.primary,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
      },
      logoBadgeText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold',
      },
      headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      editionDate: {
        fontSize: 12,
        color: tokens.text.secondary,
        marginTop: 2,
      },
      headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      pageSelectorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
      },
      pageChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        backgroundColor: tokens.surface.elevated,
        marginRight: 8,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      activePageChip: {
        backgroundColor: tokens.brand.primary,
        borderColor: tokens.brand.primary,
      },
      pageChipText: {
        fontSize: 12.5,
        color: tokens.text.secondary,
        fontWeight: '600',
      },
      activePageChipText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
      viewerContainer: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        alignItems: 'center',
        justifyContent: 'center',
      },
      pageScrollView: {
        flex: 1,
        width: '100%',
      },
      pageScrollContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
      },
      pageImageCard: {
        width: SCREEN_WIDTH - 24,
        aspectRatio: 0.68,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      pageImage: {
        width: '100%',
        height: '100%',
      },
      hotspotBox: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 107, 63, 0.12)',
        borderWidth: 1.5,
        borderColor: '#006B3F',
        borderRadius: 6,
        borderStyle: 'dashed',
        padding: 4,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      },
      hotspotPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: '#006B3F',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
      },
      hotspotPillText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
      },
      floatingBar: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(17, 24, 39, 0.94)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 24,
        gap: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        elevation: 8,
      },
      barActionText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
      },
      barDivider: {
        width: 1,
        height: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
      },
      downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: tokens.brand.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
      },
      downloadText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
      },
      cropModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        justifyContent: 'flex-end',
      },
      cropModalSheet: {
        backgroundColor: tokens.surface.base,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 32,
        borderTopWidth: 1,
        borderTopColor: tokens.border.default,
      },
      cropSheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      },
      cropBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      cropBadge: {
        backgroundColor: tokens.brand.surface,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
      },
      cropBadgeText: {
        color: tokens.brand.primary,
        fontSize: 11.5,
        fontWeight: 'bold',
      },
      cropPageLabel: {
        fontSize: 12,
        color: tokens.text.tertiary,
      },
      cropCloseBtn: {
        padding: 4,
      },
      cropTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: tokens.text.primary,
        lineHeight: 24,
        marginBottom: 8,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      },
      cropSnippet: {
        fontSize: 13.5,
        color: tokens.text.secondary,
        lineHeight: 20,
        marginBottom: 14,
      },
      cropPreviewImage: {
        width: '100%',
        height: 140,
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: tokens.surface.subtle,
      },
      cropActionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      },
      cropDigitalReadBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: tokens.brand.primary,
        paddingVertical: 12,
        borderRadius: 10,
      },
      cropDigitalReadText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
      },
      cropShareBtn: {
        padding: 12,
        borderRadius: 10,
        backgroundColor: tokens.surface.elevated,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
    })
  );

  const activePage = EPAPER_PAGES[currentPageIndex];

  const handleNextPage = () => {
    if (currentPageIndex < EPAPER_PAGES.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const handleDownloadEdition = async () => {
    setIsDownloading(true);
    try {
      const { saveEPaperEditionOffline } = await import('../../services/epaperService');
      await saveEPaperEditionOffline({
        date: '2026-10-07',
        bengaliDate: '০৭ অক্টোবর ২০২৬',
        totalPages: EPAPER_PAGES.length,
        pages: EPAPER_PAGES,
        downloaded: true,
      });
      setIsDownloading(false);
      setDownloaded(true);
      Alert.alert(
        'ই-পেপার ডাউনলোড সম্পন্ন',
        'আজকের দৈনিক আমার দেশ সম্পূর্ণ সংস্করণ অফলাইনে পড়ার জন্য সেভ করা হয়েছে।'
      );
    } catch (err) {
      setIsDownloading(false);
      Alert.alert('ডাউনলোড ত্রুটি', 'ই-পেপার সংস্করণ সেভ করতে সমস্যা হয়েছে।');
    }
  };

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <View style={styles.titleRow}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoBadgeText}>আমার দেশ</Text>
              </View>
              <Text style={styles.headerTitle}>{t('epaper_header', language)}</Text>
            </View>
            <Text style={styles.editionDate}>
              {language === 'bn'
                ? 'ঢাকা সংস্করণ • বুধবার, ০৭ অক্টোবর ২০২৬'
                : 'Dhaka Edition • Wednesday, Oct 7, 2026'}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleDownloadEdition}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name={downloaded ? 'cloud-done' : 'cloud-download-outline'}
                    size={16}
                    color="#FFFFFF"
                  />
                  <Text style={styles.downloadText}>
                    {downloaded ? t('downloaded', language) : t('download', language)}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Page selector chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pageSelectorContainer}
        >
          {EPAPER_PAGES.map((page, index) => {
            const isActive = index === currentPageIndex;
            return (
              <TouchableOpacity
                key={page.pageNumber}
                style={[styles.pageChip, isActive && styles.activePageChip]}
                onPress={() => setCurrentPageIndex(index)}
              >
                <Text
                  style={[
                    styles.pageChipText,
                    isActive && styles.activePageChipText,
                  ]}
                >
                  {t('page_prefix', language)}
                  {formatLocalizedNumeral(page.pageNumber, language)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Image Gallery Viewer */}
      <View style={styles.viewerContainer}>
        <ScrollView
          style={styles.pageScrollView}
          contentContainerStyle={styles.pageScrollContent}
          maximumZoomScale={3}
          minimumZoomScale={1}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.pageImageCard,
              {
                transform: [{ scale: zoomLevel }],
              },
            ]}
          >
            <Image
              source={{ uri: activePage.hdImageUrl }}
              style={styles.pageImage}
              contentFit="contain"
              priority="high"
              cachePolicy="memory-disk"
            />

            {/* Interactive Article Hotspots */}
            {showHotspots &&
              activePage.hotspots?.map((spot) => (
                <TouchableOpacity
                  key={spot.id}
                  style={[
                    styles.hotspotBox,
                    {
                      left: `${spot.x}%`,
                      top: `${spot.y}%`,
                      width: `${spot.width}%`,
                      height: `${spot.height}%`,
                    },
                  ]}
                  onPress={() => setSelectedHotspot(spot)}
                  activeOpacity={0.7}
                >
                  <View style={styles.hotspotPill}>
                    <Ionicons name="scan-outline" size={10} color="#FFFFFF" />
                    <Text style={styles.hotspotPillText}>{t('column_read', language)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        </ScrollView>

        {/* Floating Navigation & Zoom Control Bar */}
        <View style={styles.floatingBar}>
          <TouchableOpacity
            onPress={handlePrevPage}
            disabled={currentPageIndex === 0}
            style={{ opacity: currentPageIndex === 0 ? 0.4 : 1 }}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.barActionText}>
            {t('page_prefix', language)}
            {formatLocalizedNumeral(activePage.pageNumber, language)} /{' '}
            {formatLocalizedNumeral(EPAPER_PAGES.length, language)}
          </Text>

          <TouchableOpacity
            onPress={handleNextPage}
            disabled={currentPageIndex === EPAPER_PAGES.length - 1}
            style={{ opacity: currentPageIndex === EPAPER_PAGES.length - 1 ? 0.4 : 1 }}
          >
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.barDivider} />

          {/* Toggle Interactive Column Hotspots */}
          <TouchableOpacity onPress={() => setShowHotspots((prev) => !prev)}>
            <Ionicons
              name={showHotspots ? 'scan' : 'scan-outline'}
              size={20}
              color={showHotspots ? '#4ADE80' : '#FFFFFF'}
            />
          </TouchableOpacity>

          <View style={styles.barDivider} />

          <TouchableOpacity onPress={toggleZoom}>
            <Ionicons
              name={zoomLevel > 1 ? 'contract-outline' : 'expand-outline'}
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Interactive Article Crop & Hotspot Bottom Sheet Modal */}
      {selectedHotspot && (
        <Modal
          transparent
          animationType="slide"
          visible={!!selectedHotspot}
          onRequestClose={() => setSelectedHotspot(null)}
        >
          <View style={styles.cropModalOverlay}>
            <View style={styles.cropModalSheet}>
              <View style={styles.cropSheetHeader}>
                <View style={styles.cropBadgeRow}>
                  <View style={styles.cropBadge}>
                    <Text style={styles.cropBadgeText}>{selectedHotspot.category}</Text>
                  </View>
                  <Text style={styles.cropPageLabel}>{activePage.title}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedHotspot(null)}
                  style={styles.cropCloseBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close" size={20} color={styles.cropPageLabel.color} />
                </TouchableOpacity>
              </View>

              <Text style={styles.cropTitle}>{selectedHotspot.title}</Text>
              <Text style={styles.cropSnippet}>{selectedHotspot.snippet}</Text>

              {selectedHotspot.cropImageUrl && (
                <Image
                  source={{ uri: selectedHotspot.cropImageUrl }}
                  style={styles.cropPreviewImage}
                  contentFit="cover"
                  transition={200}
                />
              )}

              <View style={styles.cropActionsRow}>
                <TouchableOpacity
                  style={styles.cropDigitalReadBtn}
                  onPress={() => {
                    const targetId = selectedHotspot.articleId || 'art-1';
                    setSelectedHotspot(null);
                    router.push(`/article/${targetId}` as any);
                  }}
                  activeOpacity={0.85}
                >
                  <Ionicons name="reader-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.cropDigitalReadText}>{t('digital_read', language)}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cropShareBtn}
                  onPress={() => {
                    Share.share({
                      title: selectedHotspot.title,
                      message: `${selectedHotspot.title}\n\nদৈনিক আমার দেশ ই-পেপার থেকে সংগৃহীত।\nhttps://www.dailyamardesh.com`,
                    });
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="share-social-outline" size={18} color={styles.cropTitle.color} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
