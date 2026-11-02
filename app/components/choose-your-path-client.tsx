"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { journeys } from "../data/journeys";
import { calculateJourneyStats, getJourneyChapters } from "../lib/journey";
import { Badge, BadgeVariant } from "./ui/badge";
import { Button } from "./ui/button";
import { Journey } from "../types/journey";
import { useWatchProgress } from "../hooks/use-watch-progress";

function PathwayProgressBadge({ journeyId }: { journeyId: string }) {
  const { progress, isLoaded } = useWatchProgress(journeyId);
  if (!isLoaded || progress.completedCount === 0) return null;

  return (
    <Badge
      variant={progress.isComplete ? "emerald" : "gold"}
      size="sm"
      dot={!progress.isComplete}
      pulse={!progress.isComplete}
    >
      {progress.isComplete
        ? "100% Completed"
        : `${progress.progressPercentage}% (${progress.completedCount}/${progress.totalCount})`}
    </Badge>
  );
}

export function ChooseYourPathClient() {
  const [viewMode, setViewMode] = useState<"dossiers" | "matrix">("dossiers");
  const [filterPreference, setFilterPreference] = useState<string>("all");
  const shouldReduceMotion = useReducedMotion();

  // Precompute stats for all journeys
  const journeyData = journeys.map((journey) => {
    const stats = calculateJourneyStats(journey.id);
    const chapters = getJourneyChapters(journey.id);
    return {
      journey,
      stats,
      chapters,
    };
  });

  // Editorial dossier theme mapping
  const getDossierTheme = (journey: Journey) => {
    switch (journey.id) {
      case "the-doom-essential":
        return {
          themeKey: "emerald",
          codeName: "ALPHA DIRECTIVE // RECON-01",
          classification: "LATVERIAN SOVEREIGN DIRECTIVE",
          badgeVariant: "emerald" as BadgeVariant,
          headerAccent: "border-emerald-500/40 bg-emerald-950/20",
          glowBorder: "hover:border-emerald-500/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]",
          titleGradient: "text-gradient-emerald",
          quote:
            "“Order must be forged from chaos. The failure of Stark's defenders demands sovereign intervention.”",
          authority: "Latverian Archival Seal &bull; Latveria 45.8150° N",
          timePacing: "Direct Sprint",
          complexity: "Streamlined / High-Impact",
          priorityColor: "text-emerald-400",
          accentColor: "emerald",
          icon: (
            <svg
              className="w-5 h-5 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          ),
        };
      case "the-incursion-nexus":
        return {
          themeKey: "silver",
          codeName: "CASEFILE: TVA-NEXUS-084",
          classification: "TEMPORAL VARIANCE ARCHIVE",
          badgeVariant: "silver" as BadgeVariant,
          headerAccent: "border-slate-500/40 bg-slate-900/40",
          glowBorder: "hover:border-slate-400/60 hover:shadow-[0_0_40px_rgba(148,163,184,0.18)]",
          titleGradient: "text-gradient-silver",
          quote:
            "“When two universes collide, both are destroyed unless one is annihilated. The physics cannot be bargained with.”",
          authority: "TVA Temporal Loom Sector &bull; End of Time",
          timePacing: "Calculated Investigation",
          complexity: "Quantum Multiverse Mechanics",
          priorityColor: "text-slate-300",
          accentColor: "silver",
          icon: (
            <svg
              className="w-5 h-5 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      case "the-full-multiverse-chronicle":
      default:
        return {
          themeKey: "gold",
          codeName: "CHRONICLE: OMNIVERSE-TOTALITY",
          classification: "THE WATCHER'S CELESTIAL CODEX",
          badgeVariant: "gold" as BadgeVariant,
          headerAccent: "border-amber-500/40 bg-amber-950/20",
          glowBorder: "hover:border-amber-500/60 hover:shadow-[0_0_40px_rgba(197,155,39,0.22)]",
          titleGradient: "text-gradient-gold",
          quote:
            "“Observe every reality, every post-credits omen, and every variant. The whole tapestry tells the coming doom.”",
          authority: "Omniverse Observation Nexus &bull; Level Omega",
          timePacing: "Definitive Epic Marathon",
          complexity: "Comprehensive Saga Continuum",
          priorityColor: "text-amber-400",
          accentColor: "gold",
          icon: (
            <svg
              className="w-5 h-5 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          ),
        };
    }
  };

  const filteredJourneys = journeyData.filter((item) => {
    if (filterPreference === "all") return true;
    if (filterPreference === "fast") return item.journey.id === "the-doom-essential";
    if (filterPreference === "multiverse") return item.journey.id === "the-incursion-nexus";
    if (filterPreference === "complete") return item.journey.id === "the-full-multiverse-chronicle";
    return true;
  });

  return (
    <div className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Link
            href="/"
            className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            Sanctuary Home
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200 uppercase tracking-wider font-semibold">
            Choose Your Path
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="emerald" size="sm" dot pulse>
            Phase 4: Active Milestone
          </Badge>
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            3 ARCHIVAL PATHS READY
          </span>
        </div>
      </div>

      {/* Main Dossier Header Briefing */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <Badge variant="emerald" size="md" className="mb-2">
          Tactical Archival Protocol
        </Badge>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-[0.14em] text-slate-100">
          CHOOSE YOUR <span className="text-gradient-emerald">PATH</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed text-balance">
          Three calibrated viewing trajectories. Whether you have 24 hours for
          the essential core, wish to dissect multiversal physics, or demand the
          entire saga tapestry—every path converges upon the sovereign throne of
          Victor Von Doom.
        </p>

        {/* Quick Stats Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 font-mono text-center">
          <div className="p-3 rounded-lg bg-surface-1/70 border border-white/5">
            <span className="text-[10px] uppercase text-slate-500 block tracking-wider">
              Pathways
            </span>
            <span className="text-lg font-bold text-slate-200 mt-0.5 block">
              3 Calibrated
            </span>
          </div>
          <div className="p-3 rounded-lg bg-surface-1/70 border border-white/5">
            <span className="text-[10px] uppercase text-slate-500 block tracking-wider">
              Curated Pool
            </span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5 block">
              18 Releases
            </span>
          </div>
          <div className="p-3 rounded-lg bg-surface-1/70 border border-white/5">
            <span className="text-[10px] uppercase text-slate-500 block tracking-wider">
              Runtime Spectrum
            </span>
            <span className="text-lg font-bold text-slate-200 mt-0.5 block">
              24h &ndash; 48h
            </span>
          </div>
          <div className="p-3 rounded-lg bg-surface-1/70 border border-white/5">
            <span className="text-[10px] uppercase text-slate-500 block tracking-wider">
              Destination
            </span>
            <span className="text-lg font-bold text-amber-400 mt-0.5 block">
              Doomsday
            </span>
          </div>
        </div>
      </div>

      {/* Filter / Preference & View Toggle Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 p-4 rounded-xl bg-surface-1/60 border border-white/5">
        {/* Recommendation Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-mono uppercase text-slate-400 mr-2 shrink-0">
            Strategy Profile:
          </span>
          <button
            type="button"
            onClick={() => setFilterPreference("all")}
            className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer focus-ring-doom ${
              filterPreference === "all"
                ? "bg-surface-3 text-slate-100 border border-emerald-500/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            All Tracks (3)
          </button>
          <button
            type="button"
            onClick={() => setFilterPreference("fast")}
            className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer focus-ring-doom ${
              filterPreference === "fast"
                ? "bg-surface-3 text-emerald-400 border border-emerald-500/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            Express (24h)
          </button>
          <button
            type="button"
            onClick={() => setFilterPreference("multiverse")}
            className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer focus-ring-doom ${
              filterPreference === "multiverse"
                ? "bg-surface-3 text-slate-200 border border-slate-400/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            TVA / Incursions
          </button>
          <button
            type="button"
            onClick={() => setFilterPreference("complete")}
            className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer focus-ring-doom ${
              filterPreference === "complete"
                ? "bg-surface-3 text-amber-300 border border-amber-500/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            Full Saga (48h)
          </button>
        </div>

        {/* View Layout Mode (Dossier Cards vs Matrix) */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 w-full md:w-auto justify-end">
          <span className="text-[11px] uppercase text-slate-500">Format:</span>
          <button
            type="button"
            onClick={() => setViewMode("dossiers")}
            className={`px-3 py-1 rounded text-xs uppercase tracking-wider transition-colors cursor-pointer focus-ring-doom ${
              viewMode === "dossiers"
                ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
            aria-pressed={viewMode === "dossiers"}
          >
            Dossier View
          </button>
          <button
            type="button"
            onClick={() => setViewMode("matrix")}
            className={`px-3 py-1 rounded text-xs uppercase tracking-wider transition-colors cursor-pointer focus-ring-doom ${
              viewMode === "matrix"
                ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
            aria-pressed={viewMode === "matrix"}
          >
            Comparison Matrix
          </button>
        </div>
      </div>

      {/* DOSSIER CARDS VIEW */}
      {viewMode === "dossiers" && (
        <div className="space-y-12">
          {filteredJourneys.map(({ journey, stats, chapters }, index) => {
            const theme = getDossierTheme(journey);

            return (
              <motion.article
                key={journey.id}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: index * 0.1 }}
                className={`relative rounded-2xl bg-surface-2/40 border border-white/10 p-6 sm:p-10 backdrop-blur-md transition-all duration-300 shadow-card-cinematic ${theme.glowBorder}`}
              >
                {/* Dossier Header Strip */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-lg border ${theme.headerAccent}`}
                    >
                      {theme.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                          {theme.codeName}
                        </span>
                        <span className="text-slate-600">&bull;</span>
                        <Badge variant={theme.badgeVariant} size="sm">
                          {journey.status}
                        </Badge>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-slate-100 mt-1">
                        {journey.title}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <PathwayProgressBadge journeyId={journey.id} />
                    <Badge variant="subtle" size="md">
                      Pacing: {theme.timePacing}
                    </Badge>
                    <Button
                      href={`/pathways/${journey.id}`}
                      variant={
                        theme.accentColor === "gold"
                          ? "gold"
                          : theme.accentColor === "silver"
                            ? "secondary"
                            : "primary"
                      }
                      size="md"
                    >
                      Select Path &rarr;
                    </Button>
                  </div>
                </div>

                {/* Dossier Body: 2 Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
                  {/* Left Column: Editorial Profile, Focus, and Audience */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Thematic Quote */}
                    <blockquote className="p-4 rounded-lg bg-surface-1/60 border-l-2 border-emerald-500 text-sm italic font-serif text-slate-300 leading-relaxed">
                      {theme.quote}
                    </blockquote>

                    {/* Narrative Description & Focus */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400">
                        Narrative Architecture & Focus
                      </h3>
                      <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed">
                        {journey.description}
                      </p>
                      <div className="p-4 rounded-lg bg-surface-1/40 border border-white/5 text-xs text-slate-300">
                        <strong className="text-slate-100 uppercase tracking-wider block mb-1 font-mono text-[11px]">
                          Specific Narrative Core:
                        </strong>
                        {journey.focus}
                      </div>
                    </div>

                    {/* Intended Audience Profile */}
                    <div className="p-5 rounded-xl bg-surface-1/70 border border-white/10 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-200 font-bold">
                          Intended Audience Profile
                        </h4>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed font-light">
                        {journey.idealFor}
                      </p>
                      <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-surface-2 border border-white/5">
                          Complexity: {theme.complexity}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-surface-2 border border-white/5">
                          Prerequisites: Streamlined
                        </span>
                      </div>
                    </div>

                    {/* Chapters Sequence Preview */}
                    <div className="space-y-3 pt-2">
                      <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 block">
                        Narrative Chapter Progression ({chapters.length} Chapters)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {chapters.map((ch, idx) => (
                          <div
                            key={ch.id}
                            className="p-3 rounded-lg bg-surface-1/50 border border-white/5 text-xs space-y-1"
                          >
                            <span className="text-emerald-400 font-mono text-[11px] font-bold block">
                              CH. 0{idx + 1}
                            </span>
                            <span className="text-slate-200 font-medium block truncate">
                              {ch.title}
                            </span>
                            <span className="text-slate-500 font-mono text-[10px] block">
                              {ch.movieIds.length} Canonical Entries
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Quantitative Scope, Runtime & Milestones */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Runtime & Scope Metric Card */}
                    <div className="p-6 rounded-xl bg-surface-1/90 border border-white/10 space-y-4 font-mono">
                      <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs text-slate-400 uppercase tracking-wider">
                        <span>Mission Parameters</span>
                        <span className="text-emerald-400">{theme.codeName}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 rounded bg-surface-2/60 border border-white/5">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                            Estimated Runtime
                          </span>
                          <span className="text-xl font-bold text-slate-100 mt-1 block">
                            {stats.formattedRuntime}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {stats.totalRuntimeMinutes} minutes
                          </span>
                        </div>

                        <div className="p-3 rounded bg-surface-2/60 border border-white/5">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                            Total Scope
                          </span>
                          <span className="text-xl font-bold text-emerald-400 mt-1 block">
                            {stats.totalCount} Entries
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {stats.essentialCount} Essential &bull; {stats.optionalCount} Lore
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-400 space-y-2 pt-2 border-t border-white/5">
                        <div className="flex justify-between">
                          <span>Theatrical Feature Films:</span>
                          <span className="text-slate-200 font-semibold">{stats.movieCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Disney+ Limited Series:</span>
                          <span className="text-slate-200 font-semibold">{stats.seriesCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Special Presentations / Events:</span>
                          <span className="text-slate-200 font-semibold">{stats.specialCount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pivotal Milestones Covered */}
                    <div className="p-6 rounded-xl bg-surface-1/50 border border-white/5 space-y-3">
                      <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-300 font-bold">
                        Pivotal Lore Milestones Covered
                      </h4>
                      <ul className="space-y-2.5">
                        {(journey.highlights || []).map((highlight, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 text-xs text-slate-300 leading-normal"
                          >
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Block */}
                    <div className="pt-2">
                      <Button
                        href={`/pathways/${journey.id}`}
                        variant={
                          theme.accentColor === "gold"
                            ? "gold"
                            : theme.accentColor === "silver"
                              ? "secondary"
                              : "primary"
                        }
                        size="lg"
                        fullWidth
                      >
                        Enter {journey.title} Dossier &rarr;
                      </Button>
                      <span className="block text-center text-[11px] font-mono text-slate-500 mt-2">
                        Navigates to dedicated trajectory route: /pathways/{journey.id}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {/* COMPARISON MATRIX VIEW */}
      {viewMode === "matrix" && (
        <div className="rounded-2xl bg-surface-2/40 border border-white/10 p-6 sm:p-8 backdrop-blur-md overflow-x-auto shadow-card-cinematic">
          <div className="mb-6 space-y-1">
            <h2 className="text-xl font-bold uppercase tracking-wider text-slate-100">
              Comparative Archival Matrix
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Cross-examination of audience profiles, time investments, and narrative scope.
            </p>
          </div>

          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10 text-xs font-mono uppercase tracking-wider text-slate-400">
                <th className="py-4 px-4">Evaluation Criteria</th>
                {journeyData.map(({ journey }) => (
                  <th key={journey.id} className="py-4 px-4 text-slate-200">
                    {journey.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              <tr>
                <td className="py-4 px-4 font-mono text-slate-400 uppercase">
                  Target Audience
                </td>
                {journeyData.map(({ journey }) => (
                  <td key={journey.id} className="py-4 px-4 text-slate-300 leading-relaxed">
                    {journey.idealFor}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-4 px-4 font-mono text-slate-400 uppercase">
                  Total Runtime
                </td>
                {journeyData.map(({ journey, stats }) => (
                  <td key={journey.id} className="py-4 px-4 font-mono font-bold text-slate-100">
                    {stats.formattedRuntime}
                    <span className="block text-[10px] font-normal text-slate-500">
                      ({stats.totalRuntimeMinutes} minutes)
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-4 px-4 font-mono text-slate-400 uppercase">
                  Entry Count & Scope
                </td>
                {journeyData.map(({ journey, stats }) => (
                  <td key={journey.id} className="py-4 px-4 font-mono text-emerald-400">
                    {stats.totalCount} Total
                    <span className="block text-[10px] text-slate-400">
                      {stats.essentialCount} Essential &bull; {stats.optionalCount} Lore
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-4 px-4 font-mono text-slate-400 uppercase">
                  Chapters
                </td>
                {journeyData.map(({ journey, chapters }) => (
                  <td key={journey.id} className="py-4 px-4 font-mono text-slate-300">
                    {chapters.length} Narrative Chapters
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-4 px-4 font-mono text-slate-400 uppercase">
                  Narrative Focus
                </td>
                {journeyData.map(({ journey }) => (
                  <td key={journey.id} className="py-4 px-4 text-slate-300 leading-relaxed">
                    {journey.focus}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-4 px-4 font-mono text-slate-400 uppercase">
                  Stark to Doom Continuity
                </td>
                {journeyData.map(({ journey }) => {
                  const level =
                    journey.id === "the-doom-essential"
                      ? "Direct & Dominant"
                      : journey.id === "the-incursion-nexus"
                        ? "Secondary (TVA Focus)"
                        : "Holistic Continuum";
                  return (
                    <td key={journey.id} className="py-4 px-4 font-mono text-slate-200">
                      {level}
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="py-4 px-4 font-mono text-slate-400 uppercase">
                  Action
                </td>
                {journeyData.map(({ journey }) => (
                  <td key={journey.id} className="py-4 px-4">
                    <Button
                      href={`/pathways/${journey.id}`}
                      variant={
                        journey.accent === "gold"
                          ? "gold"
                          : journey.accent === "silver"
                            ? "secondary"
                            : "primary"
                      }
                      size="sm"
                    >
                      Select &rarr;
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Thematic Strategy Consultation Box */}
      <div className="mt-16 p-8 rounded-2xl bg-surface-1/70 border border-white/5 text-center max-w-3xl mx-auto space-y-4">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400 block">
          Strategic Viewing Counsel
        </span>
        <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-slate-100">
          Unsure Which Path to Begin?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-xl mx-auto">
          If your priority is understanding how Tony Stark&apos;s legacy transforms into
          Victor Von Doom before release day, choose{" "}
          <strong className="text-emerald-400 font-semibold">The Doom Essential</strong>.
          If you want to master the physics of dimensional incursions and the TVA, choose{" "}
          <strong className="text-slate-200 font-semibold">The Incursion & TVA Nexus</strong>.
          For the definitive chronicle of every battle and post-credit stinger, commit to{" "}
          <strong className="text-amber-400 font-semibold">The Full Multiverse Chronicle</strong>.
        </p>

        <div className="pt-2">
          <Link
            href="/pathways/the-doom-essential"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors focus-ring-doom"
          >
            <span>Proceed with the Primary Curated Pathway</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
