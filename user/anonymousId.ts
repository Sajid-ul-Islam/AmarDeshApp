/**
 * Anonymous User ID Management
 * 
 * Generates and securely stores a persistent anonymous UUID for each user.
 * This ID is used for local behavior tracking without requiring authentication.
 * 
 * Key Features:
 * - Generated once on first app launch
 * - Stored securely in device keychain/keystore
 * - Persists across app reinstalls (until device wipe)
 * - Can be linked to authenticated user later
 */

import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';
import { Platform } from 'react-native';

const ANONYMOUS_ID_KEY = 'amar_desh_anonymous_user_id';

/**
 * Get the anonymous user ID, generating one if it doesn't exist
 * 
 * @returns Promise<string> - The anonymous user ID (UUID v4)
 * 
 * @example
 * const userId = await getAnonymousId();
 * console.log(userId); // "123e4567-e89b-12d3-a456-426614174000"
 */
export async function getAnonymousId(): Promise<string> {
  try {
    // Try to get existing ID
    let anonymousId = await SecureStore.getItemAsync(ANONYMOUS_ID_KEY);
    
    // If no ID exists, generate a new one
    if (!anonymousId) {
      anonymousId = uuidv4();
      await SecureStore.setItemAsync(ANONYMOUS_ID_KEY, anonymousId);
      console.log('[AnonymousId] Generated new anonymous ID:', anonymousId);
    } else {
      console.log('[AnonymousId] Retrieved existing anonymous ID:', anonymousId);
    }
    
    return anonymousId;
  } catch (error) {
    console.error('[AnonymousId] Error getting anonymous ID:', error);
    // Fallback: generate a temporary ID (won't persist)
    const fallbackId = uuidv4();
    console.warn('[AnonymousId] Using temporary ID:', fallbackId);
    return fallbackId;
  }
}

/**
 * Delete the anonymous user ID (for privacy/reset purposes)
 * 
 * @returns Promise<void>
 * 
 * @example
 * await deleteAnonymousId();
 */
export async function deleteAnonymousId(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(ANONYMOUS_ID_KEY);
    console.log('[AnonymousId] Deleted anonymous ID');
  } catch (error) {
    console.error('[AnonymousId] Error deleting anonymous ID:', error);
  }
}

/**
 * Check if an anonymous ID exists
 * 
 * @returns Promise<boolean> - True if ID exists, false otherwise
 * 
 * @example
 * const exists = await hasAnonymousId();
 * if (!exists) {
 *   // First time user
 * }
 */
export async function hasAnonymousId(): Promise<boolean> {
  try {
    const id = await SecureStore.getItemAsync(ANONYMOUS_ID_KEY);
    return id !== null;
  } catch (error) {
    console.error('[AnonymousId] Error checking anonymous ID:', error);
    return false;
  }
}

/**
 * Link anonymous ID to authenticated user ID
 * This is for future auth migration
 * 
 * @param authUserId - The authenticated user ID
 * @returns Promise<void>
 * 
 * @example
 * await linkToAuthUser('auth-123');
 */
export async function linkToAuthUser(authUserId: string): Promise<void> {
  try {
    const anonymousId = await getAnonymousId();
    // Store the mapping in SecureStore
    await SecureStore.setItemAsync(
      `amar_desh_auth_mapping_${anonymousId}`,
      authUserId
    );
    console.log('[AnonymousId] Linked anonymous ID to auth user:', authUserId);
  } catch (error) {
    console.error('[AnonymousId] Error linking to auth user:', error);
  }
}

/**
 * Get the authenticated user ID linked to this anonymous ID
 * 
 * @returns Promise<string | null> - The auth user ID or null if not linked
 * 
 * @example
 * const authId = await getLinkedAuthUser();
 * if (authId) {
 *   // User has authenticated
 * }
 */
export async function getLinkedAuthUser(): Promise<string | null> {
  try {
    const anonymousId = await getAnonymousId();
    const authUserId = await SecureStore.getItemAsync(
      `amar_desh_auth_mapping_${anonymousId}`
    );
    return authUserId;
  } catch (error) {
    console.error('[AnonymousId] Error getting linked auth user:', error);
    return null;
  }
}

/**
 * Platform-specific security notes:
 * 
 * iOS: Uses Keychain (encrypted, survives app reinstalls)
 * Android: Uses Keystore (encrypted, survives app reinstalls)
 * Web: Uses localStorage (NOT secure, but acceptable for web)
 * 
 * Security Guarantees:
 * - ID is encrypted at rest
 * - ID is not accessible to other apps
 * - ID persists across app reinstalls
 * - ID is deleted only on device wipe or explicit user action
 */
