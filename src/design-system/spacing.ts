/**
 * ClubNath Design System - Spacing
 * Foco: Respiração, Harmonia e Hierarquia Visual
 * Inspiração: Acolhimento, Espaço para Crescimento e Equilíbrio
 */

export const spacing = {
    // Base Spacing Scale - Proporção áurea (1.618)
    // Base: 4px (0.25rem)
    // Multiplicador: 1.618 (proporção áurea)

    // Micro Spacing - Detalhes e precisão
    micro: {
        0: '0',
        1: '0.125rem',   // 2px
        2: '0.25rem',    // 4px
        3: '0.375rem',   // 6px
        4: '0.5rem',     // 8px
    },

    // Base Spacing - Elementos e componentes
    base: {
        0: '0',
        1: '0.25rem',    // 4px
        2: '0.5rem',     // 8px
        3: '0.75rem',    // 12px
        4: '1rem',       // 16px
        5: '1.25rem',    // 20px
        6: '1.5rem',     // 24px
        7: '1.75rem',    // 28px
        8: '2rem',       // 32px
        9: '2.25rem',    // 36px
        10: '2.5rem',    // 40px
        11: '2.75rem',   // 44px
        12: '3rem',      // 48px
        14: '3.5rem',    // 56px
        16: '4rem',      // 64px
        18: '4.5rem',    // 72px
        20: '5rem',      // 80px
        24: '6rem',      // 96px
        28: '7rem',      // 112px
        32: '8rem',      // 128px
        36: '9rem',      // 144px
        40: '10rem',     // 160px
        44: '11rem',     // 176px
        48: '12rem',     // 192px
        52: '13rem',     // 208px
        56: '14rem',     // 224px
        60: '15rem',     // 240px
        64: '16rem',     // 256px
        72: '18rem',     // 288px
        80: '20rem',     // 320px
        96: '24rem',     // 384px
    },

    // Semantic Spacing - Significado e contexto
    semantic: {
        // Component Spacing
        component: {
            xs: '0.5rem',    // 8px - Elementos muito próximos
            sm: '0.75rem',   // 12px - Elementos relacionados
            md: '1rem',      // 16px - Elementos padrão
            lg: '1.5rem',    // 24px - Elementos com respiração
            xl: '2rem',      // 32px - Elementos com destaque
            '2xl': '3rem',   // 48px - Elementos com muito espaço
        },

        // Layout Spacing
        layout: {
            xs: '1rem',      // 16px - Seções próximas
            sm: '1.5rem',    // 24px - Seções padrão
            md: '2rem',      // 32px - Seções com respiração
            lg: '3rem',      // 48px - Seções com destaque
            xl: '4rem',      // 64px - Seções principais
            '2xl': '6rem',   // 96px - Seções hero
            '3xl': '8rem',   // 128px - Seções massivas
        },

        // Content Spacing
        content: {
            xs: '0.5rem',    // 8px - Linhas próximas
            sm: '0.75rem',   // 12px - Linhas padrão
            md: '1rem',      // 16px - Linhas confortáveis
            lg: '1.5rem',    // 24px - Linhas com respiração
            xl: '2rem',      // 32px - Linhas com destaque
        },

        // Interactive Spacing
        interactive: {
            xs: '0.25rem',   // 4px - Elementos touch próximos
            sm: '0.5rem',    // 8px - Elementos touch padrão
            md: '0.75rem',   // 12px - Elementos touch confortáveis
            lg: '1rem',      // 16px - Elementos touch com destaque
            xl: '1.5rem',    // 24px - Elementos touch principais
        },
    },

    // Responsive Spacing - Adaptação por dispositivo
    responsive: {
        // Mobile (320px - 768px)
        mobile: {
            component: {
                xs: '0.5rem',    // 8px
                sm: '0.75rem',   // 12px
                md: '1rem',      // 16px
                lg: '1.25rem',   // 20px
                xl: '1.5rem',    // 24px
                '2xl': '2rem',   // 32px
            },
            layout: {
                xs: '1rem',      // 16px
                sm: '1.5rem',    // 24px
                md: '2rem',      // 32px
                lg: '2.5rem',    // 40px
                xl: '3rem',      // 48px
                '2xl': '4rem',   // 64px
                '3xl': '5rem',   // 80px
            },
            content: {
                xs: '0.5rem',    // 8px
                sm: '0.75rem',   // 12px
                md: '1rem',      // 16px
                lg: '1.25rem',   // 20px
                xl: '1.5rem',    // 24px
            },
        },

        // Tablet (768px - 1024px)
        tablet: {
            component: {
                xs: '0.75rem',   // 12px
                sm: '1rem',      // 16px
                md: '1.25rem',   // 20px
                lg: '1.5rem',    // 24px
                xl: '2rem',      // 32px
                '2xl': '2.5rem', // 40px
            },
            layout: {
                xs: '1.5rem',    // 24px
                sm: '2rem',      // 32px
                md: '2.5rem',    // 40px
                lg: '3rem',      // 48px
                xl: '4rem',      // 64px
                '2xl': '5rem',   // 80px
                '3xl': '6rem',   // 96px
            },
            content: {
                xs: '0.75rem',   // 12px
                sm: '1rem',      // 16px
                md: '1.25rem',   // 20px
                lg: '1.5rem',    // 24px
                xl: '2rem',      // 32px
            },
        },

        // Desktop (1024px+)
        desktop: {
            component: {
                xs: '0.5rem',    // 8px
                sm: '0.75rem',   // 12px
                md: '1rem',      // 16px
                lg: '1.5rem',    // 24px
                xl: '2rem',      // 32px
                '2xl': '3rem',   // 48px
            },
            layout: {
                xs: '1rem',      // 16px
                sm: '1.5rem',    // 24px
                md: '2rem',      // 32px
                lg: '3rem',      // 48px
                xl: '4rem',      // 64px
                '2xl': '6rem',   // 96px
                '3xl': '8rem',   // 128px
            },
            content: {
                xs: '0.5rem',    // 8px
                sm: '0.75rem',   // 12px
                md: '1rem',      // 16px
                lg: '1.5rem',    // 24px
                xl: '2rem',      // 32px
            },
        },
    },

    // Container Spacing - Limites e contenção
    container: {
        // Padding interno
        padding: {
            xs: '1rem',      // 16px
            sm: '1.5rem',    // 24px
            md: '2rem',      // 32px
            lg: '2.5rem',    // 40px
            xl: '3rem',      // 48px
            '2xl': '4rem',   // 64px
        },

        // Margin externo
        margin: {
            xs: '0.5rem',    // 8px
            sm: '1rem',      // 16px
            md: '1.5rem',    // 24px
            lg: '2rem',      // 32px
            xl: '2.5rem',    // 40px
            '2xl': '3rem',   // 48px
        },

        // Max Width
        maxWidth: {
            xs: '20rem',     // 320px
            sm: '24rem',     // 384px
            md: '28rem',     // 448px
            lg: '32rem',     // 512px
            xl: '36rem',     // 576px
            '2xl': '42rem',  // 672px
            '3xl': '48rem',  // 768px
            '4xl': '56rem',  // 896px
            '5xl': '64rem',  // 1024px
            '6xl': '72rem',  // 1152px
            '7xl': '80rem',  // 1280px
            full: '100%',
            screen: '100vw',
        },
    },

    // Grid Spacing - Sistemas de layout
    grid: {
        // Gap entre elementos
        gap: {
            xs: '0.5rem',    // 8px
            sm: '0.75rem',   // 12px
            md: '1rem',      // 16px
            lg: '1.5rem',    // 24px
            xl: '2rem',      // 32px
            '2xl': '3rem',   // 48px
        },

        // Column Gap
        columnGap: {
            xs: '0.5rem',    // 8px
            sm: '0.75rem',   // 12px
            md: '1rem',      // 16px
            lg: '1.5rem',    // 24px
            xl: '2rem',      // 32px
            '2xl': '3rem',   // 48px
        },

        // Row Gap
        rowGap: {
            xs: '0.5rem',    // 8px
            sm: '0.75rem',   // 12px
            md: '1rem',      // 16px
            lg: '1.5rem',    // 24px
            xl: '2rem',      // 32px
            '2xl': '3rem',   // 48px
        },
    },

    // Stack Spacing - Elementos empilhados
    stack: {
        xs: '0.5rem',      // 8px
        sm: '0.75rem',     // 12px
        md: '1rem',        // 16px
        lg: '1.5rem',      // 24px
        xl: '2rem',        // 32px
        '2xl': '3rem',     // 48px
        '3xl': '4rem',     // 64px
    },

    // Inline Spacing - Elementos em linha
    inline: {
        xs: '0.25rem',     // 4px
        sm: '0.5rem',      // 8px
        md: '0.75rem',     // 12px
        lg: '1rem',        // 16px
        xl: '1.5rem',      // 24px
        '2xl': '2rem',     // 32px
    },
} as const;

