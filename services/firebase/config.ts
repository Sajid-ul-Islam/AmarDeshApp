/**
 * Firebase Configuration
 * 
 * Initialize Firebase services for authentication and cloud sync.
 * This enables optional user accounts and cross-device synchronization.
 * 
 * Note: The app works fully without authentication (local-first).
 * Authentication is an optional enhancement for users who want cloud sync.
 */

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
// In production, these should be environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'YOUR_APP_ID',
};

/**
 * Services are `null` when initialization fails (e.g. invalid config).
 * All call sites guard with `isFirebaseConfigured()` before use, and the
 * auth/cloud-sync services treat `null` as "Firebase unavailable".
 */
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  app = initializeApp(firebaseConfig);
  console.log('[Firebase] App initialized successfully');

  // Initialize Auth with React Native persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  console.log('[Firebase] Auth initialized successfully');

  // Initialize Firestore
  db = getFirestore(app);
  console.log('[Firebase] Firestore initialized successfully');
} catch (error) {
  // Leave app/auth/db as null and disable dependent services gracefully.
  console.error('[Firebase] Error initializing Firebase:', error);
  app = null;
  auth = null;
  db = null;
}

// Export Firebase services
export { app, auth, db };

// Export configuration for debugging
export const getFirebaseConfig = () => firebaseConfig;

// Check if Firebase is properly configured
export const isFirebaseConfigured = (): boolean => {
  return (
    firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
    firebaseConfig.projectId !== 'YOUR_PROJECT_ID' &&
    app !== null &&
    auth !== null &&
    db !== null
  );
};

/**
 * Assert Firebase is configured and return the initialized services.
 * Throws if Firebase failed to initialize or is not configured.
 */
export function requireFirebase(): { app: FirebaseApp; auth: Auth; db: Firestore } {
  if (!isFirebaseConfigured() || !app || !auth || !db) {
    throw new Error('Firebase is not configured or failed to initialize');
  }
  return { app, auth, db };
}
