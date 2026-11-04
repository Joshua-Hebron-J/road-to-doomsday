import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const mod = { exports: {} };
  cache.set(file, mod);
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInNewContext("(function(require,module,exports){" + code + "\n})")(
    (name) => load(path.resolve(path.dirname(file), name + ".ts")), mod, mod.exports,
  );
  return mod.exports;
}
const { searchArchive, searchIndex } = load(path.join(root, "app/lib/archive-search.ts"));
const { chapters } = load(path.join(root, "app/data/chapters.ts"));
const { movies } = load(path.join(root, "app/data/movies.ts"));

test("search covers the catalog and ranks exact identity ahead of partial titles", () => {
  assert.equal(searchIndex.filter((entry) => entry.kind === "title").length, movies.length);
  assert.equal(searchArchive("  LOKI ")[0].title, "Loki");
  assert.equal(searchArchive("phase 4", "phase")[0].phase, 4);
  assert.equal(searchArchive("<script>nothing</script>").length, 0);
  assert.equal(searchArchive("   ").length, searchIndex.length);
  const keys = searchIndex.map((entry) => entry.kind + ":" + entry.id);
  assert.equal(new Set(keys).size, keys.length);
});

test("phase, type and theme filters intersect the existing chapter membership", () => {
  const chapter = chapters[0];
  const results = searchArchive("", "title", "1", chapter.id);
  assert.equal(results.length, 1);
  assert.equal(results[0].movieId, "iron-man");
  assert.equal(searchArchive("", "character", "1").length, 0);
  assert.equal(searchArchive("", "", "", "foreign-theme").length, 0);
  assert(searchArchive("foundations", "title").some((entry) => entry.movieId === "iron-man"));
});

test("search exposes public names and metadata without indexing protected narrative details", () => {
  for (const movie of movies) {
    const entry = searchIndex.find((entry) => entry.movieId === movie.id);
    assert(entry);
    assert(!JSON.stringify(entry).includes(movie.description));
    assert(!JSON.stringify(entry).includes(movie.whyItMatters));
  }
  for (const entry of searchIndex) {
    if (entry.href) assert(entry.href.startsWith("/"));
    if (entry.kind === "theme") assert(chapters.some((chapter) => entry.href.endsWith(chapter.id + "-trigger")));
  }
});
