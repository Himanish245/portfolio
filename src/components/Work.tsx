'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import siteConfig from '@/config/siteConfig';
import ProjectCard from './ProjectCard';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Project cards stagger
      if (projectsRef.current) {
        const cards = projectsRef.current.querySelectorAll('.project-card-wrapper');
        gsap.fromTo(
          cards,
          { opacity: 0, y: 70 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: projectsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative py-32 md:py-48 border-t border-white/[0.08]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Editorial Section Heading */}
        <div className="mb-20 md:mb-28 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs uppercase tracking-[0.3em] text-[#38bdf8] font-mono font-semibold">
                01 // SELECTED ARCHITECTURES
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-[#71717a] font-mono">
                SYSTEMS &amp; INTERACTIVE
              </span>
            </div>
            <h2
              ref={headingRef}
              className="font-[family-name:var(--font-space-grotesk)] text-[clamp(2.8rem,6.5vw,6rem)] font-extrabold text-[#fafafa] leading-[0.92] tracking-tight"
            >
              Engineering &amp;
              <br />
              <span className="text-[#71717a]">Architecture</span>
            </h2>
          </div>
          <p className="text-[#a1a1aa] text-base md:text-lg max-w-md font-[family-name:var(--font-inter)] leading-relaxed">
            Real implementations and verified systems across full-stack engineering, cybersecurity detection, applied AI pipelines, and interactive digital craft.
          </p>
        </div>

        {/* Editorial project composition */}
        <div ref={projectsRef} className="space-y-10">
          {/* Featured Flagship: NEXUS */}
          {siteConfig.projects[0] && (
            <div className="project-card-wrapper">
              <ProjectCard
                project={siteConfig.projects[0]}
                index={0}
                featured
              />
            </div>
          )}

          {/* 2-column grid for AI Research & Portfolio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {siteConfig.projects.slice(1, 3).map((project, i) => (
              <div key={project.title} className="project-card-wrapper">
                <ProjectCard
                  project={project}
                  index={i + 1}
                />
              </div>
            ))}
          </div>

          {/* 4th Project: ATL Lab & Hackathons */}
          {siteConfig.projects[3] && (
            <div className="project-card-wrapper">
              <ProjectCard
                project={siteConfig.projects[3]}
                index={3}
                featured={false}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
