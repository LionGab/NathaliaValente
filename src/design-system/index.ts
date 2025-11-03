/**
 * ClubNath Design System - Main Export
 * Sistema de Design Completo para Mães
 * Foco: Acolhimento, Conexão e Pertencentimento
 */

// Core Design System
export { colors, colorUsage } from './colors';
export { typography, typographyUtils } from './typography';
export { spacing, spacingUtils } from './spacing';
export { shadows, shadowUtils } from './shadows';
export { borders, borderUtils } from './borders';
export { animations, animationUtils } from './animations';

// Design System Types
export type { ColorKey, ColorShade } from './colors';

export type {
  TypographyKey,
  TextStyleKey,
  ResponsiveBreakpoint as TypographyBreakpoint,
} from './typography';

export type {
  SpacingKey,
  SpacingValue,
  ResponsiveBreakpoint as SpacingBreakpoint,
} from './spacing';

export type { ShadowKey, ShadowValue, ResponsiveBreakpoint as ShadowBreakpoint } from './shadows';

export type {
  BorderKey,
  BorderWidth,
  BorderStyle,
  BorderRadius,
  ResponsiveBreakpoint as BorderBreakpoint,
} from './borders';

export type { AnimationKey, DurationKey, EasingKey, KeyframeKey, PresetKey } from './animations';

// Design System Configuration
export const designSystem = {
  // Brand Identity
  brand: {
    name: 'ClubNath',
    tagline: 'Sua comunidade exclusiva',
    description: 'Plataforma exclusiva para mães - acolhimento, conexão e pertencentimento',
    values: [
      'Acolhimento',
      'Conexão',
      'Pertencentimento',
      'Leveza',
      'Espiritualidade',
      'Modernidade',
    ],
  },

  // Target Audience
  audience: {
    primary: 'Mães',
    secondary: 'Mulheres em geral',
    ageRange: '25-45 anos',
    characteristics: [
      'Buscam conexão e comunidade',
      'Valorizam acolhimento e apoio',
      'Interessadas em crescimento pessoal',
      'Apreciam design moderno e elegante',
      'Usuárias ativas de tecnologia',
    ],
  },

  // Design Principles
  principles: {
    primary: 'Acolhimento',
    secondary: 'Conexão',
    tertiary: 'Pertencentimento',
    supporting: ['Leveza', 'Espiritualidade', 'Modernidade'],
  },

  // Platform Support
  platforms: {
    mobile: {
      ios: 'iOS 14+',
      android: 'Android 8+',
    },
    web: {
      pwa: 'Progressive Web App',
      browsers: 'Chrome, Safari, Firefox, Edge',
    },
  },

  // Accessibility
  accessibility: {
    wcag: 'AA',
    contrast: '4.5:1 minimum',
    touchTargets: '44px minimum',
    screenReaders: 'Fully supported',
    keyboardNavigation: 'Complete support',
  },

  // Performance
  performance: {
    target: {
      fcp: '< 1.5s',
      lcp: '< 2.5s',
      cls: '< 0.1',
      fid: '< 100ms',
    },
    bundle: {
      css: '< 50kb',
      js: '< 200kb',
      images: 'WebP format',
    },
  },
} as const;

// Design System Utilities
export const designSystemUtils = {
  // Color Utilities
  getColor: (color: string, shade: number = 500) => {
    return `var(--color-${color}-${shade})`;
  },

  // Spacing Utilities
  getSpacing: (size: string, breakpoint: 'mobile' | 'tablet' | 'desktop' = 'desktop') => {
    return `var(--spacing-${size}-${breakpoint})`;
  },

  // Typography Utilities
  getTypography: (style: string, breakpoint: 'mobile' | 'tablet' | 'desktop' = 'desktop') => {
    return `var(--typography-${style}-${breakpoint})`;
  },

  // Shadow Utilities
  getShadow: (type: string, breakpoint: 'mobile' | 'tablet' | 'desktop' = 'desktop') => {
    return `var(--shadow-${type}-${breakpoint})`;
  },

  // Animation Utilities
  getAnimation: (preset: string) => {
    return `var(--animation-${preset})`;
  },
};

