'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
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

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPosition({ x: targetX, y: targetY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    // Smooth lerp for outer ring
    const loop = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      setTrailingPos({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    // Check hovered elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest('a, button, input, textarea, [role="button"], .interactive-hover');
      setIsHovered(!!interactive);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, reducedMotion]);

  if (reducedMotion || !isVisible) return null;

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[999] overflow-hidden">
      {/* Small center dot */}
      <div
        className="fixed w-2 h-2 bg-[#4a9eff] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isVisible ? 1 : 0,
        }}
      />
      {/* Outer magnetic trailing ring */}
      <div
        className={`fixed rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 border transition-[width,height,background-color,border-color] duration-200 ease-out ${
          isHovered
            ? 'w-12 h-12 border-[#4a9eff] bg-[#4a9eff]/10 backdrop-blur-[1px]'
            : isClicked
            ? 'w-6 h-6 border-[#4a9eff]/80 bg-transparent'
            : 'w-8 h-8 border-[#f5f5f5]/30 bg-transparent'
        }`}
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </div>
  );
}
