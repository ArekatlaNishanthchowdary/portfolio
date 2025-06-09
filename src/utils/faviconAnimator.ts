/**
 * Favicon Animator
 * Animates favicons by swapping between multiple states
 */

// Store favicon frames as SVG strings
const faviconFrames = [
  // Frame 1: Default
  `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      @media (prefers-color-scheme: dark) {
        .primary { fill: #39A2DB; }
        .secondary { fill: #0A2463; }
        .accent { fill: #FF8600; }
        .background { fill: #050a17; }
      }
      @media (prefers-color-scheme: light) {
        .primary { fill: #0A2463; }
        .secondary { fill: #39A2DB; }
        .accent { fill: #FF8600; }
        .background { fill: #F8FAFC; }
      }
    </style>
    <rect width="32" height="32" rx="8" class="background"/>
    <path d="M8 12L14 6L20 12L26 6V17L20 23L14 17L8 23V12Z" class="primary"/>
    <circle cx="16" cy="16" r="6" class="secondary"/>
    <circle cx="16" cy="16" r="3" class="accent"/>
  </svg>`,
  
  // Frame 2: Rotated elements
  `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      @media (prefers-color-scheme: dark) {
        .primary { fill: #39A2DB; }
        .secondary { fill: #0A2463; }
        .accent { fill: #FF8600; }
        .background { fill: #050a17; }
      }
      @media (prefers-color-scheme: light) {
        .primary { fill: #0A2463; }
        .secondary { fill: #39A2DB; }
        .accent { fill: #FF8600; }
        .background { fill: #F8FAFC; }
      }
    </style>
    <rect width="32" height="32" rx="8" class="background"/>
    <path transform="rotate(45 16 16)" d="M8 12L14 6L20 12L26 6V17L20 23L14 17L8 23V12Z" class="primary"/>
    <circle cx="16" cy="16" r="6" class="secondary"/>
    <circle cx="16" cy="16" r="4" class="accent"/>
  </svg>`,
  
  // Frame 3: Different positions
  `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      @media (prefers-color-scheme: dark) {
        .primary { fill: #39A2DB; }
        .secondary { fill: #0A2463; }
        .accent { fill: #FF8600; }
        .background { fill: #050a17; }
      }
      @media (prefers-color-scheme: light) {
        .primary { fill: #0A2463; }
        .secondary { fill: #39A2DB; }
        .accent { fill: #FF8600; }
        .background { fill: #F8FAFC; }
      }
    </style>
    <rect width="32" height="32" rx="8" class="background"/>
    <path transform="rotate(90 16 16)" d="M8 12L14 6L20 12L26 6V17L20 23L14 17L8 23V12Z" class="primary"/>
    <circle cx="16" cy="16" r="7" class="secondary"/>
    <circle cx="16" cy="16" r="2" class="accent"/>
  </svg>`,
  
  // Frame 4: Return to semi-original
  `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      @media (prefers-color-scheme: dark) {
        .primary { fill: #39A2DB; }
        .secondary { fill: #0A2463; }
        .accent { fill: #FF8600; }
        .background { fill: #050a17; }
      }
      @media (prefers-color-scheme: light) {
        .primary { fill: #0A2463; }
        .secondary { fill: #39A2DB; }
        .accent { fill: #FF8600; }
        .background { fill: #F8FAFC; }
      }
    </style>
    <rect width="32" height="32" rx="8" class="background"/>
    <path transform="rotate(135 16 16)" d="M8 12L14 6L20 12L26 6V17L20 23L14 17L8 23V12Z" class="primary"/>
    <circle cx="16" cy="16" r="5" class="secondary"/>
    <circle cx="16" cy="16" r="3.5" class="accent"/>
  </svg>`,
];

class FaviconAnimator {
  private frameIndex: number = 0;
  private animationInterval: number | null = null;
  private frameCount: number;
  private frameDelay: number;

  constructor(frameDelay: number = 200) {
    this.frameCount = faviconFrames.length;
    this.frameDelay = frameDelay;
  }

  /**
   * Converts SVG string to data URL
   */
  private svgToDataURL(svg: string): string {
    const encodedSvg = encodeURIComponent(svg);
    return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
  }

  /**
   * Updates favicon link element with new SVG
   */
  private updateFavicon(dataUrl: string): void {
    let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    
    link.setAttribute('href', dataUrl);
  }

  /**
   * Starts the favicon animation
   */
  start(): void {
    if (this.animationInterval) {
      return;
    }

    this.animationInterval = window.setInterval(() => {
      const dataUrl = this.svgToDataURL(faviconFrames[this.frameIndex]);
      this.updateFavicon(dataUrl);
      
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
    }, this.frameDelay);
  }

  /**
   * Stops the favicon animation
   */
  stop(): void {
    if (this.animationInterval) {
      window.clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  /**
   * Sets static favicon to first frame
   */
  resetToStatic(): void {
    this.stop();
    const dataUrl = this.svgToDataURL(faviconFrames[0]);
    this.updateFavicon(dataUrl);
  }
}

export default FaviconAnimator; 