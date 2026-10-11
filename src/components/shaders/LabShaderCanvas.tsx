'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface LabShaderProps {
  type: 'raymarching' | 'topology' | 'neural';
  className?: string;
}

// Custom GLSL Fragment Shaders
const RAYMARCHING_FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

// Smooth minimum
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// Rotation matrix
mat2 rot2D(float angle) {
  float s = sin(angle), c = cos(angle);
  return mat2(c, -s, s, c);
}

// Distance estimator: Gyroid & Morphing Spheres
float map(vec3 p) {
  vec3 q = p;
  q.xy *= rot2D(u_time * 0.2 + u_mouse.x * 2.0);
  q.xz *= rot2D(u_time * 0.15 + u_mouse.y * 2.0);
  
  // Gyroid domain warping
  float gyroid = dot(sin(q * 2.0), cos(q.zxy * 2.0));
  float sphere = length(p) - 1.2;
  
  return smin(sphere, gyroid * 0.35, 0.4);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
  
  vec3 ro = vec3(0.0, 0.0, -3.2); // Ray origin
  vec3 rd = normalize(vec3(uv, 1.4)); // Ray direction
  
  float t = 0.0;
  for(int i = 0; i < 48; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    t += d * 0.7;
    if(d < 0.002 || t > 8.0) break;
  }
  
  vec3 col = vec3(0.03, 0.04, 0.08); // Background tone
  if(t < 8.0) {
    vec3 p = ro + rd * t;
    // Normal calculation
    vec2 e = vec2(0.003, 0.0);
    vec3 n = normalize(vec3(
      map(p + e.xyy) - map(p - e.xyy),
      map(p + e.yxy) - map(p - e.yxy),
      map(p + e.yyx) - map(p - e.yyx)
    ));
    
    // Rim & Fresnel lighting
    float fresnel = pow(1.0 - max(dot(-rd, n), 0.0), 3.0);
    float diff = max(dot(n, normalize(vec3(1.0, 2.0, -2.0))), 0.0);
    
    vec3 accent = mix(vec3(0.29, 0.62, 1.0), vec3(0.66, 0.33, 0.97), sin(u_time * 0.5 + p.y) * 0.5 + 0.5);
    col = mix(vec3(0.05, 0.07, 0.12), accent, fresnel * 0.9 + diff * 0.4);
  }
  
  gl_FragColor = vec4(col, 1.0);
}
`;

const TOPOLOGY_FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

// Simplex-style noise helper
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
  
  // Mouse warp
  vec2 m = u_mouse * 0.5;
  uv += m * 0.2;
  
  float t = u_time * 0.25;
  
  // Layered topological contour lines
  float n1 = noise(uv * 3.5 + vec2(t * 0.4, -t * 0.3));
  float n2 = noise(uv * 7.0 - vec2(t * 0.2, t * 0.5));
  float field = n1 * 0.7 + n2 * 0.3;
  
  // Contour slice
  float lines = sin(field * 26.0 + t);
  float contour = smoothstep(0.85, 0.98, lines);
  
  vec3 col = vec3(0.02, 0.03, 0.06);
  vec3 cyan = vec3(0.22, 0.74, 0.97);
  vec3 emerald = vec3(0.2, 0.85, 0.6);
  
  col = mix(col, mix(cyan, emerald, uv.y * 0.5 + 0.5), contour * 0.85);
  
  // Vignette
  col *= 1.0 - 0.4 * length(uv);
  
  gl_FragColor = vec4(col, 1.0);
}
`;

const NEURAL_FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
  
  float t = u_time * 0.5;
  
  // Matrix scanline & synaptic grid
  float scan = sin(uv.y * 120.0 + t * 4.0) * 0.15 + 0.85;
  
  // Neural pulse nodes
  float d = length(p - vec2(sin(t * 0.8) * 0.4, cos(t * 0.6) * 0.3));
  float pulse = 0.03 / (d + 0.05);
  
  // Crosshair laser line
  float laser = smoothstep(0.005, 0.0, abs(p.y - sin(t * 1.5) * 0.6));
  
  vec3 col = vec3(0.03, 0.03, 0.05);
  vec3 amber = vec3(0.96, 0.64, 0.26);
  vec3 crimson = vec3(0.92, 0.28, 0.35);
  
  col += mix(amber, crimson, p.x * 0.5 + 0.5) * (pulse * 0.6 + laser * 0.7);
  col *= scan;
  
  gl_FragColor = vec4(col, 1.0);
}
`;

const VS_SOURCE = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export default function LabShaderCanvas({ type, className = '' }: LabShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;

    const gl = canvas.getContext('webgl', { powerPreference: 'low-power', alpha: false });
    if (!gl) return;

    // Compile Shader helper
    const compileShader = (source: string, shaderType: number) => {
      const s = gl.createShader(shaderType);
      if (!s) return null;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('Shader compile failed:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const fsSource =
      type === 'raymarching'
        ? RAYMARCHING_FS
        : type === 'topology'
        ? TOPOLOGY_FS
        : NEURAL_FS;

    const vs = compileShader(VS_SOURCE, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    // Quad geometry
    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    let animId: number;
    const startTime = performance.now();
    const mouse = { x: 0, y: 0 };
    let isVisible = false;

    // Use IntersectionObserver to stop rendering when scrolled out of view!
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(canvas);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height * 2 - 1);
    };
    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();

    const render = () => {
      if (isVisible) {
        resize();
        gl.useProgram(program);
        const elapsed = (performance.now() - startTime) * 0.001;
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (buffer) gl.deleteBuffer(buffer);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      if (program) gl.deleteProgram(program);
    };
  }, [type, reducedMotion]);

  if (reducedMotion) {
    return <div className={`w-full h-full bg-[#08090f] ${className}`} />;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block cursor-crosshair rounded-xl ${className}`}
    />
  );
}
