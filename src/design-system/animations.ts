/**
 * ClubNath Design System - Animations
 * Foco: Fluidez, Expressão e Experiência Imersiva
 * Inspiração: Leveza, Espiritualidade e Modernidade
 */

export const animations = {
  // Duration - Tempo e ritmo
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },

  // Easing - Curvas de animação
  easing: {
    // Linear
    linear: 'linear',

    // Ease
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',

    // Cubic Bezier
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    smoothIn: 'cubic-bezier(0.4, 0, 1, 1)',
    smoothOut: 'cubic-bezier(0, 0, 0.2, 1)',
    smoothInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

    // Spring
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    springIn: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    springOut: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

    // Bounce
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    bounceIn: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    bounceOut: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

    // Elastic
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    elasticIn: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    elasticOut: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Keyframes - Movimentos e transformações
  keyframes: {
    // Fade Animations
    fadeIn: {
      from: { opacity: '0' },
      to: { opacity: '1' },
    },
    fadeOut: {
      from: { opacity: '1' },
      to: { opacity: '0' },
    },
    fadeInUp: {
      from: {
        opacity: '0',
        transform: 'translateY(20px)',
      },
      to: {
        opacity: '1',
        transform: 'translateY(0)',
      },
    },
    fadeInDown: {
      from: {
        opacity: '0',
        transform: 'translateY(-20px)',
      },
      to: {
        opacity: '1',
        transform: 'translateY(0)',
      },
    },
    fadeInLeft: {
      from: {
        opacity: '0',
        transform: 'translateX(-20px)',
      },
      to: {
        opacity: '1',
        transform: 'translateX(0)',
      },
    },
    fadeInRight: {
      from: {
        opacity: '0',
        transform: 'translateX(20px)',
      },
      to: {
        opacity: '1',
        transform: 'translateX(0)',
      },
    },

    // Scale Animations
    scaleIn: {
      from: {
        opacity: '0',
        transform: 'scale(0.9)',
      },
      to: {
        opacity: '1',
        transform: 'scale(1)',
      },
    },
    scaleOut: {
      from: {
        opacity: '1',
        transform: 'scale(1)',
      },
      to: {
        opacity: '0',
        transform: 'scale(0.9)',
      },
    },
    scaleUp: {
      from: { transform: 'scale(1)' },
      to: { transform: 'scale(1.05)' },
    },
    scaleDown: {
      from: { transform: 'scale(1)' },
      to: { transform: 'scale(0.95)' },
    },

    // Slide Animations
    slideInUp: {
      from: { transform: 'translateY(100%)' },
      to: { transform: 'translateY(0)' },
    },
    slideInDown: {
      from: { transform: 'translateY(-100%)' },
      to: { transform: 'translateY(0)' },
    },
    slideInLeft: {
      from: { transform: 'translateX(-100%)' },
      to: { transform: 'translateX(0)' },
    },
    slideInRight: {
      from: { transform: 'translateX(100%)' },
      to: { transform: 'translateX(0)' },
    },
    slideOutUp: {
      from: { transform: 'translateY(0)' },
      to: { transform: 'translateY(-100%)' },
    },
    slideOutDown: {
      from: { transform: 'translateY(0)' },
      to: { transform: 'translateY(100%)' },
    },
    slideOutLeft: {
      from: { transform: 'translateX(0)' },
      to: { transform: 'translateX(-100%)' },
    },
    slideOutRight: {
      from: { transform: 'translateX(0)' },
      to: { transform: 'translateX(100%)' },
    },

    // Rotate Animations
    rotateIn: {
      from: {
        opacity: '0',
        transform: 'rotate(-180deg)',
      },
      to: {
        opacity: '1',
        transform: 'rotate(0deg)',
      },
    },
    rotateOut: {
      from: {
        opacity: '1',
        transform: 'rotate(0deg)',
      },
      to: {
        opacity: '0',
        transform: 'rotate(180deg)',
      },
    },
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
    spinReverse: {
      from: { transform: 'rotate(360deg)' },
      to: { transform: 'rotate(0deg)' },
    },

    // Bounce Animations
    bounce: {
      '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
      '40%, 43%': { transform: 'translate3d(0, -30px, 0)' },
      '70%': { transform: 'translate3d(0, -15px, 0)' },
      '90%': { transform: 'translate3d(0, -4px, 0)' },
    },
    bounceIn: {
      '0%': {
        opacity: '0',
        transform: 'scale(0.3)',
      },
      '50%': {
        opacity: '1',
        transform: 'scale(1.05)',
      },
      '70%': { transform: 'scale(0.9)' },
      '100%': {
        opacity: '1',
        transform: 'scale(1)',
      },
    },
    bounceOut: {
      '20%': { transform: 'scale(1.1)' },
      '50%, 55%': {
        opacity: '1',
        transform: 'scale(1.1)',
      },
      '100%': {
        opacity: '0',
        transform: 'scale(0.3)',
      },
    },

    // Pulse Animations
    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' },
    },
    pulseGlow: {
      '0%, 100%': {
        opacity: '1',
        boxShadow: '0 0 20px rgb(226 77 255 / 0.3)',
      },
      '50%': {
        opacity: '0.8',
        boxShadow: '0 0 40px rgb(226 77 255 / 0.6)',
      },
    },
    pulseScale: {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.05)' },
    },

    // Shake Animations
    shake: {
      '0%, 100%': { transform: 'translateX(0)' },
      '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
      '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
    },
    shakeVertical: {
      '0%, 100%': { transform: 'translateY(0)' },
      '10%, 30%, 50%, 70%, 90%': { transform: 'translateY(-10px)' },
      '20%, 40%, 60%, 80%': { transform: 'translateY(10px)' },
    },

    // Wobble Animations
    wobble: {
      '0%': { transform: 'translateX(0%)' },
      '15%': { transform: 'translateX(-25%) rotate(-5deg)' },
      '30%': { transform: 'translateX(20%) rotate(3deg)' },
      '45%': { transform: 'translateX(-15%) rotate(-3deg)' },
      '60%': { transform: 'translateX(10%) rotate(2deg)' },
      '75%': { transform: 'translateX(-5%) rotate(-1deg)' },
      '100%': { transform: 'translateX(0%)' },
    },

    // Float Animations
    float: {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-20px)' },
    },
    floatSlow: {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-10px)' },
    },
    floatFast: {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-30px)' },
    },

    // Shimmer Animations
    shimmer: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' },
    },
    shimmerSlow: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' },
    },

    // Gradient Animations
    gradient: {
      '0%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
      '100%': { backgroundPosition: '0% 50%' },
    },
    gradientSlow: {
      '0%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
      '100%': { backgroundPosition: '0% 50%' },
    },

    // Glow Animations
    glow: {
      '0%, 100%': {
        boxShadow: '0 0 20px rgb(226 77 255 / 0.3)',
      },
      '50%': {
        boxShadow: '0 0 40px rgb(226 77 255 / 0.6)',
      },
    },
    glowPulse: {
      '0%, 100%': {
        boxShadow: '0 0 20px rgb(226 77 255 / 0.3)',
      },
      '50%': {
        boxShadow: '0 0 60px rgb(226 77 255 / 0.8)',
      },
    },
  },

  // Animation Classes - Combinações pré-definidas
  classes: {
    // Fade Classes
    fadeIn: 'animate-fade-in',
    fadeOut: 'animate-fade-out',
    fadeInUp: 'animate-fade-in-up',
    fadeInDown: 'animate-fade-in-down',
    fadeInLeft: 'animate-fade-in-left',
    fadeInRight: 'animate-fade-in-right',

    // Scale Classes
    scaleIn: 'animate-scale-in',
    scaleOut: 'animate-scale-out',
    scaleUp: 'animate-scale-up',
    scaleDown: 'animate-scale-down',

    // Slide Classes
    slideInUp: 'animate-slide-in-up',
    slideInDown: 'animate-slide-in-down',
    slideInLeft: 'animate-slide-in-left',
    slideInRight: 'animate-slide-in-right',
    slideOutUp: 'animate-slide-out-up',
    slideOutDown: 'animate-slide-out-down',
    slideOutLeft: 'animate-slide-out-left',
    slideOutRight: 'animate-slide-out-right',

    // Rotate Classes
    rotateIn: 'animate-rotate-in',
    rotateOut: 'animate-rotate-out',
    spin: 'animate-spin',
    spinReverse: 'animate-spin-reverse',

    // Bounce Classes
    bounce: 'animate-bounce',
    bounceIn: 'animate-bounce-in',
    bounceOut: 'animate-bounce-out',

    // Pulse Classes
    pulse: 'animate-pulse',
    pulseGlow: 'animate-pulse-glow',
    pulseScale: 'animate-pulse-scale',

    // Shake Classes
    shake: 'animate-shake',
    shakeVertical: 'animate-shake-vertical',

    // Wobble Classes
    wobble: 'animate-wobble',

    // Float Classes
    float: 'animate-float',
    floatSlow: 'animate-float-slow',
    floatFast: 'animate-float-fast',

    // Shimmer Classes
    shimmer: 'animate-shimmer',
    shimmerSlow: 'animate-shimmer-slow',

    // Gradient Classes
    gradient: 'animate-gradient',
    gradientSlow: 'animate-gradient-slow',

    // Glow Classes
    glow: 'animate-glow',
    glowPulse: 'animate-glow-pulse',
  },

  // Animation Presets - Combinações complexas
  presets: {
    // Entrance Presets
    entrance: {
      gentle: {
        animation: 'fadeInUp',
        duration: '300ms',
        easing: 'smooth',
      },
      dramatic: {
        animation: 'scaleIn',
        duration: '500ms',
        easing: 'spring',
      },
      subtle: {
        animation: 'fadeIn',
        duration: '200ms',
        easing: 'smooth',
      },
    },

    // Exit Presets
    exit: {
      gentle: {
        animation: 'fadeOut',
        duration: '200ms',
        easing: 'smooth',
      },
      dramatic: {
        animation: 'scaleOut',
        duration: '300ms',
        easing: 'smooth',
      },
      slide: {
        animation: 'slideOutDown',
        duration: '300ms',
        easing: 'smooth',
      },
    },

    // Interactive Presets
    interactive: {
      hover: {
        animation: 'scaleUp',
        duration: '150ms',
        easing: 'smooth',
      },
      active: {
        animation: 'scaleDown',
        duration: '100ms',
        easing: 'smooth',
      },
      focus: {
        animation: 'pulseGlow',
        duration: '1000ms',
        easing: 'ease',
        iterationCount: 'infinite',
      },
    },

    // Loading Presets
    loading: {
      spin: {
        animation: 'spin',
        duration: '1000ms',
        easing: 'linear',
        iterationCount: 'infinite',
      },
      pulse: {
        animation: 'pulse',
        duration: '2000ms',
        easing: 'ease',
        iterationCount: 'infinite',
      },
      bounce: {
        animation: 'bounce',
        duration: '1000ms',
        easing: 'ease',
        iterationCount: 'infinite',
      },
    },

    // Attention Presets
    attention: {
      shake: {
        animation: 'shake',
        duration: '500ms',
        easing: 'ease',
      },
      wobble: {
        animation: 'wobble',
        duration: '1000ms',
        easing: 'ease',
      },
      glow: {
        animation: 'glow',
        duration: '2000ms',
        easing: 'ease',
        iterationCount: 'infinite',
      },
    },
  },
} as const;

