import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import FaviconAnimator from './utils/faviconAnimator';

// Initialize the favicon animator
const faviconAnimator = new FaviconAnimator(300); // 300ms between frames

// Start animation when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  faviconAnimator.start();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
