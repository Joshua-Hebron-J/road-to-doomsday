"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Badge } from "./ui/badge";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Monogram & Title */}
        <Link
          href="/"
          className="flex items-center gap-3.5 group transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:rounded-sm"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded border border-emerald-500/30 bg-emerald-950/20 group-hover:border-emerald-500/60 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="sr-only">Home</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-[0.22em] text-slate-100 uppercase">
              The Road to Doomsday
            </span>
            <span className="text-[10px] tracking-[0.18em] text-emerald-500/80 font-mono uppercase">
              Unofficial Fan Archive
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-8 text-xs font-medium tracking-[0.16em] uppercase text-slate-300"
          aria-label="Main Navigation"
        >
          <Link
            href="/#overview"
            className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:rounded-sm"
          >
            Overview
          </Link>
          <Link
            href="/#pillars"
            className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:rounded-sm"
          >
            Pillars of Doom
          </Link>
          <Link
            href="/pathways"
            className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:rounded-sm"
          >
            Pathways
          </Link>
          <Link
            href="/#chronology"
            className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:rounded-sm"
          >
            Timeline Preview
          </Link>
        </nav>

        {/* Right Status Badge */}
        <div className="hidden sm:flex items-center gap-4">
          <Badge variant="emerald" size="md" dot pulse>
            Incursion Timeline: Active
          </Badge>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center p-2 rounded border border-white/10 text-slate-400 hover:text-white hover:border-emerald-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="md:hidden border-b border-white/10 bg-surface-1/95 backdrop-blur-xl px-6 py-6 space-y-4"
        >
          <div className="flex flex-col space-y-3 text-xs uppercase tracking-[0.18em] font-medium text-slate-300">
            <Link
              href="/#overview"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-emerald-400 transition-colors border-b border-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              Overview
            </Link>
            <Link
              href="/#pillars"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-emerald-400 transition-colors border-b border-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              Pillars of Doom
            </Link>
            <Link
              href="/pathways"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-emerald-400 transition-colors border-b border-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              Pathways
            </Link>
            <Link
              href="/#chronology"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-emerald-400 transition-colors border-b border-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              Timeline Preview
            </Link>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-emerald-400 border-t border-white/5">
            <span>INCURSION TIMELINE: ACTIVE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
        </motion.div>
      )}
    </header>
  );
}
