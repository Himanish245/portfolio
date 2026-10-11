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
    ctx.fillText('himanish@hardware-rig: ~ /telemetry-dashboard', 100, 28);

    // Main terminal output
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('> HIMANISH WORKSTATION CORE // LIVE TELEMETRY', 36, 92);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '19px monospace';
    ctx.fillText('[CHASSIS] Obsidian Alloy Frame .......... [MOUNTED]', 36, 134);
    ctx.fillText('[GPU]     RTX Neural Engine (Dual Fan) ... [DISASSEMBLING]', 36, 172);
    ctx.fillText('[COOLING] Liquid Loop @ 21.8°C ........... [PUMP ENGAGED]', 36, 210);
    ctx.fillText('[MEMORY]  DDR5 High-Speed Channel ........ [EXPANDED]', 36, 248);
    ctx.fillText('[SECURITY] Packet Inspection Engine ...... [ARMED]', 36, 286);

    // Diagnostic bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(36, 330, 952, 24);
    ctx.fillStyle = '#4a9eff';
    ctx.fillRect(36, 330, 810, 24);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.fillText('SCROLL PROGRESS LINKED • REAL-TIME HARDWARE KINEMATICS', 36, 395);

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('STATUS: SCROLLING TO EXPLODE 3D ARCHITECTURE _', 36, 445);

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
  const smoothProgress = useRef(0);

  useFrame((state, delta) => {
    // Smooth responsive lerp of scroll target
    const target = globalScrollProgress.target;
    smoothProgress.current = THREE.MathUtils.lerp(smoothProgress.current, target, 0.12);
    const p = smoothProgress.current;

    if (!rootGroupRef.current) return;

    // ──────────────── 1. DRAMATIC CAR-LIKE 3D MOVEMENT ────────────────
    // Horizontal drift across screen (like a car moving into frame and cornering)
    const targetX = isMobile ? 0 : THREE.MathUtils.lerp(0.5, -0.45, p);
    // Vertical floating elevation
    const targetY = THREE.MathUtils.lerp(-0.15, 0.25, p);
    // Depth zoom (glides forward toward user like a car accelerating forward)
    const targetZ = THREE.MathUtils.lerp(0, 0.9, p);

    rootGroupRef.current.position.x = THREE.MathUtils.lerp(rootGroupRef.current.position.x, targetX, 0.1);
    rootGroupRef.current.position.y = THREE.MathUtils.lerp(rootGroupRef.current.position.y, targetY, 0.1);
    rootGroupRef.current.position.z = THREE.MathUtils.lerp(rootGroupRef.current.position.z, targetZ, 0.1);

    // 360-degree dynamic steering rotation (spins and showcases all angles)
    const targetRotY = -0.35 + p * Math.PI * 2.1;
    // Banking/tilt angle as if carving a turn
    const targetRotX = 0.12 + Math.sin(p * Math.PI) * 0.22;
    const targetRotZ = Math.sin(p * Math.PI) * -0.15;

    // Subtle mouse parallax when near top
    const mouseDamp = Math.max(1 - p * 1.5, 0.05);
    const mouseRotY = isMobile ? 0 : mouse.x * 0.18 * mouseDamp;
    const mouseRotX = isMobile ? 0 : mouse.y * 0.12 * mouseDamp;

    rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      rootGroupRef.current.rotation.y,
      targetRotY + mouseRotY,
      0.1
    );
    rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      rootGroupRef.current.rotation.x,
      targetRotX + mouseRotX,
      0.1
    );
    rootGroupRef.current.rotation.z = THREE.MathUtils.lerp(
      rootGroupRef.current.rotation.z,
      targetRotZ,
      0.1
    );

    // ──────────────── 2. EXPLODED COMPONENT DISASSEMBLY ────────────────
    // Glass panel flies outward horizontally
    if (glassPanelRef.current) {
      const glassExplode = p * (isMobile ? 1.0 : 2.2);
      glassPanelRef.current.position.x = 0.52 + glassExplode;
      glassPanelRef.current.position.z = glassExplode * 0.35;
      glassPanelRef.current.rotation.y = p * 0.3;
    }

    // GPU pulls out from PCIe socket and floats forward into view
    if (gpuRef.current) {
      const gpuExplode = p * (isMobile ? 0.9 : 1.9);
      gpuRef.current.position.z = gpuExplode * 1.1;
      gpuRef.current.position.y = -0.22 - gpuExplode * 0.45;
      gpuRef.current.position.x = -0.05 + gpuExplode * 0.25;
      gpuRef.current.rotation.z = p * 0.25;
      gpuRef.current.rotation.y = -p * 0.2;
    }

    // Liquid CPU Cooler waterblock and glowing tubes detach and elevate
    if (coolerRef.current) {
      const coolerExplode = p * (isMobile ? 0.8 : 1.6);
      coolerRef.current.position.z = coolerExplode * 1.0;
      coolerRef.current.position.y = 0.35 + coolerExplode * 0.45;
      coolerRef.current.position.x = -0.15 + coolerExplode * 0.2;
    }

    // RAM sticks shoot upwards out of the DIMM slots
    if (ramRef.current) {
      const ramExplode = p * (isMobile ? 0.7 : 1.4);
      ramRef.current.position.y = 0.45 + ramExplode * 0.85;
      ramRef.current.position.z = ramExplode * 0.5;
    }

    // Monitor pulls backward and angles for depth separation
    if (monitorRef.current) {
      monitorRef.current.position.z = -0.3 - p * 0.8;
      monitorRef.current.position.x = -0.8 - p * 0.4;
      monitorRef.current.rotation.y = -p * 0.3;
    }

    // Keyboard drifts slightly forward and spreads
    if (keyboardRef.current) {
      keyboardRef.current.position.z = 0.6 + p * 0.6;
      keyboardRef.current.position.y = -1.15 - p * 0.2;
    }
  });

  return (
    <group ref={rootGroupRef} scale={isMobile ? 0.72 : 1.05}>
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
              color="#4a9eff"
              emissive="#1e40af"
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
        <mesh position={[0, 0, 0.23]}>
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
