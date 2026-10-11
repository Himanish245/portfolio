'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { globalScrollProgress } from '@/hooks/useScrollProgress';

function smoothstep(min: number, max: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

// Crisp, photorealistic RTX 5090 badge texture
function useGPUTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#05070d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Fine chamfered border
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

    // GeForce RTX Text
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('GEFORCE RTX', 28, 76);

    // 5090 Illuminated Badge
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 42px -apple-system, BlinkMacSystemFont, "Segoe UI", monospace';
    ctx.fillText('5090', 330, 80);

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

  // Separately articulated component groups for exploded-view choreography
  const chassisRef = useRef<THREE.Group>(null);
  const glassPanelRef = useRef<THREE.Mesh>(null);
  const frontPanelRef = useRef<THREE.Group>(null);
  const motherboardRef = useRef<THREE.Group>(null);
  const gpuRef = useRef<THREE.Group>(null);
  const coolerPumpRef = useRef<THREE.Group>(null);
  const radiatorRef = useRef<THREE.Group>(null);
  const ramRef = useRef<THREE.Group>(null);
  const psuRef = useRef<THREE.Group>(null);
  const fansFrontRef = useRef<THREE.Group>(null);

  const annotationsRef = useRef<HTMLDivElement>(null);

  const gpuTexture = useGPUTexture();
  const smoothP = useRef(0);

  useFrame((state, delta) => {
    const target = globalScrollProgress.target;
    smoothP.current = THREE.MathUtils.damp(smoothP.current, target, 7, delta);
    const p = smoothP.current;
    const time = state.clock.getElapsedTime();

    if (!rootGroupRef.current) return;

    // ──────────────── 4 CINEMATIC STAGES PROGRESSION ────────────────
    // Stage 1 (0.00 - 0.15): The Machine (Fully assembled, subtle studio float)
    // Stage 2 (0.15 - 0.35): The Reveal (Glass glides out, panels open)
    // Stage 3 (0.35 - 0.55): The Engineering (Full exploded assembly + technical labels)
    // Stage 4 (0.55 - 1.00): The Reassembly & Docking (Smooth reassembly into corner dock)

    const PEAK = 0.42; // Peak exploded arrangement at p = 0.42
    const tExplode = smoothstep(0.08, PEAK, p);
    const tReassemble = smoothstep(PEAK, 1.0, p);

    // ──────────────── KINEMATICS & TRAJECTORY ────────────────
    // Position X: 0.55 (Hero right) -> 0.0 (Exploded center) -> 1.45 (Docked bottom corner)
    const posX =
      p <= PEAK
        ? THREE.MathUtils.lerp(0.55, 0.0, tExplode)
        : THREE.MathUtils.lerp(0.0, isMobile ? 0.0 : 1.45, tReassemble);

    // Position Y: Stays cleanly below hero text (-0.85) -> Floats up to center (+0.20) -> Docks (-1.0)
    const heroY = isMobile ? -1.05 : -0.85;
    const popY = isMobile ? 0.12 : 0.22;
    const dockY = isMobile ? -1.35 : -1.0;

    const baseY =
      p <= PEAK
        ? THREE.MathUtils.lerp(heroY, popY, tExplode)
        : THREE.MathUtils.lerp(popY, dockY, tReassemble);

    // Gentle physical breathing float
    const idleFloat = Math.sin(time * 1.6) * (0.025 * (1 - tReassemble));
    const posY = baseY + idleFloat;

    // Position Z: 0.0 (Hero) -> +1.8 (Surges into dramatic foreground focus) -> -0.4 (Settles back)
    const posZ =
      p <= PEAK
        ? THREE.MathUtils.lerp(0.0, 1.8, tExplode)
        : THREE.MathUtils.lerp(1.8, -0.4, tReassemble);

    rootGroupRef.current.position.set(posX, posY, posZ);

    // Scale
    const baseScale = isMobile ? 0.65 : 0.95;
    const peakScale = isMobile ? 0.9 : 1.25;
    const dockScale = isMobile ? 0.38 : 0.54;

    const scale =
      p <= PEAK
        ? THREE.MathUtils.lerp(baseScale, peakScale, tExplode)
        : THREE.MathUtils.lerp(peakScale, dockScale, tReassemble);

    rootGroupRef.current.scale.setScalar(scale);

    // Rotation: Deliberate cinematic rotation presenting the hardware components
    // Begins angled (-0.45), turns towards user at peak (0.35), rotates into profile view when docking (1.85)
    const rotY =
      p <= PEAK
        ? THREE.MathUtils.lerp(-0.45, 0.42, tExplode)
        : THREE.MathUtils.lerp(0.42, 1.85, tReassemble);

    const rotX =
      p <= PEAK
        ? THREE.MathUtils.lerp(0.12, 0.16, tExplode)
        : THREE.MathUtils.lerp(0.16, 0.12, tReassemble);

    const mouseInfluence = isMobile ? 0 : 0.06 * (1 - tReassemble * 0.7);
    rootGroupRef.current.rotation.y = rotY + state.pointer.x * mouseInfluence;
    rootGroupRef.current.rotation.x = rotX - state.pointer.y * mouseInfluence;

    // ──────────────── EXPLODED VIEW SEPARATION CURVES ────────────────
    // The separation factor peaks at PEAK and smoothly collapses back to 0 at tReassemble
    const sep = p <= PEAK ? tExplode : 1 - tReassemble;

    // 1. Tempered Glass Panel slides outward on X axis (+X)
    if (glassPanelRef.current) {
      const glassDist = sep * (isMobile ? 1.2 : 2.2);
      glassPanelRef.current.position.x = 0.58 + glassDist;
      glassPanelRef.current.position.z = -glassDist * 0.15;
    }

    // 2. Front Panel slides forward on Z axis (+Z)
    if (frontPanelRef.current) {
      const frontDist = sep * (isMobile ? 0.9 : 1.6);
      frontPanelRef.current.position.z = 1.05 + frontDist;
    }

    // 3. Front Intake Fans move along with front panel
    if (fansFrontRef.current) {
      const fanDist = sep * (isMobile ? 0.6 : 1.1);
      fansFrontRef.current.position.z = 0.88 + fanDist;
    }

    // 4. GPU RTX 5090 floats forward and rotates to reveal cooling architecture
    if (gpuRef.current) {
      const gpuDistZ = sep * (isMobile ? 1.0 : 1.95);
      const gpuDistY = sep * (isMobile ? -0.2 : -0.35);
      const gpuDistX = sep * 0.25;
      gpuRef.current.position.set(-0.02 + gpuDistX, -0.25 + gpuDistY, 0.05 + gpuDistZ);
      gpuRef.current.rotation.z = sep * 0.18;
      gpuRef.current.rotation.x = -sep * 0.12;
    }

    // 5. RAM modules lift straight upward out of DIMM slots (+Y)
    if (ramRef.current) {
      const ramDistY = sep * (isMobile ? 0.7 : 1.35);
      ramRef.current.position.y = 0.45 + ramDistY;
      ramRef.current.position.x = -0.12 + sep * 0.15;
    }

    // 6. CPU Cooler Pump Block moves outward (+X / +Z)
    if (coolerPumpRef.current) {
      const pumpDistX = sep * (isMobile ? 0.7 : 1.45);
      const pumpDistZ = sep * 0.35;
      coolerPumpRef.current.position.set(-0.16 + pumpDistX, 0.35, pumpDistZ);
      coolerPumpRef.current.rotation.y = sep * 0.22;
    }

    // 7. Top 360mm Radiator & Fans lift upward along ceiling (+Y)
    if (radiatorRef.current) {
      const radDistY = sep * (isMobile ? 0.6 : 1.25);
      radiatorRef.current.position.y = 0.98 + radDistY;
    }

    // 8. Motherboard PCB separates from chassis tray (+X)
    if (motherboardRef.current) {
      const mbDistX = sep * (isMobile ? 0.35 : 0.65);
      motherboardRef.current.position.x = -0.36 + mbDistX;
    }

    // 9. PSU slides subtly outward from lower shroud (-Z / -X)
    if (psuRef.current) {
      const psuDistZ = sep * (isMobile ? -0.4 : -0.85);
      psuRef.current.position.z = -0.15 + psuDistZ;
    }

    // 10. Technical annotations opacity: Visible only during Stage 3 (peak exploded view)
    if (annotationsRef.current) {
      const labelOpacity = smoothstep(0.55, 0.9, sep) * (1 - smoothstep(0.85, 1.0, tReassemble));
      annotationsRef.current.style.opacity = `${labelOpacity}`;
      annotationsRef.current.style.pointerEvents = labelOpacity > 0.5 ? 'auto' : 'none';
    }
  });

  return (
    <group ref={rootGroupRef}>
      {/* ────────────────── 1. MAIN CHASSIS SKELETON ────────────────── */}
      <group ref={chassisRef} position={[0, 0, 0]}>
        {/* Rear Frame Wall with Honeycomb I/O & Exhaust Vent */}
        <mesh position={[-0.45, 0.1, 0]}>
          <boxGeometry args={[0.04, 2.05, 1.95]} />
          <meshStandardMaterial color="#0b0e14" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* Top Ceiling Structural Bracket */}
        <mesh position={[0.05, 1.1, 0]}>
          <boxGeometry args={[1.04, 0.05, 1.95]} />
          <meshStandardMaterial color="#0f141f" roughness={0.25} metalness={0.9} />
        </mesh>
        {/* Bottom Base Frame */}
        <mesh position={[0.05, -0.95, 0]}>
          <boxGeometry args={[1.04, 0.06, 1.95]} />
          <meshStandardMaterial color="#0f141f" roughness={0.25} metalness={0.9} />
        </mesh>
        {/* 4 Corner Machined Aluminium Posts */}
        {[
          [-0.44, 1.0],
          [-0.44, -1.0],
          [0.54, 1.0],
          [0.54, -1.0],
        ].map(([x, z], idx) => (
          <mesh key={idx} position={[x, 0.08, z]}>
            <boxGeometry args={[0.05, 2.02, 0.05]} />
            <meshStandardMaterial color="#1a2234" roughness={0.2} metalness={0.95} />
          </mesh>
        ))}

        {/* 4 Rubber Foot Dampers */}
        {[
          [-0.4, 0.8],
          [-0.4, -0.8],
          [0.5, 0.8],
          [0.5, -0.8],
        ].map(([x, z], idx) => (
          <mesh key={idx} position={[x, -1.0, z]}>
            <cylinderGeometry args={[0.05, 0.05, 0.06, 16]} />
            <meshStandardMaterial color="#050608" roughness={0.9} />
          </mesh>
        ))}

        {/* PSU Shroud (Lower Chamber with Embossed Ventilation Slats) */}
        <mesh position={[0.05, -0.68, 0]}>
          <boxGeometry args={[0.96, 0.48, 1.88]} />
          <meshStandardMaterial color="#0e131d" roughness={0.35} metalness={0.85} />
        </mesh>
        {/* PSU Shroud Ambient Accent Light Blade */}
        <mesh position={[0.53, -0.44, 0]}>
          <boxGeometry args={[0.015, 0.015, 1.82]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Cable Grommets along Motherboard Tray */}
        {[-0.3, 0.1, 0.5].map((y, idx) => (
          <mesh key={idx} position={[-0.34, y, 0.7]}>
            <boxGeometry args={[0.02, 0.16, 0.08]} />
            <meshStandardMaterial color="#030406" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* ────────────────── 2. TEMPERED GLASS SIDE PANEL ────────────────── */}
      <mesh ref={glassPanelRef} position={[0.58, 0.08, 0]}>
        <boxGeometry args={[0.018, 1.98, 1.9]} />
        <meshPhysicalMaterial
          color="#080e1a"
          opacity={0.22}
          transparent={true}
          roughness={0.03}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          reflectivity={0.98}
        />
      </mesh>

      {/* ────────────────── 3. FRONT CHASSIS PANEL ────────────────── */}
      <group ref={frontPanelRef} position={[0.05, 0.08, 1.05]}>
        {/* Brushed Titanium Bezel */}
        <mesh>
          <boxGeometry args={[1.02, 1.98, 0.04]} />
          <meshStandardMaterial color="#0d111a" roughness={0.25} metalness={0.92} />
        </mesh>
        {/* Subtle Vertical Air Intake Fin Grille */}
        <mesh position={[0, 0, 0.025]}>
          <boxGeometry args={[0.82, 1.75, 0.01]} />
          <meshStandardMaterial color="#06080e" roughness={0.7} />
        </mesh>
        {/* Illuminated Power Button */}
        <mesh position={[0.38, 0.9, 0.025]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Front 3x 120mm Intake Fans */}
      <group ref={fansFrontRef} position={[0.05, 0.12, 0.88]}>
        {[-0.52, 0.0, 0.52].map((yOffset, idx) => (
          <group key={idx} position={[0, yOffset, 0]}>
            <mesh rotation={[0, 0, 0]}>
              <boxGeometry args={[0.78, 0.44, 0.04]} />
              <meshStandardMaterial color="#090c14" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <cylinderGeometry args={[0.18, 0.18, 0.02, 24]} />
              <meshStandardMaterial color="#1a2234" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Halo light ring */}
            <mesh position={[0, 0, 0.035]}>
              <ringGeometry args={[0.165, 0.185, 24]} />
              <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ────────────────── 4. MOTHERBOARD (ROG / CREATOR GRADE) ────────────────── */}
      <group ref={motherboardRef} position={[-0.36, 0.18, 0]}>
        {/* PCB Board */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.025, 1.45, 1.55]} />
          <meshStandardMaterial color="#0c0f17" roughness={0.6} metalness={0.4} />
        </mesh>
        {/* Gold & Silver Trace Bus Grid Overlay */}
        <mesh position={[0.015, 0, 0]}>
          <planeGeometry args={[1.5, 1.4]} />
          <meshBasicMaterial color="#38bdf8" wireframe={true} transparent opacity={0.12} />
        </mesh>

        {/* VRM Machined Aluminum Heatsink Stack Top */}
        <mesh position={[0.04, 0.6, 0]}>
          <boxGeometry args={[0.065, 0.16, 0.75]} />
          <meshStandardMaterial color="#181e2b" roughness={0.2} metalness={0.95} />
        </mesh>
        {/* VRM Heatsink Flanking Left */}
        <mesh position={[0.04, 0.36, -0.34]}>
          <boxGeometry args={[0.065, 0.48, 0.16]} />
          <meshStandardMaterial color="#181e2b" roughness={0.2} metalness={0.95} />
        </mesh>

        {/* LGA1851 CPU Socket Metal Bracket */}
        <mesh position={[0.02, 0.35, 0]}>
          <boxGeometry args={[0.015, 0.32, 0.32]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.15} metalness={0.98} />
        </mesh>

        {/* 3x M.2 NVMe Gen5 Heatsink Armor with Chamfered Laser Logos */}
        <mesh position={[0.04, -0.42, 0.2]}>
          <boxGeometry args={[0.05, 0.26, 0.78]} />
          <meshStandardMaterial color="#141a26" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[0.04, -0.12, 0.4]}>
          <boxGeometry args={[0.045, 0.08, 0.45]} />
          <meshStandardMaterial color="#141a26" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Steel-Reinforced PCIe 5.0 x16 Slot */}
        <mesh position={[0.04, -0.16, 0]}>
          <boxGeometry args={[0.04, 0.045, 1.25]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.15} metalness={0.98} />
        </mesh>

        {/* 24-Pin ATX Main Power Header & Braided Sleeved Cable Curves */}
        <mesh position={[0.03, 0.4, 0.72]}>
          <boxGeometry args={[0.04, 0.28, 0.06]} />
          <meshStandardMaterial color="#05070a" />
        </mesh>
      </group>

      {/* ────────────────── 5. FLAGSHIP NVIDIA GEFORCE RTX 5090 ────────────────── */}
      <group ref={gpuRef} position={[-0.02, -0.25, 0.05]}>
        {/* Massive 3.5-Slot Die-Cast Metal Shroud */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.46, 0.32, 1.48]} />
          <meshPhysicalMaterial
            color="#0b0e16"
            roughness={0.22}
            metalness={0.92}
            clearcoat={0.7}
            clearcoatRoughness={0.12}
          />
        </mesh>

        {/* Heavy Brushed Aluminum Backplate with Heat-Dissipation Cutouts */}
        <mesh position={[0, 0.165, 0]}>
          <boxGeometry args={[0.44, 0.012, 1.45]} />
          <meshStandardMaterial color="#181e2b" roughness={0.18} metalness={0.98} />
        </mesh>

        {/* Internal Nickel-Plated Copper Heatsink Fins (Visible from side) */}
        <mesh position={[0, -0.04, 0]}>
          <boxGeometry args={[0.42, 0.22, 1.4]} />
          <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.9} />
        </mesh>

        {/* Prominent Illuminated "GEFORCE RTX 5090" Side Logo */}
        <mesh position={[0.235, 0.07, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.05, 0.17]} />
          {gpuTexture ? (
            <meshBasicMaterial map={gpuTexture} transparent />
          ) : (
            <meshBasicMaterial color="#38bdf8" />
          )}
        </mesh>

        {/* Triple Axial Fans with Chamfered Hubs & RGB Halos */}
        {[-0.45, 0, 0.45].map((zOffset, idx) => (
          <group key={idx} position={[0, -0.17, zOffset]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.17, 0.17, 0.03, 24]} />
              <meshStandardMaterial color="#05070a" roughness={0.4} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.065, 0.065, 0.045, 16]} />
              <meshStandardMaterial color="#1a2234" metalness={0.9} />
            </mesh>
            <mesh position={[0, -0.016, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.155, 0.175, 24]} />
              <meshBasicMaterial color={idx === 1 ? '#38bdf8' : '#818cf8'} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        {/* 16-Pin 12V-2x6 Power Connector with Individual Sleeved Braided Wires */}
        <group position={[0.2, 0.12, 0.4]}>
          <mesh>
            <boxGeometry args={[0.07, 0.06, 0.14]} />
            <meshStandardMaterial color="#0f141f" />
          </mesh>
          <mesh position={[0.05, 0.09, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.16, 8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* ────────────────── 6. 360mm AIO CPU LIQUID COOLER ────────────────── */}
      {/* Infinity-Mirror Pump Block directly over CPU */}
      <group ref={coolerPumpRef} position={[-0.16, 0.35, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.21, 0.21, 0.1, 32]} />
          <meshStandardMaterial color="#0b0e16" roughness={0.2} metalness={0.92} />
        </mesh>
        {/* Illuminated Infinity Ring */}
        <mesh position={[0.055, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.17, 0.17, 0.02, 32]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        {/* Digital OLED Real-time 24°C Readout Lens */}
        <mesh position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.01, 24]} />
          <meshBasicMaterial color="#030712" />
        </mesh>

        {/* Dual Flexible Braided Liquid Coolant Tubes */}
        <mesh position={[0.08, 0.35, 0.14]}>
          <cylinderGeometry args={[0.028, 0.028, 0.68, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.1}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0.08, 0.35, -0.14]}>
          <cylinderGeometry args={[0.028, 0.028, 0.68, 16]} />
          <meshStandardMaterial
            color="#818cf8"
            emissive="#4338ca"
            emissiveIntensity={1.1}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Top 360mm Radiator & 3x 120mm Exhaust Fans */}
      <group ref={radiatorRef} position={[0.1, 0.98, 0]}>
        {/* Radiator Core Tank & Aluminum Fin Housing */}
        <mesh>
          <boxGeometry args={[0.82, 0.09, 1.65]} />
          <meshStandardMaterial color="#0e131d" roughness={0.3} metalness={0.88} />
        </mesh>
        {/* Triple Radiator Fans */}
        {[-0.52, 0, 0.52].map((zOffset, idx) => (
          <mesh key={idx} position={[0, -0.06, zOffset]}>
            <cylinderGeometry args={[0.18, 0.18, 0.03, 24]} />
            <meshStandardMaterial color="#1a2234" roughness={0.3} metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* ────────────────── 7. 4x DDR5 RGB RAM MODULES ────────────────── */}
      <group ref={ramRef} position={[-0.12, 0.45, 0.34]}>
        {[-0.08, -0.028, 0.028, 0.08].map((zPos, idx) => (
          <group key={idx} position={[0, 0, zPos]}>
            {/* Machined Aluminum Heatspreader with Ridged Surface */}
            <mesh>
              <boxGeometry args={[0.048, 0.36, 0.028]} />
              <meshStandardMaterial color="#141a26" roughness={0.18} metalness={0.92} />
            </mesh>
            {/* Top Diffused RGB Spine Blade */}
            <mesh position={[0, 0.185, 0]}>
              <boxGeometry args={[0.044, 0.024, 0.026]} />
              <meshBasicMaterial color={idx % 2 === 0 ? '#38bdf8' : '#a855f7'} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ────────────────── 8. 1200W TITANIUM MODULAR PSU ────────────────── */}
      <group ref={psuRef} position={[-0.05, -0.7, -0.15]}>
        <mesh>
          <boxGeometry args={[0.82, 0.38, 0.92]} />
          <meshStandardMaterial color="#0a0d14" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* AC Power Inlet Socket & Rocker Switch */}
        <mesh position={[-0.42, 0, 0]}>
          <boxGeometry args={[0.02, 0.12, 0.16]} />
          <meshStandardMaterial color="#020305" />
        </mesh>
        {/* Modular Sleeved Cable Harness */}
        <mesh position={[0.35, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.2, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* ────────────────── 9. TECHNICAL HARDWARE ANNOTATIONS (STAGE 3) ────────────────── */}
      {/* Rendered in 3D space with leader lines & micro-typography */}
      <Html
        position={[0, 0, 0]}
        center
        distanceFactor={4.5}
        zIndexRange={[100, 0]}
      >
        <div
          ref={annotationsRef}
          className="transition-opacity duration-500 select-none pointer-events-none opacity-0"
          style={{ width: '800px', height: '600px', position: 'relative' }}
        >
          {/* Label 1: RTX 5090 GPU */}
          <div
            className="absolute flex items-center gap-3 font-mono text-[10px] tracking-widest text-[#fafafa] uppercase"
            style={{ left: '48%', top: '65%' }}
          >
            <div className="w-16 h-[1px] bg-[#38bdf8]/80" />
            <div className="px-2.5 py-1 rounded bg-[#07090f]/90 border border-[#38bdf8]/40 shadow-[0_0_12px_rgba(56,189,248,0.25)] backdrop-blur-md">
              <span className="text-[#38bdf8] font-bold">NVIDIA GEFORCE RTX 5090</span>
              <span className="block text-[8px] text-[#94a3b8]">32GB GDDR7 • 21,760 CORES</span>
            </div>
          </div>

          {/* Label 2: ROG Z890 Motherboard */}
          <div
            className="absolute flex items-center gap-3 font-mono text-[10px] tracking-widest text-[#fafafa] uppercase"
            style={{ left: '12%', top: '55%' }}
          >
            <div className="px-2.5 py-1 rounded bg-[#07090f]/90 border border-white/20 shadow-[0_0_12px_rgba(0,0,0,0.5)] backdrop-blur-md text-right">
              <span className="font-bold">ROG HERO DARK</span>
              <span className="block text-[8px] text-[#94a3b8]">Z890 CHIPSET • REINFORCED PCIE 5.0</span>
            </div>
            <div className="w-16 h-[1px] bg-white/40" />
          </div>

          {/* Label 3: 64GB DDR5 RAM */}
          <div
            className="absolute flex items-center gap-3 font-mono text-[10px] tracking-widest text-[#fafafa] uppercase"
            style={{ left: '60%', top: '28%' }}
          >
            <div className="w-16 h-[1px] bg-[#a855f7]/80" />
            <div className="px-2.5 py-1 rounded bg-[#07090f]/90 border border-[#a855f7]/40 shadow-[0_0_12px_rgba(168,85,247,0.25)] backdrop-blur-md">
              <span className="text-[#c084fc] font-bold">64GB DDR5-7200</span>
              <span className="block text-[8px] text-[#94a3b8]">QUAD-CHANNEL • LOW LATENCY</span>
            </div>
          </div>

          {/* Label 4: 360mm AIO Cooler */}
          <div
            className="absolute flex items-center gap-3 font-mono text-[10px] tracking-widest text-[#fafafa] uppercase"
            style={{ left: '16%', top: '22%' }}
          >
            <div className="px-2.5 py-1 rounded bg-[#07090f]/90 border border-[#38bdf8]/40 shadow-[0_0_12px_rgba(56,189,248,0.25)] backdrop-blur-md text-right">
              <span className="text-[#38bdf8] font-bold">360mm AIO LOOP</span>
              <span className="block text-[8px] text-[#94a3b8]">INFINITY MIRROR • 24.2°C IDLE</span>
            </div>
            <div className="w-16 h-[1px] bg-[#38bdf8]/80" />
          </div>

          {/* Label 5: 1200W Titanium PSU */}
          <div
            className="absolute flex items-center gap-3 font-mono text-[10px] tracking-widest text-[#fafafa] uppercase"
            style={{ left: '14%', top: '82%' }}
          >
            <div className="px-2.5 py-1 rounded bg-[#07090f]/90 border border-white/20 shadow-[0_0_12px_rgba(0,0,0,0.5)] backdrop-blur-md text-right">
              <span className="font-bold">1200W TITANIUM</span>
              <span className="block text-[8px] text-[#94a3b8]">FULLY MODULAR • 94% EFFICIENCY</span>
            </div>
            <div className="w-14 h-[1px] bg-white/40" />
          </div>
        </div>
      </Html>
    </group>
  );
}
