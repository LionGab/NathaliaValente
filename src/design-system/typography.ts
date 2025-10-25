/**
 * ClubNath Design System - Typography
 * Foco: Legibilidade, Acolhimento e Hierarquia Clara
 * Inspiração: Maternidade, Espiritualidade e Modernidade
 */

export const typography = {
    // Font Families
    fontFamily: {
        // Primary - Moderna e acolhedora
        primary: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'Helvetica Neue',
            'Arial',
            'sans-serif'
        ],

        // Secondary - Elegante e espiritual
        secondary: [
            'Playfair Display',
            'Georgia',
            'Times New Roman',
            'serif'
        ],

        // Accent - Moderna e técnica
        accent: [
            'JetBrains Mono',
            'Fira Code',
            'Monaco',
            'Consolas',
            'monospace'
        ],

        // Display - Impacto e presença
        display: [
            'Poppins',
            'Inter',
            'sans-serif'
        ]
    },

    // Font Sizes - Escala harmônica
    fontSize: {
        // Mobile First
        xs: '0.75rem',    // 12px - Labels, captions
        sm: '0.875rem',   // 14px - Small text, metadata
        base: '1rem',     // 16px - Body text
        lg: '1.125rem',   // 18px - Large body text
        xl: '1.25rem',    // 20px - Subheadings
        '2xl': '1.5rem',  // 24px - Headings
        '3xl': '1.875rem', // 30px - Large headings
        '4xl': '2.25rem', // 36px - Display headings
        '5xl': '3rem',    // 48px - Hero headings
        '6xl': '3.75rem', // 60px - Large hero
        '7xl': '4.5rem',  // 72px - Extra large hero
        '8xl': '6rem',    // 96px - Massive display
        '9xl': '8rem',    // 128px - Ultra display
    },

    // Font Weights - Expressão e hierarquia
    fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
    },

    // Line Heights - Respiração e legibilidade
    lineHeight: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
    },

    // Letter Spacing - Caracter e personalidade
    letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
    },

    // Text Styles - Combinações pré-definidas
    textStyles: {
        // Display Styles - Impacto máximo
        display: {
            '2xl': {
                fontSize: '4.5rem',
                lineHeight: '1',
                fontWeight: '800',
                letterSpacing: '-0.025em',
            },
            xl: {
                fontSize: '3.75rem',
                lineHeight: '1',
                fontWeight: '800',
                letterSpacing: '-0.025em',
            },
            lg: {
                fontSize: '3rem',
                lineHeight: '1.1',
                fontWeight: '700',
                letterSpacing: '-0.025em',
            },
            md: {
                fontSize: '2.25rem',
                lineHeight: '1.2',
                fontWeight: '700',
                letterSpacing: '-0.025em',
            },
            sm: {
                fontSize: '1.875rem',
                lineHeight: '1.3',
                fontWeight: '600',
                letterSpacing: '-0.025em',
            },
        },

        // Heading Styles - Hierarquia clara
        heading: {
            h1: {
                fontSize: '2.25rem',
                lineHeight: '1.2',
                fontWeight: '700',
                letterSpacing: '-0.025em',
            },
            h2: {
                fontSize: '1.875rem',
                lineHeight: '1.3',
                fontWeight: '600',
                letterSpacing: '-0.025em',
            },
            h3: {
                fontSize: '1.5rem',
                lineHeight: '1.4',
                fontWeight: '600',
                letterSpacing: '-0.025em',
            },
            h4: {
                fontSize: '1.25rem',
                lineHeight: '1.4',
                fontWeight: '500',
                letterSpacing: '-0.025em',
            },
            h5: {
                fontSize: '1.125rem',
                lineHeight: '1.5',
                fontWeight: '500',
                letterSpacing: '-0.025em',
            },
            h6: {
                fontSize: '1rem',
                lineHeight: '1.5',
                fontWeight: '500',
                letterSpacing: '-0.025em',
            },
        },

        // Body Styles - Legibilidade otimizada
        body: {
            large: {
                fontSize: '1.125rem',
                lineHeight: '1.7',
                fontWeight: '400',
                letterSpacing: '0',
            },
            base: {
                fontSize: '1rem',
                lineHeight: '1.6',
                fontWeight: '400',
                letterSpacing: '0',
            },
            small: {
                fontSize: '0.875rem',
                lineHeight: '1.5',
                fontWeight: '400',
                letterSpacing: '0',
            },
        },

        // Label Styles - Clareza e precisão
        label: {
            large: {
                fontSize: '0.875rem',
                lineHeight: '1.4',
                fontWeight: '500',
                letterSpacing: '0.025em',
            },
            base: {
                fontSize: '0.75rem',
                lineHeight: '1.4',
                fontWeight: '500',
                letterSpacing: '0.025em',
            },
            small: {
                fontSize: '0.625rem',
                lineHeight: '1.4',
                fontWeight: '500',
                letterSpacing: '0.025em',
            },
        },

        // Caption Styles - Informação secundária
        caption: {
            large: {
                fontSize: '0.75rem',
                lineHeight: '1.4',
                fontWeight: '400',
                letterSpacing: '0',
            },
            base: {
                fontSize: '0.625rem',
                lineHeight: '1.4',
                fontWeight: '400',
                letterSpacing: '0',
            },
            small: {
                fontSize: '0.5rem',
                lineHeight: '1.4',
                fontWeight: '400',
                letterSpacing: '0',
            },
        },

        // Button Styles - Ação e interação
        button: {
            large: {
                fontSize: '1.125rem',
                lineHeight: '1.2',
                fontWeight: '600',
                letterSpacing: '0.025em',
            },
            base: {
                fontSize: '1rem',
                lineHeight: '1.2',
                fontWeight: '600',
                letterSpacing: '0.025em',
            },
            small: {
                fontSize: '0.875rem',
                lineHeight: '1.2',
                fontWeight: '600',
                letterSpacing: '0.025em',
            },
        },

        // Quote Styles - Inspiração e sabedoria
        quote: {
            large: {
                fontSize: '1.5rem',
                lineHeight: '1.6',
                fontWeight: '300',
                letterSpacing: '0',
                fontStyle: 'italic',
            },
            base: {
                fontSize: '1.25rem',
                lineHeight: '1.6',
                fontWeight: '300',
                letterSpacing: '0',
                fontStyle: 'italic',
            },
            small: {
                fontSize: '1.125rem',
                lineHeight: '1.6',
                fontWeight: '300',
                letterSpacing: '0',
                fontStyle: 'italic',
            },
        },
    },

    // Responsive Typography - Adaptação por dispositivo
    responsive: {
        // Mobile (320px - 768px)
        mobile: {
            display: {
                '2xl': { fontSize: '2.5rem', lineHeight: '1.1' },
                xl: { fontSize: '2rem', lineHeight: '1.2' },
                lg: { fontSize: '1.75rem', lineHeight: '1.3' },
                md: { fontSize: '1.5rem', lineHeight: '1.4' },
                sm: { fontSize: '1.25rem', lineHeight: '1.4' },
            },
            heading: {
                h1: { fontSize: '1.75rem', lineHeight: '1.3' },
                h2: { fontSize: '1.5rem', lineHeight: '1.4' },
                h3: { fontSize: '1.25rem', lineHeight: '1.4' },
                h4: { fontSize: '1.125rem', lineHeight: '1.5' },
                h5: { fontSize: '1rem', lineHeight: '1.5' },
                h6: { fontSize: '0.875rem', lineHeight: '1.5' },
            },
            body: {
                large: { fontSize: '1rem', lineHeight: '1.6' },
                base: { fontSize: '0.875rem', lineHeight: '1.5' },
                small: { fontSize: '0.75rem', lineHeight: '1.4' },
            },
        },

        // Tablet (768px - 1024px)
        tablet: {
            display: {
                '2xl': { fontSize: '3.5rem', lineHeight: '1.1' },
                xl: { fontSize: '2.75rem', lineHeight: '1.2' },
                lg: { fontSize: '2.25rem', lineHeight: '1.3' },
                md: { fontSize: '1.875rem', lineHeight: '1.4' },
                sm: { fontSize: '1.5rem', lineHeight: '1.4' },
            },
            heading: {
                h1: { fontSize: '2rem', lineHeight: '1.3' },
                h2: { fontSize: '1.75rem', lineHeight: '1.4' },
                h3: { fontSize: '1.5rem', lineHeight: '1.4' },
                h4: { fontSize: '1.25rem', lineHeight: '1.5' },
                h5: { fontSize: '1.125rem', lineHeight: '1.5' },
                h6: { fontSize: '1rem', lineHeight: '1.5' },
            },
            body: {
                large: { fontSize: '1.125rem', lineHeight: '1.6' },
                base: { fontSize: '1rem', lineHeight: '1.5' },
                small: { fontSize: '0.875rem', lineHeight: '1.4' },
            },
        },

        // Desktop (1024px+)
        desktop: {
            display: {
                '2xl': { fontSize: '4.5rem', lineHeight: '1' },
                xl: { fontSize: '3.75rem', lineHeight: '1' },
                lg: { fontSize: '3rem', lineHeight: '1.1' },
                md: { fontSize: '2.25rem', lineHeight: '1.2' },
                sm: { fontSize: '1.875rem', lineHeight: '1.3' },
            },
            heading: {
                h1: { fontSize: '2.25rem', lineHeight: '1.2' },
                h2: { fontSize: '1.875rem', lineHeight: '1.3' },
                h3: { fontSize: '1.5rem', lineHeight: '1.4' },
                h4: { fontSize: '1.25rem', lineHeight: '1.4' },
                h5: { fontSize: '1.125rem', lineHeight: '1.5' },
                h6: { fontSize: '1rem', lineHeight: '1.5' },
            },
            body: {
                large: { fontSize: '1.125rem', lineHeight: '1.7' },
                base: { fontSize: '1rem', lineHeight: '1.6' },
                small: { fontSize: '0.875rem', lineHeight: '1.5' },
            },
        },
    },
} as const;

