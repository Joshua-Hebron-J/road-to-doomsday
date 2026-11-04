import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: '/sw.js',
      headers: [
        { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
        { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
      ],
    }];
  },
  experimental: {
    // Evaluate PostCSS/loaders in threads instead of socket-connected child processes.
    turbopackPluginRuntimeStrategy: 'workerThreads',
    workerThreads: true,
    cpus: 2,
  },
};

export default nextConfig;
