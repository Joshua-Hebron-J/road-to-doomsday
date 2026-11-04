'use client';

import { trapDialogFocus } from '../lib/accessibility';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  searchArchive,
  searchIndex,
  searchThemes,
} from '../lib/archive-search';
import { getAllJourneys } from '../lib/journey';
const MovieDossier = dynamic(() => import('./movie-dossier'));

const control =
  'min-h-11 rounded-md border border-white/20 bg-slate-950 px-3 text-sm text-slate-200 focus-ring-doom';

export default function ArchiveSearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [dossierOpener, setDossierOpener] = useState<HTMLButtonElement | null>(null);
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('');
  const [phase, setPhase] = useState('');
  const [theme, setTheme] = useState('');
  const [movie, setMovie] = useState<string | null>(null);
  const results = searchArchive(query, kind, phase, theme);
  const journey = getAllJourneys().find(
    (entry) => movie && entry.movieIds.includes(movie),
  );
  const phases = searchIndex.filter((entry) => entry.kind === 'phase');

  function close() {
    dialog.current?.close();
    onClose();
  }

  useEffect(() => {
    if (open) {
      if (!dialog.current?.open) dialog.current?.showModal();
      input.current?.focus();
    } else {
      dialog.current?.close();
    }
  }, [open]);

  function reset() {
    setQuery('');
    setKind('');
    setPhase('');
    setTheme('');
    input.current?.focus();
  }

  return (
    <>
      <dialog
        ref={dialog}
        aria-labelledby="archive-search-title"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            close();
          } else {
            trapDialogFocus(event, event.currentTarget);
          }
        }}
        className="fixed m-auto max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-3xl overflow-y-auto rounded-2xl border border-emerald-400/30 bg-[#090e15] p-4 text-white shadow-2xl backdrop:bg-black/85 sm:p-7"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-300">
              Multiverse archive
            </p>
            <h2
              id="archive-search-title"
              className="mt-1 text-xl font-semibold"
            >
              Every story led here.
            </h2>
          </div>
          <button type="button" onClick={close} className={control}>
            Close search
          </button>
        </div>
        <label className="mt-5 grid gap-2 text-sm">
          Search titles, characters, MCU phases and themes
          <input
            ref={input}
            type="search"
            value={query}
            maxLength={200}
            onChange={(event) => setQuery(event.target.value)}
            className={control + ' w-full'}
            placeholder="Try Loki or Phase 4"
          />
        </label>
        <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="grid gap-1 text-xs text-slate-300">
            Result type
            <select
              value={kind}
              onChange={(event) => setKind(event.target.value)}
              className={control}
            >
              <option value="">All results</option>
              <option value="title">Titles</option>
              <option value="character">Characters</option>
              <option value="phase">MCU phases</option>
              <option value="theme">Narrative themes</option>
            </select>
          </label>
          <label className="grid gap-1 text-xs text-slate-300">
            MCU phase
            <select
              value={phase}
              onChange={(event) => setPhase(event.target.value)}
              className={control}
            >
              <option value="">All phases</option>
              {phases.map((entry) => (
                <option key={entry.id} value={entry.phase}>
                  {entry.title}
                </option>
              ))}
            </select>
          </label>
          <label className="grid min-w-0 gap-1 text-xs text-slate-300">
            Editorial theme
            <select
              value={theme}
              onChange={(event) => {
                setTheme(event.target.value);
                if (event.target.value) setKind('title');
              }}
              className={control + ' w-full min-w-0'}
            >
              <option value="">All themes</option>
              {searchThemes.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex items-center justify-between gap-2 text-sm text-slate-300">
          <p role="status">{results.length} results</p>
          <button type="button" onClick={reset} className={control}>
            Clear filters
          </button>
        </div>
        <p className="my-3 text-xs text-slate-400">
          Story details stay inside spoiler-protected dossiers. Theme tags
          follow this archive’s editorial chapters.
        </p>
        <ul className="space-y-2">
          {results.map((entry) => (
            <li
              key={entry.kind + entry.id}
              className="rounded-lg border border-white/10 bg-white/[0.025] p-3"
            >
              <p className="text-xs uppercase tracking-wide text-emerald-300">
                {entry.kind === 'title' ? 'Screen title' : entry.kind}
              </p>
              {entry.kind === 'title' ? (
                <button
                  type="button"
                  className="min-h-11 text-left font-semibold focus-ring-doom"
                  onClick={(event) => {
                    setDossierOpener(event.currentTarget);
                    setMovie(entry.movieId!);
                  }}
                >
                  {entry.title}
                </button>
              ) : entry.kind === 'phase' ? (
                <button
                  type="button"
                  className="min-h-11 text-left font-semibold focus-ring-doom"
                  onClick={() => {
                    setQuery('');
                    setKind('title');
                    setTheme('');
                    setPhase(String(entry.phase));
                    input.current?.focus();
                  }}
                >
                  {entry.title}
                </button>
              ) : (
                <a
                  href={entry.href!}
                  onClick={close}
                  className="inline-flex min-h-11 items-center font-semibold focus-ring-doom"
                >
                  {entry.title}
                </a>
              )}
              <div className="flex flex-wrap gap-1">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-white/10 px-2 py-1 text-xs text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
        {!results.length && (
          <p className="py-8 text-slate-300">
            No matching records. Try fewer words or clear the filters.
          </p>
        )}
      </dialog>
      {movie && journey && (
        <MovieDossier
          movieId={movie}
          returnFocus={dossierOpener}
          journey={journey}
          spoilerShield
          onSelect={setMovie}
          onClose={() => setMovie(null)}
        />
      )}
    </>
  );
}
