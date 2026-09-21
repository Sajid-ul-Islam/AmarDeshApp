/**
 * Authentication Service
 * 
 * Handles user authentication with Firebase Auth.
 * Supports email/password, Google, and Apple sign-in.
 * 
 * Key Features:
 * - Email/password authentication
 * - Google Sign-In
 * - Apple Sign-In (iOS)
 * - Anonymous to authenticated migration
 * - Auth state persistence
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  OAuthProvider,
  type User,
  type Auth,
} from 'firebase/auth';
import { isFirebaseConfigured, requireFirebase } from './config';
import { getAnonymousId, linkToAuthUser } from '../../user/anonymousId';
import { syncToCloud, pullFromCloud } from './cloudSync';

// Auth state callback type
type AuthStateCallback = (user: User | null) => void;

// Current auth state
let currentUser: User | null = null;
let authStateCallbacks: AuthStateCallback[] = [];

/**
 * Initialize auth state listener
 */
export function initializeAuthListener(): void {
  if (!isFirebaseConfigured()) {
    console.warn('[Auth] Firebase not configured, auth disabled');
    return;
  }

  const { auth } = requireFirebase();

  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    
    // Notify all callbacks
    authStateCallbacks.forEach(callback => callback(user));
    
    if (user) {
      console.log('[Auth] User signed in:', user.uid);
    } else {
      console.log('[Auth] User signed out');
    }
  });
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: AuthStateCallback): () => void {
  authStateCallbacks.push(callback);
  
  // Call immediately with current state
  callback(currentUser);
  
  // Return unsubscribe function
  return () => {
    authStateCallbacks = authStateCallbacks.filter(cb => cb !== callback);
  };
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  return currentUser;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return currentUser !== null;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<User> {
  const { auth } = requireFirebase();

  try {
    console.log('[Auth] Signing in with email:', email);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Migrate anonymous data to authenticated user
    await migrateAnonymousData(user.uid);
    
    // Pull data from cloud
    await pullFromCloud(user.uid);
    
    console.log('[Auth] Sign in successful:', user.uid);
    return user;
  } catch (error: any) {
    console.error('[Auth] Sign in error:', error.message);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Create account with email and password
 */
export async function createAccountWithEmail(
  email: string,
  password: string
): Promise<User> {
  const { auth } = requireFirebase();

  try {
    console.log('[Auth] Creating account with email:', email);
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Migrate anonymous data to new account
    await migrateAnonymousData(user.uid);
    
    console.log('[Auth] Account created successfully:', user.uid);
    return user;
  } catch (error: any) {
    console.error('[Auth] Create account error:', error.message);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Sign in with Google
 *
 * Note: In a real app, you'd use @react-native-google-signin/google-signin
 * to obtain a real Google ID token. The current placeholder token will be
 * rejected by Firebase, surfacing a friendly error to the user.
 */
export async function signInWithGoogle(): Promise<User> {
  const { auth } = requireFirebase();

  try {
    console.log('[Auth] Signing in with Google');

    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithCredential(
      auth,
      GoogleAuthProvider.credential('mock_google_id_token')
    );
    const user = userCredential.user;
    
    // Migrate anonymous data
    await migrateAnonymousData(user.uid);
    
    // Pull data from cloud
    await pullFromCloud(user.uid);
    
    console.log('[Auth] Google sign in successful:', user.uid);
    return user;
  } catch (error: any) {
    console.error('[Auth] Google sign in error:', error.message);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Sign in with Apple (iOS only)
 *
 * Note: In a real app, you'd use expo-apple-authentication to obtain a real
 * Apple identity token and a fresh nonce. The current placeholder token will
 * be rejected by Firebase, surfacing a friendly error to the user.
 */
export async function signInWithApple(): Promise<User> {
  const { auth } = requireFirebase();

  try {
    console.log('[Auth] Signing in with Apple');

    const provider = new OAuthProvider('apple.com');
    const userCredential = await signInWithCredential(
      auth,
      provider.credential({
        idToken: 'mock_id_token',
        rawNonce: 'mock_nonce',
      })
    );
    const user = userCredential.user;
    
    // Migrate anonymous data
    await migrateAnonymousData(user.uid);
    
    // Pull data from cloud
    await pullFromCloud(user.uid);
    
    console.log('[Auth] Apple sign in successful:', user.uid);
    return user;
  } catch (error: any) {
    console.error('[Auth] Apple sign in error:', error.message);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  const { auth } = requireFirebase();

  try {
    console.log('[Auth] Signing out');
    
    // Sync data to cloud before signing out
    if (currentUser) {
      await syncToCloud(currentUser.uid);
    }
    
    await firebaseSignOut(auth);
    currentUser = null;
    
    console.log('[Auth] Sign out successful');
  } catch (error: any) {
    console.error('[Auth] Sign out error:', error.message);
    throw new Error('Failed to sign out');
  }
}

/**
 * Migrate anonymous data to authenticated user
 */
async function migrateAnonymousData(authUserId: string): Promise<void> {
  try {
    console.log('[Auth] Migrating anonymous data to authenticated user');
    
    // Get anonymous ID
    const anonymousId = await getAnonymousId();
    
    // Link anonymous ID to auth user
    await linkToAuthUser(authUserId);
    
    // Sync local data to cloud
    await syncToCloud(authUserId);
    
    console.log('[Auth] Migration successful');
  } catch (error) {
    console.error('[Auth] Migration error:', error);
    // Don't throw - migration failure shouldn't block sign in
  }
}

/**
 * Get user-friendly error messages
 */
function getAuthErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'এই ইমেইল আগে থেকে ব্যবহৃত হচ্ছে',
    'auth/invalid-email': 'অবৈধ ইমেইল ঠিকানা',
    'auth/weak-password': 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে',
    'auth/user-not-found': 'ব্যবহারকারী খুঁজে পাওয়া যায়নি',
    'auth/wrong-password': 'ভুল পাসওয়ার্ড',
    'auth/invalid-credential': 'অবৈধ ক্রেডেনশিয়াল',
    'auth/too-many-requests': 'অনেক অনুরোধ, পরে আবার চেষ্টা করুন',
    'auth/network-request-failed': 'নেটওয়ার্ক সমস্যা, ইন্টারনেট সংযোগ পরীক্ষা করুন',
  };
  
  return errorMessages[errorCode] || 'প্রমাণীকরণ ত্রুটি ঘটেছে';
}

/**
 * Get user display name
 */
export function getUserDisplayName(): string | null {
  if (!currentUser) return null;
  return currentUser.displayName || currentUser.email || 'ব্যবহারকারী';
}

/**
 * Get user email
 */
export function getUserEmail(): string | null {
  if (!currentUser) return null;
  return currentUser.email;
}

/**
 * Get user photo URL
 */
export function getUserPhotoURL(): string | null {
  if (!currentUser) return null;
  return currentUser.photoURL;
}
