/**
 * Daily Amar Desh - Modern Editorial Theme Token System
 * 
 * Synchronized with Stitch MCP: Mobile News App (projects/14803972069666724044)
 * - Surface / Paper: #FBF9F5 (Warm crisp newsprint parchment)
 * - Ink Primary: #121212 (Deep printer's ink)
 * - Editorial Crimson: #BA131A (Breaking news, live indicator, active anchors)
 * - Heritage Green: #006B3F (National flag accent, verified badges, ePaper)
 * - Hairline Divider: #E5E0D8 (1px crisp structural borders)
 * - OLED Dark: #0A0A0A (Pure pitch dark mode, off-white reading text #F5F5F7)
 */

import { Platform } from 'react-native';

// ============================================================================
// BRAND PALETTES
// ============================================================================

export const brand = {
  hue: 150,
  
  // Editorial Crimson scale (Stitch Brand Red & Breaking News)
  crimson: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#ffdad6',
    300: '#ffcac5',
    400: '#f87171',
    500: '#ef4444',
    600: '#ba131a', // Stitch Editorial Crimson
    700: '#91000d', // Stitch Primary Deep Crimson
    800: '#680007',
    900: '#410002',
    950: '#2b0001',
  },

  // National Forest Green scale (Bangladesh Flag, ePaper, Verified)
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#006B3F', // Amar Desh Heritage Green
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },

  // Parchment & Slate Neutral Scale
  neutral: {
    surface: '#fbf9f5',       // Warm crisp parchment
    surfaceMuted: '#f3efea',  // Breakout panels
    surfaceContainer: '#efeeea',
    surfaceHigh: '#eae8e4',
    hairline: '#e5e0d8',      // 1px structural divider
    ink: '#121212',           // Primary typography
    inkMuted: '#595959',      // Metadata neutral
  },

  primary: '#ba131a',
  secondary: '#006B3F',
};

// ============================================================================
// LIGHT MODE TOKENS (WARM EDITORIAL PARCHMENT)
// ============================================================================

export const light = {
  surface: {
    base: '#fbf9f5',        // Warm newsprint parchment neutral
    subtle: '#f5f3ef',      // Secondary surface container low
    elevated: '#efeeea',    // Surface container / card background
    overlay: '#eae8e4',     // Modals, sheets, breakouts
  },
  
  text: {
    primary: '#121212',     // Deep printer's ink for high legibility
    secondary: '#595959',   // Balanced neutral grey for bylines & metadata
    tertiary: '#7a7875',    // Auxiliary labels and timestamps
    inverse: '#ffffff',     // Text on crimson/dark badges
  },
  
  brand: {
    primary: '#ba131a',     // Editorial Crimson
    secondary: '#91000d',   // Deep Crimson accent
    heritageGreen: '#006B3F', // Amar Desh National Green
    onPrimary: '#ffffff',   // Text on crimson
    surface: '#f5f3ef',     // Neutral warm surface
    crimsonSurface: '#fdf2f2', // Subdued crimson breakout
    accent: '#006B3F',      // National heritage green
  },
  
  border: {
    default: '#e5e0d8',     // 1px signature hairline rule
    subtle: '#efece6',      // Micro separators
    strong: '#121212',      // Focused high-contrast structural borders
  },
  
  status: {
    success: '#16a34a',     // Success / live indicator
    error: '#ba131a',       // Breaking news / critical
    warning: '#f59e0b',     // Warning
    info: '#2563eb',        // Informational
  },
  
  interactive: {
    active: '#ba131a',      // Active tab / chip
    inactive: '#595959',    // Inactive state
    hover: '#efeeea',       // Hover surface
    pressed: '#eae8e4',     // Pressed surface
  },
};

// ============================================================================
// DARK MODE TOKENS (OLED NIGHT EDITION)
// ============================================================================

