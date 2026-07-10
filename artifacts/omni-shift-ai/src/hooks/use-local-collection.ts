import { useCallback, useEffect, useState } from 'react';

/**
 * Generic localStorage-backed collection of string ids (tool slugs).
 * Used for both Favorites and Bookmarks — same mechanics, different storage key.
 * Dispatches a same-window custom event on change so every component using the
 * same key stays in sync without needing a shared context provider.
 */
function readCollection(key: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

// Per-key in-memory cache shared by every hook instance in this tab, so a
// toggle in one component is reflected instantly everywhere else — including
// components that mount after the write — without waiting for a storage/custom
// event round-trip. This also serializes writes to the same key: every
// mutation reads from this cache (not straight from localStorage), so two
// near-simultaneous toggles from different components never clobber each
// other with a stale read-modify-write against disk.
const memoryCache = new Map<string, string[]>();

function getCurrent(key: string): string[] {
  if (!memoryCache.has(key)) {
    memoryCache.set(key, readCollection(key));
  }
  return memoryCache.get(key)!;
}

function writeCollection(key: string, ids: string[]) {
  memoryCache.set(key, ids);
  window.localStorage.setItem(key, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(`local-collection:${key}`));
}

export function useLocalCollection(key: string) {
  const [ids, setIds] = useState<string[]>(() => getCurrent(key));

  useEffect(() => {
    // Same-tab writes go through `writeCollection`, which already keeps
    // `memoryCache` current — just read it back.
    const syncFromCache = () => setIds(getCurrent(key));
    // Cross-tab writes bypass this tab's memory cache entirely, so the
    // `storage` event must force a fresh read from disk and refresh the
    // cache before syncing state, or updates from other tabs are ignored.
    const syncFromDisk = () => {
      const fresh = readCollection(key);
      memoryCache.set(key, fresh);
      setIds(fresh);
    };
    // Re-sync on mount in case another tab/component wrote to this key
    // between this component's initial state and now.
    syncFromDisk();
    window.addEventListener(`local-collection:${key}`, syncFromCache);
    window.addEventListener('storage', syncFromDisk);
    return () => {
      window.removeEventListener(`local-collection:${key}`, syncFromCache);
      window.removeEventListener('storage', syncFromDisk);
    };
  }, [key]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (id: string) => {
      const current = getCurrent(key);
      const next = current.includes(id)
        ? current.filter((v) => v !== id)
        : [...current, id];
      writeCollection(key, next);
    },
    [key],
  );

  const remove = useCallback(
    (id: string) => {
      const current = getCurrent(key);
      writeCollection(key, current.filter((v) => v !== id));
    },
    [key],
  );

  return { ids, has, toggle, remove };
}

export function useFavorites() {
  return useLocalCollection('omnishift-favorites');
}

export function useBookmarks() {
  return useLocalCollection('omnishift-bookmarks');
}
