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
    <title>Single Page Apps for GitHub Pages</title>
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages
      // MIT License
      // https://github.com/rafgraph/spa-github-pages
      // This script takes the current URL and converts the path and query
      // string into just a query string, and then redirects the browser
      // to the new URL with only a query string and hash fragment.
      var pathSegmentsToKeep = 0;

      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        '/' +
        l.pathname.split('/').slice(0, pathSegmentsToKeep + 1).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>
`;

fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml);

// Add SPA redirect script to index.html
const indexPath = path.join(distDir, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Add SPA redirect script
const redirectScript = `
  <script type="text/javascript">
    // Single Page Apps for GitHub Pages
    // MIT License
    // https://github.com/rafgraph/spa-github-pages
    (function(l) {
      if (l.search[1] === '/' ) {
        var decoded = l.search.slice(1).split('&').map(function(s) { 
          return s.replace(/~and~/g, '&')
        }).join('?');
        window.history.replaceState(null, null,
            l.pathname.slice(0, -1) + decoded + l.hash
        );
      }
    }(window.location))
  </script>
`;

// Insert script before closing head tag
indexHtml = indexHtml.replace('</head>', `${redirectScript}</head>`);
fs.writeFileSync(indexPath, indexHtml);

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