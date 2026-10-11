'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMobileDetect } from '@/hooks/useMobileDetect';

function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function SingularityParticles({ isMobile }: { isMobile: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = isMobile ? 350 : 750;

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Golden spiral distribution with deterministic seeded pseudo-randomness
      const rVal = seededRandom(i * 3 + 1);
      const thetaVal = seededRandom(i * 3 + 2);
      const phiVal = seededRandom(i * 3 + 3);

      const radius = 0.4 + Math.pow(rVal, 0.6) * 3.2;
      const theta = thetaVal * Math.PI * 2;
      const phi = (phiVal - 0.5) * Math.PI * 0.8;

      pos[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = radius * Math.sin(phi) * 0.45;
      pos[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      sc[i] = seededRandom(i + 42) * 2.0 + 1.0;
    }
    return [pos, sc];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();

    // Swirling vortex inertia
    pointsRef.current.rotation.y += delta * 0.15;
    pointsRef.current.rotation.x = Math.sin(t * 0.2) * 0.1 + state.pointer.y * 0.15;
    pointsRef.current.rotation.z = Math.cos(t * 0.15) * 0.08 + state.pointer.x * 0.15;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.025 : 0.035}
        color="#38bdf8"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ContactSingularity() {
  const { isMobile, pixelRatio } = useMobileDetect();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className="absolute inset-0 bg-radial from-[#38bdf8]/5 via-transparent to-transparent pointer-events-none" />
    );
  }

  return (
    <div className="w-full h-full pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 4.0], fov: 45 }}
        dpr={pixelRatio}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        style={{ background: 'transparent' }}
      >
        <SingularityParticles isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
