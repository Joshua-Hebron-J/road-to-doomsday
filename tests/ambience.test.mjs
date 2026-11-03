import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../app/lib/ambience.ts", import.meta.url), "utf8");
const { createAmbience, readSoundscape, soundscapes } = await import(
  "data:text/javascript," + encodeURIComponent(ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText)
);

function parameter() {
  return {
    targets: [],
    cancelScheduledValues() {},
    setTargetAtTime(value) { this.targets.push(value); },
    setValueAtTime() {},
    linearRampToValueAtTime() {},
    exponentialRampToValueAtTime() {},
  };
}

function audioContext() {
  const oscillators = [];
  return {
    oscillators,
    currentTime: 0,
    state: "running",
    createGain() {
      return { gain: parameter(), connect: (node) => node, disconnect() {} };
    },
    createOscillator() {
      const node = {
        frequency: parameter(),
        connect: (target) => target,
        disconnect() { this.disconnected = true; },
        start() {},
        stop(time) { this.endTime = time; },
      };
      oscillators.push(node);
      return node;
    },
  };
}

test("soundscape preference accepts only known presets", () => {
  assert.equal(readSoundscape("loom"), "loom");
  assert.equal(readSoundscape("latveria"), "latveria");
  assert.equal(readSoundscape("constructor"), "latveria");
  assert.equal(readSoundscape(null), "latveria");
});

test("changing scenes retunes the existing voices and modulation", () => {
  const context = audioContext();
  const engine = createAmbience(context);
  engine.select("latveria");
  engine.select("loom");
  assert.deepEqual(context.oscillators.map(({ frequency }) => frequency.targets), [
    ...soundscapes.latveria.voices.map((value, index) => [value, soundscapes.loom.voices[index]]),
    [soundscapes.latveria.modulation, soundscapes.loom.modulation],
  ]);
});

test("interaction cues are throttled, finite and silent in a suspended context", () => {
  const context = audioContext();
  const engine = createAmbience(context);
  engine.cue();
  engine.cue();
  assert.equal(context.oscillators.length, 5);
  const cue = context.oscillators.at(-1);
  assert.equal(cue.endTime, 0.15);
  cue.onended();
  assert.equal(cue.disconnected, true);
  context.currentTime = 1;
  context.state = "suspended";
  engine.cue();
  assert.equal(context.oscillators.length, 5);
  context.state = "running";
  engine.cue();
  assert.equal(context.oscillators.length, 6);
});
