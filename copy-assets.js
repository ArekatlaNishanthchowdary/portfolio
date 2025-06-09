import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories
const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');

// Create certificates directories
const certificatesDir = path.join(distDir, 'certificates');
const certificatesImagesDir = path.join(distDir, 'certificates', 'images');

// Create directories if they don't exist
if (!fs.existsSync(certificatesDir)) {
  fs.mkdirSync(certificatesDir, { recursive: true });
}

if (!fs.existsSync(certificatesImagesDir)) {
  fs.mkdirSync(certificatesImagesDir, { recursive: true });
}

// Copy certificate files
const sourceCertDir = path.join(publicDir, 'certificates');
if (fs.existsSync(sourceCertDir)) {
  const files = fs.readdirSync(sourceCertDir);
  files.forEach(file => {
    if (file !== 'images') {
      const sourcePath = path.join(sourceCertDir, file);
      const destPath = path.join(certificatesDir, file);
      
      // Only copy files, not directories
      if (fs.statSync(sourcePath).isFile()) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied: ${file} to ${destPath}`);
      }
    }
  });
}

// Copy certificate images
const sourceCertImagesDir = path.join(publicDir, 'certificates', 'images');
if (fs.existsSync(sourceCertImagesDir)) {
  const imageFiles = fs.readdirSync(sourceCertImagesDir);
  imageFiles.forEach(file => {
    const sourcePath = path.join(sourceCertImagesDir, file);
    const destPath = path.join(certificatesImagesDir, file);
    
    // Only copy files, not directories
    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied: ${file} to ${destPath}`);
    }
  });
}

console.log('All certificate files copied successfully!'); 