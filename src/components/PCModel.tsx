'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { globalScrollProgress } from '@/hooks/useScrollProgress';
import { useMousePosition } from '@/hooks/useMousePosition';

// Create a high-res glowing terminal texture for the monitor
function useTerminalTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Background
    ctx.fillStyle = '#060810';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Terminal header bar
    ctx.fillStyle = '#0f1422';
    ctx.fillRect(0, 0, canvas.width, 42);

    // Traffic light buttons
    ctx.fillStyle = '#ff5f56';
    ctx.beginPath();
    ctx.arc(24, 21, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffbd2e';
    ctx.beginPath();
    ctx.arc(46, 21, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#27c93f';
    ctx.beginPath();
    ctx.arc(68, 21, 6, 0, Math.PI * 2);
    ctx.fill();

    // Header text
    ctx.fillStyle = '#64748b';
    ctx.font = '16px monospace';
    ctx.fillText('himanish@system: ~ /core-architecture', 100, 26);

    // Terminal body content
    ctx.fillStyle = '#4a9eff';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('> HIMANISH CORE WORKSTATION v4.2', 36, 90);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '20px monospace';
    ctx.fillText('[SYS_INIT] Full-Stack Systems ...... [ONLINE]', 36, 130);
    ctx.fillText('[SECURITY] Packet Telemetry ........ [ACTIVE]', 36, 165);
    ctx.fillText('[NEURAL]   AI Embedding Engine ..... [READY]', 36, 200);
    ctx.fillText('[CREATIVE] WebGL / 3D Pipelines .... [SYNCHRONIZED]', 36, 235);
    ctx.fillText('[ATL_LAB]  Rapid Hardware Matrix ... [CONNECTED]', 36, 270);

    // Diagnostic bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(36, 310, 952, 28);
    ctx.fillStyle = '#4a9eff';
    ctx.fillRect(36, 310, 780, 28);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '18px monospace';
    ctx.fillText('COOLING LOOP: 22.4°C • TENSOR FLOW RATE: OPTIMAL (128 TFLOPS)', 36, 375);

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('STATUS: READY FOR SCROLL DISASSEMBLY _', 36, 425);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

interface PCModelProps {
  isMobile: boolean;
}

export default function PCModel({ isMobile }: PCModelProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const towerRef = useRef<THREE.Group>(null);
  const glassPanelRef = useRef<THREE.Mesh>(null);
  const gpuRef = useRef<THREE.Group>(null);
  const coolerRef = useRef<THREE.Group>(null);
  const ramRef = useRef<THREE.Group>(null);
  const monitorRef = useRef<THREE.Group>(null);

  const mouse = useMousePosition();
  const terminalTexture = useTerminalTexture();

  // Smooth lerped scroll progress
  const smoothProgress = useRef(0);

  useFrame((state, delta) => {
    // Smooth lerping of scroll target
    const target = globalScrollProgress.target;
    smoothProgress.current = THREE.MathUtils.lerp(smoothProgress.current, target, 0.08);
    const p = smoothProgress.current;

    if (!rootGroupRef.current) return;

    // 1. Overall Rig Rotation & Tilt
    // At scroll=0, subtle angled presentation. As user scrolls, smooth 360-degree rotation and dynamic tilt
    const baseRotY = -0.35 + p * Math.PI * 1.6;
    const baseRotX = 0.12 + p * 0.18;

    // Mouse parallax contribution (dampened during deep scroll)
    const mouseInfluence = Math.max(1 - p * 1.2, 0.1);
    rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      rootGroupRef.current.rotation.y,
      baseRotY + (isMobile ? 0 : mouse.x * 0.15 * mouseInfluence),
      0.08
    );
    rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      rootGroupRef.current.rotation.x,
      baseRotX + (isMobile ? 0 : mouse.y * 0.1 * mouseInfluence),
      0.08
    );

    // Overall position shift on scroll (moves slightly left to let editorial text breathe, and floats up)
    rootGroupRef.current.position.y = THREE.MathUtils.lerp(
      rootGroupRef.current.position.y,
      -0.2 + p * 0.4,
      0.08
    );
    rootGroupRef.current.position.x = THREE.MathUtils.lerp(
      rootGroupRef.current.position.x,
      isMobile ? 0 : 0.4 - p * 0.3,
      0.08
    );

    // 2. Exploded Component Rig Disassembly
    // Glass panel slides outward on X axis
    if (glassPanelRef.current) {
      const glassExplode = p * (isMobile ? 0.8 : 1.6);
      glassPanelRef.current.position.x = THREE.MathUtils.lerp(
        glassPanelRef.current.position.x,
        0.52 + glassExplode,
        0.1
      );
      glassPanelRef.current.position.z = THREE.MathUtils.lerp(
        glassPanelRef.current.position.z,
        glassExplode * 0.3,
        0.1
      );
    }

    // GPU separates from PCIe slot and floats outward along Z & Y
    if (gpuRef.current) {
      const gpuExplode = p * (isMobile ? 0.7 : 1.4);
      gpuRef.current.position.z = THREE.MathUtils.lerp(
        gpuRef.current.position.z,
        gpuExplode * 0.9,
        0.1
      );
      gpuRef.current.position.y = THREE.MathUtils.lerp(
        gpuRef.current.position.y,
        -0.2 - gpuExplode * 0.4,
        0.1
      );
      gpuRef.current.rotation.z = THREE.MathUtils.lerp(
        gpuRef.current.rotation.z,
        p * 0.15,
        0.1
      );
    }

    // Liquid CPU Cooler waterblock floats forward and upward
    if (coolerRef.current) {
      const coolerExplode = p * (isMobile ? 0.6 : 1.2);
      coolerRef.current.position.z = THREE.MathUtils.lerp(
        coolerRef.current.position.z,
        coolerExplode * 0.8,
        0.1
      );
      coolerRef.current.position.y = THREE.MathUtils.lerp(
        coolerRef.current.position.y,
        0.35 + coolerExplode * 0.3,
        0.1
      );
    }

    // RAM sticks elevate upwards from the motherboard
    if (ramRef.current) {
      const ramExplode = p * (isMobile ? 0.5 : 1.0);
      ramRef.current.position.y = THREE.MathUtils.lerp(
        ramRef.current.position.y,
        0.45 + ramExplode * 0.6,
        0.1
      );
      ramRef.current.position.z = THREE.MathUtils.lerp(
        ramRef.current.position.z,
        ramExplode * 0.4,
        0.1
      );
    }

    // Monitor separates slightly backwards for layered perspective
    if (monitorRef.current) {
      monitorRef.current.position.z = THREE.MathUtils.lerp(
        monitorRef.current.position.z,
        -1.2 - p * 0.6,
        0.08
      );
    }
  });

  return (
    <group ref={rootGroupRef} scale={isMobile ? 0.75 : 1.05}>
      {/* ────────────────── 1. PC TOWER CHASSIS ────────────────── */}
      <group ref={towerRef} position={[1.1, 0, 0]}>
        {/* Main Obsidian Chassis Frame */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.0, 1.9, 1.8]} />
          <meshPhysicalMaterial
            color="#0b0b12"
            roughness={0.25}
            metalness={0.85}
            clearcoat={0.6}
            clearcoatRoughness={0.15}
          />
        </mesh>

        {/* Front Panel with Cyber Grille & Accent LED strip */}
        <mesh position={[0, 0, 0.91]}>
          <boxGeometry args={[0.96, 1.86, 0.04]} />
          <meshStandardMaterial color="#08080e" roughness={0.4} metalness={0.9} />
        </mesh>
        {/* Vertical front LED light strip */}
        <mesh position={[0, 0, 0.94]}>
          <boxGeometry args={[0.04, 1.6, 0.02]} />
          <meshBasicMaterial color="#4a9eff" />
        </mesh>

        {/* Interior Cavity Cutout (Simulated Dark Chamber) */}
        <mesh position={[0.05, 0.1, 0]}>
          <boxGeometry args={[0.85, 1.45, 1.55]} />
          <meshStandardMaterial color="#07070a" roughness={0.8} />
        </mesh>

        {/* PSU Shroud (Bottom Chamber) */}
        <mesh position={[0.05, -0.65, 0]}>
          <boxGeometry args={[0.88, 0.45, 1.58]} />
          <meshStandardMaterial color="#101018" roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Tempered Glass Side Panel (Explodes on scroll along +X) */}
        <mesh ref={glassPanelRef} position={[0.52, 0, 0]}>
          <boxGeometry args={[0.03, 1.85, 1.75]} />
          <meshPhysicalMaterial
            color="#141c2c"
            transmission={0.85}
            opacity={0.5}
            transparent={true}
            roughness={0.05}
            metalness={0.2}
            reflectivity={0.9}
          />
        </mesh>

        {/* ────────── MOTHERBOARD & INTERNAL ARCHITECTURE ────────── */}
        {/* Motherboard Backplate */}
        <mesh position={[-0.32, 0.1, 0]}>
          <boxGeometry args={[0.04, 1.25, 1.35]} />
          <meshStandardMaterial color="#161922" roughness={0.6} metalness={0.4} />
        </mesh>

        {/* Motherboard Circuit Lines Accent */}
        <mesh position={[-0.29, 0.1, 0]}>
          <planeGeometry args={[1.3, 1.2]} />
          <meshBasicMaterial color="#38bdf8" wireframe={true} transparent opacity={0.12} />
        </mesh>

        {/* ────────── EXPLODING GPU (GRAPHICS CARD) ────────── */}
        <group ref={gpuRef} position={[-0.05, -0.22, 0]}>
          {/* Main GPU Shroud */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.42, 0.28, 1.2]} />
            <meshPhysicalMaterial
              color="#0e111a"
              roughness={0.3}
              metalness={0.85}
              clearcoat={0.5}
            />
          </mesh>
          {/* Glowing GPU Backplate Brand Stripe */}
          <mesh position={[0.22, 0.05, 0]}>
            <boxGeometry args={[0.02, 0.06, 0.8]} />
            <meshBasicMaterial color="#4a9eff" />
          </mesh>
          {/* Triple Cooling Fans Indicators */}
          {[-0.32, 0, 0.32].map((zOffset, idx) => (
            <mesh key={idx} position={[0, -0.15, zOffset]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.02, 16]} />
              <meshStandardMaterial color="#08080c" roughness={0.6} />
            </mesh>
          ))}
        </group>

        {/* ────────── EXPLODING LIQUID COOLER & TUBES ────────── */}
        <group ref={coolerRef} position={[-0.15, 0.35, 0]}>
          {/* Circular CPU Waterblock Pump */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.08, 24]} />
            <meshStandardMaterial color="#111520" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Glowing Infinity Mirror Center Ring on Waterblock */}
          <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.14, 0.14, 0.02, 24]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>

          {/* Neon Liquid Coolant Tubes curving upward to radiator */}
          <mesh position={[-0.02, 0.35, 0.15]}>
            <cylinderGeometry args={[0.025, 0.025, 0.65, 12]} />
            <meshPhysicalMaterial
              color="#4a9eff"
              emissive="#1e40af"
              emissiveIntensity={0.8}
              roughness={0.1}
              transmission={0.4}
              transparent
              opacity={0.85}
            />
          </mesh>
          <mesh position={[-0.02, 0.35, -0.15]}>
            <cylinderGeometry args={[0.025, 0.025, 0.65, 12]} />
            <meshPhysicalMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={0.8}
              roughness={0.1}
              transmission={0.4}
              transparent
              opacity={0.85}
            />
          </mesh>
        </group>

        {/* ────────── EXPLODING RAM STICKS ────────── */}
        <group ref={ramRef} position={[-0.12, 0.45, 0.3]}>
          {[-0.06, -0.02, 0.02, 0.06].map((zPos, idx) => (
            <group key={idx} position={[0, 0, zPos]}>
              <mesh>
                <boxGeometry args={[0.04, 0.32, 0.025]} />
                <meshStandardMaterial color="#1e2230" metalness={0.7} />
              </mesh>
              {/* RGB Glowing Top Spine */}
              <mesh position={[0, 0.165, 0]}>
                <boxGeometry args={[0.038, 0.02, 0.024]} />
                <meshBasicMaterial color="#4a9eff" />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ────────────────── 2. ULTRAWIDE DISPLAY / MONITOR ────────────────── */}
      <group ref={monitorRef} position={[-0.8, 0.1, -0.3]}>
        {/* Monitor Screen Frame & Bezel */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.5, 1.35, 0.06]} />
          <meshPhysicalMaterial color="#0a0a0f" roughness={0.3} metalness={0.85} />
        </mesh>

        {/* Monitor Screen Panel with Dynamic Terminal Texture */}
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[2.42, 1.27]} />
          {terminalTexture ? (
            <meshBasicMaterial map={terminalTexture} />
          ) : (
            <meshBasicMaterial color="#080c18" />
          )}
        </mesh>

        {/* Monitor Ergonomic Stand & Base */}
        <mesh position={[0, -0.75, -0.2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.9, 16]} />
          <meshStandardMaterial color="#12121a" roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0, -1.18, 0]}>
          <boxGeometry args={[0.7, 0.04, 0.5]} />
          <meshStandardMaterial color="#14141e" roughness={0.3} metalness={0.85} />
        </mesh>
      </group>

      {/* ────────────────── 3. MECHANICAL KEYBOARD & DESK ────────────────── */}
      <group position={[-0.7, -1.15, 0.6]}>
        {/* Keyboard Base Case */}
        <mesh position={[0, 0, 0]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[1.2, 0.06, 0.45]} />
          <meshPhysicalMaterial color="#0c0e14" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Backlit Keycap Matrix Rows */}
        <mesh position={[0, 0.035, 0]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[1.14, 0.02, 0.39]} />
          <meshStandardMaterial color="#181c28" roughness={0.6} />
        </mesh>
        {/* Under-glow RGB ambient line */}
        <mesh position={[0, 0, 0.23]}>
          <boxGeometry args={[1.2, 0.015, 0.01]} />
          <meshBasicMaterial color="#4a9eff" />
        </mesh>
      </group>

      {/* ────────────────── 4. DESK SURFACE MAT ────────────────── */}
      <mesh position={[0, -1.22, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.5, 4.5]} />
        <meshStandardMaterial color="#040407" roughness={0.9} />
      </mesh>
    </group>
  );
}
