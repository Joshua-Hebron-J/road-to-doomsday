import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const children = await Promise.all(
    entries.map((entry) => {
      const filename = path.join(directory, entry.name);
      return entry.isDirectory() ? files(filename) : [filename];
    }),
  );
  return children.flat();
}

const prerender = JSON.parse(
  await readFile('.next/prerender-manifest.json', 'utf8'),
);
const routes = Object.keys(prerender.routes).filter(
  (route) =>
    route === '/' || route === '/pathways' || route.startsWith('/pathways/'),
);
if (routes.length < 2)
  throw new Error('Public offline routes were not generated.');
const staticFiles = (await files('.next/static')).filter((file) =>
  /\.(js|css|woff2|png|svg|ico|avif|webp)$/.test(file),
);
const icons = (await files('public/pwa')).map(
  (file) => '/' + file.replaceAll(path.sep, '/').slice('public/'.length),
);
const assets = [
  ...new Set([
    ...routes,
    ...staticFiles.map(
      (file) =>
        '/_next/' + file.replaceAll(path.sep, '/').slice('.next/'.length),
    ),
    ...icons,
    '/manifest.webmanifest',
    '/favicon.ico',
    '/offline.html',
  ]),
].sort();
const source = await readFile('scripts/service-worker.js', 'utf8');
const build = await readFile('.next/BUILD_ID', 'utf8');
const version = createHash('sha256')
  .update(build + source + assets.join('\n'))
  .digest('hex')
  .slice(0, 20);
await writeFile(
  'public/sw.js',
  "'use strict';\nconst OFFLINE_VERSION = " +
    JSON.stringify(version) +
    ';\n' +
    'const OFFLINE_ASSETS = ' +
    JSON.stringify(assets) +
    ';\n' +
    source.replace("'use strict';", ''),
);
const bytes = (await Promise.all(staticFiles.map((file) => stat(file)))).reduce(
  (total, file) => total + file.size,
  0,
);
console.log(
  'Offline archive ' +
    version +
    ': ' +
    routes.length +
    ' pages, ' +
    assets.length +
    ' total resources, ' +
    (bytes / 1024 / 1024).toFixed(2) +
    ' MiB of build assets.',
);
