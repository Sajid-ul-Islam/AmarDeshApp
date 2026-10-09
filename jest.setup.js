/**
 * Jest setup
 *
 * Mocks native modules that are unavailable in the Node test environment.
 * Provides in-memory stubs for AsyncStorage and expo-sqlite so tests
 * execute realistically without native binaries.
 *
 * IMPORTANT — why `fetch` is overridden below:
 * `expo/fetch` installs a global `fetch` backed by `ExpoFetchModule`, a native
 * module that does not exist under Jest. The stub it leaves behind returns a
 * Response whose `status` is `undefined` and whose `text()` resolves to
 * `undefined`, so any code that fetches silently produced nothing and the
 * corresponding tests passed vacuously. Real network access in tests is restored
 * from Node's `http`/`https` modules (which are available in this environment)
 * so that the live-feed smoke test exercises the actual request path.
 */

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Ionicons: (props) => React.createElement(View, props),
    MaterialIcons: (props) => React.createElement(View, props),
    MaterialCommunityIcons: (props) => React.createElement(View, props),
    FontAwesome: (props) => React.createElement(View, props),
    Feather: (props) => React.createElement(View, props),
  };
});

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(async () => undefined),
  notificationAsync: jest.fn(async () => undefined),
  selectionAsync: jest.fn(async () => undefined),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  usePathname: () => '/',
  Link: 'Link',
}));

// Mock expo-linking.
// `parse` mirrors the real implementation's contract: it returns the
// scheme-relative path plus decoded query params, for both custom schemes and
// https URLs.
jest.mock('expo-linking', () => ({
  parse: jest.fn((url) => {
    const asString = String(url);
    const scheme = 'expo-linking-mock';
    let parsed;
    try {
      parsed = new URL(asString);
    } catch {
      return { hostname: null, path: asString, queryParams: {} };
    }
    const queryParams = {};
    parsed.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    // For `amardesh://host/path` the host segment belongs to the app, not the
    // route; the real parser reports it as `path` when there is no authority.
    const path = parsed.pathname.replace(/^\/+/, '') || null;
    return { scheme, hostname: parsed.hostname || null, path, queryParams };
  }),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  removeEventListener: jest.fn(),
  getInitialURL: jest.fn(async () => null),
  canOpenURL: jest.fn(async () => true),
  openURL: jest.fn(async () => undefined),
  openSettings: jest.fn(async () => undefined),
  createURL: jest.fn((path) => `amardesh://${path}`),
}));

// Mock expo-updates.
// `isEnabled: false` matches the placeholder app.json (updates disabled until
// the project is linked to EAS), which is the state the test suite exercises.
jest.mock('expo-updates', () => ({
  isEnabled: false,
  channel: 'development',
  checkForUpdateAsync: jest.fn(async () => ({ isAvailable: false })),
  fetchUpdateAsync: jest.fn(async () => undefined),
  reloadAsync: jest.fn(async () => undefined),
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(async () => true),
  hideAsync: jest.fn(async () => undefined),
  hide: jest.fn(),
  setOptions: jest.fn(),
}));

// Mock expo-navigation-bar
jest.mock('expo-navigation-bar', () => ({
  setStyle: jest.fn(),
  setHidden: jest.fn(),
  NavigationBar: 'NavigationBar',
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

/**
 * Replace the broken `expo/fetch` stub with a working fetch built on Node's
 * `http`/`https` modules.
 *
 * Kept as a real `response`-like object with `ok`, `status`, `statusText`,
 * `headers` and `text()`/`json()`, which is the surface the app's services use.
 * `jest.spyOn(global, 'fetch')` still works, so tests that need to simulate
 * failures or canned payloads keep working.
 */
const nodeHttp = require('http');
const nodeHttps = require('https');

function nodeFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    let parsed;
    try {
      parsed = new URL(String(url));
    } catch (error) {
      reject(new TypeError(`Invalid URL: ${String(url)}`));
      return;
    }

    const transport = parsed.protocol === 'https:' ? nodeHttps : nodeHttp;
    const method = (options.method || 'GET').toUpperCase();
    const body = options.body;

    const request = transport.request(
      {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port || undefined,
        path: `${parsed.pathname}${parsed.search}`,
        method,
        headers: options.headers || {},
      },
      (response) => {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          resolve({
            ok: response.statusCode >= 200 && response.statusCode < 300,
            status: response.statusCode,
            statusText: response.statusMessage || '',
            url: parsed.toString(),
            headers: {
              get: (name) => response.headers[String(name).toLowerCase()] ?? null,
            },
            text: async () => text,
            json: async () => JSON.parse(text),
          });
        });
      }
    );

    request.on('error', reject);

    if (options.signal && typeof options.signal.addEventListener === 'function') {
      options.signal.addEventListener('abort', () => {
        request.destroy(new Error('The operation was aborted'));
      });
    }

    if (body) request.write(body);
    request.end();
  });
}

global.fetch = nodeFetch;
// Marked so a test can assert it is exercising the real transport.
global.__DSH_REAL_FETCH__ = true;
