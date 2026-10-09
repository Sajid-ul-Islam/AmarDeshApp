import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../theme';

export interface AdData {
  id: string;
  brandName: string;
  badge?: string;
  title: string;
  description: string;
  ctaText?: string;
  imageUrl?: string;
  targetUrl?: string;
}

/**
 * House advertisements.
 *
 * These are placeholder editorial units, not paid inventory: there is no ad SDK,
 * no impression/click tracking, and no consent flow in this build. They must not
 * masquerade as commercial advertising.
 *
 * A previous entry advertised the app developer's own agency (cybrcraft.com).
 * It was removed: shipping a supplier's own promotion inside the newspaper's
 * reader is not a house ad and reads as an undisclosed advertorial. Replace this
 * list with real inventory (sponsoredProductService or an ad network) before
 * enabling any revenue reporting.
 */
const HOUSE_ADS: AdData[] = [
  {
    id: 'ad-amar-desh-print',
    brandName: 'আমার দেশ প্রকাশনা',
    badge: 'আমার দেশ',
    title: 'দৈনিক আমার দেশ প্রিন্ট ও ই-পেপার বার্ষিক গ্রাহক সেবা',
    description: 'সত্য ও নির্ভীক সাংবাদিকতার পাশে থাকুন। আজই গ্রাহক হয়ে বিশেষ ছাড় উপভোগ করুন।',
    ctaText: 'গ্রাহক হন',
    imageUrl: 'https://images.dailyamardesh.com/ad/amardesh-shadhinotar-kotha-bole.jpg',
    targetUrl: 'https://www.dailyamardesh.com/subscription',
  },
];

interface AdBannerProps {
  variant?: 'feed' | 'articleFooter' | 'compact';
  customAd?: AdData;
  onDismiss?: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  variant = 'feed',
  customAd,
  onDismiss,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const ad = customAd || HOUSE_ADS[0];

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        backgroundColor: tokens.surface.elevated,
        borderRadius: tokens.radii.lg,
        padding: 14,
        marginVertical: 12,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
      },
      badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      },
      adLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: tokens.text.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        backgroundColor: tokens.surface.subtle,
        paddingHorizontal: 8,
        paddingVertical: 2.5,
        borderRadius: tokens.radii.pill,
      },
      brandName: {
        fontSize: 11.5,
        fontWeight: '600',
        color: tokens.brand.primary,
      },
      closeButton: {
        width: 24,
        height: 24,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.subtle,
        alignItems: 'center',
        justifyContent: 'center',
      },
      bodyContent: {
        flexDirection: variant === 'compact' ? 'row' : 'column',
        gap: 10,
      },
      adImage: {
        width: '100%',
        height: variant === 'articleFooter' ? 140 : 120,
        borderRadius: tokens.radii.md,
        backgroundColor: tokens.surface.subtle,
      },
      compactImage: {
        width: 80,
        height: 60,
        borderRadius: tokens.radii.sm,
      },
      textBlock: {
        flex: 1,
        justifyContent: 'center',
      },
      title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: tokens.text.primary,
        lineHeight: 20,
        marginBottom: 4,
      },
      description: {
        fontSize: 12,
        color: tokens.text.secondary,
        lineHeight: 17,
        marginBottom: 10,
      },
      ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: tokens.brand.primary,
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: tokens.radii.pill,
        gap: 5,
        ...tokens.shadows.sm,
      },
      ctaText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
      },
      dismissedBox: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: tokens.surface.subtle,
        borderRadius: tokens.radii.md,
        marginVertical: 6,
      },
      dismissedText: {
        fontSize: 11,
        color: tokens.text.tertiary,
      },
    })
  );

  const handlePress = async () => {
    if (ad.targetUrl) {
      const supported = await Linking.canOpenURL(ad.targetUrl).catch(() => false);
      if (supported) {
        await Linking.openURL(ad.targetUrl).catch(() => {});
      }
    }
  };

  const handleClose = () => {
    setIsDismissed(true);
    if (onDismiss) onDismiss();
  };

  if (isDismissed) {
    return (
      <View style={styles.dismissedBox}>
        <Text style={styles.dismissedText}>বিজ্ঞাপনটি প্রদর্শন বন্ধ করা হয়েছে</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.badgeContainer}>
          <Text style={styles.adLabel}>বিজ্ঞাপন • SPONSORED</Text>
          <Text style={styles.brandName}>{ad.brandName}</Text>
        </View>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="বিজ্ঞাপন বন্ধ করুন"
        >
          <Ionicons name="close" size={14} color={styles.description.color} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        style={styles.bodyContent}
      >
        {ad.imageUrl && (
          <Image
            source={{ uri: ad.imageUrl }}
            style={variant === 'compact' ? styles.compactImage : styles.adImage}
            contentFit="cover"
            transition={200}
          />
        )}
        <View style={styles.textBlock}>
          <Text style={styles.title} numberOfLines={2}>
            {ad.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {ad.description}
          </Text>
          <View style={styles.ctaButton}>
            <Text style={styles.ctaText}>{ad.ctaText || 'বিস্তারিত জানুন'}</Text>
            <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
