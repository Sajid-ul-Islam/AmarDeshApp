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

  it('reports "not configured" honestly when no cloud backend is supplied', async () => {
    // Regression guard: this call used to fabricate a remote response from the
    // local payload and return success: true, telling the reader their data had
    // been synced when nothing left the device.
    const fetchSpy = jest.spyOn(global, 'fetch');

    const result = await syncAccountData('reader-789');

    expect(result.success).toBe(false);
    expect(result.notConfigured).toBe(true);
    expect(fetchSpy).not.toHaveBeenCalled();

    const state = await getCloudSyncState();
    expect(state.lastError).toBeTruthy();

    fetchSpy.mockRestore();
  });

  it('merges local and remote data by set union when a backend is configured', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        bookmarks: ['art-remote-1'],
        readingStreak: { count: 9, lastRead: '2026-10-01' },
        reactions: {},
        preferences: {},
      }),
    } as unknown as Response);

    const result = await syncAccountData(
      'reader-789',
      'https://cloud.example.com/api/sync'
    );

    expect(result.success).toBe(true);
    expect(result.bookmarksCount).toBeGreaterThanOrEqual(3);
    expect(result.streakCount).toBeGreaterThanOrEqual(9);

    const mergedBookmarks = await loadBookmarks();
    expect(mergedBookmarks).toContain('art-test-1');
    expect(mergedBookmarks).toContain('art-test-2');
    expect(mergedBookmarks).toContain('art-remote-1');

    const mergedStreak = await loadStreak();
    expect(mergedStreak.count).toBe(9);

    fetchSpy.mockRestore();
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
