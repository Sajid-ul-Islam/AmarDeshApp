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
        borderRadius: tokens.radii.xl,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        ...tokens.shadows.lg,
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
        borderRadius: tokens.radii.pill,
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
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: tokens.radii.pill,
      },
      speedText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
      },
      playBtn: {
        width: 40,
        height: 40,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...tokens.shadows.sm,
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
