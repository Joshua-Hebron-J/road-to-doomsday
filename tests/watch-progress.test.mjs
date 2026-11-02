import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const __dirname = path.dirname(
  new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'),
);

// Execute the real TypeScript store and data in isolated browser-like module contexts.
function runtime(storage = new Map(), blocked = false) {
  const events = new EventTarget();
  let failWrites = false;
  const localStorage = {
    getItem(key) {
      if (blocked) throw Error('blocked');
      return storage.get(key) ?? null;
    },
    setItem(key, value) {
      if (blocked || failWrites) throw Error('quota');
      storage.set(key, value);
    },
    removeItem(key) {
      if (blocked || failWrites) throw Error('quota');
      storage.delete(key);
    },
  };
  const window = {
    localStorage,
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
    dispatchEvent: events.dispatchEvent.bind(events),
  };
  class CustomEvent extends Event {
    constructor(name, options) {
      super(name);
      this.detail = options.detail;
    }
  }
  const cache = new Map();
  function load(filename) {
    filename = path.resolve(filename);
    if (cache.has(filename)) return cache.get(filename).exports;
    const loadedModule = { exports: {} };
    cache.set(filename, loadedModule);
    const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
    vm.runInNewContext('(function(require,module,exports){' + output + '\n})', {
      window,
      CustomEvent,
      console,
    })(
      (name) => load(path.resolve(path.dirname(filename), name + '.ts')),
      loadedModule,
      loadedModule.exports,
    );
    return loadedModule.exports;
  }
  return {
    store: load(path.join(__dirname, '../app/lib/watch-progress-store.ts'))
      .getProgressStore,
    journey: load(path.join(__dirname, '../app/lib/journey.ts')),
    validate: load(path.join(__dirname, '../app/lib/validate-data.ts'))
      .validateDataIntegrity,
    failWrites() {
      failWrites = true;
    },
    storageEvent(key) {
      const event = new Event('storage');
      Object.assign(event, { key, storageArea: localStorage });
      events.dispatchEvent(event);
    },
  };
}
const doom = 'the-doom-essential';
const nexus = 'the-incursion-nexus';
const key = 'rtd_journey_progress_' + doom;
const ids = (store) => Array.from(store.getSnapshot().watchedIds);

test('data and chapter queues remain coherent', () => {
  const r = runtime();
  assert.equal(r.validate().valid, true);
  for (const journey of r.journey.getAllJourneys()) {
    assert.deepEqual(
      Array.from(
        r.journey.getJourneyChapters(journey.id).flatMap((c) => c.movieIds),
      ),
      Array.from(journey.movieIds),
    );
  }
});
test('stable hydration snapshots never write saved progress', () => {
  const storage = new Map([
    [
      key,
      JSON.stringify({ version: 1, journeyId: doom, watchedIds: ['iron-man'] }),
    ],
  ]);
  const store = runtime(storage).store(doom);
  assert.equal(store.getServerSnapshot().isLoaded, false);
  assert.deepEqual(ids(store), ['iron-man']);
  assert.equal(store.getSnapshot(), store.getSnapshot());
  assert.equal(storage.size, 1);
});
test('rapid toggles, idempotent marking, persistence, and journey isolation', () => {
  const storage = new Map();
  const r = runtime(storage);
  const store = r.store(doom);
  let notifications = 0;
  const unsubscribe = store.subscribe(() => notifications++);
  store.toggleWatched('iron-man');
  store.toggleWatched('iron-man');
  assert.deepEqual(ids(store), []);
  store.markWatched('iron-man');
  store.markWatched('iron-man');
  store.markWatched('invalid');
  assert.deepEqual(ids(store), ['iron-man']);
  assert.ok(notifications > 0);
  assert.deepEqual(ids(runtime(storage).store(doom)), ['iron-man']);
  assert.deepEqual(ids(r.store(nexus)), []);
  store.markUnwatched('iron-man');
  assert.deepEqual(ids(store), []);
  unsubscribe();
});
test('cross-tab changes and localStorage.clear events refresh subscribers', () => {
  const storage = new Map();
  const a = runtime(storage).store(doom);
  const b = runtime(storage);
  const target = b.store(doom);
  const unsubscribe = target.subscribe(() => {});
  target.getSnapshot();
  a.markWatched('iron-man');
  b.storageEvent(key);
  assert.deepEqual(ids(target), ['iron-man']);
  storage.clear();
  b.storageEvent(null);
  assert.deepEqual(ids(target), []);
  unsubscribe();
});
test('malformed, mismatched, duplicate, and foreign saved IDs are safe', () => {
  for (const raw of [
    '{',
    'null',
    JSON.stringify({ version: 1, journeyId: nexus, watchedIds: ['iron-man'] }),
  ]) {
    assert.deepEqual(ids(runtime(new Map([[key, raw]])).store(doom)), []);
  }
  const raw = JSON.stringify({
    version: 1,
    journeyId: doom,
    watchedIds: ['iron-man', 'iron-man', 'unknown', 12],
    lastWatchedId: 'unknown',
  });
  const store = runtime(new Map([[key, raw]])).store(doom);
  assert.deepEqual(ids(store), ['iron-man']);
  assert.equal(store.getSnapshot().lastWatchedId, 'iron-man');
});
test('blocked reads and quota failures preserve session state and report errors', () => {
  for (const blocked of [true, false]) {
    const r = runtime(new Map(), blocked);
    const store = r.store(doom);
    store.getSnapshot();
    r.failWrites();
    store.markWatched('iron-man');
    assert.deepEqual(ids(store), ['iron-man']);
    assert.ok(store.getSnapshot().storageError);
    store.markUnwatched('iron-man');
    assert.deepEqual(ids(store), []);
    assert.ok(store.getSnapshot().storageError);
    store.markAllWatched();
    assert.equal(ids(store).length, 9);
    assert.ok(store.getSnapshot().storageError);
    store.resetProgress();
    assert.deepEqual(ids(store), []);
    assert.ok(store.getSnapshot().storageError);
  }
});
test('metrics, next recommendation, completion, and isolated reset', () => {
  const r = runtime();
  const store = r.store(doom);
  const other = r.store(nexus);
  other.markWatched('loki-s1');
  store.markWatched('iron-man');
  const progress = r.journey.calculateJourneyProgress(doom, ids(store));
  assert.equal(progress.progressPercentage, 11);
  assert.equal(progress.remainingRuntimeMinutes, 1443);
  assert.equal(
    r.journey.getNextJourneyMovie(doom, ids(store)).id,
    'avengers-infinity-war',
  );
  store.markAllWatched();
  assert.equal(
    r.journey.calculateJourneyProgress(doom, ids(store)).isComplete,
    true,
  );
  assert.equal(r.journey.getNextJourneyMovie(doom, ids(store)), undefined);
  store.resetProgress();
  assert.deepEqual(ids(store), []);
  assert.deepEqual(ids(other), ['loki-s1']);
});
