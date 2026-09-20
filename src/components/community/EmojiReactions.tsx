import React from 'react';
import { useReactionsStore, EmojiReaction } from '../../store/useReactionsStore';
import { useAppStore } from '../../store/useAppStore';

interface EmojiReactionsProps {
  articleId: string;
}

const EMOJIS: EmojiReaction[] = ['❤️', '😂', '😮', '😢', '😡'];

export const EmojiReactions: React.FC<EmojiReactionsProps> = ({ articleId }) => {
  const { isDarkMode } = useAppStore();
  const { reactions, userReactions, addReaction, removeReaction } = useReactionsStore();

  const articleReactions = reactions[articleId] || { '❤️': 0, '😂': 0, '😮': 0, '😢': 0, '😡': 0 };
  const userReaction = userReactions[articleId];

  const handleReaction = (emoji: EmojiReaction) => {
    if (userReaction === emoji) {
      removeReaction(articleId);
    } else {
      addReaction(articleId, emoji);
    }
  };

  return (
    <div className={`flex items-center gap-2 p-3 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      {EMOJIS.map((emoji) => {
        const count = articleReactions[emoji] || 0;
        const isSelected = userReaction === emoji;
        
        return (
          <button
            key={emoji}
            onClick={() => handleReaction(emoji)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all ${
              isSelected
                ? 'bg-green-100 dark:bg-green-900/30 ring-2 ring-green-500 scale-110'
                : isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-white hover:bg-gray-100 shadow-sm'
            }`}
            aria-label={`${emoji} ${count}`}
          >
            <span className="text-base">{emoji}</span>
            {count > 0 && (
              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
