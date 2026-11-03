'use client';

import dynamic from 'next/dynamic';
import {
  Component,
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { detectSceneCapability } from '../lib/scene-capability';
import type { SpatialNode, SpatialEdge } from './spatial-scene-types';

const SpatialCanvas = dynamic(() => import('./spatial-canvas'), {
  ssr: false,
  loading: () => (
    <p className="absolute inset-0 grid place-items-center text-sm text-emerald-300">
      Opening the multiverse…
    </p>
  ),
});
let capability: '3d' | 'lightweight' | undefined;
function probeCapability() {
  if (capability) return capability;
  const device = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  capability = detectSceneCapability(
    {
      cores: device.hardwareConcurrency,
      memory: device.deviceMemory,
      saveData: device.connection?.saveData,
    },
    () => document.createElement('canvas').getContext('webgl2'),
  );

  return capability;
}
const readCapability = () => capability ?? 'lightweight';
function subscribeCapability(notify: () => void) {
  // Subscription runs after commit: never allocate a GL context during React render.
  if (capability === undefined) {
    probeCapability();
    notify();
  }
  return () => {};
}
const subscribeVisibility = (notify: () => void) => {
  document.addEventListener('visibilitychange', notify);
  return () => document.removeEventListener('visibilitychange', notify);
};

class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function SceneExplorer({
  title,
  nodes,
  selectedId,
  onSelect,
  variant,
  children,
  suspended = false,
  edges,
  fallback,
}: {
  title: string;
  nodes: SpatialNode[];
  selectedId: string;
  onSelect: (id: string) => void;
  variant: 'rift' | 'timeline' | 'chapters' | 'movies' | 'lineage';
  children?: ReactNode;
  suspended?: boolean;
  edges?: SpatialEdge[];
  fallback?: ReactNode;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const entered = useInView(stage, { once: true, margin: '120px' });
  const inView = useInView(stage, { amount: 0.1 });
  const visible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === 'visible',
    () => false,
  );
  const device = useSyncExternalStore(
    subscribeCapability,
    readCapability,
    () => 'lightweight' as const,
  );
  const reducedMotion = useReducedMotion();
  const [lightweight, setLightweight] = useState(false);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const fail = useCallback(() => setFailed(true), []);
  const show3D = device === '3d' && !lightweight && !failed;
  const selected = nodes.find((node) => node.id === selectedId) ?? nodes[0];
  const animated = !reducedMotion && !paused && !suspended;

  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    const buttons = Array.from(
      controls.current?.querySelectorAll<HTMLButtonElement>(
        '[data-scene-node]',
      ) ?? [],
    );
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
      next = (index + 1) % nodes.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      next = (index - 1 + nodes.length) % nodes.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = nodes.length - 1;
    else return;
    event.preventDefault();
    onSelect(nodes[next].id);
    buttons[next]?.focus();
  }

  return (
    <section
      aria-label={title}
      className="spatial-explorer rounded-2xl border border-emerald-500/25 bg-surface-1/80 overflow-hidden shadow-card-cinematic text-left"
    >
      <div className="flex flex-wrap justify-between items-center gap-3 p-4 sm:px-6 border-b border-white/10">
        <div>
          <p className="text-[10px] tracking-[0.22em] font-mono uppercase text-emerald-400">
            Spatial archive //{' '}
            {variant === 'rift'
              ? 'Choose a reality'
              : 'Explore the connections'}
          </p>
          <h2 className="text-lg sm:text-xl text-slate-100 font-semibold mt-1">
            {title}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            aria-pressed={lightweight || device !== '3d' || failed}
            disabled={device !== '3d' || failed}
            onClick={() => setLightweight((value) => !value)}
            className="min-h-11 px-3 rounded border border-white/15 text-slate-200 focus-ring-doom disabled:opacity-60"
          >
            {show3D ? 'Use lightweight view' : 'Lightweight view'}
            {lightweight && device === '3d' && !failed ? ' · Enable 3D' : ''}
          </button>
          {show3D && (
            <button
              type="button"
              aria-pressed={paused}
              disabled={Boolean(reducedMotion)}
              onClick={() => setPaused((value) => !value)}
              className="min-h-11 px-3 rounded border border-white/15 text-slate-200 focus-ring-doom disabled:opacity-60"
            >
              {reducedMotion
                ? 'Reduced motion active'
                : paused
                  ? 'Resume scene motion'
                  : 'Pause scene motion'}
            </button>
          )}
        </div>
      </div>
      <div
        ref={stage}
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 25% 30%, rgba(99,102,241,0.13), transparent 65%), radial-gradient(ellipse at 80% 70%, rgba(14,116,144,0.12), transparent 65%)',
        }}
        className={`relative ${variant === 'rift' ? 'h-[280px] sm:h-[360px]' : 'h-[320px] sm:h-[400px]'}`}
        data-scene-mode={show3D ? '3d' : 'lightweight'}
      >
        {show3D && entered ? (
          <SceneBoundary onFailure={fail}>
            <SpatialCanvas
              nodes={nodes}
              selectedId={selectedId}
              onSelect={onSelect}
              variant={variant}
              animated={animated}
              active={inView && visible}
              onFailure={fail}
              edges={edges}
            />
          </SceneBoundary>
        ) : fallback ? (
          fallback
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center gap-3 px-4 overflow-hidden"
            aria-hidden="true"
          >
            {nodes.map((node, index) => (
              <div
                key={node.id}
                className="flex flex-col items-center gap-3 min-w-0 flex-1 max-w-28"
              >
                <span
                  className={`grid place-items-center rounded-full w-12 h-12 sm:w-16 sm:h-16 border-2 font-mono text-slate-100 ${node.id === selectedId ? 'shadow-glow-emerald bg-emerald-900/50' : 'bg-surface-2'}`}
                  style={{ borderColor: node.color }}
                >
                  {node.complete ? '✓' : String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 text-center line-clamp-3">
                  {node.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="px-4 py-3 border-t border-white/5 text-center font-mono text-[10px] uppercase tracking-wider text-slate-400">
        {show3D
          ? variant === 'lineage'
            ? 'Story prerequisites · select a node or arrow to explore'
            : 'Select a portal · move the pointer to explore depth'
          : 'Lightweight map · all navigation remains available below'}
      </p>
      <div className="border-t border-white/10 p-4 sm:p-6 space-y-5">
        <div
          ref={controls}
          onKeyDown={navigate}
          role="group"
          aria-label={`${title} destinations`}
          className="flex flex-wrap gap-2"
        >
          {nodes.map((node, index) => (
            <button
              type="button"
              key={node.id}
              data-scene-node={node.id}
              aria-pressed={node.id === selected.id}
              onClick={() => onSelect(node.id)}
              className={`min-h-11 max-w-full px-3 py-2 rounded-lg border text-xs focus-ring-doom transition-colors ${node.id === selected.id ? 'border-emerald-400/70 bg-emerald-950/60 text-emerald-200' : 'border-white/10 bg-surface-2 text-slate-300 hover:border-emerald-500/50'}`}
            >
              {String(index + 1).padStart(2, '0')} · {node.label}
              {node.complete ? ' ✓' : ''}
            </button>
          ))}
        </div>
        <motion.div
          key={selected.id}
          initial={reducedMotion ? false : { opacity: 0, rotateY: -5, y: 6 }}
          animate={{ opacity: 1, rotateY: 0, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.3 }}
          style={{ transformPerspective: 1000 }}
          className="rounded-xl border border-white/10 bg-surface-2/60 p-4 sm:p-5 space-y-3"
        >
          <div aria-live="polite" aria-atomic="true">
            <h3 className="text-base sm:text-lg font-semibold text-slate-100">
              {selected.label}
            </h3>
            <p className="mt-1 text-xs font-mono text-emerald-300">
              {selected.caption}
            </p>
          </div>
          {children}
        </motion.div>
        {failed && (
          <p role="status" className="text-xs text-amber-200">
            The 3D scene could not continue. The lightweight map uses the same
            destinations and controls.
          </p>
        )}
      </div>
    </section>
  );
}
