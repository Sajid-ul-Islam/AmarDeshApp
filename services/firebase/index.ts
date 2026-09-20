/**
 * Firebase Services Index
 * 
 * Central export for all Firebase-related services.
 */

export { app, auth, db, isFirebaseConfigured, getFirebaseConfig } from './config';
export {
  initializeAuth,
  onAuthStateChange,
  getCurrentUser,
  isAuthenticated,
  signInWithEmail,
  createAccountWithEmail,
  signInWithGoogle,
  signInWithApple,
  signOut,
  getUserDisplayName,
  getUserEmail,
  getUserPhotoURL,
} from './authService';
export {
  syncToCloud,
  pullFromCloud,
  deleteUserDataFromCloud,
  getLastSyncTime,
  isSyncInProgress,
} from './cloudSync';
