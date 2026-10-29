"use client";

import { motion, useReducedMotion } from "motion/react";
import { SectionHeader } from "./ui/section-header";
import { Badge, BadgeVariant } from "./ui/badge";

interface ChronologyEra {
  phase: string;
  codename: string;
  timeframe: string;
  threatLevel: string;
  threatVariant: BadgeVariant;
  synopsis: string;
  focalEntities: string[];
}

const CHRONOLOGY_ERAS: ChronologyEra[] = [
  {
    phase: "PHASE IV",
    codename: "TEMPORAL FRACTURES",
    timeframe: "The Fall of He Who Remains",
    threatLevel: "CRITICAL — BRANCH DIVERGENCE",
    threatVariant: "gold",
    synopsis:
      "The death of the Citadel guardian shatters the Sacred Timeline into infinite competing reality branches. Nexus anomalies trigger the earliest documented dimensional ruptures.",
    focalEntities: ["Loki & Sylvie", "Doctor Strange", "Wanda Maximoff", "The Watcher"],
  },
  {
    phase: "PHASE V",
    codename: "MULTIVERSAL INVASIONS & INCURSIONS",
    timeframe: "The Collision of Alternate Earths",
    threatLevel: "CATASTROPHIC — INCOMING INCURSIONS",
    threatVariant: "incursion",
    synopsis:
      "Realities grind against one another. Quantum realm anomalies and anchor-being collapses destabilize universe lifespans across the broader multiverse.",
    focalEntities: ["TVA Enforcement", "Deadpool & Wolverine", "Quantum Explorers", "Monica Rambeau"],
  },
  {
    phase: "PHASE VI",
    codename: "SOVEREIGN CONVERGENCE",
    timeframe: "The Rise of Latveria & First Steps",
    threatLevel: "EXISTENTIAL — UNIVERSAL EXTINCTION",
    threatVariant: "incursion",
    synopsis:
      "With traditional alliances divided and Earth vulnerable, the Fantastic Four arrive from an alternate retro-futuristic timeline as Doctor Victor Von Doom ascends to command absolute salvation.",
    focalEntities: ["Victor Von Doom", "The Fantastic Four", "The New Avengers", "The Illuminati"],
  },
];

export function TimelinePreview() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="chronology"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-surface-1/30"
    >
      <div className="max-w-7xl mx-auto">
        {/* Standardized Section Header */}
        <SectionHeader
          category="Macro Chronology"
          title="Timeline Horizons"
          description="The chronological progression of escalating threats from the aftermath of the Infinity Saga to the eve of Doomsday."
        />

        {/* Timeline Horizon Cards */}
        <div className="relative border-l border-white/10 ml-4 sm:ml-8 md:ml-32 pl-6 sm:pl-10 space-y-12">
          {CHRONOLOGY_ERAS.map((era, index) => (
            <motion.div
              key={era.phase}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.5,
                delay: shouldReduceMotion ? 0 : index * 0.15,
              }}
              className="relative group"
            >
              {/* Stepper Node on line */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1 flex items-center justify-center w-5 h-5 rounded-full border border-emerald-500/40 bg-surface-0 group-hover:border-emerald-400 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>

              {/* Main Content Box */}
              <div className="p-6 sm:p-8 rounded-lg bg-surface-2/40 border border-white/5 hover:border-emerald-500/30 hover:shadow-card-hover transition-all duration-300 backdrop-blur-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">
                      {era.phase}
                    </span>
                    <span className="text-xs font-mono text-slate-500">•</span>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      {era.timeframe}
                    </span>
                  </div>

                  <Badge variant={era.threatVariant} size="sm">
                    {era.threatLevel}
                  </Badge>
                </div>

                <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-100 mb-2">
                  {era.codename}
                </h3>

                <p className="text-sm text-slate-300 font-light leading-relaxed mb-6">
                  {era.synopsis}
                </p>

                <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mr-2">
                    Key Nexus Figures:
                  </span>
                  {era.focalEntities.map((entity) => (
                    <span
                      key={entity}
                      className="px-2.5 py-1 rounded bg-surface-1 border border-white/5 text-xs text-slate-300 font-mono select-none"
                    >
                      {entity}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
