import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const code = ts.transpileModule(
  fs.readFileSync(
    new URL('../app/lib/accessibility.ts', import.meta.url),
    'utf8',
  ),
  {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
    },
  },
).outputText;
const exports = {};
vm.runInNewContext('(function(exports){' + code + '\n})', {
  getComputedStyle: (element) => ({
    visibility: element.visibility ?? 'visible',
  }),
})(exports);
const { trapDialogFocus } = exports;

function modal() {
  const document = { activeElement: null };
  function button(options = {}) {
    const element = {
      tabIndex: 0,
      matches: () => false,
      closest: () => null,
      getClientRects: () => [1],
      focus() {
        document.activeElement = this;
      },
      ...options,
    };
    return element;
  }
  const first = button();
  const last = button();
  const controls = [first, last];
  const container = {
    ownerDocument: document,
    querySelectorAll: () => controls,
    contains: (element) => controls.includes(element),
    focus() {
      document.activeElement = this;
    },
  };
  function press(shiftKey = false, key = 'Tab') {
    let prevented = false;
    trapDialogFocus(
      {
        shiftKey,
        key,
        preventDefault() {
          prevented = true;
        },
      },
      container,
    );
    return prevented;
  }
  return { document, button, first, last, controls, container, press };
}

test('modal focus wraps both ends and leaves ordinary navigation to the browser', () => {
  const fixture = modal();
  fixture.document.activeElement = fixture.last;
  assert(fixture.press());
  assert.equal(fixture.document.activeElement, fixture.first);
  assert(fixture.press(true));
  assert.equal(fixture.document.activeElement, fixture.last);
  fixture.document.activeElement = fixture.first;
  assert.equal(fixture.press(), false);
  assert.equal(fixture.press(false, 'Enter'), false);
});

test('focus wrapping skips disabled, hidden, inert and programmatic-only controls', () => {
  const fixture = modal();
  fixture.controls.push(
    fixture.button({ matches: () => true }),
    fixture.button({ closest: () => ({}) }),
    fixture.button({ getClientRects: () => [] }),
    fixture.button({ visibility: 'hidden' }),
    fixture.button({ tabIndex: -1 }),
  );
  fixture.document.activeElement = fixture.last;
  assert(fixture.press());
  assert.equal(fixture.document.activeElement, fixture.first);
});

test('modals recover focus from outside or a dossier heading and handle empty controls', () => {
  const fixture = modal();
  fixture.document.activeElement = {};
  assert(fixture.press());
  assert.equal(fixture.document.activeElement, fixture.first);
  fixture.document.activeElement = { tabIndex: -1 };
  assert(fixture.press(true));
  assert.equal(fixture.document.activeElement, fixture.last);
  fixture.controls.length = 0;
  assert(fixture.press());
  assert.equal(fixture.document.activeElement, fixture.container);
});
