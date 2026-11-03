export const TVA_JOURNEY = 'the-incursion-nexus';
export const ARCHIVE_SECTIONS = [
  { id: 'regulations', title: 'TVA regulations', season: 'loki-s1' },
  { id: 'loom', title: 'Temporal Loom', season: 'loki-s2' },
  { id: 'void', title: 'Void artifacts', season: 'loki-s1' },
  { id: 'minutes', title: 'Miss Minutes', season: 'loki-s1' },
] as const;

export const LOOM_STAGES = [
  {
    title: 'Intake',
    detail: 'Raw temporal energy enters the Loom from branching timelines.',
    strands: 3,
  },
  {
    title: 'Weave',
    detail:
      'The Loom refines that energy into physical timelines. The TVA monitors the process from its control room.',
    strands: 5,
  },
  {
    title: 'Overload',
    detail:
      'As branches multiply, the Loom exceeds its capacity. A wider intake cannot handle unlimited branches.',
    strands: 9,
  },
  {
    title: 'Failsafe',
    detail:
      'The finale reveals the Loom as a failsafe designed to preserve the Sacred Timeline by destroying other branches.',
    strands: 1,
  },
] as const;

export const VOID_ARTIFACTS = [
  {
    name: 'Thanos-Copter',
    hint: 'Look for a name painted on the wreckage.',
    screen:
      'A yellow helicopter bearing the name Thanos sits among the debris.',
    reference: 'D23 traces the helicopter to a 1979 Marvel comic.',
  },
  {
    name: 'Frog Thor',
    hint: 'Look down as the camera descends into the Loki hideout.',
    screen: 'A tiny Thor tries to escape a jar marked T365.',
    reference:
      'D23 connects the label to Thor #365 and the frog transformation in the comics.',
  },
  {
    name: 'Yellowjacket helmet',
    hint: 'Watch the skyline for oversized armor.',
    screen: 'An enormous Yellowjacket helmet is visible in the Void.',
    reference:
      'The design recalls the suit from Ant-Man. The shot does not identify its wearer.',
  },
] as const;

export function canOpenArchive(
  season: string,
  watchedIds: readonly string[],
  revealed: boolean,
) {
  return revealed || watchedIds.includes(season);
}
