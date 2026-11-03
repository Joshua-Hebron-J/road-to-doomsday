import {
  DEFAULT_TIMELINE,
  normalizeTimelinePreferences,
  type TimelinePreferences,
} from './chronology';
export const TIMELINE_KEY = 'rtd_timeline_preferences_v1';
const listeners = new Set<() => void>();
const SERVER = { preferences: DEFAULT_TIMELINE, error: null as string | null };
let snapshot = SERVER;
let cachedRaw: string | null | undefined;
let sessionOnly = false;
const notify = () => listeners.forEach((listener) => listener());
export function getTimelineSnapshot() {
  if (typeof window === 'undefined') return SERVER;
  if (sessionOnly) return snapshot;
  try {
    const raw = window.localStorage.getItem(TIMELINE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      let parsed: unknown;
      try {
        parsed = raw ? JSON.parse(raw) : undefined;
      } catch {
        /* Invalid preferences never trigger hydration writes. */
      }
      snapshot = {
        preferences: normalizeTimelinePreferences(parsed),
        error: null,
      };
    }
  } catch {
    sessionOnly = true;
    snapshot = {
      ...snapshot,
      error: 'Timeline preferences are retained in this session only.',
    };
  }
  return snapshot;
}
export const getTimelineServerSnapshot = () => SERVER;
export function subscribeTimeline(listener: () => void) {
  listeners.add(listener);
  const changed = (event: StorageEvent) => {
    if (event.key === TIMELINE_KEY || event.key === null) {
      getTimelineSnapshot();
      notify();
    }
  };
  window.addEventListener('storage', changed);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', changed);
  };
}
export function updateTimeline(patch: Partial<TimelinePreferences>) {
  const current = getTimelineSnapshot();
  const preferences = normalizeTimelinePreferences({
    ...current.preferences,
    ...patch,
  });
  snapshot = { ...current, preferences };
  try {
    if (!sessionOnly) {
      const raw = JSON.stringify(preferences);
      window.localStorage.setItem(TIMELINE_KEY, raw);
      cachedRaw = raw;
    }
  } catch {
    sessionOnly = true;
    snapshot = {
      preferences,
      error: 'Timeline preferences are retained in this session only.',
    };
  }
  notify();
}
