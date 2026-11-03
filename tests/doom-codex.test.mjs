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
const { armorSystems, doomSources, doomAnnouncement } = load(
  path.join(root, 'app/data/doom-codex.ts'),
);
const { VARIANTS } = load(path.join(root, 'app/data/variants.ts'));

test('the MCU codex reuses the public lineage announcement without inventing a watch entry', () => {
  assert.equal(
    doomAnnouncement,
    VARIANTS.find((entry) => entry.id === 'doom-doomsday'),
  );
  assert.equal(doomAnnouncement.medium, 'Cast announcement');
  assert.equal(doomAnnouncement.reality, 'Undesignated');
  assert.equal(doomAnnouncement.movieId, undefined);
});

test('each armor selection maps to a distinct marker within the schematic', () => {
  assert.equal(new Set(armorSystems.map(({ id }) => id)).size, 4);
  assert.equal(
    new Set(armorSystems.map(({ point }) => point.join(','))).size,
    4,
  );
  for (const {
    point: [x, y],
    analysis,
  } of armorSystems) {
    assert.ok(x >= 12 && x <= 348 && y >= 12 && y <= 288);
    assert.ok(analysis.trim());
  }
  for (const url of Object.values(doomSources))
    assert.equal(new URL(url).protocol, 'https:');
});
