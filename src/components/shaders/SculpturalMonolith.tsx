'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMobileDetect } from '@/hooks/useMobileDetect';

// Custom GLSL Vertex & Fragment Shader for Monumental Organic Monolith
const MonolithShaderMaterialDef = {
  vertexShader: `
    uniform float uTime;
    uniform float uDistortion;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vDisplacement;

    // Simplex 3D noise
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

    float snoise(vec3 v){
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z.xxxx);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      float noise1 = snoise(position * 1.2 + vec3(uTime * 0.25));
      float noise2 = snoise(position * 2.4 - vec3(uTime * 0.18));
      float displacement = (noise1 * 0.7 + noise2 * 0.3) * uDistortion;
      vDisplacement = displacement;
      
      vec3 newPosition = position + normal * displacement;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uRimColor;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vDisplacement;

    void main() {
      vec3 viewDirection = normalize(-vPosition);
      float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 2.5);
      
      vec3 base = mix(uColorA, uColorB, vDisplacement * 1.5 + 0.3);
      vec3 finalColor = mix(base, uRimColor, fresnel * 0.85);
      
      gl_FragColor = vec4(finalColor, 0.95);
    }
  `,
};

function MonolithMesh({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const initialUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDistortion: { value: isMobile ? 0.25 : 0.38 },
      uColorA: { value: new THREE.Color('#07090f') },
      uColorB: { value: new THREE.Color('#1e3a8a') },
      uRimColor: { value: new THREE.Color('#38bdf8') },
    }),
    [isMobile]
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
    }

    const mouseX = state.pointer.x * 0.4;
    const mouseY = state.pointer.y * 0.3;

    meshRef.current.rotation.y = THREE.MathUtils.damp(
      meshRef.current.rotation.y,
      t * 0.15 + mouseX,
      3,
      delta
    );
    meshRef.current.rotation.x = THREE.MathUtils.damp(
      meshRef.current.rotation.x,
      Math.sin(t * 0.1) * 0.2 + mouseY,
      3,
      delta
    );

    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = -meshRef.current.rotation.y * 0.8;
      wireframeRef.current.rotation.z = t * 0.05;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[isMobile ? 1.4 : 1.75, isMobile ? 32 : 48]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={MonolithShaderMaterialDef.vertexShader}
          fragmentShader={MonolithShaderMaterialDef.fragmentShader}
          uniforms={initialUniforms}
          transparent
        />
      </mesh>

      <mesh ref={wireframeRef}>
        <torusGeometry args={[isMobile ? 2.1 : 2.5, 0.015, 16, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}

export default function SculpturalMonolith() {
  const { isMobile, pixelRatio } = useMobileDetect();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className="absolute inset-0 bg-radial from-[#1e3a8a]/10 via-transparent to-transparent pointer-events-none" />
    );
  }

  return (
    <div className="w-full h-full pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        dpr={pixelRatio}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 5, 3]} intensity={1.5} color="#38bdf8" />
        <pointLight position={[-3, -3, 2]} intensity={1.0} color="#60a5fa" />
        <MonolithMesh isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
