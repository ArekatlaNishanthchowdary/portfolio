import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Brain, BookOpen, Award } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
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
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg inline-block mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
};

const About: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="about" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">
            I'm passionate about leveraging AI to solve complex problems and create meaningful impact.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold">My Journey</h3>
            <p className="text-gray-600 dark:text-gray-300">
              With a background in computer science and a specialization in artificial intelligence,
              I've dedicated my career to developing cutting-edge AI solutions. My journey began with
              a fascination for how machines can learn and evolved into a professional path focused on
              creating systems that can perceive, understand, and act upon the world around them.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Throughout my career, I've worked on diverse projects ranging from computer vision applications
              to natural language processing systems. I believe in a holistic approach to AI development that
              considers ethical implications and human-centered design principles.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              My goal is to continue pushing the boundaries of what's possible with AI while ensuring
              that the technology we build serves humanity in positive, equitable ways.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-lg blur-sm transform rotate-3"></div>
            <img 
              src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="AI Development" 
              className="relative rounded-lg shadow-md"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Brain size={24} className="text-white dark:text-white" />}
            title="AI Expertise"
            description="Specialized in machine learning, deep learning, and reinforcement learning for diverse applications."
            delay={0.2}
          />
          <FeatureCard 
            icon={<BookOpen size={24} className="text-white dark:text-white" />}
            title="Continuous Learning"
            description="Committed to staying at the forefront of AI advancements through research and practical implementation."
            delay={0.4}
          />
          <FeatureCard 
            icon={<Award size={24} className="text-white dark:text-white" />}
            title="Results-Driven"
            description="Focused on delivering AI solutions that provide measurable business value and meaningful impact."
            delay={0.6}
          />
        </div>
      </div>
    </section>
  );
};

export default About;