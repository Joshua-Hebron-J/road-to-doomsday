import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright-core';

const baseURL = process.env.A11Y_BASE_URL || 'http://127.0.0.1:3009';
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.A11Y_BROWSER_EXECUTABLE || undefined,
  channel: process.env.A11Y_BROWSER_CHANNEL || undefined,
  args: ['--disable-webgl'],
});
const failures = [];
const findings = [];
let scans = 0;
let manualChecks = 0;
const manualRules = new Set();

async function audit(page, label, selector) {
  const builder = new AxeBuilder({ page });
  if (selector) builder.include(selector);
  const results = await builder.analyze();
  findings.push({
    state: label,
    violations: results.violations,
    incomplete: results.incomplete,
  });
  scans++;
  manualChecks += results.incomplete.length;
  for (const result of results.incomplete) manualRules.add(result.id);
  for (const violation of results.violations) {
    failures.push({
      state: label,
      rule: violation.id,
      nodes: violation.nodes.map((node) => ({
        target: node.target,
        explanation: node.failureSummary,
      })),
    });
  }
  console.log(label + ': ' + results.violations.length + ' axe violations');
}

async function hydrate(page) {
  await page.getByRole('button', { name: 'Search archive' }).click();
  await page.getByRole('button', { name: 'Close search' }).click();
}

async function wrapFocus(page, first, last) {
  await first.focus();
  await page.keyboard.press('Shift+Tab');
  assert(await last.evaluate((element) => document.activeElement === element));
  await page.keyboard.press('Tab');
  assert(await first.evaluate((element) => document.activeElement === element));
}