export const dark = {
  surface: {
    base: '#0a0a0a',        // True deep OLED background (0% battery drain)
    subtle: '#121214',      // Subtle stream background
    elevated: '#141414',    // Tonal planar card container
    overlay: '#1c1c1e',     // Modals, overlays, elevated sheets
  },
  
  text: {
    primary: '#f5f5f7',     // Off-white crisp reading text
    secondary: '#a1a1a6',   // Secondary grey for bylines
    tertiary: '#71717a',    // Muted tertiary text
    inverse: '#0a0a0a',     // Inverted dark text
  },
  
  brand: {
    primary: '#ef4444',     // Vibrant accessible crimson for dark mode
    secondary: '#f87171',   // Subdued light red
    heritageGreen: '#4ade80', // Accessible vibrant green
    onPrimary: '#ffffff',   // Text on primary
    surface: '#1a1a1e',     // Dark neutral surface
    crimsonSurface: '#450a0a', // Dark red card background
    accent: '#10b981',      // Luminous emerald accent
  },
  
  border: {
    default: '#27272a',     // 1px dark hairline divider
    subtle: '#18181b',      // Micro dark separators
    strong: '#3f3f46',      // Focused borders
  },
  
  status: {
    success: '#4ade80',     // Luminous success green
    error: '#ef4444',       // High-contrast breaking red
    warning: '#fbbf24',     // Warning amber
    info: '#60a5fa',        // Info blue
  },
  
  interactive: {
    active: '#ef4444',      // Active pill
    inactive: '#71717a',    // Inactive text
    hover: '#1a1a1e',       // Hover surface
    pressed: '#27272a',     // Pressed surface
  },
};

// ============================================================================
// TYPOGRAPHY SYSTEM (NEWSREADER & INTER SCALES)
// ============================================================================

export const typography = {
  // Legacy numeric sizes for backward compatibility
  fontSizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 28,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Complete Stitch Modern Editorial scale
  scale: {
    headlineXl: {
      fontSize: 44,
      lineHeight: 52,
      letterSpacing: -0.88,
      fontWeight: '600' as const,
    },
    headlineXlMobile: {
      fontSize: 32,
      lineHeight: 38,
      letterSpacing: -0.48,
      fontWeight: '600' as const,
    },
    headlineLg: {
      fontSize: 32,
      lineHeight: 40,
      letterSpacing: -0.48,
      fontWeight: '500' as const,
    },
    headlineLgMobile: {
      fontSize: 26,
      lineHeight: 32,
      letterSpacing: -0.26,
      fontWeight: '500' as const,
    },
    headlineMd: {
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: -0.22,
      fontWeight: '500' as const,
    },
    headlineSm: {
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: 0,
      fontWeight: '600' as const,
    },
    bodyLg: {
      fontSize: 19,
      lineHeight: 30,
      letterSpacing: 0,
      fontWeight: '400' as const,
    },
    bodyMd: {
      fontSize: 15,
      lineHeight: 24,
      letterSpacing: 0,
      fontWeight: '400' as const,
    },
    bodySm: {
      fontSize: 13,
      lineHeight: 20,
      letterSpacing: 0,
      fontWeight: '400' as const,
    },
    labelMd: {
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.72,
      fontWeight: '600' as const,
    },
    labelSm: {
      fontSize: 11,
      lineHeight: 14,
      letterSpacing: 0.44,
      fontWeight: '500' as const,
    },
  },
  editorial: {
    serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    sans: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }),
  },
};

// ============================================================================
// SPACING & SHAPE TOKENS (ARCHITECTURAL FLATNESS)
// ============================================================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
};

/**
 * Modern Editorial shape language:
 * Enforces crisp architectural edges reflecting broadsheet print stocks
 */
export const radii = {
  none: 0,
  sharp: 0,
  sm: 2,
  md: 4,      // Controlled micro-radius for cards & inputs
  lg: 6,
  xl: 10,
  full: 9999, // For circular badges and pill switches only
};

export type ThemeMode = 'light' | 'dark';

export interface ThemeTokens {
  surface: typeof light.surface;
  text: typeof light.text;
  brand: typeof light.brand;
  border: typeof light.border;
  status: typeof light.status;
  interactive: typeof light.interactive;
}

export const getThemeTokens = (mode: ThemeMode): ThemeTokens => {
  return mode === 'dark' ? dark : light;
};

export const social = {
  whatsapp: '#25D366',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  telegram: '#0088cc',
  instagram: '#E4405F',
  youtube: '#FF0000',
};

export const tokens = {
  brand,
  light,
  dark,
  typography,
  spacing,
  radii,
  social,
  getThemeTokens,
};

export default tokens;