// Animation Utilities
export const animationUtils = {
  // Duration Classes
  duration: {
    instant: 'duration-0',
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500',
    slower: 'duration-700',
    slowest: 'duration-1000',
  },

  // Easing Classes
  easing: {
    linear: 'ease-linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    smooth: 'ease-smooth',
    spring: 'ease-spring',
    bounce: 'ease-bounce',
  },

  // Animation Classes
  animation: {
    fadeIn: 'animate-fade-in',
    fadeOut: 'animate-fade-out',
    scaleIn: 'animate-scale-in',
    scaleOut: 'animate-scale-out',
    slideInUp: 'animate-slide-in-up',
    slideOutDown: 'animate-slide-out-down',
    spin: 'animate-spin',
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    shake: 'animate-shake',
    wobble: 'animate-wobble',
    float: 'animate-float',
    shimmer: 'animate-shimmer',
    glow: 'animate-glow',
  },

  // Iteration Count Classes
  iterationCount: {
    once: 'animate-once',
    twice: 'animate-twice',
    infinite: 'animate-infinite',
  },

  // Fill Mode Classes
  fillMode: {
    none: 'animate-fill-none',
    forwards: 'animate-fill-forwards',
    backwards: 'animate-fill-backwards',
    both: 'animate-fill-both',
  },

  // Direction Classes
  direction: {
    normal: 'animate-normal',
    reverse: 'animate-reverse',
    alternate: 'animate-alternate',
    alternateReverse: 'animate-alternate-reverse',
  },
} as const;

export type AnimationKey = keyof typeof animations;
export type DurationKey = keyof typeof animations.duration;
export type EasingKey = keyof typeof animations.easing;
export type KeyframeKey = keyof typeof animations.keyframes;
export type PresetKey = keyof typeof animations.presets;
