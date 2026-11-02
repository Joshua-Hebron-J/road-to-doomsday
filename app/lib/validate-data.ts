import { movies } from "../data/movies";
import { chapters } from "../data/chapters";
import { journeys } from "../data/journeys";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalMovies: number;
    totalChapters: number;
    totalJourneys: number;
    journeysValidated: {
      id: string;
      title: string;
      chaptersCount: number;
      moviesCount: number;
      runtimeFormatted: string;
    }[];
  };
}

export function validateDataIntegrity(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const movieIds = new Set<string>();
  const chapterIds = new Set<string>();
  const journeyIds = new Set<string>();

  // 1. Validate Movies
  for (const movie of movies) {
    if (!movie.id) {
      errors.push(`Movie has missing or empty id: ${JSON.stringify(movie)}`);
      continue;
    }

    if (movieIds.has(movie.id)) {
      errors.push(`Duplicate Movie ID detected: "${movie.id}"`);
    }
    movieIds.add(movie.id);

    if (!movie.title || movie.title.trim() === "") {
      errors.push(`Movie "${movie.id}" has an empty title`);
    }

    if (!movie.year || movie.year < 2000) {
      errors.push(`Movie "${movie.id}" has an invalid year: ${movie.year}`);
    }

    if (!movie.runtime || movie.runtime <= 0) {
      errors.push(`Movie "${movie.id}" has an invalid runtime: ${movie.runtime}`);
    }

    if (!movie.description || movie.description.trim() === "") {
      errors.push(`Movie "${movie.id}" has an empty description`);
    }

    if (!movie.whyItMatters || movie.whyItMatters.trim() === "") {
      errors.push(`Movie "${movie.id}" has an empty whyItMatters explanation`);
    }
  }

  // 1b. Validate Movie Prerequisites
  for (const movie of movies) {
    for (const prereqId of movie.prerequisites) {
      if (!movieIds.has(prereqId)) {
        errors.push(
          `Movie "${movie.id}" references unknown prerequisite ID: "${prereqId}"`
        );
      }
    }
  }

  // 2. Validate Chapters
  for (const chapter of chapters) {
    if (!chapter.id) {
      errors.push(`Chapter has missing or empty id: ${JSON.stringify(chapter)}`);
      continue;
    }

    if (chapterIds.has(chapter.id)) {
      errors.push(`Duplicate Chapter ID detected: "${chapter.id}"`);
    }
    chapterIds.add(chapter.id);

    if (!chapter.title || chapter.title.trim() === "") {
      errors.push(`Chapter "${chapter.id}" has an empty title`);
    }

    if (!chapter.movieIds || chapter.movieIds.length === 0) {
      errors.push(`Chapter "${chapter.id}" has no assigned movieIds`);
    } else {
      for (const movieId of chapter.movieIds) {
        if (!movieIds.has(movieId)) {
          errors.push(
            `Chapter "${chapter.id}" references non-existent movieId: "${movieId}"`
          );
        }
      }
    }
  }

  // 3. Validate Journeys
  const journeySummaries: ValidationResult["summary"]["journeysValidated"] = [];

  for (const journey of journeys) {
    if (!journey.id) {
      errors.push(`Journey has missing or empty id: ${JSON.stringify(journey)}`);
      continue;
    }

    if (journeyIds.has(journey.id)) {
      errors.push(`Duplicate Journey ID detected: "${journey.id}"`);
    }
    journeyIds.add(journey.id);

    if (!journey.title || journey.title.trim() === "") {
      errors.push(`Journey "${journey.id}" has an empty title`);
    }

    if (!journey.chapters || journey.chapters.length === 0) {
      errors.push(`Journey "${journey.id}" has no chapters defined`);
    }

    // Verify all chapters exist
    const aggregatedMovieIds: string[] = [];
    for (const chapterId of journey.chapters) {
      if (!chapterIds.has(chapterId)) {
        errors.push(
          `Journey "${journey.id}" references non-existent chapterId: "${chapterId}"`
        );
      } else {
        const chapter = chapters.find((c) => c.id === chapterId);
        if (chapter) {
          aggregatedMovieIds.push(...chapter.movieIds);
        }
      }
    }

    // Verify movieIds coherence between Journey.movieIds and Chapter.movieIds
    if (journey.movieIds.length !== aggregatedMovieIds.length) {
      errors.push(
        `Journey "${journey.id}" movieIds length (${journey.movieIds.length}) does not match sum of chapter movieIds (${aggregatedMovieIds.length})`
      );
    } else {
      for (let i = 0; i < journey.movieIds.length; i++) {
        if (journey.movieIds[i] !== aggregatedMovieIds[i]) {
          errors.push(
            `Journey "${journey.id}" sequence mismatch at index ${i}: expected "${aggregatedMovieIds[i]}", received "${journey.movieIds[i]}"`
          );
        }
      }
    }

    // Calculate runtime
    let totalMinutes = 0;
    for (const mId of journey.movieIds) {
      const movie = movies.find((m) => m.id === mId);
      if (movie) totalMinutes += movie.runtime;
    }
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    journeySummaries.push({
      id: journey.id,
      title: journey.title,
      chaptersCount: journey.chapters.length,
      moviesCount: journey.movieIds.length,
      runtimeFormatted: `${h}h ${m}m`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: {
      totalMovies: movies.length,
      totalChapters: chapters.length,
      totalJourneys: journeys.length,
      journeysValidated: journeySummaries,
    },
  };
}
