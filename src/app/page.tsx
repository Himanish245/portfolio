import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Work from '@/components/Work';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Lab from '@/components/Lab';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import GlobalCanvas from '@/components/GlobalCanvas';
import FilmGrain from '@/components/FilmGrain';

export default function Home() {
  return (
    <>
      <CustomCursor />
      <FilmGrain />

      {/* ABSOLUTE PRIORITY 1: Persistent 3D Workstation Canvas (hero -> pop-out -> corner docked) */}
      <GlobalCanvas />

      <Navigation />

      {/* Editorial Content Layers */}
      <main id="main-content" className="relative z-10">
        <Hero />
        <Work />
        <About />
        <Skills />
        <Lab />
        <Contact />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
