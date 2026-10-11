'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMobileDetect } from '@/hooks/useMobileDetect';

interface VisualizerProps {
  type: string; // 'NEXUS' | 'AI Research' | 'Portfolio' | 'ATL Lab'
}

// 1. NEXUS: Cyber Octahedron Core with Radar rings
function NexusCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.4;
      coreRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.6;
      ringRef1.current.rotation.x = Math.PI / 4 + Math.sin(t * 0.3) * 0.15;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z -= delta * 0.4;
      ringRef2.current.rotation.y = Math.PI / 3 + Math.cos(t * 0.4) * 0.15;
    }
  });

  return (
    <group scale={1.1}>
      {/* Central Cyber Octahedron */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial
          color="#1e3a8a"
          roughness={0.2}
          metalness={0.8}
          emissive="#38bdf8"
          emissiveIntensity={0.35}
          wireframe
        />
      </mesh>
      {/* Inner Solid core */}
      <mesh>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      {/* Orbit Ring 1 */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[1.5, 0.02, 16, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
      </mesh>
      {/* Orbit Ring 2 */}
      <mesh ref={ringRef2}>
        <torusGeometry args={[1.8, 0.015, 16, 64]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// 2. AI Research: Neural Synaptic Cluster
function NeuralCluster() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
      groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.15;
    }
  });

  return (
    <group ref={groupRef} scale={1.05}>
      {/* Central Synaptic Nucleus */}
      <mesh>
        <icosahedronGeometry args={[0.75, 2]} />
        <meshStandardMaterial
          color="#581c87"
          roughness={0.3}
          metalness={0.7}
          emissive="#a855f7"
          emissiveIntensity={0.4}
          wireframe
        />
      </mesh>
      {/* Surrounding Neural Node Spheres */}
      {[
        [1.2, 0.4, 0.2],
        [-1.0, 0.8, -0.3],
        [0.3, -1.1, 0.5],
        [-0.8, -0.7, -0.6],
        [0.7, 0.9, -0.8],
        [-0.4, 1.2, 0.4],
      ].map((pos, idx) => (
        <group key={idx}>
          <mesh position={pos as [number, number, number]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color="#c084fc"
              emissive="#c084fc"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}
      {/* Outer Connecting Cage */}
      <mesh>
        <dodecahedronGeometry args={[1.6, 0]} />
        <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

// 3. Immersive Portfolio: Hyper-Torus Knot
function PortfolioKnot() {
  const knotRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (knotRef.current) {
      knotRef.current.rotation.x += delta * 0.35;
      knotRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group scale={0.95}>
      <mesh ref={knotRef}>
        <torusKnotGeometry args={[0.9, 0.28, 100, 16]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.15}
          metalness={0.85}
          emissive="#38bdf8"
          emissiveIntensity={0.25}
          wireframe
        />
      </mesh>
    </group>
  );
}

// 4. ATL Lab: Hardware Gyroscope & Circuit Hexagon
function HardwareGyro() {
  const g1 = useRef<THREE.Mesh>(null);
  const g2 = useRef<THREE.Mesh>(null);
  const g3 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (g1.current) g1.current.rotation.x += delta * 0.6;
    if (g2.current) g2.current.rotation.y += delta * 0.8;
    if (g3.current) g3.current.rotation.z += delta * 0.5;
  });

  return (
    <group scale={1.0}>
      {/* Center Microcontroller Prism */}
      <mesh>
        <boxGeometry args={[0.65, 0.65, 0.65]} />
        <meshStandardMaterial
          color="#064e3b"
          roughness={0.2}
          metalness={0.8}
          emissive="#34d399"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Outer Gimbal Rings */}
      <mesh ref={g1}>
        <torusGeometry args={[1.2, 0.025, 16, 48]} />
        <meshStandardMaterial color="#34d399" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh ref={g2}>
        <torusGeometry args={[1.45, 0.025, 16, 48]} />
        <meshStandardMaterial color="#10b981" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh ref={g3}>
        <torusGeometry args={[1.7, 0.02, 16, 48]} />
        <meshStandardMaterial color="#6ee7b7" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

export default function Project3DVisualizer({ type }: VisualizerProps) {
  const { pixelRatio } = useMobileDetect();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return null;
  }

  return (
    <div className="w-full h-full pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 42 }}
        dpr={pixelRatio}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 3]} intensity={1.8} color="#ffffff" />
        <pointLight position={[-2, -3, 2]} intensity={1.2} color="#38bdf8" />
        {type.includes('NEXUS') ? (
          <NexusCore />
        ) : type.includes('AI Research') ? (
          <NeuralCluster />
        ) : type.includes('Portfolio') ? (
          <PortfolioKnot />
        ) : (
          <HardwareGyro />
        )}
      </Canvas>
    </div>
  );
}
