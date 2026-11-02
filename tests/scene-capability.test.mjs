import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source = fs.readFileSync(
  new URL('../app/lib/scene-capability.ts', import.meta.url),
  'utf8',
);
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const api = {};
vm.runInNewContext(code, { exports: api });
const detect = api.detectSceneCapability;

test('data-saver and constrained devices never allocate a WebGL context', () => {
  for (const device of [
    { saveData: true },
    { memory: 2 },
    { memory: 1 },
    { cores: 1 },
    { cores: 2 },
  ]) {
    let probes = 0;
    assert.equal(
      detect(device, () => {
        probes++;
        return null;
      }),
      'lightweight',
    );
    assert.equal(probes, 0);
  }
});
test('missing and blocked WebGL safely select the lightweight map', () => {
  assert.equal(
    detect({ cores: 8, memory: 8 }, () => null),
    'lightweight',
  );
  assert.equal(
    detect({}, () => {
      throw new Error('context unavailable');
    }),
    'lightweight',
  );
});
test('capable devices release the probe and enable the real scene', () => {
  for (const device of [{ cores: 8, memory: 8 }, {}, { cores: 0 }]) {
    let released = false;
    assert.equal(
      detect(device, () => ({
        getExtension(name) {
          assert.equal(name, 'WEBGL_lose_context');
          return {
            loseContext() {
              released = true;
            },
          };
        },
      })),
      '3d',
    );
    assert.equal(released, true);
  }
  assert.equal(
    detect({}, () => ({
      getExtension() {
        return null;
      },
    })),
    '3d',
  );
});
