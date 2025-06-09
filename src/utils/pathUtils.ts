/**
 * Utility function to generate correct asset URLs that work both in development and production
 * Handles GitHub Pages paths correctly
 */
import { isCustomDomain } from '../config';

export function getAssetPath(path: string): string {
  // For custom domain, use root path
  if (isCustomDomain) {
    return path.startsWith('/') ? path : `/${path}`;
  }
  
  // For GitHub Pages, use /portfolio/ base
  return path.startsWith('/') ? `/portfolio${path}` : `/portfolio/${path}`;
} 