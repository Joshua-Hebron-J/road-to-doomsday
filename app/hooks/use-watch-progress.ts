"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  calculateJourneyProgress,
  getNextJourneyMovie,
  getJourneyMovies,
} from "../lib/journey";
import { Movie } from "../types/movie";

const STORAGE_PREFIX = "rtd_journey_progress_";
const CUSTOM_EVENT_NAME = "rtd_watch_progress_changed";

interface StoredJourneyProgress {
  version: number;
  journeyId: string;
  watchedIds: string[];
  lastWatchedId?: string;
  updatedAt: number;
}

/**
 * Safely parse stored data from localStorage with full schema and type validation.
 */
function safelyReadStoredProgress(journeyId: string): {
  watchedIds: string[];
  lastWatchedId?: string;
} {
  if (typeof window === "undefined") {
    return { watchedIds: [] };
  }

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${journeyId}`);
    if (!raw) {
      return { watchedIds: [] };
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return { watchedIds: [] };
    }

    // Ensure watchedIds is an array of non-empty strings
    const validIds = Array.isArray(parsed.watchedIds)
      ? parsed.watchedIds.filter(
          (id: unknown): id is string => typeof id === "string" && id.trim().length > 0
        )
      : [];

    const lastWatched =
      typeof parsed.lastWatchedId === "string" ? parsed.lastWatchedId : undefined;

    return {
      watchedIds: validIds,
      lastWatchedId: lastWatched,
    };
  } catch (err) {
    // Malformed JSON or blocked storage
    console.warn(`[JourneyEngine] Unable to read localStorage for "${journeyId}":`, err);
    return { watchedIds: [] };
  }
}

/**
 * Safely write progress to localStorage, handling quota errors and private browsing gracefully.
 */
function safelyWriteStoredProgress(
  journeyId: string,
  watchedIds: string[],
  lastWatchedId?: string
): boolean {
  if (typeof window === "undefined") return false;

  try {
    const payload: StoredJourneyProgress = {
      version: 1,
      journeyId,
      watchedIds,
      lastWatchedId,
      updatedAt: Date.now(),
    };
    localStorage.setItem(`${STORAGE_PREFIX}${journeyId}`, JSON.stringify(payload));

    // Notify other components on this window
    window.dispatchEvent(
      new CustomEvent(CUSTOM_EVENT_NAME, {
        detail: { journeyId, watchedIds },
      })
    );
    return true;
  } catch (err) {
    console.warn(`[JourneyEngine] Failed to write localStorage for "${journeyId}":`, err);
    return false;
  }
}

/**
 * Safely clear progress from localStorage for this specific journey.
 */
function safelyClearStoredProgress(journeyId: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${journeyId}`);
    window.dispatchEvent(
      new CustomEvent(CUSTOM_EVENT_NAME, {
        detail: { journeyId, watchedIds: [] },
      })
    );
    return true;
  } catch (err) {
    console.warn(`[JourneyEngine] Failed to clear localStorage for "${journeyId}":`, err);
    return false;
  }
}

export function useWatchProgress(journeyId: string) {
  const [watchedIds, setWatchedIds] = useState<string[]>([]);
  const [lastWatchedId, setLastWatchedId] = useState<string | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  // Load from localStorage on mount or when journeyId changes
  useEffect(() => {
    const loaded = safelyReadStoredProgress(journeyId);
    setWatchedIds(loaded.watchedIds);
    setLastWatchedId(loaded.lastWatchedId);
    setIsLoaded(true);
  }, [journeyId]);

  // Synchronize with external storage events (cross-tab and within-tab custom events)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `${STORAGE_PREFIX}${journeyId}`) {
        const loaded = safelyReadStoredProgress(journeyId);
        setWatchedIds(loaded.watchedIds);
        setLastWatchedId(loaded.lastWatchedId);
      }
    };

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ journeyId: string; watchedIds: string[] }>;
      if (customEvent.detail?.journeyId === journeyId) {
        const loaded = safelyReadStoredProgress(journeyId);
        setWatchedIds(loaded.watchedIds);
        setLastWatchedId(loaded.lastWatchedId);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(CUSTOM_EVENT_NAME, handleCustomChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(CUSTOM_EVENT_NAME, handleCustomChange);
    };
  }, [journeyId]);

  // Toggle watched status for an individual movie
  const toggleWatched = useCallback(
    (movieId: string) => {
      setWatchedIds((prev) => {
        const isCurrentlyWatched = prev.includes(movieId);
        let updated: string[];
        let newLastWatched: string | undefined;

        if (isCurrentlyWatched) {
          updated = prev.filter((id) => id !== movieId);
          newLastWatched = updated[updated.length - 1];
        } else {
          updated = [...prev, movieId];
          newLastWatched = movieId;
        }

        const success = safelyWriteStoredProgress(journeyId, updated, newLastWatched);
        if (!success) {
          setStorageError("Local storage unavailable; progress retained in current session only.");
        } else {
          setStorageError(null);
        }

        setLastWatchedId(newLastWatched);
        return updated;
      });
    },
    [journeyId]
  );

  // Explicit mark as watched
  const markWatched = useCallback(
    (movieId: string) => {
      setWatchedIds((prev) => {
        if (prev.includes(movieId)) return prev;
        const updated = [...prev, movieId];
        const success = safelyWriteStoredProgress(journeyId, updated, movieId);
        if (!success) {
          setStorageError("Local storage unavailable; progress retained in current session only.");
        }
        setLastWatchedId(movieId);
        return updated;
      });
    },
    [journeyId]
  );

  // Explicit mark as unwatched
  const markUnwatched = useCallback(
    (movieId: string) => {
      setWatchedIds((prev) => {
        if (!prev.includes(movieId)) return prev;
        const updated = prev.filter((id) => id !== movieId);
        const newLast = updated[updated.length - 1];
        safelyWriteStoredProgress(journeyId, updated, newLast);
        setLastWatchedId(newLast);
        return updated;
      });
    },
    [journeyId]
  );

  // Mark all entries in this journey as watched
  const markAllWatched = useCallback(() => {
    const journeyMovies = getJourneyMovies(journeyId);
    const allIds = journeyMovies.map((m) => m.id);
    const lastId = allIds[allIds.length - 1];
    setWatchedIds(allIds);
    setLastWatchedId(lastId);
    safelyWriteStoredProgress(journeyId, allIds, lastId);
  }, [journeyId]);

  // Reset progress ONLY for this journey
  const resetProgress = useCallback(() => {
    setWatchedIds([]);
    setLastWatchedId(undefined);
    safelyClearStoredProgress(journeyId);
  }, [journeyId]);

  // Check if a specific movie is watched in this journey
  const isWatched = useCallback(
    (movieId: string) => watchedIds.includes(movieId),
    [watchedIds]
  );

  // Computed metrics
  const progress = useMemo(
    () => calculateJourneyProgress(journeyId, watchedIds),
    [journeyId, watchedIds]
  );

  // Next eligible unwatched movie
  const nextMovie: Movie | undefined = useMemo(
    () => getNextJourneyMovie(journeyId, watchedIds),
    [journeyId, watchedIds]
  );

  return {
    journeyId,
    watchedIds,
    lastWatchedId,
    isLoaded,
    isWatched,
    toggleWatched,
    markWatched,
    markUnwatched,
    markAllWatched,
    resetProgress,
    progress,
    nextMovie,
    storageError,
  };
}
