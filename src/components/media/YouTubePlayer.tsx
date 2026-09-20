import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';

interface YouTubePlayerProps {
  videoId: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
  className?: string;
  onReady?: () => void;
  onStateChange?: (state: 'playing' | 'paused' | 'ended' | 'buffering') => void;
  onError?: (error: string) => void;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  autoplay = false,
  muted = true,
  controls = false,
  loop = true,
  className = '',
  onReady,
  onStateChange,
  onError,
}) => {
  const { isDarkMode } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Build YouTube embed URL
  const buildEmbedUrl = () => {
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      mute: muted ? '1' : '0',
      controls: controls ? '1' : '0',
      loop: loop ? '1' : '0',
      playlist: videoId, // Required for loop to work
      rel: '0', // Don't show related videos
      modestbranding: '1', // Minimal YouTube branding
      playsinline: '1', // Play inline on iOS
    });

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  // Handle iframe load
  const handleLoad = () => {
    setIsLoading(false);
    onReady?.();
  };

  // Handle iframe error
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.('Failed to load video');
  };

  // Reset state when videoId changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [videoId]);

  // Error state
  if (hasError) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            ভিডিও লোড করতে সমস্যা হয়েছে
          </p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Video ID: {videoId}
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-3"></div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            ভিডিও লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // Render iframe
  return (
    <div className={`relative w-full h-full ${className}`}>
      <iframe
        ref={iframeRef}
        src={buildEmbedUrl()}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video player"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};
