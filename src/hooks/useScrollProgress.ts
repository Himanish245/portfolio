'use client';

import { useEffect } from 'react';

export interface ScrollProgressRef {
  current: number;
  target: number;
  rawScroll: number;
  pageProgress: number;
}

// Global mutable scroll progress for 60/120fps render loop
export const globalScrollProgress: ScrollProgressRef = {
  current: 0,
  target: 0,
  rawScroll: 0,
  pageProgress: 0,
};

export function useScrollProgress() {
  useEffect(() => {
    const updateScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const heroTravelDistance = window.innerHeight * 1.5; // distance over sticky hero
      const totalDocScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );

      // Hero sequence progress (0 to 1)
      const heroProgress = Math.min(Math.max(scrollY / heroTravelDistance, 0), 1);
      // Entire page progress (0 to 1)
      const pageProg = Math.min(Math.max(scrollY / totalDocScroll, 0), 1);

      globalScrollProgress.target = heroProgress;
      globalScrollProgress.rawScroll = scrollY;
      globalScrollProgress.pageProgress = pageProg;
    };

    // Immediate initial sync
    updateScroll();

    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  return globalScrollProgress;
}
