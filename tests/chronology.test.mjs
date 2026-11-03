import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function runtime(blocked = false) {
  const cache = new Map(),
    storage = new Map(),
    handlers = new Set();
  let writes = 0;
  const window = {
    localStorage: {
      getItem: (k) => {
        if (blocked) throw Error('blocked');
        return storage.get(k) ?? null;
      },
      setItem: (k, v) => {
        if (blocked) throw Error('blocked');
        writes++;
        storage.set(k, v);
      },
    },
    addEventListener: (_, fn) => handlers.add(fn),
    removeEventListener: (_, fn) => handlers.delete(fn),
  };
  function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file).exports;
    const mod = { exports: {} };
    cache.set(file, mod);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
    vm.runInNewContext('(function(require,module,exports){' + code + '\n})', {
      window,
      console,
    })(
      (name) => load(path.resolve(path.dirname(file), name + '.ts')),
      mod,
      mod.exports,
    );
    return mod.exports;
  }
  return {
    api: load(path.join(root, 'app/lib/chronology.ts')),
    store: load(path.join(root, 'app/lib/timeline-preferences-store.ts')),
    storage,
    handlers,
    writes: () => writes,
  };
}
test('story order preserves dated years and separate yearless domains', () => {
  const { api } = runtime();
  const list = api.getChronology('story', api.DEFAULT_TIMELINE.journeyId);
  assert.equal(list.length, 6);
  assert.equal(list[0].event.chronology.year, 2024);
  assert.equal(list[1].event.chronology.year, 2025);
  assert.equal(list.filter((e) => e.domain === 'Outside time').length, 2);
  assert.equal(list.filter((e) => e.domain === 'Undated archive').length, 2);
  const scene = api.getChronologyScene(list, 'story', false, () => false);
  assert.equal(scene.edges.length, 1);
  assert.ok(scene.nodes.every((n) => !n.label.includes('Convergence')));
  assert.equal(new Set(scene.nodes.map((n) => n.position[1])).size, 3);
});
test('release chronology uses verified precise dates, including streaming premieres', () => {
  const { api } = runtime();
  const list = api.getChronology('release', api.DEFAULT_TIMELINE.journeyId);
  assert.equal(
    list.map((e) => e.movie.release.date).join(','),
    '2021-06-09,2021-12-17,2022-05-06,2023-10-05,2024-07-26,2025-07-25',
  );
  for (const e of list) {
    assert.equal(e.movie.year, Number(e.movie.release.date.slice(0, 4)));
    assert.match(
      e.movie.release.source,
      /^https:\/\/(www.marvel.com|d23.com|press.disneyplus.com)\//,
    );
  }
  assert.equal(
    list.filter((e) => e.movie.release.kind === 'streaming-premiere').length,
    2,
  );
  assert.equal(
    api.getChronologyScene(list, 'release', false, () => false).edges.length,
    5,
  );
});
test('chapter boundaries, unknown journeys, empty queues and invalid indices are safe', () => {
  const { api } = runtime();
  assert.equal(api.getChronology('story', 'missing').length, 0);
  assert.equal(
    api.getChronology(
      'story',
      api.DEFAULT_TIMELINE.journeyId,
      'chapter-doom-origins',
    ).length,
    0,
  );
  assert.equal(
    api.getChronology(
      'story',
      api.DEFAULT_TIMELINE.journeyId,
      'chapter-doom-fractures',
    ).length,
    4,
  );
  assert.equal(
    api.getChronology(
      'story',
      api.DEFAULT_TIMELINE.journeyId,
      'chapter-doom-horizon',
    ).length,
    2,
  );
  assert.equal(
    api.getChronology('story', api.DEFAULT_TIMELINE.journeyId, 'missing')
      .length,
    0,
  );
  const id = api.normalizeTimelinePreferences({ version: 1 }).journeyId;
  assert.equal(api.clampTimelineIndex(99, 6), 5);
  assert.equal(api.clampTimelineIndex(-1, 6), 0);
  assert.equal(api.clampTimelineIndex(NaN, 0), 0);
  assert.equal(
    api.getChronologyScene([], 'story', false, () => false).nodes.length,
    0,
  );
  assert.ok(id);
});
test('preferences validate version, foreign chapter and event without losing valid selection on mode change', () => {
  const { api } = runtime();
  assert.equal(api.normalizeTimelinePreferences({ version: 2 }).mode, 'story');
  const selectedId = 'event-god-of-stories';
  const p = api.normalizeTimelinePreferences({
    version: 1,
    mode: 'release',
    selectedId,
    journeyId: 'bad',
    chapterId: 'bad',
  });
  assert.equal(p.selectedId, selectedId);
  assert.equal(p.chapterId, 'all');
  assert.ok(
    api
      .getChronology(p.mode, p.journeyId)
      .some((e) => e.event.id === p.selectedId),
  );
});
test('store hydrates without writes, updates subscribers and restores preferences', () => {
  const r = runtime();
  const key = r.store.TIMELINE_KEY;
  r.storage.set(key, '{broken');
  r.store.getTimelineSnapshot();
  assert.equal(r.writes(), 0);
  let calls = 0;
  const unsub = r.store.subscribeTimeline(() => calls++);
  r.store.updateTimeline({ mode: 'release' });
  assert.equal(calls, 1);
  assert.equal(r.store.getTimelineSnapshot().preferences.mode, 'release');
  assert.equal(r.writes(), 1);
  r.storage.set(
    key,
    JSON.stringify({
      ...r.api.DEFAULT_TIMELINE,
      selectedId: 'event-anchor-decay',
    }),
  );
  for (const fn of r.handlers) fn({ key });
  assert.equal(
    r.store.getTimelineSnapshot().preferences.selectedId,
    'event-anchor-decay',
  );
  assert.equal(calls, 2);
  unsub();
  assert.equal(r.handlers.size, 0);
});
test('blocked storage retains session state without touching watch progress', () => {
  const r = runtime(true);
  r.store.getTimelineSnapshot();
  r.store.updateTimeline({ mode: 'release' });
  assert.equal(r.store.getTimelineSnapshot().preferences.mode, 'release');
  assert.ok(r.store.getTimelineSnapshot().error);
  assert.equal(r.storage.size, 0);
});
