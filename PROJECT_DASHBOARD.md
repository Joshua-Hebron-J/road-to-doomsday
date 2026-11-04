# The Road to Doomsday — Project Milestone Dashboard

This living dashboard tracks development progress, milestone criteria, verification results, and subsequent phases for *The Road to Doomsday* cinematic fan archive across the original 21-phase master roadmap.

**Latest verification:** Final Phase 21 checkpoint review passed lint, TypeScript, all 65 unit tests, production build/postbuild, Chromium/WebKit regression checks and 46 axe scans with zero violations. The 38 incomplete accessibility records and manual device/browser/deployment gates remain documented. All 21 original roadmap phases are intact. This is a functional release candidate, not production deployment approval. Earlier entries are historical.

---

## 21-Phase Master Roadmap

| Phase | Milestone Name | Status | Completion Date | Focus & Scope |
| :---: | :--- | :---: | :---: | :--- |
| **01** | **Project Foundation & Data Architecture** | **COMPLETE** | 2026-10-27 | Next.js 16 + React 19 app architecture, 3D Multiverse Rift hero, canonical MCU data schemas, and data integrity validator. |
| **02** | **Cinematic Design System & Tokens** | **COMPLETE** | 2026-10-27 | Standardized design tokens (obsidian, emerald, titanium, gold), reusable UI primitives (`Button`, `Badge`, `Card`, `SectionHeader`), WCAG AA contrast, accessible focus rings, and reduced-motion enforcement. |
| **03** | **Homepage Experience & Visual Showcase** | **COMPLETE** | 2026-10-27 | Atmospheric hero canvas with WebGL fallback, Pillars of Doom motion reveal, pathways preview tabs, macro timeline preview, responsive header & footer. |
| **04** | **Choose Your Path (Dossier & Path Selection)** | **COMPLETE** | 2026-10-27 | Dedicated `/pathways` route, 3 cinematic dossiers with distinct editorial identities (The Doom Essential, The Incursion & TVA Nexus, The Full Multiverse Chronicle), audience profiles, runtime calculations, dedicated `/pathways/[id]` dynamic routing, and custom 404 timeline anomaly handling. |
| **05** | **Journey Engine (Interactive Watch Tracker)** | **VERIFIED** | 2026-11-02 | Local storage watch state persistence (`Progress`, `WatchState`), interactive checklist toggles, real-time progress bar, dynamic remaining runtime recalculation, and next-movie recommendation indicator based on `journey.ts`. |
| **06** | **Pathway Deep Dive & Chapter Navigation** | **VERIFIED** | 2026-11-02 | Full chapter accordions, contextual watch queues, prerequisites warnings, and spoiler-shield controls. |
| **07** | **Media Detail System & Cinematic Dossiers** | **IMPLEMENTED / VERIFIED** | 2026-11-02 | Drawer/modal movie dossiers, "Why It Matters" lore analysis, post-credit stinger indicators, and streaming service links. |
| **08** | **Prerequisite Lineage & Dependency Graph** | **INITIAL STORY GRAPH VERIFIED** | 2026-11-02 | Interactive visual node graph displaying precursor story dependencies and technology lineages leading to Doomsday. |
| **09** | **Multiverse Macro Chronology & Timeline Scrubber** | **IMPLEMENTED / VERIFIED — SIX-EVENT ARCHIVE** | 2026-11-03 | Interactive horizontal timeline scrubber with in-universe chronological year and theatrical release date toggle modes. |
| **10** | **Incursion Engine & Reality Tear Simulator** | **IMPLEMENTED / VERIFIED** | 2026-11-03 | Interactive dimensional collision simulation, incursion threat gauge, universe designation badges, and dying reality alerts. |
| **11** | **Character & Variant Lineage Tracker** | **IMPLEMENTED / VERIFIED** | 2026-11-03 | Tracking variants across alternate Earths (Doctor Strange, Loki, Reed Richards, Wanda Maximoff, Victor Von Doom). |
| **12** | **Doctor Doom & Latverian Lore Codex** | **IMPLEMENTED / VERIFIED** | 2026-11-03 | Victor Von Doom entity dossier, comic origins vs MCU adaptation, monarch armor analysis, and sovereign philosophical worldview. |
| **13** | **TVA & Temporal Loom Archives** | **IMPLEMENTED / VERIFIED** | 2026-11-03 | TVA regulations, temporal loom mechanics, Void artifacts, and Miss Minutes easter eggs. |
| **14** | **Interactive Multiverse Map & Realm Nexus** | **IMPLEMENTED / VERIFIED** | 2026-11-03 | Spatial visualization of Earth-616, Earth-838, the Void, the Quantum Realm, and Battleworld convergence. |
| **15** | **User Profile & Watch Progress Synchronization** | **IMPLEMENTED / VERIFIED — FILE TRANSFER** | 2026-11-03 | Exportable/importable watch states (JSON), backup readiness, and multi-device progress tracking. |
| **16** | **Cinematic Audio Scapes & Ambience Engine** | **IMPLEMENTED / VERIFIED** | 2026-11-03 | Latverian ambient synth hum, temporal loom audio textures, audio mute/toggle control, and interaction sound effects. |
| **17** | **Search, Multiverse Filters & Tagging System** | **IMPLEMENTED / VERIFIED** | 2026-11-04 | Instant omni-search across movies, characters, phases, and narrative themes with keyboard shortcuts (`Cmd+K`). |
| **18** | **Watchlist Sharing & Custom Poster Generator** | **IMPLEMENTED / VERIFIED** | 2026-11-04 | Custom graphic generator for social sharing, journey completion certificate, and downloadable watch itineraries. |
| **19** | **Accessibility (a11y) & Screen Reader Hardening** | **IMPLEMENTED / VERIFIED** | 2026-11-04 | Comprehensive ARIA live regions, keyboard navigation audit, focus traps for drawers, and automated axe-core compliance. |
| **20** | **Performance Optimization & Offline PWA** | **IMPLEMENTED / VERIFIED** | 2026-11-04 | Asset preloading, service worker caching for offline viewing, bundle optimization, and image format audits. |
| **21** | **Pre-Doomsday Countdown & Launch Polish** | **IMPLEMENTED / VALIDATED — RELEASE GATES OPEN** | 2026-11-04 | Live theatrical countdown clock to Avengers: Doomsday release, final cross-browser validation, and release readiness. |

---

## Phase 4 Verification Audit

* **TypeScript Compilation (`npx tsc --noEmit`)**: **PASSED** (0 errors)
* **Linting (`npm run lint`)**: **PASSED** (0 warnings, 0 errors, strict Next.js link rules enforced)
* **Production Build (`npm run build`)**: **PASSED** (Turbopack static prerendering succeeded; static routes `/`, `/pathways`, `/_not-found`, and SSG routes `/pathways/the-doom-essential`, `/pathways/the-incursion-nexus`, `/pathways/the-full-multiverse-chronicle` generated cleanly)
* **Data Integrity (`validateDataIntegrity()`)**: **PASSED** (18 movies, 10 chapters, 3 journeys verified with 100% data coherence)
* **Browser Verification**:
  * **Pathways Hub (`/pathways`)**:
    * Rendered at desktop width (1280x800).
    * Verified distinct editorial identities:
      * **The Doom Essential**: Latverian Sovereign Directive (emerald, crest badge, tactical sprint).
      * **The Incursion & TVA Nexus**: Temporal Variance Archive (silver/titanium, casefile badge, quantum incursion focus).
      * **The Full Multiverse Chronicle**: The Watcher's Celestial Codex (gold trim, omniverse scope, complete saga marathon).
    * Interactive **Comparison Matrix** toggle tested: displays side-by-side criteria (audience, runtime, scope, pacing, continuity).
    * Preference filter tabs tested (`All Tracks`, `Express (24h)`, `TVA / Incursions`, `Full Saga (48h)`).
  * **Dedicated Pathway Route (`/pathways/[id]`)**:
    * Verified `/pathways/the-doom-essential` renders dedicated dossier briefing, stats ribbon, chapter breakdowns, and Phase 5 engine preparation banner.
    * Tested quick-switcher pills to navigate between sibling pathways.
  * **Timeline Anomaly 404 Route (`/pathways/invalid-journey-test`)**:
    * Verified custom thematic 404 page ("Reality Desynchronization // Timeline Anomaly") renders with diagnostic readout and recovery buttons (`Choose Your Path`, `Return to Sanctuary`).
  * **Mobile Responsiveness (375x812)**:
    * Verified fluid single-column layout, touch-friendly buttons, and zero horizontal scrolling on mobile viewport.
  * **Browser Console**:
    * **0 errors and 0 warnings** found.

---

## Original Phase 5 Requirements (historical; superseded by the audit below)

