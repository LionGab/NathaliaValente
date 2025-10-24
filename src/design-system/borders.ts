/**
 * ClubNath Design System - Borders
 * Foco: Definição, Separação e Hierarquia Visual
 * Inspiração: Delicadeza, Precisão e Modernidade
 */

export const borders = {
    // Border Width - Espessura e definição
    width: {
        0: '0',
        1: '1px',
        2: '2px',
        4: '4px',
        8: '8px',
    },

    // Border Style - Estilo e personalidade
    style: {
        solid: 'solid',
        dashed: 'dashed',
        dotted: 'dotted',
        double: 'double',
        none: 'none',
    },

    // Border Radius - Suavidade e modernidade
    radius: {
        // Base Radius
        none: '0',
        xs: '0.125rem',    // 2px
        sm: '0.25rem',     // 4px
        md: '0.375rem',    // 6px
        lg: '0.5rem',      // 8px
        xl: '0.75rem',     // 12px
        '2xl': '1rem',     // 16px
        '3xl': '1.5rem',   // 24px
        '4xl': '2rem',     // 32px
        '5xl': '2.5rem',   // 40px
        '6xl': '3rem',     // 48px
        full: '9999px',
    },

    // Semantic Borders - Significado e contexto
    semantic: {
        // Component Borders
        component: {
            none: 'none',
            subtle: '1px solid rgb(229 229 229)',
            soft: '1px solid rgb(212 212 212)',
            medium: '1px solid rgb(163 163 163)',
            strong: '2px solid rgb(115 115 115)',
            prominent: '2px solid rgb(82 82 82)',
        },

        // Interactive Borders
        interactive: {
            default: '1px solid rgb(229 229 229)',
            hover: '1px solid rgb(212 212 212)',
            active: '2px solid rgb(163 163 163)',
            focus: '2px solid rgb(226 77 255)',
            disabled: '1px solid rgb(229 229 229)',
        },

        // Card Borders
        card: {
            none: 'none',
            subtle: '1px solid rgb(245 245 245)',
            soft: '1px solid rgb(229 229 229)',
            medium: '1px solid rgb(212 212 212)',
            strong: '1px solid rgb(163 163 163)',
            prominent: '2px solid rgb(115 115 115)',
        },

        // Input Borders
        input: {
            default: '1px solid rgb(212 212 212)',
            hover: '1px solid rgb(163 163 163)',
            focus: '2px solid rgb(226 77 255)',
            error: '2px solid rgb(239 68 68)',
            success: '2px solid rgb(34 197 94)',
            disabled: '1px solid rgb(229 229 229)',
        },

        // Divider Borders
        divider: {
            light: '1px solid rgb(245 245 245)',
            medium: '1px solid rgb(229 229 229)',
            dark: '1px solid rgb(212 212 212)',
            strong: '2px solid rgb(163 163 163)',
        },
    },

    // Brand Borders - Identidade e personalidade
    brand: {
        // Primary Brand Borders
        primary: {
            subtle: '1px solid rgb(226 77 255 / 0.2)',
            soft: '1px solid rgb(226 77 255 / 0.3)',
            medium: '1px solid rgb(226 77 255 / 0.5)',
            strong: '2px solid rgb(226 77 255 / 0.7)',
            prominent: '2px solid rgb(226 77 255)',
        },

        // Secondary Brand Borders
        secondary: {
            subtle: '1px solid rgb(255 107 26 / 0.2)',
            soft: '1px solid rgb(255 107 26 / 0.3)',
            medium: '1px solid rgb(255 107 26 / 0.5)',
            strong: '2px solid rgb(255 107 26 / 0.7)',
            prominent: '2px solid rgb(255 107 26)',
        },

        // Accent Brand Borders
        accent: {
            subtle: '1px solid rgb(14 165 233 / 0.2)',
            soft: '1px solid rgb(14 165 233 / 0.3)',
            medium: '1px solid rgb(14 165 233 / 0.5)',
            strong: '2px solid rgb(14 165 233 / 0.7)',
            prominent: '2px solid rgb(14 165 233)',
        },
    },

    // Status Borders - Estados e feedback
    status: {
        // Success Borders
        success: {
            subtle: '1px solid rgb(34 197 94 / 0.2)',
            soft: '1px solid rgb(34 197 94 / 0.3)',
            medium: '1px solid rgb(34 197 94 / 0.5)',
            strong: '2px solid rgb(34 197 94 / 0.7)',
            prominent: '2px solid rgb(34 197 94)',
        },

        // Warning Borders
        warning: {
            subtle: '1px solid rgb(245 158 11 / 0.2)',
            soft: '1px solid rgb(245 158 11 / 0.3)',
            medium: '1px solid rgb(245 158 11 / 0.5)',
            strong: '2px solid rgb(245 158 11 / 0.7)',
            prominent: '2px solid rgb(245 158 11)',
        },

        // Error Borders
        error: {
            subtle: '1px solid rgb(239 68 68 / 0.2)',
            soft: '1px solid rgb(239 68 68 / 0.3)',
            medium: '1px solid rgb(239 68 68 / 0.5)',
            strong: '2px solid rgb(239 68 68 / 0.7)',
            prominent: '2px solid rgb(239 68 68)',
        },

        // Info Borders
        info: {
            subtle: '1px solid rgb(59 130 246 / 0.2)',
            soft: '1px solid rgb(59 130 246 / 0.3)',
            medium: '1px solid rgb(59 130 246 / 0.5)',
            strong: '2px solid rgb(59 130 246 / 0.7)',
            prominent: '2px solid rgb(59 130 246)',
        },
    },

    // Special Borders - Efeitos especiais
    special: {
        // Gradient Borders
        gradient: {
            primary: '2px solid transparent',
            secondary: '2px solid transparent',
            accent: '2px solid transparent',
            rainbow: '2px solid transparent',
        },

        // Dashed Borders
        dashed: {
            light: '1px dashed rgb(229 229 229)',
            medium: '1px dashed rgb(163 163 163)',
            dark: '1px dashed rgb(115 115 115)',
            primary: '1px dashed rgb(226 77 255)',
            secondary: '1px dashed rgb(255 107 26)',
        },

        // Dotted Borders
        dotted: {
            light: '1px dotted rgb(229 229 229)',
            medium: '1px dotted rgb(163 163 163)',
            dark: '1px dotted rgb(115 115 115)',
            primary: '1px dotted rgb(226 77 255)',
            secondary: '1px dotted rgb(255 107 26)',
        },
    },

    // Responsive Borders - Adaptação por dispositivo
    responsive: {
        // Mobile (320px - 768px)
        mobile: {
            component: {
                none: 'none',
                subtle: '1px solid rgb(229 229 229)',
                soft: '1px solid rgb(212 212 212)',
                medium: '1px solid rgb(163 163 163)',
                strong: '1px solid rgb(115 115 115)',
            },
            card: {
                none: 'none',
                subtle: '1px solid rgb(245 245 245)',
                soft: '1px solid rgb(229 229 229)',
                medium: '1px solid rgb(212 212 212)',
                strong: '1px solid rgb(163 163 163)',
            },
            input: {
                default: '1px solid rgb(212 212 212)',
                focus: '2px solid rgb(226 77 255)',
                error: '2px solid rgb(239 68 68)',
                success: '2px solid rgb(34 197 94)',
            },
        },

        // Tablet (768px - 1024px)
        tablet: {
            component: {
                none: 'none',
                subtle: '1px solid rgb(229 229 229)',
                soft: '1px solid rgb(212 212 212)',
                medium: '1px solid rgb(163 163 163)',
                strong: '2px solid rgb(115 115 115)',
            },
            card: {
                none: 'none',
                subtle: '1px solid rgb(245 245 245)',
                soft: '1px solid rgb(229 229 229)',
                medium: '1px solid rgb(212 212 212)',
                strong: '1px solid rgb(163 163 163)',
            },
            input: {
                default: '1px solid rgb(212 212 212)',
                focus: '2px solid rgb(226 77 255)',
                error: '2px solid rgb(239 68 68)',
                success: '2px solid rgb(34 197 94)',
            },
        },

        // Desktop (1024px+)
        desktop: {
            component: {
                none: 'none',
                subtle: '1px solid rgb(229 229 229)',
                soft: '1px solid rgb(212 212 212)',
                medium: '1px solid rgb(163 163 163)',
                strong: '2px solid rgb(115 115 115)',
                prominent: '2px solid rgb(82 82 82)',
            },
            card: {
                none: 'none',
                subtle: '1px solid rgb(245 245 245)',
                soft: '1px solid rgb(229 229 229)',
                medium: '1px solid rgb(212 212 212)',
                strong: '1px solid rgb(163 163 163)',
                prominent: '2px solid rgb(115 115 115)',
            },
            input: {
                default: '1px solid rgb(212 212 212)',
                focus: '2px solid rgb(226 77 255)',
                error: '2px solid rgb(239 68 68)',
                success: '2px solid rgb(34 197 94)',
            },
        },
    },
} as const;

