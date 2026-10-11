'use client';

import { useEffect } from 'react';

export interface ScrollProgressRef {
  current: number;
  rawScroll: number;
  // 0 to 1 during first 700px (the pop-out phase)
  popProgress: number;
  // 0 to 1 between 500px and 1200px (the settle-down phase)
  settleProgress: number;
  // Global document progress (0 to 1)
  totalProgress: number;
}

// Global mutable progress object read directly in Three.js useFrame (zero re-render latency)
export const globalScrollProgress: ScrollProgressRef = {
  current: 0,
  rawScroll: 0,
  popProgress: 0,
  settleProgress: 0,
  totalProgress: 0,
};

export function useScrollProgress() {
  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const vh = window.innerHeight || 800;

      // Pop out over first 650px of scroll
      const popDist = Math.max(vh * 0.75, 450);
      const pop = Math.min(Math.max(scrollY / popDist, 0), 1);

      // Settle down between 450px and 1100px of scroll
      const settleStart = vh * 0.5;
      const settleEnd = vh * 1.3;
      const settle = Math.min(
        Math.max((scrollY - settleStart) / (settleEnd - settleStart), 0),
        1
      );

      const maxDocScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const total = Math.min(Math.max(scrollY / maxDocScroll, 0), 1);

      globalScrollProgress.rawScroll = scrollY;
      globalScrollProgress.popProgress = pop;
      globalScrollProgress.settleProgress = settle;
      globalScrollProgress.totalProgress = total;
      globalScrollProgress.current = pop;
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
