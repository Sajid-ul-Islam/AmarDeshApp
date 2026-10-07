/**
 * Jest setup
 *
 * Mocks native modules that are unavailable in the Node test environment.
 * Provides in-memory stubs for AsyncStorage and expo-sqlite so tests
 * execute realistically without native binaries.
 */

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(async () => ({
    coords: {
      latitude: 22.3569,
      longitude: 91.7832,
    },
  })),
  reverseGeocodeAsync: jest.fn(async () => [
    {
      city: 'Chittagong',
      district: 'Chattogram',
      region: 'Chittagong Division',
      country: 'Bangladesh',
    },
  ]),
  Accuracy: {
    Balanced: 3,
    High: 4,
  },
}));

// In-memory table for expo-sqlite (prefixed with 'mock' for Jest scope rule)
const mockSqliteStore = new Map();

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(async () => ({
    execAsync: jest.fn(async () => undefined),
    runAsync: jest.fn(async (query, params = []) => {
      if (query.includes('INSERT') && params.length >= 10) {
        mockSqliteStore.set(params[0], {
          id: params[0],
          title: params[1],
          excerpt: params[2],
          content: params[3],
          category: params[4],
          imageUrl: params[5],
          author: params[6],
          publishedAt: params[7],
          isBreaking: params[8],
          cachedAt: params[9],
        });
      } else if (query.includes('DELETE')) {
        mockSqliteStore.clear();
      }
      return { lastInsertRowId: 1, changes: 1 };
    }),
    getAllAsync: jest.fn(async (query, params = []) => {
      const all = Array.from(mockSqliteStore.values());
      if (query.includes('WHERE category = ?') && params[0]) {
        return all.filter((i) => i.category === params[0]);
      }
      if (query.includes('WHERE title LIKE ?') && params[0]) {
        const needle = String(params[0]).replace(/%/g, '');
        return all.filter(
          (i) =>
            (i.title && i.title.includes(needle)) ||
            (i.content && i.content.includes(needle))
        );
      }
      return all;
    }),
    getFirstAsync: jest.fn(async () => ({ count: mockSqliteStore.size })),
    withTransactionAsync: jest.fn(async (fn) => {
      if (typeof fn === 'function') await fn();
    }),
    closeAsync: jest.fn(async () => undefined),
  })),
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-1234-5678-abcd-efghijklmnop'),
}));

// In-memory map for AsyncStorage (prefixed with 'mock' for Jest scope rule)
const mockAsyncStorageStore = new Map();

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async (key) => mockAsyncStorageStore.get(key) ?? null),
  setItem: jest.fn(async (key, val) => {
    mockAsyncStorageStore.set(key, String(val));
  }),
  removeItem: jest.fn(async (key) => {
    mockAsyncStorageStore.delete(key);
  }),
  clear: jest.fn(async () => {
    mockAsyncStorageStore.clear();
  }),
  multiRemove: jest.fn(async (keys) => {
    keys.forEach((k) => mockAsyncStorageStore.delete(k));
  }),
}));

// Suppress console logs in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
