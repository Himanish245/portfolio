'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useMobileDetect } from '@/hooks/useMobileDetect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScrollProgress, globalScrollProgress } from '@/hooks/useScrollProgress';
import PCModel from './PCModel';

function CameraRig({ isMobile }: { isMobile: boolean }) {
  const mouse = useMousePosition();

  useFrame((state) => {
    const pop = globalScrollProgress.popProgress;
    const settle = globalScrollProgress.settleProgress;

    // During pop-out, camera zooms in slightly; when settled down, camera frames wider
    const targetZ = settle > 0.05
      ? THREE.MathUtils.lerp(3.8, 4.4, settle)
      : THREE.MathUtils.lerp(4.2, 3.8, pop);

    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ + (isMobile ? 0.7 : 0), 0.06);

    if (!isMobile) {
      const mouseDamp = settle > 0.5 ? 0.08 : 0.35;
      const targetX = mouse.x * mouseDamp;
      const targetY = 0.25 + mouse.y * (mouseDamp * 0.6);
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.04);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.04);
    } else {
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.2, 0.04);
    }

    state.camera.lookAt(0, -0.05, 0);
  });

  return null;
}

function CinematicWorkstationLighting() {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    if (keyLightRef.current) {
      const t = state.clock.getElapsedTime();
      keyLightRef.current.position.x = 4 + Math.sin(t * 0.3) * 0.8;
      keyLightRef.current.position.y = 5 + Math.cos(t * 0.25) * 0.6;
    }
  });

  return (
    <>
      {/* Primary Key Light — Electric Cyan / Blue highlighting PC glass & chassis */}
      <directionalLight
        ref={keyLightRef}
        position={[4, 5, 4.5]}
        intensity={2.2}
        color="#38bdf8"
        castShadow
      />
      {/* Warm amber monitor accent / bounce light from lower left */}
      <pointLight
        position={[-3.5, -0.5, 2.5]}
        intensity={1.2}
        color="#ff8844"
      />
      {/* Cool cyber rim light from behind chassis */}
      <pointLight
        position={[2.5, 3, -3]}
        intensity={1.8}
        color="#4a9eff"
      />
      {/* Top fill light for monitor bezel */}
      <directionalLight
        position={[-1, 4, 1]}
        intensity={0.6}
        color="#ffffff"
      />
      {/* Minimum ambient illumination */}
      <ambientLight intensity={0.16} />
    </>
  );
}

function Scene({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <CameraRig isMobile={isMobile} />
      <CinematicWorkstationLighting />
      
      {/* Animated 3D Workstation: Pops out & Settles down on scroll */}
      <PCModel isMobile={isMobile} />

      {/* Floating cyber dust motes around the rig */}
      <Sparkles
        count={isMobile ? 25 : 60}
        scale={[6, 4, 5]}
        size={isMobile ? 1.4 : 2.0}
        speed={0.25}
        opacity={0.35}
        color="#38bdf8"
      />

      <Environment preset="night" />

      {!isMobile && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.7}
            luminanceSmoothing={0.85}
            intensity={0.42}
          />
        </EffectComposer>
      )}
    </>
  );
}

export default function HeroScene() {
  const { isMobile, pixelRatio } = useMobileDetect();
  const reducedMotion = useReducedMotion();

  // Initialize scroll progress tracking
  useScrollProgress();

  if (reducedMotion) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#060812] via-[#050505] to-[#0a0515]" />
    );
  }

  return (
    <div className="w-full h-full select-none">
      <Canvas
        camera={{ position: [0, 0.35, 4.2], fov: 42 }}
        dpr={pixelRatio}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        <Scene isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
