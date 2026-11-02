'use client';

import { useState } from 'react';
import { events } from '../data/events';
import { getMovieById, getAllJourneys } from '../lib/journey';
import { SceneExplorer } from './scene-explorer';
import { Button } from './ui/button';

export function SpatialTimeline({
  reveal,
  onReveal,
}: {
  reveal: boolean;
  onReveal: () => void;
}) {
  const [selectedId, setSelectedId] = useState(events[0].id);
  const selected = events.find((event) => event.id === selectedId) ?? events[0];
  const movie = selected.relatedMovieId
    ? getMovieById(selected.relatedMovieId)
    : undefined;
  const journey = getAllJourneys().find(
    (item) => movie && item.movieIds.includes(movie.id),
  );
  const nodes = events.map((event, index) => {
    const title = event.relatedMovieId
      ? getMovieById(event.relatedMovieId)
      : undefined;
    return {
      id: event.id,
      label: reveal
        ? event.title
        : `Nexus ${String(index + 1).padStart(2, '0')} · ${title?.title ?? 'Convergence'}`,
      caption: reveal
        ? event.date
        : `${title?.year ?? 'Archive'} · ${title?.runtime ?? 0}m · Story details protected`,
      color: event.special ? '#facc15' : '#34d399',
    };
  });
  return (
    <div className="mb-16">
      <SceneExplorer
        title="The multiverse in motion"
        nodes={nodes}
        selectedId={selectedId}
        onSelect={setSelectedId}
        variant="timeline"
      >
        <p className="text-sm text-slate-300 leading-relaxed">
          {reveal
            ? selected.description
            : 'Move between connected nexus points to plan your journey. Reveal narrative details only when you are ready for story spoilers.'}
        </p>
        {reveal && (
          <p className="text-xs text-amber-200">
            Narrative connections reflect the existing fan archive’s editorial
            interpretation.
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-pressed={reveal}
            onClick={onReveal}
            className="min-h-11 px-3 rounded border border-white/15 text-xs text-slate-200 focus-ring-doom"
          >
            {reveal ? 'Hide timeline spoilers' : 'Reveal timeline spoilers'}
          </button>
          {journey && (
            <Button
              href={`/pathways/${journey.id}`}
              variant="secondary"
              size="sm"
            >
              Watch in {journey.title} →
            </Button>
          )}
        </div>
      </SceneExplorer>
    </div>
  );
}
