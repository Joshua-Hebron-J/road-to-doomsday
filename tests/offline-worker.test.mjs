import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(
  new URL('../scripts/service-worker.js', import.meta.url),
  'utf8',
);
const origin = 'https://archive.test';
const assets = ['/', '/pathways', '/_next/static/main.js', '/offline.html'];

function runtime(version = 'one', backing = new Map()) {
  const handlers = new Map();
  const calls = [];
  const messages = [];
  let offline = false;
  let failedPath = '';
  let denied = false;
  let quota = false;
  let claims = 0;
  function key(request) {
    return new URL(typeof request === 'string' ? request : request.url, origin)
      .pathname;
  }
  const caches = {
    async open(name) {
      if (denied) throw new DOMException('Storage denied', 'SecurityError');
      if (!backing.has(name)) {
        const entries = new Map();
        backing.set(name, {
          entries,
          async put(request, response) {
            if (quota) throw new DOMException('Storage full', 'QuotaExceededError');
            entries.set(key(request), response.clone());
          },
        });
      }
      return backing.get(name);
    },
    async keys() {
      return [...backing.keys()];
    },
    async delete(name) {
      return backing.delete(name);
    },
    async match(request, options) {
      if (denied) throw new DOMException('Storage denied', 'SecurityError');
      const response = backing
        .get(options.cacheName)
        ?.entries.get(key(request));
      return response?.clone();
    },
  };
  const context = {
    OFFLINE_VERSION: version,
    OFFLINE_ASSETS: assets,
    URL,
    Response,
    caches,
    Request: class extends Request {
      constructor(url, options) {
        super(new URL(url, origin), options);
      }
    },
    async fetch(request) {
      const path = key(request);
      calls.push(path);
      if (offline) throw new Error('Disconnected');
      return new Response(path, { status: path === failedPath ? 503 : 200 });
    },
    self: {
      location: { origin },
      clients: {
        async matchAll() {
          return [{ postMessage: (data) => messages.push(data) }];
        },
        async claim() {
          claims++;
        },
      },
      addEventListener(name, handler) {
        handlers.set(name, handler);
      },
    },
  };
  vm.runInNewContext(source, context);
  async function dispatch(name, values = {}) {
    let pending;
    handlers.get(name)({
      ...values,
      waitUntil(promise) {
        pending = promise;
      },
      respondWith(promise) {
        pending = promise;
      },
    });
    return pending;
  }
  async function message(type) {
    let reply;
    await dispatch('message', {
      data: { type },
      ports: [
        {
          postMessage(data) {
            reply = data;
          },
        },
      ],
    });
    return reply;
  }
  function request(path, extra = {}) {
    return dispatch('fetch', {
      request: {
        url: new URL(path, origin).href,
        mode: 'cors',
        method: 'GET',
        ...extra,
      },
    });
  }
  return {
    backing,
    caches,
    calls,
    messages,
    dispatch,
    message,
    request,
    disconnect() {
      offline = true;
    },
    denyStorage() { denied = true; },
    exhaustQuota() { quota = true; },
    fail(path) {
      failedPath = path;
    },
    claims: () => claims,
  };
}

test('offline install saves a complete version and ready marker before activation', async () => {
  const worker = runtime();
  await worker.dispatch('install');
  assert.equal((await worker.message('RTD_OFFLINE_STATUS')).ready, true);
  assert.equal(
    worker.backing.get('rtd-offline-one').entries.size,
    assets.length + 1,
  );
  assert.equal(worker.claims(), 0);
  assert.equal(worker.messages.at(-1).completed, assets.length);
});

