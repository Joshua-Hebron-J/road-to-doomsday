'use client';

import { useState } from 'react';
import { armorSystems } from '../data/doom-codex';

export function DoomArmorStudy() {
  const [active, setActive] =
    useState<(typeof armorSystems)[number]['id']>('mask');
  const system = armorSystems.find((entry) => entry.id === active)!;
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <svg
        viewBox="0 0 360 300"
        role="img"
        aria-label={`Illustrative Doom armor schematic highlighting ${system.label}`}
        className="w-full rounded-xl border border-emerald-300/20 bg-slate-950"
      >
        <defs>
          <linearGradient id="doom-steel" x2="1" y2="1">
            <stop stopColor="#e2e8f0" />
            <stop offset="1" stopColor="#475569" />
          </linearGradient>
        </defs>
        <path
          d="M180 15V285M25 150H335"
          stroke="#334155"
          strokeDasharray="3 7"
        />
        <circle cx="180" cy="150" r="119" fill="none" stroke="#334155" />
        <path
          d="M57 280L83 146 130 65 180 29 230 65 277 146 303 280Z"
          fill={active === 'mantle' ? '#166534' : '#123524'}
          stroke="#4ade80"
          strokeOpacity=".55"
        />
        <path
          d="M125 177L180 165 235 177 254 229 220 280H140L106 229Z"
          fill="url(#doom-steel)"
          stroke={active === 'plate' ? '#86efac' : '#475569'}
          strokeWidth="3"
        />
        <path
          d="M138 92L180 72 222 92 219 140 200 164H160L141 140Z"
          fill="url(#doom-steel)"
          stroke={active === 'mask' ? '#86efac' : '#475569'}
          strokeWidth="3"
        />
        <path
          d="M150 104L174 109 170 117 152 114ZM210 104L186 109 190 117 208 114ZM165 137H195V145H165Z"
          fill="#0f172a"
        />
        <path
          d="M113 210L147 222 139 274 103 260ZM247 210L213 222 221 274 257 260Z"
          fill="url(#doom-steel)"
          stroke={active === 'gauntlets' ? '#86efac' : '#475569'}
          strokeWidth="3"
        />
        <circle
          cx={system.point[0]}
          cy={system.point[1]}
          r="12"
          fill="#022c22"
          stroke="#a7f3d0"
          strokeWidth="2"
        />
        <circle
          cx={system.point[0]}
          cy={system.point[1]}
          r="3"
          fill="#a7f3d0"
        />
      </svg>
      <div className="rounded-xl border border-white/15 bg-slate-950/75 p-5">
        <div
          role="group"
          aria-label="Armor components"
          className="flex flex-wrap gap-2"
        >
          {armorSystems.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={active === entry.id}
              onClick={() => setActive(entry.id)}
              className={`min-h-11 rounded-lg border px-3 text-sm focus-ring-doom ${active === entry.id ? 'border-emerald-300 bg-emerald-950 text-emerald-100' : 'border-white/20 text-slate-200'}`}
            >
              {entry.label}
            </button>
          ))}
        </div>
        <div role="status" className="mt-5">
          <h4 className="text-lg font-semibold text-white">{system.label}</h4>
          <p className="mt-2 leading-relaxed text-slate-300">
            {system.analysis}
          </p>
        </div>
      </div>
    </div>
  );
}
