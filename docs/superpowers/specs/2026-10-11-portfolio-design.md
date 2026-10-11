# 3D Immersive Portfolio — Design Spec

## Goal
Build a production-quality personal portfolio for HIMANISH — a dark, cinematic, immersive website with a real Three.js 3D hero, scroll-driven storytelling, editorial typography, and polished interactions. Inspired by AVARA's art direction; adapted for a multidisciplinary developer/creative technologist brand.

## Brand
Present HIMANISH as a multidisciplinary developer and creative technologist: full-stack engineering, cybersecurity, AI, motion graphics/Blender/3D, ATL Lab coordination/hackathons. Tone: confident, concise, technical depth + creativity. No fabricated achievements.

## Visual System

### Colors
- Background: `#050505` (near-black)
- Text primary: `#f5f5f5` (warm white)
- Text secondary: `#888888` (muted gray)
- Accent: `#4a9eff` (cool blue — used sparingly for CTAs, hover states)
- Surface: `#111111` (cards/elevated surfaces)
- Border: `#1a1a1a` (subtle separators)

### Typography
- Display/Headings: Space Grotesk (Google Fonts, free) — geometric, modern, editorial feel
- Body: Inter (Google Fonts, free) — clean readability
- Fluid sizing: clamp()-based, from ~1rem body to ~8vw hero headings
- Strong hierarchy: oversized headings, generous negative space, controlled line-height

### Spacing & Layout
- Max content width: 1400px
- Section padding: 120px+ vertical on desktop, 80px on mobile
- Generous negative space between sections
- Grid: CSS Grid + Flexbox, responsive breakpoints at 768px and 1024px

## 3D Hero — Sculptural Torus Knot
- Single large TorusKnot geometry (MeshPhysicalMaterial)
- Dark metallic/ceramic material: roughness 0.3, metalness 0.8, clearcoat 0.5
- Color: dark charcoal `#1a1a2e` with environment reflections
- Rim lighting: one key light (cool blue), one fill (warm), one rim (white)
- Slow continuous rotation (~0.001 rad/frame)
- Mouse-reactive camera: subtle parallax (±2° range)
- Cinematic intro: geometry scales from 0, lights fade in, text staggers in
- Post-processing: subtle bloom (threshold 0.8, intensity 0.3)
- Environment map for reflections (Drei's Environment preset)
- Mobile: lower pixel ratio (1.5 max), no bloom, simpler geometry

## Sections

### Navigation
- Fixed top, transparent bg, blur on scroll
- Left: "HIMANISH" wordmark (Space Grotesk, tracked)
- Right: Work, About, Lab, Contact — smooth scroll anchors
- Mobile: hamburger menu with fullscreen overlay
- Active section indicator

### Hero (pinned, fullscreen)
- 3D scene as background, full viewport
- "HIMANISH" as massive display text (clamp 6-12vw)
- Subtitle: "Engineering systems. Designing experiences."
- Supporting: "I build across software, AI, cybersecurity, and interactive digital experiences."
- Two CTAs: "Explore my work" (primary), "Get in touch" (secondary/outline)
- Scroll indicator: animated chevron/arrow at bottom
- Cinematic entrance: staggered reveal over ~2s

### Selected Work
- Editorial layout: alternating large/small compositions, NOT a grid of cards
- Each project: title, one-line description, category tags, tech tags, status badge
- Hover: subtle scale + overlay with "View Project →"
- Status badges: "Completed", "Prototype", "In Progress", "Concept"
- Placeholder projects (clearly marked for replacement):
  1. NEXUS — "Network detection and response platform" — Concept
  2. AI Research Tool — "AI-powered competitor analysis" — Prototype
  3. Portfolio — "This immersive 3D portfolio" — Completed
- Abstract gradient/noise visuals as project thumbnails (no fake screenshots)
- All data in siteConfig.ts for easy editing

### About
- Split layout: text left, decorative element right
- Concise paragraphs covering: engineering philosophy, AI/cybersecurity interests, creative tech (Blender, motion), ATL Lab/hackathons
- No bio-style "I am a developer who..."
- Subtle scroll-triggered text reveals

### Skills
- Four columns: Engineering, AI & ML, Cybersecurity, Creative Technology
- Clean typographic list — no progress bars, no percentages
- Each category: category name + list of technologies
- Subtle stagger animation on scroll entry

### Lab / Experiments
- 2-3 placeholder entries for creative coding, 3D studies, prototypes
- Each: title, short description, "Experiment" / "Study" label
- Clearly labeled as concepts/unfinished
- Minimal card layout with hover effects

### Contact
- Large heading: "Let's build something"
- Configurable email, GitHub, LinkedIn links
- Social links as clean text links, not icon soup
- Elegant closing statement

### Footer
- Minimal: "© 2026 HIMANISH" left, "Built with Next.js & Three.js" right
- Top border separator

## Animation System (GSAP + ScrollTrigger)
- Hero: pinned for 1 viewport height, 3D scene parallax on scroll
- Text reveals: clip-path or translateY with opacity, staggered 0.1s
- Section entrances: fade-up with 60px offset, 0.8s duration
- Project hovers: scale 1.02, overlay fade 0.3s
- Navigation: backdrop-filter blur transition on scroll
- Easing: power3.out for entrances, power2.inOut for hovers
- `prefers-reduced-motion`: disable all transforms/animations, show content statically
- Cleanup: kill ScrollTriggers on unmount

## Performance
- Device detection: mobile gets pixelRatio capped at 1.5, no bloom, simpler materials
- Lazy load 3D scene (dynamic import with Suspense)
- Canvas renders only when in viewport (frameloop="demand" + invalidate)
- Cleanup WebGL context on unmount
- Images: Next.js Image optimization (when real images added later)
- Fonts: display=swap, preconnect to Google Fonts

## Accessibility
- Semantic HTML: nav, main, section, footer, h1-h3 hierarchy
- All interactive elements keyboard-focusable with visible focus styles
- Aria labels on icon buttons and navigation
- Color contrast: #f5f5f5 on #050505 = 18.1:1 (AAA)
- Skip-to-content link
- WebGL fallback: dark gradient background when canvas unavailable
- prefers-reduced-motion: static presentation, no transforms

## Tech Stack
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS 3
- Three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing
- GSAP + ScrollTrigger (self-hosted, not CDN)
- Lucide React (icons)
- Google Fonts (Space Grotesk + Inter via next/font)

## Configuration
Single `src/config/siteConfig.ts` file containing:
- Personal info (name, tagline, description, email)
- Social links (GitHub, LinkedIn, Twitter — optional)
- Project data (title, description, tech, status, link, category)
- Lab experiments data
- Skills data grouped by category
