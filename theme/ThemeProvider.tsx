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

// ============================================================================
// CONTEXT TYPE
// ============================================================================

interface ThemeContextType {
  mode: ThemeMode;
  tokens: ThemeTokens;
  brand: typeof brand;
  social: typeof social;
  isDark: boolean;
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
  
  // Determine theme mode: explicit prop > user preference > system setting
  const mode: ThemeMode =
    forcedMode ||
    (themePreference === 'dark'
      ? 'dark'
      : themePreference === 'light'
        ? 'light'
        : systemColorScheme === 'dark'
          ? 'dark'
          : 'light');
  
  // Get tokens for current mode
  const tokens = useMemo(() => getThemeTokens(mode), [mode]);
  
  // Context value
  const contextValue = useMemo(() => ({
    mode,
    tokens,
    brand,
    social,
    isDark: mode === 'dark',
  }), [mode, tokens]);

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

export default ThemeProvider;
