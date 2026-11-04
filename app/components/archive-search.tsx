'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const SearchDialog = dynamic(() => import('./archive-search-dialog'), {
  loading: () => (
    <p role="status" className="sr-only">
      Opening search…
    </p>
  ),
});

export function ArchiveSearch() {
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);

  function show() {
    if (document.querySelector('dialog[open]')) return;
    opener.current = document.activeElement as HTMLElement;
    setLoaded(true);
    setOpen(true);
  }

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'k' &&
        !event.repeat
      ) {
        event.preventDefault();
        show();
      }
    }
    document.addEventListener('keydown', shortcut);
    return () => document.removeEventListener('keydown', shortcut);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={show}
        className="min-h-11 rounded-md border border-white/20 bg-slate-950 px-3 text-sm text-slate-200 focus-ring-doom"
        aria-haspopup="dialog"
        aria-label="Search archive"
        aria-keyshortcuts="Control+k Meta+k"
        title="Search archive (Ctrl+K or Cmd+K)"
      >
        Search
      </button>
      {loaded && (
        <SearchDialog
          open={open}
          onClose={() => {
            setOpen(false);
            if (opener.current?.isConnected) opener.current.focus();
          }}
        />
      )}
    </>
  );
}
