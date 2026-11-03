export const CHARACTERS = [
  { id: 'strange', name: 'Doctor Strange', color: '#fcd34d' },
  { id: 'loki', name: 'Loki', color: '#6ee7b7' },
  { id: 'reed', name: 'Reed Richards', color: '#7dd3fc' },
  { id: 'wanda', name: 'Wanda Maximoff', color: '#fda4af' },
  { id: 'doom', name: 'Victor Von Doom', color: '#c4b5fd' },
] as const;

export type CharacterId = (typeof CHARACTERS)[number]['id'];

export interface Variant {
  id: string;
  character: CharacterId;
  name: string;
  reality: string;
  medium: 'Screen appearance' | 'Legacy film' | 'Cast announcement';
  description: string;
  source: string;
  movieId?: string;
  externalTitle?: string;
}

const madness = 'doctor-strange-in-the-multiverse-of-madness';
const madnessSource =
  'https://www.marvel.com/movies/doctor-strange-in-the-multiverse-of-madness';
const screen = 'Screen appearance';

export const VARIANTS: readonly Variant[] = [
  {
    id: 'strange-616',
    character: 'strange',
    name: 'Stephen Strange',
    reality: 'Earth-616',
    medium: screen,
    movieId: madness,
    description:
      'Strange travels with America Chavez and meets counterparts whose choices show the cost of crossing realities.',
    source:
      'https://d23.com/can-you-find-these-23s-in-disney-movies-and-series/',
  },
  {
    id: 'strange-838',
    character: 'strange',
    name: 'Illuminati Strange',
    reality: 'Earth-838',
    medium: screen,
    movieId: madness,
    description:
      'This Earth’s Strange helped the Illuminati defeat Thanos. His use of the Darkhold brought about an incursion.',
    source: madnessSource,
  },
  {
    id: 'loki-tva',
    character: 'loki',
    name: 'TVA Loki',
    reality: '2012 branch',
    medium: screen,
    movieId: 'loki-s1',
    description:
      'Loki escapes with the Tesseract during the Avengers’ time heist, setting him on a path through the TVA.',
    source: 'https://d23.com/meet-the-characters-of-loki/',
  },
  {
    id: 'loki-sylvie',
    character: 'loki',
    name: 'Sylvie',
    reality: 'Unnumbered branch',
    medium: screen,
    movieId: 'loki-s1',
    description:
      'A Loki variant who uses enchantment and challenges the TVA. Meeting her changes what Loki believes his future can be.',
    source:
      'https://www.marvel.com/articles/tv-shows/loki-sophia-di-martino-sylvie',
  },
  {
    id: 'loki-classic',
    character: 'loki',
    name: 'Classic Loki',
    reality: 'Unnumbered branch',
    medium: screen,
    movieId: 'loki-s1',
    description:
      'An older Loki encountered in the Void who uses illusion to help the others confront Alioth.',
    source:
      'https://www.marvel.com/articles/tv-shows/loki-variants-character-posters',
  },
  {
    id: 'reed-838',
    character: 'reed',
    name: 'Illuminati Reed',
    reality: 'Earth-838',
    medium: screen,
    movieId: madness,
    description:
      'Mister Fantastic serves on the Illuminati and explains the danger of incursions to the visiting Strange.',
    source: madnessSource,
  },
  {
    id: 'reed-828',
    character: 'reed',
    name: 'First Family Reed',
    reality: 'Earth-828',
    medium: screen,
    movieId: 'fantastic-four-first-steps',
    description:
      'This Mister Fantastic leads a team whose scientific ingenuity and family ties are tested by Galactus.',
    source:
      'https://www.marvel.com/articles/movies/fantastic-four-first-steps-avengers-doomsday-kevin-feige',
  },
  {
    id: 'wanda-616',
    character: 'wanda',
    name: 'Scarlet Witch',
    reality: 'Earth-616',
    medium: screen,
    movieId: madness,
    description:
      'Wanda uses the Darkhold to dreamwalk into another Wanda’s life in search of her children.',
    source: madnessSource,
  },
  {
    id: 'wanda-838',
    character: 'wanda',
    name: 'Wanda of Earth-838',
    reality: 'Earth-838',
    medium: screen,
    movieId: madness,
    description:
      'This Wanda lives with Billy and Tommy. Her encounter with her counterpart exposes the human cost of dreamwalking.',
    source: madnessSource,
  },
  {
    id: 'doom-2005',
    character: 'doom',
    name: 'Doctor Doom',
    reality: '2005 film continuity',
    medium: 'Legacy film',
    externalTitle: 'Fantastic Four (2005)',
    description:
      'The Fantastic Four’s former patron becomes their armored adversary in this separate screen adaptation.',
    source:
      'https://www.disneyplus.com/browse/entity-d6592baa-0dc6-4549-a0cb-3b93a3b0e260',
  },
  {
    id: 'doom-doomsday',
    character: 'doom',
    name: 'Doomsday Doctor Doom',
    reality: 'Undesignated',
    medium: 'Cast announcement',
    externalTitle: 'Avengers: Doomsday',
    description:
      'Marvel Studios announced Robert Downey Jr. as Victor Von Doom. The casting announcement does not establish his Earth or an in-story connection to Tony Stark.',
    source:
      'https://thewaltdisneycompany.com/news/marvel-studios-announces-robert-downey-jr-and-the-russo-brothers-to-return-for-avengers-doomsday/',
  },
];
