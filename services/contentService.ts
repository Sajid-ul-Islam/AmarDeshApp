import { Article } from '../data/mockData';
import { getArticles } from './articleStore';

export interface CategoryMeta {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isSpecial?: boolean;
}

export const SITE_CATEGORIES: CategoryMeta[] = [
  { id: 'all', name: 'সর্বশেষ', slug: 'latest' },
  { id: 'july-revolution', name: 'জুলাই বিপ্লব', slug: 'july-revolution', isSpecial: true },
  { id: 'national', name: 'জাতীয়', slug: 'national' },
  { id: 'politics', name: 'রাজনীতি', slug: 'politics' },
  { id: 'business', name: 'বাণিজ্য', slug: 'business' },
  { id: 'bangladesh', name: 'সারা দেশ', slug: 'bangladesh' },
  { id: 'entertainment', name: 'বিনোদন', slug: 'entertainment' },
  { id: 'world', name: 'বিশ্ব', slug: 'world' },
  { id: 'sports', name: 'খেলা', slug: 'sports' },
  { id: 'islam', name: 'ইসলাম ও জীবন', slug: 'religion-islam' },
  { id: 'opinion', name: 'মতামত', slug: 'op-ed' },
  { id: 'feature', name: 'ফিচার', slug: 'feature' },
  { id: 'education', name: 'শিক্ষা', slug: 'education' },
  { id: 'corporate', name: 'কর্পোরেট', slug: 'corporate' },
];

