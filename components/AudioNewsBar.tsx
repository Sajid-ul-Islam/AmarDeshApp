import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
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
  const [isMinimized, setIsMinimized] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<'1.0x' | '1.25x' | '1.5x'>('1.0x');

  // Animated waveform bars
  const waveAnim1 = useRef(new Animated.Value(4)).current;
  const waveAnim2 = useRef(new Animated.Value(12)).current;
  const waveAnim3 = useRef(new Animated.Value(8)).current;
  const waveAnim4 = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    let animLoop: Animated.CompositeAnimation | null = null;
    if (isPlaying) {
      animLoop = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(waveAnim1, { toValue: 16, duration: 250, useNativeDriver: false }),
            Animated.timing(waveAnim1, { toValue: 4, duration: 250, useNativeDriver: false }),
          ]),
          Animated.sequence([
            Animated.timing(waveAnim2, { toValue: 6, duration: 200, useNativeDriver: false }),
            Animated.timing(waveAnim2, { toValue: 18, duration: 200, useNativeDriver: false }),
          ]),
          Animated.sequence([
            Animated.timing(waveAnim3, { toValue: 18, duration: 280, useNativeDriver: false }),
            Animated.timing(waveAnim3, { toValue: 6, duration: 280, useNativeDriver: false }),
          ]),
          Animated.sequence([
            Animated.timing(waveAnim4, { toValue: 5, duration: 220, useNativeDriver: false }),
            Animated.timing(waveAnim4, { toValue: 16, duration: 220, useNativeDriver: false }),
          ]),
        ])
      );
      animLoop.start();
    } else {
      waveAnim1.setValue(4);
      waveAnim2.setValue(6);
      waveAnim3.setValue(4);
      waveAnim4.setValue(6);
    }

    return () => animLoop?.stop();
  }, [isPlaying]);

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        position: 'absolute',
        bottom: 24,
        left: isMinimized ? undefined : 16,
        right: 16,
        backgroundColor: '#111827',
        borderRadius: tokens.radii.xl,
        paddingHorizontal: isMinimized ? 12 : 16,
        paddingVertical: isMinimized ? 8 : 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.18)',
        ...tokens.shadows.lg,
      },
      minimizedContainer: {
        borderRadius: tokens.radii.pill,
        gap: 8,
      },
      infoSection: {
        flex: 1,
        marginRight: 12,
      },
      badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 2,
      },
      waveformContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 2,
        height: 18,
      },
      waveformBar: {
        width: 3,
        backgroundColor: tokens.brand.accent,
        borderRadius: 2,
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
        gap: 8,
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
        width: 38,
        height: 38,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...tokens.shadows.sm,
      },
      iconBtn: {
        padding: 4,
      },
    })
  );

  const handleTogglePlay = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
    Haptics.selectionAsync();
    const nextSpeed =
      playbackSpeed === '1.0x' ? '1.25x' : playbackSpeed === '1.25x' ? '1.5x' : '1.0x';
    setPlaybackSpeed(nextSpeed);
  };

  const handleToggleMinimize = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsMinimized(!isMinimized);
  };

  const handleStopAndClose = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await stopSpeaking();
    setIsPlaying(false);
    onClose?.();
  };

  if (isMinimized) {
    return (
      <View style={[styles.container, styles.minimizedContainer]}>
        <View style={styles.waveformContainer}>
          <Animated.View style={[styles.waveformBar, { height: waveAnim1 }]} />
          <Animated.View style={[styles.waveformBar, { height: waveAnim2 }]} />
          <Animated.View style={[styles.waveformBar, { height: waveAnim3 }]} />
          <Animated.View style={[styles.waveformBar, { height: waveAnim4 }]} />
        </View>

        <TouchableOpacity style={styles.playBtn} onPress={handleTogglePlay}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={handleToggleMinimize}>
          <Ionicons name="expand-outline" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={handleStopAndClose}>
          <Ionicons name="close" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoSection}>
        <View style={styles.badgeRow}>
          {/* Animated Waveform */}
          <View style={styles.waveformContainer}>
            <Animated.View style={[styles.waveformBar, { height: waveAnim1 }]} />
            <Animated.View style={[styles.waveformBar, { height: waveAnim2 }]} />
            <Animated.View style={[styles.waveformBar, { height: waveAnim3 }]} />
            <Animated.View style={[styles.waveformBar, { height: waveAnim4 }]} />
          </View>
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

        <TouchableOpacity style={styles.iconBtn} onPress={handleToggleMinimize}>
          <Ionicons name="contract-outline" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleStopAndClose} style={styles.iconBtn}>
          <Ionicons name="close" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
