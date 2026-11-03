import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = readFileSync(
  new URL('../app/lib/incursion.ts', import.meta.url),
  'utf8',
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
});
const exports = {};
runInNewContext(outputText, { exports });
const { evaluateIncursion, DEFAULT_INCURSION, RUN_STEPS } = exports;

test('fixed inputs replay the same stages and threat values', () => {
  const settings = { convergence: 100, shielding: 0 };
  const run = () =>
    Array.from({ length: RUN_STEPS + 1 }, (_, step) =>
      evaluateIncursion(step, settings),
    );
  const frames = run();
  assert.deepEqual(frames, run());
  assert.deepEqual(
    [...new Set(frames.map((frame) => frame.stage))],
    ['Standby', 'Approach', 'Boundary tear', 'Collision', 'Reality collapse'],
  );
  assert.ok(
    frames.every(
      (frame, index) => !index || frame.threat >= frames[index - 1].threat,
    ),
  );
});

test('shielding prevents contact under default convergence and reduces threat', () => {
  const baseline = evaluateIncursion(RUN_STEPS, DEFAULT_INCURSION);
  const protectedFrame = evaluateIncursion(RUN_STEPS, {
    ...DEFAULT_INCURSION,
    shielding: 100,
  });
  assert.equal(baseline.stage, 'Collision');
  assert.ok(baseline.separation <= 2);
  assert.equal(protectedFrame.contact, 0);
  assert.ok(protectedFrame.threat < baseline.threat);
  assert.equal(protectedFrame.dying, false);
});

test('contact and collapse track geometric overlap and damage', () => {
  const settings = { convergence: 100, shielding: 0 };
  for (let step = 0; step <= RUN_STEPS; step++) {
    const frame = evaluateIncursion(step, settings);
    assert.equal(frame.contact > 0, frame.separation < 2);
    assert.equal(frame.dying, frame.damage >= 0.42);
    assert.ok(frame.separation > 0 && frame.threat >= 0 && frame.threat <= 100);
  }
});

test('out of range or nonfinite input produces bounded deterministic frames', () => {
  assert.deepEqual(
    evaluateIncursion(-5, DEFAULT_INCURSION),
    evaluateIncursion(0, DEFAULT_INCURSION),
  );
  assert.deepEqual(
    evaluateIncursion(500, { convergence: 500, shielding: -2 }),
    evaluateIncursion(RUN_STEPS, { convergence: 100, shielding: 0 }),
  );
  assert.equal(
    evaluateIncursion(NaN, { convergence: Infinity, shielding: NaN }).stage,
    'Standby',
  );
});
