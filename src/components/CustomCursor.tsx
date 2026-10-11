'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Only show on devices with a fine pointer (mouse), not touchscreens
    const hasMouse = window.matchMedia('(pointer: fine)').matches;
    if (!hasMouse || reducedMotion) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let animationFrameId: number;

    const dot = dotRef.current;
    const ring = ringRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (dot) {
        dot.style.opacity = '1';
        dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
      if (ring) {
        ring.style.opacity = '1';
      }
    };

    const handleMouseDown = () => {
      if (ring) {
        ring.style.width = '24px';
        ring.style.height = '24px';
        ring.style.borderColor = 'rgba(74, 158, 255, 0.8)';
      }
    };

    const handleMouseUp = () => {
      if (ring) {
        ring.style.width = '32px';
        ring.style.height = '32px';
        ring.style.borderColor = 'rgba(245, 245, 245, 0.3)';
      }
    };

    // Smooth lerp for outer ring directly on DOM (0% React overhead)
    const loop = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      if (ring) {
        ring.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    // Check hovered interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !ring) return;
      const interactive = target.closest('a, button, input, textarea, [role="button"], .interactive-hover');
      if (interactive) {
        ring.style.width = '48px';
        ring.style.height = '48px';
        ring.style.borderColor = '#4a9eff';
        ring.style.backgroundColor = 'rgba(74, 158, 255, 0.08)';
      } else {
        ring.style.width = '32px';
        ring.style.height = '32px';
        ring.style.borderColor = 'rgba(245, 245, 245, 0.3)';
        ring.style.backgroundColor = 'transparent';
      }
    };

    const handleMouseLeave = () => {
      if (dot) dot.style.opacity = '0';
      if (ring) ring.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[999] overflow-hidden">
      {/* Small center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-[#4a9eff] rounded-full pointer-events-none opacity-0 transition-opacity duration-300 will-change-transform"
      />
      {/* Outer magnetic trailing ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full pointer-events-none border border-[#f5f5f5]/30 bg-transparent opacity-0 transition-[width,height,background-color,border-color] duration-200 ease-out will-change-transform"
      />
    </div>
  );
}
