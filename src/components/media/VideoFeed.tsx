import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { YouTubePlayer } from './YouTubePlayer';

// Sample video data (would come from API in production)
const sampleVideos = [
  {
    id: 'v1',
    title: 'সংবাদ সংক্ষিপ্ত',
    category: 'জাতীয়',
    youtubeId: 'etpwzbCBunc',
    author: 'আমার দেশ ভিডিও',
  },
  {
    id: 'v2',
    title: 'বিশেষ প্রতিবেদন',
    category: 'ফিচার',
    youtubeId: 'dQw4w9WgXcQ',
    author: 'আমার দেশ ভিডিও',
  },
  {
    id: 'v3',
    title: 'স্পোর্টস আপডেট',
    category: 'খেলা',
    youtubeId: 'etpwzbCBunc',
    author: 'আমার দেশ ভিডিও',
  },
];

interface VideoCardProps {
  video: typeof sampleVideos[0];
  isActive: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isActive }) => {
  const { isDarkMode } = useAppStore();
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {/* YouTube Player */}
      {isActive && (
        <YouTubePlayer
          videoId={video.youtubeId}
          autoplay={true}
          muted={isMuted}
          controls={false}
          loop={true}
          className="absolute inset-0"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

      {/* Top Info */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">
          {video.category}
        </span>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <h3 className="text-white text-lg font-bold mb-1">{video.title}</h3>
        <p className="text-white/70 text-xs">{video.author}</p>
      </div>

      {/* Mute Toggle */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white"
        aria-label={isMuted ? 'শব্দ চালু' : 'শব্দ বন্ধ'}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  );
};

interface VideoFeedProps {
  onBack: () => void;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({ onBack }) => {
  const { isDarkMode } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (currentIndex < sampleVideos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      onBack();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') handleNext();
      if (e.key === 'ArrowUp') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <div className={`h-screen ${isDarkMode ? 'bg-black' : 'bg-gray-900'} relative`}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-black/30 text-white"
          aria-label="ফিরে যান"
        >
          ←
        </button>
        <h1 className="text-white font-bold">ভিডিও</h1>
        <span className="text-white/70 text-xs">
          {currentIndex + 1}/{sampleVideos.length}
        </span>
      </div>

      {/* Video Container */}
      <div ref={containerRef} className="h-full w-full relative">
        <VideoCard video={sampleVideos[currentIndex]} isActive={true} />
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
          aria-label="আগের ভিডিও"
        >
          <ChevronUp size={20} />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex >= sampleVideos.length - 1}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30"
          aria-label="পরের ভিডিও"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Swipe Hint */}
      <div className="absolute bottom-20 left-0 right-0 text-center z-20">
        <p className="text-white/50 text-xs">
          ↑↓ সোয়াইপ করুন বা তীরচিহ্ন ব্যবহার করুন
        </p>
      </div>
    </div>
  );
};
