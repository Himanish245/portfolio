'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Copy, Check, Mail } from 'lucide-react';
import siteConfig from '@/config/siteConfig';
import { useReducedMotion } from '@/hooks/useReducedMotion';

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
      className="relative py-28 md:py-44 border-t border-[#1a1a1a]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="contact-reveal mb-8">
          <span className="text-xs uppercase tracking-[0.3em] text-[#4a9eff] font-[family-name:var(--font-space-grotesk)] block mb-3 font-semibold">
            05 // Initiate Contact
          </span>
        </div>

        {/* Large Cinematic Editorial Headline */}
        <h2 className="contact-reveal font-[family-name:var(--font-space-grotesk)] text-[clamp(2.5rem,7.5vw,7rem)] font-bold text-[#f5f5f5] leading-[0.92] tracking-tight mb-10 max-w-4xl">
          Let&apos;s build
          <br />
          <span className="text-[#888]">something memorable.</span>
        </h2>

        <p className="contact-reveal text-[#888] text-base md:text-lg max-w-xl mb-14 leading-relaxed font-[family-name:var(--font-inter)]">
          Have an interesting project, engineering challenge, or creative technology inquiry? Let&apos;s connect.
        </p>

        {/* Interactive Email Bar */}
        <div className="contact-reveal flex flex-wrap items-center gap-4 mb-16">
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#f5f5f5] text-[#050505] font-[family-name:var(--font-space-grotesk)] text-sm font-bold tracking-wide rounded-full hover:bg-[#4a9eff] hover:text-[#050505] transition-all duration-300 hover:scale-[1.02]"
          >
            <Mail className="w-4 h-4" />
            <span>Send Email</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <button
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-2.5 px-6 py-4 border border-[#222] bg-[#0d0d10] text-[#f5f5f5] font-[family-name:var(--font-space-grotesk)] text-sm font-medium rounded-full hover:border-[#4a9eff] hover:text-[#4a9eff] transition-all duration-300"
            aria-label="Copy email address"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#888]" />
                <span>{siteConfig.email}</span>
              </>
            )}
          </button>
        </div>

        {/* Links & Telemetry Grid */}
        <div className="contact-reveal pt-12 border-t border-[#1a1a1a] grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-between">
          {/* Social Profiles */}
          <div className="flex flex-wrap items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-sm text-[#888] hover:text-[#f5f5f5] font-[family-name:var(--font-space-grotesk)] transition-colors duration-200"
              >
                <span>{link.label}</span>
                <span className="text-[11px] text-[#555] font-mono group-hover:text-[#4a9eff] transition-colors">
                  {link.handle}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </a>
            ))}
          </div>

          {/* Telemetry info */}
          <div className="flex md:justify-end items-center gap-6 text-[11px] font-mono text-[#555]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>TIMEZONE: IST (UTC+5:30)</span>
            </div>
            <span>•</span>
            <span>REMOTE / GLOBAL</span>
          </div>
        </div>
      </div>
    </section>
  );
}
