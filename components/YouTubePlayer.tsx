import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Ionicons } from '@expo/vector-icons';

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

  // Auto-dismiss loading after 2.5s failsafe so loading overlay never permanently freezes over video
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timeout);
  }, [videoId]);

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

  const openInYouTube = () => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    Linking.openURL(url).catch(() => {});
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={32} color="#DC2626" />
        <Text style={styles.errorText}>ভিডিও প্লে করতে সমস্যা হচ্ছে</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setIsLoading(true);
            }}
          >
            <Ionicons name="refresh" size={14} color="#FFF" />
            <Text style={styles.btnText}>পুনরায় চেষ্টা করুন</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ytButton} onPress={openInYouTube}>
            <Ionicons name="logo-youtube" size={14} color="#FFF" />
            <Text style={styles.btnText}>ইউটিউবে দেখুন</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer} pointerEvents="none">
          <ActivityIndicator size="large" color="#006B3F" />
          <Text style={styles.loadingText}>ভিডিও লোড হচ্ছে...</Text>
        </View>
      )}
      <YoutubePlayer
        key={videoId}
        ref={playerRef}
        height={220}
        play={isPlaying}
        videoId={videoId}
        onChangeState={onStateChange}
        onReady={onReadyHandler}
        onError={onErrorHandler}
        initialPlayerParams={{
          preventFullScreen: false,
          cc_lang_pref: 'bn',
          showClosedCaptions: false,
        }}
        webViewStyle={{ opacity: 0.99 }}
        webViewProps={{
          allowsFullscreenVideo: true,
          allowsInlineMediaPlayback: true,
          mediaPlaybackRequiresUserAction: false,
          originWhitelist: ['*'],
          domStorageEnabled: true,
          javaScriptEnabled: true,
          androidHardwareAccelerationDisabled: false,
        }}
      />
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.openDirectBtn}
          onPress={openInYouTube}
          activeOpacity={0.7}
        >
          <Ionicons name="logo-youtube" size={14} color="#DC2626" />
          <Text style={styles.openDirectText}>ইউটিউব অ্যাপে দেখুন ↗</Text>
        </TouchableOpacity>
      </View>
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
    bottom: 28,
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
  bottomBar: {
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  openDirectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  openDirectText: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '600',
  },
  errorContainer: {
    width: '100%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
  },
  errorText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
  errorSubtext: {
    color: '#999',
    fontSize: 11,
    marginTop: 4,
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006B3F',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    gap: 6,
  },
  ytButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    gap: 6,
  },
  btnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
