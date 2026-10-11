'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { globalScrollProgress } from '@/hooks/useScrollProgress';

function smoothstep(min: number, max: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

// Glowing RTX 5090 brand badge texture
function useGPUTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#080a12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Glowing border line
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

    // GeForce RTX Text
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 36px monospace';
    ctx.fillText('GEFORCE RTX', 28, 76);

    // 5090 Neon Cyan Badge
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 44px monospace';
    ctx.fillText('5090', 330, 80);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

// High-resolution glowing terminal display texture for the monitor
function useTerminalTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#04060d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title bar
    ctx.fillStyle = '#0a0e1c';
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
    ctx.fillText('himanish@rig-terminal: ~ /telemetry', 100, 28);

    // Main telemetry
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('> HIMANISH WORKSTATION // RTX 5090 WORKBENCH', 36, 92);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '19px monospace';
    ctx.fillText('[GPU]  NVIDIA GEFORCE RTX 5090 (32GB GDDR7) ... [READY]', 36, 134);
    ctx.fillText('[VRAM] 32GB @ 28 Gbps • 21,760 CUDA CORES ..... [OPTIMAL]', 36, 172);
    ctx.fillText('[MB]   Z890 HERO DARK • REINFORCED PCIE 5.0 ... [MOUNTED]', 36, 210);
    ctx.fillText('[AIO]  360mm INFINITY MIRROR LOOP @ 22.4°C .... [PUMP 100%]', 36, 248);
    ctx.fillText('[RAM]  64GB DDR5-7200 RGB QUAD-CHANNEL ........ [ENGAGED]', 36, 286);

    // Diagnostic bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(36, 330, 952, 24);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(36, 330, 880, 24);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.fillText('RTX 5090 TEMPERATURE: 34.8°C • RGB COLOR HARMONY: SYNCHRONIZED', 36, 395);

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('SYSTEM LIVE • SCROLL TO EXPLODE HARDWARE _', 36, 445);

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

  const gpuTexture = useGPUTexture();
  const terminalTexture = useTerminalTexture();
  const smoothP = useRef(0);

  useFrame((state, delta) => {
    const target = globalScrollProgress.target;
    smoothP.current = THREE.MathUtils.damp(smoothP.current, target, 7, delta);
    const p = smoothP.current;
    const time = state.clock.getElapsedTime();

    if (!rootGroupRef.current) return;

    // ──────────────── 1. UNIFIED, CONSISTENT TRAJECTORY ────────────────
    const PEAK = 0.38;
    const t1 = smoothstep(0, PEAK, p);
    const t2 = smoothstep(PEAK, 1.0, p);

    // Position X: 0.65 (hero right) -> 0.0 (center pop) -> 1.45 (docked bottom-right)
    const posX = p <= PEAK
      ? THREE.MathUtils.lerp(0.65, 0.0, t1)
      : THREE.MathUtils.lerp(0.0, isMobile ? 0.0 : 1.45, t2);

    // Position Y: Stays cleanly below text before scroll (-0.85) -> Pops up (+0.25) -> Docks (-1.0)
    const heroY = isMobile ? -1.15 : -0.85;
    const popY = isMobile ? 0.08 : 0.25;
    const dockY = isMobile ? -1.35 : -1.0;

    const baseY = p <= PEAK
      ? THREE.MathUtils.lerp(heroY, popY, t1)
      : THREE.MathUtils.lerp(popY, dockY, t2);

    const idleFloat = Math.sin(time * 1.8) * 0.035 * t2;
    const posY = baseY + idleFloat;

    // Position Z: 0.0 (hero) -> +2.0 (surges forward towards user) -> -0.4 (settled back)
    const posZ = p <= PEAK
      ? THREE.MathUtils.lerp(0.0, 2.0, t1)
      : THREE.MathUtils.lerp(2.0, -0.4, t2);

    rootGroupRef.current.position.set(posX, posY, posZ);

    // Responsive Scale: compact unobtrusive dock on mobile
    const baseScale = isMobile ? 0.58 : 0.88;
    const peakScale = isMobile ? 0.82 : 1.2;
    const dockScale = isMobile ? 0.35 : 0.52;

    const scale = p <= PEAK
      ? THREE.MathUtils.lerp(baseScale, peakScale, t1)
      : THREE.MathUtils.lerp(peakScale, dockScale, t2);

    rootGroupRef.current.scale.setScalar(scale);

    // Rotation Y: Strictly monotonic forward turn from -0.35 to 1.85
    const rotY = THREE.MathUtils.lerp(-0.35, 1.85, p);
    const rotX = THREE.MathUtils.lerp(0.12, 0.15, p) + Math.sin(p * Math.PI) * 0.1;

    const mouseInfluence = isMobile ? 0 : 0.08 * (1 - p * 0.5);
    rootGroupRef.current.rotation.y = rotY + state.pointer.x * mouseInfluence;
    rootGroupRef.current.rotation.x = rotX - state.pointer.y * mouseInfluence;

    // ──────────────── 2. PART DISASSEMBLY ────────────────
    const explosion = p <= PEAK ? t1 : (1 - t2);

    // Glass panel
    if (glassPanelRef.current) {
      const glassDist = explosion * (isMobile ? 1.4 : 2.6);
      glassPanelRef.current.position.x = 0.52 + glassDist;
      glassPanelRef.current.position.z = glassDist * 0.35;
    }

    // RTX 5090 GPU floats forward
    if (gpuRef.current) {
      const gpuDist = explosion * (isMobile ? 1.1 : 2.0);
      gpuRef.current.position.z = gpuDist * 1.1;
      gpuRef.current.position.y = -0.22 - gpuDist * 0.45;
      gpuRef.current.position.x = -0.05 + gpuDist * 0.3;
      gpuRef.current.rotation.z = explosion * 0.25;
    }

    // AIO CPU Cooler & tubes
    if (coolerRef.current) {
      const coolerDist = explosion * (isMobile ? 0.9 : 1.7);
      coolerRef.current.position.z = coolerDist * 0.9;
      coolerRef.current.position.y = 0.35 + coolerDist * 0.5;
    }

    // RGB RAM modules
    if (ramRef.current) {
      const ramDist = explosion * (isMobile ? 0.8 : 1.5);
      ramRef.current.position.y = 0.45 + ramDist * 0.9;
      ramRef.current.position.z = ramDist * 0.4;
    }

    // Monitor separates
    if (monitorRef.current) {
      const monitorDist = explosion * 0.7;
      monitorRef.current.position.z = -0.3 - monitorDist;
      monitorRef.current.position.x = -0.8 - monitorDist * 0.5;
    }
  });

  return (
    <group ref={rootGroupRef}>
      {/* ────────────────── 1. PC TOWER CHASSIS ────────────────── */}
      <group ref={towerRef} position={[1.1, 0, 0]}>
        {/* Outer Obsidian Frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.05, 1.95, 1.85]} />
          <meshPhysicalMaterial
            color="#080a10"
            roughness={0.25}
            metalness={0.9}
            clearcoat={0.7}
            clearcoatRoughness={0.15}
          />
        </mesh>

        {/* Front Panel with Cyber Grille & LED Light Blade */}
        <mesh position={[0, 0, 0.93]}>
          <boxGeometry args={[0.98, 1.88, 0.04]} />
          <meshStandardMaterial color="#06080e" roughness={0.4} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.96]}>
          <boxGeometry args={[0.03, 1.65, 0.02]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Internal Chamber Cutout */}
        <mesh position={[0.05, 0.1, 0]}>
          <boxGeometry args={[0.9, 1.48, 1.6]} />
          <meshStandardMaterial color="#05060a" roughness={0.8} />
        </mesh>

        {/* PSU Shroud (Bottom Chamber) with Embossed Accent */}
        <mesh position={[0.05, -0.65, 0]}>
          <boxGeometry args={[0.92, 0.46, 1.62]} />
          <meshStandardMaterial color="#0e111a" roughness={0.35} metalness={0.8} />
        </mesh>
        {/* PSU Shroud RGB Ambient Line */}
        <mesh position={[0.5, -0.42, 0]}>
          <boxGeometry args={[0.02, 0.02, 1.55]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Ultra-Clear Tempered Glass Side Panel (High-Performance Glass) */}
        <mesh ref={glassPanelRef} position={[0.52, 0, 0]}>
          <boxGeometry args={[0.02, 1.88, 1.78]} />
          <meshPhysicalMaterial
            color="#080e1e"
            opacity={0.2}
            transparent={true}
            roughness={0.04}
            metalness={0.12}
            clearcoat={1.0}
            clearcoatRoughness={0.06}
            reflectivity={0.95}
          />
        </mesh>

        {/* Internal Case Dynamic RGB Lighting (casts real light on components) */}
        <pointLight position={[0.1, 0.6, 0.2]} intensity={2.4} color="#38bdf8" distance={2.5} />
        <pointLight position={[0.1, -0.1, -0.2]} intensity={1.8} color="#a855f7" distance={2.5} />

        {/* ────────── MOTHERBOARD (DETAILED WITH HEATSINKS & PCIE) ────────── */}
        {/* Motherboard PCB Backplate */}
        <mesh position={[-0.34, 0.12, 0]}>
          <boxGeometry args={[0.03, 1.3, 1.4]} />
          <meshStandardMaterial color="#0b0e14" roughness={0.5} metalness={0.5} />
        </mesh>

        {/* Motherboard Golden Circuit Trace Overlay */}
        <mesh position={[-0.32, 0.12, 0]}>
          <planeGeometry args={[1.35, 1.25]} />
          <meshBasicMaterial color="#38bdf8" wireframe={true} transparent opacity={0.14} />
        </mesh>

        {/* VRM Heatsink Top (Machined Aluminum) */}
        <mesh position={[-0.3, 0.6, 0]}>
          <boxGeometry args={[0.07, 0.14, 0.7]} />
          <meshStandardMaterial color="#1a1e2a" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* VRM Heatsink Left (Flanking CPU) */}
        <mesh position={[-0.3, 0.35, -0.32]}>
          <boxGeometry args={[0.07, 0.45, 0.14]} />
          <meshStandardMaterial color="#1a1e2a" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Chipset & M.2 NVMe Armor Shield (with RGB cyber stripe) */}
        <mesh position={[-0.3, -0.42, 0.25]}>
          <boxGeometry args={[0.06, 0.25, 0.65]} />
          <meshStandardMaterial color="#151924" roughness={0.25} metalness={0.85} />
        </mesh>
        <mesh position={[-0.26, -0.42, 0.25]}>
          <boxGeometry args={[0.01, 0.02, 0.55]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Steel-Reinforced PCIe 5.0 x16 Slot */}
        <mesh position={[-0.28, -0.1, 0]}>
          <boxGeometry args={[0.05, 0.04, 1.1]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.95} />
        </mesh>

        {/* ────────── FLAGSHIP NVIDIA GEFORCE RTX 5090 GPU ────────── */}
        <group ref={gpuRef} position={[-0.05, -0.22, 0]}>
          {/* Main Massive 3.5-Slot Shroud */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.44, 0.3, 1.35]} />
            <meshPhysicalMaterial
              color="#0c0e16"
              roughness={0.25}
              metalness={0.9}
              clearcoat={0.6}
            />
          </mesh>

          {/* Die-Cast Brushed Aluminum Backplate with Geometric Cutouts */}
          <mesh position={[0, 0.155, 0]}>
            <boxGeometry args={[0.42, 0.01, 1.32]} />
            <meshStandardMaterial color="#181c28" roughness={0.2} metalness={0.95} />
          </mesh>

          {/* Prominent Illuminated "GEFORCE RTX 5090" Side Badge */}
          <mesh position={[0.225, 0.06, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.95, 0.16]} />
            {gpuTexture ? (
              <meshBasicMaterial map={gpuTexture} transparent />
            ) : (
              <meshBasicMaterial color="#38bdf8" />
            )}
          </mesh>

          {/* Triple High-Performance Axial-Tech Fans with Glowing RGB Halos */}
          {[-0.42, 0, 0.42].map((zOffset, idx) => (
            <group key={idx} position={[0, -0.16, zOffset]}>
              {/* Fan Recessed Well */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.16, 0.16, 0.03, 20]} />
                <meshStandardMaterial color="#06070a" roughness={0.5} />
              </mesh>
              {/* Fan Blades Hub */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.04, 12]} />
                <meshStandardMaterial color="#1a1e2a" metalness={0.8} />
              </mesh>
              {/* Glowing RGB Fan Ring Halo */}
              <mesh position={[0, -0.015, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.145, 0.165, 24]} />
                <meshBasicMaterial color={idx === 1 ? '#38bdf8' : '#818cf8'} side={THREE.DoubleSide} />
              </mesh>
            </group>
          ))}

          {/* 16-Pin 12V-2x6 Power Connector with Braided Cables */}
          <group position={[0.18, 0.12, 0.35]}>
            <mesh>
              <boxGeometry args={[0.06, 0.05, 0.12]} />
              <meshStandardMaterial color="#0f1118" />
            </mesh>
            {/* Sleeved Cable Curves */}
            <mesh position={[0.05, 0.08, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.14, 8]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>
        </group>

        {/* ────────── AIO CPU LIQUID COOLER & TUBES ────────── */}
        <group ref={coolerRef} position={[-0.15, 0.35, 0]}>
          {/* Circular Pump Block (Infinity Mirror Housing) */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.09, 28]} />
            <meshStandardMaterial color="#0d111a" roughness={0.25} metalness={0.9} />
          </mesh>

          {/* Glowing Infinity Mirror Ring */}
          <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.16, 0.16, 0.02, 28]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>

          {/* Center Digital Temp Display (Simulated 24°C Glow) */}
          <mesh position={[0.065, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.01, 20]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>

          {/* Top 360mm Radiator Mounted at Case Ceiling */}
          <mesh position={[0.12, 0.58, 0]}>
            <boxGeometry args={[0.7, 0.08, 1.45]} />
            <meshStandardMaterial color="#111522" roughness={0.4} metalness={0.8} />
          </mesh>

          {/* Dual Braided Liquid Coolant Tubes */}
          <mesh position={[-0.02, 0.38, 0.15]}>
            <cylinderGeometry args={[0.026, 0.026, 0.65, 12]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={1.2}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[-0.02, 0.38, -0.15]}>
            <cylinderGeometry args={[0.026, 0.026, 0.65, 12]} />
            <meshStandardMaterial
              color="#818cf8"
              emissive="#4338ca"
              emissiveIntensity={1.2}
              roughness={0.2}
            />
          </mesh>
        </group>

        {/* ────────── 4x DDR5 RGB RAM MODULES ────────── */}
        <group ref={ramRef} position={[-0.12, 0.45, 0.32]}>
          {[-0.07, -0.025, 0.025, 0.07].map((zPos, idx) => (
            <group key={idx} position={[0, 0, zPos]}>
              {/* RAM Heatspreader */}
              <mesh>
                <boxGeometry args={[0.045, 0.34, 0.026]} />
                <meshStandardMaterial color="#141824" roughness={0.2} metalness={0.8} />
              </mesh>
              {/* Diffused RGB Top Spine */}
              <mesh position={[0, 0.175, 0]}>
                <boxGeometry args={[0.042, 0.024, 0.024]} />
                <meshBasicMaterial color={idx % 2 === 0 ? '#38bdf8' : '#a855f7'} />
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

      {/* ────────────────── 3. MECHANICAL KEYBOARD ────────────────── */}
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
      <mesh position={[0, -1.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial color="#040407" roughness={0.9} />
      </mesh>
    </group>
  );
}
