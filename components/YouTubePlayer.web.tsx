import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';

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
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006B3F" />
          <Text style={styles.loadingText}>ভিডিও লোড হচ্ছে...</Text>
        </View>
      )}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=${play ? 1 : 0}&enablejsapi=1`}
        style={{
          width: '100%',
          height: 220,
          border: 'none',
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => {
          setIsLoading(false);
          onReady?.();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
    position: 'relative',
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
});
