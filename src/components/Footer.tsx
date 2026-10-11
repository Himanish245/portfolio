'use client';

import { ArrowUp } from 'lucide-react';
import siteConfig from '@/config/siteConfig';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#1a1a1a] py-10 bg-[#050505]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold tracking-wider text-[#f5f5f5]">
            {siteConfig.name}
          </span>
          <span className="text-[#333]">•</span>
          <span className="text-xs text-[#777] font-mono">
            &copy; 2026 ALL RIGHTS RESERVED
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-xs text-[#555] font-mono">
            ENGINEERED WITH NEXT.JS, THREE.JS &amp; GSAP
          </span>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full border border-[#222] text-[#888] hover:text-[#f5f5f5] hover:border-[#4a9eff] transition-all duration-300"
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
