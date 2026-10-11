'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useMobileDetect } from '@/hooks/useMobileDetect';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function TorusKnotMesh({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const mouse = useMousePosition();

  const segments = isMobile ? 128 : 256;
  const radialSegments = isMobile ? 32 : 64;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Base continuous rotation
    meshRef.current.rotation.x += delta * 0.12;
    meshRef.current.rotation.y += delta * 0.18;

    if (wireframeRef.current) {
      wireframeRef.current.rotation.x -= delta * 0.08;
      wireframeRef.current.rotation.y -= delta * 0.12;
    }

    // Subtle mouse-driven parallax rotation
    if (!isMobile) {
      meshRef.current.rotation.x += mouse.y * 0.001;
      meshRef.current.rotation.y += mouse.x * 0.001;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.4}>
      <group scale={isMobile ? 1.1 : 1.7}>
        {/* Main sculptural ceramic/metallic knot */}
        <mesh ref={meshRef} castShadow receiveShadow>
          <torusKnotGeometry args={[1, 0.35, segments, radialSegments, 2, 3]} />
          <meshPhysicalMaterial
            color="#121224"
            roughness={0.2}
            metalness={0.9}
            clearcoat={0.7}
            clearcoatRoughness={0.1}
            envMapIntensity={1.4}
            reflectivity={0.9}
          />
        </mesh>

        {/* Delicate outer wireframe orbital accent */}
        {!isMobile && (
          <mesh ref={wireframeRef} scale={1.08}>
            <torusKnotGeometry args={[1, 0.35, 64, 16, 2, 3]} />
            <meshBasicMaterial
              color="#4a9eff"
              wireframe={true}
              transparent={true}
              opacity={0.07}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
}

function CameraRig({ isMobile }: { isMobile: boolean }) {
  const mouse = useMousePosition();

  useFrame((state) => {
    if (isMobile) return;
    const targetX = mouse.x * 0.6;
    const targetY = mouse.y * 0.4;
    state.camera.position.x += (targetX - state.camera.position.x) * 0.025;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.025;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

function AtmosphericLights() {
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      const t = state.clock.getElapsedTime();
      lightRef.current.position.x = 5 + Math.sin(t * 0.5) * 1.5;
      lightRef.current.position.y = 5 + Math.cos(t * 0.4) * 1.2;
    }
  });

  return (
    <>
      {/* Key cinematic light — electric blue */}
      <directionalLight
        ref={lightRef}
        position={[5, 5, 5]}
        intensity={1.8}
        color="#4a9eff"
      />
      {/* Warm ambient fill light — subtle contrast */}
      <pointLight
        position={[-4, -3, 3]}
        intensity={0.9}
        color="#ff7a38"
      />
      {/* Back rim light — pure crisp white highlight */}
      <pointLight
        position={[0, 4, -5]}
        intensity={1.5}
        color="#ffffff"
      />
      {/* Subtle top fill */}
      <ambientLight intensity={0.12} />
    </>
  );
}

function Scene({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <CameraRig isMobile={isMobile} />
      <AtmosphericLights />
      <TorusKnotMesh isMobile={isMobile} />
      
      {/* Subtle ethereal particles floating in space */}
      <Sparkles
        count={isMobile ? 35 : 80}
        scale={6}
        size={isMobile ? 1.5 : 2.2}
        speed={0.3}
        opacity={0.4}
        color="#4a9eff"
      />

      <Environment preset="night" />

      {!isMobile && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.75}
            luminanceSmoothing={0.9}
            intensity={0.4}
          />
        </EffectComposer>
      )}
    </>
  );
}

export default function HeroScene() {
  const { isMobile, pixelRatio } = useMobileDetect();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#050505] to-[#0a0515]" />
    );
  }

  return (
    <div className="absolute inset-0 select-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={pixelRatio}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.25;
        }}
      >
        <Scene isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
