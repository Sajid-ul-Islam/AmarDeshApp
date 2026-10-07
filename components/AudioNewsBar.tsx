import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../theme';
import { speak, stopSpeaking } from '../services/ttsService';

interface AudioNewsBarProps {
  title: string;
  textToSpeak: string;
  onClose?: () => void;
}

export const AudioNewsBar: React.FC<AudioNewsBarProps> = ({
  title,
  textToSpeak,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<'1.0x' | '1.25x' | '1.5x'>('1.0x');

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        position: 'absolute',
        bottom: 24,
        left: 16,
        right: 16,
        backgroundColor: '#111827',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
      },
      infoSection: {
        flex: 1,
        marginRight: 12,
      },
      badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 2,
      },
      soundDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: tokens.brand.accent,
      },
      badgeText: {
        color: tokens.brand.accent,
        fontSize: 11,
        fontWeight: 'bold',
      },
      titleText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
      },
      controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      },
      speedBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
      },
      speedText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
      },
      playBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: tokens.brand.primary,
        justifyContent: 'center',
        alignItems: 'center',
      },
    })
  );

  const handleTogglePlay = async () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const rateNum = playbackSpeed === '1.0x' ? 1.0 : playbackSpeed === '1.25x' ? 1.25 : 1.5;
      speak(textToSpeak, { rate: rateNum });
    }
  };

  const handleCycleSpeed = () => {
    const nextSpeed =
      playbackSpeed === '1.0x' ? '1.25x' : playbackSpeed === '1.25x' ? '1.5x' : '1.0x';
    setPlaybackSpeed(nextSpeed);
  };

  const handleStopAndClose = async () => {
    await stopSpeaking();
    setIsPlaying(false);
    onClose?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoSection}>
        <View style={styles.badgeRow}>
          <View style={styles.soundDot} />
          <Text style={styles.badgeText}>সংবাদ পাঠ (অডিও)</Text>
        </View>
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.speedBtn} onPress={handleCycleSpeed}>
          <Text style={styles.speedText}>{playbackSpeed}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.playBtn} onPress={handleTogglePlay}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleStopAndClose} style={{ padding: 4 }}>
          <Ionicons name="close" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
