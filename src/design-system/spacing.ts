// Nossa Maternidade Design System - Espaçamento
export const spacing = {
    // Espaçamento base (4px)
    px: '1px',
    0: '0',
    0.5: '0.125rem', // 2px
    1: '0.25rem',    // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem',     // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem',    // 12px
    3.5: '0.875rem', // 14px
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
};

// Espaçamento para componentes específicos
export const componentSpacing = {
    // Header
    header: {
        height: '4rem', // 64px
        padding: '1rem', // 16px
        gap: '0.75rem', // 12px
    },

    // Cards
    card: {
        padding: '1.5rem', // 24px
        gap: '1rem', // 16px
        margin: '0.5rem', // 8px
    },

    // Botões
    button: {
        padding: '0.75rem 1.5rem', // 12px 24px
        gap: '0.5rem', // 8px
        minHeight: '2.75rem', // 44px
    },

    // Touch targets (acessibilidade)
    touchTarget: {
        minHeight: '2.75rem', // 44px
        minWidth: '2.75rem', // 44px
        padding: '0.75rem', // 12px
    },

    // Mobile touch targets
    mobileTouchTarget: {
        minHeight: '3rem', // 48px
        minWidth: '3rem', // 48px
        padding: '1rem', // 16px
    },

    // Grid gaps
    grid: {
        sm: '0.5rem', // 8px
        md: '1rem', // 16px
        lg: '1.5rem', // 24px
        xl: '2rem', // 32px
    },

    // Section spacing
    section: {
        padding: '1.5rem', // 24px
        margin: '1rem 0', // 16px vertical
        gap: '1rem', // 16px
    },

    // Container spacing
    container: {
        padding: '1rem', // 16px
        maxWidth: '75rem', // 1200px
        margin: '0 auto',
    }
};

// Breakpoints responsivos
export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
};

// Z-index layers
export const zIndex = {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
};