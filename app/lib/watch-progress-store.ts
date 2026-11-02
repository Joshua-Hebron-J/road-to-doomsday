import { getJourneyMovies } from './journey';
import type { WatchState } from '../types/watch-state';

const PREFIX = 'rtd_journey_progress_';
const CHANGE_EVENT = 'rtd_watch_progress_changed';
const STORAGE_ERROR =
  'Local storage unavailable; progress retained in current session only.';
interface Snapshot extends WatchState {
  isLoaded: boolean;
  storageError: string | null;
}
const SERVER: Snapshot = {
  watchedIds: [],
  isLoaded: false,
  storageError: null,
};

/** One store per journey: stable snapshots, pure React updates, and no hydration writes. */
function createStore(journeyId: string) {
  const key = PREFIX + journeyId;
  const allowed = new Set(getJourneyMovies(journeyId).map((movie) => movie.id));
  const listeners = new Set<() => void>();
  let snapshot: Snapshot = { ...SERVER, isLoaded: true };
  let cachedRaw: string | null | undefined;
  let sessionOnly = false;

  function getSnapshot(): Snapshot {
    if (typeof window === 'undefined') return SERVER;
    if (sessionOnly) return snapshot;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === cachedRaw) return snapshot;
      cachedRaw = raw;
      let watchedIds: string[] = [];
      let lastWatchedId: string | undefined;
      try {
        const data = raw ? JSON.parse(raw) : null;
        if (
          data?.version === 1 &&
          data.journeyId === journeyId &&
          Array.isArray(data.watchedIds)
        ) {
          watchedIds = [
            ...new Set<string>(
              data.watchedIds.filter(
                (id: unknown): id is string =>
                  typeof id === 'string' && allowed.has(id),
              ),
            ),
          ];
          lastWatchedId = watchedIds.includes(data.lastWatchedId)
            ? data.lastWatchedId
            : watchedIds.at(-1);
        }
      } catch {
        /* Corrupt data is treated as empty and never written during hydration. */
      }
      snapshot = {
        watchedIds,
        lastWatchedId,
        isLoaded: true,
        storageError: null,
      };
    } catch {
      sessionOnly = true;
      snapshot = { ...snapshot, storageError: STORAGE_ERROR };
    }
    return snapshot;
  }

  function emit() {
    listeners.forEach((listener) => listener());
  }
  function subscribe(listener: () => void) {
    listeners.add(listener);
    const storage = (event: StorageEvent) => {
      if (
        (event.key === key || event.key === null) &&
        event.storageArea === window.localStorage
      ) {
        cachedRaw = undefined;
        if (!sessionOnly) getSnapshot();
        emit();
      }
    };
    const sameTab = (event: Event) => {
      if ((event as CustomEvent).detail?.journeyId === journeyId) emit();
    };
    window.addEventListener('storage', storage);
    window.addEventListener(CHANGE_EVENT, sameTab);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', storage);
      window.removeEventListener(CHANGE_EVENT, sameTab);
    };
  }

  function save(ids: string[], reset = false) {
    const watchedIds = [...new Set(ids.filter((id) => allowed.has(id)))];
    const lastWatchedId = watchedIds.at(-1);
    snapshot = {
      watchedIds,
      lastWatchedId,
      isLoaded: true,
      storageError: null,
    };
    try {
      const raw = reset
        ? null
        : JSON.stringify({
            version: 1,
            journeyId,
            watchedIds,
            lastWatchedId,
            updatedAt: Date.now(),
          });
      if (raw === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, raw);
      cachedRaw = raw;
      sessionOnly = false;
    } catch {
      sessionOnly = true;
      snapshot = { ...snapshot, storageError: STORAGE_ERROR };
    }
    emit();
    window.dispatchEvent(
      new CustomEvent(CHANGE_EVENT, { detail: { journeyId } }),
    );
  }
  return {
    getSnapshot,
    getServerSnapshot: () => SERVER,
    subscribe,
    toggleWatched(id: string) {
      if (!allowed.has(id)) return;
      const ids = getSnapshot().watchedIds;
      save(
        ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id],
      );
    },
    markWatched(id: string) {
      const ids = getSnapshot().watchedIds;
      if (allowed.has(id) && !ids.includes(id)) save([...ids, id]);
    },
    markUnwatched(id: string) {
      save(getSnapshot().watchedIds.filter((value) => value !== id));
    },
    markAllWatched() {
      save([...allowed]);
    },
    resetProgress() {
      save([], true);
    },
  };
}
const stores = new Map<string, ReturnType<typeof createStore>>();
export function getProgressStore(journeyId: string) {
  let store = stores.get(journeyId);
  if (!store) {
    store = createStore(journeyId);
    stores.set(journeyId, store);
  }
  return store;
}
