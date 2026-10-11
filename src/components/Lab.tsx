'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import siteConfig from '@/config/siteConfig';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Terminal } from 'lucide-react';
import LabShaderCanvas from './shaders/LabShaderCanvas';

gsap.registerPlugin(ScrollTrigger);

const labelColors: Record<string, string> = {
  Experiment: 'text-purple-400 border-purple-400/30 bg-purple-500/10',
  Study: 'text-sky-400 border-sky-400/30 bg-sky-500/10',
  Prototype: 'text-amber-400 border-amber-400/30 bg-amber-500/10',
};

const shaderTypes: ('raymarching' | 'topology' | 'neural')[] = [
  'raymarching',
  'topology',
  'neural',
];

export default function Lab() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current!.querySelectorAll('.lab-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="lab"
      className="relative py-32 md:py-48 border-t border-white/[0.08]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-20 md:mb-28 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs uppercase tracking-[0.3em] text-[#38bdf8] font-mono font-semibold">
                04 // THE LAB &amp; COMPUTATIONAL EXPERIMENTS
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-[#71717a] font-mono">
                REAL-TIME GLSL
              </span>
            </div>

            <h2 className="font-[family-name:var(--font-space-grotesk)] text-[clamp(2.8rem,6.5vw,6rem)] font-extrabold text-[#fafafa] leading-[0.92] tracking-tight">
              Prototypes &amp;
              <br />
              <span className="text-[#71717a]">Creative Coding</span>
            </h2>
          </div>
          <p className="text-[#a1a1aa] text-base md:text-lg max-w-md font-[family-name:var(--font-inter)] leading-relaxed">
            Real-time GPU fragment shaders, procedural signed distance fields (SDFs), generative topological physics, and neural vision experiments.
          </p>
        </div>

        {/* 3 Column Interactive Shader Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {siteConfig.experiments.map((exp, i) => (
            <div
              key={exp.title}
              className="lab-card group relative p-8 rounded-2xl border border-white/[0.08] bg-[#07080e]/85 backdrop-blur-xl hover:border-white/[0.25] hover:bg-[#0a0c16]/90 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col justify-between"
            >
              <div>
                {/* Header telemetry row */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <span
                    className={`inline-block text-[10px] tracking-[0.2em] uppercase px-3 py-1 border rounded-full font-mono font-medium ${
                      labelColors[exp.label] || 'text-[#71717a] border-white/[0.1]'
                    }`}
                  >
                    {exp.label}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[#71717a] font-mono">
                    <Terminal className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>EXP_0{i + 1}</span>
                  </div>
                </div>

                {/* Real-Time Live WebGL GLSL Shader Viewport */}
                <div className="h-44 w-full rounded-xl bg-[#030408] border border-white/[0.08] mb-6 overflow-hidden relative shadow-inner">
                  <LabShaderCanvas type={shaderTypes[i]} />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/[0.08] text-[9px] font-mono text-[#38bdf8] pointer-events-none">
                    GLSL // 60FPS
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/[0.08] text-[9px] font-mono text-[#71717a] pointer-events-none">
                    HOVER TO WARP
                  </div>
                </div>

                <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[#fafafa] mb-3 group-hover:text-[#38bdf8] transition-colors duration-300">
                  {exp.title}
                </h3>

                <p className="text-[#a1a1aa] text-sm leading-relaxed font-[family-name:var(--font-inter)] mb-6">
                  {exp.description}
                </p>
              </div>

              {/* Status footer */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#71717a]">
                <span>STATUS: LIVE GLSL STUDY</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>

              {/* Subtle hover accent light */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#38bdf8]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
