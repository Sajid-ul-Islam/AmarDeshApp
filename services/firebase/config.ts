/**
 * Firebase Configuration
 * 
 * Initialize Firebase services for authentication and cloud sync.
 * This enables optional user accounts and cross-device synchronization.
 * 
 * Note: The app works fully without authentication (local-first).
 * Authentication is an optional enhancement for users who want cloud sync.
 */

import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
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

// Initialize Firebase app
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('[Firebase] App initialized successfully');
} catch (error) {
  console.error('[Firebase] Error initializing app:', error);
}

// Initialize Auth with React Native persistence
let auth;
try {
  auth = initializeAuth(app, getReactNativePersistence(AsyncStorage));
  console.log('[Firebase] Auth initialized successfully');
} catch (error) {
  console.error('[Firebase] Error initializing auth:', error);
}

// Initialize Firestore
let db;
try {
  db = getFirestore(app);
  console.log('[Firebase] Firestore initialized successfully');
} catch (error) {
  console.error('[Firebase] Error initializing Firestore:', error);
}

// Export Firebase services
export { app, auth, db };

// Export configuration for debugging
export const getFirebaseConfig = () => firebaseConfig;

// Check if Firebase is properly configured
export const isFirebaseConfigured = (): boolean => {
  return (
    firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
    firebaseConfig.projectId !== 'YOUR_PROJECT_ID'
  );
};
