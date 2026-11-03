export const RUN_STEPS = 100;

export interface IncursionSettings {
  convergence: number;
  shielding: number;
}

export const DEFAULT_INCURSION: IncursionSettings = {
  convergence: 70,
  shielding: 25,
};

export const REALITIES = [
  { designation: 'Earth-616', color: '#5eead4' },
  { designation: 'Earth-838', color: '#c4b5fd' },
] as const;

function clamp(value: number, maximum: number) {
  return Number.isFinite(value) ? Math.min(maximum, Math.max(0, value)) : 0;
}

/** Fictional model units. Contact occurs when center separation reaches two radii. */
export function evaluateIncursion(step: number, settings: IncursionSettings) {
  const time = clamp(step, RUN_STEPS) / RUN_STEPS;
  const drive = clamp(settings.convergence, 100) / 100;
  const shield = clamp(settings.shielding, 100) / 100;
  const separation = Math.max(
    0.35,
    5.6 - time * (1.7 + 4 * drive) * (1 - shield * 0.48),
  );
  const contact = Math.max(0, 2 - separation);
  const stress = clamp((5.6 - separation) / 3.6, 1) * (1 - shield * 0.35);
  const damage = clamp(contact * (1 - shield * 0.55), 1);
  const threat = Math.round(clamp(stress * 72 + damage * 54, 100));
  const dying = damage >= 0.42;
  const stage = dying
    ? 'Reality collapse'
    : separation <= 2
      ? 'Collision'
      : stress >= 0.5
        ? 'Boundary tear'
        : time > 0
          ? 'Approach'
          : 'Standby';
  return { separation, contact, stress, damage, threat, dying, stage };
}

export type IncursionFrame = ReturnType<typeof evaluateIncursion>;
