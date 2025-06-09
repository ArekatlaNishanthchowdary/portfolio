import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Check if we're building for GitHub Pages or custom domain
const isCustomDomain = process.env.BUILD_MODE === 'CUSTOM_DOMAIN';

// https://vitejs.dev/config/
export default defineConfig({
  base: isCustomDomain ? '/' : '/portfolio/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'framer': ['framer-motion'],
          'three': ['three', '@react-three/fiber', '@react-three/drei']
        }
      }
    },
    copyPublicDir: true
  },
  publicDir: 'public'
});
