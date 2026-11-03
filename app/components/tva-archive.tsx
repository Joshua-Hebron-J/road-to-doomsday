'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRef, useState } from 'react';
import {
  ARCHIVE_SECTIONS,
  canOpenArchive,
  LOOM_STAGES,
  TVA_JOURNEY,
  VOID_ARTIFACTS,
} from '../data/tva-archive';
import { useWatchProgress } from '../hooks/use-watch-progress';
import {
  getJourneyById,
  getJourneyChapters,
  getMovieById,
} from '../lib/journey';

const MovieDossier = dynamic(() => import('./movie-dossier'), { ssr: false });
const journey = getJourneyById(TVA_JOURNEY)!;
const control =
  'min-h-11 rounded-lg border border-amber-300/30 px-3 py-2 text-sm text-amber-100 focus-ring-doom';
const easterEggGuide =
  'https://d23.com/the-loki-series-is-filled-with-glorious-easter-eggs/';

function Source({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 items-center text-sm text-amber-200 underline focus-ring-doom"
    >
      {children} ↗
    </a>
  );
}

function LoomStudy() {
  const [index, setIndex] = useState(0);
  const stage = LOOM_STAGES[index];
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <svg
        viewBox="0 0 360 185"
        role="img"
        aria-label={`Illustrative Temporal Loom diagram: ${stage.title}, ${stage.strands} drawn strands`}
        className="w-full rounded-xl border border-amber-300/20 bg-slate-950"
      >
        <circle cx="180" cy="92" r="50" fill="#211709" stroke="#b45309" />
        <circle
          cx="180"
          cy="92"
          r="36"
          fill="none"
          stroke="#d97706"
          strokeDasharray="3 5"
        />
        {Array.from({ length: stage.strands }, (_, i) => {
          const y = 92 + (i - (stage.strands - 1) / 2) * 15;
          return (
            <path
              key={i}
              d={`M18 ${y} Q105 ${y} 180 92 Q254 ${y} 342 ${y}`}
              stroke={index === 2 ? '#fda4af' : '#fcd34d'}
              strokeWidth="2"
              fill="none"
              opacity=".85"
            />
          );
        })}
      </svg>
      <div>
        <div
          role="group"
          aria-label="Loom stages"
          className="flex flex-wrap gap-2"
        >
          {LOOM_STAGES.map((entry, i) => (
            <button
              key={entry.title}
              type="button"
              aria-pressed={index === i}
              onClick={() => setIndex(i)}
              className={`${control} ${index === i ? 'bg-amber-900/60' : ''}`}
            >
              {entry.title}
            </button>
          ))}
        </div>
        <div role="status" className="mt-4">
          <h4 className="font-semibold text-white">{stage.title}</h4>
          <p className="mt-2 text-slate-300">{stage.detail}</p>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Editorial schematic. Strand counts are illustrative.
        </p>
        <Source href="https://www.marvel.com/articles/tv-shows/loki-kevin-wright-beautiful-episodes-5-6">
          Marvel · Loom overload
        </Source>
        <br />
        <Source href="https://www.marvel.com/tv-shows/loki/2/episode-6/">
          Marvel · Season 2 finale
        </Source>
      </div>
    </div>
  );
}

function ArchiveContent({
  section,
}: {
  section: (typeof ARCHIVE_SECTIONS)[number]['id'];
}) {
  switch (section) {
    case 'loom':
      return <LoomStudy />;
    case 'regulations':
      return (
        <div className="space-y-3 text-slate-300">
          <dl className="space-y-3">
            <div>
              <dt className="font-semibold text-white">Nexus event</dt>
              <dd>
                A departure from the timeline the TVA is enforcing. Its agents
                investigate the branch and can detain the person they classify
                as a variant.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Trial and pruning</dt>
              <dd>
                In the first season, the TVA puts Loki before a judge. Pruning
                can send people and objects to the Void at the end of time.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-white">
                The source of authority
              </dt>
              <dd>
                He Who Remains set up the TVA to keep the timeline in check. The
                Time-Keepers presented to its staff were puppets.
              </dd>
            </div>
          </dl>
          <Source href="https://www.marvel.com/articles/tv-shows/loki-he-who-remains-jonathan-majors">
            Marvel · The TVA’s founder
          </Source>
        </div>
      );
    case 'void':
      return (
        <div>
          <p className="mb-4 text-slate-300">
            Field notes from Loki Season 1, episode 5. Open a sighting to
            compare what appears on screen with its reference.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {VOID_ARTIFACTS.map((entry) => (
              <details
                key={entry.name}
                className="rounded-lg border border-white/15 p-3"
              >
                <summary className="min-h-11 cursor-pointer py-2 font-semibold text-amber-100 focus-ring-doom">
                  {entry.hint}
                </summary>
                <h4 className="mt-2 font-semibold text-white">{entry.name}</h4>
                <p className="mt-2 text-sm text-slate-300">
                  <strong>On screen.</strong> {entry.screen}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  <strong>Reference.</strong> {entry.reference}
                </p>
              </details>
            ))}
          </div>
          <Source href={easterEggGuide}>D23 · Loki easter eggs</Source>
        </div>
      );
    case 'minutes':
      return (
        <div className="space-y-3 text-slate-300">
          <p>
            Miss Minutes introduces the TVA through its animated orientation
            film. Her cheerful presentation is part of the agency’s account of
            the Sacred Timeline.
          </p>
          <details className="rounded-lg border border-amber-300/25 p-3">
            <summary className="min-h-11 cursor-pointer py-2 font-semibold text-amber-100 focus-ring-doom">
              Inspect the clock transmission
            </summary>
            <p className="mt-2">
              <strong>On screen · Season 1, episode 2.</strong> Loki swats at
              Miss Minutes while studying at the TVA, then questions whether she
              is alive or a recording. The exchange plays on her role as both a
              mascot and a responsive presence.
            </p>
          </details>
          <details className="rounded-lg border border-amber-300/25 p-3">
            <summary className="min-h-11 cursor-pointer py-2 font-semibold text-amber-100 focus-ring-doom">
              Open the Citadel greeting
            </summary>
            <p className="mt-2">
              <strong>On screen · Season 1, episode 6.</strong> The familiar
              orientation mascot greets Loki and Sylvie at the Citadel and
              speaks on behalf of He Who Remains.
            </p>
          </details>
          <details className="rounded-lg border border-amber-300/25 p-3">
            <summary className="min-h-11 cursor-pointer py-2 font-semibold text-amber-100 focus-ring-doom">
              Spot the vintage cartoon reference
            </summary>
            <p className="mt-2">
              <strong>Production note.</strong> The design team looked to 1940s
              and 1950s animation. Flat colors and simple geometric shapes give
              the clock the look of an older cartoon.
            </p>
            <Source href="https://assets.adg.org/media/submissions/2021-11-03_07-37-10/Loki_Presentation_211202.pdf">
              Loki production design presentation
            </Source>
          </details>
          <Source href="https://www.marvel.com/tv-shows/loki/1/episode-2/">
            Marvel · Episode 2 and Miss Minutes extras
          </Source>
        </div>
      );
  }
}

