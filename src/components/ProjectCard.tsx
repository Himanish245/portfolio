'use client';

import { useState, useRef, MouseEvent } from 'react';
import dynamic from 'next/dynamic';
import { type Project } from '@/config/siteConfig';
import { ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Dynamic import of 3D Project Visualizer
const Project3DVisualizer = dynamic(() => import('./shaders/Project3DVisualizer'), {
  ssr: false,
  loading: () => null,
});

const statusColors: Record<Project['status'], string> = {
  completed: 'text-emerald-400 border-emerald-400/30 bg-emerald-500/10',
  prototype: 'text-sky-400 border-sky-400/30 bg-sky-500/10',
  'in-progress': 'text-amber-400 border-amber-400/30 bg-amber-500/10',
  concept: 'text-zinc-400 border-zinc-400/30 bg-zinc-500/10',
};

const statusLabels: Record<Project['status'], string> = {
  completed: 'Verified Complete',
  prototype: 'Functional Prototype',
  'in-progress': 'Active Development',
  concept: 'System Architecture',
};

interface ProjectCardProps {
  project: Project;
  index: number;
  featured?: boolean;
}

export default function ProjectCard({ project, index, featured }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    setSpotlight({ x: percentX, y: percentY });

    // Tactile 3D card tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const Wrapper = project.link ? 'a' : 'div';
  const wrapperProps = project.link
    ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
      className="w-full h-full"
    >
      <Wrapper
        {...wrapperProps}
        style={{
          transform:
            !reducedMotion && isHovered
              ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-4px)`
              : 'rotateX(0deg) rotateY(0deg) translateY(0)',
          transition: isHovered
            ? 'transform 0.15s ease-out, border-color 0.4s ease'
            : 'transform 0.5s ease-out, border-color 0.4s ease',
        }}
        className={`group relative block overflow-hidden rounded-2xl border border-white/[0.08] bg-[#07080e]/85 backdrop-blur-xl hover:border-white/[0.25] hover:bg-[#0a0c16]/90 transition-all duration-500 shadow-[0_12px_40px_rgba(0,0,0,0.5)] ${
          featured ? 'min-h-[460px] md:min-h-[520px]' : 'min-h-[400px]'
        } ${project.link ? 'cursor-pointer' : ''}`}
      >
        {/* Deep ambient card gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c101c]/50 via-[#07080e]/90 to-[#030306] pointer-events-none" />

        {/* Dedicated 3D Real-Time Visualizer viewport in card */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 group-hover:opacity-85 transition-opacity duration-700">
          <Project3DVisualizer type={project.title} />
        </div>

        {/* Pointer spotlight glow */}
        {isHovered && !reducedMotion && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 420px at ${spotlight.x}% ${spotlight.y}%, rgba(56, 189, 248, 0.14), transparent 70%)`,
            }}
          />
        )}

        {/* Subtle grid texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Foreground Content */}
        <div className="relative z-10 h-full p-8 md:p-12 flex flex-col justify-between">
          {/* Top Status & Telemetry Header */}
          <div className="flex items-center justify-between gap-4 mb-16">
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase px-3 py-1 border rounded-full font-mono font-medium ${statusColors[project.status]}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
              {statusLabels[project.status]}
            </span>

            <span className="font-mono text-xs text-[#71717a] tracking-widest">
              0{index + 1} {'//'} 04
            </span>
          </div>

          {/* Bottom Title, Summary, and Architecture Stacks */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3
                className={`font-[family-name:var(--font-space-grotesk)] font-bold text-[#fafafa] tracking-tight group-hover:text-[#38bdf8] transition-colors duration-300 ${
                  featured ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'
                }`}
              >
                {project.title}
              </h3>
              {project.link && (
                <ArrowUpRight className="w-5 h-5 text-[#71717a] group-hover:text-[#38bdf8] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 flex-shrink-0 mt-1" />
              )}
            </div>

            <p className="text-[#a1a1aa] text-sm md:text-base mb-6 max-w-xl leading-relaxed font-[family-name:var(--font-inter)]">
              {project.description}
            </p>

            {/* Architecture Category & Stack Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/[0.08]">
              <span className="text-[11px] tracking-[0.18em] uppercase text-[#38bdf8] font-[family-name:var(--font-space-grotesk)] font-bold mr-2">
                {project.category}
              </span>
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-[11px] text-[#a1a1aa] bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/[0.08] font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
