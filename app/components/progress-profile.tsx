'use client';

import Link from 'next/link';
import { useRef, useState, type ChangeEvent } from 'react';
import { useWatchProgress } from '../hooks/use-watch-progress';
import { getAllJourneys, getJourneyById, getMovieById } from '../lib/journey';
import {
  createWatchBackup,
  MAX_BACKUP_BYTES,
  mergeWatchBackup,
  parseWatchBackup,
  type WatchBackup,
} from '../lib/watch-backup';
import type { Journey } from '../types/journey';

const control =
  'inline-flex min-h-11 items-center rounded-lg border border-emerald-300/35 px-4 py-2 text-sm font-semibold text-emerald-100 focus-ring-doom';

function JourneyProgress({ journey }: { journey: Journey }) {
  const { progress, isLoaded, storageError } = useWatchProgress(journey.id);
  return (
    <li className="rounded-xl border border-white/15 bg-slate-950/80 p-4">
      <Link
        href={`/pathways/${journey.id}`}
        className="inline-flex min-h-11 items-center font-semibold text-emerald-100 underline focus-ring-doom"
      >
        {journey.title}
      </Link>
      <p className="text-sm text-slate-300">
        {isLoaded
          ? `${progress.completedCount} of ${progress.totalCount} watched`
          : 'Loading progress…'}
      </p>
      {storageError && (
        <p className="mt-2 text-xs text-amber-200">{storageError}</p>
      )}
    </li>
  );
}

function BackupPreviewRow({
  journeyId,
  imported,
}: {
  journeyId: string;
  imported: readonly string[];
}) {
  const { watchedIds } = useWatchProgress(journeyId);
  const additions = imported.filter((id) => !watchedIds.includes(id));

  return (
    <li>
      <strong>{getJourneyById(journeyId)?.title}</strong>
      <p>
        {watchedIds.length} watched now · {additions.length} to add ·{' '}
        {watchedIds.length + additions.length} after merge
      </p>
      {additions.length > 0 && (
        <p>
          Titles to add:{' '}
          {additions.map((id) => getMovieById(id)?.title ?? id).join(', ')}
        </p>
      )}
    </li>
  );
}

export function ProgressProfile() {
  const [backup, setBackup] = useState<WatchBackup | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const readId = useRef(0);

  function download() {
    const blob = new Blob([JSON.stringify(createWatchBackup(), null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'road-to-doomsday-progress.json';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus('Backup prepared for download.');
  }

  async function preview(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const request = ++readId.current;
    setBackup(null);
    setStatus('');
    setError('');
    try {
      if (file.size > MAX_BACKUP_BYTES)
        throw new Error('This backup exceeds the 64 KB limit.');
      const parsed = parseWatchBackup(await file.text());
      if (request === readId.current) setBackup(parsed);
    } catch (issue) {
      if (request === readId.current) {
        setError(
          issue instanceof Error
            ? issue.message
            : 'Could not read this backup.',
        );
      }
    }
  }

  function apply() {
    if (!backup) return;
    const results = mergeWatchBackup(backup);
    const temporary = results.filter(({ snapshot }) => snapshot.storageError);
    setBackup(null);
    input.current?.focus();
    setStatus(
      temporary.length
        ? `Progress merged. Storage is unavailable for ${temporary.map(({ journeyId }) => getJourneyById(journeyId)?.title ?? journeyId).join(', ')}. Export a backup to keep those session changes.`
        : 'Backup merged into your viewing journeys.',
    );
  }

  return (
    <section
      id="progress-profile"
      aria-labelledby="progress-profile-title"
      className="scroll-mt-24 border-y border-emerald-300/20 bg-[radial-gradient(ellipse_at_top,#13342e,#080c16_70%)] px-4 py-16 sm:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-200">
          Personal viewing archive
        </p>
        <h2
          id="progress-profile-title"
          className="mt-3 text-3xl font-bold text-white sm:text-5xl"
        >
          Your journey profile
        </h2>
        <p className="mt-4 max-w-2xl text-slate-300">
          Back up your watch progress or carry it to another device. Download a
          JSON file here, then open it in the profile on your other device.
        </p>
        <ul className="mt-6 grid gap-3 md:grid-cols-3">
          {getAllJourneys().map((journey) => (
            <JourneyProgress key={journey.id} journey={journey} />
          ))}
        </ul>
        <div className="mt-6 rounded-xl border border-white/15 bg-slate-950/75 p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" onClick={download} className={control}>
              Download progress backup
            </button>
            <label className="grid min-w-0 gap-2 text-sm text-slate-200">
              Choose progress backup
              <input
                ref={input}
                type="file"
                accept=".json,application/json"
                onChange={preview}
                className="min-h-11 max-w-full rounded-md border border-white/20 p-2 text-sm focus-ring-doom"
              />
            </label>
          </div>
          <p className="mt-3 text-sm text-slate-300">
            Import adds watched titles to their original journeys and keeps your
            current progress.
          </p>
          {backup && (
            <div className="mt-4 rounded-lg border border-emerald-300/25 p-4">
              <h3 className="font-semibold text-white">Backup preview</h3>
              <ul className="my-3 space-y-1 text-sm text-slate-300">
                {backup.journeys.map(({ journeyId, watchedIds }) => (
                  <BackupPreviewRow
                    key={journeyId}
                    journeyId={journeyId}
                    imported={watchedIds}
                  />
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={control} onClick={apply}>
                  Merge backup
                </button>
                <button
                  type="button"
                  className={control}
                  onClick={() => {
                    setBackup(null);
                    input.current?.focus();
                  }}
                >
                  Cancel import
                </button>
              </div>
            </div>
          )}
          {error && (
            <p role="alert" className="mt-3 text-sm text-rose-200">
              {error}
            </p>
          )}
          <p role="status" className="mt-3 text-sm text-emerald-100">
            {status}
          </p>
        </div>
      </div>
    </section>
  );
}
