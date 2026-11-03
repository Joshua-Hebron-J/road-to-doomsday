'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ChapterAtlas } from './chapter-atlas';
import { motion, useReducedMotion } from 'motion/react';
import { Journey } from '../types/journey';
import { Chapter } from '../types/chapter';
import { Badge, BadgeVariant } from './ui/badge';
import { Button } from './ui/button';
import { useWatchProgress } from '../hooks/use-watch-progress';
import { getAllJourneys, getChapterMovies, getMovieById } from '../lib/journey';

const MovieDossier = dynamic(() => import('./movie-dossier'));
const PrerequisiteLineage = dynamic(() => import('./prerequisite-lineage'), {
  loading: () => (
    <p role="status" className="p-5 text-slate-300">
      Opening story prerequisite graph…
    </p>
  ),
});

interface JourneyEngineViewProps {
  journey: Journey;
  chapters: Chapter[];
}

export function JourneyEngineView({
  journey,
  chapters,
}: JourneyEngineViewProps) {
  const allJourneys = getAllJourneys();
  const [showLineage, setShowLineage] = useState(false);
  const [dossierId, setDossierId] = useState<string | null>(null);
  const dossierTrigger = useRef<HTMLElement | null>(null);
  function openDossier(id: string) {
    dossierTrigger.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setDossierId(id);
  }
  function closeDossier() {
    setDossierId(null);
    if (dossierTrigger.current?.isConnected)
      dossierTrigger.current.focus({ preventScroll: true });
    else
      document
        .getElementById(`${chapters[0]?.id}-trigger`)
        ?.focus({ preventScroll: true });
  }
  const [spoilerShield, setSpoilerShield] = useState(true);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [openChapters, setOpenChapters] = useState<string[]>(
    [chapters[0]?.id].filter(Boolean),
  );
  const dialogRef = useRef<HTMLDialogElement>(null);
  const canReveal = (id: string) =>
    !spoilerShield || isWatched(id) || revealedIds.includes(id);
  const shouldReduceMotion = useReducedMotion();
  const [showResetModal, setShowResetModal] = useState(false);
  const resetTriggerRef = useRef<HTMLButtonElement | null>(null);
  const modalCancelRef = useRef<HTMLButtonElement | null>(null);

  const {
    isLoaded,
    isWatched,
    toggleWatched,
    markWatched,
    markAllWatched,
    resetProgress,
    progress,
    nextMovie,
    storageError,
  } = useWatchProgress(journey.id);

  useEffect(() => {
    if (showResetModal) {
      dialogRef.current?.showModal();
      modalCancelRef.current?.focus();
    } else {
      dialogRef.current?.close();
    }
  }, [showResetModal]);

  function openChapter(chapterId: string) {
    setOpenChapters((ids) =>
      ids.includes(chapterId) ? ids : [...ids, chapterId],
    );
    const trigger = document.getElementById(`${chapterId}-trigger`);
    trigger?.focus({ preventScroll: true });
    trigger?.scrollIntoView({
      behavior: shouldReduceMotion ? 'instant' : 'smooth',
      block: 'start',
    });
  }
  function openMovieChapter(movieId: string) {
    const chapter = chapters.find((item) => item.movieIds.includes(movieId));
    if (chapter) openChapter(chapter.id);
  }

  function closeResetDialog(reset = false) {
    dialogRef.current?.close();
    setShowResetModal(false);
    if (reset) document.getElementById(`${chapters[0]?.id}-trigger`)?.focus();
    else resetTriggerRef.current?.focus();
  }

  // Theme styling based on journey
  const getThemeDetails = () => {
    switch (journey.id) {
      case 'the-doom-essential':
        return {
          badgeVariant: 'emerald' as BadgeVariant,
          quote:
            "“Order must be forged from chaos. The failure of Stark's defenders demands sovereign intervention.”",
          codename: 'ALPHA DIRECTIVE // RECON-01',
          borderGlow:
            'border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.15)]',
          progressBarGradient: 'from-emerald-600 via-emerald-400 to-teal-300',
          accentColor: 'emerald',
        };
      case 'the-incursion-nexus':
        return {
          badgeVariant: 'silver' as BadgeVariant,
          quote:
            '“When two universes collide, both are destroyed unless one is annihilated. The physics cannot be bargained with.”',
          codename: 'CASEFILE: TVA-NEXUS-084',
          borderGlow:
            'border-slate-500/40 shadow-[0_0_35px_rgba(148,163,184,0.12)]',
          progressBarGradient: 'from-slate-500 via-slate-300 to-amber-400',
          accentColor: 'silver',
        };
      case 'the-full-multiverse-chronicle':
      default:
        return {
          badgeVariant: 'gold' as BadgeVariant,
          quote:
            '“Observe every reality, every post-credits omen, and every variant. The whole tapestry tells the coming doom.”',
          codename: 'CHRONICLE: OMNIVERSE-TOTALITY',
          borderGlow:
            'border-amber-500/40 shadow-[0_0_35px_rgba(197,155,39,0.18)]',
          progressBarGradient: 'from-amber-600 via-amber-400 to-yellow-200',
          accentColor: 'gold',
        };
    }
  };

  const theme = getThemeDetails();

  return (
    <div className="space-y-12" aria-busy={!isLoaded}>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-surface-1 p-4">
        <p id="spoiler-help" className="text-sm text-slate-300">
          {spoilerShield
            ? 'Spoiler shield protects unwatched stories and chapter briefings.'
            : 'All narrative briefings are visible.'}
        </p>
        <button
          type="button"
          aria-pressed={spoilerShield}
          aria-describedby="spoiler-help"
          onClick={() => {
            setSpoilerShield((value) => !value);
            setRevealedIds([]);
          }}
          className="min-h-11 px-4 rounded border border-emerald-500/40 text-emerald-300 focus-ring-doom"
        >
          Spoiler shield: {spoilerShield ? 'On' : 'Off'}
        </button>
      </div>
      {/* Top Breadcrumb & Pathway Switcher Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-400"
        >
          <Link
            href="/"
            className="hover:text-emerald-400 transition-colors focus-ring-doom"
          >
            Sanctuary
          </Link>
          <span className="text-slate-600">/</span>
          <Link
            href="/pathways"
            className="hover:text-emerald-400 transition-colors focus-ring-doom"
          >
            Choose Your Path
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200 uppercase font-semibold">
            {journey.title}
          </span>
        </nav>

        <Link
          href="/pathways#progress-profile"
          className="inline-flex min-h-11 items-center text-sm text-emerald-200 underline focus-ring-doom"
        >
          Journey profile and backups
        </Link>

        {/* Sibling Pathway Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-mono uppercase text-slate-500 mr-1 hidden sm:inline">
            Switch Track:
          </span>
          {allJourneys.map((j) => {
            const isCurrent = j.id === journey.id;
            return (
              <Link
                key={j.id}
                href={`/pathways/${j.id}`}
                className={`px-3 py-1 rounded text-xs font-mono uppercase tracking-wider transition-colors shrink-0 focus-ring-doom ${
                  isCurrent
                    ? 'bg-surface-3 text-slate-100 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {j.title}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Storage Error Warning (if private mode / quota exceeded) */}
      {storageError && (
        <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-500/40 text-xs font-mono text-amber-300 flex items-center justify-between">
          <span>{storageError}</span>
          <Badge variant="gold" size="sm">
            Session Memory Active
          </Badge>
        </div>
      )}

      {/* Hero Dossier Banner */}
      <div
        className={`relative rounded-2xl bg-surface-2/40 border p-6 sm:p-10 backdrop-blur-md ${theme.borderGlow}`}
      >
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge variant={theme.badgeVariant} size="md">
            {theme.codename}
          </Badge>
          <Badge variant="subtle" size="md">
            {journey.status}
          </Badge>
          <Badge variant="emerald" size="sm" dot pulse>
            Journey Engine Active
          </Badge>
        </div>

        <div className="space-y-3 mb-6">
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wide text-slate-100">
            {journey.title}
          </h1>
          <p className="text-sm sm:text-base font-mono text-emerald-400 uppercase tracking-widest">
            {journey.tagline}
          </p>
        </div>

        <blockquote className="p-4 rounded-lg bg-surface-1/70 border-l-2 border-emerald-500 text-sm sm:text-base italic font-serif text-slate-300 mb-8 max-w-4xl">
          {!spoilerShield
            ? theme.quote
            : 'Every story led here. Follow your chosen pathway, one chapter at a time.'}
        </blockquote>

        {/* Narrative & Audience Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-xl bg-surface-1/60 border border-white/5 space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 block font-semibold">
              Strategic Narrative Trajectory
            </span>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              {!spoilerShield
                ? journey.description
                : 'A curated viewing journey toward Avengers: Doomsday. Narrative details unlock as you watch.'}
            </p>
            <p className="text-xs text-emerald-400/90 font-mono pt-1">
              Core Focus:{' '}
              {!spoilerShield ? journey.focus : 'Protected by spoiler shield'}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-1/60 border border-white/5 space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 block font-semibold">
              Recommended For / Intended Audience
            </span>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              {journey.idealFor}
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-surface-2 border border-white/5">
                Total Scope: {progress.totalCount} Canonical Entries
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-2 border border-white/5">
                Total Duration: {progress.formattedTotalRuntime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* REAL-TIME JOURNEY PROGRESS HUD */}
      <section
        aria-label="Journey Progress Monitor"
        className="rounded-2xl bg-surface-1/90 border border-white/10 p-6 sm:p-8 backdrop-blur-md shadow-card-cinematic space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 block font-bold">
                Live Watch Telemetry
              </span>
              <h2 className="text-xl font-bold uppercase tracking-wider text-slate-100">
                Pathway Progress HUD
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded font-mono text-xs uppercase tracking-wider border ${
                progress.isComplete
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                  : progress.completedCount > 0
                    ? 'bg-surface-2 text-amber-300 border-amber-500/30'
                    : 'bg-surface-2 text-slate-400 border-white/10'
              }`}
            >
              {progress.isComplete
                ? 'All Milestones Logged'
                : progress.completedCount > 0
                  ? 'Track In Progress'
                  : 'Track Uninitiated'}
            </span>

            {/* Reset Trigger Button */}
            {progress.completedCount > 0 && (
              <button
                ref={resetTriggerRef}
                type="button"
                onClick={() => setShowResetModal(true)}
                className="min-h-11 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider text-red-400/90 hover:text-red-300 border border-red-500/20 hover:border-red-500/50 bg-red-950/20 hover:bg-red-950/40 transition-colors cursor-pointer focus-ring-doom"
                aria-haspopup="dialog"
              >
                Reset Progress
              </button>
            )}
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline font-mono text-xs">
            <span className="text-slate-400">
              Completed:{' '}
              <strong className="text-emerald-400 font-bold">
                {progress.completedCount}
              </strong>{' '}
              of {progress.totalCount} entries
            </span>
            <span
              className="text-base font-bold text-slate-100"
              aria-live="polite"
            >
              {progress.progressPercentage}%
            </span>
          </div>

          <div
            className="w-full h-3 rounded-full bg-surface-3 overflow-hidden p-0.5 border border-white/5 relative"
            role="progressbar"
            aria-valuenow={progress.progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${journey.title} watch progress: ${progress.progressPercentage}%`}
          >
            <motion.div
              initial={false}
              animate={{ width: `${progress.progressPercentage}%` }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.5, ease: 'easeOut' }
              }
              className={`h-full rounded-full bg-gradient-to-r ${theme.progressBarGradient} shadow-[0_0_15px_rgba(16,185,129,0.5)]`}
            />
          </div>
        </div>

        {/* Dynamic Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-center">
          <div className="p-3 rounded-lg bg-surface-2/60 border border-white/5">
            <span className="text-[10px] uppercase text-slate-500 block tracking-wider">
              Remaining Watch Time
            </span>
            <span className="text-base sm:text-lg font-bold text-slate-100 mt-0.5 block">
              {progress.formattedRemainingRuntime}
            </span>
            <span className="text-[10px] text-slate-400 block">
              {progress.remainingRuntimeMinutes} mins left
            </span>
          </div>

          <div className="p-3 rounded-lg bg-surface-2/60 border border-white/5">
            <span className="text-[10px] uppercase text-slate-500 block tracking-wider">
              Time Watched
            </span>
            <span className="text-base sm:text-lg font-bold text-emerald-400 mt-0.5 block">
              {progress.formattedWatchedRuntime}
            </span>
            <span className="text-[10px] text-slate-400 block">
              {progress.watchedRuntimeMinutes} mins logged
            </span>
          </div>

          <div className="p-3 rounded-lg bg-surface-2/60 border border-white/5">
            <span className="text-[10px] uppercase text-slate-500 block tracking-wider">
              Essential Entries
            </span>
            <span className="text-base sm:text-lg font-bold text-slate-100 mt-0.5 block">
              {progress.essentialCompleted} / {progress.essentialTotal}
            </span>
            <span className="text-[10px] text-slate-400 block">
              Critical Core Thread
            </span>
          </div>

          <div className="p-3 rounded-lg bg-surface-2/60 border border-white/5">
            <span className="text-[10px] uppercase text-slate-500 block tracking-wider">
              Remaining Titles
            </span>
            <span className="text-base sm:text-lg font-bold text-amber-400 mt-0.5 block">
              {progress.remainingCount} Unwatched
            </span>
            <span className="text-[10px] text-slate-400 block">
              To Doomsday Horizon
            </span>
          </div>
        </div>

        {/* Quick Bulk Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-[11px] font-mono text-slate-400">
          <span>STORAGE: ISOLATED PER PATHWAY</span>
          {progress.completedCount < progress.totalCount ? (
            <button
              type="button"
              disabled={!isLoaded}
              onClick={markAllWatched}
              className="min-h-11 hover:text-emerald-400 transition-colors cursor-pointer underline underline-offset-4 focus-ring-doom"
            >
              Mark all {progress.totalCount} entries as watched
            </button>
          ) : (
            <span className="text-emerald-400 font-semibold">
              Track fully cleared
            </span>
          )}
        </div>
      </section>

      {/* HIGHLIGHTED NEXT UP TACTICAL RECOMMENDATION */}
      {nextMovie && (
        <section
          aria-label="Next Eligible Objective"
          className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-surface-2/80 to-surface-1/90 border border-emerald-500/50 p-6 sm:p-8 backdrop-blur-md shadow-[0_0_40px_rgba(16,185,129,0.15)] space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 font-bold">
                Next Recommended Objective
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="emerald" size="sm">
                Sequence Priority
              </Badge>
              <Badge variant="subtle" size="sm">
                {nextMovie.type.toUpperCase()} &bull; {nextMovie.runtime}m
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-slate-100">
                {nextMovie.title}{' '}
                <span className="text-slate-400 font-mono text-base font-normal">
                  ({nextMovie.year})
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                {canReveal(nextMovie.id)
                  ? nextMovie.description
                  : 'Unwatched objective. Mark it watched to unlock the narrative briefing.'}
              </p>
              <div className="p-3 rounded bg-surface-1/90 border border-emerald-500/20 text-xs text-slate-300 space-y-1">
                <strong className="text-emerald-400 uppercase tracking-wider block font-mono text-[10px]">
                  Why watch this now:
                </strong>
                <p className="font-light">
                  {canReveal(nextMovie.id)
                    ? nextMovie.whyItMatters
                    : 'Narrative significance protected by spoiler shield.'}
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 justify-center items-stretch lg:items-end">
              <PrerequisiteWarning
                movieId={nextMovie.id}
                journey={journey}
                isWatched={isWatched}
                onNavigate={openMovieChapter}
              />
              <Button
                disabled={!isLoaded}
                type="button"
                variant="primary"
                size="lg"
                onClick={() => markWatched(nextMovie.id)}
                icon={
                  <svg
                    className="w-4 h-4 text-emerald-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                }
                className="w-full sm:w-auto"
              >
                Mark As Watched
              </Button>
              <button
                type="button"
                onClick={() => openDossier(nextMovie.id)}
                aria-haspopup="dialog"
                className="min-h-11 text-sm text-emerald-300 underline focus-ring-doom"
              >
                Open movie dossier
              </button>
              <button
                type="button"
                onClick={() => openMovieChapter(nextMovie.id)}
                className="min-h-11 text-sm text-emerald-300 underline focus-ring-doom"
              >
                Open chapter queue
              </button>
              <span className="text-[11px] font-mono text-slate-400 text-center lg:text-right">
                Advances to next eligible sequence entry
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ALL COMPLETED BANNER */}
      {progress.isComplete && (
        <section
          aria-label="Journey Completed"
          className="rounded-2xl bg-gradient-to-r from-emerald-950/60 via-surface-2/90 to-amber-950/30 border border-emerald-500/50 p-8 text-center space-y-4 shadow-[0_0_50px_rgba(16,185,129,0.2)]"
        >
          <div className="flex justify-center">
            <Badge variant="emerald" size="lg" dot pulse>
              Pathway Mastered // 100% Complete
            </Badge>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-wider text-slate-100">
            Ascension Ready for Doomsday
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-light leading-relaxed">
            All {progress.totalCount} canonical milestones in{' '}
            <strong className="text-emerald-400">{journey.title}</strong> have
            been logged. Your strategic preparation for Victor Von Doom&apos;s
            arrival is complete on this track.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Button href="/pathways" variant="primary" size="md">
              Explore Alternative Tracks &rarr;
            </Button>
            <Button href="/#chronology" variant="secondary" size="md">
              View Macro Timeline
            </Button>
          </div>
        </section>
      )}

      <section id="prerequisite-lineage" className="scroll-mt-24 space-y-5">
        <div className="rounded-xl border border-violet-400/25 bg-gradient-to-r from-indigo-950/30 via-surface-1 to-surface-1 p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-300">
              Story connections
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mt-1">
              Prerequisite Lineage &amp; Dependency Graph
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Trace the stories that lead here, with your pathway progress in
              view.
            </p>
          </div>
          <button
            type="button"
            disabled={!isLoaded}
            aria-expanded={showLineage}
            aria-controls="story-prerequisite-content"
            onClick={() => setShowLineage((value) => !value)}
            className="min-h-11 px-4 rounded-lg border border-violet-400/40 text-sm text-violet-200 focus-ring-doom disabled:opacity-50"
          >
            {showLineage
              ? 'Close prerequisite graph'
              : 'Explore prerequisite lineage'}
          </button>
        </div>
        <div id="story-prerequisite-content" hidden={!showLineage}>
          {showLineage && (
            <PrerequisiteLineage
              journey={journey}
              isWatched={isWatched}
              isLoaded={isLoaded}
              onToggleWatched={toggleWatched}
              onOpenDossier={openDossier}
              suspended={dossierId !== null || showResetModal}
            />
          )}
        </div>
      </section>

      <ChapterAtlas
        journey={journey}
        chapters={chapters}
        spoilerShield={spoilerShield}
        isWatched={isWatched}
        isLoaded={isLoaded}
        onToggleWatched={toggleWatched}
        onOpenChapter={openChapter}
        onOpenDossier={openDossier}
        suspended={dossierId !== null || showResetModal}
      />

      {/* CHAPTER-BY-CHAPTER CHECKLIST ACCORDIONS */}
      <section aria-label="Narrative Chapters Checklist" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 block font-semibold">
              Interactive Checklist
            </span>
            <h2 className="text-2xl font-bold uppercase tracking-wider text-slate-100 mt-1">
              Narrative Chapters &amp; Milestone Entries
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            CLICK TO TOGGLE WATCHED STATUS
          </span>
        </div>

        <nav aria-label="Chapter navigation" className="flex flex-wrap gap-2">
          {chapters.map((chapter, index) => (
            <button
              type="button"
              key={chapter.id}
              onClick={() => openChapter(chapter.id)}
              className="min-h-11 px-4 rounded border border-white/10 bg-surface-2 text-sm text-emerald-300 focus-ring-doom"
            >
              Chapter {index + 1}
            </button>
          ))}
        </nav>
        <div className="space-y-8">
          {chapters.map((chapter, chapterIdx) => {
            const chapterMovies = getChapterMovies(chapter.id).filter((movie) =>
              journey.movieIds.includes(movie.id),
            );
            const expanded = openChapters.includes(chapter.id);
            const remainingRuntime = chapterMovies
              .filter((movie) => !isWatched(movie.id))
              .reduce((sum, movie) => sum + movie.runtime, 0);
            const chapterWatched = chapterMovies.filter((m) =>
              isWatched(m.id),
            ).length;
            const chapterComplete =
              chapterMovies.length > 0 &&
              chapterWatched === chapterMovies.length;

            return (
              <section
                key={chapter.id}
                className={`rounded-xl border p-4 sm:p-8 space-y-6 transition-colors ${
                  chapterComplete
                    ? 'bg-surface-1/60 border-emerald-500/25'
                    : 'bg-surface-1/40 border-white/5'
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={`${chapter.id}-trigger`}
                    aria-expanded={expanded}
                    aria-controls={`${chapter.id}-queue`}
                    onClick={() =>
                      setOpenChapters((ids) =>
                        expanded
                          ? ids.filter((id) => id !== chapter.id)
                          : [...ids, chapter.id],
                      )
                    }
                    className="scroll-mt-24 w-full min-h-11 text-left flex flex-wrap items-center justify-between gap-4 focus-ring-doom rounded-lg"
                  >
                    <span className="space-y-2 min-w-0">
                      <span className="block font-mono text-xs text-emerald-400">
                        CHAPTER 0{chapterIdx + 1} {'//'}{' '}
                        {chapterComplete
                          ? 'COMPLETE'
                          : `${chapterWatched} / ${chapterMovies.length} LOGGED`}
                      </span>
                      <span className="block text-lg sm:text-xl font-bold uppercase tracking-wide text-slate-100">
                        {!spoilerShield || chapterComplete
                          ? chapter.title
                          : `Chapter ${chapterIdx + 1}: Narrative briefing protected`}
                      </span>
                      <span className="block text-xs text-slate-400">
                        {remainingRuntime}m remaining · {chapterMovies.length}{' '}
                        entries
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-emerald-300 text-2xl"
                    >
                      {expanded ? '−' : '+'}
                    </span>
                  </button>
                </h3>
                <div
                  className="h-1 rounded bg-surface-3 overflow-hidden"
                  aria-label={`${chapterWatched} of ${chapterMovies.length} chapter entries watched`}
                >
                  <div
                    className="h-full bg-emerald-400 transition-[width]"
                    style={{
                      width: `${chapterMovies.length ? (chapterWatched / chapterMovies.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div
                  id={`${chapter.id}-queue`}
                  role="region"
                  aria-labelledby={`${chapter.id}-trigger`}
                  hidden={!expanded}
                >
                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
                      className="grid grid-cols-1 gap-4"
                    >
                      {(!spoilerShield || chapterComplete) && (
                        <p className="text-sm text-slate-300">
                          {chapter.description}
                        </p>
                      )}
                      {chapterMovies.map((movie, movieIdx) => {
                        const watched = isWatched(movie.id);
                        const isNext = nextMovie?.id === movie.id;

                        return (
                          <article
                            key={movie.id}
                            className={`group relative rounded-xl border p-4 sm:p-5 transition-all duration-200 ${
                              watched
                                ? 'bg-surface-1/90 border-emerald-500/40 opacity-90 shadow-[0_0_20px_rgba(16,185,129,0.06)]'
                                : isNext
                                  ? 'bg-surface-2/70 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.12)]'
                                  : 'bg-surface-2/40 border-white/5 hover:border-white/15'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              {/* Interactive Accessible Checkbox Button */}
                              <button
                                type="button"
                                role="checkbox"
                                aria-checked={watched}
                                aria-label={`Mark ${movie.title} as ${watched ? 'unwatched' : 'watched'}`}
                                disabled={!isLoaded}
                                onClick={() => toggleWatched(movie.id)}
                                className={`mt-1 shrink-0 w-11 h-11 rounded flex items-center justify-center transition-all cursor-pointer focus-ring-doom ${
                                  watched
                                    ? 'bg-emerald-500 text-black border border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                                    : 'border border-white/20 bg-surface-1 hover:border-emerald-400/80 hover:bg-emerald-950/30'
                                }`}
                              >
                                {watched && (
                                  <svg
                                    className="w-4 h-4 text-black stroke-[3]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </button>

                              {/* Entry Metadata & Lore */}
                              <div className="flex-1 min-w-0 space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div className="flex items-center gap-2.5 flex-wrap">
                                    <span className="font-mono text-xs text-slate-500 font-bold">
                                      #{movieIdx + 1}
                                    </span>
                                    <h4
                                      className={`text-base font-bold transition-colors ${
                                        watched
                                          ? 'text-slate-300'
                                          : 'text-slate-100'
                                      }`}
                                    >
                                      <button
                                        type="button"
                                        onClick={() => openDossier(movie.id)}
                                        aria-haspopup="dialog"
                                        aria-label={`Open dossier for ${movie.title}`}
                                        className="min-h-11 text-left hover:text-emerald-300 focus-ring-doom rounded"
                                      >
                                        {movie.title}
                                      </button>
                                    </h4>
                                    <span className="text-xs font-mono text-slate-400">
                                      ({movie.year})
                                    </span>

                                    {watched && (
                                      <Badge variant="emerald" size="sm">
                                        Watched
                                      </Badge>
                                    )}

                                    {isNext && !watched && (
                                      <Badge variant="gold" size="sm" pulse>
                                        Next Up
                                      </Badge>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge
                                      variant={
                                        movie.importance === 'essential'
                                          ? 'emerald'
                                          : 'subtle'
                                      }
                                      size="sm"
                                    >
                                      {movie.importance}
                                    </Badge>
                                    <Badge variant="subtle" size="sm">
                                      {movie.type.toUpperCase()} &bull;{' '}
                                      {movie.runtime}m
                                    </Badge>
                                    {movie.postCreditRequired && (
                                      <Badge variant="gold" size="sm">
                                        Post-Credits
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {/* Synopsis */}
                                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                                  {canReveal(movie.id)
                                    ? movie.description
                                    : 'Synopsis protected until watched.'}
                                </p>

                                {/* Why It Matters Lore Briefing */}
                                <div className="p-3 rounded bg-surface-1/80 border border-white/5 text-xs space-y-1">
                                  <span className="font-mono text-[10px] uppercase text-emerald-400 tracking-wider font-semibold block">
                                    Relevance to Avengers: Doomsday
                                  </span>
                                  <p className="text-slate-300 font-light leading-relaxed">
                                    {canReveal(movie.id)
                                      ? movie.whyItMatters
                                      : 'Narrative significance protected until watched.'}
                                  </p>
                                </div>

                                {spoilerShield && !watched && (
                                  <button
                                    type="button"
                                    aria-pressed={revealedIds.includes(
                                      movie.id,
                                    )}
                                    onClick={() =>
                                      setRevealedIds((ids) =>
                                        ids.includes(movie.id)
                                          ? ids.filter((id) => id !== movie.id)
                                          : [...ids, movie.id],
                                      )
                                    }
                                    className="min-h-11 text-xs text-emerald-300 underline focus-ring-doom"
                                  >
                                    {revealedIds.includes(movie.id)
                                      ? 'Hide spoilers'
                                      : 'Reveal spoilers'}{' '}
                                    for {movie.title}
                                  </button>
                                )}
                                <PrerequisiteWarning
                                  movieId={movie.id}
                                  journey={journey}
                                  isWatched={isWatched}
                                  onNavigate={openMovieChapter}
                                />
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      {dossierId && (
        <MovieDossier
          movieId={dossierId}
          journey={journey}
          spoilerShield={spoilerShield}
          onSelect={setDossierId}
          onClose={closeDossier}
        />
      )}

      {/* RESET CONFIRMATION MODAL */}
      {showResetModal && (
        <dialog
          ref={dialogRef}
          onCancel={(event) => {
            event.preventDefault();
            closeResetDialog();
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Tab') return;
            const buttons =
              dialogRef.current?.querySelectorAll<HTMLButtonElement>('button');
            if (!buttons?.length) return;
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }}
          aria-modal="true"
          aria-labelledby="reset-modal-title"
          className="fixed inset-0 m-auto z-50 w-[calc(100%-2rem)] max-w-md max-h-[90dvh] overflow-y-auto bg-transparent p-0 text-slate-100 backdrop:bg-black/80 backdrop:backdrop-blur-md"
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-surface-1 border border-red-500/40 p-6 sm:p-8 space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-400 font-mono text-xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span>Confirm Destructive Action</span>
            </div>

            <div className="space-y-2">
              <h3
                id="reset-modal-title"
                className="text-xl font-bold uppercase tracking-wide text-slate-100"
              >
                Reset {journey.title} Progress?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                This will uncheck all {progress.completedCount} watched entries
                and reset the completion telemetry for{' '}
                <strong className="text-slate-100 font-semibold">
                  {journey.title}
                </strong>
                . Other pathways will remain completely unaffected.
              </p>
            </div>

            <div className="p-3 rounded bg-surface-2 border border-white/5 font-mono text-xs text-slate-400 space-y-1">
              <div>
                TARGET: <span className="text-slate-200">{journey.id}</span>
              </div>
              <div>
                ENTRIES TO UNMARK:{' '}
                <span className="text-red-400 font-bold">
                  {progress.completedCount}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                ref={modalCancelRef}
                type="button"
                onClick={() => {
                  closeResetDialog();
                }}
                className="min-h-11 w-full sm:w-auto px-4 py-2 rounded text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white bg-surface-2 hover:bg-surface-3 border border-white/10 transition-colors cursor-pointer focus-ring-doom"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetProgress();
                  closeResetDialog(true);
                }}
                className="min-h-11 w-full sm:w-auto px-4 py-2 rounded text-xs font-mono uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 border border-red-400 transition-colors cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.4)] focus-ring-doom"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

function PrerequisiteWarning({
  movieId,
  journey,
  isWatched,
  onNavigate,
}: {
  movieId: string;
  journey: Journey;
  isWatched: (id: string) => boolean;
  onNavigate: (id: string) => void;
}) {
  const movie = getMovieById(movieId);
  const missing = movie?.prerequisites.filter((id) => !isWatched(id)) ?? [];
  if (!missing.length) return null;
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-200 space-y-2">
      <p>
        Recommended context still unwatched in this pathway. You can continue in
        any order.
      </p>
      <ul className="space-y-1">
        {missing.map((id) => {
          const prerequisite = getMovieById(id);
          const inJourney = journey.movieIds.includes(id);
          return (
            <li key={id}>
              {prerequisite?.title ?? id}
              {inJourney ? (
                <button
                  type="button"
                  onClick={() => onNavigate(id)}
                  className="min-h-11 ml-2 underline focus-ring-doom"
                >
                  Open prerequisite chapter
                </button>
              ) : (
                ' — outside this pathway; not counted toward completion'
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
