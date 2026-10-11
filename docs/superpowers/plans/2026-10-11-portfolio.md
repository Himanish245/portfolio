# 3D Immersive Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build HIMANISH's complete immersive 3D portfolio — dark cinematic site with Three.js hero, GSAP scroll animations, editorial typography, all sections functional.

**Architecture:** Next.js 14 App Router with a single page (`page.tsx`) composed of section components. 3D scene is a separate R3F canvas lazily loaded. GSAP ScrollTrigger drives all scroll-linked animations via a custom `useScrollAnimation` hook. All personal data lives in `siteConfig.ts`.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS 3, Three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing, GSAP, ScrollTrigger, Lucide React, next/font (Space Grotesk + Inter)

**Spec:** `docs/superpowers/specs/2026-10-11-portfolio-design.md`

## Global Constraints

- All personal data configurable via `src/config/siteConfig.ts` — no hardcoded names/links in components
- No fabricated achievements, stats, client logos, or fake project screenshots
- Semantic HTML with proper heading hierarchy (one h1, sections with h2)
- `prefers-reduced-motion` respected everywhere — static fallback
- Mobile: pixelRatio ≤ 1.5, no post-processing bloom, touch-friendly tap targets ≥ 44px
- TypeScript strict mode, no `any` types in component interfaces
- Tailwind for styling; no separate CSS files except `globals.css` for base resets

## Review Focus

1. WebGL context cleanup on unmount — leaking contexts crash tabs on navigation
2. GSAP ScrollTrigger cleanup in useEffect returns — stale triggers cause jumps on re-render
3. Mobile hamburger menu must trap focus and close on anchor click
4. 3D canvas should not render when scrolled out of viewport — wasted GPU
5. Font loading flash — Space Grotesk must use `display: swap` and preload

---

## File Structure

```
src/
  app/
    layout.tsx          — Root layout, fonts, metadata, body structure
    page.tsx            — Single page composing all sections
    globals.css         — Tailwind directives, base resets, CSS custom properties
  config/
    siteConfig.ts       — All personal data, projects, skills, links
  components/
    Navigation.tsx      — Fixed nav with scroll-aware blur, mobile menu
    Hero.tsx            — Hero section with text + CTA overlaying 3D
    HeroScene.tsx       — R3F Canvas + 3D torus knot + lights + postprocessing
    Work.tsx            — Selected work section with editorial project cards
    ProjectCard.tsx     — Individual project with hover effects
    About.tsx           — About section with text reveals
    Skills.tsx          — Skills grid by category
    Lab.tsx             — Experiments showcase
    Contact.tsx         — Contact section with links
    Footer.tsx          — Minimal footer
    ScrollIndicator.tsx — Animated scroll-down arrow
  hooks/
    useScrollAnimation.ts  — Reusable GSAP ScrollTrigger hook
    useReducedMotion.ts    — prefers-reduced-motion detector
    useMousePosition.ts    — Normalized mouse position for 3D parallax
    useMobileDetect.ts     — Mobile/capability detection
```

---

### Task 1: Project Scaffold + Config + Layout

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.js`, `postcss.config.js`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Create: `src/config/siteConfig.ts`

**Interfaces:**
- Produces: `siteConfig` object with typed interfaces `SiteConfig`, `Project`, `Skill`, `LabExperiment` consumed by all section components

- [ ] **Step 1: Initialize Next.js project with TypeScript + Tailwind**
  Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`

- [ ] **Step 2: Install 3D and animation dependencies**
  Run: `npm install three @react-three/fiber @react-three/drei @react-three/postprocessing gsap lucide-react`
  Run: `npm install -D @types/three`

- [ ] **Step 3: Create `src/config/siteConfig.ts`**
  Define interfaces: `Project { title, description, category, technologies: string[], status: 'completed'|'prototype'|'in-progress'|'concept', link?: string, github?: string }`, `SkillCategory { name, skills: string[] }`, `LabExperiment { title, description, label: string }`, `SiteConfig { name, tagline, subtitle, description, email, social: { github?, linkedin?, twitter? }, projects: Project[], skills: SkillCategory[], experiments: LabExperiment[] }`. Populate with HIMANISH data from spec.

