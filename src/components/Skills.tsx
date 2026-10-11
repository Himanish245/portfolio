'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import siteConfig from '@/config/siteConfig';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const columns = sectionRef.current!.querySelectorAll('.skill-card');
      gsap.fromTo(
        columns,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
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
      id="skills"
      className="relative py-32 md:py-48 border-t border-white/[0.08]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-20 md:mb-28 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs uppercase tracking-[0.3em] text-[#38bdf8] font-mono font-semibold">
                03 // ARCHITECTURAL TOOLCHAINS
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-[#71717a] font-mono">
                COMMAND MATRIX
              </span>
            </div>

            <h2 className="font-[family-name:var(--font-space-grotesk)] text-[clamp(2.8rem,6.5vw,6rem)] font-extrabold text-[#fafafa] leading-[0.92] tracking-tight">
              Technologies &amp;
              <br />
              <span className="text-[#71717a]">Toolchains</span>
            </h2>
          </div>
          <p className="text-[#a1a1aa] text-base md:text-lg max-w-md font-[family-name:var(--font-inter)] leading-relaxed">
            Verified working stacks deployed across distributed backend systems, AI neural pipelines, cybersecurity telemetry, and real-time WebGL engines.
          </p>
        </div>

        {/* Category Filter Deck */}
        <div className="flex flex-wrap items-center gap-3 mb-14">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 ${
              activeCategory === null
                ? 'bg-[#38bdf8] text-[#050505] font-bold shadow-[0_2px_12px_rgba(56,189,248,0.3)]'
                : 'bg-white/[0.03] text-[#71717a] border border-white/[0.08] hover:text-[#fafafa] hover:border-white/[0.2]'
            }`}
          >
            ALL CAPABILITIES
          </button>
          {siteConfig.skills.map((category) => (
            <button
              key={category.name}
              onClick={() =>
                setActiveCategory(activeCategory === category.name ? null : category.name)
              }
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 ${
                activeCategory === category.name
                  ? 'bg-[#38bdf8] text-[#050505] font-bold shadow-[0_2px_12px_rgba(56,189,248,0.3)]'
                  : 'bg-white/[0.03] text-[#71717a] border border-white/[0.08] hover:text-[#fafafa] hover:border-white/[0.2]'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* 4 Column Typographic Command Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.skills.map((category, idx) => {
            const isHighlighted =
              activeCategory === null || activeCategory === category.name;
            return (
              <div
                key={category.name}
                className={`skill-card p-8 rounded-2xl border bg-[#07080e]/85 backdrop-blur-xl transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${
                  isHighlighted
                    ? 'border-white/[0.08] hover:border-white/[0.25] hover:bg-[#0a0c16]/90 opacity-100 scale-100'
                    : 'border-white/[0.04] opacity-30 scale-[0.98]'
                }`}
              >
                {/* Header telemetry */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span className="text-[11px] font-mono text-[#71717a]">
                      DECK_0{idx + 1}
                    </span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                </div>

                <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[#fafafa] mb-6 tracking-tight">
                  {category.name}
                </h3>

                <ul className="space-y-3.5 mb-8">
                  {category.skills.map((skill) => (
                    <li
                      key={skill}
                      className="group flex items-center justify-between text-[#a1a1aa] hover:text-[#fafafa] transition-colors duration-200 text-sm font-[family-name:var(--font-inter)]"
                    >
                      <span>{skill}</span>
                      <span className="text-[10px] text-[#52525b] group-hover:text-[#38bdf8] transition-colors font-mono">
                        {'//'} 100%
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Subdeck footer */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#71717a]">
                  <span>ENV: PRODUCTION</span>
                  <span className="text-emerald-400">READY</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