export function TvaArchive() {
  const [sectionId, setSection] =
    useState<(typeof ARCHIVE_SECTIONS)[number]['id']>('regulations');
  const [revealed, setRevealed] = useState(false);
  const [dossier, setDossier] = useState<string | null>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const { watchedIds, storageError } = useWatchProgress(TVA_JOURNEY);
  const section = ARCHIVE_SECTIONS.find((entry) => entry.id === sectionId)!;
  const movie = getMovieById(section.season)!;
  const chapter = getJourneyChapters(journey.id).find((entry) =>
    entry.movieIds.includes(movie.id),
  );
  const readable = canOpenArchive(section.season, watchedIds, revealed);

  return (
    <section
      id="tva-archives"
      aria-labelledby="tva-title"
      className="scroll-mt-24 border-y border-amber-300/20 bg-[radial-gradient(ellipse_at_top,#332314,#090c15_70%)] px-4 py-16 sm:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-amber-200">
          Temporal records / Loki viewing companion
        </p>
        <h2
          id="tva-title"
          className="mt-3 text-3xl font-bold text-white sm:text-5xl"
        >
          TVA &amp; Temporal Loom Archives
        </h2>
        <p className="mt-4 max-w-2xl text-slate-300">
          Read the TVA’s procedures, trace the Loom’s operation, and inspect
          what the Void kept.
        </p>
        <div
          role="group"
          aria-label="TVA archive sections"
          className="mt-6 flex flex-wrap gap-2"
        >
          {ARCHIVE_SECTIONS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={sectionId === entry.id}
              onClick={() => {
                setSection(entry.id);
                setRevealed(false);
              }}
              className={`${control} ${sectionId === entry.id ? 'bg-amber-900/60' : ''}`}
            >
              {entry.title}
            </button>
          ))}
        </div>
        <article className="mt-5 rounded-2xl border border-amber-300/20 bg-slate-950/75 p-4 sm:p-7">
          <p className="font-mono text-xs uppercase text-amber-200">
            MCU screen archive · {movie.title}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            {section.title}
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            {watchedIds.includes(movie.id) ? 'Watched' : 'Unwatched'} in{' '}
            {journey.title}
          </p>
          {storageError && (
            <p role="status" className="mt-2 text-sm text-amber-200">
              {storageError}
            </p>
          )}
          <div className="my-4 flex flex-wrap items-center gap-3">
            <button
              ref={opener}
              type="button"
              aria-haspopup="dialog"
              className={control}
              onClick={() => setDossier(movie.id)}
            >
              Open Loki dossier
            </button>
            <Link
              href={`/pathways/${journey.id}${chapter ? '#' + chapter.id + '-trigger' : ''}`}
              className="inline-flex min-h-11 items-center text-sm text-amber-200 underline focus-ring-doom"
            >
              {chapter ? 'Go to chapter' : 'Open viewing journey'}
            </Link>
            {!watchedIds.includes(movie.id) && (
              <button
                type="button"
                aria-pressed={revealed}
                className={control}
                onClick={() => setRevealed(!revealed)}
              >
                {revealed ? 'Hide archive spoilers' : 'Reveal archive spoilers'}
              </button>
            )}
          </div>
          {readable ? (
            <ArchiveContent key={section.id} section={section.id} />
          ) : (
            <p role="status" className="text-sm text-slate-300">
              Archive sealed. Watch {movie.title} in this journey or reveal
              spoilers for this section.
            </p>
          )}
        </article>
        <a
          href="#variants"
          className="mt-3 inline-flex min-h-11 items-center text-sm text-amber-200 underline focus-ring-doom"
        >
          Explore character lineages ↑
        </a>
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
