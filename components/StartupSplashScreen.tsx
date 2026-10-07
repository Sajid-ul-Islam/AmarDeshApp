import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Text,
  Platform,
  Dimensions,
} from 'react-native';
import { AmarDeshLogo } from './AmarDeshLogo';

interface StartupSplashScreenProps {
  onFinish?: () => void;
  /** Duration in milliseconds before fading out (default: 1600ms) */
  displayDuration?: number;
}

const { width } = Dimensions.get('window');

export const StartupSplashScreen: React.FC<StartupSplashScreenProps> = ({
  onFinish,
  displayDuration = 1600,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const mottoAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Entrance animation: Fade in logo and smoothly scale up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2. Motto fade in
      Animated.timing(mottoAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();

      // 3. Exit animation after displayDuration
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }).start(() => {
          onFinish?.();
        });
      }, displayDuration);

      return () => clearTimeout(timer);
    });
  }, [fadeAnim, scaleAnim, mottoAnim, displayDuration, onFinish]);

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={styles.centerBox}>
        {/* Animated Brand Masthead Logo */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
          <AmarDeshLogo height={48} variant="png" />
        </Animated.View>

        {/* Editorial Motto */}
        <Animated.View style={[styles.mottoWrapper, { opacity: mottoAnim }]}>
          <Text style={styles.mottoText}>
            স্বাধীনতার কথা বলে • সত্য ও সাহসের প্রতীক
          </Text>
          <View style={styles.separatorBar} />
          <Text style={styles.subTagline}>
            ডিজিটাল ও লাইভ সংস্করণ • দৈনিক আমার দেশ
          </Text>
        </Animated.View>
      </View>

      {/* Footer Branding */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          সম্পাদক ও প্রকাশক: মাহমুদুর রহমান
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FFFFFF',
    zIndex: 99999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    maxWidth: width * 0.88,
  },
  mottoWrapper: {
    alignItems: 'center',
    marginTop: 18,
  },
  mottoText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#006B3F', // Amar Desh Green
    textAlign: 'center',
    letterSpacing: 0.3,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  },
  separatorBar: {
    width: 32,
    height: 2,
    backgroundColor: '#DC2626', // Crimson Red
    marginVertical: 10,
    borderRadius: 1,
  },
  subTagline: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  footer: {
    position: 'absolute',
    bottom: 36,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  },
});
