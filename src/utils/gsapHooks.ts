import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for smooth scroll animations with GSAP ScrollTrigger
 * @param ref - React ref to the element to animate
 * @param options - Animation options
 */
export const useScrollAnimation = (
  ref: React.RefObject<HTMLElement>,
  options: {
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) => {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const animation = gsap.fromTo(
      element,
      options.from || { opacity: 0, y: 50 },
      {
        ...options.to,
        opacity: options.to?.opacity ?? 1,
        y: options.to?.y ?? 0,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          ...options.scrollTrigger,
        },
      }
    );

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [ref, options]);
};

/**
 * Custom hook for stagger animations on multiple elements
 * @param selector - CSS selector or elements array
 * @param options - Animation options  
 */
export const useStaggerAnimation = (
  selector: string,
  options: {
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
    stagger?: number | gsap.StaggerVars;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const animation = gsap.fromTo(
      elements,
      options.from || { opacity: 0, y: 30 },
      {
        ...options.to,
        opacity: options.to?.opacity ?? 1,
        y: options.to?.y ?? 0,
        stagger: options.stagger || 0.1,
        scrollTrigger: {
          trigger: elements[0],
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          ...options.scrollTrigger,
        },
      }
    );

    return () => {
      animation.kill();
    };
  }, [selector, options]);
};

/**
 * Custom hook for parallax effects
 * @param ref - React ref to the element
 * @param speed - Parallax speed (default: 0.5)
 */
export const useParallax = (
  ref: React.RefObject<HTMLElement>,
  speed: number = 0.5
) => {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.to(element, {
      yPercent: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [ref, speed]);
};

/**
 * Custom hook for hover animations
 * @param ref - React ref to the element
 * @param hoverAnimation - GSAP animation vars for hover state
 * @param normalAnimation - GSAP animation vars for normal state
 */
export const useHoverAnimation = (
  ref: React.RefObject<HTMLElement>,
  hoverAnimation: gsap.TweenVars = { scale: 1.05, duration: 0.3 },
  normalAnimation: gsap.TweenVars = { scale: 1, duration: 0.3 }
) => {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const onMouseEnter = () => {
      gsap.to(element, hoverAnimation);
    };

    const onMouseLeave = () => {
      gsap.to(element, normalAnimation);
    };

    element.addEventListener('mouseenter', onMouseEnter);
    element.addEventListener('mouseleave', onMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', onMouseEnter);
      element.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [ref, hoverAnimation, normalAnimation]);
};
