import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-32 relative overflow-hidden">
        {/* Anomaly Ambient Red & Emerald Background Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30"
        >
          <div className="w-[500px] h-[500px] rounded-full bg-red-600/20 blur-[120px] -translate-x-20" />
          <div className="w-[450px] h-[450px] rounded-full bg-emerald-600/15 blur-[120px] translate-x-20" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
          {/* Incursion Warning Badge */}
          <div className="flex justify-center">
            <Badge variant="incursion" size="lg" dot pulse>
              Timeline Anomaly // Null Sector
            </Badge>
          </div>

          {/* 404 Thematic Display */}
          <div className="space-y-2">
            <span className="font-mono text-7xl sm:text-9xl font-black tracking-widest text-slate-700/60 block select-none">
              404
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-wide text-slate-100">
              Reality Desynchronization
            </h1>
          </div>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-lg mx-auto">
            The requested multiversal coordinates or timeline pathway cannot be
            found. This reality branch may have been pruned by the Time Variance
            Authority or destroyed in an unrecorded incursion event.
          </p>

          {/* Technical readout box */}
          <div className="p-4 rounded-lg bg-surface-1/70 border border-white/5 font-mono text-xs text-left max-w-md mx-auto space-y-1 text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-500">SECTOR STATUS:</span>
              <span className="text-red-400 font-bold">UNSTABLE / VOID</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">COORDINATE:</span>
              <span className="text-slate-300">EARTH-NULL-ERROR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">RECOMMENDED ACTION:</span>
              <span className="text-emerald-400">RE-ANCHOR TO CANONICAL PATH</span>
            </div>
          </div>

          {/* Recovery Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              href="/pathways"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Choose Your Path
            </Button>
            <Button
              href="/"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Return to Sanctuary
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
