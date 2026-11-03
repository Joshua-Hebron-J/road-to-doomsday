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
const { ARCHIVE_SECTIONS, TVA_JOURNEY, canOpenArchive, LOOM_STAGES } = load(
  path.join(root, 'app/data/tva-archive.ts'),
);
const { getJourneyById, getJourneyChapters, getMovieById } = load(
  path.join(root, 'app/lib/journey.ts'),
);

test('every archive links to a valid season and chapter in the existing TVA journey', () => {
  const journey = getJourneyById(TVA_JOURNEY);
  assert.ok(journey);
  assert.equal(new Set(ARCHIVE_SECTIONS.map((section) => section.id)).size, 4);
  for (const section of ARCHIVE_SECTIONS) {
    assert.ok(getMovieById(section.season));
    assert.ok(journey.movieIds.includes(section.season));
    assert.ok(
      getJourneyChapters(journey.id).some((chapter) =>
        chapter.movieIds.includes(section.season),
      ),
    );
  }
});

test('watching one season does not unseal another season, but explicit reveal works', () => {
  assert.equal(canOpenArchive('loki-s1', [], false), false);
  assert.equal(canOpenArchive('loki-s1', ['loki-s1'], false), true);
  assert.equal(canOpenArchive('loki-s2', ['loki-s1'], false), false);
  assert.equal(canOpenArchive('loki-s2', [], true), true);
});

test('Loom stages distinguish growing pressure from the single-strand failsafe', () => {
  const [intake, weave, overload, failsafe] = LOOM_STAGES;
  assert.ok(intake.strands < weave.strands && weave.strands < overload.strands);
  assert.equal(failsafe.strands, 1);
  assert.equal(new Set(LOOM_STAGES.map((stage) => stage.title)).size, 4);
});
