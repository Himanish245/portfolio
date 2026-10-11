'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import siteConfig from '@/config/siteConfig';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Terminal } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const labelColors: Record<string, string> = {
  Experiment: 'text-purple-400 border-purple-400/30 bg-purple-500/5',
  Study: 'text-cyan-400 border-cyan-400/30 bg-cyan-500/5',
  Prototype: 'text-amber-400 border-amber-400/30 bg-amber-500/5',
};

// Generative micro visual for lab experiments
function LabCardVisual({ index }: { index: number }) {
  if (index === 0) {
    // GLSL Shader waves
    return (
      <div className="h-28 w-full rounded-lg bg-[#07070b] border border-[#16161c] mb-6 flex items-center justify-center overflow-hidden relative">
        <svg viewBox="0 0 200 60" className="w-full h-full text-purple-400/40">
          <path
            d="M 0 30 Q 25 10 50 30 T 100 30 T 150 30 T 200 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="animate-pulse"
          />
          <path
            d="M 0 30 Q 25 45 50 30 T 100 30 T 150 30 T 200 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
        </svg>
        <span className="absolute bottom-2 right-2 text-[9px] font-mono text-[#555]">
          GLSL / FRAG
        </span>
      </div>
    );
  }

  if (index === 1) {
    // Generative Topology point matrix
    return (
      <div className="h-28 w-full rounded-lg bg-[#07070b] border border-[#16161c] mb-6 flex items-center justify-center overflow-hidden relative">
        <svg viewBox="0 0 160 60" className="w-full h-full text-cyan-400/40">
          <g>
            {[...Array(6)].map((_, r) =>
              [...Array(12)].map((_, c) => (
                <circle
                  key={`${r}-${c}`}
                  cx={15 + c * 12}
                  cy={10 + r * 8}
                  r="1.2"
                  fill="currentColor"
                  opacity={(r + c) % 3 === 0 ? 0.9 : 0.3}
                />
              ))
            )}
          </g>
        </svg>
        <span className="absolute bottom-2 right-2 text-[9px] font-mono text-[#555]">
          MESH / SDF
        </span>
      </div>
    );
  }

  // Neural Vision Pipeline scan line
  return (
    <div className="h-28 w-full rounded-lg bg-[#07070b] border border-[#16161c] mb-6 flex items-center justify-center overflow-hidden relative">
      <div className="w-16 h-16 rounded border border-amber-400/40 relative flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        <div className="absolute inset-x-0 h-[1px] bg-amber-400/70 top-1/2 animate-pulse" />
      </div>
      <span className="absolute bottom-2 right-2 text-[9px] font-mono text-[#555]">
        TENSOR / OPENCV
      </span>
    </div>
  );
}

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
      className="relative py-28 md:py-44 border-t border-white/[0.08]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#4a9eff] font-[family-name:var(--font-space-grotesk)] block mb-3 font-semibold">
              04 // The Lab
            </span>
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-[clamp(2.5rem,6vw,5.5rem)] font-bold text-[#f5f5f5] leading-[0.95]">
              Prototypes &amp;
              <br />
              <span className="text-[#888]">Creative Coding</span>
            </h2>
          </div>
          <p className="text-[#888] text-sm md:text-base max-w-sm font-[family-name:var(--font-inter)] leading-relaxed">
            Exploratory sketches, GPU shader programming, computational geometry, and experimental interfaces.
          </p>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {siteConfig.experiments.map((exp, i) => (
            <div
              key={exp.title}
              className="lab-card group relative p-7 rounded-2xl border border-white/[0.08] bg-[#08090e]/75 backdrop-blur-md hover:border-white/[0.22] hover:bg-[#0b0d15]/85 transition-all duration-400 shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <span
                    className={`inline-block text-[10px] tracking-[0.18em] uppercase px-3 py-1 border rounded-full font-medium ${
                      labelColors[exp.label] || 'text-[#888] border-[#888]/30'
                    }`}
                  >
                    {exp.label}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[#666] font-mono">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>EXP_0{i + 1}</span>
                  </div>
                </div>

                {/* Animated visual snippet */}
                <LabCardVisual index={i} />

                <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[#fafafa] mb-3 group-hover:text-[#4a9eff] transition-colors duration-300">
                  {exp.title}
                </h3>

                <p className="text-[#a1a1aa] text-sm leading-relaxed font-[family-name:var(--font-inter)] mb-6">
                  {exp.description}
                </p>
              </div>

              {/* Status footer */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#666]">
                <span>STATUS: UNPUBLISHED STUDY</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4a9eff]/60" />
              </div>

              {/* Subtle hover gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4a9eff]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
