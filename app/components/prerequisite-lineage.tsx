'use client';

import { useId, useMemo, useState } from 'react';
import type { Journey } from '../types/journey';
import { getMovieById } from '../lib/journey';
import {
  getPrerequisiteGraph,
  getPrerequisiteLineage,
} from '../lib/prerequisite-graph';
import { SceneExplorer } from './scene-explorer';
import type { SpatialNode, SpatialEdge } from './spatial-scene-types';

export default function PrerequisiteLineage({
  journey,
  isWatched,
  isLoaded,
  onToggleWatched,
  onOpenDossier,
  suspended,
}: {
  journey: Journey;
  isWatched: (id: string) => boolean;
  isLoaded: boolean;
  onToggleWatched: (id: string) => void;
  onOpenDossier: (id: string) => void;
  suspended: boolean;
}) {
  const graph = useMemo(() => getPrerequisiteGraph(journey.id), [journey.id]);
  const [selectedId, setSelectedId] = useState(journey.movieIds.at(-1) ?? '');
  const [focusOnly, setFocusOnly] = useState(false);
  const unique = useId().replaceAll(':', '_');
  const ancestry = useMemo(
    () => getPrerequisiteLineage(graph, selectedId),
    [graph, selectedId],
  );
  const visible = graph.nodes.filter(
    (node) => !focusOnly || ancestry.has(node.id),
  );
  const centerX = visible.length
    ? (Math.min(...visible.map((node) => node.position[0])) +
        Math.max(...visible.map((node) => node.position[0]))) /
      2
    : 0;
  const centerY = visible.length
    ? (Math.min(...visible.map((node) => node.position[1])) +
        Math.max(...visible.map((node) => node.position[1]))) /
      2
    : 0;
  const nodes: SpatialNode[] = visible.map((node) => {
    const movie = getMovieById(node.id)!;
    const watched = node.inJourney && isWatched(node.id);
    return {
      id: node.id,
      label: movie.title,
      caption: `${node.inJourney ? (watched ? 'Watched in this pathway' : 'Unwatched in this pathway') : 'Outside pathway · context only'} · Dependency depth ${node.depth}`,
      color: watched
        ? '#34d399'
        : !node.inJourney
          ? '#93c5fd'
          : ancestry.has(node.id)
            ? '#a78bfa'
            : '#94a3b8',
      complete: watched,
      position: [
        node.position[0] - centerX,
        node.position[1] - centerY,
        node.position[2],
      ],
    };
  });
  const shown = new Set(nodes.map((node) => node.id));
  const edges: SpatialEdge[] = graph.edges
    .filter((edge) => shown.has(edge.source) && shown.has(edge.target))
    .map((edge) => ({
      ...edge,
      label: 'Story prerequisite',
      color:
        edge.source === selectedId || edge.target === selectedId
          ? '#c4b5fd'
          : isWatched(edge.source) && isWatched(edge.target)
            ? '#34d399'
            : '#94a3b8',
    }));
  const selected = getMovieById(selectedId);
  const selectedNode = graph.nodes.find((node) => node.id === selectedId);
  const prior = graph.edges
    .filter((edge) => edge.target === selectedId)
    .map((edge) => edge.source);
  const next = graph.edges
    .filter((edge) => edge.source === selectedId)
    .map((edge) => edge.target);
  if (!selected || !selectedNode || nodes.length === 0)
    return (
      <p role="status" className="p-5 text-slate-300">
        No story prerequisite data is available for this pathway.
      </p>
    );

  function connections(ids: string[], empty: string) {
    return ids.length ? (
      <ul className="space-y-2">
        {ids.map((id) => {
          const movie = getMovieById(id)!;
          const tracked = journey.movieIds.includes(id);
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => setSelectedId(id)}
                className="w-full min-h-11 text-left rounded-lg border border-white/10 bg-surface-1/50 px-3 py-2 text-sm hover:border-violet-400/50 focus-ring-doom"
              >
                <span className="block text-slate-100">{movie.title}</span>
                <span className="text-xs text-slate-400">
                  {tracked
                    ? isWatched(id)
                      ? 'Watched'
                      : 'Unwatched'
                    : 'Outside pathway · context only'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    ) : (
      <p className="text-sm text-slate-400">{empty}</p>
    );
  }
  const mapHeight = Math.max(
    320,
    (Math.max(...nodes.map((node) => node.position?.[1] ?? 0)) -
      Math.min(...nodes.map((node) => node.position?.[1] ?? 0))) *
      64 +
      130,
  );
  const coordinate = (node: SpatialNode) => ({
    x: 480 + (node.position?.[0] ?? 0) * 110,
    y: mapHeight / 2 - (node.position?.[1] ?? 0) * 64,
  });
  const fallback = (
    <div
      className="h-full w-full overflow-auto pb-10"
      tabIndex={0}
      role="region"
      aria-label="Scrollable story prerequisite map"
    >
      <svg
        width="960"
        height={mapHeight}
        viewBox={`0 0 960 ${mapHeight}`}
        className="max-w-none"
        aria-hidden="true"
      >
        <defs>
          <marker
            id={`lineage-arrow-${unique}`}
            markerWidth="9"
            markerHeight="9"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8" fill="#a5b4fc" />
          </marker>
        </defs>
        {edges.map((edge) => {
          const a = coordinate(nodes.find((node) => node.id === edge.source)!);
          const b = coordinate(nodes.find((node) => node.id === edge.target)!);
          const distance = Math.hypot(b.x - a.x, b.y - a.y) || 1;
          const endX = b.x - ((b.x - a.x) / distance) * 26;
          const endY = b.y - ((b.y - a.y) / distance) * 26;
          return (
            <g
              key={edge.id}
              role="button"
              tabIndex={-1}
              onClick={() => setSelectedId(edge.target)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedId(edge.target);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <title>
                {getMovieById(edge.source)?.title} →{' '}
                {getMovieById(edge.target)?.title}
              </title>
              <line
                x1={a.x}
                y1={a.y}
                x2={endX}
                y2={endY}
                stroke="transparent"
                strokeWidth={14}
              />
              <line
                x1={a.x}
                y1={a.y}
                x2={endX}
                y2={endY}
                stroke={edge.color}
                strokeWidth={
                  edge.target === selectedId || edge.source === selectedId
                    ? 2
                    : 1
                }
                markerEnd={`url(#lineage-arrow-${unique})`}
              />
            </g>
          );
        })}
        {nodes.map((node, index) => {
          const point = coordinate(node);
          return (
            <g
              key={node.id}
              role="button"
              tabIndex={-1}
              onClick={() => setSelectedId(node.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedId(node.id);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <title>{node.label}</title>
              <circle
                cx={point.x}
                cy={point.y}
                r={node.id === selectedId ? 25 : 22}
                fill="#0a0c10"
                stroke={node.color}
                strokeWidth={node.id === selectedId ? 3 : 1.5}
              />
              <text
                x={point.x}
                y={point.y + 4}
                textAnchor="middle"
                fill="#f8fafc"
                fontSize="12"
              >
                {node.complete ? '✓' : index + 1}
              </text>
              <text
                x={point.x}
                y={point.y + 43}
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="10"
              >
                {node.label.length > 23
                  ? node.label.slice(0, 22) + '…'
                  : node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-indigo-400/20 bg-surface-1 p-4">
        <label className="basis-full sm:basis-auto sm:flex-1 min-w-0 space-y-2">
          <span className="block text-xs font-mono text-slate-300">
            Focus a story
          </span>
          <select
            aria-label="Focus a story"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            className="w-full max-w-full min-h-11 rounded-lg border border-white/15 bg-surface-2 px-3 text-sm text-slate-100 focus-ring-doom"
          >
            {graph.nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {getMovieById(node.id)?.title}
                {!node.inJourney ? ' · context' : ''}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          aria-pressed={focusOnly}
          onClick={() => setFocusOnly((value) => !value)}
          className="w-full sm:w-auto min-h-11 px-4 rounded-lg border border-violet-400/30 text-sm text-violet-200 focus-ring-doom"
        >
          {focusOnly
            ? 'Show full pathway graph'
            : 'Focus selected prerequisites'}
        </button>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">
        Connections are story prerequisites. Arrows point from prerequisite to
        dependent story. Outside-pathway nodes provide context and do not count
        toward this journey’s progress.
      </p>
      <p aria-live="polite" className="text-xs font-mono text-indigo-200">
        {nodes.length} {nodes.length === 1 ? 'story node' : 'story nodes'} ·{' '}
        {edges.length}{' '}
        {edges.length === 1
          ? 'prerequisite connection'
          : 'prerequisite connections'}{' '}
        · {graph.nodes.filter((node) => !node.inJourney).length} context{' '}
        {graph.nodes.filter((node) => !node.inJourney).length === 1
          ? 'entry'
          : 'entries'}{' '}
        outside pathway
      </p>
      <SceneExplorer
        title="Story prerequisite graph"
        nodes={nodes}
        selectedId={selectedId}
        onSelect={setSelectedId}
        variant="lineage"
        edges={edges}
        fallback={fallback}
        suspended={suspended}
      >
        <p className="text-sm text-slate-300">
          {prior.length
            ? `${prior.length} direct prerequisite${prior.length === 1 ? '' : 's'}. Explore an earlier story or open its dossier for spoiler-protected narrative context.`
            : 'This story has no prerequisites listed in the archive.'}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onOpenDossier(selectedId)}
            aria-haspopup="dialog"
            className="min-h-11 px-4 rounded-lg border border-violet-400/40 bg-violet-950/30 text-sm text-violet-100 focus-ring-doom"
          >
            Open selected movie dossier
          </button>
          {selectedNode.inJourney && (
            <button
              type="button"
              disabled={!isLoaded}
              onClick={() => onToggleWatched(selectedId)}
              className="min-h-11 px-4 rounded-lg border border-white/15 text-sm text-emerald-200 focus-ring-doom disabled:opacity-50"
            >
              Mark {selected.title}{' '}
              {isWatched(selectedId) ? 'unwatched' : 'watched'}
            </button>
          )}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <section
            aria-label="Direct story prerequisites"
            className="space-y-3"
          >
            <h4 className="text-xs uppercase tracking-wider text-violet-200 font-semibold">
              Direct prerequisites
            </h4>
            {connections(prior, 'No prerequisite connections listed.')}
          </section>
          <section aria-label="Dependent stories" className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-indigo-200 font-semibold">
              Dependents in this graph
            </h4>
            {connections(
              next,
              'No later dependent story is listed in this pathway graph.',
            )}
          </section>
        </div>
      </SceneExplorer>
      {graph.diagnostics.length > 0 && (
        <p role="status" className="text-xs text-amber-200">
          Some archive connections could not be resolved. Available story nodes
          remain usable.
        </p>
      )}
    </div>
  );
}
