'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import siteConfig from '@/config/siteConfig';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import ScrollIndicator from './ScrollIndicator';
import { Cpu, ShieldCheck, Activity } from 'lucide-react';

// Dynamic import for Three.js R3F Canvas
const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-[#060812] via-[#050505] to-[#0a0515]" />
  ),
});

export default function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [scrollP, setScrollP] = useState(0);
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

  // Track sticky scroll progress to stage editorial overlays
  useEffect(() => {
    const handleScroll = () => {
      const travel = window.innerHeight * 1.2;
      const p = Math.min(Math.max((window.scrollY || 0) / travel, 0), 1);
      setScrollP(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute opacities based on scroll position
  const heroTextOpacity = Math.max(1 - scrollP * 2.2, 0);
  const hudOpacity = scrollP > 0.3 ? Math.min((scrollP - 0.3) * 3, 1) * (scrollP > 0.85 ? Math.max((1 - scrollP) * 6, 0) : 1) : 0;

  return (
    <div id="hero" className="relative min-h-[230vh] w-full">
      {/* Sticky Viewport Stage (Locks screen while 3D PC drives & explodes on scroll) */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Real-time 3D PC Canvas */}
        <HeroScene />

        {/* Ambient background depth gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/40 to-transparent pointer-events-none md:w-3/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] pointer-events-none" />

        {/* ── STAGE 1: INTRODUCTORY HERO TEXT ── */}
        <div
          className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full transition-transform duration-100 ease-out"
          style={{
            opacity: reducedMotion ? 1 : heroTextOpacity,
            transform: reducedMotion ? 'none' : `translateY(-${scrollP * 70}px)`,
            pointerEvents: heroTextOpacity < 0.15 ? 'none' : 'auto',
          }}
        >
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

        {/* ── STAGE 2: EXPLODED 3D HARDWARE HUD OVERLAY (Fades in on scroll) ── */}
        <div
          className="absolute z-10 left-6 md:left-12 bottom-16 md:bottom-24 max-w-md pointer-events-none transition-transform duration-100 ease-out"
          style={{
            opacity: reducedMotion ? 0 : hudOpacity,
            transform: reducedMotion ? 'none' : `translateY(${(1 - hudOpacity) * 30}px)`,
          }}
        >
          <div className="p-6 rounded-xl border border-[#222]/80 bg-[#080a12]/80 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#38bdf8] pb-3 border-b border-[#1f2937]">
              <span className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 animate-pulse text-[#38bdf8]" />
                HARDWARE DISASSEMBLY ACTIVE
              </span>
              <span>STAGE // 02</span>
            </div>

            <div className="space-y-2 text-xs font-mono text-[#cbd5e1]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>CHASSIS: Tempered Glass Sliding (+X)</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>GPU: RTX Dual-Fan Disconnecting (+Z)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#4a9eff]/20 flex items-center justify-center text-[10px] text-[#4a9eff]">●</span>
                <span>COOLANT: Liquid Loop Elevating (+Y)</span>
              </div>
            </div>

            <p className="text-[11px] font-sans text-[#777] leading-relaxed pt-1">
              Architecture engineered for systems engineering, cybersecurity telemetry, and computational graphics.
            </p>
          </div>
        </div>

        {/* Scroll Indicator Prompt */}
        <ScrollIndicator />
      </div>
    </div>
  );
}
