'use client';

import { trapDialogFocus } from '../lib/accessibility';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { getAllJourneys, getMovieById } from '../lib/journey';
import { useWatchProgress } from '../hooks/use-watch-progress';
import type { Journey } from '../types/journey';
import { Badge } from './ui/badge';

interface Props {
  movieId: string;
  returnFocus?: HTMLElement | null;
  journey: Journey;
  spoilerShield: boolean;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function MovieDossier({
  movieId,
  returnFocus,
  journey,
  spoilerShield,
  onSelect,
  onClose,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const panel = useRef<HTMLElement>(null);
  const previousMovie = useRef(movieId);
  const finished = useRef(false);
  const [closing, setClosing] = useState(false);
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const reduceMotion = useReducedMotion();
  const { isLoaded, isWatched, toggleWatched, storageError } = useWatchProgress(
    journey.id,
  );
  const movie = getMovieById(movieId);

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = returnFocus ?? document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element?.showModal();
    closeButton.current?.focus();
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, [returnFocus]);

  useEffect(() => {
    if (previousMovie.current === movieId) return;
    previousMovie.current = movieId;
    heading.current?.focus({ preventScroll: true });
    panel.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [movieId]);

  if (!movie) return null;
  const belongs = journey.movieIds.includes(movie.id);
  const watched = isWatched(movie.id);
  const readable = !spoilerShield || watched || revealedId === movie.id;
  const alternative = !belongs
    ? getAllJourneys().find((item) => item.movieIds.includes(movie.id))
    : undefined;

  function finishClose() {
    if (!closing || finished.current) return;
    finished.current = true;
    dialog.current?.close();
    onClose();
  }
  function inspect(id: string) {
    if (closing) return;
    setHistory((ids) => [...ids, movieId]);
    setRevealedId(null);
    onSelect(id);
  }

  return (
    <dialog
      ref={dialog}
      id="movie-dossier"
      aria-modal="true"
      aria-labelledby="movie-dossier-title"
      aria-describedby="movie-dossier-context"
      onCancel={(event) => {
        event.preventDefault();
        setClosing(true);
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) setClosing(true);
      }}
      onKeyDown={(event) => trapDialogFocus(event, event.currentTarget)}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0 text-slate-100 backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      <p role="status" aria-atomic="true" className="sr-only">
        {movie.title}. {watched ? 'Watched' : 'Unwatched'}.
        {readable ? ' Story details revealed.' : ' Story details protected.'}
      </p>
      <motion.aside
        ref={panel}
        initial={reduceMotion ? false : { x: '100%', opacity: 0 }}
        animate={{ x: closing ? '100%' : 0, opacity: closing ? 0 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.26, ease: 'easeOut' }}
        onAnimationComplete={finishClose}
        className="ml-auto h-full w-full max-w-2xl overflow-y-auto overscroll-contain border-l border-emerald-500/30 bg-surface-1 shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-surface-1/95 px-5 py-3 backdrop-blur-md">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300">
            Media Detail System // Cinematic Dossier
          </span>
          <button
            ref={closeButton}
            type="button"
            onClick={() => setClosing(true)}
            aria-label="Close movie dossier"
            className="min-h-11 px-4 rounded border border-white/15 text-sm focus-ring-doom"
          >
            Close ✕
          </button>
        </header>
        <div className="px-5 sm:px-8 pt-6 pb-8 space-y-7">
          <p
            id="movie-dossier-context"
            className="text-xs font-mono text-slate-400"
          >
            Progress tracked in {journey.title}
          </p>
          {history.length > 0 && (
            <button
              type="button"
              disabled={closing}
              onClick={() => {
                const id = history.at(-1);
                if (id) {
                  setHistory((ids) => ids.slice(0, -1));
                  setRevealedId(null);
                  onSelect(id);
                }
              }}
              className="min-h-11 text-sm text-emerald-300 underline focus-ring-doom"
            >
              ← Previous dossier
            </button>
          )}
          <motion.div
            key={movie.id}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="space-y-7"
          >
            <div className="space-y-4 border-b border-white/10 pb-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="emerald" size="sm">
                  {movie.importance}
                </Badge>
                <Badge variant="subtle" size="sm">
                  {movie.type}
                </Badge>
                {watched && (
                  <Badge variant="emerald" size="sm">
                    Watched
                  </Badge>
                )}
              </div>
              <h2
                ref={heading}
                tabIndex={-1}
                id="movie-dossier-title"
                className="text-3xl sm:text-4xl font-black uppercase tracking-wide leading-tight break-words focus-ring-doom rounded"
              >
                {movie.title}
              </h2>
              <p className="text-sm font-mono text-slate-300">
                {movie.year} · {movie.runtime} minutes
                {movie.episodes ? ` · ${movie.episodes} episodes` : ''}
                {movie.phase ? ` · Phase ${movie.phase}` : ''}
              </p>
            </div>
            <section
              aria-label="Dossier spoiler controls"
              className="rounded-xl border border-emerald-500/25 bg-emerald-950/20 p-4 space-y-3"
            >
              <p className="text-sm text-slate-300">
                {readable
                  ? 'Narrative briefing is visible.'
                  : 'Spoiler shield is protecting this unwatched story.'}
              </p>
              {spoilerShield && !watched && (
                <button
                  type="button"
                  aria-pressed={revealedId === movie.id}
                  onClick={() =>
                    setRevealedId((id) => (id === movie.id ? null : movie.id))
                  }
                  className="min-h-11 px-4 rounded border border-emerald-500/40 text-sm text-emerald-200 focus-ring-doom"
                >
                  {revealedId === movie.id
                    ? 'Hide dossier spoilers'
                    : 'Reveal dossier spoilers'}
                </button>
              )}
            </section>
            <section aria-labelledby="dossier-synopsis" className="space-y-2">
              <h3
                id="dossier-synopsis"
                className="text-sm uppercase font-semibold tracking-wider"
              >
                Synopsis
              </h3>
              <p className="text-sm leading-relaxed text-slate-300">
                {readable
                  ? movie.description
                  : 'Synopsis protected. Reveal spoilers or mark this entry watched to read it.'}
              </p>
            </section>
            <section
              aria-labelledby="dossier-matters"
              className="rounded-xl border border-white/10 bg-surface-2/60 p-5 space-y-3"
            >
              <h3
                id="dossier-matters"
                className="text-sm uppercase font-semibold tracking-wider text-emerald-300"
              >
                Why It Matters
              </h3>
              <p className="text-sm leading-relaxed text-slate-300">
                {readable
                  ? movie.whyItMatters
                  : 'Story relevance protected by spoiler shield.'}
              </p>
              <p className="text-[11px] text-slate-400">
                Archive commentary reflects the existing fan project’s narrative
                interpretation.
              </p>
            </section>
            <section aria-labelledby="dossier-credits" className="space-y-2">
              <h3
                id="dossier-credits"
                className="text-sm uppercase font-semibold tracking-wider"
              >
                Post-credit viewing
              </h3>
              <p className="text-sm text-slate-300">
                {movie.postCreditRequired
                  ? 'Post-credit viewing is flagged as required in this archive. Stay through the credits.'
                  : 'No required post-credit viewing is flagged in this archive.'}
              </p>
            </section>
            <section
              aria-labelledby="dossier-prerequisites"
              className="space-y-3"
            >
              <h3
                id="dossier-prerequisites"
                className="text-sm uppercase font-semibold tracking-wider"
              >
                Prerequisite connections
              </h3>
              {movie.prerequisites.length ? (
                <ul className="space-y-2">
                  {movie.prerequisites.map((id) => {
                    const prerequisite = getMovieById(id);
                    if (!prerequisite) return null;
                    const inside = journey.movieIds.includes(id);
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          disabled={closing}
                          onClick={() => inspect(id)}
                          className="w-full text-left min-h-11 rounded-xl border border-white/10 bg-surface-2/50 p-4 hover:border-emerald-500/40 focus-ring-doom"
                        >
                          <span className="block text-sm font-semibold">
                            {prerequisite.title} →
                          </span>
                          <span className="block mt-1 text-xs text-slate-400">
                            {prerequisite.year} ·{' '}
                            {inside
                              ? isWatched(id)
                                ? 'Watched in this pathway'
                                : 'Unwatched in this pathway'
                              : 'Outside this pathway · context only'}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">
                  No prerequisite connections are listed in the current archive.
                </p>
              )}
            </section>
          </motion.div>
          {storageError && (
            <p role="status" className="text-xs text-amber-200">
              {storageError}
            </p>
          )}
          <div className="border-t border-white/10 pt-5 space-y-3">
            {belongs ? (
              <button
                type="button"
                disabled={!isLoaded || closing}
                onClick={() => toggleWatched(movie.id)}
                className="w-full min-h-12 rounded-xl border border-emerald-500/50 bg-emerald-950/70 px-4 py-3 text-sm font-semibold text-emerald-100 hover:bg-emerald-900/70 focus-ring-doom disabled:opacity-50"
              >
                Mark {movie.title} as {watched ? 'unwatched' : 'watched'}
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-300">
                  This context entry is outside {journey.title}. Its watch state
                  is not added to this pathway.
                </p>
                {alternative && (
                  <Link
                    href={`/pathways/${alternative.id}`}
                    className="inline-flex min-h-11 items-center text-sm text-emerald-300 underline focus-ring-doom"
                  >
                    Track in {alternative.title} →
                  </Link>
                )}
              </div>
            )}
            <p className="text-[11px] text-slate-400">
              Opening or revealing a dossier never changes watch progress.
              Streaming availability has not been verified; no streaming links
              are listed.
            </p>
          </div>
        </div>
      </motion.aside>
    </dialog>
  );
}
