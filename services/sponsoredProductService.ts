import { Linking } from 'react-native';
import { trackEvent } from '../user';

export interface SponsoredProduct {
  id: string;
  brandName: string;
  partnerSlug: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  originalPrice?: number;
  salePrice: number;
  currencySymbol?: string;
  discountBadge?: string;
  rating?: number;
  reviewCount?: number;
  productUrl: string;
  campaignBadge?: string;
  ctaText?: string;
  inStock?: boolean;
}

export interface PartnerBrand {
  id: string;
  name: string;
  tagline: string;
  category: string;
  siteUrl: string;
  bannerColor: string;
}

export const PARTNER_BRANDS: PartnerBrand[] = [
  {
    id: 'rokomari',
    name: 'রকমারি ডট কম',
    tagline: 'বাংলাদেশের সর্ববৃহৎ অনলাইন বইয়ের বাজার',
    category: 'বই ও সাহিত্য',
    siteUrl: 'https://www.rokomari.com',
    bannerColor: '#0284C7',
  },
  {
    id: 'daraz',
    name: 'দারাজ বাংলাদেশ',
    tagline: 'অনলাইন শপিংয়ের বিশ্বস্ত ঠিকানা ও মেগা সেলস',
    category: 'ই-কমার্স',
    siteUrl: 'https://www.daraz.com.bd',
    bannerColor: '#F97316',
  },
  {
    id: 'walton',
    name: 'ওয়ালটন ডিজি-টেক',
    tagline: 'স্মার্ট ল্যাপটপ ও হোম অ্যাপ্লায়েন্স - মেড ইন বাংলাদেশ',
    category: 'ইলেকট্রনিক্স',
    siteUrl: 'https://waltondigitech.com',
    bannerColor: '#2563EB',
  },
  {
    id: 'aarong',
    name: 'আড়ং',
    tagline: 'ঐতিহ্যবাহী বাংলাদেশি হস্তশিল্প ও ফ্যাশন পোশাক',
    category: 'ফ্যাশন ও লাইফস্টাইল',
    siteUrl: 'https://www.aarong.com',
    bannerColor: '#9333EA',
  },
  {
    id: 'shwapno',
    name: 'স্বপ্ন সুপারশপ',
    tagline: 'তাজা বাজার ও সেরা সাশ্রয়ে অনলাইন ডেলিভারি',
    category: 'গ্রোসারি ও সুপারশপ',
    siteUrl: 'https://www.shwapno.com',
    bannerColor: '#16A34A',
  },
];

export const DEFAULT_SPONSORED_PRODUCTS: SponsoredProduct[] = [
  {
    id: 'sp-rokomari-01',
    brandName: 'রকমারি ডট কম',
    partnerSlug: 'rokomari',
    category: 'বই ও সাহিত্য',
    title: 'আমার দেশ ও আত্মমর্যাদার সংগ্রাম - বিশেষ সংস্করণ',
    description: 'সংবাদমাধ্যমের স্বাধীনতা ও জাতির মুক্তিসংগ্রামের অবিস্মরণীয় দলিল। বিশেষ ছাড়ে সংগ্রহ করুন।',
    imageUrl: 'https://images.dailyamardesh.com/original_images/imf-24dba6-720x405.webp',
    originalPrice: 750,
    salePrice: 580,
    discountBadge: '২৩% ছাড়',
    rating: 4.9,
    reviewCount: 342,
    productUrl: 'https://www.rokomari.com/book',
    campaignBadge: 'হট ডিল',
    ctaText: 'অর্ডার করুন',
    inStock: true,
  },
  {
    id: 'sp-daraz-01',
    brandName: 'দারাজ মল',
    partnerSlug: 'daraz',
    category: 'ই-কমার্স',
    title: 'স্মার্ট গ্যাজেট ও ইলেকট্রনিক্স মেগা উইক সেল',
    description: 'দৈনিক আমার দেশ পাঠকদের জন্য ব্র্যান্ডেড হেডফোন ও স্মার্টওয়াচে অতিরিক্ত ভাউচার ছাড়।',
    imageUrl: 'https://images.dailyamardesh.com/original_images/arms-987e10-480x270.webp',
    originalPrice: 3200,
    salePrice: 2450,
    discountBadge: '২৫% ছাড়',
    rating: 4.8,
    reviewCount: 512,
    productUrl: 'https://www.daraz.com.bd',
    campaignBadge: 'মেগা ডিল',
    ctaText: 'কিনুন',
    inStock: true,
  },
  {
    id: 'sp-walton-01',
    brandName: 'ওয়ালটন ডিজি-টেক',
    partnerSlug: 'walton',
    category: 'ইলেকট্রনিক্স',
    title: 'ওয়ালটন প্রিলুড এন৫১ জেন-১১ স্মার্ট ল্যাপটপ',
    description: 'শিক্ষার্থী ও ফ্রিল্যান্সারদের জন্য সাশ্রয়ী মূল্যে দ্রুতগতির পারফরম্যান্স ও দীর্ঘ ব্যাটারি লাইফ।',
    imageUrl: 'https://images.dailyamardesh.com/original_images/ec-3f309a-720x405.webp',
    originalPrice: 42000,
    salePrice: 37500,
    discountBadge: '১০% ছাড়',
    rating: 4.7,
    reviewCount: 198,
    productUrl: 'https://waltondigitech.com',
    campaignBadge: 'অফিসিয়াল',
    ctaText: 'বিস্তারিত দেখুন',
    inStock: true,
  },
  {
    id: 'sp-aarong-01',
    brandName: 'আড়ং লাইফস্টাইল',
    partnerSlug: 'aarong',
    category: 'ফ্যাশন ও লাইফস্টাইল',
    title: 'প্রিমিয়াম সুতি তাঁতের পাঞ্জাবি ও জামদানি কালেকশন',
    description: 'হাতে বোনা দেশীয় ঐতিহ্য ও আধুনিক ডিজাইনের সমন্বয়ে উৎসবের সেরা পোশাক সম্ভার।',
    imageUrl: 'https://images.dailyamardesh.com/original_images/tarique-6d9b3a-720x405.webp',
    originalPrice: 2800,
    salePrice: 2350,
    discountBadge: '১৬% ছাড়',
    rating: 4.9,
    reviewCount: 260,
    productUrl: 'https://www.aarong.com',
    campaignBadge: 'নতুন কালেকশন',
    ctaText: 'সংগ্রহ করুন',
    inStock: true,
  },
  {
    id: 'sp-shwapno-01',
    brandName: 'স্বপ্ন সুপারশপ',
    partnerSlug: 'shwapno',
    category: 'গ্রোসারি ও সুপারশপ',
    title: 'স্বপ্ন খাঁটি প্রিমিয়াম সরিষার তেল ও গ্রোসারি প্যাক',
    description: 'ন্যায্য মূল্যে ভেজালমুক্ত স্বাস্থ্যকর নিত্যপণ্য ১ ঘণ্টার এক্সপ্রেস হোম ডেলিভারিতে।',
    imageUrl: 'https://images.dailyamardesh.com/original_images/imf-24dba6-720x405.webp',
    originalPrice: 1250,
    salePrice: 1050,
    discountBadge: '১৫% ছাড়',
    rating: 4.8,
    reviewCount: 420,
    productUrl: 'https://www.shwapno.com',
    campaignBadge: 'সুপার সেভার',
    ctaText: 'অর্ডার করুন',
    inStock: true,
  },
];

