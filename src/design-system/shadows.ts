/**
 * ClubNath Design System - Shadows
 * Foco: Profundidade, Elevação e Hierarquia Visual
 * Inspiração: Leveza, Espiritualidade e Modernidade
 */

export const shadows = {
    // Base Shadows - Elevação e profundidade
    base: {
        none: 'none',
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    },

    // Semantic Shadows - Significado e contexto
    semantic: {
        // Component Shadows
        component: {
            flat: 'none',
            raised: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            floating: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            elevated: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            prominent: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            hero: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        },

        // Interactive Shadows
        interactive: {
            default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            hover: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            active: '0 1px 2px 0 rgb(0 0 0 / 0.1)',
            focus: '0 0 0 3px rgb(226 77 255 / 0.1)',
            disabled: 'none',
        },

        // Card Shadows
        card: {
            flat: 'none',
            subtle: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            soft: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            medium: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            strong: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            dramatic: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        },

        // Modal Shadows
        modal: {
            backdrop: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
            content: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        },

        // Navigation Shadows
        navigation: {
            top: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            bottom: '0 -1px 3px 0 rgb(0 0 0 / 0.1), 0 -1px 2px -1px rgb(0 0 0 / 0.1)',
            floating: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        },
    },

    // Brand Shadows - Identidade e personalidade
    brand: {
        // Primary Brand Shadows
        primary: {
            subtle: '0 1px 3px 0 rgb(226 77 255 / 0.1), 0 1px 2px -1px rgb(226 77 255 / 0.1)',
            soft: '0 4px 6px -1px rgb(226 77 255 / 0.1), 0 2px 4px -2px rgb(226 77 255 / 0.1)',
            medium: '0 10px 15px -3px rgb(226 77 255 / 0.1), 0 4px 6px -4px rgb(226 77 255 / 0.1)',
            strong: '0 20px 25px -5px rgb(226 77 255 / 0.1), 0 8px 10px -6px rgb(226 77 255 / 0.1)',
            glow: '0 0 20px rgb(226 77 255 / 0.3)',
        },

        // Secondary Brand Shadows
        secondary: {
            subtle: '0 1px 3px 0 rgb(255 107 26 / 0.1), 0 1px 2px -1px rgb(255 107 26 / 0.1)',
            soft: '0 4px 6px -1px rgb(255 107 26 / 0.1), 0 2px 4px -2px rgb(255 107 26 / 0.1)',
            medium: '0 10px 15px -3px rgb(255 107 26 / 0.1), 0 4px 6px -4px rgb(255 107 26 / 0.1)',
            strong: '0 20px 25px -5px rgb(255 107 26 / 0.1), 0 8px 10px -6px rgb(255 107 26 / 0.1)',
            glow: '0 0 20px rgb(255 107 26 / 0.3)',
        },

        // Accent Brand Shadows
        accent: {
            subtle: '0 1px 3px 0 rgb(14 165 233 / 0.1), 0 1px 2px -1px rgb(14 165 233 / 0.1)',
            soft: '0 4px 6px -1px rgb(14 165 233 / 0.1), 0 2px 4px -2px rgb(14 165 233 / 0.1)',
            medium: '0 10px 15px -3px rgb(14 165 233 / 0.1), 0 4px 6px -4px rgb(14 165 233 / 0.1)',
            strong: '0 20px 25px -5px rgb(14 165 233 / 0.1), 0 8px 10px -6px rgb(14 165 233 / 0.1)',
            glow: '0 0 20px rgb(14 165 233 / 0.3)',
        },
    },

    // Special Effects - Efeitos especiais e atmosfera
    effects: {
        // Glow Effects
        glow: {
            primary: '0 0 20px rgb(226 77 255 / 0.3)',
            secondary: '0 0 20px rgb(255 107 26 / 0.3)',
            accent: '0 0 20px rgb(14 165 233 / 0.3)',
            success: '0 0 20px rgb(34 197 94 / 0.3)',
            warning: '0 0 20px rgb(245 158 11 / 0.3)',
            error: '0 0 20px rgb(239 68 68 / 0.3)',
            white: '0 0 20px rgb(255 255 255 / 0.3)',
            black: '0 0 20px rgb(0 0 0 / 0.3)',
        },

        // Soft Shadows
        soft: {
            xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            sm: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
            md: '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
            lg: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
            xl: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08)',
        },

        // Hard Shadows
        hard: {
            xs: '0 1px 2px 0 rgb(0 0 0 / 0.2)',
            sm: '0 1px 3px 0 rgb(0 0 0 / 0.2), 0 1px 2px -1px rgb(0 0 0 / 0.2)',
            md: '0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.2)',
            lg: '0 10px 15px -3px rgb(0 0 0 / 0.2), 0 4px 6px -4px rgb(0 0 0 / 0.2)',
            xl: '0 20px 25px -5px rgb(0 0 0 / 0.2), 0 8px 10px -6px rgb(0 0 0 / 0.2)',
        },

        // Colored Shadows
        colored: {
            primary: '0 4px 6px -1px rgb(226 77 255 / 0.2), 0 2px 4px -2px rgb(226 77 255 / 0.2)',
            secondary: '0 4px 6px -1px rgb(255 107 26 / 0.2), 0 2px 4px -2px rgb(255 107 26 / 0.2)',
            accent: '0 4px 6px -1px rgb(14 165 233 / 0.2), 0 2px 4px -2px rgb(14 165 233 / 0.2)',
            success: '0 4px 6px -1px rgb(34 197 94 / 0.2), 0 2px 4px -2px rgb(34 197 94 / 0.2)',
            warning: '0 4px 6px -1px rgb(245 158 11 / 0.2), 0 2px 4px -2px rgb(245 158 11 / 0.2)',
            error: '0 4px 6px -1px rgb(239 68 68 / 0.2), 0 2px 4px -2px rgb(239 68 68 / 0.2)',
        },
    },

    // Responsive Shadows - Adaptação por dispositivo
    responsive: {
        // Mobile (320px - 768px)
        mobile: {
            component: {
                flat: 'none',
                raised: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                floating: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                elevated: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                prominent: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            },
            card: {
                flat: 'none',
                subtle: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                soft: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                strong: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            },
        },

        // Tablet (768px - 1024px)
        tablet: {
            component: {
                flat: 'none',
                raised: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                floating: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                elevated: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                prominent: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            },
            card: {
                flat: 'none',
                subtle: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                soft: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                medium: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                strong: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            },
        },

        // Desktop (1024px+)
        desktop: {
            component: {
                flat: 'none',
                raised: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                floating: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                elevated: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                prominent: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                hero: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
            },
            card: {
                flat: 'none',
                subtle: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                soft: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                medium: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                strong: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                dramatic: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
            },
        },
    },
} as const;

