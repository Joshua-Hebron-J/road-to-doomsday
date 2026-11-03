import type { SpatialNode } from '../components/spatial-scene-types';

export const REALM_JOURNEY = 'the-incursion-nexus';

interface Realm extends SpatialNode {
  position: [number, number, number];
  map: [number, number];
  detail: string;
  source: string;
  movieId?: string;
  related: { href: string; label: string };
}

const strange = 'doctor-strange-in-the-multiverse-of-madness';
const earthSource =
  'https://d23.com/can-you-find-these-23s-in-disney-movies-and-series/';

export const REALMS: Realm[] = [
  {
    id: 'earth-616',
    label: 'Earth-616',
    caption: 'MCU · Home reality',
    color: '#6ee7b7',
    position: [-2.8, 0.65, 0.4],
    map: [19, 32],
    movieId: strange,
    detail:
      'Stephen Strange leaves his home reality with America Chavez. Earth-616 is the designation used for his home in Multiverse of Madness.',
    source: earthSource,
    related: { href: '#chronology', label: 'Trace the chronology' },
  },
  {
    id: 'earth-838',
    label: 'Earth-838',
    caption: 'MCU · Alternate Earth',
    color: '#7dd3fc',
    position: [0, 1.15, -0.8],
    map: [47, 21],
    movieId: strange,
    detail:
      'Strange and America arrive on this alternate Earth, where a counterpart of Christine Palmer takes them into custody. The visit puts alternate versions of familiar characters side by side.',
    source: earthSource,
    related: { href: '#variants', label: 'Compare character variants' },
  },
  {
    id: 'void',
    label: 'The Void',
    caption: 'MCU · End of time',
    color: '#fda4af',
    position: [2.65, 0.35, -1],
    map: [77, 36],
    movieId: 'loki-s1',
    detail:
      'Pruned people and objects can arrive in the Void at the end of time. Loki encounters other versions of himself and must get past Alioth to reach the Citadel.',
    source:
      'https://www.marvel.com/articles/tv-shows/loki-variants-character-posters',
    related: { href: '#tva-archives', label: 'Inspect the Void archives' },
  },
  {
    id: 'quantum',
    label: 'Quantum Realm',
    caption: 'MCU · Subatomic realm',
    color: '#fcd34d',
    position: [-1.65, -1.25, -0.7],
    map: [31, 75],
    movieId: 'ant-man-and-the-wasp-quantumania',
    detail:
      'Scott Lang, Hope Van Dyne, and their family explore the Quantum Realm in Quantumania. Its inhabitants and conflicts give this realm a story of its own.',
    source: 'https://www.marvel.com/antman',
    related: { href: '#chronology', label: 'Return to the chronology' },
  },
  {
    id: 'battleworld',
    label: 'Battleworld',
    caption: 'Marvel Comics · Secret Wars (2015)',
    color: '#c4b5fd',
    position: [2.1, -1.3, 1],
    map: [72, 79],
    detail:
      'In Secret Wars (2015), remnants of devastated universes form a patchwork planet under Doom’s rule. The convergence study below illustrates that published comics premise.',
    source: 'https://www.marvel.com/comics/guides/540/secret_wars_battleworld',
    related: { href: '#doom-codex', label: 'Read the Doom codex' },
  },
];

export function canReadRealm(
  realm: Realm,
  watched: readonly string[],
  revealed: boolean,
) {
  return (
    revealed || (realm.movieId !== undefined && watched.includes(realm.movieId))
  );
}
