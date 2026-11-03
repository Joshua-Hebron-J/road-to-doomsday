import { getAllMovies, getJourneyById } from './journey';
import type { Movie } from '../types/movie';

/** Derived graph only. Movie.prerequisites remains the relationship source of truth. */
export interface PrerequisiteNode {
  id: string;
  depth: number;
  inJourney: boolean;
  position: [number, number, number];
}
export interface PrerequisiteEdge {
  id: string;
  source: string;
  target: string;
  kind: 'story-prerequisite';
}
export interface PrerequisiteGraph {
  nodes: PrerequisiteNode[];
  edges: PrerequisiteEdge[];
  diagnostics: string[];
}

export function createPrerequisiteGraph(
  journeyIds: readonly string[],
  catalog: readonly Movie[],
): PrerequisiteGraph {
  const movies = new Map(catalog.map((movie) => [movie.id, movie]));
  const tracked = new Set(journeyIds);
  const depths = new Map<string, number>();
  const edges = new Map<string, PrerequisiteEdge>();
  const visiting = new Set<string>();
  const diagnostics = new Set<string>();
  function visit(id: string): number {
    if (depths.has(id)) return depths.get(id)!;
    const movie = movies.get(id);
    if (!movie) {
      diagnostics.add(`Unknown prerequisite: ${id}`);
      return 0;
    }
    if (visiting.has(id)) {
      diagnostics.add(`Cycle at ${id}`);
      return 0;
    }
    visiting.add(id);
    let depth = 0;
    for (const source of new Set(movie.prerequisites)) {
      if (!movies.has(source)) {
        diagnostics.add(`Unknown prerequisite: ${source}`);
        continue;
      }
      const edgeId = `${source}->${id}`;
      edges.set(edgeId, {
        id: edgeId,
        source,
        target: id,
        kind: 'story-prerequisite',
      });
      depth = Math.max(depth, visit(source) + 1);
    }
    visiting.delete(id);
    depths.set(id, depth);
    return depth;
  }
  journeyIds.forEach(visit);
  const maxDepth = Math.max(1, ...depths.values());
  const layers = new Map<number, string[]>();
  for (const [id, depth] of depths)
    layers.set(depth, [...(layers.get(depth) ?? []), id]);
  const nodes: PrerequisiteNode[] = [];
  for (const [depth, ids] of [...layers].sort((a, b) => a[0] - b[0])) {
    ids.sort(
      (a, b) =>
        (movies.get(a)?.year ?? 0) - (movies.get(b)?.year ?? 0) ||
        a.localeCompare(b),
    );
    ids.forEach((id, index) =>
      nodes.push({
        id,
        depth,
        inJourney: tracked.has(id),
        position: [
          (depth / maxDepth - 0.5) * 6.4,
          (index - (ids.length - 1) / 2) * 1.4,
          (index % 2 ? -0.3 : 0.3) + Math.sin(depth) * 0.15,
        ],
      }),
    );
  }
  return { nodes, edges: [...edges.values()], diagnostics: [...diagnostics] };
}
export function getPrerequisiteGraph(journeyId: string) {
  return createPrerequisiteGraph(
    getJourneyById(journeyId)?.movieIds ?? [],
    getAllMovies(),
  );
}

/** Traverse incoming edges without assuming a particular future relationship renderer. */
export function getPrerequisiteLineage(
  graph: PrerequisiteGraph,
  selectedId: string,
): Set<string> {
  const ids = new Set<string>();
  if (!graph.nodes.some((node) => node.id === selectedId)) return ids;
  const incoming = new Map<string, string[]>();
  graph.edges.forEach((edge) =>
    incoming.set(edge.target, [
      ...(incoming.get(edge.target) ?? []),
      edge.source,
    ]),
  );
  const pending = [selectedId];
  while (pending.length) {
    const id = pending.pop()!;
    if (ids.has(id)) continue;
    ids.add(id);
    pending.push(...(incoming.get(id) ?? []));
  }
  return ids;
}
