import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface GalleryModalProps {
  item: {
    image: string;
    text: string;
    description: string;
    technologies?: string[];
    githubUrl?: string;
    liveUrl?: string;
    issuer?: string;
    date?: string;
    pdf?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  type: 'project' | 'certificate';
}

const GalleryModal: React.FC<GalleryModalProps> = ({ item, isOpen, onClose, type }) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
            >
              <X size={24} />
            </button>

            <div className="p-6">
              <div className="relative aspect-[16/9] mb-6 rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={item.text}
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {item.text}
              </h2>

              {type === 'certificate' && item.issuer && item.date && (
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {item.issuer} • {item.date}
                </p>
              )}

              <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-line">
                {item.description}
              </p>

              {type === 'project' && item.technologies && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {type === 'project' && (item.githubUrl || item.liveUrl) && (
                <div className="flex gap-4">
                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-secondary transition-colors"
                    >
                      View on GitHub
                    </a>
                  )}
                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-secondary transition-colors"
                    >
                      View Live Demo
                    </a>
                  )}
                </div>
              )}

              {type === 'certificate' && item.pdf && (
                <a
                  href={item.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-secondary transition-colors"
                >
                  View Certificate PDF
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GalleryModal; 