// Border Utilities
export const borderUtils = {
    // Border Width Classes
    width: {
        0: 'border-0',
        1: 'border',
        2: 'border-2',
        4: 'border-4',
        8: 'border-8',
    },

    // Border Style Classes
    style: {
        solid: 'border-solid',
        dashed: 'border-dashed',
        dotted: 'border-dotted',
        double: 'border-double',
        none: 'border-none',
    },

    // Border Radius Classes
    radius: {
        none: 'rounded-none',
        xs: 'rounded-xs',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        '4xl': 'rounded-4xl',
        '5xl': 'rounded-5xl',
        '6xl': 'rounded-6xl',
        full: 'rounded-full',
    },

    // Semantic Border Classes
    semantic: {
        component: {
            none: 'border-none',
            subtle: 'border-subtle',
            soft: 'border-soft',
            medium: 'border-medium',
            strong: 'border-strong',
            prominent: 'border-prominent',
        },
        interactive: {
            default: 'border-default',
            hover: 'border-hover',
            active: 'border-active',
            focus: 'border-focus',
            disabled: 'border-disabled',
        },
        card: {
            none: 'border-none',
            subtle: 'border-card-subtle',
            soft: 'border-card-soft',
            medium: 'border-card-medium',
            strong: 'border-card-strong',
            prominent: 'border-card-prominent',
        },
        input: {
            default: 'border-input-default',
            focus: 'border-input-focus',
            error: 'border-input-error',
            success: 'border-input-success',
            disabled: 'border-input-disabled',
        },
        divider: {
            light: 'border-divider-light',
            medium: 'border-divider-medium',
            dark: 'border-divider-dark',
            strong: 'border-divider-strong',
        },
    },

    // Brand Border Classes
    brand: {
        primary: {
            subtle: 'border-primary-subtle',
            soft: 'border-primary-soft',
            medium: 'border-primary-medium',
            strong: 'border-primary-strong',
            prominent: 'border-primary-prominent',
        },
        secondary: {
            subtle: 'border-secondary-subtle',
            soft: 'border-secondary-soft',
            medium: 'border-secondary-medium',
            strong: 'border-secondary-strong',
            prominent: 'border-secondary-prominent',
        },
        accent: {
            subtle: 'border-accent-subtle',
            soft: 'border-accent-soft',
            medium: 'border-accent-medium',
            strong: 'border-accent-strong',
            prominent: 'border-accent-prominent',
        },
    },

    // Status Border Classes
    status: {
        success: {
            subtle: 'border-success-subtle',
            soft: 'border-success-soft',
            medium: 'border-success-medium',
            strong: 'border-success-strong',
            prominent: 'border-success-prominent',
        },
        warning: {
            subtle: 'border-warning-subtle',
            soft: 'border-warning-soft',
            medium: 'border-warning-medium',
            strong: 'border-warning-strong',
            prominent: 'border-warning-prominent',
        },
        error: {
            subtle: 'border-error-subtle',
            soft: 'border-error-soft',
            medium: 'border-error-medium',
            strong: 'border-error-strong',
            prominent: 'border-error-prominent',
        },
        info: {
            subtle: 'border-info-subtle',
            soft: 'border-info-soft',
            medium: 'border-info-medium',
            strong: 'border-info-strong',
            prominent: 'border-info-prominent',
        },
    },

    // Special Border Classes
    special: {
        gradient: {
            primary: 'border-gradient-primary',
            secondary: 'border-gradient-secondary',
            accent: 'border-gradient-accent',
            rainbow: 'border-gradient-rainbow',
        },
        dashed: {
            light: 'border-dashed-light',
            medium: 'border-dashed-medium',
            dark: 'border-dashed-dark',
            primary: 'border-dashed-primary',
            secondary: 'border-dashed-secondary',
        },
        dotted: {
            light: 'border-dotted-light',
            medium: 'border-dotted-medium',
            dark: 'border-dotted-dark',
            primary: 'border-dotted-primary',
            secondary: 'border-dotted-secondary',
        },
    },
} as const;

export type BorderKey = keyof typeof borders;
export type BorderWidth = keyof typeof borders.width;
export type BorderStyle = keyof typeof borders.style;
export type BorderRadius = keyof typeof borders.radius;
export type ResponsiveBreakpoint = 'mobile' | 'tablet' | 'desktop';
