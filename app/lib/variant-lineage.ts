import { VARIANTS, type CharacterId, type Variant } from '../data/variants';
import { getAllJourneys, getJourneyChapters, getMovieById } from './journey';
import type { Journey } from '../types/journey';

export function getVariants(character: CharacterId, reality?: string) {
  return VARIANTS.filter(
    (variant) =>
      variant.character === character &&
      (!reality || variant.reality === reality),
  );
}

export function getVariantContext(variant: Variant, journey: Journey) {
  const movie = variant.movieId ? getMovieById(variant.movieId) : undefined;
  const included = movie !== undefined && journey.movieIds.includes(movie.id);
  const chapter = included
    ? getJourneyChapters(journey.id).find((entry) =>
        entry.movieIds.includes(movie.id),
      )
    : undefined;
  const otherJourneys =
    movie && !included
      ? getAllJourneys().filter((entry) => entry.movieIds.includes(movie.id))
      : [];
  return { movie, included, chapter, otherJourneys };
}

export function canReadVariant(
  variant: Variant,
  watchedIds: readonly string[],
  revealed: boolean,
) {
  return (
    revealed ||
    variant.medium === 'Cast announcement' ||
    (variant.movieId !== undefined && watchedIds.includes(variant.movieId))
  );
}