// Typography Utilities
export const typographyUtils = {
    // Font Family Classes
    fontFamily: {
        primary: 'font-sans',
        secondary: 'font-serif',
        accent: 'font-mono',
        display: 'font-display',
    },

    // Font Size Classes
    fontSize: {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl',
        '7xl': 'text-7xl',
        '8xl': 'text-8xl',
        '9xl': 'text-9xl',
    },

    // Font Weight Classes
    fontWeight: {
        thin: 'font-thin',
        extralight: 'font-extralight',
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold',
        black: 'font-black',
    },

    // Line Height Classes
    lineHeight: {
        none: 'leading-none',
        tight: 'leading-tight',
        snug: 'leading-snug',
        normal: 'leading-normal',
        relaxed: 'leading-relaxed',
        loose: 'leading-loose',
    },

    // Letter Spacing Classes
    letterSpacing: {
        tighter: 'tracking-tighter',
        tight: 'tracking-tight',
        normal: 'tracking-normal',
        wide: 'tracking-wide',
        wider: 'tracking-wider',
        widest: 'tracking-widest',
    },
} as const;

export type TypographyKey = keyof typeof typography;
export type TextStyleKey = keyof typeof typography.textStyles;
export type ResponsiveBreakpoint = 'mobile' | 'tablet' | 'desktop';
