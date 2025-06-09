import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown, Github, Linkedin, Twitter, X } from 'lucide-react';
import RotatingText from './RotatingText';
import FloatingElements from './FloatingElements';
import Magnet from './Magnet';
import ProfileCard from './ProfileCard';
import { getAssetPath } from '../utils/pathUtils';

// Array of phrases to cycle through
const phrases = [
  "crafting intelligent solutions",
  "building neural networks",
  "developing machine learning models",
  "designing AI algorithms",
  "transforming data into insights",
  "pioneering computer vision systems",
  "creating natural language processors"
];

const AnimatedHeading = ({ children }: { children: React.ReactNode }) => {
  const letters = Array.from(children as string);
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.05 * i }
    })
  };
  
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <motion.h1
      className="font-bold mb-4 text-gradient"
      variants={container}
      initial="hidden"
      animate="visible"
      aria-label={children as string}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block"
          style={{ 
            display: letter === " " ? "inline-block" : "inline-block",
            width: letter === " " ? "0.5em" : "auto" 
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
};

// Resume modal component
const ResumeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Set a brief loading state for better UX
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  // Close on escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    
    // Lock body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl h-[80vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-gray-800 dark:text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center w-full h-full">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-4 text-gray-600 dark:text-gray-300">Loading resume...</p>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gradient">My Resume</h3>
                  <a 
                    href={getAssetPath("resume.pdf")}
                    download="Arekatala_Nishanth_Resume.pdf"
                    className="btn btn-primary text-sm px-4 py-2"
                  >
                    Download PDF
                  </a>
                </div>
                <div className="flex-1 overflow-hidden">
                  <object
                    data={getAssetPath("resume.pdf")}
                    type="application/pdf"
                    className="w-full h-full"
                  >
                    <div className="flex flex-col items-center justify-center h-full p-6">
                      <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
                        Your browser doesn't support embedded PDFs.
                        Please download the resume using the button above.
                      </p>
                    </div>
                  </object>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Hero: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isResumeModalOpen, setResumeModalOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      setMousePosition({
        x: (clientX / innerWidth) - 0.5,
        y: (clientY / innerHeight) - 0.5,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <section 
        id="home" 
        ref={ref}
        className="min-h-screen flex items-center pt-16 relative overflow-hidden"
      >
        <motion.div 
          className="container-custom relative z-10"
          style={{ y, opacity }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-secondary font-medium mb-4 block"
              >
                Hello, I'm
              </motion.span>
              
              <AnimatedHeading>Arekatala Nishanth Chowdary</AnimatedHeading>
              
              <h2 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-6">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="text-primary"
                >
                  AI Engineer
                </motion.span>{' '}
                <RotatingText
                  texts={phrases}
                  mainClassName="px-2 sm:px-2 md:px-3 bg-accent/20 text-accent dark:text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg inline-block min-w-[250px] md:min-w-[400px] shadow-md"
                  staggerFrom="last"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.01}
                  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                  transition={{ type: "spring", damping: 20, stiffness: 150 }}
                  rotationInterval={4000}
                />
              </h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg backdrop-blur-sm glass-card p-5 rounded-lg border border-white/10 dark:border-dark/10"
              >
                I specialize in building advanced AI systems that solve real-world problems.
                With expertise in machine learning, computer vision, and natural language processing,
                I create innovative solutions that drive business value.
              </motion.p>
              
              <div className="flex flex-wrap gap-4">
                <Magnet padding={50} magnetStrength={25}>
                  <motion.a 
                    href="#projects"
                    className="btn btn-outline text-white border-white hover:bg-white hover:text-primary"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View My Work
                  </motion.a>
                </Magnet>
                
                <Magnet padding={50} magnetStrength={25}>
                  <motion.button 
                    onClick={() => setResumeModalOpen(true)}
                    className="btn btn-outline border-accent text-accent hover:bg-accent hover:text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6, duration: 0.5 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 0 15px rgba(255, 134, 0, 0.5)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Resume <span className="ml-1">↗</span>
                  </motion.button>
                </Magnet>
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="mt-8 flex items-center space-x-4"
              >
                <motion.a 
                  href="https://github.com/ArekatlaNishanthchowdary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-secondary transition-colors"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="GitHub"
                >
                  <Github size={24} />
                </motion.a>
                <motion.a 
                  href="https://www.linkedin.com/in/arekatla-nishanth-chowdary/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-secondary transition-colors"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </motion.a>
                <motion.a 
                  href="https://x.com/NishantP4K"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-secondary transition-colors"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Twitter"
                >
                  <Twitter size={24} />
                </motion.a>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2 flex justify-center"
            >
              <ProfileCard
                avatarUrl={getAssetPath("certificates/images/me.png")}
                name="Arekatla Nishanth Chowdary"
                title="AI Engineer"
                handle="nishanthchowdary"
                status="Available for work"
                contactText="Contact Me"
                showUserInfo={true}
                enableTilt={true}
                onContactClick={() => {
                  const contactSection = document.getElementById('contact');
                  contactSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </motion.div>
          </div>
          
          <motion.a 
            href="#about"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 1.8,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 0.5
            }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-secondary transition-colors"
            aria-label="Scroll down"
          >
            <ChevronDown size={32} />
          </motion.a>
        </motion.div>
      </section>
      
      {/* Resume Modal */}
      <ResumeModal 
        isOpen={isResumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
      />
    </>
  );
};

export default Hero;