- [ ] **Step 4: Create `src/app/globals.css`**
  Tailwind directives + custom properties for colors (--bg, --text, --accent, --surface, --border). Base resets: smooth scroll, selection color, scrollbar styling. `@media (prefers-reduced-motion: reduce)` disabling scroll-behavior.

- [ ] **Step 5: Create `src/app/layout.tsx`**
  Import Space Grotesk + Inter via `next/font/google`. Set metadata (title, description, theme-color, OG tags). Apply font variables to body with bg-[#050505] text-[#f5f5f5].

- [ ] **Step 6: Create `src/app/page.tsx`**
  Import and compose: Navigation, Hero, Work, About, Skills, Lab, Contact, Footer (stub components returning section with id and placeholder h2 for now).

- [ ] **Step 7: Create stub components for all sections**
  Each returns `<section id="name" className="min-h-screen"><h2>Name</h2></section>`. Files: Navigation.tsx, Hero.tsx, Work.tsx, About.tsx, Skills.tsx, Lab.tsx, Contact.tsx, Footer.tsx.

- [ ] **Step 8: Verify build and dev server**
  Run: `npm run dev`
  Expected: Page loads at localhost:3000 with all section stubs visible.

- [ ] **Step 9: Commit**
  `git add -A && git commit -m "feat: scaffold project with config, layout, and stub sections"`

---

### Task 2: Custom Hooks + Animation Utilities

**Files:**
- Create: `src/hooks/useScrollAnimation.ts`
- Create: `src/hooks/useReducedMotion.ts`
- Create: `src/hooks/useMousePosition.ts`
- Create: `src/hooks/useMobileDetect.ts`

**Interfaces:**
- Produces: `useScrollAnimation(ref, config)` — registers GSAP ScrollTrigger on ref element, returns cleanup. `useReducedMotion()` → `boolean`. `useMousePosition()` → `{ x: number, y: number }` normalized -1 to 1. `useMobileDetect()` → `{ isMobile: boolean, pixelRatio: number }`.

- [ ] **Step 1: Create `useReducedMotion.ts`**
  Uses `window.matchMedia('(prefers-reduced-motion: reduce)')` with listener. Returns boolean.

- [ ] **Step 2: Create `useMousePosition.ts`**
  Tracks mousemove on window, normalizes to -1..1 range. Lerps for smoothness. Cleans up listener on unmount.

- [ ] **Step 3: Create `useMobileDetect.ts`**
  Checks `window.innerWidth < 768` and caps `window.devicePixelRatio`. Returns `{ isMobile, pixelRatio: Math.min(dpr, isMobile ? 1.5 : 2) }`.

- [ ] **Step 4: Create `useScrollAnimation.ts`**
  Registers GSAP ScrollTrigger. Takes ref + animation config (from/to props, trigger options). Checks `useReducedMotion` and skips if true. Kills trigger on unmount.

- [ ] **Step 5: Verify hooks compile**
  Run: `npm run build`
  Expected: Build succeeds with no type errors.

- [ ] **Step 6: Commit**
  `git add -A && git commit -m "feat: add animation and device hooks"`

---

### Task 3: Navigation Component

**Files:**
- Modify: `src/components/Navigation.tsx`

**Interfaces:**
- Consumes: `siteConfig.name` for wordmark, section IDs for scroll targets
- Produces: Fixed navigation with smooth-scroll links, mobile menu

- [ ] **Step 1: Implement Navigation.tsx**
  Fixed position, z-50. Left: wordmark (siteConfig.name, Space Grotesk, tracking-widest, uppercase). Right: Work, About, Lab, Contact as smooth-scroll anchor links. On scroll past 50px: backdrop-blur-md + bg-black/50 transition. Mobile (<768px): hamburger button → fullscreen overlay menu with staggered link animation. Close on anchor click + Escape key.

- [ ] **Step 2: Verify on dev server**
  Run: `npm run dev`
  Expected: Nav visible, blur triggers on scroll, mobile menu opens/closes, anchor links scroll to sections.

- [ ] **Step 3: Commit**
  `git add -A && git commit -m "feat: navigation with scroll blur and mobile menu"`

---

### Task 4: 3D Hero Scene

**Files:**
- Create: `src/components/HeroScene.tsx`
- Modify: `src/components/Hero.tsx`
- Create: `src/components/ScrollIndicator.tsx`

**Interfaces:**
- Consumes: `useMousePosition()`, `useMobileDetect()`, `useReducedMotion()`
- Produces: Full hero section with 3D background, text overlay, CTAs, scroll indicator

- [ ] **Step 1: Create `HeroScene.tsx` — R3F Canvas with 3D scene**
  Canvas with `camera={{ position: [0, 0, 5], fov: 45 }}`. Inside: TorusKnot geometry (args [1, 0.3, 256, 64]), MeshPhysicalMaterial (color #1a1a2e, roughness 0.3, metalness 0.8, clearcoat 0.5). Three lights: directional (blue-tinted, position [5,5,5]), point (warm, [-3,-2,4]), rim (white, [0,3,-5]). Environment preset "night" from Drei. useFrame: slow rotation + mouse-based camera offset (lerp toward mouse * 0.5). Mobile: skip EffectComposer/Bloom, lower geometry segments (128, 32). Wrap in `Suspense` with null fallback. Dynamic import with `ssr: false`.

- [ ] **Step 2: Create `ScrollIndicator.tsx`**
  Animated chevron/arrow at bottom center. CSS animation: translateY bounce + opacity pulse. Hidden when prefers-reduced-motion.

- [ ] **Step 3: Implement `Hero.tsx`**
  Fullscreen section (h-screen). HeroScene as absolute background. Overlay content centered: "HIMANISH" as h1 (text-[clamp(3rem,10vw,10rem)], Space Grotesk, font-bold, tracking-tight). Subtitle p tag. Supporting text. Two buttons: "Explore my work" (bg-accent, rounded) and "Get in touch" (border-accent, transparent). ScrollIndicator at bottom. All text from siteConfig.

- [ ] **Step 4: Add cinematic entrance animation**
  useEffect with GSAP timeline: h1 clipPath reveal (inset 0 100% 0 0 → inset 0 0 0 0), subtitle fade+translateY, buttons stagger fade+translateY. 0.5s initial delay. Skip entirely if reduced motion.

- [ ] **Step 5: Verify hero renders with 3D, text, buttons, animations**
  Run: `npm run dev`
  Expected: 3D torus renders, rotates, responds to mouse. Text animates in. Buttons visible and clickable. Scroll indicator bounces.

- [ ] **Step 6: Commit**
  `git add -A && git commit -m "feat: 3D hero with torus knot, cinematic entrance, CTAs"`

---

### Task 5: Selected Work Section

**Files:**
- Modify: `src/components/Work.tsx`
- Create: `src/components/ProjectCard.tsx`

**Interfaces:**
- Consumes: `siteConfig.projects`, `useScrollAnimation`
- Produces: Editorial project gallery with hover effects

- [ ] **Step 1: Create `ProjectCard.tsx`**
  Props: `Project`. Large card with abstract gradient background (unique per-project using CSS gradients seeded by index). Title (text-3xl+), description, tech tags (small pills), status badge (color-coded: green=completed, blue=prototype, yellow=in-progress, gray=concept). Hover: scale 1.02, overlay with "View Project →" text. Optional link wrapping. Aspect ratio ~16/10.

- [ ] **Step 2: Implement `Work.tsx`**
  Section heading "Selected Work" with scroll reveal. Editorial layout: first project full-width, subsequent alternating (60/40 split using grid). Map siteConfig.projects to ProjectCards. Scroll-triggered stagger entrance. Note: "These projects are configurable in siteConfig.ts" as HTML comment.

- [ ] **Step 3: Verify work section**
  Expected: Projects display with varied layout, hover effects work, status badges show, scroll animations trigger.

- [ ] **Step 4: Commit**
  `git add -A && git commit -m "feat: selected work section with editorial layout"`

---

### Task 6: About + Skills Sections

**Files:**
- Modify: `src/components/About.tsx`
- Modify: `src/components/Skills.tsx`

**Interfaces:**
- Consumes: `siteConfig.skills`, `useScrollAnimation`

- [ ] **Step 1: Implement `About.tsx`**
  Two-column layout (text left, decorative right). Heading "About" with reveal. 3-4 concise paragraphs covering: 1) Engineering philosophy (building real systems, not just frontends), 2) AI + cybersecurity intersection, 3) Creative technology (Blender, motion, 3D), 4) ATL Lab + hackathons. Right column: subtle CSS gradient orb or geometric decoration. Scroll-triggered paragraph reveals.

