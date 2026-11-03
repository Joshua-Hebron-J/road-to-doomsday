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
const api = load(path.join(root, 'app/lib/prerequisite-graph.ts'));
const journeys = load(path.join(root, 'app/lib/journey.ts'));

test('all canonical journey graphs contain exactly the existing prerequisite edges', () => {
  for (const journey of journeys.getAllJourneys()) {
    const graph = api.getPrerequisiteGraph(journey.id);
    assert.equal(graph.diagnostics.length, 0);
    const ids = new Set(graph.nodes.map((node) => node.id));
    assert.equal(ids.size, graph.nodes.length);
    journey.movieIds.forEach((id) => assert.ok(ids.has(id)));
    const expected = new Set(
      graph.nodes.flatMap((node) =>
        journeys
          .getMovieById(node.id)
          .prerequisites.map((id) => id + '->' + node.id),
      ),
    );
    assert.deepEqual(new Set(graph.edges.map((edge) => edge.id)), expected);
    graph.edges.forEach((edge) => {
      assert.equal(edge.kind, 'story-prerequisite');
      assert.ok(ids.has(edge.source) && ids.has(edge.target));
    });
  }
});
test('Nexus includes full prerequisite ancestry without treating outside stories as tracked', () => {
  const graph = api.getPrerequisiteGraph('the-incursion-nexus');
  for (const id of ['iron-man', 'avengers-infinity-war', 'avengers-endgame'])
    assert.equal(graph.nodes.find((node) => node.id === id).inJourney, false);
  assert.equal(
    graph.nodes.find((node) => node.id === 'loki-s1').inJourney,
    true,
  );
});
test('layout is deterministic and every canonical edge moves forward by dependency depth', () => {
  for (const journey of journeys.getAllJourneys()) {
    const graph = api.getPrerequisiteGraph(journey.id);
    assert.equal(
      JSON.stringify(graph),
      JSON.stringify(api.getPrerequisiteGraph(journey.id)),
    );
    assert.equal(
      new Set(graph.nodes.map((node) => JSON.stringify(node.position))).size,
      graph.nodes.length,
    );
    graph.edges.forEach((edge) => {
      const source = graph.nodes.find((node) => node.id === edge.source),
        target = graph.nodes.find((node) => node.id === edge.target);
      assert.ok(source.depth < target.depth);
      assert.ok(source.position[0] < target.position[0]);
    });
  }
});
test('focused lineage follows incoming edges and excludes unrelated stories', () => {
  const graph = api.getPrerequisiteGraph('the-full-multiverse-chronicle');
  const lineage = api.getPrerequisiteLineage(
    graph,
    'fantastic-four-first-steps',
  );
  assert.ok(
    lineage.has('iron-man') &&
      lineage.has('loki-s1') &&
      lineage.has('doctor-strange-in-the-multiverse-of-madness'),
  );
  assert.equal(lineage.has('thunderbolts'), false);
  assert.deepEqual(Array.from(api.getPrerequisiteLineage(graph, 'iron-man')), [
    'iron-man',
  ]);
  assert.equal(api.getPrerequisiteLineage(graph, 'missing').size, 0);
});
test('cycles, duplicate prerequisites, and missing references do not cause recursive failure', () => {
  const catalog = [
    { id: 'a', year: 2020, prerequisites: ['b', 'b', 'missing'] },
    { id: 'b', year: 2019, prerequisites: ['a'] },
  ];
  const graph = api.createPrerequisiteGraph(['a'], catalog);
  assert.equal(graph.nodes.length, 2);
  assert.equal(graph.edges.length, 2);
  assert.ok(graph.diagnostics.some((value) => value.includes('Cycle')));
  assert.ok(graph.diagnostics.some((value) => value.includes('Unknown')));
  assert.equal(api.getPrerequisiteLineage(graph, 'a').size, 2);
});
test('unknown or empty journeys produce an empty graph safely', () => {
  assert.equal(api.getPrerequisiteGraph('unknown').nodes.length, 0);
  assert.equal(api.createPrerequisiteGraph([], []).edges.length, 0);
});
