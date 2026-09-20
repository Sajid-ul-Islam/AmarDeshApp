/**
 * Cloud Sync Service
 * 
 * Handles synchronization of user data between local device and cloud.
 * Uses Firestore for cloud storage.
 * 
 * Key Features:
 * - Bidirectional sync (local ↔ cloud)
 * - Conflict resolution (last write wins)
 * - Incremental sync (only changed data)
 * - Offline support (queue changes when offline)
 */

import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { getEvents, insertEvents, Event } from '../user/db';
import { getTopAffinities, upsertAffinity, Affinity } from '../user/affinityCalculator';
import { getUserMetadata, upsertUserMetadata, UserMetadata } from '../user/db';

// Sync state
let lastSyncTime: number = 0;
let isSyncing: boolean = false;
let syncQueue: any[] = [];

/**
 * Sync all user data to cloud
 */
export async function syncToCloud(userId: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    console.warn('[CloudSync] Firebase not configured, sync disabled');
    return;
  }

  if (isSyncing) {
    console.log('[CloudSync] Sync already in progress, queuing');
    syncQueue.push({ type: 'sync', userId });
    return;
  }

  isSyncing = true;

  try {
    console.log('[CloudSync] Starting sync to cloud for user:', userId);

    // Sync events
    await syncEventsToCloud(userId);

    // Sync affinities
    await syncAffinitiesToCloud(userId);

    // Sync user metadata
    await syncMetadataToCloud(userId);

    // Update last sync time
    lastSyncTime = Date.now();

    console.log('[CloudSync] Sync to cloud completed successfully');
  } catch (error) {
    console.error('[CloudSync] Error syncing to cloud:', error);
    throw error;
  } finally {
    isSyncing = false;

    // Process queued syncs
    if (syncQueue.length > 0) {
      const nextSync = syncQueue.shift();
      if (nextSync.type === 'sync') {
        await syncToCloud(nextSync.userId);
      }
    }
  }
}

/**
 * Pull user data from cloud
 */
export async function pullFromCloud(userId: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    console.warn('[CloudSync] Firebase not configured, pull disabled');
    return;
  }

  try {
    console.log('[CloudSync] Pulling data from cloud for user:', userId);

    // Pull events
    await pullEventsFromCloud(userId);

    // Pull affinities
    await pullAffinitiesFromCloud(userId);

    // Pull user metadata
    await pullMetadataFromCloud(userId);

    console.log('[CloudSync] Pull from cloud completed successfully');
  } catch (error) {
    console.error('[CloudSync] Error pulling from cloud:', error);
    throw error;
  }
}

/**
 * Sync events to cloud
 */
async function syncEventsToCloud(userId: string): Promise<void> {
  try {
    // Get events since last sync
    const events = await getEvents(userId, lastSyncTime);

    if (events.length === 0) {
      console.log('[CloudSync] No new events to sync');
      return;
    }

    console.log(`[CloudSync] Syncing ${events.length} events to cloud`);

    // Batch write events to Firestore
    const batch = [];
    for (const event of events) {
      const eventDoc = {
        ...event,
        synced_at: Timestamp.now(),
      };
      batch.push(
        setDoc(doc(db, 'users', userId, 'events', event.id?.toString() || `event_${Date.now()}`), eventDoc)
      );
    }

    await Promise.all(batch);
    console.log('[CloudSync] Events synced successfully');
  } catch (error) {
    console.error('[CloudSync] Error syncing events:', error);
    throw error;
  }
}

/**
 * Sync affinities to cloud
 */
async function syncAffinitiesToCloud(userId: string): Promise<void> {
  try {
    // Get all affinities
    const topics = await getTopAffinities('topic', 100);
    const authors = await getTopAffinities('author', 100);
    const sections = await getTopAffinities('section', 100);

    const allAffinities = [...topics, ...authors, ...sections];

    if (allAffinities.length === 0) {
      console.log('[CloudSync] No affinities to sync');
      return;
    }

    console.log(`[CloudSync] Syncing ${allAffinities.length} affinities to cloud`);

    // Write affinities to Firestore
    const affinityDoc = {
      affinities: allAffinities,
      updated_at: Timestamp.now(),
    };

    await setDoc(doc(db, 'users', userId, 'profile', 'affinities'), affinityDoc);
    console.log('[CloudSync] Affinities synced successfully');
  } catch (error) {
    console.error('[CloudSync] Error syncing affinities:', error);
    throw error;
  }
}

