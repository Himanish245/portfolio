'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import siteConfig from '@/config/siteConfig';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import ScrollIndicator from './ScrollIndicator';

export default function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  // Initial cinematic entrance
  useEffect(() => {
    if (reducedMotion) return;

    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 70, clipPath: 'inset(0 100% 0 0)' },
      { opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power3.out' }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo(
        descRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(
        ctaRef.current?.children || [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.1 },
        '-=0.3'
      );

    return () => { tl.kill(); };
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20 md:pt-0"
    >
      {/* Background depth mask */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/50 to-transparent pointer-events-none md:w-3/5" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]/80 pointer-events-none" />

      {/* Hero Editorial Text */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
        <div className="max-w-2xl">
          <h1
            ref={headingRef}
            className="font-[family-name:var(--font-space-grotesk)] text-[clamp(3rem,9.5vw,9.5rem)] font-bold leading-[0.9] tracking-tight text-[#f5f5f5] mb-6"
          >
            {siteConfig.name}
          </h1>

          <p
            ref={subtitleRef}
            className="font-[family-name:var(--font-space-grotesk)] text-[clamp(1.1rem,2.4vw,1.75rem)] font-light text-[#f5f5f5]/90 mb-4 leading-snug"
          >
            {siteConfig.tagline}
          </p>

          <p
            ref={descRef}
            className="font-[family-name:var(--font-inter)] text-base md:text-lg text-[#888] max-w-xl mb-10 leading-relaxed"
          >
            {siteConfig.subtitle}
          </p>

          <div ref={ctaRef} className="flex flex-wrap gap-4">
            <a
              href="#work"
              className="inline-flex items-center px-7 py-3.5 bg-[#4a9eff] text-[#050505] font-[family-name:var(--font-space-grotesk)] text-sm font-semibold tracking-wide rounded-full hover:bg-[#6cb3ff] transition-all duration-300 hover:scale-[1.02]"
            >
              Explore my work
            </a>
            <a
              href="#contact"
              className="inline-flex items-center px-7 py-3.5 border border-[#f5f5f5]/20 text-[#f5f5f5] font-[family-name:var(--font-space-grotesk)] text-sm font-medium tracking-wide rounded-full hover:border-[#4a9eff] hover:text-[#4a9eff] transition-all duration-300"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Down Prompt */}
      <ScrollIndicator />
    </section>
  );
}
