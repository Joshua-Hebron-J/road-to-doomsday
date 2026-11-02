# The Road to Doomsday — Project Milestone Dashboard

This living dashboard tracks development progress, milestone criteria, verification results, and subsequent phases for *The Road to Doomsday* cinematic fan archive across the original 21-phase master roadmap.

**Latest verification:** Phase 7 is implemented and production-browser verified. Lint, TypeScript, all 10 regression tests, and the normal Turbopack production build pass. Earlier audit entries below are historical; the Phase 7 entry records the resolution of the build blocker. Physical-device/performance and system reduced-motion QA remain open.

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
| **08** | **Prerequisite Lineage & Dependency Graph** | **PLANNED** | Pending | Interactive visual node graph displaying precursor story dependencies and technology lineages leading to Doomsday. |
| **09** | **Multiverse Macro Chronology & Timeline Scrubber** | **PARTIAL — 3D PREVIEW** | 2026-11-02 | Interactive horizontal timeline scrubber with in-universe chronological year and theatrical release date toggle modes. |
| **10** | **Incursion Engine & Reality Tear Simulator** | **PLANNED** | Pending | Interactive dimensional collision simulation, incursion threat gauge, universe designation badges, and dying reality alerts. |
| **11** | **Character & Variant Lineage Tracker** | **PLANNED** | Pending | Tracking variants across alternate Earths (Doctor Strange, Loki, Reed Richards, Wanda Maximoff, Victor Von Doom). |
| **12** | **Doctor Doom & Latverian Lore Codex** | **PLANNED** | Pending | Victor Von Doom entity dossier, comic origins vs MCU adaptation, monarch armor analysis, and sovereign philosophical worldview. |
| **13** | **TVA & Temporal Loom Archives** | **PLANNED** | Pending | TVA regulations, temporal loom mechanics, Void artifacts, and Miss Minutes easter eggs. |
| **14** | **Interactive Multiverse Map & Realm Nexus** | **PLANNED** | Pending | Spatial visualization of Earth-616, Earth-838, the Void, the Quantum Realm, and Battleworld convergence. |
| **15** | **User Profile & Watch Progress Synchronization** | **PLANNED** | Pending | Exportable/importable watch states (JSON), backup readiness, and multi-device progress tracking. |
| **16** | **Cinematic Audio Scapes & Ambience Engine** | **PLANNED** | Pending | Latverian ambient synth hum, temporal loom audio textures, audio mute/toggle control, and interaction sound effects. |
| **17** | **Search, Multiverse Filters & Tagging System** | **PLANNED** | Pending | Instant omni-search across movies, characters, phases, and narrative themes with keyboard shortcuts (`Cmd+K`). |
| **18** | **Watchlist Sharing & Custom Poster Generator** | **PLANNED** | Pending | Custom graphic generator for social sharing, journey completion certificate, and downloadable watch itineraries. |
| **19** | **Accessibility (a11y) & Screen Reader Hardening** | **PLANNED** | Pending | Comprehensive ARIA live regions, keyboard navigation audit, focus traps for drawers, and automated axe-core compliance. |
| **20** | **Performance Optimization & Offline PWA** | **PLANNED** | Pending | Asset preloading, service worker caching for offline viewing, bundle optimization, and image format audits. |
| **21** | **Pre-Doomsday Countdown & Launch Polish** | **PLANNED** | Pending | Live theatrical countdown clock to Avengers: Doomsday release, final cross-browser validation, and release readiness. |

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