- [ ] **Step 2: Implement `Skills.tsx`**
  Heading "Technologies" or "Stack". Four columns (responsive: 2 on tablet, 1 on mobile): Engineering (TypeScript, React, Next.js, Node.js, Python, PostgreSQL, Docker), AI & ML (TensorFlow, PyTorch, LangChain, OpenAI, RAG, Vector DBs), Cybersecurity (Network Security, Penetration Testing, SIEM, Threat Detection, Cryptography), Creative Technology (Three.js, Blender, GSAP, WebGL, Figma, After Effects). Clean typographic list: category name bold, skills as lighter weight list. Stagger animation on scroll.

- [ ] **Step 3: Verify both sections**
  Expected: About text readable with good spacing, skills organized in columns, responsive on mobile, scroll animations work.

- [ ] **Step 4: Commit**
  `git add -A && git commit -m "feat: about and skills sections"`

---

### Task 7: Lab + Contact + Footer

**Files:**
- Modify: `src/components/Lab.tsx`
- Modify: `src/components/Contact.tsx`
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: `siteConfig.experiments`, `siteConfig.email`, `siteConfig.social`

- [ ] **Step 1: Implement `Lab.tsx`**
  Heading "Lab". Grid of 2-3 experiment cards. Each: title, short description, label badge ("Experiment" / "Study" / "Prototype"). Subtle hover: border-accent glow. Scroll stagger entrance. Data from siteConfig.experiments.

