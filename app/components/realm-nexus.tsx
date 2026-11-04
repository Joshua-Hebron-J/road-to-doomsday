'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { canReadRealm, REALMS, REALM_JOURNEY } from '../data/realms';
import { useWatchProgress } from '../hooks/use-watch-progress';
import {
  getJourneyById,
  getJourneyChapters,
  getMovieById,
} from '../lib/journey';
import { SceneExplorer } from './scene-explorer';
import type { SpatialEdge } from './spatial-scene-types';

const MovieDossier = dynamic(() => import('./movie-dossier'), { ssr: false });
const journey = getJourneyById(REALM_JOURNEY)!;
const route: SpatialEdge[] = [
  {
    id: 'chavez-crossing',
    source: 'earth-616',
    target: 'earth-838',
    label: 'Crossing in Multiverse of Madness',
    color: '#7dd3fc',
  },
];
const action =
  'inline-flex min-h-11 items-center rounded-lg border border-violet-300/30 px-3 py-2 text-sm text-violet-100 focus-ring-doom';

function RealmDiagram({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#252044,#080b18_75%)]">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        <ellipse
          cx="50"
          cy="50"
          rx="42"
          ry="41"
          fill="none"
          stroke="#475569"
          strokeWidth=".25"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="35"
          ry="30"
          fill="none"
          stroke="#334155"
          strokeDasharray="1 2"
          strokeWidth=".25"
        />
        <path
          d="M19 32L47 21"
          stroke="#7dd3fc"
          strokeWidth=".4"
          strokeDasharray="1 1"
        />
      </svg>
      {REALMS.map((realm, index) => (
        <button
          key={realm.id}
          type="button"
          aria-label={'Map pin: ' + String(index + 1).padStart(2, '0') + ' ' + realm.label}
          aria-pressed={selected === realm.id}
          onClick={() => onSelect(realm.id)}
          className={`absolute grid min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border font-mono text-sm focus-ring-doom ${selected === realm.id ? 'bg-violet-900 shadow-[0_0_24px_#8b5cf680]' : 'bg-slate-950'}`}
          style={{
            left: realm.map[0] + '%',
            top: realm.map[1] + '%',
            color: realm.color,
          }}
        >
          <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{' '}
          <span
            aria-hidden="true"
            className="absolute top-full mt-1 w-24 text-center text-[11px] leading-tight sm:w-36 sm:text-xs"
          >
            {realm.label}
          </span>
        </button>
      ))}
    </div>
  );
}

function ConvergenceStudy() {
  const [assembled, setAssembled] = useState(false);
  return (
    <div className="rounded-xl border border-violet-300/25 bg-slate-950 p-4">
      <p className="font-mono text-xs uppercase text-violet-200">
        Illustrated comics study
      </p>
      <svg
        viewBox="0 0 300 110"
        role="img"
        aria-label={
          assembled
            ? 'Three fragments assembled as a single patchwork'
            : 'Three separated fragments'
        }
        className="mx-auto max-h-32 w-full"
      >
        {[
          ['0,0 40,0 50,50 0,50', '#a78bfa'],
          ['0,0 40,0 30,50 10,50', '#5eead4'],
          ['0,0 40,0 40,50 -10,50', '#fbbf24'],
        ].map(([points, color], index) => (
          <g
            key={color}
            className="motion-safe:transition-transform motion-safe:duration-500"
            style={{
              transform: `translate(${(assembled ? [90, 130, 170] : [30, 125, 220])[index]}px, 30px)`,
            }}
          >
            <polygon
              points={points}
              fill={color}
              stroke="#0f172a"
              strokeWidth="2"
            />
          </g>
        ))}
      </svg>
      <button
        type="button"
        className={action}
        aria-pressed={assembled}
        onClick={() => setAssembled(!assembled)}
      >
        {assembled ? 'Separate fragments' : 'Assemble fragments'}
      </button>
      <p role="status" className="mt-2 text-sm text-slate-300">
        {assembled
          ? 'Patchwork assembled. The colors distinguish illustrative fragments.'
          : 'Three fragments are separated.'}
      </p>
    </div>
  );
}

