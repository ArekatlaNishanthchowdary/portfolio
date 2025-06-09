import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ghpages from 'gh-pages';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build directory
const buildDir = 'dist';
const distDir = path.join(__dirname, buildDir);

// Make sure 404.html is in place
if (!fs.existsSync(path.join(distDir, '404.html'))) {
  fs.copyFileSync(
    path.resolve(__dirname, 'public', '404.html'),
    path.resolve(__dirname, buildDir, '404.html')
  );
}

// Create a .nojekyll file to bypass Jekyll processing
fs.writeFileSync(path.resolve(__dirname, buildDir, '.nojekyll'), '');

// Deploy to GitHub Pages
ghpages.publish(
  buildDir,
  {
    branch: 'gh-pages',
    dotfiles: true, // Include dotfiles like .nojekyll
    message: 'Auto-deploy from npm script'
  },
  (err) => {
    if (err) {
      console.error('Deployment error:', err);
      return;
    }
    console.log('Successfully deployed!');
  }
); 