'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollProgressRef {
  current: number;
  target: number;
  velocity: number;
}

// Global shared mutable scroll progress to avoid React re-renders in WebGL render loop
export const globalScrollProgress: ScrollProgressRef = {
  current: 0,
  target: 0,
  velocity: 0,
};

export function useScrollProgress() {
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    // Create ScrollTrigger tracking scroll across hero and into work section
    triggerRef.current = ScrollTrigger.create({
      start: 0,
      end: () => window.innerHeight * 2.2, // spans across hero into work section
      onUpdate: (self) => {
        globalScrollProgress.target = self.progress;
        globalScrollProgress.velocity = self.getVelocity() / 1000;
      },
    });

    const handleScroll = () => {
      // Fallback simple calculation
      const maxScroll = window.innerHeight * 2.2;
      const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      if (!triggerRef.current) {
        globalScrollProgress.target = progress;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (triggerRef.current) triggerRef.current.kill();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return globalScrollProgress;
}