// Spacing Utilities
export const spacingUtils = {
    // Margin Classes
    margin: {
        // All sides
        all: {
            0: 'm-0',
            1: 'm-1',
            2: 'm-2',
            3: 'm-3',
            4: 'm-4',
            5: 'm-5',
            6: 'm-6',
            8: 'm-8',
            10: 'm-10',
            12: 'm-12',
            16: 'm-16',
            20: 'm-20',
            24: 'm-24',
            32: 'm-32',
            40: 'm-40',
            48: 'm-48',
            56: 'm-56',
            64: 'm-64',
        },
        // Horizontal
        x: {
            0: 'mx-0',
            1: 'mx-1',
            2: 'mx-2',
            3: 'mx-3',
            4: 'mx-4',
            5: 'mx-5',
            6: 'mx-6',
            8: 'mx-8',
            10: 'mx-10',
            12: 'mx-12',
            16: 'mx-16',
            20: 'mx-20',
            24: 'mx-24',
            32: 'mx-32',
            40: 'mx-40',
            48: 'mx-48',
            56: 'mx-56',
            64: 'mx-64',
        },
        // Vertical
        y: {
            0: 'my-0',
            1: 'my-1',
            2: 'my-2',
            3: 'my-3',
            4: 'my-4',
            5: 'my-5',
            6: 'my-6',
            8: 'my-8',
            10: 'my-10',
            12: 'my-12',
            16: 'my-16',
            20: 'my-20',
            24: 'my-24',
            32: 'my-32',
            40: 'my-40',
            48: 'my-48',
            56: 'my-56',
            64: 'my-64',
        },
    },

    // Padding Classes
    padding: {
        // All sides
        all: {
            0: 'p-0',
            1: 'p-1',
            2: 'p-2',
            3: 'p-3',
            4: 'p-4',
            5: 'p-5',
            6: 'p-6',
            8: 'p-8',
            10: 'p-10',
            12: 'p-12',
            16: 'p-16',
            20: 'p-20',
            24: 'p-24',
            32: 'p-32',
            40: 'p-40',
            48: 'p-48',
            56: 'p-56',
            64: 'p-64',
        },
        // Horizontal
        x: {
            0: 'px-0',
            1: 'px-1',
            2: 'px-2',
            3: 'px-3',
            4: 'px-4',
            5: 'px-5',
            6: 'px-6',
            8: 'px-8',
            10: 'px-10',
            12: 'px-12',
            16: 'px-16',
            20: 'px-20',
            24: 'px-24',
            32: 'px-32',
            40: 'px-40',
            48: 'px-48',
            56: 'px-56',
            64: 'px-64',
        },
        // Vertical
        y: {
            0: 'py-0',
            1: 'py-1',
            2: 'py-2',
            3: 'py-3',
            4: 'py-4',
            5: 'py-5',
            6: 'py-6',
            8: 'py-8',
            10: 'py-10',
            12: 'py-12',
            16: 'py-16',
            20: 'py-20',
            24: 'py-24',
            32: 'py-32',
            40: 'py-40',
            48: 'py-48',
            56: 'py-56',
            64: 'py-64',
        },
    },

    // Gap Classes
    gap: {
        0: 'gap-0',
        1: 'gap-1',
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4',
        5: 'gap-5',
        6: 'gap-6',
        8: 'gap-8',
        10: 'gap-10',
        12: 'gap-12',
        16: 'gap-16',
        20: 'gap-20',
        24: 'gap-24',
        32: 'gap-32',
        40: 'gap-40',
        48: 'gap-48',
        56: 'gap-56',
        64: 'gap-64',
    },
} as const;

export type SpacingKey = keyof typeof spacing;
export type SpacingValue = keyof typeof spacing.base;
export type ResponsiveBreakpoint = 'mobile' | 'tablet' | 'desktop';
