import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Skill {
  name: string;
  icon: string;
}

interface Skills3DProps {
  skills: Skill[];
  className?: string;
}

const SkillIcon: React.FC<{ skill: Skill }> = ({ skill }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        animate={{
          rotateY: isHovered ? 180 : 0,
          z: isHovered ? 30 : 0,
          scale: isHovered ? 1.05 : 1
        }}
        transition={{
          rotateY: { duration: 0.8, type: "spring", stiffness: 100 },
          z: { duration: 0.4 },
          scale: { duration: 0.4 }
        }}
        style={{ 
          transformStyle: 'preserve-3d',
          boxShadow: isHovered ? '0 10px 25px rgba(0, 0, 0, 0.2)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <img 
          src={skill.icon} 
          alt={skill.name}
          className="w-2/3 h-2/3 object-contain filter drop-shadow-md"
        />
      </motion.div>
      
      <motion.div
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-700 px-3 py-1 rounded-full shadow-md text-xs font-medium"
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 10
        }}
        transition={{ duration: 0.2 }}
      >
        {skill.name}
      </motion.div>
    </motion.div>
  );
};

const Skills3D: React.FC<Skills3DProps> = ({ skills, className = '' }) => {
  return (
    <div className={`flex flex-wrap justify-center gap-6 ${className}`}>
      {skills.map((skill) => (
        <SkillIcon key={skill.name} skill={skill} />
      ))}
    </div>
  );
};

export default Skills3D; 