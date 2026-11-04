/* global OFFLINE_VERSION, OFFLINE_ASSETS */
'use strict';

const PREFIX = 'rtd-offline-';
const CACHE = PREFIX + OFFLINE_VERSION;
const READY = '/__rtd-offline-ready__';
const assets = new Set(OFFLINE_ASSETS);

async function announce(message) {
  const clients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });
  clients.forEach((client) => client.postMessage(message));
}

async function archiveReady() {
  if (!(await caches.match(READY, { cacheName: CACHE }))) return false;
  for (let index = 0; index < OFFLINE_ASSETS.length; index += 4) {
    const entries = await Promise.all(
      OFFLINE_ASSETS.slice(index, index + 4).map((url) =>
        caches.match(url, { cacheName: CACHE }),
      ),
    );
    if (entries.some((entry) => !entry)) return false;
  }
  return true;
}

let preparation;
async function prepareArchive() {
  if (await archiveReady()) return;
  if (preparation) return preparation;
  preparation = (async () => {
    let completed = 0;
    try {
      const cache = await caches.open(CACHE);
      for (let index = 0; index < OFFLINE_ASSETS.length; index += 4) {
        await Promise.all(
          OFFLINE_ASSETS.slice(index, index + 4).map(async (url) => {
            const response = await fetch(
              new Request(url, { cache: 'reload', credentials: 'omit' }),
            );
            if (!response.ok || response.redirected)
              throw new Error('Offline asset unavailable: ' + url);
            await cache.put(url, response);
            completed++;
            await announce({
              type: 'RTD_OFFLINE_PROGRESS',
              completed,
              total: OFFLINE_ASSETS.length,
            });
          }),
        );
      }
      await cache.put(READY, new Response(OFFLINE_VERSION));
    } catch (error) {
      await caches.delete(CACHE).catch(() => {});
      await announce({ type: 'RTD_OFFLINE_ERROR' });
      throw error;
    }
  })();
  try {
    await preparation;
  } finally {
    preparation = undefined;
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(prepareArchive());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith(PREFIX) && key !== CACHE)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
      await announce({ type: 'RTD_OFFLINE_READY' });
    })(),
  );
});

self.addEventListener('message', (event) => {
  if (!['RTD_OFFLINE_STATUS', 'RTD_OFFLINE_SAVE'].includes(event.data?.type))
    return;
  event.waitUntil(
    (async () => {
      try {
        if (event.data.type === 'RTD_OFFLINE_SAVE') await prepareArchive();
        const ready = await archiveReady();
        event.ports[0]?.postMessage({
          ready: Boolean(ready),
          version: OFFLINE_VERSION,
        });
      } catch {
        event.ports[0]?.postMessage({ ready: false, version: OFFLINE_VERSION });
      }
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        let network;
        try {
          network = await fetch(request);
          if (network.status < 500) return network;
        } catch { /* Try the saved public document when disconnected. */ }
        try {
          return (
            (await caches.match(url.pathname, {
              cacheName: CACHE,
              ignoreVary: true,
            })) ||
            (await caches.match('/offline.html', { cacheName: CACHE })) ||
            network || Response.error()
          );
        } catch {
          return network || Response.error();
        }
      })(),
    );
    return;
  }
  // HTML navigation and Next's RSC requests must never share a cache response.
  const staticAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/pwa/') ||
    url.pathname === '/manifest.webmanifest' ||
    url.pathname === '/favicon.ico' ||
    url.pathname === '/offline.html';
  if (staticAsset && assets.has(url.pathname)) {
    event.respondWith(
      (async () => {
        try {
          const cached = await caches.match(url.pathname, {
            cacheName: CACHE,
            ignoreVary: true,
          });
          if (cached) return cached;
        } catch { /* Storage denial must not block an online asset. */ }
        return fetch(request);
      })(),
    );
  }
});
