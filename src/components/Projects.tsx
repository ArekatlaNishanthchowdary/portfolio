import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import GalleryModal from './GalleryModal';
import './HexGrid.css';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "IoT-Enabled Emergency Vehicle Detection",
    description: `An intelligent traffic management system that prioritizes emergency vehicles using YOLOv8x and IoT cameras.\n\nKey Features:\n- Real-time emergency vehicle detection using YOLOv8x with 0.92 mAP accuracy\n- Vehicle tracking module with 0.89 MOTA performance\n- Adaptive signal control using virtual red and blue detection lines\n- Demonstrated 35% reduction in emergency vehicle response time (45s to 29s)\n- Scalable architecture ideal for smart city applications`,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    category: "IoT",
    technologies: ["Python", "OpenCV", "YOLOv8x", "IoT"],
    githubUrl: "https://github.com/ArekatlaNishanthchowdary/Smart-Traffic-Management",
    liveUrl: undefined,
  },
  {
    id: 2,
    title: "Explainable Hybrid Model for Accident Severity",
    description: `An ensemble model using LightGBM, SVM, and Random Forest with VAE-based feature augmentation for predicting accident severity.\n\nKey Features:\n- 93.36% accuracy in classifying accidents into Minor, Severe, and Fatal categories\n- Addresses imbalanced datasets using hybrid feature augmentation\n- XAI implementation using LIME highlights key factors like Cause_of_accident (0.24) and Weather_conditions (0.21)\n- Validated on 31,245 records from a 284,807-record real-world dataset\n- Ablation study confirmed 3.7% performance gain with hybrid features`,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    category: "Data Science",
    technologies: ["Python", "LightGBM", "SVM", "XAI", "Random Forest", "VAE"],
    githubUrl: "https://github.com/ArekatlaNishanthchowdary/Explainable-Hybrid-Model-for-Accident-Severity",
    liveUrl: undefined,
  },
  {
    id: 3,
    title: "AI-Powered Sentiment Analysis",
    description: `A project analyzing social media sentiment using natural language processing techniques.\n\nKey Features:\n- Pre-trained BERT model fine-tuned for sentiment analysis\n- Real-time processing of social media streams\n- Visualization of sentiment trends over time\n- Multi-language support`,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    category: "NLP",
    technologies: ["Python", "NLTK", "BERT", "PyTorch"],
    githubUrl: undefined,
    liveUrl: undefined,
  },
];

const categories = [
  "All",
  "Web Development",
  "Machine Learning",
  "Data Science",
  "Mobile Development"
];

const Projects: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex justify-center mb-8 overflow-x-auto pb-4">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-secondary text-white'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <motion.div 
        className="hex-grid"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        ref={ref}
      >
        {filteredProjects.map((project, index) => (
          <motion.div 
            className="hex-item project-hex"
            key={project.id}
            variants={{
              hidden: { y: 50, opacity: 0 },
              visible: { 
                y: 0, 
                opacity: 1,
                transition: { duration: 0.5 }
              }
            }}
            onClick={() => handleProjectClick(project)}
          >
            <div className="hex-content">
              <div className="hex-img-wrapper">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="hex-img"
                />
              </div>
              <div className="hex-body">
                <h3 className="hex-title">{project.title}</h3>
                <div className="hex-techs">
                  {project.technologies.slice(0, 3).map((tech, idx) => (
                    <span key={idx} className="hex-tech">{tech}</span>
                  ))}
                  {project.technologies.length > 3 && 
                    <span className="hex-tech">+{project.technologies.length - 3}</span>
                  }
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <GalleryModal 
        item={selectedProject ? {
          image: selectedProject.image,
          text: selectedProject.title,
          description: selectedProject.description,
          technologies: selectedProject.technologies,
          githubUrl: selectedProject.githubUrl,
          liveUrl: selectedProject.liveUrl
        } : null}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="project"
      />
    </div>
  );
};

export default Projects;