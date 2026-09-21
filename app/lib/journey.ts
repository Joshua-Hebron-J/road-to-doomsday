import { movies } from "../data/movies";

export function getNextMovie(watchedIds: string[]) {
  return movies.find((movie) => !watchedIds.includes(movie.id));
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
