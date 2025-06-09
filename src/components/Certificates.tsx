import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import GalleryModal from './GalleryModal';
import './HexGrid.css';
import { getAssetPath } from '../utils/pathUtils';

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description: string;
  image: string;
  category: string;
  pdf?: string;
}

const certificates: Certificate[] = [
  {
    id: 1,
    title: "Introduction to Deep Learning",
    issuer: "Infosys",
    date: "2023",
    description: "Certificate for Introduction to Deep Learning by Infosys.",
    image: getAssetPath("certificates/images/Introduction to Deep Learning infosys.png"),
    category: "Deep Learning",
    pdf: getAssetPath("certificates/Introduction to Deep Learning infosys.pdf"),
  },
  {
    id: 2,
    title: "Problem Solving Intermediate",
    issuer: "HackerRank",
    date: "2023",
    description: "Certificate for Problem Solving Intermediate.",
    image: getAssetPath("certificates/images/problem_solving_intermediate certificate.png"),
    category: "Problem Solving",
    pdf: getAssetPath("certificates/problem_solving_intermediate certificate.pdf"),
  },
  {
    id: 3,
    title: "Oracle OCI",
    issuer: "Oracle",
    date: "2023",
    description: "Oracle OCI Certificate.",
    image: getAssetPath("certificates/images/Oracle OCI.png"),
    category: "Cloud",
    pdf: getAssetPath("certificates/Oracle OCI.pdf"),
  },
  {
    id: 4,
    title: "Oracle OCI AI",
    issuer: "Oracle",
    date: "2023",
    description: "Oracle OCI AI Certificate.",
    image: getAssetPath("certificates/images/Oracle OCI.png"),
    category: "Cloud",
    pdf: getAssetPath("certificates/Oracle OCI AI.pdf"),
  },
  {
    id: 5,
    title: "Joy of Computing Using Python",
    issuer: "NPTEL",
    date: "2023",
    description: "Joy of Computing Using Python by NPTEL.",
    image: getAssetPath("certificates/images/Joy of computing using python nptel.png"),
    category: "Python",
    pdf: getAssetPath("certificates/Joy of computing using python nptel.pdf"),
  },
  {
    id: 6,
    title: "Introduction to Python",
    issuer: "Infosys",
    date: "2023",
    description: "Introduction to Python by Infosys.",
    image: getAssetPath("certificates/images/Introduction to python infosys.png"),
    category: "Python",
    pdf: getAssetPath("certificates/Introduction to python infosys.pdf"),
  },
  {
    id: 7,
    title: "Introduction to Artificial Intelligence",
    issuer: "Infosys",
    date: "2023",
    description: "Introduction to Artificial Intelligence by Infosys.",
    image: getAssetPath("certificates/images/Introduction to artificial Intelligence infosys.png"),
    category: "Artificial Intelligence",
    pdf: getAssetPath("certificates/Introduction to artificial Intelligence infosys.pdf"),
  },
  {
    id: 8,
    title: "Deep Learning",
    issuer: "Unknown",
    date: "2023",
    description: "Deep Learning Certificate.",
    image: getAssetPath("certificates/images/Deep_Learning_Arekatla_Certificate.png"),
    category: "Deep Learning",
    pdf: getAssetPath("certificates/Deep_Learning_Arekatla_Certificate.pdf"),
  },
  {
    id: 9,
    title: "Artificial Intelligence",
    issuer: "Unknown",
    date: "2023",
    description: "Artificial Intelligence Certificate.",
    image: getAssetPath("certificates/images/Arekatla-Nishanth-Chowdary-Artificial-lntelligence-Certificate.png"),
    category: "Artificial Intelligence",
    pdf: getAssetPath("certificates/Arekatla-Nishanth-Chowdary-Artificial-Intelligence-Certificate.pdf"),
  },
];

const categories = [
  "All",
  "Deep Learning",
  "Problem Solving",
  "Cloud",
  "Python",
  "Artificial Intelligence"
];

const Certificates: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredCertificates = selectedCategory === "All" 
    ? certificates 
    : certificates.filter(certificate => certificate.category === selectedCategory);

  const handleCertificateClick = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
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
        {filteredCertificates.map((certificate, index) => (
          <motion.div 
            className="hex-item"
            key={certificate.id}
            variants={{
              hidden: { y: 50, opacity: 0 },
              visible: { 
                y: 0, 
                opacity: 1,
                transition: { duration: 0.5 }
              }
            }}
            onClick={() => handleCertificateClick(certificate)}
          >
            <div className="hex-content">
              <div className="hex-img-wrapper">
                <img 
                  src={certificate.image} 
                  alt={certificate.title} 
                  className="hex-img"
                />
              </div>
              <div className="hex-body">
                <h3 className="hex-title">{certificate.title}</h3>
                <p className="hex-issuer">{certificate.issuer}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <GalleryModal 
        item={selectedCertificate ? {
          image: selectedCertificate.image,
          text: selectedCertificate.title,
          description: selectedCertificate.description,
          issuer: selectedCertificate.issuer,
          date: selectedCertificate.date,
          pdf: selectedCertificate.pdf
        } : null}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="certificate"
      />
    </div>
  );
};

export default Certificates; 