/**
 * Firebase Services Index
 * 
 * Central export for all Firebase-related services.
 */

export { isFirebaseConfigured, getFirebaseConfig, requireFirebase } from './config';
export {
  initializeAuthListener,
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
