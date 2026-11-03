'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { useEffect } from 'react';
import { MathUtils } from 'three';
import { REALITIES, type IncursionFrame } from '../lib/incursion';

const tear = Array.from(
  { length: 17 },
  (_, index): [number, number, number] => [
    index % 2 ? 0.12 : -0.12,
    (index - 8) * 0.14,
    Math.sin(index * 2) * 0.24,
  ],
);

function Scene({
  frame,
  animate,
  onFailure,
}: {
  frame: IncursionFrame;
  animate: boolean;
  onFailure: () => void;
}) {
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => {
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    canvas.addEventListener('webglcontextlost', lost);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [canvas, onFailure]);

  useFrame(({ camera, pointer, size }, delta) => {
    const distance = Math.max(7, 9 / Math.max(0.65, size.width / size.height));
    const x = animate ? pointer.x * 0.7 + frame.stress * 0.45 : 0;
    camera.position.x = animate
      ? MathUtils.damp(camera.position.x, x, 5, delta)
      : x;
    camera.position.z = distance - frame.stress * 0.65;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 4, 5]} intensity={2.4} />
      {REALITIES.map((reality, index) => (
        <group
          key={reality.designation}
          position={[((index ? 1 : -1) * frame.separation) / 2, 0, 0]}
        >
          <mesh
            scale={1 - frame.damage * 0.24}
            rotation={[frame.stress * 2, frame.stress * 3, index]}
          >
            <icosahedronGeometry args={[0.83, 2]} />
            <meshStandardMaterial
              color={reality.color}
              roughness={0.58}
              emissive={reality.color}
              emissiveIntensity={0.1 + frame.damage * 0.25}
            />
          </mesh>
          <mesh rotation={[0.1, frame.stress, frame.stress * 2]}>
            <icosahedronGeometry args={[1, 2]} />
            <meshBasicMaterial
              color={reality.color}
              wireframe
              transparent
              opacity={0.28 + frame.stress * 0.45}
            />
          </mesh>
          <mesh rotation={[1.22, 0.2, index]}>
            <torusGeometry args={[1.22, 0.012, 6, 48]} />
            <meshBasicMaterial
              color={reality.color}
              transparent
              opacity={0.55}
            />
          </mesh>
        </group>
      ))}
      {frame.stress >= 0.5 && (
        <group scale={[1 + frame.damage * 2, frame.stress, 1]}>
          <Line
            points={tear}
            color={frame.dying ? '#fda4af' : '#fde68a'}
            lineWidth={3}
          />
          <mesh scale={1 + frame.contact * 0.6} rotation={[0, Math.PI / 2, 0]}>
            <ringGeometry args={[0.43, 0.48, 40]} />
            <meshBasicMaterial
              color="#fbbf24"
              transparent
              opacity={0.5}
              side={2}
            />
          </mesh>
        </group>
      )}
    </>
  );
}

export default function IncursionCanvas({
  frame,
  animate,
  onFailure,
}: {
  frame: IncursionFrame;
  animate: boolean;
  onFailure: () => void;
}) {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 8], fov: 47 }}
      dpr={[1, 1.25]}
      frameloop={animate ? 'always' : 'demand'}
      gl={{ antialias: false, powerPreference: 'low-power', alpha: true }}
      style={{ touchAction: 'pan-y' }}
      fallback={<p className="p-4">Select the 2D view to continue.</p>}
    >
      <Scene frame={frame} animate={animate} onFailure={onFailure} />
    </Canvas>
  );
}
