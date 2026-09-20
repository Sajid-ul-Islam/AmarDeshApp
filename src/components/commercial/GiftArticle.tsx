import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Article } from '../../types';
import { ShareSheet } from '../social/ShareSheet';

interface GiftArticleProps {
  article: Article;
}

export const GiftArticle: React.FC<GiftArticleProps> = ({ article }) => {
  const { isDarkMode, features } = useAppStore();
  const [showShareSheet, setShowShareSheet] = useState(false);

  const handleClick = () => {
    if (features.enableSocialSharing) {
      setShowShareSheet(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          isDarkMode
            ? 'bg-pink-900/30 text-pink-400 hover:bg-pink-900/50'
            : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
        }`}
      >
        <Gift size={16} />
        <span>শেয়ার করুন</span>
      </button>

      {features.enableSocialSharing && (
        <ShareSheet
          isOpen={showShareSheet}
          onClose={() => setShowShareSheet(false)}
          article={article}
        />
      )}
    </>
  );
};
