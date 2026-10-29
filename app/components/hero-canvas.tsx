"use client";

import { useSyncExternalStore, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { MultiverseRift } from "./multiverse-rift";

function isWebGLSupported(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

const emptySubscribe = () => () => {};

function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function useWebGLAvailable(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => isWebGLSupported(),
    () => false
  );
}

function useIsMobile(): boolean {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("resize", callback);
      return () => window.removeEventListener("resize", callback);
    },
    () => window.innerWidth < 768,
    () => false
  );
}

export function HeroCanvas() {
  const isClient = useIsClient();
  const webGLAvailable = useWebGLAvailable();
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      {/* Fallback & Ambient Atmosphere Layer (always present for rich backdrop) */}
      <div className="absolute w-[550px] h-[380px] sm:w-[850px] sm:h-[480px] bg-emerald-500/10 rounded-full blur-[120px] -top-20 transform-gpu" />
      <div className="absolute w-[350px] h-[260px] bg-amber-500/5 rounded-full blur-[90px] bottom-10 right-1/4 transform-gpu" />
      
      {/* 3D WebGL Canvas Layer */}
      {isClient && webGLAvailable ? (
        <div className="absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_85%)]">
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 7.4], fov: 44 }}
              dpr={[1, 1.5]}
              gl={{
                alpha: true,
                antialias: true,
                powerPreference: "default",
              }}
              style={{
                pointerEvents: "none",
                width: "100%",
                height: "100%",
              }}
            >
              <MultiverseRift
                reducedMotion={Boolean(shouldReduceMotion)}
                isMobile={isMobile}
              />
            </Canvas>
          </Suspense>
        </div>
      ) : null}

      {/* Central reading-zone contrast attenuation & titanium vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,5,8,0.72)_0%,rgba(5,5,8,0.25)_50%,transparent_90%)] pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-background/60 to-background pointer-events-none" />
      <div className="absolute inset-0 cinematic-grid opacity-45 pointer-events-none" />
    </div>
  );
}
