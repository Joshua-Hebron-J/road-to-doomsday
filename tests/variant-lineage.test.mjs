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
const { getVariants, getVariantContext, canReadVariant } = load(
  path.join(root, 'app/lib/variant-lineage.ts'),
);
const { CHARACTERS, VARIANTS } = load(path.join(root, 'app/data/variants.ts'));
const { getAllJourneys, getMovieById } = load(
  path.join(root, 'app/lib/journey.ts'),
);
const journeys = getAllJourneys();

test('all roadmap identities have distinct records and valid source or catalog references', () => {
  assert.equal(CHARACTERS.length, 5);
  assert.equal(new Set(VARIANTS.map(({ id }) => id)).size, VARIANTS.length);
  for (const character of CHARACTERS) {
    assert.ok(getVariants(character.id).length >= 2);
  }
  for (const variant of VARIANTS) {
    assert.equal(new URL(variant.source).protocol, 'https:');
    assert.ok(
      variant.movieId ? getMovieById(variant.movieId) : variant.externalTitle,
    );
  }
});

test('filtering by reality preserves character identity and does not infer shared origins', () => {
  const [reed] = getVariants('reed', 'Earth-838');
  assert.equal(reed.id, 'reed-838');
  assert.equal(getVariants('reed', 'Earth-838').length, 1);
  assert.equal(getVariants('loki', 'Earth-838').length, 0);
  assert.equal(
    getVariants('doom', 'Undesignated')[0].medium,
    'Cast announcement',
  );
});

test('catalog variants resolve to real journey chapters while external entries stay outside watch progress', () => {
  const reed = getVariants('reed', 'Earth-828')[0];
  const context = getVariantContext(
    reed,
    journeys.find((j) => j.movieIds.includes(reed.movieId)),
  );
  assert.equal(context.included, true);
  assert.ok(context.chapter.movieIds.includes(reed.movieId));
  const outside = getVariantContext(reed, { ...journeys[0], movieIds: [] });
  assert.equal(outside.included, false);
  assert.equal(outside.chapter, undefined);
  assert.ok(
    outside.otherJourneys.every((j) => j.movieIds.includes(reed.movieId)),
  );
  assert.equal(
    getVariantContext(getVariants('doom')[0], journeys[0]).movie,
    undefined,
  );
});

test('story notes unlock by matching watched title or explicit reveal; announcements are public', () => {
  const [legacy, announcement] = getVariants('doom');
  const [wanda] = getVariants('wanda');
  assert.equal(canReadVariant(wanda, ['iron-man'], false), false);
  assert.equal(canReadVariant(wanda, [wanda.movieId], false), true);
  assert.equal(canReadVariant(legacy, [], false), false);
  assert.equal(canReadVariant(legacy, [], true), true);
  assert.equal(canReadVariant(announcement, [], false), true);
});
