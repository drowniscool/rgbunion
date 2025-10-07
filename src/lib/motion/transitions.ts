/**
 * RGBUNION Motion System
 *
 * A cohesive animation system designed for premium feel with accessibility-first approach.
 * Features GPU-optimized transforms, Material-inspired easing, and reduced motion support.
 */

import { cubicOut, expoOut, quintOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

// Motion Constants - Premium Feel with Performance
export const MOTION_TOKENS = {
  // Durations (milliseconds)
  durations: {
    instant: 150,
    fast: 250,
    normal: 350,
    slow: 500,
    emphasis: 750,
  },

  // Easing Functions - Material-inspired for premium feel
  easings: {
    standard: cubicOut,           // General use (0.25, 0.46, 0.45, 0.94)
    decelerate: expoOut,          // Enter animations (0.16, 1, 0.3, 1)
    accelerate: quintOut,         // Exit animations (0.755, 0.05, 0.855, 0.06)
    expressive: (t: number) => t * t * (3 - 2 * t), // Micro-interactions
  },

  // Scale factors for micro-interactions
  scales: {
    subtle: 1.02,
    moderate: 1.05,
    bold: 1.1,
  },

  // Stagger delays for list reveals
  stagger: {
    fast: 50,
    normal: 75,
    slow: 100,
  },
} as const;

/**
 * Enhanced Fade Transition
 * GPU-optimized with opacity + slight transform for depth
 */
export function enhancedFade(
  node: Element,
  params: {
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down';
    distance?: number;
  } = {}
): TransitionConfig {
  const {
    delay = 0,
    duration = MOTION_TOKENS.durations.normal,
    direction = 'up',
    distance = 10,
  } = params;

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' ?
    window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  if (prefersReducedMotion) {
    return {
      delay,
      duration: MOTION_TOKENS.durations.instant,
      css: t => `opacity: ${t}`,
    };
  }

  const yOffset = direction === 'up' ? distance : -distance;

  return {
    delay,
    duration,
    easing: MOTION_TOKENS.easings.decelerate,
    css: t => `
      opacity: ${t};
      transform: translateY(${(1 - t) * yOffset}px) translateZ(0);
    `,
  };
}

/**
 * Scale + Fade Transition
 * For modal entrances and emphasized elements
 */
export function scaleIn(
  node: Element,
  params: {
    delay?: number;
    duration?: number;
    scale?: number;
    origin?: string;
  } = {}
): TransitionConfig {
  const {
    delay = 0,
    duration = MOTION_TOKENS.durations.normal,
    scale = 0.95,
    origin = 'center',
  } = params;

  const prefersReducedMotion = typeof window !== 'undefined' ?
    window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  if (prefersReducedMotion) {
    return {
      delay,
      duration: MOTION_TOKENS.durations.instant,
      css: t => `opacity: ${t}`,
    };
  }

  return {
    delay,
    duration,
    easing: MOTION_TOKENS.easings.decelerate,
    css: t => `
      opacity: ${t};
      transform: scale(${scale + (1 - scale) * t}) translateZ(0);
      transform-origin: ${origin};
    `,
  };
}

/**
 * Slide with Stagger Support
 * For list items and sequential reveals
 */
export function staggeredSlide(
  node: Element,
  params: {
    index?: number;
    direction?: 'left' | 'right' | 'up' | 'down';
    distance?: number;
    staggerDelay?: number;
  } = {}
): TransitionConfig {
  const {
    index = 0,
    direction = 'left',
    distance = 30,
    staggerDelay = MOTION_TOKENS.stagger.normal,
  } = params;

  const delay = index * staggerDelay;
  const prefersReducedMotion = typeof window !== 'undefined' ?
    window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  if (prefersReducedMotion) {
    return {
      delay,
      duration: MOTION_TOKENS.durations.instant,
      css: t => `opacity: ${t}`,
    };
  }

  return {
    delay,
    duration: MOTION_TOKENS.durations.normal,
    easing: MOTION_TOKENS.easings.standard,
    css: t => {
      let transform = '';
      switch (direction) {
        case 'left':
          transform = `translateX(${(1 - t) * -distance}px)`;
          break;
        case 'right':
          transform = `translateX(${(1 - t) * distance}px)`;
          break;
        case 'up':
          transform = `translateY(${(1 - t) * -distance}px)`;
          break;
        case 'down':
          transform = `translateY(${(1 - t) * distance}px)`;
          break;
      }
      return `
        opacity: ${t};
        transform: ${transform} translateZ(0);
      `;
    },
  };
}

/**
 * Blur Reveal Transition
 * For premium content reveals
 */
export function blurReveal(
  node: Element,
  params: {
    delay?: number;
    duration?: number;
    blurAmount?: number;
  } = {}
): TransitionConfig {
  const {
    delay = 0,
    duration = MOTION_TOKENS.durations.slow,
    blurAmount = 8,
  } = params;

  const prefersReducedMotion = typeof window !== 'undefined' ?
    window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  if (prefersReducedMotion) {
    return {
      delay,
      duration: MOTION_TOKENS.durations.instant,
      css: t => `opacity: ${t}`,
    };
  }

  return {
    delay,
    duration,
    easing: MOTION_TOKENS.easings.decelerate,
    css: t => `
      opacity: ${t};
      filter: blur(${(1 - t) * blurAmount}px);
      transform: translateZ(0);
    `,
  };
}

/**
 * Card Hover Animation
 * CSS-based micro-interaction for cards
 */
export const cardHover = {
  base: `
    transition: all 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform: translateZ(0);
    will-change: transform, box-shadow;
  `,
  hover: `
    transform: translateY(-4px) scale(1.02) translateZ(0);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(191, 149, 63, 0.1);
  `,
  reducedMotion: `
    transition: none;
    transform: none;
  `,
};

/**
 * Button Press Animation
 * For tactile feedback on interactions
 */
export const buttonPress = {
  base: `
    transition: all 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform: translateZ(0);
    will-change: transform;
  `,
  active: `
    transform: scale(0.98) translateZ(0);
  `,
  reducedMotion: `
    transition: none;
    transform: none;
  `,
};

/**
 * Navigation Reveal
 * For navbar and navigation elements
 */
export function navReveal(
  node: Element,
  params: {
    delay?: number;
    duration?: number;
  } = {}
): TransitionConfig {
  const {
    delay = 0,
    duration = MOTION_TOKENS.durations.emphasis,
  } = params;

  const prefersReducedMotion = typeof window !== 'undefined' ?
    window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  if (prefersReducedMotion) {
    return {
      delay,
      duration: MOTION_TOKENS.durations.instant,
      css: t => `opacity: ${t}`,
    };
  }

  return {
    delay,
    duration,
    easing: MOTION_TOKENS.easings.decelerate,
    css: t => `
      opacity: ${t};
      transform: translateY(${(1 - t) * -20}px) translateZ(0);
      backdrop-filter: blur(${t * 20}px);
    `,
  };
}

/**
 * Toast Notification Animation
 * Optimized for toast/notification reveals
 */
export function toastSlide(
  node: Element,
  params: {
    direction?: 'right' | 'left' | 'bottom';
  } = {}
): TransitionConfig {
  const { direction = 'right' } = params;
  const prefersReducedMotion = typeof window !== 'undefined' ?
    window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  if (prefersReducedMotion) {
    return {
      duration: MOTION_TOKENS.durations.instant,
      css: t => `opacity: ${t}`,
    };
  }

  return {
    duration: MOTION_TOKENS.durations.normal,
    easing: MOTION_TOKENS.easings.expressive,
    css: t => {
      let transform = '';
      switch (direction) {
        case 'right':
          transform = `translateX(${(1 - t) * 100}%)`;
          break;
        case 'left':
          transform = `translateX(${(1 - t) * -100}%)`;
          break;
        case 'bottom':
          transform = `translateY(${(1 - t) * 100}%)`;
          break;
      }
      return `
        opacity: ${t};
        transform: ${transform} translateZ(0);
      `;
    },
  };
}

/**
 * Utility: Check Reduced Motion Preference
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Utility: Create CSS Class for Reduced Motion
 */
export function getMotionClass(baseClass: string, reducedClass: string = ''): string {
  if (prefersReducedMotion()) {
    return reducedClass || '';
  }
  return baseClass;
}

/**
 * Page Transition - Cross-Fade with Slide
 * For smooth route transitions
 */
export function pageTransition(
  node: Element,
  params: {
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
  } = {}
): TransitionConfig {
  const {
    delay = 0,
    duration = MOTION_TOKENS.durations.normal,
    direction = 'up',
  } = params;

  const prefersReduced = prefersReducedMotion();

  if (prefersReduced) {
    return {
      delay,
      duration: MOTION_TOKENS.durations.instant,
      css: t => `opacity: ${t}`,
    };
  }

  return {
    delay,
    duration,
    easing: MOTION_TOKENS.easings.decelerate,
    css: t => {
      let transform = '';
      switch (direction) {
        case 'up':
          transform = `translateY(${(1 - t) * 20}px)`;
          break;
        case 'down':
          transform = `translateY(${(1 - t) * -20}px)`;
          break;
        case 'left':
          transform = `translateX(${(1 - t) * 20}px)`;
          break;
        case 'right':
          transform = `translateX(${(1 - t) * -20}px)`;
          break;
      }
      return `
        opacity: ${t};
        transform: ${transform} translateZ(0);
      `;
    },
  };
}

/**
 * Material Ripple Effect
 * For button press feedback (CSS-based)
 */
export const rippleEffect = `
  position: relative;
  overflow: hidden;
  transform: translateZ(0);

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(252, 246, 186, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:active::after {
    width: 300px;
    height: 300px;
  }
`;

/**
 * Skeleton Loading Animation
 * For content placeholders
 */
export const skeletonPulse = {
  base: `
    background: linear-gradient(
      90deg,
      rgba(51, 65, 85, 0.5) 0%,
      rgba(71, 85, 105, 0.5) 50%,
      rgba(51, 65, 85, 0.5) 100%
    );
    background-size: 200% 100%;
    animation: skeleton-pulse 1.5s ease-in-out infinite;
  `,
  keyframes: `
    @keyframes skeleton-pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `,
};

/**
 * Floating Animation
 * For decorative elements
 */
export function floatingAnimation(
  node: Element,
  params: {
    duration?: number;
    distance?: number;
  } = {}
): TransitionConfig {
  const {
    duration = 3000,
    distance = 10,
  } = params;

  const prefersReduced = prefersReducedMotion();

  if (prefersReduced) {
    return {
      duration: 0,
      css: () => '',
    };
  }

  return {
    duration,
    css: t => {
      const y = Math.sin(t * Math.PI * 2) * distance;
      return `transform: translateY(${y}px) translateZ(0);`;
    },
    tick: (t) => {
      // Continuous animation using CSS
    },
  };
}