'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useWatchProgress } from '../hooks/use-watch-progress';
import {
  createItinerary,
  createShareSnapshot,
  posterColors,
  posterText,
  type PosterColor,
} from '../lib/journey-sharing';
import { drawJourneyPoster } from '../lib/journey-poster';

const control =
  'min-h-11 rounded-lg border border-emerald-300/35 px-4 py-2 text-sm text-emerald-100 focus-ring-doom disabled:opacity-50';

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  // Allow the browser to start the download before releasing the temporary URL.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function JourneySharing({ journeyId }: { journeyId: string }) {
  const { watchedIds, isLoaded } = useWatchProgress(journeyId);
  const snapshot = useMemo(
    () => createShareSnapshot(journeyId, watchedIds),
    [journeyId, watchedIds],
  );
  const [name, setName] = useState('');
  const [color, setColor] = useState<PosterColor>('emerald');
  const [includeProgress, setIncludeProgress] = useState(false);
  const [certificate, setCertificate] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [imageError, setImageError] = useState('');
  const canvas = useRef<HTMLCanvasElement>(null);
  const link = useRef<HTMLInputElement>(null);
  const isCertificate = certificate && snapshot.progress.isComplete;
  const text = posterText(snapshot, name, includeProgress, isCertificate);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        if (canvas.current)
          drawJourneyPoster(
            canvas.current,
            snapshot,
            name,
            color,
            includeProgress,
            isCertificate,
          );
        setImageError('');
      } catch (error) {
        setImageError(
          error instanceof Error
            ? error.message
            : 'Image generation is unavailable.',
        );
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [snapshot, name, color, includeProgress, isCertificate]);

  async function image(share: boolean) {
    if (!canvas.current || busy) return;
    setBusy(true);
    setMessage('');
    try {
      // Capture exactly the currently displayed snapshot before awaiting encoding.
      drawJourneyPoster(
        canvas.current,
        snapshot,
        name,
        color,
        includeProgress,
        isCertificate,
      );
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.current!.toBlob(
          (value) =>
            value
              ? resolve(value)
              : reject(new Error('Could not generate the image.')),
          'image/png',
        ),
      );
      const filename =
        journeyId + (isCertificate ? '-certificate.png' : '-poster.png');
      if (share) {
        const file = new File([blob], filename, { type: 'image/png' });
        if (!navigator.canShare?.({ files: [file] })) {
          setMessage(
            'File sharing is unavailable here. Download the PNG to share it manually.',
          );
          return;
        }
        await navigator.share({ files: [file], title: snapshot.journey.title });
        setMessage('Share sheet completed.');
      } else {
        download(blob, filename);
        setMessage('PNG download requested.');
      }
    } catch (error) {
      setMessage(
        error instanceof DOMException && error.name === 'AbortError'
          ? 'Sharing cancelled.'
          : error instanceof Error
            ? error.message
            : 'Sharing failed. Try downloading the image.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function copyLink() {
    const url = new URL('/pathways/' + journeyId, window.location.origin).href;
    if (link.current) link.current.value = url;
    try {
      await navigator.clipboard.writeText(url);
      setMessage(
        'Journey link copied. Your name and watch progress are private.',
      );
    } catch {
      link.current?.focus();
      link.current?.select();
      setMessage('Copy the selected journey link manually.');
    }
  }

  return (
    <div className="mt-5 grid min-w-0 gap-6 rounded-2xl border border-emerald-300/20 bg-slate-950/70 p-4 sm:p-6 lg:grid-cols-2">
      <div className="min-w-0 space-y-4">
        <p className="text-sm text-slate-300">
          Create a personal journey poster, carry your viewing itinerary, or
          celebrate completing the pathway.
        </p>
        <label className="grid gap-2 text-sm">
          Name on graphic (optional)
          <input
            value={name}
            maxLength={40}
            onChange={(event) => setName(event.target.value)}
            className={control}
            autoComplete="off"
          />
        </label>
        <label className="grid gap-2 text-sm">
          Poster palette
          <select
            value={color}
            onChange={(event) => setColor(event.target.value as PosterColor)}
            className={control}
          >
            {Object.keys(posterColors).map((value) => (
              <option key={value} value={value} className="bg-slate-950">
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={includeProgress}
            onChange={(event) => setIncludeProgress(event.target.checked)}
          />
          Include my watched status in poster and itinerary
        </label>
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={isCertificate}
            disabled={!snapshot.progress.isComplete}
            onChange={(event) => setCertificate(event.target.checked)}
          />
          Completion certificate
        </label>
        <p className="text-xs text-slate-400">
          {snapshot.progress.isComplete
            ? 'Your self-reported completion certificate is unlocked. It includes your watched total.'
            : 'Watch every title in this journey to unlock its completion certificate.'}
        </p>
        <p className="text-xs text-slate-400">
          The graphic includes your entered name. Watch status is optional for
          posters and itineraries. Exports contain public title and chapter
          names, with story details protected.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={control}
            disabled={!isLoaded || busy || !!imageError}
            onClick={() => image(false)}
          >
            Download PNG
          </button>
          <button
            type="button"
            className={control}
            disabled={!isLoaded || busy || !!imageError}
            onClick={() => image(true)}
          >
            Share graphic
          </button>
          <button
            type="button"
            className={control}
            disabled={!isLoaded}
            onClick={() => {
              download(
                new Blob([createItinerary(snapshot, includeProgress)], {
                  type: 'text/plain;charset=utf-8',
                }),
                journeyId + '-itinerary.txt',
              );
              setMessage('Itinerary download requested.');
            }}
          >
            Download itinerary
          </button>
          <button type="button" className={control} onClick={copyLink}>
            Copy journey link
          </button>
        </div>
        <input
          ref={link}
          readOnly
          aria-label="Public journey link"
          className={control + ' w-full min-w-0'}
          placeholder="Copy journey link to reveal the address"
        />
        <p role="status" className="text-sm text-emerald-200">
          {busy ? 'Preparing graphic…' : message}
        </p>
        {imageError && (
          <p role="alert" className="text-sm text-amber-200">
            {imageError}
          </p>
        )}
      </div>
      <figure className="min-w-0">
        <canvas
          ref={canvas}
          aria-label="Journey graphic preview"
          role="img"
          className="h-auto w-full rounded-xl border border-white/10"
        />
        <figcaption className="mt-3 text-sm text-slate-300">
          {text.heading} · {text.journey} · {text.name} · {text.detail}
        </figcaption>
      </figure>
    </div>
  );
}
