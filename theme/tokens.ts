/**
 * Brand-Vibe Theme Token System
 * 
 * Semantic color tokens for the Daily Amar Desh app
 * Supports light mode (clean white) and deep dark mode (OLED-optimized)
 * 
 * Brand hue: 150° (green/teal spectrum)
 */

// ============================================================================
// BRAND COLORS
// ============================================================================

export const brand = {
  hue: 150,
  
  // OKLCH-inspired scale from lightest to darkest
  50: '#f0fdf4',   // Very light green tint
  100: '#dcfce7',  // Light green
  200: '#bbf7d0',  // Lighter green
  300: '#86efac',  // Soft green
  400: '#4ade80',  // Medium green
  500: '#22c55e',  // Base green
  600: '#006B3F',  // Brand primary (deep green)
  700: '#15803d',  // Darker green
  800: '#166534',  // Very dark green
  900: '#14532d',  // Darkest green
  950: '#052e16',  // Near-black green
};

// ============================================================================
// LIGHT MODE TOKENS
// ============================================================================

export const light = {
  // Surface colors (backgrounds)
  surface: {
    base: '#ffffff',        // Main background
    subtle: '#f9fafb',      // Subtle sections
    elevated: '#f3f4f6',    // Cards, elevated surfaces
    overlay: '#e5e7eb',     // Modals, overlays
  },
  
  // Text colors
  text: {
    primary: '#111827',     // Main text (near black)
    secondary: '#6b7280',   // Secondary text (gray)
    tertiary: '#9ca3af',    // Tertiary text (light gray)
    inverse: '#ffffff',     // Text on dark backgrounds
  },
  
  // Brand colors
  brand: {
    primary: '#006B3F',     // Brand primary
    onPrimary: '#ffffff',   // Text on brand primary
    surface: '#f0fdf4',     // Brand-tinted background
    accent: '#22c55e',      // Brand accent (lighter)
  },
  
  // Border colors
  border: {
    default: '#e5e7eb',     // Default borders
    subtle: '#f3f4f6',      // Subtle borders
    strong: '#d1d5db',      // Strong borders
  },
  
  // Status colors
  status: {
    success: '#22c55e',     // Success/breaking news
    error: '#dc2626',       // Error/destructive
    warning: '#f59e0b',     // Warning
    info: '#3b82f6',        // Informational
  },
  
  // Interactive states
  interactive: {
    active: '#006B3F',      // Active state
    inactive: '#6b7280',    // Inactive state
    hover: '#f3f4f6',       // Hover state
    pressed: '#e5e7eb',     // Pressed state
  },
};

// ============================================================================
// DARK MODE TOKENS (OLED-OPTIMIZED)
// ============================================================================

export const dark = {
  // Surface colors (backgrounds) - Deep blacks for OLED
  surface: {
    base: '#0a0a0a',        // Main background (near-black, NOT pure #000)
    subtle: '#18181b',      // Subtle sections (cards)
    elevated: '#27272a',    // Cards, elevated surfaces
    overlay: '#3f3f46',     // Modals, overlays
  },
  
  // Text colors - Off-whites for reduced eye strain
  text: {
    primary: '#fafafa',     // Main text (off-white)
    secondary: '#a1a1aa',   // Secondary text (gray)
    tertiary: '#71717a',    // Tertiary text (dark gray)
    inverse: '#0a0a0a',     // Text on light backgrounds
  },
  
  // Brand colors - Lighter, desaturated for dark backgrounds
  brand: {
    primary: '#4ade80',     // Brand primary (lighter green)
    onPrimary: '#0a0a0a',   // Text on brand primary
    surface: '#14532d',     // Brand-tinted background (dark green)
    accent: '#86efac',      // Brand accent (very light green)
  },
  
  // Border colors - Subtle dark borders
  border: {
    default: '#3f3f46',     // Default borders
    subtle: '#27272a',      // Subtle borders
    strong: '#52525b',      // Strong borders
  },
  
  // Status colors - Adjusted for dark backgrounds
  status: {
    success: '#4ade80',     // Success (lighter green)
    error: '#f87171',       // Error (lighter red)
    warning: '#fbbf24',     // Warning (lighter amber)
    info: '#60a5fa',        // Informational (lighter blue)
  },
  
  // Interactive states
  interactive: {
    active: '#4ade80',      // Active state (lighter green)
    inactive: '#71717a',    // Inactive state (dark gray)
    hover: '#27272a',       // Hover state (elevated surface)
    pressed: '#3f3f46',     // Pressed state (overlay)
  },
};

// ============================================================================
// SEMANTIC TOKENS
// ============================================================================

export type ThemeMode = 'light' | 'dark';

export interface ThemeTokens {
  surface: typeof light.surface;
  text: typeof light.text;
  brand: typeof light.brand;
  border: typeof light.border;
  status: typeof light.status;
  interactive: typeof light.interactive;
}

/**
 * Get theme tokens based on mode
 */
export const getThemeTokens = (mode: ThemeMode): ThemeTokens => {
  return mode === 'dark' ? dark : light;
};

/**
 * Social media brand colors (constant across themes)
 */
export const social = {
  whatsapp: '#25D366',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  telegram: '#0088cc',
  instagram: '#E4405F',
  youtube: '#FF0000',
};

/**
 * Export all tokens
 */
export const tokens = {
  brand,
  light,
  dark,
  social,
  getThemeTokens,
};

export default tokens;
