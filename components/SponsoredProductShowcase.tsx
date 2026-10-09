import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemedStyles, useThemeTokens } from '../theme';
import {
  SponsoredProduct,
  getSponsoredProducts,
  openSponsoredProductUrl,
  openAdInquiryContact,
} from '../services/sponsoredProductService';
import { formatLocalizedNumeral } from '../services/i18n';

interface SponsoredProductShowcaseProps {
  variant?: 'carousel' | 'singleCard';
  products?: SponsoredProduct[];
  title?: string;
  language?: 'bn' | 'en';
  onDismiss?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.72, 270);

export const SponsoredProductShowcase: React.FC<SponsoredProductShowcaseProps> = ({
  variant = 'carousel',
  products,
  title,
  language = 'bn',
  onDismiss,
}) => {
  const tokens = useThemeTokens();
  const [dismissed, setDismissed] = useState(false);

  const displayProducts = products || getSponsoredProducts();

  if (dismissed || !displayProducts || displayProducts.length === 0) {
    return null;
  }

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

  const handleInfoPress = () => {
    Haptics.selectionAsync();
    Alert.alert(
      language === 'bn' ? 'স্পন্সরড পার্টনারশিপ' : 'Sponsored Partnership',
      language === 'bn'
        ? 'দৈনিক আমার দেশ-এ আপনার ই-কমার্স বা প্রতিষ্ঠানের পণ্য প্রচার করে সেলস ও ব্র্যান্ডিং বাড়াতে চান?'
        : 'Want to promote your e-commerce products and increase sales on Daily Amar Desh?',
      [
        {
          text: language === 'bn' ? 'পরে' : 'Later',
          style: 'cancel',
        },
        {
          text: language === 'bn' ? 'বিজ্ঞাপন দিন' : 'Advertise With Us',
          onPress: openAdInquiryContact,
        },
      ]
    );
  };

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        marginVertical: 14,
        paddingVertical: 12,
        backgroundColor: tokens.surface.base,
        borderTopWidth: 0.5,
        borderTopColor: tokens.border.subtle,
        borderBottomWidth: 0.5,
        borderBottomColor: tokens.border.subtle,
      },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 12,
      },
      headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      iconBox: {
        width: 28,
        height: 28,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.crimsonSurface,
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: tokens.text.primary,
        letterSpacing: -0.2,
      },
      headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      adDisclaimerBadge: {
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: tokens.radii.sm,
        backgroundColor: tokens.surface.subtle,
        borderWidth: 0.5,
        borderColor: tokens.border.default,
      },
      adDisclaimerText: {
        fontSize: 10,
        fontWeight: '700',
        color: tokens.text.tertiary,
        textTransform: 'uppercase',
      },
      advertiseBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.surface,
        borderWidth: 0.5,
        borderColor: tokens.brand.primary,
      },
      advertiseBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: tokens.brand.primary,
      },
      scrollContent: {
        paddingHorizontal: 16,
        gap: 12,
      },
      productCard: {
        width: CARD_WIDTH,
        borderRadius: tokens.radii.xl,
        backgroundColor: tokens.surface.elevated,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        overflow: 'hidden',
        ...tokens.shadows.card,
      },
      imageContainer: {
        width: '100%',
        height: 140,
        backgroundColor: tokens.surface.subtle,
      },
      productImage: {
        width: '100%',
        height: '100%',
      },
      discountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: tokens.radii.pill,
        backgroundColor: '#DC2626',
      },
      discountText: {
        color: '#FFFFFF',
        fontSize: 10.5,
        fontWeight: 'bold',
      },
      campaignBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: tokens.radii.pill,
        backgroundColor: 'rgba(0, 107, 63, 0.9)',
      },
      campaignBadgeText: {
        color: '#FFFFFF',
        fontSize: 9.5,
        fontWeight: '700',
      },
      cardBody: {
        padding: 12,
        justifyContent: 'space-between',
        flex: 1,
      },
      brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
      },
      brandName: {
        fontSize: 11,
        color: tokens.brand.primary,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
      },
      ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
      },
      ratingText: {
        fontSize: 11,
        fontWeight: '600',
        color: tokens.text.secondary,
      },
      productTitle: {
        fontSize: 13.5,
        fontWeight: '700',
        color: tokens.text.primary,
        lineHeight: 18,
        marginBottom: 8,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      },
      priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 6,
        marginBottom: 10,
      },
      salePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: tokens.brand.primary,
      },
      originalPrice: {
        fontSize: 12,
        color: tokens.text.tertiary,
        textDecorationLine: 'line-through',
      },
      buyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 9,
        borderRadius: tokens.radii.lg,
        backgroundColor: tokens.brand.primary,
      },
      buyButtonText: {
        color: '#FFFFFF',
        fontSize: 12.5,
        fontWeight: '700',
      },
    })
  );

  return (
    <View style={styles.container}>
      {/* Header Bar with Sponsor Title, Ad Badge, and Info */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Ionicons name="cart" size={15} color={tokens.brand.primary} />
          </View>
          <Text style={styles.headerTitle}>
            {title || (language === 'bn' ? 'স্পন্সরড শপ ও বিশেষ অফার' : 'Sponsored Deals & Shop')}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.adDisclaimerBadge}>
            <Text style={styles.adDisclaimerText}>
              {language === 'bn' ? 'বিজ্ঞাপন' : 'AD'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.advertiseBtn}
            onPress={handleInfoPress}
            activeOpacity={0.7}
            accessibilityLabel="বিজ্ঞাপন দিন"
          >
            <Ionicons name="megaphone-outline" size={12} color={tokens.brand.primary} />
            <Text style={styles.advertiseBtnText}>
              {language === 'bn' ? 'প্রচার করুন' : 'Advertise'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Cards Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 12}
        contentContainerStyle={styles.scrollContent}
      >
        {displayProducts.map((product) => {
          const discountStr = product.discountBadge || '';
          return (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => handleProductPress(product)}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel={`${product.title} - ${product.brandName}`}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: product.imageUrl }}
                  style={styles.productImage}
                  contentFit="cover"
                  transition={200}
                />

                {Boolean(discountStr) && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{discountStr}</Text>
                  </View>
                )}

                {Boolean(product.campaignBadge) && (
                  <View style={styles.campaignBadge}>
                    <Text style={styles.campaignBadgeText}>{product.campaignBadge}</Text>
                  </View>
                )}
              </View>

              <View style={styles.cardBody}>
                <View>
                  <View style={styles.brandRow}>
                    <Text style={styles.brandName} numberOfLines={1}>
                      {product.brandName}
                    </Text>

                    {product.rating ? (
                      <View style={styles.ratingBox}>
                        <Ionicons name="star" size={11} color="#F59E0B" />
                        <Text style={styles.ratingText}>
                          {formatLocalizedNumeral(product.rating, language)}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.productTitle} numberOfLines={2}>
                    {product.title}
                  </Text>
                </View>

                <View>
                  <View style={styles.priceRow}>
                    <Text style={styles.salePrice}>
                      ৳ {formatLocalizedNumeral(product.salePrice, language)}
                    </Text>
                    {product.originalPrice ? (
                      <Text style={styles.originalPrice}>
                        ৳ {formatLocalizedNumeral(product.originalPrice, language)}
                      </Text>
                    ) : null}
                  </View>

                  <TouchableOpacity
                    style={styles.buyButton}
                    onPress={() => handleProductPress(product)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.buyButtonText}>
                      {product.ctaText || (language === 'bn' ? 'অর্ডার করুন' : 'Order Now')}
                    </Text>
                    <Ionicons name="open-outline" size={13} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