// Rich fallback articles for categories to guarantee pristine display across all verticals
export const CATEGORY_ARTICLES: Record<string, Article[]> = {
  'july-revolution': [
    {
      id: 'july-001',
      title: 'জুলাই গণঅভ্যুত্থানের ঐতিহাসিক দলিল: শহীদদের স্মৃতিকথা ও আকাঙ্ক্ষার বাংলাদেশ',
      excerpt: '২০২৪ সালের জুলাই গণঅভ্যুত্থান বাংলাদেশের গণতন্ত্র পুনরুদ্ধারের ইতিহাসে এক অবিস্মরণীয় মাইলফলক। ছাত্র-জনতার রক্তস্নাত আত্মত্যাগে রচিত হয়েছে নতুন দিগন্ত।',
      content: `২০২৪ সালের জুলাই গণঅভ্যুত্থান বাংলাদেশের গণতন্ত্র পুনরুদ্ধারের ইতিহাসে এক অবিস্মরণীয় মাইলফলক। ছাত্র-জনতার রক্তস্নাত আত্মত্যাগে রচিত হয়েছে নতুন দিগন্ত।

আন্দোলনের প্রথম প্রহর থেকেই সাধারণ শিক্ষার্থীরা বুক চিতিয়ে দাঁড়িয়েছিল অন্যায় ও বৈষম্যের বিরুদ্ধে। রাজধানী ঢাকা থেকে শুরু করে চট্টগ্রাম, রাজশাহী, রংপুর ও খুলনার রাজপথ রঞ্জিত হয়েছিল শহীদদের রক্তে।

শহীদ আবু সাঈদ, মীর মুগ্ধসহ শত শত শহীদের বীরত্ব আজ জাতীয় ইতিহাসের অবিচ্ছেদ্য অংশ। তাঁদের আত্মত্যাগ বৃথা যেতে দেওয়া যাবে না। বিচার ও রাষ্ট্র সংস্কারের দাবি আজ দেশের প্রতিটি মানুষের হৃদয়ে প্রতিধ্বনিত হচ্ছে।`,
      category: 'জুলাই বিপ্লব',
      imageUrl: 'https://images.dailyamardesh.com/original_images/আবরার-d8ad6c-256x144.webp',
      author: 'বিশেষ প্রতিবেদক',
      publishedAt: '2026-10-07T06:00:00Z',
      isBreaking: true,
    },
    {
      id: 'july-002',
      title: 'জুলাই সনদ ও রাষ্ট্র সংস্কার: রাজনৈতিক দলগুলোর সর্বসম্মত রূপরেখা তৈরির তাগিদ',
      excerpt: 'জুলাই জাতীয় সনদের মূল চেতনা বাস্তবায়নে দ্রুত আইনি ও সাংবিধানিক কাঠামো সংস্কারের আহ্বান জানিয়েছেন বিশ্লেষকরা।',
      content: `জুলাই জাতীয় সনদের মূল চেতনা বাস্তবায়নে দ্রুত আইনি ও সাংবিধানিক কাঠামো সংস্কারের আহ্বান জানিয়েছেন বিশিষ্ট রাষ্ট্রবিজ্ঞানী ও নাগরিক সমাজের প্রতিনিধিরা।

তাঁরা বলেন, বৈষম্যহীন নতুন বাংলাদেশ গড়তে হলে বিচার বিভাগের পূর্ণ স্বাধীনতা এবং নির্বাচনী ব্যবস্থার আমূল সংস্কার অনিবার্য। কেবল ক্ষমতার পালাবদল নয়, বরং কাঠামোগত পরিবর্তনই আন্দোলনের মূল প্রাপ্তি হওয়া উচিত।`,
      category: 'জুলাই বিপ্লব',
      imageUrl: 'https://images.dailyamardesh.com/original_images/LongMarchJamaat-f51ed9-256x144.webp',
      author: 'রাজনৈতিক প্রতিবেদক',
      publishedAt: '2026-10-06T18:30:00Z',
    },
  ],
  'opinion': [
    {
      id: 'op-001',
      title: 'অপারেশন ক্লিন হার্টের ফাঁদে পা না দেওয়াই উত্তম — মাহমুদুর রহমান',
      excerpt: 'অতীতে পরিচালিত বিভিন্ন অভিযান ও আইন প্রয়োগকারী সংস্থার কার্যক্রমের তিক্ত অভিজ্ঞতা থেকে শিক্ষা নেওয়া জরুরি। জনগণের মৌলিক অধিকার সুরক্ষা সবার আগে।',
      content: `অতীতে পরিচালিত বিভিন্ন অভিযান ও আইন প্রয়োগকারী সংস্থার কার্যক্রমের তিক্ত অভিজ্ঞতা থেকে শিক্ষা নেওয়া জরুরি। জনগণের মৌলিক অধিকার ও জীবনের নিরাপত্তা সুরক্ষা নিশ্চিত না করে কোনো অভিযান ইতিবাচক ফল বয়ে আনতে পারে না।

আইনের শাসন প্রতিষ্ঠা করতে হলে পক্ষপাতহীন তদন্ত ও বিচারিক প্রক্রিয়া নিশ্চিত করতে হবে। কোনো বিশেষ এজেন্ডা বাস্তবায়নের হাতিয়ার হিসেবে আইনশৃঙ্খলা বাহিনীকে ব্যবহার করার প্রবণতা বন্ধ করতে হবে।`,
      category: 'মতামত',
      imageUrl: 'https://images.dailyamardesh.com/original_images/Mahamudur_rhaman_Q0bVlbS.jpg',
      author: 'মাহমুদুর রহমান (সম্পাদক ও প্রকাশক)',
      publishedAt: '2026-10-07T08:42:07Z',
      isBreaking: false,
    },
  ],
  'islam': [
    {
      id: 'isl-001',
      title: 'ইসলামে সামাজিক ন্যায়বিচার ও ইনসাফভিত্তিক সমাজ বিনির্মাণের রূপরেখা',
      excerpt: 'আল্লাহ তাআলা ইনসাফ ও সদাচরণের নির্দেশ দিয়েছেন। প্রতিটি মুসলমানের দায়িত্ব সমাজে ইনসাফ কায়েম রাখা।',
      content: `ইসলামের মূল সৌন্দর্যই হলো ইনসাফ ও সামাজিক ন্যায়বিচার। রাসূলে কারিম (সা.) মদিনা সনদের মাধ্যমে যে আদর্শ সমাজ ও রাষ্ট্র প্রতিষ্ঠা করেছিলেন, সেখানে প্রতিটি নাগরিকের জান, মাল ও সম্মানের নিরাপত্তা নিশ্চিত ছিল।

কুরআনুল কারিমে আল্লাহ তাআলা নির্দেশ দিয়েছেন: 'নিশ্চয়ই আল্লাহ ন্যায়পরায়ণতা, সদাচরণ এবং আত্মীয়-স্বজনকে দানের নির্দেশ দেন।' বৈষম্যহীন ও দুর্নীতিমুক্ত সমাজ গঠনে ইসলামী মূল্যবোধের অনুশীলন আজ অত্যন্ত জরুরি।`,
      category: 'ইসলাম ও জীবন',
      imageUrl: 'https://images.dailyamardesh.com/ad/amardesh-shadhinotar-kotha-bole.jpg',
      author: 'মাওলানা আব্দুল হক',
      publishedAt: '2026-10-07T05:15:00Z',
    },
  ],
  'bangladesh': [
    {
      id: 'bd-001',
      title: 'ভেঙে গেছে এশিয়ান হাইওয়ে সড়ক, সোনারগাঁওয়ে যান চলাচল ব্যাহত',
      excerpt: 'ভারী বর্ষণ ও সংস্কারের অভাবে এশিয়ান হাইওয়ের নারায়ণগঞ্জ অংশে বড় ধরনের গর্ত সৃষ্টি হয়েছে। এতে দূরপাল্লার যানবাহন চরম দুর্ভোগে পড়েছে।',
      content: `ভারী বর্ষণ ও দীর্ঘদিনের সংস্কারের অভাবে এশিয়ান হাইওয়ের নারায়ণগঞ্জ ও সোনারগাঁও অংশে সড়ক ভেঙে বিপজ্জনক পরিস্থিতির সৃষ্টি হয়েছে।

স্থানীয় বাসিন্দা ও চালকরা জানান, খানাখন্দের কারণে প্রায়ই দুর্ঘটনা ঘটছে। সড়ক ও জনপথ বিভাগ দ্রুত মেরামতের আশ্বাস দিলেও এখনও দৃশ্যমান কাজ শুরু হয়নি।`,
      category: 'সারা দেশ',
      imageUrl: 'https://images.dailyamardesh.com/original_images/sonargoan-fbe10b-256x144.webp',
      author: 'সোনারগাঁও (নারায়ণগঞ্জ) প্রতিনিধি',
      publishedAt: '2026-10-07T09:07:51Z',
    },
    {
      id: 'bd-002',
      title: 'খুলনা মহানগরীতে আইনশৃঙ্খলা রক্ষায় যৌথবাহিনীর কড়া নজরদারি',
      excerpt: 'অপরাধ দমন ও জননিরাপত্তা জোরদারে খুলনা মহানগর ও রূপসা অঞ্চলে যৌথবাহিনীর সমন্বিত অভিযান পরিচালিত হচ্ছে।',
      content: `অপরাধ দমন ও সাধারণ মানুষের নিরাপত্তা নিশ্চিত করতে খুলনা মহানগরীর গুরুত্বপূর্ণ পয়েন্টগুলোতে চেকপোস্ট বসিয়ে তল্লাশি চালাচ্ছে যৌথবাহিনী।

পুলিশ ও সেনাসদস্যদের সমন্বিত টহল নগরবাসীর মধ্যে স্বস্তি ফিরিয়ে এনেছে বলে জানিয়েছেন স্থানীয় ব্যবসায়ীরা।`,
      category: 'সারা দেশ',
      imageUrl: 'https://images.dailyamardesh.com/original_images/kulna-e5ea49-256x144.webp',
      author: 'খুলনা ব্যুরো',
      publishedAt: '2026-10-07T09:22:00Z',
    },
  ],
  'sports': [
    {
      id: 'spt-001',
      title: '‘এই সবুজ গালিচা ছেড়ে যেতে মন চাইছে না’ — বেনিনের বিপক্ষে বিদায়ী ম্যাচে মেসির আবেগঘন কথা',
      excerpt: 'আর্জেন্টিনার জার্সিতে স্মরণীয় ম্যাচ শেষে মনুমেন্তাল স্টেডিয়ামে উপস্থিত সমর্থকদের ভালোবাসা ও কৃতজ্ঞতা জানিয়েছেন বিশ্বজয়ী ফুটবল তারকা লিওনেল মেসি।',
      content: `আর্জেন্টিনার জার্সিতে স্মরণীয় ম্যাচ শেষে মনুমেন্তাল স্টেডিয়ামে দাঁড়িয়ে দুই দশকের আন্তর্জাতিক ক্যারিয়ারের সমাপ্তি টানার অনুভূতি প্রকাশ করেন লিওনেল মেসি।

তিনি বলেন, 'এই সবুজ গালিচা এবং দেশের সমর্থকদের ভালোবাসা ছেড়ে যাওয়া অত্যন্ত কষ্টের। তবে প্রতিটি মুহূর্ত আমি আজীবন হৃদয়ে ধারণ করব।'`,
      category: 'খেলা',
      imageUrl: 'https://images.dailyamardesh.com/original_images/vbcjsb1s_lionel-messi-speech-afp_625x300_07_October_26-792a22-720x405.webp',
      author: 'স্পোর্টস ডেস্ক',
      publishedAt: '2026-10-07T09:16:38Z',
    },
  ],
  'business': [
    {
      id: 'biz-001',
      title: 'আইএমএফের সঙ্গে ঋণচুক্তির শর্ত পুনর্মূল্যায়ন: ব্যাংকিং খাতে কঠোর নজরদারি',
      excerpt: 'অর্থনৈতিক স্থিতিশীলতা রক্ষায় অভ্যন্তরীণ রাজস্ব বৃদ্ধি এবং খেলাপি ঋণ আদায়ে কার্যকর ব্যবস্থা গ্রহণের তাগিদ দিয়েছে বাংলাদেশ ব্যাংক।',
      content: `দেশের ব্যাংকিং খাতে সুশাসন প্রতিষ্ঠা এবং খেলাপি ঋণ দ্রুত কমাতে বাণিজ্যিক ব্যাংকগুলোকে কঠোর নির্দেশনা দিয়েছে কেন্দ্রীয় ব্যাংক।

একই সঙ্গে আইএমএফ ও বিশ্বব্যাংকের সঙ্গে অর্থনৈতিক সহায়তা কর্মসূচির শর্তাবলি পর্যালোচনা করে জনকল্যাণমুখী অর্থনৈতিক নীতিমালা অনুসরণের উদ্যোগ নেওয়া হচ্ছে।`,
      category: 'বাণিজ্য',
      imageUrl: 'https://images.dailyamardesh.com/original_images/bangladesh_bank_P9AlMoN.jpg',
      author: 'অর্থনৈতিক প্রতিবেদক',
      publishedAt: '2026-10-07T08:38:49Z',
    },
  ],
};

/**
 * Get all available articles combining live RSS feed and vertical fallbacks
 */
export function getArticlesByCategory(categoryName: string): Article[] {
  const live = getArticles();

  if (categoryName === 'all' || categoryName === 'সর্বশেষ') {
    return live.length > 0 ? live : Object.values(CATEGORY_ARTICLES).flat();
  }

  // Filter live articles matching the category
  const matchedLive = live.filter(
    (a) =>
      a.category.toLowerCase().includes(categoryName.toLowerCase()) ||
      categoryName.toLowerCase().includes(a.category.toLowerCase())
  );

  // Match category fallbacks
  let fallbackList: Article[] = [];
  for (const [key, list] of Object.entries(CATEGORY_ARTICLES)) {
    if (
      key.toLowerCase() === categoryName.toLowerCase() ||
      list.some((a) => a.category.toLowerCase().includes(categoryName.toLowerCase()))
    ) {
      fallbackList = list;
      break;
    }
  }

  // Combine and deduplicate by id
  const combined = [...matchedLive];
  for (const fallback of fallbackList) {
    if (!combined.some((c) => c.id === fallback.id)) {
      combined.push(fallback);
    }
  }

  return combined;
}
