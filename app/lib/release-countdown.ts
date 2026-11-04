// The date is official; midnight Eastern is this archive's countdown convention,
// not a confirmed screening time. Keep verification and the source beside it.
export const DOOMSDAY_RELEASE = {
  date: '2026-12-18',
  label: 'December 18, 2026',
  market: 'US theatrical release',
  countdownTarget: '2026-12-18T00:00:00-05:00',
  verifiedOn: '2026-11-04',
  source: 'https://movies.disney.com/avengers-doomsday',
} as const;

export const RELEASE_TARGET_MS = Date.parse(DOOMSDAY_RELEASE.countdownTarget);

export function getReleaseCountdown(now: number, target = RELEASE_TARGET_MS) {
  if (!Number.isFinite(now) || !Number.isFinite(target)) return null;
  const remaining = target - now;
  if (!Number.isFinite(remaining)) return null;
  const totalSeconds = Math.max(0, Math.ceil(remaining / 1000));
  return {
    reached: now >= target,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function describeCountdown(now: number) {
  const value = getReleaseCountdown(now);
  if (!value) return `Countdown unavailable. The scheduled US release date is ${DOOMSDAY_RELEASE.label}.`;
  if (value.reached) return 'The scheduled release date has arrived. Check Disney for current release information.';
  return `${value.days} days, ${value.hours} hours, ${value.minutes} minutes and ${value.seconds} seconds until the archive’s release-date marker.`;
}

// Stable snapshots follow the same external-store pattern as saved progress.
// A single interval is shared only while a visible, unpaused view subscribes.
let snapshot: number | null = null;
let interval: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function stop() {
  if (interval !== undefined) clearInterval(interval);
  interval = undefined;
}

function tick() {
  snapshot = Date.now();
  if (snapshot >= RELEASE_TARGET_MS) stop();
  listeners.forEach((listener) => listener());
}

function visibilityChanged() {
  stop();
  if (!document.hidden) {
    tick();
    if (snapshot !== null && snapshot < RELEASE_TARGET_MS)
      interval = setInterval(tick, 1000);
  }
}

export function subscribeReleaseClock(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    document.addEventListener('visibilitychange', visibilityChanged);
    visibilityChanged();
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      stop();
      document.removeEventListener('visibilitychange', visibilityChanged);
    }
  };
}

export const getReleaseClockSnapshot = () => snapshot;
export const getReleaseClockServerSnapshot = () => null;
export const subscribePausedClock = () => () => {};
