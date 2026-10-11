'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import siteConfig from '@/config/siteConfig';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import ScrollIndicator from './ScrollIndicator';
import { ArrowUpRight, Terminal } from 'lucide-react';

export default function Hero() {
  const metaRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);

  const [timeStr, setTimeStr] = useState<string>('');
  const reducedMotion = useReducedMotion();

  // Local live clock for editorial telemetry
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cinematic GSAP entrance timeline
  useEffect(() => {
    if (reducedMotion) return;

    const tl = gsap.timeline({ delay: 0.25 });
    tl.fromTo(
      metaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
      .fromTo(
        headingRef.current,
        { opacity: 0, y: 70, clipPath: 'inset(0 100% 0 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        descRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' },
        '-=0.45'
      )
      .fromTo(
        ctaRef.current?.children || [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.1 },
        '-=0.3'
      )
      .fromTo(
        telemetryRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.2'
      );

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-24 md:pt-0"
    >
      {/* Cinematic subtle vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#030305]/30 to-[#030305]/80 pointer-events-none" />

      {/* Hero Editorial Layer (z-20 guarantees crisp typography in front of 3D workstation) */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-12 w-full pointer-events-auto">
        <div className="max-w-2xl">
          {/* Telemetry coordinate strip */}
          <div
            ref={metaRef}
            className="flex flex-wrap items-center gap-3 mb-6 font-mono text-[11px] tracking-widest text-[#71717a] uppercase"
          >
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm text-[#38bdf8]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM ACTIVE
            </span>
            <span className="hidden sm:inline text-white/20">{'//'}</span>
            <span className="hidden sm:inline">LAT 28.6139° N / LON 77.2090° E</span>
            <span className="hidden sm:inline text-white/20">{'//'}</span>
            <span>{timeStr || 'LIVE UTC+5:30'}</span>
          </div>

          {/* Monumental Name Display */}
          <h1
            ref={headingRef}
            className="font-[family-name:var(--font-space-grotesk)] text-[clamp(3.2rem,9.8vw,9.8rem)] font-extrabold leading-[0.88] tracking-[-0.03em] text-[#fafafa] mb-6 drop-shadow-[0_8px_32px_rgba(0,0,0,0.85)]"
          >
            {siteConfig.name}
          </h1>

          {/* Architectural Tagline */}
          <p
            ref={subtitleRef}
            className="font-[family-name:var(--font-space-grotesk)] text-[clamp(1.15rem,2.4vw,1.85rem)] font-light text-[#f4f4f5]/90 mb-4 leading-snug tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
          >
            {siteConfig.tagline}
          </p>

          {/* Editorial Subtitle */}
          <p
            ref={descRef}
            className="font-[family-name:var(--font-inter)] text-base md:text-lg text-[#a1a1aa] max-w-xl mb-10 leading-relaxed font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          >
            {siteConfig.subtitle}
          </p>

          {/* High-End Tactile Action Buttons */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
            <a
              href="#work"
              className="group inline-flex items-center gap-2.5 px-8 py-4 bg-[#fafafa] text-[#050505] font-[family-name:var(--font-space-grotesk)] text-xs font-bold tracking-[0.18em] uppercase rounded-full hover:bg-[#38bdf8] hover:text-[#050505] transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_24px_rgba(255,255,255,0.15)]"
            >
              <span>Explore Architecture</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/[0.12] bg-[#08090e]/70 backdrop-blur-md text-[#fafafa] font-[family-name:var(--font-space-grotesk)] text-xs font-semibold tracking-[0.18em] uppercase rounded-full hover:border-[#38bdf8] hover:text-[#38bdf8] transition-all duration-300"
            >
              <span>Initiate Contact</span>
            </a>
          </div>

          {/* Subtle Technical Specs Badge */}
          <div
            ref={telemetryRef}
            className="mt-14 pt-6 border-t border-white/[0.06] flex items-center gap-6 text-[11px] font-mono text-[#71717a]"
          >
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>CORE: NEXT_16 // R3F // THREE_0.186</span>
            </div>
            <span>•</span>
            <span>SHADERS: GLSL_PBR</span>
          </div>
        </div>
      </div>

      {/* Preserved Scroll Indicator */}
      <ScrollIndicator />
    </section>
  );
}
