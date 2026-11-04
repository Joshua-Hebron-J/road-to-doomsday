import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright-core';

const base = process.env.RELEASE_BASE_URL || 'http://127.0.0.1:3014';
const artifacts = process.env.RELEASE_ARTIFACT_DIR;
if (artifacts) await mkdir(artifacts, { recursive: true });
const engines = { chromium, firefox, webkit };
for (const name of (process.env.RELEASE_BROWSERS || 'chromium,firefox,webkit').split(',')) {
  assert(engines[name], 'Unknown browser: ' + name);
  const browser = await engines[name].launch(name === 'chromium' ? {
    executablePath: process.env.RELEASE_CHROMIUM_EXECUTABLE || undefined,
    args: ['--disable-webgl'], timeout: 30000,
  } : { timeout: 30000 });
  try {
    const context = await browser.newContext({ reducedMotion: 'reduce', acceptDownloads: true, viewport: { width: 1280, height: 900 } });
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 2 });
      Object.defineProperty(navigator, 'deviceMemory', { get: () => 4 });
      const Native = window.AudioContext || window.webkitAudioContext;
      window.releaseAudioCount = 0;
      if (Native) window.AudioContext = class extends Native { constructor(...args) { super(...args); window.releaseAudioCount++; } };
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.clock.setFixedTime(new Date('2026-11-04T05:00:00Z'));
    await page.goto(base);
    const section = page.locator('#countdown');
    await section.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('#countdown [role=timer]')?.getAttribute('aria-label')?.startsWith('44 days, 0 hours'));
    assert.equal(await section.getByRole('timer').getAttribute('aria-live'), 'off');
    assert.equal(await section.getByRole('link', { name: 'Verify date with Disney' }).getAttribute('href'), 'https://movies.disney.com/avengers-doomsday');
    if (artifacts) {
      await page.evaluate(() => document.fonts.ready);
      await section.evaluate((e) => e.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await page.screenshot({ path: path.join(artifacts, 'phase21-' + name + '-desktop.png') });
    }
    await section.getByRole('button', { name: 'Pause countdown', exact: true }).press('Enter');
    await page.waitForFunction(() => document.querySelector('#countdown [role=timer]')?.getAttribute('aria-label')?.startsWith('Paused display.'));
    const frozen = await section.getByRole('timer').getAttribute('aria-label');
    await section.getByRole('button', { name: 'Read countdown', exact: true }).press('Enter');
    assert.match(await section.getByRole('status').textContent(), /^Paused display\./);
    await page.clock.setFixedTime(new Date('2026-11-04T05:01:01Z'));
    await page.waitForTimeout(1100);
    assert.equal(await section.getByRole('timer').getAttribute('aria-label'), frozen);
    await section.getByRole('button', { name: 'Resume countdown', exact: true }).press('Space');
    await page.waitForFunction((old) => document.querySelector('#countdown [role=timer]')?.getAttribute('aria-label') !== old, frozen);
    await section.getByRole('button', { name: 'Read countdown', exact: true }).press('Enter');
    assert.match(await section.getByRole('status').textContent(), /days,.*hours,.*minutes/);
    await page.setViewportSize({ width: 375, height: 812 });
    await section.scrollIntoViewIfNeeded();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (artifacts) {
      await page.evaluate(() => document.fonts.ready);
      await section.evaluate((e) => e.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await page.screenshot({ path: path.join(artifacts, 'phase21-' + name + '-mobile.png') });
    }
    const searchButton = page.getByRole('button', { name: 'Search archive', exact: true });
    await searchButton.focus(); await page.keyboard.press('Control+k');
    const search = page.getByRole('dialog', { name: 'Every story led here.' });
    await search.getByRole('searchbox').fill('Infinity War');
    await search.getByRole('button', { name: 'Avengers: Infinity War', exact: true }).press('Enter');
    await page.getByText('Synopsis protected. Reveal spoilers or mark this entry watched to read it.').waitFor();
    await page.keyboard.press('Escape'); await page.locator('#movie-dossier').waitFor({ state: 'detached' });
    await page.keyboard.press('Escape'); await search.waitFor({ state: 'hidden' });
    assert(await searchButton.evaluate((e) => e === document.activeElement));
    await section.getByRole('link', { name: 'Prepare your pathway', exact: true }).click();
    await page.getByRole('link', { name: 'Enter The Doom Essential Dossier', exact: false }).click();
    await page.waitForFunction(() => document.querySelector('button[aria-label="Mark Iron Man as watched"]')?.disabled === false);
    await page.getByRole('checkbox', { name: 'Mark Iron Man as watched', exact: true }).press('Space');
    await page.getByRole('checkbox', { name: 'Mark Iron Man as unwatched', exact: true }).waitFor();
    await page.reload(); await page.getByRole('checkbox', { name: 'Mark Iron Man as unwatched', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Explore prerequisite lineage', exact: true }).click();
    await page.getByRole('combobox', { name: 'Focus a story', exact: true }).selectOption('iron-man');
    await page.getByRole('button', { name: 'Open sharing studio', exact: true }).click();
    const studio = page.locator('#journey-sharing-studio');
    assert.equal(await studio.getByRole('checkbox', { name: 'Include my watched status in poster and itinerary' }).isChecked(), false);
    const download = page.waitForEvent('download');
    await studio.getByRole('button', { name: 'Download PNG', exact: true }).click();
    const image = await readFile(await (await download).path());
    assert.equal(image.readUInt32BE(16), 1080); assert.equal(image.readUInt32BE(20), 1350);
    const guest = await browser.newContext({ reducedMotion: 'reduce' });
    const publicPage = await guest.newPage();
    await publicPage.goto(new URL('/pathways/the-doom-essential', base).href);
    await publicPage.getByRole('checkbox', { name: 'Mark Iron Man as watched', exact: true }).waitFor();
    assert.equal(await publicPage.evaluate(() => localStorage.getItem('rtd_journey_progress_the-doom-essential')), null);
    await guest.close();
    await page.getByRole('link', { name: 'Release countdown', exact: true }).click();
    await page.waitForURL('**/#countdown');
    await page.getByRole('slider', { name: 'Timeline scrubber', exact: true }).press('End');
    await page.getByRole('slider', { name: 'Simulation position', exact: true }).press('End');
    await page.getByRole('button', { name: 'Back to Top', exact: false }).press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'main-content');
    await page.waitForFunction(() => scrollY < 5);
    await page.clock.setFixedTime(new Date('2026-12-18T05:00:00Z'));
    await section.scrollIntoViewIfNeeded();
    await page.getByText('The scheduled date has arrived. Check Disney for current release information.', { exact: true }).waitFor();
    const digits = await section.locator('[role=timer] > div > span:first-child').allTextContents();
    assert(digits.length === 4 && digits.every((value) => value === '00'));
    assert.equal(await page.evaluate(() => window.releaseAudioCount), 0);
    assert.deepEqual(errors, []);
    console.log(name + ' ' + browser.version() + ': countdown/deadline, pause/resume, keyboard focus, protected dossier, progress persistence, graph, PNG, public privacy, chronology, simulator, reduced motion and 375px passed');
    await context.close();
  } finally { await browser.close(); }
}
