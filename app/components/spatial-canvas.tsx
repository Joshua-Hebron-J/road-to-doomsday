'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from '@react-three/fiber';
import { Edges, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { MultiverseRift } from './multiverse-rift';
import type { SpatialCanvasProps, SpatialNode } from './spatial-scene-types';

type Point = [number, number, number];
function positions(count: number, timeline: boolean): Point[] {
  return Array.from({ length: count }, (_, i) => {
    const fraction = count > 1 ? i / (count - 1) : 0.5;
    return [
      (fraction - 0.5) * 6.4,
      timeline
        ? Math.sin(fraction * Math.PI * 2) * 0.75
        : Math.sin(fraction * Math.PI) * 1.2 - 0.5,
      Math.cos(fraction * Math.PI * 2) * 0.65,
    ];
  });
}

function Portal({
  node,
  point,
  selected,
  index,
  animated,
  onSelect,
  fullLabels,
  media,
}: {
  node: SpatialNode;
  point: Point;
  selected: boolean;
  index: number;
  animated: boolean;
  onSelect: (id: string) => void;
  fullLabels: boolean;
  media: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useFrame((state, delta) => {
    if (!group.current) return;
    const target = selected ? 1.2 : hovered ? 1.05 : 0.84;
    const scale = animated
      ? THREE.MathUtils.damp(
          group.current.scale.x,
          target,
          6,
          Math.min(delta, 0.05),
        )
      : target;
    group.current.scale.setScalar(scale);
    group.current.position.y =
      point[1] +
      (media && animated
        ? Math.sin(state.clock.elapsedTime * 0.65 + index) * 0.035
        : 0);
    const tilt = media && hovered && animated ? 0.18 : 0;
    group.current.rotation.y = animated
      ? THREE.MathUtils.damp(
          group.current.rotation.y,
          tilt,
          6,
          Math.min(delta, 0.05),
        )
      : 0;
    const z = point[2] + (selected ? 0.55 : 0);
    group.current.position.z = animated
      ? THREE.MathUtils.damp(
          group.current.position.z,
          z,
          5,
          Math.min(delta, 0.05),
        )
      : z;
    if (ring.current && animated)
      ring.current.rotation.z +=
        Math.min(delta, 0.05) * (selected ? 0.25 : 0.08);
  });
  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(node.id);
  };
  return (
    <group
      ref={group}
      position={point}
      onClick={select}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <sphereGeometry args={[0.78, 12, 8]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
          colorWrite={false}
        />
      </mesh>
      {media && (
        <mesh position={[0, 0, -0.12]}>
          <boxGeometry args={[0.92, 1.18, 0.16]} />
          <meshStandardMaterial
            color="#0a0c10"
            metalness={0.8}
            roughness={0.28}
          />
          <Edges color={selected ? '#f8fafc' : node.color} />
        </mesh>
      )}
      {media && (
        <mesh position={[-0.35, 0, -0.02]}>
          <boxGeometry args={[0.022, 1, 0.02]} />
          <meshBasicMaterial color={node.color} />
        </mesh>
      )}
      <mesh rotation={[0.2, 0.15, 0]} ref={ring}>
        <torusGeometry
          args={[media ? 0.35 : 0.52, selected ? 0.035 : 0.018, 8, 48]}
        />
        <meshBasicMaterial color={node.color} />
      </mesh>
      <mesh rotation={[0.7, 0.2, 0.5]}>
        <icosahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={selected || hovered ? 0.7 : 0.18}
          metalness={0.65}
          roughness={0.3}
          wireframe={!node.complete}
        />
      </mesh>
      <mesh visible={selected} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.009, 6, 48]} />
        <meshBasicMaterial color="#f8fafc" transparent opacity={0.6} />
      </mesh>
      <Html
        position={[0, -0.83, 0]}
        center
        style={{ pointerEvents: 'none' }}
        zIndexRange={[5, 0]}
      >
        <div
          className={`w-28 text-center select-none ${selected ? 'text-emerald-200' : 'text-slate-300'}`}
        >
          <span className="font-mono text-[10px] tracking-[0.2em]">
            {node.complete ? '✓' : String(index + 1).padStart(2, '0')}
          </span>
          {(selected || fullLabels) && (
            <span className="hidden sm:line-clamp-2 mt-1 text-[10px] sm:text-xs leading-tight bg-black/60 px-1 py-1 rounded">
              {node.label}
            </span>
          )}
        </div>
      </Html>
    </group>
  );
}

