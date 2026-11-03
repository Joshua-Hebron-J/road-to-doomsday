'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useReducedMotion } from 'motion/react';
import {
  getAllJourneys,
  getJourneyById,
  getJourneyChapters,
} from '../lib/journey';
import {
  clampTimelineIndex,
  getChronology,
  getChronologyScene,
  type TimelineMode,
} from '../lib/chronology';
import {
  getTimelineSnapshot,
  getTimelineServerSnapshot,
  subscribeTimeline,
  updateTimeline,
} from '../lib/timeline-preferences-store';
import { useWatchProgress } from '../hooks/use-watch-progress';
import { SceneExplorer } from './scene-explorer';
import { Button } from './ui/button';
const MovieDossier = dynamic(() => import('./movie-dossier'), { ssr: false });
const control =
  'min-h-11 rounded-lg border border-white/20 bg-slate-950 px-3 text-sm text-slate-100 focus-ring-doom';
export function SpatialTimeline({
  reveal,
  onReveal,
}: {
  reveal: boolean;
  onReveal: () => void;
}) {
  const { preferences, error } = useSyncExternalStore(
    subscribeTimeline,
    getTimelineSnapshot,
    getTimelineServerSnapshot,
  );
  const { mode, journeyId, chapterId } = preferences;
  const journey = getJourneyById(journeyId)!;
  const chapters = getJourneyChapters(journeyId);
  const watch = useWatchProgress(journeyId);
  const entries = getChronology(mode, journeyId, chapterId);
  const index = Math.max(
    0,
    entries.findIndex((e) => e.event.id === preferences.selectedId),
  );
  const selected = entries[index];
  const scene = getChronologyScene(entries, mode, reveal, watch.isWatched);
  const [dossierId, setDossierId] = useState<string | null>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const scrollOnSelect = useRef(false);
  const reduceMotion = useReducedMotion();
  function select(id: string) {
    scrollOnSelect.current = true;
    updateTimeline({ selectedId: id });
  }
  useEffect(() => {
    if (!scrollOnSelect.current) return;
    scrollOnSelect.current = false;
    const element = rail.current?.querySelector<HTMLButtonElement>(
      '[aria-pressed="true"]',
    );
    if (element && rail.current)
      rail.current.scrollTo({
        left:
          element.offsetLeft -
          rail.current.clientWidth / 2 +
          element.offsetWidth / 2,
        behavior: reduceMotion ? 'instant' : 'smooth',
      });
  }, [preferences, reduceMotion]);
  function changeMode(next: TimelineMode) {
    updateTimeline({
      mode: next,
      selectedId: selected?.event.id ?? preferences.selectedId,
    });
  }
  const readable = selected && (reveal || watch.isWatched(selected.movie.id));
  return (
    <div className="mb-16 space-y-5">
      <div className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 p-4 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-emerald-300">
              Temporal navigation / 06 nexus records
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              Trace the road through time
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Explore the existing six-event archive. Story chronology uses
              editorial placements; outside-time and undated records occupy
              separate lanes.
            </p>
          </div>
          <div
            role="group"
            aria-label="Timeline date mode"
            className="flex flex-wrap gap-2"
          >
            {(['story', 'release'] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={mode === value}
                onClick={() => changeMode(value)}
                className={`${control} ${mode === value ? 'border-emerald-400 text-emerald-200' : ''}`}
              >
                {value === 'story' ? 'Story chronology' : 'Release dates'}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2 text-xs text-slate-300">
            Journey context
            <select
              className={`${control} w-full min-w-0`}
              value={journeyId}
              onChange={(e) =>
                updateTimeline({ journeyId: e.target.value, chapterId: 'all' })
              }
            >
              {getAllJourneys().map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-xs text-slate-300">
            Chapter filter
            <select
              className={`${control} w-full min-w-0`}
              value={chapterId}
              onChange={(e) => updateTimeline({ chapterId: e.target.value })}
            >
              <option value="all">All chapters</option>
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="text-xs text-slate-400">
          {watch.isLoaded
            ? `${watch.progress.completedCount} / ${watch.progress.totalCount} watched in ${journey.title}`
            : 'Loading journey progress…'}{' '}
          · Timeline position and filters saved on this device.
        </p>
        {(error || watch.storageError) && (
          <p role="status" className="text-sm text-amber-200">
            {error || watch.storageError}
          </p>
        )}
        {selected ? (
          <>
            <div
              className="relative flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3"
              ref={rail}
              role="group"
              aria-label="Horizontal timeline records"
            >
              {entries.map((entry, i) => (
                <button
                  type="button"
                  key={entry.event.id}
                  aria-pressed={i === index}
                  onClick={() => select(entry.event.id)}
                  className={`shrink-0 w-60 snap-center text-left rounded-xl border p-4 focus-ring-doom ${i === index ? 'border-emerald-300 bg-emerald-950/50' : 'border-white/10 bg-white/[0.03]'}`}
                >
                  <span className="block text-[10px] uppercase tracking-widest text-emerald-300">
                    {mode === 'story' ? entry.domain : 'US release'}{' '}
                    {watch.isWatched(entry.movie.id) ? ' · Watched' : ''}
                  </span>
                  <span className="block mt-2 text-sm font-medium text-white">
                    {entry.movie.title}
                  </span>
                  <span className="block mt-2 text-xs text-slate-400">
                    {mode === 'release' ||
                    reveal ||
                    watch.isWatched(entry.movie.id)
                      ? entry.dateLabel
                      : 'Story date shielded'}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className={control}
                disabled={index === 0}
                onClick={() => select(entries[index - 1].event.id)}
                aria-label="Previous timeline event"
              >
                ←
              </button>
              <label className="flex-1 min-w-0 text-xs text-slate-300">
                Timeline scrubber
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, entries.length - 1)}
                  step={1}
                  value={index}
                  disabled={entries.length < 2}
                  aria-label="Timeline scrubber"
                  aria-valuetext={`${index + 1} of ${entries.length}: ${selected.movie.title}, ${mode === 'release' || readable ? selected.dateLabel : selected.domain}`}
                  onChange={(e) =>
                    select(
                      entries[
                        clampTimelineIndex(
                          Number(e.target.value),
                          entries.length,
                        )
                      ].event.id,
                    )
                  }
                  className="block w-full min-h-11 accent-emerald-400 focus-ring-doom"
                />
              </label>
              <button
                type="button"
                className={control}
                disabled={index === entries.length - 1}
                onClick={() => select(entries[index + 1].event.id)}
                aria-label="Next timeline event"
              >
                →
              </button>
            </div>
            <p className="text-xs text-slate-400">
              {mode === 'story'
                ? 'Lanes are separate domains, not one continuous calendar. Lines connect dated events only.'
                : 'Positions reflect elapsed release time. Series use their first US streaming premiere.'}{' '}
              Use arrow keys, Home or End on the scrubber; swipe the record
              strip on touch screens.
            </p>
          </>
        ) : (
          <div role="status" className="rounded-xl border border-white/10 p-6">
            <p className="text-slate-300">
              No nexus records in this chapter. Your watch queue remains
              available in the journey.
            </p>
            <button
              className={`${control} mt-4`}
              onClick={() => updateTimeline({ chapterId: 'all' })}
            >
              Show all chapters
            </button>
          </div>
        )}
      </div>
      {selected && (
        <SceneExplorer
          title="The multiverse in motion"
          nodes={scene.nodes}
          edges={scene.edges}
          selectedId={selected.event.id}
          onSelect={select}
          variant="timeline"
          suspended={!!dossierId}
        >
          <p className="text-xs uppercase tracking-widest text-emerald-300">
            {mode === 'story' ? selected.domain : 'Release chronology'} ·{' '}
            {index + 1} / {entries.length}
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            {readable
              ? selected.event.description
              : 'Story details are protected. Watch this title in the selected journey or reveal timeline spoilers to read the event.'}
          </p>
          {readable && (
            <p className="text-xs text-amber-200">
              Story dates and narrative significance reflect the existing fan
              archive’s editorial interpretation.
            </p>
          )}
          {mode === 'release' && selected.movie.release && (
            <a
              className="text-xs text-emerald-300 underline focus-ring-doom"
              href={selected.movie.release.source}
              target="_blank"
              rel="noreferrer"
            >
              {selected.dateLabel} · Official release source ↗
            </a>
          )}
          <div className="flex flex-wrap gap-3 items-center">
            <button
              type="button"
              className={control}
              aria-pressed={reveal}
              onClick={onReveal}
            >
              {reveal ? 'Hide timeline spoilers' : 'Reveal timeline spoilers'}
            </button>
            <button
              ref={opener}
              type="button"
              className={control}
              onClick={() => setDossierId(selected.movie.id)}
            >
              Open movie dossier
            </button>
            <button
              type="button"
              className={control}
              disabled={!watch.isLoaded}
              aria-pressed={watch.isWatched(selected.movie.id)}
              onClick={() => watch.toggleWatched(selected.movie.id)}
            >
              {watch.isWatched(selected.movie.id)
                ? 'Mark unwatched'
                : 'Mark watched'}
            </button>
            <Button
              href={`/pathways/${journey.id}`}
              variant="secondary"
              size="sm"
            >
              Watch in {journey.title} →
            </Button>
          </div>
        </SceneExplorer>
      )}
      {dossierId && (
        <MovieDossier
          movieId={dossierId}
          journey={journey}
          spoilerShield={!reveal}
          onSelect={setDossierId}
          onClose={() => {
            setDossierId(null);
            opener.current?.focus({ preventScroll: true });
          }}
        />
      )}
    </div>
  );
}
