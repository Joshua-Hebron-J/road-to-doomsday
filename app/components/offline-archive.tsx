'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const OfflineControls = dynamic(() => import('./offline-archive-controls'), {
  loading: () => (
    <p role="status" className="mt-3 text-sm text-slate-300">
      Opening offline options…
    </p>
  ),
});

export default function OfflineArchive() {
  const [open, setOpen] = useState(false);
  return (
    <aside
      aria-label="Offline archive"
      className="border-t border-emerald-300/15 bg-[#080d13] px-4 py-6"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-semibold text-emerald-200">
          Carry the archive offline
        </h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="offline-archive-controls"
          onClick={() => setOpen(!open)}
          className="mt-3 min-h-11 rounded-lg border border-emerald-300/35 px-4 text-sm text-emerald-100 focus-ring-doom"
        >
          {open ? 'Close offline options' : 'Open offline options'}
        </button>
        <div id="offline-archive-controls">{open && <OfflineControls />}</div>
      </div>
    </aside>
  );
}
