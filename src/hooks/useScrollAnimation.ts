'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationConfig {
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  trigger?: ScrollTrigger.Vars;
  stagger?: number;
  selector?: string;
}

export function useScrollAnimation<T extends HTMLElement>(
  config: ScrollAnimationConfig
) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;

    const ctx = gsap.context(() => {
      const targets = config.selector
        ? ref.current!.querySelectorAll(config.selector)
        : ref.current!;

      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: 60,
          ...config.from,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: config.stagger || 0,
          ...config.to,
          scrollTrigger: {
            trigger: ref.current!,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none none',
            ...config.trigger,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [reduced, config]);

  return ref;
}
