import {
  calculateJourneyProgress,
  getJourneyById,
  getJourneyChapters,
  getJourneyMovies,
} from './journey';

export const posterColors = {
  emerald: '#6ee7b7',
  gold: '#fcd34d',
  violet: '#c4b5fd',
} as const;
export type PosterColor = keyof typeof posterColors;

export function createShareSnapshot(
  journeyId: string,
  watchedIds: readonly string[],
) {
  const journey = getJourneyById(journeyId);
  if (!journey) throw new Error('Choose an existing journey.');
  const movies = getJourneyMovies(journeyId);
  const watched = new Set(watchedIds);
  const validWatched = movies
    .filter((movie) => watched.has(movie.id))
    .map((movie) => movie.id);
  return {
    journey,
    movies,
    watchedIds: validWatched,
    progress: calculateJourneyProgress(journeyId, validWatched),
  };
}

export type ShareSnapshot = ReturnType<typeof createShareSnapshot>;

export function posterText(
  snapshot: ShareSnapshot,
  name: string,
  includeProgress: boolean,
  certificate: boolean,
) {
  if (certificate && !snapshot.progress.isComplete) {
    throw new Error('Complete this journey to create its certificate.');
  }
  const displayName = Array.from(
    name.replace(/[\u0000-\u001f\u007f]/g, ' ').trim(),
  )
    .slice(0, 40)
    .join('');
  return {
    heading: certificate ? 'JOURNEY COMPLETE' : 'MY ROAD TO DOOMSDAY',
    journey: snapshot.journey.title,
    name: displayName || 'Every story led here.',
    detail:
      certificate || includeProgress
        ? snapshot.progress.completedCount +
          ' / ' +
          snapshot.progress.totalCount +
          ' titles watched'
        : snapshot.movies.length +
          ' stories · ' +
          snapshot.progress.formattedTotalRuntime,
    footer: certificate
      ? 'Self-reported viewing milestone · Unofficial fan archive'
      : 'Unofficial Marvel fan archive',
  };
}

export function createItinerary(
  snapshot: ShareSnapshot,
  includeProgress: boolean,
) {
  const lines = [
    'THE ROAD TO DOOMSDAY',
    'Every story led here.',
    snapshot.journey.title,
    'Unofficial fan-curated viewing itinerary',
    'Total runtime: ' + snapshot.progress.formattedTotalRuntime,
    ...(includeProgress
      ? [
          'Watched: ' +
            snapshot.progress.completedCount +
            ' / ' +
            snapshot.progress.totalCount,
        ]
      : []),
    '',
  ];
  for (const chapter of getJourneyChapters(snapshot.journey.id)) {
    lines.push(chapter.title);
    for (const id of chapter.movieIds) {
      const movie = snapshot.movies.find((entry) => entry.id === id);
      if (!movie) continue;
      const status = includeProgress
        ? snapshot.watchedIds.includes(id)
          ? '[watched] '
          : '[to watch] '
        : '';
      lines.push(
        status +
          movie.title +
          ' (' +
          movie.year +
          ') · ' +
          movie.runtime +
          ' min',
      );
    }
    lines.push('');
  }
  return lines.join('\n');
}
