export interface VisualStoryItem {
  id: string;
  articleId?: string;
  category: string;
  title: string;
  takeaway: string;
  imageUrl: string;
  publishedAt: string;
}

export const DEFAULT_STORIES: VisualStoryItem[] = [
  {
    id: 's1',
    articleId: 'amd-001',
    category: 'ব্রেকিং',
    title: 'নতুন নীতিমালায় রপ্তানি বাজারে সুবাতাস',
    takeaway: 'বাংলাদেশের তৈরি পোশাক ও আইটি খাতের জন্য আন্তর্জাতিক বাজারে নতুন শুল্কমুক্ত সুবিধা উন্মুক্ত হচ্ছে।',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop',
    publishedAt: '১৫ মিনিট আগে',
  },
  {
    id: 's2',
    articleId: 'amd-002',
    category: 'জুলাই বিপ্লব',
    title: '২৪-এর ছাত্র-জনতার ঐতিহাসিক আত্মত্যাগ',
    takeaway: 'গণঅভ্যুত্থানের স্মৃতি ও বীর শহীদদের স্মরণে বিশেষ তথ্যচিত্র ও স্মৃতিফলক উন্মোচন কর্মসূচি শুরু।',
    imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&auto=format&fit=crop',
    publishedAt: '১ ঘণ্টা আগে',
  },
  {
    id: 's3',
    articleId: 'amd-003',
    category: 'অর্থনীতি',
    title: 'ব্যাংক খাতে স্থিতিশীলতা ফেরাতে বিশেষ কমিশন',
    takeaway: 'খেলাপি ঋণ আদায় ও মূলধন ঘাটতি নিরসনে কেন্দ্রীয় ব্যাংকের ৩ দফা জরুরি রূপরেখা ঘোষণা।',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop',
    publishedAt: '২ ঘণ্টা আগে',
  },
  {
    id: 's4',
    articleId: 'amd-004',
    category: 'প্রযুক্তি',
    title: 'কৃত্রিম বুদ্ধিমত্তা ও বাংলা ভাষার ডিজিটাল রূপান্তর',
    takeaway: 'স্থানীয় ডেটাসেট ও ন্যাচারাল ল্যাঙ্গুয়েজ প্রসেসিংয়ে যুগান্তকারী নতুন এলএলএম উদ্ভাবন।',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop',
    publishedAt: '৪ ঘণ্টা আগে',
  },
  {
    id: 's5',
    articleId: 'amd-005',
    category: 'খেলাধুলা',
    title: 'টাইগারদের রোমাঞ্চকর জয়',
    takeaway: 'শেষ ওভারে রুদ্ধশ্বাস লড়াইয়ে দারুণ বোলিং নৈপুণ্যে সিরিজ নিজেদের করে নিল বাংলাদেশ।',
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop',
    publishedAt: 'আজ সকাল',
  },
];
