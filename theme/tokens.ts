/**
 * Daily Amar Desh - Comprehensive Theme Token System
 * 
 * Semantic color tokens for the Daily Amar Desh app
 * Embodying "স্বাধীনতার কথা বলে" brand identity:
 * - Brand Crimson: #DC2626 (Breaking news, alerts, primary badge)
 * - Forest Green: #006B3F (National heritage, ePaper, verified icons)
 * - Editorial Ink: #0F172A (Headlines, typography, light surfaces)
 * - OLED Dark: #0A0A0A (Pure deep dark mode, off-white reading text)
 */

// ============================================================================
// BRAND PALETTES
// ============================================================================

export const brand = {
  hue: 150,
  
  // Crimson scale (Amar Desh Masthead & Breaking News)
  crimson: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626', // Base Crimson
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },

  // Forest Green scale (National Heritage, ePaper)
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#006B3F', // Brand Green
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },

  // Editorial Slate scale (Ink & Neutral Surfaces)
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  primary: '#006B3F',
  secondary: '#DC2626',
};

// ============================================================================
// LIGHT MODE TOKENS
// ============================================================================

export const light = {
  surface: {
    base: '#ffffff',        // Main paper background
    subtle: '#f8fafc',      // Subtle stream background
    elevated: '#f1f5f9',    // Cards, pills, elevated surfaces
    overlay: '#e2e8f0',     // Modals, overlays
  },
  
  text: {
    primary: '#0f172a',     // High-contrast editorial ink
    secondary: '#475569',   // Supporting summaries
    tertiary: '#94a3b8',    // Timestamps, captions
    inverse: '#ffffff',     // Text on dark badges
  },
  
  brand: {
    primary: '#006B3F',     // Forest Green
    secondary: '#dc2626',   // Crimson Red
    onPrimary: '#ffffff',   // Text on primary
    surface: '#f0fdf4',     // Brand-tinted green background
    crimsonSurface: '#fef2f2', // Brand-tinted red background
    accent: '#22c55e',      // Vivid green
  },
  
  border: {
    default: '#e2e8f0',     // Default card borders
    subtle: '#f1f5f9',      // Subtle separators
    strong: '#cbd5e1',      // Strong borders
  },
  
  status: {
    success: '#16a34a',     // Success / live indicator
    error: '#dc2626',       // Breaking news / critical
    warning: '#f59e0b',     // Warning
    info: '#2563eb',        // Informational
  },
  
  interactive: {
    active: '#006B3F',      // Active tab / chip
    inactive: '#64748b',    // Inactive state
    hover: '#f1f5f9',       // Hover state
    pressed: '#e2e8f0',     // Pressed state
  },
};

// ============================================================================
// DARK MODE TOKENS (OLED-OPTIMIZED)
// ============================================================================

export const dark = {
  surface: {
    base: '#0a0a0a',        // True deep OLED background
    subtle: '#121214',      // Subtle stream background
    elevated: '#1a1a1e',    // Elevated cards
    overlay: '#27272a',     // Modals, overlays
  },
  
  text: {
    primary: '#f8fafc',     // Off-white crisp reading text
    secondary: '#94a3b8',   // Secondary gray
    tertiary: '#64748b',    // Muted tertiary text
    inverse: '#0a0a0a',     // Inverted dark text
  },
  
  brand: {
    primary: '#4ade80',     // Lighter accessible green for dark mode
    secondary: '#f87171',   // Lighter accessible red for dark mode
    onPrimary: '#052e16',   // Text on green
    surface: '#14532d',     // Dark green card background
    crimsonSurface: '#450a0a', // Dark red card background
    accent: '#86efac',      // Luminous green accent
  },
  
  border: {
    default: '#27272a',     // Subtle dark border
    subtle: '#18181b',      // Micro separators
    strong: '#3f3f46',      // Focused borders
  },
  
  status: {
    success: '#4ade80',     // Luminous success green
    error: '#f87171',       // High-contrast breaking red
    warning: '#fbbf24',     // Warning amber
    info: '#60a5fa',        // Info blue
  },
  
  interactive: {
    active: '#4ade80',      // Active pill
    inactive: '#71717a',    // Inactive text
    hover: '#1a1a1e',       // Hover surface
    pressed: '#27272a',     // Pressed surface
  },
};

// ============================================================================
// TYPOGRAPHY & SPACING TOKENS
// ============================================================================

export const typography = {
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
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
};

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
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
