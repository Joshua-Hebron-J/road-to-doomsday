import { Movie } from "../types/movie";

export const movies: Movie[] = [
  {
    id: "iron-man",
    title: "Iron Man",
    year: 2008,
    runtime: 126,
    type: "movie",
    importance: "essential",
    phase: 1,
    description:
      "Billionaire industrialist Tony Stark constructs a revolutionary powered exosuit after escaping captivity, pioneering modern Earth defense.",
    whyItMatters:
      "Establishes the foundational armor technology, arc reactor engineering, and savior archetype whose legacy echoes directly into Victor Von Doom.",
    prerequisites: [],
    postCreditRequired: true,
  },
  {
    id: "captain-america-civil-war",
    title: "Captain America: Civil War",
    year: 2016,
    runtime: 147,
    type: "movie",
    importance: "optional",
    phase: 3,
    description:
      "Government oversight through the Sokovia Accords fractures the Avengers into opposing camps led by Steve Rogers and Tony Stark.",
    whyItMatters:
      "Demonstrates that internal ideological division shatters superhero alliances, leaving humanity defenseless against sovereign autocracy.",
    prerequisites: ["iron-man"],
    postCreditRequired: true,
  },
  {
    id: "avengers-infinity-war",
    title: "Avengers: Infinity War",
    year: 2018,
    runtime: 149,
    type: "movie",
    importance: "essential",
    phase: 3,
    description:
      "Thanos launches an unrelenting cosmic assault across the universe to acquire all six Infinity Stones and wipe out half of all life.",
    whyItMatters:
      "The catastrophic failure of Earth's defense exposes the inadequacy of reactive heroism—the foundational premise behind Doom's imposition of absolute order.",
    prerequisites: ["iron-man"],
    postCreditRequired: true,
  },
  {
    id: "avengers-endgame",
    title: "Avengers: Endgame",
    year: 2019,
    runtime: 181,
    type: "movie",
    importance: "essential",
    phase: 3,
    description:
      "The surviving Avengers harness the Quantum Realm to execute a temporal time heist, restoring lost lives at the cost of Tony Stark.",
    whyItMatters:
      "The Quantum Time Heist irrevocably alters timeline branches, initiating the temporal instability that fractures the prime continuum.",
    prerequisites: ["avengers-infinity-war"],
    postCreditRequired: false,
  },
  {
    id: "wandavision",
    title: "WandaVision",
    year: 2021,
    runtime: 350,
    type: "series",
    episodes: 9,
    importance: "optional",
    phase: 4,
    description:
      "Overwhelmed by grief, Wanda Maximoff enchants the town of Westview, awakening the Scarlet Witch and claiming the corruptive Darkhold.",
    whyItMatters:
      "Introduces chaos magic, reality restructuring, and the ancient Darkhold—the catalyst for multiversal dreamwalking and incursion crises.",
    prerequisites: ["avengers-endgame"],
    postCreditRequired: true,
  },
  {
    id: "loki-s1",
    title: "Loki (Season 1)",
    year: 2021,
    runtime: 287,
    type: "series",
    episodes: 6,
    importance: "essential",
    phase: 4,
    description:
      "A fugitive 2012 Loki is captured by the Time Variance Authority, uncovering the architect behind the Sacred Timeline at the End of Time.",
    whyItMatters:
      "The single most critical multiversal pivot: the demise of He Who Remains shatters timeline pruning, unleashing infinite multiverse branches.",
    prerequisites: ["avengers-endgame"],
    postCreditRequired: false,
  },
  {
    id: "what-if-s1",
    title: "What If...? (Season 1)",
    year: 2021,
    runtime: 225,
    type: "series",
    episodes: 9,
    importance: "optional",
    phase: 4,
    description:
      "The Watcher observes critical nexus pivots across parallel realities, culminating in the assembly of the Guardians of the Multiverse.",
    whyItMatters:
      "Provides the earliest visual breakdown of single-universe collapse, absolute points in time, and the formation of Battleworld-like coalitions.",
    prerequisites: ["loki-s1"],
    postCreditRequired: true,
  },
  {
    id: "shang-chi-and-the-legend-of-the-ten-rings",
    title: "Shang-Chi and the Legend of the Ten Rings",
    year: 2021,
    runtime: 132,
    type: "movie",
    importance: "optional",
    phase: 4,
    description:
      "Shang-Chi masters the thousand-year-old Ten Rings while confronting his father and defending the mystical dimension of Ta Lo.",
    whyItMatters:
      "The post-credits sequence reveals the Ten Rings are ancient trans-dimensional artifacts broadcasting a homing beacon across space-time.",
    prerequisites: ["avengers-endgame"],
    postCreditRequired: true,
  },
  {
    id: "spider-man-no-way-home",
    title: "Spider-Man: No Way Home",
    year: 2021,
    runtime: 148,
    type: "movie",
    importance: "essential",
    phase: 4,
    description:
      "A fractured mystic containment spell ruptures the fabric of space-time, pulling alternate villains and Peter Parker variants to Earth-616.",
    whyItMatters:
      "The first documented dimensional breach on Earth-616, proving that reality manipulation can pull entities directly from parallel Earths.",
    prerequisites: ["avengers-endgame"],
    postCreditRequired: true,
  },
  {
    id: "doctor-strange-in-the-multiverse-of-madness",
    title: "Doctor Strange in the Multiverse of Madness",
    year: 2022,
    runtime: 126,
    type: "movie",
    importance: "essential",
    phase: 4,
    description:
      "Doctor Strange and America Chavez navigate alternate dimensions to escape the Scarlet Witch, encountering Earth-838's Illuminati.",
    whyItMatters:
      "Explicitly introduces the Incursion concept—the catastrophic collision of two Earths—and features Reed Richards of the Fantastic Four.",
    prerequisites: ["spider-man-no-way-home", "loki-s1"],
    postCreditRequired: true,
  },
  {
    id: "black-panther-wakanda-forever",
    title: "Black Panther: Wakanda Forever",
    year: 2022,
    runtime: 161,
    type: "movie",
    importance: "optional",
    phase: 4,
    description:
      "Wakanda defends its vibranium sovereignty against world superpowers while clashing with the ancient underwater kingdom of Talokan.",
    whyItMatters:
      "Illuminates global geopolitical fragility and resource warfare on Earth, establishing the terrestrial power vacuums that Latveria capitalizes upon.",
    prerequisites: ["avengers-endgame"],
    postCreditRequired: true,
  },
  {
    id: "ant-man-and-the-wasp-quantumania",
    title: "Ant-Man and the Wasp: Quantumania",
    year: 2023,
    runtime: 124,
    type: "movie",
    importance: "optional",
    phase: 5,
    description:
      "Scott Lang and the Pym family are transported into the Quantum Realm, confronting Kang the Conqueror in sub-atomic exile.",
    whyItMatters:
      "Exposes the multiversal Council of Kangs and illustrates how timeline conquerors treat dying universes as collateral casualties.",
    prerequisites: ["loki-s1"],
    postCreditRequired: true,
  },
  {
    id: "loki-s2",
    title: "Loki (Season 2)",
    year: 2023,
    runtime: 294,
    type: "series",
    episodes: 6,
    importance: "essential",
    phase: 5,
    description:
      "With the Temporal Loom failing, Loki masters time-slipping and makes the ultimate personal sacrifice to sustain the multiverse.",
    whyItMatters:
      "Establishes the current multiversal tree architecture: Loki becomes the living God of Stories holding the branches together at the Citadel.",
    prerequisites: ["loki-s1"],
    postCreditRequired: false,
  },
  {
    id: "the-marvels",
    title: "The Marvels",
    year: 2023,
    runtime: 105,
    type: "movie",
    importance: "optional",
    phase: 5,
    description:
      "Captain Marvel, Monica Rambeau, and Ms. Marvel unite when their light-based powers entangle, repairing planetary jump points.",
    whyItMatters:
      "The post-credits sequence shows Monica Rambeau trapped in an alternate universe featuring Hank McCoy (Beast) and the X-Men after sealing a spatial tear.",
    prerequisites: ["avengers-endgame"],
    postCreditRequired: true,
  },
  {
    id: "deadpool-and-wolverine",
    title: "Deadpool & Wolverine",
    year: 2024,
    runtime: 128,
    type: "movie",
    importance: "essential",
    phase: 5,
    description:
      "Deadpool is recruited by rogue TVA agent Paradox to abandon his dying reality, uniting with an alternate Wolverine in the Void.",
    whyItMatters:
      "Establishes Anchor Being mechanics, the inevitable decay of timelines without their focal champions, and deep exploration of the Void.",
    prerequisites: ["loki-s2"],
    postCreditRequired: true,
  },
  {
    id: "captain-america-brave-new-world",
    title: "Captain America: Brave New World",
    year: 2025,
    runtime: 118,
    type: "movie",
    importance: "optional",
    isUpcoming: true,
    phase: 5,
    description:
      "Sam Wilson faces an escalating international crisis sparked by the discovery of celestial Adamantium and covert political conspiracies.",
    whyItMatters:
      "[Editorial Recommendation: Geopolitical Anchor] Documents the fragmentation of global treaties and Earth's defense governance.",
    prerequisites: ["avengers-endgame"],
    postCreditRequired: true,
  },
  {
    id: "thunderbolts",
    title: "Thunderbolts*",
    year: 2025,
    runtime: 125,
    type: "movie",
    importance: "optional",
    isUpcoming: true,
    phase: 5,
    description:
      "A coalition of government-contracted operatives and reformed anti-heroes are thrust into black-ops missions beyond standard oversight.",
    whyItMatters:
      "[Editorial Recommendation: Governance Void] Illustrates the ethical and structural collapse of institutional hero teams on Earth-616.",
    prerequisites: ["black-panther-wakanda-forever"],
    postCreditRequired: true,
  },
  {
    id: "fantastic-four-first-steps",
    title: "The Fantastic Four: First Steps",
    year: 2025,
    runtime: 130,
    type: "movie",
    importance: "essential",
    isUpcoming: true,
    phase: 6,
    description:
      "Operating in an alternate 1960s retro-futuristic universe, Marvel's First Family explores the cosmic frontier while facing planetary doom.",
    whyItMatters:
      "[Editorial Recommendation: Core Narrative Anchor] Introduces Reed Richards and the Fantastic Four, the primary intellectual and philosophical rivals to Victor Von Doom.",
    prerequisites: ["doctor-strange-in-the-multiverse-of-madness"],
    postCreditRequired: true,
  },
];