export function RealmNexus() {
  const [selected, setSelected] = useState(REALMS[0].id);
  const [revealed, setRevealed] = useState(false);
  const [dossier, setDossier] = useState<string | null>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const { watchedIds, storageError } = useWatchProgress(REALM_JOURNEY);
  const realm = REALMS.find((entry) => entry.id === selected)!;
  const movie = realm.movieId ? getMovieById(realm.movieId) : undefined;
  const chapter =
    movie &&
    getJourneyChapters(journey.id).find((entry) =>
      entry.movieIds.includes(movie.id),
    );
  const readable = canReadRealm(realm, watchedIds, revealed);
  const watched = movie !== undefined && watchedIds.includes(movie.id);
  const nodes = REALMS.map((entry) => ({
    ...entry,
    complete: !!entry.movieId && watchedIds.includes(entry.movieId),
  }));

  function select(id: string) {
    if (id === selected) return;
    setSelected(id);
    setRevealed(false);
  }

  return (
    <section
      id="realm-nexus"
      aria-labelledby="realm-nexus-title"
      className="scroll-mt-24 border-y border-violet-300/20 bg-[radial-gradient(ellipse_at_top,#211838,#080b16_70%)] px-4 py-16 sm:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-violet-200">
          Multiverse navigation / Five destinations
        </p>
        <h2
          id="realm-nexus-title"
          className="mt-3 text-3xl font-bold text-white sm:text-5xl"
        >
          Interactive Multiverse Map &amp; Realm Nexus
        </h2>
        <p className="mb-7 mt-4 max-w-3xl text-slate-300">
          Select a destination to explore its story and viewing chapter.
          Positions are editorial. The blue connection marks the crossing in
          Multiverse of Madness.
        </p>
        <SceneExplorer
          title="Realm navigation"
          nodes={nodes}
          selectedId={selected}
          onSelect={select}
          variant="timeline"
          edges={route}
          suspended={dossier !== null}
          fallback={<RealmDiagram selected={selected} onSelect={select} />}
        >
          {storageError && (
            <p role="status" className="text-sm text-amber-200">
              {storageError}
            </p>
          )}
          <p className="text-sm text-slate-300">
            {readable
              ? realm.detail
              : 'Story details protected. Reveal this destination or watch its linked title in the Incursion & TVA Nexus.'}
          </p>
          {movie && (
            <p className="text-sm text-slate-300">
              {movie.title} · {watched ? 'Watched' : 'Unwatched'} in{' '}
              {journey.title}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {!watched && (
              <button
                type="button"
                aria-pressed={revealed}
                className={action}
                onClick={() => setRevealed(!revealed)}
              >
                {revealed ? 'Hide realm spoilers' : 'Reveal realm spoilers'}
              </button>
            )}
            {movie && (
              <button
                type="button"
                ref={opener}
                aria-haspopup="dialog"
                className={action}
                onClick={() => setDossier(movie.id)}
              >
                Open movie dossier
              </button>
            )}
            {chapter && (
              <Link
                className={action}
                href={`/pathways/${journey.id}#${chapter.id}-trigger`}
              >
                Go to chapter
              </Link>
            )}
            <a href={realm.related.href} className={action}>
              {realm.related.label}
            </a>
            {realm.id === 'earth-838' && (
              <a href="#incursion" className={action}>
                Try the fictional incursion simulator
              </a>
            )}
            {readable && (
              <a
                href={realm.source}
                target="_blank"
                rel="noreferrer"
                className={action}
              >
                Official source ↗
              </a>
            )}
          </div>
          {realm.id === 'battleworld' && readable && <ConvergenceStudy />}
        </SceneExplorer>
      </div>
      {dossier && (
        <MovieDossier
          movieId={dossier}
          journey={journey}
          spoilerShield
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
