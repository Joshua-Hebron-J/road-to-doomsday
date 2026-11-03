import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';
const cache = new Map();
function load(filename) {
  filename = path.resolve(filename);
  if (cache.has(filename)) return cache.get(filename).exports;
  const loaded = { exports: {} };
  cache.set(filename, loaded);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  vm.runInNewContext('(function(require,module,exports){' + code + '\n})', {
    console,
  })(
    (name) => load(path.resolve(path.dirname(filename), name + '.ts')),
    loaded,
    loaded.exports,
  );
  return loaded.exports;
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { REALMS, REALM_JOURNEY, canReadRealm } = load(
  path.join(root, 'app/data/realms.ts'),
);
const { getJourneyById, getJourneyChapters, getMovieById } = load(
  path.join(root, 'app/lib/journey.ts'),
);

test('all roadmap destinations are present with distinct valid map positions', () => {
  assert.deepEqual(
    Array.from(REALMS, (realm) => realm.id),
    ['earth-616', 'earth-838', 'void', 'quantum', 'battleworld'],
  );
  assert.equal(
    new Set(REALMS.map((realm) => realm.position.join(','))).size,
    5,
  );
  assert.equal(new Set(REALMS.map((realm) => realm.map.join(','))).size, 5);
  for (const realm of REALMS) {
    assert.ok(
      realm.map.every((coordinate) => coordinate >= 15 && coordinate <= 85),
    );
    assert.equal(new URL(realm.source).protocol, 'https:');
  }
});

test('screen destinations resolve to an existing title and viewing chapter', () => {
  const journey = getJourneyById(REALM_JOURNEY);
  assert.ok(journey);
  for (const realm of REALMS.filter((realm) => realm.movieId)) {
    assert.ok(getMovieById(realm.movieId));
    assert.ok(journey.movieIds.includes(realm.movieId));
    assert.ok(
      getJourneyChapters(journey.id).some((chapter) =>
        chapter.movieIds.includes(realm.movieId),
      ),
    );
  }
});

test('realm reveal respects the linked title and comics require deliberate reveal', () => {
  const earth = REALMS.find((realm) => realm.id === 'earth-838');
  const battleworld = REALMS.find((realm) => realm.id === 'battleworld');
  assert.equal(canReadRealm(earth, ['loki-s1'], false), false);
  assert.equal(canReadRealm(earth, [earth.movieId], false), true);
  assert.equal(battleworld.movieId, undefined);
  assert.match(battleworld.caption, /^Marvel Comics/);
  assert.equal(canReadRealm(battleworld, [earth.movieId], false), false);
  assert.equal(canReadRealm(battleworld, [], true), true);
});
