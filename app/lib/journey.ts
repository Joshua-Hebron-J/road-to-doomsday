import { Movie } from "../types/movie";
import { Chapter } from "../types/chapter";
import { Journey } from "../types/journey";
import { movies } from "../data/movies";
import { chapters } from "../data/chapters";
import { journeys } from "../data/journeys";

export function getAllJourneys(): Journey[] {
  return journeys;
}

export function getJourneyById(id: string): Journey | undefined {
  return journeys.find((journey) => journey.id === id);
}

export function getAllMovies(): Movie[] {
  return movies;
}

export function getMovieById(id: string): Movie | undefined {
  return movies.find((movie) => movie.id === id);
}

export function getAllChapters(): Chapter[] {
  return chapters;
}

export function getChapterById(id: string): Chapter | undefined {
  return chapters.find((chapter) => chapter.id === id);
}

export function getJourneyChapters(journeyId: string): Chapter[] {
  const journey = getJourneyById(journeyId);
  if (!journey) return [];
  return journey.chapters
    .map((chapterId) => getChapterById(chapterId))
    .filter((ch): ch is Chapter => Boolean(ch));
}

export function getJourneyMovies(journeyId: string): Movie[] {
  const journey = getJourneyById(journeyId);
  if (!journey) return [];
  return journey.movieIds
    .map((movieId) => getMovieById(movieId))
    .filter((m): m is Movie => Boolean(m));
}

export function getChapterMovies(chapterId: string): Movie[] {
  const chapter = getChapterById(chapterId);
  if (!chapter) return [];
  return chapter.movieIds
    .map((movieId) => getMovieById(movieId))
    .filter((m): m is Movie => Boolean(m));
}

export function calculateJourneyStats(journeyId: string) {
  const journeyMovies = getJourneyMovies(journeyId);
  const journey = getJourneyById(journeyId);

  const totalCount = journeyMovies.length;
  const essentialCount = journeyMovies.filter(
    (m) => m.importance === "essential"
  ).length;
  const optionalCount = totalCount - essentialCount;

  const movieCount = journeyMovies.filter((m) => m.type === "movie").length;
  const seriesCount = journeyMovies.filter((m) => m.type === "series").length;
  const specialCount = journeyMovies.filter((m) => m.type === "special").length;

  const totalRuntimeMinutes = journeyMovies.reduce(
    (sum, m) => sum + m.runtime,
    0
  );

  const hours = Math.floor(totalRuntimeMinutes / 60);
  const minutes = totalRuntimeMinutes % 60;
  const formattedRuntime = `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`.trim();

  return {
    totalCount,
    essentialCount,
    optionalCount,
    movieCount,
    seriesCount,
    specialCount,
    chaptersCount: journey?.chapters.length || 0,
    totalRuntimeMinutes,
    formattedRuntime,
  };
}

export function getNextMovie(watchedIds: string[]) {
  return movies.find((movie) => !watchedIds.includes(movie.id));
}

export function isMoviePrerequisitesMet(movie: Movie, watchedIds: string[]) {
  if (!movie.prerequisites || movie.prerequisites.length === 0) {
    return { met: true, missing: [] };
  }
  const missing = movie.prerequisites.filter((id) => !watchedIds.includes(id));
  return {
    met: missing.length === 0,
    missing,
  };
}

export function getNextJourneyMovie(
  journeyId: string,
  watchedIds: string[]
): Movie | undefined {
  const journeyMovies = getJourneyMovies(journeyId);
  const unwatched = journeyMovies.filter((m) => !watchedIds.includes(m.id));
  if (unwatched.length === 0) return undefined;

  // First priority: sequence-first movie whose prerequisites are fully met
  const eligible = unwatched.find((m) => {
    const { met } = isMoviePrerequisitesMet(m, watchedIds);
    return met;
  });

  return eligible || unwatched[0];
}

export function calculateJourneyProgress(
  journeyId: string,
  watchedIds: string[]
) {
  const journeyMovies = getJourneyMovies(journeyId);
  const totalCount = journeyMovies.length;

  // Only count watched movies that belong to this journey
  const watchedMovies = journeyMovies.filter((m) => watchedIds.includes(m.id));
  const completedCount = watchedMovies.length;
  const remainingCount = totalCount - completedCount;

  const totalRuntimeMinutes = journeyMovies.reduce(
    (sum, m) => sum + m.runtime,
    0
  );
  const watchedRuntimeMinutes = watchedMovies.reduce(
    (sum, m) => sum + m.runtime,
    0
  );
  const remainingRuntimeMinutes = Math.max(
    0,
    totalRuntimeMinutes - watchedRuntimeMinutes
  );

  const formatMinutes = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0 && m === 0) return "0m";
    return `${h}h ${m > 0 ? `${m}m` : ""}`.trim();
  };

  const percentage =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const essentialMovies = journeyMovies.filter(
    (m) => m.importance === "essential"
  );
  const essentialTotal = essentialMovies.length;
  const essentialCompleted = essentialMovies.filter((m) =>
    watchedIds.includes(m.id)
  ).length;

  return {
    journeyId,
    completedCount,
    totalCount,
    remainingCount,
    progressPercentage: percentage,
    totalRuntimeMinutes,
    watchedRuntimeMinutes,
    remainingRuntimeMinutes,
    formattedTotalRuntime: formatMinutes(totalRuntimeMinutes),
    formattedWatchedRuntime: formatMinutes(watchedRuntimeMinutes),
    formattedRemainingRuntime: formatMinutes(remainingRuntimeMinutes),
    essentialTotal,
    essentialCompleted,
    isComplete: totalCount > 0 && completedCount === totalCount,
  };
}

export function calculateProgress(watchedIds: string[]) {
  const total = movies.length;
  const completed = watchedIds.filter((id) =>
    movies.some((movie) => movie.id === id)
  ).length;

  return {
    completed,
    total,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}
