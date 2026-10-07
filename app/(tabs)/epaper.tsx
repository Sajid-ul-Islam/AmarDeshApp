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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useThemedStyles } from '../../theme';
import { toBengaliNumeral } from '../../utils/bengali';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// E-Paper pages model with authentic newspaper page divisions
interface EPaperPage {
  pageNumber: number;
  title: string;
  imageUrl: string;
  hdImageUrl: string;
}

const EPAPER_PAGES: EPaperPage[] = [
  {
    pageNumber: 1,
    title: '১ম পাতা (প্রধান খবর)',
    imageUrl: 'https://images.dailyamardesh.com/ad/amardesh-shadhinotar-kotha-bole.jpg',
    hdImageUrl: 'https://images.dailyamardesh.com/manualimages/amardesh-shadhinotar-kotha-bole.jpg',
  },
  {
    pageNumber: 2,
    title: '২য় পাতা (নগর ও জাতীয়)',
    imageUrl: 'https://images.dailyamardesh.com/original_images/imf-24dba6-720x405.webp',
    hdImageUrl: 'https://images.dailyamardesh.com/original_images/imf-24dba6-720x405.webp',
  },
  {
    pageNumber: 3,
    title: '৩য় পাতা (সম্পাদকীয় ও মতামত)',
    imageUrl: 'https://images.dailyamardesh.com/original_images/Mahamudur_rhaman_Q0bVlbS.jpg',
    hdImageUrl: 'https://images.dailyamardesh.com/original_images/Mahamudur_rhaman_Q0bVlbS.jpg',
  },
  {
    pageNumber: 4,
    title: '৪র্থ পাতা (সারা দেশ)',
    imageUrl: 'https://images.dailyamardesh.com/original_images/sonargoan-fbe10b-256x144.webp',
    hdImageUrl: 'https://images.dailyamardesh.com/original_images/sonargoan-fbe10b-256x144.webp',
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
  },
  {
    pageNumber: 7,
    title: '৭ম পাতা (খেলাধুলা)',
    imageUrl: 'https://images.dailyamardesh.com/original_images/vbcjsb1s_lionel-messi-speech-afp_625x300_07_October_26-792a22-720x405.webp',
    hdImageUrl: 'https://images.dailyamardesh.com/original_images/vbcjsb1s_lionel-messi-speech-afp_625x300_07_October_26-792a22-720x405.webp',
  },
  {
    pageNumber: 8,
    title: '৮ম পাতা (ফিচার ও সাহিত্য)',
    imageUrl: 'https://images.dailyamardesh.com/original_images/আমারদেশ-5f83c2-256x144.webp',
    hdImageUrl: 'https://images.dailyamardesh.com/original_images/আমারদেশ-5f83c2-256x144.webp',
  },
];

export default function EPaperScreen() {
  const insets = useSafeAreaInsets();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState<1 | 1.5 | 2>(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

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
      iconButton: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: tokens.surface.elevated,
      },
      pageSelectorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
      },
      pageChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
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
        fontSize: 13,
        color: tokens.text.secondary,
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
        aspectRatio: 0.68, // Traditional newspaper ratio
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      pageImage: {
        width: '100%',
        height: '100%',
      },
      floatingBar: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(17, 24, 39, 0.92)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 24,
        gap: 16,
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
              <Text style={styles.headerTitle}>ই-পেপার সংস্করণ</Text>
            </View>
            <Text style={styles.editionDate}>
              ঢাকা সংস্করণ • বুধবার, ০৭ অক্টোবর ২০২৬
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
                    {downloaded ? 'সংরক্ষিত' : 'ডাউনলোড'}
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
                  পাতা {toBengaliNumeral(page.pageNumber)}
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
            পাতা {toBengaliNumeral(activePage.pageNumber)} / {toBengaliNumeral(EPAPER_PAGES.length)}
          </Text>

          <TouchableOpacity
            onPress={handleNextPage}
            disabled={currentPageIndex === EPAPER_PAGES.length - 1}
            style={{ opacity: currentPageIndex === EPAPER_PAGES.length - 1 ? 0.4 : 1 }}
          >
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
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
    </View>
  );
}
