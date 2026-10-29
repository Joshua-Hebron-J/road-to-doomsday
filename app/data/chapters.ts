import { Chapter } from "../types/chapter";

export const chapters: Chapter[] = [
  // --- The Doom Essential Chapters ---
  {
    id: "chapter-doom-origins",
    title: "Chapter I: Foundations of Power & Failure",
    subtitle: "From Stark Tech to Catastrophic Defeat",
    description:
      "The technological zenith of Earth-616 and the catastrophic failure of heroic defense against existential conquest.",
    order: 1,
    movieIds: ["iron-man", "avengers-infinity-war", "avengers-endgame"],
  },
  {
    id: "chapter-doom-fractures",
    title: "Chapter II: The Temporal Breach & Incursion Science",
    subtitle: "Sacred Timeline Collapse & Incursion Physics",
    description:
      "The collapse of the Sacred Timeline, dimensional trespassing, and the formal introduction of multiversal incursion physics.",
    order: 2,
    movieIds: [
      "loki-s1",
      "spider-man-no-way-home",
      "doctor-strange-in-the-multiverse-of-madness",
      "loki-s2",
    ],
  },
  {
    id: "chapter-doom-horizon",
    title: "Chapter III: The Void & The First Steps",
    subtitle: "Anchor Decays & The Fantastic Four",
    description:
      "Anchor being decay in the Void at the end of time and the interdimensional arrival of Marvel's First Family.",
    order: 3,
    movieIds: ["deadpool-and-wolverine", "fantastic-four-first-steps"],
  },

  // --- The Incursion & TVA Nexus Chapters ---
  {
    id: "chapter-nexus-rupture",
    title: "Chapter I: The Sacred Breach",
    subtitle: "Timeline Rupture & Variant Emergence",
    description:
      "The liberation of infinite timeline branches and the earliest documented dimensional ruptures on Earth-616.",
    order: 1,
    movieIds: ["loki-s1", "what-if-s1", "spider-man-no-way-home"],
  },
  {
    id: "chapter-nexus-incursions",
    title: "Chapter II: Incursion Physics & Temporal Weaving",
    subtitle: "Earth Collisions & The God of Stories",
    description:
      "Documenting the destructive collision of overlapping Earths, sub-atomic quantum exiles, and Loki's sacrifice at the Loom.",
    order: 2,
    movieIds: [
      "doctor-strange-in-the-multiverse-of-madness",
      "ant-man-and-the-wasp-quantumania",
      "loki-s2",
    ],
  },
  {
    id: "chapter-nexus-entropy",
    title: "Chapter III: Entropy, Tears & The Void",
    subtitle: "Dimensional Breaches & Dying Realities",
    description:
      "Interdimensional tears, anchor being decay, and the convergence of parallel universe heroes.",
    order: 3,
    movieIds: [
      "the-marvels",
      "deadpool-and-wolverine",
      "fantastic-four-first-steps",
    ],
  },

  // --- The Full Multiverse Chronicle Chapters ---
  {
    id: "chapter-chronicle-fallout",
    title: "Chapter I: The Infinity Aftermath",
    subtitle: "The Cost of the Blip & Reality Warping",
    description:
      "The heavy cost of reversing the Snap and the initial manifestations of grief-induced reality distortion.",
    order: 1,
    movieIds: ["avengers-infinity-war", "avengers-endgame", "wandavision"],
  },
  {
    id: "chapter-chronicle-fracture",
    title: "Chapter II: The Multiversal Emergence",
    subtitle: "Citadel Rupture & Cosmic Beacons",
    description:
      "The shattering of the Citadel, ancient beacon signals, and the collision of alternate Spider-Men.",
    order: 2,
    movieIds: [
      "loki-s1",
      "what-if-s1",
      "shang-chi-and-the-legend-of-the-ten-rings",
      "spider-man-no-way-home",
      "doctor-strange-in-the-multiverse-of-madness",
    ],
  },
  {
    id: "chapter-chronicle-escalation",
    title: "Chapter III: Geopolitical Fragility & Quantum Exiles",
    subtitle: "Resource Wars & The Temporal Tree",
    description:
      "Terrestrial resource wars, quantum realm conquerors, and the biological reconstruction of the multiverse tree.",
    order: 3,
    movieIds: [
      "black-panther-wakanda-forever",
      "ant-man-and-the-wasp-quantumania",
      "loki-s2",
      "the-marvels",
    ],
  },
  {
    id: "chapter-chronicle-convergence",
    title: "Chapter IV: The Incursion Horizon",
    subtitle: "The Void, Earth Defense & First Steps",
    description:
      "Anchor decay in the Void, militarization on Earth, and the dimensional arrival of the Fantastic Four.",
    order: 4,
    movieIds: [
      "deadpool-and-wolverine",
      "captain-america-brave-new-world",
      "thunderbolts",
      "fantastic-four-first-steps",
    ],
  },
];
