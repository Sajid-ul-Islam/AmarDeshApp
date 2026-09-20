export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  subCategory?: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
  isBreaking?: boolean;
  isVideo?: boolean;
  sourceUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface PrayerTime {
  name: string;
  time: string;
}

export interface Division {
  id: string;
  name: string;
  districts: string[];
}
