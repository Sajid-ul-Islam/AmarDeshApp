/**
 * Theme Provider Context
 * 
 * Provides theme tokens to all components via React Context
 * Automatically switches between light and dark mode based on system preference
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { getThemeTokens, ThemeTokens, ThemeMode, brand, social } from './tokens';
import { useAppStore } from '../store/useAppStore';
import { resolveFontFamily, type FontPreference } from '../services/fontService';

// ============================================================================
// CONTEXT TYPE
// ============================================================================

interface ThemeContextType {
  mode: ThemeMode;
  tokens: ThemeTokens;
  brand: typeof brand;
  social: typeof social;
  isDark: boolean;
  /**
   * Active typography profile (site default / Noto Serif Bengali / device).
   */
  fontPreference: FontPreference;
  /**
   * Resolved family names for the active profile.
   *
   * `undefined` means "use the platform default", so callers can spread these
   * straight into a style: `fontFamily: headingFont`.
   */
  headingFont: string | undefined;
  bodyFont: string | undefined;
  latinFont: string | undefined;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface ThemeProviderProps {
  children: React.ReactNode;
  forcedMode?: ThemeMode; // Optional: force a specific theme
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  forcedMode 
}) => {
  const systemColorScheme = useColorScheme();
  const themePreference = useAppStore((state) => state.themePreference);
  const fontPreference = useAppStore((state) => state.fontPreference);

  // Determine theme mode: explicit prop > user preference > system setting
  const mode: ThemeMode =
    forcedMode ||
    (themePreference === 'dark'
      ? 'dark'
      : themePreference === 'sepia'
        ? 'sepia'
        : themePreference === 'light'
          ? 'light'
          : systemColorScheme === 'dark'
            ? 'dark'
            : 'light');
  
  // Get tokens for current mode
  const tokens = useMemo(() => getThemeTokens(mode), [mode]);

  // Resolve the active typography profile.
  const headingFont = resolveFontFamily(fontPreference, 'heading');
  const bodyFont = resolveFontFamily(fontPreference, 'body');
  const latinFont = resolveFontFamily(fontPreference, 'latin');

  // Context value
  const contextValue = useMemo(() => ({
    mode,
    tokens,
    brand,
    social,
    isDark: mode === 'dark',
    fontPreference,
    headingFont,
    bodyFont,
    latinFont,
  }), [mode, tokens, fontPreference, headingFont, bodyFont, latinFont]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to access theme context
 * Throws error if used outside ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

/**
 * Hook to access theme tokens directly
 */
export const useThemeTokens = (): ThemeTokens => {
  const { tokens } = useTheme();
  return tokens;
};

/**
 * Hook to check if dark mode is active
 */
export const useIsDarkMode = (): boolean => {
  const { isDark } = useTheme();
  return isDark;
};

/**
 * Hook to access brand colors
 */
export const useBrandColors = () => {
  const { brand } = useTheme();
  return brand;
};

/**
 * Hook to access social media colors
 */
export const useSocialColors = () => {
  const { social } = useTheme();
  return social;
};

/** Resolved font families for the active typography profile. */
export const useFontFamily = (): {
  fontPreference: FontPreference;
  headingFont: string | undefined;
  bodyFont: string | undefined;
  latinFont: string | undefined;
} => {
  const { fontPreference, headingFont, bodyFont, latinFont } = useTheme();
  return { fontPreference, headingFont, bodyFont, latinFont };
};

export default ThemeProvider;
