"use client";

import { motion, useReducedMotion } from "motion/react";
import { SectionHeader } from "./ui/section-header";
import { Card, CardHeader, CardTitle, CardSubtitle, CardDescription, CardFooter } from "./ui/card";
import { Badge, BadgeVariant } from "./ui/badge";

interface PillarItem {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  accent: "silver" | "emerald" | "gold";
  badgeVariant: BadgeVariant;
  badge: string;
}

const PILLARS: PillarItem[] = [
  {
    number: "I",
    title: "The Shattered Order",
    subtitle: "From Endgame to Infinite Branches",
    description:
      "The defeat of Thanos required altering the flow of quantum time. What saved half the universe simultaneously fractured the prime continuum, releasing boundless temporal anomalies that no single assembly of heroes can contain.",
    accent: "silver",
    badgeVariant: "silver",
    badge: "TEMPORAL NEXUS",
  },
  {
    number: "II",
    title: "Multiversal Incursions",
    subtitle: "The Collision of Dying Earths",
    description:
      "When the boundaries between dimensions decay, two universes occupy the exact same coordinate in space-time. The collision consumes both realities unless one Earth is annihilated before impact.",
    accent: "emerald",
    badgeVariant: "emerald",
    badge: "DIMENSIONAL COLLAPSE",
  },
  {
    number: "III",
    title: "The Sovereign Solution",
    subtitle: "The Rise of Victor Von Doom",
    description:
      "Where gods debate and heroes hesitate, the monarch of Latveria acts. Master of both cutting-edge technology and ancient mystic sorcery, Doom envisions salvation through absolute sovereignty: a unified Battleworld.",
    accent: "gold",
    badgeVariant: "gold",
    badge: "SOVEREIGN DESTINY",
  },
];

export function Pillars() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="pillars" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-surface-1/40">
      <div className="max-w-7xl mx-auto">
        {/* Standardized Section Header */}
        <SectionHeader
          category="Core Pillars"
          title="The Three Catalysts"
          description="The road to Avengers: Doomsday is not a simple linear sequence of battles. It is defined by three converging forces that push the multiverse to the brink."
        />

        {/* The 3 Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.number}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.6,
                delay: shouldReduceMotion ? 0 : index * 0.15,
                ease: "easeOut" as const,
              }}
              className="h-full"
            >
              <Card
                accent={pillar.accent}
                interactive
                className="h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-2xl font-black tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">
                      {pillar.number}
                    </span>
                    <Badge variant={pillar.badgeVariant} size="sm">
                      {pillar.badge}
                    </Badge>
                  </div>

                  <CardHeader className="mb-0">
                    <CardTitle>{pillar.title}</CardTitle>
                    <CardSubtitle>{pillar.subtitle}</CardSubtitle>
                  </CardHeader>

                  <CardDescription className="mt-4">
                    {pillar.description}
                  </CardDescription>
                </div>

                <CardFooter>
                  <span>SECTOR REF: {pillar.number}-0{index + 1}</span>
                  <span className="transition-transform group-hover:translate-x-1 text-slate-400">
                    &rarr;
                  </span>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
