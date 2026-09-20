import React from 'react';
import { Clock, Bookmark } from 'lucide-react';
import { Article } from '../../types';
import { formatRelativeTime } from '../../utils/bengali';
import { useAppStore } from '../../store/useAppStore';

interface NewsCardProps {
  article: Article;
  variant?: 'hero' | 'standard' | 'compact' | 'horizontal';
  onClick: (article: Article) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, variant = 'standard', onClick }) => {
  const { isDarkMode, bookmarks, addBookmark, removeBookmark } = useAppStore();
  const isBookmarked = bookmarks.includes(article.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBookmarked) {
      removeBookmark(article.id);
    } else {
      addBookmark(article.id);
    }
  };

  if (variant === 'hero') {
    return (
      <article
        onClick={() => onClick(article)}
        className={`relative cursor-pointer rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
      >
        <div className="relative">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-56 object-cover"
            loading="lazy"
          />
          {article.isBreaking && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              ব্রেকিং
            </span>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <span className="text-green-400 text-xs font-medium">{article.category}</span>
            <h2 className="text-white text-lg font-bold mt-1 leading-tight">
              {article.title}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Clock size={12} className="text-gray-300" />
              <span className="text-gray-300 text-xs">{formatRelativeTime(article.publishedAt)}</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article
        onClick={() => onClick(article)}
        className={`flex gap-3 cursor-pointer p-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors`}
      >
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <span className={`text-xs font-medium ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
            {article.category}
          </span>
          <h3 className={`text-sm font-semibold mt-0.5 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {article.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Clock size={10} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatRelativeTime(article.publishedAt)}
            </span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article
        onClick={() => onClick(article)}
        className={`flex items-center gap-3 py-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} cursor-pointer`}
      >
        <span className={`text-xs font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'} w-4`}>
          {article.id.slice(-1)}
        </span>
        <h4 className={`text-sm flex-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {article.title}
        </h4>
        <span className={`text-xs whitespace-nowrap ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {formatRelativeTime(article.publishedAt)}
        </span>
      </article>
    );
  }

  // Standard variant
  return (
    <article
      onClick={() => onClick(article)}
      className={`cursor-pointer rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="relative">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-40 object-cover"
          loading="lazy"
        />
        {article.isBreaking && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            ব্রেকিং
          </span>
        )}
        <button
          onClick={handleBookmark}
          className={`absolute top-2 right-2 p-1.5 rounded-full ${isBookmarked ? 'bg-green-600 text-white' : 'bg-black/50 text-white'}`}
          aria-label="সেভ করুন"
        >
          <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="p-3">
        <span className={`text-xs font-medium ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
          {article.category}
        </span>
        <h3 className={`text-sm font-bold mt-1 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {article.title}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <Clock size={12} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatRelativeTime(article.publishedAt)}
          </span>
        </div>
      </div>
    </article>
  );
};
