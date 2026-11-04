import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../app/lib/release-countdown.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;

function runtime(initial = Date.parse('2026-11-04T12:00:00Z')) {
  let now = initial;
  let id = 0;
  const intervals = new Map();
  const events = new Map();
  const document = {
    hidden: false,
    addEventListener(type, callback) { events.set(type, callback); },
    removeEventListener(type, callback) { if (events.get(type) === callback) events.delete(type); },
  };
  const api = {};
  vm.runInNewContext(code, {
    exports: api,
    Date: class extends Date { static now() { return now; } },
    document,
    setInterval(callback, delay) { assert.equal(delay, 1000); intervals.set(++id, callback); return id; },
    clearInterval(key) { intervals.delete(key); },
  });
  return {
    api, intervals, events,
    advance(value) { now = value; for (const tick of [...intervals.values()]) tick(); },
    hidden(value, at = now) { now = at; document.hidden = value; events.get('visibilitychange')?.(); },
  };
}
const plain = (value) => JSON.parse(JSON.stringify(value));

test('countdown decomposes absolute time and never reports zero before the date marker', () => {
  const { api } = runtime();
  const target = api.RELEASE_TARGET_MS;
  assert.deepEqual(plain(api.getReleaseCountdown(target - ((2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000))),
    { reached: false, days: 2, hours: 3, minutes: 4, seconds: 5 });
  assert.equal(api.getReleaseCountdown(target - 1).seconds, 1);
  assert.equal(api.getReleaseCountdown(target).reached, true);
});

test('the release-date convention is a fixed Eastern instant independent of viewer timezone', () => {
  const { api } = runtime();
  assert.equal(api.RELEASE_TARGET_MS, Date.parse('2026-12-18T05:00:00Z'));
  const utc = Date.parse('2026-12-17T05:00:00Z');
  const india = Date.parse('2026-12-17T10:30:00+05:30');
  assert.deepEqual(plain(api.getReleaseCountdown(utc)), plain(api.getReleaseCountdown(india)));
  assert.equal(api.getReleaseCountdown(utc).days, 1);
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(api.RELEASE_TARGET_MS).map((part) => [part.type, part.value]));
  assert.equal(`${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`, '2026-12-18 00:00');
  const before = api.getReleaseCountdown(Date.parse('2026-11-01T01:30:00-04:00'));
  const after = api.getReleaseCountdown(Date.parse('2026-11-01T01:30:00-05:00'));
  const seconds = (value) => value.days * 86400 + value.hours * 3600 + value.minutes * 60 + value.seconds;
  assert.equal(seconds(before) - seconds(after), 3600);
});

test('past and invalid inputs are safe and do not assert current theatrical availability', () => {
  const { api } = runtime();
  assert.deepEqual(plain(api.getReleaseCountdown(api.RELEASE_TARGET_MS + 10000000)),
    { reached: true, days: 0, hours: 0, minutes: 0, seconds: 0 });
  for (const value of [NaN, Infinity, -Infinity]) {
    assert.equal(api.getReleaseCountdown(value), null);
    assert.equal(api.getReleaseCountdown(0, value), null);
  }
  assert.match(api.describeCountdown(api.RELEASE_TARGET_MS), /Check Disney/);
  assert.match(api.describeCountdown(NaN), /unavailable/);
  assert.equal(api.getReleaseCountdown(-Number.MAX_VALUE, Number.MAX_VALUE), null);
});

test('clock snapshots hydrate safely, share one timer, suspend when hidden and clean up completely', () => {
  const clock = runtime();
  const { api } = clock;
  assert.equal(api.getReleaseClockServerSnapshot(), null);
  assert.equal(api.getReleaseClockSnapshot(), null);
  assert.equal(clock.intervals.size, 0);
  let first = 0, second = 0;
  const off1 = api.subscribeReleaseClock(() => first++);
  const off2 = api.subscribeReleaseClock(() => second++);
  assert.equal(clock.intervals.size, 1);
  const previous = api.getReleaseClockSnapshot();
  clock.advance(previous + 1000);
  assert.equal(api.getReleaseClockSnapshot(), previous + 1000);
  assert(first > 0 && second > 0);
  clock.hidden(true);
  assert.equal(clock.intervals.size, 0);
  clock.hidden(false, previous + 60000);
  assert.equal(api.getReleaseClockSnapshot(), previous + 60000);
  assert.equal(clock.intervals.size, 1);
  off1(); assert.equal(clock.intervals.size, 1);
  off2(); assert.equal(clock.intervals.size, 0); assert.equal(clock.events.size, 0);
  api.subscribePausedClock(() => {})();
  assert.equal(clock.intervals.size, 0);
  assert.equal(api.getReleaseClockServerSnapshot(), null);
});

test('the clock stops at the deadline and re-subscribing reads actual time rather than accumulating ticks', () => {
  const target = Date.parse('2026-12-18T05:00:00Z');
  const clock = runtime(target - 1500);
  const off = clock.api.subscribeReleaseClock(() => {});
  clock.advance(target + 10);
  assert.equal(clock.intervals.size, 0);
  assert.equal(clock.api.getReleaseCountdown(clock.api.getReleaseClockSnapshot()).reached, true);
  off();
  clock.advance(target + 100000);
  const off2 = clock.api.subscribeReleaseClock(() => {});
  assert.equal(clock.api.getReleaseClockSnapshot(), target + 100000);
  assert.equal(clock.intervals.size, 0);
  off2(); assert.equal(clock.events.size, 0);
});
