'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { calculateJourneyProgress, getNextJourneyMovie } from '../lib/journey';
import { getProgressStore } from '../lib/watch-progress-store';

export function useWatchProgress(journeyId: string) {
  const store = useMemo(() => getProgressStore(journeyId), [journeyId]);
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  const isWatched = useCallback(
    (id: string) => state.watchedIds.includes(id),
    [state.watchedIds],
  );
  return {
    journeyId,
    ...state,
    isWatched,
    toggleWatched: store.toggleWatched,
    markWatched: store.markWatched,
    markUnwatched: store.markUnwatched,
    markAllWatched: store.markAllWatched,
    resetProgress: store.resetProgress,
    progress: useMemo(
      () => calculateJourneyProgress(journeyId, state.watchedIds),
      [journeyId, state.watchedIds],
    ),
    nextMovie: useMemo(
      () => getNextJourneyMovie(journeyId, state.watchedIds),
      [journeyId, state.watchedIds],
    ),
  };
}
