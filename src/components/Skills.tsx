'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import siteConfig from '@/config/siteConfig';
import { useReducedMotion } from '@/hooks/useReducedMotion';

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
      className="relative py-28 md:py-44 border-t border-white/[0.08]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#4a9eff] font-[family-name:var(--font-space-grotesk)] block mb-3 font-semibold">
              03 // Capabilities
            </span>
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-[clamp(2.5rem,6vw,5.5rem)] font-bold text-[#f5f5f5] leading-[0.95]">
              Technologies &amp;
              <br />
              <span className="text-[#888]">Toolchains</span>
            </h2>
          </div>
          <p className="text-[#888] text-sm md:text-base max-w-sm font-[family-name:var(--font-inter)] leading-relaxed">
            Verified working stacks across engineering, AI architectures, cybersecurity operations, and creative computing.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2.5 mb-12">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
              activeCategory === null
                ? 'bg-[#4a9eff] text-[#050505] font-semibold'
                : 'bg-white/[0.03] text-[#888] border border-white/[0.08] hover:text-[#f5f5f5] hover:border-white/[0.2]'
            }`}
          >
            SHOW ALL
          </button>
          {siteConfig.skills.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(activeCategory === category.name ? null : category.name)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
                activeCategory === category.name
                  ? 'bg-[#4a9eff] text-[#050505] font-semibold'
                  : 'bg-white/[0.03] text-[#888] border border-white/[0.08] hover:text-[#f5f5f5] hover:border-white/[0.2]'
              }`}
            >
              {category.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 4 Column Typographic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.skills.map((category, idx) => {
            const isHighlighted = activeCategory === null || activeCategory === category.name;
            return (
              <div
                key={category.name}
                className={`skill-card p-8 rounded-2xl border bg-[#08090e]/75 backdrop-blur-md transition-all duration-400 shadow-[0_4px_24px_rgba(0,0,0,0.3)] ${
                  isHighlighted
                    ? 'border-white/[0.08] hover:border-white/[0.22] hover:bg-[#0b0d15]/85 opacity-100'
                    : 'border-white/[0.04] opacity-35'
                }`}
              >
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
                  <span className="text-[11px] font-mono text-[#666]">
                    0{idx + 1}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4a9eff]" />
                </div>

                <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[#fafafa] mb-6 tracking-wide">
                  {category.name}
                </h3>

                <ul className="space-y-3">
                  {category.skills.map((skill) => (
                    <li
                      key={skill}
                      className="group flex items-center justify-between text-[#a1a1aa] hover:text-[#fafafa] transition-colors duration-200 text-sm font-[family-name:var(--font-inter)]"
                    >
                      <span>{skill}</span>
                      <span className="text-[10px] text-[#555] group-hover:text-[#4a9eff] transition-colors font-mono">
                        //
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
