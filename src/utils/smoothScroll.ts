import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

/**
 * Smooth Scroll Provider Component
 * Wraps the app with Lenis smooth scrolling
 * @param enabled - Whether to enable smooth scroll (default: true). Set to false on admin routes.
 */
export const useSmoothScroll = (enabled: boolean = true) => {
  useEffect(() => {
    // Don't initialize Lenis if disabled (e.g., on admin routes)
    if (!enabled) return;

    // Initialize Lenis with simplified config
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // smooth, smoothTouch, etc are deprecated/removed in v1 types or defaults
    });

    // Animation loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, [enabled]);
};

/**
 * Scroll to top functionality
 */
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Scroll to element
 * @param elementId - ID of the element to scroll to
 * @param offset - Offset from top (default: 0)
 */
export const scrollToElement = (elementId: string, offset: number = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({ top: elementPosition, behavior: 'smooth' });
  }
};
