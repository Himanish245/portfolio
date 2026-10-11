'use client';

import { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Shield, Cpu, Code2, Sparkles } from 'lucide-react';

// Dynamic import of 3D Sculptural Monolith
const SculpturalMonolith = dynamic(() => import('./shaders/SculpturalMonolith'), {
  ssr: false,
  loading: () => null,
});

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    icon: Code2,
    title: 'Systems & Architecture',
    desc: 'Full-stack software engineering, scalable microservices, and high-throughput APIs built with TypeScript, Python, and modern reactive patterns.',
    metric: 'ENGINEERING',
  },
  {
    icon: Shield,
    title: 'Cybersecurity & Defense',
    desc: 'Adversarial threat analysis, network detection systems, telemetry interception, and secure-by-default architectural design.',
    metric: 'SECURITY',
  },
  {
    icon: Cpu,
    title: 'Applied Intelligence',
    desc: 'Pragmatic machine learning architectures — retrieval-augmented generation (RAG), vector space embeddings, and computer vision pipelines.',
    metric: 'AI / ML',
  },
  {
    icon: Sparkles,
    title: 'Creative Technology & ATL',
    desc: 'Real-time WebGL/GLSL 3D graphics, technical coordination at ATL Lab, robotics mentorship, and rapid physical computing hackathons.',
    metric: 'CREATIVE DEV',
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
      className="relative py-32 md:py-48 border-t border-white/[0.08] overflow-hidden"
    >
      {/* 3D Procedural Sculptural Monolith in Section Background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-35 pointer-events-none z-0">
        <SculpturalMonolith />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="about-reveal mb-20 md:mb-28">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs uppercase tracking-[0.3em] text-[#38bdf8] font-mono font-semibold">
              02 // PHILOSOPHY &amp; CRAFT
            </span>
            <span className="text-white/20">•</span>
            <span className="text-xs text-[#71717a] font-mono">
              ENGINEERING RIGOR
            </span>
          </div>

          <h2 className="font-[family-name:var(--font-space-grotesk)] text-[clamp(2.8rem,6.5vw,6rem)] font-extrabold text-[#fafafa] leading-[0.92] tracking-tight">
            Technical Depth.
            <br />
            <span className="text-[#71717a]">Creative Discipline.</span>
          </h2>
        </div>

        {/* Narrative & Pillars Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          {/* Left Column: Focused Copy */}
          <div className="lg:col-span-6 space-y-6">
            <p className="about-reveal text-[#fafafa] text-lg md:text-2xl font-light leading-relaxed font-[family-name:var(--font-space-grotesk)]">
              I am a multidisciplinary developer and creative technologist operating at the confluence of engineering rigor, cybersecurity vigilance, and immersive digital craft.
            </p>

            <p className="about-reveal text-[#a1a1aa] text-base md:text-lg leading-relaxed font-[family-name:var(--font-inter)]">
              Rather than confining myself to a single silo, I build across entire systems: engineering scalable software backends, designing cybersecurity threat detection mechanisms, deploying applied AI pipelines, and crafting real-time 3D spatial web environments.
            </p>

            <p className="about-reveal text-[#a1a1aa] text-base md:text-lg leading-relaxed font-[family-name:var(--font-inter)]">
              As a technical coordinator at ATL Lab and an active hackathon competitor, I bridge theory and hardware: prototyping embedded robotics, leading technical workshops, and mentoring developers through rapid hardware-software prototyping.
            </p>

            {/* Quick telemetry pills */}
            <div className="about-reveal pt-6 flex flex-wrap gap-3 font-mono text-xs text-[#a1a1aa]">
              <span className="px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
                DISCIPLINE: Full-Stack Systems
              </span>
              <span className="px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
                SECURITY: Threat Analysis &amp; NDR
              </span>
              <span className="px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
                LEADERSHIP: ATL Lab Coordinator
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
                  className="about-reveal group p-7 rounded-2xl border border-white/[0.08] bg-[#07080e]/85 backdrop-blur-xl hover:border-white/[0.25] hover:bg-[#0a0c16]/90 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#38bdf8] group-hover:scale-105 group-hover:border-[#38bdf8]/50 transition-all duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono tracking-widest text-[#71717a] uppercase">
                        {pillar.metric}
                      </span>
                    </div>

                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[#fafafa] mb-3 tracking-tight">
                      {pillar.title}
                    </h3>

                    <p className="text-[#a1a1aa] text-xs leading-relaxed font-[family-name:var(--font-inter)]">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#71717a]">
                    <span>STATUS: OPERATIONAL</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
