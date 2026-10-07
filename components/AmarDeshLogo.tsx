import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { useThemeTokens, useIsDarkMode } from '../theme';

// Local asset files
const PNG_LOGO = require('../assets/amardesh_logo.png');
const BANNER_LOGO = require('../assets/amardesh_logo.jpg');

// Aspect ratios of original asset files
const PNG_ASPECT_RATIO = 867 / 213; // ~4.07
const BANNER_ASPECT_RATIO = 1196 / 372; // ~3.21

export interface AmarDeshLogoProps {
  /** Desired height of the logo (default: 32) */
  height?: number;
  /** Explicit width. If omitted, calculated from natural aspect ratio */
  width?: number;
  /**
   * Logo variant:
   * - 'png': Transparent background official Bengali calligraphy logo
   * - 'banner': Official full masthead banner with motto
   * - 'compact': Minimalist emblem suitable for tight reader top bars
   */
  variant?: 'png' | 'banner' | 'compact';
  /** Show the editorial motto tagline below the logo */
  showMotto?: boolean;
  /** English or Bengali motto text */
  language?: 'bn' | 'en';
  /** Optional container style */
  style?: StyleProp<ViewStyle>;
  /** Optional tap handler (e.g. go home) */
  onPress?: () => void;
}

export const AmarDeshLogo: React.FC<AmarDeshLogoProps> = ({
  height = 32,
  width,
  variant = 'png',
  showMotto = false,
  language = 'bn',
  style,
  onPress,
}) => {
  const tokens = useThemeTokens();
  const isDark = useIsDarkMode();

  const source = variant === 'banner' ? BANNER_LOGO : PNG_LOGO;
  const ratio = variant === 'banner' ? BANNER_ASPECT_RATIO : PNG_ASPECT_RATIO;
  const computedWidth = width || Math.round(height * ratio);

  const content = (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.imageWrapper,
          // In dark mode, provide a subtle light backing so the classic green & red logo shines with high contrast
          isDark && styles.darkBackdrop,
        ]}
      >
        <Image
          source={source}
          style={{
            width: computedWidth,
            height,
          }}
          resizeMode="contain"
          accessibilityLabel="দৈনিক আমার দেশ লোগো"
        />
      </View>

      {showMotto && (
        <Text
          style={[
            styles.mottoText,
            { color: tokens.text.secondary },
          ]}
        >
          {language === 'bn'
            ? 'স্বাধীনতার কথা বলে • সত্য ও সাহসের প্রতীক'
            : 'Speaks of Independence • Voice of Truth'}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="আমার দেশ হোম"
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  imageWrapper: {
    overflow: 'hidden',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkBackdrop: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mottoText: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 3,
    letterSpacing: 0.3,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  },
});
