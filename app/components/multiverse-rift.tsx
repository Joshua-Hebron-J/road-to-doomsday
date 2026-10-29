"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";

interface MultiverseRiftProps {
  reducedMotion?: boolean;
  isMobile?: boolean;
}

export function MultiverseRift({
  reducedMotion = false,
  isMobile = false,
}: MultiverseRiftProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const innerWireframeRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const shardsGroupRef = useRef<THREE.Group>(null);

  // Reality shards positioned along the outer framing perimeter
  const shardConfigs = useMemo(() => {
    return [
      { pos: [3.4, 1.4, -0.6] as [number, number, number], rot: [0.4, 0.2, 0.8] as [number, number, number], scale: 0.11, speed: 0.12 },
      { pos: [-3.5, -1.2, 0.4] as [number, number, number], rot: [0.1, 0.9, 0.3] as [number, number, number], scale: 0.13, speed: -0.15 },
      { pos: [2.2, 2.4, -0.8] as [number, number, number], rot: [0.7, 0.4, 0.2] as [number, number, number], scale: 0.09, speed: 0.14 },
      { pos: [-2.4, -2.3, -0.5] as [number, number, number], rot: [0.3, 0.6, 0.9] as [number, number, number], scale: 0.12, speed: -0.13 },
      { pos: [3.7, -1.5, 0.5] as [number, number, number], rot: [0.5, 0.1, 0.4] as [number, number, number], scale: 0.10, speed: 0.11 },
      { pos: [-3.6, 1.7, -0.7] as [number, number, number], rot: [0.8, 0.5, 0.1] as [number, number, number], scale: 0.14, speed: -0.10 },
    ];
  }, []);

  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (reducedMotion) return;

    timeRef.current += delta;
    const time = timeRef.current;
    const pointer = state.pointer;

    // Subtle, gentle mouse parallax
    if (groupRef.current) {
      const targetRotX = pointer.y * 0.14;
      const targetRotY = pointer.x * 0.2;
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetRotX,
        2.0,
        delta
      );
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotY + time * 0.035,
        2.0,
        delta
      );
    }

    // Deep central core rotation (slow, ethereal)
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.y = time * 0.08;
      coreMeshRef.current.rotation.x = time * 0.05;
    }

    // Inner wireframe lattice pulse
    if (innerWireframeRef.current) {
      innerWireframeRef.current.rotation.y = -time * 0.12;
      innerWireframeRef.current.rotation.z = time * 0.09;
      const pulse = 0.52 + Math.sin(time * 1.2) * 0.025;
      innerWireframeRef.current.scale.set(pulse, pulse, pulse);
    }

    // Outer framing caliper rings (counter-rotating around the perimeter)
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time * 0.05;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = 0.45 + Math.sin(time * 0.25) * 0.04;
      ring2Ref.current.rotation.y = -time * 0.06;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = -time * 0.04;
      ring3Ref.current.rotation.y = time * 0.03;
    }

    // Perimeter reality shards
    if (shardsGroupRef.current) {
      shardsGroupRef.current.rotation.y = -time * 0.05;
      shardsGroupRef.current.rotation.z = Math.sin(time * 0.15) * 0.03;
    }
  });

  // Scale down on mobile to maintain framing without crowding the narrow viewport
  const riftScale = isMobile ? 0.55 : 0.95;

  return (
    <group ref={groupRef} scale={[riftScale, riftScale, riftScale]} position={[0, 0.1, 0]}>
      {/* 1. Subtle, disciplined lighting setup */}
      {/* Ambient background light */}
      <ambientLight intensity={0.25} />

      {/* Internal core glow (reduced intensity, high decay so it stays localized) */}
      <pointLight position={[0, 0, -1.0]} color="#10b981" intensity={1.2} distance={5} decay={2} />

      {/* Rim light from behind to highlight ring and core edges */}
      <directionalLight position={[0, 4, -4]} color="#10b981" intensity={1.4} />

      {/* Subtle antique gold rim light from lower flank */}
      <pointLight position={[4, -3, -2]} color="#c59b27" intensity={0.65} distance={8} decay={2} />

      {/* Low-intensity frontal fill to keep front faces dark and moody */}
      <directionalLight position={[0, 2, 4]} color="#e2e8f0" intensity={0.3} />

      {/* 2. Deep, Semi-Transparent Crystalline Core (Positioned deep in Z to avoid text clash) */}
      <group position={[0, 0, -1.2]}>
        {/* Outer translucent crystalline shell */}
        <mesh ref={coreMeshRef}>
          <icosahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color="#047857"
            emissive="#022c22"
            emissiveIntensity={0.3}
            roughness={0.15}
            metalness={0.9}
            transparent={true}
            opacity={0.22}
            flatShading={true}
          />
        </mesh>

        {/* Inner delicate wireframe lattice */}
        <mesh ref={innerWireframeRef}>
          <octahedronGeometry args={[0.52, 0]} />
          <meshStandardMaterial
            color="#34d399"
            emissive="#10b981"
            emissiveIntensity={0.8}
            wireframe={true}
            transparent={true}
            opacity={0.38}
          />
        </mesh>
      </group>

      {/* 3. Outer Framing Caliper Rings (Expanded radii so they frame the hero text) */}
      {/* Ring A: Titanium Equatorial Orbital Frame */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2.25, 0.08, 0]}>
        <torusGeometry args={[3.8, 0.01, 12, isMobile ? 36 : 64]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.95}
          roughness={0.15}
          transparent={true}
          opacity={0.7}
        />
      </mesh>

      {/* Ring B: Antique Gold Outer Caliper Boundary */}
      <mesh ref={ring2Ref} rotation={[0.45, 0.72, 0]}>
        <torusGeometry args={[4.2, 0.009, 12, isMobile ? 36 : 64]} />
        <meshStandardMaterial
          color="#c59b27"
          emissive="#78350f"
          emissiveIntensity={0.15}
          metalness={0.9}
          roughness={0.2}
          transparent={true}
          opacity={0.65}
        />
      </mesh>

      {/* Ring C: Delicate Latverian Emerald Meridian Ring */}
      <mesh ref={ring3Ref} rotation={[-0.55, 0.35, 0]}>
        <torusGeometry args={[3.45, 0.008, 12, isMobile ? 36 : 64]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#047857"
          emissiveIntensity={0.35}
          metalness={0.85}
          roughness={0.25}
          transparent={true}
          opacity={0.45}
        />
      </mesh>

      {/* 4. Perimeter Reality Shards (Orbiting along outer framing perimeter) */}
      <group ref={shardsGroupRef}>
        {(isMobile ? shardConfigs.slice(0, 4) : shardConfigs).map((cfg, idx) => (
          <mesh
            key={idx}
            position={cfg.pos}
            rotation={cfg.rot}
            scale={[cfg.scale, cfg.scale, cfg.scale]}
          >
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#059669"
              emissive="#022c22"
              emissiveIntensity={0.25}
              metalness={0.9}
              roughness={0.18}
              transparent={true}
              opacity={0.5}
              flatShading={true}
            />
          </mesh>
        ))}
      </group>

      {/* 5. Delicate Multiverse Starlight Particles (Kept restrained and ambient) */}
      <Sparkles
        count={isMobile ? 18 : 40}
        scale={isMobile ? 5.0 : 7.5}
        size={isMobile ? 1.6 : 2.2}
        speed={0.25}
        color="#34d399"
        opacity={0.35}
      />
    </group>
  );
}
