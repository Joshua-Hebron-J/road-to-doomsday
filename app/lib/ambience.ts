export const soundscapes = {
  latveria: {
    label: "Latverian synth hum",
    voices: [55, 82.41, 110.2],
    modulation: 0.19,
  },
  loom: {
    label: "Temporal Loom",
    voices: [73.42, 110, 220.6],
    modulation: 0.83,
  },
} as const;

export type Soundscape = keyof typeof soundscapes;
export const soundscapeKey = "doomsday-soundscape";

export function readSoundscape(value: string | null): Soundscape {
  return value === "loom" ? "loom" : "latveria";
}

export function createAmbience(context: AudioContext) {
  const output = context.createGain();
  output.gain.value = 0.16;
  output.connect(context.destination);

  const voices = Array.from({ length: 3 }, (_, index) => {
    const oscillator = context.createOscillator();
    const level = context.createGain();
    oscillator.type = index === 0 ? "sine" : "triangle";
    level.gain.value = [0.22, 0.09, 0.04][index];
    oscillator.connect(level).connect(output);
    oscillator.start();
    return oscillator;
  });
  const modulation = context.createOscillator();
  const depth = context.createGain();
  depth.gain.value = 0.045;
  modulation.connect(depth).connect(output.gain);
  modulation.start();

  let lastCue = -Infinity;

  return {
    select(scene: Soundscape) {
      const preset = soundscapes[scene];
      const now = context.currentTime;
      voices.forEach((voice, index) => {
        voice.frequency.cancelScheduledValues(now);
        voice.frequency.setTargetAtTime(preset.voices[index], now, 0.24);
      });
      modulation.frequency.cancelScheduledValues(now);
      modulation.frequency.setTargetAtTime(preset.modulation, now, 0.24);
    },
    cue() {
      const now = context.currentTime;
      if (context.state !== "running" || now - lastCue < 0.12) return;
      lastCue = now;
      const tone = context.createOscillator();
      const envelope = context.createGain();
      tone.frequency.setValueAtTime(540, now);
      tone.frequency.exponentialRampToValueAtTime(270, now + 0.1);
      envelope.gain.setValueAtTime(0, now);
      envelope.gain.linearRampToValueAtTime(0.2, now + 0.012);
      envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      tone.connect(envelope).connect(output);
      tone.onended = () => {
        tone.disconnect();
        envelope.disconnect();
      };
      tone.start(now);
      tone.stop(now + 0.15);
    },
  };
}
