"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { journeys } from "../data/journeys";
import { calculateJourneyStats, getJourneyChapters } from "../lib/journey";
import { SectionHeader } from "./ui/section-header";
import { Badge, BadgeVariant } from "./ui/badge";
import { Button } from "./ui/button";

export function PathwaysPreview() {
  const [activePathway, setActivePathway] = useState<string>(
    journeys[0]?.id || "the-doom-essential"
  );
  const shouldReduceMotion = useReducedMotion();

  const current =
    journeys.find((j) => j.id === activePathway) || journeys[0];

  const stats = current ? calculateJourneyStats(current.id) : null;
  const currentChapters = current ? getJourneyChapters(current.id) : [];

  const getAccentBadgeVariant = (accent?: string): BadgeVariant => {
    if (accent === "emerald") return "emerald";
    if (accent === "gold") return "gold";
    if (accent === "silver") return "silver";
    return "emerald";
  };

  return (
    <section
      id="pathways"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <SectionHeader
            category="Viewing Architectures"
            title="Curated Pathways"
            description="Choose your strategy. The archive offers tailored chronological routes depending on your available time and depth of lore desired."
            align="left"
            className="mb-0"
          />

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SELECT TRACK TO INSPECT DETAILS</span>
          </div>
        </div>

        {/* Pathway Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {journeys.map((pathway) => {
            const isSelected = pathway.id === activePathway;
            const badgeVariant = getAccentBadgeVariant(pathway.accent);

            return (
              <button
                key={pathway.id}
                type="button"
                onClick={() => setActivePathway(pathway.id)}
                className={`text-left p-5 rounded-lg border transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isSelected
                    ? "bg-surface-2 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)]"
                    : "bg-surface-1/60 border-white/5 hover:border-white/15 hover:bg-surface-2/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={isSelected ? badgeVariant : "subtle"} size="sm">
                    {pathway.status}
                  </Badge>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
                <h3 className="text-base font-bold uppercase tracking-wider text-slate-100">
                  {pathway.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  {pathway.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Pathway Deep View */}
        {current && (
          <motion.div
            key={current.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
            className="rounded-xl border border-white/10 bg-surface-2/40 p-6 sm:p-10 backdrop-blur-sm shadow-card-cinematic"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <Badge
                    variant={getAccentBadgeVariant(current.accent)}
                    size="sm"
                    className="mb-2"
                  >
                    Path Profile
                  </Badge>
                  <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-slate-100 mt-1">
                    {current.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 font-light mt-3 leading-relaxed">
                    {current.focus}
                  </p>
                </div>

                {/* Journey Engine Metric Strip */}
                {stats && (
                  <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-surface-1/80 border border-white/5 font-mono text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                        Estimated Runtime
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-200 mt-0.5 block">
                        {stats.formattedRuntime}
                      </span>
                    </div>
                    <div className="border-x border-white/5">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                        Total Entries
                      </span>
                      <span className="text-sm sm:text-base font-bold text-emerald-400 mt-0.5 block">
                        {stats.totalCount} ({stats.essentialCount} Essential)
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                        Structure
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-200 mt-0.5 block">
                        {stats.chaptersCount} Chapters
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-surface-1/70 border border-white/5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    Recommended For
                  </span>
                  <p className="text-sm text-slate-300">{current.idealFor}</p>
                </div>

                {/* Chapters Breakdown */}
                {currentChapters.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-mono tracking-[0.2em] uppercase text-slate-400 block">
                      Narrative Chapters Sequence
                    </span>
                    <div className="space-y-2">
                      {currentChapters.map((ch, idx) => (
                        <div
                          key={ch.id}
                          className="flex items-center justify-between p-3 rounded bg-surface-1/50 border border-white/5 text-xs font-mono"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-emerald-400 font-bold">
                              0{idx + 1}
                            </span>
                            <span className="text-slate-200">{ch.title}</span>
                          </div>
                          <span className="text-slate-400">
                            {ch.movieIds.length} entries
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-mono tracking-[0.2em] uppercase text-slate-400 block mb-3">
                    Pivotal Milestones Covered
                  </span>

                  <ul className="space-y-3">
                    {(current.highlights || []).map((highlight, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-xs sm:text-sm text-slate-300"
                      >
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <Button
                      href={`/pathways/${current.id}`}
                      variant={
                        current.accent === "gold"
                          ? "gold"
                          : current.accent === "silver"
                            ? "secondary"
                            : "primary"
                      }
                      size="md"
                      className="w-full sm:w-auto"
                    >
                      Enter Pathway Dossier &rarr;
                    </Button>
                    <Button
                      href="/pathways"
                      variant="outline"
                      size="md"
                      className="w-full sm:w-auto"
                    >
                      Compare All Pathways
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-2 border-t border-white/5">
                    <span>SECTOR STATUS: READY FOR EXPLORATION</span>
                    <Badge
                      variant={getAccentBadgeVariant(current.accent)}
                      size="sm"
                    >
                      {stats?.totalCount || 0} CANONICAL ENTRIES
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