- [ ] **Step 2: Implement `Contact.tsx`**
  Large heading "Let's build something" (text-5xl+). Supporting line. Email link (mailto:). Social links: GitHub, LinkedIn as clean text links with arrow icon (Lucide ArrowUpRight). Generous padding. Scroll reveal.

- [ ] **Step 3: Implement `Footer.tsx`**
  Top border (border-t border-[#1a1a1a]). Flex between: "© 2026 HIMANISH" left, "Built with Next.js & Three.js" right. Padding py-8. Text-sm text-[#888].

- [ ] **Step 4: Verify all three sections + full page scroll**
  Expected: Lab cards display, contact links functional, footer anchored at bottom, full page scrolls smoothly through all sections.

- [ ] **Step 5: Commit**
  `git add -A && git commit -m "feat: lab, contact, and footer sections"`

---

### Task 8: Polish, Performance, and Responsiveness

**Files:**
- Modify: multiple component files for responsive fixes
- Modify: `src/app/globals.css` for final polish

- [ ] **Step 1: Test and fix mobile layout (< 768px)**
  Check: nav hamburger works, hero text sizes down, work section stacks vertically, skills → 1 column, contact stacks, footer wraps. Fix any overflow-x issues.

- [ ] **Step 2: Test and fix tablet layout (768-1024px)**
  Check: skills → 2 columns, work alternation still readable, proper padding reduction.

- [ ] **Step 3: Verify prefers-reduced-motion**
  All GSAP animations skip, 3D scene still renders but without entrance animation, content visible immediately.

- [ ] **Step 4: Verify 3D fallback**
  If WebGL fails or canvas errors: gradient background shows, all text content accessible.

- [ ] **Step 5: Run production build**
  Run: `npm run build`
  Expected: Build succeeds, no errors, no significant warnings.

- [ ] **Step 6: Final commit**
  `git add -A && git commit -m "feat: responsive polish, performance, and accessibility"`
