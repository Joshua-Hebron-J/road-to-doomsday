import { VARIANTS } from './variants';

const doomRecords = VARIANTS.filter((record) => record.character === 'doom');
export const doomAnnouncement = doomRecords.find(
  (record) => record.medium === 'Cast announcement',
)!;

export const doomSources = {
  debut:
    'https://share.marvel.com/comics/discover/2514/fantastic-fours-first-major-villains',
  origin:
    'https://www.marvel.com/comics/collection/124641/doctor_doom_books_of_doom_2025',
  rivalry:
    'https://www.marvel.com/comics/issue/135609/challenges_of_doom_mr_fantastic_2026_1',
  rule: 'https://www.marvel.com/comics/guides/2493/one-world-under-doom',
  armor:
    'https://shop.jazwares.com/pages/doctor-doom-official-primalux-costume',
} as const;

export const armorSystems = [
  {
    id: 'mask',
    label: 'Iron mask',
    point: [180, 125],
    analysis:
      'The rigid faceplate makes Doom’s expression unreadable. Framed by the hood, the mask becomes the public face of the ruler, separating the man from the identity he presents to Latveria.',
  },
  {
    id: 'plate',
    label: 'Armored torso',
    point: [180, 205],
    analysis:
      'The armored body turns the silhouette into a fortress. Doom carries his defenses with him, whether he is facing a rival or appearing before his subjects.',
  },
  {
    id: 'gauntlets',
    label: 'Gauntlets',
    point: [241, 248],
    analysis:
      'The segmented gauntlets leave the hands free to work. They make an inventor’s precision visible within the silhouette of a heavily armored monarch.',
  },
  {
    id: 'mantle',
    label: 'Hood and mantle',
    point: [105, 171],
    analysis:
      'The cloak gives the metal shell the silhouette of royal dress. In this reading, the soft fabric and hard armor bring Doom’s claims to sovereignty and his dependence on technology into the same frame.',
  },
] as const;
