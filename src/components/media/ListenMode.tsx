import React, { useEffect } from 'react';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, X } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useAppStore } from '../../store/useAppStore';
import { formatTime, initializeTTS } from '../../services/ttsService';

interface ListenModeProps {
  onClose: () => void;
}

export const ListenMode: React.FC<ListenModeProps> = ({ onClose }) => {
  const { isDarkMode } = useAppStore();
  const {
    currentArticle,
    isPlaying,
    isPaused,
    playbackRate,
    progress,
    queue,
    queueIndex,
    pause,
    resume,
    stop,
    setRate,
    playNext,
    playPrevious,
  } = usePlayerStore();

  useEffect(() => {
    // Initialize TTS voices
    initializeTTS();
  }, []);

  if (!currentArticle) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>কোনো সংবাদ নির্বাচন করুন</p>
      </div>
    );
  }

  const handlePlayPause = () => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  const handleClose = () => {
    stop();
    onClose();
  };

  const rates = [0.5, 1.0, 1.5, 2.0];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 flex items-center justify-between px-4 py-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          aria-label="ফিরে যান"
        >
          <ArrowLeft size={20} className={isDarkMode ? 'text-white' : 'text-gray-800'} />
        </button>
        <h1 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>শুনুন</h1>
        <button
          onClick={handleClose}
          className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
          aria-label="বন্ধ করুন"
        >
          <X size={20} />
        </button>
      </div>

      {/* Article Info */}
      <div className="px-6 py-8">
        <div className={`mb-2 text-xs font-medium ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
          {currentArticle.category}
        </div>
        <h2 className={`text-2xl font-bold leading-tight mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {currentArticle.title}
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {currentArticle.author}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div
            className="h-full bg-green-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {formatTime((progress / 100) * 180)}
          </span>
          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            ৩:০০
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8 mb-8">
        <button
          onClick={playPrevious}
          disabled={queueIndex <= 0}
          className={`p-3 rounded-full ${
            isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
          } disabled:opacity-30 transition-colors`}
          aria-label="আগের সংবাদ"
        >
          <SkipBack size={24} />
        </button>
        <button
          onClick={handlePlayPause}
          className="p-6 rounded-full bg-green-600 hover:bg-green-700 text-white transition-colors"
          aria-label={isPaused ? 'চালু করুন' : 'বিরতি'}
        >
          {isPaused ? <Play size={32} /> : <Pause size={32} />}
        </button>
        <button
          onClick={playNext}
          disabled={queueIndex >= queue.length - 1}
          className={`p-3 rounded-full ${
            isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
          } disabled:opacity-30 transition-colors`}
          aria-label="পরের সংবাদ"
        >
          <SkipForward size={24} />
        </button>
      </div>

      {/* Speed Control */}
      <div className="px-6 mb-8">
        <p className={`text-xs font-medium mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          গতি
        </p>
        <div className="flex gap-2">
          {rates.map((rate) => (
            <button
              key={rate}
              onClick={() => setRate(rate)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                playbackRate === rate
                  ? 'bg-green-600 text-white'
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Queue Info */}
      {queue.length > 0 && (
        <div className={`px-6 py-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            কিউ: {queueIndex + 1} / {queue.length}
          </p>
        </div>
      )}
    </div>
  );
};
