import { getAllJourneys, getJourneyById, getJourneyMovies } from './journey';
import { getProgressStore } from './watch-progress-store';

export const MAX_BACKUP_BYTES = 64 * 1024;
const FORMAT = 'road-to-doomsday/watch-progress';

type BackupJourney = { journeyId: string; watchedIds: string[] };
export interface WatchBackup {
  format: typeof FORMAT;
  version: 1;
  journeys: BackupJourney[];
}

export function createWatchBackup(): WatchBackup {
  return {
    format: FORMAT,
    version: 1,
    journeys: getAllJourneys().map(({ id }) => ({
      journeyId: id,
      watchedIds: [...getProgressStore(id).getSnapshot().watchedIds],
    })),
  };
}

export function parseWatchBackup(text: string): WatchBackup {
  if (new TextEncoder().encode(text).length > MAX_BACKUP_BYTES) {
    throw new Error('This backup exceeds the 64 KB limit.');
  }
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('This file is not valid JSON.');
  }
  if (
    !data ||
    typeof data !== 'object' ||
    !('format' in data) ||
    data.format !== FORMAT ||
    !('version' in data) ||
    data.version !== 1 ||
    !('journeys' in data) ||
    !Array.isArray(data.journeys) ||
    data.journeys.length === 0 ||
    data.journeys.length > getAllJourneys().length
  ) {
    throw new Error('Choose a supported Road to Doomsday progress backup.');
  }
  const seen = new Set<string>();
  const journeys = data.journeys.map((entry: unknown): BackupJourney => {
    if (
      !entry ||
      typeof entry !== 'object' ||
      !('journeyId' in entry) ||
      typeof entry.journeyId !== 'string' ||
      !('watchedIds' in entry) ||
      !Array.isArray(entry.watchedIds)
    ) {
      throw new Error('A journey record is invalid.');
    }
    const journey = getJourneyById(entry.journeyId);
    if (!journey || seen.has(journey.id)) {
      throw new Error('The backup contains an unknown or repeated journey.');
    }
    seen.add(journey.id);
    const allowed = new Set(getJourneyMovies(journey.id).map(({ id }) => id));
    const watchedIds = entry.watchedIds.map((id: unknown): string => {
      if (typeof id !== 'string' || !allowed.has(id)) {
        throw new Error('The backup contains a title outside its journey.');
      }
      return id;
    });
    return { journeyId: journey.id, watchedIds: [...new Set(watchedIds)] };
  });
  return { format: FORMAT, version: 1, journeys };
}

export function mergeWatchBackup(backup: WatchBackup) {
  return backup.journeys.map(({ journeyId, watchedIds }) => ({
    journeyId,
    snapshot: getProgressStore(journeyId).mergeWatched(watchedIds),
  }));
}
