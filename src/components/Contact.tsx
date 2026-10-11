'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Copy, Check, Mail, Radio } from 'lucide-react';
import siteConfig from '@/config/siteConfig';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Dynamic import of 3D Contact Singularity
const ContactSingularity = dynamic(() => import('./shaders/ContactSingularity'), {
  ssr: false,
  loading: () => null,
});

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const elements = sectionRef.current!.querySelectorAll('.contact-reveal');
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

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteConfig.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const socialLinks = [
    siteConfig.social.github && {
      label: 'GitHub',
      href: siteConfig.social.github,
      handle: '@himanish',
    },
    siteConfig.social.linkedin && {
      label: 'LinkedIn',
      href: siteConfig.social.linkedin,
      handle: 'in/himanish',
    },
    siteConfig.social.twitter && {
      label: 'Twitter / X',
      href: siteConfig.social.twitter,
      handle: '@himanish',
    },
  ].filter(Boolean) as { label: string; href: string; handle: string }[];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-32 md:py-48 border-t border-white/[0.08] overflow-hidden"
    >
      {/* 3D Singularity Particle Vortex in background */}
      <div className="absolute right-0 bottom-0 w-[600px] h-[600px] md:w-[900px] md:h-[900px] opacity-40 pointer-events-none z-0">
        <ContactSingularity />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="contact-reveal mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs uppercase tracking-[0.3em] text-[#38bdf8] font-mono font-semibold">
              05 // INITIATE TRANSMISSION
            </span>
            <span className="text-white/20">•</span>
            <span className="text-xs text-[#71717a] font-mono">
              DIRECT UPLINK
            </span>
          </div>
        </div>

        {/* Monumental Editorial Headline */}
        <h2 className="contact-reveal font-[family-name:var(--font-space-grotesk)] text-[clamp(2.8rem,7.8vw,7.5rem)] font-extrabold text-[#fafafa] leading-[0.9] tracking-[-0.02em] mb-10 max-w-4xl">
          Let&apos;s build
          <br />
          <span className="text-[#71717a]">something memorable.</span>
        </h2>

        <p className="contact-reveal text-[#a1a1aa] text-base md:text-xl max-w-xl mb-14 leading-relaxed font-[family-name:var(--font-inter)]">
          Have an engineering challenge, intelligent architecture project, or creative technology inquiry? Let&apos;s engineer it into reality.
        </p>

        {/* Interactive Tactical Email Console */}
        <div className="contact-reveal flex flex-wrap items-center gap-4 mb-20">
          <a
            href={`mailto:${siteConfig.email}`}
            className="group inline-flex items-center gap-3 px-9 py-4.5 bg-[#fafafa] text-[#050505] font-[family-name:var(--font-space-grotesk)] text-xs font-bold tracking-[0.18em] uppercase rounded-full hover:bg-[#38bdf8] hover:text-[#050505] transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_24px_rgba(255,255,255,0.18)]"
          >
            <Mail className="w-4 h-4 text-current" />
            <span>Transmit Email</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <button
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-2.5 px-7 py-4.5 border border-white/[0.12] bg-[#07080e]/85 backdrop-blur-xl text-[#fafafa] font-[family-name:var(--font-space-grotesk)] text-xs font-semibold tracking-wider uppercase rounded-full hover:border-[#38bdf8] hover:text-[#38bdf8] transition-all duration-300"
            aria-label="Copy email address"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-mono">COPIED TO CLIPBOARD</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#71717a]" />
                <span className="font-mono">{siteConfig.email}</span>
              </>
            )}
          </button>
        </div>

        {/* Telemetry Footer Grid */}
        <div className="contact-reveal pt-12 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-between">
          {/* Social Profiles */}
          <div className="flex flex-wrap items-center gap-8">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-sm text-[#71717a] hover:text-[#fafafa] font-[family-name:var(--font-space-grotesk)] transition-colors duration-200"
              >
                <span className="font-medium tracking-wide">{link.label}</span>
                <span className="text-[11px] text-[#52525b] font-mono group-hover:text-[#38bdf8] transition-colors">
                  {link.handle}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </a>
            ))}
          </div>

          {/* Telemetry info */}
          <div className="flex md:justify-end items-center gap-6 text-[11px] font-mono text-[#71717a]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>TIMEZONE: IST (UTC+5:30)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>STATUS: AVAILABLE FOR SELECT ROLES</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
