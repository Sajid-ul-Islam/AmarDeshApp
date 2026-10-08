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
  signOut as firebaseSignOut,
  onAuthStateChanged,
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
 * Error thrown when an operation needs the cloud account system and no Firebase
 * project is configured. The UI surfaces `message` directly, so it is written
 * for the reader.
 */
export class CloudNotConfiguredError extends Error {
  constructor() {
    super(
      'অ্যাকাউন্ট ও ক্লাউড সিঙ্ক এখনো চালু করা হয়নি। আপনার বুকমার্ক, পড়ার ইতিহাস ও সেটিংস এই ডিভাইসেই নিরাপদে সংরক্ষিত আছে।'
    );
    this.name = 'CloudNotConfiguredError';
  }
}

/** Whether account-backed features can run. */
export function isCloudAccountAvailable(): boolean {
  return isFirebaseConfigured();
}

function requireAuthOrThrow(): Auth {
  if (!isFirebaseConfigured()) {
    throw new CloudNotConfiguredError();
  }
  return requireFirebase().auth;
}

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
  const auth = requireAuthOrThrow();

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
  } catch (error: unknown) {
    if (error instanceof CloudNotConfiguredError) throw error;
    const fbError = error as { code?: string; message?: string };
    console.error('[Auth] Sign in error:', fbError?.message);
    throw new Error(getAuthErrorMessage(fbError?.code || ''));
  }
}

/**
 * Create account with email and password
 */
export async function createAccountWithEmail(
  email: string,
  password: string
): Promise<User> {
  const auth = requireAuthOrThrow();

  try {
    console.log('[Auth] Creating account with email:', email);
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Migrate anonymous data to new account
    await migrateAnonymousData(user.uid);
    
    console.log('[Auth] Account created successfully:', user.uid);
    return user;
  } catch (error: unknown) {
    if (error instanceof CloudNotConfiguredError) throw error;
    const fbError = error as { code?: string; message?: string };
    console.error('[Auth] Create account error:', fbError?.message);
    throw new Error(getAuthErrorMessage(fbError?.code || ''));
  }
}

/**
 * Third-party sign-in is NOT implemented.
 *
 * The previous implementation called `signInWithCredential` with the literal
 * strings `'mock_google_id_token'` / `'mock_id_token'` + `'mock_nonce'`. Those
 * are not real OIDC tokens, so Firebase always rejected them and the reader saw
 * a generic "authentication error" with no way to succeed.
 *
 * A real implementation needs a provider SDK to obtain a genuine ID token:
 *   - Google: `@react-native-google-signin/google-signin`, then
 *     `GoogleAuthProvider.credential(idToken)`
 *   - Apple:  `expo-apple-authentication`, then
 *     `new OAuthProvider('apple.com').credential({ idToken, rawNonce })`
 * Both need native configuration (OAuth client ids / Apple capability) this
 * project does not have. Until then these reject with a clear reason rather
 * than pretending to attempt a sign-in.
 */
export async function signInWithGoogle(): Promise<User> {
  if (!isFirebaseConfigured()) {
    throw new CloudNotConfiguredError();
  }
  throw new Error(
    'Google দিয়ে সাইন-ইন এখনো চালু করা হয়নি। ইমেইল ও পাসওয়ার্ড ব্যবহার করুন।'
  );
}

export async function signInWithApple(): Promise<User> {
  if (!isFirebaseConfigured()) {
    throw new CloudNotConfiguredError();
  }
  throw new Error(
    'Apple দিয়ে সাইন-ইন এখনো চালু করা হয়নি। ইমেইল ও পাসওয়ার্ড ব্যবহার করুন।'
  );
}

/**
 * Sign out
 *
 * A no-op (not an error) when nothing is signed in, so the UI can always offer
 * "sign out" without surfacing a failure on an already-signed-out device.
 */
export async function signOut(): Promise<void> {
  if (!isFirebaseConfigured() || !currentUser) {
    currentUser = null;
    return;
  }

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
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error('[Auth] Sign out error:', errMessage);
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
