import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Article } from '../../types';
import { SwipeCard } from './SwipeCard';
import { useAppStore } from '../../store/useAppStore';

interface CardFeedProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
}

export const CardFeed: React.FC<CardFeedProps> = ({ articles, onArticleClick }) => {
  const { isDarkMode } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when articles change
  useEffect(() => {
    setCurrentIndex(0);
  }, [articles]);

  const handleSwipeRight = (article: Article) => {
    onArticleClick(article);
  };

  const handleSwipeLeft = () => {
    if (currentIndex < articles.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (currentIndex < articles.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, articles.length]);

  if (articles.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          কোনো সংবাদ নেই
        </p>
      </div>
    );
  }

  const currentArticle = articles[currentIndex];

  return (
    <div className="relative h-[calc(100vh-180px)] max-h-[600px] mx-4">
      <AnimatePresence mode="wait">
        <SwipeCard
          key={currentArticle.id}
          article={currentArticle}
          index={currentIndex}
          total={articles.length}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          isActive={true}
        />
      </AnimatePresence>

      {/* End State */}
      {currentIndex === articles.length - 1 && (
        <div className={`absolute bottom-4 left-0 right-0 text-center text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          শেষ সংবাদ — আর কোনো সংবাদ নেই
        </div>
      )}
    </div>
  );
};
