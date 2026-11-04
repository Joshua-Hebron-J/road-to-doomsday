import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'The Road to Doomsday',
    short_name: 'Doomsday',
    description:
      'Every story led here. An unofficial cinematic Marvel fan archive.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#050508',
    theme_color: '#050508',
    icons: [
      { src: '/pwa/icon-192.png', sizes: '192x192', type: 'image/png' },
      {
        src: '/pwa/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
