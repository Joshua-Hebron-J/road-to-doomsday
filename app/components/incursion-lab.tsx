'use client';

import dynamic from 'next/dynamic';
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { detectSceneCapability } from '../lib/scene-capability';
import {
  DEFAULT_INCURSION,
  evaluateIncursion,
  REALITIES,
  RUN_STEPS,
  type IncursionFrame,
} from '../lib/incursion';

const IncursionCanvas = dynamic(() => import('./incursion-canvas'), {
  ssr: false,
  loading: () => (
    <p role="status" className="p-4">
      Opening 3D viewport…
    </p>
  ),
});

class IncursionBoundary extends Component<{
  onFailure: () => void;
  children: ReactNode;
}> {
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

function RealityDiagram({ frame }: { frame: IncursionFrame }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 210" className="h-full w-full">
      <path
        d="M 30 105 H 370 M 200 25 V 185"
        stroke="#64748b"
        strokeDasharray="4 7"
        opacity=".55"
      />
      {REALITIES.map((reality, index) => {
        const x = 200 + (index ? 1 : -1) * frame.separation * 23;
        return (
          <g key={reality.designation}>
            <circle
              cx={x}
              cy="105"
              r="53"
              fill="none"
              stroke={reality.color}
              strokeDasharray="3 8"
              opacity=".4"
            />
            <circle
              cx={x}
              cy="105"
              r="46"
              fill={reality.color}
              fillOpacity={0.08 + frame.damage * 0.28}
              stroke={reality.color}
              strokeWidth={1 + frame.stress * 2}
            />
            <circle
              cx={x}
              cy="105"
              r={36 - frame.damage * 9}
              fill="none"
              stroke={reality.color}
              opacity=".5"
            />
            <text
              x={index ? 307 : 93}
              y="192"
              textAnchor="middle"
              fill={reality.color}
              fontSize="13"
            >
              {reality.designation}
            </text>
          </g>
        );
      })}
      {frame.stress >= 0.5 && (
        <path
          d="M 204 54 L 192 76 L 207 90 L 190 109 L 208 126 L 196 151"
          stroke={frame.dying ? '#fda4af' : '#fde68a'}
          strokeWidth={2 + frame.damage * 5}
          fill="none"
        />
      )}
    </svg>
  );
}

const buttonStyle =
  'min-h-11 rounded-lg border border-teal-300/35 px-4 py-2 text-sm font-semibold text-teal-100 hover:bg-teal-300/10 focus-ring-doom';

