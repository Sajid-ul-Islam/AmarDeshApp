/**
 * Firebase Auth React Native type shim
 *
 * `getReactNativePersistence` is exported at runtime by the React Native
 * bundle of @firebase/auth (resolved via the `react-native` condition by
 * Metro), but it is missing from the TypeScript types that tsc resolves
 * under `moduleResolution: "bundler"`.
 *
 * This augmentation adds the missing declaration so
 * `import { getReactNativePersistence } from 'firebase/auth'`
 * typechecks without changing runtime behavior.
 */

import type { Persistence } from 'firebase/auth';

declare module 'firebase/auth' {
  export interface ReactNativeAsyncStorage {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
  }

  export function getReactNativePersistence(
    storage: ReactNativeAsyncStorage
  ): Persistence;
}
