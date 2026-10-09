/**
 * Error boundary behaviour.
 *
 * Before this component existed, any render throw in the screen tree
 * white-screened the app with no recovery path. These tests pin the two things
 * that matter: a Bengali fallback is shown instead of a crash, and pressing the
 * retry button re-renders the children.
 *
 * Note: `render` from @testing-library/react-native 14 is asynchronous, so every
 * test below awaits it.
 */

import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render, type RenderResult } from '@testing-library/react-native';
import { ErrorBoundary } from '../ErrorBoundary';
import { ThemeProvider } from '../../theme';

/** Component that throws on demand. */
const Boom: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('render exploded');
  }
  return <Text>সব ঠিক আছে</Text>;
};

const renderWithTheme = (ui: React.ReactElement): Promise<RenderResult> =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

declare const jest: typeof globalThis.jest;

describe('ErrorBoundary', () => {
  // React logs the caught error; keep the test output readable.
  let consoleErrorSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders a plain Text in renderWithTheme', async () => {
    const view = await renderWithTheme(<Text>কাস্টম ফলব্যাক</Text>);
    expect(view.getByText('কাস্টম ফলব্যাক')).toBeTruthy();
  });

  it('renders its children when nothing throws', async () => {
    const view = await renderWithTheme(
      <ErrorBoundary>
        <Boom shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(view.getByText('সব ঠিক আছে')).toBeTruthy();
  });

  it('shows a Bengali recovery screen instead of crashing', async () => {
    const view = await renderWithTheme(
      <ErrorBoundary>
        <Boom shouldThrow />
      </ErrorBoundary>
    );

    expect(view.getByText('কিছু একটা ভুল হয়েছে')).toBeTruthy();

    const retry = view.getByLabelText('আবার চেষ্টা করুন');
    expect(retry).toBeTruthy();
    expect(retry.props.accessibilityRole).toBe('button');
  });

  it('calls componentDidCatch so the failure is logged', async () => {
    await renderWithTheme(
      <ErrorBoundary>
        <Boom shouldThrow />
      </ErrorBoundary>
    );

    const logged = consoleErrorSpy.mock.calls.some(
      (call: unknown[]) => call[0] === '[ErrorBoundary] Uncaught render error:'
    );
    expect(logged).toBe(true);
  });

  it('recovers when the retry button is pressed and the cause is gone', async () => {
    // A transient failure: the child throws on the first render, then succeeds.
    // This is the real recovery path a reader hits after a bad refresh.
    let shouldThrow = true;

    const Transient: React.FC = () => {
      if (shouldThrow) throw new Error('transient');
      return <Text>পুনরুদ্ধার হয়েছে</Text>;
    };

    const view = await renderWithTheme(
      <ErrorBoundary>
        <Transient />
      </ErrorBoundary>
    );

    // Fallback is visible and the child never rendered.
    expect(view.getByText('কিছু একটা ভুল হয়েছে')).toBeTruthy();
    expect(view.queryByText('পুনরুদ্ধার হয়েছে')).toBeNull();

    // The cause resolves, then the reader taps retry.
    shouldThrow = false;
    fireEvent.press(view.getByLabelText('আবার চেষ্টা করুন'));
    await view.rerender(
      <ThemeProvider>
        <ErrorBoundary>
          <Transient />
        </ErrorBoundary>
      </ThemeProvider>
    );

    // The boundary reset and the child rendered successfully.
    expect(view.getByText('পুনরুদ্ধার হয়েছে')).toBeTruthy();
    expect(view.queryByText('কিছু একটা ভুল হয়েছে')).toBeNull();
  });
});