function CameraRig({
  selected,
  points,
  animated,
}: {
  selected: number;
  points: Point[];
  animated: boolean;
}) {
  useFrame((state, delta) => {
    const { camera, size } = state;
    const point = points[selected] ?? [0, 0, 0];
    const aspect = size.width / Math.max(size.height, 1);
    const distance = aspect < 1.2 ? 12 : 8.5;
    const parallax = animated && size.width >= 600;
    const targetX = point[0] * 0.16 + (parallax ? state.pointer.x * 0.32 : 0);
    const targetY =
      0.3 + point[1] * 0.15 + (parallax ? state.pointer.y * 0.22 : 0);
    camera.position.x = animated
      ? THREE.MathUtils.damp(
          camera.position.x,
          targetX,
          3,
          Math.min(delta, 0.05),
        )
      : targetX;
    camera.position.y = animated
      ? THREE.MathUtils.damp(
          camera.position.y,
          targetY,
          3,
          Math.min(delta, 0.05),
        )
      : targetY;
    camera.position.z = animated
      ? THREE.MathUtils.damp(
          camera.position.z,
          distance,
          3,
          Math.min(delta, 0.05),
        )
      : distance;
    camera.lookAt(point[0] * 0.08, point[1] * 0.05, 0);
  });
  return null;
}

function ContextGuard({ onFailure }: { onFailure: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const element = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    element.addEventListener('webglcontextlost', lost);
    return () => element.removeEventListener('webglcontextlost', lost);
  }, [gl, onFailure]);
  return null;
}

function RiftBackdrop({
  animated,
  lowDetail,
}: {
  animated: boolean;
  lowDetail: boolean;
}) {
  const compact = useThree((state) => state.size.width < 600);
  return (
    <group position={[0, 0, -2.5]} scale={0.8}>
      <MultiverseRift
        reducedMotion={!animated}
        isMobile={compact}
        lowDetail={lowDetail}
      />
    </group>
  );
}

export default function SpatialCanvas({
  nodes,
  selectedId,
  onSelect,
  variant,
  animated,
  active,
  onFailure,
}: SpatialCanvasProps) {
  const device = navigator as Navigator & { deviceMemory?: number };
  const lowDetail =
    (device.hardwareConcurrency > 0 && device.hardwareConcurrency <= 4) ||
    (device.deviceMemory !== undefined && device.deviceMemory <= 4);
  const points = useMemo(
    () => positions(nodes.length, variant === 'timeline'),
    [nodes.length, variant],
  );
  const selected = Math.max(
    0,
    nodes.findIndex((node) => node.id === selectedId),
  );
  return (
    <div
      className="absolute inset-0"
      aria-hidden="true"
      data-scene-rendering={active && animated ? 'continuous' : 'on-demand'}
    >
      <Canvas
        camera={{ position: [0, 0.3, 10], fov: 44 }}
        dpr={lowDetail ? 1 : [1, 1.5]}
        frameloop={active && animated ? 'always' : 'demand'}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        style={{ touchAction: 'pan-y', cursor: 'pointer' }}
        fallback={<p>Use the destination controls below to continue.</p>}
      >
        <ContextGuard onFailure={onFailure} />
        <CameraRig
          selected={selected}
          points={points}
          animated={animated && active}
        />
        <ambientLight intensity={0.65} />
        <directionalLight
          position={[2, 3, 4]}
          intensity={1.6}
          color="#e2e8f0"
        />
        {variant === 'rift' && (
          <RiftBackdrop animated={animated && active} lowDetail={lowDetail} />
        )}
        {points.length > 1 && (
          <Line
            points={points}
            color="#34d399"
            lineWidth={1.1}
            transparent
            opacity={0.32}
          />
        )}
        {nodes.map((node, index) => (
          <Portal
            key={node.id}
            node={node}
            point={points[index]}
            index={index}
            selected={selectedId === node.id}
            animated={animated && active}
            onSelect={onSelect}
            fullLabels={variant === 'rift'}
            media={variant === 'movies'}
          />
        ))}
        <gridHelper
          args={[18, 18, '#164e3d', '#0d231f']}
          position={[0, -2.25, -2]}
        />
      </Canvas>
    </div>
  );
}
