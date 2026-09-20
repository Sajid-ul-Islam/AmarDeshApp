import React from 'react';
import { Bookmark } from 'lucide-react';
import { articles } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { NewsCard } from '../components/common/NewsCard';
import { Article } from '../types';

interface BookmarkPageProps {
  onArticleClick: (article: Article) => void;
}

export const BookmarkPage: React.FC<BookmarkPageProps> = ({ onArticleClick }) => {
  const { isDarkMode, bookmarks } = useAppStore();

  const bookmarkedArticles = articles.filter((a) => bookmarks.includes(a.id));

  return (
    <div className="px-4 py-4">
      <h1 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        সেভ করা সংবাদ
      </h1>

      {bookmarkedArticles.length === 0 ? (
        <div className="text-center py-16">
          <Bookmark size={48} className={`mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            কোনো সংবাদ সেভ করা হয়নি
          </p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            সংবাদের পাশে বুকমার্ক আইকনে ট্যাপ করুন
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {bookmarkedArticles.map((article) => (
            <NewsCard key={article.id} article={article} variant="horizontal" onClick={onArticleClick} />
          ))}
        </div>
      )}
    </div>
  );
};