let customPartnerProducts: SponsoredProduct[] = [...DEFAULT_SPONSORED_PRODUCTS];

/**
 * Returns all active sponsored commercial products
 */
export function getSponsoredProducts(): SponsoredProduct[] {
  return customPartnerProducts;
}

/**
 * Returns sponsored products filtered by partner or category
 */
export function getSponsoredProductsByCategory(category: string): SponsoredProduct[] {
  if (!category || category === 'সকল') {
    return customPartnerProducts;
  }
  return customPartnerProducts.filter(
    (p) => p.category === category || p.partnerSlug === category
  );
}

/**
 * Allows dynamic partner registration for e-commerce / merchants
 */
export function registerSponsoredPartnerProduct(product: SponsoredProduct): void {
  const existingIdx = customPartnerProducts.findIndex((p) => p.id === product.id);
  if (existingIdx >= 0) {
    customPartnerProducts[existingIdx] = product;
  } else {
    customPartnerProducts.unshift(product);
  }
}

/**
 * Reset partner products to defaults
 */
export function resetSponsoredProducts(): void {
  customPartnerProducts = [...DEFAULT_SPONSORED_PRODUCTS];
}

/**
 * Tracks an ad impression for partner analytics
 */
export function trackSponsoredImpression(productId: string): void {
  trackEvent('sponsored_product_impression', 'ad', productId);
}

/**
 * Tracks click and opens the external partner/merchant store URL
 */
export async function openSponsoredProductUrl(product: SponsoredProduct): Promise<boolean> {
  trackEvent('sponsored_product_click', 'ad', product.id, {
    brand: product.brandName,
    partner: product.partnerSlug,
    targetUrl: product.productUrl,
    salePrice: product.salePrice,
  });

  try {
    const canOpen = await Linking.canOpenURL(product.productUrl);
    if (canOpen) {
      await Linking.openURL(product.productUrl);
      return true;
    }
  } catch (error) {
    console.warn('Failed to open sponsored product URL:', error);
  }
  return false;
}

/**
 * Contact marketing & commercial sales desk for merchants wanting to run campaigns
 */
export async function openAdInquiryContact(): Promise<void> {
  const email = 'ads@dailyamardesh.com';
  const subject = encodeURIComponent('দৈনিক আমার দেশ অ্যাপে বিজ্ঞাপন ও স্পন্সরড প্রোডাক্ট প্রচার সংক্রান্ত');
  const body = encodeURIComponent(
    'সম্মানিত বিজ্ঞাপন বিভাগ,\n\nআমরা আমাদের ব্র্যান্ড/ই-কমার্স পণ্যের প্রচার ও সেলস ক্যাম্পেইন পরিচালনা করতে আগ্রহী। অনুগ্রহ করে রেটকার্ড ও পার্টনারশিপ বিবরণ পাঠান।\n\nব্র্যান্ডের নাম:\nযোগাযোগ নম্বর:\nওয়েবসাইট:'
  );
  const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

  try {
    await Linking.openURL(mailtoUrl);
  } catch (error) {
    console.warn('Unable to open mail client for ad inquiry:', error);
  }
}
