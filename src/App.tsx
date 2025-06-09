import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, Preload } from '@react-three/drei';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import ProjectsTabs from './components/ProjectsTabs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Background from './components/Background';
import BackgroundGlitch from './components/BackgroundGlitch';
import Model3D from './components/Model3D';
import Loading from './components/Loading';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Slightly longer to show the animation

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / totalScroll) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ThemeProvider>
      <div 
        className="min-h-screen bg-transparent text-dark dark:text-light transition-colors duration-300 relative"
        style={{ backgroundColor: '#0f172a' }}
      >
        {/* Progress Bar */}
        <div 
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent z-[100]" 
          style={{ width: `${scrollProgress}%` }}
        />

        {/* Letter Glitch Background - lower z-index */}
        <BackgroundGlitch 
          glitchColors={['#0f172a', '#1e293b', '#334155']} 
          glitchSpeed={120}
          centerVignette={false}
          outerVignette={true}
          smooth={true}
        />

        {/* 3D Background - higher z-index than glitch */}
        <div className="fixed inset-0" style={{ zIndex: -2 }}>
          <Canvas 
            camera={{ position: [0, 0, 2], fov: 60 }}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <Background />
              <Preload all />
            </Suspense>
          </Canvas>
        </div>

        <Header />
        
        <main className="relative z-10">
          <section className="min-h-screen relative">
            <div className="absolute inset-0 z-1">
              <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                <Suspense fallback={null}>
                  <Model3D />
                  <Preload all />
                </Suspense>
              </Canvas>
            </div>
            <Hero />
          </section>
          
          <About />
          <Skills />
          <ProjectsTabs />
          <Contact />
        </main>
        
        <Footer />
        
        {/* Loader for 3D models */}
        <Loader 
          dataInterpolation={(p) => `Loading ${Math.round(p)}%`}
          containerStyles={{ background: 'rgba(5, 10, 23, 0.8)' }}
          innerStyles={{ background: 'rgb(57, 162, 219)' }}
          barStyles={{ background: 'rgb(255, 134, 0)' }}
          dataStyles={{ color: '#ffffff', fontSize: '1rem' }}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;