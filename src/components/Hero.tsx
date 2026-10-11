'use client';

import { useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import siteConfig from '@/config/siteConfig';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import ScrollIndicator from './ScrollIndicator';

// Dynamic import to avoid SSR for Three.js
const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#050505] to-[#0a0515]" />
  ),
});

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 80, clipPath: 'inset(0 100% 0 0)' },
      { opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.out' }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        descRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(
        ctaRef.current?.children || [],
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12 },
        '-=0.3'
      );

    return () => { tl.kill(); };
  }, [reducedMotion]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background */}
      <HeroScene />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/30 to-[#050505]/80 pointer-events-none" />

      {/* Text Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
        <div className="max-w-3xl">
          <h1
            ref={headingRef}
            className="font-[family-name:var(--font-space-grotesk)] text-[clamp(3rem,10vw,10rem)] font-bold leading-[0.9] tracking-tight text-[#f5f5f5] mb-6"
            style={{ opacity: reducedMotion ? 1 : 0 }}
          >
            {siteConfig.name}
          </h1>

          <p
            ref={subtitleRef}
            className="font-[family-name:var(--font-space-grotesk)] text-[clamp(1.1rem,2.5vw,1.8rem)] font-light text-[#f5f5f5]/90 mb-4 leading-snug"
            style={{ opacity: reducedMotion ? 1 : 0 }}
          >
            {siteConfig.tagline}
          </p>

          <p
            ref={descRef}
            className="font-[family-name:var(--font-inter)] text-base md:text-lg text-[#888] max-w-xl mb-10 leading-relaxed"
            style={{ opacity: reducedMotion ? 1 : 0 }}
          >
            {siteConfig.subtitle}
          </p>

          <div
            ref={ctaRef}
            className="flex flex-wrap gap-4"
            style={{ opacity: reducedMotion ? 1 : 0 }}
          >
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

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </section>
  );
}
