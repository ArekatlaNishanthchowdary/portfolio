/**
 * Utility function to generate correct asset URLs that work both in development and production
 * Handles GitHub Pages paths correctly
 */
export function getAssetPath(path: string): string {
  // If the path already starts with the base or is an absolute URL, return as is
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Always use the configured base path from Vite
  // This ensures paths work both in dev and production regardless of where the site is hosted
  return `${import.meta.env.BASE_URL}${cleanPath}`;
} 