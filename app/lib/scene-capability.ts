export type SceneCapability = '3d' | 'lightweight';
interface DeviceHints {
  cores?: number;
  memory?: number;
  saveData?: boolean;
}
interface ProbeContext {
  getExtension(name: string): { loseContext(): void } | null;
}

/** Avoid allocating a renderer on constrained devices; release the one-time capability probe. */
export function detectSceneCapability(
  device: DeviceHints,
  createContext: () => ProbeContext | null,
): SceneCapability {
  if (
    device.saveData ||
    (device.memory !== undefined && device.memory <= 2) ||
    (device.cores !== undefined && device.cores > 0 && device.cores <= 2)
  )
    return 'lightweight';
  try {
    const context = createContext();
    if (!context) return 'lightweight';
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return '3d';
  } catch {
    return 'lightweight';
  }
}
