import {
  syncAccountData,
  getCloudSyncState,
  subscribeToSyncState,
  CloudSyncState,
} from '../cloudSyncService';
import { saveBookmarks, loadBookmarks, saveStreak, loadStreak } from '../storage';

describe('CloudSyncService', () => {
  beforeEach(async () => {
    await saveBookmarks(['art-test-1', 'art-test-2']);
    await saveStreak({ count: 5, lastRead: '2026-10-06' });
  });

  it('initializes sync state with default values', async () => {
    const state = await getCloudSyncState();
    expect(state).toBeDefined();
    expect(typeof state.isSyncing).toBe('boolean');
  });

  it('notifies subscribers on sync events', async () => {
    const observedStates: CloudSyncState[] = [];
    const unsubscribe = subscribeToSyncState((s) => {
      observedStates.push(s);
    });

    expect(observedStates.length).toBeGreaterThanOrEqual(1);

    await syncAccountData('user-demo-123');
    expect(observedStates.some((s) => s.userId === 'user-demo-123')).toBe(true);

    unsubscribe();
  });

  it('performs local-to-cloud merge with set union for bookmarks and max streak', async () => {
    const result = await syncAccountData('reader-789');

    expect(result.success).toBe(true);
    expect(result.bookmarksCount).toBeGreaterThanOrEqual(2);
    expect(result.streakCount).toBeGreaterThanOrEqual(5);

    const mergedBookmarks = await loadBookmarks();
    expect(mergedBookmarks).toContain('art-test-1');
    expect(mergedBookmarks).toContain('art-test-2');

    const mergedStreak = await loadStreak();
    expect(mergedStreak.count).toBeGreaterThanOrEqual(5);
  });

  it('handles offline fallback and queuing gracefully when network fails', async () => {
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new Error('Network request failed'));

    const result = await syncAccountData(
      'offline-user',
      'http://invalid-unreachable-cloud-host.local/api/sync'
    );

    expect(result.success).toBe(false);
    expect(result.queued).toBe(true);

    const state = await getCloudSyncState();
    expect(state.pendingChanges).toBeGreaterThanOrEqual(1);

    fetchSpy.mockRestore();
  });
});
