import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Evaluate PostCSS/loaders in threads instead of socket-connected child processes.
    turbopackPluginRuntimeStrategy: 'workerThreads',
    workerThreads: true,
    cpus: 2,
  },
};

export default nextConfig;
