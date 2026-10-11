'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { globalScrollProgress } from '@/hooks/useScrollProgress';
import { useMousePosition } from '@/hooks/useMousePosition';

// High-resolution glowing terminal display texture for the monitor
function useTerminalTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Dark cyberpunk background
    ctx.fillStyle = '#050711';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title bar
    ctx.fillStyle = '#0c1122';
    ctx.fillRect(0, 0, canvas.width, 44);

    // Window controls
    ctx.fillStyle = '#ff5f56';
    ctx.beginPath();
    ctx.arc(26, 22, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffbd2e';
    ctx.beginPath();
    ctx.arc(48, 22, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#27c93f';
    ctx.beginPath();
    ctx.arc(70, 22, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#64748b';
    ctx.font = '16px monospace';
    ctx.fillText('himanish@foreground-companion: ~ /telemetry', 100, 28);

    // Main terminal output
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('> HIMANISH 3D WORKSTATION // FOREGROUND DOCK', 36, 92);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '19px monospace';
    ctx.fillText('[SYSTEM]   Full-Stack Core Engine ....... [ONLINE]', 36, 134);
    ctx.fillText('[SECURITY] Network Telemetry ............ [GUARDED]', 36, 172);
    ctx.fillText('[NEURAL]   Applied AI Pipeline .......... [ENGAGED]', 36, 210);
    ctx.fillText('[CREATIVE] 3D WebGL / Kinematics ........ [ACTIVE]', 36, 248);
    ctx.fillText('[STATUS]   POPPED OUT & DOCKED IN FOREGROUND', 36, 286);

    // Diagnostic bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(36, 330, 952, 24);
    ctx.fillStyle = '#4a9eff';
    ctx.fillRect(36, 330, 840, 24);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.fillText('COOLANT LOOP: 21.2°C • RTX CLOCK: 2700 MHz • KINEMATICS: 120 FPS', 36, 395);

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('FOREGROUND COMPANION ACTIVE • ENJOY BROWSING _', 36, 445);

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
  const keyboardRef = useRef<THREE.Group>(null);

  const mouse = useMousePosition();
  const terminalTexture = useTerminalTexture();

  // Smooth lerp states
  const smoothPop = useRef(0);
  const smoothSettle = useRef(0);

  useFrame((state) => {
    const popTarget = globalScrollProgress.popProgress;
    const settleTarget = globalScrollProgress.settleProgress;

    // Smooth responsive interpolation
    smoothPop.current = THREE.MathUtils.lerp(smoothPop.current, popTarget, 0.12);
    smoothSettle.current = THREE.MathUtils.lerp(smoothSettle.current, settleTarget, 0.08);

    const pop = smoothPop.current;
    const settle = smoothSettle.current;
    const time = state.clock.getElapsedTime();

    if (!rootGroupRef.current) return;

    // ──────────────── 1. DRAMATIC POP-OUT & SETTLE KINEMATICS ────────────────
    // Position X:
    // Starts at right in Hero (0.45) -> Swoops center during pop-out (0.0) -> SETTLES to bottom-right (1.48)
    const heroX = 0.45;
    const popX = 0.0;
    const settleX = isMobile ? 0.0 : 1.48;
    const currentX = settle > 0.01
      ? THREE.MathUtils.lerp(popX, settleX, settle)
      : THREE.MathUtils.lerp(heroX, popX, pop);

    // Position Y:
    // Starts at -0.15 -> Surges UP during pop-out (+0.35) -> SETTLES down low (-0.98)
    const heroY = -0.15;
    const popY = 0.35;
    const settleY = isMobile ? -1.25 : -0.98;
    const baseY = settle > 0.01
      ? THREE.MathUtils.lerp(popY, settleY, settle)
      : THREE.MathUtils.lerp(heroY, popY, pop);

    // Gentle floating idle breathing when settled
    const idleFloat = settle > 0.4 ? Math.sin(time * 1.8) * 0.04 : 0;
    const currentY = baseY + idleFloat;

    // Position Z (Depth):
    // Starts at 0 -> POPS OUT FORWARD toward the user (+2.2!) -> SETTLES into dock (-0.3)
    const heroZ = 0.0;
    const popZ = 2.2;
    const settleZ = -0.3;
    const currentZ = settle > 0.01
      ? THREE.MathUtils.lerp(popZ, settleZ, settle)
      : THREE.MathUtils.lerp(heroZ, popZ, pop);

    rootGroupRef.current.position.x = THREE.MathUtils.lerp(rootGroupRef.current.position.x, currentX, 0.12);
    rootGroupRef.current.position.y = THREE.MathUtils.lerp(rootGroupRef.current.position.y, currentY, 0.12);
    rootGroupRef.current.position.z = THREE.MathUtils.lerp(rootGroupRef.current.position.z, currentZ, 0.12);

    // Scale:
    // Starts at 1.05 -> POPS UP to 1.25 -> SETTLES down to 0.58 (desktop) / 0.42 (mobile)
    const heroScale = isMobile ? 0.75 : 1.05;
    const popScale = isMobile ? 0.95 : 1.25;
    const settleScale = isMobile ? 0.42 : 0.58;
    const currentScale = settle > 0.01
      ? THREE.MathUtils.lerp(popScale, settleScale, settle)
      : THREE.MathUtils.lerp(heroScale, popScale, pop);

    rootGroupRef.current.scale.setScalar(currentScale);

    // ──────────────── 2. ROTATION & ORIENTATION ────────────────
    // Spins 360° during pop-out, then settles into a clean angled showcase perspective (0.55 rad)
    const popRotY = -0.35 + pop * Math.PI * 2.0;
    const settleRotY = 0.55 + Math.sin(time * 0.8) * 0.03;
    const currentRotY = settle > 0.01
      ? THREE.MathUtils.lerp(popRotY, settleRotY, settle)
      : popRotY;

    // Banking tilt angle
    const popRotX = 0.12 + Math.sin(pop * Math.PI) * 0.25;
    const settleRotX = 0.15;
    const currentRotX = settle > 0.01
      ? THREE.MathUtils.lerp(popRotX, settleRotX, settle)
      : popRotX;

    // Mouse parallax
    const mouseInfluence = settle > 0.4 ? 0.06 : Math.max(1 - pop * 1.5, 0.05);
    const mouseRotY = isMobile ? 0 : mouse.x * 0.2 * mouseInfluence;
    const mouseRotX = isMobile ? 0 : mouse.y * 0.15 * mouseInfluence;

    rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(rootGroupRef.current.rotation.y, currentRotY + mouseRotY, 0.1);
    rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(rootGroupRef.current.rotation.x, currentRotX + mouseRotX, 0.1);

    // ──────────────── 3. DRAMATIC EXPLODED PART DISASSEMBLY ────────────────
    // Explodes vigorously during pop-out, then pulls into a compact semi-exploded dock
    const explosionFactor = Math.max(pop - settle * 0.65, 0);

    // Tempered glass panel flies out wide
    if (glassPanelRef.current) {
      const glassDist = explosionFactor * (isMobile ? 1.4 : 2.8);
      glassPanelRef.current.position.x = 0.52 + glassDist;
      glassPanelRef.current.position.z = glassDist * 0.35;
    }

    // GPU floats forward directly towards the screen
    if (gpuRef.current) {
      const gpuDist = explosionFactor * (isMobile ? 1.2 : 2.2);
      gpuRef.current.position.z = gpuDist * 1.2;
      gpuRef.current.position.y = -0.22 - gpuDist * 0.45;
      gpuRef.current.position.x = -0.05 + gpuDist * 0.3;
      gpuRef.current.rotation.z = explosionFactor * 0.3;
    }

    // CPU waterblock and liquid cooling tubes elevate
    if (coolerRef.current) {
      const coolerDist = explosionFactor * (isMobile ? 1.0 : 1.9);
      coolerRef.current.position.z = coolerDist * 1.0;
      coolerRef.current.position.y = 0.35 + coolerDist * 0.55;
    }

    // RAM sticks shoot up
    if (ramRef.current) {
      const ramDist = explosionFactor * (isMobile ? 0.9 : 1.7);
      ramRef.current.position.y = 0.45 + ramDist * 1.0;
      ramRef.current.position.z = ramDist * 0.45;
    }

    // Monitor separates for layered depth
    if (monitorRef.current) {
      const monitorDist = explosionFactor * 0.8;
      monitorRef.current.position.z = -0.3 - monitorDist;
      monitorRef.current.position.x = -0.8 - monitorDist * 0.6;
    }
  });

  return (
    <group ref={rootGroupRef}>
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

        {/* Front Cyber Grille with vertical LED blade */}
        <mesh position={[0, 0, 0.91]}>
          <boxGeometry args={[0.96, 1.86, 0.04]} />
          <meshStandardMaterial color="#08080e" roughness={0.4} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.94]}>
          <boxGeometry args={[0.04, 1.6, 0.02]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Internal Chamber Cutout */}
        <mesh position={[0.05, 0.1, 0]}>
          <boxGeometry args={[0.85, 1.45, 1.55]} />
          <meshStandardMaterial color="#07070a" roughness={0.8} />
        </mesh>

        {/* PSU Shroud (Bottom Chamber) */}
        <mesh position={[0.05, -0.65, 0]}>
          <boxGeometry args={[0.88, 0.45, 1.58]} />
          <meshStandardMaterial color="#101018" roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Tempered Glass Side Panel (Pops out on scroll) */}
        <mesh ref={glassPanelRef} position={[0.52, 0, 0]}>
          <boxGeometry args={[0.03, 1.85, 1.75]} />
          <meshPhysicalMaterial
            color="#141c2c"
            transmission={0.85}
            opacity={0.55}
            transparent={true}
            roughness={0.05}
            metalness={0.2}
            reflectivity={0.95}
          />
        </mesh>

        {/* ────────── MOTHERBOARD & INTERNAL ARCHITECTURE ────────── */}
        <mesh position={[-0.32, 0.1, 0]}>
          <boxGeometry args={[0.04, 1.25, 1.35]} />
          <meshStandardMaterial color="#161922" roughness={0.6} metalness={0.4} />
        </mesh>
        <mesh position={[-0.29, 0.1, 0]}>
          <planeGeometry args={[1.3, 1.2]} />
          <meshBasicMaterial color="#38bdf8" wireframe={true} transparent opacity={0.12} />
        </mesh>

        {/* ────────── EXPLODING GPU (GRAPHICS CARD) ────────── */}
        <group ref={gpuRef} position={[-0.05, -0.22, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.42, 0.28, 1.2]} />
            <meshPhysicalMaterial
              color="#0e111a"
              roughness={0.3}
              metalness={0.85}
              clearcoat={0.5}
            />
          </mesh>
          <mesh position={[0.22, 0.05, 0]}>
            <boxGeometry args={[0.02, 0.06, 0.8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          {[-0.32, 0, 0.32].map((zOffset, idx) => (
            <mesh key={idx} position={[0, -0.15, zOffset]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.02, 16]} />
              <meshStandardMaterial color="#08080c" roughness={0.6} />
            </mesh>
          ))}
        </group>

        {/* ────────── EXPLODING LIQUID COOLER & TUBES ────────── */}
        <group ref={coolerRef} position={[-0.15, 0.35, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.08, 24]} />
            <meshStandardMaterial color="#111520" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.14, 0.14, 0.02, 24]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[-0.02, 0.35, 0.15]}>
            <cylinderGeometry args={[0.025, 0.025, 0.65, 12]} />
            <meshPhysicalMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={0.85}
              roughness={0.1}
              transmission={0.4}
              transparent
              opacity={0.85}
            />
          </mesh>
          <mesh position={[-0.02, 0.35, -0.15]}>
            <cylinderGeometry args={[0.025, 0.025, 0.65, 12]} />
            <meshPhysicalMaterial
              color="#4a9eff"
              emissive="#1e40af"
              emissiveIntensity={0.85}
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
              <mesh position={[0, 0.165, 0]}>
                <boxGeometry args={[0.038, 0.02, 0.024]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ────────────────── 2. ULTRAWIDE DISPLAY / MONITOR ────────────────── */}
      <group ref={monitorRef} position={[-0.8, 0.1, -0.3]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.5, 1.35, 0.06]} />
          <meshPhysicalMaterial color="#0a0a0f" roughness={0.3} metalness={0.85} />
        </mesh>
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[2.42, 1.27]} />
          {terminalTexture ? (
            <meshBasicMaterial map={terminalTexture} />
          ) : (
            <meshBasicMaterial color="#080c18" />
          )}
        </mesh>
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
      <group ref={keyboardRef} position={[-0.7, -1.15, 0.6]}>
        <mesh position={[0, 0, 0]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[1.2, 0.06, 0.45]} />
          <meshPhysicalMaterial color="#0c0e14" roughness={0.4} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.035, 0]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[1.14, 0.02, 0.39]} />
          <meshStandardMaterial color="#181c28" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.23, 0.02]}>
          <boxGeometry args={[1.2, 0.015, 0.01]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* ────────────────── 4. DESK SURFACE ────────────────── */}
      <mesh position={[0, -1.22, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial color="#040407" roughness={0.9} />
      </mesh>
    </group>
  );
}
