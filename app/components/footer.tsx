"use client";

import Link from "next/link";
import { Badge } from "./ui/badge";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/5 bg-surface-0 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Tier: Monogram & Navigation Quick Links */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded border border-emerald-500/40 bg-emerald-950/30 text-emerald-400 font-mono text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              RD
            </div>
            <div>
              <span className="font-bold tracking-[0.2em] text-slate-200 uppercase block">
                The Road to Doomsday
              </span>
              <div className="mt-0.5">
                <Badge variant="emerald" size="sm">
                  Phase 4: Choose Your Path // Active
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-[11px] uppercase tracking-wider text-slate-400">
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
              Pillars
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
              Chronology
            </Link>
            <button
              type="button"
              onClick={scrollToTop}
              className="text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:rounded-sm"
            >
              Back to Top &uarr;
            </button>
          </div>
        </div>

        {/* Middle Tier: Legal & Non-Affiliation Fan Disclaimer */}
        <div className="p-6 rounded-lg bg-surface-1/50 border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px] tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Fan Project & Trademark Notice</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed font-light">
            <strong>The Road to Doomsday</strong> is an independent, non-commercial fan-created tribute and research archive designed for Marvel enthusiasts. This site is not affiliated with, endorsed by, sponsored by, or in any way associated with Marvel Studios, The Walt Disney Company, or any of their subsidiaries.
          </p>
          <p className="text-slate-500 text-[11px] leading-relaxed font-light">
            Marvel, Avengers, Doctor Doom, Fantastic Four, and all related characters, titles, logos, and story marks are registered trademarks and copyrights of Marvel Characters, Inc. and The Walt Disney Company. No copyright infringement is intended. All original commentary and architectural compilation remain under fair fan use.
          </p>
        </div>

        {/* Bottom Tier: Copyright & Colophon */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
          <div>
            <span>COMMUNITY FAN PROJECT &bull; BUILT WITH NEXT.JS &bull; 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">COORDINATE: EARTH-616 // EARTH-199999</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
