/**
 * Utility function to generate correct asset URLs that work both in development and production
 * Handles GitHub Pages paths correctly
 */
import { isCustomDomain } from '../config';

export function getAssetPath(path: string): string {
  // If the path is an absolute URL or data URL, return as is
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }

  // For custom domain, use root path
  if (isCustomDomain) {
    return path.startsWith('/') ? path : `/${path}`;
  }
  
  // For GitHub Pages, use /portfolio/ base
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/portfolio/${cleanPath}`;
} 