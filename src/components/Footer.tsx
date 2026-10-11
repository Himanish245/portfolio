'use client';

import { ArrowUp } from 'lucide-react';
import siteConfig from '@/config/siteConfig';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] py-12 bg-[#030408]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold tracking-[0.2em] uppercase text-[#fafafa]">
            {siteConfig.name}
          </span>
          <span className="text-white/20">•</span>
          <span className="text-xs text-[#71717a] font-mono">
            &copy; 2026 ARCHITECTURE &amp; CRAFT
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-xs text-[#71717a] font-mono hidden md:inline">
            CORE: NEXT.JS // THREE.JS // GLSL // GSAP
          </span>

          <button
            onClick={scrollToTop}
            className="p-3 rounded-full border border-white/[0.08] bg-white/[0.03] text-[#71717a] hover:text-[#38bdf8] hover:border-[#38bdf8]/50 transition-all duration-300"
            aria-label="Scroll to top of page"
            title="Return to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
