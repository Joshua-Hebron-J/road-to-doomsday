import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const mod = { exports: {} };
  cache.set(file, mod);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
    },
  }).outputText;
  vm.runInNewContext('(function(require,module,exports){' + code + '\n})')(
    (name) => load(path.resolve(path.dirname(file), name + '.ts')),
    mod,
    mod.exports,
  );
  return mod.exports;
}
const { createShareSnapshot, createItinerary, posterText } = load(
  path.join(root, 'app/lib/journey-sharing.ts'),
);

test("sharing normalizes watched IDs without changing the caller's saved data", () => {
  const saved = ['iron-man', 'foreign', 'iron-man'];
  const snapshot = createShareSnapshot('the-doom-essential', saved);
  assert.equal(snapshot.progress.completedCount, 1);
  assert.equal(snapshot.watchedIds.length, 1);
  assert.deepEqual(saved, ['iron-man', 'foreign', 'iron-man']);
  assert.throws(() => createShareSnapshot('unknown', []), /existing journey/);
});

test('completion certificates require every valid journey title', () => {
  const empty = createShareSnapshot('the-doom-essential', []);
  assert.throws(
    () => posterText(empty, '', false, true),
    /Complete this journey/,
  );
  const partial = createShareSnapshot(
    empty.journey.id,
    empty.movies.slice(1).map((movie) => movie.id),
  );
  assert.throws(() => posterText(partial, '', false, true));
  const complete = createShareSnapshot(
    empty.journey.id,
    empty.movies.map((movie) => movie.id),
  );
  assert.equal(
    posterText(complete, '', false, true).heading,
    'JOURNEY COMPLETE',
  );
  assert(
    posterText(complete, '', false, true).footer.includes('Self-reported'),
  );
});

test('posters omit progress by default and sanitize names without rendering story details', () => {
  const snapshot = createShareSnapshot('the-doom-essential', ['iron-man']);
  const privatePoster = posterText(snapshot, '  Test\nName  ', false, false);
  assert.equal(privatePoster.name, 'Test Name');
  assert(!privatePoster.detail.includes('watched'));
  assert(posterText(snapshot, '', true, false).detail.startsWith('1 / '));
  assert.equal(
    Array.from(posterText(snapshot, '😀'.repeat(100), false, false).name)
      .length,
    40,
  );
  const json = JSON.stringify(privatePoster);
  for (const movie of snapshot.movies) {
    assert(!json.includes(movie.description));
    assert(!json.includes(movie.whyItMatters));
  }
});

test('itineraries preserve chapter order, runtime and public names with optional watch status', () => {
  const snapshot = createShareSnapshot('the-doom-essential', ['iron-man']);
  const neutral = createItinerary(snapshot, false);
  const personal = createItinerary(snapshot, true);
  let previous = -1;
  for (const movie of snapshot.movies) {
    const index = neutral.indexOf(movie.title + ' (' + movie.year + ')');
    assert(index > previous);
    previous = index;
    assert(!neutral.includes(movie.description));
    assert(!neutral.includes(movie.whyItMatters));
  }
  assert(!neutral.includes('[watched]'));
  assert(!neutral.includes('[to watch]'));
  assert(personal.includes('[watched] Iron Man'));
  assert(personal.includes('[to watch]'));
  assert(neutral.includes('126 min'));
});
