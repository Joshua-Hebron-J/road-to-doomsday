import Link from 'next/link';
import { doomAnnouncement, doomSources } from '../data/doom-codex';
import { getJourneyById } from '../lib/journey';
import { DoomArmorStudy } from './doom-armor-study';

const sections = [
  ['doom-origins', 'Origins and adaptation'],
  ['doom-armor', 'Monarch armor'],
  ['doom-sovereignty', 'Sovereign worldview'],
] as const;

function Source({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 items-center text-sm text-emerald-200 underline focus-ring-doom"
    >
      {children} ↗
    </a>
  );
}

export function DoomCodex() {
  const journey = getJourneyById('the-doom-essential');
  return (
    <section
      id="doom-codex"
      aria-labelledby="doom-codex-title"
      className="scroll-mt-24 border-y border-emerald-300/20 bg-[radial-gradient(ellipse_at_top,#15352b,#080c13_65%)] px-4 py-16 sm:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-emerald-200">
          Latverian archives / Sovereign dossier
        </p>
        <h2
          id="doom-codex-title"
          className="mt-3 text-3xl font-bold text-white sm:text-5xl"
        >
          Doctor Doom &amp; Latverian Lore Codex
        </h2>
        <div className="mt-6 border-l-2 border-emerald-300/60 pl-5">
          <h3 className="text-2xl font-semibold text-white">Victor Von Doom</h3>
          <p className="mt-2 max-w-3xl leading-relaxed text-slate-300">
            Scientist, sorcerer, and ruler of Latveria in Marvel Comics. His
            rivalry with Reed Richards puts two visions of genius in conflict:
            discovery shared with others, and power concentrated in one
            sovereign.
          </p>
          <Source href={doomSources.rivalry}>
            Marvel Comics · Doom and Reed
          </Source>
        </div>

        <nav
          aria-label="Doom codex sections"
          className="mt-5 flex flex-wrap gap-2"
        >
          {sections.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="inline-flex min-h-11 items-center rounded-lg border border-emerald-300/30 px-3 text-sm text-emerald-100 focus-ring-doom"
            >
              {label}
            </a>
          ))}
        </nav>

        <section
          id="doom-origins"
          aria-labelledby="doom-origins-title"
          className="mt-10 scroll-mt-24"
        >
          <h3
            id="doom-origins-title"
            className="text-2xl font-semibold text-white"
          >
            Origins and adaptation
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <article className="rounded-xl border border-white/15 bg-slate-950/80 p-5">
              <p className="font-mono text-xs uppercase tracking-wider text-emerald-200">
                Marvel Comics
              </p>
              <h4 className="mt-2 text-lg font-semibold text-white">
                From scholar to sovereign
              </h4>
              <p className="mt-2 text-slate-300">
                Doom debuted in Fantastic Four #5. Books of Doom retraces his
                early pursuit of the dark arts, his studies in America, and the
                events that brought him to Latveria’s throne. His rivalry with
                Reed grows out of their early encounters as scientists.
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4">
                <Source href={doomSources.debut}>First appearance</Source>
                <Source href={doomSources.origin}>Books of Doom</Source>
              </div>
            </article>
            <article className="rounded-xl border border-white/15 bg-slate-950/80 p-5">
              <p className="font-mono text-xs uppercase tracking-wider text-emerald-200">
                MCU / {doomAnnouncement.medium}
              </p>
              <h4 className="mt-2 text-lg font-semibold text-white">
                {doomAnnouncement.externalTitle}
              </h4>
              <p className="mt-2 text-slate-300">
                {doomAnnouncement.description} The comics supply context for the
                character’s history and iconography. The film’s continuity has
                its own account of those details.
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4">
                <Source href={doomAnnouncement.source}>
                  Marvel Studios announcement
                </Source>
                <a
                  href="#variants"
                  className="inline-flex min-h-11 items-center text-sm text-emerald-200 underline focus-ring-doom"
                >
                  Compare screen lineages
                </a>
              </div>
            </article>
          </div>
        </section>

        <section
          id="doom-armor"
          aria-labelledby="doom-armor-title"
          className="mt-10 scroll-mt-24"
        >
          <h3
            id="doom-armor-title"
            className="text-2xl font-semibold text-white"
          >
            Monarch armor
          </h3>
          <p className="mt-2 max-w-3xl text-slate-300">
            Inspect the components of Doom’s familiar silhouette. This
            illustrated design study reads the costume as both protection and
            royal dress.
          </p>
          <DoomArmorStudy />
          <Source href={doomSources.armor}>Licensed costume reference</Source>
        </section>

        <section
          id="doom-sovereignty"
          aria-labelledby="doom-rule-title"
          className="mt-10 scroll-mt-24 rounded-xl border border-emerald-300/25 bg-slate-950/85 p-5 sm:p-7"
        >
          <p className="font-mono text-xs uppercase tracking-wider text-emerald-200">
            Editorial analysis / Marvel Comics
          </p>
          <h3
            id="doom-rule-title"
            className="mt-2 text-2xl font-semibold text-white"
          >
            Sovereign worldview
          </h3>
          <p className="mt-3 max-w-3xl leading-relaxed text-slate-300">
            In One World Under Doom, Victor seeks to protect the world by
            uniting it under his rule. That premise exposes the tension at the
            heart of his worldview: he treats his capacity to solve a crisis as
            authority to decide everyone’s future. Latveria gives that idea a
            national stage. The wider Marvel world tests what happens when he
            applies it everywhere.
          </p>
          <Source href={doomSources.rule}>
            Marvel’s One World Under Doom guide
          </Source>
          {journey && (
            <div className="mt-4 border-t border-white/15 pt-3">
              <p className="text-sm text-slate-300">
                Follow the site’s curated viewing route for the screen stories
                leading toward Doomsday.
              </p>
              <Link
                href={`/pathways/${journey.id}`}
                className="inline-flex min-h-11 items-center text-sm font-medium text-emerald-200 underline focus-ring-doom"
              >
                {journey.title} →
              </Link>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