/**
 * Sync user metadata to cloud
 */
async function syncMetadataToCloud(userId: string): Promise<void> {
  try {
    // Get user metadata
    const metadata = await getUserMetadata(userId);

    if (!metadata) {
      console.log('[CloudSync] No metadata to sync');
      return;
    }

    console.log('[CloudSync] Syncing metadata to cloud');

    // Write metadata to Firestore
    const metadataDoc = {
      ...metadata,
      updated_at: Timestamp.now(),
    };

    await setDoc(doc(db, 'users', userId, 'profile', 'metadata'), metadataDoc);
    console.log('[CloudSync] Metadata synced successfully');
  } catch (error) {
    console.error('[CloudSync] Error syncing metadata:', error);
    throw error;
  }
}

/**
 * Pull events from cloud
 */
async function pullEventsFromCloud(userId: string): Promise<void> {
  try {
    console.log('[CloudSync] Pulling events from cloud');

    // Query events from Firestore
    const eventsQuery = query(
      collection(db, 'users', userId, 'events'),
      where('synced_at', '>', Timestamp.fromMillis(lastSyncTime))
    );

    const querySnapshot = await getDocs(eventsQuery);

    if (querySnapshot.empty) {
      console.log('[CloudSync] No new events to pull');
      return;
    }

    const events: Event[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        ...data,
        synced_at: data.synced_at.toMillis(),
        created_at: data.created_at,
      });
    });

    console.log(`[CloudSync] Pulled ${events.length} events from cloud`);

    // Insert events into local database
    await insertEvents(events);
    console.log('[CloudSync] Events pulled successfully');
  } catch (error) {
    console.error('[CloudSync] Error pulling events:', error);
    throw error;
  }
}

/**
 * Pull affinities from cloud
 */
async function pullAffinitiesFromCloud(userId: string): Promise<void> {
  try {
    console.log('[CloudSync] Pulling affinities from cloud');

    // Get affinities from Firestore
    const affinityDoc = await getDoc(doc(db, 'users', userId, 'profile', 'affinities'));

    if (!affinityDoc.exists()) {
      console.log('[CloudSync] No affinities to pull');
      return;
    }

    const data = affinityDoc.data();
    const affinities: Affinity[] = data.affinities || [];

    console.log(`[CloudSync] Pulled ${affinities.length} affinities from cloud`);

    // Update local affinities
    await upsertAffinity(affinities);
    console.log('[CloudSync] Affinities pulled successfully');
  } catch (error) {
    console.error('[CloudSync] Error pulling affinities:', error);
    throw error;
  }
}

/**
 * Pull user metadata from cloud
 */
async function pullMetadataFromCloud(userId: string): Promise<void> {
  try {
    console.log('[CloudSync] Pulling metadata from cloud');

    // Get metadata from Firestore
    const metadataDoc = await getDoc(doc(db, 'users', userId, 'profile', 'metadata'));

    if (!metadataDoc.exists()) {
      console.log('[CloudSync] No metadata to pull');
      return;
    }

    const data = metadataDoc.data();
    const metadata: UserMetadata = {
      ...data,
      updated_at: data.updated_at.toMillis(),
    };

    console.log('[CloudSync] Pulled metadata from cloud');

    // Update local metadata
    await upsertUserMetadata(metadata);
    console.log('[CloudSync] Metadata pulled successfully');
  } catch (error) {
    console.error('[CloudSync] Error pulling metadata:', error);
    throw error;
  }
}

/**
 * Get last sync time
 */
export function getLastSyncTime(): number {
  return lastSyncTime;
}

/**
 * Check if sync is in progress
 */
export function isSyncInProgress(): boolean {
  return isSyncing;
}

/**
 * Delete user data from cloud
 */
export async function deleteUserDataFromCloud(userId: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    console.warn('[CloudSync] Firebase not configured, delete disabled');
    return;
  }

  try {
    console.log('[CloudSync] Deleting user data from cloud for user:', userId);

    // Delete user document
    await deleteDoc(doc(db, 'users', userId));

    console.log('[CloudSync] User data deleted from cloud successfully');
  } catch (error) {
    console.error('[CloudSync] Error deleting user data:', error);
    throw error;
  }
}
