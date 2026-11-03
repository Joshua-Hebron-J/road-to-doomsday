import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { Pillars } from "./components/pillars";
import { PathwaysPreview } from "./components/pathways-preview";
import { TimelinePreview } from "./components/timeline-preview";
import { IncursionLab } from "./components/incursion-lab";
import { VariantTracker } from "./components/variant-tracker";
import { DoomCodex } from "./components/doom-codex";
import { Footer } from "./components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 flex flex-col">
        <Hero />
        <Pillars />
        <PathwaysPreview />
        <TimelinePreview />
        <IncursionLab />
        <VariantTracker />
        <DoomCodex />
      </main>
      <Footer />
    </div>
  );
}