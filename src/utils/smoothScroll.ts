import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

/**
 * Smooth Scroll Provider Component
 * Wraps the app with Lenis smooth scrolling
 */
export const useSmoothScroll = () => {
  useEffect(() =>{ 
    // Initialize Lenis with simplified config
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
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
  }, []);
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
