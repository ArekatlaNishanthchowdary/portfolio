import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  rotate: number;
}

interface FloatingElementsProps {
  count?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  className?: string;
}

const FloatingElements: React.FC<FloatingElementsProps> = ({
  count = 10,
  colors = ['#3BA2DB', '#0A2463', '#FF8600', '#D7F9FF'],
  minSize = 8,
  maxSize = 30,
  className = '',
}) => {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  
  useEffect(() => {
    const generateElements = () => {
      const newElements: FloatingElement[] = [];
      
      for (let i = 0; i < count; i++) {
        newElements.push({
          id: i,
          x: Math.random() * 100, // Position as percentage of container width
          y: Math.random() * 100, // Position as percentage of container height
          size: Math.random() * (maxSize - minSize) + minSize,
          color: colors[Math.floor(Math.random() * colors.length)],
          duration: Math.random() * 20 + 30, // Between 30-50 seconds for a cycle (much slower)
          delay: Math.random() * -10, // Negative delay for staggered start
          rotate: Math.random() * 360
        });
      }
      
      setElements(newElements);
    };
    
    generateElements();
  }, [count, colors, minSize, maxSize]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} 
         style={{ perspective: '1000px' }}>
      {elements.map((element) => {
        const shape = Math.floor(Math.random() * 3); // 0 = circle, 1 = square, 2 = triangle
        
        return (
          <motion.div
            key={element.id}
            className="absolute opacity-5 dark:opacity-10"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: element.size,
              height: element.size,
              backgroundColor: shape === 0 ? element.color : 'transparent',
              borderRadius: shape === 0 ? '50%' : 0,
              border: shape === 1 ? `2px solid ${element.color}` : 'none',
              borderLeft: shape === 2 ? `${element.size/2}px solid transparent` : '',
              borderRight: shape === 2 ? `${element.size/2}px solid transparent` : '',
              borderBottom: shape === 2 ? `${element.size}px solid ${element.color}` : '',
              transform: `translateZ(${Math.random() * 100}px) rotate(${element.rotate}deg)`
            }}
            animate={{
              y: [0, 10, 0], // Gentle up/down floating
            }}
            transition={{
              duration: 16 + Math.random() * 8, // 16-24s for a full float cycle
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </div>
  );
};

export default FloatingElements; 