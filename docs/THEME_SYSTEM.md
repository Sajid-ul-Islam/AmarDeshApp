# Brand-Vibe Theme System Documentation

## Overview

The Daily Amar Desh app now uses a comprehensive semantic token-based theme system that supports:
- ✅ Clean white light mode
- ✅ Deep black OLED-optimized dark mode
- ✅ Brand identity with green/teal hue (150°)
- ✅ Semantic color tokens for consistent styling
- ✅ Automatic theme switching based on system preference

## Architecture

### File Structure
```
theme/
├── tokens.ts           # Color token definitions
├── ThemeProvider.tsx   # React context provider
├── useThemedStyles.ts  # Style helper utilities
└── index.ts           # Main exports
```

## Token System

### Brand Colors
The brand uses a green/teal hue (150°) with the following scale:
- **Primary:** `#006B3F` (deep green)
- **Scale:** 50-950 (lightest to darkest)

### Light Mode Tokens
```typescript
{
  surface: {
    base: '#ffffff',        // Main background
    subtle: '#f9fafb',      // Subtle sections
    elevated: '#f3f4f6',    // Cards, elevated surfaces
    overlay: '#e5e7eb',     // Modals, overlays
  },
  text: {
    primary: '#111827',     // Main text (near black)
    secondary: '#6b7280',   // Secondary text (gray)
    tertiary: '#9ca3af',    // Tertiary text (light gray)
    inverse: '#ffffff',     // Text on dark backgrounds
  },
  brand: {
    primary: '#006B3F',     // Brand primary
    onPrimary: '#ffffff',   // Text on brand primary
    surface: '#f0fdf4',     // Brand-tinted background
    accent: '#22c55e',      // Brand accent (lighter)
  },
  border: {
    default: '#e5e7eb',     // Default borders
    subtle: '#f3f4f6',      // Subtle borders
    strong: '#d1d5db',      // Strong borders
  },
  status: {
    success: '#22c55e',     // Success/breaking news
    error: '#dc2626',       // Error/destructive
    warning: '#f59e0b',     // Warning
    info: '#3b82f6',        // Informational
  },
}
```

### Dark Mode Tokens (OLED-Optimized)
```typescript
{
  surface: {
    base: '#0a0a0a',        // Near-black (NOT pure #000)
    subtle: '#18181b',      // Subtle sections (cards)
    elevated: '#27272a',    // Cards, elevated surfaces
    overlay: '#3f3f46',     // Modals, overlays
  },
  text: {
    primary: '#fafafa',     // Off-white (reduced eye strain)
    secondary: '#a1a1aa',   // Secondary text (gray)
    tertiary: '#71717a',    // Tertiary text (dark gray)
    inverse: '#0a0a0a',     // Text on light backgrounds
  },
  brand: {
    primary: '#4ade80',     // Lighter green for dark backgrounds
    onPrimary: '#0a0a0a',   // Text on brand primary
    surface: '#14532d',     // Dark green tint
    accent: '#86efac',      // Very light green accent
  },
  border: {
    default: '#3f3f46',     // Default borders
    subtle: '#27272a',      // Subtle borders
    strong: '#52525b',      // Strong borders
  },
  status: {
    success: '#4ade80',     // Lighter green
    error: '#f87171',       // Lighter red
    warning: '#fbbf24',     // Lighter amber
    info: '#60a5fa',        // Lighter blue
  },
}
```

## Usage

### 1. Setup (Already Done)
The `ThemeProvider` is already wrapped around the app in `app/_layout.tsx`:

```typescript
import { ThemeProvider } from '../theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {/* Your app */}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
```

### 2. Using Themed Styles

#### Method 1: useThemedStyles Hook (Recommended)
```typescript
import { useThemedStyles } from '../theme';
import { StyleSheet } from 'react-native';

export default function MyComponent() {
  const styles = useThemedStyles((tokens) => StyleSheet.create({
    container: {
      backgroundColor: tokens.surface.base,
      padding: 16,
    },
    title: {
      color: tokens.text.primary,
      fontSize: 18,
      fontWeight: 'bold',
    },
    subtitle: {
      color: tokens.text.secondary,
      fontSize: 14,
    },
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Title</Text>
      <Text style={styles.subtitle}>Subtitle</Text>
    </View>
  );
}
```

#### Method 2: useTheme Hook
```typescript
import { useTheme } from '../theme';

export default function MyComponent() {
  const { tokens, isDark, brand } = useTheme();

  return (
    <View style={{ backgroundColor: tokens.surface.base }}>
      <Text style={{ color: tokens.text.primary }}>
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </Text>
      <View style={{ backgroundColor: brand.primary }}>
        <Text style={{ color: brand.onPrimary }}>Brand Color</Text>
      </View>
    </View>
  );
}
```

