'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

function workerStatus(
  worker: ServiceWorker,
  type = 'RTD_OFFLINE_STATUS',
): Promise<boolean> {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const finish = (ready: boolean) => {
      window.clearTimeout(timer);
      channel.port1.close();
      resolve(ready);
    };
    const timer = window.setTimeout(
      () => finish(false),
      type === 'RTD_OFFLINE_SAVE' ? 120000 : 5000,
    );
    channel.port1.onmessage = (event) => finish(event.data?.ready === true);
    try {
      worker.postMessage({ type }, [channel.port2]);
    } catch {
      channel.port2.close();
      finish(false);
    }
  });
}

export default function OfflineArchiveControls() {
  const [supported, setSupported] = useState(false);
  const [saved, setSaved] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);
  const [message, setMessage] = useState('');
  const detach = useRef<() => void>(() => {});
  const saveButton = useRef<HTMLButtonElement>(null);
  const restoreSaveFocus = useRef(false);

  useEffect(() => {
    if (!busy && !saved && restoreSaveFocus.current) {
      restoreSaveFocus.current = false;
      if (saveButton.current?.disabled) {
        saveButton.current.closest('aside')?.querySelector('button')?.focus();
      } else {
        saveButton.current?.focus();
      }
    }
  }, [busy, saved]);

  const refresh = useCallback(async () => {
    const registration = await navigator.serviceWorker.getRegistration('/');
    if (!registration?.active?.scriptURL.endsWith('/sw.js')) {
      setSaved(false);
      setWaiting(false);
      setMessage('');
      return;
    }
    const ready = await workerStatus(registration.active);
    setSaved(ready);
    if (!ready)
      setMessage('Offline copy unavailable. Save again when connected.');
    setWaiting(Boolean(registration.waiting));
  }, []);

  const observe = useCallback(
    (registration: ServiceWorkerRegistration) => {
      detach.current();
      let worker: ServiceWorker | null = null;
      async function changed() {
        if (registration.installing && registration.installing !== worker) {
          worker?.removeEventListener('statechange', changed);
          worker = registration.installing;
          worker.addEventListener('statechange', changed);
        }
        if (worker?.state === 'redundant') {
          setBusy(false);
          setMessage('Offline save failed. Connect and try again.');
        } else if (
          worker &&
          (worker.state === 'installed' || worker.state === 'activated')
        ) {
          setBusy(false);
          setWaiting(Boolean(registration.waiting));
          await refresh();
        }
      }
      registration.addEventListener('updatefound', changed);
      void changed().catch(() => {});
      detach.current = () => {
        registration.removeEventListener('updatefound', changed);
        worker?.removeEventListener('statechange', changed);
      };
    },
    [refresh],
  );

  useEffect(() => {
    let cancelled = false;
    const available =
      process.env.NODE_ENV === 'production' &&
      'serviceWorker' in navigator &&
      'caches' in window &&
      window.isSecureContext;
    function connection() {
      setOffline(!navigator.onLine);
    }
    function receive(event: MessageEvent) {
      const data = event.data;
      if (data?.type === 'RTD_OFFLINE_PROGRESS') {
        setMessage(
          'Saving archive: ' +
            data.completed +
            ' of ' +
            data.total +
            ' resources.',
        );
      } else if (data?.type === 'RTD_OFFLINE_ERROR') {
        setBusy(false);
        setMessage(
          'Offline save failed. Connect and try again. Existing watch progress is safe.',
        );
      } else if (data?.type === 'RTD_OFFLINE_READY') {
        setBusy(false);
        setMessage('Archive saved for offline viewing.');
        void refresh().catch(() => {});
      }
    }
    function update() {
      void refresh().catch(() => {});
    }
    async function setup() {
      setSupported(available);
      connection();
      if (!available) return;
      const registration = await navigator.serviceWorker.getRegistration('/');
      if (!cancelled && registration?.active?.scriptURL.endsWith('/sw.js')) {
        observe(registration);
        await refresh();
      }
    }
    void setup().catch(() => {});
    window.addEventListener('online', connection);
    window.addEventListener('offline', connection);
    window.addEventListener('focus', update);
    navigator.serviceWorker?.addEventListener('message', receive);
    navigator.serviceWorker?.addEventListener('controllerchange', update);
    return () => {
      cancelled = true;
      detach.current();
      window.removeEventListener('online', connection);
      window.removeEventListener('offline', connection);
      window.removeEventListener('focus', update);
      navigator.serviceWorker?.removeEventListener('message', receive);
      navigator.serviceWorker?.removeEventListener('controllerchange', update);
    };
  }, [observe, refresh]);

  async function save() {
    setBusy(true);
    setMessage('Saving the public archive. Keep this page open until ready.');
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });
      observe(registration);
      if (registration.installing) return;
      await registration.update();
      if (!registration.installing) {
        if (
          !registration.waiting &&
          registration.active &&
          !(await workerStatus(registration.active, 'RTD_OFFLINE_SAVE'))
        ) {
          throw new Error('Offline copy incomplete');
        }
        await refresh();
        setBusy(false);
        setMessage(
          registration.waiting
            ? 'An updated archive is saved. Close all archive tabs to finish updating.'
            : 'Archive saved for offline viewing.',
        );
      }
    } catch {
      setBusy(false);
      setMessage(
        'Offline save failed. Connect and try again. Existing watch progress is safe.',
      );
    }
  }

  async function remove() {
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration('/');
      if (registration?.active?.scriptURL.endsWith('/sw.js'))
        await registration.unregister();
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith('rtd-offline-'))
          .map((key) => caches.delete(key)),
      );
      setSaved(false);
      setWaiting(false);
      restoreSaveFocus.current = true;
      setMessage('Offline copy removed. Your watch progress is unchanged.');
    } catch {
      setMessage('The offline copy could not be removed. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <p className="max-w-3xl text-sm text-slate-300">
        Save the homepage, all three pathways, dossiers and interactive tools on
        this browser. Watch progress stays in its existing local store. External
        sources require a connection.
      </p>
      <p className="text-xs text-slate-400">
        Install from your browser’s app menu where supported. Saving downloads
        the public archive and its assets once.
      </p>
      <p role="status" aria-atomic="true" className="text-sm text-emerald-200">
        {busy
          ? message
          : waiting
            ? 'An updated archive is saved. Close all archive tabs to finish updating.'
            : message ||
              (saved
                ? 'Offline copy ready on this browser.'
                : offline
                  ? 'You are offline. Save an offline copy when connected.'
                  : 'Online. Offline saving is optional.')}
      </p>
      {supported ? (
        <div className="flex flex-wrap gap-3">
          <button
            ref={saveButton}
            type="button"
            disabled={busy || offline}
            onClick={save}
            className="min-h-11 rounded-lg border border-emerald-300/35 px-4 text-sm text-emerald-100 focus-ring-doom disabled:opacity-50"
          >
            {saved ? 'Check offline updates' : 'Save archive offline'}
          </button>
          {saved && (
            <button
              type="button"
              disabled={busy}
              onClick={remove}
              className="min-h-11 rounded-lg border border-white/20 px-4 text-sm text-slate-200 focus-ring-doom disabled:opacity-50"
            >
              Remove offline copy
            </button>
          )}
        </div>
      ) : (
        <p className="text-xs text-slate-400">
          {process.env.NODE_ENV === 'production'
            ? 'Offline saving requires a supported browser and HTTPS or localhost.'
            : 'Offline saving is available in a production build.'}
        </p>
      )}
    </div>
  );
}
