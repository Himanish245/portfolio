'use client';

import { useEffect } from 'react';

export interface ScrollProgressRef {
  target: number;
  rawScroll: number;
}

// Global mutable progress object for 120fps render loop
export const globalScrollProgress: ScrollProgressRef = {
  target: 0,
  rawScroll: 0,
};

export function useScrollProgress() {
  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const vh = window.innerHeight || 800;

      // Single unified scroll travel distance (1.4 viewports)
      const maxTravel = vh * 1.4;
      const progress = Math.min(Math.max(scrollY / maxTravel, 0), 1);

      globalScrollProgress.target = progress;
      globalScrollProgress.rawScroll = scrollY;
    };

    update();

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return globalScrollProgress;
}
