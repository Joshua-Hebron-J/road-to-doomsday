"use client";

import { motion, useReducedMotion } from "motion/react";
import { HeroCanvas } from "./hero-canvas";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const transitionConfig = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.8, ease: "easeOut" as const };

  return (
    <section
      id="overview"
      className="relative min-h-[92vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-28 pb-20 overflow-hidden"
    >
      {/* 3D Multiverse Rift Centerpiece & Atmospheric Lighting */}
      <HeroCanvas />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Pre-title Tagline Badge */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitionConfig, delay: 0.1 }}
          className="mb-8"
        >
          <Badge variant="emerald" size="md" dot>
            Every story led here.
          </Badge>
        </motion.div>

        {/* Theatrical Main Title */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitionConfig, delay: 0.2 }}
          className="space-y-2 mb-6"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.14em] sm:tracking-[0.18em] uppercase leading-none select-none">
            <span className="text-gradient-silver block">THE ROAD TO</span>
            <span className="text-gradient-emerald block mt-1 drop-shadow-[0_4px_30px_rgba(16,185,129,0.3)]">
              DOOMSDAY
            </span>
          </h1>
        </motion.div>

        {/* Cinematic Narrative Premise */}
        <motion.p
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitionConfig, delay: 0.3 }}
          className="max-w-2xl text-base sm:text-lg text-slate-300 font-light leading-relaxed mb-10 text-balance drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]"
        >
          From the fracture of the Sacred Timeline to the inevitable collapse of
          parallel universes. Follow the essential journey through Marvel&apos;s
          cinematic history leading to the rise of Victor Von Doom.
        </motion.p>

        {/* Action Group CTAs */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitionConfig, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          {/* Primary CTA */}
          <Button
            href="/pathways"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            icon={
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
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            }
          >
            Begin Your Journey
          </Button>

          {/* Secondary CTA */}
          <Button
            href="#chronology"
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            Explore the Timeline
          </Button>
        </motion.div>

        {/* Narrative Anchor Markers */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transitionConfig, delay: 0.55 }}
          className="mt-16 pt-10 border-t border-white/5 w-full grid grid-cols-1 sm:grid-cols-3 gap-6 text-left"
        >
          <div className="flex items-start gap-3">
            <span className="font-mono text-xs text-emerald-400 font-bold">
              01
            </span>
            <div>
              <h2 className="text-xs uppercase tracking-[0.18em] font-semibold text-slate-200">
                The Sacred Collapse
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                The dissolution of He Who Remains&apos; timeline integrity.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="font-mono text-xs text-emerald-400 font-bold">
              02
            </span>
            <div>
              <h2 className="text-xs uppercase tracking-[0.18em] font-semibold text-slate-200">
                Multiverse Incursions
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Realities colliding across overlapping quantum boundaries.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="font-mono text-xs text-emerald-400 font-bold">
              03
            </span>
            <div>
              <h2 className="text-xs uppercase tracking-[0.18em] font-semibold text-slate-200">
                The Sovereign Ascent
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                When heroes falter, a monarch shall build Battleworld.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subtle Scroll Cue */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="mt-12 flex flex-col items-center gap-2 text-slate-500 select-none"
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono">
          Scroll to explore
        </span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-emerald-500/60 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
