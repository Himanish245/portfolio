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

export default function Home() {
  return (
    <>
      <CustomCursor />

      {/* Persistent 3D Canvas: starts in Hero, pops out, and settles in bottom corner across all sections */}
      <GlobalCanvas />

      <Navigation />

      {/* Editorial content layers */}
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
