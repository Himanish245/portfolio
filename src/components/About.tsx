'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Shield, Cpu, Code2, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    icon: Code2,
    title: 'Systems & Engineering',
    desc: 'Full-stack software architecture, scalable web services, and robust APIs built with TypeScript, Python, and modern paradigms.',
  },
  {
    icon: Shield,
    title: 'Cybersecurity & Defense',
    desc: 'Understanding attack vectors, threat analysis, and secure architectural design. Building systems with security as a foundation.',
  },
  {
    icon: Cpu,
    title: 'Applied Intelligence',
    desc: 'Building pragmatic AI applications — retrieval-augmented generation (RAG), vector embeddings, and computer vision pipelines.',
  },
  {
    icon: Sparkles,
    title: 'Creative Technology & ATL',
    desc: 'Real-time 3D web design with Three.js/Blender, motion graphics, ATL Lab technical coordination, and rapid prototyping at hackathons.',
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const elements = sectionRef.current!.querySelectorAll('.about-reveal');
      gsap.fromTo(
        elements,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
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
      id="about"
      className="relative py-28 md:py-44 border-t border-white/[0.08]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="about-reveal mb-16 md:mb-24">
          <span className="text-xs uppercase tracking-[0.3em] text-[#4a9eff] font-[family-name:var(--font-space-grotesk)] block mb-3 font-semibold">
            02 // Philosophy
          </span>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-[clamp(2.5rem,6vw,5.5rem)] font-bold text-[#f5f5f5] leading-[0.95]">
            Technical Depth.
            <br />
            <span className="text-[#888]">Creative Discipline.</span>
          </h2>
        </div>

        {/* Narrative & Pillars Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          {/* Left Column: Focused Copy */}
          <div className="lg:col-span-6 space-y-6">
            <p className="about-reveal text-[#e5e5e5] text-lg md:text-xl font-light leading-relaxed font-[family-name:var(--font-inter)]">
              I am a multidisciplinary developer and creative technologist driven by curiosity at the intersection of engineering rigor and immersive digital craft.
            </p>

            <p className="about-reveal text-[#888] text-base leading-relaxed font-[family-name:var(--font-inter)]">
              Rather than staying inside a single silo, I work across the full stack: engineering robust web backends, investigating cybersecurity and network detection mechanisms, deploying machine learning applications, and designing 3D spatial web environments.
            </p>

            <p className="about-reveal text-[#888] text-base leading-relaxed font-[family-name:var(--font-inter)]">
              Through coordinating technical activities at ATL Lab and competing in hackathons, I prototype rapidly and mentor peers in hardware-software integration, robotics, and creative problem-solving.
            </p>

            {/* Quick spec pills */}
            <div className="about-reveal pt-6 flex flex-wrap gap-3">
              <span className="px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs font-mono text-[#a1a1aa]">
                STACK: Full-Stack &amp; Systems
              </span>
              <span className="px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs font-mono text-[#a1a1aa]">
                FOCUS: Security &amp; AI
              </span>
              <span className="px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs font-mono text-[#a1a1aa]">
                LAB: ATL Coordinator
              </span>
            </div>
          </div>

          {/* Right Column: 4 Pillars Matrix */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="about-reveal group p-6 rounded-2xl border border-white/[0.08] bg-[#08090e]/75 backdrop-blur-md hover:border-white/[0.22] hover:bg-[#0b0d15]/85 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#4a9eff] mb-5 group-hover:scale-105 group-hover:border-[#4a9eff]/50 transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[#fafafa] mb-2 tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-[#a1a1aa] text-xs leading-relaxed font-[family-name:var(--font-inter)]">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