1. **Interactive Watch State**: Implement a reactive state and local storage hook (`useWatchProgress`) utilizing the existing [app/types/watch-state.ts](file:///c:/Projects/road-to-doomsday/app/types/watch-state.ts) and [app/types/progress.ts](file:///c:/Projects/road-to-doomsday/app/types/progress.ts) interfaces.
2. **Interactive Movie Checklists**: Allow users to toggle individual movies and episodes as *watched* or *unwatched* directly on the dedicated pathway page (`/pathways/[id]`).
3. **Dynamic Progress Bar & Runtime Recalculation**: Display live completion percentages and dynamically recalculate remaining watch time as entries are checked off.
4. **Next-Up Recommendation Indicator**: Surface the next unwatched movie in sequence using `getNextMovie()` from [app/lib/journey.ts](file:///c:/Projects/road-to-doomsday/app/lib/journey.ts).


---

## Phase 5–6 Audit and Implementation — 2026-11-02

**Historical review gate (superseded by Phase 7 below):** Phase 6 implementation is ready for review. Production-build verification and physical-device/reduced-motion QA remain open; 375px browser QA is recorded in the 3D follow-up below; this is not a production release sign-off. Phase 7 implementation has not started.

### Audit findings

Read the dashboard, package scripts, homepage/global styles, data, types, helpers, hook, components, and pathway routes in the existing working project. Followed the repository's Next.js guidance and installed client/server component documentation. The ZIP was not extracted over the working project.

- Phase 5 already existed despite the dashboard listing it as incomplete. Its progress calculations, journey-specific storage keys, next-objective helper, themed banners, checklists, and bulk actions were reusable.
- Confirmed fragile hook behavior: persistence, custom event dispatch, and other state setters ran inside React functional updaters; microtask loading could expose stale state when changing journeys; storage-clear events were ignored; error reporting differed by mutation.
- Chapter sections were labelled accordions but were permanently expanded. Chapter completion counts already existed and were retained.
- Synopsis, lore, chapter briefings, and next-objective text exposed spoilers unconditionally. Prerequisite badges did not explain missing context outside the selected pathway.
- Reset confirmation lacked focus containment; initial focus targeted the destructive action. Browser QA also identified focus restoration occurring before the native dialog closed; this was corrected.
- Existing architecture, routes, canonical datasets, themes, homepage, global styles, and dependencies were preserved.

### Implemented

- `useWatchProgress` now subscribes through React 19's `useSyncExternalStore`. Stable server snapshots avoid hydration writes; keyed route instances prevent local chapter/reveal state leaking between journeys.
- Shared per-journey stores preserve existing version-1 localStorage keys/payloads, validate version/journey/IDs, deduplicate IDs, retain rapid local changes, and synchronize same-tab consumers and cross-tab updates, including storage clearing.
- Blocked reads and failed writes retain progress in session memory and consistently expose a storage warning for watch, unwatch, bulk completion, and reset actions.
- Existing progress percentages, remaining runtime, essential totals, recommendations, and isolated resets remain in use.
- Expandable chapter queues use labelled buttons/regions, completion bars, chapter counts, remaining runtimes, navigation shortcuts, and links from next-up and prerequisite warnings.
- Spoiler shield defaults on. Unwatched synopsis/significance, incomplete chapter titles/briefings, and dossier narrative are protected. Watched titles unlock their own text; individual reveals are reversible, and the global shield toggle clears reveal exceptions.
- Prerequisite warnings distinguish entries inside/outside the journey without blocking viewing or importing progress from other journeys.
- Native reset dialog starts on Cancel, contains keyboard focus, supports Escape, and restores focus after cancellation. Confirming reset focuses the first chapter because the reset trigger disappears.
- Watch buttons and primary affected controls have 44px targets; breadcrumb/bulk controls wrap. Chapter content is unmounted when collapsed. Motion transitions and chapter scrolling respect reduced-motion settings; existing CSS motion overrides remain.

### Modified files

- `app/hooks/use-watch-progress.ts` — hook/store subscription and derived progress.
- `app/lib/watch-progress-store.ts` — new persistence/synchronization store using the existing WatchState type and journey data.
- `app/components/journey-engine-view.tsx` — chapter controls, queue navigation, spoilers, warnings, responsive controls, reset accessibility.
- `app/pathways/[id]/page.tsx` — journey-keyed view instance.
- `tests/watch-progress.test.mjs` — seven regression tests using Node's test runner and the existing TypeScript dependency.
- `PROJECT_DASHBOARD.md` — audited statuses, verification, limitations, and next-phase outline.

### Verification performed

- `npm run lint`: **PASS**, zero lint errors/warnings on the final implementation.
- `npx tsc --noEmit`: **PASS**, zero TypeScript errors on the final implementation.
- `node --test tests/watch-progress.test.mjs`: **PASS**, 7/7. Covers actual store/data modules in isolated browser-like contexts: data/queue coherence, stable hydration snapshots, rapid toggles, idempotent marking, refresh persistence, journey isolation, cross-tab and clear events, malformed/mismatched/foreign saved values, storage failures, metrics, recommendations, completion, and isolated reset.
- Data integrity: **PASS**, 18 media entries, 10 chapters, 3 journeys. Chapter queues match each journey's ordered media IDs.
- `npm run build`: **NOT PASSED**. Initial run could not fetch existing Geist/Geist Mono Google Fonts under restricted networking. After network access was granted, repeated Turbopack runs failed creating a PostCSS worker (`node process exited before we could connect`, exit code 0). Retried with the dev server stopped; same error.
- Diagnostic fallback `npm run build -- --webpack`: **NOT PASSED**, generated-output permission error (`EPERM`, mkdir `.next/types/app/pathways`). No build configuration or font workaround was introduced. Run the normal build in a terminal with full project access before release.
- Browser QA performed in the in-app Chromium browser against the local Next dev server: watch/unwatch, refresh persistence, synchronization between two tabs, isolated journey progress, next-up changes, chapter shortcuts/expansion/collapse, prerequisite chapter focus, individual spoiler reveal/hide, global shield toggle, chapter completion via Space, reset cancellation/confirmation, Escape, focus containment, and focus restoration.
- Concrete observed metrics: Iron Man watched => 1/9, 11%, 1443 minutes remaining, Infinity War next. A second tab updated to 22% after Infinity War. Completing the first chapter showed COMPLETE and 0m remaining. Reset cancel retained 33%; confirm returned to 0%.
- Latest QA tab console inspection: no warnings/errors captured. An earlier development navigation emitted Next's existing `data-scroll-behavior` recommendation; the global layout was not changed.
- Third-pathway smoke check: Full Multiverse Chronicle rendered its own heading and four chapter navigation buttons. A final watch/unwatch cycle returned Doom Essential to 0%.
- Desktop/smaller-window layouts inspected visually. **Initial 375px QA attempt did not apply**: the page reported approximately 714px. This initial limitation is superseded by the successful 375px browser checks in the 3D follow-up below; physical-device testing remains open.
- Reduced-motion branches/CSS reviewed in source; OS media-preference emulation and screen-reader/axe audits were not performed.

### Known limitations and technical debt

- Production build remains unverified for the environment reasons above; do not mark the release ready until a normal build passes.
- 375px browser QA was completed in the 3D follow-up below; physical-device and system reduced-motion QA remain open before release.
- localStorage provides last-writer-wins synchronization, not atomic conflict resolution for truly simultaneous writes from separate tabs. Sequential edits read the latest persisted snapshot. Multi-device sync remains Phase 15.
- Spoiler controls are local to pathway detail pages and reset to the safe default on refresh/journey changes; homepage, hub, SEO metadata, and other routes have no new global spoiler preference.
- Existing editorial data contains speculative narrative connections and 2025 media still flagged `isUpcoming`. These were preserved and need a separate factual/editorial review; streaming availability has not been asserted.
- The global footer still carries its existing Phase 4 badge; no unrelated sitewide redesign was made.
- Automated tests cover the store and calculations, not a full mounted React StrictMode or assistive-technology suite.

### Next recommended phase — Phase 7 outline only

After Phase 6 review, production-build verification, and phone QA:

1. Add an accessible movie dossier drawer opened from existing queue titles, with labelled dialog semantics, Escape/focus restoration, keyboard containment, and reduced-motion support. Preserve watch actions and chapter navigation.
2. Reuse `Movie.description` for synopsis, `whyItMatters` for the Why It Matters section, `postCreditRequired` for post-credit indicators, and `prerequisites` with `getMovieById` for narrative connections. Keep unverified editorial interpretation clearly identified.
3. Apply the same spoiler-shield and journey-specific watched state to all dossier content; opening a dossier must not mark anything watched.
4. Add streaming links only after verifying the title/provider/region and recording source/date. Omit unavailable or unverified links rather than inserting placeholders.
5. Verify keyboard/mobile behavior, spoiler boundaries, state preservation, performance, lint, TypeScript, and production build before marking Phase 7 complete.

**Stopped for Phase 6 review. No Phase 7 drawer, streaming integration, commits, pushes, or deployments were made.**


---

## Core 3D Experience Follow-up — 2026-11-02

**Status: IMPLEMENTED / CORE BROWSER INTERACTIONS VERIFIED / RELEASE GATES OPEN. The full 3D experience is not marked complete.**

3D is a core interaction requirement. Final sign-off requires production-build success, system reduced-motion verification, context-loss testing, and physical-device performance profiling. Phase 6 remains at the review gate; Phase 7 implementation remains unstarted.

### Audit and design decisions

The existing landing scene used real Three.js geometry, but the canvas and its outer container disabled pointer events. Its frame loop read pointer values that could not respond to the user. WebGL support checks also repeatedly created probe contexts, and the old Sparkles component kept its animation enabled under reduced motion. The timeline was entirely 2D.

The existing React Three Fiber scene, visual tokens, components, and datasets were retained. New scene projections derive directly from journey, event, chapter, movie, and watch-state data; they are view props, not a second canonical content model. No packages, external textures, font assets, backend services, or routes were added.

### Implemented interactive scenes

- **Landing reality selector:** the existing MultiverseRift now sits behind three raycast-selectable pathway portals. The desktop landing uses a responsive two-column composition so the live scene is visible alongside the title. Selecting geometry updates the pathway summary, runtime/counts, and actual journey link. Pointer-responsive camera movement provides depth.
- **Multiverse timeline:** six spatial nexus points derive from `app/data/events.ts` and their existing media connections. Mesh selection or keyboard controls move the camera/focus and update the event context and pathway destination. A shared spoiler control protects both the new timeline and its retained 2D era briefings.
- **Chapter constellation:** chapter portals show progress/remaining runtime from the existing journey engine and unlock narrative briefing only when allowed by the pathway spoiler shield. Selecting a chapter can open/focus its real accordion queue.
- **Movie exploration:** the selected chapter can be entered as a connected set of 3D archive frames. Mesh selection changes the selected movie. Existing watch/unwatch actions update the scene, overall progress, and the original queue together. Missing prerequisite context remains visible. No Phase 7 dossier drawer was introduced.
- **Spatial transitions:** selected objects move forward and scale with damped motion; the camera changes viewpoint; selected text panels use restrained perspective transitions. On compact canvases pointer parallax is disabled to stabilize tap targets. Enlarged invisible hit geometry makes portals easier to select without adding visual clutter.

### Performance, fallback, and accessibility behavior

- The Three/R3F/Drei scene module is dynamically imported on the client when its section approaches the viewport. Canvas code is not imported by the initial UI module.
- WebGL2 capability probing occurs once, after React commit, and releases its probe context. Data Saver, <=2GB reported memory, <=2 reported CPU cores, absent/blocked WebGL2, or scene failure choose a lightweight map.
- Users can switch between 3D and lightweight views. Both use the same selected destination and action controls; lightweight mode removes the canvas.
- Render DPR is capped at 1.5, antialiasing and expensive shadow/postprocessing passes are omitted, and geometry/particle counts are bounded. No external 3D model or texture download is required.
- Offscreen, hidden-document, paused, and reduced-motion scenes use on-demand rendering. Visible unpaused scenes use a continuous loop. Decorative particles are omitted when motion is stopped; frame deltas are capped to avoid resume jumps.
- Reduced motion disables continuous animation, parallax, and animated panel/camera transitions while preserving immediate selection. A separate Pause control is available to all users.
- Scene errors and WebGL context-loss events fall back to the usable lightweight map. Context-loss handling is implemented but has not been fault-injected in the browser.
- Canvas content is hidden from assistive technology because every destination/action has a real labelled DOM button or link. Controls support Tab, Enter/Space, arrow navigation, Home/End, visible focus, selected-state announcements, and 44px minimum button heights. Ordinary page scrolling remains available over the canvas.

### Files changed for this follow-up

Existing files:

- `app/components/hero.tsx` — landing layout and scene placement.
- `app/components/hero-canvas.tsx` — functional pathway portal selector using existing journeys.
- `app/components/multiverse-rift.tsx` — reuse of the rift, capped animation delta, motion-aware particles.
- `app/components/timeline-preview.tsx` — 3D timeline integration and shared spoiler controls for existing era cards.
- `app/components/journey-engine-view.tsx` — atlas integration with the existing watch engine and chapter navigation.
- `PROJECT_DASHBOARD.md` — verified status, evidence, and open gates.

New files:

- `app/components/scene-explorer.tsx` — shared lazy scene host, error fallback, capability subscription, controls, keyboard navigation, and detail transitions.
- `app/components/spatial-canvas.tsx` — real geometry, raycast handlers, camera rig, movie frames, projected labels, render policy, and context-loss guard.
- `app/components/spatial-scene-types.ts` — transient typed rendering props.
- `app/components/spatial-timeline.tsx` — event/media projections and narrative selection.
- `app/components/chapter-atlas.tsx` — chapter/movie exploration bound to existing progress.
- `app/lib/scene-capability.ts` — bounded device/context capability probe.
- `tests/scene-capability.test.mjs` — actual capability-policy tests.

Earlier Phase 5/6 hook, persistence, tests, and keyed-route changes remain intact.

### Verification performed

- `npm run lint`: **PASS** on the final source.
- `npx tsc --noEmit`: **PASS** on the final source.
- `node --test tests/watch-progress.test.mjs tests/scene-capability.test.mjs`: **PASS, 10/10**. Three new tests verify constrained-device/Data Saver avoidance of context allocation, safe handling of missing/throwing WebGL, and release of a successful capability probe. The seven progress/data regression tests still pass.
- `npm run build`: **NOT PASSED**. Repeated final-source builds fail when Turbopack starts the PostCSS worker for existing `app/globals.css`: `node process exited before we could connect to it`, exit code 0. This matches the prior build failure. Root cause has not been conclusively diagnosed; production build verification remains open.
- Tool-driven browser QA used the local Next.js dev server and actual WebGL rendering in the in-app Chromium browser. This was not a saved end-to-end browser test suite.
- **Real mesh/raycast tests:** clicking the gold landing portal selected Full Multiverse Chronicle and changed the destination URL; clicking timeline point 06 selected Fantastic Four; clicking chapter portal 03 selected chapter 3; clicking a movie archive frame selected Infinity War. These actions targeted geometry coordinates, not the equivalent DOM destination buttons.
- **Mouse depth:** clicking empty canvas space moved the pointer; DOM-projected portal positions changed while the selected pathway stayed unchanged, verifying camera parallax.
- **Rendering policy:** Pause switched the live scene to `on-demand`; while the timeline was visible, the offscreen hero reported `on-demand` and the timeline `continuous`.
- **Fallback:** switching to lightweight view removed the canvas (0 canvases in that scene) while selection/destination remained functional. Home navigation worked in fallback mode. Low-end/no-WebGL decision paths were unit-tested; physical constrained hardware was not used.
- **Keyboard:** arrow navigation selected the previous timeline event; Home selected the first fallback destination. Standard button activation, selected-state values, and chapter focus navigation were checked.
- **Progress integration:** Iron Man watch/unwatch through the atlas changed overall progress 0% → 11% → 0%. Marking Infinity War through its archive-frame controls updated the original queue checkbox; unwatching restored the initial progress. Browser-created test progress was reverted.
- **Spoilers:** timeline reveal/hide updated both selected event content and the retained era briefings. Unwatched movie/unfinished chapter narrative remained protected. Missing prerequisite context appeared in movie mode.
- **Fresh hydration:** reloading the journey produced a live `3d` scene with progress preserved and no captured console errors.
- **375×812 browser viewport:** the override applied successfully in this follow-up. `innerWidth` was 375 and document width was 369 (scrollbar space), with no horizontal overflow on the landing and journey views. Inspected the chapter scene visually, selected a chapter mesh at phone width after enlarging hit areas, entered movie mode, and selected a pathway via its phone controls.
- **Console:** no captured application/rendering errors. The installed Three/R3F stack emits `THREE.Clock` deprecation warnings on scene creation. No dependency change or warning suppression was made.
- Screenshots captured: desktop landing, timeline, chapter atlas, movie exploration, and 375px atlas.

### Historical remaining gates and scope limits (build gate resolved in Phase 7 below)

1. Run a successful production build in a normal project terminal and resolve the worker startup failure.
2. Test the actual OS/browser `prefers-reduced-motion` setting, not only the implemented source branch and Pause behavior. Media-preference emulation was not available in the browser tool.
3. Profile frame times, memory/context lifecycle, thermal behavior, and interactions on a physical low-end laptop and phone. The 375px browser test is not a real-device performance benchmark.
4. Fault-inject WebGL context loss and verify the fallback end to end. Error-boundary and context-loss paths are implemented; only the manual lightweight switch and capability logic were exercised here.
5. Review the `THREE.Clock` warning against dependency compatibility before changing packages in a separate targeted task.
6. Phase 9 remains partial: the 3D event preview does not implement the later full chronology scrubber or release-date/in-universe date modes. Broader Earth/realm mapping remains Phase 14.

**Stop for design/Phase 6 review. Core 3D interactions are implemented and browser-tested, but final 3D completion and production readiness are intentionally not claimed. No Phase 7 drawer, commit, push, or deployment was performed.**


---

## Phase 7 — Media Detail System & Cinematic Dossiers — 2026-11-02

**Verified outcome:** working cinematic 3D foundation retained and refined; Movie Dossier System implemented; Journey Engine preserved; normal Next.js production build passes. Stop for review here. No Phases 8–21 were implemented in this run.

### First-task audit and prerequisite verification

Reviewed the full roadmap/dashboard, existing Phase 5/6 hook and store, chapter navigation, homepage, existing 3D scene host/canvas/rift, canonical Movie/Journey types and data helpers, package/config, and the installed Next.js client-boundary/lazy-loading/build guidance. The 10 existing store/data/capability regression tests passed before dossier work. The existing 3D pathway selector, timeline preview, chapter atlas, and movie frames were reused rather than recreated.

The remaining build blocker was reproduced with both Turbopack loader startup and a diagnostic Webpack worker attempt. A direct Node filesystem operation succeeded where the spawned compiler worker failed. The installed Next 16.3.5 configuration exposes `experimental.turbopackPluginRuntimeStrategy: 'workerThreads'` specifically for loader/PostCSS evaluation without socket-connected child processes. `next.config.ts` now uses that strategy, threaded page workers, and two build workers. The original `npm run build` script still runs `next build` with Turbopack; no compiler swap, new dependency, font workaround, or package-script change was retained. Both the baseline and dossier production builds completed successfully with this configuration.

### Movie Dossier System implemented

- A lazy-loaded, right-side cinematic drawer is available from next-up, chapter queue movie titles, and the selected movie in the 3D atlas. Its layout becomes full-width on mobile.
- Displays canonical title, release year, runtime, media type, importance, and existing phase/episode metadata when present.
- Uses existing `Movie.description` for synopsis and `whyItMatters` for Why It Matters. Existing fan-archive narrative interpretation is labelled as commentary; no new factual film details were invented.
- Post-credit guidance uses `postCreditRequired`. A false flag is described as no required viewing flagged in this archive; it does not assert that a film has no post-credit scene.
- Narrative text is protected while unwatched unless the journey shield is off or the user explicitly reveals that dossier. Reveals do not mark anything watched and do not leak when changing prerequisite dossiers. Watched entries unlock their own briefing.
- Prerequisite connections open the prerequisite's dossier inside the same drawer, with a Previous dossier action. Changing the selected dossier focuses its heading and resets its scroll position.
- Watch/unwatch controls subscribe to the existing per-journey store. Queue checkboxes, atlas status, runtime/progress, refreshed pages, and other tabs remain synchronized.
- Prerequisites outside the selected journey can be inspected as context. Their watch state is not added to the current pathway; an existing alternative-journey route is offered where available.
- Native modal semantics provide background inertness. Close, Escape, and backdrop dismissal use the closing animation; keyboard focus is contained and restored to the original opener. If the opener disappears after progress changes, focus returns to a chapter trigger. Background scrolling is locked and restored on dismissal/unmount.
- Opening/closing and selected-content transitions use the existing Motion dependency and respect `useReducedMotion`. No new modal or animation library was added.
- The chapter scene switches to on-demand rendering while the dossier or reset confirmation is open. Dossiers and watch controls remain available in lightweight mode, so WebGL is not required for navigation/details.
- Streaming links are deliberately omitted because availability/region/provider information has not been verified. No placeholder links or invented service availability were added.

### 3D foundation refinements

- Preserved the existing immersive rift, camera parallax, three actual pathway portals, route integration, scene lazy loading, keyboard destinations, and 2D fallback.
- Added subtle floating/tilting behavior to reusable 3D movie frames. Motion stops for reduced-motion, pause, offscreen, hidden, and suspended scenes.
- Compact scenes use the rift's mobile geometry/particle budget. Devices reporting <=4 CPU cores or <=4GB memory use the lower-detail geometry/18-particle budget and DPR 1. Standard detail remains capped at DPR 1.5 and 40 particles. More constrained devices still select the existing automatic lightweight fallback.
- No heavy postprocessing, external model/texture assets, new routes, or new content datasets were introduced. Existing timeline code was retained; the later Phase 9 scrubber and Phases 8–21 remain outside this run.

### Changed files in this run

- `next.config.ts` — worker-thread loader/page execution and two-worker build limit; resolves the production build blocker.
- `app/components/movie-dossier.tsx` — new canonical-data dossier, spoiler controls, prerequisite navigation, modal lifecycle, transitions, and shared watch controls.
- `app/components/journey-engine-view.tsx` — queue/next-up entry points, original-opener focus restoration, and modal scene suspension.
- `app/components/chapter-atlas.tsx` — dossier action from selected 3D/2D movie and suspended-scene propagation.
- `app/components/scene-explorer.tsx` — optional suspension of animation behind a modal.
- `app/components/spatial-canvas.tsx` — bounded adaptive quality, compact rift settings, and subtle reusable movie-frame float/tilt.
- `app/components/multiverse-rift.tsx` — explicit lower-detail geometry and particle budget.
- `PROJECT_DASHBOARD.md` — verified status and current verification record. Earlier phase work and the original 21-phase roadmap are preserved.

### Verification results

- `npm run lint`: **PASS**, no ESLint errors or warnings.
- `npx tsc --noEmit`: **PASS**, no TypeScript errors.
- `npm run build`: **PASS** using the normal Turbopack script. Compiled, type-checked, collected page data, generated all static pages, and finalized optimization. Routes remain `/`, `/_not-found`, `/pathways`, and all three generated `/pathways/[id]` journeys.
- `node --test tests/watch-progress.test.mjs tests/scene-capability.test.mjs`: **PASS, 10/10** on the final source. The shared progress/data/capability tests were retained; a new shallow mirror test suite was not added for the drawer.
- Production verification ran with `npm run start -- --hostname 127.0.0.1 --port 3002`, not only the development server. Browser checks below were tool-driven interactions, not a saved automated end-to-end suite.
- **Dossier entry points:** opened from a queue title and the movie atlas, including the atlas lightweight view. Opening alone left progress unchanged.
- **Narrative/prerequisites:** synopsis and Why It Matters were shielded; reveal displayed the canonical text; inspecting Iron Man from Infinity War reset the reveal; Previous dossier restored Infinity War; metadata and post-credit guidance rendered.
- **Progress/persistence:** dossier watch action changed progress 0%→11% and updated the queue checkbox; refresh retained 11%; dossier unwatch restored 0%. A separate Iron Man dossier watch synchronized a second browser tab to 11%; unwatching in that tab updated the still-open dossier back to unwatched. Only browser-created test entries were toggled back; existing progress was not cleared or migrated.
- **Pathway isolation:** Nexus progress remained 0%. Inspecting its outside-pathway Endgame prerequisite offered no current-pathway watch action and linked to the existing Doom Essential route for tracking.
- **Modal accessibility:** initial focus landed on Close; Shift+Tab wrapped to the final action; Escape closed and restored the original queue-title opener; Close and backdrop dismissal worked. Body overflow returned to its original value. The visible chapter scene reported `on-demand` while its dossier was open.
- **375×812 viewport:** full-width dossier rendered with no horizontal overflow. Checked protected synopsis, spoiler button, readable metadata/content, sticky close control, the mobile navigation menu, and navigation to the pathways hub. This is browser viewport QA, not a physical-device benchmark.
- **Production homepage/navigation:** actual gold portal mesh click selected Full Multiverse Chronicle and updated its real route. Begin Your Journey navigated to `/pathways` and rendered CHOOSE YOUR PATH. The existing 3D scene rendered successfully from the production bundle.
- **Console:** no captured application/rendering errors. The existing installed Three/R3F stack still emits `THREE.Clock` deprecation warnings on scene initialization. No dependency patch or warning suppression was introduced.
- `git diff --check`: **PASS**. Git only reported existing LF/CRLF normalization notices; no whitespace errors. No commit, push, deployment, or GitHub changes were made.

### Remaining limits / manual verification

- Physical integrated-GPU/8GB laptop and phone frame-time, memory, thermal, and long-session profiling have not been performed. Quality budgets are implemented, not claimed as measured FPS guarantees.
- System `prefers-reduced-motion`, assistive-technology testing, and fault-injected WebGL context loss still require manual verification. Source branches respect the preference; default animation, pause/suspension, lightweight fallback, and modal keyboard behavior were exercised.
- Build worker options are supported by the installed Next version but live under its experimental configuration API. Recheck these settings when upgrading Next.
- Streaming availability remains unverified and omitted. Existing speculative editorial commentary and outdated `isUpcoming` data flags were not rewritten; a separate factual-content review remains advisable.
- Existing localStorage synchronization is last-writer-wins for truly simultaneous cross-tab writes. Multi-device/account sync remains outside this phase.

**Next recommended action: review Phase 7 and finish the device/accessibility checks above. Future roadmap phases are recorded only; work stops here.**


---

## Phase 8 — Prerequisite Lineage & Dependency Graph — 2026-11-02

**Result:** initial interactive story-prerequisite graph implemented and verified. The original Phase 8 title and 21-phase roadmap remain intact. Phase 9 was not started in this run.

### Scope clarification and audit

The roadmap's exact Phase 8 objective is an interactive visual node graph showing precursor story dependencies and technology lineages leading to Doomsday. The existing data defines `Movie.prerequisites` but no explicit technology relationships. This ambiguity was reported before implementation. The user authorized the initial graph using existing prerequisite relationships, required clear story-prerequisite labels, requested an extensible architecture, and designated explicit technology lineage as a planned enhancement.

Reviewed the current dashboard/roadmap, repository instructions, package/config, homepage/pathway routes, progress hook/store, dossier, chapter atlas, scene host, timeline, and Three/R3F renderer. The checkout was on `main` with no pending changes at the start. The 10 existing regression tests passed before development.

### Phase 7 verification before Phase 8

No confirmed Phase 7 defect required a code rewrite. In the existing production build, verified queue-title entry, protected narrative, reveal behavior, prerequisite dossier navigation, reveal isolation, shared watch state, Shift+Tab focus containment, Escape dismissal, and restoration to the original opener. A dossier watch action produced 11% journey progress. The same dossier integration was later rechecked from the new graph and the existing movie atlas.

### Phase 8 implementation

- Added an explicit **Prerequisite Lineage & Dependency Graph** entry on each existing pathway page. The graph loads on demand; navigation does not require a new route or WebGL.
- Graph nodes and edges are derived exclusively from the existing movie catalog and `Movie.prerequisites`. Directed edges are labelled **story prerequisites**, not technology relationships. No content dataset or movie relationships were invented or duplicated.
- Recursively includes prerequisite ancestors outside the selected journey. These nodes are labelled context only, cannot be marked watched for the current journey, and do not change its totals.
- Layout groups stories by dependency depth with deterministic positions. This is dependency order, not a new release-date/in-universe chronology system.
- Selecting a real 3D node, a labelled destination button, the focus selector, or a relationship list item changes the selected story. Incoming/outgoing connections are highlighted; cone arrowheads indicate direction.
- Full-pathway and selected-prerequisite views support exploring a whole journey or isolating its incoming lineage. Direct prerequisites and dependent stories are also available as readable, clickable lists.
- Selected nodes open the existing spoiler-protected Movie Dossier System. In-pathway watch/unwatch uses the existing Journey Engine and updates graph completion, queue checkboxes, chapter status, HUD totals, and persistence together.
- The selected story's metadata and context remain accessible through ordinary controls and dossiers. The graph itself adds no plot text outside existing spoiler protection.
- Cycles, missing references, duplicate edges, and unknown journeys are handled defensively; invalid references are diagnosed without unbounded recursion. Canonical data produced no diagnostics.
- The lightweight fallback is a real connected SVG map with directional arrows, selectable nodes, readable destination controls, and native horizontal/vertical keyboard scrolling. It is not an unrelated decorative placeholder.

### Extensible relationship architecture

- `app/lib/prerequisite-graph.ts` owns the current story-only data adapter and ancestor traversal. It reads the canonical catalog rather than introducing another movie model.
- Scene projections accept explicit node positions and generic directed edge objects. `SceneExplorer` and `SpatialCanvas` render those projections independently of the prerequisite builder. A future curated technology adapter can reuse the renderer and fallback pattern without rebuilding the scene engine.
- **Planned Phase 8 enhancement:** curate explicit technology entities/relationships and provenance, then add a separate typed relationship adapter and labels. Until those relationships are supplied and reviewed, no technology edges are inferred from movie titles, synopsis, or editorial commentary.

### Cinematic 3D refinements

- Added restrained indigo/blue and violet lighting and layered atmospheric backgrounds while preserving emerald progress/branding and existing scene content.
- Smoothed camera look-target movement as well as camera position. Camera bounds are computed once per layout and fit the full graph, including the 17-node Chronicle graph.
- Selected relationships use brighter, thicker connections; unselected connections retain readable contrast without postprocessing or bloom.
- Moved scene instructions out of the canvas field so labels are not covered by a footer overlay.
- Rendering/lazy-loading visibility now observes the actual scene viewport, rather than its entire potentially long list/detail section. Offscreen canvas fields stop continuous rendering even while related text remains onscreen.
- Existing DPR/geometry/particle budgets, low-end fallback, pause controls, reduced-motion branches, and context-loss/error boundaries remain in use. Modal suspension still pauses both graph and atlas.
- Added a hydration-ready guard to the graph entry action and stacked phone-width focus controls for readable selection.
- No new dependency, route, canonical movie field, expensive effect, or Phase 9 feature was added.

### Files changed in this run

New:

- `app/lib/prerequisite-graph.ts` — derived story graph, deterministic layout, diagnostics, and incoming-lineage traversal.
- `app/components/prerequisite-lineage.tsx` — 3D/SVG graph UI, scope/focus controls, relationship navigation, dossier and watch integration.
- `tests/prerequisite-graph.test.mjs` — six graph regression tests against real data and malformed fixtures.

Modified:

- `app/components/journey-engine-view.tsx` — on-demand graph entry and existing engine/dossier callbacks.
- `app/components/spatial-scene-types.ts` — optional node positions, reusable directed edges, lineage scene variant.
- `app/components/spatial-canvas.tsx` — actual dependency connections/arrowheads, camera fitting/target damping, blue/violet light and floor refinements.
- `app/components/scene-explorer.tsx` — generic edges/fallback support, actual-viewport rendering policy, atmospheric composition, separate instruction strip.
- `PROJECT_DASHBOARD.md` — verified status, scope clarification, evidence, planned technology lineage, and next phase.

The Phase 7 dossier source, watch-progress store, canonical data, package files, and build configuration were preserved.

### Verification results

- `npm run lint`: **PASS**, no errors/warnings.
- `npx tsc --noEmit`: **PASS**, no TypeScript errors.
- `npm run build`: **PASS** using the normal Turbopack script. All existing static/SSG routes generated: `/`, `/_not-found`, `/pathways`, and the three pathway routes.
- One build attempted while the local production server was still running encountered a Windows `EPERM` creating a prerender-output directory. Stopping the QA server and rerunning the same build succeeded. Keep build and production QA server execution sequential on this Windows checkout. No source/config workaround was added in this run.
- `node --test tests/watch-progress.test.mjs tests/scene-capability.test.mjs tests/prerequisite-graph.test.mjs`: **PASS, 16/16**. Six new tests cover exact canonical edges, transitive outside-pathway context, deterministic forward-depth layout, lineage filtering, cycles/missing/duplicate references, and empty journeys. Existing progress/data/capability tests still pass.
- Browser checks used `npm run start` on a local production port, not only a development server. They were tool-driven interactions; no saved end-to-end browser suite is claimed.
- **Actual 3D selection:** clicked a graph mesh to select Iron Man; the focus selector, selected destination state, metadata, and dependency lists updated. A direct node click at 375px also changed the focused story to Iron Man.
- **Lineage view:** focusing Iron Man reduced the graph to one node; focusing Endgame showed its three-node/two-edge prerequisite chain. Switching back restored the full graph.
- **Largest graph:** Chronicle exposed 17 node controls. DOM-projected positions for all 17 labels were checked against the canvas bounds and were inside it. No canonical graph diagnostics were emitted.
- **Progress:** graph watch action changed Doom Essential to 11%, updated the existing checkbox and chapter status, and survived refresh. Final explicit unwatch restored the initial 0% and unchecked the queue entry. Only the test-created entry was toggled back; no storage clearing, progress migration, or bulk reset was used.
- **Context isolation:** Nexus included transitive Iron Man/Infinity War/Endgame context. Selecting Iron Man showed outside-pathway status and no current-pathway watch button. Its existing dossier opened for context. Nexus progress remained 0%.
- **Dossiers:** graph and atlas entry points worked; narrative protection and prerequisite browsing remained intact. A mobile Endgame dossier showed the false-case post-credit guidance. Graph/atlas render modes changed to `on-demand` after the native modal became visible.
- **2D fallback:** switching removed that scene's canvas and rendered all 17 SVG edges in the Chronicle graph. ArrowRight on the scrollable fallback moved horizontal scroll by 40px. Destination keyboard navigation updated the selected story and could open its dossier.
- **375×812 layout:** document width was 369px for a 375px viewport, with no horizontal page overflow. The final focus selector measured about 303px wide, controls stacked correctly, the graph rendered in 3D, fallback scrolling worked, and the mobile dossier opened/closed by pointer controls. This is viewport QA, not physical touch-device certification.
- **Existing features:** checked chapter-2 expansion/focus, the atlas's Loki dossier with series metadata, homepage 3D pathway keyboard selection and destination URL, Begin Your Journey → pathways hub, and the custom invalid-journey 404 (REALITY DESYNCHRONIZATION). No application errors were captured.
- **Console:** the previously known installed-stack `THREE.Clock` deprecation warning remains; no dependency patch or warning suppression was introduced.
- Git branch remains `main`. `git diff --check` passes. No commit, push, deployment, new repository, branch switch, or GitHub setting change occurred.

### Known limits and remaining 3D work

- Explicit technology lineage is planned, not implemented or inferred. The current verified graph covers the user-approved story-prerequisite scope.
- Physical integrated-GPU/8GB laptop and phone frame-time, memory, thermal, and long-session profiling remain unperformed. Bounded rendering is implemented; measured FPS guarantees are not claimed.
- Actual system reduced-motion, screen-reader/assistive-technology, and fault-injected WebGL context-loss checks remain manual QA items. Code branches, native keyboard behavior, pause/modal suspension, fallback selection, and browser navigation were checked as described above.
- Larger full graphs intentionally fit smaller on narrow screens; focused-lineage mode and full-size DOM controls provide readable navigation. The 2D map supports native scrolling instead of shrinking all labels into unreadable text.
- Existing editorial interpretation, unverified streaming availability, last-writer-wins simultaneous localStorage edits, and the known Three clock warning remain as previously documented.

### Next phase from the original roadmap

**Phase 9 — Multiverse Macro Chronology & Timeline Scrubber.** Its original scope is an interactive horizontal timeline with in-universe chronological year and theatrical release-date modes. The pre-existing timeline preview remains; no new Phase 9 implementation was undertaken here.

**Stop for Phase 8 review. Story-prerequisite graph verified; explicit technology lineage remains a planned enhancement.**


## Phase 8 Verification + Phase 9 Development — 2026-11-03

### Batch decision and roadmap scope

- Exact Phase 9: **Multiverse Macro Chronology & Timeline Scrubber**.
- Exact Phase 10: **Incursion Engine & Reality Tear Simulator**.
- Implemented **Phase 9 only**. The chronology shares the existing spatial renderer, but Phase 10 needs distinct universe-pair, collision, threat-gauge, and alert behavior. Those dependencies are not present. Combining them would expand this batch into an independently scoped simulation without sufficient canonical data. Phase 10 is still **PLANNED**, with no simulated controls or placeholder interactions added. Phase 11 was not started.

### Phase 8 verification and confirmed fix

- Automated graph checks still verify canonical prerequisite edges, transitive context, deterministic layouts, cycle/missing-reference handling, and separation of outside-journey context from tracked progress.
- Confirmed gap: nodes were selectable but connections were decorative. Added dependent-story activation to 3D connection lines/arrowheads and wider SVG edge hit targets. Existing DOM prerequisite/dependent buttons remain the keyboard equivalent.
- Production browser: 3D connection selection changed the selected story; SVG arrow selected Endgame; destination arrow-key navigation selected Infinity War. Mobile Nexus graph rendered 12 nodes / 12 connections / 3 outside-pathway context entries with no page overflow.
- Connections continue to be explicitly described as **story prerequisites**. **Explicit technology lineage relationships remain a planned enhancement**; none were inferred or falsely marked complete.
- Shared progress, lazy scenes, bounded DPR, low-detail geometry, offscreen/hidden-page demand rendering, manual lightweight mode, reduced-motion handling, and WebGL error boundary/context-loss fallback were preserved. Capability tests verify low-end/data-saver and unavailable/blocked WebGL decisions without allocating contexts on constrained devices.

### Phase 9 features

- Native horizontal, touch-scrollable record strip, discrete event scrubber, previous/next buttons, arrow/Home/End keyboard controls, accessible value descriptions, and responsive journey/chapter filters.
- Story chronology uses the archive's existing year/date labels. Dated events (2024 and 2025), outside-time events, and undated entries occupy separate spatial lanes. No date was invented for TVA Registry or Phase VI Horizon. Yearless domains are not connected into a fake chronological sequence.
- Release mode uses six verified US release dates in canonical movie metadata, distinguishes theatrical releases from first streaming premieres, links to official evidence, and spaces the real-time 3D nodes by elapsed release time. No new renderer or dependencies.
- Mode changes preserve the selected event by ID. Empty chapters show a real empty state and a reset-filter action; other journey queues are untouched.
- Existing movie dossiers, spoiler shielding, watched-state indicators and watch controls integrated. Narrative details unlock for the selected journey's watched entries or explicit reveal. Opening a dossier suspends scene animation; Escape closes it and restores opener focus.
- Versioned, validated timeline preferences persist mode, journey, chapter, and selected event separately from watch progress; stable external-store snapshots avoid hydration writes. Cross-tab updates and blocked-storage session fallback are covered. Spoiler reveal is not persisted.

### Verification performed

- `npm run lint`: PASSED.
- `npx tsc --noEmit`: PASSED.
- `npm run build`: PASSED, normal Turbopack production build; existing routes preserved. Build attempts hit the pre-existing intermittent Windows EPERM during prerender directory creation. The final run passed after explicitly creating the missing generated `.next/server/app/pathways.segments/pathways` directory; no source/build configuration change or output deletion was used. This environment-specific build instability remains a known limitation.
- `node --test tests/*.test.mjs`: **22 PASSED / 0 FAILED** (16 existing tests plus 6 chronology/preference tests).
- Production browser at localhost: scrubber Home/End, mode/selection continuity, refresh persistence, preference cross-tab synchronization, 3D node selection, dossier spoiler shield, animation suspension, Escape/focus restoration, watch toggle and cross-tab journey HUD synchronization, empty chapter recovery, lightweight timeline navigation, and scene pause/on-demand mode.
- Test watch entry (Loki Season 2, Doom journey) was restored to unwatched and the other tab's HUD returned to 0%. No progress resets or storage clears were used.
- Desktop 1280px and mobile 375px viewports inspected. Mobile document width 369px within 375px viewport. Mobile graph/controls worked with browser pointer input; physical touch is not claimed.
- Browser console: no application errors observed; existing dependency `THREE.Clock` deprecation warning remains.

### Files changed in this batch

- `app/components/spatial-timeline.tsx`: timeline controls, filters, progression, dossier integration and spatial chronology.
- `app/lib/chronology.ts` (new): pure filtering, ordering, date-domain layout and preference validation.
- `app/lib/timeline-preferences-store.ts` (new): stable client/SSR snapshots, persistence, synchronization and storage fallback.
- `app/types/event.ts`, `app/data/events.ts`: structured chronology placement alongside preserved original event data.
- `app/types/movie.ts`, `app/data/movies.ts`: source-backed optional release metadata on six existing entries.
- `tests/chronology.test.mjs` (new): business logic and preference-store coverage.
- `app/components/spatial-canvas.tsx`, `app/components/prerequisite-lineage.tsx`, `app/components/scene-explorer.tsx`: incremental Phase 8 connection interaction fix and guidance.
- `PROJECT_DASHBOARD.md`: this verified record and Phase 9 status. Pre-existing uncommitted Phase 8 integration/model/tests were preserved, including `journey-engine-view.tsx`, `spatial-scene-types.ts`, `prerequisite-graph.ts`, and `prerequisite-graph.test.mjs`.

### Release evidence (verified 2026-11-03)

- Loki Season 1: 2021-06-09, US streaming premiere — https://d23.com/meet-the-characters-of-loki/
- Spider-Man: No Way Home: 2021-12-17, US theatrical — https://www.marvel.com/movies/spider-man-no-way-home
- Doctor Strange in the Multiverse of Madness: 2022-05-06, US theatrical — https://www.marvel.com/movies/doctor-strange-in-the-multiverse-of-madness
- Loki Season 2: 2023-10-05, US streaming premiere — https://press.disneyplus.com/news/disney-plus-shares-loki-season-2-multi-city-fan-event-photos
- Deadpool & Wolverine: 2024-07-26, US theatrical — https://www.marvel.com/deadpool-and-wolverine-live-red-carpet-premiere
- The Fantastic Four: First Steps: 2025-07-25, US theatrical — https://www.marvel.com/movies/fantastic-four

Official Marvel search-index release metadata supported the film dates; direct Marvel page retrieval returned 403 in the research tool. Disney/D23 articles were directly readable. Sources record release facts only, not streaming availability.

### Known limitations and next recommended phase

- Chronology covers the **existing six-event archive**, not an exhaustive MCU chronology. Only two events have in-universe years in current data; the remaining domains are intentionally yearless. Story placements are the fan archive's editorial interpretation, not newly verified official canon.
- Physical touch devices, integrated-GPU/8 GB hardware profiling, OS reduced-motion emulation and forced live WebGL context loss remain manual QA items. Manual lightweight/pause paths were browser-tested; automated capability tests cover unavailable/blocked WebGL.
- No streaming availability, explicit technology lineage, incursion physics, universe designations, or threat values were invented.
- Next recommended development: scope and implement **Phase 10 — Incursion Engine & Reality Tear Simulator** as a separate reviewed batch. Stop here for Phase 9 review. No commit, push, deployment, branch switch, or GitHub setting change performed.

## Phase 10 — Incursion Engine & Reality Tear Simulator — 2026-11-03

- The homepage chronology links to the simulator at `/#incursion`. Earth-616 and Earth-838 are the fixed pair in an illustrative fictional scenario. The lab has independent session state and does not write to journey progress or chronology preferences.
- The deterministic model evaluates 100 positions across an approximately ten-second run. Convergence controls approach speed. Shielding slows approach and reduces overlap damage. A tear appears at the stress threshold, collision begins when two unit-radius boundaries touch, and overlap damage above the threshold triggers a dying reality alert. A live meter combines stress and damage into a 0–100 threat score.
- Initiate, pause, resume, scrub, replay, and reset work in both views. Editing a parameter reevaluates the selected position. Replay keeps parameter values and reset restores defaults. Playback pauses while the document is hidden.
- The default SVG view is interactive through the same keyboard and touch-friendly controls. The optional R3F scene uses lightweight meshes, Drei lines, a capped pixel ratio, and demand rendering when paused, offscreen, or in reduced-motion mode. Capability probing, an error boundary, and context-loss handling select the SVG fallback. Switching views preserves simulation state.
- Verification passed with `npm run lint`, `npx tsc --noEmit`, `node --test tests/*.test.mjs` (26 tests, including four model tests), and `npm run build`. Production browser checks covered the chronology link, playback and pause, keyboard scrubbing and parameters, collision and collapse alerts, 3D rendering, 2D switching, shielding, reset, completion at 100%, and replay restart. The 375px viewport fit without horizontal overflow. Browser error logs were clear.
- The model is a single fictional pairing with simplified, reversible outcomes. Physical touch hardware, integrated GPU performance, OS reduced-motion emulation, and forced live WebGL context loss remain unverified. Capability tests cover blocked and unavailable WebGL.
- Changed files include the incursion model and tests, simulator UI and canvas, homepage and chronology integration, and this dashboard. Phase 11 is ready for separate scoping after Phase 10 review. Its roadmap status remains planned.

## Phase 11 — Character & Variant Lineage Tracker — 2026-11-03

- The original roadmap calls for tracking Doctor Strange, Loki, Reed Richards, Wanda Maximoff, and Victor Von Doom across alternate realities. The roadmap provides no separate dependency or acceptance list. The implementation uses the existing media catalog, chapter and journey lookups, Movie Dossier, and journey watch store.
- The homepage chronology links to the tracker at `/#variants`. It offers 11 curated records across all five lineages, reality filtering, side-by-side comparison, and official source links. Unnumbered branches retain their descriptive labels. Doom’s 2005 screen adaptation and the Doomsday cast announcement have distinct evidence labels, and the announcement leaves his reality undesignated.
- Catalog records link to the existing dossier and chapter and reflect saved progress in the selected journey. Story notes unlock on matching watch progress or explicit reveal. Filters and spoiler reveal remain session UI state. Legacy and announcement entries carry source references outside the watch catalog.
- The tracker uses responsive HTML and a short Motion entrance with reduced-motion support. It adds no 3D renderer or dependencies. Physical touch hardware, OS reduced-motion behavior, and integrated graphics performance were not profiled.
- `npm run lint`, `npx tsc --noEmit`, and `node --test tests/*.test.mjs` passed. All 30 tests passed, including four new tests covering record coverage, filters, catalog references, and spoiler rules. `npm run build` passed on retry after an initial exit during page-data collection without a diagnostic.
- Production browser checks covered keyboard character selection, all five lineages, reality and journey filters, spoiler reveal, the dossier and Escape focus restoration, watch status updates with original state restored, a valid chapter anchor, and a 375px layout with no horizontal overflow. The chronology scrubber, prerequisite graph, and simulator passed smoke checks.
- Added `app/data/variants.ts`, `app/lib/variant-lineage.ts`, `app/components/variant-tracker.tsx`, and `tests/variant-lineage.test.mjs`. Updated `app/page.tsx`, `app/components/timeline-preview.tsx`, and this dashboard.
- Phase 12, Doctor Doom & Latverian Lore Codex, remains planned and ready for separate scoping. The lineage archive is curated, with nine catalog-linked records and two external Doom records.

## Phase 12 — Doctor Doom & Latverian Lore Codex — 2026-11-03

- The roadmap specifies the Victor Von Doom dossier, comics origins compared with MCU adaptation, monarch armor analysis, and sovereign worldview. It gives no separate dependency or acceptance list. The codex reuses the Phase 11 casting record and the Doom Essential journey.
- The homepage codex at `/#doom-codex` links back to the lineage tracker. Selecting Victor Von Doom exposes the codex link. Section URLs support direct return to origins, armor, or worldview.
- The comics and MCU columns separate published comics history from the official casting announcement. The worldview section labels its editorial reading and cites One World Under Doom.
- Four accessible armor controls update an original SVG schematic and its explanatory notes. The drawing is an illustrative costume study. Armor selection is transient, while section location is shareable through the URL. The codex adds no renderer, packages, or watch storage.
- Lint, TypeScript, all 32 automated tests, and production build passed. Two new tests cover reuse of the MCU casting record and valid armor markers.
- Production browser checks covered links between lineage and codex, keyboard activation of all four armor selections, pointer selection and layout at 375px, section navigation, and the Doom Essential route. Browser error logs were clear. Physical touch and low-end hardware were not profiled.
- Added `app/data/doom-codex.ts`, `app/components/doom-codex.tsx`, `app/components/doom-armor-study.tsx`, and `tests/doom-codex.test.mjs`. Updated `app/page.tsx`, `app/components/variant-tracker.tsx`, and this dashboard.
- Phase 13, TVA & Temporal Loom Archives, is ready for separate scoping after review. Its roadmap status remains planned.

## Phase 13 — TVA & Temporal Loom Archives — 2026-11-03

- The original roadmap specifies TVA regulations, temporal loom mechanics, Void artifacts, and Miss Minutes easter eggs. It gives no separate dependency or acceptance list. The archive reuses the Loki season records, Incursion & TVA Nexus chapter lookups, existing watch store and Movie Dossier, and Loki lineage entry point.
- The homepage archive at `/#tva-archives` offers a TVA procedural briefing, four selectable Loom stages, three expandable Void sightings, and three Miss Minutes extras. The SVG is an editorial illustration with illustrative strand counts. Screen events, comics callbacks, and production references carry distinct labels and source links.
- Story sections respect season-level saved progress in The Incursion & TVA Nexus. Explicit reveal applies to the current section and resets on section change. Dossier navigation retains its own spoiler shield. Archive controls are transient, and persistent watch progress uses the existing store.
- Lint, `npx tsc --noEmit`, all 35 automated tests, and the production build passed. Three new tests cover existing journey and chapter references, season-specific spoiler eligibility, and Loom states.
- Production browser checks covered keyboard section selection and all Loom stages, spoiler reveal and resealing, keyboard artifact disclosure and pointer Miss Minutes disclosure at 375px, no horizontal overflow, bidirectional lineage links, dossier Escape and focus restoration, watch-based unlock with original state restored, and a valid chapter destination. Browser error logs were clear.
- Added `app/data/tva-archive.ts`, `app/components/tva-archive.tsx`, and `tests/tva-archive.test.mjs`. Updated `app/page.tsx`, `app/components/variant-tracker.tsx`, and this dashboard.
- The archive is curated and its two-dimensional Loom study has no GPU requirement. Physical touch hardware and integrated graphics performance were not profiled. Phase 14, Interactive Multiverse Map & Realm Nexus, remains planned and ready for separate scoping after Phase 13 review.

## Phase 14 — Interactive Multiverse Map & Realm Nexus — 2026-11-03

- The original roadmap calls for spatial visualization of Earth-616, Earth-838, the Void, the Quantum Realm, and Battleworld convergence. It lists no separate dependencies or acceptance checklist. The implementation reuses SceneExplorer, movie dossiers, existing journey and chapter data, and the watch store.
- The chronology links to the homepage map at `/#realm-nexus`. Five destinations share selection across 3D portals, accessible destination buttons, and the lightweight map pins. The Earth-616 to Earth-838 edge represents the crossing in Multiverse of Madness. Coordinates are editorial. Battleworld is labeled as published Secret Wars comics lore with a reversible illustrated fragment assembly.
- Four MCU destinations connect to film or season dossiers and Incursion & TVA Nexus chapters. Links also lead to the chronology, incursion simulator, character tracker, TVA archives, and Doom codex. Linked watch progress unlocks story notes. Manual reveals reset on destination change, and comics details require explicit reveal.
- Lint, `npx tsc --noEmit`, all 38 automated tests, and production build passed. Three new tests cover map records, viewing references, and spoiler rules. Build passed on retry after creating the missing ignored `.next` output directory following Windows EPERM.
- Production browser checks covered actual 3D picking, keyboard traversal, fragment assembly and separation, resealing spoilers, 375px lightweight map pins and no horizontal overflow, dossier focus restoration, watch unlock with original progress restored, and a valid chapter anchor. No browser errors were recorded.
- Added `app/data/realms.ts`, `app/components/realm-nexus.tsx`, and `tests/realm-nexus.test.mjs`. Updated `app/page.tsx`, `app/components/timeline-preview.tsx`, and this dashboard.
- The map is a curated layout with an illustrative comics study. Selection and reveal are transient, while watch state uses existing persistence. Physical touch hardware, integrated GPU performance, OS reduced-motion behavior, and forced context loss were not profiled in this phase. Phase 15, User Profile & Watch Progress Synchronization, remains planned for separate scoping.

## Phase 15 — User Profile & Watch Progress Synchronization — 2026-11-03

- The original roadmap calls for exportable/importable JSON watch states, backup readiness, and multi-device progress tracking. It gives no separate dependency or acceptance list. The profile reuses the Journey Engine store and catalog. Multi-device transfer uses a user-carried backup file.
- The profile at `/pathways#progress-profile` shows all three journeys and links to their watch queues. The pathways hub and journey pages link to the profile. Export downloads a versioned JSON file. Import validates the complete file, previews the titles to add and current and projected counts per journey, and asks the visitor to merge or cancel.
- Merge adds watched IDs to their original journey and preserves local entries. Repeated imports are idempotent. Invalid versions, malformed records, unknown journeys or titles, and oversized files are rejected before saving. Storage write failures keep merged progress in memory and report which journeys need a new export.
- Lint, `npx tsc --noEmit`, all 41 automated tests, and production build passed. Three new tests cover independent device stores, merge preservation and persistence, invalid backups, and storage failures.
- Production browser verification covered keyboard download and merge, file selection, preview before write, reload persistence, journey routing, existing spoiler shield behavior, and the 375px layout without horizontal overflow. Original test watch progress was restored. Browser error logs were clear.
- Added `app/components/progress-profile.tsx` and `app/lib/watch-backup.ts`. Updated `app/lib/watch-progress-store.ts`, `app/components/journey-engine-view.tsx`, `app/pathways/page.tsx`, `tests/watch-progress.test.mjs`, and this dashboard.
- File transfer is manual and merge is additive. To propagate unwatched decisions, adjust them on the receiving device. The backup covers watch progress only. Physical devices and browser storage failures were not tested in the production browser.

## Phase 16 — Cinematic Audio Scapes & Ambience Engine

- The shared Archive soundscapes panel offers a Latverian synth hum and Temporal Loom texture. Three synthesized voices and one modulator change frequency smoothly when the visitor switches soundscapes. The sounds are original fan ambience.
- Audio starts off on every fresh load and requires explicit activation. The selected soundscape persists locally. Turning audio off releases its Web Audio context, and hiding the document turns audio off and releases the context. Returning to the tab requires explicit reactivation. Unsupported playback shows an availability message. The panel uses native keyboard and touch controls with no added motion, network assets, or rendering loop.
- Variant selection and TVA Loom study controls emit short, throttled cues when audio is on. Existing spoiler and watch-progress rules stay in their respective components.
- Changed files include the root layout, audio control and synthesis modules, the two cue integrations, and the ambience tests. The automated suite covers preset validation, retuning, and cue throttling, cleanup, and suppression in suspended contexts.
- Production Chromium checks passed for keyboard activation, scene selection, an interaction cue, mute, reload preference, TVA spoiler reveal and re-seal, and touch controls at 375px without horizontal overflow. The Phase 15 backup preview showed the title and projected total before merge, then zero additions on re-import. Listening quality, physical mobile devices, and other browsers remain unverified.
- Checkpoint review confirmed that a saved preset stays silent on fresh load. Chromium verified keyboard reactivation and mute with reduced motion, context closure on a simulated tab hide, silence on return, and a safe unavailable message without Web Audio.
- Phase 17, Search, Multiverse Filters & Tagging System, can be scoped independently. The original roadmap is unchanged.

## Phase 17 — Search, Multiverse Filters & Tagging System

- The shared header opens a native modal archive search with Cmd+K or Ctrl+K, automatic search focus, Escape dismissal, and focus restoration. The responsive header keeps search available on mobile.
- Instant results cover every catalog title, the five existing character identities, catalog MCU phases, and editorial chapter themes. Multiple query words combine with type, phase and theme filters. Clear filters and a zero-results message support recovery.
- Tags derive from existing media type, importance, release year, phase and chapter membership. The index excludes movie synopsis, narrative significance and variant story descriptions. Chapter themes remain explicitly editorial.
- Movie results use the existing Movie Dossier with its spoiler shield and journey-specific watch store. Phase results filter the title queue. Themes link to the original chapter trigger. Character links select the corresponding tracker identity while resetting reality and spoiler reveal state.
- Dependencies are the existing catalog, chapters, journeys, character records and Movie Dossier. No packages or data models were added. Search uses no WebGL, animation or audio activation.
- Verified lint, TypeScript, production build and all 47 automated tests. Three new tests cover catalog coverage and ranking, intersecting filters, invalid themes, internal destinations and exclusion of protected narrative content.
- Production Chromium verified Ctrl+K, keyboard interaction, protected unwatched dossier content, phase filtering, empty results, character selection, silent audio state, reduced motion, close focus restoration and a 375px layout without horizontal overflow. The mobile screenshot was inspected. Existing watch-progress persistence remains covered by the automated store suite.
- Modified files are app/components/header.tsx and app/components/variant-tracker.tsx. Added app/components/archive-search.tsx, app/lib/archive-search.ts and tests/archive-search.test.mjs. This dashboard records verification.
- Limitations include substring matching within the local catalog and physical devices and other browsers remaining unverified. Search criteria stay in the current component session and reset on a full reload. Phase 16 audio lifecycle behavior was unchanged.
- Phase 17 implementation began at local bf6ffbc while GitHub still showed f10bdec2. At checkpoint review, origin/main and GitHub were verified at bf6ffbc. The six Phase 17 files were reviewed for correctness, secrets, generated artifacts and unrelated changes.
- Checkpoint review added explicit Tab and Shift+Tab wrapping to the search dialog. Production Chromium passed Ctrl+K and Cmd+K, both focus boundaries, Enter result selection, nested dossier Escape and focus restoration, combined filters, empty results, chapter and character destinations, zero AudioContext allocation and 375px layout. All 47 tests, lint, TypeScript and production build passed again. Duplicate result identity is asserted in the automated suite.
- Phase 18, Watchlist Sharing & Custom Poster Generator, is ready for separate scoping.

## Phase 18 — Watchlist Sharing & Custom Poster Generator

- The original roadmap requires a custom graphic generator for social sharing, journey completion certificates and downloadable watch itineraries. Implementation uses the existing journey catalog, chapters, statistics and useWatchProgress store.
- Every journey has an expandable sharing studio before its Chapter Atlas. The studio loads on demand. Its Canvas2D preview and export use a fixed 1080 × 1350 layout with three archive palettes and an optional name limited to 40 characters.
- Download PNG creates a real image file. Share graphic invokes native file sharing when supported and reports cancellation or errors. When native sharing is unavailable, visitors can download the graphic for manual sharing. Copy journey link shares only the public journey URL, with a selectable address if clipboard access fails.
- Completion certificate mode unlocks only when every catalog title in that journey is watched. It reads the shared live progress snapshot, automatically returns to poster mode if completion is lost, and identifies the milestone as self-reported and unofficial. A certificate includes the watched total.
- Download itinerary creates a UTF-8 text file in the original chapter and title order, including years and runtime. Posters and itineraries omit watch status unless the visitor enables it. Certificate totals are disclosed separately. No export contains movie synopsis, narrative significance or variant story descriptions.
- The studio never writes watch progress. Name, palette and disclosure choices live only in the open studio and reset when it closes. Public links omit these choices and saved watch status.
- Native form controls and buttons support keyboard and touch interaction with status announcements, preview text and error feedback. No animation loop, WebGL scene, external image, font download or audio activation is added by the generator. Canvas resources are bounded, pending preview frames are cancelled and temporary download URLs are revoked.
- Verified npm run lint, npx tsc --noEmit, production build and all 51 automated tests. Four added tests cover foreign and duplicate watched IDs, certificate eligibility, bounded names, optional progress disclosure, spoiler omission, itinerary order and runtime.
- Production Chromium verified keyboard PNG download and actual 1080 × 1350 files, neutral and personalized text exports, completion unlocking and certificate download, automatic certificate disablement after unwatching, saved progress after reload, public-link output, native-share fallback, and zero audio allocation. Touch activation and no horizontal overflow were verified at 375px with reduced motion.
- The exported poster, certificate and mobile screenshot were visually inspected. A separate unavailable-Canvas2D browser check verified an accessible error, disabled image actions and continued itinerary downloading.
- Modified app/components/journey-engine-view.tsx and this dashboard. Added app/components/journey-sharing.tsx, app/lib/journey-sharing.ts, app/lib/journey-poster.ts and tests/journey-sharing.test.mjs. No dependencies or generated image files were added to the repository.
- Limitations include physical-device and non-Chromium behavior remaining unverified, and the native OS share sheet being unavailable in the tested browser. Actual external sharing remains unverified. Clipboard-denial behavior passed the checkpoint browser check. Exported images and itineraries are snapshots and do not synchronize after downloading.
- Checkpoint review verified all six files for correctness, secrets, generated artifacts and unrelated changes. Lint, TypeScript, all 51 tests and production build passed again. Fresh Chromium contexts loaded all three public journey routes without authentication or access to creator storage, preserving public information while leaving private name and watch status absent. Progress disclosure remained off by default, and an unwatched dossier stayed protected.
- Clipboard denial selected the full public URL for manual copying. Missing native file sharing reported its PNG fallback. Failed PNG encoding and unavailable Canvas2D preserved itinerary downloading. PNG dimensions, certificate eligibility, keyboard export, reduced motion, 375px touch layout and silent audio were reverified.
- Git baseline was clean main synchronized with origin/main at 2c5fbf54. Phase 18 checkpoint preparation was approved separately. Phase 19, Accessibility (a11y) & Screen Reader Hardening, is ready for separate scoping.


## Phase 19 — Accessibility (a11y) & Screen Reader Hardening

- The original scope covers comprehensive ARIA live regions, keyboard navigation auditing, focus traps for drawers and automated axe-core compliance. The implementation reuses existing progress stores, native controls, dialogs and scene navigation.
- Skip to main content is the first page link and targets a focusable main landmark on the homepage, pathways index, all journey routes and the custom 404 page. Focus styles also support forced colors, and hash destinations account for the fixed header.
- Mobile and tablet navigation has a named landmark, associated toggle, 44px touch target, Escape dismissal and focus restoration. Responsive breakpoints keep the controls within the header at intermediate widths.
- Search, Movie Dossiers and progress reset use one tested focus helper. It excludes disabled, hidden, inert and programmatic-only controls, wraps both ends, handles a focused dossier heading and recovers outside focus. Dossiers explicitly restore the opener on cleanup. Search explicitly dismisses on Escape even when a filled native search input would otherwise consume the key.
- Search exposes Ctrl+K and Cmd+K with aria-keyshortcuts and a tooltip. Map-pin accessible names match the visible number and realm name. Chapter completion bars now have a progressbar role, bounds, numeric value and readable count.
- Journey watch progress, dossier reveal/watch state and scene selection have stable, concise polite announcements. The scene announcement sits outside the changing animation container. Backup previews and cancellation announce their status without changing the existing additive import logic.
- Existing low-contrast muted labels use the brighter slate token. The 404 display is readable. Contrast changes reuse the existing palette and leave story content and data intact.
- Added development-only @axe-core/playwright and playwright-core dependencies and npm run test:a11y. The audit uses an isolated browser context, constrained-device lightweight controls and reduced motion. It scans all six routes at 1280px and 375px, plus search, dossiers, reset, prerequisite graph, sharing, import, simulator, TVA, armor, character and realm states. No axe rules are disabled.
- Verified npm run lint, npx tsc --noEmit, node --test tests/*.test.mjs and npm run build. All 54 unit tests passed, including three new focus regressions. The production build passed after recovering a Windows EPERM error while creating a generated prerender directory.
- npm run test:a11y passed 39 axe scans with zero reported violations. Keyboard assertions cover skip navigation, Ctrl+K/Cmd+K, filled-search Escape, Tab/Shift+Tab wrapping, nested dossier dismissal and focus return, reset cancellation, watch persistence after reload, scene arrow navigation and archive controls. Backup announcements, default-off progress disclosure, touch navigation and silent audio were also checked.
- Additional browser checks verified focus visibility, forced-color 2px outlines, and header control bounds at 375, 768, 1024, 1280 and 1536px. Mobile skip-link and navigation captures were visually inspected. No screenshots or browser binaries were added to the repository.
- To repeat the browser audit, run a production server on port 3009 and npm run test:a11y in another terminal. A11Y_BASE_URL can select a different server. Install a Playwright Chromium browser with npx playwright-core install chromium --only-shell, or set A11Y_BROWSER_EXECUTABLE or A11Y_BROWSER_CHANNEL to an available browser. The axe dependency requires Node 22.12 or later; verification used Node 24.16.
- The 38 automated incomplete results were categorized and checked through source review, rendered samples and keyboard interaction at checkpoint review below. Exhaustive per-pixel verification across all layered and animated backgrounds remains unverified. NVDA, JAWS, VoiceOver, physical devices and non-Chromium browsers were not tested. This cycle audited the keyboard-equivalent lightweight scenes, with GPU visuals unchanged. Automated success does not establish full WCAG conformance.
- The baseline was clean main synchronized with origin/main at 613ecfa14. Phase 19 checkpoint review and its local commit were authorized separately. Phase 20, Performance Optimization & Offline PWA, is ready for separate scoping.

### Files added or modified in Phase 19

- PROJECT_DASHBOARD.md
- app/components/archive-search.tsx
- app/components/choose-your-path-client.tsx
- app/components/footer.tsx
- app/components/header.tsx
- app/components/hero.tsx
- app/components/journey-engine-view.tsx
- app/components/movie-dossier.tsx
- app/components/pathways-preview.tsx
- app/components/pillars.tsx
- app/components/progress-profile.tsx
- app/components/realm-nexus.tsx
- app/components/scene-explorer.tsx
- app/components/timeline-preview.tsx
- app/components/ui/card.tsx
- app/globals.css
- app/layout.tsx
- app/lib/accessibility.ts
- app/not-found.tsx
- app/page.tsx
- app/pathways/[id]/page.tsx
- app/pathways/page.tsx
- package-lock.json
- package.json
- scripts/a11y-audit.mjs
- tests/accessibility.test.mjs


### Phase 19 checkpoint review

- All 26 changed files were reviewed for correctness, security, secrets, generated artifacts and unrelated changes. The added dependencies remain development-only. No environment files, browser binaries, raw audit reports or screenshots are included in the repository.
- The original 38 incomplete records comprised 36 color-contrast records and two label-content-name-mismatch records. They are rule results spanning repeated UI states, not 38 distinct failing elements. The original report covered 330 distinct rule/selector combinations; after fixes and changed scroll positions the final report covers 334.
- Contrast categories include gradient and translucent backgrounds, partial clipping/occlusion during scrolling, SVG/image labels, pseudo-element decoration, symbolic or short text, and empty native fields. Categories overlap. Source and rendered review covered these categories, with numeric measurements on representative headings, actions, diagram labels and muted text. It does not establish contrast for every pixel of every visual state.
- Both label-matching records refer to the same two icon-only timeline arrow controls at desktop and mobile widths. Their Previous timeline event and Next timeline event accessible names were checked against the actual keyboard-operated slider movement. Their names describe the actions correctly.
- Manual review found and fixed transparent gradient text disappearing in forced colors. The final forced-color overrides follow the cinematic styles, use CanvasText, clear decorative filters and shadows, and give progress bars a CanvasText boundary with Highlight fill. Both light and dark forced-color palettes were visually inspected. Normal presentation intentionally retains the dark design under either system preference.
- Reverse-Tab traversal exposed controls hidden behind the fixed header. Root scroll padding now reserves its space. A subsequent traversal of 80 Tab and 80 Shift+Tab actions found no obscured focused controls, and the automated suite now checks reverse traversal. Skip navigation, dialog traps, Escape, focus return and forced-color outlines passed.
- The reset confirmation hover uses a darker red to maintain readable white text. Measured contrast was 4.77:1 at rest and 6.42:1 on hover.

| Representative contrast check | Minimum measured ratio | Required ratio |
| --- | --- | --- |
| Silver heading gradient stops against sampled background | 3.93:1 | 3:1 |
| Emerald heading gradient stops against sampled background | 5.25:1 | 3:1 |
| Primary journey action | 9.24:1 | 4.5:1 |
| SVG Earth-616 label | 11.70:1 | 4.5:1 |
| Realm map label | 7.29:1 | 4.5:1 |
| Muted footer text | 7.74:1 | 4.5:1 |

- The browser suite still reports 38 incomplete records with no disabled rules. Categorization and representative review found no additional blocking defect after the fixes. The remaining uncertainty is exhaustive contrast across complex animated/GPU states and behavior with actual assistive technology and other devices.
- Final lint, TypeScript, all 54 unit tests, production build and the 39-scan axe suite passed. There were zero axe violations. Forced-color heading and progress-bar assertions were added. Optional A11Y_REPORT_PATH writes the raw violations/incomplete records to a caller-selected JSON file for repeatable triage.
- Sharing privacy was rechecked with anonymous fresh browser contexts for all three journey links. Creator name and watch progress stayed private, optional disclosure stayed off by default, and dossier details stayed protected. Clipboard denial, unavailable native sharing and failed PNG encoding kept their documented fallbacks.
- The final 375px layout, touch navigation, focus visibility, live-region content, progressbar attributes, watch persistence and default-silent audio passed browser checks. Header bounds and forced-color focus outlines also passed at the previously documented viewport sizes. No Phase 20 implementation was started.

## Phase 20 — Performance Optimization & Offline PWA

- Original scope: asset preloading, service worker caching for offline viewing, bundle optimization and image format audits. No additional acceptance checklist was present in the original roadmap. Dependencies are the existing static Next.js routes, next/font, dynamic imports, browser Service Worker/Cache Storage APIs and the existing progress store. No packages were added. Implementation started from clean main, synchronized with origin/main at bdb82a30ba447080fa6e0a3c990ceec10305da98.
- Added a standalone web app manifest, original archive monogram SVG, 180/192/512px PNG installation icons and Apple touch metadata. Browser installation remains browser/OS controlled. Offline saving is a separate, explicit opt-in action; fresh visitors receive no worker registration or archive download.
- The expandable Carry the archive offline panel lazy-loads its controls. Save archive offline, Check offline updates and Remove offline copy provide keyboard/touch actions and live status. Unavailable APIs, insecure origins and development builds explain why saving is unavailable. Saving failures preserve watch progress. Evicted cache contents can be saved again without a new application build.
- npm run build now runs a postbuild generator that derives the public route and hashed asset allowlist from this production build. It generates ignored public/sw.js from the reviewed scripts/service-worker.js source. The current build saves five public pages and 58 total resources; static build assets total 2.16 MiB before HTTP compression, excluding HTML and public icons. Cache warming fetches at most four resources concurrently, including the existing self-hosted WOFF2 fonts. Successful completion is marked only after the whole snapshot is saved; partial failed copies are removed.
- Offline documents cover the homepage, pathway selector and all three journeys. Existing dossiers, graph, chapters, simulator, chronology and other bundled tools remain available from those pages. Unknown offline destinations receive a standalone accessible explanation with links back to saved pages. External sources and streaming websites still require connectivity.
- Versioned archive caches use network-first document navigation and cache-first allowlisted build resources. RSC requests never receive cached HTML. No runtime response, API response, external request, backup download or private local storage is added to the cache. Watch state remains in the original local store; spoiler controls and default-off sharing disclosure remain unchanged. Removing the archive deletes only its own caches and registration, preserving watch progress and unrelated storage.
- Updates prepare a separate complete copy and wait for existing tabs to close before activating. They do not reload visitors mid-journey. Activation removes only previous archive-version caches. Production Chromium verified two simultaneous tabs, the old copy remaining usable offline while an update waited, subsequent activation and preservation of watched state.
- Search now loads its dialog/index on demand and loads nested dossiers only when selected. Query/filter state survives closing and reopening search during the page session. Ctrl+K/Cmd+K, traps, Escape and restoration remain covered by the existing audit. MovieDossier accepts an optional captured return-focus element so delayed loading reliably restores the selected result; other callers retain their original behavior.
- The existing lightweight scene selection, reduced-motion behavior, lazy 3D boundaries, adaptive rendering and silent audio engine were preserved. No new render loop, WebGL canvas or audio activation was introduced. The existing next/font setup already emits two WOFF2 preload links; these were verified in production HTML and the fonts are included in the offline snapshot.
- Image audit found no content raster image gallery to transcode: the existing public scaffolding is SVG plus the favicon, and cinematic imagery uses existing CSS/WebGL/Canvas systems. SVGs and the favicon were preserved. The new small installation PNGs are required PWA formats (20,679 bytes combined); they are derived from the included SVG, not external imagery. Existing generated social posters remain fixed 1080 × 1350 PNGs.

### Phase 20 verification

- Passed npm run lint, npx tsc --noEmit, node --test tests/*.test.mjs (60/60) and npm run build including postbuild. Six new tests execute the worker source with a controlled cache/network runtime: complete installation, matching/unknown offline navigation, RSC/private/external/write exclusions, failed installation preserving the previous copy, scoped activation cleanup and cache eviction repair.
- Passed npm run test:a11y against the production server: 39 scans, zero violations, no disabled rules. The 38 incomplete rule results remain color-contrast and label-content-name-mismatch categories reviewed in Phase 19; this does not establish exhaustive contrast or assistive-technology conformance. Three additional Chromium axe scans covered expanded offline controls at 1280px and 375px and the standalone fallback, with zero violations and zero incomplete results. Keyboard activation, focus order and no horizontal overflow passed for the new controls.
- Production Chromium checked opt-in registration, manifest/icon metadata, offline homepage reload, saved pathway navigation including sibling Next links, persistent watch toggles, lazy search/dossier/graph loading, protected unwatched synopsis, offline 1080 × 1350 PNG generation and default-off disclosure. Cache eviction/re-save and removal without progress loss passed. The instrumentation recorded zero AudioContext allocation during the offline flow.
- Phase 18 regressions passed: all three public journey links worked in fresh anonymous contexts without creator progress or name; disclosure defaulted off; protected stories remained sealed; denied clipboard selected a manual-copy URL; unavailable native file sharing offered downloading. PNG dimensions, itinerary downloads, completion-certificate eligibility/download/revocation, failed PNG encoding fallback and watch persistence after refresh passed. The 375px touch sharing studio had no horizontal overflow or page errors.
- Inspected the mobile offline controls, standalone offline fallback and installation icon screenshots. Screenshots, downloaded posters, browser binaries, raw reports and scratch QA scripts remain outside the repository. The original 39-scan audit and six new worker tests are repeatable from the repository. Browser verification used reduced motion and a constrained-device/WebGL-disabled Chromium context, not physical integrated graphics hardware.

| Homepage JavaScript measurement | Phase 19 baseline | Phase 20 |
| --- | ---: | ---: |
| Initial HTML script resources | 12 | 12 |
| Decoded bytes | 747,147 | 735,076 |
| HTTP encoded bytes | 227,809 | 224,583 |

- The initial HTML script payload decreased by 12,071 decoded bytes (1.62%) while adding PWA support. Automatic route prefetching can add a separate 28,304 decoded bytes after load; totals collected indiscriminately at network-idle therefore vary. The comparison excludes that optional route prefetch. These are local Chromium resource measurements, not claims about physical-device frame rate, RAM consumption, Core Web Vitals or all routes.
- To repeat the standard browser audit, run npm run build, then npm run start -- -p 3011, and set A11Y_BASE_URL=http://127.0.0.1:3011 when running npm run test:a11y. Configure A11Y_BROWSER_EXECUTABLE or A11Y_BROWSER_CHANNEL as described in Phase 19. Offline behavior requires a production build, HTTPS/localhost, an online initial save and browser storage permission/capacity. Deployments must run the npm build lifecycle, including postbuild; public/sw.js is intentionally regenerated rather than committed.
- Known limitations: browser storage can be evicted and offline copies are device-specific. New content appears after a successful update and closure of open tabs. No cross-browser/physical-device or OS-level installed-app testing was performed; native OS share-sheet completion and exhaustive screen-reader/GPU-state contrast remain unverified. Offline saving does not make external sources available or replace progress backups. Service workers are disabled for development to avoid stale development assets.
- Phase 21, Pre-Doomsday Countdown & Launch Polish, remains unchanged and unstarted. Phase 20 is ready for checkpoint review. No commit, push or deployment was performed.

### Files added or modified in Phase 20

- PROJECT_DASHBOARD.md, .gitignore, package.json, eslint.config.mjs and next.config.ts.
- app/layout.tsx and app/manifest.ts.
- app/components/archive-search.tsx, app/components/archive-search-dialog.tsx and app/components/movie-dossier.tsx.
- app/components/offline-archive.tsx and app/components/offline-archive-controls.tsx.
- scripts/build-offline.mjs, scripts/service-worker.js and tests/offline-worker.test.mjs.
- public/offline.html, public/pwa/icon.svg, public/pwa/icon-180.png, public/pwa/icon-192.png and public/pwa/icon-512.png.
### Phase 20 checkpoint review

- Reviewed all 20 changed files for correctness, security, secrets, generated artifacts, dependency changes and scope. No credentials, environment files, raw audit reports, downloaded posters, browser binaries or scratch builds are included. The package lock and dependencies are unchanged. Removed incidental ESLint quote-style changes; its only functional addition ignores the generated worker, while the worker source remains linted and tested.
- Fixed partial-cache recovery: readiness now verifies every allowlisted resource as well as the completion marker. A missing individual resource is detected and can be repaired. Storage read denial no longer blocks online static assets; navigation can recover a saved document after network failure or HTTP 5xx, and retains the network response if cache storage is unavailable. Extended the existing six worker tests with partial eviction, denied storage, exhausted quota, safe network fallback and failed-request assertions; the complete suite remains 60 tests.
- Fixed an intermittent search reopen race discovered by the audit: delayed native close events could close a newly reopened search. Explicit close actions and native cancellation now use the same close path without a stale close-event callback. Twenty immediate alternating Ctrl+K/Cmd+K and Escape cycles passed with input focus and trigger restoration. Nested dossier focus restoration and traps passed the full audit.
- Offline-copy removal now restores focus to Save archive offline, or the enabled options toggle when offline. Verified keyboard removal in both states. Worker-message failure closes its channel immediately instead of leaving a pending timeout. Existing event listeners are detached on unmount.
- Audited root scope, version generation, waiting updates, activation cleanup and request exclusions. The finite build-derived allowlist has no runtime cache growth. The measured full snapshot is 2,659,633 decoded bytes across 58 resources plus its ready marker (about 2.54 MiB); two complete versions coexist while an update waits. Browser quotas are not reserved or overridden by the application. Quota failure removes the incomplete new copy and retains the prior copy in the controlled tests. Abrupt browser termination or browser-managed eviction remains outside application control; a subsequent save/activation or explicit removal provides recovery.
- Production Chromium verified no registration before opt-in, an online initial-save requirement, full and partial cache repair, removal, waiting updates, fallback navigation, and recovery after clearing Cache Storage/service-worker registration. Injected denial in the actual worker cache API produced a safe save failure and preserved watch progress; an unavailable Service Worker API displayed the supported-browser explanation. Unit tests also cover quota exhaustion. Cache contents exclude sensitive URLs, progress exports and private state; preparation omits credentials and fetch handling never writes runtime responses.
- Chromium parsed the manifest without errors and reported no installability errors after opt-in. Root scope/start URL, standalone display, PNG MIME types and actual 192/512px dimensions, worker JavaScript MIME type and no-store response headers passed. The Apple icon and SVG source remain included. No actual OS installation was performed.
- Rebuilt the approved Phase 19 checkpoint in an isolated scratch directory using the same installed dependency versions, production configuration and Node runtime. The same Chromium measurement used fresh contexts, reduced motion, constrained-device settings, identical HTML-entry-script filtering and local production servers. Both builds emitted 12 initial script resources. Baseline 747,147 decoded / 227,809 HTTP encoded bytes and Phase 20 735,076 decoded / 224,583 encoded bytes reproduce the original table and 1.62% decoded reduction. Scratch files are outside the repository; the main checkout was never switched or replaced.
- Final lint, TypeScript, all 60 tests and production build/postbuild passed after the fixes. Repeated all 42 axe scans: 39 existing states and three offline states, zero violations. The 38 incomplete records comprise 36 contrast results and two timeline arrow label-matching results; their rule/selector sets are unchanged from the prior Phase 20 audit. Representative contrast measurements again passed (silver heading 3.93:1, emerald heading 5.25:1, primary action 9.24:1, SVG Earth-616 11.70:1, realm label 7.29:1, muted footer 7.74:1). Timeline names still match their keyboard-operated actions. Exhaustive animated-background contrast and real assistive technology remain unverified.
- Repeated sharing/privacy and export checks: all three public links work in fresh anonymous contexts with no creator name/watch progress; disclosure remains off; dossiers remain protected; clipboard/native-file-sharing fallbacks and failed PNG encoding preserve usable alternatives. PNG dimensions, itineraries, certificate gating/revocation, reload persistence, reduced motion, zero unexpected audio allocation and the 375px touch layout passed. Reinspected mobile offline/fallback screenshots.
- No blocking issue remains in the tested Chromium flows. Cross-browser, physical hardware, OS installation, native share-sheet completion and actual screen-reader limitations remain as documented above. The user authorized this Phase 20 checkpoint commit and a normal push; Git results are reported separately. Phase 21 remains unstarted and no deployment was performed.

## Phase 21 — Pre-Doomsday Countdown & Launch Polish

### Original scope and dependencies

- Exact original scope: live theatrical countdown clock to Avengers: Doomsday release, final cross-browser validation and release readiness. The roadmap has no separate dependency or acceptance checklist. This phase reuses the existing homepage, cinematic design tokens, shared controls, external-store subscription pattern, journey routes, native accessibility semantics, production build, PWA generator and test dependencies. No new production or development dependency was added.
- Verified clean main, local origin/main and the live GitHub main ref at 9c8c40b20b8861ce6ccf5e26ae1b7e8442cc1431 before editing. No branch switch, commit, push, reset or deployment occurred during Phase 21.

### Delivered functionality

- The homepage now has a responsive release-signal section at /#countdown between the existing 3D landing and Pillars. It preserves the existing cinematic identity without adding another WebGL canvas, particle effect or renderer. Prepare your pathway opens the existing pathway selector; Verify date with Disney links to the actual official listing. A footer link reaches the section from every existing route.
- Disney Movies lists December 18, 2026 for the US theatrical release, verified 2026-11-04 at https://movies.disney.com/avengers-doomsday. The date is production information, not a story/canon claim. The archive explicitly counts to midnight Eastern on that date (2026-12-18T05:00:00Z), an editorial date marker rather than a confirmed screening time. Regional variation, schedule changes, device-clock dependence, verification date and the inability of offline copies to check announcements are visible.
- Days/hours/minutes/seconds use absolute elapsed time with no accumulated tick drift and no negative values. A fraction of a remaining second never displays premature zero. At the target all fields stop at zero and the copy says the scheduled date has arrived, directing visitors to verify current release information rather than asserting that screenings are available.
- Pause/resume freezes the displayed value and resumes from actual device time. The timer has an accessible name and aria-live off, avoiding announcements every second. Read countdown sends a deliberate reading through a polite status region. Keyboard/touch controls have visible focus and minimum 44px targets; layout fits 375px and forced colors.
- Stable server snapshots render the scheduled date without a server/client time mismatch. One shared one-second clock exists only with active subscribers. Hidden-document, offscreen and paused views stop updates; visibility/resume recomputes actual time. The clock stops at the deadline and releases its interval and visibility listener after the final subscriber leaves. No countdown choice or story reveal is persisted or shared, and the watch store is untouched.
- Launch polish replaces the obsolete Phase 4 footer badge with the existing tagline. Back to Top now focuses the main landmark and honors reduced motion. Existing navigation, audio defaults, scenes, spoiler controls, sharing defaults and watch stores remain in use. Phase 20's generated public snapshot automatically includes the new countdown; no worker policy or privacy allowlist was broadened.
- Added npm run test:release and scripts/release-audit.mjs for repeatable browser checks. The script defaults to Chromium, Firefox and WebKit and fails when a selected browser cannot run rather than silently claiming success. RELEASE_BROWSERS selects installed engines, RELEASE_BASE_URL selects the production server, RELEASE_CHROMIUM_EXECUTABLE selects an existing Chromium, and RELEASE_ARTIFACT_DIR optionally writes screenshots outside the repository. It waits for enabled watch controls before keyboard activation and persistence assertions.

### Phase 21 verification

- Lint, TypeScript, all 65 automated tests, production build and its offline postbuild passed. Five added tests cover time decomposition and sub-second boundaries, timezone-independent Eastern targeting, invalid/past inputs, stable hydration snapshots, shared-clock/hidden-document lifecycle, cleanup and deadline stopping. Existing store, backup, graph, chronology, simulation, lore, audio, search, sharing and worker tests remain intact.
- The production application was tested on localhost port 3014. npm run test:release passed with RELEASE_BROWSERS=chromium,webkit: Chromium 156.0.8078.4 and Windows Playwright WebKit 27.2. Each engine exercised the live clock, pause/resume, date boundary/zero state, source link, deliberate reading, keyboard search/dossier dismissal and focus restoration, unwatched spoiler protection, journey entry, enabled keyboard watch toggle, refresh persistence, graph focus, real 1080 x 1350 PNG download, default-off progress disclosure, fresh-context public progress isolation, chronology/simulator controls, Back to Top focus, reduced motion, silent audio and 375px layout. These are headless browser-engine tests, not physical Safari/iPhone or integrated-GPU certification.
- The release/browser audits use constrained-device settings (two reported CPU cores and 4 GB memory); Chromium also disables WebGL. Graph and scene controls therefore exercise the functional lightweight DOM/SVG equivalents. The existing 3D renderer was preserved, but actual raycasts, context-loss fault injection and GPU frame rates were not reverified in this phase.
- Firefox 157 was installed outside the repository but failed to establish the Playwright connection before the launch timeout, without reaching a page. Firefox functionality is unverified. The default all-engine test invocation therefore did not pass; the explicit Chromium/WebKit invocation did. No application/browser security setting was changed to conceal the failure.
- The existing Chromium axe suite passed 39 scans with zero violations and no disabled rules. Three offline scans and four new countdown scans (1280px, 375px, paused and reached-date states) also passed: 46 total, zero violations. All seven focused offline/countdown scans had zero incomplete results. Forced-color countdown controls retained a visible outline of at least 2px.
- The existing suite still produced 38 incomplete records: 36 contrast rule results and two timeline-arrow accessible-name results. New scroll positions and selector paths changed the distinct target set (335 to 339 pairs), without adding a rule category. The 29 newly encountered selector paths were categorized as 25 gradient-background, two pseudo-element and two partial-occlusion cases in existing components. Representative contrast measurements passed again: silver heading 3.93:1, emerald heading 5.25:1, primary action 9.24:1, Earth-616 SVG label 11.70:1, realm label 7.24:1 and muted footer 7.74:1. Timeline arrow names still match their keyboard actions. Exhaustive contrast across animated/GPU states and real assistive technology remains unverified; zero automated violations is not a full conformance claim.
- Chromium rechecked Phase 20 opt-in installation, initial online requirement, full/partial cache repair, cache removal without progress loss, denied cache access and cleared-cache recovery, waiting updates with two tabs, activation cleanup and unknown-route fallback. The new countdown itself remained interactive offline and reached the simulated date safely. Chromium installability diagnostics reported no errors; no actual OS installation was performed.
- Sharing regressions passed again: anonymous links for all three journeys contain no creator watch progress/name; optional disclosure stays off; dossier story details remain protected. PNG size, itinerary downloads, certificate eligibility/revocation, failed PNG encoding, clipboard denial and unavailable native file sharing retained their documented behavior. The touch studio fit 375px without page errors. Audio remained silent by default with no unexpected context allocation.
- Desktop/mobile Chromium and WebKit screenshots and a forced-color screenshot were inspected. A full-element WebKit capture initially displaced fixed UI; final screenshot capture uses the actual viewport after fonts are ready. Windows WebKit typography appears lighter than Chromium and remains a real-device Safari visual-review item. Reports, screenshots, browser runtimes, downloaded graphics and scratch QA scripts remain outside the repository.

### Complete roadmap status and release readiness

- All original 21 phase titles and numbering remain intact. Phases 1-20 retain their prior verified scopes; Phase 21's countdown, launch polish and engineering/browser validation are delivered. The roadmap is at its final implementation review, not an authorization to publish.
- Earlier scoped limitations remain explicit: Phase 8 is the user-approved story prerequisite graph, with technology lineage still planned; Phase 9 is the six-event chronology; Phase 15 multi-device progress transfer is a manual additive backup/import, not account/cloud synchronization. Unverified streaming links remain omitted. Do not silently relabel these as broader completed capabilities.

| Release check | Verified state |
| --- | --- |
| Production compilation, type safety, lint, unit suite and offline generation | Passed locally |
| Chromium critical journeys, accessibility, privacy and offline recovery | Passed as described above |
| WebKit critical journeys and countdown | Passed in Windows headless engine; physical Safari remains open |
| Firefox | Launch timed out; page behavior unverified |
| Reduced motion, mobile and silent defaults | Browser emulation passed; physical device checks remain open |
| OS installation, native share-sheet completion, real screen readers | Not tested |
| Physical 8 GB/integrated-GPU, frame time, memory and long-session profiling | Not tested; existing budgets retained |
| Deployment, public HTTPS, production-origin routing/cache headers and live field metrics | Not tested or deployed |
| Editorial content review and complete animated-background contrast | Manual review remains open |

- Release assessment: functional release candidate ready for user implementation review; not an unconditional production launch sign-off. Before a public release, finish Firefox and actual Safari/device visual checks (including lighter Windows WebKit typography), screen-reader and physical low-end hardware checks, review remaining editorial/upcoming flags and complex visual contrast, and validate the approved deployment's HTTPS, route and PWA headers. The release date should be reverified when publishing or updating an offline snapshot. No such external capability is marked tested here.
- This is the last original roadmap phase. No additional phase was invented or started. Work stops after implementation and verification; commit, push and deployment await explicit approval.

### Files changed in Phase 21

- PROJECT_DASHBOARD.md — original roadmap status, verification and release gates.
- app/page.tsx — countdown entry between existing sections.
- app/components/release-countdown.tsx — responsive, accessible release clock and existing-route entry points.
- app/lib/release-countdown.ts — sourced release metadata, deterministic model and bounded clock lifecycle.
- app/components/footer.tsx — current tagline, countdown navigation and reduced-motion/focus restoration.
- tests/release-countdown.test.mjs — five focused model/lifecycle tests.
- scripts/release-audit.mjs and package.json — repeatable browser release checks using existing dev dependencies.

### Final Phase 21 checkpoint review — 2026-11-05

- Independently reviewed all eight changed files for correctness, TypeScript quality, security/privacy, dependencies, secrets, generated artifacts and unrelated modifications. Only the expected source, tests, browser audit, package-script and tracking changes are present. Dependencies and package-lock.json are unchanged; public/sw.js remains generated and ignored. A programmatic comparison against the approved Phase 20 commit confirms every original roadmap number/title (01-21) is intact.
- Official date reverified against https://movies.disney.com/avengers-doomsday: December 18, 2026. The UI still explicitly identifies midnight Eastern as this archive's date-based marker, not an official premiere/showtime. The fixed -05:00 offset belongs to December's Eastern Standard Time; it does not use the viewer's current offset or daylight-saving state.
- Final fixes: paused timer names and Read countdown announcements now explicitly say Paused display, preventing a frozen value being mistaken for current remaining time. Extreme finite inputs whose subtraction overflows now return an unavailable result instead of NaN/Infinity fields. The existing five countdown tests were extended, so the complete suite remains 65 tests.
- Countdown verification includes exact/sub-second boundaries, non-negative deadline/expired states, pause/resume, offline controls, and fresh reload returning to the live clock. The timezone test now verifies actual America/New_York midnight with Intl and the repeated 01:30 hour across the November 1 DST transition. Chromium browser contexts in New York, Kolkata and Los Angeles showed identical remaining time for the same instant during that transition. A browser-injected document visibility change stopped updates while hidden and caught up on return; this is simulated document visibility, not a physical OS tab/window test. The timer's live region remains off, and manual readings identify a paused display accurately.
- Re-ran npm run lint, npx tsc --noEmit, node --test tests/*.test.mjs (65 passed, zero failed), and npm run build including its successful postbuild. The generated archive still covers five public pages and 58 resources with 2.16 MiB of build assets; no worker policy was changed. Repeated Chromium 156.0.8078.4 and WebKit 27.2 checks with the explicit chromium,webkit browser selection passed. Firefox was attempted again with a 30-second launch timeout and failed before reaching a page; it remains unverified, rather than reported as a pass.
- Repeated all 46 axe scans: 39 existing states, three offline states, four countdown states; zero violations and no disabled rules. The 38 incomplete records remain 36 contrast results and two timeline-arrow label results. Their 339 distinct rule/selector pairs exactly match the prior Phase 21 audit; there are no newly encountered pairs in this checkpoint. Representative measured contrast passed again (3.93:1 silver heading, 5.25:1 emerald heading, 9.24:1 primary action, 11.70:1 Earth-616, 7.24:1 realm label, 7.74:1 muted footer). These checks retain the previously documented incomplete/complex-background and actual screen-reader limits.
- Repeated critical journeys: cinematic landing's lightweight scene controls, Journey Engine/refresh persistence, protected dossiers, prerequisite graph, chronology, all character identities, TVA sections, Doom armor, Incursion Simulator, Realm Nexus, search shortcuts/traps/focus return, and keyboard navigation. These checks use constrained-device/lightweight views; no new actual 3D mesh/raycast, GPU performance or live context-loss verification is claimed.
- Offline/PWA checks passed again for opt-in/initial online save, cache repair, denied/cleared storage recovery, waiting updates across two tabs, activation cleanup, unknown-route fallback and removal without progress loss. Poster dimensions, itineraries, certificate eligibility/revocation, anonymous links across all three journeys, default-off disclosure, failed PNG encoding, denied clipboard and missing native file-sharing fallbacks passed. Reduced motion, forced-color focus, 375px layout and silent audio passed in the documented browser contexts. Desktop and mobile Chromium/WebKit screenshots were inspected again; the lighter Windows WebKit typography remains a real-Safari visual-check item.
- Verified functionality: no blocking functional defect remains in the exercised Chromium/WebKit and unit-test scopes. Actual defects found during this review were fixed and retested. This supports a functional release-candidate checkpoint, not unrestricted production readiness.
- Unverified behavior/manual gates: Firefox startup/page behavior; real Safari/iOS and WebKit typography; physical 8 GB/integrated-GPU frame time/memory/long sessions and raycasts; actual screen readers and exhaustive animated-background contrast; physical mobile/OS visibility behavior; installed-PWA behavior and native share-sheet completion. Earlier scoped roadmap/content limitations remain intact.
- Recommended before public deployment: resolve the Firefox environment and finish those browser/device/accessibility checks, review editorial/upcoming content and release-date freshness, then validate the specifically approved production origin's HTTPS, routing, caching/service-worker headers and live behavior. No deployment or production-origin result is asserted here. The user authorized this local checkpoint commit and a normal push attempt; final Git results are reported separately. Deployment still requires separate explicit approval.
