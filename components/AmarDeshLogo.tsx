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
const BANNER_LOGO = require('../assets/amardesh_logo_banner.jpg');
const ICON_LOGO = require('../assets/icon.png');

// Aspect ratios of original asset files
const PNG_ASPECT_RATIO = 867 / 213; // ~4.07
const BANNER_ASPECT_RATIO = 1196 / 372; // ~3.21
const ICON_ASPECT_RATIO = 1; // 1:1 square emblem

export interface AmarDeshLogoProps {
  /** Desired height of the logo (default: 32) */
  height?: number;
  /** Explicit width. If omitted, calculated from natural aspect ratio */
  width?: number;
  /**
   * Logo variant:
   * - 'png': Transparent background official Bengali calligraphy logo
   * - 'banner': Official full masthead banner with motto
   * - 'icon' | 'compact': Official square icon emblem (assets/icon.png) for tight headers
   */
  variant?: 'png' | 'banner' | 'compact' | 'icon';
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

  const isIcon = variant === 'icon' || variant === 'compact';
  const source = variant === 'banner' ? BANNER_LOGO : isIcon ? ICON_LOGO : PNG_LOGO;
  const ratio = variant === 'banner' ? BANNER_ASPECT_RATIO : isIcon ? ICON_ASPECT_RATIO : PNG_ASPECT_RATIO;
  const computedWidth = width || Math.round(height * ratio);

  const content = (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.imageWrapper,
          isIcon && styles.squareIconFrame,
          // In dark mode, provide a subtle light backing for wide logo
          isDark && !isIcon && styles.darkBackdrop,
        ]}
      >
        <Image
          source={source}
          style={{
            width: computedWidth,
            height,
            borderRadius: 0,
          }}
          resizeMode="contain"
          accessibilityLabel="দৈনিক আমার দেশ লোগো"
        />
      </View>

      {showMotto && !isIcon && (
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareIconFrame: {
    borderRadius: 0,
  },
  darkBackdrop: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mottoText: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 3,
    letterSpacing: 0.3,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  },
});
