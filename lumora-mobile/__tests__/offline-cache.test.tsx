// Unit coverage for the offline-cache module and apiFetchCached itself —
// the screen tests all mock apiFetchCached away, so this is the only place
// its real read-through-cache logic actually runs.
//
// Mocks globalThis.fetch rather than the '@/lib/api' module: apiFetchCached
// calls its sibling apiFetch via a same-module reference, which a
// `{...jest.requireActual(...), apiFetch: jest.fn()}` partial mock cannot
// intercept (the internal call is bound to the module's own local
// binding, not the exported one being overridden) — confirmed the hard
// way while writing the screen tests. Mocking fetch itself, the true
// network boundary, sidesteps that entirely and lets both real functions run.
import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiFetchCached } from '@/lib/api';
import { cacheGet, cacheSet } from '@/lib/offline-cache';

function jsonResponse(status: number, body: unknown) {
  return Promise.resolve({
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
  });
}

beforeEach(async () => {
  await AsyncStorage.clear();
  globalThis.fetch = jest.fn();
});

test('cacheGet returns null for a key that was never set', async () => {
  expect(await cacheGet('missing')).toBeNull();
});

test('cacheSet then cacheGet round-trips a value', async () => {
  await cacheSet('subjects', [{ id: 1, name: 'Mathematics' }]);

  expect(await cacheGet('subjects')).toEqual([{ id: 1, name: 'Mathematics' }]);
});

test('cacheGet returns null instead of throwing on corrupt stored JSON', async () => {
  await AsyncStorage.setItem('lumora_cache_broken', '{not valid json');

  expect(await cacheGet('broken')).toBeNull();
});

test('apiFetchCached caches a successful response and returns stale: false', async () => {
  (globalThis.fetch as jest.Mock).mockReturnValueOnce(
    jsonResponse(200, { data: [{ id: 1, name: 'Mathematics' }] }),
  );

  const result = await apiFetchCached('/api/v1/subjects', 'subjects-test');

  expect(result).toEqual({ data: { data: [{ id: 1, name: 'Mathematics' }] }, stale: false });
  expect(await cacheGet('subjects-test')).toEqual({ data: [{ id: 1, name: 'Mathematics' }] });
});

test('apiFetchCached falls back to a cached value with stale: true when the real fetch fails', async () => {
  await cacheSet('subjects-test-2', { data: [{ id: 1, name: 'Mathematics' }] });
  (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('network down'));

  const result = await apiFetchCached('/api/v1/subjects', 'subjects-test-2');

  expect(result).toEqual({ data: { data: [{ id: 1, name: 'Mathematics' }] }, stale: true });
});

test('apiFetchCached rethrows the original error when the fetch fails and nothing is cached', async () => {
  (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('network down'));

  await expect(apiFetchCached('/api/v1/subjects', 'subjects-test-3')).rejects.toThrow(
    'network down',
  );
});
