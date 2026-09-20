import React, { useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

interface YouTubePlayerProps {
  videoId: string;
  play?: boolean;
  onReady?: () => void;
  onChangeState?: (state: string) => void;
  onError?: (error: string) => void;
}

export const YouTubePlayerComponent: React.FC<YouTubePlayerProps> = ({
  videoId,
  play = false,
  onReady,
  onChangeState,
  onError,
}) => {
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(play);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onStateChange = (state: string) => {
    setIsLoading(false);
    
    if (state === 'playing') {
      setIsPlaying(true);
    } else if (state === 'paused' || state === 'ended') {
      setIsPlaying(false);
    }
    
    onChangeState?.(state);
  };

  const onReadyHandler = () => {
    setIsLoading(false);
    onReady?.();
  };

  const onErrorHandler = (errorMessage: string) => {
    setIsLoading(false);
    setError(errorMessage);
    onError?.(errorMessage);
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>ভিডিও লোড করতে সমস্যা হয়েছে</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006B3F" />
          <Text style={styles.loadingText}>ভিডিও লোড হচ্ছে...</Text>
        </View>
      )}
      <YoutubePlayer
        ref={playerRef}
        height={220}
        play={isPlaying}
        videoId={videoId}
        onChangeState={onStateChange}
        onReady={onReadyHandler}
        onError={onErrorHandler}
        webViewProps={{
          allowsFullscreenVideo: true,
          allowsInlineMediaPlayback: true,
          mediaPlaybackRequiresUserAction: false,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#000',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 1,
  },
  loadingText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 14,
  },
  errorContainer: {
    width: '100%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorSubtext: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
});