export function IncursionLab() {
  const [settings, setSettings] = useState(DEFAULT_INCURSION);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage, { amount: 0.1 });
  const reduced = useReducedMotion();
  const frame = evaluateIncursion(step, settings);
  const running = playing && step < RUN_STEPS;

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === 'visible');
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    if (!running || !pageVisible) return;
    const timer = window.setInterval(
      () => setStep((value) => Math.min(value + 1, RUN_STEPS)),
      100,
    );
    return () => window.clearInterval(timer);
  }, [running, pageVisible]);

  const activateFallback = useCallback(() => {
    setShow3D(false);
    setUnavailable(true);
  }, []);

  function enable3D() {
    const device = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const capability = detectSceneCapability(
      {
        cores: device.hardwareConcurrency,
        memory: device.deviceMemory,
        saveData: device.connection?.saveData,
      },
      () => document.createElement('canvas').getContext('webgl2'),
    );
    if (capability === 'lightweight') activateFallback();
    else setShow3D(true);
  }

  return (
    <section
      id="incursion"
      aria-labelledby="incursion-title"
      className="scroll-mt-24 border-y border-teal-300/15 bg-slate-950 px-4 py-16 sm:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs tracking-[0.22em] text-teal-300 uppercase">
          Multiverse field lab / Phase 10
        </p>
        <h2
          id="incursion-title"
          className="mt-3 text-3xl font-bold text-white sm:text-5xl"
        >
          Reality Tear Simulator
        </h2>
        <p className="mt-4 max-w-2xl text-slate-300">
          Bring two realities into convergence. Change their approach rate and
          boundary shielding to find which runs end in a tear, contact, or
          collapse. This fictional training scenario uses illustrative
          mechanics.
        </p>
        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="min-w-0 overflow-hidden rounded-2xl border border-teal-300/25 bg-[radial-gradient(ellipse_at_center,#162539,#060913_75%)]">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex flex-wrap gap-2">
                {REALITIES.map((reality) => (
                  <span
                    key={reality.designation}
                    className="rounded-full border px-3 py-1 font-mono text-xs"
                    style={{ color: reality.color }}
                  >
                    {reality.designation}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className={buttonStyle}
                onClick={show3D ? () => setShow3D(false) : enable3D}
              >
                {show3D ? 'Switch to 2D' : 'Enable 3D'}
              </button>
            </div>
            <div
              ref={stage}
              className="relative h-64 sm:h-80"
              data-incursion-view={show3D ? '3d' : '2d'}
            >
              {show3D ? (
                <IncursionBoundary onFailure={activateFallback}>
                  <IncursionCanvas
                    frame={frame}
                    animate={running && inView && pageVisible && !reduced}
                    onFailure={activateFallback}
                  />
                </IncursionBoundary>
              ) : (
                <RealityDiagram frame={frame} />
              )}
            </div>
            <div className="border-t border-white/10 p-4">
              <p className="text-sm text-slate-300" role="status">
                {unavailable && !show3D
                  ? '3D unavailable on this device. The 2D view uses the same simulation.'
                  : 'Both views share the same controls and outcomes.'}
              </p>
              <label className="mt-3 block text-sm text-white">
                Simulation position{' '}
                <span className="font-mono text-teal-200">{step}%</span>
                <input
                  type="range"
                  min={0}
                  max={RUN_STEPS}
                  value={step}
                  aria-label="Simulation position"
                  onChange={(event) => {
                    setPlaying(false);
                    setStep(event.target.valueAsNumber);
                  }}
                  className="block min-h-11 w-full accent-teal-300 focus-ring-doom"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={buttonStyle}
                  onClick={() => {
                    if (step === RUN_STEPS) setStep(0);
                    setPlaying(!running);
                  }}
                >
                  {running
                    ? 'Pause'
                    : step === RUN_STEPS
                      ? 'Replay'
                      : step === 0
                        ? 'Initiate incursion'
                        : 'Resume'}
                </button>
                <button
                  type="button"
                  className={buttonStyle}
                  onClick={() => {
                    setPlaying(false);
                    setStep(0);
                    setSettings(DEFAULT_INCURSION);
                  }}
                >
                  Reset simulation
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-5 rounded-2xl border border-white/15 bg-slate-900/70 p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-teal-300">
              Collision telemetry
            </p>
            <p role="status" className="text-xl font-semibold text-white">
              {frame.stage}
            </p>
            <div>
              <label
                htmlFor="incursion-threat"
                className="flex justify-between gap-2 text-sm text-white"
              >
                <span>Incursion threat</span>
                <span className="font-mono">{frame.threat}%</span>
              </label>
              <meter
                id="incursion-threat"
                min={0}
                max={100}
                low={45}
                high={75}
                optimum={0}
                value={frame.threat}
                className="mt-1 h-4 w-full"
              />
            </div>
            <p className="font-mono text-xs text-slate-300">
              Separation {frame.separation.toFixed(2)} units · Contact at 2.00
            </p>
            {frame.dying && (
              <p
                role="alert"
                className="rounded-lg border border-rose-400/50 bg-rose-950/50 p-3 text-sm text-rose-100"
              >
                <strong>Dying reality alert.</strong> Both boundaries are
                failing. In this scenario, overlapping realities risk collapsing
                together.
              </p>
            )}
            {(
              [
                [
                  'convergence',
                  'Convergence rate',
                  'Higher values draw the realities together faster.',
                ],
                [
                  'shielding',
                  'Boundary shielding',
                  'Shielding slows convergence and limits damage after contact.',
                ],
              ] as const
            ).map(([key, label, description]) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="flex justify-between gap-2 text-sm text-white"
                >
                  <span>{label}</span>
                  <span className="font-mono">{settings[key]}%</span>
                </label>
                <input
                  id={key}
                  type="range"
                  min={0}
                  max={100}
                  value={settings[key]}
                  aria-describedby={key + '-help'}
                  onChange={(event) => {
                    const value = event.target.valueAsNumber;
                    setSettings((current) => ({ ...current, [key]: value }));
                  }}
                  className="block min-h-11 w-full accent-teal-300 focus-ring-doom"
                />
                <p id={key + '-help'} className="text-xs text-slate-300">
                  {description}
                </p>
              </div>
            ))}
            <p className="text-sm text-slate-300">
              A tear signals weakening boundaries. Collision begins when they
              touch. Raise shielding and replay to see whether the pair avoids
              contact.
            </p>
            <a
              href="#chronology"
              className="inline-block py-2 text-sm font-medium text-teal-200 underline focus-ring-doom"
            >
              Return to the multiverse chronology ↑
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
