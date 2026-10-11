import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Work from '@/components/Work';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Lab from '@/components/Lab';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';

export default function Home() {
  return (
    <>
      <CustomCursor />
      <Navigation />
      <main id="main-content">
        <Hero />
        <Work />
        <About />
        <Skills />
        <Lab />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
