import React from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Clock, Bookmark } from 'lucide-react';
import { Article } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { formatRelativeTime } from '../../utils/bengali';

interface SwipeCardProps {
  article: Article;
  index: number;
  total: number;
  onSwipeRight: (article: Article) => void;
  onSwipeLeft: () => void;
  isActive: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  article,
  index,
  total,
  onSwipeRight,
  onSwipeLeft,
  isActive,
}) => {
  const { isDarkMode, bookmarks, addBookmark, removeBookmark } = useAppStore();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const isBookmarked = bookmarks.includes(article.id);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 100;

    if (info.offset.x > threshold) {
      // Swipe right → open article
      onSwipeRight(article);
    } else if (info.offset.x < -threshold) {
      // Swipe left → next card
      onSwipeLeft();
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBookmarked) {
      removeBookmark(article.id);
    } else {
      addBookmark(article.id);
    }
  };

  if (!isActive) {
    return null;
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className={`relative h-full rounded-2xl overflow-hidden shadow-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Image */}
        <div className="relative h-2/5">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

          {/* Breaking Badge */}
          {article.isBreaking && (
            <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              ব্রেকিং
            </span>
          )}

          {/* Bookmark */}
          <button
            onClick={handleBookmark}
            className={`absolute top-4 right-4 p-2 rounded-full ${
              isBookmarked ? 'bg-green-600 text-white' : 'bg-black/50 text-white'
            }`}
            aria-label="সেভ করুন"
          >
            <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>

          {/* Progress Indicator */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="text-white text-xs font-medium bg-black/40 px-2 py-1 rounded">
              {index + 1} / {total}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded ${isDarkMode ? 'bg-green-700 text-white' : 'bg-green-600 text-white'}`}>
              {article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 h-3/5 flex flex-col">
          <h2 className={`text-xl font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {article.title}
          </h2>
          <p className={`mt-3 text-sm leading-relaxed flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {article.excerpt}
          </p>

          {/* Footer */}
          <div className={`flex items-center justify-between mt-4 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <Clock size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatRelativeTime(article.publishedAt)}
              </span>
            </div>
            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {article.author}
            </span>
          </div>

          {/* Swipe Hints */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1 text-xs text-red-500">
              <span>←</span>
              <span>পরবর্তী</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <span>পড়ুন</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