try {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.addInitScript(() => {
    // Audit the keyboard-equivalent lightweight controls on constrained devices.
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 2 });
    Object.defineProperty(navigator, 'deviceMemory', { get: () => 4 });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const routes = [
    '/',
    '/pathways',
    '/pathways/the-doom-essential',
    '/pathways/the-incursion-nexus',
    '/pathways/the-full-multiverse-chronicle',
    '/a11y-missing-route',
  ];
  for (const width of [1280, 375]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(new URL(route, baseURL).href);
      await hydrate(page);
      for (const section of await page.locator('main > section').all())
        await section.scrollIntoViewIfNeeded();
      await page.locator('footer').scrollIntoViewIfNeeded();
      await audit(page, width + 'px ' + route);
    }
    if (width === 375) {
      await page
        .getByRole('button', { name: 'Toggle navigation menu' })
        .click();
      const navigation = page.getByRole('navigation', {
        name: 'Mobile navigation',
      });
      await navigation.getByRole('link').first().focus();
      await audit(page, 'mobile navigation open');
      await page.keyboard.press('Escape');
      assert.equal(
        await page
          .getByRole('button', { name: 'Toggle navigation menu' })
          .getAttribute('aria-expanded'),
        'false',
      );
      assert(
        await page
          .getByRole('button', { name: 'Toggle navigation menu' })
          .evaluate((element) => document.activeElement === element),
      );
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth),
        375,
      );
    }
  }

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(new URL('/pathways/the-doom-essential', baseURL).href);
  await hydrate(page);
  await page.evaluate(() => document.activeElement?.blur());
  await page.keyboard.press('Control+Home');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  await skip.focus();
  await page.keyboard.press('Enter');
  assert.equal(
    await page.evaluate(() => document.activeElement?.id),
    'main-content',
  );

  const searchButton = page.getByRole('button', { name: 'Search archive' });
  await searchButton.focus();
  await page.keyboard.press('Control+k');
  const search = page.getByRole('dialog', { name: 'Every story led here.' });
  await search.getByRole('searchbox').fill('Iron Man');
  const result = search.getByRole('button', { name: 'Iron Man', exact: true });
  await wrapFocus(
    page,
    search.getByRole('button', { name: 'Close search' }),
    result,
  );
  await audit(page, 'search filtered');
  await result.focus();
  await page.keyboard.press('Enter');
  const dossier = page.locator('#movie-dossier');
  await dossier
    .getByText(
      'Synopsis protected. Reveal spoilers or mark this entry watched to read it.',
    )
    .waitFor();
  const dossierControls = dossier.locator(
    'button:not([disabled]):visible, a[href]:visible',
  );
  await wrapFocus(
    page,
    dossier.getByRole('button', { name: 'Close movie dossier' }),
    dossierControls.last(),
  );
  await audit(page, 'dossier protected');
  await dossier
    .getByRole('button', { name: 'Reveal dossier spoilers' })
    .click();
  await audit(page, 'dossier explicitly revealed');
  await page.keyboard.press('Escape');
  await dossier.waitFor({ state: 'detached' });
  assert(
    await result.evaluate((element) => document.activeElement === element),
  );
  await page.keyboard.press('Escape');
  assert(
    await searchButton.evaluate(
      (element) => document.activeElement === element,
    ),
  );

  await page.keyboard.press('Meta+k');
  await search.waitFor();
  await page.keyboard.press('Escape');
  await search.waitFor({ state: 'hidden' });
  await searchButton.focus();

  await page
    .getByRole('checkbox', { name: 'Mark Iron Man as watched', exact: true })
    .press('Space');
  await page
    .getByRole('status')
    .filter({ hasText: /The Doom Essential: 1 of/ })
    .waitFor();
  const reset = page.getByRole('button', {
    name: 'Reset Progress',
    exact: true,
  });
  await reset.click();
  const confirmation = page.getByRole('dialog', {
    name: 'Reset The Doom Essential Progress?',
  });
  await wrapFocus(
    page,
    confirmation.getByRole('button', { name: 'Cancel', exact: true }),
    confirmation.getByRole('button', { name: 'Confirm Reset' }),
  );
  await audit(page, 'reset confirmation');
  await page.keyboard.press('Escape');
  assert(await reset.evaluate((element) => document.activeElement === element));
  await page.reload();
  await hydrate(page);
  await page
    .getByRole('checkbox', { name: 'Mark Iron Man as unwatched', exact: true })
    .waitFor();

  await page
    .getByRole('button', { name: 'Explore prerequisite lineage' })
    .click();
  await page
    .getByRole('combobox', { name: 'Focus a story', exact: true })
    .waitFor();
  await audit(page, 'prerequisite graph');
  await page.getByRole('button', { name: 'Open sharing studio' }).click();
  await page.getByRole('img', { name: 'Journey graphic preview' }).waitFor();
  assert.equal(
    await page
      .getByRole('checkbox', {
        name: 'Include my watched status in poster and itinerary',
      })
      .isChecked(),
    false,
  );
  await audit(page, 'sharing studio');
  const chapterQueue = page
    .getByRole('button', { name: 'Open chapter queue', exact: true })
    .first();
  await chapterQueue.focus();
  for (let step = 0; step < 24; step++) {
    await page.keyboard.press('Shift+Tab');
    const obscured = await page.evaluate(() => {
      const element = document.activeElement;
      if (
        !document.hasFocus() ||
        !element ||
        element === document.body ||
        element.closest('header, dialog') ||
        element.matches('main, .skip-link')
      )
        return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.top < 72;
    });
    assert.equal(
      obscured,
      false,
      'Keyboard focus must stay below the fixed header',
    );
  }

  await page.goto(new URL('/pathways', baseURL).href);
  await hydrate(page);
  await page.locator('input[type=file]').setInputFiles({
    name: 'progress.json',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify({
        format: 'road-to-doomsday/watch-progress',
        version: 1,
        journeys: [
          { journeyId: 'the-doom-essential', watchedIds: ['iron-man'] },
        ],
      }),
    ),
  });
  await page
    .getByRole('status')
    .filter({ hasText: 'Backup preview ready.' })
    .waitFor();
  await audit(page, 'backup import preview');
  await page.getByRole('button', { name: 'Cancel import' }).click();
  await page
    .getByRole('status')
    .filter({ hasText: 'Import cancelled.' })
    .waitFor();

  await page.goto(new URL('/', baseURL).href);
  await hydrate(page);
  const destinations = page.locator('[data-scene-node]');
  await destinations.first().focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await destinations.nth(1).getAttribute('aria-pressed'), 'true');
  await page
    .getByRole('slider', { name: 'Simulation position', exact: true })
    .press('End');
  await audit(page, 'incursion outcome', '#incursion');
  const tva = page.locator('#tva-archives');
  for (const button of await tva
    .getByRole('group', { name: 'TVA archive sections' })
    .getByRole('button')
    .all()) {
    await button.click();
    await tva.getByRole('button', { name: 'Reveal archive spoilers' }).click();
    await audit(page, 'TVA ' + (await button.innerText()), '#tva-archives');
  }
  for (const button of await page
    .getByRole('group', { name: 'Armor components' })
    .getByRole('button')
    .all()) {
    await button.press('Enter');
    await audit(page, 'armor ' + (await button.innerText()), '#doom-armor');
  }
  for (const button of await page
    .getByRole('group', { name: 'Character lineage', exact: true })
    .getByRole('button')
    .all()) {
    await button.press('Enter');
    await audit(page, 'variant ' + (await button.innerText()), '#variants');
  }
  for (const button of await page
    .locator('button[aria-label^="Map pin:"]')
    .all()) {
    await button.press('Enter');
    await audit(
      page,
      'realm ' + (await button.getAttribute('aria-label')),
      '#realm-nexus',
    );
  }
  assert.equal(
    await page
      .getByRole('button', { name: 'Cinematic audio' })
      .getAttribute('aria-pressed'),
    'false',
  );
  for (const colorScheme of ['light', 'dark']) {
    await page.emulateMedia({ forcedColors: 'active', colorScheme });
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    const headings = await page
      .locator(
        '.text-gradient-silver, .text-gradient-emerald, .text-gradient-gold',
      )
      .evaluateAll((elements) =>
        elements.map((element) => {
          const style = getComputedStyle(element);
          return {
            fill: style.webkitTextFillColor,
            color: style.color,
            image: style.backgroundImage,
          };
        }),
      );
    assert(headings.length > 0);
    assert(
      headings.every(
        (entry) =>
          entry.fill === entry.color &&
          entry.fill !== 'rgba(0, 0, 0, 0)' &&
          entry.image === 'none',
      ),
    );
  }
  await page.goto(new URL('/pathways/the-doom-essential', baseURL).href);
  await hydrate(page);
  const progressBar = page.getByRole('progressbar').first();
  const progressStyle = await progressBar.evaluate((element) => ({
    border: getComputedStyle(element).borderTopStyle,
    fillAdjustment: getComputedStyle(element.firstElementChild)
      .forcedColorAdjust,
  }));
  assert.equal(progressStyle.border, 'solid');
  assert.equal(progressStyle.fillAdjustment, 'none');
  await page.emulateMedia({ forcedColors: 'none', colorScheme: 'dark' });

  const touchContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce',
  });
  const touchPage = await touchContext.newPage();
  await touchPage.goto(new URL('/', baseURL).href);
  await hydrate(touchPage);
  await touchPage.getByRole('button', { name: 'Toggle navigation menu' }).tap();
  await touchPage
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Pathways', exact: true })
    .tap();
  await touchPage.waitForURL('**/pathways');
  assert.equal(
    await touchPage
      .getByRole('button', { name: 'Cinematic audio' })
      .getAttribute('aria-pressed'),
    'false',
  );
  await touchContext.close();
  assert.deepEqual(errors, [], 'Browser runtime errors');
  if (process.env.A11Y_REPORT_PATH) {
    await writeFile(
      process.env.A11Y_REPORT_PATH,
      JSON.stringify(findings, null, 2),
    );
  }
  if (failures.length) throw new Error(JSON.stringify(failures, null, 2));
  console.log('Manual review rules: ' + Array.from(manualRules).join(', '));
  console.log(
    scans +
      ' axe scans passed. ' +
      manualChecks +
      ' incomplete rule results require manual review; automated checks do not establish full accessibility conformance.',
  );
} finally {
  await browser.close();
}
