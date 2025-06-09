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

// Create CNAME file for custom domain
fs.writeFileSync(
  path.join(distDir, 'CNAME'),
  'www.portfolionishanth.digital'
);

// Create a .nojekyll file to bypass Jekyll processing
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

// Create 404.html file that redirects to index.html
const notFoundHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Nishanth Arekatla - Portfolio</title>
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages with custom domain
      // MIT License
      // https://github.com/rafgraph/spa-github-pages
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        '/' + 
        l.pathname.slice(1).split('/').join('/') +
        (l.search ? l.search : '') +
        l.hash
      );
    </script>
  </head>
  <body>
    <h1>Redirecting...</h1>
  </body>
</html>
`;

fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml);

// Deploy to GitHub Pages
ghpages.publish(
  buildDir,
  {
    branch: 'gh-pages',
    dotfiles: true, // Include dotfiles like .nojekyll and CNAME
    message: 'Deploy to custom domain'
  },
  (err) => {
    if (err) {
      console.error('Deployment error:', err);
      return;
    }
    console.log('Successfully deployed to custom domain!');
  }
); 