'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Badge } from './ui/badge';
import {
  DOOMSDAY_RELEASE,
  describeCountdown,
  getReleaseCountdown,
  getReleaseClockSnapshot,
  getReleaseClockServerSnapshot,
  subscribeReleaseClock,
  subscribePausedClock,
} from '../lib/release-countdown';

const verificationLabel = new Intl.DateTimeFormat('en-US', {
  month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
}).format(new Date(DOOMSDAY_RELEASE.verifiedOn + 'T12:00:00Z'));

export function ReleaseCountdown() {
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  const [frozenAt, setFrozenAt] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const now = useSyncExternalStore(
    visible && frozenAt === null ? subscribeReleaseClock : subscribePausedClock,
    getReleaseClockSnapshot,
    getReleaseClockServerSnapshot,
  );
  const displayedAt = frozenAt ?? now;
  const countdown = displayedAt === null ? null : getReleaseCountdown(displayedAt);
  const reading = displayedAt === null
    ? `Clock loading. Scheduled release: ${DOOMSDAY_RELEASE.label}.`
    : `${frozenAt === null ? '' : 'Paused display. '}${describeCountdown(displayedAt)}`;

  useEffect(() => {
    if (!section.current || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '100px' },
    );
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);

  const units = [
    ['Days', countdown?.days],
    ['Hours', countdown?.hours],
    ['Minutes', countdown?.minutes],
    ['Seconds', countdown?.seconds],
  ] as const;
  const control = 'min-h-11 rounded-md border border-emerald-300/30 px-4 py-2 text-sm text-emerald-100 focus-ring-doom disabled:opacity-50';

  return (
    <section
      ref={section}
      id="countdown"
      aria-labelledby="countdown-title"
      className="relative border-y border-emerald-300/20 bg-[#080f13] px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Badge variant="emerald" size="sm">The final approach</Badge>
          <h2 id="countdown-title" className="mt-5 text-3xl font-black uppercase tracking-wide text-slate-100 sm:text-4xl">
            The road has a horizon.
          </h2>
          <p className="mt-4 text-lg text-emerald-200">Avengers: Doomsday</p>
          <p className="mt-2 text-slate-300">
            <time dateTime={DOOMSDAY_RELEASE.date}>{DOOMSDAY_RELEASE.label}</time>
            {' · '}{DOOMSDAY_RELEASE.market}
          </p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-300">
            Every story led here. Follow your viewing pathway, revisit the connections,
            and carry your archive toward the scheduled theatrical release.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/pathways" className={control}>Prepare your pathway</Link>
            <a href={DOOMSDAY_RELEASE.source} className={control} rel="noreferrer">
              Verify date with Disney
            </a>
          </div>
        </div>
        <div className="min-w-0 rounded-2xl border border-emerald-300/25 bg-[#050b10] p-4 sm:p-7">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-200">
            Release signal / {DOOMSDAY_RELEASE.date}
          </p>
          <div
            role="timer"
            aria-live="off"
            aria-label={reading}
            className="mt-6 grid grid-cols-4 gap-2 text-center sm:gap-4"
          >
            {units.map(([label, value]) => (
              <div key={label} className="min-w-0 border-b border-emerald-300/25 pb-4" aria-hidden="true">
                <span className="block font-mono text-3xl font-semibold tabular-nums text-slate-100 sm:text-5xl">
                  {value === undefined ? '—' : String(value).padStart(2, '0')}
                </span>
                <span className="mt-3 block text-[11px] text-slate-300 sm:text-xs">{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-emerald-200">
            {countdown?.reached
              ? 'The scheduled date has arrived. Check Disney for current release information.'
              : frozenAt !== null ? 'Display paused. Resume to return to the live clock.' : 'Counting toward the scheduled release date.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className={control} disabled={now === null || Boolean(countdown?.reached)}
              onClick={() => {
                setFrozenAt(frozenAt === null ? now : null);
                setAnnouncement(frozenAt === null ? 'Countdown display paused.' : 'Countdown resumed.');
              }}>
              {frozenAt === null ? 'Pause countdown' : 'Resume countdown'}
            </button>
            <button type="button" className={control} disabled={displayedAt === null}
              onClick={() => setAnnouncement(reading)}>
              Read countdown
            </button>
          </div>
          <p role="status" aria-atomic="true" className="sr-only">{announcement}</p>
          <p className="mt-5 text-xs leading-relaxed text-slate-300">
            The archive clock uses your device time and counts to midnight Eastern on
            the US release date. This is a date marker, not a confirmed showtime.
            Dates may change and vary by region.
          </p>
          <p className="mt-3 text-xs text-slate-400">
            Date checked <time dateTime={DOOMSDAY_RELEASE.verifiedOn}>{verificationLabel}</time>.
            {' '}Saved offline copies cannot check for schedule changes.
          </p>
        </div>
      </div>
    </section>
  );
}
