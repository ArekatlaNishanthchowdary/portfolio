/**
 * Utility function to generate correct asset URLs that work both in development and production
 * Handles the '/portfolio/' base path in GitHub Pages
 */
export function getAssetPath(path: string): string {
  // If the path already starts with the base or is an absolute URL, return as is
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Use import.meta.env.BASE_URL which Vite provides based on the base config
  return `${import.meta.env.BASE_URL}${cleanPath}`;
} 