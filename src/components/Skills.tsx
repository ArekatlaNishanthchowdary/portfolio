import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Skills3D from './Skills3D';

interface SkillProps {
  name: string;
  level: number;
  color: string;
  delay: number;
}

interface SkillCategoryProps {
  title: string;
  skills: SkillProps[];
  delay: number;
}

const Skill: React.FC<SkillProps> = ({ name, level, color, delay }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="font-medium">{name}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{level}%</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          ref={ref}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1, delay }}
          className={`h-full rounded-full ${color}`}
        ></motion.div>
      </div>
    </div>
  );
};

const SkillCategory: React.FC<SkillCategoryProps> = ({ title, skills, delay }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
    >
      <h3 className="text-xl font-semibold mb-4 text-primary">{title}</h3>
      <div>
        {skills.map((skill, index) => (
          <Skill
            key={skill.name}
            name={skill.name}
            level={skill.level}
            color={skill.color}
            delay={delay + index * 0.1}
          />
        ))}
      </div>
    </motion.div>
  );
};

const Skills: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const aiSkills = [
    { name: 'Machine Learning', level: 95, color: 'bg-primary', delay: 0 },
    { name: 'Deep Learning', level: 90, color: 'bg-primary', delay: 0 },
    { name: 'Natural Language Processing', level: 85, color: 'bg-primary', delay: 0 },
    { name: 'Computer Vision', level: 88, color: 'bg-primary', delay: 0 },
  ];

  const programmingSkills = [
    { name: 'Python', level: 95, color: 'bg-secondary', delay: 0 },
    { name: 'TensorFlow/PyTorch', level: 90, color: 'bg-secondary', delay: 0 },
    { name: 'JavaScript/TypeScript', level: 80, color: 'bg-secondary', delay: 0 },
    { name: 'C++', level: 75, color: 'bg-secondary', delay: 0 },
  ];

  const otherSkills = [
    { name: 'Data Visualization', level: 85, color: 'bg-accent', delay: 0 },
    { name: 'Cloud Services (AWS/GCP)', level: 80, color: 'bg-accent', delay: 0 },
    { name: 'Docker/Kubernetes', level: 75, color: 'bg-accent', delay: 0 },
    { name: 'CI/CD Pipelines', level: 70, color: 'bg-accent', delay: 0 },
  ];

  // 3D skill icons data
  const techSkills = [
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
    { name: 'PyTorch', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
    { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  ];

  return (
    <section id="skills" className="py-16 md:py-24">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">My Skills</h2>
          <p className="section-subtitle">
            A comprehensive overview of my technical expertise and capabilities in AI and software development.
          </p>
        </motion.div>
        
        {/* 3D Skills Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <h3 className="text-xl font-semibold text-center mb-8">Technologies & Tools</h3>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm">
            <Skills3D skills={techSkills} />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SkillCategory title="AI & Machine Learning" skills={aiSkills} delay={0.2} />
          <SkillCategory title="Programming & Frameworks" skills={programmingSkills} delay={0.4} />
          <SkillCategory title="Tools & Technologies" skills={otherSkills} delay={0.6} />
        </div>
      </div>
    </section>
  );
};

export default Skills;