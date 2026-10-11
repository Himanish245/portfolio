'use client';

import { ArrowUp } from 'lucide-react';
import siteConfig from '@/config/siteConfig';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] py-10 bg-[#050505]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold tracking-wider text-[#fafafa]">
            {siteConfig.name}
          </span>
          <span className="text-[#333]">•</span>
          <span className="text-xs text-[#a1a1aa] font-mono">
            &copy; 2026 ALL RIGHTS RESERVED
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-xs text-[#666] font-mono">
            ENGINEERED WITH NEXT.JS, THREE.JS &amp; GSAP
          </span>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-[#888] hover:text-[#fafafa] hover:border-white/[0.2] transition-all duration-300"
            aria-label="Scroll to top of page"
            title="Back to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
