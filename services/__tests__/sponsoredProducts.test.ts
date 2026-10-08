import {
  getSponsoredProducts,
  getSponsoredProductsByCategory,
  registerSponsoredPartnerProduct,
  resetSponsoredProducts,
  openSponsoredProductUrl,
  PARTNER_BRANDS,
  SponsoredProduct,
} from '../sponsoredProductService';
import { useAppStore } from '../../store/useAppStore';

describe('Dedicated Sponsored Commerce & Partner Marketing System', () => {
  beforeEach(() => {
    resetSponsoredProducts();
    useAppStore.setState({ language: 'bn' });
  });

  it('provides official verified partner brands with metadata', () => {
    expect(PARTNER_BRANDS.length).toBeGreaterThanOrEqual(4);

    const rokomari = PARTNER_BRANDS.find((b) => b.id === 'rokomari');
    expect(rokomari).toBeDefined();
    expect(rokomari?.siteUrl).toMatch(/^https:\/\//);
    expect(rokomari?.tagline).toBeDefined();

    const daraz = PARTNER_BRANDS.find((b) => b.id === 'daraz');
    expect(daraz).toBeDefined();
    expect(daraz?.siteUrl).toMatch(/^https:\/\//);
  });

  it('provides default authentic sponsored products with pricing, discount, and ratings', () => {
    const products = getSponsoredProducts();
    expect(products.length).toBeGreaterThanOrEqual(4);

    for (const prod of products) {
      expect(prod.id).toBeDefined();
      expect(prod.title.length).toBeGreaterThan(0);
      expect(prod.brandName.length).toBeGreaterThan(0);
      expect(prod.salePrice).toBeGreaterThan(0);
      expect(prod.productUrl).toMatch(/^https:\/\//);
      expect(prod.imageUrl).toMatch(/^https:\/\//);
      if (prod.originalPrice) {
        expect(prod.originalPrice).toBeGreaterThanOrEqual(prod.salePrice);
      }
    }
  });

  it('filters sponsored products accurately by category and partner slug', () => {
    const bookProducts = getSponsoredProductsByCategory('বই ও সাহিত্য');
    expect(bookProducts.length).toBeGreaterThan(0);
    expect(bookProducts.every((p) => p.category === 'বই ও সাহিত্য' || p.partnerSlug === 'বই ও সাহিত্য')).toBe(true);

    const rokomariProducts = getSponsoredProductsByCategory('rokomari');
    expect(rokomariProducts.length).toBeGreaterThan(0);
    expect(rokomariProducts.every((p) => p.partnerSlug === 'rokomari')).toBe(true);

    const allProducts = getSponsoredProductsByCategory('সকল');
    expect(allProducts.length).toBe(getSponsoredProducts().length);
  });

  it('allows dynamic e-commerce partner campaign registration to boost sales', () => {
    const customMerchantItem: SponsoredProduct = {
      id: 'sp-custom-apex-01',
      brandName: 'অ্যাপেক্স ফুটওয়্যার',
      partnerSlug: 'apex',
      category: 'ফ্যাশন ও লাইফস্টাইল',
      title: 'প্রিমিয়াম জেনুইন লেদার অফিস শুজ',
      description: 'অফিস ও ফরমাল ইভেন্টের জন্য সেরা আরামদায়ক জুতা।',
      imageUrl: 'https://images.dailyamardesh.com/original_images/arms-987e10-480x270.webp',
      originalPrice: 4500,
      salePrice: 3800,
      discountBadge: '১৫% ছাড়',
      rating: 4.8,
      reviewCount: 92,
      productUrl: 'https://www.apex4u.com',
      campaignBadge: 'নতুন ডিল',
      ctaText: 'অর্ডার করুন',
      inStock: true,
    };

    registerSponsoredPartnerProduct(customMerchantItem);

    const updatedList = getSponsoredProducts();
    const found = updatedList.find((p) => p.id === 'sp-custom-apex-01');
    expect(found).toBeDefined();
    expect(found?.brandName).toBe('অ্যাপেক্স ফুটওয়্যার');
    expect(found?.salePrice).toBe(3800);
  });

  it('integrates enableSponsoredCommerce feature flag into app store', () => {
    const store = useAppStore.getState();
    expect(store.features.enableSponsoredCommerce).toBe(true);

    store.setFeatureFlag('enableSponsoredCommerce', false);
    expect(useAppStore.getState().features.enableSponsoredCommerce).toBe(false);

    store.setFeatureFlag('enableSponsoredCommerce', true);
    expect(useAppStore.getState().features.enableSponsoredCommerce).toBe(true);
  });
});
