import React, { useState, useEffect } from 'react';
import LetterGlitch from './LetterGlitch';

interface BackgroundGlitchProps {
  glitchColors?: string[];
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
}

const BackgroundGlitch: React.FC<BackgroundGlitchProps> = ({
  glitchColors = ['#0f172a', '#1e293b', '#334155'],
  glitchSpeed = 100,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200); // Small delay to ensure mounting
    
    return () => clearTimeout(timer);
  }, []);
  
  // Basic error boundary concept for this component
  useEffect(() => {
    const errorHandler = (error: Event | string) => {
      console.error("Error in BackgroundGlitch or its children:", error);
      setHasError(true);
    };
    window.addEventListener('error', errorHandler);
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);
  
  if (hasError) {
    return (
      <div 
        className="fixed inset-0" 
        style={{
          backgroundColor: '#0f172a', // Fallback solid color
          zIndex: -5,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh'
        }}
      />
    );
  }

  return (
    <div 
      className="fixed inset-0 pointer-events-none" 
      style={{
        zIndex: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
    >
      {isLoaded ? (
        <LetterGlitch
          glitchColors={glitchColors}
          glitchSpeed={glitchSpeed}
          centerVignette={centerVignette}
          outerVignette={outerVignette}
          smooth={smooth}
        />
      ) : (
        <div style={{width: '100%', height: '100%', backgroundColor: 'transparent'}}></div>
      )}
    </div>
  );
};

export default BackgroundGlitch; 