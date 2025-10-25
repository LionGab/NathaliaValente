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
export type {
    ColorKey,
    ColorShade,
} from './colors';

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

export type {
    ShadowKey,
    ShadowValue,
    ResponsiveBreakpoint as ShadowBreakpoint,
} from './shadows';

export type {
    BorderKey,
    BorderWidth,
    BorderStyle,
    BorderRadius,
    ResponsiveBreakpoint as BorderBreakpoint,
} from './borders';

export type {
    AnimationKey,
    DurationKey,
    EasingKey,
} from './animations';

// Design System Configuration
export const designSystemConfig = {
    // Color System
    colors: {
        primary: '#8B5CF6', // Purple
        secondary: '#F59E0B', // Amber
        accent: '#EC4899', // Pink
        neutral: '#6B7280', // Gray
        semantic: {
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6',
        },
        gradients: {
            primary: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            secondary: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
        },
        backgrounds: {
            primary: '#FFFFFF',
            secondary: '#F9FAFB',
            tertiary: '#F3F4F6',
        },
        text: {
            primary: '#111827',
            secondary: '#6B7280',
            tertiary: '#9CA3AF',
        },
        borders: {
            primary: '#E5E7EB',
            secondary: '#D1D5DB',
        },
        status: {
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6',
        },
    },

    // Typography System
    typography: {
        fonts: {
            primary: 'Inter, system-ui, sans-serif',
            secondary: 'Georgia, serif',
        },
        sizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
        },
        weights: {
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
        },
        lineHeights: {
            tight: '1.25',
            normal: '1.5',
            relaxed: '1.75',
        },
        letterSpacing: {
            tight: '-0.025em',
            normal: '0',
            wide: '0.025em',
        },
    },

    // Spacing System
    spacing: {
        base: '1rem',
        scale: {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
            '2xl': '3rem',
        },
        responsive: {
            mobile: '1rem',
            tablet: '1.5rem',
            desktop: '2rem',
        },
    },

    // Shadow System
    shadows: {
        elevation: {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        },
        focus: '0 0 0 3px rgba(139, 92, 246, 0.1)',
        decorative: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
    },

    // Border System
    borders: {
        widths: {
            thin: '1px',
            medium: '2px',
            thick: '4px',
        },
        styles: {
            solid: 'solid',
            dashed: 'dashed',
            dotted: 'dotted',
        },
        radius: {
            none: '0',
            sm: '0.125rem',
            md: '0.375rem',
            lg: '0.5rem',
            xl: '0.75rem',
            full: '9999px',
        },
    },

    // Animation System
    animations: {
        durations: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms',
        },
        easings: {
            ease: 'ease',
            easeIn: 'ease-in',
            easeOut: 'ease-out',
            easeInOut: 'ease-in-out',
        },
        presets: {
            fadeIn: 'fadeIn 0.3s ease-in-out',
            slideUp: 'slideUp 0.3s ease-out',
            scaleIn: 'scaleIn 0.2s ease-out',
        },
    },
} as const;

// Design System Utilities
export const designSystemUtils = {
    // Color Utilities
    getColor: (color: string, shade: number = 500) => {
        const colorMap: Record<string, any> = {
            primary: '#8B5CF6',
            secondary: '#F59E0B',
            accent: '#EC4899',
            neutral: '#6B7280',
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6',
        };

        return colorMap[color] || '#6B7280';
    },

    // Spacing Utilities
    getSpacing: (size: string, breakpoint: 'mobile' | 'tablet' | 'desktop' = 'desktop') => {
        const spacingMap: Record<string, any> = {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
            '2xl': '3rem',
        };

        return spacingMap[size] || '1rem';
    },

    // Typography Utilities
    getTypography: (style: string, breakpoint: 'mobile' | 'tablet' | 'desktop' = 'desktop') => {
        const typographyMap: Record<string, any> = {
            display: {
                fontSize: '2.25rem',
                fontWeight: '700',
                lineHeight: '1.25',
            },
            heading: {
                fontSize: '1.875rem',
                fontWeight: '600',
                lineHeight: '1.25',
            },
            body: {
                fontSize: '1rem',
                fontWeight: '400',
                lineHeight: '1.5',
            },
        };

        return typographyMap[style] || typographyMap.body;
    },

    // Shadow Utilities
    getShadow: (type: string, breakpoint: 'mobile' | 'tablet' | 'desktop' = 'desktop') => {
        const shadowMap: Record<string, any> = {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        };

        return shadowMap[type] || shadowMap.md;
    },

    // Border Utilities
    getBorder: (type: string, breakpoint: 'mobile' | 'tablet' | 'desktop' = 'desktop') => {
        const borderMap: Record<string, any> = {
            thin: '1px solid #E5E7EB',
            medium: '2px solid #E5E7EB',
            thick: '4px solid #E5E7EB',
        };

        return borderMap[type] || borderMap.thin;
    },

    // Animation Utilities
    getAnimation: (type: string, breakpoint: 'mobile' | 'tablet' | 'desktop' = 'desktop') => {
        const animationMap: Record<string, any> = {
            fadeIn: 'fadeIn 0.3s ease-in-out',
            slideUp: 'slideUp 0.3s ease-out',
            scaleIn: 'scaleIn 0.2s ease-out',
        };

        return animationMap[type] || animationMap.fadeIn;
    },
};

// Design System Theme
export const theme = {
    colors: designSystemConfig.colors,
    typography: designSystemConfig.typography,
    spacing: designSystemConfig.spacing,
    shadows: designSystemConfig.shadows,
    borders: designSystemConfig.borders,
    animations: designSystemConfig.animations,
};

// Default export
export default {
    config: designSystemConfig,
    utils: designSystemUtils,
    theme,
};
