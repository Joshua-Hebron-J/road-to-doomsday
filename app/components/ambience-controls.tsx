"use client";

import { useEffect, useRef, useState } from "react";
import {
  createAmbience,
  readSoundscape,
  soundscapeKey,
  soundscapes,
  type Soundscape,
} from "../lib/ambience";

export default function AmbienceControls() {
  const [scene, setScene] = useState<Soundscape>("latveria");
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState("");
  const player = useRef<{
    context: AudioContext;
    engine: ReturnType<typeof createAmbience>;
  } | null>(null);

  function release() {
    const current = player.current;
    player.current = null;
    if (current) void current.context.close().catch(() => {});
  }

  useEffect(() => {
    try {
      const saved = readSoundscape(localStorage.getItem(soundscapeKey));
      // Defer the browser preference until after hydration.
      const frame = requestAnimationFrame(() => setScene(saved));
      return () => cancelAnimationFrame(frame);
    } catch {
      // The current session works without storage.
    }
  }, []);

  useEffect(() => {
    function cue(event: MouseEvent) {
      if (event.target instanceof Element && event.target.closest("[data-ambience-cue]")) {
        player.current?.engine.cue();
      }
    }

    function syncVisibility() {
      if (document.hidden && player.current) {
        release();
        setEnabled(false);
      }
    }

    document.addEventListener("click", cue);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      document.removeEventListener("click", cue);
      document.removeEventListener("visibilitychange", syncVisibility);
      release();
    };
  }, []);

  async function toggle() {
    if (player.current) {
      release();
      setEnabled(false);
      return;
    }

    if (document.hidden) return;

    setError("");
    let context: AudioContext | undefined;
    try {
      context = new AudioContext();
      const next = { context, engine: createAmbience(context) };
      player.current = next;
      next.engine.select(scene);
      setEnabled(true);
      await context.resume();

    } catch {
      if (context && player.current?.context !== context) {
        if (context.state === "closed" || player.current) return;
        void context.close().catch(() => {});
      } else {
        release();
      }
      setEnabled(false);
      setError("Audio unavailable");
    }
  }

  function select(value: string) {
    const next = readSoundscape(value);
    setScene(next);
    player.current?.engine.select(next);
    player.current?.engine.cue();
    try {
      localStorage.setItem(soundscapeKey, next);
    } catch {
      // Playback remains available for this session.
    }
  }

  return (
    <aside aria-label="Cinematic audio" className="border-t border-white/10 bg-[#080a0b] px-4 py-5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
        <div className="mr-auto">
          <p className="text-sm font-semibold text-emerald-200">Archive soundscapes</p>
          <p className="text-xs text-zinc-400">Original synthesized ambience and archive interaction cues</p>
        </div>
        <label className="text-sm text-zinc-300">
          <span className="sr-only">Soundscape</span>
          <select
            value={scene}
            onChange={(event) => select(event.target.value)}
            className="min-h-11 rounded-md border border-white/20 bg-zinc-950 px-3 focus-visible:outline-2 focus-visible:outline-emerald-300"
          >
            <option value="latveria">{soundscapes.latveria.label}</option>
            <option value="loom">{soundscapes.loom.label}</option>
          </select>
        </label>
        <button
          type="button"
          aria-pressed={enabled}
          onClick={toggle}
          className="min-h-11 rounded-md border border-emerald-400/40 px-3 text-sm text-emerald-100 hover:bg-emerald-400/10 focus-visible:outline-2 focus-visible:outline-emerald-300"
        >
          Cinematic audio <span aria-hidden="true">· {enabled ? "On" : "Off"}</span>
        </button>
        {error && <p role="status" className="text-sm text-zinc-300">{error}</p>}
      </div>
    </aside>
  );
}