// Design System Validation
export const validateDesignSystem = () => {
  const errors: string[] = [];

  // Basic validation
  if (!designSystem.brand.name) {
    errors.push('Brand name is missing');
  }

  if (!designSystem.audience.primary) {
    errors.push('Primary audience is missing');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Design System Documentation
export const designSystemDocs = {
  // Usage Guidelines
  usage: {
    colors: {
      primary: 'Use for main actions, links, and brand elements',
      secondary: 'Use for secondary actions and accents',
      accent: 'Use for highlights and special elements',
      neutral: 'Use for text, backgrounds, and borders',
      semantic: 'Use for status indicators and feedback',
    },
    typography: {
      display: 'Use for hero headings and large titles',
      heading: 'Use for section headings and subheadings',
      body: 'Use for body text and content',
      label: 'Use for form labels and small text',
      caption: 'Use for metadata and secondary information',
    },
    spacing: {
      component: 'Use for spacing within components',
      layout: 'Use for spacing between sections',
      content: 'Use for spacing within content',
      interactive: 'Use for touch targets and interactive elements',
    },
    shadows: {
      component: 'Use for component elevation',
      card: 'Use for card and surface elevation',
      interactive: 'Use for interactive element states',
      brand: 'Use for brand-specific elements',
    },
    borders: {
      component: 'Use for component boundaries',
      input: 'Use for form input states',
      divider: 'Use for content separation',
      brand: 'Use for brand-specific elements',
    },
    animations: {
      entrance: 'Use for element entrance animations',
      exit: 'Use for element exit animations',
      interactive: 'Use for user interaction feedback',
      loading: 'Use for loading states',
      attention: 'Use for drawing attention',
    },
  },

  // Best Practices
  bestPractices: {
    colors: [
      'Use primary colors sparingly for maximum impact',
      'Maintain sufficient contrast for accessibility',
      'Use semantic colors for status and feedback',
      'Test colors in both light and dark modes',
    ],
    typography: [
      'Use consistent font sizes and weights',
      'Maintain proper line height for readability',
      'Use appropriate font families for context',
      'Test typography on different screen sizes',
    ],
    spacing: [
      'Use consistent spacing throughout the interface',
      'Follow the spacing scale for harmony',
      'Consider touch targets for mobile interfaces',
      'Use responsive spacing for different devices',
    ],
    shadows: [
      'Use shadows to create visual hierarchy',
      'Keep shadows subtle for modern appearance',
      'Use brand shadows for special elements',
      'Test shadows in different lighting conditions',
    ],
    borders: [
      'Use borders sparingly to avoid clutter',
      'Use semantic borders for form states',
      'Maintain consistent border radius',
      'Consider border alternatives like shadows',
    ],
    animations: [
      'Use animations to enhance user experience',
      'Keep animations subtle and purposeful',
      'Provide animation controls for accessibility',
      'Test animations on different devices',
    ],
  },

  // Accessibility Guidelines
  accessibility: {
    colors: [
      'Ensure 4.5:1 contrast ratio for normal text',
      'Ensure 3:1 contrast ratio for large text',
      "Don't rely on color alone to convey information",
      'Test with color blindness simulators',
    ],
    typography: [
      'Use readable font sizes (16px minimum)',
      'Maintain proper line height (1.5x font size)',
      'Use appropriate font weights for hierarchy',
      'Test with screen readers',
    ],
    spacing: [
      'Ensure 44px minimum touch targets',
      'Provide adequate spacing between interactive elements',
      'Use consistent spacing for predictability',
      'Test with different input methods',
    ],
    shadows: [
      "Don't rely on shadows for critical information",
      "Ensure shadows don't interfere with readability",
      'Test shadows in high contrast mode',
      'Provide alternative visual cues',
    ],
    borders: [
      'Use borders to enhance accessibility',
      'Ensure borders are visible in high contrast mode',
      "Don't rely on borders for critical information",
      'Test with different zoom levels',
    ],
    animations: [
      'Respect prefers-reduced-motion',
      'Provide animation controls',
      "Ensure animations don't cause seizures",
      'Test with different animation preferences',
    ],
  },
} as const;

// Export everything
export default {
  designSystem,
  designSystemUtils,
  validateDesignSystem,
  designSystemDocs,
};
