'use client';

import { useState, useRef, MouseEvent } from 'react';
import { type Project } from '@/config/siteConfig';
import { ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const statusColors: Record<Project['status'], string> = {
  completed: 'text-emerald-400 border-emerald-400/30 bg-emerald-500/5',
  prototype: 'text-blue-400 border-blue-400/30 bg-blue-500/5',
  'in-progress': 'text-amber-400 border-amber-400/30 bg-amber-500/5',
  concept: 'text-[#aaa] border-[#888]/30 bg-[#888]/5',
};

const statusLabels: Record<Project['status'], string> = {
  completed: 'Verified Complete',
  prototype: 'Functional Prototype',
  'in-progress': 'Active Development',
  concept: 'System Concept',
};

// Generative SVG artwork components for each project type
function ProjectVisual({ title }: { title: string }) {
  if (title.includes('NEXUS')) {
    // Network radar & cyber telemetry grid
    return (
      <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 400 400" className="w-[120%] h-[120%] text-[#4a9eff]">
          {/* Radar circles */}
          <circle cx="200" cy="200" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
          <circle cx="200" cy="200" r="110" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4" />
          <circle cx="200" cy="200" r="160" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="6 6" strokeOpacity="0.3" />
          {/* Crosshairs */}
          <line x1="20" y1="200" x2="380" y2="200" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
          <line x1="200" y1="20" x2="200" y2="380" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
          {/* Nodes */}
          <circle cx="150" cy="140" r="3" fill="currentColor" />
          <circle cx="270" cy="170" r="4" fill="currentColor" />
          <circle cx="220" cy="260" r="2.5" fill="currentColor" />
          <circle cx="130" cy="240" r="2" fill="currentColor" />
          {/* Interconnections */}
          <line x1="150" y1="140" x2="270" y2="170" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5" />
          <line x1="270" y1="170" x2="220" y2="260" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5" />
          <line x1="220" y1="260" x2="130" y2="240" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5" />
        </svg>
      </div>
    );
  }

  if (title.includes('AI Research')) {
    // Neural graph & embedding constellation
    return (
      <div className="absolute inset-0 flex items-center justify-center opacity-35 group-hover:opacity-55 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 400 400" className="w-[120%] h-[120%] text-[#a855f7]">
          {/* Node clusters */}
          <g className="animate-pulse">
            <circle cx="200" cy="180" r="5" fill="#a855f7" />
            <circle cx="140" cy="120" r="3" fill="#4a9eff" />
            <circle cx="260" cy="130" r="3.5" fill="#4a9eff" />
            <circle cx="130" cy="230" r="4" fill="#a855f7" />
            <circle cx="270" cy="240" r="3" fill="#a855f7" />
            <circle cx="200" cy="280" r="4" fill="#4a9eff" />
          </g>
          {/* Constellation lines */}
          <path
            d="M 140 120 L 200 180 L 260 130 M 130 230 L 200 180 L 270 240 M 130 230 L 200 280 L 270 240 M 140 120 L 130 230"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeOpacity="0.4"
          />
          {/* Outer field rings */}
          <circle cx="200" cy="180" r="130" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" strokeOpacity="0.25" />
        </svg>
      </div>
    );
  }

  if (title.includes('Portfolio')) {
    // 3D wireframe geometric knot / polygon
    return (
      <div className="absolute inset-0 flex items-center justify-center opacity-35 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 400 400" className="w-[120%] h-[120%] text-[#38bdf8]">
          <polygon
            points="200,60 320,130 320,270 200,340 80,270 80,130"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeOpacity="0.5"
          />
          <polygon
            points="200,100 280,150 280,250 200,300 120,250 120,150"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeOpacity="0.4"
          />
          <line x1="200" y1="60" x2="200" y2="340" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" strokeOpacity="0.3" />
          <line x1="80" y1="130" x2="320" y2="270" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
          <line x1="80" y1="270" x2="320" y2="130" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
        </svg>
      </div>
    );
  }

  // ATL Lab & Hackathons — Circuit board & pulse waveform
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-35 group-hover:opacity-55 transition-opacity duration-700 pointer-events-none overflow-hidden">
      <svg viewBox="0 0 400 400" className="w-[120%] h-[120%] text-[#34d399]">
        {/* Circuit tracks */}
        <path
          d="M 50 100 L 150 100 L 190 140 L 250 140 L 280 110 L 350 110 M 60 220 L 140 220 L 180 180 L 260 180 M 100 300 L 180 300 L 220 260 L 320 260"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        {/* Terminal solder pads */}
        <circle cx="150" cy="100" r="3" fill="currentColor" />
        <circle cx="250" cy="140" r="3" fill="currentColor" />
        <circle cx="140" cy="220" r="3" fill="currentColor" />
        <circle cx="220" cy="260" r="3" fill="currentColor" />
        {/* Signal square wave */}
        <path
          d="M 80 160 L 110 160 L 110 130 L 140 130 L 140 160 L 170 160 L 170 130 L 200 130 L 200 160"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeOpacity="0.5"
        />
      </svg>
    </div>
  );
}

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

    // Calculate 3D tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
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
      style={{
        perspective: 1000,
      }}
      className="w-full"
    >
      <Wrapper
        {...wrapperProps}
        style={{
          transform: !reducedMotion && isHovered
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-4px)`
            : 'rotateX(0deg) rotateY(0deg) translateY(0)',
          transition: isHovered
            ? 'transform 0.15s ease-out, border-color 0.4s ease'
            : 'transform 0.5s ease-out, border-color 0.4s ease',
        }}
        className={`group relative block overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08090e]/75 backdrop-blur-md hover:border-white/[0.22] hover:bg-[#0b0d15]/85 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${
          featured ? 'min-h-[420px] md:min-h-[480px]' : 'min-h-[380px]'
        } ${project.link ? 'cursor-pointer' : ''}`}
      >
        {/* Background subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e111a]/50 via-[#07080d]/80 to-[#040407] pointer-events-none" />
        
        {/* Procedural generative project artwork */}
        <ProjectVisual title={project.title} />

        {/* Dynamic cursor spotlight glow */}
        {isHovered && !reducedMotion && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 350px at ${spotlight.x}% ${spotlight.y}%, rgba(74, 158, 255, 0.12), transparent 70%)`,
            }}
          />
        )}

        {/* Ultra-subtle noise overlay */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Content container */}
        <div className="relative z-10 h-full p-8 md:p-10 flex flex-col justify-between">
          {/* Top row: Status Badge & Project index */}
          <div className="flex items-center justify-between gap-4 mb-12">
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase px-3 py-1 border rounded-full font-medium ${statusColors[project.status]}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
              {statusLabels[project.status]}
            </span>

            <span className="font-[family-name:var(--font-space-grotesk)] text-xs text-[#666] tracking-widest font-mono">
              0{index + 1} {'//'} 04
            </span>
          </div>

          {/* Bottom row: Title, Description, Tags */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3
                className={`font-[family-name:var(--font-space-grotesk)] font-bold text-[#fafafa] tracking-tight group-hover:text-[#4a9eff] transition-colors duration-300 ${
                  featured ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'
                }`}
              >
                {project.title}
              </h3>
              {project.link && (
                <ArrowUpRight
                  className="w-5 h-5 text-[#888] group-hover:text-[#4a9eff] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 flex-shrink-0 mt-1"
                />
              )}
            </div>

            <p className="text-[#a1a1aa] text-sm md:text-base mb-6 max-w-xl leading-relaxed font-[family-name:var(--font-inter)]">
              {project.description}
            </p>

            {/* Category and technology pills */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/[0.08]">
              <span className="text-[11px] tracking-[0.15em] uppercase text-[#4a9eff] font-[family-name:var(--font-space-grotesk)] font-semibold mr-2">
                {project.category}
              </span>
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-[11px] text-[#a1a1aa] bg-white/[0.03] px-2.5 py-0.5 rounded-md border border-white/[0.07] font-[family-name:var(--font-inter)]"
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
