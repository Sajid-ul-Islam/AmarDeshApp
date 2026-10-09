import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemedStyles, useThemeTokens } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import {
  SponsoredProduct,
  PARTNER_BRANDS,
  getSponsoredProducts,
  getSponsoredProductsByCategory,
  openSponsoredProductUrl,
  openAdInquiryContact,
} from '../../services/sponsoredProductService';
import { formatLocalizedNumeral } from '../../services/i18n';
import { getSafeHeaderPaddingTop } from '../../utils/layout';
import { AmarDeshLogo } from '../../components/AmarDeshLogo';

const CATEGORIES = ['সকল', 'বই ও সাহিত্য', 'ই-কমার্স', 'ইলেকট্রনিক্স', 'ফ্যাশন ও লাইফস্টাইল', 'গ্রোসারি ও সুপারশপ'];

export default function SponsoredMarketplaceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tokens = useThemeTokens();
  const language = useAppStore((state) => state.language);
  const [selectedCategory, setSelectedCategory] = useState('সকল');

  const products = getSponsoredProductsByCategory(selectedCategory);

  const handleProductPress = async (product: SponsoredProduct) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const opened = await openSponsoredProductUrl(product);
    if (!opened) {
      Alert.alert(
        language === 'bn' ? 'লিংক খোলা যায়নি' : 'Unable to open link',
        language === 'bn'
          ? 'ব্রাউজারে পণ্যটির পাতা খুলতে সমস্যা হয়েছে।'
          : 'Failed to open the partner product page.'
      );
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
        paddingBottom: 12,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      },
      backBtn: {
        padding: 6,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
      },
      headerTitleCol: {
        justifyContent: 'center',
      },
      headerTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: tokens.text.primary,
        letterSpacing: -0.2,
      },
      headerSubtitle: {
        fontSize: 11,
        color: tokens.text.secondary,
        marginTop: 1,
      },
      heroBanner: {
        margin: 16,
        padding: 16,
        borderRadius: tokens.radii.xl,
        backgroundColor: tokens.surface.base,
        borderWidth: 1,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      heroBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
      },
      heroBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.crimsonSurface,
        borderWidth: 0.5,
        borderColor: tokens.brand.primary,
      },
      heroBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: tokens.brand.primary,
      },
      disclaimerText: {
        fontSize: 11,
        color: tokens.text.tertiary,
      },
      heroTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: tokens.text.primary,
        marginBottom: 4,
      },
      heroDesc: {
        fontSize: 12.5,
        color: tokens.text.secondary,
        lineHeight: 18,
      },
      partnerBrandsSection: {
        marginBottom: 14,
      },
      sectionHeading: {
        fontSize: 14,
        fontWeight: '700',
        color: tokens.text.primary,
        paddingHorizontal: 16,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
      },
      partnerScroll: {
        paddingHorizontal: 16,
        gap: 10,
      },
      partnerChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: tokens.radii.lg,
        backgroundColor: tokens.surface.base,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        alignItems: 'center',
      },
      partnerChipName: {
        fontSize: 12.5,
        fontWeight: '700',
        color: tokens.text.primary,
      },
      partnerChipCat: {
        fontSize: 10.5,
        color: tokens.text.secondary,
        marginTop: 2,
      },
      categoryScroll: {
        paddingHorizontal: 16,
        paddingBottom: 10,
        gap: 8,
      },
      categoryChip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.base,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
      },
      categoryChipActive: {
        backgroundColor: tokens.brand.primary,
        borderColor: tokens.brand.primary,
      },
      categoryChipText: {
        fontSize: 12,
        fontWeight: '600',
        color: tokens.text.secondary,
      },
      categoryChipTextActive: {
        color: '#FFFFFF',
        fontWeight: '700',
      },
      productList: {
        paddingHorizontal: 16,
        paddingBottom: 30,
        gap: 14,
      },
      productCard: {
        borderRadius: tokens.radii.xl,
        backgroundColor: tokens.surface.base,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        overflow: 'hidden',
        ...tokens.shadows.card,
      },
      imageBox: {
        width: '100%',
        height: 170,
        backgroundColor: tokens.surface.subtle,
      },
      productImg: {
        width: '100%',
        height: '100%',
      },
      discountPill: {
        position: 'absolute',
        top: 10,
        left: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: tokens.radii.pill,
        backgroundColor: '#DC2626',
      },
      discountPillText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold',
      },
      productBody: {
        padding: 14,
      },
      cardMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
      },
      brandTag: {
        fontSize: 11.5,
        fontWeight: '700',
        color: tokens.brand.primary,
        textTransform: 'uppercase',
      },
      ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      },
      ratingScore: {
        fontSize: 11.5,
        fontWeight: '600',
        color: tokens.text.secondary,
      },
      cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: tokens.text.primary,
        lineHeight: 21,
        marginBottom: 6,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      },
      cardDesc: {
        fontSize: 12.5,
        color: tokens.text.secondary,
        lineHeight: 18,
        marginBottom: 12,
      },
      cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        borderTopWidth: 0.5,
        borderTopColor: tokens.border.subtle,
      },
      priceCol: {
        justifyContent: 'center',
      },
      salePriceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tokens.brand.primary,
      },
      origPriceText: {
        fontSize: 12,
        color: tokens.text.tertiary,
        textDecorationLine: 'line-through',
      },
      ctaBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.primary,
      },
      ctaBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
      },
      partnerInquiryBox: {
        marginHorizontal: 16,
        marginTop: 10,
        marginBottom: 30,
        padding: 16,
        borderRadius: tokens.radii.xl,
        backgroundColor: tokens.brand.surface,
        borderWidth: 1,
        borderColor: tokens.brand.primary,
        alignItems: 'center',
      },
      inquiryTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: tokens.brand.primary,
        marginBottom: 4,
        textAlign: 'center',
      },
      inquiryDesc: {
        fontSize: 12,
        color: tokens.text.secondary,
        textAlign: 'center',
        lineHeight: 17,
        marginBottom: 12,
      },
      inquiryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.primary,
      },
      inquiryBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
      },
    })
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="ফিরে যান"
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={tokens.text.primary} />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>
              {language === 'bn' ? 'স্পন্সরড মার্কেটপ্লেস' : 'Sponsored Marketplace'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {language === 'bn' ? 'বিশ্বস্ত পার্টনার ও বিশেষ অফার' : 'Trusted Partners & Deals'}
            </Text>
          </View>
        </View>

        <AmarDeshLogo height={24} variant="png" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Promotional Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>
                {language === 'bn' ? 'অফিসিয়াল পার্টনারশিপ' : 'Official Partnership'}
              </Text>
            </View>
            <Text style={styles.disclaimerText}>
              {language === 'bn' ? 'বাণিজ্যিক প্রচার' : 'Sponsored'}
            </Text>
          </View>
          <Text style={styles.heroTitle}>
            {language === 'bn'
              ? 'দৈনিক আমার দেশ পাঠকদের জন্য এক্সক্লুসিভ ডিলস'
              : 'Exclusive Deals for Daily Amar Desh Readers'}
          </Text>
          <Text style={styles.heroDesc}>
            {language === 'bn'
              ? 'আমাদের অনুমোদিত শীর্ষস্থানীয় ই-কমার্স ও দেশীয় ব্র্যান্ডসমূহ থেকে বিশেষ ছাড়ে আসল পণ্য সংগ্রহ করুন।'
              : 'Shop authentic products with special discounts directly from verified partner stores.'}
          </Text>
        </View>

        {/* Partner Brands Shelf */}
        <View style={styles.partnerBrandsSection}>
          <Text style={styles.sectionHeading}>
            {language === 'bn' ? 'শীর্ষ পার্টনার ব্র্যান্ডস' : 'Top Partner Brands'}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.partnerScroll}
          >
            {PARTNER_BRANDS.map((brand) => (
              <TouchableOpacity
                key={brand.id}
                style={styles.partnerChip}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedCategory(brand.category);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.partnerChipName}>{brand.name}</Text>
                <Text style={styles.partnerChipCat}>{brand.category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isCur = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, isCur && styles.categoryChipActive]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedCategory(cat);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isCur && styles.categoryChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Product Catalog Stream */}
        <View style={styles.productList}>
          {products.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => handleProductPress(product)}
              activeOpacity={0.92}
            >
              <View style={styles.imageBox}>
                <Image
                  source={{ uri: product.imageUrl }}
                  style={styles.productImg}
                  contentFit="cover"
                  transition={200}
                />
                {product.discountBadge ? (
                  <View style={styles.discountPill}>
                    <Text style={styles.discountPillText}>{product.discountBadge}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.productBody}>
                <View style={styles.cardMetaRow}>
                  <Text style={styles.brandTag}>{product.brandName}</Text>
                  {product.rating ? (
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={12} color="#F59E0B" />
                      <Text style={styles.ratingScore}>
                        {formatLocalizedNumeral(product.rating, language)} ({formatLocalizedNumeral(product.reviewCount || 0, language)})
                      </Text>
                    </View>
                  ) : null}
                </View>

                <Text style={styles.cardTitle} numberOfLines={2}>
                  {product.title}
                </Text>
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {product.description}
                </Text>

                <View style={styles.cardFooter}>
                  <View style={styles.priceCol}>
                    <Text style={styles.salePriceText}>
                      ৳ {formatLocalizedNumeral(product.salePrice, language)}
                    </Text>
                    {product.originalPrice ? (
                      <Text style={styles.origPriceText}>
                        ৳ {formatLocalizedNumeral(product.originalPrice, language)}
                      </Text>
                    ) : null}
                  </View>

                  <TouchableOpacity
                    style={styles.ctaBtn}
                    onPress={() => handleProductPress(product)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.ctaBtnText}>
                      {product.ctaText || (language === 'bn' ? 'অর্ডার করুন' : 'Order Now')}
                    </Text>
                    <Ionicons name="open-outline" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Advertise with Daily Amar Desh Commercial CTA */}
        <View style={styles.partnerInquiryBox}>
          <Ionicons name="megaphone" size={24} color={tokens.brand.primary} style={{ marginBottom: 6 }} />
          <Text style={styles.inquiryTitle}>
            {language === 'bn'
              ? 'আপনার ব্যবসা বা পণ্যের প্রচার করতে চান?'
              : 'Want to Advertise Your Business or Products?'}
          </Text>
          <Text style={styles.inquiryDesc}>
            {language === 'bn'
              ? 'দৈনিক আমার দেশ-এর লাখো সচেতন পাঠকের কাছে আপনার ই-কমার্স পণ্য ও ব্র্যান্ড ক্যাম্পেইন পৌঁছে দিন।'
              : 'Reach hundreds of thousands of engaged readers with high-converting sponsored commerce placement.'}
          </Text>
          <TouchableOpacity
            style={styles.inquiryBtn}
            onPress={openAdInquiryContact}
            activeOpacity={0.8}
          >
            <Text style={styles.inquiryBtnText}>
              {language === 'bn' ? 'বিজ্ঞাপন যোগাযোগ' : 'Contact Ad Desk'}
            </Text>
            <Ionicons name="mail" size={15} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
