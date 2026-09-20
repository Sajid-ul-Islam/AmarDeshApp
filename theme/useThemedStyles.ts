/**
 * Theme-aware StyleSheet helper
 * 
 * Creates stylesheets that can access theme tokens
 * Solves the problem of StyleSheet.create() being static
 */

import { StyleSheet } from 'react-native';
import { useTheme } from './ThemeProvider';
import { ThemeTokens } from './tokens';

/**
 * Create a themed stylesheet
 * 
 * @example
 * const styles = useThemedStyles((tokens) => StyleSheet.create({
 *   container: {
 *     backgroundColor: tokens.surface.base,
 *     color: tokens.text.primary,
 *   },
 * }));
 */
export const useThemedStyles = <T extends ReturnType<typeof StyleSheet.create>>(
  stylesCreator: (tokens: ThemeTokens) => T
): T => {
  const { tokens } = useTheme();
  return stylesCreator(tokens);
};

/**
 * Get a single themed style value
 * 
 * @example
 * const backgroundColor = useThemedValue((tokens) => tokens.surface.base);
 */
export const useThemedValue = <T>(
  valueCreator: (tokens: ThemeTokens) => T
): T => {
  const { tokens } = useTheme();
  return valueCreator(tokens);
};

/**
 * Create static styles that don't need theme access
 * (for colors that don't change between themes)
 */
export const createStaticStyles = StyleSheet.create;

export default {
  useThemedStyles,
  useThemedValue,
  createStaticStyles,
};
