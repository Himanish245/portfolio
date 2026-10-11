'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useMobileDetect } from '@/hooks/useMobileDetect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScrollProgress, globalScrollProgress } from '@/hooks/useScrollProgress';
import PCModel from './PCModel';

function CameraRig({ isMobile }: { isMobile: boolean }) {
  useFrame((state, delta) => {
    const p = globalScrollProgress.target;
    // Single-track camera depth with delta damping
    const targetZ = THREE.MathUtils.lerp(4.0, 4.3, p) + (isMobile ? 0.7 : 0);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 4, delta);

    if (!isMobile) {
      const mouseDamp = 0.1 * (1 - p * 0.7);
      const targetX = state.pointer.x * mouseDamp;
      const targetY = 0.18 + state.pointer.y * (mouseDamp * 0.5);
      state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 5, delta);
      state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 5, delta);
    } else {
      state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, 0.16, 5, delta);
    }

    state.camera.lookAt(0, -0.04, 0);
  });

  return null;
}

// Sophisticated Dark Studio Lighting (Apple hardware reveal aesthetic)
function DarkStudioLighting() {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    if (keyLightRef.current) {
      const t = state.clock.getElapsedTime();
      keyLightRef.current.position.x = 4 + Math.sin(t * 0.25) * 0.5;
      keyLightRef.current.position.y = 5.5 + Math.cos(t * 0.2) * 0.4;
    }
  });

  return (
    <>
      {/* Overhead Soft Key Light (Brushed Aluminium & Glass Highlights) */}
      <directionalLight
        ref={keyLightRef}
        position={[4, 5.5, 4]}
        intensity={2.4}
        color="#f1f5f9"
      />
      {/* Cyan Rim Accent Light (Chamfer Edge Definition) */}
      <pointLight
        position={[-3.8, 1.2, 3]}
        intensity={1.5}
        color="#38bdf8"
        distance={10}
      />
      {/* Cool Violet Fill Light */}
      <pointLight
        position={[3.2, 2.5, -3.2]}
        intensity={1.2}
        color="#818cf8"
        distance={10}
      />
      {/* Subtle Warm Underglow */}
      <directionalLight
        position={[-1, -2, 2]}
        intensity={0.4}
        color="#3b82f6"
      />
      {/* Ambient Base Light */}
      <ambientLight intensity={0.22} />
    </>
  );
}

// Soft Studio Contact Shadow Floor
function StudioContactShadow() {
  return (
    <mesh position={[0, -1.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 8]} />
      <meshBasicMaterial
        color="#030408"
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </mesh>
  );
}

function Scene({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <CameraRig isMobile={isMobile} />
      <DarkStudioLighting />
      <StudioContactShadow />
      <PCModel isMobile={isMobile} />

      <Environment preset="night" />

      {/* Restrained, subtle bloom (crisp machined components, no washed-out haze) */}
      {!isMobile && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.85}
            luminanceSmoothing={0.9}
            intensity={0.16}
          />
        </EffectComposer>
      )}
    </>
  );
}

export default function HeroScene() {
  const { isMobile, pixelRatio } = useMobileDetect();
  const reducedMotion = useReducedMotion();

  useScrollProgress();

  if (reducedMotion) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#060812] via-[#030408] to-[#080914]" />
    );
  }

  return (
    <div className="w-full h-full select-none">
      <Canvas
        camera={{ position: [0, 0.28, 4.0], fov: 40 }}
        dpr={pixelRatio}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
        }}
      >
        <Scene isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
