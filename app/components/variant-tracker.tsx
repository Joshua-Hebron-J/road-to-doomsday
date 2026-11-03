'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CHARACTERS, type CharacterId, type Variant } from '../data/variants';
import { useWatchProgress } from '../hooks/use-watch-progress';
import { getAllJourneys } from '../lib/journey';
import {
  canReadVariant,
  getVariantContext,
  getVariants,
} from '../lib/variant-lineage';
import type { Journey } from '../types/journey';

const MovieDossier = dynamic(() => import('./movie-dossier'), { ssr: false });
const journeys = getAllJourneys();
const control =
  'min-h-11 rounded-lg border border-white/20 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus-ring-doom';

function VariantRecord({
  variant,
  journey,
  watchedIds,
  revealed,
  openDossier,
}: {
  variant: Variant;
  journey: Journey;
  watchedIds: readonly string[];
  revealed: boolean;
  openDossier: (id: string, trigger: HTMLButtonElement) => void;
}) {
  const { movie, included, chapter, otherJourneys } = getVariantContext(
    variant,
    journey,
  );
  const readable = canReadVariant(variant, watchedIds, revealed);
  const alternative = otherJourneys[0];

  return (
    <li className="min-w-0 rounded-xl border border-white/15 bg-slate-950/85 p-5">
      <p className="font-mono text-xs uppercase tracking-wider text-violet-200">
        {variant.reality} · {variant.medium}
      </p>
      <h4 className="mt-2 text-xl font-semibold text-white">{variant.name}</h4>
      <p className="mt-3 text-sm text-slate-300">
        {readable
          ? variant.description
          : 'Story details protected. Reveal notes or watch the linked title in this journey.'}
      </p>
      <p className="mt-4 text-sm font-medium text-slate-100">
        {movie?.title ?? variant.externalTitle}
      </p>
      {movie && (
        <p className="mt-1 text-xs text-slate-300">
          {included
            ? watchedIds.includes(movie.id)
              ? 'Watched in this journey'
              : 'Unwatched in this journey'
            : 'Outside this journey'}
          {chapter && <span className="block mt-1">{chapter.title}</span>}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {movie && (
          <button
            type="button"
            aria-haspopup="dialog"
            className={control}
            onClick={(event) => openDossier(movie.id, event.currentTarget)}
          >
            Open movie dossier
          </button>
        )}
        {included && (
          <Link
            className="inline-flex min-h-11 items-center text-sm text-violet-200 underline focus-ring-doom"
            href={`/pathways/${journey.id}${chapter ? '#' + chapter.id + '-trigger' : ''}`}
          >
            {chapter ? 'Go to chapter' : 'Open journey'}
          </Link>
        )}
        {alternative && (
          <Link
            className="inline-flex min-h-11 items-center text-sm text-violet-200 underline focus-ring-doom"
            href={`/pathways/${alternative.id}`}
          >
            Find in {alternative.title}
          </Link>
        )}
        {readable && (
          <a
            className="inline-flex min-h-11 items-center text-sm text-violet-200 underline focus-ring-doom"
            href={variant.source}
            target="_blank"
            rel="noreferrer"
          >
            Official source ↗
          </a>
        )}
      </div>
    </li>
  );
}

export function VariantTracker() {
  const [characterId, setCharacter] = useState<CharacterId>('strange');
  const [reality, setReality] = useState('');
  const [journeyId, setJourney] = useState(journeys[0].id);
  const [revealed, setRevealed] = useState(false);
  const [dossierId, setDossier] = useState<string | null>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const journey =
    journeys.find((entry) => entry.id === journeyId) ?? journeys[0];
  const { watchedIds, storageError } = useWatchProgress(journey.id);
  const character = CHARACTERS.find((entry) => entry.id === characterId)!;
  const realities = [
    ...new Set(getVariants(characterId).map((variant) => variant.reality)),
  ];
  const variants = getVariants(characterId, reality);

  function selectCharacter(id: CharacterId) {
    setCharacter(id);
    setReality('');
    setRevealed(false);
  }

  return (
    <section
      id="variants"
      aria-labelledby="variant-title"
      className="scroll-mt-24 border-y border-violet-300/20 bg-[radial-gradient(ellipse_at_top,#211839,#080b16_70%)] px-4 py-16 sm:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-violet-200">
          Multiverse identity archive
        </p>
        <h2
          id="variant-title"
          className="mt-3 text-3xl font-bold text-white sm:text-5xl"
        >
          Character &amp; Variant Lineage Tracker
        </h2>
        <p className="mt-4 max-w-2xl text-slate-300">
          Compare how one identity takes shape across realities. Follow each
          record back to its screen appearance, source, or chapter in your
          viewing journey.
        </p>
        <div
          role="group"
          aria-label="Character lineage"
          className="mt-7 flex flex-wrap gap-2"
        >
          {CHARACTERS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={entry.id === characterId}
              onClick={() => selectCharacter(entry.id)}
              className={`${control} ${entry.id === characterId ? 'bg-violet-950 border-violet-300' : ''}`}
            >
              {entry.name}
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-4 rounded-xl border border-violet-300/20 bg-slate-950/65 p-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-slate-200">
            Reality
            <select
              className={`${control} min-w-0 w-full`}
              value={reality}
              onChange={(event) => setReality(event.target.value)}
            >
              <option value="">All realities in this lineage</option>
              {realities.map((entry) => (
                <option key={entry}>{entry}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Viewing journey
            <select
              className={`${control} min-w-0 w-full`}
              value={journey.id}
              onChange={(event) => {
                setJourney(event.target.value);
                setRevealed(false);
              }}
            >
              {journeys.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        {characterId === 'doom' && (
          <a
            href="#doom-codex"
            className="mt-3 inline-flex min-h-11 items-center text-sm text-violet-200 underline focus-ring-doom"
          >
            Open the Latverian Lore Codex ↓
          </a>
        )}
        {storageError && (
          <p role="status" className="mt-3 text-sm text-amber-200">
            {storageError}
          </p>
        )}
        <div
          className="mt-7 flex flex-wrap items-center justify-between gap-3 border-b pb-3"
          style={{ borderColor: character.color }}
        >
          <h3
            className="text-xl font-semibold"
            style={{ color: character.color }}
          >
            {character.name} lineage
          </h3>
          <button
            type="button"
            aria-pressed={revealed}
            className={control}
            onClick={() => setRevealed(!revealed)}
          >
            {revealed ? 'Hide story notes' : 'Reveal story notes'}
          </button>
        </div>
        <p role="status" className="mt-3 text-sm text-slate-300">
          {variants.length} {variants.length === 1 ? 'record' : 'records'} in
          view
        </p>
        <motion.ul
          key={characterId}
          initial={reducedMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
          className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {variants.map((variant) => (
            <VariantRecord
              key={variant.id}
              variant={variant}
              journey={journey}
              watchedIds={watchedIds}
              revealed={revealed}
              openDossier={(id, trigger) => {
                opener.current = trigger;
                setDossier(id);
              }}
            />
          ))}
        </motion.ul>
      </div>
      {dossierId && (
        <MovieDossier
          movieId={dossierId}
          journey={journey}
          spoilerShield={!revealed}
          onSelect={setDossier}
          onClose={() => {
            setDossier(null);
            opener.current?.focus({ preventScroll: true });
          }}
        />
      )}
    </section>
  );
}
