'use client';

import { useState } from 'react';
import type { Chapter } from '../types/chapter';
import type { Journey } from '../types/journey';
import { getChapterMovies, getMovieById } from '../lib/journey';
import { SceneExplorer } from './scene-explorer';

export function ChapterAtlas({
  journey,
  chapters,
  spoilerShield,
  isWatched,
  isLoaded,
  onToggleWatched,
  onOpenChapter,
  onOpenDossier,
  suspended,
}: {
  journey: Journey;
  chapters: Chapter[];
  spoilerShield: boolean;
  isWatched: (id: string) => boolean;
  isLoaded: boolean;
  onToggleWatched: (id: string) => void;
  onOpenChapter: (id: string) => void;
  onOpenDossier: (id: string) => void;
  suspended: boolean;
}) {
  const [chapterId, setChapterId] = useState(chapters[0].id);
  const [movieId, setMovieId] = useState('');
  const [moviesMode, setMoviesMode] = useState(false);
  const current =
    chapters.find((chapter) => chapter.id === chapterId) ?? chapters[0];
  const movies = getChapterMovies(current.id).filter((movie) =>
    journey.movieIds.includes(movie.id),
  );
  const movie = movies.find((item) => item.id === movieId) ?? movies[0];
  const color =
    journey.accent === 'gold'
      ? '#facc15'
      : journey.accent === 'silver'
        ? '#cbd5e1'
        : '#34d399';
  const chapterNodes = chapters.map((chapter, index) => {
    const queue = getChapterMovies(chapter.id).filter((item) =>
      journey.movieIds.includes(item.id),
    );
    const watched = queue.filter((item) => isWatched(item.id)).length;
    const complete = watched === queue.length && queue.length > 0;
    const minutes = queue
      .filter((item) => !isWatched(item.id))
      .reduce((sum, item) => sum + item.runtime, 0);
    return {
      id: chapter.id,
      label:
        spoilerShield && !complete
          ? `Chapter ${index + 1} · Briefing protected`
          : chapter.title,
      caption: `${watched}/${queue.length} watched · ${minutes}m remaining`,
      color,
      complete,
    };
  });
  const movieNodes = movies.map((item) => ({
    id: item.id,
    label: item.title,
    caption: `${item.year} · ${item.runtime}m · ${isWatched(item.id) ? 'Watched' : 'Unwatched'}`,
    complete: isWatched(item.id),
    color,
  }));
  const nodes = moviesMode ? movieNodes : chapterNodes;
  const missing = movie.prerequisites.filter((id) => !isWatched(id));
  return (
    <SceneExplorer
      title={moviesMode ? 'Inside the chapter' : 'Your chapter constellation'}
      nodes={nodes}
      selectedId={moviesMode ? movie.id : chapterId}
      onSelect={moviesMode ? setMovieId : setChapterId}
      variant={moviesMode ? 'movies' : 'chapters'}
      suspended={suspended}
    >
      <p className="text-sm text-slate-300 leading-relaxed">
        {moviesMode
          ? !spoilerShield || isWatched(movie.id)
            ? movie.description
            : 'This movie’s synopsis is protected until watched. Your watch controls and chapter queue remain available.'
          : !spoilerShield ||
              chapterNodes.find((node) => node.id === current.id)?.complete
            ? current.description
            : 'Explore the chapter’s movie portals to plan what to watch next. Narrative briefing unlocks when the chapter is complete.'}
      </p>
      {moviesMode && missing.length > 0 && (
        <p className="text-xs text-amber-200 leading-relaxed">
          Recommended context still unwatched in this pathway:{' '}
          {missing.map((id) => getMovieById(id)?.title ?? id).join(', ')}. Open
          the selected chapter queue to review prerequisite context.
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            if (!moviesMode)
              setMovieId(
                (movies.find((item) => !isWatched(item.id)) ?? movies[0]).id,
              );
            setMoviesMode((value) => !value);
          }}
          className="min-h-11 px-4 rounded border border-emerald-500/40 text-sm text-emerald-200 bg-emerald-950/40 focus-ring-doom"
        >
          {moviesMode ? 'Back to chapters' : 'Explore chapter movies'}
        </button>
        {moviesMode && (
          <button
            type="button"
            onClick={() => onOpenDossier(movie.id)}
            aria-haspopup="dialog"
            className="min-h-11 px-4 rounded border border-white/15 text-sm text-emerald-200 focus-ring-doom"
          >
            Open movie dossier
          </button>
        )}
        {moviesMode && (
          <button
            type="button"
            disabled={!isLoaded}
            onClick={() => onToggleWatched(movie.id)}
            className="min-h-11 px-4 rounded border border-white/20 text-sm text-slate-100 focus-ring-doom disabled:opacity-50"
          >
            Mark {movie.title} {isWatched(movie.id) ? 'unwatched' : 'watched'}
          </button>
        )}
        <button
          type="button"
          onClick={() => onOpenChapter(chapterId)}
          className="min-h-11 px-4 rounded border border-white/15 text-sm text-slate-200 focus-ring-doom"
        >
          Open selected chapter queue
        </button>
      </div>
    </SceneExplorer>
  );
}
