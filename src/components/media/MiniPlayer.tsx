import React from 'react';
import { Play, Pause, X } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useAppStore } from '../../store/useAppStore';

interface MiniPlayerProps {
  onExpand: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ onExpand }) => {
  const { isDarkMode } = useAppStore();
  const { currentArticle, isPlaying, isPaused, progress, pause, resume, stop } = usePlayerStore();

  if (!currentArticle || !isPlaying) return null;

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    stop();
  };

  return (
    <div
      className={`fixed bottom-16 left-0 right-0 z-40 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-t shadow-lg cursor-pointer`}
      onClick={onExpand}
    >
      {/* Progress Bar */}
      <div className="h-1 bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full bg-green-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-3 px-4 py-3">
        {/* Article Info */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {currentArticle.title}
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {isPaused ? 'বিরতি' : 'চলছে...'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPause}
            className={`p-2 rounded-full ${
              isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'
            } text-white transition-colors`}
            aria-label={isPaused ? 'চালু করুন' : 'বিরতি'}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            onClick={handleClose}
            className={`p-2 rounded-full ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            } transition-colors`}
            aria-label="বন্ধ করুন"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
