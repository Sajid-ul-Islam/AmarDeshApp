/**
 * Error Boundary
 *
 * Catches render/lifecycle errors in the screen tree and shows a recoverable
 * Bengali fallback instead of letting the app white-screen or crash.
 *
 * Deliberately a class component: React only exposes error boundaries through
 * `getDerivedStateFromError` / `componentDidCatch`.
 *
 * The fallback uses theme tokens via `useThemeTokens()`, so it renders correctly
 * in light, dark, and sepia. It never throws: if the theme context is itself
 * unavailable (an error thrown above `ThemeProvider`), the hook would throw, so
 * this component is mounted *inside* the provider in `app/_layout.tsx`.
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeTokens } from '../theme';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Optional custom fallback (receives a reset callback). */
  fallback?: (reset: () => void) => React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/** Bengali fallback screen. Split out so it can use hooks. */
const ErrorFallback: React.FC<{ message: string; onRetry: () => void }> = ({
  message,
  onRetry,
}) => {
  const tokens = useThemeTokens();

  return (
    <View style={[styles.container, { backgroundColor: tokens.surface.subtle }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: tokens.surface.elevated, borderColor: tokens.border.subtle },
          ]}
        >
          <Ionicons name="alert-circle-outline" size={40} color={tokens.brand.primary} />
        </View>

        <Text style={[styles.title, { color: tokens.text.primary }]}>
          কিছু একটা ভুল হয়েছে
        </Text>

        <Text style={[styles.body, { color: tokens.text.secondary }]}>
          অ্যাপটি এই পর্দাটি দেখাতে পারেনি। আপনি আবার চেষ্টা করতে পারেন — আপনার সংরক্ষিত
          সংবাদ ও বুকমার্ক অক্ষত আছে।
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: tokens.brand.primary }]}
          onPress={onRetry}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="আবার চেষ্টা করুন"
        >
          <Ionicons name="refresh" size={18} color="#FFFFFF" />
          <Text style={styles.buttonText}>আবার চেষ্টা করুন</Text>
        </TouchableOpacity>

        {__DEV__ && message ? (
          <Text style={[styles.debug, { color: tokens.text.tertiary ?? tokens.text.secondary }]}>
            {message}
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // No crash-reporting SDK is wired up yet; keep the console trace so the
    // failure is still diagnosable from device logs.
    console.error('[ErrorBoundary] Uncaught render error:', error, info?.componentStack);
  }

  private reset = (): void => {
    this.setState({ error: null });
  };

  render(): React.ReactNode {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback(this.reset);
    }

    return <ErrorFallback message={error.message} onRetry={this.reset} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 999,
    minHeight: 44,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  debug: {
    marginTop: 24,
    fontSize: 11,
    textAlign: 'center',
  },
});

export default ErrorBoundary;