#### Method 3: Specific Hooks
```typescript
import { 
  useThemeTokens, 
  useIsDarkMode, 
  useBrandColors,
  useSocialColors 
} from '../theme';

export default function MyComponent() {
  const tokens = useThemeTokens();
  const isDark = useIsDarkMode();
  const brand = useBrandColors();
  const social = useSocialColors();

  return (
    <View style={{ backgroundColor: tokens.surface.base }}>
      <Text style={{ color: tokens.text.primary }}>Content</Text>
      <View style={{ backgroundColor: brand.primary }}>Brand</View>
      <View style={{ backgroundColor: social.whatsapp }}>WhatsApp</View>
    </View>
  );
}
```

### 3. Social Media Colors
Social media brand colors are constant across themes:
```typescript
const social = {
  whatsapp: '#25D366',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  telegram: '#0088cc',
  instagram: '#E4405F',
  youtube: '#FF0000',
};
```

## Migration Guide

### Before (Hardcoded Colors)
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
  },
  title: {
    color: '#111827',
  },
  brand: {
    backgroundColor: '#006B3F',
  },
});
```

### After (Theme Tokens)
```typescript
const styles = useThemedStyles((tokens) => StyleSheet.create({
  container: {
    backgroundColor: tokens.surface.subtle,
  },
  title: {
    color: tokens.text.primary,
  },
  brand: {
    backgroundColor: tokens.brand.primary,
  },
}));
```

## Color Mapping Reference

### Light Mode
| Token | Hex | Usage |
|-------|-----|-------|
| `surface.base` | `#ffffff` | Main background |
| `surface.subtle` | `#f9fafb` | Subtle sections |
| `surface.elevated` | `#f3f4f6` | Cards |
| `text.primary` | `#111827` | Main text |
| `text.secondary` | `#6b7280` | Secondary text |
| `text.tertiary` | `#9ca3af` | Tertiary text |
| `brand.primary` | `#006B3F` | Brand color |
| `border.default` | `#e5e7eb` | Borders |
| `status.error` | `#dc2626` | Breaking news |

### Dark Mode
| Token | Hex | Usage |
|-------|-----|-------|
| `surface.base` | `#0a0a0a` | Main background (OLED black) |
| `surface.subtle` | `#18181b` | Subtle sections |
| `surface.elevated` | `#27272a` | Cards |
| `text.primary` | `#fafafa` | Main text (off-white) |
| `text.secondary` | `#a1a1aa` | Secondary text |
| `text.tertiary` | `#71717a` | Tertiary text |
| `brand.primary` | `#4ade80` | Brand color (lighter) |
| `border.default` | `#3f3f46` | Borders |
| `status.error` | `#f87171` | Breaking news (lighter) |

## Best Practices

### ✅ Do
- Use semantic tokens (`tokens.text.primary`) instead of hardcoded colors
- Use `useThemedStyles` for StyleSheet creation
- Use `tokens.surface.base` for main backgrounds
- Use `tokens.text.primary` for main text
- Use `tokens.brand.primary` for brand elements
- Test in both light and dark modes

### ❌ Don't
- Don't use hardcoded hex colors
- Don't use pure `#000000` for dark backgrounds (use `#0a0a0a`)
- Don't use pure `#ffffff` for light text (use `#fafafa`)
- Don't forget to test both themes
- Don't mix themed and non-themed styles

## Testing

### Manual Testing
1. Toggle system dark mode
2. Check all screens in both modes
3. Verify brand colors are visible
4. Check text contrast and readability
5. Test borders and separators

### Automated Testing (Future)
```typescript
// Example test
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../theme';

describe('Theme', () => {
  it('renders in light mode', () => {
    // Test light mode rendering
  });

  it('renders in dark mode', () => {
    // Test dark mode rendering
  });
});
```

## Files Updated

### Completed
- ✅ `app/_layout.tsx` - Added ThemeProvider
- ✅ `app/(tabs)/index.tsx` - Migrated to themed styles

### To Be Updated
- ⏳ `app/(tabs)/_layout.tsx` - Tab navigation colors
- ⏳ `app/(tabs)/search.tsx` - Search screen
- ⏳ `app/(tabs)/bookmarks.tsx` - Bookmarks screen
- ⏳ `app/(tabs)/profile.tsx` - Profile screen
- ⏳ `app/article/[id].tsx` - Article detail screen

## Benefits

1. **Consistency** - All colors come from a single source of truth
2. **Maintainability** - Change colors in one place
3. **Accessibility** - Proper contrast ratios in both modes
4. **OLED Optimization** - True black backgrounds save battery
5. **Brand Identity** - Consistent brand colors across the app
6. **Developer Experience** - Semantic naming makes code readable
7. **Theme Switching** - Automatic based on system preference

## Future Enhancements

- [ ] Add more semantic tokens (spacing, typography, etc.)
- [ ] Add custom theme override support
- [ ] Add theme persistence (user preference)
- [ ] Add high contrast mode
- [ ] Add color blindness friendly mode
- [ ] Add animation tokens

## Resources

- [React Native Styling](https://reactnative.dev/docs/style)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [OKLCH Color Space](https://oklch.com/)
- [Material Design Color System](https://material.io/design/color/)

---

**Last Updated:** 2026-09-20  
**Version:** 1.0.0  
**Status:** ✅ Implemented and documented
