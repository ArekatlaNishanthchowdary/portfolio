/**
 * Utility function to generate correct asset URLs that work both in development and production
 * Handles both GitHub Pages and custom domain paths
 */
export function getAssetPath(path: string): string {
  // If the path already starts with the base or is an absolute URL, return as is
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Check if we're on the custom domain by checking if the hostname includes the custom domain
  const isCustomDomain = 
    typeof window !== 'undefined' && 
    (window.location.hostname.includes('portfolionishanth.digital') || window.location.hostname === 'localhost');
  
  // Use different base paths based on the domain
  // For custom domain, use root path ('/')
  // For GitHub Pages, use the configured base path
  const basePath = isCustomDomain ? '' : import.meta.env.BASE_URL;
  
  return `${basePath}${cleanPath}`;
} 