test('offline navigations restore the matching public page and unknown routes get an offline explanation', async () => {
  const worker = runtime();
  await worker.dispatch('install');
  worker.fail('/pathways');
  const recovered = await worker.request('/pathways', { mode: 'navigate' });
  assert.equal(recovered.status, 200);
  assert.equal(await recovered.text(), '/pathways');
  worker.disconnect();
  assert.equal(
    await (await worker.request('/pathways', { mode: 'navigate' })).text(),
    '/pathways',
  );
  assert.equal(
    await (await worker.request('/unavailable', { mode: 'navigate' })).text(),
    '/offline.html',
  );
  assert.equal(
    await (await worker.request('/_next/static/main.js')).text(),
    '/_next/static/main.js',
  );
});

test('data requests, external URLs, private downloads and writes never receive cached HTML', async () => {
  const worker = runtime();
  await worker.dispatch('install');
  for (const path of [
    '/?_rsc=test',
    '/pathways?_rsc=test',
    '/private-backup.json',
    '/api/data',
  ]) {
    assert.equal(await worker.request(path), undefined);
  }
  assert.equal(await worker.request('https://other.test/'), undefined);
  assert.equal(await worker.request('/', { method: 'POST' }), undefined);
});

test('a failed save removes the incomplete version and preserves an earlier offline copy', async () => {
  const worker = runtime('new');
  const old = await worker.caches.open('rtd-offline-old');
  await old.put('/', new Response('Previous archive'));
  worker.fail('/_next/static/main.js');
  await assert.rejects(worker.dispatch('install'));
  assert.equal(worker.backing.has('rtd-offline-new'), false);
  assert.equal(
    await (await old.entries.get('/').clone()).text(),
    'Previous archive',
  );
  assert.equal((await worker.message('RTD_OFFLINE_STATUS')).ready, false);
  const full = runtime('full', worker.backing);
  full.exhaustQuota();
  await assert.rejects(full.dispatch('install'), { name: 'QuotaExceededError' });
  assert.equal(worker.backing.has('rtd-offline-full'), false);
  assert(worker.backing.has('rtd-offline-old'));
  const denied = runtime();
  denied.denyStorage();
  assert.equal((await denied.message('RTD_OFFLINE_STATUS')).ready, false);
  assert.equal((await denied.message('RTD_OFFLINE_SAVE')).ready, false);
  assert.equal(await (await denied.request('/_next/static/main.js')).text(), '/_next/static/main.js');
  assert.equal(await (await denied.request('/pathways', { mode: 'navigate' })).text(), '/pathways');
  denied.fail('/pathways');
  assert.equal((await denied.request('/pathways', { mode: 'navigate' })).status, 503);
  denied.disconnect();
  assert.equal((await denied.request('/pathways', { mode: 'navigate' })).type, 'error');
});

test('activation removes only earlier archive caches and preserves unrelated storage', async () => {
  const worker = runtime('new');
  await worker.caches.open('other-app');
  await worker.caches.open('rtd-offline-old');
  await worker.dispatch('install');
  await worker.dispatch('activate');
  assert(worker.backing.has('other-app'));
  assert(worker.backing.has('rtd-offline-new'));
  assert.equal(worker.backing.has('rtd-offline-old'), false);
  assert.equal(worker.claims(), 1);
});

test('an evicted offline copy can be saved again without changing the application version', async () => {
  const worker = runtime();
  await worker.dispatch('install');
  const calls = worker.calls.length;
  assert.equal((await worker.message('RTD_OFFLINE_SAVE')).ready, true);
  assert.equal(worker.calls.length, calls);
  await worker.caches.delete('rtd-offline-one');
  assert.equal((await worker.message('RTD_OFFLINE_STATUS')).ready, false);
  assert.equal((await worker.message('RTD_OFFLINE_SAVE')).ready, true);
  assert.equal(worker.calls.length, calls + assets.length);
  worker.backing.get('rtd-offline-one').entries.delete('/_next/static/main.js');
  assert.equal((await worker.message('RTD_OFFLINE_STATUS')).ready, false);
  assert.equal((await worker.message('RTD_OFFLINE_SAVE')).ready, true);
  assert.equal(worker.calls.length, calls + 2 * assets.length);
});
