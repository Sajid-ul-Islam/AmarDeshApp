export interface LiveIndicatorItem {
  id: string;
  category: 'cricket' | 'stock' | 'currency' | 'gold';
  icon: string;
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

export const DEFAULT_RATES: LiveIndicatorItem[] = [
  {
    id: 'cricket-1',
    category: 'cricket',
    icon: 'baseball-outline',
    title: 'লাইভ ক্রিকেট',
    value: 'BAN ১৬৮/৪ (১৮.২) বনাম IND',
  },
  {
    id: 'stock-1',
    category: 'stock',
    icon: 'trending-up',
    title: 'DSEX ইনডেক্স',
    value: '৫,৫৮২.৪০',
    change: '+১২.৪ (০.২২%)',
    isPositive: true,
  },
  {
    id: 'currency-1',
    category: 'currency',
    icon: 'cash-outline',
    title: 'ডলার-টাকা রেট',
    value: '১২১.৫০ ৳',
    change: 'স্থিতিশীল',
    isPositive: true,
  },
  {
    id: 'gold-1',
    category: 'gold',
    icon: 'medal-outline',
    title: '২২ ক্যারেট স্বর্ণ',
    value: '১,১৫,৪০০ ৳ / ভরি',
  },
];