// Shadow Utilities
export const shadowUtils = {
    // Base Shadow Classes
    base: {
        none: 'shadow-none',
        xs: 'shadow-xs',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
        '2xl': 'shadow-2xl',
        inner: 'shadow-inner',
    },

    // Semantic Shadow Classes
    semantic: {
        component: {
            flat: 'shadow-none',
            raised: 'shadow-sm',
            floating: 'shadow-md',
            elevated: 'shadow-lg',
            prominent: 'shadow-xl',
            hero: 'shadow-2xl',
        },
        interactive: {
            default: 'shadow-sm',
            hover: 'shadow-md',
            active: 'shadow-xs',
            focus: 'shadow-focus',
            disabled: 'shadow-none',
        },
        card: {
            flat: 'shadow-none',
            subtle: 'shadow-sm',
            soft: 'shadow-md',
            medium: 'shadow-lg',
            strong: 'shadow-xl',
            dramatic: 'shadow-2xl',
        },
    },

    // Brand Shadow Classes
    brand: {
        primary: {
            subtle: 'shadow-primary-subtle',
            soft: 'shadow-primary-soft',
            medium: 'shadow-primary-medium',
            strong: 'shadow-primary-strong',
            glow: 'shadow-primary-glow',
        },
        secondary: {
            subtle: 'shadow-secondary-subtle',
            soft: 'shadow-secondary-soft',
            medium: 'shadow-secondary-medium',
            strong: 'shadow-secondary-strong',
            glow: 'shadow-secondary-glow',
        },
        accent: {
            subtle: 'shadow-accent-subtle',
            soft: 'shadow-accent-soft',
            medium: 'shadow-accent-medium',
            strong: 'shadow-accent-strong',
            glow: 'shadow-accent-glow',
        },
    },

    // Effect Shadow Classes
    effects: {
        glow: {
            primary: 'shadow-glow-primary',
            secondary: 'shadow-glow-secondary',
            accent: 'shadow-glow-accent',
            success: 'shadow-glow-success',
            warning: 'shadow-glow-warning',
            error: 'shadow-glow-error',
            white: 'shadow-glow-white',
            black: 'shadow-glow-black',
        },
        soft: {
            xs: 'shadow-soft-xs',
            sm: 'shadow-soft-sm',
            md: 'shadow-soft-md',
            lg: 'shadow-soft-lg',
            xl: 'shadow-soft-xl',
        },
        hard: {
            xs: 'shadow-hard-xs',
            sm: 'shadow-hard-sm',
            md: 'shadow-hard-md',
            lg: 'shadow-hard-lg',
            xl: 'shadow-hard-xl',
        },
        colored: {
            primary: 'shadow-colored-primary',
            secondary: 'shadow-colored-secondary',
            accent: 'shadow-colored-accent',
            success: 'shadow-colored-success',
            warning: 'shadow-colored-warning',
            error: 'shadow-colored-error',
        },
    },
} as const;

export type ShadowKey = keyof typeof shadows;
export type ShadowValue = keyof typeof shadows.base;
export type ResponsiveBreakpoint = 'mobile' | 'tablet' | 'desktop';
