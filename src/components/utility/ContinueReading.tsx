import React, { useEffect, useRef } from 'react';
import { BookOpen } from 'lucide-react';
import { useReadingStore } from '../../store/useReadingStore';
import { useAppStore } from '../../store/useAppStore';

interface ContinueReadingProps {
  articleId: string;
  onRestore: () => void;
}

export const ContinueReading: React.FC<ContinueReadingProps> = ({ articleId, onRestore }) => {
  const { isDarkMode } = useAppStore();
  const { getScrollPosition, saveScrollPosition } = useReadingStore();
  const savedPosition = getScrollPosition(articleId);
  const intervalRef = useRef<number | null>(null);

  // Auto-save scroll position every 2 seconds
  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      const position = window.scrollY;
      saveScrollPosition(articleId, position);
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [articleId, saveScrollPosition]);

  if (!savedPosition || savedPosition < 100) return null;

  return (
    <div
      className={`sticky top-14 z-30 mx-4 mt-2 p-3 rounded-lg flex items-center justify-between ${
        isDarkMode ? 'bg-blue-900/30 border border-blue-800' : 'bg-blue-50 border border-blue-200'
      }`}
    >
      <div className="flex items-center gap-2">
        <BookOpen size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
        <span className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
          পড়া চালিয়ে যান
        </span>
      </div>
      <button
        onClick={onRestore}
        className={`px-3 py-1 rounded text-xs font-medium ${
          isDarkMode ? 'bg-blue-800 text-blue-200 hover:bg-blue-700' : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
        }`}
      >
        ↑ যান
      </button>
    </div>
  );
};
